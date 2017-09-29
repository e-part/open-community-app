/**
 * Created by yotam on 28/06/2016.
 */

var config = require('../config');
var assert = require('assert');
var supertest = require('supertest');
var status = require('http-status');
var u = require('../utils/utils');


describe('/polls', function () {

  describe('with user session', function () {

    it('should fail to create a poll that belongs to a post the user doesnt own', function (done) {

      supertest(app).post(config.apiPrefix + '/polls')
        .send({question: 'some q?', postId: config.POST_WITHOUT_OWNER})
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.UNAUTHORIZED);
          done();
        });
    });

    it('should fail to upsert a poll that belongs to a post the user doesnt own', function (done) {

      supertest(app).put(config.apiPrefix + '/polls')
        .send({question: 'some q?', postId: config.POST_WITHOUT_OWNER})
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.UNAUTHORIZED);
          done();
        });
    });

    it('should create a poll that belongs to a post the user owns', function (done) {
      supertest(app).post(config.apiPrefix + '/posts')
        .send({title: 'some title'})
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.OK);

          supertest(app).post(config.apiPrefix + '/polls')
            .send({question: 'some q?', postId: res.body.id})
            .set('authorization', config.USER_TOKEN)
            .end(function (err, res) {
              assert.equal(res.status, status.OK);
              done();
            });
        });
    });

    it('should upsert a poll that belongs to a post the user owns', function (done) {
      supertest(app).post(config.apiPrefix + '/posts')
        .send({title: 'some title'})
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.OK);

          supertest(app).put(config.apiPrefix + '/polls')
            .send({question: 'some q?', postId: res.body.id})
            .set('authorization', config.USER_TOKEN)
            .end(function (err, res) {
              assert.equal(res.status, status.OK);
              done();
            });
        });
    });

  });
  describe('with admin session', function () {

    it('should create a poll and add customerId to it', function (done) {

      supertest(app).post(config.apiPrefix + '/polls')
        .send({question: 'some q?'})
        .set('authorization', config.ADMIN_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          assert.equal(res.body.customerId, config.CUSTOMER_ID);
          done();
        });
    });

    it('should create a poll that belongs to a post a user doesnt own', function (done) {

      supertest(app).post(config.apiPrefix + '/polls')
        .send({question: 'some q?', postId: config.POST_WITHOUT_OWNER})
        .set('authorization', config.ADMIN_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          done();
        });
    });


  });


});
