angular.module('app.modal', [

])
    .factory("ModalService", function($uibModal) {

        var modalService = {

            showDelete: function(message, name) {
                return $uibModal.open({
                    animation: true,
                    templateUrl: "common/modal/modal.delete.tpl.html",
                    controller: "ModalController",
                    resolve: {
                        data: function () {
                            return {
                                message: message,
                                name: name
                            };
                        }
                    }
                }).result;
            }
        };

        return modalService;
    })

    .controller("ModalController", function ($scope, $uibModalInstance, data) {

        $scope.data = data;

        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })
;