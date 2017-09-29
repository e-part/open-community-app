/**
 * Created by yotam on 25/07/2016.
 */
var enums = {
  OS_TYPES : {
    IOS : 0,
    ANDROID : 1
  },
  POST_STATUSES : {
    DRAFT: "DRAFT",
    PUBLISHED: "PUBLISHED",
  },
  POST_REVIEW_STATUSES: {
    APPROVED: "APPROVED",
    DENIED: "DENIED"
  },
  "POST_TYPES" : {
    DISCUSSION: "DISCUSSION",
    PROJECT: "PROJECT"
  },
  USER_ROLES : {
    ADMIN : {
      id : 1,
      value : "admin"
    },
    USER : {
      id : 2,
      value : "user"
    },
    MK : {
      id : 3,
      value : "mk"
    },
  },
  ERROR_CODES : {
    "BAD_INPUT" : "BAD_INPUT",
    "BAD_INPUT_EMAIL" : "BAD_INPUT_EMAIL",
    "INTERNAL_ERROR" : "INTERNAL_ERROR"
  },
  EVENTS : {
    "POST_COMMENT_REPLY" : "POST_COMMENT_REPLY",
    "POST_PUBLISHED" : "POST_PUBLISHED",
    "USER_FOLLOWED" : "USER_FOLLOWED",
    "INTERNAL_POST_MESSAGE" : "INTERNAL_POST_MESSAGE"
  },
  NOTIFICATION_METHODS : {
    WEB : "WEB",
    DESKTOP : "DESKTOP",
    PUSH : "PUSH",
    EMAIL : "EMAIL"
  }
};

module.exports = enums;
