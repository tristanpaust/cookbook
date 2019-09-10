const passport = require('passport');
const bcrypt = require('bcrypt');

var env = process.env.NODE_ENV || 'development';
var config = require('../config')[env];

const User = require('./models/User');

const {Strategy, ExtractJwt} = require('passport-jwt');
const mongoose = require('mongoose');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secret
};

module.exports = passport => {
  passport.use(
    new Strategy(opts, (payload, done) => {
      User.findById(payload.id)
        .then(user => {
          if(user){
            return done(null, {
              id: user.id,
              username: user.username,
              email: user.email,
            });
          }
          return done(null, false);
        }).catch(err => console.error(err));
    })
  );
};