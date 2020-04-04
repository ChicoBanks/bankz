
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
  title: String,
  category: String,
  duration: String,
  director: String,
  year: Date,
  description: String
})

module.exports = mongoose.model('Movie', MovieSchema);