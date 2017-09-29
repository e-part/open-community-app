(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name com.module.common.directive:content-feed
   * @description
   * # navbar
   */
  angular
    .module('com.module.common')
    .directive('contentFeed', function () {
      return {
        templateUrl: 'modules/common/content-feed/views/content-feed.html',
        restrict: 'E',
        transclude: true,
        controller : 'contentFeedCtrl',
        controllerAs : 'ctrl',
        scope: {
          feedPosts: '=',
          editable: '='
        },
      };
    });
})();
