(function () {
  'use strict';
  angular.module('com.module.users')
    .run(function ($rootScope, gettextCatalog) {
      $rootScope.addMenu(gettextCatalog.getString('Users'), 'app.admin.users.list', 'fa-user');
    });

})();
