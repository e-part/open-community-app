/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.common')
    .controller('PostFormCtrl', function ($scope, gettextCatalog, PostsService, $state, CategoriesService, CommitteesService,
                                          Constants, AppAuth, UtilsService, PostFormService, $timeout) {

      /**
       * Post form refactor:
       * - create a single directive which is the base of all forms.
       * - all shared logic will be in the directive.
       * - postFormService is a service which take the parameters:
       *  (mode (create, update), post-type, user-role (UESR / ADMIN))
       *  the builder then creates the set of properties for the form to render.
       *
       *  - postFormService can be extended in the diffferent conrtollers to achieve different
       *  behavior.
       *  - API:
       *  buildFormFields()
       *
       *  submit()
       *
       *  init()
       *
       */
      var ctrl = this;

      // USER

      // general init code


      function _preparePostForSave(post) {
        var postToSave = angular.copy(post);
        if (!ctrl.inEditMode){
          postToSave.ownerId = ctrl.sessionData.currentUser.id;
        }
        // convert that to UTC before saving it to server.
        postToSave.meetings = _.map(postToSave.meetings, function(meeting){
          if (meeting.date){
            meeting.date = UtilsService.convertUTC(new Date(meeting.date), false);
          }
          return meeting;
        });
        // filter out meetings that are missing a date.
        postToSave.meetings = _.filter(postToSave.meetings, function(meeting){
          if (!meeting.date){
            return false;
          }
          return true;
        });
        postToSave.itemRequests = _.filter(postToSave.itemRequests, function(itemRequest){
          if (!itemRequest.description || ! itemRequest.quantity){
            return false;
          }
          return true;
        });
        delete postToSave.polls; // property is removed because we want to add polls only after post is saved.
        return postToSave;
      }

      function _postSubmittedCb(post){
        if (!post) {
          return;
        }
        PostsService.updatePolls(post, ctrl.post.polls).then(function(){
          if (ctrl.options.editMode){
            $scope.postForm.$setPristine();
          }
          if (ctrl.options.postSavedCb){
            ctrl.options.postSavedCb();
          }
        });

      }

      ctrl.init = function(){
        ctrl.post = $scope.post || {}; // in create this should be empty
        ctrl.options = $scope.options;
        ctrl.options.defaultPollConfig = PostsService.getDefaultPollConfig(ctrl.post.id);
        ctrl.statuses = PostsService.getStatuses();
        ctrl.reviewStatuses = PostsService.getReviewStatuses();
        ctrl.tinymceOptions = PostsService.getEditorOptions();
        ctrl.sessionData = AppAuth.getSessionData();
        ctrl.POST_TYPES = Constants.POST_TYPES;
        if (!ctrl.post.polls || !ctrl.post.polls.length){
          ctrl.post.polls = [angular.copy(ctrl.options.defaultPollConfig)];
        }
        if (!ctrl.post.meetings || !ctrl.post.meetings.length){
          ctrl.post.meetings = [{}];
        }
        if (!ctrl.post.itemRequests || !ctrl.post.itemRequests.length){
          ctrl.post.itemRequests = [{}];
        }
        CategoriesService.getCategories().then(function(result){
          ctrl.categories = result;
        });
        CommitteesService.getCommittees().then(function(result){
          ctrl.committees = result;
        });
        ctrl.pollAnswersColors = PostsService.getPollAnswersColors();
        ctrl.MAX_POLL_ANSWERS = Constants.CONFIG.MAX_POLL_ANSWERS;

        ctrl.inEditMode = ctrl.options.editMode;
        ctrl.formSections = PostsService.getFormSectionsByPostType(ctrl.post.type);
        if (ctrl.inEditMode) {
          $timeout(function () {
            $scope.postForm.$setPristine();
          }, 200);
        }
      };

      ctrl.submit = function (saveAsDraft) {
        var submitMethod = ctrl.options.editMode ? 'updatePost' : 'upsertPost';
        if (saveAsDraft){
          ctrl.post.status = Constants.POST_STATUSES.DRAFT;
        }
        var postToSave = _preparePostForSave(ctrl.post);
        PostsService[submitMethod](postToSave).then(_postSubmittedCb);
      };

      ctrl.initArr = function (field) {
        if (!ctrl.post[field]) {
          ctrl.post[field] = [];
        } else {
          ctrl.post[field] = _.map(ctrl.post[field], function (str) {
            return {text: str};
          });
        }
      };

      ctrl.removePoll = function (index) {
        ctrl.post.polls[index].archived = true;
      };

      ctrl.removeAnswer = function (poll, index) {
        if (poll.answers.length > 2) {
          poll.answers.splice(index, 1);
        }
      };

      ctrl.addPoll = function () {
        if (!ctrl.post.polls) {
          ctrl.post.polls = [];
        }
        ctrl.post.polls.push(angular.copy( ctrl.options.defaultPollConfig));
      };

      ctrl.addMeeting = function () {
        if (!ctrl.post.meetings) {
          ctrl.post.meetings = [];
        }
        ctrl.post.meetings.push({});
      };

      ctrl.removeMeeting = function (index) {
        ctrl.post.meetings.splice(index, 1);
      };

      ctrl.addItemRequest = function () {
        if (!ctrl.post.itemRequests) {
          ctrl.post.itemRequests = [];
        }
        ctrl.post.itemRequests.push({});
      };

      ctrl.removeItemRequest = function (index) {
        ctrl.post.itemRequests.splice(index, 1);
      };

      ctrl.updatePermalink = function (str) {
        if (ctrl.post.title) {
          ctrl.post.permaLink = ctrl.post.title.replace(/ /g, "-").toLowerCase().substring(0, Constants.MAX_CHARS_IN_SLUG);
        }
      };

      ctrl.init();



    });
})();
