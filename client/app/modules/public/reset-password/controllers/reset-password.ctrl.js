/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.reset-password')
    .controller('ResetPasswordCtrl', function ($scope, UserService, $location, CoreService, gettextCatalog, $stateParams, AppAuth) {
      CoreService.setMetaTags({
        title: gettextCatalog.getString('Reset Password')
      });
      var ctrl = this;
      ctrl.MODES = {
        RESET_REQUEST: 'reset_request',
        RESET_REQUEST_SENT: 'reset_request_sent',
        RESET: 'reset',
        RESET_COMPLETE: 'reset_complete'
      };
      function _init() {
        ctrl.resetData = {};
        ctrl.resetRequestData = {};
        var urlParams = angular.copy($location.search());
        if (urlParams.mk_invitation){
          $stateParams.mode = 'reset_request';
          ctrl.isMkResetMode = true;
        }
        ctrl.mode = $stateParams.mode || ctrl.MODES.RESET;
        ctrl.access_token = urlParams.at;
        ctrl.isInvitationMode = (urlParams.invitation === 'true');
        ctrl.email = urlParams.email;

        if (ctrl.mode === ctrl.MODES.RESET && !ctrl.access_token){
          AppAuth.goHome();
        } else {
          // logout if there is a user session.
          //AppAuth.logout();
        }
        $location.search('');

/*        $scope.$watch(function(){ return $location.search() }, function(){
          // reaction
          ctrl.mode = urlParams.mode;
        });*/

      }
      ctrl.resetPassword = function(){
        UserService.resetPassword({access_token :  ctrl.access_token}, ctrl.resetData).then(function(){
          // success
          ctrl.mode = ctrl.MODES.RESET_COMPLETE;
          var credentials = {
            email : ctrl.email,
            password : ctrl.resetData.password
          };
          if (credentials.email && credentials.password){
            ctrl.loggingIn = true;
            AppAuth.login(credentials, function(user, err){
              // success
              AppAuth.goHome();
            }, function(){
              // error
              ctrl.loggingIn = false;

            });
          }


        }, function(err){
          // error
          console.log("Error: " , err);
          CoreService.toastMessage('error',
            gettextCatalog.getString('Could not reset the password, please repeat the process.')
          );
        })
      };
      
      ctrl.requestResetPassword = function(){
        UserService.requestPasswordReset( ctrl.resetRequestData).then(function(){
          // success
          ctrl.mode = ctrl.MODES.RESET_REQUEST_SENT;
        }, function(err){
          // error
          console.log("Error: " , err);
          CoreService.toastMessage('error', gettextCatalog.getString('Please make sure you have entered a valid mail.'));
        })
      };

      _init();

    });


})();
