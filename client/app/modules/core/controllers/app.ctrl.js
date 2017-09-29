(function () {
  'use strict';
  /**
   * @ngdoc function
   * @name com.module.core.controller:AppCtrl
   * @description Login Controller
   * @requires $scope
   * @requires $state

   * @requires CoreService
   * @requires User
   * @requires gettextCatalog
   **/
  angular
    .module('com.module.core')
    .controller('AppCtrl', function ($scope, $rootScope, AppAuth, $document, ENV, $location, CoreService, CLIENT_CONFIG) {
      console.log("CLIENT_CONFIG: "  + JSON.stringify(CLIENT_CONFIG));
      
      // -- APP SCOPE FUNCTIONS -- //
      $rootScope.closeDarkLayer = function() {
        $rootScope.darkScreen = false;
      }

      $rootScope.sendGaEvent = function(category,action) {
        CoreService.sendGaEvent(category,action);
      }

      $rootScope.openSharePopup = function(event) {
        event.preventDefault();
        var shareHref = event.currentTarget;
        var leftPosition, topPosition;
        var height = 350;
        var width = 600;
        leftPosition = (window.screen.width / 2) - ((width / 2) + 10);
        topPosition = (window.screen.height / 2) - ((height / 2) + 50);
        var windowFeatures = "status=no,height=" + height + ",width=" + width + ",resizable=yes,left=" + leftPosition + ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY=" + topPosition + ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no";
        window.open(shareHref,'sharer', windowFeatures);
        return false;
      }
      
      // -- APP SCOPE EVENTS -- //

      $rootScope.$on('$viewContentLoading', function(event, viewConfig){
          $scope.loadingRoute = true;
        });

      $rootScope.$on('$viewContentLoaded', function(event){
          $scope.loadingRoute = false;
        });
      // Give indication on routing errors.
      $rootScope.$on('$stateChangeError', function(evt, to, toParams, from, fromParams, error) {
        console.error("$stateChangeError: " + JSON.stringify(error));
      });
      // Always scroll to top when route is changed.
      $rootScope.$on('$stateChangeSuccess', function() {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      });
      
      function _initScopeProperties(){
        $rootScope.defaultAvatar = '/images/user-logo.jpg';
        $rootScope.CLIENT_CONFIG = CLIENT_CONFIG;
        $scope.menuoptions = $rootScope.menu;
        $scope.sessionData = AppAuth.sessionData;
        $rootScope.ENV = ENV.name;
      }
      function _routeParamsHandler(){
        if ($location.search() && $location.search().clearSession){
          $location.search('')
          AppAuth.logout();
        } else {
          AppAuth.requestCurrentUser();
        }
      }
      _initScopeProperties();
      _routeParamsHandler();


    })
})();
