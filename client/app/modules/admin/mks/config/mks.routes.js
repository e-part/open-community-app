(function () {
  'use strict';
  angular
    .module('com.module.mks')
    .config(function ($stateProvider) {
      $stateProvider
        .state('app.admin.mks', {
          abstract: true,
          url: '/mks',
          templateUrl: 'modules/admin/mks/views/main.html'
        })
        .state('app.admin.mks.list', {
          url: '',
          templateUrl: 'modules/admin/mks/views/list.html',
          controllerAs: 'ctrl',
          controller: function (mks) {
            this.mks = mks;
          },
          resolve: {
            mks: [
              'MKsService',
              function (MKsService) {
                return MKsService.getMKs();
              }
            ]
          }
        })
        .state('app.admin.mks.add', {
          url: '/add',
          templateUrl: 'modules/admin/mks/views/form.html',
          controllerAs: 'ctrl',
          controller: 'addMKCtrl',
          resolve: {
            mk: function () {
              return {};
            }
          }
        })
        .state('app.admin.mks.edit', {
          url: '/:id/edit',
          templateUrl: 'modules/admin/mks/views/form.html',
          controllerAs: 'ctrl',
          controller: 'editMKCtrl',
          resolve: {
            mk: function ($stateParams, UserService) {
              return UserService.findById($stateParams.id);
            }
          }
        })
        .state('app.admin.mks.view', {
          url: '/:id',
          templateUrl: 'modules/admin/mks/views/view.html',
          controllerAs: 'ctrl',
          controller: function (mk) {
            this.mk = mk;
          },
          resolve: {
            post: function ($stateParams, MKsService) {
              return MKsService.getMK($stateParams.id);
            }
          }
        })
        .state('app.admin.mks.delete', {
          url: '/:id/delete',
          template: '',
          controllerAs: 'ctrl',
          controller: function ($state, MKsService, mk) {
            MKsService.deleteMK(mk.id, function () {
              $state.go('^.list');
            }, function () {
              $state.go('^.list');
            });
          },
          resolve: {
            post: function ($stateParams, MKsService) {
              return MKsService.getMK($stateParams.id);
            }
          }
        });
    }
  );

})();
