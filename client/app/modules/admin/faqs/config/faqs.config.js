(function () {
  'use strict';
  angular
    .module('com.module.faqs')
    .run(['$rootScope', 'gettextCatalog',function ($rootScope, gettextCatalog) {
    	$rootScope.addMenu(gettextCatalog.getString('Faqs'), 'app.admin.faqs.list', 'fa-question-circle');
    }]);
})();
