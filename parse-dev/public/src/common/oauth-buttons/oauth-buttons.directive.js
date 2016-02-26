'use strict';

angular.module('app.oauth')
  .directive('oauthButtons', function() {
    return {
      templateUrl: 'common/oauth-buttons/oauth-buttons.tpl.html',
      restrict: 'EA',
      controller: 'OauthButtonsCtrl',
      controllerAs: 'OauthButtons',
      scope: {
        classes: '@'
      }
    };
  });
