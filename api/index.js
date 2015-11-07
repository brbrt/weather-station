var util = require('util');
var express = require('express');
var app = express();
var router = express.Router();

var config = require('./config.js');
var log = require('./logger.js');
var service = require('./service.js');

router.get('/', function (req, res) {
  res.send('weather station api');
});

router.get('/weather', function handle(req, res) {
  res.redirect('weather/latest');
});

router.get('/weather/latest', function handle(req, res) {
  service
    .getLatest()
    .then(
      function success(data) {
        res.json(data);
      }, 
      function error(err) {
        apiError(err, res);
      }
  );
});

router.get('/weather/lastday', function handle(req, res) {
  service
    .getLastDay()
    .then(
      function success(data) {
        res.json(data);
      }, 
      function error(err) {
        apiError(err, res);
      }
    );
});

router.get('/weather/interval', function handle(req, res) {
  service
    .getInterval(req.query.from, req.query.to)
    .then(
      function success(data) {
        res.json(data);
      }, 
      function error(err) {
        apiError(err, res);
      }
    );
});

router.post('/weather', function handle(req, res) {
  log.debug('Got measurement from ' + req.ip + ' ' + util.inspect(req.query));

  var data = {
    time: new Date(),
    sensor: req.query.sensor,
    inputVoltage: req.query.inputVoltage,
    temp: req.query.temp
  };

  service.save(data).then(
    function success(data) {
      res.send(data + '\n');
    }, 
    function error(err) {
      apiError(err, res);
    }
  );
});

function apiError(err, res) {
  log.info('Api error:' + util.inspect(err));
  res.status(400).send('Api error.\n' + err + '\n');
}

app.use('/api', router);
app.set('json spaces', 2);

var server = app.listen(config('port'), function listen() {
  var host = server.address().address;
  var port = server.address().port;

  log.info('weather station api is listening at http://%s:%s', host, port);
});

module.exports = server;
