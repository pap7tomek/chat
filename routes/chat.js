var express = require('express');
var router = express.Router();
const {User} = require('../models/User');
const jwt = require('jsonwebtoken');

router.get('/', function(req, res){
    res.render('chat');
});

module.exports = router;