var http = require('http');
var url = require('url');
var log = require('winston');

var config = require('./config.js');
var getActualValues = require('./db/get_actual_values.js');
var transform = require('./transform.js');
var responseWriter = require('./response-writer.js');


http.createServer(function server(request, response) {
	var urlParts = url.parse(request.url, true);
	var path = urlParts.pathname;

	log.debug('Request starting. Path=', path);

	var route = path.replace('/api/', '');

	if (route.indexOf('actual') === 0) {
		getActualValues()
			.then(transform)
			.then(function success(data) {
				responseWriter.write(request, response, 200, data);
				log.debug('Actual values: ' + JSON.stringify(data));
			}).catch(function error(err) {
				responseWriter.write(request, response, 500, '500 Internal error');
				log.info('Error: ' + JSON.stringify(err));
			});

		return;
	}

	notFound(request, response);

}).listen(config('port'));


log.info('Server running on port: ' + config('port'));



function notFound(request, response) {
	responseWriter.write(request, response, 404, '404 Not Found');
}
