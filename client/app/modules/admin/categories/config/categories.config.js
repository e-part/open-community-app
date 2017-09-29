(function () {
  'use strict';
  angular
    .module('com.module.categories')
    .run(function ($rootScope, Category, gettextCatalog) {
      $rootScope.addMenu(gettextCatalog.getString('Categories'), 'app.admin.categories.list', 'fa-th');

/*      Category.find(function (categories) {
        $rootScope.addDashboardBox(gettextCatalog.getString('Categories'), 'bg-yellow', 'ion-document-text', categories.length, 'app.admin.categories.list');
      });*/

    });

})();
