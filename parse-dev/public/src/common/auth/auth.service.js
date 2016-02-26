'use strict';

(function() {

    angular.module('app.auth', [
        'app.constants',
        'app.util',
        'ngCookies',
        'ui.router'
    ])
        .config(function($httpProvider) {
            $httpProvider.interceptors.push('authInterceptor');
        })

        .factory('Auth', function AuthService($location, $http, $cookies, $q, $timeout, $rootScope, appConfig, Util, User) {
            //var safeCb = Util.safeCb;
            var currentUser = Parse.User.current();

            function setupCurrentUser(user, loadRoles) {
                currentUser = user || Parse.User.current();

                if (currentUser) {
                    currentUser.setACL(new Parse.ACL(currentUser));

                    if (loadRoles) {
                        Auth.loadRoles();
                    }
                }
            }

            var Auth = {

                /**
                 * Authenticate user and save token
                 *
                 * @param  {Object}   user     - login info
                 * @return {Promise}
                 */
                login: function(user) {

                    var d = $q.defer();
                    Parse.User.logIn(user.email, user.password, {
                        success: function (user) {
                            setupCurrentUser(user, true);
                            return d.resolve(user);
                        },
                        error: function (user, error) {
                            Auth.logout();
                            return d.reject(error);
                        }
                    });

                    return d.promise;
                },

                /**
                 * Delete access token and user info
                 */
                logout: function() {
                    Parse.User.logOut();
                    currentUser  = Parse.User.current();

                    $timeout(function() {
                        $rootScope.isAdmin = false;
                    },100);
                },

                /**
                 * Create a new user
                 *
                 * @param  {Object}   user     - user info
                 * @return {Promise}
                 */
                createUser: function(user) {

                    var parseUser = new Parse.User();
                    parseUser.set("username", user.email);
                    parseUser.set("email", user.email);
                    parseUser.set("name", user.name);
                    parseUser.set("password", user.password);

                    var d = $q.defer();
                    parseUser.signUp(null, {
                        success: function(user) {
                            setupCurrentUser(user, true);
                            return d.resolve(user);
                        },
                        error: function(user, error) {
                            Auth.logout();
                            return d.reject(error);
                        }
                    });

                    return d.promise;
                },

                /**
                 * Change password
                 *
                 * @param  {String}   oldPassword
                 * @param  {String}   newPassword
                 * @return {Promise}
                 */
                changePassword: function(oldPassword, newPassword) {

                    var d = $q.defer();

                    if (currentUser == null || !currentUser.authenticated()) {
                        d.reject('currentUser is null');
                    } else {

                        //validate old password first
                        Parse.User.logIn(currentUser.get('email'), oldPassword, {
                            success: function (user) {
                                setupCurrentUser(user, false);

                                //now update the password
                                currentUser.set("password",newPassword);
                                currentUser.save()
                                    .then(
                                    function(user) {
                                        setupCurrentUser(user, true);
                                        return d.resolve(user);
                                    },
                                    function(error) {
                                        return d.reject(error);
                                    }
                                );
                            },
                            error: function (user, error) {
                                return d.reject(error);
                            }
                        });
                    }

                    return d.promise;
                },

                /**
                 * Gets all available info on a user
                 *   (synchronous|asynchronous)
                 *
                 * @return {Object}
                 */
                getCurrentUser: function() {
                    currentUser = currentUser || Parse.User.current();
                    return currentUser;
                },

                /**
                 * Check if a user is logged in
                 *   (synchronous)
                 *
                 * @return {Bool}
                 */
                isLoggedIn: function(callback) {
                    return currentUser != null ? currentUser.authenticated() : false;
                },

                /**
                 * Check if a user has a specified role or higher
                 *   (asynchronous)
                 *
                 * @param  {String}     role     - the role to check against
                 * @return {Promise}
                 */
                hasRole: function(role) {

                    var d = $q.defer();

                    if (!Auth.isLoggedIn() || currentUser == null) {
                        d.resolve(false);
                    } else if (currentUser != null && currentUser.roles != null && currentUser.roles[role] != null) {
                        d.resolve(currentUser.roles[role]);
                    } else {

                        currentUser.roles || (currentUser.roles = {});

                        var query = (new Parse.Query(Parse.Role));
                        query.equalTo("name", role);
                        query.equalTo("users", Auth.getCurrentUser());
                        query.first().then(
                            function (foundRole) {
                                var hasRole = foundRole && foundRole.getName ? foundRole.getName() == role : false;

                                if (currentUser != null && currentUser.roles != null) {
                                    currentUser.roles[role] = hasRole;

                                    $timeout(function() {
                                        if (role == 'admin') {
                                            $rootScope.isAdmin = hasRole;
                                        }
                                    },100);

                                    return d.resolve({ role: role, hasRole: hasRole });
                                } else {
                                    return d.reject('currentUser disappeared');
                                }
                            },
                            function (err) {
                                return d.reject(err);
                            });
                    }

                    return d.promise;
                },


                /**
                 * Check if a user is an admin
                 *   (synchronous)
                 *
                 * @return {Bool}
                 */
                isAdmin: function() {
                    var role = 'admin';

                    if (currentUser != null && currentUser.roles != null && currentUser.roles[role] != null) {
                        $rootScope.isAdmin = currentUser.roles[role];
                    } else {
                        $rootScope.isAdmin =  false;
                    }

                    return $rootScope.isAdmin;
                },

                /**
                 * Get auth token
                 *
                 * @return {String} - a token string used for authenticating
                 */
                getToken: function() {
                    return $cookies.get('token');
                },

                /**
                 * Load all roles for the current user
                 */
                loadRoles: function() {
                    if (!Auth.isLoggedIn() || currentUser == null) return;

                    //clear out all roles
                    currentUser.roles = {};

                    //test to see which roles the user has
                    var userRoles = appConfig.userRoles || [];
                    for(var i = 0; i < userRoles.length; i++) {
                        Auth.hasRole(userRoles[i]);
                    }
                }
            };

            //load all roles for the current user on initial page load
            Auth.loadRoles();

            return Auth;
        });

})();
