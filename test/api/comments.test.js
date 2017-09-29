/**
 * Created by yotam on 28/06/2016.
 */

var config = require('../config');
var assert = require('assert');
var supertest = require('supertest');
var status = require('http-status');
var user_authorization = "";
var admin_authorization = "";

var ADMIN_ID = 1;
var USER_ID = 2;
var newComment = {content: "some title"};
var ADMIN_COMMENT_ID = 1;
var USER_COMMENT_ID = 2;
describe('/comments', function () {

  describe('Unauthenticated user', function () {

    it('- should fail to create a comment', function (done) {

      supertest(app).post(config.apiPrefix + '/comments')
        .send(newComment)
        .end(function (err, res) {
          assert.equal(res.status, status.UNAUTHORIZED);
          done();
        });
    });

    it('- should fail to update a comment', function (done) {

      supertest(app).put(config.apiPrefix + '/comments', {}).end(function (err, res) {
        assert.equal(res.status, status.UNAUTHORIZED);
        done();
      });
    });

    it('- should fail to delete a comment', function (done) {

      supertest(app).delete(config.apiPrefix + '/comments/1', {}).end(function (err, res) {
        assert.equal(res.status, status.UNAUTHORIZED);
        done();
      });
    });

    it(' should get all comments', function (done) {

      supertest(app).get(config.apiPrefix + '/comments').end(function (err, res) {
        assert.equal(res.status, status.OK);
        assert.notEqual(res.body.length, 0);
        done();
      });

    });
  });

  describe('with regular user session', function () {
    var commentId;

    it('- should create a comment with "user" as its owner and update it', function (done) {
      newComment.creatorId = USER_ID;
      supertest(app).post(config.apiPrefix + '/comments')
        .set('authorization', config.USER_TOKEN)
        .send(newComment)
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          assert.equal(res.body.content, newComment.content);
          assert.equal(res.body.customerId, config.CUSTOMER_ID);

          commentId = res.body.id;
          supertest(app).put(config.apiPrefix + '/comments/' + commentId,{})
            .set('authorization', config.USER_TOKEN)
            .send({})
            .end(function (err, res) {
              assert.equal(res.status, status.OK);
              done();
            });
        });
    });

    it('- should upvote a comment', function (done) {

      supertest(app).post(config.apiPrefix + '/comments/' + USER_COMMENT_ID + "/upvotes")
        .set('authorization', config.USER_TOKEN)
        .send({userId : config.USER_ID})
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          assert.equal(res.body.customerId, config.CUSTOMER_ID);
          done();
        });
    });

/*    describe('test comment ownerships', function () {
      it('- should update the comment', function (done) {
        supertest(app).put(config.apiPrefix + '/comments/' + commentId,{})
          .set('authorization', user_authorization)
          .send({})
          .end(function (err, res) {
            assert.equal(res.status, status.OK);
            done();
          });
      });

    });*/

    it('- should fail to update a comment which he does not own', function (done) {

      supertest(app).put(config.apiPrefix + '/comments/' + ADMIN_COMMENT_ID, {})
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.UNAUTHORIZED);
          done();
        });
    });
    it('- should update a comment which he owns', function (done) {

      supertest(app).put(config.apiPrefix + '/comments/' + USER_COMMENT_ID, {})
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          done();
        });
    });
    xit('- should fail to delete a comment', function (done) {

      supertest(app).delete(config.apiPrefix + '/comments/' + USER_COMMENT_ID, {})
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.UNAUTHORIZED);
          done();
        });
    });

    it(' should get all comments', function (done) {

      supertest(app).get(config.apiPrefix + '/comments')
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          assert.notEqual(res.body.length, 0);
          done();
        });

    });
  });

  describe('with admin session', function () {

    it(' - should be able to create a comment', function (done) {
      newComment.creatorId = ADMIN_ID;
      supertest(app).post(config.apiPrefix + '/comments')
        .set('authorization', config.ADMIN_TOKEN)
        .send(newComment)
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          assert.equal(res.body.content, newComment.content);
          done();
        });
    });
  });


});
