var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var jwtStrategy = require('passport-jwt').Strategy;
var extractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var config = require('./config');
const Colleges = require('./models/college');


passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey, { expiresIn: 360000 });
}
var opts = {};
opts.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use('jwt', new jwtStrategy(opts,
    (jwt_payload, done) => {
        User.findOne({ _id: jwt_payload._id }, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        })
    }))



exports.verifyCollegeAdmin = function (req, res, next) {
    Colleges.findById(req.params.collegeId)
    .then(college => {
        console.log(college,req.params.collegeId);
        if (req.user._id == college.admin) {

            return next();
    
        }
        else {
            // console.log(userId === collegeAdmin + userId + "    " + collegeAdmin)
            res.statusCode = 403;
            res.setHeader("Content-Type", "application/json")
            res.json("Only Admin can perform this operation");
            return res;
        }
    })
    
}

exports.verifyUser = passport.authenticate('jwt', { session: false });
