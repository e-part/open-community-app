/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.mks')
    .controller('addMKCtrl', function ($state, MKsService, UserService, mk) {
      this.mk = mk;
      this.formFields = MKsService.getFormFields();
      this.formOptions = {};

      this.submit = function () {
        UserService.upsert(this.mk).then(function () {
          $state.go('^.list');
        });
      };
    });


})();
