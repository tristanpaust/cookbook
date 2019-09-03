var app = require('../backend/server');
var chai = require('chai');
var request = require('supertest');

var expect = chai.expect;

describe('Save new ingredient', function() {
	it('should return a new ingredient', function(done) {
	  request(app)
    .post('/api/saveingredient')
	  .send({title: 'new ingredient'})
	  .end(function(err, res) {
	    expect(res.statusCode).to.be.equal(200);
      expect(res.body.title).to.be.equal('new ingredient');
      done();
	  });
	});
});

describe('Save new ingredient without title Error', function() {
  it('should return a 404 if something goes wrong', function(done) {
    request(app)
    .post('/api/saveingredient')
    .end(function(err, res) {
      expect(res.statusCode).to.be.equal(404);
      done();
    });
  });
});


describe('Find ingredients in database', function() {
  it('should return a list of stored ingredients', function(done) {
    request(app)
    .get('/api/searchingredient')
    .end(function(err, res) {
      expect(res.body).to.be.an('array');
      done();
    });
  });
});