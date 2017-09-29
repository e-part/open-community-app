/**
 * Created by yotam on 28/06/2016.
 */

var config = require('../config');
var assert = require('assert');
var supertest = require('supertest');
var status = require('http-status');
var u = require('../utils/utils');
describe('tags', function () {

  describe('with admin session', function () {
    it('should create a tag and add customerId to it', function (done) {
      var tag = {content: 'some tag' };
      supertest(app).post(config.apiPrefix + '/tags')
        .send(tag)
        .set('authorization', config.ADMIN_TOKEN)
        .end(function (err, res) {
          assert.equal(res.status, status.OK);
          assert.equal(res.body.customerId, config.CUSTOMER_ID);
          assert.equal(res.body.content, tag.content);
          done();
        });
    });


  });

});
