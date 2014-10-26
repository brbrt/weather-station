var Client = require('mariasql');
var log = require('winston');
var config = require('../config.js');


module.exports = Db;


function Db() {
    this.c = initConnection();

    this.close = function close() {
        log.debug('Closing connection.');
        this.c.end();
    };
}

function initConnection() {
    log.debug('Init connection.');

    var c = new Client();

    c.connect({
      host: config('db:host'),
      user: config('db:user'),
      password: config('db:password'),
      db: config('db:dbName')
    });


    c.on('connect', function() {
        log.debug('Client connected.');
    })
    .on('error', function(err) {
        log.error('Client error: ' + err);
    })
    .on('close', function(hadError) {
        log.debug('Client closed.');
    });

    return c;
}
