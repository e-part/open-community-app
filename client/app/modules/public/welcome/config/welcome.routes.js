(function () {
  'use strict';
  angular
    .module('com.module.welcome')
    .config(function ($stateProvider) {
        $stateProvider
          .state('app.public.welcome', {
            url: 'welcome',
            templateUrl: 'modules/public/welcome/views/welcome.html',
            controller: 'WelcomeCtrl',
            controllerAs: 'ctrl',
            resolve: {
/*              user: [
                'AppAuth',
                function (AppAuth) {
                  return AppAuth.requestCurrentUser();
                }
              ],*/
/*              todayPosts: [
                'PostsService',
                function (PostsService) {
                  return PostsService.getPosts({
                    order: 'endDate DESC',
                    limit: 2,
                    include : ['categories'],
                    where : { status : 'PUBLISHED'}
                  });
                }
              ],
              popularPosts: [
                'PostsService',
                function (PostsService) {
                  return PostsService.getPosts({
                    order: 'endDate DESC',
                    include : ['categories'],
                    limit: 2,
                    where : { status : 'PUBLISHED'}
                  });
                }
              ]*/
            }
          });

      }
    );
})();
