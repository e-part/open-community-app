/**
 * Created by yotam on 06/12/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.core')
    .service('ListService', function ($q, $http, ENV) {

      function _objHasValue(obj, value, propsToSearchBy) {
        if (value) {
          for (var i = 0; i < propsToSearchBy.length; i++) {
            var prop = propsToSearchBy[i];
            if (obj.hasOwnProperty(prop) && obj[prop]) {
              if (("" + obj[prop]).toLowerCase().indexOf(("" + value).toLowerCase()) > -1) {
                return true;
              }
            }
          }
          return false;
        } else {
          return true;
        }

      }

      function _updateFilteredItems(key, filteredItems,allFilteredItems, listData) {
        allFilteredItems[key] = filteredItems;
        var filters = [listData];
        for (var key in allFilteredItems){
          filters.push(allFilteredItems[key] || listData );
        }
        return _.intersection.apply(this, filters );
      }

      this.filterChanged = function (key, value, propsToSearchBy , predicate, listData, allFilteredItems) {
        var filters = {
          dateGt : function (item) {
            return new Date(item[propsToSearchBy]) >= new Date(value);
          },
          dateLt : function (item) {
            return new Date(item[propsToSearchBy]) <= new Date(value);
          }
        };
        var filterFunction = function (item) {
          return _objHasValue(item, value, propsToSearchBy);
        };
        if (predicate){
          filterFunction = filters[predicate]
        }
        var filteredItems = _.filter(listData, filterFunction);
        return _updateFilteredItems(key, filteredItems, allFilteredItems, listData);
      };

    });

})();
