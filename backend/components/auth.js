/* Auth */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

var env = process.env.NODE_ENV || 'development';
var config = require('../../config')[env];
const secret = config.secret;

function signup(req, res) {
  const { email, password } = req.body;
  
  if (!req.body || !email || !password) {
    return res.status(500).send("Email or password is missing.");
  }

  const user = new User({ email, password });
  
  user.save(function(err) {
    if (err) {
      console.log(err);
      res.status(500).send("Error registering new user please try again.");
    } else {
      res.status(200).send("Welcome to the club!");
    }
  });
}

function auth(req, res) {
  const { email, password } = req.body;
  User.findOne({ email }, function(err, user) {
    if (err) {
      console.error(err);
      res.status(500)
        .json({
        error: 'Internal error please try again'
      });
    } else if (!user) {
      res.status(401)
        .json({
        error: 'Incorrect email or password'
      });
    } else {
      user.isCorrectPassword(password, function(err, same) {
        if (err) {
          res.status(500)
            .json({
            error: 'Internal error please try again'
          });
        } else if (!same) {
          res.status(401)
            .json({
            error: 'Incorrect email or password'
          });
        } else {
          // Issue token
          const payload = { email };
          const token = jwt.sign(payload, secret, {
            expiresIn: '1h'
          });
          res.cookie('token', token, { httpOnly: true }).sendStatus(200);
        }
      });
    }
  });
}

function checkToken(req, res) {
  res.sendStatus(200);
}

module.exports.signup = signup
module.exports.auth = auth;
module.exports.checkToken = checkToken;
/***/