from cryptography.fernet import Fernet
import redis


class Store:
    def __init__(self, url, encryption_key):
        self.redis = redis.from_url(url)
        self.cipher = Fernet(encryption_key)

    def is_connected(self):
        try:
            self.redis.ping()
            return True
        except redis.ConnectionError:
            return False

    def _encrypt(self, data):
        return self.cipher.encrypt(data.encode())

    def _decrypt(self, encrypted_data):
        return self.cipher.decrypt(encrypted_data).decode()

    def set_value(self, key, value):
        encrypted_value = self._encrypt(value)
        self.redis.set(key, encrypted_value)

    def get_value(self, key):
        encrypted_value = self.redis.get(key)
        return self._decrypt(encrypted_value) if encrypted_value else None

    def hset(self, name, key, value):
        encrypted_value = self._encrypt(value)
        self.redis.hset(name, key, encrypted_value)

    def hget(self, name, key):
        encrypted_value = self.redis.hget(name, key)
        return self._decrypt(encrypted_value) if encrypted_value else None

    def create_user_record(self, email_address, lat, lon):
        # record user in redis
        self.redis.hset(email_address, "lat", lat)
        self.redis.hset(email_address, "lon", lon)
