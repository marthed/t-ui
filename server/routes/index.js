const express = require('express');
const router = express.Router();
const axios = require('axios');
const querystring = require('querystring');

const loginRoute = require('./loginRoute');
const getAllMatches = require('./matchesRoute').getAllMatches;


router.get('/', function(req, res) { res.send('index.html') });
router.get('/login', loginRoute);
router.post('/matches', getAllMatches);


module.exports = router;