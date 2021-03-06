/**
 * HABmin - Home Automation User and Administration Interface
 * Designed for openHAB (www.openhab.com)
 *
 * This software is copyright of Chris Jackson under the GPL license.
 * Note that this licence may be changed at a later date.
 *
 * (c) 2014-2016 Chris Jackson (chris@cd-jackson.com)
 */
angular.module('HABmin.configModel', [
    'HABmin.userModel',
    'HABmin.restModel'
])
    .service('ConfigModel', function ($http, $q, $rootScope, UserService, RestService) {
        var svcConfig = "config-descriptions";

        var me = this;

        this.getConfig = function (uri) {
            var tStart = new Date().getTime();
            var deferred = $q.defer();

            RestService.getService(svcConfig).then(
                function (url) {
                    $http.get(url + "/" + uri)
                        .success(function (data) {
                            deferred.resolve(data);
                        })
                        .error(function (data, status) {
                            deferred.reject(data);
                        });
                },
                function () {
                    deferred.reject(null);
                }
            );

            return deferred.promise;
        };

        this.putConfig = function (thing, cfg) {
            var tStart = new Date().getTime();
            var deferred = $q.defer();

            RestService.getService(svcConfig).then(
                function (url) {
                    $http.put(url + "/" + thing.UID + "/config", cfg)
                        .success(function (thing) {
                            me.addOrUpdateThing(thing);
                            deferred.resolve(thing);
                        })
                        .error(function (data, status) {
                            deferred.reject(data);
                        });
                },
                function () {
                    deferred.reject(null);
                }
            );

            return deferred.promise;
        };

        function _convertType(type, value) {
            switch (type) {
                case "INTEGER":
                    if (value == null) {
                        return 0;
                    }
                    return Number(value);
                case "TEXT":
                    if (value == undefined) {
                        return "";
                    }
                    return value.toString();
                case "BOOLEAN":
                    if (value == undefined) {
                        return false;
                    }
                    return Boolean(value);
                case "DECIMAL":
                    if (value == undefined) {
                        return 0.0;
                    }
                    break;
            }
        }

        this.convertType = function (type, value, multiple) {
            if (multiple) {
                value = [].concat(value);
            }
            if (angular.isArray(value)) {
                angular.forEach(value, function (val) {
                    val = _convertType(type, val);
                });
            }
            else {
                value = _convertType(type, value);
            }

            return value;
        };

    })
;
