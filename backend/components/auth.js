/* Auth */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passport = require('passport');


const User = require('../models/User');
var env = process.env.NODE_ENV || 'development';
var config = require('../../config')[env];
const secret = config.secret;

function signup(req, res) {
User.findOne({email: req.body.email})
  .then(user => {
    if (user) {
      let error = 'Email Address Exists in Database.';
      return res.status(400).json(error);
    } 
    else {
      const newUser = new User({
        username: req.body.email,
        email: req.body.email,
        password: req.body.password
    });
    newUser.save()
      .then(user => res.json(user))
      .catch(err => res.status(400).json(err));
    }
  });
}

function auth(req, res) {
  const email = req.body.email;
  const password = req.body.password;   
  User.findOne({ email })
    .then(async user => {
      if (!user) {
        errors.email = "No Account Found";
        return res.status(404).json(errors);
      }

    const validate = await user.isValidPassword(password);
    if( !validate ) {
      return done(null, false, { message : 'Wrong Password'});
    }

     
            const payload = {
              id: user._id,
              username: user.username
            };
            jwt.sign(payload, secret, { expiresIn: 36000 }, (err, token) => {
              if (err) res.status(500)
                .json({ error: "Error signing token", raw: err }); 
                res.json({ 
                  success: true,
                  token: `Bearer ${token}` 
                });
            });      
          }) 
}

function getCurrentUser(req, res) {
  let userID = req.user.id;
  User.findOne({_id: userID}, function(err, result) {
  if (err) {
      res.json(err)
    }
    else {
      res.json(result)
    }
  })
}

function getPopulatedCurrentUser(req, res) {
  let userID = req.user.id;  
  User.findOne({_id: userID})
  .populate({
      path: 'favorites',
      model: 'Recipe'
  })  
  .populate({
      path: 'author',
      model: 'Recipe'
  })
  .exec( function(err, result) {
    if (err) {
      res.json(err)
    }
    else {
      res.send(result);
    }
  })
}

function addFavorite(req, res) {
  var userID = req.user.id;
  var recipeID = req.body.recipeID

  User.updateOne({_id: userID}, { $addToSet: { "favorites": recipeID }}, 
    function(err, result) {
        if (err) {
          res.status(500).json(err);
          }
        else {
          res.status(200);
         }   
    });
}

function removeFavorite(req, res) {
  var userID = req.user.id;
  var recipeID = req.body.recipeID

  User.updateOne({_id: userID}, { $pull: { "favorites": recipeID }}, 
    function(err, result) {
        if (err)
            res.status(500).json(err);
        else
            res.status(200);
    });
}

function addAuthor(req, res) {
  let userID = req.user.id;
  let recipeID = req.body.recipeID;

  User.updateOne({ _id: userID}, { $addToSet: { "author": recipeID }},
    function(err, result) {
      if (err) {
        res.status(500).json(err);
      }
      else {
        res.status(200).send(result);
      }
    });
}

function changeUsername(req, res) {
  let userID = req.user.id;
  let newUsername = req.body.newUsername;
  User.updateOne({ _id: userID}, { username: newUsername },
    function(err, result) {
      if (err) {
        res.status(500).json(err);
      }
      else {
        res.status(200).send(result);
      }
    }
  );
}

function changePassword(req, res) {
  let userID = req.user.id;
  let newPassword = req.body.newPassword;
  User.findOne({ _id: userID})
      .then(user => {
        user.password = newPassword;
        user.save()
          .then(user => res.json(user))
          .catch(err => res.status(400).json(err));
      });
}

function changeMail(req,res) {
  let userID = req.user.id;
  let newMail = req.body.newMail;
  User.updateOne({ _id: userID}, { email: newMail },
    function(err, result) {
      if (err) {
        res.status(500).json(err);
      }
      else {
        res.status(200).send(result);
      }
    }
  );
}

module.exports.signup = signup
module.exports.auth = auth;
module.exports.getCurrentUser = getCurrentUser;
module.exports.getPopulatedCurrentUser = getPopulatedCurrentUser;
module.exports.addFavorite = addFavorite;
module.exports.removeFavorite = removeFavorite;
module.exports.addAuthor = addAuthor;
module.exports.changeUsername = changeUsername;
module.exports.changePassword = changePassword;
module.exports.changeMail = changeMail;

/***/