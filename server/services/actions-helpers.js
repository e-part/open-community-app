/**
 * Created by yotam on 25/07/2016.
 */
var _ = require('lodash');
var loopback = require('loopback');
var USER_ROLES = require('./enums').USER_ROLES;
var NOTIFICATION_METHODS = require('./enums').NOTIFICATION_METHODS;
var appConfiguration = require('./app-configs');
var errorsProvider = require('./errors-provider');

function verifyObjId(objId, currentUser) {
  if (!objId || currentUser.id === objId) {
    return true;
  }
  return false;
}

function removeObjects(ParentModel, relationProperty, array, contextOptions) {
  var requests = [];
  for (var i = 0; i < array.length; i++) {
    requests.push(ParentModel[relationProperty].remove(array[i]));
  }
  console.log("removeObjects : removing object ids: " + array);
  return Promise.all(requests);
}

function destroyObjects(ParentModel, relationProperty, array, contextOptions) {
  var requests = [];
  for (var i = 0; i < array.length; i++) {
    requests.push(ParentModel[relationProperty].destroy(array[i], contextOptions));
  }
  console.log("destroyObjects: removing object ids: " + array);
  return Promise.all(requests);
}

function addObjects(ParentModel, relationProperty, array, contextOptions) {
  var requests = [];
  for (var i = 0; i < array.length; i++) {
    (function (index) {
      requests.push(ParentModel[relationProperty].add(array[index], null, contextOptions));
    })(i);
  }
  console.log("addObjects: adding object ids: " + array);
  return Promise.all(requests);
}

function addNewObjects(ParentModel, relationProperty, arrayToCreate, arrayToUpdate, contextOptions) {
  var requests = [];
  for (var i = 0; i < arrayToCreate.length; i++) {
    requests.push(ParentModel[relationProperty].create(arrayToCreate[i], contextOptions));
  }
  for (i = 0; i < arrayToUpdate.length; i++) {
    var index = i;
    (function (index) {
      var promise = ParentModel[relationProperty].findById(arrayToUpdate[index].id, contextOptions).then(function (itemToUpdate) {
        return itemToUpdate.updateAttributes(arrayToUpdate[index], contextOptions);
      });
      requests.push(promise);
    })(index)

  }
  console.log("addNewObjects: adding object items: " + arrayToCreate);
  console.log("addNewObjects: updating object items: " + arrayToUpdate);
  return Promise.all(requests);
}

/**
 *
 * @returns {Promise} - resolved with an object which includes ids to link and ids to unlink from parent model.
 * @param ParentModel
 */
function getValuesToUpdate(ParentModel, relationProperty, relatedItems) {
  return new Promise(function (resolve, reject) {
    // get current items for the model.
    ParentModel['__get__' + relationProperty](true, function (err, existingItems) { // run query with 'true' to avoid cached results.
      if (err) {
        return reject(err);
      }
      // get all ids from the new relatedItems list.
      var idsToAdd = _.map(relatedItems, 'id');
      var existingIds = _.map(existingItems, 'id');
      // get all items that appear in the new relatedItems list and not in the existingItems.
      var idsToRemove = _.difference(existingIds, idsToAdd);
      var idsToUpdate = _.intersection(existingIds, idsToAdd);
      // only get the items that aren't already in the db
      var newItems = _.filter(relatedItems, function (obj) {
        return (existingIds.indexOf(obj.id) < 0)
      });
      var itemsToUpdate = _.filter(relatedItems, function (obj) {
        return (existingIds.indexOf(obj.id) >= 0)
      });
      resolve({
        newItems: newItems,
        itemsToUpdate: itemsToUpdate,
        idsToAdd: idsToAdd,
        idsToRemove: idsToRemove,
        idsToUpdate: idsToUpdate
      });

    });
  });

}

/**
 *
 * @param removeArr - ids to unlink from parent.
 * @param addArr - ids to link to parent.
 * @returns {*}
 */
function updateRelations(ParentModel, relatedModel, updatedValues, contextOptions) {
  var isThroughRelation = ParentModel[relatedModel].add ? true : false;
  var removeArr = updatedValues.idsToRemove;
  var addArr = updatedValues.idsToAdd;
  var newItems = updatedValues.newItems;
  var itemsToUpdate = updatedValues.itemsToUpdate;
  console.log("Ids to remove: " + removeArr);
  console.log("Ids to add: " + addArr);
  if (isThroughRelation) {
    return removeObjects(ParentModel, relatedModel, removeArr, contextOptions).then(function () {
      return addObjects(ParentModel, relatedModel, addArr, contextOptions)
    });
  } else {
    return destroyObjects(ParentModel, relatedModel, removeArr, contextOptions).then(function () {
      return addNewObjects(ParentModel, relatedModel, newItems, itemsToUpdate, contextOptions)
    });
  }

}

function _checkAuth(currentUser, idToVerify, next) {
  var authError = new Error();
  authError.status = 401;
  authError.message = 'Authorization Required';
  authError.code = 'AUTHORIZATION_REQUIRED';
  console.log('in _checkAuth, currentUser.id: ' + (currentUser && currentUser.id));
  if (currentUser) {
    if (_.find(currentUser.__data.roles, {name: USER_ROLES.ADMIN.value})) { // user is admin - allow access
      return next();
    }
    // verify that idToVerify is same as current user.
    if (idToVerify) {
      if (verifyObjId(idToVerify, currentUser)) {
        return next();
      }
    }
  }
  next(authError);

}

var ActionsHelpers = {

  updateRelatedItems: function (ParentModel, relatedModels, next, contextOptions) {
    var promises = [];
    for (var relatedModel in relatedModels) {
      if (relatedModels.hasOwnProperty(relatedModel)) {
        var relatedItems = relatedModels[relatedModel];
        (function (relatedModel, relatedItems) {
          promises.push(getValuesToUpdate(ParentModel, relatedModel, relatedItems).then(function (valuesToUpdate) {
            return updateRelations(ParentModel, relatedModel, valuesToUpdate, contextOptions);
          }));
        })(relatedModel, relatedItems);
      }
    }

    Promise.all(promises).then(function (values) {
      console.log("all dependencies were updated" + JSON.stringify(values)); // [3, 1337, "foo"]
      next();
    }).catch(
      function (reason) {
        console.log('Failed to save related models' + JSON.stringify(reason));
        next();
      });
  },

  handleLinksUpdate: function (ctx, next) {
    if (ctx.instance) {
      if (ctx.instance.__deps__) {
        ActionsHelpers.updateRelatedItems(ctx.instance, ctx.instance.__deps__, next, ctx.options);
      } else {
        next();
      }
    } else {
      if (ctx.data.__deps__) {
        ActionsHelpers.updateRelatedItems(ctx.currentInstance, ctx.data.__deps__, next, ctx.options);
      } else {
        next();
      }
    }

  },

  addCount: function (resource, relation) {
    if (resource[relation]) {
      return resource[relation].count().then(function (count) {
        resource[relation + 'Count'] = count;
      });
    } else {
      return new Promise(function (resolve, reject) {
        resolve();
      });
    }

  },

  verifyOwner: function (idToVerify, next) {
    var lbCtx = require('loopback-context').getCurrentContext();
    var currentUser = lbCtx && lbCtx.get('currentUser');
    var authError = new Error();
    authError.status = 401;
    authError.message = 'Authorization Required';
    authError.code = 'AUTHORIZATION_REQUIRED';
    console.log('in verifyOwner, currentUser.id: ' + (currentUser && currentUser.id));
    if (currentUser) {
      if (_.find(currentUser.__data.roles, {name: USER_ROLES.ADMIN.value})) { // user is admin - allow access
        return next();
      }
      // verify that idToVerify is same as current user.
      if (idToVerify) {
        if (verifyObjId(idToVerify, currentUser)) {
          return next();
        }
      } else {
        next(authError);
      }

    } else {
      next(authError);
    }
  },

  authorizeUser: function (app, ctx, attributeToVerify, next) {
    var token = ctx.options && ctx.options.accessToken;
    var userId = token && token.userId;
    var instanceData = ctx.instance ? ctx.instance : ctx.data;
    if (instanceData && instanceData[attributeToVerify]) {
      // get Current User with its roles
      app.models.user.findById(userId, {include: 'roles'}, function (err, user) {
        if (!err && user) {
          // Test that user is authorized
          _checkAuth(user, instanceData[attributeToVerify], next);
        } else {
          next(errorsProvider.generateError(errorsProvider.errorsMap.AUTHORIZATION_REQUIRED))
        }

      });
    } else {
      next();
    }

  },

  createDeviceToken: function (userId, deviceToken, deviceType) {
    var Device = loopback.getModel('Device');

    function _addPushSubscriptions(userId) {
      Device.find({where: {userId: userId}}, function (err, devices) {
        if (!devices || devices.length <= 1) { // add push subscriptions only if it's the first device token.
          ActionsHelpers.addDefaultUserSubscriptions(userId, NOTIFICATION_METHODS.PUSH);
        }
      });
    }

    console.log("deviceToken: " + deviceToken);
    Device.find({where: {registrationId: deviceToken}}, function (err, devices) {
      if (err) {
        console.error("Couldn't find devices: " + JSON.stringify(err));
      } else {
        if (!devices || !devices.length) {
          // add
          Device.create({
            registrationId: deviceToken,
            type: deviceType || 'undefined',
            userId: userId
          }, function (err, device) {
            if (err) {
              console.error("Couldn't add devices: " + JSON.stringify(err));
            } else {
              console.log("device added");
              _addPushSubscriptions(userId);
            }
          });
        } else {
          console.log("device token exists: " + deviceToken);
        }
      }
    });
  },
  /**
   * Adds the default email subscriptions for the given userId.
   * @param userId
   */
  addDefaultUserSubscriptions: function (userId, type) {
    var defaultEvents = appConfiguration.defaultSubscriptions[type];
    var subscriptionsToAdd = [];
    var Subscription = loopback.getModel('Subscription');
    for (var i = 0; i < defaultEvents.length; i++) {
      subscriptionsToAdd.push({
        eventType: defaultEvents[i],
        method: type,
        userId: userId
      });
    }
    // add the subscriptions.
    Subscription.create(subscriptionsToAdd, function (err, results) {
      if (err) {
        console.error('Error : Failed to add subscriptions ' + JSON.stringify(err));
      }
      // role added.
      console.log('Subscriptions added for user');
    });
  },
  /**
   *
   * @param ctx
   */
  verifyDataValue: function (ctx, attribute, validatedValue, next, requireFieldFromUser) {
    var instanceData = ctx.instance ? ctx.instance : ctx.data;
    if (instanceData && validatedValue) {
      if (instanceData[attribute] && instanceData[attribute] !== validatedValue) {
        return next(errorsProvider.generateError(errorsProvider.errorsMap.AUTHORIZATION_REQUIRED));
      }
      if (ctx.isNewInstance && instanceData) { // create action
        if (requireFieldFromUser) {
          return next(); // Field should be received in the request, forward to server validations.
        }
        // fill field from the server's session data.
        instanceData[attribute] = validatedValue;
      }
    }
    next();
  },

  verifyFieldInModel: function (ctx, ExternalModel, relationField, externalFieldToVerify, validatedValue, next) {
    var instanceData = ctx.instance ? ctx.instance : ctx.data;
    if (instanceData && validatedValue) {
      if (instanceData[relationField]) {
        var externalModelId = instanceData[relationField];
        ExternalModel.findById(externalModelId, {}, function (err, instance) {
          if (!err && instance && instance[externalFieldToVerify] === validatedValue){
            return next();
          } else {
            return next(errorsProvider.generateError(errorsProvider.errorsMap.AUTHORIZATION_REQUIRED));
          }
        });
      } else {
        return next(errorsProvider.generateError(errorsProvider.errorsMap.AUTHORIZATION_REQUIRED));
      }

    } else {
      next();
    }
  },


  getCurrentUserId: function (ctx) {
    const token = ctx.args ? (ctx.args.options && ctx.args.options.accessToken) : (ctx.options && ctx.options.accessToken);
    return token && token.userId;
  },
  getCurrentUser: function (app, ctx) {
    var self = this;
    return new Promise(function (resolve, reject) {
      var userId = self.getCurrentUserId(ctx);
      if (!userId) {
        return resolve(null);
      }
      app.models.user.findById(userId, {include: 'roles'}, function (err, user) {
        if (!err && user) {
          resolve(user);
        } else {
          reject(err);
        }
      });
    });

  },
  isAdmin: function (app, userId) {
    return new Promise(function (resolve, reject) {
      if (!userId) {
        return resolve(false);
      }
      app.models.user.findById(userId, {include: 'roles'}, function (err, user) {
        if (!err && user) {
          resolve(_.find(user.__data.roles, {name: USER_ROLES.ADMIN.value}));
        } else {
          reject(err);
        }
      });
    })


  }
};
module.exports = ActionsHelpers;
