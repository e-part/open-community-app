(function () {
  'use strict';
  /**
   * @ngdoc overview
   * @name loopbackApp
   * @description
   * # loopbackApp
   *
   * Main module of the application.
   */
  angular
    .module('loopbackApp', [
      'angular-loading-bar',
      'angular.filter',
      'angularBootstrapNavTree',
      'angularFileUpload',
      'btford.markdown',
      'oitozero.ngSweetAlert',
      'config',
      'formly',
      'formlyBootstrap',
      'lbServices',
      'monospaced.elastic',
      'ngAria',
      'ngCookies',
      'ngResource',
      'ngRoute',
      'ngSanitize',
      'ngTouch',
      'ngScrollbars',
      'ui.bootstrap',
      'ui.codemirror',
      'ui.gravatar',
      'ui.grid',
      'ui.grid.selection',
      'ui.grid.pagination',
      'ui.grid.autoResize',
      'ui.grid.resizeColumns',
      'ui.router',
      'gettext',
      'angular-underscore/filters',
      'schemaForm',
      'ui.select',
      'ui.tinymce',
      'cloudinary',
      'ngFileUpload',
      'nvd3',
      'dndLists',
      'ngTagCloud',
      'tmh.dynamicLocale',

      //common
      'com.module.core',
      'com.module.common',

      // admin
      'com.module.browser',
      'com.module.posts',
      'com.module.users',
      'com.module.categories',
      'com.module.mks',
      'com.module.committees',
      'com.module.settings',
      'com.module.faqs',
      'com.module.files',


      //public
      'com.module.main',
      'com.module.dashboard',
      'com.module.category',
      'com.module.categories-selection',
      'com.module.user-settings',
      'com.module.post',
      'com.module.welcome',
      'com.module.profile',
      'com.module.privacy',
      'com.module.terms',
      'com.module.qa',
      'com.module.reset-password',
      'com.module.bot',
      'com.module.subscriptions',
      'com.module.user-posts'
    ])

    .run(function ($rootScope, $cookies, gettextCatalog, AppAuth, ENV, i18nService, $document, tmhDynamicLocale, $window) {

      console.log("Running with config: ", JSON.stringify(ENV));
      var DEFAULT_LANGUAGE = ENV.uiLanguage || 'en_US';

      $rootScope.locales = {
        'en_US': {
          lang: 'en_US',
          country: 'US',
          name: gettextCatalog.getString('English'),
          direction: 'ltr',
          angularLocale: 'en-us'
        },
        'he_IL': {
          lang: 'he_IL',
          country: 'IL',
          name: gettextCatalog.getString('Hebrew'),
          direction: 'rtl',
          angularLocale: 'he-il'

        }

      };

      $rootScope.accessibilityCfg = {};

      $rootScope.switchLocale = function (locale) {
        console.log('switchLocale');
        var lang = locale;
        $cookies.put('lang', lang);
        $window.location.reload();
      };

      $rootScope.setLocale = function (locale) {
        console.log('setLocale');

        // var lang = $cookies.lang || DEFAULT_LANGUAGE || navigator.language || navigator.userLanguage;
        var lang = locale || $cookies.get('lang') || DEFAULT_LANGUAGE;
        var prevLocale = angular.copy($rootScope.locale);
        $rootScope.locale = $rootScope.locales[lang];
        $cookies.put('lang', lang);
        if (angular.isUndefined($rootScope.locale)) {
          $rootScope.locale = $rootScope.locales[lang];
          if (angular.isUndefined($rootScope.locale)) {
            $rootScope.locale = $rootScope.locales[DEFAULT_LANGUAGE];
          }
        }

        gettextCatalog.setCurrentLanguage($rootScope.locale.lang);
        tmhDynamicLocale.set($rootScope.locale.angularLocale);
        $rootScope.appDirection = $rootScope.locale.direction;
        i18nService.setCurrentLang($rootScope.locale.angularLocale); // set locale for ui-grid
        $document.find('body').attr('dir', $rootScope.locale.direction);
        if (prevLocale) {
          $document.find('body').removeClass('app-' + prevLocale.direction);
        }
        $document.find('body').addClass('app-' + $rootScope.locale.direction);
      };

    })

    .config(['$animateProvider', '$compileProvider', 'ENV', 'tmhDynamicLocaleProvider','LoopBackResourceProvider','CLIENT_CONFIG',
      function ($animateProvider, $compileProvider, ENV, tmhDynamicLocaleProvider, LoopBackResourceProvider, CLIENT_CONFIG ) {
        // Allows for disabling angular-animate on a specific element. (simply add ng-animate-disabled class)
        // For more info: http://davidchin.me/blog/disable-nganimate-for-selected-elements/

        $animateProvider.classNameFilter(/^(?:(?!ng-animate-disabled).)*$/);
        tmhDynamicLocaleProvider.localeLocationPattern('vendor/i18n/angular-locale-{{locale}}.js');
        LoopBackResourceProvider.setUrlBase(CLIENT_CONFIG.apiHost + CLIENT_CONFIG.apiPrefix);

        if (ENV.name === 'production') {
          $compileProvider.debugInfoEnabled(false);
        }

      }])
    .config(['cloudinaryProvider','CLIENT_CONFIG', function (cloudinaryProvider, CLIENT_CONFIG) {
      cloudinaryProvider
        .set("cloud_name", CLIENT_CONFIG.services.cloudinary.cloud_name)
        .set("upload_preset", CLIENT_CONFIG.services.cloudinary.upload_preset)
        .set("secure", true);
    }])
    .run(function (formlyConfig, $rootScope) {
      /*
       ngModelAttrs stuff
       */
      var ngModelAttrs = {};

      function camelize(string) {
        string = string.replace(/[\-_\s]+(.)?/g, function (match, chr) {
          return chr ? chr.toUpperCase() : '';
        });
        // Ensure 1st char is always lowercase
        return string.replace(/^([A-Z])/, function (match, chr) {
          return chr ? chr.toLowerCase() : '';
        });
      }

      $rootScope.setLocale();

      /*
       timepicker
       */
      ngModelAttrs = {};
      // attributes
      angular.forEach([
        'meridians',
        'readonly-input',
        'mousewheel',
        'arrowkeys'
      ], function (attr) {
        ngModelAttrs[camelize(attr)] = {attribute: attr};
      });

      // bindings
      angular.forEach([
        'hour-step',
        'minute-step',
        'show-meridian'
      ], function (binding) {
        ngModelAttrs[camelize(binding)] = {bound: binding};
      });

      formlyConfig.setType({
        name: 'timepicker',
        template: '<timepicker ng-model="model[options.key]"></timepicker>',
        wrapper: [
          'bootstrapLabel',
          'bootstrapHasError'
        ],
        defaultOptions: {
          ngModelAttrs: ngModelAttrs,
          templateOptions: {
            timepickerOptions: {}
          }
        }
      });

      formlyConfig.setType({
        name: 'datepicker',
        template: '<datepicker ng-model="model[options.key]" ></datepicker>',
        wrapper: [
          'bootstrapLabel',
          'bootstrapHasError'
        ],
        defaultOptions: {
          ngModelAttrs: ngModelAttrs,
          templateOptions: {
            datepickerOptions: {}
          }
        }
      });
    })


})();
