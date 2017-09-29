/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.common')
    .controller('epFooterCtrl', function ($rootScope, CategoriesService, gettextCatalog, $state) {
      var ctrl = this;
      ctrl.$state = $state;
      
      function _init() {
      }

      _init();
    });


})();
