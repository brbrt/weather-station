var express = require('express');
var app = express();
var apiProxy = require('http-proxy').createProxyServer();

var apiUrl = 'http://localhost:3636';
var port = 8000;


app.use(express.static('.', {index: 'latest.html'}));

app.all("/api/*", function(req, res) {
    apiProxy.web(req, res, {target: apiUrl});
});

app.listen(port, () => console.log('Serving at: http://localhost:' + port));