const express = require('express');
const router = express.Router();
const axios = require('axios');
const querystring = require('querystring');

const loginRoute = require('./loginRoute');
const getAllMatches = require('./matchesRoute').getAllMatches;
const getMatchesFromPage = require('./matchesRoute').getMatchesFromPage;


router.get('/', function(req, res) { res.send('index.html') });
router.post('/login', loginRoute);
router.post('/matches', getAllMatches);
router.post('/matchesFromPage', getMatchesFromPage);


module.exports = router;