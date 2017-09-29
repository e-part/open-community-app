/**
 * Created by USER on 27/06/2017.
 */
var rewire = require("rewire");
var testConfig = require("./../config");
var sinon      = require('sinon')
var newsletterServiceMock = require("./../../server/services/newsletter-service");
var CustomerConfigProviderMock = require("./../../server/services/customers-config-provider");

var mockService = {
  mockServices: function () {
    sinon
      .stub(newsletterServiceMock, 'subscribe',function () {
        console.log('newsletter service subscribe() called');
      });
    sinon
      .stub(CustomerConfigProviderMock, 'getCustomerByRequest',function(){
        return {id: testConfig.CUSTOMER_ID, domain : '127.0.0.1'};
      })


  }
};
module.exports = mockService;
