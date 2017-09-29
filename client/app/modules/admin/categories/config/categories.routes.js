(function () {
  'use strict';
  angular
    .module('com.module.categories')
    .config(function ($stateProvider) {
      $stateProvider
        .state('app.admin.categories', {
          abstract: true,
          url: '/categories',
          templateUrl: 'modules/admin/categories/views/main.html'
        })
        .state('app.admin.categories.list', {
          url: '',
          templateUrl: 'modules/admin/categories/views/list.html',
          controllerAs: 'ctrl',
          controller: function (categories) {
            this.categories = categories;
          },
          resolve: {
            categories: [
              'CategoriesService',
              function (CategoriesService) {
                return CategoriesService.getCategories();
              }
            ]
          }
        })
        .state('app.admin.categories.add', {
          url: '/add',
          templateUrl: 'modules/admin/categories/views/form.html',
          controllerAs: 'ctrl',
          controller: 'addCategoryCtrl',
          resolve: {
            category: function () {
              return {};
            }
          }
        })
        .state('app.admin.categories.edit', {
          url: '/:id/edit',
          templateUrl: 'modules/admin/categories/views/form.html',
          controllerAs: 'ctrl',
          controller: 'editCategoryCtrl',
          resolve: {
            category: function ($stateParams, CategoriesService) {
              return CategoriesService.getCategory($stateParams.id);
            }
          }
        })
        .state('app.admin.categories.view', {
          url: '/:id',
          templateUrl: 'modules/admin/categories/views/view.html',
          controllerAs: 'ctrl',
          controller: function (category) {
            this.category = category;
          },
          resolve: {
            post: function ($stateParams, CategoriesService) {
              return CategoriesService.getCategory($stateParams.id);
            }
          }
        })
        .state('app.admin.categories.delete', {
          url: '/:id/delete',
          template: '',
          controllerAs: 'ctrl',
          controller: function ($state, CategoriesService, category) {
            CategoriesService.deleteCategory(category.id, function () {
              $state.go('^.list');
            }, function () {
              $state.go('^.list');
            });
          },
          resolve: {
            post: function ($stateParams, CategoriesService) {
              return CategoriesService.getCategory($stateParams.id);
            }
          }
        });
    }
  );

})();
