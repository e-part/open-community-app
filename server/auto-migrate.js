/**
 * Created by yotam on 21/06/2016.
 */
process.env.DB_MIGRATION = true;
var app = require('./server');
var ds = app.dataSources.db;
/*var lbTables = [
    "User", "accessToken", "userCredential", "userIdentity",
    "ACL", "RoleMapping", "Role", "AppModel", "Page", "Post",
    "Setting", "Product", "Category", "Event", "AuthProvider", "Meta"
];*/

app.models.Migration.migrate('up', function(err) {});

/*ds.automigrate(null, function (er) {
    if (er) throw er;
    console.log('Loopback tables created in ', ds.adapter.name);
    ds.disconnect();
});*/


