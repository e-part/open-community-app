(function () {
  'use strict';
  angular
    .module('com.module.core')
    .service('CoreService', function (ENV, SweetAlert, $rootScope, gettextCatalog, CLIENT_CONFIG) {

      var service = this;

      function _init() {
        service.env = ENV;
        service.env.apiUrl = CLIENT_CONFIG.apiHost + CLIENT_CONFIG.apiPrefix + "/";
        service.env.apiHost = CLIENT_CONFIG.apiHost;
        service.config = {
          S3_PREFIX : '.s3.amazonaws.com/',
          BRAND: CLIENT_CONFIG.name || 'Smart.London',
          DEFAULT_POST_IMG: '/images/clients/' + (CLIENT_CONFIG.className || '') + '/default-post-pic.jpg',
          DEFAULT_DISCUSSION_IMG: '/images/clients/' + (CLIENT_CONFIG.className || '') + '/default-discussion-pic.jpg',
          DEFAULT_PROJECT_IMG: '/images/clients/' + (CLIENT_CONFIG.className || '') + '/default-project-pic.jpg',
          TIMEZONE_OFFSET: CLIENT_CONFIG.attributes.TIMEZONE_OFFSET || 0, // TODO this should be changed according to DST.
          SITE_URL: CLIENT_CONFIG.attributes.SITE_URL
        };

      }

      service.setMetaTags = function(meta){
        $rootScope.metaTags              = {}
        $rootScope.metaTags.title        = meta.title || gettextCatalog.getString(this.config.BRAND);
        $rootScope.metaTags.description  = meta.description || gettextCatalog.getString('Make Your Impact');
        $rootScope.metaTags.image        = meta.image || '../../images/facebook-share-image.png'; // #TODO - CHANGE THIS TO FULL PATH
        $rootScope.metaTags.url          = meta.url || window.location.host;
        $rootScope.metaTags.type         = meta.type || 'website';
      };

      service.alert = function (title, text) {
        SweetAlert.swal(title, text);
      };

      service.alertSuccess = function (title, text) {
        SweetAlert.swal(title, text, 'success');
      };

      service.alertError = function (title, text) {
        SweetAlert.swal(title, text, 'error');
      };

      service.alertWarning = function (title, text) {
        SweetAlert.swal(title, text, 'warning');
      };

      service.alertInfo = function (title, text) {
        SweetAlert.swal(title, text, 'info');
      };

      service.confirm = function (title, text, successCb, cancelCb) {
        var config = {
          title: title,
          text: text,
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#006DBD',
          confirmButtonText: gettextCatalog.getString('OK'),
          cancelButtonText: gettextCatalog.getString('Cancel'),
          imageSize : "0x0"
        };
        this._swal(config, successCb, cancelCb);
      };

      service._swal = function (config, successCb, cancelCb) {
        SweetAlert.swal(config,
          function (confirmed) {
            if (confirmed) {
              successCb();
            } else {
              cancelCb();
            }
          });
      };

      service.toastMessage = function (type, text) {
        var defaultMessages = {
          success :  {
            text : gettextCatalog.getString('Data was saved successfully.')
          },
          error : {
            text: gettextCatalog.getString('Error saving data.')
          }
        };
        type = type || 'success';
        text = text || defaultMessages[type].text;
        $('#NOTIFICATIONS').removeClass().addClass(type).text(text).fadeIn(500).delay(3000).fadeOut(500);
      };

      service.isMobile = function() {
        // TODO - refactor this function into a better way to check mobile devices
        if ($(window).width() < 1200) {
          return true;
        }
        return false;
      };

      service.generateShareUrl = function(platform,data) {
        // data.url = encodeURI(data.url);
        switch(platform) {
          case 'facebook':
            return 'https://www.facebook.com/sharer/sharer.php?u='+data.url+'t='+data.text;
            break;
          case 'twitter':
            return 'http://twitter.com/share?text='+data.text+'&hashtags='+data.hashTags.toString()+'&url='+data.url;
            break;
        }
      };

      service.getParameterFromUrl = function(param) {
        var match = RegExp('[?&]' + param + '=([^&]*)').exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
      };

      service.sendGaPageview = function(url, title) {
        ga = ga || function(){};
        ga('send', 'pageview', { page: url, title: title});
      };

      service.sendGaEvent = function(category,action) {
        ga = ga || function(){};
        ga('send', 'event', category, action);
      };

      service.calculatePollPercentage = function(poll) {
        var answersLength = poll.answers.length,
            totalVotes = 0;

        for(var v in poll.answers) {
          totalVotes += poll.answers[v].votes;
        }
        for (var key in poll.answers) {
            var votes = poll.answers[key].votes;
            if (!votes && !totalVotes) {
              poll.answers[key].percentage = 100 / poll.answers.length;
            } else if (!votes) {
              poll.answers[key].percentage = 0;
            } else {
              poll.answers[key].percentage = ((votes / totalVotes) * 100).toFixed(1);
            }
            poll.answers[key].columnHeight = poll.answers[key].percentage;
            if (poll.answers[key].columnHeight > 50) {poll.answers[key].columnHeight = 50;}
        }

        return poll;
      }

      _init();

    });

})();
