angular
    .module('weatherStation.history.dygChart', [

    ])
    .directive('dygChart', dygChart);

	function dygChart() {
		return {
			restrict: 'E',
            scope: {},
			templateUrl: 'js/history/dygChart/dygChart.tpl.html',
            link: dygChartLink
		};
	}

    function dygChartLink(scope, element, attrs) {
        var container = element[0].children[0];
        var dyg;

        init();

    	///////////////////

        function init() {
            scope.$on('chartConfigured', refresh);
            element.on('$destroy', destroyGraph);
        }

        function refresh(event, data) {
            destroyGraph();

            var options = { 
                labels: data.labels,
                colors: data.colors,
                strokeWidth: 2,
                connectSeparatedPoints: true
            };

            createGraph(data.data, options);
        }

        function createGraph(data, options) {
            dyg = new Dygraph(container, data, options);
        }

        function destroyGraph() {
            if (dyg) {
                dyg.destroy();
            }
        }

    }

