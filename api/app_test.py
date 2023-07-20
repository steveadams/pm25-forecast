import unittest

from app import create_app
from config import load_test_config


class TestServer(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = create_app(load_test_config()).test_client()

    @classmethod
    def tearDownClass(cls):
        cls.app.application.config["FORECAST"].close_data()

    def test_health_check(self):
        response = self.app.get("/health")
        self.assertEqual(response.status_code, 200)
        json_data = response.get_json()
        self.assertIsNotNone(json_data, "No data returned!")
        self.assertIn("forecaster", json_data)
        self.assertIn("mailchimp", json_data)

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
