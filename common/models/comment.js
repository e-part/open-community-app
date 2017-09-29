'use strict';

var USER_ROLES = require("./../../server/services/enums").USER_ROLES;
var EVENTS = require("./../../server/services/enums").EVENTS;
var loopback = require('loopback');
var _ = require("lodash");
var status = require('http-status');
var notificationsTargeter = require("./../../server/services/notifications/notifications-targeter");
var errorsProvider = require('./../../server/services/errors-provider');
var rawQueries = require('./../../server/services/mysql-queries-provider');
var ActionsHelper = require('./../../server/services/actions-helpers');
var TextAnalysisService = require('./../../server/services/text-analysis');

module.exports = function (Comment) {

  function _removeDeletedFromResults(ctx, next) {
    if (!ctx.query) {
      ctx.query = {};
    }
    if (!ctx.query.where) {
      ctx.query.where = {};
    }
    ctx.query.where.deleted = false;
    return next();

  }

  /**
   * Send notification about the new comment
   * @param CommentModel - Comment DB model
   * @param comment - the new comment.
   * @param repliedCommentId - the comment that was replied.
   * @param currentUser
     * @private
     */
  function _sendNotificationByComment(CommentModel, comment, repliedCommentId, currentUser){
    // get the id of the parent comment's creator:
    CommentModel.findById(repliedCommentId, function (err, repliedComment) {
      if (!err && repliedComment) {
        if (currentUser.id !== repliedComment.creatorId) {  // if comment is a reply of the current user - do not send notification.
          // TODO init should happen only once during boot.
          // Send notifications to the subscribed users. (in the future, this can write to an eventsQueue which be later on be consumed
          // by another process which targets notifications)
          notificationsTargeter.targetToUsers(EVENTS.POST_COMMENT_REPLY, {
            // event metadata
            comment: {
              id: comment.id,
              parentCommentId: comment.parentCommentId,
              creatorId: comment.creatorId,
              postId: comment.postId,
              createdAt: comment.createdAt
            },
            extra_meta: {
              content: comment.content,
              creatorId: comment.creatorId
            }
          }, {
            targetedUsers: [repliedComment.creatorId]
          });
        }

      }

    });
  }
  // verify that session user is admin or creatorId is same as current user.
  Comment.observe('before save', function (ctx, next) {
    if (ctx.data && ctx.data.creatorId){
      ActionsHelper.verifyOwner(ctx.data.creatorId, next)
    } else {
      next();
    }
  });
  /**
   * Create operation must verify that user is allowed has rights to perform it.
   */

  Comment.beforeRemote('create',function(ctx, modelInstance, next){
    var idToVerify;
    if (ctx.req.body){
      idToVerify = ctx.req.body.creatorId;
      ActionsHelper.verifyOwner(idToVerify, next)
    } else {
      next();
    }
  });
  // TODO this can be a general function that is added to the model as a mixin.
  Comment.afterRemote('create', function sendNotifications(ctx, modelInstance, next) {
    var dbModels = Comment.app.models;
    if (ctx.result) {
      // add subscriptions if needed (for example, we can decide that the user who commented should be notified on the post's comments thread)
      var comment = ctx.result;
      var lbCtx = require('loopback-context').getCurrentContext();
      var currentUser = lbCtx && lbCtx.get('currentUser');
      if (comment.parentCommentId) {
        _sendNotificationByComment(dbModels.Comment,comment, comment.parentCommentId, currentUser);
      }
      if (comment.repliedToCommentId && comment.parentCommentId !== comment.repliedToCommentId) { // make sure that notifications are not sent twice to the same user
        _sendNotificationByComment(dbModels.Comment,comment, comment.repliedToCommentId, currentUser);
      }
    }
    next();
  });

  /**
   * Add the creator user object for new created comments
   */
  Comment.afterRemote('create', function (ctx, modelInstance, next) {
    if (ctx.result) {
      var User = Comment.app.models.user;
      User.findById(ctx.result.creatorId, function (err, user) {
        if (user) { // add the user to the response.
          ctx.result.__data.creator = user;
          return next();

        } else {
          return next(err);
        }
      });
    } else {
      next();
    }
  });

  Comment.afterRemote('create', function saveTextAnalysisForComment(ctx, modelInstance, next) {
    if (ctx.result) {
      TextAnalysisService.analyze(ctx.result.content).then(function(score){
        Comment.update({id: ctx.result.id}, {sentimentScore: score}, function (err, result) {
          if (err) {
            console.log("Error: Could not save sentiment score: " + JSON.stringify(err));
          } else {
            console.log("Sentiment score saved for comment.");
          }
        });
      });
    }
    next();
  });
  /**
   * Filter out deleted comments
   */
  Comment.observe('access', _removeDeletedFromResults);

/*  Comment.observe('loaded', function(ctx, next){
    if (ctx && ctx.instance){
      ActionsHelper.addCount(ctx.instance, 'upvotes').then(function(){
        next();
      });
    } else {
      next();
    }
  });*/

  /**
   * If there is a user session, add a flag to each comment to indicate whether it was voted by the user or not.
   */
  Comment.afterRemote('find', function (ctx, modelInstance, next) {
    function getUserUpvotes(userId, cb) {
      var Upvote = Comment.app.models.Upvote;
      Upvote.find({where: {userId: userId}}, function (err, upvotes) {
        if (err) {
          return cb(err, null);
        } else {
          return cb(null, upvotes);
        }
      });
    }

    var lbCtx = require('loopback-context').getCurrentContext();
    var currentUser = lbCtx && lbCtx.get('currentUser');
    if (currentUser) {
      if (ctx.result) {
        getUserUpvotes(currentUser.id, function (err, userVotes) {
          if (err) {
            return next(err);
          }
          if (!userVotes) {
            return next();
          }
          for (var i = 0; i < ctx.result.length; i++) {
            var comment = ctx.result[i];
            // check if user voted on the comment
            if (_.find(userVotes, {commentId: comment.id})) {
              comment.voted = true;
            } else {
              comment.voted = false;
            }
          }
          return next();

        });

      } else { // no results to test
        return next();
      }
    } else { // no user session.
      return next();
    }

  });

/*
  Comment.afterRemote('find', function (ctx, modelInstance, next) {
    function getUpvotes(commentsIds, cb) {
      var Upvote = Comment.app.models.Upvote;
      Upvote.find({where: {commentId: {inq : commentsIds}}}, function (err, upvotes) {
        if (err) {
          return cb(err, null);
        } else {
          return cb(null, upvotes);
        }
      });
    }
    if (ctx.result) {
      getUpvotes(_.map(ctx.result, 'id'), function (err, votes) {
        if (err) {
          return next(err);
        }
        if (!votes || !votes.length) {
          return next();
        }
        for (var i = 0; i < ctx.result.length; i++) {
          var comment = ctx.result[i];
          var count = _.find(votes, {commentId: comment.id}).length || 0;
          comment.upvotesCount = count;
        }
        return next();

      });

    } else { // no results to test
      return next();
    }

  });
*/

  Comment.remoteMethod('deleteCurrentUserUpvote', {
    accepts: [
      {arg: 'id', type: 'string', required: true}
    ],
    returns: {root: true, type: 'string'},
    http: {
      verb: 'post',
      path: '/:id/deleteCurrentUserUpvote'
    }
  });

  Comment.remoteMethod('getLatest', {
    accepts: [
      {arg: "options", type: "object", http: "optionsFromRequest"},

    ],
    returns: {root: true, type: 'array'},
    http: {
      verb: 'get',
      path: '/latest'
    }
  });

  Comment.deleteCurrentUserUpvote = function (id, cb) {
    var lbCtx = require('loopback-context').getCurrentContext();
    var Upvote = loopback.getModel('Upvote');

    var currentUser = lbCtx && lbCtx.get('currentUser');
    if (!currentUser) {
      return cb(errorsProvider.generateError(errorsProvider.errorsMap.BAD_INPUT));
    }
    Upvote.findOne({where: {commentId: id, userId: currentUser.id}}, function (err, upvote) {
      if (err) {
        return cb(errorsProvider.generateError(errorsProvider.errorsMap.INTERNAL_ERROR), false);
      }
      if (!upvote) {
        return cb(errorsProvider.generateError(errorsProvider.errorsMap.BAD_INPUT_ITEM_NOT_FOUND_NO_UPVOTE_FOR_COMMENT), false);
      }
      upvote.destroy(function (err, result) {
        if (err) {
          return cb(errorsProvider.generateError(errorsProvider.errorsMap.INTERNAL_ERROR), false);
        } else {
          cb(null, result);
        }
      });
    });
  };

  Comment.getLatest = function (options, cb) {
    var ds = Comment.app.dataSources.db;
    var RESULTS_LIMIT = 4;
    ds.connector.execute(rawQueries.getLatestCommentsByUniqueUsers, [options.customerId, RESULTS_LIMIT], function (err, data) {
      if (err) {
        return cb(err, null);
      }
      var includeSection = [
        {relation: 'creator', scope: {include: ['roles']}},
        {relation: 'post'}

      ];

      function _dataRetrieved(Model, data, cb, includeSection) {
        var ids = _.map(data, function (item) {
          return item.id;
        });
        Model.find({
          where: {id: {inq: ids}},
          include: includeSection
        }, function (err, posts) {
          var orderedItems = [];
          for (var i = 0; i < ids.length; i++) {
            var post = _.find(posts, {id: ids[i]});
            orderedItems.push(post);
          }
          cb(null, orderedItems);

        });
      }

      _dataRetrieved(Comment, data, cb, includeSection); // get the additional data for each id that was retrieved..
    });
  };

};
