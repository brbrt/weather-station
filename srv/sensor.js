var fs = require('fs');
var path = require('path');

exports.readTemp = readTemp;

function readTemp(meterId, handler) {	
	readTempRaw(meterId, function success(data) {
		var lines = data.split('\n');

		if (lines[0].slice(-3) !== 'YES') {
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
			throw err;		
		}

		handler(data);
	});
}

function parseReading(meterId, lines) {
	var origTemp = lines[1].split('t=')[1];
	
	var temp = parseInt(origTemp) / 1000.0;
	
	return {
		temp: temp.toFixed(1)
	};
}
