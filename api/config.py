import os
from mailchimp_marketing import Client
from forecasting import Forecast, load_data_from_file


def load_default_config():
    mailchimp_api_key = os.environ.get("MAILCHIMP_API_KEY")

    if mailchimp_api_key is None:
        raise ValueError("MAILCHIMP_API_KEY environment variable must be set")

    mailchimp_list_id = os.environ.get("MAILCHIMP_LIST_ID")

    if mailchimp_list_id is None:
        raise ValueError("MAILCHIMP_LIST_ID environment variable must be set")

    mailchimp_server_prefix = os.environ.get("MAILCHIMP_SERVER_PREFIX")

    if mailchimp_server_prefix is None:
        raise ValueError("MAILCHIMP_SERVER_PREFIX environment variable must be set")

    mailchimp = Client()
    mailchimp.set_config(
        {
            "api_key": mailchimp_api_key,
            "server": mailchimp_server_prefix,
        }
    )

    forecast = Forecast(load_data_from_file("./data/dispersion.nc"))

    class Config(object):
        FORECAST = forecast
        MAILCHIMP = mailchimp
        MAILCHIMP_LIST_ID = mailchimp_list_id

    return Config
