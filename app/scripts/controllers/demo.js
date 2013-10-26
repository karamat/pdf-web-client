'use strict';


angular.module('testingClientApp').

  config(function(TokenProvider) {
    console.log("TokenProvider");
    // Demo configuration for the "angular-oauth demo" project on Google.
    // Log in at will!

    // Sorry about this way of getting a relative URL, powers that be.
    var baseUrl = document.URL.replace(/#\/demo.*/, '');

    TokenProvider.extendConfig({
      clientId: '025b11cb1c843da7cdc1f86d940220ce686545d2255891ba90cfb82ba3ac2fba',
      redirectUri: baseUrl + 'views/callback.html',  // allow lunching demo from a mirror
      scopes: [""]
    });
  }).

  controller('DemoCtrl', function($rootScope, $scope, $window, Token) {
    $scope.accessToken = Token.get();
    console.log("aaa");

    $scope.authenticate = function() {
      var extraParams = $scope.askApproval ? {approval_prompt: 'force'} : {};
      Token.getTokenByPopup(extraParams)
        .then(function(params) {
          // Success getting token from popup.
          console.log(params);
          console('Success');

          // Verify the token before setting it, to avoid the confused deputy problem.
          Token.verifyAsync(params.access_token).
            then(function(data) {
              $rootScope.$apply(function() {
                $scope.accessToken = params.access_token;
                $scope.expiresIn = params.expires_in;

                Token.set(params.access_token);
              });
            }, function() {
              alert("Failed to verify token.")
            });

        }, function() {
          // Failure getting token from popup.
          alert("Failed to get token from popup.");
        });
    };
  });
