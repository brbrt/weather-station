var config = require('./config.js');
var log = require('winston');

var getSensors = require('./db/get_sensors.js');
var collect = require('./collect.js');
var transform = require('./transform.js');
var insert = require('./db/insert_data.js');


log.info('Start.');

getSensors()
    .then(collect)
    .then(transform)
    .then(insert)
    .then(success)
    .catch(error);


function success(res) {
    log.info('Stop.');
}

function error(err) {
    log.error('Fatal error: ' + JSON.stringify(err));
}
