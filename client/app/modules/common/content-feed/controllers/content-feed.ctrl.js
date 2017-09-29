/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.common')
    .controller('contentFeedCtrl', function (Constants, $scope, PostsService, UtilsService) {

    	var ctrl = this;
      function showHiddenPosts(){
        if ($scope.feedPosts){
          for (var i = 0; i < $scope.feedPosts.length; i++){
            if ($scope.feedPosts[i].showSectionOnScroll){
              $scope.feedPosts[i].showSection = true;
            }
          }
        }

      }
      function isCloseToBottom(){
        var BOTTOM_REACHED_THRESHOLD = 200;
        if ($('#feed_container').offset()) {

          return $(window).scrollTop() + window.innerHeight + BOTTOM_REACHED_THRESHOLD >=
            ($('#feed_container').offset().top + $('#feed_container').outerHeight());
        } else {
          return false;
        }
      }

      function checkIfReachedBottomOfFeed() {
        if(isCloseToBottom()) {
          $(window).off('scroll', checkIfReachedBottomOfFeed);
          showHiddenPosts();
          $scope.$apply();
        }
      }

      function _showMoreWhenBottomOfFeedReached(postsLength){
        var MAX_POSTS_TO_SHOW_ARCHIVE_POSTS = 5;
        if (postsLength <= MAX_POSTS_TO_SHOW_ARCHIVE_POSTS){ // automatically show all archive posts if the feed is shorter then the threshold..
          showHiddenPosts();
        } else {
          $(window).on('scroll', checkIfReachedBottomOfFeed);
        }
      }
      
    	function _init() {
    		ctrl.defaultImage = Constants.DEFAULT_AVATAR;
        ctrl.defaultPostBg = Constants.DEFAULT_POST_IMG;
        ctrl.defaultDiscussionThumbnail = Constants.DEFAULT_DISCUSSION_IMG;
        ctrl.defaultProjectThumbnail = Constants.DEFAULT_PROJECT_IMG;
        ctrl.isEditable = $scope.editable;
        ctrl.statuses = PostsService.getStatuses();// Constants.POST_STATUSES;
        var postsLength = $scope.feedPosts && $scope.feedPosts[0] && $scope.feedPosts[0].posts && $scope.feedPosts[0].posts.length;
        _showMoreWhenBottomOfFeedReached(postsLength);
      }
      
      ctrl.getStatus = function(statusKey){
        return UtilsService.getValueFromMap(ctrl.statuses, statusKey,'value', 'name');
      };
      ctrl.getPostThumbnail = PostsService.getPostThumbnail;

      $scope.$on("$destroy", function() {
        $(window).off('scroll');
      });

       	_init();
    });
})();
