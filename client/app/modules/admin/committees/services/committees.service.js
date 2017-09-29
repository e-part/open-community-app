(function () {
  'use strict';
  angular
    .module('com.module.committees')
    .service('CommitteesService', function (CoreService, Committee, gettextCatalog) {

      this.getCommittees = function () {
        return Committee.find({
          filter: {
            order: 'name ASC',
          }
        }).$promise;
      };

      this.getCommittee = function (id, filters) {
        return Committee.findById({
            id: id,
            filter: filters
          }
        ).$promise;
      };

      this.upsertCommittee = function (committee) {
        committee.__deps__ = {};
        committee.__deps__.mks = committee.mks;
        return Committee.upsert(committee).$promise
          .then(function () {
            CoreService.toastMessage('success');
          })
          .catch(function (err) {
              CoreService.toastMessage('error');
            }
          );
      };

      this.deleteCommittee = function (id, successCb, cancelCb) {
        CoreService.confirm(
          gettextCatalog.getString('Are you sure?'),
          gettextCatalog.getString('Deleting this cannot be undone'),
          function () {
            Committee.deleteById({id: id}, function () {
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
              required: true,
              onChange : function(value,obj,scope,extra){
                scope.model.slug = value.replace(/\s/g, '-');
              }
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
