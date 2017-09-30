/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.common')
    .controller('siteNavigationCtrl', function ($rootScope, CategoriesService, gettextCatalog, $state,
                                                $stateParams, AppAuth, DialogsService, Constants, PostsService, CLIENT_CONFIG) {
      var ctrl = this;
      ctrl.$state = $state;
      // ctrl.$stateParams = $stateParams;
      ctrl.hidePostCreationButtons = CLIENT_CONFIG.attributes.DISABLE_USER_POST_CREATION;

      /**
       * When a user is not logged-in:
       * - home link
       * - login link
       * - all categories
       * - site-map links
       */

      /**
       * When a user is logged-in:
       * - user's details widget
       * - user's categories
       * - all categories

       */
      function _init() {
        CategoriesService.getCategories().then(function(response){
          ctrl.categoriesList = _.shuffle(response);
        });
        ctrl.sessionData = AppAuth.getSessionData();
        AppAuth.requireUserSession(true).then(function(){
          // user session loaded
          PostsService.getUserPosts({
            where: {ownerId: ctrl.sessionData.currentUser.id, status: Constants.POST_STATUSES.PUBLISHED},
            order: 'id DESC'
          }).then(function(response){
            ctrl.userActivePosts = response;
          });
          ctrl.isMK = AppAuth.hasRole(Constants.USER_ROLES.MK);
          $rootScope.$on('USER_SESSION_CHANGED',function(){
            ctrl.isMK = AppAuth.hasRole(Constants.USER_ROLES.MK);
          });

        });
        ctrl.primaryLinks = [
          {
            text: gettextCatalog.getString('Home'),
            state: ctrl.sessionData.homeState
          }
        ];
        ctrl.secondaryLinks = [
          {
            text: gettextCatalog.getString('Terms and Privacy Policy'),
            link: CLIENT_CONFIG.attributes.TERMS_URL
          }
        ];
      }

      ctrl.openLoginDialog = function () {

        var modalInstance = DialogsService.openDialog('login');

        modalInstance.result.then(function () {
        }, function () {
        });
      };

      ctrl.openNewDiscussion = function(){
        if (!ctrl.sessionData.currentUser) { // prompt login popup if signed out.
          DialogsService.openDialog('login', {actionIntercepted: true});
          return;
        } else {
          $state.go('app.public.user-posts.add', {type: Constants.POST_TYPES.DISCUSSION});

        }
      };

      ctrl.openNewProject = function(){
        if (!ctrl.sessionData.currentUser) { // prompt login popup if signed out.
          DialogsService.openDialog('login', {actionIntercepted: true});
          return;
        } else {
          $state.go('app.public.user-posts.add', {type: Constants.POST_TYPES.PROJECT});

        }
      };

      ctrl.navClass = function (state) {
        return state === $state.current.name ? 'active' : '';

      };

      _init();
    });


})();
