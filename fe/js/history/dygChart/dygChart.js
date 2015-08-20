angular
    .module('weatherStation.history.dygChart', [

    ])
    .directive('dygChart', dygChart);

	function dygChart() {
		return {
			restrict: 'E',
            scope: {
                api: '='
			},
			templateUrl: 'js/history/dygChart/dygChart.tpl.html',
            link: function(scope, element, attrs) {
                var container = element[0].children[0];
                var dyg;

                scope.api = {
                    refresh: refresh
                };

            	///////////////////

                function refresh(data, options) {
                    destroyGraph();
                    createGraph(data, options);
                }

                function createGraph(data, options) {
                    dyg = new Dygraph(container, data, options);
                }

                function destroyGraph() {
                    if (dyg) {
                        dyg.destroy();
                    }
                }

                element.on('$destroy', function() {
                    destroyGraph();
                });
            }
		};
	}
