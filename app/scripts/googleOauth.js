'use strict';

/**
 * A module to include instead of `angularOauth` for a service preconfigured
 * for Google OAuth authentication.
 *
 * Guide: https://developers.google.com/accounts/docs/OAuth2UserAgent
 */
angular.module('googleOauth', ['angularOauth']).

  constant('GoogleTokenVerifier', function(config, accessToken) {
    var $injector = angular.injector(['ng']);
    return $injector.invoke(['$http', '$rootScope', '$q', function($http, $rootScope, $q) {
      var deferred = $q.defer();
      var verificationEndpoint = 'http://localhost:3000/oauth/authorize';

      $rootScope.$apply(function() {
        $http({method: 'GET', url: verificationEndpoint, params: {access_token: accessToken}}).
          success(function(data) {
            if (data.audience == config.clientId) {
              deferred.resolve(data);
            } else {
              deferred.reject({name: 'invalid_audience'});
            }
          }).
          error(function(data, status, headers, config) {
            deferred.reject({
              name: 'error_response',
              data: data,
              status: status,
              headers: headers,
              config: config
            });
          });
      });

      return deferred.promise;
    }]);
  }).

  config(function(TokenProvider, GoogleTokenVerifier) {
    console.log("loading googleOauth");
    TokenProvider.extendConfig({
      authorizationEndpoint: 'http://localhost:3000/oauth/authorize',
      scopes: [""],
      verifyFunc: GoogleTokenVerifier
    });
  });

