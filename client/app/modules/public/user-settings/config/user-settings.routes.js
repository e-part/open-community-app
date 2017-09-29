(function () {
  'use strict';
  angular
    .module('com.module.user-settings')
    .config(function ($stateProvider) {
        $stateProvider
          .state('app.public.user-settings', {
            url: 'settings',
            templateUrl: 'modules/public/user-settings/views/user-settings.html',
            controller: 'UserSettingsCtrl',
            controllerAs: 'ctrl',
            resolve: {
              user: [
                'AppAuth',
                function (AppAuth) {
                  return AppAuth.requireUserSession();
                }
              ],
            }
          });

      }
    );
})();
