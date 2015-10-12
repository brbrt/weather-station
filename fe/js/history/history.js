angular
    .module('weatherStation.history', [
        'ui.router',

        'weatherStation.history.dygChart',
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

    vm.legend = [];

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

                vm.dygApi.refresh(data.data, { 
                    labels: data.labels,
                    colors: data.colors,
                    strokeWidth: 2,
                    connectSeparatedPoints: true
                });

                vm.legend = createLegend(data);

                $log.debug('History data:', data);
			},
			function error(err) {
				vm.isLoading = false;
				alert('Hiba történt az adatok lekérdezése közben.');
			}
		);
	}

    function createLegend(config) {
        var legend = [];

        for (var i = 0; i < config.colors.length; i++) {
            var item = {
                color: config.colors[i],
                label: config.labels[i + 1],
            };
            legend.push(item);
        }

        return legend;
    }

}
