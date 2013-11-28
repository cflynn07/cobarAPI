// Generated by CoffeeScript 1.6.3
(function() {
  var ORM, apiAuth, apiDelete, async, config, sequelize, uuid, _;

  _ = require('underscore');

  async = require('async');

  uuid = require('node-uuid');

  config = require(GLOBAL.appRoot + 'config/config');

  apiAuth = require(GLOBAL.appRoot + 'components/apiAuth');

  ORM = require(GLOBAL.appRoot + 'components/oRM');

  apiDelete = require(GLOBAL.appRoot + 'components/apiDelete');

  sequelize = ORM.setup();

  module.exports = function(app) {
    var dictionaryItem;
    dictionaryItem = ORM.model('dictionaryItem');
    return app["delete"](config.apiSubDir + '/v1/dictionaryitems', function(req, res) {
      return async.series([
        function(callback) {
          return apiAuth(req, res, callback);
        }, function(callback) {
          var clientUid, uids, userType;
          userType = req.session.user.type;
          clientUid = req.session.user.clientUid;
          if (!_.isArray(req.body)) {
            uids = [req.body];
          } else {
            uids = req.body;
          }
          switch (userType) {
            case 'superAdmin':
              return apiDelete(dictionaryItem, {
                uid: uids
              }, res);
            case 'clientSuperAdmin':
            case 'clientAdmin':
              return apiDelete(dictionaryItem, {
                uid: uids,
                clientUid: clientUid
              }, res);
            case 'clientDelegate':
            case 'clientAuditor':
              return res.jsonAPIRespond(config.errorResponse(401));
          }
        }
      ]);
    });
  };

}).call(this);