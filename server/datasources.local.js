var path = require('path');
module.exports = {
  "storage-bucket-name-dev": {
    name: "storage-bucket-name-dev",
    connector: "loopback-component-storage",
    provider: 'filesystem',
    root: path.join(__dirname, '../', '/', 'storage')
  }

};

