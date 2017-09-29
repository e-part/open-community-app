/**
 * Created by yotam on 04/06/2017.
 */
var Utils = require('../services/utils');
var CustomerConfigProvider = require('../services/customers-config-provider');
module.exports = function (app) {

  var DigitalTown = app.models.DigitalTown;
  app.get(app.get('restApiRoot') + '/loadApp', function (req, res) {

    var token = req.query.accessToken;
    if (!token) {
      res.redirect(Utils.getClientPrefixFromRequest(app, req));
    } else {
      DigitalTown.initUserSession(token).then(function (user) {
        if (user) { // DT token is valid
          res.redirect(app.get('restApiRoot') + '/auth/digitaltown/' + Utils.getHostFromRequest(req) );
        } else { // no DT session, remove local session as well.
          res.redirect(Utils.getClientPrefixFromRequest(app, req) + '?clearSession=true');
        }
      });
    }
  });

  app.get(app.get('restApiRoot') + '/digitalTown/register', function (req, res) {

    res.redirect(app.get('digitalTownSSODomain') + 'register?callback=' +
      Utils.getApiPrefixFromRequest(app, req) + app.get('restApiRoot') + '/auth/digitaltown/' + CustomerConfigProvider.getCustomerByRequest(app, req).id+ '/callback');
  });

  app.get(app.get('restApiRoot') + '/domain/config', function (req, res) {
    var host = Utils.getDomainFromRequest(req);
    console.log("Requesting configs for host: " + host);
    app.models.Customer.findOne({where: {domain: host}}).then(function(customer){
      var uiConfigs = {
        id : customer.id,
        name: customer.name,
        className : customer.className,
        attributes : customer.attributes,
        apiProtocol: app.get('https') ? 'https' : 'http',
        apiPort: app.get('apiPort') !== '80' ? app.get('apiPort') : null,
        apiPrefix : app.get('restApiRoot')
      };
      return res.json(uiConfigs);

    });

  });

  // add a monitor call to the API to be used by external services to test that the server is live.

  app.get(app.get('restApiRoot') + '/monitor', function (req, res, next) {
    res.sendStatus(200);
  });

}
