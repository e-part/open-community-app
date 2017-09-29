(function () {
  'use strict';
  angular
    .module('com.module.about')
    .config(function ($stateProvider) {
        $stateProvider
          .state('app.public.about', {
            url: 'about',
            templateUrl: 'modules/public/about/views/about.html',
            controller: 'AboutCtrl',
            controllerAs: 'ctrl',
            resolve: {

            }
          });

      }
    );
})();
