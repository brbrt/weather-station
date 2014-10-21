var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');

var port = 2000;

var sensors = {
	'out': '28-000005be30dc',
	'sm': '28-000005815fdd',
	'lg': '28-000005826997'
};

http.createServer(function server(request, response) {
	var urlParts = url.parse(request.url, true);
	var path = urlParts.pathname;
	
	console.log('Request starting. Path=', path);
	
	var meterCode = path.replace('/api/', '');
	
	if (!sensors.hasOwnProperty(meterCode)) {
		response.writeHead(404, {'Content-Type': 'text/plain'});
		response.end('404 Not Found', 'utf-8');
		return;
	}
	
	var result = readTemp(meterCode);
	response.writeHead(200, { 'Content-Type': 'text/plain' });
	response.end(result, 'utf-8');
	
}).listen(port);

function readTemp(meterCode) {
	var meterId = sensors[meterCode];

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

console.log('Server running at http://127.0.0.1:' + port + '/');
