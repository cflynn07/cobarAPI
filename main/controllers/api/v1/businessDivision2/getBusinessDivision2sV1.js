// Generated by CoffeeScript 1.6.3
(function() {
  var ORM, apiAuth, apiExpand, async, config, sequelize, _;

  _ = require('underscore');

  async = require('async');

  config = require(GLOBAL.appRoot + 'config/config');

  apiAuth = require(GLOBAL.appRoot + 'components/apiAuth');

  apiExpand = require(GLOBAL.appRoot + 'components/apiExpand');

  ORM = require(GLOBAL.appRoot + 'components/oRM');

  sequelize = ORM.setup();

  module.exports = function(app) {
    var businessDivision2;
    businessDivision2 = ORM.model('businessDivision2');
    app.get(config.apiSubDir + '/v1/businessDivision2s', function(req, res) {
      return async.series([
        function(callback) {
          return apiAuth(req, res, callback);
        }, function(callback) {
          var clientUid, params, userType;
          userType = req.session.user.type;
          clientUid = req.session.user.clientUid;
          switch (userType) {
            case 'superAdmin':
              params = {
                method: 'findAll',
                find: {}
              };
              return apiExpand(req, res, businessDivision2, params);
            case 'clientSuperAdmin':
            case 'clientAdmin':
            case 'clientDelegate':
            case 'clientAuditor':
              params = {
                method: 'findAll',
                find: {
                  where: {
                    clientUid: clientUid
                  }
                }
              };
              return apiExpand(req, res, businessDivision2, params);
          }
        }
      ]);
    });
    return app.get(config.apiSubDir + '/v1/businessDivision2s/:id', function(req, res) {
      return async.series([
        function(callback) {
          return apiAuth(req, res, callback);
        }, function(callback) {
          var clientUid, params, uids, userType;
          userType = req.session.user.type;
          clientUid = req.session.user.clientUid;
          uids = req.params.id.split(',');
          switch (userType) {
            case 'superAdmin':
              params = {
                method: 'findAll',
                find: {
                  where: {
                    uid: uids
                  }
                }
              };
              return apiExpand(req, res, businessDivision2, params);
            case 'clientSuperAdmin':
            case 'clientAdmin':
            case 'clientDelegate':
            case 'clientAuditor':
              params = {
                method: 'findAll',
                find: {
                  where: {
                    uid: uids,
                    clientUid: clientUid
                  }
                }
              };
              return apiExpand(req, res, businessDivision2, params);
          }
        }
      ]);
    });
  };

}).call(this);