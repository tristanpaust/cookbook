const mongoose = require('mongoose');

const Tag = require('./Tag');

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  tags: [Tag]
});

module.exports = mongoose.model('Recipe', RecipeSchema);