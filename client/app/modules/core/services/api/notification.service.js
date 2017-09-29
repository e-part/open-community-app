(function () {
  'use strict';
  angular
    .module('com.module.core')
    .service('NotificationService', function ($state, CoreService, User, gettextCatalog, Notification) {



      this.bulkUpdateByUser = function (userId, updateProps, filters) {
/*        var filter = {
          where: {
            receiverId: userId
          }
        };*/
        //angular.extend({}, filters);
        return Notification.bulkUpdateByUser({userId : userId}, { updateProps : updateProps}).$promise;
        //return User.notifications({id: userId, filter : filters || {}}).$promise;

      };

    });

})();
