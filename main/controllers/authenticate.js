// Generated by CoffeeScript 1.6.3
/*
  Handles authenticate / unauthenticate session operations
  via socket.io & (TODO) http
*/


(function() {
  var ORM, async, bcrypt, client, config, employee, sequelize, _;

  _ = require('underscore');

  async = require('async');

  bcrypt = require('bcrypt');

  config = require(GLOBAL.appRoot + 'config/config');

  ORM = require(GLOBAL.appRoot + 'components/oRM');

  sequelize = ORM.setup();

  employee = ORM.model('employee');

  client = ORM.model('client');

  module.exports = function() {
    var app, authenticate, status, unauthenticate;
    app = GLOBAL.app;
    status = function(req) {
      if (!_.isUndefined(req.session.user)) {
        return req.io.respond(_.extend({
          authenticated: true,
          user: req.session.user
        }));
      } else {
        return req.io.respond({
          authenticated: false
        });
      }
    };
    authenticate = function(req) {
      var clientIdentifier;
      if (req.headers && req.headers.host) {
        clientIdentifier = req.headers.host.split('.')[0];
      } else {
        req.io.respond({
          success: false
        });
        return;
      }
      if ((req.data.username == null) || (req.data.password == null) || req.data.password.length > 70) {
        req.io.respond({
          success: false
        });
        return;
      }
      return async.waterfall([
        function(callback) {
          console.log('clientIdentifier ' + clientIdentifier);
          return client.find({
            where: {
              identifier: clientIdentifier
            }
          }).success(function(resultClient) {
            return callback(null, resultClient);
          });
        }, function(resultClient, callback) {
          if (!resultClient) {
            callback(new Error());
            return;
          }
          return employee.find({
            where: {
              clientId: resultClient.id,
              username: req.data.username
            },
            include: [client]
          }).success(function(resultUser) {
            return callback(null, resultUser);
          });
        }
      ], function(err, resultUser) {
        if (err || !resultUser) {
          return req.io.respond({
            success: false
          });
        } else {
          return bcrypt.compare(req.data.password, resultUser.password, function(err, res) {
            var respClient, userValues;
            if (res) {
              respClient = resultUser.client.values;
              userValues = resultUser.values;
              userValues.client = respClient;
              delete userValues.password;
              req.session.user = userValues;
              return req.session.save(function() {
                return req.io.respond({
                  success: true,
                  user: userValues
                });
              });
            } else {
              return req.io.respond({
                success: false
              });
            }
          });
        }
      });
    };
    unauthenticate = function(req) {
      var e, key, value, _ref;
      delete req.session.user;
      try {
        _ref = req.io.manager.rooms;
        for (key in _ref) {
          value = _ref[key];
          req.io.leave(key.substring(1, key.length));
        }
      } catch (_error) {
        e = _error;
        console.log(e);
      }
      return req.session.save(function() {
        return req.io.respond(true);
      });
    };
    return app.io.route('authenticate', {
      status: status,
      authenticate: authenticate,
      unauthenticate: unauthenticate
    });
  };

}).call(this);
