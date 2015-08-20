angular.module('weatherStation', [
	'weatherStation.actualSrv',
	'weatherStation.reading'
])


.controller('mainCtrl',
	function mainCtrl(actualSrv) {
        var vm = this;

		vm.sensorData = [];
	    vm.measureDate = null;
		vm.isLoading = false;

		vm.refresh = getData;

		init();

		///////////////////

		function init() {
			getData();
		}

		function getData() {
			vm.isLoading = true;

			actualSrv.getData().then(
				function success(resp) {
					vm.isLoading = false;

					var data = resp.data;
					vm.sensorData = data;

					vm.measureDate = data[0].date;
				},
				function error(err) {
					vm.isLoading = false;
					alert('Hiba történt az adatok lekérdezése közben.');
				}
			);
		}
	}
);
