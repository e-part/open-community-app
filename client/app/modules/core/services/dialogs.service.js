/**
 * Created by yotam on 10/07/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.core')
    .service('DialogsService', function ($uibModal, $location, appCache) {
      /**
       * Docs of Angular-ui 1.3.3:
       * http://angular-ui.github.io/bootstrap/versioned-docs/1.3.3/#/modal
       * */
      var dialogsMap = {
        login : {
          templateUrl: 'modules/admin/users/views/login.html',
          controller: 'LoginCtrl',
          optionsMapper : function(options){ // this function receives custom options and maps it to the relevant dialog options.
            if (options.actionIntercepted){
              return {
                resolve : {
                  showIntermediateTitle : function(){
                    return true;
                  }
                }
              };
            }
            if (options.goToLoginWithEmail) {
              return {
                resolve : {
                  goToLoginWithEmail : function(){
                    return true;
                  }
                }
              };
            }
            return {};
          },
          resolve : {
            showIntermediateTitle : [function(){ // do not delete this, to change the dialog title, override this function
              return false;
            }],
            goToLoginWithEmail : [function(){
              return false;
            }],
          }
        },
        register : {
          templateUrl: 'modules/admin/users/views/register.html',
          controller: 'RegisterCtrl'
        },
        uploadMedia : {
          templateUrl: 'modules/admin/files/views/upload.html',
          controller: 'FilesUploadCtrl',
          resolve : { // This fires up before controller loads and templates rendered
            files: ['FileService',function (FileService) {
              return FileService.find();
            }]
          }
        }
      };

      this.openDialog = function (dialogName, options) {
        var options = options || {};
        appCache.set('lastPath',$location.path());
        var dialog = dialogsMap[dialogName];
        var overrideWithOptions = angular.extend({},options);
        if (dialog.optionsMapper){
          overrideWithOptions = angular.extend(overrideWithOptions, dialog.optionsMapper(options));
        }

        return $uibModal.open({
          animation: true,
          templateUrl : dialog.templateUrl,
          controller : dialog.controller,
          resolve : angular.extend({},dialog.resolve,overrideWithOptions.resolve),
          size : overrideWithOptions.size || 'sm',
          controllerAs : 'ctrl',
          windowTemplateUrl : 'modules/core/views/elements/dialog-template.html'
        });
      };

    });

})();
