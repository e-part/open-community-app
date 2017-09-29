(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name com.module.common.directive:header
   * @description
   * # Header of the app.
   */
  angular
    .module('com.module.common')
    .directive('topNavBar', function () {
      return {
        templateUrl: 'modules/common/top-nav-bar/views/top-nav-bar.html',
        restrict: 'E',
        transclude: false,
        controllerAs: 'ctrl',
        controller : 'TopNavBarCtrl'
      };
    });

})();
