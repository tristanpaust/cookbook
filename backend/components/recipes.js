/* Recipes */

const Recipe = require('../models/Recipe');

function storeRecipe(req,res) { console.log("GETTING HERE >>>>>");
  if (!req.body.title || !req.body.description || !req.body.servings || !req.body.origin || !req.body.type || !req.body.tags || !req.body.ingredients || !req.body.steps) {
    console.log("Are we ending it here?");
    return res.status(404).send("Error. Recipe incomplete.");
  }

  const recipe = new Recipe({ 
    title: req.body.title, 
    image: req.body.image,
    description: req.body.description,
    servings: req.body.servings,
    origin: req.body.origin,
    formType: req.body.type,
    tags: req.body.tags,
    ingredients: req.body.ingredients,
    steps: req.body.steps
  });
  console.log('getting here!', recipe);
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

function getRecipeById(req, res) {
  const query = req.query.q;
  
  if (!query) {
    return res.status(404).send("No ID to search for. Please try again later.")
  }

  Recipe.find({'_id': req.query.q})
  .populate('tags')
  .populate({
      path: 'ingredients.unit',
      model: 'Unit'
  })
  .populate({
      path: 'ingredients.item',
      model: 'Ingredient'
  })
  .exec( function(err, result) {
    if (err) {
      res.status(500).send("Error finding recipe by id. Please try again later.")
    }
    else {
      res.send(result);
    }
  })
}

module.exports.storeRecipe = storeRecipe;
module.exports.getRecipe = getRecipe;
module.exports.getRecipeList = getRecipeList;
module.exports.getRecipeById = getRecipeById;
/***/