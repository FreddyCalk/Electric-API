var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Photo = require('../models/photos');
var Users = require('../models/users');

var mongoURL = 'mongodb://localhost:27017/cardb';
mongoose.connect(mongoURL);
var db;

/*Get home page*/
router.get('/photos/get', function (req, res, next) {
	Photo.find(function (err, photoResults){
		if(err){
			console.log(err);
		}else{
			res.json(photoResults);
		}
	})
})

router.post('/photos/post',function (req, res, next){
	var photo = new Photo();
	photo.year = req.body.year;
	photo.make = req.body.make;
	photo.model = req.body.model;
	photo.src = req.body.src;
	photo.totalVotes = 0;

	photo.save(function (err){
		if(err){
			console.log(err)
		}else{
			res.json({message: 'Photo added!'});
		}
	})
})

router.post('/photos/update', function (req, res, next){
	Photo.findById(req.query._id, function (err, photoResult){
		if(err){
			console.log(err)
		}else{
			photoResult.src = req.query.src;
			photoResult.save(function (err){
				if(err){
					console.log(err)
				}else{
					res.json({message: "Photo was updated!"})
				}
			})
		}
	})
});

router.delete('/photos/delete', function (req, res, next){
	Photo.remove({
		_id: req.params.photo_id
	}, function (err, photo){
		if(err){
			console.log(err)
		}else{
			res.json({message: "Photo Removed!"})
		}
	})
});

router.get('/users/get', function (req, res, next) {
	Users.find(function (err, userResults){
		if(err){
			console.log(err);
		}else{
			res.json(userResults);
		}
	})
})
	
module.exports = router;
