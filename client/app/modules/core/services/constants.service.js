/**
 * Created by yotam on 02/08/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.core')
    .service('Constants', function (gettextCatalog, CoreService) {

      this.MASTER_CLIENT_TYPES = {
        EPART: "EPART",
        DT: "DT",
      };
      
      this.POST_STATUSES = {
        DRAFT: "DRAFT",
        PUBLISHED: "PUBLISHED"
      };

      this.POST_REVIEW_STATUSES = {
        APPROVED: "APPROVED",
        DENIED: "DENIED"
      };

      this.POST_TYPES = {
        DISCUSSION: "DISCUSSION",
        PROJECT: "PROJECT"
      };


      this.POST_MIGRATION_STATUS = {
        NORMAL: "NORMAL",
        KNESSET_MIGRATED: "KNESSET_MIGRATED"
      };

      this.DEFAULT_DISCUSSION_PERIOD_IN_MONTHS = 1;
      this.MAX_CHARS_IN_SLUG = 40;

      this.TAG_TYPES = {
        CATEGORY: "CATEGORY",
      };

      this.USER_ROLES = {
        ADMIN: "admin",
        USER: "user",
        MK: "mk"
      };

      this.DEFAULT_AVATAR = '/images/user-logo.jpg';
      this.DEFAULT_POST_IMG = CoreService.config.DEFAULT_POST_IMG;
      this.DEFAULT_DISCUSSION_IMG = CoreService.config.DEFAULT_DISCUSSION_IMG;
      this.DEFAULT_PROJECT_IMG = CoreService.config.DEFAULT_PROJECT_IMG;

      this.NOTIFICATION_STATUS = {
        READ: "READ",
        UNREAD: "UNREAD"
      };

      this.NOTIFICATION_METHODS = {
        EMAIL: "EMAIL"
      };

      this.EVENTS = {
        "POST_COMMENT_REPLY" : "POST_COMMENT_REPLY",
        "POST_PUBLISHED" : "POST_PUBLISHED",
        "USER_FOLLOWED" : "USER_FOLLOWED"
      };

      this.CONFIG = {
        HOME_FEED_ACTIVE_POSTS_LIMIT : 30,
        HOME_FEED_ARCHIVE_POSTS_LIMIT : 30,
        HOME_LATEST_COMMENTS_LIMIT : 4,
        USER_PROFILE_POSTS_LIMIT : 100,
        CATEGORY_FEED_POSTS_LIMIT : 20,
        SHOW_ARCHIVE_POSTS_FROM_DATE : new Date(2016, 10, 27), // Start showing posts from 2016-27-11
        MAX_POLL_ANSWERS : 10
      };
    });

})();
