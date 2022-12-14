var express = require('express');
var router = express.Router();
var passport = require('passport');
var BodyParser = require('body-parser');
// const cors=require('cors');
const User = require('../models/user');
const authenticate = require('../authenticate');
// const  cors  = require('../cors');
const nodemailer = require('nodemailer');
// router.use(cors())

router.use(BodyParser.json())
/* GET users listing. */

// router.put('/', (req,res,next) => {

// })

router.get('/login', function (req, res, next) {
  res.send('respond with a resource');
});

// router.post('/:userId', function (req, res, next) {
//   User.findById(req.user._id)
//   .then(user => {
//       user.createdColleges.push(college._id)
//       user.save()
//           .then(() => {
//               res.statusCode = 200;
//               res.setHeader('Content-Type', 'application/json');
//               res.json(college);
//           })
//   })
// });


router.post('/login', (req, res, next) => {

  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({ success: false, status: "Log in Unsuccessfull", err: info })
    }
    req.logIn(user, (err) => {
      if (err) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: false, status: "Log in Unsuccessfull", err: 'Could not log in user!' })
      }
      var token = authenticate.getToken({ _id: req.user._id });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ success: true, status: 'Login Successful!', user: user, token: token });
    })
  })(req, res, next)

})

router.get('/checkJWTtoken', (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err)
      return next(err);

    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({ status: 'jwt invalid!', success: false, err: info });
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({ status: 'jwt valid!', success: true, user: user });

    }
  })(req, res, next);
});

router.post('/signup', (req, res, next) => {
  User.register(new User({ username: req.body.username, firstName: req.body.firstName, lastName: req.body.lastName }),
    req.body.password, (err, user) => {

      if (err) {
        var error = new Error(err)
        console.log(error)
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.send({ success: false, status: 'Registration Unsuccessful!', err: err });
        return
      }
      else {

        user.save()
          .then(user => {


            passport.authenticate('local')(req, res, () => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({ success: true, status: 'Registration Successful!' });
            })

          }
          )
      }
    })
})


router.post('/:userId/follow', (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        if (user.followedColleges.indexOf(req.body.collegeId) === -1) {
          user.followedColleges.push(req.body.collegeId)
          user.save()
            .then((user) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(user);
            }, err => next(err))
        }
        else{
          user.followedColleges.pull(req.body.collegeId)
          user.save()
            .then((user) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(user);
            }, err => next(err))
        }
      }
    })
})

router.put('/:userId/unfollow', (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {

        user.followedColleges.pull(req.body.collegeId)
        user.save()
          .then((user) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(user);
          }, err => next(err))
      }
    })
})

router.get('/followedcolleges', authenticate.verifyUser, (req, res, next) => {

  User.findById(req.user._id)
    .then((user) => {
      res.statusCode = 200;
      res.json(user.followedColleges);

    }).catch((err) => next(err))
})

router.get('/createdcolleges', authenticate.verifyUser, (req, res, next) => {

  User.findById(req.user._id)
    .then((user) => {
      res.statusCode = 200;
      res.json(user.createdColleges);

    }).catch((err) => next(err))
})


router.post("/checkMail", (req, res, next) => {
  User.find({username: req.body.mail} )
    .then((user) => {
      if (user!="") {

        console.log(user)
        res.json(true);
      }
      else {
        res.json(false);
      }

    })
  
})

router.post("/getOtp", (req, res, next) => {


  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sourcecodefor@gmail.com",
      pass: "Source@#code"
    }
  })
  console.log(req.body.mail)
  const val = Math.floor(1000 + Math.random() * 9000);
  const option = {
    from: "sourcecodefor@gmail.com",
    to: req.body.mail,
    // to:"darshanparmar2002@gmail.com",
    subject: "Testing",
    text: " Otp  :   " + val,
  };

  transporter.sendMail(option, function (err, info) {
    if (err) {
      console.log("err")
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(val)
    }
  })


})

module.exports = router;
