/**
 * Created by yotam on 20/09/2016.
 */
var EVENTS = require('./enums').EVENTS;

var appConfigs = {
  MAX_RESULTS_ALLOWED_TO_USER : 100,
  defaultImageUrl : 'https://res.cloudinary.com/epart/image/upload/v1479118016/default-user-avatar-gray-back-medium_gwcr2r.png',
  defaultSubscriptions: {
    EMAIL: [
      EVENTS.POST_COMMENT_REPLY,
      EVENTS.USER_FOLLOWED,
      EVENTS.POST_PUBLISHED
    ],
    PUSH: [
      EVENTS.POST_COMMENT_REPLY,
      EVENTS.USER_FOLLOWED,
      EVENTS.POST_PUBLISHED
    ]
  }

};

module.exports = appConfigs;
