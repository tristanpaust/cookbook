var express = require('express');
var router = express.Router();
const withAuth = require('../middleware');

/* Backend components */
const auth = require('./components/auth.js');
const home = require('./components/home.js');
const ingredients = require('./components/ingredients.js');
const tags = require('./components/tags.js');
const units = require('./components/units.js');
const recipes = require('./components/recipes.js');
/***/

const passport = require('passport');

router.use(function(req, res, next) {
  if (req.body) console.info(req.body);
  if (req.params) console.info(req.params);
  if(req.query) console.info(req.query);
  console.info(`Received a ${req.method} request from ${req.ip} for ${req.url}`);
  next();
});

router.get('/', function (req, res) {
  console.log(req.user);
  res.sendFile(path.join(__dirname, 'public', '../frontend/index.html'));
});


/* Home */

router.get('/api/home', passport.authenticate('jwt', { session: false }), function(req, res) { console.log('user', req.user)
  home.getGreeting(req, res);
});

/***/


/* Authentication*/

router.post('/api/register', function(req, res) {
  auth.signup(req,res);
});

router.post('/api/authenticate', function(req, res) {
  auth.auth(req,res);
});

router.get('/api/getcurrentuser', passport.authenticate('jwt', { session: false }), function(req, res) {
  auth.getCurrentUser(req,res);
});

/***/


/* Tags */

router.post('/api/savetag', function(req, res) {
  tags.storeTag(req,res);
});

router.get('/api/searchtag', function(req, res) {
  tags.getTag(req,res);
});

/***/



/* Ingredients */

router.post('/api/saveingredient', passport.authenticate('jwt', { session: false }), function(req, res) {
  ingredients.storeIngredient(req, res);
});

router.get('/api/searchingredient', passport.authenticate('jwt', { session: false }), function(req, res) {
  ingredients.getIngredient(req, res);
});

router.get('/api/ingredientlist', passport.authenticate('jwt', { session: false }), function(req, res) {
  ingredients.getIngredientList(req,res);
});
/***/



/* Units */

router.post('/api/saveunit', passport.authenticate('jwt', { session: false }), function(req, res) {
  units.storeUnit(req, res);
});

router.get('/api/searchunit', passport.authenticate('jwt', { session: false }), function(req, res) {
  units.getUnit(req, res);
});

/***/

/* Recipes */

router.post('/api/saverecipe', passport.authenticate('jwt', { session: false }), function(req, res) {
  recipes.storeRecipe(req, res);
});

router.get('/api/searchrecipe', passport.authenticate('jwt', { session: false }), function(req, res) {
  recipes.getRecipe(req, res);
});

router.get('/api/recipelist', passport.authenticate('jwt', { session: false }), function(req, res) {
  recipes.getRecipeList(req, res);
});

router.get('/api/getrecipebyid', passport.authenticate('jwt', { session: false }), function(req, res) {
  recipes.getRecipeById(req, res);
});

/***/

module.exports = router;