var $q = require('q');
var log = require('winston');
var changeCase = require('change-case');

module.exports = transform;


function transform(data) {
    log.debug('Start transforming data.');

    var deferred = $q.defer();

    try {
        var tr = mergeByLocation(toCamelCase(data));

        deferred.resolve(tr);

    } catch (ex) {
        log.error('Transforming data has failed: ' + ex.message);
        deferred.reject(ex.message);
    }

    return deferred.promise;
}

function toCamelCase(data) {
    var ccArr = [];

    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var ccItem = {};

        for (var prop in item) {
            var ccProp = changeCase.camelCase(prop);
            ccItem[ccProp] = item[prop];
        }

        ccArr.push(ccItem);
    }

    return ccArr;
}

function mergeByLocation(data) {
    // Two items with the same 'locationCode' should be merged, the 'temp' value of the higher 'sensorPriority' should be used.
    // (The results are ordered by 'locationOrder' and 'sensorPriority'.)

    var merged = data.reduce(
        function reduceFn(p, c) {
            var index = indexOfObject(p, 'locationCode', c.locationCode);

            if (index === -1) {
                p.push(c);
            } else {
                p[index].temp = c.temp;
            }

            return p;
        },
        []
    );

    return merged;
}

function indexOfObject(arr, key, value) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][key] === value) {
            return i;
        };
    }

    return -1;
}
