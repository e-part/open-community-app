(function () {
  'use strict';
  angular
    .module('com.module.qa')
    .config(function ($stateProvider) {
        $stateProvider
          .state('app.public.qa', {
            url: 'qa',
            templateUrl: 'modules/public/qa/views/qa.html',
            controller: 'QaCtrl',
            controllerAs: 'ctrl',
            resolve: {
              faqs: function(FaqsService) {
                return FaqsService.getFaqs();
              }
              
            }
          });

      }
    );
})();
