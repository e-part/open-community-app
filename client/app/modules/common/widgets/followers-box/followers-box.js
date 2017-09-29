(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name com.module.common.directive:followersBox
   * @description
   * # navbar
   */
  angular
    .module('com.module.common')
    .directive('followersBox',function() {
      return {
        templateUrl: 'modules/common/widgets/followers-box/views/followers-box.html',
        restrict: 'E',
        transclude: true,
        controller : 'followersBoxCtrl',
        controllerAs : 'ctrl',
        scope: {
          title: '@',
          members: '=',
        },
      };
    });
})();
