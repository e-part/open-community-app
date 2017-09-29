(function () {
  'use strict';
  angular
    .module('com.module.reset-password')
    .config(function ($stateProvider) {
        $stateProvider
          .state('app.public.reset-password', {
            url: 'resetPassword',
            templateUrl: 'modules/public/reset-password/views/reset-password.html',
            controller: 'ResetPasswordCtrl',
            controllerAs: 'ctrl',
            params: {
              'mode': 'reset'
            }
          });

      }
    );
})();
