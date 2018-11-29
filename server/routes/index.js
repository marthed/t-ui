const express = require('express');
const router = express.Router();

const loginRoute = require('./loginRoute/loginRoute');
const confirmLogin = require('./loginRoute/confirmRoute');
const getAllMatches = require('./matchesRoute/matchesRoute').getAllMatchesFromTinder;
const getMatchesFromTinderPage = require('./matchesRoute/matchesRoute').getMatchesFromTinderPage;
const getMatchFromId = require('./matchesRoute/matchesRoute').getMatchFromId;
const sendMessage = require('./matchesRoute/matchesRoute').sendMessage;

router.get('/', function(req, res) { res.send('index.html') });
router.post('/login', loginRoute);
router.post('/login/confirm', confirmLogin);
router.post('/matches', getAllMatches);
router.post('/matchesFromPage', getMatchesFromTinderPage);
router.get('/matches/:matchId', getMatchFromId);
router.post('/matches/:matchId/sendMessage', sendMessage);
// router.get('/message/id:messageId')


module.exports = router;