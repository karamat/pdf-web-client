'use strict';

angular.module('testingClientApp')
  .service('dataService', function () {
    var token = 0 ;
    return {
        setToken:function (key) {
          token = key;
        },
        getToken:function () {
          return token;
        }
    };
  })