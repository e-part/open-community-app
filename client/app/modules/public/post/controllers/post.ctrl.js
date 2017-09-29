/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.post')
    .controller('PostCtrl', function ($scope, post, $rootScope, CoreService, PostsService, AppAuth, DialogsService, Constants,
                                      PollAnswer, $location, gettextCatalog, FileUploader, $filter, $sce, Tag, UtilsService, CLIENT_CONFIG) {
      CoreService.setMetaTags({
        title: post.title,
        description: post.subtitle,
        image: post.fbImage,
        url: $location.absUrl(),
        type: 'article'
      });

      $scope.$on('$viewContentLoaded', function () {
        CoreService.sendGaPageview($location.url(), post.title);
      });

      var ctrl = this;
      var RECOMMENDED_POSTS_NUM = 4;

      function _init() {
        ctrl.masterClientType = CLIENT_CONFIG.attributes.MASTER_CLIENT_TYPE;
        ctrl.showMks = (ctrl.masterClientType === Constants.MASTER_CLIENT_TYPES.EPART);
        ctrl.POST_TYPES = Constants.POST_TYPES;
        ctrl.apiUrl = CoreService.env.apiUrl;
        ctrl.bucket = CoreService.env.bucket;
        ctrl.uploading = false;
        ctrl.commentFiles = [];
        ctrl.texts = {
          "new": gettextCatalog.getString('New')
        };
        ctrl.currentTime = new Date();
        ctrl.post = post || {};
        if (ctrl.post.youtubeVideoId) {
          // try to extract ID from link, otherwise just user the youtubeVideoId.
          var extractIdFromUrl = UtilsService.extractYoutubeVideoId(ctrl.post.youtubeVideoId);
          ctrl.post.videoUrl = $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + (extractIdFromUrl || ctrl.post.youtubeVideoId));
        }
        ctrl.post.endDate = new Date(ctrl.post.endDate);
        ctrl.post.meetings = PostsService.convertMeetingDates(ctrl.post.meetings);

        ctrl.categories = post.categories || [];
        ctrl.timelineItems = [
          {
            key : "discussion",
            title :gettextCatalog.getString('Public Brainstorming'),// סיעור מוחות
            description :gettextCatalog.getString('Collect ideas from citizens'),
            // העלאת רעיונות והצעות המתבססות על הידע והניסיון של המשתתפים.
            checked : true
          },
          {
            key : "data_analysis",
            title :gettextCatalog.getString('Public Data Analysis'),
            description :gettextCatalog.getString('In this step, We will analyze the data and ideas gathered during the public brainstorming'),
            // בשלב זה, אנחנו ננתח את המידע שעלה בסיעור המוחות הציבורי כדי לגבש מסקנות והחלטות.
            disabled : true,
            checked : (ctrl.post.conclusions && ctrl.post.conclusions.length) || new Date() >= ctrl.post.endDate

          },
          {
            key : "conclusions",
            title :gettextCatalog.getString('Conclusions and Decisions'),// פרסום מסקנות והחלטות
            description :gettextCatalog.getString('The products of the public discussion will be presented, and will include the conclusions and the recommendations for action'),
            // התוצרים של תהליך השיתוף יפורסמו, ויכללו סיכום קצר של כל המסקנות שעלו מהדיון הציבורי ואת ההחלטות וההמלצות לפעולה.
            checked : ctrl.post.conclusions && ctrl.post.conclusions.length
          }
        ];
        ctrl.sessionData = AppAuth.getSessionData();
        ctrl.defaultPostBg = Constants.DEFAULT_POST_IMG;
        ctrl.defaultAvatar = Constants.DEFAULT_AVATAR;
        ctrl.currentProcessStep = $location.search().step || ctrl.timelineItems[0].key;
        ctrl.mks = getMks();
        PostsService.getComments(ctrl.post.id).then(function (result) {
          ctrl.post.comments = PostsService.formatComments(result);
          ctrl.commentsToView = angular.copy(ctrl.post.comments);
          ctrl.orderComments = "-upvotesCount";
          ctrl.commentsToView = $filter('orderBy')(ctrl.commentsToView, ctrl.orderComments);
          ctrl.allDiscussionMembers = getActiveUsers(ctrl.post);
          ctrl.allCommentsTags = _.union(_.flatten((_.map(ctrl.post.comments, 'tags')))); // get all tags in the post's comments
          ctrl.suggestedTags = _.uniq(_.union(ctrl.allCommentsTags, ctrl.post.predefinedTags),
            function (obj) { // make sure there are no duplicated
              return obj.content;
            });
          initStats();

        });
        PostsService.getPosts({
          where: {
            id: {neq: ctrl.post.id},
            status: Constants.POST_STATUSES.PUBLISHED,
            migrationStatus: Constants.POST_MIGRATION_STATUS.NORMAL
          },
          order: 'endDate DESC',
          limit: RECOMMENDED_POSTS_NUM
        }).then(function (recommendedPosts) {
          ctrl.recommendedPosts = recommendedPosts;
        });
        ctrl.post.itemRequests = _.map(ctrl.post.itemRequests, function(itemRequest){
          itemRequest.userPledge = getUserPledge(itemRequest.itemPledges);
          return itemRequest
        });
        ctrl.todaysDate = new Date();
        ctrl.postTexts = getPostTextsByType(ctrl.post.type);
        setLinksToOpenInNewTab();
        initProjectProps();
        initPolls();
        setShareLinks();
        setFileUpload();
      }

      function getUserPledge(itemPledges){
        if (ctrl.sessionData.currentUser){
          return _.findWhere(itemPledges, {userId : ctrl.sessionData.currentUser.id });
        } else {
          return null;
        }
      }

      function getPostTextsByType(postType) {
        switch(postType) {
          case Constants.POST_TYPES.DISCUSSION:
            return {
              statsWidgetTitle: gettextCatalog.getString('Discussion Overview'),
              postbackgroundTitle: gettextCatalog.getString('Discussion Background'),
              meetingsWidgetTitleText: gettextCatalog.getString('Public Meetings'),

            };
          case Constants.POST_TYPES.PROJECT:
            return {
              statsWidgetTitle: gettextCatalog.getString('Community Project Overview'),
              postbackgroundTitle: gettextCatalog.getString('Community Project Background'),
              meetingsWidgetTitleText: gettextCatalog.getString('Project Work Meeting'),

            };
        }
      }

      function initProjectProps(){
        if (ctrl.post.type === Constants.POST_TYPES.PROJECT){
          ctrl.totalPledgedHours = getPledgedHours(ctrl.post.timePledges);
          var timePledgeCompletedPrecent = ctrl.totalPledgedHours / ctrl.post.minimumRequiredHours * 100;
          ctrl.timePlageProgressStyle = {width: (timePledgeCompletedPrecent > 100 ? 100 : timePledgeCompletedPrecent) + '%'};
          if (ctrl.sessionData.currentUser){
            ctrl.userPledgedTime = _.find(ctrl.post.timePledges, {userId : ctrl.sessionData.currentUser.id});
          }
        }
      }

      function initStats(){
        ctrl.postStats = PostsService.getStats(ctrl.post, ctrl.allDiscussionMembers);
      }

      function getPledgedHours(timePledges){
        var total = 0;
        timePledges.forEach(function(pledge){
          total+= pledge.hours;
        });
        return total;
      }

      function setLinksToOpenInNewTab() {
        $('.post').on('click', 'a', function (e) {
          e.target.target = '_blank';
        });
      }

      function setShareLinks() {
        ctrl.shareUrls = {};
        ctrl.shareUrls.twitter = CoreService.generateShareUrl('twitter', {
          text: ctrl.post.title,
          hashTags: ['ePart'],
          url: $location.absUrl()
        });

        ctrl.shareUrls.facebook = CoreService.generateShareUrl('facebook', {
          url: encodeURIComponent($location.absUrl())
        });
      }
      /**
       * get discussion paticipants that are not mks.
       * @param post
       * @returns {Array}
       */
      function getActiveUsers(post) {
        function addUser(users, user) { // add user to list if not already exists
          if (!_.find(users, {id: user.id}) && !ctrl.isMK(user)) {
            users = users.concat([user]);
          }
          return users;
        }

        var uniqueUsers = [];
        if (ctrl.showMks){
          // include committees members
          for (var i = 0; i < ctrl.mks.length; i++) {
            uniqueUsers = addUser(uniqueUsers, ctrl.mks[i]);
          }
        } else {
          // include post creator
          if (post.owner){ // add owner of the post if exists
            uniqueUsers = addUser(uniqueUsers, post.owner);
          }
        }

        if (post.comments && post.comments.length) {
          for (var i = 0; i < post.comments.length; i++) {
            uniqueUsers = addUser(uniqueUsers, post.comments[i].creator);
          }
        }
        // add the users that pledged to the post
        if (post.type === Constants.POST_TYPES.PROJECT){
          post.timePledges.forEach(function(timePledge){
            uniqueUsers = addUser(uniqueUsers, timePledge.user);

          });
        }




        return uniqueUsers;

      }

      function refreshParticipantsList(){
        ctrl.allDiscussionMembers = getActiveUsers(ctrl.post);
        ctrl.prepareMksList();
      }

      function initPoll(poll){
        return CoreService.calculatePollPercentage(poll);
      }

      function initPolls() {
        ctrl.post.polls = _.map(ctrl.post.polls, function(poll){
          return initPoll(poll);
        });
      }
      /**
       * add mk to the list if not exists.
       * @param mks
       * @param mk
       */
      function addMk(mks, mk) {
        if (!_.find(mks, {id: mk.id})) {
          mks.push(mk);
        }
      }

      /**
       * get all mks that are involved in the post. This means adding the mks from each related committee,
       * and all additional mks.
       * Need to avoid duplicates.
       */
      function getMks() {
        var allMks = angular.copy(ctrl.post.mks); // add additional mks

        for (var i = 0; i < ctrl.post.committees.length; i++) { // for every committee
          var committee = ctrl.post.committees[i];
          if (committee.mks) {
            for (var j = 0; j < committee.mks.length; j++) { // for each mk of the committee
              addMk(allMks, committee.mks[j]);
            }
          }
        }
        return allMks;
      }

      function addComment(newComment, parentCommentId) {
        PostsService.addNewComment(newComment).then(function (comment) {
          if (comment) {
            comment.tags = newComment.tags;
            comment.upvotesCount = 0;
            comment.creator = ctrl.sessionData.currentUser;
            if (parentCommentId) {
              $.each(ctrl.commentsToView, function (k, v) {
                if (v.id == parentCommentId) {
                  v.children = v.children || [];
                  v.children.unshift(comment);
                }
              })
            } else {
              ctrl.commentsToView.unshift(comment);
            }
            ctrl.newChildComment = '';
            ctrl.newComment = '';
            ctrl.showForm = null;
            ctrl.expandForm = false;
            ctrl.commentFiles = [];
            ctrl.selectedTags = [];
          }
        });

      }

      function setFileUpload() {
        ctrl.uploader = new FileUploader({
          url: ctrl.apiUrl + 'containers/' + ctrl.bucket + '/upload',
          onAfterAddingFile: function (item) {
            var fileExtension = '.' + item.file.name.split('.').pop();
            item.file.name = Math.random().toString(36).substring(7) + new Date().getTime() + fileExtension;
            item.upload();
            ctrl.uploading = true;
          },
          onCompleteItem: function (data) {
            ctrl.commentFiles.push(
              {
                fileName: data.file.name,
                filePath: 'https://' + CoreService.env.bucket + CoreService.config.S3_PREFIX + data.file.name
              }
            );
            ctrl.uploading = false;
            ctrl.uploader.queue = [];
          }
        });
      }

      ctrl.getPostThumbnail = PostsService.getPostThumbnail;

      ctrl.switchPage = function(index){
        if (!ctrl.timelineItems[index].disabled && ctrl.timelineItems[index].checked ){
          ctrl.currentProcessStep = ctrl.timelineItems[index].key;
          $location.search("step",ctrl.currentProcessStep);
        }
      };

      ctrl.showFileName = function (fileFullPath, index) {
        var fileFullPathSplitted = fileFullPath.split('.'),
          fileExt = fileFullPathSplitted[fileFullPathSplitted.length - 1],
          newFileName = fileExt + '.' + gettextCatalog.getString('document') + ' ' + (index + 1);

        return newFileName;
      };

      ctrl.checkFileExtention = function (file, type) {

        var fileSplitted = file.split('.'),
          fileExt = fileSplitted[fileSplitted.length - 1];

        switch (type) {
          case 'pic':
            if (['jpg', 'jpeg', 'png', 'gif', 'JPG', 'JPEG', 'PNG', 'GIF'].indexOf(fileExt) > -1) {
              return true;
            }
            return false;
            break;
          case 'doc':
            if (['pdf', 'doc', 'txt', 'xls', 'PDF', 'DOC', 'TXT', 'XLS'].indexOf(fileExt) > -1) {
              return true;
            }
            return false;
            break;
        }
      };

      ctrl.submitComment = function (parentCommentId, repliedToCommentId) {
        if (!ctrl.sessionData.currentUser) {
          DialogsService.openDialog('login', {actionIntercepted: true});
          return;
        }

        var filesArray = [];

        for (var c in ctrl.commentFiles) {
          filesArray.push(ctrl.commentFiles[c].filePath)
        }

        var newComment = {
          content: this.newComment,
          files: filesArray,
          postId: this.post.id,
          creatorId: ctrl.sessionData.currentUser.id,
          parentCommentId: null,
          repliedToCommentId: repliedToCommentId || null,
          tags: ctrl.selectedTags
        };
        if (parentCommentId) {
          newComment.parentCommentId = parentCommentId;
          newComment.content = this.newChildComment;
        }
        var existingTags = _.reject(ctrl.selectedTags, function (obj) {
          return !obj.id;
        });
        var newTags = _.reject(ctrl.selectedTags, function (obj) {
          return obj.id;
        });
        if (newTags && newTags.length) { // if there are new tags add them first
          Tag.createAll({tags: newTags}).$promise.then(function (createdTags) {
            newComment.tags = existingTags.concat(createdTags)
            addComment(newComment, parentCommentId);
          });
        } else {
          addComment(newComment, parentCommentId);
        }
      };

      ctrl.openCommentForEdit = function (commentToEdit) {
        ctrl.showEditForm = commentToEdit.id;
        ctrl.showForm = null;
        ctrl.originalEditedComment = angular.copy(commentToEdit);
      };

      ctrl.cancelEditing = function (comment) {
        comment.content = ctrl.originalEditedComment.content;
        ctrl.showEditForm = null;
      };

      ctrl.editComment = function (editedComment) {
        function updateComment(editedComment) {
          PostsService.updateComment(editedComment).then(function () {
            ctrl.showEditForm = null;
          }, function () {
            // error
          });
        }

        var existingTags = _.reject(editedComment.tags, function (obj) {
          return !obj.id;
        });
        var newTags = _.reject(editedComment.tags, function (obj) {
          return obj.id;
        });
        if (newTags && newTags.length) { // if there are new tags add them first
          Tag.createAll({tags: newTags}).$promise.then(function (createdTags) {
            editedComment.tags = existingTags.concat(createdTags)
            updateComment(editedComment);
          });
        } else {
          updateComment(editedComment);
        }


      };

      ctrl.submitUpVote = function (comment, voted) {
        if (!ctrl.sessionData.currentUser) {
          DialogsService.openDialog('login', {actionIntercepted: true});
          return;
        }

        if (voted) {
          PostsService.removeUpVote(comment.id, ctrl.sessionData.currentUser.id).then(function (upvote) {
            comment.upvotesCount--;
            comment.voted = false;
          });
        } else {
          PostsService.addUpVote(comment.id, ctrl.sessionData.currentUser.id).then(function (upvote) {
            comment.upvotesCount++;
            comment.voted = true;
          });
        }

      };

      ctrl.shrinkTextBox = function (e) {
        if (!e.target.value) {
          ctrl.expandForm = false;
        }
      };

      ctrl.prepareMksList = function () {
        ctrl.showArrows = false;
        ctrl.mkItemWidth = $('.mks-list li').first().width(); // the width of each li in this list
        var listWidth = ctrl.allDiscussionMembers.length * ctrl.mkItemWidth;
        var listWrapperWidth = $('.mks-list').width();
        ctrl.visibleItemsAsDefault = listWrapperWidth / ctrl.mkItemWidth;
        if (listWidth > listWrapperWidth) {
          ctrl.showArrows = true;
        }
        ctrl.eachStepPixels = listWidth / ctrl.allDiscussionMembers.length;
      };

      ctrl.moveMksList = function (direction) {
        ctrl.allowedSteps = ctrl.allowedSteps || (ctrl.allDiscussionMembers.length - Math.floor(ctrl.visibleItemsAsDefault)) * ctrl.mkItemWidth;
        ctrl.steps = ctrl.steps || 0;
        if (ctrl.steps >= 0) {
          if (direction === 'right' && ctrl.allowedSteps > ctrl.steps) {
            ctrl.steps += ctrl.eachStepPixels;
          } else if (direction === 'left' && ctrl.steps > 0) {
            ctrl.steps -= ctrl.eachStepPixels;
          }
        }
      };

      ctrl.scrollToComment = function () {
        if ($location.search().tag && ctrl.currentProcessStep === "discussion"){
          ctrl.filterCommentsByTag({content : $location.search().tag });
        } else {
          var commentId = CoreService.getParameterFromUrl('comment_id');
          if (commentId) {
            var t = setInterval(function () {
              var commentElement = $('[data-comment-id="' + commentId + '"]');
              if ($(commentElement).length) {
                var offsetTop = $(commentElement).offset().top - $('#top-nav-bar').height();
                $('html,body').animate({scrollTop: offsetTop + 'px'}, 1000, function () {
                  $(commentElement).addClass('highlighted');
                });
                clearInterval(t);
              }
            }, 50);
          }
        }

      };

      ctrl.isMK = function (user) {
        return AppAuth.hasRole(Constants.USER_ROLES.MK, user);
      };

      ctrl.showLoginBox = function () {
        if (!ctrl.sessionData.currentUser) { // prompt login popup if signed out.
          DialogsService.openDialog('login', {actionIntercepted: true});
          return true;
        }
        return false;
      };

      ctrl.vote = function (poll,answerId) {
        if (!ctrl.showLoginBox()) {
          PollAnswer.incrementAnswerVotes({}, {id: answerId}).$promise.then(function (res) {
            poll.answers = res.answers;
            poll = initPoll(poll);
            poll.voted = true;
          });
        }

      };

      ctrl.generateCommentShareUrl = function (platform, comment) {
        switch (platform) {
          case 'twitter':
            return CoreService.generateShareUrl('twitter', {
              text: ctrl.genereateShareQuote(comment),
              hashTags: ['ePart'],
              url: $location.absUrl() + '?comment_id=' + comment.id
            });
            break;
          case 'facebook':
            return CoreService.generateShareUrl('facebook', {
              text: encodeURIComponent(comment.content),
              url: encodeURIComponent($location.absUrl() + '?comment_id=' + comment.id)
            });
            break;
        }
      };

      ctrl.FBshare = function (e, comment) {
        e.preventDefault();
        var quote = '',
          link = $location.absUrl();
        if (comment) {
          quote = ctrl.genereateShareQuote(comment);
          link = $location.absUrl().split('?')[0] + '?comment_id=' + comment.id
        }
        FB.ui(
          {
            method: 'feed',
            link: link,
            picture: post.fbImage,
            name: post.title,
            description: post.subtitle,
            quote: quote
          });
      };

      ctrl.genereateShareQuote = function (comment) {
        var quote = gettextCatalog.getString('Comment by') + ' ' + comment.creator.firstName + ' ' + comment.creator.lastName + ': "' + comment.content + '"';
        return quote
      };

      ctrl.updatePostsOrder = function (orderBy) {
        ctrl.orderComments = orderBy;
        ctrl.commentsToView = $filter('orderBy')(ctrl.commentsToView, orderBy);
      };

      ctrl.deleteComment = function (comment, list) {
        PostsService.deleteComment(comment, function () {
          // TODO what to do with comments that have children. (should it be allowed?)
          var index = list.indexOf(comment);
          if (index > -1) {
            list.splice(index, 1);
          }
        });

      };

      ctrl.suggestRelatedTags = function () {
      };

      ctrl.newTagAdded = function (newTag) {
        var item = {
          content: newTag
        };
        return item;
      };

      ctrl.filterCommentsByTag = function (tag) {
        ctrl.tagToFilterBy = tag;
        ctrl.commentsToView = _.filter(ctrl.commentsToView, function (comment) { // get only comments with the same tag
            return _.findWhere(comment.tags, {content : tag.content});
        })
        var $target = $('.discussion-header');
        $("body").animate({scrollTop: $target.offset().top}, "slow"); // scroll to discussion top
        $location.search("tag",tag.content);
      };

      ctrl.clearSelectedTag = function(){
        ctrl.tagToFilterBy = null;
        ctrl.commentsToView = angular.copy(ctrl.post.comments); // reset back to original list
        ctrl.commentsToView = $filter('orderBy')(ctrl.commentsToView, ctrl.orderComments);
        $location.search("tag",null);
      };

      ctrl.checkIfTagIsSelected = function(){
        if ($location.search().tag && ctrl.currentProcessStep === "discussion"){
          ctrl.filterCommentsByTag({content : $location.search().tag });
        }
      };

      ctrl.submitTimePledge = function(hours) {
        if (!ctrl.sessionData.currentUser) {
          DialogsService.openDialog('login', {actionIntercepted: true});
          return;
        }
        PostsService.addTimePledge(ctrl.post.id, ctrl.sessionData.currentUser.id, hours).then(function (pledge) {
          pledge.user = ctrl.sessionData.currentUser; // add the user to new created pledge for the vm updates functions.
          ctrl.post.timePledges.push(pledge)
          initProjectProps();
          refreshParticipantsList();
          initStats();
        });

      };

      ctrl.updateUserPledge = function(resource, amount) {
        var isNewPledge;
        if (!ctrl.sessionData.currentUser) {
          DialogsService.openDialog('login', {actionIntercepted: true});
          return;
        }
        if (!resource.userPledge){ // new pledge for the item.
          isNewPledge = true;
          resource.userPledge = {
            quantity: 1,
            userId:  ctrl.sessionData.currentUser.id
          };
        } else { // update existing pledge.
          resource.userPledge.quantity += amount;
        }
        PostsService.addResourcePledge(resource.id, resource.userPledge.userId, resource.userPledge.quantity, resource.userPledge.id)
          .then(function pledgeUpdatedSuccess (pledge) {
            if (isNewPledge) {
              resource.userPledge.id = pledge.id;
              pledge.user = ctrl.sessionData.currentUser; // add the user to new created pledge for the vm updates functions.
              resource.itemPledges.push(pledge)
            } else {
              // refresh pledges list for the changed item.
              var pledgeToUpdate = _.findWhere(resource.itemPledges, {id: pledge.id});
              pledgeToUpdate.quantity = pledge.quantity;
            }
        });

      };

      ctrl.getPledgesSum = function(resource) {
        return _.reduce(resource.itemPledges,function (memo, pledge) {
          return memo + pledge.quantity;
        }, 0)
      };

      _init();

    })
    .filter('annotateHighlight', function ($sce) {
      return function (text, phrase) {
        text = text.replace(new RegExp('@(.*)@', 'gi'),
          '<span class="highlighted">@$1</span>')
        return $sce.trustAsHtml(text)
      }
    })

})();
