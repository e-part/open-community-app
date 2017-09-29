/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.categories')
    .controller('editCategoryCtrl', function ($state, CategoriesService, category ) {
      this.category = category;

      this.formFields = CategoriesService.getFormFields();
      this.formOptions = {};

      this.submit = function () {
        // TODO bulk update committee members,categories and committees.
        CategoriesService.upsertCategory(this.category).then(function () {
          $state.go('^.list');
        });
      };
    });


})();
