var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var schedule = require('node-schedule');

var routes = require('./routes/index');
var api = require('./routes/api');
var grafica = require('./routes/grafica');
var jobs = require('./public/scripts/jobs');

var app = express();
//Disparador de jobs
var j = schedule.scheduleJob('*/1 * * * *', function(){
  var now = Date.now();
  //console.log('Voy a generar jobs!' +  new Date(now));
  jobs.obtener_jobs();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.enable('trust proxy');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('stylus').middleware({
  src: path.join(__dirname, 'public'),
  compress: true
}));
// Enable CORS for express: http://stackoverflow.com/a/11182153/1174245
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

/// helpers
app.locals.graficaBarrasHelper = require('./lib/grafica_barras_helper');
//app.locals.graficaTortaHelper = require('./lib/grafica_torta_helper')

app.use('/', routes);
app.use('/api/v1', api);
//app.use('/grafica', grafica);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.locals.pretty = true;
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});





module.exports = app;
