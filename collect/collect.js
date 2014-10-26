var $q = require('q');
var log = require('winston');
var spawn = require('child_process').spawn;

var config = require('./config.js');


module.exports = collect;


function collect(sensors) {
	log.debug('Start collecting sensor data.');

	var prs = [];

	for (var i = 0; i < sensors.length; i++ ) {
		var sen = sensors[i];

		var pr = read(sen);
		prs.push(pr);
	}

	return $q.all(prs);
}

function read(sen) {
	var deferred = $q.defer();

	log.debug('Read data of sensor: ' + JSON.stringify(sen));

	var pr = (sen.type === 'dht') ? readDHT11(sen) : readDS18B20(sen);

	pr.then(
		function success(result) {
			log.debug(sen.type + ' ' + sen.code + '= ' + data);

			// Add the sensor info to the result.
			deferred.resolve({
				sensor: sen,
				result: data
			});
		},
		function error(err) {
			log.debug('Error:' + sen.type + ' ' + sen.code + '= ' + data);
			deferred.reject({
				sensor: sen,
				err: err
			});
		}
	);

	return deferred.promise;
}

function readDHT11(sen) {
	return callProc(config('sensors:dhtCommand'), [sen.physical_id]);
}

function readDS18B20(sen) {
	return callProc(config('sensors:dsCommand'), [sen.physical_id]);
}

function callProc(command, args) {
	log.debug('callProc command=' + command + '  args=' + JSON.stringify(args));

	var deferred = $q.defer();

	var proc = spawn(command, args);

	var out = '', err = '';

	proc.stdout.on('data', function onMsg(data) {
		log.debug('callProc stdout: ' + data);
	    out += data;
	});

	proc.stderr.on('data', function onErr(data) {
		log.debug('callProc stderr: ' + data);
	    err += data;
	});

	proc.on('close', function onClose(code) {
		log.debug('callProc close: ' + code);

		if (code === 0) {
			deferred.resolve(out);
		} else {
			deferred.reject(err);
		}
	});

	return deferred.promise;
}
