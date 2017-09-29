/**
 * Created by yotam on 28/06/2016.
 */

var config = require('../config');
var assert = require('assert');
var supertest = require('supertest');
var status = require('http-status');
var authorization = "";

var COMMITTEE_ID = 1;
var MK_ID = 1;

xdescribe('/committees', function () {
  it('login as a user', function (done) {

    supertest(app).post(config.apiPrefix + '/users/login')
      .type('form')
      .send({
        email: "user@user.com",
        password: "user"
      })
      .end(function (err, res) {
        assert.equal(res.status, status.OK);
        done();
      });

  });

  describe('with user session', function () {

    it('Non admin user - should fail to create a committee', function (done) {

      supertest(app).post(config.apiPrefix + '/committees').end(function (err, res) {
        assert.equal(res.status, status.UNAUTHORIZED);
        done();
      });
    });

    it('Non admin user - should fail to update a committee', function (done) {

      supertest(app).put(config.apiPrefix + '/committees', {}).end(function (err, res) {
        assert.equal(res.status, status.UNAUTHORIZED);
        done();
      });
    });

    it('Non admin user - should fail to delete a committee', function (done) {

      supertest(app).delete(config.apiPrefix + '/committees/1', {}).end(function (err, res) {
        assert.equal(res.status, status.UNAUTHORIZED);
        done();
      });
    });

    it(' should get all committees', function (done) {

      supertest(app).get(config.apiPrefix + '/committees').end(function (err, res) {
        assert.equal(res.status, status.OK);
        assert.notEqual(res.body.length, 0);
        done();
      });

    });
  });

  it(' should login and setup models links', function (done) {

    supertest(app).post(config.apiPrefix + '/users/login')
      .type('form')
      .send({
        email: "admin@admin.com",
        password: "admin"
      })
      .end(function (err, res) {
        authorization = res.body.id;
        console.log(JSON.stringify(res.body));
        assert.equal(res.status, status.OK);

        // setup links between models

        supertest(app).put(config.apiPrefix + '/committees/' + COMMITTEE_ID, {})
          .set('authorization', authorization)
          .send({
            __deps__ : {
              mks : [{
                id : MK_ID
              }]
            }

          })
          .end(function (err, res) {
            assert.equal(res.status, status.OK);
            done();
          });
      });

  });

  describe('with user session', function () {

    it('admin user - should be able to create a committee', function (done) {
      var newcommittee = {name: "some title"};
      supertest(app).post(config.apiPrefix + '/committees')
        .set('authorization', authorization)
        .send(newcommittee)
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          assert.equal(res.body.name, newcommittee.name);
          done();
        });
    });


    it(' admin user - should  be able to see committees with mks', function (done) {
      supertest(app).get(config.apiPrefix + '/Committees')
        .set('authorization', authorization)
        .query("filter[include]=mks")
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          assert.notEqual(res.body.length, 0);
          assert.equal(res.body[0].mks.length, 1);
          done();
        });
    });
  });


});
