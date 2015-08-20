angular
    .module('weatherStation.history.historySrv', [
    ])
    .factory('historySrv', historySrv);

function historySrv($http) {
    var url = '/api/weather/interval';
    var queryDateFormat = 'YYYY-MM-DD'

    var factory = {
        getInterval: getInterval
    };

    return factory;

    ///////////////////

    function getInterval(params) {
        var queryParams = {
            from: moment(params.from).format(queryDateFormat),
            to: moment(params.to).format(queryDateFormat)
        };
        return $http.get(url, { params: queryParams }).then(extractData);
    }

    function extractData(resp) {
        return resp.data;
    }

}


