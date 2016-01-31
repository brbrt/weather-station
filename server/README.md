Build docker container:
sudo docker build -t weather-station .

Run it:
sudo docker run -v /storage/shared/temp/weatherdata/:/weatherdata -p 3636:3636 weather-station
