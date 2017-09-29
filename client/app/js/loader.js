/**
 * Created by yotam on 15/06/2017.
 */

(function () {
  'use strict';


  function fetchDomainData() {
    var initInjector = angular.injector(["ng"]);
    var $http = initInjector.get("$http");
    var configInjector = angular.injector(["config"]);
    var ENV = configInjector.get("ENV");
    var configs = angular.module("config");

    return $http.get(ENV.apiUrl + "domain/config?domain=" + window.location.hostname).then(function (response) {
      configs.constant("CLIENT_CONFIG", _.extend(response.data,
        {
          apiHost : getApiHost(response.data),
          apiPrefix: getApiPrefix(response.data),
          attributes: parseAttributes(response.data.attributes)
        }
      ));
    }, function (errorResponse) {
      // Handle error case
    });
  }

  function bootstrapApplication() {
    angular.element(document).ready(function () {
      angular.bootstrap(document, ["loopbackApp"]);
    });
  }

  function getApiHost(clientConfig) {
    var port = clientConfig.apiPort ? (':' + clientConfig.apiPort) : '';
    return (clientConfig.apiProtocol || 'http') + '://' + window.location.hostname + port;
  }
  function getApiPrefix(clientConfig) {
    return clientConfig.apiPrefix || '/api'
  }
  function parseAttributes(attributesJson){
    var parsedJson = {};
    try {
      parsedJson = JSON.parse(attributesJson);
    } catch (e){
      console.error('Error parsing client attributes.');
    }
    return parsedJson;
  }

  fetchDomainData().then(bootstrapApplication);

})();
