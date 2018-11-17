var config = require('./config.js');
var log = require('./logger.js');
var send = require('gmail-send')({
  user: config('mail:sender:user'),
  pass: config('mail:sender:pass'),
  to:   config('mail:recipient'),
});

log.debug('Sending mails to ' + config('mail:recipient'));

module.exports = {
  sendInvalidRequestNotification: sendInvalidRequestNotification,
};

function sendInvalidRequestNotification(data, error) {
  log.debug('Sending invalid request notification.');

  var text = error + "\n" + JSON.stringify(data, null, 4);

  send({
    subject: 'Weather station invalid request notification',
    text: text,
  }, function (err, res) {
    log.info('Email sending result', err ? err : res);
  });
}
