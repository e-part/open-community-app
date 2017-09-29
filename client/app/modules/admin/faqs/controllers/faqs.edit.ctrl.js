/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.faqs')
    .controller('editFaqCtrl', function ($state, FaqsService, faq) {
      this.faq = faq;

      this.formFields = FaqsService.getFormFields();
      this.formOptions = {};

      this.submit = function () {
        FaqsService.upsertFaq(this.faq).then(function() {
          //$state.go('^.list');
        });
      };
    });


})();
