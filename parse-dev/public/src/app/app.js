angular.module( 'ngBoilerplate', [
  'templates-app',
  'templates-common',
  'view.home',
  'view.main',
  'view.about',
  'view.account',
  'view.admin',
  // MENU ITEM BEGIN
  // MENU ITEM END
  'app.constants',
  'app.data',
  'app.auth',
  'app.navbar',
  'app.modal',
  'app.oauth',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'validation.match',
  //'ngParse',
  'angular-growl',
  'angular-loader'
])

  .config( function myAppConfig ( $stateProvider, $urlRouterProvider, growlProvider) {
    $urlRouterProvider.otherwise( '/main' );

    growlProvider.globalTimeToLive({ success: 2000, error: 3000, warning: 3000, info: 4000 });
    growlProvider.globalDisableCountDown(true);

    //ParseProvider.initialize('LopRCYZIRLtfjpLKlrJcDgVOiRwYiK9KQWueasww', 'pcMSZh7qnjS3DHRDsbv3WeocJZIOtr7RrTnDzjO2');

  })

  .run( function run ($rootScope, $timeout) {

    $rootScope.loaderDelay = 500;
    $rootScope.isLoaderVisible = false;
    $rootScope.showLoader = function () {
      if (!$rootScope.isLoaderVisible) {
        $timeout(function () {
          $rootScope.isLoaderVisible = true;
        }, 10);
      }
    };
    $rootScope.hideLoader = function (delay) {
      if ($rootScope.isLoaderVisible) {
        $timeout(function () {
          $rootScope.isLoaderVisible = false;
        }, delay === false ? 10 : $rootScope.loaderDelay);
      }
    };
  })

  .controller( 'AppCtrl', function AppCtrl ( $scope, $location, Auth, appConfig ) {
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
      if ( angular.isDefined( toState.data && toState.data.pageTitle ) ) {
        $scope.pageTitle = toState.data.pageTitle + ' | ngBoilerplate' ;
      }
    });
  })

  .directive('ngEnter', function () {
    return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
        if (event.which === 13) {
          scope.$apply(function () {
            scope.$eval(attrs.ngEnter);
          });

          event.preventDefault();
        }
      });
    };
  })

;

