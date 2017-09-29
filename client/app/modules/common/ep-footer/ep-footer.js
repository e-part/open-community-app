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
    .directive('epFooter', function () {
      return {
        templateUrl: 'modules/common/ep-footer/views/ep-footer.html',
        restrict: 'E',
        transclude: true,
        controllerAs: 'ctrl',
        controller : 'epFooterCtrl',
        scope: {
        },
      };
    });

})();
