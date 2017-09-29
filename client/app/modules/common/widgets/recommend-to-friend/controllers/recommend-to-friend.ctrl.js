/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.common')
    .controller('recommendToFriendCtrl', function (gettextCatalog,CoreService,$location,$scope,$rootScope,Category) {
    	var ctrl = this;
    		ctrl.shareUrls = {};

    	function _init() {
         Category.followers.count({id : $scope.category.id}).$promise.then(function(response){
           ctrl.followersCount = response.count;
        });
    		setShareLinks();
    	}

    	function setShareLinks() {
    		ctrl.shareUrls.twitter = CoreService.generateShareUrl('twitter',{
    			text: $scope.category.name,
    			hashTags: [$scope.category.name,'ePart'],
    			url: $location.absUrl()
    		});

    		ctrl.shareUrls.facebook = CoreService.generateShareUrl('facebook',{
    			url: encodeURIComponent($location.absUrl())
    		});
    	}

        ctrl.openSharePopup = function(event) {
            $rootScope.openSharePopup(event);
        }

        ctrl.FBshare = function(e) {
            e.preventDefault();
            FB.ui(
            {
                method: 'feed',
                link: $location.absUrl(),
                picture: $scope.category.imageUrl,
                name: 'ePart - ' + $scope.category.name,
                description: gettextCatalog.getString('Make Your Impact')
            });
        }

    	_init();
    });
})();
