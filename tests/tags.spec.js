var app = require('../backend/server');
var chai = require('chai');
var request = require('supertest');

var expect = chai.expect;

describe('Save new tag', function() {
	it('should return a new tag', function(done) {
	  request(app)
    .post('/api/savetag')
	  .send({title: 'new tag'})
	  .end(function(err, res) {
	    expect(res.statusCode).to.be.equal(200);
      expect(res.body.title).to.be.equal('new tag');
      done();
	  });
	});
});

describe('Save new tag without title Error', function() {
  it('should return a 404 if something goes wrong', function(done) {
    request(app)
    .post('/api/savetag')
    .end(function(err, res) {
      expect(res.statusCode).to.be.equal(404);
      done();
    });
  });
});

describe('Find tags in database', function() {
  it('should return a list of stored tags', function(done) {
    request(app)
    .get('/api/searchtag')
    .end(function(err, res) {
      expect(res.body).to.be.an('array');
      done();
    });
  });
});