var util = require("util");
var EventEmitter = require("events").EventEmitter;

var levels = require(__dirname + '/levels');

var Logger = function(level, context) {
  EventEmitter.call(this);
  this.level = level;
  this.context = context || {};
};

util.inherits(Logger, EventEmitter);

var apply = function(target, other) {
  for(var key in other) {
    target[key] = other[key];
  }
};

Logger.prototype._log = function(level, message, context) {
  if(typeof message == 'object') { 
    context = message;
  } else {
    context = context || {};
    context.message = message;
  }
  context.level = level;
  context.date = new Date();
  apply(context, this.context);
  this.emit("log", context);
};

for(var level in levels) {
  (function(level, val){
    Logger.prototype[level] = function(message, context) {
      if(val >= this.level) {
        this._log(val, message, context);
      }
    };
  })(level, levels[level]);
}


module.exports = Logger;
