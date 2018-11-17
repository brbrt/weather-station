var request = require('supertest');
var expect = require('chai').expect;
var mockfs = require('mock-fs');
var timekeeper = require('timekeeper');

var app = require('../index.js');;

beforeEach(function() {
  mockfs({
    'weather': {}
  });
});

afterEach(function() {
  timekeeper.reset();
  mockfs.restore();
});

describe('app', function() {
  it('is listening', function(done) {
    request(app)
      .get('/api')
      .expect(/weather station api/)
      .expect(200, done);
  });
});


