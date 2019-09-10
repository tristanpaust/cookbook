const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors')
const fs = require('fs');
const router = require('./routes');
const multer = require('multer');
const passport = require('passport')
const app = express();

var env = process.env.NODE_ENV || 'development';
var config = require('../config')[env];

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
}

app.use(passport.initialize());
require('./passport-config')(passport);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(cors(corsOptions))


const mongo_uri = 'mongodb+srv://' + config.database.user + ':' + config.database.password + config.database.url;
const opts = { useNewUrlParser: true };

mongoose.connect(mongo_uri, opts, function(err) {
  if (err) { 
  	return console.error('failed');
  }
}); 

app.use(express.static(path.join(__dirname, 'public')));

app.use(router);

var storage = multer.diskStorage({
        destination: './public/users',
        filename: function (req, file, cb) {
          cb(null, file.originalname);
        }
    });

var upload = multer({storage: storage});

app.use(upload.single('image'));

app.post('/api/upload', function (req, res) {
  res.send(res.req.file);  
});

module.exports = app.listen(process.env.PORT || 8080);