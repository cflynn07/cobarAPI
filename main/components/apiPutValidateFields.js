// Generated by CoffeeScript 1.6.3
(function() {
  var ORMValidateFieldsHelper, async, config, preventUnknownFieldsHelper, uuid, _;

  _ = require('underscore');

  async = require('async');

  uuid = require('node-uuid');

  config = require(GLOBAL.appRoot + 'config/config');

  ORMValidateFieldsHelper = require(GLOBAL.appRoot + 'components/oRMValidateFieldsHelper');

  preventUnknownFieldsHelper = require(GLOBAL.appRoot + 'components/preventUnknownFieldsHelper');

  module.exports = function(scope, resourceModel, putObjects, req, res, requirements) {
    /*
    First iterate over all the properties of all the objects and verify that all required fields are present
    Also build an array of callbacks to test each required field
    */

    var objectValidationErrors, uidMappings, unknownProperties;
    if (!_.isArray(putObjects)) {
      putObjects = [putObjects];
    }
    unknownProperties = preventUnknownFieldsHelper(resourceModel, putObjects, requirements);
    if (unknownProperties.length > 0) {
      res.jsonAPIRespond(_.extend(config.errorResponse(400), {
        messages: unknownProperties
      }));
      return;
    }
    objectValidationErrors = ORMValidateFieldsHelper(putObjects, resourceModel);
    if (objectValidationErrors.length > 0) {
      res.jsonAPIRespond(_.extend(config.errorResponse(400), {
        messages: objectValidationErrors
      }));
      return;
    }
    uidMappings = {};
    return async.series([
      function(superCallback) {
        var key, object, propertyAsyncMethods, propertyName, propertyValueCheckCallback, valueToTest, _fn, _i, _len, _ref;
        propertyAsyncMethods = [];
        for (key = _i = 0, _len = putObjects.length; _i < _len; key = ++_i) {
          object = putObjects[key];
          _ref = requirements.requiredProperties;
          _fn = function(valueToTest, propertyValueCheckCallback, scope, objectKey, object) {
            return propertyAsyncMethods.push(function(callback) {
              return propertyValueCheckCallback.call(scope, valueToTest, objectKey, object, callback);
            });
          };
          for (propertyName in _ref) {
            propertyValueCheckCallback = _ref[propertyName];
            valueToTest = object[propertyName];
            _fn(valueToTest, propertyValueCheckCallback, scope, key, object);
          }
        }
        return async.parallel(propertyAsyncMethods, function(err, results) {
          var errorMessages, mappingId, mappingUid, val, _j, _len1, _ref1;
          errorMessages = [];
          for (_j = 0, _len1 = results.length; _j < _len1; _j++) {
            val = results[_j];
            if (val.success === false) {
              if (val.message) {
                errorMessages.push(val.message);
              }
            } else {
              if (_.isObject(val.mapping)) {
                _ref1 = val.mapping;
                for (mappingUid in _ref1) {
                  mappingId = _ref1[mappingUid];
                  uidMappings[mappingUid] = mappingId;
                }
              }
            }
            if (_.isArray(val.transform)) {
              putObjects[val.transform[0]][val.transform[1]] = val.transform[2];
            }
          }
          if (errorMessages.length > 0) {
            res.jsonAPIRespond(_.extend(config.errorResponse(400), {
              messages: errorMessages
            }));
            superCallback(new Error('object property test failed'));
            return;
          }
          return superCallback(null, uidMappings);
        });
      }, function(superCallback) {
        res.jsonAPIRespond({
          code: 202,
          message: config.apiResponseCodes[202]
        });
        return;
        return async.map(putObjects, function(item, callback) {
          return resourceModel.find({
            where: {
              uid: item.uid
            }
          }).success(function(model) {
            return model.updateAttributes(item).success(function() {
              return callback();
            });
          });
        }, function(err, results) {
          return res.jsonAPIRespond({
            code: 202,
            message: config.apiResponseCodes[202]
          });
        });
      }
    ]);
  };

}).call(this);
