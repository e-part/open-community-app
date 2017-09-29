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
    .directive('siteNavigation', function () {
      return {
        templateUrl: 'modules/common/site-navigation/views/site-navigation.html',
        restrict: 'E',
        transclude: true,
        controllerAs: 'ctrl',
        controller : 'siteNavigationCtrl',
        scope: {
        },
      };
    });

})();
