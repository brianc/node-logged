var logged = require(__dirname + '/../lib');
logged.on("log", function() { /* don't write to stderr during tests*/ });

describe("logged()", function() {
  it("it creates a logger", function() {
    var log = logged();
    (log instanceof logged.Logger).should.be.true
  });

  it("initializes logger to log level", function() {
    logged.setLevel(logged.level.debug);
    var log = logged();
    log.level.should.eql(logged.level.debug);
  });

  describe("called with string parameter", function() {
    it("creates a log with name context", function() {
      var log = logged(__filename);
      log.context.name.should.eql(__filename);
    });
  });

  describe("called with an object parameter", function() {
    it("creates a log with supplied parameter as context", function() {
      var log = logged({name: 'bang', test: 20, 'okay there': true});
      log.context.name.should.eql('bang');
      log.context.test.should.eql(20);
      log.context['okay there'].should.eql(true);
    });
  });
});

describe("logger", function() {
  var log = logged();
  it("can log at every level", function() {
    log.debug("okay");
    log.info("okay");
    log.warn("okay");
    log.error("okay");
  });

  it("emits message", function(done){
    var log = logged({name: 'test', time: 'late'});
    log.level = logged.level.debug;
    log.once("log", function(msg) {
      msg.name.should.eql("test");
      msg.time.should.eql("late");
      msg.message.should.eql("test");
      msg.user.should.eql("brianc");
      msg.date.getYear().should.eql(new Date().getYear());
      msg.level.should.eql(logged.level.debug);
      done();
    });
    log.debug("test", {user: 'brianc'});
  });

  var shouldEmit = function(levels) {
    levels.forEach(function(level) {
      it('emits ' + level + ' message', function(done) {
        var message = 'test ' + level + ' message';
        logged.once('log', function(msg){
          msg.level.should.eql(logged.level[level]);
          msg.message.should.eql(message);
          done();
        });
        logged()[level](message);
      });
    });
  };

  var shouldNotEmit = function(levels) {
    levels.forEach(function(level) {
      it('does not emit ' + level + ' message', function(done) {
        logged.once(level, function() {
          done('Should not have emitted ' + level);
        });
        logged()[level]('test');
        process.nextTick(done);
      });
    });
  };

  var levels = [];
  for(var level in logged.level) { levels.push(level) }

  for(var level in logged.level) {
    describe('when ' + level + ' is enabled', function() {
      logged.setLevel(logged.level[level]);
      shouldNotEmit(levels.filter(function(l) {
        return logged.level[l] < logged.level[level];
      }));
      shouldEmit(levels.filter(function(l) {
        return logged.level[l] >= logged.level[level];
      }));
    });
  }
});
