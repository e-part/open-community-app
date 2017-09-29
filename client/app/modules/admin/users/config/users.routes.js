(function () {
  'use strict';
  angular
    .module('com.module.users')
    .config(function ($stateProvider) {
      $stateProvider
        .state('login', {
          url: '/login',
          template: '<login></login>',
          controller: 'LoginCtrl'
        })
        .state('register', {
          url: '/register',
          template: '<register></register>',
          controller: 'RegisterCtrl'
        })
        .state('app.admin.users', {
          abstract: true,
          url: '/users',
          templateUrl: 'modules/admin/users/views/main.html'
        })
        .state('app.admin.users.list', {
          url: '',
          templateUrl: 'modules/admin/users/views/list.html',
          controllerAs: 'ctrl',
          resolve: {
            users: function (UserService) {
              console.log('users');
              return UserService.find({include : 'roles'});
            }
          },
          controller: function (users, gettextCatalog, ListService, Constants, $rootScope ) {
            var ctrl = this;


            function formatServerData(users){
              for (var i = 0;i < users.length; i++){
                users[i].rolesStr = ctrl.getPrettyRoles(users[i].roles);
              }
              return users;
            }

            ctrl.getPrettyRoles = function(roles){
              return _.map(roles, function(role){
                return ctrl.USER_ROLES_TEXTS[role.name];
              });
            };

            ctrl.filterChanged = function (key, value, propsToSearchBy , predicate) {
              ctrl.gridOptions.data = ListService.filterChanged( key, value, propsToSearchBy , predicate, ctrl.users, ctrl.allFilteredItems)
            };
            ctrl.init = function(){
              var cellClass = $rootScope.locale.direction === 'rtl' ? 'rtl-text' : ''

              ctrl.USER_ROLES_TEXTS = {
                user : gettextCatalog.getString('User'),
                admin : gettextCatalog.getString('Administrator'),
                mk : gettextCatalog.getString('Decision Maker')
              };
              ctrl.users = formatServerData(users);
              ctrl.ListService = ListService;
              ctrl.filters = {
                role: {
                  data: [
                    {value: Constants.USER_ROLES.USER, text: gettextCatalog.getString('User') },
                    {value: Constants.USER_ROLES.ADMIN, text: gettextCatalog.getString('Administrator')},
                    {value: Constants.USER_ROLES.MK, text: gettextCatalog.getString('Decision Maker')}
                  ]
                },
              };
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
                    cellTemplate: '<div class="ui-grid-cell-contents" ng-class="col.colIndex()">' +
                    '<a ui-sref="^.edit({id: row.entity.id})">{{row.entity.id}} </a>' +
                    '</div>',
                    width: '10%'
                  },
                  {
                    field: 'firstName',
                    displayName : gettextCatalog.getString('First Name'),
                    cellTemplate: '<div class="ui-grid-cell-contents" ng-class="col.colIndex()">' +
                    '<a ui-sref="^.edit({id: row.entity.id})">{{row.entity.firstName}} </a>' +
                    '</div>',
                    width: '20%',
                    cellClass: cellClass
                  },
                  {
                    field: 'lastName',
                    displayName : gettextCatalog.getString('Last Name'),
                    cellTemplate: '<div class="ui-grid-cell-contents" ng-class="col.colIndex()">' +
                    '<a ui-sref="^.edit({id: row.entity.id})">{{row.entity.lastName}} </a>' +
                    '</div>',
                    width: '20%',
                    cellClass: cellClass
                  },
                  {
                    field: 'email',
                    displayName : gettextCatalog.getString('Email'),
                    width: '20%',
                    cellClass: cellClass
                  },
                  {
                    field: 'roles',
                    displayName : gettextCatalog.getString('Roles'),
                    cellTemplate: '<div class="ui-grid-cell-contents" ng-class="col.colIndex()">' +
                    '{{grid.appScope.getPrettyRoles(row.entity.roles).toString()}}' +
                    '</div>',
                    width: '30%',
                    cellClass: cellClass
                  },
                ],
                data: ctrl.users,
                onRegisterApi: function (gridApi) {
                  ctrl.gridApi = gridApi;
                }
              };
              ctrl.gridOptions.appScopeProvider = ctrl;
              ctrl.allFilteredItems = {};

            };
            ctrl.init();


            }
        })
        .state('app.admin.users.add', {
          url: '/add',
          templateUrl: 'modules/admin/users/views/form.html',
          controllerAs: 'ctrl',
          resolve: {
            user: function () {
              return {};
            },
            committees: function (CommitteesService) {
              return CommitteesService.getCommittees();
            },
          },
          controller: function ($state, UserService, user, Constants, gettextCatalog, committees, CoreService) {
            var ctrl = this;
            ctrl.USER_ROLES_TEXTS = {
              user : gettextCatalog.getString('User'),
              admin : gettextCatalog.getString('Administrator'),
              mk : gettextCatalog.getString('Decision Maker')
            };
            ctrl.user = user;
            ctrl.formFields = UserService.getFormFields('add');
            ctrl.formOptions = {};
            ctrl.roles = _.map(Constants.USER_ROLES, function(value, key){
              return {name : value};
            });
            ctrl.committees = committees;
            ctrl.selectedRoles = [];
            ctrl.UserService = UserService;
            function makePass(chars) {
              var text = "";
              var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

              for( var i=0; i < chars; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));

              return text;
            }

            ctrl.submit = function () {
              ctrl.user.password = makePass(8);
              ctrl.user.emailVerified = true;
              ctrl.user.rolesToAssign = _.map(angular.copy(ctrl.selectedRoles), function(obj){
                return {name : obj.name};
              });
              UserService.upsert(ctrl.user).then(function (user) {
                CoreService.toastMessage('success', gettextCatalog.getString('User Was Created.'));
                $state.go('^.edit',{id : user.id});
              }).catch(function (err) {
                console.log(err);
              });
            };
          }
        })
        .state('app.admin.users.edit', {
          url: '/edit/:id',
          templateUrl: 'modules/admin/users/views/form.html',
          controllerAs: 'ctrl',
          resolve: {
            user: function ($stateParams, UserService) {
              return UserService.findById($stateParams.id);
            },
            committees: function (CommitteesService) {
              return CommitteesService.getCommittees();
            },
          },
          controller: function ($state, UserService, user, Constants, CoreService, gettextCatalog, committees) {
            var ctrl = this;
            ctrl.USER_ROLES_TEXTS = {
              user : gettextCatalog.getString('User'),
              admin : gettextCatalog.getString('Administrator'),
              mk : gettextCatalog.getString('Decision Maker')
            };
            function _init(){
              ctrl.user = user;
              ctrl.formFields = UserService.getFormFields('edit');
              ctrl.formOptions = {};
              ctrl.inEditMode = true;
              ctrl.UserService = UserService;
              ctrl.roles = _.map(Constants.USER_ROLES, function(value, key){
                return {name : value};
              });
              ctrl.committees = committees;
              ctrl.selectedRoles = _.map(angular.copy(ctrl.user.roles), function(obj){
                return {name : obj.name};
              });
            }

            ctrl.submit = function () {
              ctrl.user.rolesToAssign = _.map(angular.copy(ctrl.selectedRoles), function(obj){
                return {name : obj.name};
              });
              UserService.update(ctrl.user).then(function () {
                CoreService.toastMessage('success', gettextCatalog.getString('User details saved.'));
              });
            };

            ctrl.sendInvitation = function() {
              UserService.sendInvitation({email : ctrl.user.email}).then(function () {
                CoreService.toastMessage('success', gettextCatalog.getString('Invitation Sent'));
              }, function(){
                CoreService.toastMessage('error', gettextCatalog.getString('Invitation wasn\'t sent.'));
              });
            }

            _init();
          }

        })
        .state('app.admin.users.view', {
          url: '/view/:id',
          templateUrl: 'modules/admin/users/views/view.html',
          controllerAs: 'ctrl',
          controller: function (user) {
            this.user = user;
          },
          resolve: {
            user: function ($stateParams, UserService) {
              return UserService.findById($stateParams.id);
            }
          }
        })
        .state('app.admin.users.delete', {
          url: '/:id/delete',
          template: '',
          controller: function ($stateParams, $state, UserService) {
            UserService.delete($stateParams.id, function () {
              $state.go('^.list');
            }, function () {
              $state.go('^.list');
            });
          }
        })
        .state('app.admin.users.profile', {
          url: '/profile',
          templateUrl: 'modules/admin/users/views/profile.html',
          controllerAs: 'ctrl',
          controller: function ($state, UserService, user) {
            this.user = user;
            this.formFields = UserService.getFormFields('edit');
            this.formOptions = {};
            this.submit = function () {
              UserService.update(this.user).then(function () {
                $state.go('^.profile');
              });
            };
          },
          resolve: {
            user: function (User) {
              return User.getCurrent(function (user) {
                return user;
              }, function (err) {
                console.log(err);
              });
            }
          }
        });
    });

})();
