/**
 * Created by yotam on 28/06/2016.
 */

var config = require('../config');
var assert = require('assert');
var supertest = require('supertest');
var status = require('http-status');
var u = require('../utils/utils');

var ITEM = {
  quantity: 5,
  description: "item 1",
  postId : config.PUBLISHED_POST_ID
};
var ITEM_NO_POST_ID = {
  quantity: 5,
  description: "item 1",
};
var ITEM_NO_DESCRIPTION = {
  quantity: 5,
  postId : config.PUBLISHED_POST_ID
};

var ITEM_NO_QUANTITY = {
  description: "item 1",
  postId : config.PUBLISHED_POST_ID
};


var MODEL_PREFIX = '/itemRequests';

describe('itemRequests: ', function () {

  describe('with user session', function () {

    it('should get itemRequests', function (done) {

      supertest(app).get(config.apiPrefix + MODEL_PREFIX)
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          assert(res.body.length > 0);
          done();
        });
    });

    it('should fail to create itemRequest for a post owned by another user', function (done) {

      supertest(app).post(config.apiPrefix + MODEL_PREFIX)
        .send(ITEM)
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.UNAUTHORIZED);
          done();
        });
    });


    xit('should fail to create itemRequest without a postId', function (done) {

      supertest(app).post(config.apiPrefix + MODEL_PREFIX)
        .send(ITEM_NO_POST_ID)
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.UNPROCESSABLE_ENTITY);
          done();
        });
    });

/*    it('should fail to create a itemRequest without description field', function (done) {

      supertest(app).post(config.apiPrefix + MODEL_PREFIX)
        .send(ITEM_NO_DESCRIPTION)
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.UNPROCESSABLE_ENTITY);
          done();
        });
    });

    it('should fail to create a itemRequest without quantity field', function (done) {

      supertest(app).post(config.apiPrefix + MODEL_PREFIX)
        .send(ITEM_NO_QUANTITY)
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.UNPROCESSABLE_ENTITY);
          done();
        });
    });
    */
    it('should fail to update a itemRequest on another customer', function (done) {
      supertest(app).put(config.apiPrefix + MODEL_PREFIX + '/' + config.DIFFERENT_CUSTOMER_ITEM_REQUEST_ID)
        .send({postId : config.PUBLISHED_POST_ID})
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.NOT_FOUND);
          done();
        });
    });

    it('should fail to add itemRequest to a project for another user', function (done) {
      supertest(app).put(config.apiPrefix + '/posts/' + config.PUBLISHED_POST_ID)
        .set('authorization', config.USER_TOKEN)
        .send({
          title:"title",
          subtitle:"subtitle",
          __deps__: {
            itemRequests: [{
              postId: config.PUBLISHED_POST_ID,
              quantity: 5,
              description: "item1",
            }]
          }

        })
        .end(function (err, res) {
          assert.equal(res.status, status.UNAUTHORIZED);
          done();
        });

    });

    it('should add itemRequest to a post that belongs to the user', function (done) {
      supertest(app).post(config.apiPrefix + '/posts')
        .set('authorization', config.USER_TOKEN)
        .send({
          title:"title",
          subtitle:"subtitle",
          status: "PUBLISHED",
          ownerId: config.USER_ID,
          __deps__: {
            itemRequests: [{
              quantity: 5,
              description: "item1"
            }]
          }

        })
        .end(function (err, res) {
          assert.equal(res.status, status.OK);

          supertest(app).get(config.apiPrefix + '/posts/' + res.body.id)
            .set('authorization', config.USER_TOKEN)
            .query(u.createFiltes({include: ['itemRequests']}))
            .end(function (err, res) {
              assert.equal(res.status, status.OK);
              assert.equal(res.body.itemRequests.length, 1);
              done();
            });
        });

    });


  });

  xdescribe('with admin session', function () {

    it('should create a itemRequest and add customerId to it', function (done) {

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

    it('should be able to see projects with timePledges', function (done) {
      supertest(app).put(config.apiPrefix + '/posts/' + config.PUBLISHED_POST_ID, {})
        .set('authorization', config.ADMIN_TOKEN)
        .send({
          __deps__: {
            timePledges: [{
              postId: config.PUBLISHED_POST_ID,
              userId: config.ADMIN_ID,
              hours: 1
            }]
          }

        })
        .end(function (err, res) {
          assert.equal(res.status, status.OK);

          supertest(app).get(config.apiPrefix + '/posts/' + config.PUBLISHED_POST_ID)
            .set('authorization', config.ADMIN_TOKEN)
            .query(u.createFiltes({include: ['timePledges']}))
            .end(function (err, res) {
              assert.equal(res.status, status.OK);
              assert.equal(res.body.timePledges.length, 1);
              assert.equal(res.body.timePledges[0].customerId, config.CUSTOMER_ID);
              done();
            });
        });

    });

  });

});
