(function () {
  'use strict';
  angular
    .module('com.module.posts')
    .config(function ($stateProvider) {
        $stateProvider
          .state('app.admin.posts', {
            abstract: true,
            url: '/posts',
            templateUrl: 'modules/admin/posts/views/main.html'
          })
          .state('app.admin.posts.list', {
            url: '',
            templateUrl: 'modules/admin/posts/views/list.html',
            controllerAs: 'ctrl',
            controller: 'PostsListCtrl',
            resolve: {
              posts: [
                'PostsService',
                function (PostsService) {
                  return PostsService.getPosts({
                    include: ['categories'],
                    limit : 10000,
                    order: 'updatedAt DESC'
                  });
                }
              ]
            }
          })
          .state('app.admin.posts.add', {
            url: '/add?type',
            templateUrl: 'modules/admin/posts/views/form.html',
            controllerAs: 'ctrl',
            controller: 'addPostCtrl',
            resolve: {
              post: function () {
                return {};
              }
            }
          })
          .state('app.admin.posts.edit', {
            url: '/:id/edit',
            templateUrl: 'modules/admin/posts/views/form.html',
            controllerAs: 'ctrl',
            controller: 'editPostCtrl',
            resolve: {
              post: function ($stateParams, PostsService) {
                return PostsService.getPost($stateParams.id, {
                  include: [
                    { relation: 'categories' },
                    { relation: 'committees' },
                    { relation: 'mks' },
                    { relation: 'meetings' },
                    { relation: 'itemRequests' },
                    { relation: 'polls',
                      order: 'createdAt DESC',
                      scope :  {include: ['answers']}
                    },
                  ]
                });
              }
            }
          })
          .state('app.admin.posts.analyze', {
            url: '/:id/analyze',
            templateUrl: 'modules/admin/posts/views/analyze.html',
            controllerAs: 'ctrl',
            controller: 'analizePostCtrl',
            resolve: {
              post: function ($stateParams, PostsService) {
                return PostsService.getPost($stateParams.id, {
                  include: [
                    {
                      relation: 'conclusions',
                      scope: {
                        include: ['decisions'],
                        order: 'createdAt DESC'
                      }
                    },
                    {
                      relation: 'comments',
                      scope: {
                        include: ['creator','tags'],
                        order: 'createdAt DESC'
                      }
                    },
                    {
                      relation: 'predefinedTags',
                      scope: {
                        include: ['children'],
                        order: 'createdAt DESC'
                      }
                    },
                  ]
                });
              }
            }
          })

          .state('app.admin.posts.view', {
            url: '/:id',
            templateUrl: 'modules/admin/posts/views/view.html',
            controllerAs: 'ctrl',
            controller: function (post) {
              this.post = post;
            },
            resolve: {
              post: function ($stateParams, PostsService) {
                return PostsService.getPost($stateParams.id);
              }
            }
          })
          .state('app.admin.posts.delete', {
            url: '/:id/delete',
            template: '',
            controllerAs: 'ctrl',
            controller: function ($state, PostsService, post) {
              PostsService.deletePost(post.id, function () {
                $state.go('^.list');
              }, function () {
                $state.go('^.list');
              });
            },
            resolve: {
              post: function ($stateParams, PostsService) {
                return PostsService.getPost($stateParams.id);
              }
            }
          });
      }
    );

})();
