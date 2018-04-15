const app = require('./app');
var fs = require('fs');
var https = require('https');
var privateKey = fs.readFileSync('./server/ssl/server.key');
var certificate = fs.readFileSync('./server/ssl/server.crt');

app.set('port', process.env.PORT || 7777);

const certs = app.get('port') === 7777 ? 
  {
    key: privateKey,
    cert: certificate
  } : null;
<<<<<<< HEAD
if (certs) {
  const server = https.createServer(certs, app).listen(app.get('port'), () => {
    console.log(`Express running → PORT ${server.address().port}`);
  });
}
else {
  app.listen(app.get('port'), () => {
    console.log(`Express running → PORT ${app.get('port')}`);
  });
}

=======

const server = https.createServer(certs, app).listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
>>>>>>> bc3f7633993020fc4f122438522ee68822ee7eeb
