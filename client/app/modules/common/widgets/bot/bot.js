(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name com.module.common.directive:bot
   * @description
   * # navbar
   */
  angular
    .module('com.module.common')
    .directive('bot',function() {
      return {
        templateUrl: 'modules/common/widgets/bot/views/bot.html',
        restrict: 'E',
        transclude: true,
        controller : 'BotWidgetCtrl',
        controllerAs : 'ctrl',
        scope: {}
      };
    });
})();
