/* Unit */

const Unit = require('../models/Unit');

function storeUnit(req,res) {
  const { title } = req.body;
  const unit = new Unit({ title });
  unit.save(function(err) {
    if (err) {
      console.log(err);
      res.status(500).send("Error storing new unit. Please try again.");
    } 
    else {
      res.send(unit);
    }
  });
}

function getUnit(req,res) {
  const query = req.query.q || '';
  if (query) {
      Unit.find( {'title': {$regex: ".*" + query + ".*", '$options' : 'i'}} )
      .exec( function(err, unitArray) {
        if (err) {
          res.status(500).send("Error finding the tag. Please try again later.")
        }
        else {
          res.send(unitArray);
        }
      }
    )
  }
}

function getIngredientList(req, res) {
  res.send('The password is onion');
}

module.exports.storeUnit = storeUnit;
module.exports.getUnit = getUnit;

/***/