(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name com.module.common.directive:cl-photo
   * @description
   * # navbar
   */
  angular
    .module('com.module.common')
    .directive('clPhoto', function () {
      return {
        templateUrl: 'modules/common/cl-photo/views/cl-photo.html',
        restrict: 'E',
        transclude: true,
        controller : 'ClPhotoCtrl',
        controllerAs : 'ctrl',
        scope: {
          imageSrc      : '@',
          imageWidth    : '@',
          imageHeight   : '@',
          imageGravity  : '@',
          imageCrop     : '@',
          imageAlt      : '@',
          imageZoom     : '@',
          imageClass    : '@'
        },
      };
    });
})();
