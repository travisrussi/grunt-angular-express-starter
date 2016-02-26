angular.module('app.data')

    //internal data mapping between native object and Parse object
    .factory('Thing', ['Parse', function(Parse) {

        var Thing = Parse.Object.extend('Thing',
            {/*.. instance methods ..*/},
            {/*.. class methods ..*/});

        // Name property
        Object.defineProperty(Thing.prototype, 'name', {
            get: function() { return this.get('name'); },
            set: function(val) { this.set('name', val); }
        });

        return Thing;
    }])

    .factory('ThingService', function($rootScope, $q, $timeout, Auth, Thing){

        var ParseService = {

            getThing : function (id) {
                $rootScope.isLoaderVisible = true;

                var d = $q.defer();

                var queryThing = new Parse.Query(Thing);
                queryThing.equalTo('objectId', id);
                queryThing.find().then(function (data) {
                  $rootScope.isLoaderVisible = false;
                  $timeout(function () {
                    if (data && data.length == 1) {
                      d.resolve(data[0]);
                    } else {
                      d.reject('not found');
                    }
                  }, 100);
                }, function (error) {
                    $rootScope.isLoaderVisible = false;
                    $timeout(function () {
                      d.reject(error);
                    }, 100);
                });
                return d.promise;
            },


            getThings : function (filter) {
                $rootScope.isLoaderVisible = true;

                var d = $q.defer();

                var queryThing = new Parse.Query(Thing);

                if (filter) {
                    if (filter.name) {
                        queryThing.contains('name', filter.name);
                    }
                }

                queryThing.find().then(function (data) {
                  $rootScope.isLoaderVisible = false;
                  $timeout(function () {
                    d.resolve(data);
                  }, 100);
                }, function (error) {
                  $rootScope.isLoaderVisible = false;
                  $timeout(function () {
                    d.reject(error);
                  }, 100);
                });
                return d.promise;
            },

            insertThing : function (data) {
                $rootScope.isLoaderVisible = true;

                var d = $q.defer();

                var thing = new Thing();

                var currentUser = Auth.getCurrentUser();
                if (currentUser) {
                    //private to user
                    //thing.setACL(new Parse.ACL(currentUser));

                    //private write, public read
                    var acl = new Parse.ACL(currentUser);
                    acl.setPublicReadAccess(true);
                    thing.setACL(acl);
                }

                thing.set("name", data.name);

                thing.save(null, {
                    success: function(data) {
                      $rootScope.isLoaderVisible = false;
                      $timeout(function () {
                        d.resolve(data);
                      }, 100);
                    },
                    error: function(Thing, error) {
                      $rootScope.isLoaderVisible = false;
                      $timeout(function () {
                        d.reject(error);
                      }, 100);
                    }
                });

                return d.promise;
            },

            updateThing : function(thing) {
                $rootScope.isLoaderVisible = true;

                var d = $q.defer();

                thing.save(null, {
                    success: function(data) {
                      $rootScope.isLoaderVisible = false;
                      $timeout(function () {
                        d.resolve(data);
                      }, 100);
                    },
                    error: function(Thing, error) {
                      $rootScope.isLoaderVisible = false;
                      $timeout(function () {
                        d.reject(error);
                      }, 100);
                    }
                });

                return d.promise;
            },

            deleteThing: function(thing) {
                $rootScope.isLoaderVisible = true;

                var d = $q.defer();

                thing.destroy({
                    success: function(data) {
                      $rootScope.isLoaderVisible = false;
                      $timeout(function () {
                        d.resolve(data);
                      }, 100);
                    },
                    error: function(myObject, error) {
                      $rootScope.isLoaderVisible = false;
                      $timeout(function () {
                        d.reject(error);
                      }, 100);
                    }
                });

                return d.promise;
            }

        };

        return ParseService;
    })

;
