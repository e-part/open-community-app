(function () {
  'use strict';

  /*jshint sub:true*/
  /*jshint camelcase: false */

  angular
    .module('com.module.users')
    .factory('AppAuth', function ($cookies, User, LoopBackAuth, $http, $q, $rootScope, ENV, $location, $state, Constants,
                                  AuthProvider, $filter) {

      $rootScope.$on('USER_SESSION_CHANGED', function () {
        if (self.hasRole(Constants.USER_ROLES.MK)) {
          self.sessionData.homeState = 'app.public.dashboard'
        } else {
          self.sessionData.homeState = 'app.public.main'
        }
      });
      var self = {

        sessionData: {
          currentUser: null,
          homeState: 'app.public.main',
          sessionRetrievedOnce: false,

        },
        userRequestPromise: null,

        login: function (data, cb) {
          LoopBackAuth.currentUserId = LoopBackAuth.accessTokenId = null;
          User.login({
            include: 'user',
            rememberMe: data.rememberMe
          }, data, function (response) {
            if (response && response.id) {
              LoopBackAuth.currentUserId = response.userId;
              LoopBackAuth.accessTokenId = response.id;
            }
            if (LoopBackAuth.currentUserId === null) {
              delete $cookies['accessToken'];
              LoopBackAuth.accessTokenId = null;
            }
            LoopBackAuth.save();
            if (LoopBackAuth.currentUserId && response && response.user) {
              // get the user full data object from server.
              self.refreshUserSession().then(function(){
                $rootScope.$broadcast('USER_SESSION_CHANGED', self.sessionData);
                cb(self.sessionData.currentUser);
                if (self.shouldRedirectToCategoriesSelection()) {
                  $state.go('app.public.categories-selection', {welcome: true});
                }
              });

            } else {
              cb(null, {});
            }
          }, function (response) {
            console.log('User.login() err', response);
            LoopBackAuth.currentUserId = LoopBackAuth.accessTokenId = null;
            LoopBackAuth.save();
            cb(null, response);
          });
        },

        shouldRedirectToCategoriesSelection: function () {
          return (!self.sessionData.currentUser.selectedCategories && !self.hasRole(Constants.USER_ROLES.MK));
        },

        logout: function (cb) {
          //Destroy the access token.
          User.logout({'access_token': LoopBackAuth.accessTokenId}, function () {
            //Destory both cookies that get created.
            delete $cookies['access_token'];
            delete $cookies['accessToken'];
            //Perform the Passport Logout
            $http.post(ENV.apiUrl + 'auth/logout');
            self.goHome();

            //$location.path("/");
          });
          self.sessionData.currentUser = null;
          $rootScope.$broadcast('USER_SESSION_CHANGED', self.sessionData);

          if (cb){
            cb();
          }
        },

        requestCurrentUser: function () {
          if (self.userRequestPromise) { // already requesting user session.
            return self.userRequestPromise;
          }
          if (self.sessionData.currentUser
          // || self.sessionRetrievedOnce (TODO fix this - It creates a problem when redirecting from third-party authentication)
          ) { // already requesting user session.
            return $q.when(self.sessionData.currentUser);
          }

          var deferred = $q.defer();
          User.getCurrent(function (response) {
            self.sessionData.currentUser = response;
            $rootScope.$broadcast('USER_SESSION_CHANGED', self.sessionData);
            console.log("session: ", self.sessionData);
            deferred.resolve(response);
            self.userRequestPromise = null;
            self.sessionData.sessionRetrievedOnce = true;
          }, function (err) {
            self.sessionData.currentUser = null;
            $rootScope.$broadcast('USER_SESSION_CHANGED', self.sessionData);
            deferred.resolve(null);
            self.userRequestPromise = null;
            self.sessionData.sessionRetrievedOnce = true;
          });
          self.userRequestPromise = deferred.promise;
          return deferred.promise;
        },

        requireUserRole: function (role) {
          var deferred = $q.defer();
          self.requestCurrentUser().then(function (user) {
            if (self.hasRole(role)) {
              deferred.resolve(user);
            } else {
              $location.path('/');
            }
          });
          return deferred.promise;

        },

        requireUserSession: function (noRedirect) {
          var deferred = $q.defer();
          self.requestCurrentUser().then(function (user) {
            if (user) {
              deferred.resolve(user);
            } else {
              if (!noRedirect){
                $location.path('/');
              }
            }
          });
          return deferred.promise;
        },

        refreshUserSession: function () {
          var deferred = $q.defer();
          User.getCurrent(function (response) {
            self.sessionData.currentUser = response;
            deferred.resolve(response);

          }, function (err) {
            self.sessionData.currentUser = null;
            deferred.reject(err);
          });
          return deferred.promise;
        },

        getCurrentUser: function () {
          return self.sessionData.currentUser;
        },

        getSessionData: function () {
          return self.sessionData;
        },

        setSocialUser: function (accessToken, userId) {
          // TODO instead of sending back the accessToken directly, We can
          // make a request here with another session token
          // which can only be used once and will retrieve the accessToken.
          LoopBackAuth.rememberMe = true;
          LoopBackAuth.currentUserId = userId;
          LoopBackAuth.accessTokenId = accessToken;
          LoopBackAuth.save();

        },

        setCurrentUser: function (user) {
          self.sessionData.currentUser = user;
        },

        verifyRole: function (role) {
          return self.requireUserRole(role).then(function (result) {
            if (!result) {
              return false;
            } else {
              return true;
            }
          });
        },

        hasRole: function (role,user) {
          var user = user || self.sessionData.currentUser;
          if (user && user.roles && _.findWhere(user.roles, {name: role})) {
            return true;
          } else {
            return false;
          }

        },

        goHome: function () {
          $state.go(self.sessionData.homeState || '/');
        },

        getProviders : function () {
          var deferred = $q.defer();
          AuthProvider.find(function (result) {
            result = _.filter(result, function(obj){
              return obj.name && obj.name.indexOf("mobile") < 0; // filter out providers that belong to mobile API.
            });
            result = _.map(result, function(obj){
              obj.text = $filter('capitalize')(obj.provider);
              return obj;
            });
            deferred.resolve(result);
          });
          return deferred.promise;
        }

      };

      return self;
    });

})();
