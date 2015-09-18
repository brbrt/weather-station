var util = require('util');
var moment = require('moment');
var q = require('q');
var _ = require('lodash');

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
  return getLastDay()
    .then(getLastUnique)
    .then(expandWithObsoleteInfo);
}

function getLastUnique(data) {
  var sensorNames = findUniqueSensorNames(data);

  return _.map(sensorNames, function map(sensorName) {
    var index = _.findLastIndex(data, function find(item) {
      return sensorName == item.sensor;
    });
    return data[index];
  });
}

function findUniqueSensorNames(data) {
  return _.chain(data)
    .sortBy('sensor')
    .map('sensor')
    .uniq()
    .value();
}

function expandWithObsoleteInfo(measurements) {
  return _(measurements).forEach(function(m) {
    m.obsolete = checkObsolete(m);
  }).value();
}

function checkObsolete(measurement) {
  var reference = moment().subtract(30, 'minutes');
  return moment(measurement.time).isBefore(reference);
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

  return q.all(prs)
    .then(combineArrays)
    .then(expandWithSensors);
}

function combineArrays(arrays) {
  return Array.prototype.concat.apply([], arrays);
}

function expandWithSensors(data) {
  return {
    sensors: findUniqueSensorNames(data),
    measurements: data
  };
}

