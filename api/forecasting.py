import numpy as np
from netCDF4 import Dataset  # type: ignore

from helpers import convert_to_iso


def load_data_from_file(file_path):
    def loader():
        # Load NetCDF file
        data = Dataset(file_path)
        return data

    return loader


class Forecast:
    def __init__(self, data_loader):
        self.data = data_loader()

        # Calculate longitude and latitude arrays from the provided information
        xorig = self.data.XORIG
        yorig = self.data.YORIG
        xcell = self.data.XCELL
        ycell = self.data.YCELL
        ncols = self.data.NCOLS
        nrows = self.data.NROWS

        # Calculate the end points
        xend = xorig + xcell * ncols
        yend = yorig + ycell * nrows

        # Create arrays
        self.lon = np.linspace(xorig, xend, ncols)
        self.lat = np.linspace(yorig, yend, nrows)

    def last_updated(self):
        return convert_to_iso(int(self.data.WDATE), int(self.data.WTIME))

    def report_period_start(self):
        return convert_to_iso(int(self.data.SDATE), int(self.data.STIME))

    def close_data(self):
        self.data.close()

    def get_bounds(self):
        xorig = self.data.XORIG
        yorig = self.data.YORIG
        xcell = self.data.XCELL
        ycell = self.data.YCELL
        ncols = self.data.NCOLS
        nrows = self.data.NROWS

        # Calculate the end points
        xend = xorig + xcell * ncols
        yend = yorig + ycell * nrows

        return [
            [int(xorig), int(yorig)],
            [int(xend), int(yend)],
        ]

    @staticmethod
    def find_nearest(array, value):
        """Find the index of the nearest value in an array."""
        array = np.asarray(array)
        idx = (np.abs(array - value)).argmin()
        return idx

    def get_forecast(self, lat, lon):
        """Get the maximum and minimum PM2.5 levels for the given coordinates."""
        # Find the nearest grid cell
        lat_idx = self.find_nearest(self.lat, lat)
        lon_idx = self.find_nearest(self.lon, lon)

        # Extract the PM2.5 data for this cell
        pm25 = self.data.variables["PM25"][
            :, 0, lat_idx, lon_idx
        ]  # Assuming that the 'LAY' dimension is size 1

        # Find the maximum and minimum levels
        max_pm25 = float(pm25.max())
        min_pm25 = float(pm25.min())

        # Extract the PM2.5 data for this cell across all time steps
        pm25_timeseries = self.data.variables["PM25"][
            :, 0, lat_idx, lon_idx
        ]  # Assuming that the 'LAY' dimension is size 1

        # Extract the time flags
        tflags = self.data.variables["TFLAG"][
            :, 0
        ]  # Assuming that the 'LAY' dimension is size 1

        # Convert the time flags to dates and times
        dates = tflags[:, 0]
        times = tflags[:, 1]

        # Convert the dates and times to strings in YYYY-MM-DD HH:MM:SS format
        date_strings = [
            str(date)[:4] + "-" + str(date)[4:6] + "-" + str(date)[6:] for date in dates
        ]
        time_strings = [
            str(time)[:2] + ":" + str(time)[2:4] + ":" + str(time)[4:] for time in times
        ]
        datetime_strings = [
            date + " " + time for date, time in zip(date_strings, time_strings)
        ]

        # Convert the PM2.5 data to a list of Python floats
        pm25_list = pm25_timeseries.tolist()

        # Combine the datetime strings and PM2.5 levels into a list of tuples
        timeseries = list(zip(datetime_strings, pm25_list))

        return timeseries, max_pm25, min_pm25


# TODO: Forecast humidity, rain, and air pressure to gauge if AQI risks could be increased
