var util = require('util');
var moment = require('moment');
var q = require('q');

var storage = require('./storage.js');

module.exports = {
  save: save,
  getLastDay: getLastDay,
  getLatest: getLatest,
  getInterval: getInterval
};

function save(data) {
  var deferred = q.defer();

  var errors = checkSaveData(data);

  if (errors) {
    deferred.reject(errors);
  } else {
    data.temp = parseFloat(data.temp);
    storage.save(data);
    deferred.resolve('OK');
  }

  return deferred.promise;
}

function checkSaveData(data) {
  var result = '';
  if (isNaN(parseFloat(data.temp))) {
    result += 'Invalid temp value: ' + data.temp + '\n'
  }
  if (!data.sensor) {
    result += 'Missing sensor parameter\n';
  }
  return result;
}

function getLastDay() {
  return storage.get(new Date());
}

function getLatest() {
  return getLastDay().then(getLastElement);
}

function getLastElement(data) {
  if (data.length == 0) {
    return [];
  }
  return [ data[data.length - 1] ];
}

function getInterval(from, to) {
  var format = 'YYYY-MM-DD';

  var start = moment(from, format).startOf('day');
  var end = moment(to, format).startOf('day');

  console.log('Query between ' + start.toDate() + ' - ' + end.toDate());

  if (!start.isValid() || !end.isValid()) {
    return q.fcall(function error() {
      throw new Error('Invalid input.');
    });
  }

  var prs = [];

  while (start.isBefore(end) || start.isSame(end)) {
    var pr = storage.get(start.toDate());
    prs.push(pr);
    start.add(1, 'days');
  }

  return q.all(prs).then(combineArrays);
}

function combineArrays(arrays) {
  return Array.prototype.concat.apply([], arrays);
}

