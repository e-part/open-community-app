/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.common')
    .controller('CloudinaryUploadCtrl', function ($scope, gettextCatalog, Constants, Upload, cloudinary) {
    	var ctrl = this;

		var d = new Date();
		$scope.title = "Image (" + d.getDate() + " - " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ")";
		//$scope.$watch('files', function() {
		$scope.uploadFiles = function(files){
			$scope.files = files;
			if (!$scope.files) return;
			angular.forEach(files, function(file){
		  		if (file && !file.$error) {
		    		file.upload = Upload.upload({
		      			url: "https://api.cloudinary.com/v1_1/" + cloudinary.config().cloud_name + "/upload",
		      			data: {
				        	tags: 'user-profile-image',
				        	upload_preset: cloudinary.config().upload_preset,
				        	context: 'photo=' + $scope.title,
				        	file: file
		      			}	
		    		}).progress(function (e) {
		      			file.progress = Math.round((e.loaded * 100.0) / e.total);
		      			// file.status = "Uploading... " + file.progress + "%";
		      			$scope.progressCallback({data: file.progress});
		    		}).success(function (data, status, headers, config) {
		    			$scope.successCallback({data: data});
		      			// $rootScope.photos = $rootScope.photos || [];
		      			// data.context = {custom: {photo: $scope.title}};
		      			// file.result = data;
		      			// $rootScope.photos.push(data);
		    		}).error(function (data, status, headers, config) {
		      			// file.result = data;
		    		});
		  		}
			});
		};
	});
})();
