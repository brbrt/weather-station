var $q = require('q');
var log = require('winston');
var Db = require('./db_base.js');


module.exports = getActualValues;


function getActualValues() {
    log.debug('Getting actual values');

    var deferred = $q.defer();

    var db = new Db();

    var values = [];

    db.c.query('SELECT * FROM actual_values_vw ORDER BY location_order, sensor_priority')
        .on('result', function onResult(res) {
            res.on('row', function onRow(row) {
                values.push(row);
            })
            .on('error', function onError(err) {
                deferred.reject(err);
            })
     })
     .on('end', function onEnd() {
         deferred.resolve(values);

         db.close();
     });

     return deferred.promise;
 }
