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
    .directive('aboutWidget', function () {
      return {
        templateUrl: 'modules/common/widgets/about/views/about.html',
        restrict: 'E',
        transclude: true,
        controllerAs: 'ctrl',
        controller : 'AboutWidgetCtrl',
        scope: {
        }
      };
    });

})();
