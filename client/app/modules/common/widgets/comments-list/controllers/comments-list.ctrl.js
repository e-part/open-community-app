/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.common')
    .controller('commentsListCtrl', function ($scope, gettextCatalog, UserService, AppAuth, Constants) {
      var ctrl = this;
      ctrl.comments = $scope.comments;
      ctrl.sessionData = AppAuth.getSessionData();
      ctrl.listLimit = 4;
      ctrl.defaultAvatar = Constants.DEFAULT_AVATAR;

      ctrl.isMK = function(user) {
        return AppAuth.hasRole(Constants.USER_ROLES.MK,user);
      }
      
    });
})();
