process.title = 'epartApp';

var loopback = require('loopback');
var boot = require('loopback-boot');
var app = module.exports = loopback();
var config = require('./config.json');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// setup servers logging.
var winston = require('winston');
require('winston-papertrail').Papertrail;

function setupWinston() {
  var transports = [
    new (winston.transports.Console)({
      timestamp: function () {
        return Date.now();
      },
      formatter: function (options) {
        // Return string will be passed to logger.
        return new Date().toLocaleString('en-US') + ' * ' + options.level.toUpperCase() + ' * ' + (undefined !== options.message ? options.message : '');
      }
    }),
    new (winston.transports.File)({
      name: 'info-file',
      filename: config.logPath + 'server_out.log',
      level: 'info'
    }),
    new (winston.transports.File)({
      name: 'error-file',
      filename: config.logPath + 'server_err.log',
      level: 'error'
    })
  ];

  var logger = new (winston.Logger)({
    transports: transports
  });
  console.log = logger.info; // redirect logs through Winston.
  console.error = logger.error; // redirect logs through Winston.

}

// Add Counts Mixin to loopback
require('loopback-counts-mixin')(app);

app.start = function () {
  // start the web server
  return app.listen(function () {
    app.emit('started');


    var baseUrl = app.get('defaultExplorerUrl').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
console.log("starting boot");

boot(app, __dirname, function (err) {
  if (err) throw err;
  console.log("boot finished");

  // start the server if `$ node server.js`
  if (require.main === module) {
    setupWinston();
    console.log('Server environment: %s', process.env.NODE_ENV);
    console.log("config.logPath: " + config.logPath);
    app.start();
    console.log("starting app..")
  }
});


app.use(function (req, res, next) { // log each request
  req.reqId = new Date().getTime();
  console.log("*** REQ ID: " + req.reqId + " : " + req.url);
  console.log("*** REQ Body: " + JSON.stringify(req.body, null, 2));
  next(); // Passing the request to the next handler in the stack.
});

