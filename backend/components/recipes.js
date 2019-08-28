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
console.log(query);
console.log(query.tags);
console.log(query.ingredients);

  if (query) {
    Recipe.find( 
        {
          $and:[
            {'title': {$regex: ".*" + query.searchString + ".*", '$options' : 'i'}},
            {'formType': {$regex: ".*" + query.recipeType + ".*", '$options' : 'i'}},
            {'origin': {$regex: ".*" + query.origin + ".*", '$options' : 'i'}},
            {'tags': { $all: query.tags }},
          ]}
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