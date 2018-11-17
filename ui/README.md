sudo docker build -t weather-station-ui .


sudo docker run -d  \
  --restart unless-stopped \
  --net=host \
  weather-station-ui
