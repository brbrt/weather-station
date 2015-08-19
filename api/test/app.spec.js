var request = require('supertest');
var expect = require('chai').expect;

var app;

beforeEach(function() {
  app = require('../index.js');
});

describe('app', function() {
  it('is listening', function(done) {
    request(app)
      .get('/')
      .expect(/weather station api/)
      .expect(200, done);
  });
});


