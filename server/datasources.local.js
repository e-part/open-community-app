var path = require('path');
module.exports = {
  "files": {
    name: "files",
    connector: "loopback-component-storage",
    provider: 'filesystem',
    root: path.join(__dirname, '../', '/', 'storage')
  }

};

