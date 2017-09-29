/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.user-posts')
    .controller('UserAddPostCtrl', function (gettextCatalog, PostsService, $state,
                                             post, Constants, AppAuth, UtilsService, $stateParams ) {
      var ctrl = this;
      console.log('$stateParams : ', $stateParams );
      ctrl.post = post;
      ctrl.sessionData = AppAuth.getSessionData();
      ctrl.executingUserRole = 'USER';
      ctrl.executionMode = 'CREATE';
      ctrl.post.endDate = UtilsService.addMonths(new Date(), Constants.DEFAULT_DISCUSSION_PERIOD_IN_MONTHS);
      ctrl.post.status = Constants.POST_STATUSES.PUBLISHED;
      ctrl.post.type = $stateParams.type;
      ctrl.formOptions = {
        postSavedCb : function(){
          $state.go('app.public.profile', {id: ctrl.sessionData.currentUser.id});
        }
      };
    });


})();
