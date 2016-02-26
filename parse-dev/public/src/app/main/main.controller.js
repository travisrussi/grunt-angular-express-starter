'use strict';

(function() {

    angular.module('view.main', [
        'ui.router',
        'app.data'
    ])

        .config(function config( $stateProvider ) {
            $stateProvider.state( 'main', {
                url: '/main',
                views: {
                    "main": {
                        controller: 'MainController',
                        templateUrl: 'main/main.tpl.html'
                    }
                },
                data:{ pageTitle: 'Main' }
            });
        })

        .controller('MainController', function MainController($scope, $q, $log, growl, ModalService, ThingService) {
            $scope.awesomeThings = [];
            $scope.newThing = null;
            $scope.currentThing = null;
            $scope.search = {
                name: ''
            };


            $scope.$on('$destroy', function() {
                //socket.unsyncUpdates('thing');
            });

            $scope.clickAddNew = function() {
                $scope.newThing = {};
                return false;
            };

            $scope.setCurrentThing = function(thing) {
                $scope.currentThing = thing;
                return false;
            };

            $scope.resetThing = function(thing) {
                ThingService.getThing(thing.id).then(
                    function (data) {
                        for(var i = 0; i < $scope.awesomeThings.length; i++) {
                            if ($scope.awesomeThings[i].id == data.id) {
                                $scope.awesomeThings[i] = data;
                                break;
                            }
                        }
                    })
                    .catch(function (error) {
                        growl.error('Unable to reset the thing');
                        $log.error('error resetting article: ' + error || '');
                    });

                $scope.resetView();
                return false;
            }

            $scope.addThing = function() {
                if ($scope.newThing) {

                    ThingService.insertThing($scope.newThing) // { name: this.newThing })
                        .then(function (data) {
                            $scope.awesomeThings.push(data);
                            $scope.resetView(true);
                            growl.success("Thing added successfully!")
                        })
                        .catch(function (error) {
                            growl.error('Unable to add new thing');
                            $log.error('error inserting article: ' + error || '');
                        });
                }
            };

            $scope.updateThing = function() {
                if ($scope.currentThing) {

                    ThingService.updateThing($scope.currentThing)
                        .then(function (data) {
                            for(var i = 0; i < $scope.awesomeThings.length; i++) {
                                if ($scope.awesomeThings[i].id == data.id) {
                                    $scope.awesomeThings[i] = data;
                                    break;
                                }
                            }
                            $scope.resetView();
                            growl.success("Thing updated successfully!")
                        })
                        .catch(function (error) {
                            growl.error('Unable to update thing');
                            $log.error('error updating article: ' + error || '');
                            $scope.resetThing($scope.currentThing);
                        });
                }
            };

            $scope.deleteThing = function(thing) {
                if (thing) {

                    ModalService.showDelete(null, thing.name).then(function () {
                        //confirmed, do delete
                        ThingService.deleteThing(thing)
                            .then(function (data) {
                                for(var i = 0; i < $scope.awesomeThings.length; i++) {
                                    if ($scope.awesomeThings[i].id == data.id) {
                                        $scope.awesomeThings.splice(i,1);
                                        break;
                                    }
                                }
                                $scope.resetView(true);
                                growl.success("Thing deleted successfully!");
                            })
                            .catch(function (error) {
                                growl.error("Unable to delete thing");
                                $log.error('error deleting article: ' + error || '');
                            });
                    }, function () {
                        //cancelled, reset view
                        //$scope.resetView();
                    });
                }

                return false;
            };

            $scope.resetView = function(bResetSearch) {
                $scope.newThing = null;
                $scope.currentThing = null;

                if (bResetSearch) {
                    $scope.search = {
                        name: ''
                    };
                }
            };

            $scope.$watch('search.name', function(newVal, oldVal) {
                if (newVal == oldVal) return;

                loadThings($scope.search).then(function() {

                }, function() {

                });
            });


            function loadThings(searchTerm) {
                var d = $q.defer();
                ThingService.getThings(searchTerm)
                    .then(function (data) {
                        $scope.awesomeThings = data;
                        $log.info('loaded ' + data.length + ' things successfully');
                        d.resolve(data);
                    })
                    .catch(function (error) {
                        growl.error("Unable to load things");
                        $log.error('error getting article: ' + error || '');
                        d.reject(error);
                    });
                return d.promise;
            }

            loadThings();
        })

})();
