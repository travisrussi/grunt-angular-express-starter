'use strict';

(function() {

    angular.module('view.admin', [
        'app.auth',
        'ui.router'
    ])

        .config(function($stateProvider) {
            $stateProvider
                .state('admin', {
                    url: '/admin',
                    views: {
                        "main": {
                            templateUrl: 'admin/admin.tpl.html',
                            controller: 'AdminController'
                        }
                    },
                    data:{ pageTitle: 'Admin' },
                    controllerAs: 'admin',
                    authenticate: 'admin'
                });
        })

        .controller('AdminController', function AdminController($scope, User) {
            // Use the User $resource to fetch all users
            this.users = User.query();

            $scope.delete = function(user) {
                user.$remove();
                this.users.splice(this.users.indexOf(user), 1);
            };

        });

})();
