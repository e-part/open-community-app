/**
 * Created by yotam on 22/11/2016.
 */

var RESOLUTIONS = {
  DAILY : "DAILY",
  WEEKLY : "WEEKLY",
  MONTHLY : "MONTHLY"
}
function createGroupByResolution(groupByField, resolution){
  switch (resolution) {
    case RESOLUTIONS.DAILY:
          return "DATE(" + groupByField + ")";
    case RESOLUTIONS.WEEKLY:
      return "CONCAT(YEAR(" + groupByField +"), '/', WEEK(" + groupByField + ")) ";
    case RESOLUTIONS.MONTHLY:
      return "CONCAT(YEAR(" + groupByField +"), '/', MONTH(" + groupByField + ")) ";
  }
}

var statsQueryBuilder = {
  connection : null,
  query : function(app, model, groupByField, resolution, from, to){
    var self = this;
    if (!self.connection){
      self.connection = require('knex')({
        client: 'mysql',
        connection: {
          host : app.dataSources.db.connector.settings.host,
          user : app.dataSources.db.connector.settings.user,
          password : app.dataSources.db.connector.settings.password || null,
          database : app.dataSources.db.connector.settings.database
        }
      });
    }

    var resolutionGroupStr = createGroupByResolution(groupByField, resolution);
    var q = self.connection.select(groupByField + " as date").count(groupByField + " as value")
      .from(model).groupByRaw(resolutionGroupStr)
      .where(groupByField, '>=', from).andWhere(groupByField,'<=',to).orderBy(groupByField);
    console.log(q.toString());
    return q

  }
};

module.exports = statsQueryBuilder;
