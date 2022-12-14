var express = require('express');
const bodyParser = require('body-parser');
const Admin = require('../models/admin');
const cors = require('./cors');

var adminRouter = express.Router();

adminRouter.use(bodyParser.json());

// adminRouter.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); } )

adminRouter.get('/',cors.corsWithOptions, (req,res,next) => {
    Admin.find({})
    .then((admin) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json');
        res.json(admin);
    })
    .catch((err) => next(err))
});
adminRouter.post('/signup', (req, res, next) => {
    // Admin.create(new Admin({username: req.body.username, 
    //         password: req.body.password}))
    // .then(d => {
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type','apllication/json');
    //     res.json("Okay"); 
    // })
    // .catch(err => next(err))
    console.log(req.body)
    res.json("Okay"); 
      
})

adminRouter.post('/login', (req, res, next) => {
    Admin.findOne({username: req.body.username})
    .then((admin) => {
        console.log(admin)
        if(admin){
            if(admin.password === req.body.password){
                res.statusCode = 200;
                res.setHeader('Content-Type','apllication/json');
                res.json("login SuccessFully");
                return res;
            }
            else{
                res.statusCode = 403;
                res.json("incorrect password");
                return res;
            }
        }
        else{
            res.statusCode = 404;
            res.json("user does not exist");
            return res;
        }

    })
})

    module.exports = adminRouter; 