'use strict';
var status = require('http-status');
var ActionsHelper = require('./../../server/services/actions-helpers');

module.exports = function (ItemRequest) {
  ItemRequest.validatesPresenceOf('postId');
  ItemRequest.validatesPresenceOf('quantity');
  ItemRequest.validatesPresenceOf('description');

  // verify that session user is admin or current user is owner of the post related to the applied itemRequest.
  ItemRequest.observe('before save', function validateUserId(ctx, next) {
    var currentUserId = ActionsHelper.getCurrentUserId(ctx);
    ActionsHelper.isAdmin(ItemRequest.app, currentUserId).then(function (isAdmin) {
      if (isAdmin) {
        return next();
      }
      ActionsHelper.verifyFieldInModel(ctx, ItemRequest.app.models.Post, 'postId', 'ownerId', currentUserId, next)

    });

  });
};
