angular
    .module('weatherStation.history', [
        'ui.router',

        'weatherStation.history.historySrv'
    ])
    .config(historyConfig)
    .controller('historyCtrl', historyCtrl);

function historyConfig($stateProvider) {
    $stateProvider.state('history', {
        url: '/history',
        templateUrl: 'js/history/history.tpl.html',
        controller: 'historyCtrl',
        controllerAs: 'vm'
    });
}

function historyCtrl($log,
                     historySrv) {
    var vm = this;

	vm.params = {
        from: new Date(),
        to: new Date()
    };
	vm.isLoading = false;

	vm.query = query;

	init();

	///////////////////

	function init() {
		query();
	}

	function query() {
		vm.isLoading = true;

		historySrv.getInterval(vm.params).then(
			function success(data) {
				vm.isLoading = false;
				vm.sensorData = data;

                $log.debug('History data:', data);
			},
			function error(err) {
				vm.isLoading = false;
				alert('Hiba történt az adatok lekérdezése közben.');
			}
		);
	}
}
