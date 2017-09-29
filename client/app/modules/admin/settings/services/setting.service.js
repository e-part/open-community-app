(function () {
  'use strict';
  angular
    .module('com.module.settings')
    .service('SettingService', function ($state, CoreService, Setting, gettextCatalog) {

      this.find = function () {
        return Setting.find().$promise;
      };

      this.findById = function (id) {
        return Setting.findById({
          id: id
        }).$promise;
      };

      this.upsert = function (setting) {
        return Setting.upsert(setting).$promise
          .then(function () {
            CoreService.toastMessage(
              gettextCatalog.getString('Setting saved'),
              gettextCatalog.getString('Your setting is safe with us!'),
              'success'
            );
          })
          .catch(function (err) {
            CoreService.toastMessage(
              gettextCatalog.getString('Error saving setting '),
              gettextCatalog.getString('This setting could no be saved: ') + err,
              'error'
            );
          }
        );
      };

      this.delete = function (id, successCb, cancelCb) {
        CoreService.confirm(
          gettextCatalog.getString('Are you sure?'),
          gettextCatalog.getString('Deleting this cannot be undone'),
          function () {
            Setting.deleteById({id: id}, function () {
              CoreService.toastMessage(
                gettextCatalog.getString('Setting deleted'),
                gettextCatalog.getString('Your setting is deleted!'),
                'success'
              );
              successCb();
            }, function (err) {
              CoreService.toastMessage(
                gettextCatalog.getString('Error deleting setting'),
                gettextCatalog.getString('Your setting is not deleted! ') + err,
                'error'
              );
              cancelCb();
            });
          },
          function () {
            cancelCb();
          }
        );
      };


      this.getFormFields = function () {
        var form = [
          {
            key: 'key',
            type: 'input',
            templateOptions: {
              label: gettextCatalog.getString('Value'),
              required: true
            }
          },
          {
            key: 'value',
            type: 'input',
            templateOptions: {
              label: gettextCatalog.getString('Key'),
              required: true
            }
          }
        ];
        return form;
      };

    });

})();
