var nconf = require('nconf');

// Get configuration with nconf, and export to our custom object.

var config = {};
module.exports = config;


// First consider commandline arguments and environment variables, respectively.
// E.g. node index.js --db:host '192.168.1.1'
nconf.argv().env();

// Then load configuration from a designated file.
// nconf.file({ file: 'config.json' });

// Provide default values for settings not provided above.
nconf.defaults({
    'db': {
        'host': '127.0.0.1',
        'user': 'user',
        'password': 'changeit'
    }
});


// Populate our config object from nconf.
config.db = {
    host: nconf.get('db:host'),
    user:nconf.get('db:user'),
    password: nconf.get('db:password')
};
