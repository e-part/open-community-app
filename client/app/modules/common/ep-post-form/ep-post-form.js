(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name com.module.common.directive:add-to-calendar
   * @description
   * # navbar
   */
  angular
    .module('com.module.common')
    .directive('epPostForm', function () {
      return {
        templateUrl: 'modules/common/ep-post-form/views/ep-post-form.html',
        restrict: 'E',
        transclude: true,
        controller : 'PostFormCtrl',
        controllerAs : 'ctrl',
        scope: {
          post: '=',
          executionMode: '=',
          userRole: '=',
          editMode: '=',
          options: '=',
        },
      };
    });
})();
