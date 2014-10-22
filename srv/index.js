var http = require('http');
var url = require('url');
var log = require('winston');
var config = require('./config.js');
var sensor = require('./sensor.js');

var sensors = config.sensors;

http.createServer(function server(request, response) {
	var urlParts = url.parse(request.url, true);
	var path = urlParts.pathname;
	
	log.debug('Request starting. Path=', path);
	
	var meterCode = path.replace('/api/', '');
	
	if (!sensors.hasOwnProperty(meterCode)) {
		response.writeHead(404, {'Content-Type': 'text/plain'});
		response.end('404 Not Found', 'utf-8');
		return;
	}
	
	var meterId = sensors[meterCode];
	sensor.readTemp(meterId, function handler(result) {
		response.writeHead(200, { 'Content-Type': 'text/plain' });
		response.end(result, 'utf-8');
	});
	
}).listen(config.port);

log.info('Server running on port: ' + config.port);
