var DigitalTownConnector = require('./../../server/services/api/digitalTown-connector');

module.exports = function (DigitalTown) {

  DigitalTown.initUserSession = function (dtToken) {
    // Try to get DT user to validate the token.
    return DigitalTownConnector.getUserbyAccessToken(dtToken).then(function (user) {
      return user;
    });
  }

  DigitalTown.remoteMethod('DTsearch', {
    accepts: [
      {arg: 'text', type: 'string', required: true}

    ],
    returns: {root: true, "type": "object"},
    http: {
      verb: 'get',
      path: '/search/:text'
    }
  });

  DigitalTown.DTsearch = function (text, cb) {
    DigitalTownConnector.searchSite(text).then(function (data) {
      // success
      cb(null, {html: data});
    })
  };
}
