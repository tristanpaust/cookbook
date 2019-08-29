/* Recipes */

const Recipe = require('../models/Recipe');

function storeRecipe(req,res) {
  const recipe = new Recipe({ 
    title: req.body.title, 
    image: req.body.image,
    servings: req.body.servings,
    origin: req.body.origin,
    formType: req.body.type,
    tags: req.body.tags,
    ingredients: req.body.ingredients,
    steps: req.body.steps
  });
  recipe.save(function(err) {
    if (err) {
      console.log(err);
      res.status(500).send("Error storing new recipe. Please try again.");
    } 
    else {
      res.status(200).send("New recipe successfully saved.");
    }
  });
}

function getRecipe(req, res) {
  const query = JSON.parse(req.query.q) || '';

  var search = [];

  if (query.searchString) {
    search.push({'title': {$regex: ".*" + query.searchString + ".*", '$options' : 'i'}});
  }
  if (query.recipeType) {
    search.push({'formType': {$regex: ".*" + query.recipeType + ".*", '$options' : 'i'}});
  }
  if (query.origin) {
    search.push({'origin': {$regex: ".*" + query.origin + ".*", '$options' : 'i'}});
  }
  if (query.tags.length) {
    search.push({'tags': { $all: query.tags }});
  }
  if (query.ingredients.length) {
    search.push({'ingredients.item': { $all: query.ingredients }});
  }

  if (query) {
    Recipe.find( 
        {
          $and:
            search
          }
      )
      .exec( function(err, recipeArray) {
        if (err) {
          res.status(500).send("Error finding the tag. Please try again later.")
        }
        else {
          res.send(recipeArray);
        }
      }
    )
  }
}

function getRecipeList(req, res) {
  Recipe.find( {} )
  .exec( function(err, recipeArray) {
    if (err) {
      res.status(500).send("Error finding the tag. Please try again later.")
    }
    else {
      res.send(recipeArray);
    }
  })
}

module.exports.storeRecipe = storeRecipe;
module.exports.getRecipe = getRecipe;
module.exports.getRecipeList = getRecipeList;

/***/