/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.categories-selection')
    .controller('CategoriesSelectionCtrl', function ($scope, CategoriesService, gettextCatalog, CoreService, UserService, AppAuth, UserActions, DialogsService, $location, Constants) {
      var title = gettextCatalog.getString('Subjects Selection');
      CoreService.setMetaTags({
        title: title
      });

      $scope.$on('$viewContentLoaded', function(){
        CoreService.sendGaPageview($location.url(), title);
      });

      var ctrl = this;

      function setSelectedCategories(){
        if (ctrl.sessionData.currentUser && ctrl.sessionData.currentUser.categories){
          ctrl.userCategories = ctrl.sessionData.currentUser.categories;
          for (var i = 0; i < ctrl.userCategories.length; i++){
            var category = _.findWhere(ctrl.categoriesList,{id : ctrl.userCategories[i].id});
            category.following = true;
          }
        }
      }

      function _init() {
        CategoriesService.getCategories().then(function(response){
          ctrl.categoriesList = response;
          setSelectedCategories();
        });
        ctrl.sessionData = AppAuth.getSessionData();
        var params = $location.search();
        if (params.welcome === 'true') {
          ctrl.welcomeMode = true;
        }
        if (AppAuth.hasRole(Constants.USER_ROLES.MK)) {
          $location.path('/');
        }
      }

      ctrl.addRemoveCategory = function(category){
        if (!ctrl.sessionData.currentUser){ // prompt login popup if signed out.
          DialogsService.openDialog('login',{actionIntercepted : true});
          return;
        }
        UserActions.addRemoveCategory(ctrl.sessionData.currentUser.id, category);
      }

      ctrl.saveAndContinue = function() {
        ctrl.sessionData.currentUser.selectedCategories = true;
        UserService.update(ctrl.sessionData.currentUser);
        AppAuth.goHome();
        $location.search('welcome', null);
      }

      _init();

    });


})();
