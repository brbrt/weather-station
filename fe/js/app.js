angular
    .module('weatherStation', [
        'ui.router',

	    'weatherStation.latest'
    ])
    .config(appConfig);

function appConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/latest');
}
