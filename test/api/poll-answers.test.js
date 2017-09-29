/**
 * Created by yotam on 28/06/2016.
 */

var config = require('../config');
var assert = require('assert');
var supertest = require('supertest');
var status = require('http-status');
var u = require('../utils/utils');
var POLL_ID = 1;
describe('pollAnswers', function () {

  describe('with admin session', function () {
    it('should create a poll answer and add customerId to it', function (done) {

      supertest(app).post(config.apiPrefix + '/pollAnswers')
        .send({answer: 'some q?',pollId : POLL_ID})
        .set('authorization', config.ADMIN_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          assert.equal(res.body.customerId, config.CUSTOMER_ID);
          done();
        });
    });


  });

});