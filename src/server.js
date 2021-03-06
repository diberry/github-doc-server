#!/usr/bin/env node

/**
 * Module dependencies.
 */
const appInsights = require('applicationinsights');
// telemetry
const CONFIG = require('./config.js').SERVER_CONFIG;

appInsights.setup(CONFIG.AZURE.APPLICATION_INSIGHTS_INSTRUMENTATION_KEY)
  .setAutoCollectRequests(true)
  .setAutoCollectConsole(true)
  .setAutoDependencyCorrelation(true)
  .setAutoCollectRequests(true)
  .setAutoCollectPerformance(true)
  .setAutoCollectExceptions(true)
  .setAutoCollectDependencies(true)
  .setUseDiskRetryCaching(true)
  .start();

const client = appInsights.defaultClient;
const lib = require('github-doc-server-lib')
const log = lib.Log

if (!CONFIG.AZURE.APPLICATION_INSIGHTS_INSTRUMENTATION_KEY) {
  throw Error("app insights key is empty")
} else {
  log.trace(client, "app insights key is found", CONFIG.AZURE.ENVIRONMENT)
}

var app = require('./app');
var http = require('http');

var routes = app.routes;
for (var verb in routes) {
  if (routes.hasOwnProperty(verb)) {
    routes[verb].forEach(function (route) {
      client.trackTrace({ message: verb + " : " + route['path'] });
    });
  }
}

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.API_SERVER_PORT || '9000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {

  console.log("server.js::onError")

  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      log.error(client, bind + ' requires elevated privileges', CONFIG.AZURE.ENVIRONMENT)
      process.exit(1);
      break;
    case 'EADDRINUSE':
      log.error(client, bind + ' is already in use', CONFIG.AZURE.ENVIRONMENT)
      process.exit(1);
      break;
    default:
      log.error(client, error, CONFIG.AZURE.ENVIRONMENT)
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  log.event(client, 'Listening on ' + bind, CONFIG.AZURE.ENVIRONMENT)
}

process.on('uncaughtException', function(e){
  console.log(e);
});

module.export = server