(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name com.module.common.directive:widgets-sidebar
   * @description
   * # Element which contains the sidebar widgets.
   */
  angular
    .module('com.module.common')
    .directive('loginBox', function () {
      return {
        templateUrl: 'modules/common/widgets/login-box/views/login-box.html',
        restrict: 'E',
        transclude: true,
        controllerAs: 'ctrl',
        controller : 'LoginBoxCtrl'
        // scope: {
        // }
      };
    });

})();
