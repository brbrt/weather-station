var fs = require('fs');
var path = require('path');

exports.readTemp = readTemp;

function readTemp(meterId) {	
	var lines = readTempRaw(meterId).split('\n');
	
	while (lines[0].slice(-3) !== 'YES') {
		lines = readTempRaw(meterId).split('\n')
	}
	
	return parseReading(meterId, lines);
}

function readTempRaw(meterId) {
	var sourceFile = path.join('/sys/bus/w1/devices', meterId, 'w1_slave');
	return fs.readFileSync(sourceFile, 'ascii');
}

function parseReading(meterId, lines) {
	var origTemp = lines[1].split('t=')[1];
	
	var temp = parseInt(origTemp) / 1000.0;
	
	return temp.toFixed(1);
}