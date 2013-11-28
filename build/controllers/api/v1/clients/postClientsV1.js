// Generated by CoffeeScript 1.6.3
(function() {
  var ORM, apiAuth, apiVerifyObjectProperties, async, config, insertHelper, sequelize, uuid, _;

  _ = require('underscore');

  async = require('async');

  uuid = require('node-uuid');

  config = require(GLOBAL.appRoot + 'config/config');

  apiVerifyObjectProperties = require(GLOBAL.appRoot + 'components/apiVerifyObjectProperties');

  apiAuth = require(GLOBAL.appRoot + 'components/apiAuth');

  ORM = require(GLOBAL.appRoot + 'components/oRM');

  insertHelper = require(GLOBAL.appRoot + 'components/insertHelper');

  sequelize = ORM.setup();

  module.exports = function(app) {
    var client;
    client = ORM.model('client');
    return app.post(config.apiSubDir + '/v1/clients', function(req, res) {
      return async.series([
        function(callback) {
          return apiAuth(req, res, callback);
        }, function(callback) {
          var clientUid, insertMethod, userType;
          userType = req.session.user.type;
          clientUid = req.session.user.clientUid;
          switch (userType) {
            case 'superAdmin':
              insertMethod = function(item, insertMethodCallback) {
                if (insertMethodCallback == null) {
                  insertMethodCallback = false;
                }
                return apiVerifyObjectProperties(this, client, item, req, res, insertMethodCallback, {
                  requiredProperties: {
                    'name': function(val, objectKey, object, callback) {
                      if (val) {
                        return callback(null, {
                          success: true
                        });
                      } else {
                        return callback(null, {
                          success: false,
                          message: {
                            name: 'required'
                          }
                        });
                      }
                    },
                    'identifier': function(val, objectKey, object, callback) {
                      if (val) {
                        clients.find({
                          where: {
                            identifier: val
                          }
                        }).success;
                        return callback(null, {
                          success: true
                        });
                      } else {
                        return callback(null, {
                          success: false,
                          message: {
                            identifier: 'required'
                          }
                        });
                      }
                    },
                    'address1': function(val, objectKey, object, callback) {
                      if (val) {
                        return callback(null, {
                          success: true
                        });
                      } else {
                        return callback(null, {
                          success: false,
                          message: {
                            address1: 'required'
                          }
                        });
                      }
                    },
                    'address2': function(val, objectKey, object, callback) {
                      if (val) {
                        return callback(null, {
                          success: true
                        });
                      } else {
                        return callback(null, {
                          success: false,
                          message: {
                            address2: 'required'
                          }
                        });
                      }
                    },
                    'address3': function(val, objectKey, object, callback) {
                      if (val) {
                        return callback(null, {
                          success: true
                        });
                      } else {
                        return callback(null, {
                          success: false,
                          message: {
                            address3: 'required'
                          }
                        });
                      }
                    },
                    'city': function(val, objectKey, object, callback) {
                      if (val) {
                        return callback(null, {
                          success: true
                        });
                      } else {
                        return callback(null, {
                          success: false,
                          message: {
                            city: 'required'
                          }
                        });
                      }
                    },
                    'stateProvince': function(val, objectKey, object, callback) {
                      if (val) {
                        return callback(null, {
                          success: true
                        });
                      } else {
                        return callback(null, {
                          success: false,
                          message: {
                            stateProvince: 'required'
                          }
                        });
                      }
                    },
                    'country': function(val, objectKey, object, callback) {
                      if (val) {
                        return callback(null, {
                          success: true
                        });
                      } else {
                        return callback(null, {
                          success: false,
                          message: {
                            country: 'required'
                          }
                        });
                      }
                    },
                    'telephone': function(val, objectKey, object, callback) {
                      if (val) {
                        return callback(null, {
                          success: true
                        });
                      } else {
                        return callback(null, {
                          success: false,
                          message: {
                            telephone: 'required'
                          }
                        });
                      }
                    },
                    'fax': function(val, objectKey, object, callback) {
                      if (val) {
                        return callback(null, {
                          success: true
                        });
                      } else {
                        return callback(null, {
                          success: false,
                          message: {
                            fax: 'required'
                          }
                        });
                      }
                    },
                    'businessDivision0Name': function(val, objectKey, object, callback) {
                      return callback(null, {
                        success: true
                      });
                    },
                    'businessDivision1Name': function(val, objectKey, object, callback) {
                      return callback(null, {
                        success: true
                      });
                    },
                    'businessDivision2Name': function(val, objectKey, object, callback) {
                      return callback(null, {
                        success: true
                      });
                    }
                  }
                }, function(objects) {
                  return insertHelper('clients', clientUid, client, objects, req, res, app, insertMethodCallback);
                });
              };
              if (_.isArray(req.body)) {
                return async.mapSeries(req.body, function(item, callback) {
                  return insertMethod(item, function(createdUid) {
                    return callback(null, createdUid);
                  });
                }, function(err, results) {
                  return config.apiSuccessPostResponse(res, results);
                });
              } else {
                return insertMethod(req.body);
              }
              break;
            case 'clientSuperAdmin':
            case 'clientAdmin':
            case 'clientDelegate':
            case 'clientAuditor':
              return res.jsonAPIRespond(config.errorResponse(401));
          }
        }
      ]);
    });
  };

}).call(this);