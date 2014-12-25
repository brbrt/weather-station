angular.module('weatherStation', [
	'weatherStation.actualSrv',
	'weatherStation.reading'
])


.controller('mainCtrl',
	function mainCtrl($scope, actualSrv) {

		$scope.sensorData = [];
		$scope.measureDate = null;
		$scope.isLoading = false;

		$scope.refresh = getData;

		init();

		///////////////////

		function init() {
			getData();
		}

		function getData() {
			$scope.isLoading = true;

			actualSrv.getData().then(
				function success(resp) {
					$scope.isLoading = false;

					var data = resp.data;
					$scope.sensorData = data;

					$scope.measureDate = data[0].date;
				},
				function error(err) {
					$scope.isLoading = false;
					alert('Hiba történt az adatok lekérdezése közben.');
				}
			);
		}
	}
);
