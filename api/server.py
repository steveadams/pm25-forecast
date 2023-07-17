import os
from flask import Flask, jsonify, request
from forecasting import Forecast, load_data_from_file
from store import Store


def create_app(forecast_instance, store_instance):
    app = Flask(__name__)

    forecast = forecast_instance
    store = store_instance

    @app.route("/bounds")
    def get_bounds():
        bounds = forecast.get_bounds()

        if bounds is None:
            return jsonify({"error": "Failed to get bounds"}), 500

        return jsonify({"bounds": bounds})

    @app.route("/forecast/<path:lat>/<path:lon>")
    def get_forecast(lat, lon):
        lat = float(lat)
        lon = float(lon)
        timeseries, max, min = forecast.get_forecast(lat, lon)

        if timeseries is None or max is None or min is None:
            return jsonify({"error": "Failed to get forecast"}), 500

        return jsonify({"max": max, "min": min, "timeseries": timeseries})

    @app.route("/record_user", methods=["POST"])
    def record_user():
        # validate request
        if not request.is_json:
            return jsonify({"error": "invalid request body: expected json"}), 400

        data = request.get_json()

        email_address = data.get("email_address")
        lat = data.get("lat")
        lon = data.get("lon")

        if not email_address or not lat or not lon:
            return (
                jsonify({"error": "must include email_address, lat, and lon"}),
                400,
            )

        try:
            store.create_user_record(email_address, lat, lon)
            return jsonify({"message": "User created"}), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return app


if __name__ == "__main__":
    encryption_key_string = os.environ.get("ENCRYPTION_KEY")
    key = encryption_key_string.encode() if encryption_key_string else None

    if not key:
        raise ValueError("ENCRYPTION_KEY environment variable must be set")

    store = Store(host="localhost", port=6379, db=0, encryption_key=key)
    forecast_instance = Forecast(load_data_from_file("./data/dispersion.nc"))

    app = create_app(forecast_instance, store)
    app.run()
