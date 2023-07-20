import os
from mailchimp_marketing import Client
import numpy as np
from netCDF4 import Dataset  # type: ignore
from unittest import mock
from forecasting import Forecast, load_dispersion_data, load_fire_perimeter_data


def get_safe_env_var(var_name):
    var = os.environ.get(var_name)
    if var is None:
        raise ValueError(f"{var_name} environment variable must be set")

    return var


def load_default_config():
    client_url = get_safe_env_var("CLIENT_URL")
    mailchimp_api_key = get_safe_env_var("MAILCHIMP_API_KEY")
    mailchimp_list_id = get_safe_env_var("MAILCHIMP_LIST_ID")
    mailchimp_server_prefix = get_safe_env_var("MAILCHIMP_SERVER_PREFIX")

    mailchimp = Client()
    mailchimp.set_config(
        {
            "api_key": mailchimp_api_key,
            "server": mailchimp_server_prefix,
        }
    )

    forecast = Forecast(load_dispersion_data(), load_fire_perimeter_data())

    class Config(object):
        CLIENT_URL = client_url
        FORECAST = forecast
        MAILCHIMP = mailchimp
        MAILCHIMP_LIST_ID = mailchimp_list_id

    return Config


def load_test_forecast():
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
        tflag = data.createVariable("TFLAG", "i4", ("TSTEP", "VAR", "DATE-TIME"))
        data.createVariable("PM25", "f4", ("TSTEP", "LAY", "ROW", "COL"))

        # Fill variables
        for i in range(51):
            # Set the date to 2023200 + i
            tflag[i, 0, 0] = 2023200 + i

            # Set the time to 10000 * i, zero-padded to 6 digits
            tflag[i, 0, 1] = int(str(i * 10000).zfill(6))

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
        data.GDNAM = "HYSPLIT CONC"
        data.UPNAM = "hysplit2netCDF"
        data.VAR_LIST = "PM25"
        data.FILEDESC = "Hysplit Concentration Model Output"
        data.HISTORY = ""

        return data

    return loader


def load_test_fire_perimeters():
    def loader():
        return "{}"  # empty GeoJSON

    return loader


def load_test_config():
    client_url = "http://localhost:1337"
    mailchimp_list_id = "anything"
    mailchimp = mock.MagicMock()
    ping = mock.MagicMock()
    ping.get.return_value = {"health_status": "everything's chimpy"}
    mailchimp.ping = ping

    forecast = Forecast(load_test_forecast(), load_test_fire_perimeters())

    class Config(object):
        CLIENT_URL = client_url
        FORECAST = forecast
        MAILCHIMP = mailchimp
        MAILCHIMP_LIST_ID = mailchimp_list_id

    return Config
