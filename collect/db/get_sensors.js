var $q = require('q');
var log = require('winston');
var Db = require('./db_base.js');


module.exports = getSensors;


function getSensors() {
    var deferred = $q.defer();
    var sensors = [];

    log.debug('Getting sensors');

    var db = new Db();

    db.c.query('SELECT sensor_id, type, physical_id FROM sensors ORDER BY sensor_id')
        .on('result', function onResult(res) {
            res.on('row', function onRow(row) {
                sensors.push(row);
            })
            .on('error', function onError(err) {
                deferred.reject(err);
            })
     })
     .on('end', function onEnd() {
         deferred.resolve(sensors);

         db.close();
     });

     return deferred.promise;
 }
