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
    var client, employee, group, revision, template;
    group = ORM.model('group');
    template = ORM.model('template');
    employee = ORM.model('employee');
    client = ORM.model('client');
    revision = ORM.model('revision');
    return app.post(config.apiSubDir + '/v1/groups', function(req, res) {
      return async.series([
        function(callback) {
          return apiAuth(req, res, callback);
        }, function(callback) {
          var clientUid, employeeUid, insertMethod, userType;
          userType = req.session.user.type;
          clientUid = req.session.user.clientUid;
          employeeUid = req.session.user.uid;
          switch (userType) {
            case 'superAdmin':
              insertMethod = function(item, insertMethodCallback) {
                if (insertMethodCallback == null) {
                  insertMethodCallback = false;
                }
                return apiVerifyObjectProperties(this, group, item, req, res, insertMethodCallback, {
                  requiredProperties: {
                    'name': function(val, objectKey, object, callback) {
                      if (!_.isUndefined(val)) {
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
                    'ordinal': function(val, objectKey, object, callback) {
                      if (!_.isUndefined(val)) {
                        return callback(null, {
                          success: true
                        });
                      } else {
                        return callback(null, {
                          success: false,
                          message: {
                            ordinal: 'required'
                          }
                        });
                      }
                    },
                    'description': function(val, objectKey, object, callback) {
                      if (_.isUndefined(val)) {
                        return callback(null, {
                          success: true,
                          transform: [objectKey, 'description', '']
                        });
                      } else {
                        return callback(null, {
                          success: true
                        });
                      }
                    },
                    'clientUid': function(val, objectKey, object, callback) {
                      var testClientUid;
                      testClientUid = !_.isUndefined(object['clientUid']) ? object['clientUid'] : clientUid;
                      return callback(null, {
                        success: true,
                        transform: [objectKey, 'clientUid', testClientUid]
                      });
                    },
                    'revisionUid': function(val, objectKey, object, callback) {
                      var testClientUid;
                      if (_.isUndefined(val)) {
                        callback(null, {
                          success: false,
                          message: {
                            revisionUid: 'required'
                          }
                        });
                        return;
                      }
                      testClientUid = !_.isUndefined(object['clientUid']) ? object['clientUid'] : clientUid;
                      return async.parallel([
                        function(callback) {
                          return client.find({
                            where: {
                              uid: testClientUid
                            }
                          }).success(function(resultClient) {
                            return callback(null, resultClient);
                          });
                        }, function(callback) {
                          return revision.find({
                            where: {
                              clientUid: testClientUid,
                              uid: val
                            }
                          }).success(function(resultRevision) {
                            return callback(null, resultRevision);
                          });
                        }
                      ], function(error, results) {
                        var mapObj, resultClient, resultRevision;
                        resultClient = results[0];
                        resultRevision = results[1];
                        if (!resultRevision) {
                          callback(null, {
                            success: false,
                            message: {
                              'revisionUid': 'unknown'
                            }
                          });
                          return;
                        }
                        if (!resultClient) {
                          callback(null, {
                            success: false,
                            'clientUid': 'unknown'
                          });
                          return;
                        }
                        if (resultRevision.clientUid !== resultClient.uid) {
                          callback(null, {
                            success: false,
                            message: {
                              'revisionUid': 'unknown'
                            }
                          });
                          return;
                        }
                        mapObj = {};
                        mapObj[resultRevision.uid] = resultRevision;
                        mapObj[resultClient.uid] = resultClient;
                        return callback(null, {
                          success: true,
                          uidMapping: mapObj
                        });
                      });
                    }
                  }
                }, function(objects) {
                  return insertHelper('groups', clientUid, group, objects, req, res, app, insertMethodCallback);
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
              insertMethod = function(item, insertMethodCallback) {
                if (insertMethodCallback == null) {
                  insertMethodCallback = false;
                }
                return apiVerifyObjectProperties(this, group, item, req, res, insertMethodCallback, {
                  requiredProperties: {
                    'name': function(val, objectKey, object, callback) {
                      if (!_.isUndefined(val)) {
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
                    'ordinal': function(val, objectKey, object, callback) {
                      if (!_.isUndefined(val)) {
                        return callback(null, {
                          success: true
                        });
                      } else {
                        return callback(null, {
                          success: false,
                          message: {
                            ordinal: 'required'
                          }
                        });
                      }
                    },
                    'description': function(val, objectKey, object, callback) {
                      if (_.isUndefined(val)) {
                        return callback(null, {
                          success: true,
                          transform: [objectKey, 'description', '']
                        });
                      } else {
                        return callback(null, {
                          success: true
                        });
                      }
                    },
                    'clientUid': function(val, objectKey, object, callback) {
                      var testClientUid;
                      if (!_.isUndefined(val)) {
                        callback(null, {
                          success: false,
                          message: {
                            clientUid: 'unknown'
                          }
                        });
                        return;
                      }
                      testClientUid = !_.isUndefined(object['clientUid']) ? object['clientUid'] : clientUid;
                      return callback(null, {
                        success: true,
                        transform: [objectKey, 'clientUid', testClientUid]
                      });
                    },
                    'revisionUid': function(val, objectKey, object, callback) {
                      var testClientUid;
                      if (_.isUndefined(val)) {
                        callback(null, {
                          success: false,
                          message: {
                            revisionUid: 'required'
                          }
                        });
                        return;
                      }
                      testClientUid = !_.isUndefined(object['clientUid']) ? object['clientUid'] : clientUid;
                      return async.parallel([
                        function(callback) {
                          return client.find({
                            where: {
                              uid: testClientUid
                            }
                          }).success(function(resultClient) {
                            return callback(null, resultClient);
                          });
                        }, function(callback) {
                          return revision.find({
                            where: {
                              clientUid: testClientUid,
                              uid: val
                            }
                          }).success(function(resultRevision) {
                            return callback(null, resultRevision);
                          });
                        }
                      ], function(error, results) {
                        var mapObj, resultClient, resultRevision;
                        resultClient = results[0];
                        resultRevision = results[1];
                        if (!resultRevision) {
                          callback(null, {
                            success: false,
                            message: {
                              'revisionUid': 'unknown'
                            }
                          });
                          return;
                        }
                        if (!resultClient) {
                          callback(null, {
                            success: false,
                            'clientUid': 'unknown'
                          });
                          return;
                        }
                        if (resultRevision.clientUid !== resultClient.uid) {
                          callback(null, {
                            success: false,
                            message: {
                              'revisionUid': 'unknown'
                            }
                          });
                          return;
                        }
                        mapObj = {};
                        mapObj[resultRevision.uid] = resultRevision;
                        mapObj[resultClient.uid] = resultClient;
                        return callback(null, {
                          success: true,
                          uidMapping: mapObj
                        });
                      });
                    }
                  }
                }, function(objects) {
                  return insertHelper('groups', clientUid, group, objects, req, res, app, insertMethodCallback);
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
            case 'clientDelegate':
            case 'clientAuditor':
              return res.jsonAPIRespond(config.errorResponse(401));
          }
        }
      ]);
    });
  };

}).call(this);