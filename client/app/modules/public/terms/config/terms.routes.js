(function () {
  'use strict';
  angular
    .module('com.module.terms')
    .config(function ($stateProvider) {
        $stateProvider
          .state('app.public.terms', {
            url: 'terms',
            templateUrl: 'modules/public/terms/views/terms.html',
            controller: 'TermsCtrl',
            controllerAs: 'ctrl',
            resolve: {

            }
          });

      }
    );
})();
