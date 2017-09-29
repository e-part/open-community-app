/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.bot')
    .controller('BotCtrl', function ($scope, $location, gettextCatalog, CoreService, CategoriesService, PostsService, $state) {

      var title = gettextCatalog.getString('The Bot');
      CoreService.setMetaTags({
        title: title
      });

      $scope.$on('$viewContentLoaded', function(){
        CoreService.sendGaPageview($location.url(), title);
      });

      var ctrl = this;
      	  ctrl.selectedCategories = [];
      ctrl.$state = $state;

      function _init() {
        CategoriesService.getCategories().then(function(response){
          ctrl.categoriesList = response;
        });
      }

      ctrl.selectCategory = function(c) {
      	var remove = -1;
      	$.each(ctrl.selectedCategories, function(k,v) {
      		if (v.id === c.id) {
      			remove = k;
      		}
      	});
      	if (remove >= 0) {
      		ctrl.selectedCategories.splice(remove,1);
      	} else {
	      	ctrl.selectedCategories.push({
	      		name: c.name,
	      		id: c.id
	      	});
	 	    }
      }

      ctrl.searchPosts = function() {
        var categoriesIds = _.map(ctrl.selectedCategories, 'id');
      	PostsService.getPostsByCategories(JSON.stringify(categoriesIds)).then(function(result) {
      		ctrl.posts = result;
      	});
      }

      _init();
    });
})();
