var utils = require('loopback-datasource-juggler/lib/utils');
var _ = require('lodash');
var path = require('path');
var statsQueryBuilder = require('./../../server/services/stats-query-builder');
var Utils = require('./../../server/services/utils');

var metaPagePath = path.join(__dirname, '..', '..', 'server', 'views', 'page_meta.ejs');
module.exports = function (Meta) {

  /**
   * Helper method for format the type of the properties
   */
  function formatProperties (properties) {
    var result = {};
    for (var key in properties) {
      result[key] = _.clone(properties[key]);
      result[key].type = properties[key].type.name;
    }
    return result;
  }


  /**
   * Get the definition of a model and format the result in a way that's similar to a LoopBack model definition file
   */
  function getModelInfo (modelName) {

    // Get the model
    var model = Meta.app.models[modelName];

    // Create the base return object
    var result = {
      id: model.definition.name,
      name: model.definition.name,
      properties: formatProperties(model.definition.properties)
    };

    // Get the following keys from the settings object, if they are set
    var keys = ['description', 'plural', 'base', 'idInjection', 'persistUndefinedAsNull', 'strict', 'hidden',
      'validations', 'relations', 'acls', 'methods', 'mixins'
    ];
    keys.forEach(function (key) {
      result[key] = _.get(model.definition.settings, key);
    });
    return result;
  }

  /**
   *
   * @param permaLink
   * @param res
     */
  function renderPostMetaPage(req, url, permaLink, res){
    var APP_URL =  Utils.getClientPrefixFromRequest(Meta.app, req);
    var Post = Meta.app.models.Post;
    Post.findOne({where : {permaLink : decodeURIComponent(permaLink)}}, function(err, data){
      if (err || !data){
        return renderHomeMetaPage(res);
      }
      res.render(metaPagePath , {
        meta : {
          title: data.title,
          subtitle: data.subtitle,
          fbImage: data.fbImage,
          url: APP_URL.slice(0, -1) + url
        }
      });
    });
  }

  function renderCategoryMetaPage(req, url, slug, res){
    var APP_URL =  Utils.getClientPrefixFromRequest(Meta.app, req)
    var Category = Meta.app.models.Category;
    Category.findOne({where : {slug : decodeURIComponent(slug)}}, function(err, data){
      if (err || !data){
        return renderHomeMetaPage(res);
      }
      res.render(metaPagePath , {
        meta : {
          title: "ePart - " + data.name,
          subtitle: "הדרך שלך להשפיע על מה שחשוב לך",
          fbImage: data.imageUrl,
          url: APP_URL.slice(0, -1) + url
        }
      });
    });
  }

  function renderHomeMetaPage(req, res){
    var APP_URL =  Utils.getClientPrefixFromRequest(Meta.app, req)
    res.render(metaPagePath , {
      meta : {
        title: "ePart",
        subtitle: "הדרך שלך להשפיע על מה שחשוב לך",
        fbImage: "http://epart-app-prod.s3.amazonaws.com/epart-square-logo.png",
        url: APP_URL.slice(0, -1)
      }
    });
  }

  /**
   * Get all the models with its information
   */
  Meta.getModels = function (cb) {
    cb = cb || utils.createPromiseCallback();
    var modelNames = Object.keys(Meta.app.models);
    process.nextTick(function () {
      cb(null, modelNames.sort().map(function (modelName) {
        return getModelInfo(modelName);
      }));
    });
    return cb.promise;
  };

  /**
   * Get one model with its information
   */
  Meta.getModelById = function (modelName, cb) {
    cb = cb || utils.createPromiseCallback();
    process.nextTick(function () {
      cb(null, getModelInfo(modelName));
    });
    return cb.promise;
  };
  /**
   *
   * @param req
   * @param res
   * @param url the url suffix, for example, in a post request, should be /post/post-name.
   * @param cb
     * @returns {*}
     */
  Meta.getCrawlerMetaPage = function (req, res, url, cb) {
    console.log("getCrawlerMetaPage");
    console.log("url = " + url);
    var model, queryByParam;
    if (!url){
      return cb();
    }
    var pathArr = url.split("/");
    if (url.indexOf("://") > -1) { // get the part of the url after http://{host}/api/
      model = pathArr[3];
      queryByParam = pathArr[4];
    } else {
      model = pathArr[1];
      queryByParam = pathArr[2];
    }
    if (model){
      switch(model.toLowerCase()){
        case 'post':
          return renderPostMetaPage(req, url, queryByParam, res);
          break;
        case 'category':
          return renderCategoryMetaPage(req, url, queryByParam, res);
          break;
        default:
          return cb();
      }

    } else { // unrecognized url
      if (model === "" || model === "/"){
        return renderHomeMetaPage(req, res);
      } else {
        return cb();

      }
    }
  };
  Meta.getStats = function (model, groupingField, resolution, from, to, cb) {
    console.log("getStats");
    statsQueryBuilder.query(Meta.app, model,groupingField,resolution, from, to).then(function(result){
      return cb(null,result);
    });
  };


};
