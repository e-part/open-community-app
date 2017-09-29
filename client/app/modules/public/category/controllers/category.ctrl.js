/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.category')
    .controller('CategoryCtrl', function ($rootScope, $scope, DialogsService, $location, gettextCatalog, category,
                                          CoreService, AppAuth, UserService, UserActions, CategoriesService, Constants, categoryWithArchivePosts) {


      var ctrl = this;
      ctrl.category =  category;

      /**
       * get users who commented
       * @param categoryId
       * @returns {*}
       */
      function getTopUsers(categoryId) {
        return UserService.mostUpvotedByCategory({
          categoryId: categoryId
        }).then(function (result) {
          // success
          if (result && result.length) {
            ctrl.followers = result;
          } else { // if no one commented yet, just show some followers.
            ctrl.followers = ctrl.category.followers;
          }

        }, function () {
          // error
          ctrl.followers = [];
        })
      }

      function _init() {

        ctrl.posts = ctrl.category.posts || [];
        getTopUsers(ctrl.category.id);
        ctrl.hasPosts = ctrl.posts.length || categoryWithArchivePosts.posts.length;
        ctrl.feedPosts = [
          {
            title: gettextCatalog.getString('Popular'),
            subtitle: gettextCatalog.getString('Top ranked posts'),
            posts: ctrl.posts
          },
          {
            title: gettextCatalog.getString('Previous Discussions'),
            posts: categoryWithArchivePosts.posts,
            showSectionTitle: true,
            showSection: false,
            showSectionOnScroll : true
          }
        ];
        ctrl.sessionData = AppAuth.getSessionData();
        ctrl.isMK = AppAuth.hasRole(Constants.USER_ROLES.MK);

        if (ctrl.sessionData.currentUser) {
          check_if_user_follow_category();
        }
      }

      function check_if_user_follow_category() {
        ctrl.category.following = false;
        $.each(ctrl.sessionData.currentUser.categories, function (key, value) {
          if (value.id === ctrl.category.id) {
            ctrl.category.following = true;
          }
        });
      }

      ctrl.addRemoveCategory = function (category) {
        if (!ctrl.sessionData.currentUser) { // prompt login popup if signed out.
          DialogsService.openDialog('login', {actionIntercepted: true});
          return false;
        }
        UserActions.addRemoveCategory(ctrl.sessionData.currentUser.id, category);
      }

      CoreService.setMetaTags({
        title: ctrl.category.name,
        image: ctrl.category.imageUrl,
        url: $location.absUrl()
      });

      $scope.$on('$viewContentLoaded', function () {
        CoreService.sendGaPageview($location.url(), ctrl.category.name);
      });

      _init();

    });

})();
