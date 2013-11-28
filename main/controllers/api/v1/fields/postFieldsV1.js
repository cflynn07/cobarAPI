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
    var client, dictionary, employee, field, group, revision, template;
    group = ORM.model('group');
    template = ORM.model('template');
    employee = ORM.model('employee');
    client = ORM.model('client');
    revision = ORM.model('revision');
    field = ORM.model('field');
    dictionary = ORM.model('dictionary');
    return app.post(config.apiSubDir + '/v1/fields', function(req, res) {
      return async.series([
        function(callback) {
          return apiAuth(req, res, callback);
        }, function(callback) {
          var clientUid, employeeUid, insertMethod, maxLengthCheckHelper, minLengthCheckHelper, userType;
          userType = req.session.user.type;
          clientUid = req.session.user.clientUid;
          employeeUid = req.session.user.uid;
          minLengthCheckHelper = function(val, objectKey, object, callback) {
            var intVal;
            if (!_.isUndefined(val)) {
              intVal = parseInt(val, 10);
              if (_.isNaN(intVal) || intVal < 0) {
                return callback(null, {
                  success: false,
                  message: {
                    openResponseMinLength: 'invalid'
                  }
                });
              } else {
                return callback(null, {
                  success: true,
                  transform: [objectKey, 'openResponseMinLength', intVal]
                });
              }
            } else {
              return callback(null, {
                success: true,
                transform: [objectKey, 'openResponseMinLength', 0]
              });
            }
          };
          maxLengthCheckHelper = function(val, objectKey, object, callback) {
            var intVal;
            if (!_.isUndefined(val)) {
              intVal = parseInt(val, 10);
              if (_.isNaN(intVal) || intVal < 1) {
                return callback(null, {
                  success: false,
                  message: {
                    openResponseMaxLength: 'invalid'
                  }
                });
              } else {
                return callback(null, {
                  success: true,
                  transform: [objectKey, 'openResponseMaxLength', intVal]
                });
              }
            } else {
              return callback(null, {
                success: true,
                transform: [objectKey, 'openResponseMaxLength', 100]
              });
            }
          };
          switch (userType) {
            case 'superAdmin':
              insertMethod = function(item, insertMethodCallback) {
                if (insertMethodCallback == null) {
                  insertMethodCallback = false;
                }
                return apiVerifyObjectProperties(this, field, item, req, res, insertMethodCallback, {
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
                    'type': function(val, objectKey, object, callback) {
                      if (!_.isUndefined(val)) {
                        return callback(null, {
                          success: true
                        });
                      } else {
                        return callback(null, {
                          success: false,
                          message: {
                            type: 'required'
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
                    'multiSelectCorrectRequirement': function(val, objectKey, object, callback) {
                      return callback(null, {
                        success: true
                      });
                    },
                    'percentageSliderLeft': function(val, objectKey, object, callback) {
                      return callback(null, {
                        success: true
                      });
                    },
                    'percentageSliderRight': function(val, objectKey, object, callback) {
                      return callback(null, {
                        success: true
                      });
                    },
                    'openResponseMinLength': function(val, objectKey, object, callback) {
                      return minLengthCheckHelper(val, objectKey, object, callback);
                    },
                    'openResponseMaxLength': function(val, objectKey, object, callback) {
                      return maxLengthCheckHelper(val, objectKey, object, callback);
                    },
                    'clientUid': function(val, objectKey, object, callback) {
                      var testClientUid;
                      testClientUid = !_.isUndefined(object['clientUid']) ? object['clientUid'] : clientUid;
                      return callback(null, {
                        success: true,
                        transform: [objectKey, 'clientUid', testClientUid]
                      });
                    },
                    'dictionaryUid': function(val, objectKey, object, callback) {
                      var fieldType, testClientUid;
                      if (_.isUndefined(object['type'])) {
                        callback(null, {
                          success: false
                        });
                        return;
                      }
                      testClientUid = !_.isUndefined(object['clientUid']) ? object['clientUid'] : clientUid;
                      fieldType = object['type'];
                      switch (fieldType) {
                        case 'selectIndividual':
                          if (_.isUndefined(val)) {
                            callback(null, {
                              success: false,
                              message: {
                                dictionaryUid: 'required'
                              }
                            });
                            return;
                          }
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
                              return dictionary.find({
                                where: {
                                  clientUid: testClientUid,
                                  uid: val
                                }
                              }).success(function(resultDictionary) {
                                return callback(null, resultDictionary);
                              });
                            }
                          ], function(error, results) {
                            var mapObj, resultClient, resultDictionary;
                            resultClient = results[0];
                            resultDictionary = results[1];
                            if (!resultDictionary) {
                              callback(null, {
                                success: false,
                                message: {
                                  'dictionaryUid': 'unknown'
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
                            if (resultDictionary.clientUid !== resultClient.uid) {
                              callback(null, {
                                success: false,
                                message: {
                                  'groupUid': 'unknown'
                                }
                              });
                              return;
                            }
                            mapObj = {};
                            mapObj[resultDictionary.uid] = resultDictionary;
                            mapObj[resultClient.uid] = resultClient;
                            return callback(null, {
                              success: true,
                              uidMapping: mapObj
                            });
                          });
                        default:
                          return callback(null, {
                            success: false,
                            transform: [objectKey, 'dictionaryUid', null]
                          });
                      }
                    },
                    'groupUid': function(val, objectKey, object, callback) {
                      var testClientUid;
                      if (_.isUndefined(val)) {
                        callback(null, {
                          success: false,
                          message: {
                            groupUid: 'required'
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
                          return group.find({
                            where: {
                              clientUid: testClientUid,
                              uid: val
                            }
                          }).success(function(resultGroup) {
                            return callback(null, resultGroup);
                          });
                        }
                      ], function(error, results) {
                        var mapObj, resultClient, resultGroup;
                        resultClient = results[0];
                        resultGroup = results[1];
                        if (!resultGroup) {
                          callback(null, {
                            success: false,
                            message: {
                              'groupUid': 'unknown'
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
                        if (resultGroup.clientUid !== resultClient.uid) {
                          callback(null, {
                            success: false,
                            message: {
                              'groupUid': 'unknown'
                            }
                          });
                          return;
                        }
                        mapObj = {};
                        mapObj[resultGroup.uid] = resultGroup;
                        mapObj[resultClient.uid] = resultClient;
                        return callback(null, {
                          success: true,
                          uidMapping: mapObj
                        });
                      });
                    }
                  }
                }, function(objects) {
                  return insertHelper('fields', clientUid, field, objects, req, res, app, insertMethodCallback);
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
                return apiVerifyObjectProperties(this, field, item, req, res, insertMethodCallback, {
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
                    'type': function(val, objectKey, object, callback) {
                      if (!_.isUndefined(val)) {
                        return callback(null, {
                          success: true
                        });
                      } else {
                        return callback(null, {
                          success: false,
                          message: {
                            type: 'required'
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
                    'multiSelectCorrectRequirement': function(val, objectKey, object, callback) {
                      return callback(null, {
                        success: true
                      });
                    },
                    'percentageSliderLeft': function(val, objectKey, object, callback) {
                      return callback(null, {
                        success: true
                      });
                    },
                    'percentageSliderRight': function(val, objectKey, object, callback) {
                      return callback(null, {
                        success: true
                      });
                    },
                    'openResponseMinLength': function(val, objectKey, object, callback) {
                      return minLengthCheckHelper(val, objectKey, object, callback);
                    },
                    'openResponseMaxLength': function(val, objectKey, object, callback) {
                      return maxLengthCheckHelper(val, objectKey, object, callback);
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
                    'dictionaryUid': function(val, objectKey, object, callback) {
                      var fieldType, testClientUid;
                      if (_.isUndefined(object['type'])) {
                        callback(null, {
                          success: false
                        });
                        return;
                      }
                      testClientUid = clientUid;
                      fieldType = object['type'];
                      switch (fieldType) {
                        case 'selectIndividual':
                          if (_.isUndefined(val)) {
                            callback(null, {
                              success: false,
                              message: {
                                dictionaryUid: 'required'
                              }
                            });
                            return;
                          }
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
                              return dictionary.find({
                                where: {
                                  clientUid: testClientUid,
                                  uid: val
                                }
                              }).success(function(resultDictionary) {
                                return callback(null, resultDictionary);
                              });
                            }
                          ], function(error, results) {
                            var mapObj, resultClient, resultDictionary;
                            resultClient = results[0];
                            resultDictionary = results[1];
                            if (!resultDictionary) {
                              callback(null, {
                                success: false,
                                message: {
                                  'dictionaryUid': 'unknown'
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
                            if (resultDictionary.clientUid !== resultClient.uid) {
                              callback(null, {
                                success: false,
                                message: {
                                  'dictionaryUid': 'unknown'
                                }
                              });
                              return;
                            }
                            mapObj = {};
                            mapObj[resultDictionary.uid] = resultDictionary;
                            mapObj[resultClient.uid] = resultClient;
                            return callback(null, {
                              success: true,
                              uidMapping: mapObj
                            });
                          });
                        default:
                          return callback(null, {
                            success: false,
                            transform: [objectKey, 'dictionaryUid', null]
                          });
                      }
                    },
                    'groupUid': function(val, objectKey, object, callback) {
                      var testClientUid;
                      if (_.isUndefined(val)) {
                        callback(null, {
                          success: false,
                          message: {
                            groupUid: 'required'
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
                          return group.find({
                            where: {
                              clientUid: testClientUid,
                              uid: val
                            }
                          }).success(function(resultGroup) {
                            return callback(null, resultGroup);
                          });
                        }
                      ], function(error, results) {
                        var mapObj, resultClient, resultGroup;
                        resultClient = results[0];
                        resultGroup = results[1];
                        if (!resultGroup) {
                          callback(null, {
                            success: false,
                            message: {
                              'groupUid': 'unknown'
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
                        if (resultGroup.clientUid !== resultClient.uid) {
                          callback(null, {
                            success: false,
                            message: {
                              'groupUid': 'unknown'
                            }
                          });
                          return;
                        }
                        mapObj = {};
                        mapObj[resultGroup.uid] = resultGroup;
                        mapObj[resultClient.uid] = resultClient;
                        return callback(null, {
                          success: true,
                          uidMapping: mapObj
                        });
                      });
                    }
                  }
                }, function(objects) {
                  return insertHelper('fields', clientUid, field, objects, req, res, app, insertMethodCallback);
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