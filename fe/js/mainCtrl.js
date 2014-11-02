angular.module('weatherStation', [
	'weatherStation.actualSrv',
	'weatherStation.reading'
])


.controller('mainCtrl',
	function mainCtrl($scope, actualSrv) {

		$scope.sensorData = [];
		$scope.measureDate = null;

		init();

		///////////////////

		function init() {
			actualSrv.getData().then(
				function success(resp) {
					var data = resp.data;
					$scope.sensorData = data;

					$scope.measureDate = data[0].date;
				},
				function error(err) {
					alert('Hiba történt az adatok lekérdezése közben.');
				}
			);
		}
	}
);
