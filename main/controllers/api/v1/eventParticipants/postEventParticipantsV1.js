// Generated by CoffeeScript 1.6.3
(function() {
  var ORM, apiAuth, apiVerifyObjectProperties, async, config, insertHelper, sequelize, uuid, _;

  _ = require('underscore');

  async = require('async');

  uuid = require('node-uuid');

  config = require(GLOBAL.appRoot + 'config/config');

  apiVerifyObjectProperties = require(GLOBAL.appRoot + 'components/apiVerifyObjectProperties');

  apiAuth = require(GLOBAL.appRoot + 'components/apiAuth');

  insertHelper = require(GLOBAL.appRoot + 'components/insertHelper');

  ORM = require(GLOBAL.appRoot + 'components/oRM');

  sequelize = ORM.setup();

  module.exports = function(app) {
    var client, employee, event, eventParticipant;
    employee = ORM.model('employee');
    client = ORM.model('client');
    event = ORM.model('event');
    eventParticipant = ORM.model('eventParticipant');
    return app.post(config.apiSubDir + '/v1/eventparticipants', function(req, res) {
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
                return apiVerifyObjectProperties(this, eventParticipant, item, req, res, insertMethodCallback, {
                  requiredProperties: {
                    'clientUid': function(val, objectKey, object, callback) {
                      var testClientUid;
                      testClientUid = !_.isUndefined(object['clientUid']) ? object['clientUid'] : clientUid;
                      return callback(null, {
                        success: true,
                        transform: [objectKey, 'clientUid', testClientUid]
                      });
                    },
                    'finalizedDateTime': function(val, objectKey, object, callback) {
                      return callback(null, {
                        success: true
                      });
                    },
                    'initialViewDateTime': function(val, objectKey, object, callback) {
                      return callback(null, {
                        success: true
                      });
                    },
                    'employeeUid': function(val, objectKey, object, callback) {
                      var testClientUid;
                      if (_.isUndefined(val)) {
                        callback(null, {
                          success: false,
                          message: {
                            employeeUid: 'required'
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
                          return employee.find({
                            where: {
                              clientUid: testClientUid,
                              uid: val
                            }
                          }).success(function(resultEmployee) {
                            return callback(null, resultEmployee);
                          });
                        }
                      ], function(error, results) {
                        var mapObj, resultClient, resultEmployee;
                        resultClient = results[0];
                        resultEmployee = results[1];
                        if (!resultEmployee) {
                          callback(null, {
                            success: false,
                            message: {
                              employeeUid: 'unknown'
                            }
                          });
                          return;
                        }
                        if (!resultClient) {
                          callback(null, {
                            success: false,
                            message: {
                              clientUid: 'unknown'
                            }
                          });
                          return;
                        }
                        if (resultEmployee.clientUid !== resultClient.uid) {
                          callback(null, {
                            success: false,
                            message: {
                              employeeUid: 'unknown'
                            }
                          });
                          return;
                        }
                        mapObj = {};
                        mapObj[resultEmployee.uid] = resultEmployee;
                        mapObj[resultClient.uid] = resultClient;
                        return callback(null, {
                          success: true,
                          uidMapping: mapObj,
                          transform: [objectKey, 'employeeUid', val]
                        });
                      });
                    },
                    'eventUid': function(val, objectKey, object, callback) {
                      var testClientUid;
                      if (_.isUndefined(val)) {
                        callback(null, {
                          success: false,
                          message: {
                            eventUid: 'required'
                          }
                        });
                        return;
                      }
                      if (_.isUndefined(object['employeeUid'])) {
                        callback(null, {
                          success: true
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
                          return event.find({
                            where: {
                              clientUid: testClientUid,
                              uid: val
                            }
                          }).success(function(resultEvent) {
                            return callback(null, resultEvent);
                          });
                        }, function(callback) {
                          return eventParticipant.find({
                            where: {
                              clientUid: testClientUid,
                              eventUid: val,
                              employeeUid: object['employeeUid']
                            }
                          }).success(function(resultEventParticipant) {
                            return callback(null, resultEventParticipant);
                          });
                        }
                      ], function(error, results) {
                        var mapObj, resultClient, resultEvent, resultEventParticipant;
                        resultClient = results[0];
                        resultEvent = results[1];
                        resultEventParticipant = results[2];
                        if (resultEventParticipant) {
                          callback(null, {
                            success: false,
                            message: {
                              employeeUid: 'duplicate'
                            }
                          });
                          return;
                        }
                        if (!resultEvent) {
                          callback(null, {
                            success: false,
                            message: {
                              eventUid: 'unknown'
                            }
                          });
                          return;
                        }
                        if (!resultClient) {
                          callback(null, {
                            success: false,
                            message: {
                              clientUid: 'unknown'
                            }
                          });
                          return;
                        }
                        if (resultEvent.clientUid !== resultClient.uid) {
                          callback(null, {
                            success: false,
                            message: {
                              eventUid: 'unknown'
                            }
                          });
                          return;
                        }
                        mapObj = {};
                        mapObj[resultEvent.uid] = resultEvent;
                        mapObj[resultClient.uid] = resultClient;
                        return callback(null, {
                          success: true,
                          uidMapping: mapObj,
                          transform: [objectKey, 'eventUid', val]
                        });
                      });
                    }
                  }
                }, function(objects) {
                  return insertHelper('eventparticipants', clientUid, eventParticipant, objects, req, res, app, insertMethodCallback);
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
                return apiVerifyObjectProperties(this, eventParticipant, item, req, res, insertMethodCallback, {
                  requiredProperties: {
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
                    'finalizedDateTime': function(val, objectKey, object, callback) {
                      return callback(null, {
                        success: true
                      });
                    },
                    'initialViewDateTime': function(val, objectKey, object, callback) {
                      return callback(null, {
                        success: true
                      });
                    },
                    'employeeUid': function(val, objectKey, object, callback) {
                      var testClientUid;
                      if (_.isUndefined(val)) {
                        callback(null, {
                          success: false,
                          message: {
                            employeeUid: 'required'
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
                          return employee.find({
                            where: {
                              clientUid: testClientUid,
                              uid: val
                            }
                          }).success(function(resultEmployee) {
                            return callback(null, resultEmployee);
                          });
                        }
                      ], function(error, results) {
                        var mapObj, resultClient, resultEmployee;
                        resultClient = results[0];
                        resultEmployee = results[1];
                        if (!resultEmployee) {
                          callback(null, {
                            success: false,
                            message: {
                              employeeUid: 'unknown'
                            }
                          });
                          return;
                        }
                        if (!resultClient) {
                          callback(null, {
                            success: false,
                            message: {
                              clientUid: 'unknown'
                            }
                          });
                          return;
                        }
                        if (resultEmployee.clientUid !== resultClient.uid) {
                          callback(null, {
                            success: false,
                            message: {
                              employeeUid: 'unknown'
                            }
                          });
                          return;
                        }
                        mapObj = {};
                        mapObj[resultEmployee.uid] = resultEmployee;
                        mapObj[resultClient.uid] = resultClient;
                        return callback(null, {
                          success: true,
                          uidMapping: mapObj,
                          transform: [objectKey, 'employeeUid', val]
                        });
                      });
                    },
                    'eventUid': function(val, objectKey, object, callback) {
                      var testClientUid;
                      if (_.isUndefined(val)) {
                        callback(null, {
                          success: false,
                          message: {
                            eventUid: 'required'
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
                          return event.find({
                            where: {
                              clientUid: testClientUid,
                              uid: val
                            }
                          }).success(function(resultEvent) {
                            return callback(null, resultEvent);
                          });
                        }, function(callback) {
                          return eventParticipant.find({
                            where: {
                              clientUid: testClientUid,
                              eventUid: val,
                              employeeUid: object['employeeUid']
                            }
                          }).success(function(resultEventParticipant) {
                            return callback(null, resultEventParticipant);
                          });
                        }
                      ], function(error, results) {
                        var mapObj, resultClient, resultEvent, resultEventParticipant;
                        resultClient = results[0];
                        resultEvent = results[1];
                        resultEventParticipant = results[2];
                        if (resultEventParticipant) {
                          callback(null, {
                            success: false,
                            message: {
                              employeeUid: 'duplicate'
                            }
                          });
                          return;
                        }
                        if (!resultEvent) {
                          callback(null, {
                            success: false,
                            message: {
                              eventUid: 'unknown'
                            }
                          });
                          return;
                        }
                        if (!resultClient) {
                          callback(null, {
                            success: false,
                            message: {
                              clientUid: 'unknown'
                            }
                          });
                          return;
                        }
                        if (resultEvent.clientUid !== resultClient.uid) {
                          callback(null, {
                            success: false,
                            message: {
                              eventUid: 'unknown'
                            }
                          });
                          return;
                        }
                        mapObj = {};
                        mapObj[resultEvent.uid] = resultEvent;
                        mapObj[resultClient.uid] = resultClient;
                        return callback(null, {
                          success: true,
                          uidMapping: mapObj,
                          transform: [objectKey, 'eventUid', val]
                        });
                      });
                    }
                  }
                }, function(objects) {
                  return insertHelper('eventparticipants', clientUid, eventParticipant, objects, req, res, app, insertMethodCallback);
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
