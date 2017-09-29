/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.qa')
    .controller('QaCtrl', function ($scope, $location, gettextCatalog, CoreService, faqs) {
      var title = gettextCatalog.getString('ePart - FAQ');
      CoreService.setMetaTags({
        title: title
      });

      $scope.$on('$viewContentLoaded', function(){
        CoreService.sendGaPageview($location.url(), title);
      });

      var ctrl = this;

      function _init() {
      	ctrl.faqs = faqs;
      }

      _init();

    });
})();
