var express = require('express');
var router = express.Router();
const withAuth = require('./middleware');

/* Backend components */
const auth = require('./src/backend/auth.js');
const home = require('./src/backend/home.js');
const ingredients = require('./src/backend/ingredients.js');
const tags = require('./src/backend/tags.js');
const units = require('./src/backend/units.js');
const uploads = require('./src/backend/uploads.js');
const recipes = require('./src/backend/recipes.js');
/***/

router.use(function(req, res, next) {
  next();
});

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


/* Home */

router.get('/api/home', function(req, res) {
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

router.get('/checkToken', withAuth, function(req, res) {
  auth.checkToken(req, res);
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

router.post('/api/saveingredient', function(req, res) {
  ingredients.storeIngredient(req, res);
});

router.get('/api/searchingredient', function(req, res) {
  ingredients.getIngredient(req, res);
});

router.get('/api/ingredientlist', withAuth, function(req, res) {
  ingredients.getIngredientList(req,res);
});
/***/



/* Units */

router.post('/api/saveunit', function(req, res) {
  units.storeUnit(req, res);
});

router.get('/api/searchunit', function(req, res) {
  units.getUnit(req, res);
});

/***/



/* Upload */

router.post('/api/upload', function (req, res) {
  uploads.uploadImage(req, res);  
});

/***/



/* Recipes */

router.post('/api/saverecipe', function(req, res) {
  recipes.storeRecipe(req, res);
});


router.get('/api/recipelist', withAuth, function(req, res) {
  recipes.getRecipeList(req, res);
});

/***/

module.exports = router;