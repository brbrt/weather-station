angular
    .module('weatherStation.latest', [
        'ui.router',

        'weatherStation.latest.latestSrv',
        'weatherStation.latest.reading'
    ])
    .config(latestConfig)
    .controller('latestCtrl', latestCtrl);

function latestConfig($stateProvider) {
    $stateProvider.state('latest', {
        url: '/latest',
        templateUrl: 'js/latest/latest.tpl.html',
        controller: 'latestCtrl',
        controllerAs: 'vm'
    });
}

function latestCtrl(latestSrv) {
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

		latestSrv.getData().then(
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
