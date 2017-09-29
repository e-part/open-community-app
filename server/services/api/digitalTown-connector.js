/**
 * Created by yotam on 29/08/2016.
 */
var app = require('../../server');

var request = require('request');
var API_URL = app.get('digitalTownApi');
var DOMAIN = app.get('digitalTownDomain');

var DigitalTownConnector = {
  searchSite: function (text) {
    return new Promise(function (resolve, reject) {
      var url = DOMAIN + 'ajax/search?q=' + text;
      request({
        method: 'GET',
        uri: url,

      }, function (error, response, body) {
        if (error || response.statusCode !== 200) {
          console.error("Error:" + JSON.stringify(error));
          reject(error);
        } else {
          resolve(body);
        }
      });
    });
  },

  getUserbyAccessToken: function (token) {
    return new Promise(function (resolve, reject) {
      request({
        method: 'GET',
        uri: API_URL + 'users',
        headers: {
          Authorization: 'Bearer ' + token
        }

      }, function (error, response, body) {
        if (error || response.statusCode !== 200) {
          if (error){
            console.error("Error:  " + JSON.stringify(error));
          } else {
            console.error("Error:  " + body);
          }
          reject(error);
        } else {
          try {
            var user = JSON.parse(body);
            resolve(user);
          } catch (e){
            resolve(null)
          }
        }
      });
    });
  },


};
module.exports = DigitalTownConnector;
