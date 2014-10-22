exports.write = write;


function write(request, response, statusCode, result) {
	writeJSON(request, response, statusCode, result);	
}

function writeJSON(request, response, statusCode, result) {
	response.writeHead(statusCode, { 'Content-Type': 'application/json' });	
	var resultStr = JSON.stringify(result);
	response.end(resultStr, 'utf-8');
}