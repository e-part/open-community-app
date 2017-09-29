/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.common')
    .controller('ExportToCalendarCtrl', function ($scope, gettextCatalog, Constants) {
    	var ctrl = this;
    		ctrl.post = $scope.post;
      ctrl.meetingCancelledText = gettextCatalog.getString('Meeting Cancelled');
      ctrl.addToCalendarText = gettextCatalog.getString('Add to Calendar');

		var clientId = '965030261795-l1fbdigdimn8lmbluj5kahqdrh8gchan.apps.googleusercontent.com',
			apiKey = 'AIzaSyD38axB-gpZG44KXer0aeI_eRPHkNF5Hxg',
			scopes = 'https://www.googleapis.com/auth/calendar';

		ctrl.init = function() {
			gapi.client.setApiKey(apiKey);
			gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
		}

		function handleAuthResult(authResult) {
		 	if (authResult.status.signed_in) {
		     	gapi.client.load('calendar', 'v3', function() {
            var textPrefix = gettextCatalog.getString('Knesset meeting:');
            var itemText = textPrefix + " " + (ctrl.post.migrationStatus === Constants.POST_MIGRATION_STATUS.NORMAL ? ctrl.post.title : ctrl.post.officialTitle );
		        	var resource = {
		          		"summary": itemText,
                  "description" : gettextCatalog.getString('This event was added to calendar via ePart.'),
		          		"location": "",
		          		"start": {
		            		"dateTime": ctrl.post.endDate
		         		},
		          		"end": {
		            		"dateTime": ctrl.post.endDate
		          		}
		        	};
			        var request = gapi.client.calendar.events.insert({
			          'calendarId': 'primary',
			          'resource': resource
			        });
			        request.execute(function(resp) {
			        	alert('הדיון נוסף בהצלחה ליומן שלך');
			        });
				});
		  	}
		}
	});
})();
