'use strict';

var status = require('http-status');
var _ = require("lodash");

module.exports = function (Tag) {
  /**
   * @description creates all given tags. If the tag content,
   */
  Tag.remoteMethod('createAll', {
    accepts: [
      {arg: 'tags', type: 'array', required: true},


    ],
    returns: {root: true, type: 'array'},
    http: {
      verb: 'post',
      path: '/createAll'
    }
  });

  // verify that a user can update only his own notifications.
/*
  Notification.beforeRemote('bulkUpdateByUser', verifyOwner );
*/

  Tag.createAll = function (tags, cb) {
    Tag.create(tags, function(err, result) {
      return cb(err, result);
    });


  };

};
