CRMApp.controller('_ClipMediaContent', ['$rootScope', '$scope', '$window', '$location', '$uibModalInstance',
    '$window', 'items', function ($rootScope, $scope, $window, $location, $uibModalInstance, $window, items) {
        $scope.url = items.ClipUrl;
        $scope.media_type = items.media_type;
        $scope.heading = items.heading;
        $scope.cancel = $scope.OK = function () {
        $uibModalInstance.close('cancel');
    };

}]);