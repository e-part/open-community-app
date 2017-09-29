/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.subscriptions')
    .controller('SubscriptionsCtrl', function ($scope, UserService, $location, CoreService, gettextCatalog) {
      var ctrl = this;
      var urlParams = $location.search();
      if (urlParams.error){
        ctrl.hadErrors = true;
      }
      CoreService.setMetaTags({
        title: gettextCatalog.getString('Email Notifications Settings')
      });


    });


})();
