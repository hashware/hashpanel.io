console.log('app: hashpanel');

/**
 * @namespace hashpanel
 */
global.hashpanel = {
  url: window.location.url,
  api: { },
  session: {
    charts: { },
    widgets: { }
  },
};
hashpanel.components = require('./components');
hashpanel.views = require('./views');

hashpanel.router = require('./router.jsx');

HashwareClient.create('http://localhost:1337/api/v1/backbonemodel')
  .then(function (api) {
    hashpanel.api = api;

    hashpanel.session.users = new api.UserCollection();
    hashpanel.session.miners = new api.MinerCollection();

    return hashpanel.session.users
      .fetch({
        headers: {
          Authorization: 'Basic YWRtaW46YWRtaW4xMjM0'
        }
      });
  })
  .then(function () {
    hashpanel.session.user = hashpanel.session.users.at(0);
    hashpanel.router.start();

    return hashpanel.session.miners.fetch({
      data: {
        populate: [ 'state', 'device' ]
      }
    });
  });