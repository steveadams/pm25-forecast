# Use the Python 3.9 slim-buster base image
FROM python:3.9-slim-buster

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements.txt file
COPY requirements.txt .

# Install build dependencies for cftime package
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the API source code
COPY . .

# Expose the API port
EXPOSE 8080

# Set the entrypoint command
CMD [ "python", "app.py" ]
