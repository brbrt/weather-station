var $q = require('q');
var log = require('winston');


module.exports = transform;


function transform(data) {
    log.info('Start transforming data.');

    var deferred = $q.defer();

    var currDate = new Date().toISOString();

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

function isNotNull(val) {
    return typeof val !== 'undefined' && val !== null;
}
