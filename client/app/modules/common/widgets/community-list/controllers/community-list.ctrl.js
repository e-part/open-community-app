/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.common')
    .controller('communityListCtrl', function ($scope, gettextCatalog, UserService, AppAuth, Constants) {
      var ctrl = this;
      // ctrl.communityMembers = $scope.communityMembers;
      ctrl.sessionData = AppAuth.getSessionData();
      ctrl.listLimit = 3;
      ctrl.defaultAvatar = Constants.DEFAULT_AVATAR;
    });
})();
