angular
    .module('weatherStation', [
        'ui.router',

	    'weatherStation.history',
	    'weatherStation.latest'
    ])
    .config(appConfig);

function appConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/latest');
}
