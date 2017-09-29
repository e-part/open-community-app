(function () {
  'use strict';
  angular
    .module('com.module.post')
    .config(function ($stateProvider) {
        $stateProvider
          .state('app.public.post', {
            url: 'post/:permaLink?comment_id',
            params: {
              id: {value: -1}
            },
            templateUrl: 'modules/public/post/views/post.html',
            controller: 'PostCtrl',
            controllerAs: 'ctrl',
            resolve: {
              post: function ($stateParams, PostsService, Constants) {
                var _include = [
                  {relation: 'categories'},
                  {relation: 'mks'},
                  {relation: 'timePledges', scope: {include: ['user']}},
                  {
                    relation: 'itemRequests',
                    scope: {
                      include: [{
                        relation: 'itemPledges', scope: {include: ['user']}
                      }]
                    }
                  },

                  {
                    relation: 'predefinedTags', scope: {
                    where: {
                      type: null
                    }
                  }
                  },
                  {
                    relation: 'meetings',
                    scope: {
                      order: 'date ASC'
                    }
                  },
                  {relation: 'owner'},
                  {
                    relation: 'polls',
                    where: {
                      archived: false
                    },
                    scope: {include: ['answers']}
                  },
                  {relation: 'committees', scope: {include: ['mks']}},
                  {relation: 'conclusions', scope: {include: ['decisions']}}
                ];
                return PostsService.getPostByParams(
                  {
                    where: {
                      permaLink: $stateParams.permaLink
                    },
                    include: _include
                  });
              }
            }
          });
      }
    );
})();
