angular.module('weatherStation.weatherSrv', [

])

.factory('weatherSrv', 
	function weatherSrv($http) {
	
		var url = '/api/sensors/';
	
		var factory = {
			getSensors: getSensors,
			getSensorData: getSensorData
		};
		
		return factory;
		
		///////////////////
		
		function getSensors() {
			return $http.get(url);
		}
		
		function getSensorData(meterCode) {
			return $http.get(url + meterCode);
		}

	}
);