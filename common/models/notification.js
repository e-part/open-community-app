'use strict';

var USER_ROLES = require("./../../server/services/enums").USER_ROLES;
var EVENTS = require("./../../server/services/enums").EVENTS;
var loopback = require('loopback');
var _ = require("lodash");
var status = require('http-status');

module.exports = function (Notification) {


  function getIdsToEnrich(notifications, dataEnrichmentMap) {
    var idsToEnrich = {};
    for (var i = 0; i < notifications.length; i++) {

      // for each of the notification type's enrichment entities:
      // get the set of ids to enrich
      var notification = notifications[i];
      var notficationType = notification.name;
      var fieldsToExpand = dataEnrichmentMap[notficationType];
      for (var key in fieldsToExpand) {
        if (fieldsToExpand.hasOwnProperty(key)) {
          var id = _.get(notification.meta, fieldsToExpand[key].field);
          if (!idsToEnrich[notficationType + "_" +key]) {
            idsToEnrich[notficationType + "_" +key] = new Set();
          }
          idsToEnrich[notficationType + "_" +key].add(id);
        }
      }
    }
    return idsToEnrich;
  }

  function prepareEnrichmentRequestsArray(dataEnrichmentMap, idsToEnrich) {
    var requestsArr = []
    for (var dataEnrichmentType in dataEnrichmentMap) {
      var fieldsToExpand = dataEnrichmentMap[dataEnrichmentType];
      for (var key in fieldsToExpand) {
        if (fieldsToExpand.hasOwnProperty(key) && idsToEnrich[dataEnrichmentType + "_" + key]) {
          var ids = Array.from(idsToEnrich[dataEnrichmentType + "_" + key]);
          if (ids && ids.length) {
            requestsArr.push(getDataByIds(ids, fieldsToExpand[key].model, key, null, dataEnrichmentType));
          }
        }
      }
    }
    return requestsArr;
  }

  function getDataByIds(ids, model, dataEnrichmentField, fieldToQuery, dataEnrichmentType) {
    var model = Notification.app.models[model];
    var whereClause = {};
    whereClause[fieldToQuery || 'id'] = {inq: ids};
    return new Promise(function (resolve, reject) {
      model.find({where: whereClause}, function (err, results) {
        if (err) {
          return reject(err);
        } else {
          return resolve({dataEnrichmentType : dataEnrichmentType, dataEnrichmentField: dataEnrichmentField, results: results});
        }
      });
    });

  }

  function enrichDataObj(objToEnrich, fieldsToExpand, additionalDataSets, dataEnrichmentType) {
    for (var key in fieldsToExpand) {
      if (fieldsToExpand.hasOwnProperty(key)) {
        // get the dataSet relevant to the required key
        var additionalDataSet = _.find(additionalDataSets, {dataEnrichmentType : dataEnrichmentType, dataEnrichmentField: key}).results;
        var id = _.get(objToEnrich.meta, fieldsToExpand[key].field);
        objToEnrich[key] = _.find(additionalDataSet, {id: id});
      }
    }
    return objToEnrich;
  }

  function verifyOwner(ctx, modelInstance, next) {
    var lbCtx = require('loopback-context').getCurrentContext();
    var currentUser = lbCtx && lbCtx.get('currentUser');
    var authError = new Error();
    authError.status = 401;
    authError.message = 'Authorization Required';
    authError.code = 'AUTHORIZATION_REQUIRED';

    if (currentUser) {
      if (_.find(currentUser.__data.roles, {name: USER_ROLES.ADMIN.value})) { // user is admin - allow access
        return next();
      }
      // verify that creatorId is same as current user.
      if (ctx.req.params && ctx.req.params.userId) {
        if (parseInt(ctx.req.params.userId) === parseInt(currentUser.id)) {
          return next();
        }
      }
      next(authError);

    } else {
      next(authError);
    }
    return next();

  }

  var dataEnrichmentMap = {
    POST_COMMENT_REPLY: {
      replyingUser: {
        model: 'user',
        field: 'comment.creatorId'
      },
      post: {
        model: 'Post',
        field: 'comment.postId'
      }
    },
    POST_PUBLISHED: {
      post: {
        model: 'Post',
        field: 'post_data.id'
      }
    },
    USER_FOLLOWED: {
      follower: {
        model: 'user',
        field: 'follower_data.id'
      }
    }
  };

  Notification.remoteMethod('getNotificationsByUser', {
    accepts: [
      {arg: 'userId', type: 'string', required: true},
      {arg: 'filter', type: 'object', 'http': {source: 'query'}}
    ],
    returns: {root: true, type: 'array'},
    http: {
      verb: 'get',
      path: '/byuser/:userId'
    }
  });

  Notification.remoteMethod('bulkUpdateByUser', {
    accepts: [
      {arg: 'userId', type: 'number', required: true},
      {arg: 'updateProps', type: 'object', required: true},
      {arg: 'where', type: 'object' }

    ],
    returns: {root: true, type: 'object'},
    http: {
      verb: 'post',
      path: '/bulkUpdate/byuser/:userId'
    }
  });

  // verify that a user can access only his own notifications.
  Notification.beforeRemote('getNotificationsByUser', verifyOwner );
  // verify that a user can update only his own notifications.
  Notification.beforeRemote('bulkUpdateByUser', verifyOwner );
  /**
   * Enrich data returned with objects related to the relevant notification.
   */
  Notification.afterRemote('getNotificationsByUser', function (ctx, modelInstance, next) {

    if (ctx.result) {
      var notifications = ctx.result;

      var idsToEnrich = getIdsToEnrich(notifications, dataEnrichmentMap);

      // prepare data requests for each notification type
      var requestsArr = prepareEnrichmentRequestsArray(dataEnrichmentMap, idsToEnrich);
      // get data for all of the enrichment sets.
      Promise.all(requestsArr).then(function (results) {
        // when all the requests are returned - enrich the result objects with the additional data.
        for (var i = 0; i < notifications.length; i++) {
          var notification = notifications[i];
          var notificationType = notification.name;
          var fieldsToExpand = dataEnrichmentMap[notificationType];
          notification = enrichDataObj(notification, fieldsToExpand, results, notificationType);
        }
        return next();
      }, function (err) {
        // error enriching data
        console.error("Error enriching data: " + JSON.stringify(err));
        return next(err);
      });

    } else { // no results to enrich
      return next();
    }

  });

  // get user's notifications.
  Notification.getNotificationsByUser = function (userId, filter, cb) {
    var filters = _.assign(filter || {}, {where: {receiverId: userId}});
    Notification.find(filters, function (err, notifications) {
      cb(err, notifications);
    });

  };

  Notification.bulkUpdateByUser = function (userId, updateProps, filter, cb) {
    var whereProps = {receiverId: userId};
    if (updateProps.status === "READ"){ // TODO - this should be generalized to allow multiple batch options.
      whereProps.status = "UNREAD";
      var dataToUpdate = {status : "READ"};
    } else {
      var badInputError = new Error();
      badInputError.status = 400;
      badInputError.message = 'Bad Input';
      badInputError.code = 'BAD_INPUT';
      return cb(badInputError);
    }
    // var dataToUpdate = {method : "WEB"};
    Notification.updateAll(whereProps, dataToUpdate, function(err, info) {
      cb(err, info);
    });

  };



  /*
   Employee.updateAll({managerId: 'x001'}, {managerId: 'x002'}, function(err, info) {
   ...
   });
   */

};
