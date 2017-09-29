/**
 * Created by yotam on 31/08/2016.
 */
var notificationsTargeter = require("./../../server/services/notifications/notifications-targeter");
var EVENTS = require("./../../server/services/enums").EVENTS;

module.exports = function (Follow) {

  function sendNotifications(){

  }
  Follow.observe('after save', function sendNotifications(ctx, next) {
    console.log("sendNotifications ");
    if (ctx.instance) {
      var followRow = ctx.instance;
      console.log("sendNotifications, followRow: " + JSON.stringify(followRow));
      notificationsTargeter.targetToUsers(EVENTS.USER_FOLLOWED,{
        // event metadata
        follower_data : {
          id : ctx.instance.followerId
        },
        extra_meta : {
        }
      }, {
        targetedUsers : [ctx.instance.followeeId]
      });
    }
    next();
  });

};
