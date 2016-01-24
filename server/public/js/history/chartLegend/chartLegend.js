angular
    .module('weatherStation.history.chartLegend', [

    ])
    .directive('chartLegend', chartLegend);

	function chartLegend() {
		return {
			restrict: 'E',
            scope: {},
			templateUrl: 'js/history/chartLegend/chartLegend.tpl.html',
            controller: chartLegendCtrl,
            controllerAs: 'vm'
		};
	}

    function chartLegendCtrl($scope) {
        var vm = this;

        vm.legend = [];

        init();

    	///////////////////

        function init() {
            $scope.$on('chartConfigured', refresh);
        }

        function refresh(event, config) {
            vm.legend = createLegend(config);
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
