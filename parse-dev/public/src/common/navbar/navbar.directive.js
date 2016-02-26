'use strict';

angular.module('app.navbar')
  .directive('navbar', function () {
    return {
      templateUrl: 'common/navbar/navbar.tpl.html',
      restrict: 'E',
      controller: 'NavbarCtrl'
    };
  });
