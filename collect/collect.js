var $q = require('q');
var log = require('winston');
var spawn = require('child_process').spawn;

var config = require('./config.js');


module.exports = collect;


function collect(sensors) {
	log.info('Start collecting sensor data.');

	var prs = [];

	for (var i = 0; i < sensors.length; i++ ) {
		var sen = sensors[i];

		var pr = read(sen);

		prs.push(pr);
	}


	var allProm = $q.all(prs);

	allProm.then(
		function success() {
			log.info('Collecting sensor data is done.');
		},
		function error(err) {
			log.info('Collecting sensor data fas failed: ' + JSON.stringify(err));
		}
	);

	return allProm;
}

function read(sen) {
	var deferred = $q.defer();

	var pr = (sen.type === 'dht') ? readDHT11(sen) : readDS18B20(sen);

	pr.then(
		function success(result) {
			log.debug('Result of sensor ' + sen.sensor_id + '=' + result);

			// Add the sensor info to the result.
			deferred.resolve({
			 	sensor: sen,
			 	result: result
			});
		},
		function error(err) {
			log.debug('Error of sensor ' + sen.sensor_id + '=' + err);
			
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
	    out += data;
	});

	proc.stderr.on('data', function onErr(data) {
	    err += data;
	});

	proc.on('error', function onError(err) {
		deferred.reject(err);
	});

	proc.on('close', function onClose(code) {
		if (code === 0) {
			deferred.resolve(out);
		} else {
			deferred.reject(err);
		}
	});

	return deferred.promise;
}
