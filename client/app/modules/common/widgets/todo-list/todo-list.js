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
    .directive('todoList', function () {
      return {
        templateUrl: 'modules/common/widgets/todo-list/views/todo-list.html',
        restrict: 'E',
        transclude: true,
        controllerAs: 'ctrl',
        controller : 'TodoListCtrl',
        scope: {
          user: '='
        }
      };
    });

})();
