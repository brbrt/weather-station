angular
    .module('weatherStation.latest.latestSrv', [
    ])
    .factory('latestSrv', latestSrv);

function latestSrv($http) {
    var url = '/api/weather/latest';

    var factory = {
        getData: getData
    };

    return factory;

    ///////////////////

    function getData() {
        return $http.get(url);
    }

}


