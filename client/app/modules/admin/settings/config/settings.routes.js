(function () {
  'use strict';
  angular
    .module('com.module.settings')
    .config(function ($stateProvider) {
      $stateProvider
        .state('app.admin.settings', {
          abstract: true,
          url: '/settings',
          templateUrl: 'modules/admin/settings/views/main.html'
        })
        .state('app.admin.settings.list', {
          url: '',
          templateUrl: 'modules/admin/settings/views/list.html',
          controllerAs: 'ctrl',
          controller: function (settings) {
            this.settings = settings;
          },
          resolve: {
            settings: function (SettingService) {
              return SettingService.find();
            }
          }
        })
        .state('app.admin.settings.add', {
          url: '/add',
          templateUrl: 'modules/admin/settings/views/form.html',
          controllerAs: 'ctrl',
          controller: function ($state, SettingService, setting) {
            this.setting = setting;
            this.formFields = SettingService.getFormFields();
            this.formOptions = {};
            this.submit = function () {
              SettingService.upsert(this.setting).then(function () {
                $state.go('^.list');
              });
            };
          },
          resolve: {
            setting: function () {
              return {};
            }
          }
        })
        .state('app.admin.settings.edit', {
          url: '/:id/edit',
          templateUrl: 'modules/admin/settings/views/form.html',
          controllerAs: 'ctrl',
          controller: function ($state, SettingService, setting) {
            this.setting = setting;
            this.formFields = SettingService.getFormFields();
            this.formOptions = {};
            this.submit = function () {
              SettingService.upsert(this.setting).then(function () {
                $state.go('^.list');
              });
            };
          },
          resolve: {
            setting: function ($stateParams, SettingService) {
              return SettingService.findById($stateParams.id);
            }
          }
        })
        .state('app.admin.settings.view', {
          url: '/:id',
          templateUrl: 'modules/admin/settings/views/view.html',
          controllerAs: 'ctrl',
          controller: function (setting) {
            this.setting = setting;
          },
          resolve: {
            setting: function ($stateParams, SettingService) {
              return SettingService.findById($stateParams.id);
            }
          }
        })
        .state('app.admin.settings.delete', {
          url: '/:id/delete',
          template: '',
          controllerAs: 'ctrl',
          controller: function ($stateParams, $state, SettingService) {
            SettingService.delete($stateParams.id, function () {
              $state.go('^.list');
            }, function () {
              $state.go('^.list');
            });
          }
        });
    });

})();
