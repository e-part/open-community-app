/**
 * Created by yotam on 29/06/2017.
 */
var CustomersConfigProvider = require('./../services/customers-config-provider');
var ActionsHelper = require('./../services/actions-helpers');
var _ = require('lodash');

module.exports = function Multitenancy (Model, options) {
 'use strict';
  if (options.addCustomerToRemotingContext){
    Model.createOptionsFromRemotingContext = function(ctx) {
      var base = this.base.createOptionsFromRemotingContext(ctx);
      var customer = CustomersConfigProvider.getCustomerByRequest(Model.app, ctx.req);
      if (customer){
        return _.extend(base, {
          customerId: customer.id
        });
      } else {
        return base;
      }
    };
  }

  /**
   * Multi-tenancy validations:
   */
  if (options.enforceCustomerField){
    Model.observe('before save', function(ctx, next) {
      ActionsHelper.verifyDataValue(ctx,'customerId', ctx.options.customerId, next);
    });

    Model.observe('access', function filterResultsForTenant(ctx, next) {
      if (!ctx.query) {
        ctx.query = {};
      }
      if (!ctx.query.where) {
        ctx.query.where = {};
      }
      if (ctx.options.customerId){
        ctx.query.where.customerId = ctx.options.customerId;
      }

      next();
    });
  }

 };
