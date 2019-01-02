var express = require('express');
var bodyParser = require('body-parser');
var router = require('./routes/index');
var path = require('path');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((err, req, res, next) => {
  if (!err) return next();
  console.log('ERROR: ', err);
  return res.status(500).send({ message: err.message });
});

console.log(path.join(__dirname, '/../public'));
app.use(express.static(path.join(__dirname, '/../public')));

app.use('/', router);

module.exports = app;
