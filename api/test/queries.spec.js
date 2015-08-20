var request = require('supertest');
var expect = require('chai').expect;
var mockfs = require('mock-fs');
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

describe('query', function() {
  it('latest 2 ', function(done) {
    timekeeper.travel(moment('2015-05-04', 'YYYY-MM-DD').toDate());
    mockfs({
      'weather/2015/05/2015-05-03.csv': '2015-05-03T07:19:35.271;CER;11.8',
      'weather/2015/05/2015-05-04.csv': '2015-05-04T18:41:50.429;CER;19.9\n2015-05-04T18:47:35.680;SSN;13.5'
    });

    request(app)
      .get('/api/weather/latest')
      .expect(checkAnswer)
      .expect(200, done);

    function checkAnswer(res) {
      expect(res.body.sensor).to.equal('SSN');
      expect(res.body.temp).to.equal(13.5);
    }
  });

  it('lastday', function(done) {
    timekeeper.travel(moment('2015-05-04', 'YYYY-MM-DD').toDate());
    mockfs({
      'weather/2015/05/2015-05-03.csv': '2015-05-03T07:19:35.271;CER;11.8',
      'weather/2015/05/2015-05-04.csv': '2015-05-04T18:41:50.429;CER;19.9\n2015-05-04T18:47:35.680;SSN;13.5'
    });

    request(app)
      .get('/api/weather/lastday')
      .expect(checkAnswer)
      .expect(200, done);

    function checkAnswer(res) {
      expect(res.body).to.be.a('array');
      expect(res.body.length).to.equal(2);

      expect(res.body[0].sensor).to.equal('CER');
      expect(res.body[0].temp).to.equal(19.9);
      expect(res.body[1].sensor).to.equal('SSN');
      expect(res.body[1].temp).to.equal(13.5);
    }
  });

});

