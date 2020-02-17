var express = require('express');
var router = express.Router();
const {User} = require('../models/User');
const jwt = require('jsonwebtoken');

router.get('/', function(req, res){
    res.render('homePage');
});
router.get('/login', function(req, res){
    res.render('loginPage');
});
router.post('/registration', (req, res) => {
    let error = false;
    let errorM = "";
    User.find({username: req.body.username}).exec().then((result) => {
        if(result.length > 0){
            error = true;
            errorM = "Change username";
            throw error;
        }
        return User.find({email:req.body.email}).exec()
    }).then((result2) => {
        if(result2.length > 0){
            error = true;
            errorM = "E-mail exists";
            throw error;
        }
    }).then(() => {
        const user = new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email    
        })
        user.save().then((doc) => {
           res.json({status: true, message: "Nice to meet you"}); 
        })
    })
    .catch(() => {
        res.json({status: false, message: errorM});
    })
});
router.post('/login', (req, res) => {
    console.log(req.body);
    User.find({username: req.body.username, password: req.body.password}).exec().then((result) => {
        if(result.length !== 0) {
            const user = {
                username: result[0].username,
                email: result[0].email
            }
            jwt.sign({user}, 'secretkey', (err, token) => {
                res.json({ status: true, username: user.username, token: token });
            });
        }else {
            res.json({status: false, message: "Try again!!!"})
        }
    })
});

router.post('/verify', (req, res) => {
    jwt.verify(req.body.token, 'secretkey', (err, authData) => {
        if(err) {
          res.json({
            status: false
          })
        } else {
          res.json({
            status: true
          });
        }
    });
});

module.exports = router;