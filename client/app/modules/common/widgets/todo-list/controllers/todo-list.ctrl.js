/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.common')
    .controller('TodoListCtrl', function ($scope, $state, UserService,gettextCatalog, $q) {
      var ctrl = this;
          ctrl.user = $scope.user;

      function _pollVoted() {
        return UserService.votedOnePoll({userId: ctrl.user.id}).then(function(res) {
          var todo = _.find(ctrl.todos,{key : "user_voted"});
          todo.done = res.voted;
          return res.voted;
        });
      }

      function _sentComment() {
        return UserService.sentOneComment({userId: ctrl.user.id}).then(function(res) {
          var todo = _.find(ctrl.todos,{key : "user_commented"});
          todo.done = res.commented;
          return res.commented;
        });
      }
      function _checkIfAllTodosCompleted(){
        var allTododsCompleted = true;
        for (var i = 0; i < ctrl.todos.length; i++ ){
          if (!ctrl.todos[i].done) {
            allTododsCompleted = false;
          }
        }
        ctrl.allTododsCompleted = allTododsCompleted;

      }

      function _hasEnglishLetters(str) {
        var matchedPosition = str.search(/[a-zA-Z]/i);
        if (matchedPosition !== -1) {
          return true;
        }
        return false;
      }

      function _init() {
        ctrl.allTododsCompleted = true;
        ctrl.todos = [
          {
            item: gettextCatalog.getString('Upload Profile Picture'),
            link: 'app.public.user-settings',
            done: ctrl.user.imageUrl
          },
          {
            item: gettextCatalog.getString('Follow 3 Subjects'),
            link: 'app.public.categories-selection',
            done: ctrl.user.selectedCategories
          },
          {
            item: gettextCatalog.getString('Fill Your Hometown'),
            link: 'app.public.user-settings',
            done: ctrl.user.city
          },
          {
            key: "user_commented",
            item: gettextCatalog.getString('Participate in a Discussion'),
            link: '#',
            done: false
          },
          {
            key: "user_voted",
            item: gettextCatalog.getString('Vote in a Poll'),
            link: '#',
            done: false
          }
        ];
        // make async requests to test user's actions history for todos list.
        $q.all([_pollVoted(),_sentComment()]).then(_checkIfAllTodosCompleted);

      }
      _init();

    });


})();
