// models/photos.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var photoSchema = new Schema({
	year: Number,
	make: String,
	model: String,
	src: String,
	totalVotes: Number
})

module.exports = mongoose.model('cars', photoSchema)