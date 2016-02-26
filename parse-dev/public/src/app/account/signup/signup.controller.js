'use strict';

angular.module('view.account')

  .controller('SignupCtrl', function($scope, Auth, $state) {
    $scope.user = {};
    $scope.errors = {};

    $scope.register = function(form) {
      $scope.submitted = true;

      if (form.$valid) {
        Auth.createUser({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then(function() {
          // Account created, redirect to home
          $state.go('main');
        })
        .catch(function(err) {
            $scope.errors = {};

            $scope.errors.other = err.message;
            //form['email'].$setValidity('mongoose', false);
            //$scope.errors['email'] = err.message;
        });
      }
    };

  });
