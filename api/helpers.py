from datetime import datetime, timedelta
import numpy as np
from netCDF4 import Dataset  # type: ignore


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
