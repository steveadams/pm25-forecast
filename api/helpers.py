from datetime import datetime, timedelta
import json
from shapely.geometry import shape, Polygon, MultiPolygon


def convert_to_iso(date, time):
    # Convert date from YYYYDDD to ISO format
    year = int(date / 1000)
    day_of_year = date % 1000
    date_iso = datetime(year, 1, 1) + timedelta(day_of_year - 1)

    # Convert time from HHMMSS to seconds past midnight
    hours = int(time / 10000)
    minutes = int(time / 100) % 100
    seconds = time % 100
    time_delta = timedelta(hours=hours, minutes=minutes, seconds=seconds)

    # Combine date and time and format as ISO
    datetime_iso = (date_iso + time_delta).isoformat()

    return datetime_iso


def correct_geojson(input_geojson):
    data = json.loads(input_geojson)

    def correct_polygon(polygon):
        exterior = list(polygon.exterior.coords)
        interiors = [
            list(interior.coords) if interior.is_ccw else list(interior.coords)[::-1]
            for interior in polygon.interiors
        ]

        return Polygon(exterior, interiors)

    for feature in data["features"]:
        geometry = shape(feature["geometry"])
        if isinstance(geometry, Polygon):
            feature["geometry"] = correct_polygon(geometry).__geo_interface__
        elif isinstance(geometry, MultiPolygon):
            corrected_polygons = [
                correct_polygon(polygon) for polygon in geometry.geoms
            ]
            feature["geometry"] = MultiPolygon(corrected_polygons).__geo_interface__
        else:
            continue

    return json.dumps(data)
