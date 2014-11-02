var $q = require('q');
var log = require('winston');


module.exports = transform;


function transform(data) {
    log.info('Start transforming data.');

    var deferred = $q.defer();

    var currDate = getCurrDateTime();

    try {
        var transformed = [];

        for (var i = 0; i < data.length; i++) {
            var trItem = transformItem(data[i], currDate)
            transformed.push(trItem);
        }

        log.info('Transforming data is done.');

        deferred.resolve(transformed);

    } catch (ex) {
        log.error('Transorming data has failed: ' + ex.message);
        deferred.reject(ex.message);
    }

    return deferred.promise;
}

function transformItem(item, currDate) {
    var res = JSON.parse(item.result.trim())

    var tr = {
        sensorId: item.sensor.sensor_id,
        measureDate: currDate,
        tempValue: res.temp,
        humValue: (isNotNull(res.hum)) ? res.hum : null,
    };

    return tr;
}

function getCurrDateTime() {
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
}

function isNotNull(val) {
    return typeof val !== 'undefined' && val !== null;
}
