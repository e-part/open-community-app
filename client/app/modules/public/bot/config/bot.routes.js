(function () {
  'use strict';
  angular
    .module('com.module.bot')
    .config(function ($stateProvider) {
        $stateProvider
          .state('app.public.bot', {
            url: 'bot',
            templateUrl: 'modules/public/bot/views/bot.html',
            controller: 'BotCtrl',
            controllerAs: 'ctrl',
            resolve: {

            }
          });

      }
    );
})();
