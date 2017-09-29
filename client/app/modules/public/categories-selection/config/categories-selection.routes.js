(function () {
  'use strict';
  angular
    .module('com.module.categories-selection')
    .config(function ($stateProvider) {
        $stateProvider
          .state('app.public.categories-selection', {
            url: 'categories-selection?welcome',
            templateUrl: 'modules/public/categories-selection/views/categories-selection.html',
            controller: 'CategoriesSelectionCtrl',
            controllerAs: 'ctrl'
            // resolve: {
            //   user: [
            //     'AppAuth',
            //     function (AppAuth) {
            //       return AppAuth.requireUserSession();
            //     }
            //   ],
            // }
          });

      }
    );
})();
