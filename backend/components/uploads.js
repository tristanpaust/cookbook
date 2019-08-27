/* Upload */

const express = require('express');
const multer = require('multer');
const app = express();

var storage = multer.diskStorage({
        destination: '../../public/users',
        filename: function (req, file, cb) {
          cb(null, file.originalname);
        }
    });

var upload = multer({storage: storage});

app.use(upload.single('image'));

function uploadImage(req, res) {
  res.send(res.req.file);  
}

module.exports.uploadImage = uploadImage;

/***/