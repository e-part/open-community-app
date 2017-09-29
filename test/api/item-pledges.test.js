/**
 * Created by yotam on 28/06/2016.
 */

var config = require('../config');
var assert = require('assert');
var supertest = require('supertest');
var status = require('http-status');
var u = require('../utils/utils');


var PLEDGE_NO_USER = {
  quantity: 3,
  itemRequestId : config.ITEM_REQUEST_ID
};

var USER_PLEDGE = {
  quantity: 3,
  userId: config.USER_ID,
  itemRequestId : config.ITEM_REQUEST_ID
};
var PLEDGE_NO_ITEM_PLEDGE = {
  quantity: 3,
  userId: config.USER_ID

};
var PLEDGE_NO_QUANTITY = {
  userId: config.USER_ID,
  itemRequestId : config.ITEM_REQUEST_ID

};

var ADMIN_PLEDGE = {
  quantity: 3,
  userId: config.ADMIN_ID,
  itemRequestId : config.ITEM_REQUEST_ID
};


var MODEL_PREFIX = '/itemPledges';
describe(MODEL_PREFIX, function () {

  describe('with user session', function () {

    it('should get pledges', function (done) {

      supertest(app).get(config.apiPrefix + MODEL_PREFIX)
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          assert(res.body.length > 0);
          done();
        });
    });

    it('should create itemPledge and add customerId to it', function (done) {

      supertest(app).post(config.apiPrefix + MODEL_PREFIX)
        .send(USER_PLEDGE)
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          assert.equal(res.body.customerId, config.CUSTOMER_ID);
          assert.equal(res.body.quantity, USER_PLEDGE.quantity);
          assert.equal(res.body.userId, config.USER_ID);
          done();
        });
    });

    it('should fail to create a itemPledge without a userId', function (done) {

      supertest(app).post(config.apiPrefix + MODEL_PREFIX)
        .send(PLEDGE_NO_USER)
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.UNPROCESSABLE_ENTITY);
          done();
        });
    });

    it('should fail to create a itemPledge without a itemPledgeId', function (done) {

      supertest(app).post(config.apiPrefix + MODEL_PREFIX)
        .send(PLEDGE_NO_ITEM_PLEDGE)
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.UNPROCESSABLE_ENTITY);
          done();
        });
    });

    it('should fail to create a itemPledge without quantity field', function (done) {

      supertest(app).post(config.apiPrefix + MODEL_PREFIX)
        .send(PLEDGE_NO_QUANTITY)
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.UNPROCESSABLE_ENTITY);
          done();
        });
    });

    it('should fail to create a itemPledge for another user', function (done) {

      supertest(app).post(config.apiPrefix + MODEL_PREFIX)
        .send(ADMIN_PLEDGE)
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.UNAUTHORIZED);
          done();
        });
    });

    it('should fail to update a itemPledge for another user', function (done) {

      supertest(app).put(config.apiPrefix + '/itemPledges/' + config.ADMIN_ITEM_PLEDGE_ID, {})
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.UNAUTHORIZED);
          done();
        });
    });
    it('should fail to update a itemPledge`s userId to another user', function (done) {
      console.log("saving user")
      supertest(app).put(config.apiPrefix + '/itemPledges/' + config.USER_ITEM_PLEDGE_ID)
        .send({userId : config.ADMIN_ID})
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.UNAUTHORIZED);
          done();
        });
    });

    it('should update a itemPledge which he owns', function (done) {
      supertest(app).put(config.apiPrefix + '/timePledges/' + config.USER_ITEM_PLEDGE_ID)
        .send({userId : config.USER_ID})

        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          done();
        });
    });

    it('should fail to update a itemPledge on another customer', function (done) {
      supertest(app).put(config.apiPrefix + '/itemPledges/' + config.DIFFERENT_CUSTOMER_PLEDGE_ID)
        .send({userId : config.USER_ID})
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.NOT_FOUND);
          done();
        });
    });

  });

  describe('with admin session', function () {

    it('should create a itemPledge and add customerId to it', function (done) {

      supertest(app).post(config.apiPrefix + MODEL_PREFIX)
        .send(USER_PLEDGE)
        .set('authorization', config.ADMIN_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          assert.equal(res.body.customerId, config.CUSTOMER_ID);
          assert.equal(res.body.hours, USER_PLEDGE.hours);
          assert.equal(res.body.userId, USER_PLEDGE.userId);
          done();
        });
    });

    it('should be able to see itemRequests with itemPledges', function (done) {
      supertest(app).put(config.apiPrefix + '/itemRequests/' + config.ITEM_REQUEST_ID)
        .set('authorization', config.ADMIN_TOKEN)
        .send({
          __deps__: {
            itemPledges: [{
              itemRequestId: config.ITEM_PLEDGE_ID,
              userId: config.ADMIN_ID,
              quantity: 1
            }]
          }

        })
        .end(function (err, res) {
          assert.equal(res.status, status.OK);

          supertest(app).get(config.apiPrefix + '/itemRequests/' + config.ITEM_REQUEST_ID)
            .set('authorization', config.ADMIN_TOKEN)
            .query(u.createFiltes({include: ['itemPledges']}))
            .end(function (err, res) {
              assert.equal(res.status, status.OK);
              assert.equal(res.body.itemPledges.length, 1);
              assert.equal(res.body.itemPledges[0].customerId, config.CUSTOMER_ID);
              done();
            });
        });

    });

  });

});
