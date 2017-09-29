/**
 * Created by yotam on 27/11/2016.
 */
var ActionsHelper = require('./../../server/services/actions-helpers');

module.exports = function (Message) {
  function verifyCreator(ctx, modelInstance, next){
    var idToVerify;
    if (ctx.req.body){
      idToVerify = ctx.req.body.creatorId;
      ActionsHelper.verifyOwner(idToVerify, next)
    } else {
      next();
    }
  }
  // verify that session user is admin or creatorId is same as current user.
  Message.beforeRemote('create',verifyCreator);
  
  /**
   * Add the creator user object for new created comments
   */
  Message.afterRemote('create', function (ctx, modelInstance, next) {
    if (ctx.result) {
      var User = Message.app.models.user;
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
}

