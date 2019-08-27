/* Tags */

const Tag = require('../models/Tag');

function storeTag(req,res) {
  const { title } = req.body;
  const tag = new Tag({ title });
  tag.save(function(err) {
    if (err) {
      console.log(err);
      res.status(500).send("Error storing new tag. Please try again.");
    } 
    else {
      res.send(tag);
    }
  });
}

function getTag(req,res) {
  const query = req.query.q || '';
  if (query) {
      Tag.find( {'title': {$regex: ".*" + query + ".*", '$options' : 'i'}} )
      .exec( function(err, tagArray) {
        if (err) {
          res.status(500).send("Error finding the tag. Please try again later.")
        }
        else {
          res.send(tagArray);
        }
      }
    )
  }
}

module.exports.storeTag = storeTag;
module.exports.getTag = getTag;
/***/