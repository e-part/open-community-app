(function () {
  'use strict';
  /**
   * @ngdoc directive
   * @name com.module.core.directive:adminBox
   * @description
   * # adminBox
   */
  angular
    .module('com.module.core')
    .directive('mediaUploadInput', function () {
      return {
        templateUrl: 'modules/core/views/elements/media-upload-input.html',
        restrict: 'E',
        controllerAs : 'ctrl',
        scope : {
          label: "=",
          updateProperty: "=",
          updateModel: "="

        },
        controller : ['DialogsService','CoreService', '$scope', function(DialogsService, CoreService, $scope){
          var ctrl = this;
          ctrl.mediaUrl = $scope.updateModel[$scope.updateProperty];
          ctrl.chooseMedia = function (property) {
            var modalInstance = DialogsService.openDialog('uploadMedia',{size : 'lg'});
            modalInstance.result.then(function (selectedItem) {
              var staticMediaUrl = 'https://' + CoreService.env.bucket + CoreService.config.S3_PREFIX + selectedItem.name;
              ctrl.mediaUrl = staticMediaUrl;
              $scope.updateModel[$scope.updateProperty] = staticMediaUrl;
            }, function () {
            });
          };
        }],
        link: function postLink (scope, element) {
        }
      };
    });

})();
