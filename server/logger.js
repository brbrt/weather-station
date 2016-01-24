var moment = require('moment');
var winston = require('winston');

var logger = new (winston.Logger)({
    level: 'debug',
    transports: [
        new (winston.transports.Console)({
            timestamp: function() {
                return moment().format('YYYY-MM-DDTHH:mm:ss');
            },
            formatter: function(options) {
                return '[' + options.timestamp() +'] ['+ options.level.toUpperCase() +'] '+ (undefined !== options.message ? options.message : '') +
                    (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
            }
        })
    ]
});

logger.setLevels(winston.config.syslog.levels);

module.exports = logger;
