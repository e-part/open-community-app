/**
 * Created by yotam on 28/06/2016.
 */

var config = require('../config');
var assert = require('assert');
var supertest = require('supertest');
var status = require('http-status');
var _ = require('lodash');
var u = require('../utils/utils');

var DRAFT_POST_ID = 1;

var USER_OWNED_POST_ID = 2;
var ADMIN_OWNED_POST_ID = 1;

describe('posts', function () {

  describe('with regular user session', function () {

    it('should create a post and add session user is the owner id', function (done) {

      supertest(app).post(config.apiPrefix + '/posts')
        .send({title: 'some title'})
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          assert.equal(res.body.ownerId, config.USER_ID);
          assert.equal(res.body.customerId, config.CUSTOMER_ID);
          done();
        });
    });

    it('should create a post of type project', function (done) {

      supertest(app).post(config.apiPrefix + '/posts')
        .send({title: 'some title', type : 'PROJECT', minimumRequiredHours: 100})
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          done();
        });
    });

    it('should fail to create a post of type project if minimumRequiredHours field is not set', function (done) {

      supertest(app).post(config.apiPrefix + '/posts')
        .send({title: 'some title', type : 'PROJECT'})
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.UNPROCESSABLE_ENTITY);
          done();
        });
    });

    it('should fail to create a post if ownerId doesnt match user', function (done) {

      supertest(app).post(config.apiPrefix + '/posts')
        .send({title: 'some title', ownerId: config.ADMIN_ID})
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.UNAUTHORIZED);
          done();
        });
    });

    it('should fail to update a post if not owned by user', function (done) {

      supertest(app).put(config.apiPrefix + '/posts/' + ADMIN_OWNED_POST_ID, {})
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.UNAUTHORIZED);
          done();
        });
    });

    it('should update a post if owned by user', function (done) {

      supertest(app).put(config.apiPrefix + '/posts/' + USER_OWNED_POST_ID, {})
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.UNAUTHORIZED);
          done();
        });
    });

    it('should fail to delete a post', function (done) {

      supertest(app).delete(config.apiPrefix + '/posts/1', {})
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.UNAUTHORIZED);
          done();
        });
    });

    it('should not be able to see draft post', function (done) {

      supertest(app).get(config.apiPrefix + '/posts/' + DRAFT_POST_ID)
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.FORBIDDEN);
          done();
        });
    });

    it('should not be able to see denied post', function (done) {

      supertest(app).get(config.apiPrefix + '/posts/' + config.DENIED_POST_ID)
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.FORBIDDEN);
          done();
        });
    });

    it('should be able to see a published post', function (done) {
      supertest(app).post(config.apiPrefix + '/posts')
        .send({title: 'some title', status:"PUBLISHED"})
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          supertest(app).get(config.apiPrefix + '/posts/' + res.body.id)
            .set('authorization', config.USER_TOKEN)
            .end(function (err, res) {
              assert.equal(res.status, status.OK);
              done();
            });
        });
    });

    it('should get only published posts', function (done) {

      supertest(app).get(config.apiPrefix + '/posts')
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          assert(!_.find(res.body, {status: 'DRAFT'}));
          assert(_.find(res.body, {status: 'PUBLISHED'}));
          done();
        });

    });

    it('should get only approved posts', function (done) {

      supertest(app).get(config.apiPrefix + '/posts')
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          assert(!_.find(res.body, {reviewStatus: 'DENIED'}));
          assert(_.find(res.body, {reviewStatus: 'APPROVED'}));
          done();
        });

    });

  });


  describe('with admin user session', function () {

    it('should be able to create a post', function (done) {

      supertest(app).post(config.apiPrefix + '/posts')
        .set('authorization', config.ADMIN_TOKEN)
        .send({
          title: "some title"
        })
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          done();
        });
    });

    it('should be able to see a draft post', function (done) {

      supertest(app).get(config.apiPrefix + '/posts/' + DRAFT_POST_ID)
        .type('form')
        .set('authorization', config.ADMIN_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          done();
        });
    });

    it('should be able to see denied post', function (done) {

      supertest(app).get(config.apiPrefix + '/posts/' + config.DENIED_POST_ID)
        .set('authorization', config.ADMIN_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          done();
        });
    });

    it('should be able to see a published post', function (done) {

      supertest(app).get(config.apiPrefix + '/posts/' + config.PUBLISHED_POST_ID)
        .set('authorization', config.ADMIN_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          done();
        });
    });

    it('should be able to see all posts', function (done) {

      supertest(app).get(config.apiPrefix + '/posts')
        .set('authorization', config.ADMIN_TOKEN)
        .end(function (err, res) {
          if (err){
            console.log("Error: " ,err);
          }
          assert.equal(res.status, status.OK);
          console.log("res.body: ", JSON.stringify(res.body));
          assert(_.find(res.body, {status: 'DRAFT'}));
          assert(_.find(res.body, {status: 'PUBLISHED'}));
          done();
        });
    });

    it('should be able to see posts with categories', function (done) {
      supertest(app).put(config.apiPrefix + '/posts/' + DRAFT_POST_ID)
        .set('authorization', config.ADMIN_TOKEN)
        .send({
          __deps__: {
            categories: [{
              id: 1
            }]
          }

        })
        .end(function (err, res) {
          assert.equal(res.status, status.OK);

          supertest(app).get(config.apiPrefix + '/posts')
            .set('authorization', config.ADMIN_TOKEN)
            .query(u.createFiltes({include: ['categories']}))
            .end(function (err, res) {
              assert.equal(res.status, status.OK);
              console.log("res.body: ", JSON.stringify(res.body));

              assert.equal(res.body[0].categories.length, 1);
              done();
            });
        });

    });

    it('should be able to see posts with comments', function (done) {
      supertest(app).put(config.apiPrefix + '/posts/' + DRAFT_POST_ID, {})
        .set('authorization', config.ADMIN_TOKEN)
        .send({
          __deps__: {
            comments: [{
              content: "something"
            }]
          }

        })
        .end(function (err, res) {
          assert.equal(res.status, status.OK);

          supertest(app).get(config.apiPrefix + '/posts')
            .set('authorization', config.ADMIN_TOKEN)
            .query(u.createFiltes({include: ['comments']}))
            .end(function (err, res) {
              assert.equal(res.status, status.OK);
              console.log("res.body: ", JSON.stringify(res.body));
              assert.equal(res.body[0].comments.length, 1);
              done();
            });
        });

    });

    it('should be able to see posts with polls', function (done) {
      supertest(app).put(config.apiPrefix + '/posts/' + DRAFT_POST_ID, {})
        .set('authorization', config.ADMIN_TOKEN)
        .send({
          __deps__: {
            polls: [{
              archived: false
            }]
          }

        })
        .end(function (err, res) {
          assert.equal(res.status, status.OK);

          supertest(app).get(config.apiPrefix + '/posts/' + DRAFT_POST_ID)
            .set('authorization', config.ADMIN_TOKEN)
            .query(u.createFiltes({include: ['polls']}))
            .end(function (err, res) {
              assert.equal(res.status, status.OK);
              assert.equal(res.body.polls.length, 1);
              assert.equal(res.body.polls[0].customerId, config.CUSTOMER_ID);
              done();
            });
        });

    });

  });


});
