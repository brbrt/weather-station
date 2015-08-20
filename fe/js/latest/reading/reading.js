angular.module('weatherStation.latest.reading', [

])

.directive('reading',
	function reading() {
		return {
			restrict: 'E',
			scope: {
				data: '='
			},
			templateUrl: 'js/latest/reading/reading.tpl.html',
			link: function(scope) {

			}
		};
	}
);
