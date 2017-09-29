(function () {
  'use strict';
  angular
    .module('com.module.faqs')
    .config(function ($stateProvider) {
      $stateProvider
        .state('app.admin.faqs', {
          abstract: true,
          url: '/faqs',
          templateUrl: 'modules/admin/faqs/views/main.html'
        })
        .state('app.admin.faqs.list', {
          url: '',
          templateUrl: 'modules/admin/faqs/views/list.html',
          controllerAs: 'ctrl',
          controller: function (faqs) {
            this.faqs = faqs;
          },
          resolve: {
            faqs: [
              'FaqsService',
              function (FaqsService) {
                return FaqsService.getFaqs();
              }
            ]
          }
        })
        .state('app.admin.faqs.add', {
          url: '/add',
          templateUrl: 'modules/admin/faqs/views/form.html',
          controllerAs: 'ctrl',
          controller: 'addFaqCtrl',
          resolve: {
            faq: function () {
              return {};
            }
          }
        })
        .state('app.admin.faqs.edit', {
          url: '/:id/edit',
          templateUrl: 'modules/admin/faqs/views/form.html',
          controllerAs: 'ctrl',
          controller: 'editFaqCtrl',
          resolve: {
            faq: function ($stateParams, FaqsService) {
              return FaqsService.findById($stateParams.id);
            }
          }
        })
        .state('app.admin.faqs.view', {
          url: '/:id',
          templateUrl: 'modules/admin/faqs/views/view.html',
          controllerAs: 'ctrl',
          controller: function (faq) {
            this.faq = faq;
          },
          resolve: {
            faq: function ($stateParams, FaqsService) {
              return FaqsService.getFaq($stateParams.id);
            }
          }
        })
        .state('app.admin.faqs.delete', {
          url: '/:id/delete',
          template: '',
          controllerAs: 'ctrl',
          controller: function ($state, FaqsService, faq) {
            FaqsService.deleteFaq(faq.id, function () {
              $state.go('^.list');
            }, function () {
              $state.go('^.list');
            });
          },
          resolve: {
            faq: function ($stateParams, FaqsService) {
              return FaqsService.getFaq($stateParams.id);
            }
          }
        });
    }
  );

})();
