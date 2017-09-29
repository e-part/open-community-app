'use strict';

describe('Controller: addCategoryCtrl', function () {
  var $controller;

  // load the controller's module
  beforeEach(module('ui.router'));
  beforeEach(module('lbServices'));
  beforeEach(module('gettext'));
  beforeEach(module('formly'));
  beforeEach(module('angular-loading-bar'));
  beforeEach(module('lbServices'));
  beforeEach(module('com.module.core'));
  beforeEach(module('com.module.categories'));
  beforeEach(module('config'));
  beforeEach(module('oitozero.ngSweetAlert'));
  beforeEach(module('toasty'));
  beforeEach(angular.mock.module({
    'category': {
      id : 1
    }
  }));

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$controller_) {
    $controller = _$controller_;

  }));

  it('should verify that scope functions and date exist', function () {

    var controller = $controller('addCategoryCtrl' );
    expect(angular).toBeDefined();
    expect(controller.category).toBeDefined();
    expect(controller.category.id).toEqual(1);
    expect(controller.submit).toBeDefined();
  });

});
