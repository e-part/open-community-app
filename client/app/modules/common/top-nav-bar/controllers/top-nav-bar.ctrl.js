/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.common')
    .controller('TopNavBarCtrl', function ($rootScope, $timeout, $scope, AppAuth, $state, DialogsService, UserService,
                                           $document, gettextCatalog, NotificationService, Constants,
                                           CategoriesService, $window, ENV, DigitalTownService, CoreService, UtilsService, CLIENT_CONFIG) {
      var ctrl = this;
      ctrl.$state = $state;
      ctrl.currentUser = null;
      ctrl.EVENTS = Constants.EVENTS;
      ctrl.lang = $rootScope.locale.lang;
      ctrl.getDomainLink = CoreService.config.SITE_URL + '/domain';
      ctrl.searchText = '';
      ctrl.searchResults = null;
      ctrl.dtHome = CoreService.config.SITE_URL;
      ctrl.contactUrl = CoreService.config.SITE_URL + '/contact';
      ctrl.masterClientType = CLIENT_CONFIG.attributes.MASTER_CLIENT_TYPE;
      var notificationFormatters = {
        POST_COMMENT_REPLY: function (notification) {
          if (notification && notification.post && notification.meta &&notification.replyingUser){
            return {
              name : notification.name,
              eventBy: notification.replyingUser.firstName + " " + notification.replyingUser.lastName,
              text: gettextCatalog.getString('replied on your comment in'),
              postTitle: notification.post.title,
              postPermaLink: notification.post.permaLink,
              status: notification.status,
              image: notification.replyingUser.imageUrl,
              commentId: notification.meta.comment.id
            }
          }
          return null;

        },
        POST_PUBLISHED: function (notification) {
          return {
            name : notification.name,
            text: gettextCatalog.getString('New post published in'), // דיון חדש פורסם בנושא
            postTitle: notification.post.title,
            postPermaLink: notification.post.permaLink,
            status: notification.status
          }
        },
        USER_FOLLOWED: function (notification) {
          return {
            name : notification.name,
            text: gettextCatalog.getString('is added to your followers'), // הצטרף לעוקבים שלך.
            eventBy: notification.follower.firstName + " " + notification.follower.lastName,
            status: notification.status,
            image: notification.follower.imageUrl,
            followerId: notification.follower.id
          }
        }
      };

      function formatNotifications(notifications) {
        var formattedNotifications = [];
        for (var i = 0; i < notifications.length; i++) {
          if (notificationFormatters[notifications[i].name]){
            formattedNotifications.push(notificationFormatters[notifications[i].name].apply(null, [notifications[i]]));
          }
        }
        return formattedNotifications;
      }

      function getUserNotifications() {
        if (ctrl.sessionData.currentUser) {
          UserService.getUserNotifications(ctrl.sessionData.currentUser.id, { limit: 15, order : 'updatedAt DESC'}).then(function (notifications) {
            ctrl.notifications = formatNotifications(notifications);
            var unreadNotifications = _.filter(ctrl.notifications, {status : Constants.NOTIFICATION_STATUS.UNREAD});
            ctrl.unreadNotificationsCount = unreadNotifications ? unreadNotifications.length : 0;// 7;

          });
        }
      }

      function closeOnBlur(excludeElementClass){
        function outsideClicked(event){
          console.log('outsideClicked, excludeElementClass: ' + excludeElementClass);
          console.log('outsideClicked, event.target: ' ,event.target);
          if (!excludeElementClass ||
            !UtilsService.hasSomeParentTheClass(event.target,excludeElementClass)){ // close if clicked outside search box.
            ctrl.closeMenus();
            $scope.$apply();
            console.log('outsideClicked, closing menus');
            $document.off('mouseup',outsideClicked);

          }
        }
        $document.on('mouseup',outsideClicked);
      }

      function _init() {
        ctrl.notificationsBoxVisible = false;
        ctrl.accessibilityMenuVisible = false;

        ctrl.sessionData = AppAuth.getSessionData();
        ctrl.isMK = AppAuth.hasRole(Constants.USER_ROLES.MK);
        ctrl.scrollConfig = {
          autoHideScrollbar: false,
          theme: 'minimal-dark',
          advanced:{
            updateOnContentResize: true
          },
          scrollInertia: 0
        };
        ctrl.dtLinks = [
          {
            text :  gettextCatalog.getString('Hotels'),
            href: CoreService.config.SITE_URL + '/hotels'
          },
          {
            text :  gettextCatalog.getString('Restaurants'),
            href: CoreService.config.SITE_URL + '/restaurants'
          },
          {
            text :  gettextCatalog.getString('Shops'),
            href: CoreService.config.SITE_URL + '/shopping'
          },
          {
            text :  gettextCatalog.getString('Engage'),
            href: '/',
            active: true
          },
          {
            text :  gettextCatalog.getString('Services'),
            href: '#',
            subMenuItems: [
              {
                text :  gettextCatalog.getString('Find Local Lawyers'),
                href: CoreService.config.SITE_URL + '/law'
              }
            ]
          },
          {
            text :  gettextCatalog.getString('City Info'),
            href: '#',
            subMenuItems: [
              {
                text :  gettextCatalog.getString('Events'),
                href: CoreService.config.SITE_URL + '/events'
              },
              {
                text :  gettextCatalog.getString('Attractions'),
                href: CoreService.config.SITE_URL + '/law'
              },
              {
                text :  gettextCatalog.getString('Local Info'),
                href: CoreService.config.SITE_URL + '/info'
              }
            ]
          },
/*          {
            text :  gettextCatalog.getString('Events'),
            href: CoreService.config.SITE_URL + '/events'
          },
          {
            text :  gettextCatalog.getString('Law'),
            href: CoreService.config.SITE_URL + '/law'
          },*/
/*          {
            text :  gettextCatalog.getString('City Info'),
            href: CoreService.config.SITE_URL + '/info'
          },*/

          {
            text :  gettextCatalog.getString('Claim Your Domain'),
            href: CoreService.config.SITE_URL + '/domain'
          },
          {
            text :  gettextCatalog.getString('Contact'),
            href: CoreService.config.SITE_URL + '/contact',
            mobileOnly: true
          },
        ];
        AppAuth.requestCurrentUser(true).then(function () {
          getUserNotifications();
        });
        AppAuth.getProviders().then(function(result){
          ctrl.authProvider = _.findWhere(result, {name : 'digital-town-' + window.location.hostname});  // TODO enable this in order to support multiple domains

          //ctrl.authProvider = _.findWhere(result, {provider : 'digitalTown'});
        });
        $rootScope.$on('USER_SESSION_CHANGED',function(){
          getUserNotifications();
          ctrl.isMK = AppAuth.hasRole(Constants.USER_ROLES.MK);
        });
        //userSessionUpdated(ctrl.sessionData.currentUser);
        // ctrl.events();

        if (ctrl.sessionData.currentUser) {
          ctrl.catefories = ctrl.sessionData.currentUser.categories
        } else {
          CategoriesService.getCategories({order:'name ASC', limit: 5}).then(function(response){
            ctrl.catefories = response;
          });
        }

      }

      ctrl.openDialog = function (dialog) {
        if (dialog === 'enter') {
          var modalInstance = DialogsService.openDialog('login',{goToLoginWithEmail : false});
        } else {
          var modalInstance = DialogsService.openDialog(dialog,{goToLoginWithEmail : dialog == 'login'});
        }

        modalInstance.result.then(function () {
        }, function () {
        });
      };

      ctrl.logout = function () {
        AppAuth.logout(function () {
        });
      };

      ctrl.login = function(){
        if (ctrl.masterClientType === Constants.MASTER_CLIENT_TYPES.EPART){
          ctrl.openDialog('login');
        } else {
          window.location = CoreService.env.apiHost + ctrl.authProvider.authPath;
        }
      };

      ctrl.register = function(){
        if (ctrl.masterClientType === Constants.MASTER_CLIENT_TYPES.EPART){
          ctrl.openDialog('register');
        } else {
          window.location = CoreService.config.SITE_URL + '/register';
        }
      };

      ctrl.hasAdminRole = function () {
        return AppAuth.hasRole(Constants.USER_ROLES.ADMIN);
      };

      ctrl.showNotificationsBox = function () {
        if (!ctrl.notificationsBoxVisible) {
          ctrl.closeMenus();
          ctrl.notificationsBoxVisible = true;
          NotificationService.bulkUpdateByUser(ctrl.sessionData.currentUser.id, {"status" : Constants.NOTIFICATION_STATUS.READ});
          ctrl.unreadNotificationsCount = 0;
          closeOnBlur();

        } else {
          ctrl.notificationsBoxVisible = false;
        }

      };

      ctrl.showMenu = function () {
        if (!ctrl.menuVisible) {
          ctrl.closeMenus();
          ctrl.menuVisible = true;
          closeOnBlur();
        } else {
          ctrl.menuVisible = false;
        }
      };

      ctrl.showSiteNav = function () {
        if (!ctrl.siteNavVisible) {
          ctrl.closeMenus();
          ctrl.siteNavVisible = true;
          closeOnBlur();
        } else {
          ctrl.siteNavVisible = false;
        }
      };

      ctrl.showMobileSideMenu = function () {
        if (!ctrl.mobileSideMenuVisible) {
          ctrl.closeMenus();
          ctrl.mobileSideMenuVisible = true;
          closeOnBlur('dt-mobile-side-menu');
        } else {
          ctrl.mobileSideMenuVisible = false;
        }
      };

      ctrl.showAccessibilityBox = function(){
        if (!ctrl.accessibilityMenuVisible) {
          ctrl.closeMenus();
          ctrl.accessibilityMenuVisible = true;
          closeOnBlur();
        } else {
          ctrl.accessibilityMenuVisible = false;
        }
      };

      ctrl.closeMenus = function() {
        ctrl.menuVisible = false;
        ctrl.siteNavVisible = false;
        ctrl.notificationsBoxVisible = false;
        ctrl.accessibilityMenuVisible = false;
        ctrl.showSearchResults = false;
        ctrl.showSearchBox = false;
        ctrl.mobileSideMenuVisible = false;


      };

      ctrl.injectAccessibilityStyles = function(attribute){
        $rootScope.accessibilityCfg[attribute] = !$rootScope.accessibilityCfg[attribute];
      };

      ctrl.resetAccessibilitySettings = function () {
        $rootScope.accessibilityCfg = {};
      };

      ctrl.searchSite = function() {
        if (ctrl.searchText){
          window.location = CoreService.config.SITE_URL + '/search?s=' + ctrl.searchText;
        }
      };
      ctrl.showSearchInput = function(){
        ctrl.showSearchBox = true;
        closeOnBlur('middle-cont');

      };
      ctrl.switchLocale = function(locale) {
        //var locale = ($rootScope.locale.lang === 'en_US') ? 'he_IL' : 'en_US';
        $rootScope.switchLocale(locale);
      };

      ctrl.goHome = function() {
        window.location = CoreService.config.SITE_URL;
      };


      _init();
    });

})();
