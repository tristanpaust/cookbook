var app = require('../backend/server');
var chai = require('chai');
var request = require('supertest');

var expect = chai.expect;

describe('Save new Recipe', function() {
	it('should return a new ingredient', function(done) {
	  request(app)
    .post('/api/saverecipe')
	  .send({title: 'new recipe', image: 'path to image', servings: 4, origin: 'countryname', formType: 'what food is it', tags: ["asdjl321213", "asjdlj3412"], ingredients: ["ljlkj4312as", "aopiqwo1231"], steps: ["step1", "step2", "step3"]})
	  .end(function(err, res) {
	    expect(res.statusCode).to.be.equal(200);
      done();
	  });
	});
});

describe('Save new Recipe Error', function() {
  it('should return a 404', function(done) {
    request(app)
    .post('/api/saverecipe')
    .end(function(err, res) {
      expect(res.statusCode).to.be.equal(404);
      done();
    });
  });
});

describe('Look up recipes by some of their attributes', function() {
  it('should return a filtered list of recipes', function(done) {
    request(app)
    .get('/api/searchrecipe')
    .end(function(err, res) {
      expect(res.body).to.be.an('array');
      done();
    });
  });
});


describe('Get a list of all recipes from the database', function() {
  it('should return a list of stored recipes', function(done) {
    request(app)
    .get('/api/recipelist')
    .end(function(err, res) {
      expect(res.body).to.be.an('array');
      done();
    });
  });
});