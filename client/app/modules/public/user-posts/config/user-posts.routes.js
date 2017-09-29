(function () {
  'use strict';
  angular
    .module('com.module.user-posts')
    .config(function ($stateProvider) {
        $stateProvider
          .state('app.public.user-posts', {
            abstract: true,
            url: 'my-discussions',
            templateUrl: 'modules/public/user-posts/views/main.html'
          })
          .state('app.public.user-posts.list', {
            url: '/list',
            templateUrl: 'modules/public/user-posts/views/user-posts.html',
            controller: 'UserPostsCtrl',
            controllerAs: 'ctrl',
            resolve: {
              userPosts: [
                'AppAuth','PostsService',
                function (AppAuth, PostsService) {
                  return AppAuth.requireUserSession().then(function(user){
                    return PostsService.getUserPosts({
                      where: {ownerId: user.id},
                      order: 'id DESC'
                    });
                  })
                }
              ],
            }
          })
          .state('app.public.user-posts.add', {
            url: '/add?type',
            templateUrl: 'modules/public/user-posts/views/form.html',
            controllerAs: 'ctrl',
            controller: 'UserAddPostCtrl',
            resolve: {
              post: function () {
                return {};
              },
              user: [
                'AppAuth',
                function (AppAuth) {
                  return AppAuth.requireUserSession();
                }
              ],
            }
          })
          .state('app.public.user-posts.edit', {
            url: '/:id/edit',
            templateUrl: 'modules/public/user-posts/views/form.html',
            controllerAs: 'ctrl',
            controller: 'UserEditPostCtrl',
            resolve: {
              post: function ($stateParams, PostsService, $q, AppAuth) {
                var deferred = $q.defer();
                AppAuth.requireUserSession().then(function(user){
                  PostsService.getOwnerPosts( {
                    where: {
                      id: $stateParams.id,
                      ownerId: user.id
                    },
                    include: [
                      {relation: 'categories'},
                      {relation: 'meetings'},
                      {relation: 'itemRequests'},
                      {
                        relation: 'polls',
                        order: 'createdAt DESC',
                        scope: {include: ['answers']}
                      }
                    ],
                    limit: 1
                  }).then(function(results){
                    if (results && results.length){
                      deferred.resolve(results[0]);
                    } else {
                      deferred.reject();
                    }
                  });
                });
                return deferred.promise;
              }
            }
          })

      }
    );
})();
