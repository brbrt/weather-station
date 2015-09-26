var request = require('supertest');
var expect = require('chai').expect;
var mockfs = require('mock-fs');
var fs = require('fs');
var moment = require('moment');
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

describe('save', function() {
  it('valid', function(done) {
    request(app)
      .post('/api/weather?sensor=SSN&temp=26.7')
      .expect(/OK/)
      .expect(200, done);
  });

  it('empty request', function(done) {
    request(app)
      .post('/api/weather')
      .expect(/Api error/)
      .expect(400, done);
  });

  it('sensor missing', function(done) {
    request(app)
      .post('/api/weather?temp=23.4')
      .expect(/Api error/)
      .expect(400, done);
  });

  it('temp missing', function(done) {
    request(app)
      .post('/api/weather?sensor=SSN')
      .expect(/Api error/)
      .expect(400, done);
  });

  it('temp NaN', function(done) {
    request(app)
      .post('/api/weather?sensor=SSN&temp=ASDD')
      .expect(/Api error/)
      .expect(400, done);
  });

  it('temp out of range - neg', function(done) {
    request(app)
        .post('/api/weather?sensor=SSN&temp=-41')
        .expect(/Api error/)
        .expect(400, done);
  });

  it('temp out of range - pos', function(done) {
    request(app)
        .post('/api/weather?sensor=SSN&temp=51')
        .expect(/Api error/)
        .expect(400, done);
  });
});

