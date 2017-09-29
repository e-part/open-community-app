'use strict';
var status = require('http-status');
var ActionsHelper = require('./../../server/services/actions-helpers');

module.exports = function (Meeting) {
  Meeting.validatesPresenceOf('postId');
  Meeting.validatesPresenceOf('date');

  // verify that session user is admin or current user is owner of the post related to the applied meeting.
  Meeting.observe('before save', function validateUserId(ctx, next) {
    var currentUserId = ActionsHelper.getCurrentUserId(ctx);
    ActionsHelper.isAdmin(Meeting.app, currentUserId).then(function (isAdmin) {
      if (isAdmin) {
        return next();
      }
      ActionsHelper.verifyFieldInModel(ctx, Meeting.app.models.Post, 'postId', 'ownerId', currentUserId, next)

    });

  });
};
