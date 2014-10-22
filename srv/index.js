var http = require('http');
var url = require('url');
var log = require('winston');
var config = require('./config.js');
var sensor = require('./sensor.js');
var responseWriter = require('./response-writer.js');

var sensors = config.sensors;

http.createServer(function server(request, response) {
	var urlParts = url.parse(request.url, true);
	var path = urlParts.pathname;
	
	log.debug('Request starting. Path=', path);
	
	var meterCode = path.replace('/api/', '');
	
	if (!sensors.hasOwnProperty(meterCode)) {
		responseWriter.write(request, response, 404, '404 Not Found');
		return;
	}
	
	var meterId = sensors[meterCode];
	sensor.readTemp(meterId, function handler(result) {
		responseWriter.write(request, response, 200, result);
	});
	
}).listen(config.port);

log.info('Server running on port: ' + config.port);
