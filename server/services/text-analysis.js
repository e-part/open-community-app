/**
 * Created by yotam on 29/12/2016.
 */
var request = require('request');
var API_KEY = 'XXX';
var TextAnalysisService = {
  analyze: function (text) {
    var req_data = {
      url: 'https://api.repustate.com/v3/' + API_KEY + '/score.json',
      method: 'POST',
      qs : {lang : 'he', text : text}
    };
    return new Promise(function (resolve, reject) {
      request(req_data, function (err, httpResponse, body) {
        if (!err && httpResponse.statusCode === 200) {
          try {
            var responseBody = JSON.parse(body);
            if (responseBody.status === "OK" && responseBody.score){
              console.log('Text analysis result: ' + JSON.stringify(body));
              resolve(responseBody.score);
            } else {
              reject(body);
            }
          } catch (e){
            reject(e);
          }
        }
      })
    });


  }
};
module.exports = TextAnalysisService;
