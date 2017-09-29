(function () {
  'use strict';
  angular
    .module('com.module.dashboard')
    .service('DashboardService', function (DashboardSetting) {

      // this.getUISettings = function(user) {
      //     User.dashboardSettings({id : user.id}).$promise.then(function(response){
      //       if (response.settings){
      //         var dashboardSettings = JSON.parse(response.settings);
      //         return dashboardSettings;
      //       }
      //     });
      // }

      this.setUISettings = function (user, dbSettings) {
        var settingsToSave = angular.copy(dbSettings);
        if (!settingsToSave.ownerId) {
          settingsToSave.ownerId = user.id;
        }
        settingsToSave.settings = JSON.stringify(settingsToSave.settings);
        return DashboardSetting.upsert(settingsToSave).$promise
      }

    });

})();
