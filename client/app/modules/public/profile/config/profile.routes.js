(function () {
  'use strict';
  angular
    .module('com.module.profile')
    .config(function ($stateProvider) {
        $stateProvider
          .state('app.public.profile', {
            url: 'profile/:id',
            templateUrl: 'modules/public/profile/views/profile.html',
            controller: 'ProfileCtrl',
            controllerAs: 'ctrl',
            resolve: {
              user: function ($stateParams, UserService) {
                if ($stateParams.id > 0) {
                  return UserService.findById($stateParams.id, {include : ['followees', 'followers'], counts : 'comments'});
                }
              },
              userSession: [
                'AppAuth',
                function (AppAuth) {
                  return AppAuth.requestCurrentUser(); // make sure that session request is completed (page loads also if there's no session)
                }
              ]
            }
        });
      }
    );
})();
