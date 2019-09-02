var app = require('../backend/server');
var chai = require('chai');
var request = require('supertest');

var expect = chai.expect;

describe('Registration Tests', function() {
	it('should return status 200 if email is valid and password is present', function(done) {
	  request(app)
	  .post('/api/register')
	  .send({email: 'Testuser', password: 'Test'})
	  .end(function(err, res) {
	    expect(res.statusCode).to.be.equal(200);
	    done();
	  });
	});
});