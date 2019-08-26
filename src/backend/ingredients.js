/* Ingredients */

const Ingredient = require('../../models/Ingredient');

function storeIngredient(req,res) {
  const { title } = req.body;
  const ingredient = new Ingredient({ title });
  ingredient.save(function(err) {
    if (err) {
      console.log(err);
      res.status(500).send("Error storing new ingredient. Please try again.");
    } 
    else {
      res.send(ingredient);
    }
  });
}

function getIngredient(req,res) {
  const query = req.query.q || '';
  if (query) {
    Ingredient.find( {'title': {$regex: ".*" + query + ".*", '$options' : 'i'}} )
      .exec( function(err, ingredientArray) {
        if (err) {
          res.status(500).send("Error finding the tag. Please try again later.")
        }
        else {
          res.send(ingredientArray);
        }
      }
    )
  }
}

function getIngredientList(req, res) {
  res.send('The password is onion');
}

module.exports.storeIngredient = storeIngredient;
module.exports.getIngredient = getIngredient;
module.exports.getIngredientList = getIngredientList;
/***/