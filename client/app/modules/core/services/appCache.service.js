/**
 * Created by yotam on 02/08/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.core')
    .service('appCache', function () {

      var data = window.localStorage;
      this.get = function(key){
        return data[key];
      };
      this.set = function(key, value) {
        data[key] = value;
      };
      this.remove = function(key) {
        delete data[key];
      };

    });

})();
