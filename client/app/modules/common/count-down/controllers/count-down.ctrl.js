/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.common')
    .controller('countDownCtrl', function ($scope, gettextCatalog) {

      var el = $('#clock'),
        time = $scope.time,
        d = new Date(time),
        year = d.getFullYear(),
        month = d.getMonth() + 1,
        day = d.getDate(),
        hour = d.getHours(),
        minute = d.getMinutes(),
        second = d.getSeconds(),
        countDown = new CountDownObject();

      countDown.TIME_ZONE = +(-new Date().getTimezoneOffset() / 60); // ignore the client's browser timezone offset.

      // Your date and time
      countDown.SET_YOUR_SEC = second,
        countDown.SET_YOUR_MIN = minute,
        countDown.SET_YOUR_HOUR = hour,
        countDown.SET_YOUR_DAY = day,
        countDown.SET_YOUR_MONTH = month,
        countDown.SET_YOUR_YEAR = year,

        countDown.NUM_OF_ELEMENTS = 8, // number of flip-elements(from 1 to 9)
        countDown.TIME_ANIMATION = 300, // time of flip animation in milliseconds(from 50 to 950)
        countDown.BACK_COLOR = "#fff", // flip-element back color
        countDown.DIGITS_COLOR = "#000", // digits color on flip-elements
        countDown.TEXT_COLOR = "#fff", // text color under flip elements(seconds, minutes and etc.)
        countDown.IS_DYNAMIC_COLOR = false, // back color will vary(true or false)

        countDown.CANVAS_NAME = "CountDownCanvas",
      countDown.DAYS_TEXT = gettextCatalog.getString("Days"),
      countDown.HOURS_TEXT = gettextCatalog.getString("Hours"),
      countDown.MINUTES_TEXT = gettextCatalog.getString("Minutes"),
      countDown.SECONDS_TEXT = gettextCatalog.getString("Seconds"),
      countDown.Start(el);

    });
})();
