/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.dashboard')
    .controller('DashboardCtrl', function ($rootScope, $scope, $location, gettextCatalog, CoreService,
                                           CategoriesService, CommitteesService, PostsService, AppAuth,
                                           $filter, Post, User, DashboardService, Constants, Message, $timeout) {
      var title = gettextCatalog.getString('Discussion Management Dashboard');
      CoreService.setMetaTags({
        title: title
      });

      $scope.$on('$viewContentLoaded', function () {
        CoreService.sendGaPageview($location.url(), title);
      });

      var ctrl = this;
      ctrl.calendarObj = [];
      ctrl.extras = {};
      ctrl.COMMENTS_TO_SHOW = 4;
      ctrl.newMessage = "";
      ctrl.meetingCancelledText = gettextCatalog.getString('Meeting Cancelled');
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
          type: 'pieChart',
          x: function(d){return d.key ;},
          y: function(d){return d.percentage},
          showLabels: true,
          duration: 500,
          labelThreshold: 0.01,
          showLegend : false,
          height: 180,
          margin: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          },
        }
      };
      var locationChartData = [
        {
          key: gettextCatalog.getString('Camden'),
          percentage: 31
        },
        {
          key: gettextCatalog.getString('Chelsea'),
          percentage: 27
        },
        {
          key: gettextCatalog.getString('Hackney'),
          percentage: 5
        },
        {
          key: gettextCatalog.getString('Greenwich'),
          percentage: 35
        }
      ];
      var genderChartData = [
        {
          key: gettextCatalog.getString('Women'),
          percentage: 44
        },
        {
          key: gettextCatalog.getString('Men'),
          percentage: 56

        }
      ];

      /**
       * loop through the posts and get their comments
       * @param posts
       * @returns {Array}
       */
      function getLatestComments(posts) {
        var latestComments = [];
        for (var i = 0; i < posts.length; i++) {
          latestComments = latestComments.concat(posts[i].comments);
        }
        /*        if (!latestComments.length){ // if no relevant comments exist, get general comments.
         latestComments = latestComments.concat(allComments);
         }*/
        return latestComments;

      }

      function refreshDashbordView() {
        ctrl.latestComments = [];
        getCommittees();
        getPostsByCommittees().then(function (posts) {
          ctrl.latestComments = getLatestComments(posts);
          ctrl.posts = posts;

          // this function recieves the posts array which we want to show their polls
          // and populates the ctrl.polls array with all the relevant polls to show.
          setPolls(posts);
          setCalendar(posts);

        });
      }

      function _init() {
        ctrl.defaultAvatar = Constants.DEFAULT_AVATAR;
        ctrl.sessionData = AppAuth.getSessionData();
        ctrl.timeOfDay = new Date().getHours();
        initMobileView();
        CategoriesService.getCategories().then(function (result) {
          ctrl.extras.categories = result;
        });

        getDashboardSetting();
        refreshDashbordView();
      }

      function getDashboardSetting() {
        if (ctrl.sessionData.currentUser.dashboardSettings) {
          ctrl.dbSettings = angular.copy(ctrl.sessionData.currentUser.dashboardSettings);
          ctrl.dbSettings.settings = JSON.parse(ctrl.sessionData.currentUser.dashboardSettings.settings || {});
        } else {
          // in case settings does not exists for this user, we create it manually
          ctrl.dbSettings = {settings: {}};
        }
      }

      function getCommittees() {
        var mkCommitteesList = _.map(ctrl.sessionData.currentUser.committees, "id");
        ctrl.dbSettings.settings.committees = ctrl.dbSettings.settings.committees || mkCommitteesList;
      }

      function addStatsToPosts(posts) {
        var statsItems = {
/*          upvotes: {
            text: 'לייקים',
            getData: function (post) {
              // get the upvotes count from each comment of the post and sum them up.
              var count = 0;
              if (post.comments && post.comments.length) {
                for (var i = 0; i < post.comments.length; i++) {
                  count += post.comments[i].upvotesCount;
                }
                return count;
              } else {
                return 0;
              }
            }
          },*/
          votes: {
            text: gettextCatalog.getString('Votes'), // 'הצבעות',
            getData: function (post) {
              // get the poll and sum the votes from all its answers
              var votesCount = 0;
              if (post.polls && post.polls.length) {
                for (var i = 0; i < post.polls.length; i++) {
                  var answers = post.polls[i].answers
                  if (answers && answers.length) {
                    for (var j = 0; j < answers.length; j++) {
                      votesCount += answers[j].votes;
                    }
                  }
                }
                return votesCount;
              } else {
                return 0;
              }
            }
          },
          comments: {
            text: gettextCatalog.getString('Comments'),
            getData: function (post) {
              return post.commentsCount;
            }
          },
          participants: {
            text:gettextCatalog.getString('Participants'),
            getData: function (post) { // get unique userIds from all of the post's comments
              function addUserId(users, user) { // add user to list if not already exists
                if (!_.find(users, {id: user.id})) {
                  users = users.concat([user]);
                }
                return users;
              }

              var uniqueCommenters = [];
              if (post.comments && post.comments.length) {
                for (var i = 0; i < post.comments.length; i++) {
                  uniqueCommenters = addUserId(uniqueCommenters, post.comments[i].creator);
                }
                return uniqueCommenters.length;
              } else {
                return 0;
              }

            }
          }
        };

        for (var i = 0; i < posts.length; i++) {
          posts[i].statsItems = [];
          for (var key in statsItems) {
            posts[i].statsItems.push({
              text: statsItems[key].text,
              count: statsItems[key].getData(posts[i])
            })
          }
        }
        return posts;
      }

      function getPostsByCommittees() {
        return Post.getPostsByCommittees({
          committeesIds: JSON.stringify(ctrl.dbSettings.settings.committees),
        }).$promise.then(function (posts) {
          ctrl.posts = posts;
          ctrl.posts = addStatsToPosts(posts);
          ctrl.selectedPost = "" + ctrl.posts[0].id;
          ctrl.postSelected(ctrl.selectedPost, true);

          return posts;
        });
      }

      function setPolls(posts) {
        ctrl.polls = [];

        for (var post in posts) {
          if (posts[post].polls && posts[post].polls.length) {
            for (var p in posts[post].polls) {
              ctrl.polls.push(posts[post].polls[p]);
              ctrl.polls[ctrl.polls.length - 1].postTitle = posts[post].title;
              ctrl.polls[ctrl.polls.length - 1].officialTitle = posts[post].officialTitle;
              ctrl.polls[ctrl.polls.length - 1].postId = posts[post].id;
              ctrl.polls[ctrl.polls.length - 1].postPermaLink = posts[post].permaLink;
            }
          }
        }
        for (var poll in ctrl.polls) {
          ctrl.polls[poll] = CoreService.calculatePollPercentage(ctrl.polls[poll]);
        }
      }

      function setCalendar(posts) {
        var d = new Date(),   // datetime object of today
          day = d.getDay(),   // day in week (0-6)
          today = d.getDate(),  // day in month (1-31)
          month = d.getMonth() + 1, // month in year (1-12)
          year = d.getFullYear(), // year (2016)
          daysInMonth = new Date(year, month, 0).getDate(), // how many days are in this month
          calendarItems = 28,
          thisMonthDays = daysInMonth - today + day + 1,
          nextMonthDays = calendarItems - thisMonthDays;

        for (var i = 1; i <= thisMonthDays; i++) {
          var pastDay;
          (i > day) ? pastDay = false : pastDay = true;
          var d = new Date(new Date().getTime() + (24 * (i - 1)) * 60 * 60 * 1000);
          d.setHours(0, 0, 0, 0);
          d.setDate(d.getDate() - day);

          var date;
          (i && i % 7 === 0) ? date = {dateObj: undefined} : date = {
            dateObj: d,
            pastDay: pastDay,
            posts: []
          };

          setDisplayedDate(d);

          ctrl.calendarObj.push(date);
        }

        for (var i = 1; i <= nextMonthDays; i++) {
          var d = new Date(new Date().getTime() + (24 * (ctrl.calendarObj.length - day)) * 60 * 60 * 1000);
          d.setHours(0, 0, 0, 0);

          var date = ((ctrl.calendarObj.length + 1) % 7 === 0) ? date = {dateObj: undefined} : date = {
            dateObj: d,
            pastDay: false,
            posts: []
          }

          setDisplayedDate(d);

          ctrl.calendarObj.push(date);
        }

        function setDisplayedDate(d) {
          if (d.getDay() === 5) {
            var _d = d.toString();
            var dateOfTommorow = new Date(_d);
            dateOfTommorow.setDate(dateOfTommorow.getDate() + 1)
            date.dateDisplay = $filter('date')(d, "d/M") + '-' + $filter('date')(dateOfTommorow, "d/M");
            date.formatLocaleDate = new Hebcal.HDate(d).toString('h') + '-' + new Hebcal.HDate(new Date(dateOfTommorow)).toString('h');
          } else {
            date.dateDisplay = $filter('date')(d, "d/M");
            date.formatLocaleDate = new Hebcal.HDate(d).toString('h');
          }
        }

        getPosts(posts);
      }

      function getPosts(posts) {
        function clearCalendarPosts() {
          for (var i = 0; i < ctrl.calendarObj.length; i++) {
            ctrl.calendarObj[i].posts = [];
          }
        }

        clearCalendarPosts();
        var p;
        for (p in posts) {
          var date = new Date(posts[p].endDate);
          date.setHours(0, 0, 0, 0);
          var c;
          for (c in ctrl.calendarObj) {
            if (ctrl.calendarObj[c].dateObj && ctrl.calendarObj[c].dateObj.toDateString() === date.toDateString()) {
              ctrl.calendarObj[c].posts.push(posts[p]);
            }
          }
        }
      }

      function initMobileView() {
        if (CoreService.isMobile()) {
          ctrl.monthView = true;
          ctrl.limitTo = 28;
        } else {
          ctrl.monthView = false;
          ctrl.limitTo = 6;
        }
      }

      function getCategoryTags(post){
        return _.filter(post.predefinedTags,{type : Constants.TAG_TYPES.CATEGORY});
      }

      ctrl.updateCommittees = function () {
        var finalCommittees = [];
        for (var i in ctrl.allCommittees) {
          if (ctrl.allCommittees[i].selected) {
            finalCommittees.push(ctrl.allCommittees[i].id);
          }
        }
        ctrl.dbSettings.settings.committees = finalCommittees;
        DashboardService.setUISettings(ctrl.sessionData.currentUser, ctrl.dbSettings).then(function (res) {
          $rootScope.darkScreen = false;
          ctrl.selectedCommittee = 'all';
          ctrl.dbSettings.id = res.id;
          refreshDashbordView();

        });
      }

      ctrl.filterCommittee = function (committee) {
        var forceShowAll = false;
        if (committee == "all") {
          forceShowAll = true;
        }
        for (var c in ctrl.calendarObj) {
          for (var p in ctrl.calendarObj[c].posts) {
            if (!ctrl.calendarObj[c].posts[p].committees.length) {
              ctrl.calendarObj[c].posts[p].hide = true && !forceShowAll;
            }
            var postCommittees = [];
            for (var com in ctrl.calendarObj[c].posts[p].committees) {
              postCommittees.push(parseInt(ctrl.calendarObj[c].posts[p].committees[com].id));
            }
            if (postCommittees.indexOf(parseInt(committee)) > -1) {
              ctrl.calendarObj[c].posts[p].hide = false;
            } else {
              ctrl.calendarObj[c].posts[p].hide = true && !forceShowAll;
            }
          }
        }
      }

      ctrl.showAddCommittees = function () {
        $rootScope.darkScreen = true;
      }

      ctrl.closeAddCommittees = function () {
        $rootScope.darkScreen = false;
      }

      ctrl.postMessage = function (post) {
        if (!ctrl.sessionData.currentUser) {
          DialogsService.openDialog('login', {actionIntercepted: true});
          return;
        }
        var newMessage = {
          content: ctrl.newMessage,
          postId: post.id,
          creatorId: ctrl.sessionData.currentUser.id
        };
        Message.create(newMessage).$promise.then(function (message) {
          if (message) {
            post.messages.unshift(message);
            ctrl.newMessage = '';
            post.expandForm = false;
          }
        });
      };

      ctrl.initArr = function (obj, field) {
        if (!obj[field]) {
          obj[field] = [];
        } else {
          obj[field] = _.map(obj[field], function (str) {
            return {text: str};
          });
        }
      };

      ctrl.addPostItem = function (post, field, valueField) {
        var postToSave = {
          id: post.id,
        };
        post[field].push({text: post[valueField]});
        postToSave[field] = _.map(post[field], "text");
        PostsService.upsertPost(postToSave).then(function () {
          post[valueField] = '';
        });

      };

      ctrl.postSelected = function(postId, isInit){
        var selectedPost = _.findWhere(ctrl.posts, {id : parseInt(postId)});
        ctrl.topHashags = ctrl.getTopHashtags(selectedPost);

        $timeout(function(){


          selectedPost.locationChartConfig = {
            chartOptions : chartOptions,
            chartData : locationChartData
          };
          selectedPost.genderChartConfig = {
            chartOptions : chartOptions,
            chartData : genderChartData
          };
          // $scope.$apply();
        },200);
      };
      // return count for each tag on the post's comments.
      ctrl.getTopHashtags = function(post) {
        var result = [];
        var tags = _.map(post.comments, 'tags'); // get only tags property
        tags = _.filter(tags, function(obj){ // remove undefined values (where no tags found)
          return obj;
        });
        tags = _.flatten(tags); // remove the redundant objects level
        tags = _.union(tags); // union all arrays to one
        var counts = _.countBy(tags, function(obj) {
          return obj.content;
        });
        var i = 0;
        _.each(counts, function(value, key){
          i++;
          if (value > 10){
            value = 10;
          }
          result.push({
            text : "#" + key,
            weight: value,
            link: $location.protocol() + "://" +location.host + "/post/" + post.permaLink + "?tag=" + key});
        });
        return result;
      };

      ctrl.getColumnWidth = function(poll) {
        var col = (100 / poll.answers.length);
        return {width: '' +col +'%'};
      };

      ctrl.getPollWidth = function(poll) {
        var margin = Constants.CONFIG.MAX_POLL_ANSWERS - poll.answers.length;
        margin = 12 / margin; // 12 / 4 = 3
        var width = 100 - (100 / (margin*2)); // 100 - (100 / 6)
        if (width < 50){
          width = 50;
        }
        return {width: '' +width +'%'};
      };


      _init();

    });

})();
