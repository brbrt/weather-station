var request = require('supertest');
var expect = require('chai').expect;

var app;

beforeEach(function() {
  app = require('../index.js');
});

describe('save', function() {
  it('valid', function(done) {
    request(app)
      .post('/weather?sensor=SSN&temp=26.7')
      .expect(/OK/)
      .expect(200);

    request(app)
      .get('/weather/latest')
      .expect(checkAnswer)
      .expect(200, done);

    function checkAnswer(res) {
      expect(res.body.sensor).to.equal('SSN');
      expect(res.body.temp).to.equal(26.7);
    }
  });

  it('empty request', function(done) {
    request(app)
      .post('/weather')
      .expect(/Api error/)
      .expect(400, done);
  });

  it('sensor missing', function(done) {
    request(app)
      .post('/weather?temp=23.4')
      .expect(/Api error/)
      .expect(400, done);
  });

  it('temp missing', function(done) {
    request(app)
      .post('/weather?sensor=SSN')
      .expect(/Api error/)
      .expect(400, done);
  });

  it('temp NaN', function(done) {
    request(app)
      .post('/weather?sensor=SSN&temp=ASDD')
      .expect(/Api error/)
      .expect(400, done);
  });
});

