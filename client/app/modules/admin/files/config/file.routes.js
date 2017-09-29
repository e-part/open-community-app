(function () {
  'use strict';
  angular
    .module('com.module.files')
    .config(function ($stateProvider) {
      $stateProvider
        .state('app.admin.files', {
          abstract: true,
          url: '/files',
          templateUrl: 'modules/admin/files/views/main.html'
        })
        .state('app.admin.files.list', {
          url: '',
          templateUrl: 'modules/admin/files/views/list.html',
          controllerAs: 'ctrl',
          controller: function (files, DialogsService) {
            var ctrl = this;
            ctrl.files = files.data;
            ctrl.addMedia = function () {
              var modalInstance = DialogsService.openDialog('uploadMedia', {size : 'lg'});
              modalInstance.result.then(function (selectedItem) {
                console.log("Modal closed!", selectedItem);
                ctrl.selected = selectedItem;
              }, function () {
              });

            };
          },
          resolve: {
            files: function (FileService) {
              return FileService.find();
            }
          }
        })
        .state('app.admin.files.upload', {
          url: '/upload',
          templateUrl: 'modules/admin/files/views/upload.html',
          controllerAs: 'ctrl',
          controller: 'FilesUploadCtrl',
          resolve: {
            files: function (FileService) {
              return FileService.find();
            }
          }
        })
        .state('app.admin.files.delete', {
          url: '/:fileName/delete',
          template: '',
          controllerAs: 'ctrl',
          controller: function ($stateParams, $state, FileService) {
            FileService.delete($stateParams.fileName, function () {
              $state.go('^.list');
            }, function () {
              $state.go('^.list');
            });
          }
        });
    });

})();
