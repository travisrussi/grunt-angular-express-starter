'use strict';

angular.module('angular-loader', [])
  .factory('httpInterceptor', function ($q, $rootScope, $log, $timeout) {
    var numLoadings = 0;
    return {
      request: function (config) {
        numLoadings++;
        // Show loader
        //$rootScope.$broadcast("loader_show");
        $rootScope.isLoaderVisible = true;
        return config || $q.when(config)
      },
      response: function (response) {
        if ((--numLoadings) === 0) {
          // Hide loader
          //$rootScope.$broadcast("loader_hide");
          $rootScope.isLoaderVisible = false;
        }
        return response || $q.when(response);
      },
      responseError: function (response) {
        if (!(--numLoadings)) {
          // Hide loader
          //$rootScope.$broadcast("loader_hide");
          $rootScope.isLoaderVisible = false;
        }
        return $q.reject(response);
      }
    };
  })
  .config(function ($httpProvider) {
    //$httpProvider.interceptors.push('httpInterceptor');
  })
  .directive("loader", function ($rootScope, $timeout) {
    var _isLoaderVisible = false;
    $rootScope.$watch("isLoaderVisible", function (newVal, oldVal) {
      var val;
      if (newVal != oldVal && typeof (newVal) != "undefined") {
        _isLoaderVisible = newVal;
        if (newVal) {
          $rootScope.$broadcast("loader_show");
        } else {
          $timeout(function () {
            $rootScope.$broadcast("loader_hide");
          }, 100);
        }
      }
    });

    return function ($scope, element, attrs) {
      $scope.$on("loader_show", function () {
        _isLoaderVisible = true;
        return element.css("display", "block");
      });
      return $scope.$on("loader_hide", function () {
        _isLoaderVisible = false;
        return element.css("display", "none");
      });
    };
  })

;
