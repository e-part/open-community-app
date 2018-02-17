/**
 * Created by yotam on 29/08/2016.
 */
var loopback = require('loopback');
var nodemailer = require('nodemailer');

var EmailService = {
  send: function (mailOptions) {
    return new Promise(function (resolve, reject) {
      // loopback.Email.send(mailOptions, function (err, response) {
      //   if (err ||
      //     (response[0] && response[0].status !== 'sent') ||
      //     (response[0] && response[0].reject_reason)) {
      //     if (!err) {
      //       err = {error: response[0]};
      //     }
      //     console.error(" email couldn't be sent: ", err);
      //     return reject(err);
      //   }
      //   console.log('email sent:' + JSON.stringify(response));
      //   resolve(response);
      // });
      resolve();

    });
  }

};
module.exports = EmailService;
