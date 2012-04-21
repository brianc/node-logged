var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Logger = require(__dirname + '/logger');
var levels = require(__dirname + '/levels');

var currentLevel = levels.debug;

var logged = function(context) {
  if(typeof context == 'string') {
    context = {name: context};
  }
  var logger = new Logger(currentLevel, context);
  logger.on("log", function(msg) {
    if(logged.emit('log', msg)) return;
    process.stdout.write(JSON.stringify(msg));
    process.stdout.write('\n');
  });
  return logger;
};

EventEmitter.call(logged);
for(var key in EventEmitter.prototype) {
  logged[key] = EventEmitter.prototype[key]
}

logged.level = levels;

logged.setLevel = function(level) {
  currentLevel = level;
};

logged.Logger = Logger;

module.exports = logged;
