(function () {
  'use strict';
  angular
    .module('com.module.dashboard')
    .config(function ($stateProvider) {
        $stateProvider
          .state('app.public.dashboard', {
            url: 'dashboard',
            templateUrl: 'modules/public/dashboard/views/dashboard.html',
            controller: 'DashboardCtrl',
            controllerAs: 'ctrl',
            resolve: {
              user: function (AppAuth, Constants) {
                  return AppAuth.requireUserRole(Constants.USER_ROLES.MK);
              }
            }
        });
      }
    );
})();
