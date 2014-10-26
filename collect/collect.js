var $q = require('q');
var spawn = require('child_process').spawn;

var config = require('./config.js');


var sensors = [
	{
		type: 'dht',
		code: 'sm',
		id: '15'
	},
	{
		type: 'ds',
		code: 'out',
		id: '28-000005be30dc'
	},
	{
		type: 'ds',
		code: 'sm',
		id: '28-000005815fdd'
	},
	{
		type: 'ds',
		code: 'lg',
		id: '28-000005826997'
	}
];


var result = {};


readAll();


function readAll() {
	var prs = [];

	for (var i = 0; i < sensors.length; i++ ) {
		var sen = sensors[i];

		var pr = read(sen);
		prs.push(pr);
	}

	$q.all(prs).then(function success() {
		console.log('All is done.');
	});
}

function read(sen) {
	var pr = (sen.type === 'dht') ? readDHT11(sen) : readDS18B20(sen);

	pr.then(
		function success(data) {
			console.log(sen.type + ' ' + sen.code + '= ' + data);
		},
		function error(err) {
			console.log('Error:' + sen.type + ' ' + sen.code + '= ' + data);
		}
	);

	return pr;
}

function readDHT11(sen) {
	return callProc(config('sensors:dhtCommand'), [sen.id]);
}

function readDS18B20(sen) {
	return callProc(config('sensors:dsCommand'), [sen.id]);
}

function callProc(command, args) {
	var deferred = $q.defer();

	var proc = spawn(command, args);

	var out = '', err = '';

	proc.stdout.on('data', function onMsg(data) {
	    out += data;
	});

	proc.stderr.on('data', function onErr(data) {
	    err += data;
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
