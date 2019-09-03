var app = require('../backend/server');
var chai = require('chai');
var request = require('supertest');

var expect = chai.expect;

describe('Save new unit', function() {
	it('should return a new unit', function(done) {
	  request(app)
    .post('/api/saveunit')
	  .send({title: 'new unit'})
	  .end(function(err, res) {
	    expect(res.statusCode).to.be.equal(200);
      expect(res.body.title).to.be.equal('new unit');
      done();
	  });
	});
});

describe('Save new unit without title Error', function() {
  it('should return a 404 if something goes wrong', function(done) {
    request(app)
    .post('/api/saveunit')
    .end(function(err, res) {
      expect(res.statusCode).to.be.equal(404);
      done();
    });
  });
});

describe('Find units in database', function() {
  it('should return a list of stored units', function(done) {
    request(app)
    .get('/api/searchunit')
    .end(function(err, res) {
      expect(res.body).to.be.an('array');
      done();
    });
  });
});