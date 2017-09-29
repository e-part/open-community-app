(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name com.module.common.directive:recommendToFriend
   * @description
   * # navbar
   */
  angular
    .module('com.module.common')
    .directive('recommendToFriend',function() {
      return {
        templateUrl: 'modules/common/widgets/recommend-to-friend/views/recommend-to-friend.html',
        restrict: 'E',
        transclude: true,
        controller : 'recommendToFriendCtrl',
        controllerAs : 'ctrl',
        scope: {
          category: '='
        },
      };
    });
})();
