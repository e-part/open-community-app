/**
 * Created by yotam on 28/06/2016.
 */

var config = require('../config');
var assert = require('assert');
var supertest = require('supertest');
var status = require('http-status');
var u = require('../utils/utils');

var authorization = "";
var CATEGORY_ID = 1;
describe('/categories', function () {

  describe('with regular user session', function () {

    it('should fail to create a category', function (done) {

      supertest(app).post(config.apiPrefix + '/categories')
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
        assert.equal(res.status, status.UNAUTHORIZED);
        done();
      });
    });

    it('should fail to update a category', function (done) {

      supertest(app).put(config.apiPrefix + '/categories', {})
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
        assert.equal(res.status, status.UNAUTHORIZED);
        done();
      });
    });

    it('should fail to delete a category', function (done) {

      supertest(app).delete(config.apiPrefix + '/categories/1', {})
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
        assert.equal(res.status, status.UNAUTHORIZED);
        done();
      });
    });

    it(' should get all categories', function (done) {

      supertest(app).get(config.apiPrefix + '/categories')
        .set('authorization', config.USER_TOKEN)
        .end(function (err, res) {
        assert.equal(res.status, status.OK);
        assert.notEqual(res.body.length, 0);
        done();
      });

    });
  });

  describe('with admin session', function () {

    it('admin user - should be able to create a category', function (done) {
      var newCategory = {name: "some title"};
      supertest(app).post(config.apiPrefix + '/categories')
        .set('authorization', config.ADMIN_TOKEN)
        .send(newCategory)
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          assert.equal(res.body.name, newCategory.name);
          done();
        });
    });


    it(' admin user - should  be able to add posts to a category', function (done) {

      supertest(app).put(config.apiPrefix + '/categories/' + CATEGORY_ID, {})
        .set('authorization', config.ADMIN_TOKEN)
        .send({
          __deps__ : {
            posts : [{
              id :1
            }]
          }

        })
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          supertest(app).get(config.apiPrefix + '/categories')
            .set('authorization', config.ADMIN_TOKEN)
            .query(u.createFiltes({include: ['posts']}))
            .end(function (err, res) {
              assert.equal(res.status, status.OK);
              assert.equal(res.body[0].posts.length, 1);
              done();
            });
        });


    });
  });


});
