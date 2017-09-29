(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name com.module.common.directive:communityList
   * @description
   * # navbar
   */
  angular
    .module('com.module.common')
    .directive('commentsList',function() {
      return {
        templateUrl: 'modules/common/widgets/comments-list/views/comments-list.html',
        restrict: 'E',
        transclude: true,
        controller : 'commentsListCtrl',
        controllerAs : 'ctrl',
        scope: {
          title: '@',
          comments: '='
        },
      };
    });
})();
