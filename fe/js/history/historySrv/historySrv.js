angular
    .module('weatherStation.history.historySrv', [
        'weatherStation.history.colorSrv'
    ])
    .factory('historySrv', historySrv);

function historySrv($http,
                    colorSrv) {

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
        var labels = resp.data.sensors;
        labels.unshift('Idő');

        var data = [];

        for (var i = 0; i < resp.data.measurements.length; i++) {
            var item = resp.data.measurements[i];

            var prepared = [];
            prepared[0] = parseTime(item.time);

            for (var j = 1; j < labels.length; j++) {
                prepared[j] = null;
            }

            var sensorIndex = labels.indexOf(item.sensor);
            prepared[sensorIndex] = item.temp;

            data.push(prepared);
        }

        return {
            colors: colorSrv.getColors(labels.length - 1),
            labels: labels,
            data: data
        };
    }   

    function parseTime(orig) {
        return new Date(Date.parse(orig));
    }

}


