var nconf = require('nconf');


// Wrap nconf.get function.
module.exports = getConfig;

function getConfig(key) {
    return nconf.get(key);
}


// First consider commandline arguments and environment variables, respectively.
// E.g. node index.js --port 13131
nconf.argv().env();


// Provide default values for settings not provided above.
nconf.defaults({
    port: 3636,
    measurement: {
        obsoleteTimeout: 30
    },
    storagePath: 'weather'
});

