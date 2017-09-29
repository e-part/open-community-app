(function () {
  'use strict';
  
  
  angular
    .module('com.module.category')
    .config(function ($stateProvider) {
        $stateProvider
          .state('app.public.category', {
            url: 'category/:slug',
            params: {
              id: {value: -1}
            },
            templateUrl: 'modules/public/category/views/category.html',
            controller: 'CategoryCtrl',
            controllerAs: 'ctrl',
            resolve: {
              category: function ($stateParams, CategoriesService, Constants) {
                var includes = [
                  {
                    relation: 'posts', scope: {
                    order: 'endDate ASC',
                    where: {
                      endDate: {
                        gt: Date.now()
                      },
                      status: Constants.POST_STATUSES.PUBLISHED,
                      migrationStatus: Constants.POST_MIGRATION_STATUS.NORMAL
                    },
                    include: [
                      {relation: 'categories'},
                      {relation: 'mks'},
                      {relation: 'committees'},
                      {relation: 'comments', scope: {order: 'id DESC', include: {relation: 'creator'}}}
                    ],
                    limit: 15
                  }
                  },
                  {relation: 'followers', scope: {limit: 3}}
                ]
                if ($stateParams.id > 0) {
                  return CategoriesService.getCategory($stateParams.id, {include: includes});
                } else {
                  return CategoriesService.getCategoryByParams(
                    {
                      where: {
                        slug: $stateParams.slug
                      },
                      include: includes
                    });
                }
              },
              categoryWithArchivePosts: function ($stateParams, CategoriesService, Constants) {
                var includes = [
                  {
                    relation: 'posts', scope: {
                    order: 'endDate DESC',
                    where: {
                      endDate : { between : [
                        Constants.CONFIG.SHOW_ARCHIVE_POSTS_FROM_DATE,
                        Date.now()
                      ]

                      },                      status: Constants.POST_STATUSES.PUBLISHED,
                      migrationStatus: Constants.POST_MIGRATION_STATUS.NORMAL
                    },
                    include: [
                      {relation: 'categories'},
                      {relation: 'mks'},
                      {relation: 'committees'},
                      {relation: 'comments', scope: {order: 'id DESC', include: {relation: 'creator'}}}
                    ],
                    limit: 15
                  }
                  },
                  {relation: 'followers', scope: {limit: 3}}
                ];
                if ($stateParams.id > 0) {
                  return CategoriesService.getCategory($stateParams.id, {include: includes});
                } else {
                  return CategoriesService.getCategoryByParams({
                    where: {
                      slug: $stateParams.slug
                    },
                    include: includes
                  });
                }

              }
            }
          });
      }
    );
})();
