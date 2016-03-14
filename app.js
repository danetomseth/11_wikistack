'use strict'
var express = require( 'express' );
var bodyParser = require('body-parser');
var app = express();
var swig = require('swig');
require('./filters')(swig);
var routes = require('./routes/');
var wikiRouter = require('./routes/wiki')
var morgan = require('morgan');
var fs = require('fs');
var path = require('path');
var mime = require('mime');





// templating boilerplate setup
app.set('views', path.join(__dirname, '/views')); // where to find the views
app.set('view engine', 'html'); // what file extension do our templates have
app.engine('html', swig.renderFile); // how to render html templates
swig.setDefaults({ cache: false });


app.use(bodyParser.urlencoded({ extended: true })); // for HTML form submits
app.use(bodyParser.json()); // would be for AJAX requests
app.use(morgan('dev'));
app.use('/wiki/', wikiRouter);
//app.use('/', routes);

app.use(function(request, response, next) {
	console.log(request.method + request.url);
	next();
});



app.use(express.static(path.join(__dirname, '/public')));

app.listen(3000);