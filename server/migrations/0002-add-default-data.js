module.exports = {

  up: function (app, next) {
    app.dataSources.db.connector.execute(
      // add default customer
      "INSERT INTO `civic_app`.`Customer` (`id`, `name`, `domain`, `className`, `attributes`, `clientID`, `clientSecret`) VALUES ('1', 'Open Civic Platform', 'localhost', 'epart', '{\"DISABLE_USER_POST_CREATION\": true,\"MASTER_CLIENT_TYPE\": \"EPART\",\"ABOUT_URL\" : \"/about\",\"TERMS_URL\" : \"/terms\", \"SITE_URL\": \"/\", \"TIMEZONE_OFFSET\": 1, \"features\":{\"showHeader\": true, \"showHeaderNavLinks\" : true}}', '', '');" +
      // add default categories
      "INSERT INTO `civic_app`.`Category` (`id`, `name`, `slug`, `imageUrl`, `updatedAt`) VALUES ('1', 'Civil rights', 'Civil-rights', 'https://epart-app-prod.s3.amazonaws.com/j6zsd16vmtfowzcqsemi1476352653294.jpg', '2017-01-29 12:11:51');" +
      "INSERT INTO `civic_app`.`Category` (`id`, `name`, `slug`, `imageUrl`, `updatedAt`) VALUES ('2', 'Children & Youth', 'Children & Youth', 'https://epart-app-prod.s3.amazonaws.com/e54ybvo6vdh6zme7b91490012444836.png', '2017-03-20 12:20:51');" +
      "INSERT INTO `civic_app`.`Category` (`id`, `name`, `slug`, `imageUrl`, `updatedAt`) VALUES ('3', 'Health', 'Health', 'https://epart-app-prod.s3.amazonaws.com/xbce88hzqpnrvwo8ncdi1489655345936.png', '2017-03-16 09:09:19');" +
      "INSERT INTO `civic_app`.`Category` (`id`, `name`, `slug`, `imageUrl`, `updatedAt`) VALUES ('4', 'Sports', 'Sports', 'https://epart-app-prod.s3.amazonaws.com/sksu3va897gaak79cnmi1476086760903.jpg', '2017-03-19 14:36:56');" +
      "INSERT INTO `civic_app`.`Category` (`id`, `name`, `slug`, `imageUrl`, `updatedAt`) VALUES ('5', 'Crime & Police', 'Crime-Police', 'https://epart-app-prod.s3.amazonaws.com/5mhbvt1499694853839.jpg', '2017-07-10 13:54:21');" +
      "INSERT INTO `civic_app`.`Category` (`id`, `name`, `slug`, `imageUrl`, `updatedAt`) VALUES ('7', 'Young families', 'Young families', 'https://epart-app-prod.s3.amazonaws.com/x0jtd08egx7wrhui35wmi1490014551280.png', '2017-03-20 12:58:07');" +
      "INSERT INTO `civic_app`.`Category` (`id`, `name`, `slug`, `imageUrl`, `updatedAt`) VALUES ('8', 'Housing', 'Housing', 'https://epart-app-prod.s3.amazonaws.com/xjqqgtet3rs22m1v2t91489670787856.png', '2017-03-16 13:26:36');" +
      "INSERT INTO `civic_app`.`Category` (`id`, `name`, `slug`, `imageUrl`, `updatedAt`) VALUES ('10', 'Arts & Culture', 'Arts-Culture', 'https://epart-app-prod.s3.amazonaws.com/i28j65zrr65vnq6rsh5mi1476098076046.jpg', '2017-01-29 12:11:21');" +
      "INSERT INTO `civic_app`.`Category` (`id`, `name`, `slug`, `imageUrl`, `updatedAt`) VALUES ('11', 'Consumers', 'Consumers', 'https://epart-app-prod.s3.amazonaws.com/wc9ds2sozupzonptlnmi1476108196080.jpg', '2017-01-29 12:12:37');" +
      "INSERT INTO `civic_app`.`Category` (`id`, `name`, `slug`, `imageUrl`, `updatedAt`) VALUES ('12', 'Media', 'Media', 'https://epart-app-prod.s3.amazonaws.com/bqwe13esi8lw8ds5x9a4i1489671406342.png', '2017-03-16 13:36:53');" +
      "INSERT INTO `civic_app`.`Category` (`id`, `name`, `slug`, `imageUrl`, `updatedAt`) VALUES ('15', 'Transportation', 'Transportation', 'https://epart-app-prod.s3.amazonaws.com/3ypn31499693791188.jpg', '2017-07-10 13:36:35');" +
      "INSERT INTO `civic_app`.`Category` (`id`, `name`, `slug`, `imageUrl`, `updatedAt`) VALUES ('16', 'Tourism', 'Tourism', 'https://epart-app-prod.s3.amazonaws.com/7z69g91499695029334.jpg', '2017-07-10 13:57:14');" +
      
      // add default roles
      "INSERT INTO `civic_app`.`Role` (`id`, `name`) VALUES ('1', 'admin');" +
      "INSERT INTO `civic_app`.`Role` (`id`, `name`) VALUES ('2', 'user');" +
      "INSERT INTO `civic_app`.`Role` (`id`, `name`) VALUES ('3', 'mk');",
      next);
  },
  down: function (app, next) {
  }
};
