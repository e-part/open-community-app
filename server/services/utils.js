/**
 * Created by yotam on 15/06/2017.
 */

var Utils = {
  getDomainFromRequest: function (req) {
    return (req.query && req.query.domain);
  },
  getHostFromRequest: function (req) {
    return req.get('host').split(":")[0]
  },
  getClientPortFromRequest: function (app, req) {
    return app.get("clientPort") ? ":" + app.get("clientPort") : "";
  },
  getClientPrefixFromRequest: function (app, req) {
    var port = app.get("clientPort") ? ":" + app.get("clientPort") : "";
    return 'http://' + req.host + port + "/";
  },
  getApiPort: function(app){
    return app.get('apiPort') !== '80' ? app.get('apiPort') : null;

  },
  getApiPrefixFromRequest: function(app, req){
    var apiProtocol = app.get('https') ? 'https' : 'http';
    var apiPort = this.getApiPort(app) ? ":" + this.getApiPort(app) : "";
    var apiPrefix = app.get('restApiRoot')
    return apiProtocol + '://' + this.getHostFromRequest(req) + apiPort;
  }
};
module.exports = Utils;
