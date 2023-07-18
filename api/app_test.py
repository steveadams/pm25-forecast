import unittest

from app import create_app
from forecasting import Forecast
from helpers import load_test_data


class TestConfig(object):
    FORECAST_INSTANCE = Forecast(load_test_data())
    MAILCHIMP_API_KEY = "anything"


class TestServer(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = create_app(TestConfig).test_client()
        cls.forecast = cls.app.application.config["forecast"]

    @classmethod
    def tearDownClass(cls):
        cls.forecast.close_data()

    def test_health_check(self):
        response = self.app.get("/health")
        self.assertEqual(response.status_code, 200)
        json_data = response.get_json()
        self.assertIsNotNone(json_data, "No data returned!")
        self.assertIn("status", json_data)

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


if __name__ == "__main__":
    unittest.main()
