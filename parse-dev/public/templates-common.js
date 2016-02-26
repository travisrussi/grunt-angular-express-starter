angular.module('templates-common', ['common/modal/modal.delete.tpl.html', 'common/navbar/navbar.tpl.html', 'common/oauth-buttons/oauth-buttons.tpl.html']);

angular.module("common/modal/modal.delete.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/modal/modal.delete.tpl.html",
    "\n" +
    "<div class=\"modal-header\">\n" +
    "    <h3 class=\"modal-title\">Delete Confirmation</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <p ng-show=\"!data.name && !data.message\">Are you sure you want to delete this item?</p>\n" +
    "    <p ng-show=\"data.name\">Are you sure you want to delete {{data.name}}?</p>\n" +
    "    <p ng-show=\"data.message\">{{data.message}}</p>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-primary\" type=\"button\" ng-click=\"ok()\">Yes, Delete</button>\n" +
    "    <button class=\"btn btn-warning\" type=\"button\" ng-click=\"cancel()\">Cancel</button>\n" +
    "</div>");
}]);

angular.module("common/navbar/navbar.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/navbar/navbar.tpl.html",
    "<div class=\"navbar navbar-default navbar-static-top\" ng-controller=\"NavbarCtrl\">\n" +
    "  <div class=\"container\">\n" +
    "    <div class=\"navbar-header\">\n" +
    "      <button class=\"navbar-toggle\" type=\"button\" ng-click=\"isCollapsed = !isCollapsed\">\n" +
    "        <span class=\"sr-only\">Toggle navigation</span>\n" +
    "        <span class=\"icon-bar\"></span>\n" +
    "        <span class=\"icon-bar\"></span>\n" +
    "        <span class=\"icon-bar\"></span>\n" +
    "      </button>\n" +
    "      <a href=\"/\" class=\"navbar-brand\">KISS-Parse</a>\n" +
    "    </div>\n" +
    "    <div collapse=\"isCollapsed\" class=\"navbar-collapse collapse\" id=\"navbar-main\">\n" +
    "      <ul class=\"nav navbar-nav\">\n" +
    "        <li ng-repeat=\"item in menu\" ui-sref-active=\"active\">\n" +
    "            <a ui-sref=\"{{item.state}}\">{{item.title}}</a>\n" +
    "        </li>\n" +
    "        <li ng-show=\"isAdmin\" ui-sref-active=\"active\"><a ui-sref=\"admin\">Admin</a></li>\n" +
    "      </ul>\n" +
    "\n" +
    "      <ul class=\"nav navbar-nav navbar-right\" style=\"margin-right:15px;\">\n" +
    "        <li ng-hide=\"isLoggedIn()\" ui-sref-active=\"active\"><a ui-sref=\"signup\">Sign up</a></li>\n" +
    "        <li ng-hide=\"isLoggedIn()\" ui-sref-active=\"active\"><a ui-sref=\"login\">Login</a></li>\n" +
    "        <li ng-show=\"isLoggedIn()\"><p class=\"navbar-text\">Hello {{ getCurrentUser().get('name') }}</p> </li>\n" +
    "        <li ng-show=\"isLoggedIn()\" ui-sref-active=\"active\"><a ui-sref=\"settings\"><span class=\"glyphicon glyphicon-cog\"></span></a></li>\n" +
    "        <li ng-show=\"isLoggedIn()\"><a ui-sref=\"logout\">Logout</a></li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("common/oauth-buttons/oauth-buttons.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/oauth-buttons/oauth-buttons.tpl.html",
    "<a ng-class=\"classes\" ng-click=\"OauthButtons.loginOauth('facebook')\" class=\"btn btn-social btn-facebook\">\n" +
    "  <i class=\"fa fa-facebook\"></i>\n" +
    "  Connect with Facebook\n" +
    "</a>\n" +
    "<a ng-class=\"classes\" ng-click=\"OauthButtons.loginOauth('google')\" class=\"btn btn-social btn-google\">\n" +
    "  <i class=\"fa fa-google-plus\"></i>\n" +
    "  Connect with Google+\n" +
    "</a>\n" +
    "<a ng-class=\"classes\" ng-click=\"OauthButtons.loginOauth('twitter')\" class=\"btn btn-social btn-twitter\">\n" +
    "  <i class=\"fa fa-twitter\"></i>\n" +
    "  Connect with Twitter\n" +
    "</a>\n" +
    "");
}]);
