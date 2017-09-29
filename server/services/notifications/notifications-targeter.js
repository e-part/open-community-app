/**
 * Created by yotam on 23/08/2016.
 */

/**
 * This service consumes the new events and converts them to notifications for users according to the user's
 * subscriptions.
 */
var NotificationsDispatcher = require("./notifications-dispatcher");
var NOTIFICATION_METHODS = require("./../enums").NOTIFICATION_METHODS;

/**
 * Creates a web notification subscription for all the targetedUsers with the given event.
 * @param targetedUsers
 * @param eventName
 * @returns {Array}
 * @private
 */
function _addWebSubscriptions(targetedUsers, eventName){
  var webSubscriptions = [];
  if (targetedUsers){
    for (var i = 0; i < targetedUsers.length; i++){
      webSubscriptions.push({
        eventType : eventName,
        method : NOTIFICATION_METHODS.WEB,
        userId : targetedUsers[i]
      });
    }
  }
  return webSubscriptions;
}

var NotificationsTargeter = {

  init : function(app){
    var self = this;
    self.dbAccessor = app.models;
    self.dispatcher = new NotificationsDispatcher(app);
  },

  getSubscriptions : function (eventName, eventMeta, options) {
    var self = this;
    options = options || {};
    return new Promise(function (resolve, reject) {
      var whereSection = {
        eventType: eventName
      };
      if (options.targetedUsers && options.targetedUsers.length){
        whereSection.userId = {inq: options.targetedUsers}; // target only requested users.
      }
      self.dbAccessor.Subscription.find(
        {
          where: whereSection
        }
        , function (err, subscriptions) {
          if (err) {
            return reject(err);
          }
          // add web notifications automatically to all targeted users.
          var webSubscriptions = _addWebSubscriptions(options.targetedUsers, eventName);
          subscriptions = subscriptions.concat(webSubscriptions);
          return resolve(subscriptions);
        });
    });

  },

  targetToUsers : function(eventName, eventMeta, options) {
    var self = this;

    function _notificationsDispatchSuccess() {
      console.log("All notifications were dispatched.");
    }

    function _notificationsDispatchFailure(err) {
      // TODO there should be some recovery mechanism here.
      console.error("Could not dispatch all notifications: " + JSON.stringify(err));
    }

    // get users subscribed for the given event.
    self.getSubscriptions(eventName, eventMeta, options).then(function (subscriptions) {
      self.dispatcher.dispatchAll(eventName, eventMeta, subscriptions).then(_notificationsDispatchSuccess, _notificationsDispatchFailure)
    }, function (err) {
      // error getting users subscriptions
      console.error(JSON.stringify(err));
    });

  }
};

module.exports = NotificationsTargeter;
