'use strict';

var passport = require("passport");  
var passportJWT = require("passport-jwt");  
var User = require("../app/models/user");  
var cfg = require("./config.js");  
var ExtractJwt = passportJWT.ExtractJwt;  
var Strategy = passportJWT.Strategy;  

module.exports =  function(passport){
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = cfg.jwtSecret;    
    passport.use(new Strategy(opts, function(jwt_payload, done) {
        User.findOne({id: jwt_payload.id}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
        });
    }));        
}