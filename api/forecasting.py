from datetime import datetime, timedelta
import geopandas
import json
import io
import numpy
import os
import requests
from shapely.geometry import Polygon
from netCDF4 import Dataset  # type: ignore
import zipfile

from helpers import convert_to_iso

fire_perimeters_url = "https://cwfis.cfs.nrcan.gc.ca/downloads/hotspots/perimeters"
fire_perimeters_files_directory = "./data/perimeters/"
fire_perimeters_file_name = "fire_perimeters"

dispersion_file_url = "https://firesmoke.ca/forecasts/current/dispersion.nc"
dispersion_file_path = "./data/dispersion/dispersion.nc"

"""Load dispersion forecast data from the firesmoke.ca website"""


def update_forecast_data():
    print("updating forecast data...")

    if os.path.isfile(dispersion_file_path):
        print("forecast data already exists.")
        return

    response = requests.get(dispersion_file_url)
    response.raise_for_status()

    os.makedirs(os.path.dirname(dispersion_file_path), exist_ok=True)

    with open(dispersion_file_path, "wb") as f:
        f.write(response.content)

    print("updated forecast data.")


def load_dispersion_data():
    def loader():
        update_forecast_data()
        data = Dataset(dispersion_file_path)
        return data

    return loader


"""Load fire perimeter data from the BC government website"""


def update_fire_perimeter_data():
    print("updating fire perimeter data...")

    file_extensions = ["shp", "shx", "dbf", "prj"]

    if os.path.isfile(
        fire_perimeters_files_directory + fire_perimeters_file_name + ".geojson"
    ):
        print("fire perimeter data already exists.")
        return

    os.makedirs(os.path.dirname(fire_perimeters_files_directory), exist_ok=True)

    for extension in file_extensions:
        url = fire_perimeters_url + "." + extension
        file_path = os.path.join(
            fire_perimeters_files_directory, fire_perimeters_file_name + "." + extension
        )

        response = requests.get(url)
        response.raise_for_status()

        with open(file_path, "wb") as f:
            f.write(response.content)

    perimeters_shp = geopandas.read_file(
        os.path.join(
            fire_perimeters_files_directory, fire_perimeters_file_name + ".shp"
        )
    )

    perimeters_shp = perimeters_shp.to_crs("EPSG:4326")

    geojson = perimeters_shp.to_json()

    with open(
        os.path.join(
            fire_perimeters_files_directory, fire_perimeters_file_name + ".geojson"
        ),
        "w",
    ) as f:
        f.write(geojson)

    print("updated fire perimeter data.")


def load_fire_perimeter_data():
    def loader():
        update_fire_perimeter_data()

        with open(
            fire_perimeters_files_directory + fire_perimeters_file_name + ".geojson",
            "r",
        ) as data:
            return json.loads(data.read())

    return loader


class Forecast:
    def __init__(self, forecast_loader, fire_perimeters_loader):
        self.forecast = forecast_loader()
        self.fire_perimeters = fire_perimeters_loader()

        # Calculate longitude and latitude arrays from the provided information
        xorig = self.forecast.XORIG
        yorig = self.forecast.YORIG
        xcell = self.forecast.XCELL
        ycell = self.forecast.YCELL
        ncols = self.forecast.NCOLS
        nrows = self.forecast.NROWS

        # Calculate the end points
        xend = xorig + xcell * ncols
        yend = yorig + ycell * nrows

        # Create arrays
        self.lon = numpy.linspace(xorig, xend, ncols)
        self.lat = numpy.linspace(yorig, yend, nrows)

    def last_updated(self):
        return convert_to_iso(int(self.forecast.WDATE), int(self.forecast.WTIME))

    def report_period_start(self):
        return convert_to_iso(int(self.forecast.SDATE), int(self.forecast.STIME))

    def close_data(self):
        self.forecast.close()

    def get_bounds(self):
        xorig = self.forecast.XORIG
        yorig = self.forecast.YORIG
        xcell = self.forecast.XCELL
        ycell = self.forecast.YCELL
        ncols = self.forecast.NCOLS
        nrows = self.forecast.NROWS

        # Calculate the end points
        xend = xorig + xcell * ncols
        yend = yorig + ycell * nrows

        return [
            [int(xorig), int(yorig)],
            [int(xend), int(yend)],
        ]

    def get_fire_perimeters(self):
        return self.fire_perimeters

    @staticmethod
    def find_nearest(array, value):
        # Find the index of the nearest value in an array
        array = numpy.asarray(array)
        idx = (numpy.abs(array - value)).argmin()
        return idx

    def get_forecast(self, lat, lon):
        lat_idx = self.find_nearest(self.lat, lat)
        lon_idx = self.find_nearest(self.lon, lon)

        pm25 = self.forecast.variables["PM25"][:, 0, lat_idx, lon_idx]

        pm25_timeseries = self.forecast.variables["PM25"][:, 0, lat_idx, lon_idx]

        tflags = self.forecast.variables["TFLAG"][:, 0]

        # Convert the time flags to dates and times
        dates = tflags[:, 0]
        times = tflags[:, 1]

        # Convert the dates and times to strings in YYYY-MM-DD HH:MM:SS format
        date_strings = []
        for date in dates:
            year = int(str(date)[:4])
            day_of_year = int(str(date)[4:])
            start_of_year = datetime(year, 1, 1)
            date = start_of_year + timedelta(days=day_of_year - 1)
            date_strings.append(date.strftime("%Y-%m-%d"))

        time_strings = [
            str(time).zfill(6)[:2]
            + ":"
            + str(time).zfill(6)[2:4]
            + ":"
            + str(time).zfill(6)[4:]
            for time in times
        ]

        datetime_strings = [
            date + " " + time for date, time in zip(date_strings, time_strings)
        ]

        # Initialize the min, max, and their times
        min_pm25 = float("inf")
        max_pm25 = float("-inf")
        min_pm25_time = None
        max_pm25_time = None

        # Convert the PM2.5 data to a list of Python floats and find min, max and their times
        pm25_list = []
        for dt_str, value in zip(datetime_strings, pm25_timeseries):
            value = float(value)
            pm25_list.append(value)

            if value < min_pm25:
                min_pm25 = value
                min_pm25_time = dt_str
            if value > max_pm25:
                max_pm25 = value
                max_pm25_time = dt_str

        # Combine the datetime strings and PM2.5 levels into a list of tuples
        timeseries = list(zip(datetime_strings, pm25_list))

        # Calculate the worst projected AQI
        aqi = self.calculate_aqi(max_pm25)

        return {
            "data": timeseries,
            "meta": {
                "max_pm25": {"value": max_pm25, "datetime": max_pm25_time},
                "min_pm25": {"value": min_pm25, "datetime": min_pm25_time},
                "aqi": aqi,
                "latitude": lat,
                "longitude": lon,
            },
        }

    @staticmethod
    def calculate_aqi(pm25):
        if pm25 <= 12:
            aqi = (50 / 12) * pm25
        elif pm25 <= 35.4:
            aqi = ((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1) + 51
        elif pm25 <= 55.4:
            aqi = ((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5) + 101
        elif pm25 <= 150.4:
            aqi = ((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5) + 151
        elif pm25 <= 250.4:
            aqi = ((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5) + 201
        elif pm25 <= 350.4:
            aqi = ((400 - 301) / (350.4 - 250.5)) * (pm25 - 250.5) + 301
        else:
            aqi = ((500 - 401) / (500.4 - 350.5)) * (pm25 - 350.5) + 401

        aqi = round(aqi)

        if aqi <= 50:
            category = "Good"
        elif aqi <= 100:
            category = "Moderate"
        elif aqi <= 150:
            category = "Unhealthy for Sensitive Groups"
        elif aqi <= 200:
            category = "Unhealthy"
        elif aqi <= 300:
            category = "Very Unhealthy"
        else:
            category = "Hazardous"

        return {"rating": aqi, "category": category}


# TODO: Forecast humidity, rain, and air pressure to gauge if AQI risks could be increased
