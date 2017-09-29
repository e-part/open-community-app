/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.privacy')
    .controller('PrivacyCtrl', function ($scope, $location, gettextCatalog, CoreService) {

    	var title = gettextCatalog.getString('ePart - Terms and Privacy Policy');
		CoreService.setMetaTags({
			title: title
		});

		$scope.$on('$viewContentLoaded', function(){
			CoreService.sendGaPageview($location.url(), title);
		});
    });
})();
