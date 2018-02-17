/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.common')
    .controller('ClPhotoCtrl', function ($scope, Constants, cloudinary) {
    	var ctrl = this;

    	ctrl.imageSrc      = $scope.imageSrc;
    	ctrl.imageClass    = $scope.imageClass;
        ctrl.imageAlt      = $scope.imageAlt;
        ctrl.defaultAvatar = Constants.DEFAULT_AVATAR;

    	if (ctrl.imageSrc.indexOf('cloudinary.com') > -1 ) {
    		// it's a cloudinary image - set the configuration to display the image
    		var img = ctrl.imageSrc.split('/');
    		ctrl.imageSrc = cloudinary.url(img[img.length - 1].split('.')[0], {
                height: $scope.imageHeight,
                width: $scope.imageWidth,
                crop: $scope.imageCrop,
                gravity: $scope.imageGravity,
                quality: 100,
                zoom: $scope.imageZoom
            });
    	} else {
    		// image hosted on s3, leave as is
    		ctrl.imageSrc = ctrl.imageSrc;
    	}

	});
})();
