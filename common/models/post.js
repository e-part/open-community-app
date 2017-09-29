'use strict';
var POST_STATUSES = require("./../../server/services/enums").POST_STATUSES;
var POST_REVIEW_STATUSES = require("./../../server/services/enums").POST_REVIEW_STATUSES;
var USER_ROLES = require("./../../server/services/enums").USER_ROLES;
var POST_TYPES = require("./../../server/services/enums").POST_TYPES;
var loopback = require('loopback');
var _ = require("lodash");
var rawQueries = require('./../../server/services/mysql-queries-provider');
var actionHelpers = require('./../../server/services/actions-helpers');
var errorsProvider = require('./../../server/services/errors-provider');
var notificationsTargeter = require("./../../server/services/notifications/notifications-targeter");
var knessetDataLoader = require("./../../server/services/data-loaders/knessetDataLoader");
var EVENTS = require("./../../server/services/enums").EVENTS;
var USER_ROLES = require("./../../server/services/enums").USER_ROLES;
var OS_TYPES = require("./../../server/services/enums").OS_TYPES;
var appConfiguration = require('./../../server/services/app-configs');
var ActionsHelper = require('./../../server/services/actions-helpers');

var cheerio = require('cheerio');

// apply validations on the data sent by the user for each role.
var validations = {
  '*': [],
  user: [],
  admin: [],
  'access': [],
  'beforeSave': []
};

// apply filters in order to limit the data a certain user can see
var filters = {
  '*': [],
  user: [],
  admin: [],
};

module.exports = function (Post) {

  function _postsIdsRetrieved(err, data, cb, includeSection) {
    if (err) {
      return cb(err, null);
    }
    var postsIds = _.map(data, function (post) {
      return post.id;
    });
    Post.find({
      where: {id: {inq: postsIds}},
      include: includeSection
    }, function (err, posts) {
      var orderedPosts = [];
      for (var i = 0; i < postsIds.length; i++) {
        var post = _.find(posts, {id: postsIds[i]});
        orderedPosts.push(post);
      }
      cb(null, orderedPosts);

    });

  }

  /**
   * if user session exists, test if user has voted for pollId in the past.
   * @param PollVote
   * @param pollId
   * @param next
   * @param ctx
   * @private
   */
  function _testIfUserHasVotesForPoll(PollVote, polls, next, ctx) {
    return new Promise(function (resolve, reject) {
      var lbCtx = require('loopback-context').getCurrentContext();
      var currentUser = lbCtx && lbCtx.get('currentUser');
      if (!currentUser) {
        next();
      }
      PollVote.find({where: {pollId: {inq: _.map(polls, "id")}, userId: currentUser.id}}, function (err, votes) {
        if (err) {
          console.error(err);
          return next(errorsProvider.generateError(errorsProvider.errorsMap.INTERNAL_ERROR));
        }
        polls = _.map(polls, function (poll) {
          if (_.find(votes, {pollId: poll.id})) {
            poll.voted = true;
          } else {
            poll.voted = false;
          }
          return poll;
        });
        /*        if (votes.length > 0) { // user has already voted
         if (ctx && ctx.result) {
         polls[0].voted = true;
         }
         } else {
         polls[0].voted = false;
         }*/
        next();
      });
    });
  }

  /**
   * If the post is returned with polls attached, test if the current user has voted.
   * @param ctx
   * @param modelInstance
   * @param next
   * @private
   */
  function _testIfUserVotedPoll(ctx, modelInstance, next) {
    var PollVote = Post.app.models.PollVote;
    var filters = (ctx.args && ctx.args.filter) ? JSON.parse(ctx.args.filter) : null
    if (filters && filters.include && ctx.result &&
      ctx.result.__data.polls && ctx.result.__data.polls.length) {
      _testIfUserHasVotesForPoll(PollVote, ctx.result.__data.polls, next, ctx)
    } else {
      next();
    }
  }

  /**
   * add a field to mark if user has voted for the poll on each of the posts.
   * @param posts
   * @private
   */
  function _testIfUserVotedToPolls(posts) {
    var lbCtx = require('loopback-context').getCurrentContext();
    var currentUser = lbCtx && lbCtx.get('currentUser');
    return new Promise(function (resolve, reject) {
      if (currentUser) {
        var pollsIds = [];
        _.each(posts, function (post) {
          pollsIds = pollsIds.concat(_.map(post.__data.polls, 'id'));
        });

        var PollVote = Post.app.models.PollVote;
        PollVote.find({ // get all votes for all of the posts polls for which the user has voted
          where: {pollId: {inq: pollsIds}, userId: currentUser.id}
        }, function (err, votes) {
          // for each of the posts, check if a vote exists in the post's polls (hence the user has voted on the post)
          _.each(posts, function (post) {
            if (post.__data.polls && post.__data.polls.length) {
              _.each(post.__data.polls, function (poll) {
                if (_.find(votes, {pollId: poll.id})) {
                  poll.voted = true;
                } else {
                  poll.voted = false;
                }
              });
            }
          });
          resolve();

        });
      } else { // no user session
        resolve();
      }

    });

    //

  }

  function _overrideContentStyles(ctx, modelInstance, next) {
    if (ctx.req.query && parseInt(ctx.req.query.osType) === OS_TYPES.IOS) {
      var styleToOverride = "direction:rtl;font-size:14px;text-align: justify;"
      if (ctx.result.content) {
        // override all styles to the default.
        var $ = cheerio.load(ctx.result.content);
        $('p').attr('style', styleToOverride)
        $('ol').attr('style', styleToOverride)
        $('span').attr('style', styleToOverride)
        ctx.result.content = $.html();
      }
    }

    next();
  }

  function _filterPosts(ctx, modelInstance, next) {
    var filters;
    try {
      filters = JSON.parse(ctx.args.filter);
    } catch (err) {
      filters = {};
    }
    if (!filters) {
      filters = {};
    }
    if (!filters.where) {
      filters.where = {}
    }
    ActionsHelper.getCurrentUser(Post.app, ctx).then(function (currentUser) {
      if (!currentUser || ( !_.find(currentUser.__data.roles, {name: USER_ROLES.ADMIN.value}))) {
        if (!filters.where.ownerId) {
          // request made for all possible posts
          filters.where.status = POST_STATUSES.PUBLISHED;
        }
        // non admin users can see only approved posts
        filters.where.reviewStatus = POST_REVIEW_STATUSES.APPROVED;
      }
      ctx.args.filter = JSON.stringify(filters);
      next();
    });

  }
  /**
   *
   * @param ctx
   * @param modelInstance
   * @param next
   * @private
   */
  function _filterBeforeRetrievingToUser(ctx, modelInstance, next) {
    if (!ctx.result) {
      return next();
    }
    var currentUserId = ActionsHelper.getCurrentUserId(ctx);
    if (ctx.result.status === POST_STATUSES.PUBLISHED &&
      ctx.result.reviewStatus === POST_REVIEW_STATUSES.APPROVED &&
      currentUserId && ctx.result.ownerId === currentUserId) {
      return next();
    }
    if (!currentUserId) {
      return next(errorsProvider.generateError(errorsProvider.errorsMap.FORBIDDEN));
    }
    // test if current user is an admin
    ActionsHelper.isAdmin(Post.app, currentUserId).then(function (isAdmin) {
      if (isAdmin) {
        return next();
      }
      return next(errorsProvider.generateError(errorsProvider.errorsMap.FORBIDDEN));
    });

  }

  // verify that a non-admin user can only edit the posts he owns.

  Post.validatesUniquenessOf('permaLink', {message: 'PermaLink must be unique'});

  Post.validate('minimumRequiredHours', customValidator, {message: 'minimumRequiredHours Field is required for Post of type PROJECT.'});
  function customValidator(err) {
    if (this.type === POST_TYPES.PROJECT && !this.minimumRequiredHours){
      err();
    }
  }

  Post.remoteMethod('sendNotifications', {
    accepts: [
      {arg: 'req', type: 'object', 'http': {source: 'req'}},
      {arg: 'res', type: 'object', 'http': {source: 'res'}},
      {arg: 'postId', type: 'string', required: true}

    ],
    returns: {root: true, type: 'string'},
    http: {
      verb: 'post',
      path: '/sendNotifications'
    }
  });

  Post.remoteMethod('getTopPostsByUser', {
    accepts: [
      {arg: "options", type: "object", http: "optionsFromRequest"},
      {arg: 'userId', type: 'number', required: true},
      {arg: 'limit', type: 'number', required: false},
      {arg: 'skip', type: 'number', required: false},
    ],
    returns: {root: true, type: 'array'},
    http: {
      verb: 'get',
      path: '/getTopPostsByUser'
    }
  });

  Post.remoteMethod('getPostsByMk', {
    accepts: [
      {arg: "options", type: "object", http: "optionsFromRequest"},
      {arg: 'mkId', type: 'number', required: true},
      {arg: 'limit', type: 'number', required: false},
      {arg: 'skip', type: 'number', required: false},
    ],
    returns: {root: true, type: 'array'},
    http: {
      verb: 'get',
      path: '/getPostsByMk'
    }
  });

  Post.remoteMethod('getPostsByCommittees', {
    accepts: [
      {arg: "options", type: "object", http: "optionsFromRequest"},
      {arg: 'committeesIds', type: 'array', required: true},
      {arg: 'limit', type: 'number', required: false},
      {arg: 'skip', type: 'number', required: false}
    ],
    returns: {root: true, type: 'array'},
    http: {
      verb: 'get',
      path: '/getPostsByCommittees'
    }
  });

  Post.remoteMethod('getPostsByCommentingUser', {
    accepts: [
      {arg: "options", type: "object", http: "optionsFromRequest"},
      {arg: 'userId', type: 'number', required: true},
      {arg: 'limit', type: 'number', required: false},
      {arg: 'skip', type: 'number', required: false},
    ],
    returns: {root: true, type: 'array'},
    http: {
      verb: 'get',
      path: '/getPostsByCommentingUser'
    }
  });

  Post.remoteMethod('getPostsByCategories', {
    accepts: [
      {arg: "options", type: "object", http: "optionsFromRequest"},
      {arg: 'categoriesIds', type: 'array', required: true},
      {arg: 'limit', type: 'number', required: false},
      {arg: 'skip', type: 'number', required: false}
    ],
    returns: {root: true, type: 'array'},
    http: {
      verb: 'get',
      path: '/getPostsByCategories'
    }
  });

  Post.remoteMethod('getAllMks', {
    accepts: [
      {arg: 'id', type: 'number', required: true}
    ],
    returns: {root: true, type: 'array'},
    http: {
      verb: 'get',
      path: '/:id/getAllMks'
    }
  });

  Post.remoteMethod('migratePosts', {
    accepts: [
      {arg: 'dataSource', type: 'string', required: true}
    ],
    returns: {root: true, type: 'string'},
    http: {
      verb: 'post',
      path: '/data/migrate'
    }
  });

  Post.sendNotifications = function (req, res, postId, cb) {
    var ds = Post.app.dataSources.db;
    Post.findById(postId, {include: ['categories']}, function (err, post) {
      var categoriesIds = _.map(post.__data.categories, 'id');
      // get all users with 'user' role that are subscribed to the new
      // post's categories and target the notification to them.
      ds.connector.execute(rawQueries.usersByCateories, [USER_ROLES.USER.value, categoriesIds], function (err, users) {
        if (err) {
          console.error("Error getting users for notifications:" + JSON.stringify(err));
          return cb({});
        }
        var usersToTarget = _.map(users, 'id');
        notificationsTargeter.targetToUsers(EVENTS.POST_PUBLISHED, { // send notifications to all users.
          // event metadata
          post_data: {
            id: post.id
          },
          extra_meta: {
            title: post.title,
            subtitle: post.subtitle,
            content: post.content,
          }
        }, {
          targetedUsers: usersToTarget
        });
      });

      // update post notificationsStatus to sent.
      post.notificationsSent = true;
      post.save(null, function (err, post) {
        if (err) {
          console.error("Error updating post notification status:" + JSON.stringify(err));
        } else {
          console.log("Success updating post notification status:");

        }
      })
    });
    cb();
  };

  Post.getTopPostsByUser = function (options, userId, limit, skip, cb) {
    var ds = Post.app.dataSources.db;
    var RESULTS_LIMIT = limit || 1000;
    var RESULTS_OFFSET = skip || 0;
    ds.connector.execute(rawQueries.getTopPostsByUser, [options.customerId, userId, RESULTS_OFFSET, RESULTS_LIMIT], function (err, data) {
      if (err) {
        return cb(err, null);
      }
      var postsIds = _.map(data, function (post) {
        return post.id;
      });
      var COMMENTS_LIMIT = 5;
      // Expand the retrieved posts with additional data.
      Post.find({
        where: {id: {inq: postsIds}},
        include: [
          {relation: 'categories'},
          {
            relation: 'polls',
            where: {
              archived: false
            },
            scope: {
              include: ['answers']
            }
          },
          {relation: 'committees'},
          {
            relation: 'comments', scope: {
            order: 'id DESC', include: {relation: 'creator'}
          }
          }
        ]
      }, function (err, posts) {
        var orderedPosts = [];
        var updateRequests = [];

        for (var i = 0; i < postsIds.length; i++) {
          var post = _.find(posts, {id: postsIds[i]});
          if (post) {
            if (post.__data.comments) { // limit the number of comments returned
              post.__data.comments = post.__data.comments.slice(0, COMMENTS_LIMIT);
            }
            orderedPosts.push(post);
          }

        }
        updateRequests.push(_testIfUserVotedToPolls(posts));
        Promise.all(updateRequests).then(function () { // add comments count to the response
          cb(null, orderedPosts);
        });

      });

    });
  };

  Post.getPostsByMk = function (options, mkId, limit, skip, cb) {
    var ds = Post.app.dataSources.db;
    var RESULTS_LIMIT = limit || 1000;
    var RESULTS_OFFSET = skip || 0;
    var DAYS_MARGIN = 30;
    var fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - DAYS_MARGIN);
    var toDate = new Date();
    toDate.setDate(toDate.getDate() + DAYS_MARGIN);
    ds.connector.execute(rawQueries.getPostsByMk, [mkId, mkId, options.customerId, fromDate, toDate, RESULTS_OFFSET, RESULTS_LIMIT], function (err, data) {
      if (err) {
        return cb(err, null);
      }
      var postsIds = _.map(data, function (post) {
        return post.id;
      });
      Post.find({
        where: {id: {inq: postsIds}},
        include: [
          {relation: 'committees'},
          {
            relation: 'comments',
            scope: {
              where: {
                parentCommentId: null,
              },
              include: ['creator', 'post'],
              limit: 4,
              order: 'createdAt DESC'
            }
          },
          {relation: 'parentPost'},
          {
            relation: 'polls',
            where: {
              archived: false
            },
            scope: {
              include: ['answers']
            }
          }
        ]
      }, function (err, posts) {
        var orderedPosts = [];

        for (var i = 0; i < postsIds.length; i++) {
          var post = _.find(posts, {id: postsIds[i]});
          orderedPosts.push(post);
        }
        cb(null, orderedPosts);
      });

    });
  };

  Post.getPostsByCommittees = function (options, committeesIds, limit, skip, cb) {
    var ds = Post.app.dataSources.db;
    var RESULTS_LIMIT = limit || 1000;
    var RESULTS_OFFSET = skip || 0;
    var DAYS_MARGIN = 30;
    var fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - DAYS_MARGIN);
    var toDate = new Date();
    toDate.setDate(toDate.getDate() + DAYS_MARGIN);
    if (!committeesIds || !committeesIds.length) {
      committeesIds = null;
    }
    ds.connector.execute(rawQueries.getPostsByCommittees, [options.customerId, fromDate, toDate, committeesIds, RESULTS_OFFSET, RESULTS_LIMIT], function (err, data) {
      if (err) {
        return cb(err, null);
      }
      var postsIds = _.map(data, function (post) {
        return post.id;
      });
      Post.find({
        where: {id: {inq: postsIds}},
        include: [
          {relation: 'conclusions'},
          {relation: 'committees'},
          {
            relation: 'comments',
            scope: {
              counts: 'upvotes',
              include: ['creator', 'post', 'tags'],
              order: 'createdAt DESC'
            }
          },
          {
            relation: 'messages',
            scope: {
              include: ['creator'],
              order: 'createdAt DESC'
            }
          },
          {relation: 'parentPost'},
          {relation: 'polls', scope: {include: ['answers']}}
        ]
      }, function (err, posts) {
        var orderedPosts = [];

        for (var i = 0; i < postsIds.length; i++) {
          var post = _.find(posts, {id: postsIds[i]});
          orderedPosts.push(post);
        }
        cb(null, orderedPosts);
      });

    });
  };

  Post.getPostsByCommentingUser = function (options, userId, limit, skip, cb) {
    var ds = Post.app.dataSources.db;
    var RESULTS_LIMIT = limit || 1000;
    var RESULTS_OFFSET = skip || 0;
    ds.connector.execute(rawQueries.getPostsByCommentingUser, [options.customerId, userId, RESULTS_OFFSET, RESULTS_LIMIT], function (err, data) {
      var includeSection = [
        {relation: 'categories'},
        {relation: 'comments', scope: {limit: 3, order: 'id DESC', include: {relation: 'creator'}}}

      ];
      _postsIdsRetrieved(err, data, cb, includeSection)
    });
  };
  /**
   * Returns a list of all the active posts by the given categoriesIds.
   * @param categoriesIds
   * @param limit
   * @param skip
   * @param cb
   */
  Post.getPostsByCategories = function (options, categoriesIds, limit, skip, cb) {
    var ds = Post.app.dataSources.db;
    var RESULTS_LIMIT = limit || 1000;
    var RESULTS_OFFSET = skip || 0;

    ds.connector.execute(rawQueries.getPostsByCategories, [options.customerId, categoriesIds, RESULTS_OFFSET, RESULTS_LIMIT], function (err, data) {
      var includeSection = [
        {relation: 'categories'}
      ];
      _postsIdsRetrieved(err, data, cb, includeSection)
    });
  };
  /**
   * retrieve the mks that are related to the post, sorted by their comments.
   * @param postId
   * @param cb
   */
  Post.getAllMks = function (postId, cb) {
    function addMk(mks, mk) {
      if (!_.find(mks, {id: mk.id})) {
        mks = mks.concat([mk]);
      }
      return mks;
    }

    function getMks(extraMks, committees) {
      var allMks = [];
      for (var i = 0; i < (extraMks || []).length; i++) {
        allMks = allMks.concat([extraMks[i]]);
      }

      for (var i = 0; i < committees.length; i++) { // for every committee
        var committee = committees[i];
        var committeeMks = committee.__data.mks;
        //console.log("committeeMks: "+ committeeMks);

        if (committeeMks && committeeMks.length) {
          for (var j = 0; j < committeeMks.length; j++) { // for each mk of the committee
            allMks = addMk(allMks, committeeMks[j]);
          }
        }
      }
      return allMks;
    }

    Post.findById(postId, {
      include: [
        {relation: 'mks', scope: {include: 'comments'}},
        {
          relation: 'committees',
          scope: {
            include: [
              {relation: 'mks', scope: {include: 'comments'}}
            ]
          }
        }
      ]
    }, function (err, post) {
      if (err) {
        return cb(err);
      }
      if (post) {
        var mks = getMks(post.__data.mks, post.__data.committees);
        mks = mks.sort(function (a, b) {
          return b.__data.comments.length - a.__data.comments.length;
        });
        cb(null, mks);

      } else {
        cb({});

      }


    });
  };

  Post.migratePosts = function (dataSource, cb) {
    var ds = Post.app.dataSources.db;
    var loadersMap = {
      knesset: knessetDataLoader
    }
    var loader = loadersMap[dataSource];
    if (!loader) {
      return cb(errorsProvider.generateError(errorsProvider.errorsMap.BAD_INPUT));
    }
    loader.migrate(ds).then(function () {
      cb();
    });
  };


  /**
   * Add a limit to the amount of data a regular user can get.
   */
  Post.observe('access', function addLimitToRegularUsers(ctx, next) {
    if (!ctx.query) {
      ctx.query = {};
    }
    if (!ctx.query.where) {
      ctx.query.where = {};
    }
    ActionsHelper.getCurrentUser(Post.app, ctx).then(function (currentUser) {
      if (!currentUser || ( !_.find(currentUser.__data.roles, {name: USER_ROLES.ADMIN.value}))) {
        // override limit if necessary.
        ctx.query.limit = (ctx.query.limit && ctx.query.limit < appConfiguration.MAX_RESULTS_ALLOWED_TO_USER) ? ctx.query.limit : appConfiguration.MAX_RESULTS_ALLOWED_TO_USER;
      }
      next();
    });

  });

  Post.observe('loaded', function addCommentsCount(ctx, next) {
    if (ctx && ctx.instance) {
      actionHelpers.addCount(ctx.instance, 'comments').then(function () {
        next();
      });
    } else {
      next();
    }
  });

  Post.beforeRemote('find', _filterPosts);

  Post.beforeRemote('findOne', _filterPosts);

  Post.beforeRemote('findById', _filterPosts);

  Post.afterRemote('findOne', _testIfUserVotedPoll);

  Post.afterRemote('findById', _testIfUserVotedPoll);

  Post.afterRemote('findOne', _overrideContentStyles);

  Post.afterRemote('findById', _overrideContentStyles);

  Post.afterRemote('findById', _filterBeforeRetrievingToUser);

  Post.createFakeData = function (faker) {
    return Post.create({
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      image: faker.image.imageUrl() + '/nature/' + (Math.random() * 9 | 0)
    });
  };
  /**
   * Validate the ownerId field sent is matching the actual user. (Not needed for admin)
   */
  Post.observe('before save', function validateOwnerId(ctx, next) {
    var currentUserId = ActionsHelper.getCurrentUserId(ctx);
    ActionsHelper.isAdmin(Post.app, currentUserId).then(function (isAdmin) {
      if (isAdmin) {
        return next();
      }
      ActionsHelper.verifyDataValue(ctx, 'ownerId', currentUserId, next)

    });

  });


  Post.observe('before save', function (ctx, next) {
    ActionsHelper.authorizeUser(Post.app, ctx, 'ownerId', next);
  });

};
