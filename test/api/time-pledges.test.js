/**
 * Created by yotam on 28/06/2016.
 */

var config = require('../config');
var assert = require('assert');
var supertest = require('supertest');
var status = require('http-status');
var u = require('../utils/utils');

var PLEDGE_NO_USER = {
  hours: 3,
  postId : config.PUBLISHED_POST_ID
};
var PLEDGE_NO_PROJECT = {
  hours: 3,
  userId: config.USER_ID,
};
var PLEDGE_NO_HOURS = {
  userId: config.USER_ID,
  postId : config.PUBLISHED_POST_ID
};

var USER_PLEDGE = {
  hours: 3,
  userId: config.USER_ID,
  postId : config.PUBLISHED_POST_ID
};
var ADMIN_PLEDGE = {
  hours: 3,
  userId: config.ADMIN_ID,
  postId : config.PUBLISHED_POST_ID
};
describe('timePledges', function () {

  describe('with user session', function () {

    it('should get pledges', function (done) {

      supertest(app).get(config.apiPrefix + '/timePledges')
        .send(USER_PLEDGE)
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          assert(res.body.length > 0);
          done();
        });
    });

    it('should create a timePledge and add customerId to it', function (done) {

      supertest(app).post(config.apiPrefix + '/timePledges')
        .send(USER_PLEDGE)
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          assert.equal(res.body.customerId, config.CUSTOMER_ID);
          assert.equal(res.body.hours, USER_PLEDGE.hours);
          assert.equal(res.body.userId, config.USER_ID);
          done();
        });
    });

    it('should fail to create a timePledge without a userId', function (done) {

      supertest(app).post(config.apiPrefix + '/timePledges')
        .send(PLEDGE_NO_USER)
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.UNPROCESSABLE_ENTITY);
          done();
        });
    });

    it('should fail to create a timePledge without a postId', function (done) {

      supertest(app).post(config.apiPrefix + '/timePledges')
        .send(PLEDGE_NO_PROJECT)
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.UNPROCESSABLE_ENTITY);
          done();
        });
    });

    it('should fail to create a timePledge without hours field', function (done) {

      supertest(app).post(config.apiPrefix + '/timePledges')
        .send(PLEDGE_NO_HOURS)
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.UNPROCESSABLE_ENTITY);
          done();
        });
    });

    it('should fail to create a timePledge for another user', function (done) {

      supertest(app).post(config.apiPrefix + '/timePledges')
        .send(ADMIN_PLEDGE)
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.UNAUTHORIZED);
          done();
        });
    });

    it('should fail to update a timePledge for another user', function (done) {

      supertest(app).put(config.apiPrefix + '/timePledges/' + config.ADMIN_TIME_PLEDGE_ID, {})
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.UNAUTHORIZED);
          done();
        });
    });
    it('should fail to update a timePledge`s userId to another user', function (done) {
      console.log("saving user")
      supertest(app).put(config.apiPrefix + '/timePledges/' + config.USER_TIME_PLEDGE_ID)
        .send({userId : config.ADMIN_ID})
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.UNAUTHORIZED);
          done();
        });
    });

    it('should update a timePledge which he owns', function (done) {
      supertest(app).put(config.apiPrefix + '/timePledges/' + config.USER_TIME_PLEDGE_ID)
        .send({userId : config.USER_ID})

        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          done();
        });
    });

    it('should fail to update a timePledge on another customer', function (done) {
      supertest(app).put(config.apiPrefix + '/timePledges/' + config.DIFFERENT_CUSTOMER_PLEDGE_ID)
        .send({userId : config.USER_ID})
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.NOT_FOUND);
          done();
        });
    });

    it('should fail to add a timePledge to a project for another user', function (done) {
      supertest(app).post(config.apiPrefix + '/posts')
        .set('authorization', config.USER_TOKEN)
        .send({
          title:"title",
          subtitle:"subtitle",
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

          supertest(app).get(config.apiPrefix + '/posts/' + res.body.id)
            .set('authorization', config.ADMIN_TOKEN)
            .query(u.createFiltes({include: ['timePledges']}))
            .end(function (err, res) {
              assert.equal(res.status, status.OK);
              assert.equal(res.body.timePledges.length, 0);
              done();
            });
        });

    });

  });

  describe('with admin session', function () {

    it('should create a timePledge and add customerId to it', function (done) {

      supertest(app).post(config.apiPrefix + '/timePledges')
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
