/**
 * Created by yotam on 16/11/2016.
 */
var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'XXX',
  api_key: 'XXX',
  api_secret: 'XXX'
});

var CloudinaryService = {
  uploadByUrl : function(url){
    return new Promise(function(resolve, reject){
      cloudinary.uploader.upload(url, function(result) {
        console.log("image uploaded to Cloudinary: " + JSON.stringify(result));
        if (result && result.secure_url){
          resolve(result);
        } else {
          reject(result);
        }
      });
    });

  }
};

module.exports = CloudinaryService;
