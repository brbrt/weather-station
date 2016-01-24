Build docker container:
sudo docker build -t weather-station .

Run it:
sudo docker run -p 3636:3636 weather-station
