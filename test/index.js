var logged = require(__dirname + '/../lib');

describe("logged()", function() {
  it("it creates a logger", function() {
    var log = logged();
    (log instanceof logged.Logger).should.be.true
  });

  it("initializes logger to log level", function() {
    logged.setLevel(logged.level.debug);
    var log = logged();
    log.level.should.eql(logged.level.debug);

    logged.setLevel(logged.level.info);
    var log = logged();
    log.level.should.eql(logged.level.info);
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

  describe("when levels are enabled", function() {
    logged.setLevel(logged.level.debug);
    var log = logged({name: 'test', time: 'late'});
    it("emits message", function(done){
      log.on("log", function(msg) {
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

    it('logged emits the message', function(done) {
      logged.on('log', function(msg){
        done();
      });
      logged().info('okay');
    });
  });
});
