(function () {
  'use strict';
  angular
    .module('com.module.common')
    .factory('PostFormService', function () {

      var PostFormHelper = function(mode, userRole, postType) {
        this.mode = mode;
        this.userRole = userRole;
        //this.postType = postType;
        console.log("instantiate PostFormService:", this);
        this.print = function () {
          console.log("priniting: ", this);
        }
      };

      return PostFormHelper;
    });

})();
