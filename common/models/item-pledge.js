'use strict';
var status = require('http-status');
var ActionsHelper = require('./../../server/services/actions-helpers');

module.exports = function (ItemPledge) {
  ItemPledge.validatesPresenceOf('userId');
  ItemPledge.validatesPresenceOf('itemRequestId');

  // verify that session user is admin or userId is same as current user
  ItemPledge.observe('before save', function validateUserId(ctx, next) {
    var currentUserId = ActionsHelper.getCurrentUserId(ctx);
    ActionsHelper.isAdmin(ItemPledge.app, currentUserId).then(function (isAdmin) {
      if (isAdmin) {
        return next();
      }
      ActionsHelper.verifyDataValue(ctx, 'userId', currentUserId, next, true);

    });

  });
};
