/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.files')
    .controller('FilesUploadCtrl', ['FileUploader', 'CoreService', 'files', 'FileService', '$uibModalInstance',
      function (FileUploader, CoreService, files, FileService, $uibModalInstance) {
        var ctrl = this;
        ctrl.IMAGES_LIMIT = 16;
        ctrl.files = files.data;
        ctrl.filesToView = ctrl.files.slice(0, ctrl.IMAGES_LIMIT);
        ctrl.apiUrl = CoreService.env.apiUrl;
        ctrl.bucket = CoreService.env.bucket;
        ctrl.S3_PREFIX = CoreService.config.S3_PREFIX;

        ctrl.skipImagesIndex = 0;
        this.uploader = new FileUploader({
          url: CoreService.env.apiUrl + 'containers/' + CoreService.env.bucket + '/upload',
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
            FileService.find().then(function (response) {
              ctrl.files = response.data;
            });

          }
        });

        ctrl.selectMedia = function (item, closeDialog) {
          for (var i = 0; i < ctrl.files.length; i++) {
            ctrl.files[i].selected = false;
          }
          item.selected = true;
          ctrl.selectedItem = item;
          if (closeDialog) {
            $uibModalInstance.close(ctrl.selectedItem);
          }
        };

        ctrl.confirm = function () {
          $uibModalInstance.close(ctrl.selectedItem);
        };

        ctrl.cancel = function () {
          $uibModalInstance.dismiss();
        };

        ctrl.nextImages = function(){
          ctrl.skipImagesIndex += ctrl.IMAGES_LIMIT;
          // make sure the skip value is not bigger than maximum available images
          ctrl.skipImagesIndex = (ctrl.skipImagesIndex > ctrl.files.length - ctrl.IMAGES_LIMIT) ? (ctrl.files.length - ctrl.IMAGES_LIMIT) : ctrl.skipImagesIndex;
          ctrl.filesToView = ctrl.files.slice(ctrl.skipImagesIndex, ctrl.skipImagesIndex + ctrl.IMAGES_LIMIT);

        };

        ctrl.prevImages = function(){
          ctrl.skipImagesIndex -= ctrl.IMAGES_LIMIT;
          // make sure the skip value is not smaller than 0
          ctrl.skipImagesIndex = (ctrl.skipImagesIndex < 0) ? 0 : ctrl.skipImagesIndex
          ctrl.filesToView = ctrl.files.slice(ctrl.skipImagesIndex, ctrl.skipImagesIndex + ctrl.IMAGES_LIMIT);
        };

      }]);


})();
