var config = require('./config.js');
var log = require('winston');
var getSensors = require('./db/get_sensors.js');
var collect = require('./collect.js');

log.info('Start.');
getSensors()
    .then(collect)
    .then(handleResult)
    .catch(log.error);


function handleResult(res) {
    log.info('Res:' + JSON.stringify(res));
}

function handleError(err) {
    log.error('Err:' + JSON.stringify(err));
}
