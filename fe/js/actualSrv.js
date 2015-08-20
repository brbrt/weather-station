angular.module('weatherStation.actualSrv', [

])

.factory('actualSrv',
    function weatherSrv($http) {

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
);
