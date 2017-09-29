(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name com.module.common.directive:mkList
   * @description
   * # navbar
   */
  angular
    .module('com.module.common')
    .directive('mkList',function() {
      return {
        templateUrl: 'modules/common/widgets/mk-list/views/mk-list.html',
        restrict: 'E',
        transclude: true,
        controller : 'mklListCtrl',
        controllerAs : 'ctrl',
        scope: {
          mks: '=',
          listTitle: '='
        }
      };
    });
})();
