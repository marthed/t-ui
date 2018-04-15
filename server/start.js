const app = require('./app');
var fs = require('fs');
var https = require('https');

app.set('port', process.env.PORT || 7777);
app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${app.get('port')}`);
});

