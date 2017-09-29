/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.user-settings')
    .controller('UserSettingsCtrl', function ($scope, FileUploader, FileService, UserSettingsService, gettextCatalog, cloudinary,
                                              CoreService, UserService, AppAuth, user, MessagesService, Constants, $location) {

      var title = gettextCatalog.getString('User Settings');
      CoreService.setMetaTags({
        title: title
      });
      var notificationTypes = {
        POST_COMMENT_REPLY: gettextCatalog.getString('Someone replied to one of your comment.'),
        POST_PUBLISHED: gettextCatalog.getString('New discussion added to one of your subjects.'),
        USER_FOLLOWED: gettextCatalog.getString('You have a new follower.'),
      };

      $scope.$on('$viewContentLoaded', function(){
        CoreService.sendGaPageview($location.url(), title);
      });

      var ctrl = this;
      ctrl.user = angular.copy(user);

      ctrl.formOptions = {};
      ctrl.formFields = UserSettingsService.getFormFields();
      ctrl.apiUrl = CoreService.env.apiUrl;
      ctrl.bucket = CoreService.env.bucket;
      ctrl.uploading = false;

      ctrl.citiesInput = {
        autocompleteWrapper: $('.cities-autocomplete-list'),
        mathedCities: [],
        activeClass: 'active'
      }
      ctrl.formErrorMsg = null;
      ctrl.userFullName = ctrl.user.firstName + ' ' + ctrl.user.lastName;

      function _init() {
        UserSettingsService.getSubscriptions(ctrl.user.id).then(function (subscriptions) {
          ctrl.subscriptions = UserSettingsService.formatSubscriptions(subscriptions, notificationTypes);
        });
      }

      ctrl.uploadSuccessCallback = function(data) {
        ctrl.uploading = false;
        ctrl.user.imageUrl = data.secure_url;
        $('#image_user_settings').find('img').attr('src',cloudinary.url(data.public_id, {height: 160, width: 160, crop: 'thumb', gravity: 'faces'}));
      }

      ctrl.uploadProgressCallback = function(data) {
        ctrl.uploading = true;
        ctrl.uploadeProgress = data;
      }

      ctrl.openImageUpload = function() {
        angular.element('.upload_button').triggerHandler('click');
      }

      // ctrl.uploader = new FileUploader({
      //   url: ctrl.apiUrl + 'containers/' + ctrl.bucket + '/upload',
      //   formData: [
      //     {
      //       key: 'value'
      //     }
      //   ],
      //   onAfterAddingFile: function (item) {
      //     var fileExtension = '.' + item.file.name.split('.').pop();
      //     item.file.name = Math.random().toString(36).substring(7) + new Date().getTime() + fileExtension;
      //     item.upload();
      //     ctrl.uploading = true;
      //   },
      //   onCompleteItem: function (data) {
      //     ctrl.user.imageUrl =  'https://' + CoreService.env.bucket + CoreService.config.S3_PREFIX + data.file.name;
      //     ctrl.uploading = false;
      //     ctrl.uploader.queue = [];
      //   }
      // });

      ctrl.submit = function () {
        UserSettingsService.updateUser(ctrl.user, ctrl.subscriptions).then(function () {
          // callback after update user
          //AppAuth.refreshUserSession();
          ctrl.formErrorMsg = null;
          AppAuth.refreshUserSession();
          CoreService.toastMessage(
            'success',
            gettextCatalog.getString('User details saved.')
          );
        }, function (res) {
          ctrl.formErrorMsg = MessagesService.getErrors(res);
        });
      };

      this.filterCities = function (city, e) {
        if ([40, 38, 13].indexOf(e.keyCode) < 0) {
          ctrl.filteringCities = true;
          ctrl.citiesInput.mathedCities = UserSettingsService.getMatchedCities(city);
          ctrl.citiesInput.autocompleteWrapper.find('.' + ctrl.citiesInput.activeClass).removeClass(ctrl.citiesInput.activeClass);
        }
      }

      this.navigateCities = function (e) {
        var acWrapper = ctrl.citiesInput.autocompleteWrapper,
          acActiveClass = ctrl.citiesInput.activeClass;

        switch (e.keyCode) {
          case 40:
            if (acWrapper.find('.' + acActiveClass).length) {
              acWrapper.find('.' + acActiveClass).removeClass(acActiveClass).next().addClass(acActiveClass);
            } else {
              acWrapper.children().first().addClass(acActiveClass);
            }
            break;
          case 38:
            if (acWrapper.find('.' + acActiveClass).length) {
              acWrapper.find('.' + acActiveClass).removeClass(acActiveClass).prev().addClass(acActiveClass);
            } else {
              acWrapper.children().last().addClass(acActiveClass);
            }
            break;
          case 13:
            e.preventDefault();
            ctrl.user.city = acWrapper.find('.' + acActiveClass).text();
            ctrl.filteringCities = false;
            break;
        }
      }

      _init();

    });

})();
