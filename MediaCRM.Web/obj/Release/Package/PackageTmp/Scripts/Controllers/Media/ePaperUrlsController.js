
CRMApp.controller('ePaperUrlsController', ['$rootScope', '$scope', '$window', '$location', '$stateParams', 'EPaperService', 'GlobalService', 'notify',
    function ($rootScope, $scope, $window, $location, $stateParams, EPaperService, GlobalService, notify) {
        $scope.PageNumber = "";
        $scope.NewspaperName = "";
        $scope.Id = 0;
        $scope.UrlTemplate = "";
        $scope.buttonText = "Save Url";
        $scope.example5customTextsCity = { buttonDefaultText: 'Select City' };
        $scope.example5customTextsFilterCity = { buttonDefaultText: 'Filter By City' };
        $scope.CitiesList = new Array();
        $scope.CitiesFilterList = new Array();
        $scope.selectedCity = {};
        $scope.selectedCityFilter = {};
        $scope.NewspaperUrls = [];
        $scope.SetupId = $stateParams.settingId;
        $scope.CityId = $stateParams.cityId;
        $scope.DateFormat = "";

        $scope.singleSelectSettings = {
            keyboardControls: true,
            enableSearch: true,
            closeOnSelect: true,
            selectionLimit: 1,
            smartButtonMaxItems: 3,
            smartButtonTextConverter: function (itemText, originalItem) {
                return itemText;
            }
        };
        $scope.cityFilterSettings = {
            keyboardControls: true,
            enableSearch: true,
            closeOnSelect: true,
            selectionLimit: 1,
            smartButtonMaxItems: 3,
            smartButtonTextConverter: function (itemText, originalItem) {
                return itemText;
            }
        };

        $scope.init = function () {
            EPaperService.GetNewspaperById($scope.SetupId).then(function (s) {
                //plot data
                var newsPaper = s.data.Newspaper;
                $scope.NewspaperName = newsPaper.NewPaperName;
                $scope.CitiesList = [];
                $scope.CitiesFilterList = [];
                $.each(s.data.CitiesList, function (key, value) {
                    $scope.CitiesList.push({ "label": value.Text, "id": "" + value.Value });
                    $scope.CitiesFilterList.push({ "label": value.Text, "id": "" + value.Value });
                });
                $scope.FilterUrl(true);
            }, function (e) {
                GlobalService.ErrorPopup("Error", "An Error Occured while getting cities.");
            });
        }

        $scope.ValidateUrl = function ()
        {
            if ($scope.UrlTemplate == "" || $scope.UrlTemplate.length == 0)
            {
                GlobalService.ErrorPopup("Error", "Please Enter Url");
                return;
            }
            if ($scope.PageNumber == "" || $scope.PageNumber == 0) {
                GlobalService.ErrorPopup("Error", "Please Enter Page Number");
                return;
            }
            $scope.user2 = {};
            if ($scope.selectedCity.id == null || $scope.selectedCity.id == undefined || angular.equals($scope.selectedCity, $scope.user2)) {
                GlobalService.ErrorPopup("Error", "Please Select City");
                return;
            }
            $scope.Submit();
        }

        $scope.Submit = function () {
            EPaperService.SavePaperUrl(
                $scope.Id,
                $scope.SetupId,
                $scope.selectedCity.id,
                $scope.PageNumber,
                $scope.UrlTemplate, $scope.DateFormat).then(function (l) {
                    notify({
                        message: "Newspaper Url saved successfully",
                        position: GlobalService.position,
                        duration: GlobalService.duration
                    });

                    $scope.UrlTemplate = "";
                    $scope.PageNumber = "";
                    $scope.DateFormat = "";
                    var cityId = $scope.selectedCity.id;
                    $scope.selectedCity = {};
                    $scope.Id = 0;
                    $scope.buttonText = "Save Url";
                    //$location.path("/Media/ePaperUrlSetting/" + $scope.SetupId + "/" + cityId);
                    $scope.init();
                }, function (err) {
                    GlobalService.ErrorPopup("Error", err.data.Message);
                });
        }

        $scope.GetStyle = function (index) {
            return index % 2 == 0 ? "" : "at_blkk";
        };

        $scope.deletePaperUrl = function (id) {
            GlobalService.ConfirmPopup("Confirm", "Are you sure you want to delete?", function (selectedItem) {
                if (selectedItem) {
                    EPaperService.DeletePaperUrl(id).then(function (l) {
                        var response = l.data;
                        if (response) {
                            notify({
                                message: "Newpaper Url deleted successfully",
                                position: GlobalService.position,
                                duration: GlobalService.duration
                            });
                        }
                        else {
                            notify({
                                message: "Newpaper Url deleted failed",
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

        $scope.editPaperUrl = function (id) {
            var newPaperUrl = $.grep($scope.NewspaperUrls, function (a) {
                return a.Id == id;
            });
            if (newPaperUrl) {
                $scope.Id = id;
                $scope.UrlTemplate = newPaperUrl[0].UrlTemplate;
                $scope.PageNumber = newPaperUrl[0].PageNumber;
                $scope.selectedCity = $.grep($scope.CitiesList, function (a) { return a.id == newPaperUrl[0].CityId; }); 
                $scope.selectedCity.id = newPaperUrl[0].CityId;
                $scope.SetupId = newPaperUrl[0].SetupId;
                $scope.DateFormat = newPaperUrl[0].DateFormat;
                $scope.buttonText = "Update Url ?";
                $stateParams.cityId = newPaperUrl[0].CityId;
                $window.scrollTo(0, 0);
            }
        }

        $scope.FilterUrl = function (isBackground)
        {
            if (isBackground) {
                //load all cities or selected (after update) city url
                if ($stateParams.cityId == null || $stateParams.cityId == undefined)
                    $stateParams.cityId = 0;
                $scope.CityId = $stateParams.cityId;
            }
            else
            {
                $scope.user2 = {};
                if ($scope.selectedCityFilter.id == null || $scope.selectedCityFilter.id == undefined || angular.equals($scope.selectedCityFilter, $scope.user2)) {
                    GlobalService.ErrorPopup("Error- First Filter City", "Please Filter out City Then Continue.");
                    return;
                }
                $scope.CityId = $scope.selectedCityFilter.id;
            }
            $scope.SetupId = $stateParams.settingId;
            $scope.NewspaperUrls = [];
            EPaperService.GetNewspaperUrlByPaperIdThenCityId($scope.SetupId, $scope.CityId).then(function (s) {
                $scope.NewspaperUrls = s.data;
            }, function (e) {
                GlobalService.ErrorPopup("Error", "An Error Occured while getting cities.");
            });
        }

        $scope.init();
    }]);