import os
import unittest
import numpy as np
from flask import json
from netCDF4 import Dataset  # type: ignore

from server import create_app
from forecasting import Forecast
from store import Store


class TestServer(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        store = Store(
            "localhost", 6379, 0, b"ek18EeK9CziCvBFRKtRO4sS6g-GcOYbXsLxzCMa1btk="
        )
        forecast_instance = Forecast(load_test_data())
        cls.app = create_app(forecast_instance, store).test_client()
        cls.forecast = forecast_instance

    @classmethod
    def tearDownClass(cls):
        cls.forecast.close_data()

    def test_get_bounds(self):
        response = self.app.get("/bounds")
        self.assertEqual(response.status_code, 200)
        json_data = response.get_json()
        self.assertIsNotNone(json_data, "No data returned!")
        self.assertIn("bounds", json_data)

    def test_get_forecast(self):
        response = self.app.get("/forecast/37.7749/-122.4194")
        self.assertEqual(response.status_code, 200)
        json_data = response.get_json()
        self.assertIsNotNone(json_data, "No data returned!")
        self.assertIn("max", json_data)
        self.assertIn("min", json_data)
        self.assertIn("timeseries", json_data)

    def test_record_user(self):
        response = self.app.post(
            "/record_user",
            data=json.dumps(dict(email_address="test@test.com", lat=45.0, lon=90.0)),
            content_type="application/json",
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(data["message"], "User created")


def load_test_data():
    def loader():
        data = Dataset("inmemory.nc", "w", format="NETCDF4", diskless=True)

        # Create dimensions
        data.createDimension("TSTEP", 51)
        data.createDimension("VAR", 1)
        data.createDimension("DATE-TIME", 2)
        data.createDimension("LAY", 1)
        data.createDimension("ROW", 381)
        data.createDimension("COL", 1081)

        # Create variables
        data.createVariable("TFLAG", "i4", ("TSTEP", "VAR", "DATE-TIME"))
        data.createVariable("PM25", "f4", ("TSTEP", "LAY", "ROW", "COL"))

        # Fill variables
        data.variables["TFLAG"][:] = np.ones((51, 1, 2), dtype=np.int32)
        data.variables["PM25"][:] = np.ones((51, 1, 381, 1081), dtype=np.float32)

        # Set global attributes
        data.FTYPE = 1
        data.CDATE = 2023194
        data.CTIME = 183524
        data.WDATE = 2023194
        data.WTIME = 183524
        data.SDATE = 2023194
        data.STIME = 150000
        data.TSTEP = 10000
        data.NTHIK = 1
        data.NCOLS = 1081
        data.NROWS = 381
        data.NLAYS = 1
        data.NVARS = 1
        data.GDTYP = 1
        data.P_ALP = 0.0
        data.P_BET = 0.0
        data.P_GAM = 0.0
        data.XCENT = -106.0
        data.YCENT = 51.0
        data.XORIG = -160.0
        data.YORIG = 32.0
        data.XCELL = 0.10000000149011612
        data.YCELL = 0.10000000149011612
        data.VGTYP = 5
        data.VGTOP = -9999.0
        data.VGLVLS = np.array([10.0, 0.0], dtype=np.float32)
        data.GDNAM = "HYSPLIT CONC    "
        data.UPNAM = "hysplit2netCDF  "
        data.VAR_LIST = "PM25            "
        data.FILEDESC = "Hysplit Concentration Model Output"
        data.HISTORY = ""

        return data

    return loader


if __name__ == "__main__":
    unittest.main()
