/**
 * Created by yotam on 28/06/2016.
 */
var config = {
  baseUrl: 'http://localhost',
  port: 3000,
  apiPrefix: '/api',
  ADMIN_ID:1,
  USER_ID: 2,
  ADMIN_TOKEN: 1,
  USER_TOKEN: 2,
  CUSTOMER_ID: 1,
  PUBLISHED_POST_ID: 2,
  POST_WITH_A_DIFFERENT_CUSTOMER_ID:4,
  DENIED_POST_ID: 5,
  POST_WITHOUT_OWNER:1,
  ADMIN_TIME_PLEDGE_ID: 1,
  USER_TIME_PLEDGE_ID: 2,
  ADMIN_ITEM_PLEDGE_ID: 1,
  USER_ITEM_PLEDGE_ID: 2,
  ITEM_PLEDGE_ID: 1,
  ITEM_REQUEST_ID: 1,
  DIFFERENT_CUSTOMER_PLEDGE_ID: 3,
  DIFFERENT_CUSTOMER_MEETING_ID: 3,
  DIFFERENT_CUSTOMER_ITEM_REQUEST_ID: 3,

  userCredentials: {
    email: "user@user.com",
    password: "user"
  },
  adminCredentials : {
    email: "admin@admin.com",
    password: "admin"
  },

};
module.exports = config;

