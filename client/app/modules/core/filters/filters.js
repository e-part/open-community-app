(function () {
  'use strict';

  angular
    .module('com.module.core')
    .filter('formatLocaleDate', function($rootScope, $filter) {
      // gets a datetime object and returns an hebrew readable date:
      // ex:
      // input - "Wed Jun 29 2016 00:00:00 GMT+0300 (IDT)"
      // output - ״ינויב 05״
      var formatters = {
        he_IL : function(date,showHour,showDay){
          var M       = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'],
            days    = ['א','ב','ג','ד','ה','ו','ש'],
            D       = new Date(date),
            d       = D.getDate(), // get the day (1-31)
            m       = D.getMonth(), // get the month (0-11)
            hour    = D.getHours(),
            minutes = D.getMinutes();


          var hebrew_month = M[m];

          var day = '';
          if (showDay) {
            day = D.getDay();
            day = days[day];
            day = 'יום ' + day + '\', ';
          }
          if (showHour) {
            if (minutes < 10) {
              minutes = '0' + minutes;
            }
            return day + d + ' ב' + hebrew_month + ' ' + hour + ':' + minutes;
          } else {
            return day + d + ' ב' + hebrew_month;
          }
        },
        en_US : function(date,showHour,showDay){
          if (showHour){
            return $filter('date')(date, 'short')
          } else {
            if (showDay){
              return $filter('date')(date, 'fullDate')
            } else {
              return $filter('date')(date, 'mediumDate')
            }
          }
        }
      };
      return function(date,showHour,showDay) {
        return formatters[$rootScope.locale.lang](date,showHour,showDay);

      };
    }).filter('add3dots', function() {
    return function(input,limit,run) {
      if (input && input.length > limit && run) {
        return input.substring(0,limit) + '...';
      } else {
        return input;
      }
    };
  })
    .filter('capitalize', function() {
    return function(input, all) {
      var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
      return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    }
  })
    .filter('unsafeHtml', function($sce) { return $sce.trustAsHtml; });
})();
