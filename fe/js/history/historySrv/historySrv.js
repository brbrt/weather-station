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
        return $http.get(url, { params: queryParams }).then(prepareForChart);
    }

    function prepareForChart(resp) {
        var result = [];

        for (var i = 0; i < resp.data.length; i++) {
            var item = resp.data[i];
            var prepared = [ parseTime(item.time), item.temp ];
            result.push(prepared);
        }

        return result;
    }   

    function parseTime(orig) {
        return new Date(Date.parse(orig));
    }

}


