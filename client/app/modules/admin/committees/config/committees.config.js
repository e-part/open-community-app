(function () {
  'use strict';
  angular
    .module('com.module.committees')
    .run(function ($rootScope, Committee, gettextCatalog) {
      $rootScope.addMenu(gettextCatalog.getString('Committees'), 'app.admin.committees.list', 'fa-bank');

/*      Committee.find(function (committees) {
        $rootScope.addDashboardBox(gettextCatalog.getString('Committees'), 'bg-yellow', 'ion-document-text', committees.length, 'app.admin.committees.list');
      });*/

    });

})();
