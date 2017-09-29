/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.posts')
    .controller('editPostCtrl', function ($scope, $state, PostsService, post, UtilsService) {
      var ctrl = this;
      ctrl.post = post;
      ctrl.post.endDate = new Date(ctrl.post.endDate);
      ctrl.post.meetings = PostsService.convertMeetingDates(ctrl.post.meetings);
      ctrl.formOptions = {
        editMode: true,
        inAdvancedEditMode : true
    };
    });


})();
