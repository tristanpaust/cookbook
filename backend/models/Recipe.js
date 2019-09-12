const mongoose = require('mongoose');

const Tag = require('./Tag');

const RecipeSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  description: { type: String, required: true},
  servings: { type: Number, required: true },
  origin: { type: String, required: true },
  formType: { type: String, required: true },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' , required: true }],
  ingredients: [
  	{
  		amount: { type: Number, required: true },
  		unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' },
  		item: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient', required: true }
  	}
  ],
  steps: { type: String, required: true }
});

module.exports = mongoose.model('Recipe', RecipeSchema);