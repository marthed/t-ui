const express = require('express');
const router = express.Router();

const loginRoute = require('./loginRoute/loginRoute');
const confirmLogin = require('./loginRoute/confirmRoute');
const { getAllMatchesFromTinder, getMatchFromId, sendMessage, validateClientRequest, syncMatchesFromTinderPage } = require('./matchesRoute/matchesRoute');
const { getMetaData } = require('./metaRoute/metaRoute');

router.get('/', function(req, res) { res.send('index.html') });
router.post('/login', loginRoute);
router.post('/login/confirm', confirmLogin);
//router.use('/matches/*', validateClientRequest);
router.post('/matches', getAllMatchesFromTinder);
router.post('/matches/syncMatchesFromPage/', syncMatchesFromTinderPage);
router.get('/matches/:matchId', getMatchFromId);
router.post('/matches/:matchId/sendMessage', sendMessage);
router.get('/meta', getMetaData);
// router.get('/message/id:messageId')


module.exports = router;