angular.module('weatherStation.weatherSrv', [

])

.factory('weatherSrv', 
	function weatherSrv($http) {
	
		var baseUrl = '/api/';
	
		var factory = {
			getMeterData: getMeterData
		};
		
		return factory;
		
		///////////////////
		
		function getMeterData(meterCode) {
			return $http.get(baseUrl + meterCode);
		}

	}
);