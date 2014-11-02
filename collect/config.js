var nconf = require('nconf');
var winston = require('winston');
var path = require('path');


// Wrap nconf.get function.
module.exports = getConfig;

function getConfig(key) {
    return nconf.get(key);
}


// First consider commandline arguments and environment variables, respectively.
// E.g. node index.js --db:host '192.168.1.1'
nconf.argv().env();

// Then load configuration from a designated file.
// nconf.file({ file: 'config.json' });

// Provide default values for settings not provided above.
nconf.defaults({
    db: {
        host: '127.0.0.1',
        user: 'user',
        password: 'changeit',
        dbName: 'weather_station'
    },
    sensors: {
        dhtCommand: path.resolve(__dirname, 'sensors/dht11.sh'),
        dsCommand: path.resolve(__dirname, 'sensors/ds18b20.sh')
    },
    env: {
        debug: false
    }
});



// Set default log level based on config.
var level = getConfig('env:debug') ? 'debug' : 'info';
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {level: level});
