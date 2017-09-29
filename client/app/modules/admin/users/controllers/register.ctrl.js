(function () {
  'use strict';
  /**
   * @ngdoc function
   * @name com.module.users.controller:RegisterCtrl
   * @description Login Controller
   * @requires $scope
   * @requires $routeParams
   * @requires $location
   * Controller for Register Page
   **/
  angular
    .module('com.module.users')
    .controller('RegisterCtrl', function ($scope, $routeParams, $location, $filter, CoreService, User,
                                          AppAuth, gettextCatalog, $uibModalInstance, DialogsService, MessagesService, AuthProvider) {
      AppAuth.getProviders().then(function(result){
        $scope.authProviders = _.filter(result, function(provider){
          if (provider.name.indexOf('digital-town') === -1){
            return true;
          }
          return false;
        });
        
      });
      $scope.registration = {
        firstName: '',
        lastName: '',
        email: '',
        newPassword: ''
      };

      $scope.schema = [
        {
          label: '',
          property: 'firstName',
          placeholder: gettextCatalog.getString('First Name'),
          type: 'text',
          attr: {
            ngMinlength: 2,
            required: true,
            ariaLabelledby: gettextCatalog.getString('First Name')

            // autocomplete: 'off',
          },
          msgs: {
            minlength: false
          }
        }, {
          label: '',
          property: 'lastName',
          placeholder: gettextCatalog.getString('Last Name'),
          type: 'text',
          attr: {
            ngMinlength: 2,
            required: true,
            ariaLabelledby: gettextCatalog.getString('Last Name')
          },
/*          msgs: {
            minlength: gettextCatalog.getString(
              'Needs to have at least 2 characters')
          }*/
        }, {
          label: '',
          property: 'email',
          placeholder: gettextCatalog.getString('Email'),
          type: 'email',


          // help: gettextCatalog.getString(
          //   'Don\'t worry we won\'t spam your inbox'),
          attr: {
            required: true,
            ngMinlength: 4,
            ariaLabelledby: gettextCatalog.getString('Email')
          },
          msgs: {
            //required: gettextCatalog.getString('You need an email address'),
            email: gettextCatalog.getString('Email address needs to be valid'),
          }
        }, {
          label: '',
          property: 'newPassword',
          placeholder: gettextCatalog.getString('Password'),
          type: 'password',
          attr: {
            required: true,
            ngMinlength: 6,
            ariaLabelledby: gettextCatalog.getString('Password')
          }
        }, {
          label: '',
          property: 'confirmPassword',
          placeholder: gettextCatalog.getString('Confirm Password'),
          type: 'password',
          attr: {
            confirmPassword: 'registration.newPassword',
            required: true,
            ngMinlength: 6,
            // autocomplete: 'off',
          },
          msgs: {
            match: gettextCatalog.getString(
              'Your passwords need to match')
          }
        }];

      $scope.options = {
        validation: {
          enabled: true,
          showMessages: false
        },
        layout: {
          type: 'basic',
          labelSize: 3,
          inputSize: 9
        }
      };

      $scope.confirmPassword = '';

      $scope.register = function () {

        $scope.registration.username = $scope.registration.email;
        delete $scope.registration.confirmPassword;
        $scope.registration.password = $scope.registration.newPassword;
        $scope.user = User.save($scope.registration,
          function () {
            AppAuth.login($scope.registration, function () {
              // success
              $uibModalInstance.close();
            }, function (res) {
              // error
              $uibModalInstance.close();
            });

          },
          function (res) {
            $scope.formErrorMsg = MessagesService.getErrors(res);
          }
        );
      };

      $scope.login = function () {
        $uibModalInstance.close();
        DialogsService.openDialog('login', function () {
          $('#connectButton').click();
        });
      };

      $scope.socialLogin = function(provider) {
        window.location = CoreService.env.apiHost + provider.authPath;
      };
    })
    .directive('confirmPassword',
      function () {
        return {
          restrict: 'A',
          require: 'ngModel',
          link: function (scope, element, attrs, ngModel) {
            var validate = function (viewValue) {
              var password = scope.$eval(attrs.confirmPassword);
              ngModel.$setValidity('match', ngModel.$isEmpty(viewValue) ||
                viewValue === password);
              return viewValue;
            };
            ngModel.$parsers.push(validate);
            scope.$watch(attrs.confirmPassword, function () {
              validate(ngModel.$viewValue);
            });
          }
        };
      }
    );

})();
