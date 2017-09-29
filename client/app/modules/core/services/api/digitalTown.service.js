(function () {
  'use strict';
  angular
    .module('com.module.core')
    .service('DigitalTownService', function (ENV, $http, DigitalTown) {

      this.searchSite = function(text){
        return DigitalTown.DTsearch({text: text}).$promise;
      };

    });

})();
