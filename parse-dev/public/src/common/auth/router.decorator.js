'use strict';

(function() {

  angular.module('app.auth')

  .config(function routerDecorator($stateProvider) {
      var authDecorator = function(state) {
        var auth = state.authenticate;
        if (auth) {
          state.resolve = state.resolve || {};
          state.resolve.user = function($state, $q, Auth) {
              var currentUser = Auth.getCurrentUser();
              if (typeof currentUser !== 'undefined' && currentUser.id) {

                  if (auth === true) {
                      return currentUser;
                  }

                  return Auth.hasRole(auth).then(function(hasRole) {
                      if (hasRole === true) {
                        return currentUser;
                      }

                      $state.go((currentUser) ? 'main' : 'login');
                      return $q.reject('not authorized');
                  });

              }
            //
            //return Auth.getCurrentUser()
            //    .then(function(user) {
            //      if ((typeof auth !== 'string' && user._id) ||
            //          (typeof auth === 'string' && Auth.hasRole(auth))) {
            //        return user;
            //      }
            //      $state.go((user._id) ? 'main' : 'login');
            //      return $q.reject('not authorized');
            //    });
          };
        }
      };

      $stateProvider.decorator('authenticate', function(state) {
        authDecorator(state);
        return state.authenticate;
      });
    });

})();
