(function () {
  'use strict';
  angular
    .module('com.module.subscriptions')
    .config(function ($stateProvider) {
        $stateProvider
          .state('app.public.subscriptions', {
            url: 'subscriptions-edit',
            templateUrl: 'modules/public/subscriptions/views/subscriptions.html',
            controller: 'SubscriptionsCtrl',
            controllerAs: 'ctrl',
            params: {
              'mode': 'success'
            }
          });

      }
    );
})();
