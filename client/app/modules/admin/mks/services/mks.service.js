(function () {
  'use strict';
  angular
    .module('com.module.mks')
    .service('MKsService', function (CoreService, User, gettextCatalog, $q, Constants) {

      this.getMKs = function () {
        var deferred = $q.defer();
        User.getUsersByRole({role: Constants.USER_ROLES.MK}, function (list) {
          deferred.resolve(list);
        }, function (err) {
          deferred.reject(err);
        });
        return deferred.promise;
      };
      this.getMK = function (id) {
        return User.findById({
            id: id
          }
        ).$promise;
      };

      this.getFormFields = function () {
        return [
          {
            key: 'firstName',
            type: 'input',
            templateOptions: {
              label: gettextCatalog.getString('firstName'),
              required: true
            }
          },
          {
            key: 'lastName',
            type: 'input',
            templateOptions: {
              label: gettextCatalog.getString('lastName'),
              required: true
            }
          },
          {
            key: 'email',
            type: 'input',
            templateOptions: {
              label: gettextCatalog.getString('email'),
              required: true
            }
          }
        ];
      };
    });

})();
