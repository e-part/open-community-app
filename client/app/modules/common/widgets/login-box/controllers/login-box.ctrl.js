/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.common')
    .controller('LoginBoxCtrl', function (AuthProvider,$rootScope,$scope,DialogsService,CoreService, AppAuth) {
      var ctrl = this;

      function _init() {
        AppAuth.getProviders().then(function(result){
          $scope.authProviders = result;
        });
      }
      ctrl.openLoginDialog = function() {
        DialogsService.openDialog('login');
      }

      ctrl.socialLogin = function(provider) {
        window.location = CoreService.env.apiHost + provider.authPath;
      };

      _init();

    });


})();
