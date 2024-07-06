
CRMApp.controller('ePaperSettingController', ['$rootScope', '$scope', '$window', '$location', '$stateParams', 'EPaperService', 'GlobalService', 'notify',
    function ($rootScope, $scope, $window, $location, $stateParams, EPaperService, GlobalService, notify) {
        $scope.NewpaperDateFormat = "";
        $scope.NewspaperName = "";
        $scope.Id = 0;
        $scope.buttonText ="Save";
        $scope.init = function () {
            EPaperService.LoadConfiguredEpaper().then(function (s) {
                //plot data
                $scope.ConfiguredEpapers = s.data;
            }, function (e) {
                GlobalService.ErrorPopup("Error", "An Error Occured while getting configured Email Templates.");
            });
        }

        $scope.ValidateSetting = function ()
        {
            if ($scope.NewpaperDateFormat == "" || $scope.NewpaperDateFormat.length == 0)
            {
                GlobalService.ErrorPopup("Error", "Please Enter Date Format");
                return;
            }
            if ($scope.NewspaperName == "" || $scope.NewspaperName.length == 0) {
                GlobalService.ErrorPopup("Error", "Please Newspaper Name");
                return;
            }
            $scope.Submit();
        }

        $scope.Submit = function () {
            EPaperService.SavePaperSetting(
                $scope.Id,
                $scope.NewspaperName,
                $scope.NewpaperDateFormat).then(function (l) {
                notify({
                    message: "Record saved successfully",
                    position: GlobalService.position,
                    duration: GlobalService.duration
                });

                    $scope.NewpaperDateFormat = "";
                    $scope.NewspaperName = "";
                    $scope.Id = 0;
                    $scope.buttonText = "Save";

                if ($scope.Id > 0)
                    $window.location.href = "#/Media/ePaperSetting";
                else
                    $scope.init();
            }, function (err) {
                GlobalService.ErrorPopup("Error", err.data.Message);
            });
        }

        $scope.GetStyle = function (index) {
            return index % 2 == 0 ? "" : "at_blkk";
        };

        $scope.deletePaperSetting = function (id) {
            GlobalService.ConfirmPopup("Confirm", "Are you sure you want to delete?", function (selectedItem) {
                if (selectedItem) {
                    EPaperService.DeleteNewpaperSetting(id).then(function (l) {
                        var response = l.data;
                        if (response) {
                            notify({
                                message: "Newpaper deleted successfully",
                                position: GlobalService.position,
                                duration: GlobalService.duration
                            });
                        }
                        else {
                            notify({
                                message: "Newpaper deleted failed",
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

        $scope.editPaperSetting = function (id) {
            var newPaperSetting = $.grep($scope.ConfiguredEpapers, function (a) {
                return a.Id == id;
            });
            if (newPaperSetting) {
                $scope.Id = id;
                $scope.NewspaperName = newPaperSetting[0].NewPaperName;
                $scope.NewpaperDateFormat = newPaperSetting[0].DateFormat;
                $scope.buttonText = "Update ?";
            }
        }

        $scope.LoadNewspaperUrls = function (id)
        {
            $location.path("/Media/ePaperUrlSetting/" + id+"/0");
        }

        $scope.init();
    }]);