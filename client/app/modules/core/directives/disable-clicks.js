/**
 * Created by yotam on 11/09/2016.
 */
(function () {
  'use strict';
  /**
   * @ngdoc directive
   * @name com.module.core.directive:backImg
   * @description
   * # backImg - Adds ability to use dynamic css background image.
   */
  angular.module('com.module.core')
    .directive('disableClicks', function(){
      return {
        restrict: 'A',
        scope: {
          disabled: '=disableClicks'
        },
        link: function(scope, element, attrs) {
          element.bind('click', function(event) {
            if(scope.disabled) {
              event.preventDefault();
            }
          });
        }
      };
    });
})();
