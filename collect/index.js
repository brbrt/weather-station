var config = require('./config.js');
var log = require('winston');
var getSensors = require('./db/get_sensors.js');
var collect = require('./collect.js');

log.debug('Start.');
getSensors()
    .then(collect)
    .then(handleResult)
    .catch(log.error);


function handleResult(res) {
    console.log('Res:' + JSON.stringify(res));
}
