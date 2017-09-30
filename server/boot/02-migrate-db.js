module.exports = function(app, next) {
  function migrateDB(isInit) {
    app.models.Migration.migrate('up', function(err) {
      if (err){
        console.error('Could not migrate DB. Exiting...')
        process.exit(1);
        return;
      }
      if (isInit){
        console.log('DB Initialization completed. Exiting...')
        process.exit(0);
        return;
      }
      next();
    });
  }

  if (process.env.INIT_DB){
    app.dataSources.db.connector.query(
      'CREATE TABLE `migration` ( '+
      '`id` int(11) NOT NULL AUTO_INCREMENT,' +
      '`name` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,' +
      '`runDtTm` datetime DEFAULT NULL,' +
      'PRIMARY KEY (`id`)' +
  ') ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;'
    , function(){
        migrateDB(true);
      });

  } else {
    migrateDB();
  }

};
