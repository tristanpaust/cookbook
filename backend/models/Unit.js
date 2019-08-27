const mongoose = require('mongoose');

const UnitSchema = new mongoose.Schema({
  title: { type: String, required: true},
});

module.exports = mongoose.model('Unit', UnitSchema);