(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name com.module.common.directive:site-navigation
   * @description
   * # navigation links list for the app.
   */
  angular
    .module('com.module.common')
    .directive('postsList', function () {
      return {
        templateUrl: 'modules/common/posts-list/views/posts-list.html',
        restrict: 'E',
        transclude: true,
        controllerAs: 'ctrl',
        controller : 'UserPostsListCtrl',
        scope: {
          posts: '='
        },
      };
    });

})();
