/**
 * Created by yotam on 03/07/2016.
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
  .directive('backImg', function(){
    return function(scope, element, attrs){
      attrs.$observe('backImg', function(value) {
        element.css(
          { 'background-image': 'url(' + value +')',
            'background-size' : 'cover',
            'background-position' : 'center center'
          }
        );
      });
    };
  });
})();


        