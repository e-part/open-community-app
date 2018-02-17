/**
 * Created by yotam on 06/06/2017.
 */

(function () {
  'use strict';
  /**
   * @ngdoc directive
   * @name com.module.core.directive:uploadBox
   * @description
   * # uploadBox
   */
  angular
    .module('com.module.core')
    .directive('uploadBox', function () {
      return {
        templateUrl: 'modules/core/views/elements/upload-box.html',
        restrict: 'E',
        controllerAs : 'ctrl',
        scope : {
          label: "=",
          description: "=",
          updateProperty: "=",
          updateModel: "="

        },
        controller : ['DialogsService','CoreService', 'FileUploader','$scope',
          function(DialogsService, CoreService, FileUploader, $scope){

          var ctrl = this;
          ctrl.mediaUrl = $scope.updateModel[$scope.updateProperty];

          ctrl.uploader = new FileUploader({
            url: CoreService.env.apiUrl + 'containers/'+  CoreService.env.bucket +'/upload',
            formData: [
              {
                key: 'value'
              }
            ],
            onAfterAddingFile: function (item) {
              var fileExtension = '.' + item.file.name.split('.').pop();
              item.file.name = Math.random().toString(36).substring(7) + new Date().getTime() + fileExtension;
              item.upload();
            },
            onCompleteItem: function (data) {
              console.log("Item upload completed!", data);
              ctrl.mediaUrl = CoreService.getFileUrl(data.file.name);
              $scope.updateModel[$scope.updateProperty] = ctrl.mediaUrl;

            }
          });
        }],
        link: function postLink (scope, element) {
        }
      };
    });

})();
/*

 </div>*/
