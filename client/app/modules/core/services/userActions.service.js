(function () {
  'use strict';
  angular
    .module('com.module.core')
    .service('UserActions', function (UserService, AppAuth) {

      this.addRemoveCategory = function (user_id, category) {
        if (category.following){
          category.following = false;
          UserService.removeCategory(user_id, category.id).then(
            function(){
            // success - refresh user session
            AppAuth.refreshUserSession();
          },function() {
            // failed - revert the changes
            category.following = true;
          });
        } else {
          category.following = true;
          UserService.addCategory(user_id, category.id).then(
            function(){
            // success - refresh user session
            AppAuth.refreshUserSession();
          },function() {
            // failed - revert the changes
            category.following = false;
          });
        }
      };

    });

})();
