var fs = require('fs');
var path = require('path');
var util = require('util');
var mkdirp = require('mkdirp');
var moment = require('moment');
var q = require('q');

module.exports = {
  save: save,
  get: get
};

var timeFormat = 'YYYY-MM-DDTHH:mm:ss.SSS';
var separator = ';';
var lineSeparator = '\n';

function save(data) {
  var row = createRow(data);
  var df = calculateFileName(data.time);

  mkdirp(df.dir, function mkdirdone(err) {
    if (err) {
      console.log('Error creating dir: ' + err);
      return;
    }

    fs.appendFile(df.dir + df.file, row, function done(err) {
      if (err) {
        console.log('Error writing data: ' + err);
      }
    });
  });
}

function get(date) {
  var df = calculateFileName(date);

  var path = df.dir + df.file;

  return readFile(path).then(parseFile);
}

function readFile(fileName) {
  var deferred = q.defer();

  fs.readFile(fileName, 'utf8', function done(err, fileData) {
    if (err) {
      fileData = '';
    }
    deferred.resolve(fileData);
  });

  return deferred.promise;
}

function parseFile(fileData) {
  var result = [];

  var lines = fileData.split(lineSeparator);

  for (var i = 0; i < lines.length; i++) {
    var parsed = parseRow(lines[i]);
    if (parsed) {
      result.push(parsed);
    }
  }

  return result;
}

function createRow(data) {
  var timeStr = moment(data.time).format(timeFormat);
  return timeStr + separator + data.sensor + separator + data.temp + lineSeparator;
}

function parseRow(row) {
  var parts = row.split(separator);

  if (parts.length < 3) {
    return null;
  }

  return {
    time: moment(parts[0], timeFormat).toDate(),
    sensor: parts[1],
    temp: parseFloat(parts[2])
  };
}

function calculateFileName(time) {
  var mtime = moment(time);

  return {
    dir: 'weather/' + mtime.format('YYYY/MM/'),
    file: mtime.format('YYYY-MM-DD') + '.csv'
  };
}
