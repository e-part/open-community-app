/**
 * Created by yotam on 06/06/2017.
 */
(function () {
  'use strict';
  angular
    .module('com.module.core')
    .service('UtilsService', function ($injector, CoreService, Meta, gettextCatalog) {

       this.addMonths = function(date, count) {
        if (date && count) {
          var m, d = (date = new Date(+date)).getDate()

          date.setMonth(date.getMonth() + count, 1)
          m = date.getMonth()
          date.setDate(d)
          if (date.getMonth() !== m) date.setDate(0)
        }
        return date
      }
      /**
       * Covert date to / from server to client. Take the timezone of the client into account.
       * @param date
       * @param isUTC true if the date is currently in UTC, will then convert to local.
       * @returns {*}
         */
      this.convertUTC = function(date, isUTC){
        if (!date){
          return null;
        }
        date = new Date(date); // in case the date is in string format.
        var localTime;
        var systemOffset = CoreService.config.TIMEZONE_OFFSET*60*60000;//maybe 3 [h*60*60000 = ms]
        var _userOffset = date.getTimezoneOffset()*60000; // [min*60000 = ms]
        if (isUTC){
          localTime =  new Date(date.getTime()+systemOffset+_userOffset);
        } else {
          localTime =  new Date(date.getTime()-systemOffset-_userOffset);
        }
        return localTime;
      };

      this.getValueFromMap = function(list, key,fromProperty, toProperty) {
        var mapObj = {};
        mapObj[fromProperty] = key;
        var item =  _.findWhere(list, mapObj)
        return item[toProperty]
      };

      /**
       * Check if some parent of the element has a class.
       * @param element
       * @param classname
       * @returns {*}
         */
      this.hasSomeParentTheClass = function(element, classname) {
        if (element.className && element.className.split(' ').indexOf(classname)>=0) {
          return true;
        }
        return element.parentNode && this.hasSomeParentTheClass(element.parentNode, classname);
      };
      
      this.extractYoutubeVideoId = function(url){
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = url.match(regExp);
        return (match&&match[7].length==11)? match[7] : false;
      };


    });

})();


