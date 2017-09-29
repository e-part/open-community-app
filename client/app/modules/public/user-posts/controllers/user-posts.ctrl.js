/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.user-posts')
    .controller('UserPostsCtrl', function ($scope, gettextCatalog, CoreService, AppAuth, PostsService,
                                                      $location, userPosts) {
      var title = gettextCatalog.getString('My Discussions');
      CoreService.setMetaTags({
        title: title
      });

      $scope.$on('$viewContentLoaded', function(){
        CoreService.sendGaPageview($location.url(), title);
      });

      var ctrl = this;


      function _init() {
        ctrl.posts = userPosts;
      }

      _init();

    });


})();
