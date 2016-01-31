Build docker container:
sudo docker build -t weather-station .

Run it:
sudo docker run -v /storage/shared/temp/weatherdata/:/weatherdata -p 3636:3636 weather-station

In background, with automatic restart
sudo docker run -d --restart unless-stopped -v /storage/shared/temp/weatherdata/:/weatherdata -p 3636:3636 weather-station
