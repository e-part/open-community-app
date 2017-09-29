/**
 * Created by yotam on 28/06/2016.
 */
var fs = require("fs");
var mockingService = require("./mocks/base");

function waitTillReady(value, cb) {
  if (value) {
    cb();
  } else {
    setTimeout(function () {
      waitTillReady(value, cb)
    }, 500);
  }

}

before(function (done) {
  process.NODE_ENV = 'test';

  app = require('../server/server');
  console.log("before all");
  mockingService.mockServices();
  // Increase the Mocha timeout so that app has enough time to lift.
  this.timeout(30000);
  done();
});
beforeEach("setup DB (if used with other tests)", function(done) {

  app.setupFixtures(function () {
    console.log("Fixtures loaded\n");
    done();
  });

});

afterEach("wipe DB (if used with other tests)", function(done) { 
  app.teardownFixtures(function (err) {
    console.log("Fixtures teardown\n"); 
    done();

  });


});

after(function (done) {
  console.log("after all");
  done()
});

