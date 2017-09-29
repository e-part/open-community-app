/*
/!**
 * Created by yotam on 28/06/2016.
 *!/

var config = require('../config');
var assert = require('assert');
var supertest = require('supertest');
var status = require('http-status');
var authorization = "";

var MK_ID = 1;
describe('/mks', function () {
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

    it('Non admin user - should fail to create a mk', function (done) {

      supertest(app).post(config.apiPrefix + '/mks').end(function (err, res) {
        assert.equal(res.status, status.UNAUTHORIZED);
        done();
      });
    });

    it('Non admin user - should fail to update a mk', function (done) {

      supertest(app).put(config.apiPrefix + '/mks', {}).end(function (err, res) {
        assert.equal(res.status, status.UNAUTHORIZED);
        done();
      });
    });

    it('Non admin user - should fail to delete a mk', function (done) {

      supertest(app).delete(config.apiPrefix + '/mks/1', {}).end(function (err, res) {
        assert.equal(res.status, status.UNAUTHORIZED);
        done();
      });
    });

    it(' should get all mks', function (done) {

      supertest(app).get(config.apiPrefix + '/mks').end(function (err, res) {
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
        supertest(app).put(config.apiPrefix + '/mks/' + MK_ID, {})
          .set('authorization', authorization)
          .send({
            __deps__ : {
              committee : [{
                id :1
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

    it('admin user - should be able to create a mk', function (done) {
      var newmk = {name: "some title", email:"bbb@bbb.com"};
      supertest(app).post(config.apiPrefix + '/mks')
        .set('authorization', authorization)
        .send(newmk)
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          assert.equal(res.body.name, newmk.name);
          done();
        });
    });


    it(' admin user - should  be able to see mks with its committees', function (done) {
      supertest(app).get(config.apiPrefix + '/mks')
        .set('authorization', authorization)
        .query("filter[include]=committees")
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          assert.equal(res.body[0].committees.length, 1);
          done();
        });
    });
  });


});
*/
