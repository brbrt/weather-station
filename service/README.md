# Docker
Build docker container:
sudo docker build -t weather-station-service .

Set the required environment variables

Run it:
sudo docker run \
-d --restart unless-stopped \
-v /storage/shared/weatherdata/:/weatherdata \
-p 3636:3636 \
-e MAIL_SENDER_USER=$WEATHER_STATION_MAIL_SENDER_USER \
-e MAIL_SENDER_PASS=$WEATHER_STATION_MAIL_SENDER_PASS \
-e MAIL_RECIPIENT=$WEATHER_STATION_MAIL_RECIPIENT \
weather-station-service

# Testing
Send a test measurement
curl -X POST 'http://localhost:3636/api/weather?sensor=test&temp=362.7&inputVoltage=3914'