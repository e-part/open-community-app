(function () {
  'use strict';
  angular
    .module('com.module.posts')
    .service('PostsService', function (CoreService, Post, gettextCatalog, Constants, Comment,
                                       MessagesService, Poll, $q, Meeting, UtilsService, ItemRequest) {
      var PostsService = this;

      this.getPosts = function (filtersObj) {
        var filters = filtersObj || {
            include: ['categories'],
            order: 'updatedAt DESC'
          };
        return Post.find({
          filter: filters
        }).$promise;
      };

      this.getPost = function (id, filtersObj) {
        var filters = filtersObj || {
            include: ['categories']
          };
        return Post.findById({
            id: id,
            filter: filters
          }
        ).$promise;
      };

      this.getOwnerPosts = function (filtersObj) {
        var filters = filtersObj || {
            include: ['categories']
          };
        return Post.find({filter: filters}).$promise;
      };

      this.getPostByParams = function (filterObj) {
        var filter = filterObj || {};

        return Post.findOne({
            filter: filter
          }
        ).$promise;
      };

      this.upsertPost = function (post) {

        var postToSave = angular.copy(post);
        postToSave.__deps__ = {};
        postToSave.__deps__.categories = postToSave.categories;
        postToSave.__deps__.meetings = postToSave.meetings;
        postToSave.__deps__.committees = postToSave.committees;
        postToSave.__deps__.itemRequests = postToSave.itemRequests;
        postToSave.__deps__.polls = postToSave.polls;

        return Post.upsert(postToSave).$promise
          .then(function (post) {
            CoreService.toastMessage('success');
            return post;
          })
          .catch(function (err) {
              CoreService.toastMessage('error');
            }
          );
      };

      this.updatePost = function (post) {

        var postToSave = angular.copy(post);
        postToSave.__deps__ = {};
        postToSave.__deps__.categories = postToSave.categories;
        postToSave.__deps__.polls = postToSave.polls;
        postToSave.__deps__.meetings = postToSave.meetings;
        postToSave.__deps__.committees = postToSave.committees;
        postToSave.__deps__.itemRequests = postToSave.itemRequests;

        return Post.prototype$updateAttributes({id: postToSave.id}, postToSave).$promise
          .then(function (post) {
            CoreService.toastMessage('success');
            return post;
          })
          .catch(function (err) {
              CoreService.toastMessage('error');
            }
          );
      };

      function _upsertPoll(pollToAdd,postId){
        pollToAdd.postId = postId;
        if (!pollToAdd.id){ // new added poll
          return PostsService.addPoll(pollToAdd).then(function(poll){
            if (poll && poll.id){
              pollToAdd.id = poll.id;
              return PostsService.addRemovePollAnswers(pollToAdd);
            } else {
              var deferred = $q.defer();
              deferred.resolve();// immediately resolved promise
              return deferred.promise;
            }
          });
        } else { // poll already exists
          return PostsService.addRemovePollAnswers(pollToAdd);
        }
      }

      this.updatePolls = function(post, polls){
        if (polls.length){
          // do one request to create / update / delete the polls
          // for each of the returned polls, insert their answers.
          var requests = [];
          for (var i = 0; i < polls.length; i++){
            var poll = polls[i];
            requests.push(_upsertPoll(poll, post.id));
          }
          return $q.all(requests);
        }
      };

      this.addPoll = function(poll){
        if (poll.question){
          return Poll.upsert(poll).$promise;
        } else { // empty poll, no need to save
          var deferred = $q.defer();
          deferred.resolve();// immediately resolved promise
          return deferred.promise;
        }
      };

      this.addRemovePolls = function(post){
        var postToSave = angular.copy(post);
        postToSave.__deps__ = {};
        postToSave.__deps__.polls = postToSave.polls;
        return Post.upsert(post).$promise;
      };

      this.addRemovePollAnswers = function(poll){
        var pollToSave = angular.copy(poll);
        pollToSave.__deps__ = {};
        pollToSave.__deps__.answers = pollToSave.answers;
        return Poll.upsert(pollToSave).$promise;
      };
      // addRemovePollAnswers
      this.deletePost = function (id, successCb, cancelCb) {
        CoreService.confirm(
          gettextCatalog.getString('Are you sure?'),
          gettextCatalog.getString('Deleting this cannot be undone'),
          function () {
            Post.deleteById({id: id}, function () {
              CoreService.toastMessage( 'success');
              successCb();
            }, function (err) {
              CoreService.toastMessage('error');
              cancelCb();
            });
          },
          function () {
            cancelCb();
          }
        );
      };

      this.getStatuses = function() {
        return  [
          {
            'name': gettextCatalog.getString('Draft'),
            'value': Constants.POST_STATUSES.DRAFT
          },
          {
            'name': gettextCatalog.getString('Published'),
            'value': Constants.POST_STATUSES.PUBLISHED
          }
        ];
      };

      this.getReviewStatuses = function() {
        return  [
          {
            'name': gettextCatalog.getString('Approved'),
            'value': Constants.POST_REVIEW_STATUSES.APPROVED
          },
          {
            'name': gettextCatalog.getString('Denied'),
            'value': Constants.POST_REVIEW_STATUSES.DENIED
          }
        ];
      };

      this.getFormFields = function (isAdmin) {
        return [
          {
            key: 'title',
            type: 'input',
            templateOptions: {
              label: gettextCatalog.getString('Title'),
              required: true,
/*              onChange : function(value,obj,scope,extra){
                scope.model.permaLink = value.replace(/\s/g, '-');
              }*/
            }
          },
          {
            key: 'subtitle',
            type: 'textarea',
            templateOptions: {
              label: gettextCatalog.getString('Subtitle'),
              required: true
            }
          },
          {
            key: 'status',
            type: 'select',
            templateOptions: {
              label: gettextCatalog.getString('Status'),
              options: [
                {
                  'name': gettextCatalog.getString('Draft'),
                  'value': Constants.POST_STATUSES.DRAFT
                },
                {
                  'name': gettextCatalog.getString('Published'),
                  'value': Constants.POST_STATUSES.PUBLISHED
                }
              ]
            }
          },
          {
            key: 'permaLink',
            type: 'input',
            templateOptions: {
              label: gettextCatalog.getString('Short Name (no Spaces)'),
              required : true
            }
          }

        ];
      };

      this.getEditorOptions = function (){
        function myCustomOnInit() { // prevent auto focus on editor element
          var elm = $('form *:input[type!=hidden]:first');
          elm.focus();
        }

        return {
          plugins: 'link image code directionality',
          fontsize_formats: "12px 16px 20px 24px 28px 30px 34px",
          toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code | fontsizeselect | ltr rtl',
          height : 200,

          setup : function(ed)
          {
            ed.on('init', function()
            {
              this.execCommand("fontSize", true, "17px");
              this.execCommand("JustifyLeft", true, "true");
              this.execCommand("mceDirectionLTR", true);
              document.body.scrollTop = document.documentElement.scrollTop = 0;

            });
          }
        };
      };

      this.getComments = function (postId) {
        return Comment.find({
          filter: {
            where: {postId: postId},
            counts: 'upvotes',
            include: [{relation: 'tags'},{relation: 'creator', scope :  {include: ['roles']}}],
            order: 'id DESC'
          }
        }).$promise
      };

      this.getUserPosts = function (filters) {
        return Post.find({
          filter: filters
        }).$promise
      };

      this.formatComments = function (comments) {
        // move all comments that have no parent from the array into another array.
        // for each parent comment, put all of its children into its 'children' property.

        if (comments && comments.length) {
          var parentComments = _.filter(comments, function (o) {
            return !o.parentCommentId;
          });
          var childComments = _.filter(comments, function (o) {
            return o.parentCommentId;
          });
          _.map(parentComments, function (parentObj) {
            parentObj.children = [];
            _.map(childComments, function (childObj) {
              if (childObj.parentCommentId === parentObj.id) {
                parentObj.children.push(childObj);
              }
            });
          });
          return parentComments;
        } else {
          return [];
        }
      };

      this.addNewComment = function (newComment) {
        var newCommentToSave = angular.copy(newComment);
        newCommentToSave.__deps__ = {};
        newCommentToSave.__deps__.tags = newCommentToSave.tags;
        return Comment.create(newCommentToSave).$promise;
      };

      this.updateComment = function (editedComment) {
        var commentToSave = angular.copy(editedComment);
        commentToSave.__deps__ = {};
        commentToSave.__deps__.tags = commentToSave.tags;
        return Comment.upsert(commentToSave).$promise;
/*
        return Comment.update({where : {id : commentToSave.id}},commentToSave).$promise
*/
      };

      this.deleteComment = function (comment, successCb) {
        CoreService.confirm(
          gettextCatalog.getString('Are you sure?'),
          gettextCatalog.getString('Deleting this cannot be undone'),
          function () {
            return Comment.update({where : {id : comment.id}},{ id : comment.id,creatorId : comment.creatorId, deleted : true}).$promise.then(function(){
              successCb();
            });
          },
          function () {
          }
        );


/*
        return Comment.delete({id : comment.id}).$promise
*/
      };

      this.addUpVote = function (commentId, userId) {
        return Comment.prototype$__create__upvotes({id: commentId}, {userId: userId}).$promise
      };

      this.removeUpVote = function (commentId, upvoteId) {
        return Comment.deleteCurrentUserUpvote({id: commentId}).$promise
      };

      this.addTimePledge = function(postId, userId, hours){
        return Post.prototype$__create__timePledges({id: postId}, {hours : hours, userId: userId}).$promise
      };
      this.sendNotifications = function (postId) {
        return Post.sendNotifications({}, {postId: postId}).$promise
      }

      this.getTopPostsByUser = function (userId, limit, skip) {
        return Post.getTopPostsByUser({
          userId: userId,
          limit: limit,
          skip: skip
        }).$promise;
      };

      this.getPostsByCommentingUser = function (userId, limit, skip) {
        return Post.getPostsByCommentingUser({
          userId: userId,
          limit: limit,
          skip: skip
        }).$promise;
      };

      this.getPostsByCategories = function (categoriesIds, limit, skip) {
        return Post.getPostsByCategories({
          categoriesIds: categoriesIds,
          limit: limit,
          skip: skip
        }).$promise;
      };

      this.getPollAnswersColors = function(){
        return ["green", "red", "orange", "yellow", "blue", "purple", "pink", "indigo", "cyan", "teal"];
      };

      this.getDefaultPollConfig = function(postId){
        return {
          postId : postId,
          question : null,
          answers: [
            {
              answer: "",
              color: this.getPollAnswersColors()[0]
            },
            {
              answer: "",
              color: this.getPollAnswersColors()[1]
            }
          ]
        };
      };

      function getPostVotes (post) {
        // get the poll and sum the votes from all its answers
        var votesCount = 0;
        if (post.polls && post.polls.length) {
          for (var i = 0; i < post.polls.length; i++) {
            var answers = post.polls[i].answers
            if (answers && answers.length) {
              for (var j = 0; j < answers.length; j++) {
                votesCount += answers[j].votes;
              }
            }
          }
          return votesCount;
        } else {
          return 0;
        }
      }

      function getPostComments(post){
        return post.commentsCount;
      }

      this.getStats = function(post, participants){
        return {
          votes: {
            text: gettextCatalog.getString('VOTES'),
            count: getPostVotes(post),
            imgSrc: 'images/icon-votes.png'
          },
          comments: {
            text: gettextCatalog.getString('COMMENTS'),
            count: getPostComments(post),
            imgSrc: 'images/icon-comments.png'

          },
          participants: {
            text:gettextCatalog.getString('PARTICIPANTS'),
            count: participants.length,
            imgSrc: 'images/icon-people.png'

          }
        };
      };

      this.getFormSectionsByPostType = function(type) {
        if (!type){
          throw new Error('Post type argument must be specified.');
        }
        var postType = type || Constants.POST_TYPES.DISCUSSION;
        switch(postType){
          case Constants.POST_TYPES.DISCUSSION:
                return [
                  {
                    title: gettextCatalog.getString('Discussion Details'),
                    partial : '/modules/common/ep-post-form/views/sections/discussion-details.html',
                    texts : {
                      titlePlaceholder : gettextCatalog.getString('Phrase your discussion`s main question'),
                      subtitlePlaceholder : gettextCatalog.getString('Explain in 2-3 sentences what the discussion is about'),
                      subjectsPlaceholder : gettextCatalog.getString('Choose the subjects related to your discussion'),
                      mainImagePlaceholder : gettextCatalog.getString('Drag and drop/click to browse a relevant image ' +
                        'so your discussion page header will look awesome!'),
                      feedImagePlaceholder : gettextCatalog.getString('Drag and drop/click to browse a ' +
                        'relevant image to display on the feed.')
                    }
                  },
                  {
                    title: gettextCatalog.getString('Discussion Summary'),
                    partial : '/modules/common/ep-post-form/views/sections/discussion-summary.html'
                  },
                  {
                    title: gettextCatalog.getString('Meeting Details (Optional)'),
                    partial : '/modules/common/ep-post-form/views/sections/meeting-details.html'
                  },
                  {
                    title: gettextCatalog.getString('Add Polls (Optional)'),
                    partial : '/modules/common/ep-post-form/views/sections/add-polls.html'
                  }
                ];
          case Constants.POST_TYPES.PROJECT:
            return [
              {
                title: gettextCatalog.getString('Community Project Details'),
                partial : '/modules/common/ep-post-form/views/sections/discussion-details.html',
                texts : {
                  titlePlaceholder : gettextCatalog.getString('Phrase the project`s mission'),
                  subtitlePlaceholder : gettextCatalog.getString('Briefly (2-3 sentences) explain what the project is all about'),
                  subjectsPlaceholder : gettextCatalog.getString('Choose the subjects related to your project'),
                  mainImagePlaceholder : gettextCatalog.getString('Drag and drop/click to browse a relevant image ' +
                    'so your project page header will look awesome!'),
                  feedImagePlaceholder : gettextCatalog.getString('Drag and drop/click to browse a ' +
                    'relevant image to display on the feed.')
                }
              },
              {
                title: gettextCatalog.getString('Community Project Summary'),
                partial : '/modules/common/ep-post-form/views/sections/discussion-summary.html'
              },
              {
                title: gettextCatalog.getString('Project Work Meeting (Optional)'),
                partial : '/modules/common/ep-post-form/views/sections/meeting-details.html'
              },
              {
                title: gettextCatalog.getString('Project Resources (Optional)'),
                partial : '/modules/common/ep-post-form/views/sections/resources.html'
              }
            ];
        }
        return null;
      };

      this.convertMeetingDates = function(meetings){
        var formattedMeetings = angular.copy(meetings);
        return _.map(formattedMeetings, function(meeting){
          meeting.date = UtilsService.convertUTC(new Date(meeting.date), true);
          return meeting;
        });
      }

      this.getPostThumbnail = function(post, defaultImageAttribute){
        if (post[defaultImageAttribute]){
          return post[defaultImageAttribute];
        }
        switch(post.type) {
          case Constants.POST_TYPES.DISCUSSION: return CoreService.config.DEFAULT_DISCUSSION_IMG;
          case Constants.POST_TYPES.PROJECT: return CoreService.config.DEFAULT_PROJECT_IMG;
          default: return CoreService.config.DEFAULT_POST_IMG;
        }
      };

      this.addResourcePledge = function(itemRequestId, userId, quantity, pledgeId){
        if (pledgeId){
          return ItemRequest.prototype$__updateById__itemPledges({id: itemRequestId, fk: pledgeId }, {quantity : quantity, userId: userId}).$promise
        } else {
          return ItemRequest.prototype$__create__itemPledges({id: itemRequestId}, {quantity : quantity, userId: userId}).$promise
        }
      }
    });

})();
