(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name com.module.common.directive:count-down
   * @description
   * # navbar
   */
  angular
    .module('com.module.common')
    .directive('countDown', function () {
      return {
        templateUrl: 'modules/common/count-down/views/count-down.html',
        restrict: 'E',
        transclude: true,
        controller : 'countDownCtrl',
        controllerAs : 'ctrl',
        scope: {
          time: '='
        },
      };
    });
})();
