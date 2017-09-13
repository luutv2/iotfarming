'use strict';
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var cfg = require("../../config/config");  

module.exports = (router, passport )=>{
// Register new users
router.post('/register', (req, res)=> {  
  if(!req.body.username || !req.body.password) {
    res.json({ success: false, message: 'Please enter email and password.' });
  } else {
    var newUser = new User({
      email: req.body.username,
      password: req.body.password
    });

    // Attempt to save the user
    newUser.save((err)=> {
      if (err) {
        return res.json({ success: false, message: 'That email address already exists.'});
      }
      res.json({ success: true, message: 'Successfully created new user.' });
    });
  }
});

router.post("/token", (req, res)=> {  
    if (req.body.email && req.body.password) {
        var email = req.body.email;
        var password = req.body.password;
        var user = User.find(function(u) {
            return u.email === email && u.password === password;
        });
        if (user) {
            var payload = {
                id: user.id
            };
            var token = jwt.encode(payload, cfg.jwtSecret);
            res.json({
                token: token
            });
        } else {
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(401);
    }
});

router.post('/authenticate', (req, res)=> {  
  console.log(req.body);
  User.findOne({
    email: req.body.username
  }, (err, user)=> {
    if (err) throw err;

    if (!user) {
      res.send({ success: false, message: 'Authentication failed. User not found.' });
    } else {
      // Check if password matches
      user.comparePassword(req.body.password, (err, isMatch)=> {
        if (isMatch && !err) {
          // Create token if the password matched and no error was thrown
          var token = jwt.sign(user, cfg.jwtSecret, {
            expiresIn: 10080 // in seconds
          });
          res.json({ success: true, token: 'JWT ' + token });
        } else {
          res.json({ success: false, message: 'Authentication failed. Passwords did not match.' });
        }
      });
    }
  });
});

router.post('/dashboard', passport.authenticate('jwt', { session: false }), (req, res)=> {  
  res.send('It worked! User id is: ' + req.user._id + '.');
}); 
}