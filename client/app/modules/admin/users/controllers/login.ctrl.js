(function () {
  'use strict';
  /**
   * @ngdoc function
   * @name com.module.users.controller:LoginCtrl
   * @description Login Controller
   * @requires $scope
   * @requires $routeParams
   * @requires $location
   * Contrller for Login Page
   **/
  angular
    .module('com.module.users')
    .controller('LoginCtrl', function ($scope, $routeParams, $location, CoreService, User, AppAuth, AuthProvider,
                                       gettextCatalog, $uibModalInstance, DialogsService, $state, MessagesService,
                                       showIntermediateTitle,goToLoginWithEmail, CLIENT_CONFIG, Constants) {

      var TWO_WEEKS = 1000 * 60 * 60 * 24 * 7 * 2;

      $scope.credentials = {
        ttl: TWO_WEEKS,
        rememberMe: true
      };
      $scope.formErrorMsg = null;
      $scope.showIntermediateTitle = showIntermediateTitle;
      $scope.goToLoginWithEmail = goToLoginWithEmail;
      $scope.masterClientType = CLIENT_CONFIG.attributes.MASTER_CLIENT_TYPE;
      $scope.showSocialLogins = ($scope.masterClientType === Constants.MASTER_CLIENT_TYPES.EPART);

      if (CoreService.env.name === 'development') {
        $scope.credentials.email = 'admin@admin.com';
        $scope.credentials.password = 'admin';
      }

      $scope.schema = [
        {
          label: '',
          property: 'email',
          placeholder: gettextCatalog.getString('Email'),
          type: 'email',
          attr: {
            required: true,
            ngMinlength: 4,
            ariaLabelledby: gettextCatalog.getString('Email')
            // autocomplete: 'off',
          },
          msgs: {
            required: gettextCatalog.getString('You need an email address'),
            email: gettextCatalog.getString('Email address needs to be valid'),
            valid: gettextCatalog.getString('Nice email address!')
          }
        },
        {
          label: '',
          property: 'password',
          placeholder: gettextCatalog.getString('Password'),
          type: 'password',
          attr: {
            required: true,
            ariaLabelledby: gettextCatalog.getString('Password')

            // autocomplete: 'off',
          }
        }//,
        // {
        //   property: 'rememberMe',
        //   label: gettextCatalog.getString('Stay signed in'),
        //   type: 'checkbox'
        // }
      ];

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

      $scope.socialLogin = function (provider) {
        window.location = CoreService.env.apiHost + provider.authPath;
      };


      AppAuth.getProviders().then(function(result){
        if ($scope.showSocialLogins){
          $scope.authProviders = _.filter(result, function(provider){
            if (provider.name.indexOf('digital-town') === -1){
              return true;
            }
            return false;
          });
        } else {
          $scope.authProviders = [_.findWhere(result, {name : 'digital-town-' + window.location.hostname})];
        }

      });

      $scope.login = function () {
        AppAuth.login($scope.credentials, function(user, err){
          // success
          if (!err){
            $scope.formErrorMsg = null;
            $uibModalInstance.close();
            console.log(err);
          } else {
            $scope.formErrorMsg = MessagesService.getErrors(err);
          }
        }, function(){
          // error
        });

      };

      $scope.register = function () {
        $uibModalInstance.close();
        DialogsService.openDialog('register');

      };

      $scope.requestResetPassword = function () {
        $uibModalInstance.close();
        $state.go('app.public.reset-password', {mode:'reset_request'}, {reload: true});
      };
    });

})();
