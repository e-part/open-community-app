/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.common')
    .controller('UserPostsListCtrl', function ($scope, CategoriesService, gettextCatalog, Constants, $rootScope) {
      var ctrl = this;

      ctrl.posts = $scope.posts;
      ctrl.POST_STATUSES = Constants.POST_STATUSES;
      ctrl.freeTextFilterValue = null;
      ctrl.texts = {
        analysis_page : gettextCatalog.getString('Analysis Page'),
      };
      ctrl.statuses = {
        DRAFT: gettextCatalog.getString('Draft'),
        PUBLISHED: gettextCatalog.getString('Published')
      };
      ctrl.migrationStatuses = {
        NORMAL: gettextCatalog.getString('ePart Edited Posts'),
        KNESSET_MIGRATED: gettextCatalog.getString('Knesset Posts')
      };
      ctrl.filters = {
        status: {
          data: [
            {value: '', text: gettextCatalog.getString('All Statuses') },
            {value: Constants.POST_STATUSES.DRAFT, text: gettextCatalog.getString('Draft')},
            {value: Constants.POST_STATUSES.PUBLISHED, text: gettextCatalog.getString('Published')}
          ]
        },
        migrationStatus: {
          data: [
            {value: '', text: gettextCatalog.getString('All (ePart + Knesset)') },
            {value: Constants.POST_MIGRATION_STATUS.NORMAL, text: gettextCatalog.getString('ePart Edited Posts')},
            {value: Constants.POST_MIGRATION_STATUS.KNESSET_MIGRATED, text: gettextCatalog.getString('Knesset Posts') },
          ]
        }
      };
      ctrl.allFilteredItems = {};
      ctrl.filters.status.selected = ctrl.filters.status.data[0];
      ctrl.filters.migrationStatus.selected = ctrl.filters.migrationStatus.data[0];

      ctrl.gridOptions = {

        enableFiltering: false,
        enableRowSelection: false,
        paginationPageSize: 25,
        paginationPageSizes: [10, 25, 50],
        enableColumnResizing: true,

        columnDefs: [
          {
            field: 'id',
            displayName : gettextCatalog.getString('ID'),
            width: '10%'
          },
          {
            field: 'title',
            displayName : gettextCatalog.getString('Discussion Title'),
            width: '55%',
            cellTemplate: '<div class="ui-grid-cell-contents" ng-class="col.colIndex()">' +
            '<a ui-sref="^.edit({id: row.entity.id})" ng-class="{\'add-line-through\' : row.entity.isCancelled}">{{row.entity.title}}</a>' +
            '</div>',
            sort: {
              direction: 'asc',
              priority: 1
            },
            cellClass: $rootScope.locale.direction === 'rtl' ? 'rtl-text' : ''
          },
          {
            field: 'status',
            displayName : gettextCatalog.getString('Status'),
            width: '20%',
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.statuses[row.entity.status]}}</div>',

            sort: {
              direction: 'asc',
              priority: 0
            }
          },
          {
            field: 'endDate',
            displayName : gettextCatalog.getString('End Date'),
            width: '15%',
            cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.endDate | formatLocaleDate:true}}</div>',


          },

        ],
        data: ctrl.posts,
        onRegisterApi: function (gridApi) {
          ctrl.gridApi = gridApi;
        }
      };
      ctrl.gridOptions.appScopeProvider = ctrl;

      function _objHasValue(obj, value, propsToSearchBy) {
        if (value) {
          for (var i = 0; i < propsToSearchBy.length; i++) {
            var prop = propsToSearchBy[i];
            if (obj.hasOwnProperty(prop)) {
              if (("" + obj[prop]).indexOf(value) > -1) {
                return true;
              }
            }
          }
          return false;
        } else {
          return true;
        }

      }
      function updateFilteredItems(key, filteredItems) {
        ctrl.allFilteredItems[key] = filteredItems;
        var filters = [ctrl.posts];
        for (var key in ctrl.allFilteredItems){
          filters.push(ctrl.allFilteredItems[key] || ctrl.posts );
        }
        return _.intersection.apply(this, filters );
      }
      ctrl.filterChanged = function (key, value, propsToSearchBy , predicate) {
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
        var filteredItems = _.filter(ctrl.posts, filterFunction);
        ctrl.gridOptions.data = updateFilteredItems(key, filteredItems);

      };


    });


})();
