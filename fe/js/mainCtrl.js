angular.module('weatherStation', [
	'weatherStation.weatherSrv'
])


.controller('mainCtrl', 
	function mainCtrl($scope, weatherSrv) {
		$scope.out = null;
		$scope.lg = null;
		$scope.sm = null;		
		
		init();
		
		///////////////////
		
		function init() {
			weatherSrv.getMeterData('out').then(
				function success(resp) {
					$scope.out = resp.data.temp;
				},				
				function error(err) {
					// TODO
				}				
			);
			
			weatherSrv.getMeterData('lg').then(
				function success(resp) {
					$scope.lg = resp.data.temp;
				},				
				function error(err) {
					// TODO
				}				
			);
			
			weatherSrv.getMeterData('sm').then(
				function success(resp) {
					$scope.sm = resp.data.temp;
				},				
				function error(sm) {
					// TODO
				}				
			);
		}
	}
);