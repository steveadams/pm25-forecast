from dotenv import load_dotenv
from flask import current_app, Flask, jsonify, request
from flask_cors import CORS
from mailchimp_marketing.api_client import ApiClientError

from config import load_default_config


def create_app(config_object=None):
    app = Flask(__name__)
    if config_object is not None:
        app.config.from_object(config_object)
    else:
        app.config.from_object(load_default_config())

    CORS(app, origins=app.config["CLIENT_URL"])

    @app.route("/", methods=["GET"])
    def index():
        return "hello world", 200

    @app.route("/health", methods=["GET"])
    def healthcheck():
        ping_response = current_app.config["MAILCHIMP"].ping.get()

        return (
            jsonify(
                {
                    "forecaster": "alive",
                    "last_updated": current_app.config["FORECAST"].last_updated(),
                    "report_period_start": current_app.config[
                        "FORECAST"
                    ].report_period_start(),
                    "mailchimp": ping_response.get("health_status"),
                }
            ),
            200,
        )

    @app.route("/bounds", methods=["GET"])
    def get_bounds():
        bounds = current_app.config["FORECAST"].get_bounds()

        if bounds is None:
            return jsonify({"error": "Failed to get bounds"}), 500

        return jsonify({"bounds": bounds})

    @app.route("/forecast/<path:lat>/<path:lon>")
    def get_forecast(lat, lon):
        lat = float(lat)
        lon = float(lon)
        timeseries, max, min, aqi = current_app.config["FORECAST"].get_forecast(
            lat, lon
        )

        if timeseries is None or max is None or min is None:
            return jsonify({"error": "Failed to get forecast"}), 404

        return jsonify({"max": max, "min": min, "timeseries": timeseries, "aqi": aqi})

    @app.route("/fire_perimeters", methods=["GET"])
    def get_fire_perimeters():
        perimeters = current_app.config["FORECAST"].get_fire_perimeters()

        if perimeters is None:
            return jsonify({"error": "Failed to get forecast"}), 404

        return jsonify(perimeters)

    @app.route("/subscribe", methods=["POST"])
    def subscribe():
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

        response = current_app.config["MAILCHIMP"].lists.add_list_member(
            current_app.config["MAILCHIMP_LIST_ID"],
            {
                "email_address": email_address,
                "status": "pending",
                "merge_fields": {"LATITUDE": lat, "LONGITUDE": lon},
            },
        )

        # TODO: Check if already subscribed, handle errors

        return jsonify(response)

    @app.route("/subscribers", methods=["GET"])
    def subscribers():
        try:
            response = current_app.config["MAILCHIMP"].lists.get_list_members_info(
                current_app.config["MAILCHIMP_LIST_ID"]
            )

            return jsonify(response)
        except ApiClientError as error:
            return jsonify(error)

    return app


# Create main entry
if __name__ == "__main__":
    app = create_app(load_default_config())
    app.run(debug=True)
