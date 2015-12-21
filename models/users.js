// models/photos.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	vote: String,
	year: String,
	make: String,
	model: String,
	ip: String,
	src: String,
	vote: String
	
})

module.exports = mongoose.model('users', userSchema)