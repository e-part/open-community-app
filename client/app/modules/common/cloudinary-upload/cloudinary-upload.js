(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name com.module.common.directive:cloudinary-upload
   * @description
   * # navbar
   */
  angular
    .module('com.module.common')
    .directive('cloudinaryUpload', function () {
      return {
        templateUrl: 'modules/common/cloudinary-upload/views/cloudinary-upload.html',
        restrict: 'E',
        transclude: true,
        controller : 'CloudinaryUploadCtrl',
        controllerAs : 'ctrl',
        scope: {
          progressCallback  : '&',
          successCallback   : '&'
        },
      };
    });
})();
