var config = require('./config.js');
var log = require('winston');
var getSensors = require('./db/get_sensors.js');

log.debug('Start.');
getSensors().then(
    function success(data) {
        log.info('Sensors: ', JSON.stringify(data));
    },
    function error(err) {
        log.info('Error getting sensors: ', err);
    }
);
