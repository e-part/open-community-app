/**
 * Created by yotam on 21/06/2016.
 */
process.env.DB_MIGRATION = true;
var app = require('./server');
var ds = app.dataSources.db;
// TODO this should be updated when new models are added.
var lbTables = [
  "user",
  "ACL", "RoleMapping", "Role", "AppModel", "Post",
  "Setting", "Category", "AuthProvider", "Meta", "Committee","Comment", "Follow"
];

// NOTE - Use 'user' table instead of 'User'.
ds.autoupdate(lbTables, function (er) {
  if (er) throw er;
  ds.disconnect();
});


