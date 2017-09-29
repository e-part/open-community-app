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
    .directive('communityList',function() {
      return {
        templateUrl: 'modules/common/widgets/community-list/views/community-list.html',
        restrict: 'E',
        transclude: true,
        controller : 'communityListCtrl',
        controllerAs : 'ctrl',
        scope: {
          communityMembers: '='
        },
      };
    });
})();
