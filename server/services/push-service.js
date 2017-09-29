/**
 * Created by yotam on 07/11/2016.
 */

var settings = {
  gcm: {
    id: "XXX",
  },
  apn: {
    token: {
      key: './certs/key.pem',
      keyId: 'XXX',
      teamId: 'XXX'
    }
  }
};

var PushNotifications = new require('node-pushnotifications');
var pushClient = new PushNotifications(settings);

var PushService = {
  send : function(registrationIds, title, body){
    var data = {
      title : title,
      body : body,
      icon : 'notification_icon',
      color : '#006DBD',
      sound : 'default',
    };
    console.log("sending push [ " + title + " :: " + body + " ] to ids " + registrationIds);
    return pushClient.send(registrationIds, data)
      .then(function(results) {
        console.log("push notifications sending status: [ " + JSON.stringify(results));
      })
      .catch(function(err){
        console.error("push sending failed: " + JSON.stringify(err));
      });
  }
};
module.exports = PushService;

