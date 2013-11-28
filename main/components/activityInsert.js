// Generated by CoffeeScript 1.6.3
(function() {
  var ORM, activity, async, config, sequelize, uuid, _;

  _ = require('underscore');

  async = require('async');

  uuid = require('node-uuid');

  config = require(GLOBAL.appRoot + 'config/config');

  ORM = require(GLOBAL.appRoot + 'components/oRM');

  sequelize = ORM.setup();

  activity = ORM.model('activity');

  module.exports = function(insertObj, app, req) {
    var asyncMethods, checkMethodHelper;
    if (_.isUndefined(insertObj['type']) || (activity.rawAttributes['type'].values.indexOf(insertObj['type']) === -1)) {
      throw new Error('invalid activity type');
    }
    if (_.isUndefined(insertObj['clientUid']) || !_.isString(insertObj['clientUid'])) {
      throw new Error('clientUid activity property requried');
    }
    asyncMethods = [];
    asyncMethods.push(function(callback) {
      var client;
      client = ORM.model('client');
      return client.find({
        where: {
          uid: insertObj['clientUid']
        }
      }).success(function(clientResult) {
        if (clientResult && !_.isUndefined(clientResult.id)) {
          insertObj['clientId'] = clientResult.id;
          return callback(null, true);
        } else {
          return callback(new Error('invalid clientUid'));
        }
      });
    });
    checkMethodHelper = function(type) {
      if (!_.isUndefined(insertObj[type + 'Uid'])) {
        return asyncMethods.push(function(callback) {
          var resource;
          resource = ORM.model(type);
          return resource.find({
            where: {
              uid: insertObj[type + 'Uid']
            }
          }).success(function(result) {
            if (result && !_.isUndefined(result.id) && result.clientUid === insertObj['clientUid']) {
              insertObj[type + 'Id'] = result.id;
              return callback(null, true);
            } else {
              return callback(new Error('invalid ' + type + 'Uid'));
            }
          });
        });
      }
    };
    checkMethodHelper('template');
    checkMethodHelper('revision');
    checkMethodHelper('dictionary');
    checkMethodHelper('dictionaryItem');
    checkMethodHelper('employee');
    checkMethodHelper('event');
    return async.parallel(asyncMethods, function(err, results) {
      if (err) {
        console.log('activity create error: ');
        console.log(err);
        return;
      }
      insertObj['uid'] = uuid.v4();
      return activity.create(insertObj).success(function(activityObj) {
        activityObj = JSON.parse(JSON.stringify(activityObj));
        activityObj.readState = true;
        return sequelize.query("INSERT INTO activitiesReadState VALUES (NULL, \'" + activityObj.employeeUid + "\', \'" + activityObj.uid + "\', \'" + activityObj.clientUid + "\')", null, {
          raw: true
        }).done(function(err, queryResults) {
          var roomName;
          if (!_.isUndefined(req) && !_.isUndefined(req.io) && _.isFunction(req.io.join)) {
            if (!_.isUndefined(req.session) && !_.isUndefined(req.session.user) && !_.isUndefined(req.session.user.clientUid)) {
              req.io.join(activityObj.uid);
              req.io.join(req.session.user.uid + '-' + activityObj.uid);
            }
          }
          roomName = activityObj.clientUid + '-postResources';
          return app.io.room(roomName).broadcast('resourcePost', {
            apiCollectionName: 'activities',
            resourceName: 'activity',
            resource: JSON.parse(JSON.stringify(activityObj))
          });
        });
      });
    });
  };

}).call(this);
