(function () {
  'use strict';
  angular
    .module('com.module.users')
    .config(function ($routeProvider, $httpProvider) {

      // Intercept 401 responses and redirect to login screen
      $httpProvider.interceptors.push(function ($q, $location) {
        return {
          responseError: function (rejection) {
            if (rejection.status === 401) {
              //$rootScope.currentUser = null;
              // save the current location so that login can redirect back
              //$location.nextAfterLogin = $location.path();

              if ($location.path() === '/router' || $location.path() === '/login') {
                console.log('401 while on router on login path');
              } else {
              }
            }
            if (rejection.status === 404) {
              console.log(rejection);
            }
            if (rejection.status === 422) {
              console.log(rejection);
            }
            if (rejection.status === 0) {
              $location.path('/');
            }
            return $q.reject(rejection);
          }
        };
      });
    });

})();
