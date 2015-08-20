angular.module('weatherStation.reading', [

])

.directive('reading',
	function reading() {
		return {
			restrict: 'E',
			scope: {
				data: '='
			},
			templateUrl: 'js/reading/reading.tpl.html',
			link: function(scope) {

			}
		};
	}
);
