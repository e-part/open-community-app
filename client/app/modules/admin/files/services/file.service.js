(function () {
  'use strict';
  angular
    .module('com.module.files')
    .service('FileService', ['$http', 'CoreService', 'Setting', 'gettextCatalog', function ($http, CoreService, Setting, gettextCatalog) {

      this.find = function () {
        return $http.get(CoreService.env.apiUrl +  'containers/'+  CoreService.env.bucket +'/files').success(function (res) {
          return res.data;
        });
      };

      this.delete = function (id, successCb, cancelCb) {
        CoreService.confirm(
          gettextCatalog.getString('Are you sure?'),
          gettextCatalog.getString('Deleting this cannot be undone'),
          function () {
            $http.delete(CoreService.env.apiUrl +
              'containers/'+  CoreService.env.bucket +'/files/' + encodeURIComponent(id)).success(
              function () {
                CoreService.toastMessage('success');
                successCb();
              });
          }, function (err) {
            // CoreService.toastMessage('error');
            cancelCb();
          });
      };

    }]);

})();
