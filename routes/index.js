var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Cars = require('../models/photos');
var Users = require('../models/users');

var mongoURL = 'mongodb://localhost:27017/cardb';
mongoose.connect(mongoURL)
var db;


/* GET home page. */
	router.get('/', function (req, res, next) {
		var currIP = req.ip;
			Users.find({ip:currIP}, function (error, userResult){
				var photosVoted = [];
				for(i=0;i<userResult.length;i++){
					photosVoted.push(userResult[i].src);
				}
				Cars.find({src : {$nin:photosVoted}},function (error, result){
					if(result.length == 0){
						// redirect to the thanks page
						res.render('thanks', {})
					}else{
						var rand = Math.floor(Math.random()*result.length);

						res.render('index', { photo: result[rand] })
					}
				});
			});
		// Index page should load random picture/item
		// 1. Get all pictures from the MongoDB
		// 2. Get the current user from MongoDB via req.ip;
		// 3. Find which photos the current user has NOT voted on
		// 4. Load all of those photos into an array.
		// 5. Choose a random image from the array, and set it to a var.
		// 6. res.render() the index view and send it the photo.

	})
	router.get('/favorites', function (req, res, next){
			Users.find({vote: 'favorites'}, function (error, result){
				res.render('favorites',{title: "Standings", photos : result})
			})
		// 1. get all the photos
		// 2. sort them by most likes
		// 3. res.render the standings view and pass it the sorted photo array.
	})
	router.get('/list', function (req, res, next){
			Cars.find(function (error, result){
				result.sort(function (p1, p2){
					return (p2.totalVotes - p1.totalVotes);
				})
				res.render('list',{photos : result})
			})
	})
	router.get('/losers', function (req, res, next){
			Users.find({vote: 'pass'},function (error, result){
				res.render('losers',{photos : result});
			})
	})

	router.get('/add', function (req, res, next){
		res.render('add',{});
	})

router.post('/add', function (req,res,next){
		Cars.insertOne({
			year: req.body.year,
			make: req.body.make,
			model: req.body.model,
			src: req.body.src,
			totalVotes: 0
		})
	res.redirect('/');
})

router.post('/favorites', function (req, res, next){
	if(req.url == '/favorites'){
		var page = 'favorites';
	}else if(req.url == '/losers'){
		var page = 'losers';
	}else{
		res.redirect('/');
	}
		Cars.find({src: req.body.src},function (error, result){
			var updateVotes = function (db, votes, callback){
				if(page =='favorites'){var newVotes = votes + 1;}
				else if(page == 'losers'){var newVotes = votes;}

				Cars.updateOne(
					{ "src" : req.body.src },
					{
						$set: {"totalVotes": newVotes},
						$currentDate: {"lastModified":true}
					}, function (err, result){
						callback()
					})
			};
				updateVotes(db,result[0].totalVotes, function(){});
		})
			Users.insertOne({
				ip: req.ip,
				vote: req.body.vote,
				year: req.body.year,
				make: req.body.make,
				model: req.body.model,
				src: req.body.src
			})

	res.redirect('/')
})





module.exports = router;
