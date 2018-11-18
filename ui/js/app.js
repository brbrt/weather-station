angular
    .module('weatherStation', [
        'ui.router',

	    'weatherStation.history'
    ])
    .config(appConfig);

function appConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/history');
}
