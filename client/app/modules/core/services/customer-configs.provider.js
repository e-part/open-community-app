/**
 * Created by yotam on 20/06/2017.
 */

(function () {
  'use strict';
  angular
    .module('com.module.core')
    .provider('dbService', function dbServiceProvider(ENV) {

    //the provider recipe for services require you specify a $get function
    this.$get = ['dbhost',function dbServiceFactory(dbhost){
      // return the factory as a provider
      // that is available during the configuration phase
      return new DbService(dbhost);
    }]

  });
})();
