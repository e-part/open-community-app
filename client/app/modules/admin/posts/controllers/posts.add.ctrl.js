/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.posts')
    .controller('addPostCtrl', function ($state, PostsService, post,
                                         Constants, Post, $q, UtilsService, $stateParams) {
      var ctrl = this;
      ctrl.post = post;
      ctrl.post.status = Constants.POST_STATUSES.DRAFT;
      ctrl.post.reviewStatus = Constants.POST_REVIEW_STATUSES.APPROVED;
      ctrl.post.endDate = UtilsService.addMonths(new Date(), Constants.DEFAULT_DISCUSSION_PERIOD_IN_MONTHS);
      ctrl.post.type = $stateParams.type || Constants.POST_TYPES.DISCUSSION;

      ctrl.formOptions = {
        inAdvancedEditMode : true,
        postSavedCb : function(){
          $state.go('^.list');
        }
      };

    });


})();
