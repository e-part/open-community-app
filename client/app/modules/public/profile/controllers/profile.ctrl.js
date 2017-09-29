/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.profile')
    .controller('ProfileCtrl', function ($rootScope, $scope, gettextCatalog, CoreService, AppAuth, UserService, Constants,
                                         UserActions, user, PostsService, $location, CLIENT_CONFIG) {
      var title = user.firstName + ' ' + user.lastName;
      CoreService.setMetaTags({
        title: title,
        image: user.imageUrl
      });

      $scope.$on('$viewContentLoaded', function () {
        CoreService.sendGaPageview($location.url(), title);
      });

      var ctrl = this;

      function isUserFollowed() {
        if (ctrl.sessionData.currentUser) {
          // test if user is followed by the current user;

          UserService.isFollowingUser({userId: ctrl.user.id}).then(function (response) {
            // success
            ctrl.isUserfollowed = response.follows;
          }, function (err) {
            // error
            console.error('Error: Could not verify if user is followed.');
          });
        }

      }

      function isBelongsToUser() {
        return ctrl.sessionData.currentUser && ctrl.sessionData.currentUser.id === ctrl.user.id;
      }

      function initUserDiscussions() {
        // TODO external users should only see published posts.
        var filters = {
          where: {ownerId: ctrl.user.id},
          order: 'id DESC'
        };
        if (!ctrl.isPageBelongsToUser) {
          filters.where.status = Constants.POST_STATUSES.PUBLISHED;
        }
        PostsService.getUserPosts(filters).then(function (result) {
          ctrl.myPosts = {
            posts: {
              posts: result
            }
          }
          ctrl.myPostsCount = result.length;
        });
      }

      function _init() {
        ctrl.userFullName = user.firstName + ' ' + user.lastName;
        ctrl.showUserCreatedPosts = (CLIENT_CONFIG.attributes.MASTER_CLIENT_TYPE !== Constants.MASTER_CLIENT_TYPES.EPART);
        if (ctrl.showUserCreatedPosts) {
          ctrl.visibleSection = 'myPosts'
        } else {
          ctrl.visibleSection = 'posts'

        }
        ctrl.user = user;
        ctrl.userFollowers = ctrl.user.followers.length;
        ctrl.userFollowees = ctrl.user.followees.length;
        ctrl.userVotes = 0;
        ctrl.userComments = ctrl.user.commentsCount;
        ctrl.sessionData = AppAuth.getSessionData();
        ctrl.isPageBelongsToUser = isBelongsToUser();
        isUserFollowed();
        ctrl.posts = [];
        ctrl.defaultAvatar = Constants.DEFAULT_AVATAR;
        PostsService.getPostsByCommentingUser(ctrl.user.id, Constants.CONFIG.USER_PROFILE_POSTS_LIMIT).then(function (result) {
          ctrl.feedPosts = {};
          ctrl.feedPosts.posts = {}
          ctrl.feedPosts.posts.posts = result;
          ctrl.feedPostsCount = result.length;
        });
        initUserDiscussions();
      }

      ctrl.followOrUnfollowUser = function () {
        if (ctrl.sessionData.currentUser) {
          if (!ctrl.isUserfollowed) {
            UserService.followUser(ctrl.sessionData.currentUser.id, ctrl.user.id).then(function (res) {
              ctrl.user.followers.push(ctrl.sessionData.currentUser);
              ctrl.isUserfollowed = true;
              ctrl.userFollowers++;
            });
          } else {
            // TODO
            UserService.unfollowUser(ctrl.sessionData.currentUser.id, ctrl.user.id).then(function (res) {
              ctrl.user.followers.forEach(function (element, index) {
                if (element.id === ctrl.sessionData.currentUser.id) {
                  ctrl.user.followers.splice(index, 1);
                  return;
                }
              });
              ctrl.isUserfollowed = false;
              ctrl.userFollowers--;

            });
          }
        }
      };
      _init();

    });

})();
