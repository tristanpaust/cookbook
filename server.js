const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const withAuth = require('./middleware');

const app = express();

var env = process.env.NODE_ENV || 'development';
var config = require('./config')[env];
const secret = config.secret;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

/* Models */
const User = require('./models/User');
const Tag = require('./models/Tag');

const mongo_uri = 'mongodb+srv://' + config.database.user + ':' + config.database.password + '@cluster0-xt4o2.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(mongo_uri, { useNewUrlParser: true }, function(err) {
  if (err) {
    throw err;
  } else {
    console.log(`Successfully connected to ${mongo_uri}`);
  }
});

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/home', function(req, res) {
  res.send('Welcome!');
});

app.get('/api/recipelist', withAuth, function(req, res) {
  res.send('The password is potato');
});

app.get('/api/ingredientlist', withAuth, function(req, res) {
  res.send('The password is onion');
});

app.post('/api/register', function(req, res) {
  const { email, password } = req.body;
  const user = new User({ email, password });
  user.save(function(err) {
    if (err) {
      console.log(err);
      res.status(500).send("Error registering new user please try again.");
    } else {
      res.status(200).send("Welcome to the club!");
    }
  });
});

app.post('/api/authenticate', function(req, res) {
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
});

app.get('/checkToken', withAuth, function(req, res) {
  res.sendStatus(200);
});


/* Tags */

app.post('/api/savetag', function(req, res) {
  const { title } = req.body;
  const tag = new Tag({ title });
  tag.save(function(err) {
    if (err) {
      console.log(err);
      res.status(500).send("Error storing new tag. Please try again.");
    } 
    else {
      res.status(200).send("Tag is saved!");
    }
  });
});

app.get('/api/searchtag', function(req, res) {
  const query = req.query.q || '';
  console.log(query);
  if (query) {
      Tag.find( {'title': {$regex: ".*" + query + ".*", '$options' : 'i'}})
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
});

/***/

app.listen(process.env.PORT || 8080);
