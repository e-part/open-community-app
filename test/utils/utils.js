/**
 * Created by yotam on 25/06/2017.
 */

var Utils = {
  createFiltes: function(filters) {
    return "filter=" + encodeURIComponent(JSON.stringify(filters));
  }
};
module.exports = Utils;
