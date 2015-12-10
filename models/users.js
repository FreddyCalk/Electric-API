// models/photos.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	ip: String,
	vote: String,
	src: String
})

module.exports = mongoose.model('users', userSchema)