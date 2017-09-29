(function () {
  'use strict';
  angular
    .module('com.module.users')
    .service('UserService', function ($state, CoreService, User, gettextCatalog, Notification) {

      this.find = function (filters) {
        return User.find({filter: filters}).$promise;
      };

      this.findById = function (id, filters) {
        return User.findById({
          id: id,
          filter: filters
        }).$promise;
      };

      this.upsert = function (user) {
        var userToSave = angular.copy(user);
        userToSave.__deps__ = {};
        userToSave.__deps__.committees = userToSave.committees;
        return User.upsert(userToSave).$promise
      };

      this.update = function (user) {
        var userToSave = angular.copy(user);
        userToSave.__deps__ = {};
        userToSave.__deps__.committees = userToSave.committees;
        return User.prototype$updateAttributes({id: userToSave.id}, userToSave).$promise
      };

      this.delete = function (id, successCb, cancelCb) {
        CoreService.confirm(
          gettextCatalog.getString('Are you sure?'),
          gettextCatalog.getString('Deleting this cannot be undone'),
          function () {
            User.deleteById({id: id}, function () {
              CoreService.toastMessage('success');
              successCb();
            }, function (err) {
              CoreService.toastMessage('error');
              cancelCb();
            });
          },
          function () {
            cancelCb();
          }
        );
      };

      this.addCategory = function (userId, categoryId) {
        return User.categories.link({id: userId, fk: categoryId}, {}).$promise;
      };

      this.removeCategory = function (userId, categoryId) {
        return User.categories.unlink({id: userId, fk: categoryId}, {}).$promise;
      };

      this.followUser = function (userId, userIdToFollow) {
        return User.prototype$__link__followees({id: userId, fk: userIdToFollow}, {}).$promise;
      };

      this.unfollowUser = function (userId, userIdToUnfollow) {
        return User.prototype$__unlink__followees({id: userId, fk: userIdToUnfollow}, {}).$promise;
      };

      this.resetPassword = function (params, data) {
        return User.passwordReset(params, data).$promise;
      };

      this.requestPasswordReset = function (data) {
        return User.requestPasswordReset({}, data).$promise;
      };

      this.getTopCommentingByCategoryByRole = function (params) {
        return User.getTopCommentingByCategoryByRole(params).$promise;
      };

      this.getTopCommentingByRole = function (params) {
        return User.getTopCommentingByRole(params).$promise;
      };

      this.mostUpvotedByCategory = function (params) {
        return User.mostUpvotedByCategory(params).$promise;
      };

      this.isFollowingUser = function (params) {
        return User.isFollowingUser(params).$promise;
      };

      this.votedOnePoll = function (params) {
        return User.votedOnePoll(params).$promise;
      };

      this.sentOneComment = function (params) {
        return User.sentOneComment(params).$promise;
      };

      this.sendInvitation = function (params) {
        return User.requestUserInvitation(params).$promise;
      };
      this.hasRole = function (roles ,role) {
        return _.find(roles,{name : role})

      };
      this.getUserNotifications = function (userId, filters) {
        var filter = {
          where: {
            receiverId: userId
          }
        };
        angular.extend(filter, filters);
        return Notification.getNotificationsByUser({userId : userId , filter: filter || {}}).$promise;
        //return User.notifications({id: userId, filter : filters || {}}).$promise;

      };

      this.getFormFields = function (formType) {
        var form = [
          {
            key: 'email',
            type: 'input',
            templateOptions: {
              label: gettextCatalog.getString('Email'),
              required: true
            }
          },
          {
            key: 'firstName',
            type: 'input',
            templateOptions: {
              label: gettextCatalog.getString('First name'),
              required: true
            }
          },
          {
            key: 'lastName',
            type: 'input',
            templateOptions: {
              label: gettextCatalog.getString('Last name'),
              required: true
            }
          }
        ];
/*        if (formType === 'add') {
          form.push({
            key: 'password',
            type: 'input',
            templateOptions: {
              label: gettextCatalog.getString('Password'),
              required: true
            }
          });
        }*/
        return form;
      };

    });

})();
