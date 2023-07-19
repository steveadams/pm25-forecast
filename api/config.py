import os
from mailchimp_marketing import Client
from forecasting import Forecast, load_data_from_file


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
        CLIENT_URL = client_url
        FORECAST = forecast
        MAILCHIMP = mailchimp
        MAILCHIMP_LIST_ID = mailchimp_list_id

    return Config
