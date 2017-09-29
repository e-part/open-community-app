(function () {
  'use strict';
  angular
    .module('com.module.categories')
    .service('CategoriesService', function (CoreService, Category, gettextCatalog) {

      this.getCategories = function (filters) {
        var filter = filters || { order: 'name ASC' };
        return Category.find({
          filter: filter
        }).$promise;
      };
      

      this.getCategory = function (id, filterObj) {
        var filter = filterObj || {};
        return Category.findById({
            id: id,
            filter: filter
          }
        ).$promise;

      };
      this.getCategoryByParams = function (filterObj) {
        var filter = filterObj || {};

        return Category.findOne({
            filter: filter
          }
        ).$promise;

      };

      this.upsertCategory = function (category) {
        return Category.upsert(category).$promise
          .then(function () {
            CoreService.toastMessage('success');
          })
          .catch(function (err) {
              CoreService.toastMessage('error');
            }
          );
      };

      this.deleteCategory = function (id, successCb, cancelCb) {
        CoreService.confirm(
          gettextCatalog.getString('Are you sure?'),
          gettextCatalog.getString('Deleting this cannot be undone'),
          function () {
            Category.deleteById({id: id}, function () {
              CoreService.toastMessage('success');
              successCb();
            }, function (err) {
              CoreService.toastMessage('error');
              cancelCb();
            });
          },
          function () {
            cancelCb();
          }
        );
      };

      this.getFormFields = function () {
        return [
          {
            key: 'name',
            type: 'input',
            templateOptions: {
              label: gettextCatalog.getString('Name'),
              required: true
            }
          },
          {
            key: 'slug',
            type: 'input',
            templateOptions: {
              label: gettextCatalog.getString('Slug'),
              required: false
            }
          }
        ];
      };

    });

})();
