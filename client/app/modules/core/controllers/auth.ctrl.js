/**
 * Created by yotam on 26/07/2016.
 */
(function () {
  'use strict';
  /**
   * @ngdoc function
   * @name com.module.core.controller:AuthCtrl
   * @description Auth Controller - handles special auth routes logic.
   **/
  angular
    .module('com.module.core')
    .controller('AuthCtrl', function ($location, AppAuth, appCache, Constants, $state) {
      var ctrl = this;
      var token = $location.search().accessToken;
      var userId = $location.search().userId;
      $location.search("");
      $location.hash("");
      AppAuth.setSocialUser(token, userId);
      AppAuth.requestCurrentUser().then(function(result) {
         // check if there is a path to go back to (and it's not the homepage)
        if (appCache.get('lastPath') && appCache.get('lastPath') != '/'){
          // if the last path is categories selection and user still needs to choose subjects,
          // redirect to the onboarding categories selection mode.
          if (appCache.get('lastPath') === '/categories-selection' && AppAuth.shouldRedirectToCategoriesSelection()) {
            $location.path(appCache.get('lastPath')).search({welcome: 'true'});
          } else {
            $location.path(appCache.get('lastPath'));
          }
          appCache.remove('lastPath');
        } else if(AppAuth.shouldRedirectToCategoriesSelection()) {
          // if there is no last path, but the user needs to choose subjects,
          // redirect to the onboarding categories selection mode.
          $location.path('/categories-selection').search({welcome: 'true'});
        } else {
          // else - redirect to homepage
          $state.go('app.public.main');
        }
      });
    });
})();
