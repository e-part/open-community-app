/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.main')
    .controller('MainCtrl', function ($rootScope, $scope, $state, Constants, activePosts, archivePosts, gettextCatalog,
                                      CoreService, AppAuth, DialogsService, latestComments, $location, $interval, topContributors,
                                      $window, $document) {
      var title = gettextCatalog.getString(CoreService.config.BRAND);
      CoreService.setMetaTags({
        title: title
      });
      var ctrl = this;
      ctrl.$state = $state;

      $scope.$on('$viewContentLoaded', function(){
        CoreService.sendGaPageview($location.url(), title);
      });

      function init($rootScope) {
        var dateLocaleOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        ctrl.feedPosts = [
          {
            title: gettextCatalog.getString('Popular'),
            subtitle: gettextCatalog.getString('Top ranked posts'),
            posts: activePosts
          },
          {
            title: gettextCatalog.getString('Previous Discussions'),
            subtitle: new Date().toLocaleDateString('he-HE', dateLocaleOptions),
            posts: archivePosts,
            showSectionTitle : true,
            showSection: false,
            showSectionOnScroll : true
          }
        ];
        ctrl.latestComments = latestComments;
        ctrl.topContributors = topContributors;
        ctrl.sessionData = AppAuth.getSessionData();

        if (!ctrl.sessionData.currentUser) {
          $rootScope.bodyClassName = 'main';
        }

        // TODO - take this out of here
        $rootScope.$on('USER_SESSION_CHANGED',function() {
          if (AppAuth.hasRole(Constants.USER_ROLES.MK) && $state.current.name == 'app.public.main') {
            $location.path('/dashboard');
          }
        });
        function _showMorePostsIfReachedBottom(){
          if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
            ctrl.feedPosts[1].showSection = true;
            $scope.$apply();
            // remove event now.
          }
        }
/*        window.onscroll = function() {
          _showMorePostsIfReachedBottom();
        };*/
       // _showMorePostsIfReachedBottom();

      }

      $scope.$on("$destroy", function(){
          $rootScope.bodyClassName = '';
      });

      ctrl.openLoginDialog = function () {

        var modalInstance = DialogsService.openDialog('login');

        modalInstance.result.then(function () {

        }, function () {
        });
      };


      ctrl.headerSubjects = [
        {
          title: gettextCatalog.getString('what you care about'), // 'מה שחשוב לך',
          video: '../../videos/11.mp4'
        },
        {
          title: gettextCatalog.getString('security'), //'הביטחון',
          video: '../../videos/22.mp4'
        },
        {
          title: gettextCatalog.getString('transportation'), //'הבטיחות בדרכים',
          video: '../../videos/33.mp4'
        },
        {
          title: gettextCatalog.getString('the environment'), //'איכות הסביבה',
          video: '../../videos/44.mp4'
        },
        {
          title: gettextCatalog.getString('the environment'), //'איכות הסביבה',
          video: '../../videos/55.mp4'
        }
      ]

      ctrl.headerInit = function() {
        ctrl.showHeaderSubjectId = 0;
        var intervalValue = 5500; // miliseconds for each item

        $('video').each(function() {
          this.volume = 0; //for firefox - set the volume of each video to mute
        });

        ctrl.interval = $interval(function() {
          var vid = document.getElementsByTagName('video');
          if (!ctrl.headerSubjects[ctrl.showHeaderSubjectId + 1]) {
            ctrl.showHeaderSubjectId = 0
          } else {
            ctrl.showHeaderSubjectId++;
          }
          vid[ctrl.showHeaderSubjectId].pause();
          vid[ctrl.showHeaderSubjectId].currentTime = 0;
          vid[ctrl.showHeaderSubjectId].play();

        }, intervalValue);

        var firstItem = ctrl.headerSubjects[0]; // we always want to show this at first
        ctrl.headerSubjects.splice(0,1);
        ctrl.headerSubjects = _.shuffle(ctrl.headerSubjects);
        ctrl.headerSubjects.unshift(firstItem);
        ctrl.headerSubjects = ctrl.headerSubjects.splice(0,4);
      }

      $scope.$on("$destroy", function(){
        $interval.cancel(ctrl.interval);
      });

      init($rootScope);

    });
})();
