const express = require('express');
const router = express.Router();
const axios = require('axios');
const querystring = require('querystring');

const loginRoute = require('./loginRoute/loginRoute');
const confirmLogin = require('./loginRoute/confirmRoute');
const getAllMatches = require('./matchesRoute/matchesRoute').getAllMatchesFromTinder;
const getMatchesFromTinderPage = require('./matchesRoute/matchesRoute').getMatchesFromTinderPage;


router.get('/', function(req, res) { res.send('index.html') });
router.post('/login', loginRoute);
router.post('/login/confirm', confirmLogin);
router.post('/matches', getAllMatches);
router.post('/matchesFromPage', getMatchesFromTinderPage);


module.exports = router;