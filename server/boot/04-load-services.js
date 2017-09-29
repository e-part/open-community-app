/**
 * Created by yotam on 29/08/2016.
 */
var NotificationsTargeter = require("./../services/notifications/notifications-targeter");
/**
 * Init app services.
 * @param app
 */
module.exports = function (app) {
  NotificationsTargeter.init(app);

};
