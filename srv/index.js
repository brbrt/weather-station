var http = require('http');
var url = require('url');
var sensor = require('./sensor.js');

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
	
	var meterId = sensors[meterCode];
	var result = sensor.readTemp(meterId);
	response.writeHead(200, { 'Content-Type': 'text/plain' });
	response.end(result, 'utf-8');
	
}).listen(port);

console.log('Server running at http://127.0.0.1:' + port + '/');
