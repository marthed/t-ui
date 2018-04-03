const app = require('./app');
var fs = require('fs');
var https = require('https');
var privateKey = fs.readFileSync('./server/ssl/server.key');
var certificate = fs.readFileSync('./server/ssl/server.crt');

app.set('port', process.env.PORT || 7777);

const server = https.createServer({
  key: privateKey,
  cert: certificate
}, app).listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});