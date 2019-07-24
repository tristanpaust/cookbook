const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema({
  ingredient: { type: String },
});

module.exports = mongoose.model('User', IngredientSchema);