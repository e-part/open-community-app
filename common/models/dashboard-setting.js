/**
 * Created by yotam on 07/11/2016.
 */

var USER_ROLES = require("./../../server/services/enums").USER_ROLES;
var _ = require("lodash");
var loopback = require('loopback');
var errorsProvider = require('./../../server/services/errors-provider');

module.exports = function (DashboardSetting) {

  function verifyOwnerId(objToSave, currentUser) {
    if (!objToSave.ownerId || currentUser.id === objToSave.ownerId) {
      return true;
    }
    return false;
  }

  DashboardSetting.observe('before save', function verifyCreator(ctx, next) {

    var lbCtx = require('loopback-context').getCurrentContext();
    var currentUser = lbCtx && lbCtx.get('currentUser');

    if (currentUser) {
      if (_.find(currentUser.__data.roles, {name: USER_ROLES.ADMIN.value})) { // user is admin - allow access
        return next();
      }
      // verify that creatorId is same as current user.
      if (ctx.instance) {
        if (verifyOwnerId(ctx.instance, currentUser)) {
          return next();
        }
      } else {
        if (verifyOwnerId(ctx.data, currentUser)) {
          return next();
        }
      }
      next(errorsProvider.generateError(errorsProvider.errorsMap.AUTHORIZATION_REQUIRED));

    } else {
      next(errorsProvider.generateError(errorsProvider.errorsMap.AUTHORIZATION_REQUIRED));
    }
  });
};

