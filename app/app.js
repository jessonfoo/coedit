'use strict'
require('dotenv').load();
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();

var routes = require('../server/routes/index');

// Set static files
app.use(express.static('../app'));
app.use(express.static('../.tmp'));
app.use('/bower_components', express.static(path.dirname(__dirname) + '/bower_components'));

app.use(bodyParser.json());

// Set routes
app.use('/', routes);
app.set('app', path.join(__dirname, 'app'));
app.set('port', process.env.PORT || 3000);

var server = app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
