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
    .directive('exportToCalendar', function () {
      return {
        templateUrl: 'modules/common/export-to-calendar/views/export-to-calendar.html',
        restrict: 'E',
        transclude: true,
        controller : 'ExportToCalendarCtrl',
        controllerAs : 'ctrl',
        scope: {
          post: '=',
          page: '@'
        },
      };
    });
})();
