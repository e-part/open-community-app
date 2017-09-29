/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.posts')
    .controller('analizePostCtrl', function ($scope, $state, PostsService, post,
                                             DialogsService, CoreService, Constants, $window, Post, $q, $timeout, Tag, gettextCatalog,
                                             Conclusion, Decision) {
      var ctrl = this;
      ctrl.inEditMode = true;
      ctrl.POST_STATUSES = Constants.POST_STATUSES;
      ctrl.POST_MIGRATION_STATUS = Constants.POST_MIGRATION_STATUS;
      ctrl.post = post;
      ctrl.formFields = PostsService.getFormFields();
      ctrl.formOptions = {};
      ctrl.mockActionItems = [{text : 'אאאאאא אאאאא אאאאא אאא אאאאא'},
        {text : 'אאאאאא אאאאא אאאאא אאא אאאאא'},
        {text : 'אאאאאא אאאאא אאאאא אאא אאאאא'}];

      ctrl.displayedComments = [];
      ctrl.post.categoryTags = getCategoryTags(ctrl.post);
      ctrl.post.predefinedTags = markPredefinedTags(ctrl.post.predefinedTags); // add flag to predefined tags
      ctrl.post.categoryTags = markPredefinedTagsWithinCategories(ctrl.post.categoryTags); // add flag to predefined tags
      var defaultCategory = {
        "content" : gettextCatalog.getString('Uncategorized'),
        "children" : getUncategorizedTags(),
        "isOtherCategory" : true,
        "selected" : true
      };
      ctrl.post.categoryTags.push(defaultCategory);
      ctrl.newCategoryTag = {};
      ctrl.newTag = {};
      $timeout(function(){
        updateComments();
      },200);

      function getUncategorizedTags(){
        var comments = ctrl.post.comments;
        var predefinedTags = _.filter(ctrl.post.predefinedTags,{type : null, parentTagId: null});
        var tags = _.map(comments, 'tags');
        tags = _.filter(tags, function(obj){
          return obj;
        });
        tags = _.flatten(tags);
        tags = _.union(tags);
        tags = _.union(tags, predefinedTags);
        tags = _.uniq(tags, function(obj){
          return obj.id;
        });
        tags = _.filter(tags,{ parentTagId: null});
        return tags;
      }

      function getCategoryTags(post){
        return _.filter(post.predefinedTags,{type : Constants.TAG_TYPES.CATEGORY});
      }

      function markPredefinedTags(predefinedTags){
        var tags = _.map(predefinedTags, function (obj){ // mark the tags that are predefined by admin.
          obj.predefined = true;
          return obj;
        });
        return tags;
      }

      function markPredefinedTagsWithinCategories(categories){
        // mark all tags in each category that are predefined
        for (var i = 0; i < categories.length; i++){
          categories[i].children = _.map(categories[i].children, function (obj){ // mark the tags that are predefined by admin.
            if (_.findWhere(ctrl.post.predefinedTags, {id : obj.id})){
              obj.predefined = true;
            }
            return obj;
          });
        }
        return categories
      }

      function commentHasTags(comment, tags){
        return _.filter(comment.tags,function(tag){
            return _.findWhere(tags, {content : tag.content});
          }).length > 0;
      }
      // Get all the comments that has one of the given tags in them.
      function getCommentsByTags(tags){
        return _.filter(post.comments, function(comment){
          // check if the comment has a tag that appears in the given tags list
          return commentHasTags(comment, tags);
        });
      }
      // refresh the filtered comments list.
      function updateComments(){
        ctrl.displayedComments = [];
        for (var i = 0; i < ctrl.post.categoryTags.length; i++ ){ // iterate over all selected categories
          var category = ctrl.post.categoryTags[i];
          if (category.selected){
            for (var j = 0; j < category.children.length; j++ ){ // for every selected tag
              var tag = category.children[j];
              if (tag.selected){
                // add all comments that has this tag (and are not already in display)
                ctrl.displayedComments = _.uniq(ctrl.displayedComments.concat(getCommentsByTags([tag])), function(comment){
                  return comment.id;
                });
              }
            }
          }
        }
        ctrl.averageSentimentScore = calculateAverageSentimentsScore(ctrl.displayedComments);
      }

      function calculateAverageSentimentsScore(comments){
        var sentimentsScoresSum = 0;
        var count = 0;
        for (var i = 0; i < comments.length; i++){
          if (comments[i].sentimentScore){
            sentimentsScoresSum += comments[i].sentimentScore;
            console.log("comments[i].sentimentScore: " + comments[i].sentimentScore);

            count++;
          }
        }
        console.log("sentimentsScoresSum: " + sentimentsScoresSum);
        console.log("count: " + count);
        return sentimentsScoresSum / count;
      }

      ctrl.removeCategory = function(category) {
        CoreService.confirm(
          gettextCatalog.getString('Are you sure?'),
          gettextCatalog.getString('Deleting this cannot be undone'),
          function () {
            // remove all children tags that were linked to that category.
            Tag.updateAll({where : {parentTagId : category.id}}, {parentTagId : null}).$promise.then(function(){
              // remove the category itself from the post.
              Post.predefinedTags.destroyById({id : ctrl.post.id, fk : category.id}).$promise.then(function(result){
                var index = ctrl.post.categoryTags.indexOf(category);
                if (index > -1) {
                  ctrl.post.categoryTags.splice(index, 1);
                }
                updateComments();

              });
            });
          },
          function () {
          }
        );
      };

      ctrl.removeTagFromCategory = function(category, tag) {
        function tagDeleted(result){
          var index = category.children.indexOf(tag);
          if (index > -1) {
            category.children.splice(index, 1);
          }
          updateComments();
        }
        CoreService.confirm(
          gettextCatalog.getString('Are you sure?'),
          gettextCatalog.getString('Deleting this cannot be undone'),
          function () {
            if (tag.predefined){
              Post.predefinedTags.destroyById({id : ctrl.post.id, fk : tag.id}).$promise.then(tagDeleted);
            } else {
              Tag.destroyById({id : tag.id}).$promise.then(tagDeleted);
            }
          },
          function () {
          }
        );

      };

      ctrl.addTagToCategory = function(category, newTag) {
        newTag.parentTagId = category.id;
        Post.predefinedTags.create({ id : ctrl.post.id}, newTag).$promise.then(function(createdTag){
          createdTag.predefined = true;
          category.children.push(createdTag);
          category.newTag = {};
          category.createNewTagOpened = false;
        });
      };

      ctrl.addCategoryTag = function(newTag) {
        newTag.type = Constants.TAG_TYPES.CATEGORY;
        Post.predefinedTags.create({ id : ctrl.post.id}, newTag).$promise.then(function(createdTag){
          createdTag.predefined = true;
          ctrl.post.categoryTags.push(createdTag);
          createdTag.children = [];
          ctrl.newCategoryTag = {};
          ctrl.createNewTagOpened = false;
        });

      };

      ctrl.selectTag = function(tag){
        if (tag.selected) {
          tag.selected = false;
        } else {
          tag.selected = true;
        }
        updateComments();
      };

      ctrl.selectCategoryTag = function(category){
        if (category.selected) {
          category.selected = false;
        } else {
          category.selected = true;
        }
        updateComments();
      };

      ctrl.updateCategory = function(category, item){

        if (category.isOtherCategory){// handle switching to 'Uncategorized'
          Tag.update({where : {id : item.id}},{parentTagId : null});
        } else { // handle switching to a category
          // TODO change all functions to update predefined list only on items that are created by admin
            Tag.update({where : {id : item.id}},{parentTagId : category.id});
        }

      };

      ctrl.tagMoved = function(list, index, category) {
        list.splice(index, 1);
        // remove item from original list
      };

      ctrl.tagDropped = function(event, index, item, external, type, category) {
        // add tag to destination list
        ctrl.updateCategory(category, item);
        return item;

      };

      ctrl.previewPost = function(post){
        $window.open();
      };
      function updateDecisionsForConclusion(conclusion,decisions){
        var conclusionToSave = angular.copy(conclusion);
        conclusionToSave.__deps__ = {};
        conclusionToSave.__deps__.decisions = decisions;
        return Conclusion.upsert(conclusionToSave).$promise;
      }
      function refreshConclusionState(conclusion){
        Conclusion.findById({id : conclusion.id, filter : {include : 'decisions'}}).$promise.then(function(updatedObj){
          angular.extend(conclusion, updatedObj);
        });
      }
      ctrl.saveConclusion = function(conclusion) {
        // create or update conclusion (with the postId)
        conclusion.postId = ctrl.post.id;
        Conclusion.upsert(conclusion).$promise.then(function(newConclusion){
          updateDecisionsForConclusion(newConclusion,conclusion.decisions).then(function(){
            conclusion.editMode = false;
            conclusion.id = newConclusion.id;
            refreshConclusionState(conclusion); // needed in order to get the new ids for the inner decisions object
          });
        });
        // get the conclusionId, and save all the decisions.
      };

      ctrl.removeConclusion = function(conclusion, index){
        CoreService.confirm(
          gettextCatalog.getString('Are you sure?'),
          gettextCatalog.getString('Deleting this cannot be undone'),
          function () {
            // remove all the decisions under the conclusion.
            Conclusion.decisions.destroyAll({id : conclusion.id}).$promise.then(function(){
              // remove the conclusion itself.
              Conclusion.destroyById({id : conclusion.id}).$promise.then(function(result){
                ctrl.post.conclusions.splice(index,1); // remove from ui
              });
            });
          },
          function () {
          }
        );


      };

/*      ctrl.initArr = function(field){
        if (!ctrl.post[field]){
          ctrl.post[field] = [];
        } else {
          ctrl.post[field] = _.map(ctrl.post[field], function(str){
            return {text : str};
          });
        }
      };*/
    })
    .directive('enterPressed', function () {
    return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
        if(event.which === 13) {
          scope.$apply(function (){
            scope.$eval(attrs.enterPressed);
          });

          event.preventDefault();
        }
      });
    };
  });;


})();
