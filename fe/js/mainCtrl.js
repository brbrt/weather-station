angular.module('weatherStation', [
	'weatherStation.weatherSrv'
])


.controller('mainCtrl', 
	function mainCtrl($scope, weatherSrv) {
	
		$scope.sensorData = {};	
		
		init();
		
		///////////////////
		
		function init() {
			weatherSrv.getSensors().then(
				function success(resp) {
					var sensors = resp.data;
					
					for (var i = 0; i < sensors.length; i++) {
						getSensorData(sensors[i]);
					}
				},				
				function error(err) {
					// TODO
				}				
			);
		}
		
		function getSensorData(sensor) {
			weatherSrv.getSensorData(sensor).then(
				function success(resp) {
					$scope.sensorData[sensor] = resp.data;
				},				
				function error(err) {
					// TODO
				}				
			);
		}
	}
);