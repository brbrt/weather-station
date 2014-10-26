var fs = require('fs');
var path = require('path');


var meterId = '28-000005be30dc';
if (process.argv.length > 2) {
	meterId = process.argv[2];
}

readTemp(meterId, function handler(data) {
	var output = JSON.stringify(data) + '\n';
	process.stdout.write(output);
});

function readTemp(meterId, handler) {
	readTempRaw(meterId, function success(data) {
		var lines = data.split('\n');

		if (lines[0].slice(-3) !== 'YES') {
			process.stderr.write('Invalid reading, retrying\n');
			readTemp(meterId, handler);
		} else {
			var parsed = parseReading(meterId, lines);
			handler(parsed);
		}
	});
}

function readTempRaw(meterId, handler) {
	var sourceFile = path.join('/sys/bus/w1/devices', meterId, 'w1_slave');

	fs.readFile(sourceFile, 'ascii', function onRead(err, data) {
		if (err) {
			process.stderr.write(err + '\n');
			process.exit(1);
		}

		handler(data);
	});
}

function parseReading(meterId, lines) {
	var origTemp = lines[1].split('t=')[1];

	var temp = Math.round(parseInt(origTemp) / 100.0) / 10.0;

	return {
		temp: temp
	};
}
