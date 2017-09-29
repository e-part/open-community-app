/**
 * Created by yotam on 14/08/2016.
 */
function getNewsletterService(app) {
  return app.MailChimp;
}
var NewsletterService = {
  subscribe: function(app, email, firstName, lastName, successcb, errorcb){
    var serviceProvider = getNewsletterService(app);
    serviceProvider.subscribe({
      email :email,
      firstName : firstName,
      lastName : lastName
    })
      .then(function (res) {
        console.log('Newsletter subscription completed successfully: ',res);
        if (successcb){
          successcb();
        }
      })
      .catch(function (err) {
        console.error('Newsletter subscription failed: ',err);
        if (errorcb){
          errorcb();
        }
      });
  }
};

module.exports = NewsletterService;
