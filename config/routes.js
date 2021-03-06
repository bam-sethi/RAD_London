var express           = require('express');
var router            = express.Router();
var bodyParser        = require('body-parser');
var methodOverride    = require('method-override');
var mongoose          = require('mongoose');
var Histories         = require('../models/history');
var Place             = require('../models/place');
var User              = require('../models/user');

//TWITTER ROUTES
module.exports = function(app, passport) {

  app.get('/', function(req, res) {
    res.render('index.ejs', { user: req.user })
  });

  app.get('/places', function(req, res) {
    Place.find({}, function(err, places){
      if(err) console.log(err)
      res.render('places.ejs', { places: places, user: req.user }); 
    });
  });

  // route for showing the profile page
    app.get('/profile', isLoggedIn, function(req, res) {
      res.render('places.ejs', { user: req.user })
    });

        // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

  app.get('/auth/twitter', passport.authenticate('twitter', { scope: ['profile.photos','email'] }));

  app.get('/auth/twitter/callback', 
    passport.authenticate('twitter', {
      successRedirect: '/places',
      failureRedirect: '/'
    })
  )

  // app.get('/profile', function(req, res) {
  //   res.send("it's working")
  // });

  app.put('/places', isLoggedIn, function(req, res, next) {
      // return User.findById
      //if user exists grab user id and push place id in to user.places object
      // var placeId = JSON.stringify(req.body);

      var userId = req.user.id
      var placeId = req.body.places
      console.log('userid', userId)
      console.log('place id', placeId)

      User.findById(userId, function(err, user){
        if (err) console.log(err)
        Place.findById(placeId, function(err, place){
          if (err) console.log(err)
          user.places.push(place)
          user.save(function(err, savedUser){
            if (err) console.log(err)
            console.log(savedUser);
          })
        })
      })
  })


  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next();

    res.redirect('/')
  }
}

