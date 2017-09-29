/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.committees')
    .controller('editCommitteeCtrl', function ($state, CommitteesService, committee, mks ) {
      var ctrl = this;
      ctrl.committee = committee;
      ctrl.mks = mks;

      ctrl.formFields = CommitteesService.getFormFields();
      ctrl.formOptions = {};

      ctrl.submit = function () {
        // TODO bulk update committee members,committees and committees.
        CommitteesService.upsertCommittee(ctrl.committee).then(function () {
        });
      };
    });


})();
