/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.committees')
    .controller('addCommitteeCtrl', function ($state, CommitteesService, committee, mks) {
      var ctrl = this;
      ctrl.committee = committee;
      ctrl.mks = mks;
      ctrl.formFields = CommitteesService.getFormFields();
      ctrl.formOptions = {};

      ctrl.nameValueChanged = function(){
        console.log("sssdsd");
        //alert('HI!')
      };

      ctrl.submit = function () {
        CommitteesService.upsertCommittee(ctrl.committee).then(function () {
          $state.go('^.list');
        });
      };
    });


})();
