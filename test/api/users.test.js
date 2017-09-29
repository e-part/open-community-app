/**
 * Created by yotam on 28/06/2016.
 */

var config = require('../config');
var u = require('../utils/utils');
var assert = require('assert');
var supertest = require('supertest');
var status = require('http-status');
var authorization = "";


var CATEGORY_ID = 1;
describe('/users', function () {

  describe('without user session', function () {

    it('should fail to update a user', function (done) {

      supertest(app).put(config.apiPrefix + '/users', {}).end(function (err, res) {
        assert.equal(res.status, status.UNAUTHORIZED);
        done();
      });
    });

    it('should fail to delete a user', function (done) {

      supertest(app).delete(config.apiPrefix + '/users/1', {}).end(function (err, res) {
        assert.equal(res.status, status.UNAUTHORIZED);
        done();
      });
    });

    it('Should fail to get all users', function (done) {

      supertest(app).get(config.apiPrefix + '/users').end(function (err, res) {
        assert.equal(res.status, status.UNAUTHORIZED);
        done();
      });

    });
  });



  describe('with regular user session', function () {
    it('login as a user', function (done) {

      supertest(app).post(config.apiPrefix + '/users/login')
        .type('form')
        .send({
          email: "user@user.com",
          password: "user"
        })
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          authorization = res.body.id;
          assert(authorization != null);

          done();
        });

    });
    it('should fail to update another user', function (done) {

      supertest(app).put(config.apiPrefix + '/users/' + config.ADMIN_ID, {})
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
        assert.equal(res.status, status.UNAUTHORIZED);
        done();
      });
    });

    it('should fail to delete another user', function (done) {

      supertest(app).delete(config.apiPrefix + '/users/' + + config.ADMIN_ID, {})
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
        assert.equal(res.status, status.UNAUTHORIZED);
        done();
      });
    });

    it('Should fail to get all users', function (done) {

      supertest(app).get(config.apiPrefix + '/users')
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
        assert.equal(res.status, status.UNAUTHORIZED);
        done();
      });

    });
  });
  
  describe('with admin user session', function () {

    it(' admin user - should be able to see all users', function (done) {
      supertest(app).get(config.apiPrefix + '/users')
        .set('authorization', config.ADMIN_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          assert(res.body.length >= 1);
          done();
        });
    });

    it(' admin user - should  be able to see add category to user', function (done) {
      // setup links between models

      supertest(app).put(config.apiPrefix + '/users/' + config.USER_ID, {})
        .set('authorization', config.ADMIN_TOKEN)
        .send({
          __deps__ : {
            categories : [{
              id : CATEGORY_ID
            }]
          }

        })
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          supertest(app).get(config.apiPrefix + '/users/' + config.USER_ID)
            .set('authorization', config.ADMIN_TOKEN)
            .query(u.createFiltes({include: ['categories']}))
            .end(function (err, res) {
              assert.equal(res.status, status.OK);
              assert.equal(res.body.categories.length, 1);
              done();
            });
        });


    });
  });


});
