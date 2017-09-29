/**
 * Created by yotam on 23/08/2016.
 */
var bcrypt = require('bcryptjs');
var _ = require('lodash');
var EmailService = require('./../email-service');
var PushService = require('./../push-service');
var config = require('./../../config.json');
var EVENTS = require('./../enums').EVENTS;

/**
 * This service is consuming data from the notifications queue and fires it to the users.
 */

function _buildNotificationVars(app, notification){
  var notificationsDataFetchers = {
    POST_COMMENT_REPLY: function (notification) {
      return new Promise(function (resolve, reject) {
        var requests = [
          app.models.Post.findById(notification.meta.comment.postId),
          app.models.user.findById(notification.meta.comment.creatorId)
        ];
        Promise.all(requests).then(function (results) {
          resolve([
            {
              "name": "settings_url",
              "content": config.clientUrl + 'settings'
            },
            {
              "name": "comment_url",
              "content": config.clientUrl + 'post/' + results[0].permaLink
            },
            {
              "name": "content",
              "content": notification.meta.extra_meta.content
            },
            {
              "name": "commenter",
              "content": results[1].firstName + " " + results[1].lastName
            }
          ]);
        }, function (err) {
          reject(err)
        });


      });
    },
    POST_PUBLISHED: function (notification) {
      return new Promise(function (resolve, reject) {
        var requests = [
          app.models.Post.findById(notification.meta.post_data.id)
        ];
        Promise.all(requests).then(function (results) {
          resolve([
            {
              "name": "settings_url",
              "content": config.clientUrl + 'settings'
            },
            {
              "name": "post_url",
              "content": config.clientUrl + 'post/' + results[0].permaLink
            },
            {
              "name": "post_title",
              "content": notification.meta.extra_meta.title
            },
            {
              "name": "post_subtitle",
              "content": notification.meta.extra_meta.subtitle
            }
          ]);
        }, function (err) {
          reject(err)
        });


      });
    },
    USER_FOLLOWED: function (notification) {
      return new Promise(function (resolve, reject) {
        var requests = [
          app.models.user.findById(notification.meta.follower_data.id)
        ];
        Promise.all(requests).then(function (results) {
          resolve([
            {
              "name": "settings_url",
              "content": config.clientUrl + 'settings'
            },
            {
              "name": "follower_url",
              "content": config.clientUrl + 'profile/' + results[0].id
            },
            {
              "name": "follower_name",
              "content": results[0].firstName + " " + results[0].lastName
            }
          ]);
        }, function (err) {
          reject(err)
        });


      });
    }
  };
  switch (notification.name) {
    case EVENTS.POST_COMMENT_REPLY :
      return notificationsDataFetchers.POST_COMMENT_REPLY(notification);
    case EVENTS.POST_PUBLISHED :
      return notificationsDataFetchers.POST_PUBLISHED(notification);
    case EVENTS.USER_FOLLOWED :
      return notificationsDataFetchers.USER_FOLLOWED(notification);
  }
  return null;
}

function _replaceParameters(message, params) {
  // iterate over the parameters and replace the matching {parameter} in the query string
  for (var key in params) {
    // replace the parameter in the query
    var find = "{{" + key + "}}";
    var re = new RegExp(find, 'g');
    message = message.replace(re, params[key]);
  }
  return message;
}

function _convertParamsFormat(emailFormatArr){
  var obj = {};
  for (var i = 0; i < emailFormatArr.length; i++){
    obj[emailFormatArr[i].name] = emailFormatArr[i].content;
  }
  return obj;
}

var WebNotificationAdapter = {
  dispatch: function (notification, options) {
    // create DB record.
    return options.dbAccessor.Notification.create(notification);
  }
};

var EmailNotificationAdapter = {

  buildNotificationVars: _buildNotificationVars,

  dispatch: function (notification, options, app) {
    var self = this;
    var requests = [options.dbAccessor.user.findById(notification.receiverId), self.buildNotificationVars(app, notification)]
    return Promise.all(requests).then(function (results) {
      var receiver = results[0];
      var emailVars = results[1];
      var salt = bcrypt.genSaltSync(10);
      var hashedId = bcrypt.hashSync("" + notification.receiverId, salt);
      emailVars.push({
        "name": "unsubscribe_url",
        "content": config.url + config.restApiRoot + "/users/unsubscribe?id=" + notification.receiverId + "&hashedId=" + hashedId + "&subscriptionId=" + notification.subscriptionId
      });

      var mailOptions = {
        to: receiver.email,
        from: 'hello@epart.co.il',
        merge: true,
        merge_language: "handlebars",
        global_merge_vars: emailVars,
        template: {
          name: app.get('language') + "_EVENT_" + notification.name
        }
      };
      // create DB record.
      return EmailService.send(mailOptions);
    });

  }
};

var PushNotificationAdapter = {
  buildNotificationVars: _buildNotificationVars,

  buildPushContent : function(notification,params){
    var push_configs = {
      POST_COMMENT_REPLY : {
        title : "תגובה חדשה מ-ePart",
        body : "{{commenter}} כתב: \n {{content}}",
      },
      POST_PUBLISHED : {
        title : "דיון חדש ב-ePart",
        body : "{{post_title}}",
      },
      USER_FOLLOWED : {
        title : "עדכון מ-ePart",
        body : "{{follower_name}} החל/ה לעקוב אחריך",
      },
    };
    var result = _.clone(push_configs[notification.name]);
    var paramsObj = _convertParamsFormat(params);
    result.body = _replaceParameters(result.body, paramsObj);
    return result;
  },
  dispatch: function (notification, options, app) {
    var self = this;
    var requests = [
      options.dbAccessor.user.findById(notification.receiverId, {include : "devices"}),     // get all devices for the user.
      self.buildNotificationVars(app, notification)]; // get additional message data
    return Promise.all(requests).then(function (results) {
      var receiver = results[0];
      if (receiver && receiver.__data.devices && receiver.__data.devices.length){
        var deviceTokens = _.map(receiver.__data.devices, 'registrationId');
        var msg = self.buildPushContent(notification, results[1]);
        return PushService.send(deviceTokens, msg.title, msg.body);
      } else {
        console.log("No devices to push for user id " + notification.receiverId);
        return true;
      }

    });

  }
};

var adaptersMap = {
  WEB: WebNotificationAdapter,
  EMAIL: EmailNotificationAdapter,
  PUSH: PushNotificationAdapter
};

var NotificationsDispatcher = function (app) {
  this.app = app;
  this.dbAccessor = app.models;
  // Website, Desktop, Email, Push Connectors should be configured here.
  this.generateNotification = function (notification) {
    console.log("Dispatching: " + JSON.stringify(notification));
    var self = this;
    // map the method to the notification service adapter.
    var dispatcher = adaptersMap[notification.method];
    if (dispatcher) {
      return dispatcher.dispatch(notification, {dbAccessor: self.dbAccessor}, self.app);
    } else {
      console.error("Dispatcher does not exist for method: " + notification.method);
    }
  };

  this.dispatchAll = function (eventName, eventMeta, subscriptions) {
    var self = this;
    console.log("dispatchAll, subscriptions: ", JSON.stringify(subscriptions));
    console.log("dispatchAll, eventMeta: ", JSON.stringify(eventMeta));
    var requests = [];

    // For each user subscription, dispatch a notification.
    for (var i = 0; i < subscriptions.length; i++) {
      var notification = {
        name: eventName,
        subscriptionId: subscriptions[i].id,
        receiverId: subscriptions[i].userId,
        method: subscriptions[i].method,
        meta: eventMeta
      };
      requests.push(self.generateNotification(notification));
    }
    return Promise.all(requests);
  };

};

module.exports = NotificationsDispatcher;
