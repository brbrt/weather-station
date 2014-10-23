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
	
	var route = path.replace('/api/', '');
		
	if (route.indexOf('sensors') == 0) {
		if (route === 'sensors' || route === 'sensors/') {	
			responseWriter.write(request, response, 200, Object.keys(sensors));
			return;
		}
		
		var meterCode = route.replace('sensors/', '');
	
		if (sensors.hasOwnProperty(meterCode)) {
			var meterId = sensors[meterCode];
			sensor.readTemp(meterId, function handler(result) {
				responseWriter.write(request, response, 200, result);
			});
			return;
		}
	}
		
	responseWriter.write(request, response, 404, '404 Not Found');
	
}).listen(config.port);

log.info('Server running on port: ' + config.port);
