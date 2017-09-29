(function () {
  'use strict';
  angular
    .module('com.module.faqs')
    .service('FaqsService', function (CoreService, Faq, gettextCatalog) {

      this.getFaqs = function () {
        return Faq.find({
          filter: {
            order: 'id ASC',
          }
        }).$promise;
      };

      this.findById = function (id, filters) {
        return Faq.findById({
            id: id,
            filter: filters
          }
        ).$promise;
      };

      this.upsertFaq = function (faq) {
        return Faq.upsert(faq).$promise
          .then(function () {
            CoreService.toastMessage('success');
          })
          .catch(function (err) {
              CoreService.toastMessage('error');
            }
          );
      };

      this.deleteFaq = function (id, successCb, cancelCb) {
        CoreService.confirm(
          gettextCatalog.getString('Are you sure?'),
          gettextCatalog.getString('Deleting this cannot be undone'),
          function () {
            Faq.deleteById({id: id}, function () {
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
            key: 'question',
            type: 'textarea',
            templateOptions: {
              label: gettextCatalog.getString('Question'),
              required: true
            }
          },
          {
            key: 'answer',
            type: 'textarea',
            templateOptions: {
              label: gettextCatalog.getString('Answer'),
              required: false
            }
          }
        ];
      };

    });

})();
