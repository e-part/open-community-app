(function () {
  'use strict';
  /* global FB */

  angular
    .module('com.module.main')
    .config(function ($stateProvider) {
        $stateProvider
          .state('app.public.main', {
            url: '',
            templateUrl: 'modules/public/main/views/main.html',
            controller: 'MainCtrl',
            controllerAs: 'ctrl',
            resolve: {
              checkMk: ['AppAuth','Constants','$location',
                function(AppAuth, Constants, $location) {
                  AppAuth.verifyRole(Constants.USER_ROLES.MK).then(function(result) {
                    if (result) {
                      $location.path('/dashboard');
                    }
                  });
                }
              ],
              archivePosts: [
                'PostsService','Constants',
                function (PostsService, Constants) {
                  return PostsService.getPosts({
                    order: 'endDate DESC',
                    counts : 'comments',
                    include : [
                      { relation: 'categories'},
                      { relation: 'committees'},
                      { relation: 'comments', scope: {order: 'id DESC', include: {relation: 'creator'}}}
                    ],
                    limit: Constants.CONFIG.HOME_FEED_ARCHIVE_POSTS_LIMIT,
                    where : {
                      endDate : { between : [
                        Constants.CONFIG.SHOW_ARCHIVE_POSTS_FROM_DATE,
                        Date.now()
                      ]

                      },
                      status : Constants.POST_STATUSES.PUBLISHED,
                      migrationStatus : Constants.POST_MIGRATION_STATUS.NORMAL
                    }
                  });
                }
              ],
              activePosts: [
                'PostsService','Constants','AppAuth',
                function (PostsService, Constants, AppAuth) {
                  return AppAuth.requestCurrentUser().then(function(user){
                    if (user){
                      return PostsService.getTopPostsByUser(user.id,Constants.CONFIG.HOME_FEED_ACTIVE_POSTS_LIMIT);
                    } else {
                      // get latest posts
                      return PostsService.getPosts({
                        order: 'endDate ASC',
                        counts : 'comments',
                        include : [
                          { relation: 'categories'},
                          { relation: 'committees'},
                          { relation: 'comments', scope: {order: 'id DESC', include: {relation: 'creator'}}}
                        ],
                        limit: Constants.CONFIG.HOME_FEED_ACTIVE_POSTS_LIMIT,
                        where : {
                          endDate : {gt: Date.now()},
                          status : Constants.POST_STATUSES.PUBLISHED,
                          migrationStatus : Constants.POST_MIGRATION_STATUS.NORMAL
                        }
                      });
                    }

                  });
                }
              ],
              latestComments :[
                'Comment',
                function (Comment) {
                  return Comment.getLatest().$promise
                }
              ],
              topContributors :[
                'UserService','Constants',
                function (UserService, Constants) {
                  return UserService.getTopCommentingByRole({ role : Constants.USER_ROLES.USER});
                }
              ],
            }
          });

      }
    );
})();
