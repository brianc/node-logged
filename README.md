# logged
Logging should be simple. This library is 80 lines of code. It gets the job done. Simply.


## examples

### simple

```js
var log = require('logged')();
log.debug('test');
```

What you should see on stdout: `{"level":0,"message":"test","date":"2012-04-21T09:37:47.373Z"}`

### named logger

```js
var log = require('logged')('my-logger');
log.debug('test');
```

What you should see on stdout: `{"level":0,"message":"test","name":"my-logger","date":"2012-04-21T09:37:47.373Z"}`

### log with more context

```js
var log = require('logged')({name: 'my-logger', env: 'production'});
log.debug('test', {user: 'joe'});
```

What you should see on stdout: `{"level":0,"message":"test","name":"my-logger","date":"2012-04-21T09:37:47.373Z","env":"production","user":"joe"}`

## customizable

### change the log levels
```js
//before requiring anything else from logged
var levels = require('logged/levels');
levels.trace = 0;
levels.debug = 1;
levels.awesome = 2;
levels.chainsaw = 3;
levels.boom = 4;

var log = require('logged')();
log.trace('yeah');
log.awesome('srsly');
```

### change how the log is output
```js
var logged = require('logged');
//if you handle the log event yourself
//logged will do no outputting to stderr
//this lets you effectively do anything you want
//with the log messages
logged.on('log', function(logMessage) {
  //redis.lpush(logMessage);
  //mongo.store(logMessage);
  //pg.query('INSERT INTO log(level, message) VALUES(level, message)');
  if(logMessage.level > 10) {
    email.send('errors@yourcompany.com', JSON.stringify(logMessage));
  }
});
```
