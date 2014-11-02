var $q = require('q');
var log = require('winston');
var Db = require('./db_base.js');


module.exports = insert;

/////////////

const sql = 'INSERT INTO actual_values (sensor_id, measure_date, temp_value, hum_value) '+
              ' VALUES (:sensorId, :measureDate, :tempValue, :humValue)' +
              ' ON DUPLICATE KEY UPDATE measure_date = :measureDate, temp_value = :tempValue, hum_value = :humValue';

function insert(data) {
    log.info('Start inserting data.');

    var db = new Db();
    var pq = db.c.prepare(sql);

    var prs = [];

    for (var i = 0; i < data.length; i++) {
        var pr = insertItem(db.c, pq, data[i])
        prs.push(pr);
    }

    var allProm = $q.all(prs);

    allProm.then(
        function success() {
            log.info('Inserting data is done.');
        },
        function error(err) {
            log.info('Inserting data has failed: ' + JSON.stringfify(err));
        }
    ).finally(
        function fnly() {
            db.close();
        }
    );

    return allProm;
}


function insertItem(c, pq, item) {
    log.debug('Inserting item: ' + JSON.stringify(item));
    
    var deferred = $q.defer();

    var error = null;

    c.query(pq(item))
    .on('result', function onResult(res) {
        res.on('error', function onError(err) {
            log.debug('Insert error: ' + JSON.stringify(err));
            error = err;
        })
     })
     .on('end', function onEnd(info) {
         if (error) {
             deferred.reject(error);
         } else {
             deferred.resolve(item);
         }
     });

    return deferred.promise;
 }
