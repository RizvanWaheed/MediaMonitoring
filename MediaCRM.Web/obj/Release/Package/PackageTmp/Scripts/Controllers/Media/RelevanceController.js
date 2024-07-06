CRMApp.controller('RelevanceController', ['$rootScope', '$scope', '$window', '$location', '$stateParams', 'MediaService', 'GlobalService', 'notify'
    , function ($rootScope, $scope, $window, $location, $stateParams, MediaService, GlobalService, notify) {
    
    $scope.init = function () {
        $scope.LoadRelevances();
    };
    
    $scope.example5customTexts = { buttonDefaultText: 'Please Select' };
    $scope.RelevanceName = "";
    $scope.PageNumber = 0;
    $scope.Id = 0;
    $scope.RelevanceList = new Array();
    $scope.errorMsg = "";
    
    $scope.groupsettings = {
        selectionLimit: 1,
        closeOnSelect: true,
        smartButtonMaxItems: 2,
        smartButtonTextConverter: function (itemText, originalItem) {
            return itemText;
        }
    }

    $scope.LoadRelevances = function () {
        $scope.RelevanceList = new Array();        
        MediaService.GetRelevancesByPage($scope.PageNumber).then(function (l) {
            if (l != null) {
                $scope.RelevanceList.push.apply($scope.RelevanceList,l.data);
            }            
        }, function (err) {
            GlobalService.ErrorPopup("Error", 'Error in fetching, please try again.');
            console.log(err);
        });
    };

        $scope.AddorUpdateRelevanceType = function () {
        $scope.errorMsg = "";
        if ($scope.RelevanceName == "") {
            $scope.errorMsg = "Please enter Relevance Name";
            return;
        }
        var name = $scope.RelevanceName;
        
            MediaService.SaveRelavance($scope.Id, name)
                .then(function (l) {
            if (l != null) {
                var response = l.data;
                if (response) {
                    var msg = $scope.Id > 0 ? "Relevance edited successfully" : "Relevance saved successfully";
                    notify({
                        message: msg,
                        position: GlobalService.position,
                        duration: GlobalService.duration
                    });
                    $scope.Id = 0;
                    $scope.RelevanceName = "";
                    $scope.PageNumber = 0;
                    $scope.RelevanceList = new Array();
                    $scope.LoadRelevances();
                }
                else {
                    notify({
                        message: "Relevance saved failed",
                        position: GlobalService.position,
                        duration: GlobalService.duration
                    });
                }
                
            }
        }, function (err) {
            GlobalService.ErrorPopup("Error", 'Error in fetching, please try again.');
            console.log(err);
        });

    };

    $scope.GetStyle = function (index) {
        return index % 2 == 0 ? "" : "at_blkk";
    };

    $scope.deleteNewsType = function (id) {
        GlobalService.ConfirmPopup("Confirm", "Are you sure you want to delete?", function (selectedItem) {
            if (selectedItem) {
                MediaService.DeleteRelavance(id).then(function (l) {
                    var response = l.data;
                    if (response) {
                        notify({
                            message: "Relevance deleted successfully",
                            position: GlobalService.position,
                            duration: GlobalService.duration
                        });
                        $scope.RelevanceList = new Array();
                        $scope.PageNumber = 0;
                        $scope.LoadRelevances();
                    }
                    else {
                        notify({
                            message: "Relevance Type deleted failed",
                            position: GlobalService.position,
                            duration: GlobalService.duration
                        });
                    }
                }, function (err) {
                    GlobalService.ErrorPopup("Error", err.data.Message);
                });
            }
        });
    }

    $scope.editChannel = function (id) {
        var channel = $.grep($scope.RelevanceList, function (a) {
            return a.Id == id;
        });
        if (channel) {
            $scope.Id = channel[0].Id;
            $scope.RelevanceName = channel[0].Name;
        }
    }

    $scope.loadMoreChannels = function () {
        $scope.PageNumber++;
        $scope.LoadRelevances();
    };

    if ($rootScope.UserObject != undefined)
        $scope.init();
}]);