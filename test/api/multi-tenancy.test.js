/**
 * Created by yotam on 28/06/2016.
 */

var config = require('../config');
var assert = require('assert');
var supertest = require('supertest');
var status = require('http-status');
var u = require('../utils/utils');
describe('Multi tenancy', function () {

  describe('with admin session', function () {
    it('should try to get a post that exists on a different customer', function (done) {
      supertest(app).get(config.apiPrefix + '/posts/' + config.PUBLISHED_POST_ID)
        .set('authorization', config.ADMIN_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          done();
        });
    });
    it('should try to get a post that exists on a different customer', function (done) {
      supertest(app).get(config.apiPrefix + '/posts/' + config.POST_WITH_A_DIFFERENT_CUSTOMER_ID)
        .set('authorization', config.ADMIN_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.NOT_FOUND);
          done();
        });
    });
    
  });

});
