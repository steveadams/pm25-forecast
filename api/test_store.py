import unittest
from store import Store
from unittest.mock import patch, MagicMock


class TestStore(unittest.TestCase):
    @patch("redis.Redis", return_value=MagicMock())
    def setUp(self, mock_redis):
        self.store = Store(
            "localhost", 6379, 0, b"ek18EeK9CziCvBFRKtRO4sS6g-GcOYbXsLxzCMa1btk="
        )
        self.mock_redis = mock_redis.return_value

    def test_is_connected(self):
        self.mock_redis.ping.return_value = True
        self.assertTrue(self.store.is_connected())

    def test_set_value(self):
        self.store.set_value("test_key", "test_value")
        self.mock_redis.set.assert_called_once_with(
            "test_key", self.store._encrypt("test_value")
        )

    def test_get_value(self):
        self.mock_redis.get.return_value = self.store._encrypt("test_value")
        value = self.store.get_value("test_key")
        self.mock_redis.get.assert_called_once_with("test_key")
        self.assertEqual(value, "test_value")

    def test_hset(self):
        self.store.hset("test_name", "test_key", "test_value")
        self.mock_redis.hset.assert_called_once_with(
            "test_name", "test_key", self.store._encrypt("test_value")
        )

    def test_create_user_record(self):
        self.store.create_user_record("test_email", "test_lat", "test_lon")
        self.mock_redis.hset.assert_any_call("test_email", "lat", "test_lat")
        self.mock_redis.hset.assert_any_call("test_email", "lon", "test_lon")
