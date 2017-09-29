/**
 * Created by yotam on 25/09/2016.
 */
'use strict';

var ActionsHelper = require('./../../server/services/actions-helpers');

module.exports = function (Poll) {
  function _removeArchivedFromResults(ctx, next) {
    if (!ctx.query) {
      ctx.query = {};
    }
    if (!ctx.query.where) {
      ctx.query.where = {};
    }
    ctx.query.where.archived = false;
    return next();

  }

  Poll.observe('before save', function (ctx, next) {
    // Make sure that a user can only update a poll that he is the owner of it's related post.

    var currentUserId = ActionsHelper.getCurrentUserId(ctx);
    ActionsHelper.isAdmin(Poll.app, currentUserId).then(function (isAdmin) {
      if (isAdmin) {
        return next();
      }
      ActionsHelper.verifyFieldInModel(ctx, Poll.app.models.Post, 'postId', 'ownerId', currentUserId, next)

    });
    // if create - make sure the postId field is of a post belong to the user
  });

  Poll.observe('access', _removeArchivedFromResults);


};
