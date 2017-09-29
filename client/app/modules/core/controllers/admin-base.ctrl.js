(function () {
  'use strict';
  /**
   * @ngdoc function
   * @name com.module.core.controller:HomeCtrl
   * @description Dashboard
   * @requires $scope
   * @requires $rootScope
   **/
  angular
    .module('com.module.core')
    .controller('AdminBaseCtrl', function ($scope, gettextCatalog, User, $q, Constants, PollVote, Comment, Meta) {
      var ctrl = this;
      ctrl.periods = {
        ALL: {
          days: null,
          text: gettextCatalog.getString('All'),
          grouping : 'MONTHLY'
        },
        LAST_WEEK: {
          days: 7,
          text: gettextCatalog.getString('Last Week'),
          grouping : 'DAILY'

        },
        LAST_MONTH: {
          days: 30,
          text: gettextCatalog.getString('Last Month'),
          grouping : 'DAILY'

        }
      };
      var chartsConfig = [
        {
          name : gettextCatalog.getString('New Users'),
          color : 'blue'
        },
        {
          name : gettextCatalog.getString('Polls Votes'),
          color : 'orange'
        },
        {
          name : gettextCatalog.getString('Comments'),
          color : 'red'
        },
        {
          name : gettextCatalog.getString('Comments Upvotes'),
          color : 'green'
        }
      ];
      function getData(fromDate) {

        function createFilters(createdField, fromDate) {
          if (fromDate) {
            var filters = {
              where: {}
            };
            filters.where[createdField] = {gt: fromDate}
            return filters;
          }
          return null;
        }

        return $q.all([
          User.count(createFilters("created", fromDate)).$promise,
          PollVote.count(createFilters("createdAt", fromDate)).$promise,
          Comment.count(createFilters("createdAt", fromDate)).$promise
        ]);
      }

      function getChartsData(startDate, groupBy){
        return $q.all([
          Meta.getStats({model : 'user',groupingField : 'created',resolution : groupBy, from : new Date(startDate), to : new Date()}).$promise,
          Meta.getStats({model : 'PollVote',groupingField : 'createdAt',resolution : groupBy, from : new Date(startDate), to : new Date()}).$promise,
          Meta.getStats({model : 'Comment',groupingField : 'createdAt',resolution : groupBy,from : new Date(startDate), to : new Date()}).$promise,
          Meta.getStats({model : 'Upvote',groupingField : 'createdAt',resolution : groupBy,from : new Date(startDate), to : new Date()}).$promise

        ]);
      }

      function convertDataToChartFormat(data){
        var formattedData = [];
        for (var i = 0; i < data.length; i++){
          formattedData.push({ x : new Date(data[i].date), y : data[i].value});
        }
        return formattedData;
      }
      function initCharts(results){
        ctrl.charts = [];
        console.log(results);
        var HE = d3.locale({
          decimal: ".",
          thousands: ",",
          grouping: [3],
          currency: ["₪", ""],
          dateTime: "%A, %e ב%B %Y %X",
          date: "%d.%m.%Y",
          time: "%H:%M:%S",
          periods: ["AM", "PM"],
          days: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"],
          shortDays: ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"],
          months: ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"],
          shortMonths: ["ינו׳", "פבר׳", "מרץ", "אפר׳", "מאי", "יוני", "יולי", "אוג׳", "ספט׳", "אוק׳", "נוב׳", "דצמ׳"]
        });

        var chartOptions = {
          chart: {
            type: 'lineChart',
            xAxis: {
              tickFormat: function(d){
                return HE.timeFormat('%x')(new Date(d));
              }
            },
            height: 300,
            margin: {
              top: 20,
              right: 50,
              bottom: 40,
              left: 50
            },
          }
        };
        for (var i = 0; i < chartsConfig.length; i++){
          var chartData = [];
          var values = convertDataToChartFormat(results[i]);
          // add line series to chart
          chartData.push({
            key : chartsConfig[i].name,
            values : values,
            color: chartsConfig[i].color
          });
          ctrl.charts.push({
            chartOptions : chartOptions,
            chartData : chartData
          });
        }

      }
      function initDashboard(data) {
        console.log(data);
        ctrl.addComponent(gettextCatalog.getString('New Users'), 'bg-yellow', 'ion-ios-people', data[0].count, 'app.admin.files.list');
        ctrl.addComponent(gettextCatalog.getString('Polls Votes'), 'bg-green', 'ion-stats-bars', data[1].count, 'app.admin.files.list');
        ctrl.addComponent(gettextCatalog.getString('Comments'), 'bg-blue', 'ion-compose', data[2].count, 'app.admin.files.list');
      }

      function getStartDate(period) {
        if (!ctrl.periods[period].days) {
          return null
        }
        var d = new Date()
        return d.setDate(d.getDate() - ctrl.periods[period].days);
      }

      function _init() {
        ctrl.reloadData('ALL');
      }

      ctrl.reloadData = function (period) {
        ctrl.boxes = [];
        ctrl.showStatsFromDate = period;
        getChartsData(getStartDate(ctrl.showStatsFromDate),ctrl.periods[ctrl.showStatsFromDate].grouping)
          .then(initCharts);
        getData(getStartDate(ctrl.showStatsFromDate))
          .then(initDashboard);
      };

      ctrl.addComponent = function (name, color, icon, quantity, href) {
        ctrl.boxes.push({
          name: name,
          color: color,
          icon: icon,
          quantity: quantity,
          href: href
        });
      };

      _init();


      //$document.find('.wrapper').attr('dir','ltr');
    });

})();
