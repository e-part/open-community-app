/**
 * Created by Yotam on 18/06/2017.
 */

var _ = require('lodash');
var Utils = require('./utils');
var PROVIDER_PREFIX = "digital-town-";

function _buildAuthProviders(app, customers){
  var dtAuthProviders = {};
  console.log('building auth providers:');
  customers.forEach(function addProvider(customer){
    var providerKey = PROVIDER_PREFIX + customer.domain;
    var port = app.get("apiPort") !== "80" ? ":" + app.get("apiPort") : "";
    var protocol = app.get("https") ? "https" : "http";
    dtAuthProviders[providerKey] = {
      "provider": "digitalTown",
      "module": "passport-oauth2",
      "strategy": "OAuth2Strategy",
      "authorizationURL": app.get("digitalTownSSODomain") + "oauth/authorize",
      "tokenURL":  app.get("digitalTownApi") + "token",
      "authPath": "/api/auth/digitaltown/" + customer.domain,
      "clientID": customer.clientID,
      "clientSecret": customer.clientSecret,
      "callbackPath": "/api/auth/digitaltown/" + customer.id+ "/callback",
      "callbackURL": protocol + "://" + customer.domain + port +"/api/auth/digitaltown/" + customer.id + "/callback",
      "successRedirect": "/api/auth/account",
      "scope": ["ID","email", "first_name","last_name","profile"]
    }
    console.log(JSON.stringify(dtAuthProviders[providerKey]));
  });
  
  return dtAuthProviders;
}
var CustomerConfigProvider = {
  customers : [],
  init: function(app){
    var self = this;
    app.models.Customer.find().then(function(customers){
      self.customers = customers;
    });
  },
  getCustomers: function (app) {
      return app.models.Customer.find()
  },
  getAuthProviders: function(app){
    return this.getCustomers(app).then(function(customers){
      return _buildAuthProviders(app, customers);
    });
  },
  getCustomerByRequest: function(app, req) {
    var host = Utils.getHostFromRequest(req);
    return _.findWhere(this.customers, {domain : host});
  }
};

module.exports = CustomerConfigProvider;
