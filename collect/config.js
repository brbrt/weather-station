var nconf = require('nconf');

// Wrap nconf.get function.
module.exports = function getConfig(key) {
    return nconf.get(key);
};


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
        password: 'changeit'
    },
    sensors: {
        dhtCommand: 'sensors/bin/dht11',
        dsCommand: 'sensors/ds18b20.sh'
    }
});
