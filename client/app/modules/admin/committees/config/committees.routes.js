(function () {
  'use strict';
  angular
    .module('com.module.committees')
    .config(function ($stateProvider) {
      $stateProvider
        .state('app.admin.committees', {
          abstract: true,
          url: '/committees',
          templateUrl: 'modules/admin/committees/views/main.html'
        })
        .state('app.admin.committees.list', {
          url: '',
          templateUrl: 'modules/admin/committees/views/list.html',
          controllerAs: 'ctrl',
          controller: function (committees) {
            this.committees = committees;
          },
          resolve: {
            committees: [
              'CommitteesService',
              function (CommitteesService) {
                return CommitteesService.getCommittees();
              }
            ]
          }
        })
        .state('app.admin.committees.add', {
          url: '/add',
          templateUrl: 'modules/admin/committees/views/form.html',
          controllerAs: 'ctrl',
          controller: 'addCommitteeCtrl',
          resolve: {
            committee: function () {
              return {};
            },
            mks: function (MKsService) {
              return MKsService.getMKs();
            }

          }
        })
        .state('app.admin.committees.edit', {
          url: '/:id/edit',
          templateUrl: 'modules/admin/committees/views/form.html',
          controllerAs: 'ctrl',
          controller: 'editCommitteeCtrl',
          resolve: {
            committee: function ($stateParams, CommitteesService) {
              return CommitteesService.getCommittee($stateParams.id, {include : 'mks'});
            },
            mks: function (MKsService) {
              return MKsService.getMKs();
            }
          }
        })
        .state('app.admin.committees.view', {
          url: '/:id',
          templateUrl: 'modules/admin/committees/views/view.html',
          controllerAs: 'ctrl',
          controller: function (committee) {
            this.committee = committee;
          },
          resolve: {
            post: function ($stateParams, CommitteesService) {
              return CommitteesService.getCommittee($stateParams.id);
            }
          }
        })
        .state('app.admin.committees.delete', {
          url: '/:id/delete',
          template: '',
          controllerAs: 'ctrl',
          controller: function ($state, CommitteesService, committee) {
            CommitteesService.deleteCommittee(committee.id, function () {
              $state.go('^.list');
            }, function () {
              $state.go('^.list');
            });
          },
          resolve: {
            post: function ($stateParams, CommitteesService) {
              return CommitteesService.getCommittee($stateParams.id);
            }
          }
        });
    }
  );

})();
