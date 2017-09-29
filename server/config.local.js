/**
 * Created by yotam on 07/08/2016.
 */
module.exports = {
  remoting: {
    errorHandler: {
      handler: function (err, req, res, next) {
        // custom error handling logic
        res.on('finish', function () {
          // do stuff here
          if (res.statusCode !== 200) {
            console.error(req.reqId + " * RES status: " + res.statusCode);
            console.error("Error: " + JSON.stringify(err));
          }
        });
        next(); // let the default error handler (RestAdapter.errorHandler) run next
      }
    }
  }
};
