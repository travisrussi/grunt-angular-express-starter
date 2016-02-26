'use strict';

angular.module('view.account', [
  'ui.router',
  'app.auth'
])

  .config(function config( $stateProvider ) {
    $stateProvider
        .state( 'login', {
          url: '/login',
          views: {
            "main": {
              controller: 'LoginCtrl',
              templateUrl: 'account/login/login.tpl.html'
            }
          },
          data:{ pageTitle: 'Login' }
        })
        .state('logout', {
          url: '/logout?referrer',
          referrer: 'main',
          views: {
            "main": {
              template: '',
              controller: function($state, Auth) {
                var referrer = $state.params.referrer ||
                    $state.current.referrer ||
                    'main';
                Auth.logout();
                $state.go(referrer);
              }
            }
          },
          data:{ pageTitle: 'Logout' }
        })
        .state('signup', {
          url: '/signup',
          views: {
            "main": {
              templateUrl: 'account/signup/signup.tpl.html',
              controller: 'SignupCtrl'
            }
          },
          data:{ pageTitle: 'Sign Up' }
        })
        .state('settings', {
          url: '/settings',
          views: {
            "main": {
              templateUrl: 'account/settings/settings.tpl.html',
              controller: 'SettingsCtrl',
            }
          },
          authenticate: true,
          data:{ pageTitle: 'Settings' }
        });
  })
  .run(function($rootScope) {
    $rootScope.$on('$stateChangeStart', function(event, next, nextParams, current) {
      if (next.name === 'logout' && current && current.name && !current.authenticate) {
        next.referrer = current.name;
      }
    });
  });
