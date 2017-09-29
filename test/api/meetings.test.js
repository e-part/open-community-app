/**
 * Created by yotam on 28/06/2016.
 */

var config = require('../config');
var assert = require('assert');
var supertest = require('supertest');
var status = require('http-status');
var u = require('../utils/utils');

var PLEDGE_NO_HOURS = {
  userId: config.USER_ID,
  postId : config.PUBLISHED_POST_ID
};

var MEETING = {
  date: "2016-09-12 13:00:00",
  location: "Tel Aviv",
  postId : config.PO
};
var MEETING_NO_POST_ID = {
  date: "2016-09-12 13:00:00",
  location: "Tel Aviv"
};

var MEETING_NO_DATE = {
  location: "Tel Aviv",
  postId : config.PUBLISHED_POST_ID

};

var ADMIN_PLEDGE = {
  hours: 3,
  userId: config.ADMIN_ID,
  postId : config.PUBLISHED_POST_ID
};
var MODEL_PREFIX = '/meetings';

describe('meetings', function () {

  describe('with user session', function () {

    it('should get meetings', function (done) {

      supertest(app).get(config.apiPrefix + MODEL_PREFIX)
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          assert(res.body.length > 0);
          done();
        });
    });

    it('should fail to create a meeting for a post owned by another user', function (done) {

      supertest(app).post(config.apiPrefix + MODEL_PREFIX)
        .send(MEETING)
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.UNAUTHORIZED);
          done();
        });
    });


    xit('should fail to create a meeting without a postId', function (done) {

      supertest(app).post(config.apiPrefix + MODEL_PREFIX)
        .send(MEETING_NO_POST_ID)
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.UNPROCESSABLE_ENTITY);
          done();
        });
    });

    xit('should fail to create a meeting without date field', function (done) {

      supertest(app).post(config.apiPrefix + MODEL_PREFIX)
        .send(MEETING_NO_DATE)
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.UNPROCESSABLE_ENTITY);
          done();
        });
    });

    it('should fail to update a meeting on another customer', function (done) {
      supertest(app).put(config.apiPrefix + MODEL_PREFIX + '/' + config.DIFFERENT_CUSTOMER_MEETING_ID)
        .send({postId : config.PUBLISHED_POST_ID})
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.NOT_FOUND);
          done();
        });
    });

    it('should fail to add a meeting to a project for another user', function (done) {
      supertest(app).put(config.apiPrefix + '/posts/' + config.PUBLISHED_POST_ID)
        .set('authorization', config.USER_TOKEN)
        .send({
          title:"title",
          subtitle:"subtitle",
          __deps__: {
            meetings: [{
              postId: config.PUBLISHED_POST_ID,
              date: "2016-09-12 13:00:00"
            }]
          }

        })
        .end(function (err, res) {
          assert.equal(res.status, status.UNAUTHORIZED);
          done();
        });

    });

    it('should add a meeting to a post that belongs to the user', function (done) {
      supertest(app).post(config.apiPrefix + '/posts')
        .set('authorization', config.USER_TOKEN)
        .send({
          title:"title",
          subtitle:"subtitle",
          ownerId: config.USER_ID,
          status: "PUBLISHED",
          __deps__: {
            meetings: [{
              date: "2016-09-12 13:00:00"
            }]
          }

        })
        .end(function (err, res) {
          assert.equal(res.status, status.OK);

          supertest(app).get(config.apiPrefix + '/posts/' + res.body.id)
            .set('authorization', config.USER_TOKEN)
            .query(u.createFiltes({include: ['meetings']}))
            .end(function (err, res) {
              assert.equal(res.status, status.OK);
              assert.equal(res.body.meetings.length, 1);
              done();
            });
        });

    });


  });

  xdescribe('with admin session', function () {

    it('should create a timePledge and add customerId to it', function (done) {

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
