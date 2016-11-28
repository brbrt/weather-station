sudo docker build -t weather-station-web .


sudo docker run -d  \
  --restart unless-stopped \
  --net=host \
  -p 3080:3080 \
  weather-station-web
