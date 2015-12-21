var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Cars = require('../models/photos');
var Users = require('../models/users');

var mongoURL = process.env.MONGOLAB_URI || process.eng.MONGOHQ_URL || 'mongodb://localhost:27017/cardb';

var db = mongoose.createConnection(mongoURL);


/* GET home page. */
	router.get('/', function (req, res, next) {
		var currIP = req.ip;
		var photosVoted = []
			Users.find({ip:currIP}, function (error, userResult){
				for(i=0;i<userResult.length;i++){
					photosVoted.push(userResult[i].src)
				}
				console.log(photosVoted)
				Cars.find({src : {$nin : photosVoted}}, function (error, result){
					console.log(result)
					if(result.length == 0){
						res.render('thanks', {})
					}else{
						var rand = Math.floor(Math.random() * result.length);

						res.render('index', { photo: result[rand] })
					}
				});
			});

	})
	router.get('/favorites', function (req, res, next){
			Users.find({vote: 'favorites'}, function (error, result){
				res.render('favorites',{ photos : result})
			})
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
		var newCar = new Cars({ 
			year: req.body.year,
			make: req.body.make,
			model: req.body.model,
			src: req.body.src,
			totalVotes: 0
		})
		newCar.save(function (err, data){})
	res.redirect('/');
})

router.post('*', function (req, res, next){
	if(req.url == '/favorites'){
		var page = 'favorites';
	}else if(req.url == '/losers'){
		var page = 'losers';
	}else{
		res.redirect('/');
	}
		Cars.find({src: req.body.src},function (error, result){
			var updateVotes = function (db, votes, callback){
				if(page === 'favorites'){
					var newVotes = votes + 1;
				}else if(page === 'losers'){
					var newVotes = votes;
				}

				Cars.update(
					{ "src" : req.body.src },
					{
						$set: {"totalVotes": newVotes}
					}, function (err, result){
						callback()
					})
			};
				updateVotes(db,result[0].totalVotes, function(){});
		})
			var newCar = new Users({
				ip: req.ip,
				vote: req.body.vote,
				year: req.body.year,
				make: req.body.make,
				model: req.body.model,
				src: req.body.src
			})
			newCar.save(function (err, data){
			})

	res.redirect('/')
})

module.exports = router;
