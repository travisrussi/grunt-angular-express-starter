'use strict';

angular.module('app.navbar', [
  'ui.router'
])
    .controller('NavbarCtrl', function ($rootScope, $scope, $timeout, Auth) {
      $scope.menu = [{
        'title': 'Home',
        'state': 'main'
      }];

      // MENU ITEM BEGIN
      // MENU ITEM END

      $scope.isCollapsed = false;
      $scope.isLoggedIn = Auth.isLoggedIn;
      $scope.getCurrentUser = Auth.getCurrentUser;

      $scope.isAdmin = false; //set initial value to false
      $rootScope.$watch('isAdmin', function(newVal, oldVal) { //monitor any updates between page loads
        if (oldVal == newVal) return;
        $scope.isAdmin = newVal;
      })


    });





