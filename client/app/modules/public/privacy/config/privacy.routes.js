(function () {
  'use strict';
  angular
    .module('com.module.privacy')
    .config(function ($stateProvider) {
        $stateProvider
          .state('app.public.privacy', {
            url: 'privacy',
            templateUrl: 'modules/public/privacy/views/privacy.html',
            controller: 'PrivacyCtrl',
            controllerAs: 'ctrl',
            resolve: {

            }
          });

      }
    );
})();
