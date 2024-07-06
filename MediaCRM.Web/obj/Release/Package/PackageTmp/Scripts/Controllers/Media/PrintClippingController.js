CRMApp.controller('PrintClippingController', ['$rootScope', '$scope', '$window', '$location', '$stateParams', 'EPaperService','MediaService', 'GlobalService', 'notify',
    function ($rootScope, $scope, $window, $location, $stateParams, EPaperService, MediaService , GlobalService, notify) {
        $scope.ePaperUrl = "";
        $scope.myImage = '';
        $scope.myCroppedImage = '';
        $scope.IsPaperCroped = false;
        //Configured Newspapers
        $scope.NewspaperTextDDL = { buttonDefaultText: 'Select Newspaper' };
        $scope.NewspaperCityTextDDL = { buttonDefaultText: 'Select City' };
        $scope.NewspaperPageNumberTextDDL = { buttonDefaultText: 'Select Page Number' };

        $scope.example5customTextsNewsType = { buttonDefaultText: 'Select News Type' };
        $scope.example5customTextsCategories = { buttonDefaultText: 'Select Category(s)' };
        $scope.example5customTextsNewsRelatedTo = { buttonDefaultText: 'Select Relevance' };
        $scope.example5customTextsSentiment = { buttonDefaultText: 'Select Sentiment' };
        $scope.NewsTypeList = new Array();
        $scope.CategoriesList = new Array();
        $scope.NewsRelatedToList = new Array();
        $scope.SentimentsList = new Array();

        $scope.newsRelatedTo = {};
        $scope.newsType = {};
        $scope.sentimentSelect = {};
        $scope.CategoryModel = [];

        $scope.ColumnNumber = "";
        $scope.ColumnHeight = "";
        $scope.AdvertisingRate = "";
        $scope.Multiplier = 3.2;
        $scope.PrValue = "";
        $scope.PrintHeading = "";
        $scope.PrintScript = "";

        $scope.multiSelectSettings = {
            keyboardControls: true,
            enableSearch: true,
            smartButtonMaxItems: 3,
            smartButtonTextConverter: function (itemText, originalItem) {
                return itemText;
            }
        };

        $scope.singleSelectSettings = {
            keyboardControls: true,
            enableSearch: true,
            closeOnSelect: true,
            dynamicTitle:true,
            selectionLimit: 1,
            smartButtonMaxItems: 3,
            smartButtonTextConverter: function (itemText, originalItem) {
                return itemText;
            }
        };

        $scope.NewspaperDDLEvents = {
            onItemSelect: function (item) {
                if (item.id !== undefined && item.id !== "0") {
                    $scope.selectedCity = {};
                    $scope.selectedPageNumber = {};
                    $scope.CitiesList = [];
                    $scope.CitiesList.push({ "label": "Select City", "id": "0" });
                    $scope.CitiesList = [];
                    $scope.NewspaperPageList = [];
                    $scope.NewspaperPageList.push({ "label": "Select PageNumber", "id": "0" });
                    $scope.NewspaperPageList = [];
                    $scope.LoadNewspaperCitiesDDL(item.id);
                }
            }
        };

        $scope.CityDDLEvents = {
            onItemSelect: function (item) {
                if (item.id !== undefined && item.id!=="0") {
                    $scope.selectedPageNumber = {};
                    $scope.NewspaperPageList = [];
                    $scope.NewspaperPageList.push({ "label": "Select PageNumber", "id": "0" });
                    $scope.NewspaperPageList = [];
                    $scope.LoadNewspaperPagesDDL($scope.selectedNewPaper.id, item.id);
                }
            }
        };

        $scope.NewspaperList = [];
        $scope.CitiesList = [];
        $scope.NewspaperPageList = [];

        $scope.NewspaperCityTextDDL = { buttonDefaultText: 'Select City' };
        $scope.NewspaperPageNumberTextDDL = { buttonDefaultText: 'Select Page Number' };
        $scope.selectedNewPaper = {};
        $scope.selectedCity = {};
        $scope.selectedPageNumber = {};
        $scope.NewspaperDate = "";

        $scope.fileName = "";
        $scope.ClippingUpload;
        $scope.base64String = "";

        $scope.init = function () {
            EPaperService.GetConfiguredNewspaper().then(
                function (s)
                {
                    $.each(s.data, function (key, value) {
                        $scope.NewspaperList.push({ "label": value.Text, "id": "" + value.Value });
                    });
                    $scope.GetMedia();
                },
                function (e) {
                }
            );
        }

        $scope.LoadNewspaperCitiesDDL = function (newspaperId)
        {
            EPaperService.GetNewspaperCities(newspaperId).then(
                function (s) {
                    $.each(s.data, function (key, value) {
                        $scope.CitiesList.push({ "label": value.Text, "id": "" + value.Value });
                    });
                },
                function (e) {
                }
            );
        }

        $scope.LoadNewspaperPagesDDL = function (newspaperId,cityId) {
            EPaperService.GetNewspaperPages(newspaperId, cityId).then(
                function (s) {
                    $.each(s.data, function (key, value) {
                        $scope.NewspaperPageList.push({ "label": value.Text, "id": "" + value.Value });
                    });
                },
                function (e) {
                }
            );
        }

        $scope.GetNewspaper = function () {
            $scope.user2 = {};
            if (angular.equals($scope.selectedNewPaper, $scope.user2) || $scope.selectedNewPaper.id == null) {
                GlobalService.ErrorPopup("Error", "Please Select Newspaper");
                return;
            }
            if (angular.equals($scope.selectedCity, $scope.user2) || $scope.selectedCity.id == null) {
                GlobalService.ErrorPopup("Error", "Please Select City of Newspaper");
                return;
            }
            if (angular.equals($scope.selectedPageNumber, $scope.user2) || $scope.selectedPageNumber.id == null) {
                GlobalService.ErrorPopup("Error", "Please Select page number of Paper");
                return;
            }
            if ($scope.NewspaperDate == '' || $scope.NewspaperDate == undefined || $scope.NewspaperDate == null) {
                GlobalService.ErrorPopup("Error", "Please Select News Date");
                return;
            }

            EPaperService.FetchNewspaperImage($scope.selectedNewPaper.id, $scope.selectedCity.id, $scope.selectedPageNumber.id, $scope.NewspaperDate).
                then(
                function (s) {
                    $scope.requestedPaper = s.data;
                    $scope.myImage = s.data;
                    $scope.IsPaperCroped = true;
                    $scope.GetMedia();
                },
                function (e) {
                    GlobalService.ErrorPopup("Error", "An Error has occured while featching Newspaper");
                });
        }

        $scope.CropNewspaper = function () {
            var base64Png = $scope.requestedPaper;
            if ($scope.IsPaperCroped == true) {
                base64Png = $scope.requestedPaper;
                if (base64Png == null || base64Png == undefined)
                {
                    GlobalService.ErrorPopup("Error-Cropping", "Please Crop Paper Then Continue.");
                    return;
                }
                if ($scope.requestedPaper == null || $scope.requestedPaper == undefined || $scope.requestedPaper == '') {
                    GlobalService.ErrorPopup("Error", "Please select Croping");
                    return;
                }
            }
            else {
                base64Png = $scope.base64String
                if (base64Png == null || base64Png == undefined || base64Png=="")
                {
                    GlobalService.ErrorPopup("Error-Upload", "Please Upload Paper Then Continue.");
                    return;
                }
            }
            $scope.emptyObj = {};
            if (angular.equals($scope.selectedNewPaper, $scope.emptyObj) || $scope.selectedNewPaper.id == null) {
                GlobalService.ErrorPopup("Error", "Please Select Newspaper");
                return;
            }
            if (angular.equals($scope.selectedCity, $scope.emptyObj) || $scope.selectedCity.id == null) {
                GlobalService.ErrorPopup("Error", "Please Select City of Newspaper");
                return;
            }
            if (angular.equals($scope.selectedPageNumber, $scope.emptyObj) || $scope.selectedPageNumber.id == null) {
                GlobalService.ErrorPopup("Error", "Please Select page number of Paper");
                return;
            }
            if ($scope.NewspaperDate == '' || $scope.NewspaperDate == undefined || $scope.NewspaperDate == null) {
                GlobalService.ErrorPopup("Error", "Please Select News Date");
                return;
            }
            if ($scope.newsType.id == null || $scope.newsType.id == undefined || angular.equals($scope.newsType, $scope.emptyObj)) {
                GlobalService.ErrorPopup("Error", "Please select NewsType");
                return;
            }
            if ($scope.newsRelatedTo.id == null || $scope.newsRelatedTo.id == undefined || angular.equals($scope.newsRelatedTo, $scope.emptyObj)) {
                GlobalService.ErrorPopup("Error", "Please select Relevance");
                return;
            }
            if ($scope.CategoryModel == null || $scope.CategoryModel == undefined || $scope.CategoryModel.length == 0) {
                GlobalService.ErrorPopup("Error", "Please select Category");
                return;
            }
            if ($scope.sentimentSelect.id == null || $scope.sentimentSelect.id == undefined || angular.equals($scope.sentimentSelect, $scope.emptyObj)) {
                GlobalService.ErrorPopup("Error", "Please select Sentiment");
                return;
            }
            if ($scope.ColumnNumber == null || $scope.ColumnNumber == undefined || $scope.ColumnNumber == '') {
                //GlobalService.ErrorPopup("Error", "Please Enter Column Number");
                //return;
                $scope.ColumnNumber = 1;
            }
            if ($scope.ColumnHeight == null || $scope.ColumnHeight == undefined || $scope.ColumnHeight == '') {
                //GlobalService.ErrorPopup("Error", "Please Enter Column Height");
                //return;
                $scope.ColumnHeight = 1;
            }
            if ($scope.AdvertisingRate == null || $scope.AdvertisingRate == undefined || $scope.AdvertisingRate == '') {
                //GlobalService.ErrorPopup("Error", "Please Enter Advertise Rate");
                //return;
                $scope.AdvertisingRate = 1;
            }
            if ($scope.PrValue == null || $scope.PrValue == undefined || $scope.PrValue == '') {
                //GlobalService.ErrorPopup("Error", "Please Enter PR Value");
                //return;
                $scope.PrValue = 1;
            }
            var categories = "";
            $scope.CategoryModel.forEach(function (i) {
                categories += i.id + ","
            });
            categories = categories.substring(0, categories.length - 1);
            //parseInt
            var pageNumer = "PG-" + $scope.selectedPageNumber.id;//sync db format for old data.
            EPaperService.UploadCroppedNewspaperImage($scope.selectedNewPaper.id,
                $scope.selectedCity.id, pageNumer, $scope.NewspaperDate,
                base64Png,
                $scope.newsType.id, $scope.newsRelatedTo.id, categories, $scope.sentimentSelect.id,
                $scope.ColumnNumber, $scope.ColumnHeight, $scope.AdvertisingRate, $scope.PrValue, $scope.PrintHeading, $scope.PrintScript
                ).then(
                function (s) {
                    //notify success message.
                    notify({
                        message: "Record saved successfully.",
                        position: GlobalService.position,
                        duration: GlobalService.duration
                    });
                    $scope.requestedPaper = s.data;
                    $scope.myImage = s.data;
                    $scope.GetNewspaper();
                },
                function (e) {
                    GlobalService.ErrorPopup("Error", "An Error has occured while featching Newspaper");
                }
                );
        }

        var handleFileSelect = function (evt) {
            var file = evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                $scope.$apply(function ($scope) {

                    $scope.myImage = evt.target.result;
                    console.log($scope.myImage)
                });
            };
            reader.readAsDataURL(file);
        };



        $scope.CalculatePRValue = function () {
            var advertisingRate = 0, columnHeight = 0, columnNumber = 0;
            if ($scope.AdvertisingRate) {
                advertisingRate = parseFloat($scope.AdvertisingRate);
            }

            if ($scope.ColumnHeight) {
                columnHeight = parseFloat($scope.ColumnHeight);
            }

            if ($scope.ColumnNumber) {
                columnNumber = parseFloat($scope.ColumnNumber);
            }

            $scope.PrValue = parseFloat($scope.Multiplier * advertisingRate * columnHeight * columnNumber).toFixed(2);
        }

        $scope.newsEventListeners = {
            onItemSelect: onItemSelectNews
        };

        function onItemSelectNews(property) {
            var newsTypeId = property.id;
            var news = $.grep($scope.NewsTypeList, function (a) {
                return a.id == newsTypeId;
            });

            $scope.IsKEActivity = news[0].isKEActivity;
        };

        $scope.GetMedia = function () {
            MediaService.GetMediaForm(0).then(function (l) {

                $scope.NewsRelatedToList = [];
                $scope.CategoriesList = [];
                $scope.NewsTypeList = [];
                $scope.SentimentsList = [];

                $scope.newsRelatedTo = {};
                $scope.newsType = {};
                $scope.sentimentSelect = {};
                $scope.CategoryModel = [];

                $scope.ColumnNumber = "";
                $scope.ColumnHeight = "";
                $scope.AdvertisingRate = "";
                $scope.PrValue = "";

                $.each(l.data.NewsRelatedToList, function (key, value) {
                    if (value.MediaTypeId == 3 || value.MediaTypeId == 0)
                    $scope.NewsRelatedToList.push({ "label": value.Text, "id": "" + value.Value });
                });

                $.each(l.data.CategoriesList, function (key, value) {
                    if (value.MediaTypeId == 3 || value.MediaTypeId == 0)
                    $scope.CategoriesList.push({ "label": value.Text, "id": "" + value.Value });
                });


                $.each(l.data.NewsTypeList, function (key, value) {
                    if (value.MediaTypeId == 3 || value.MediaTypeId == 0)
                        $scope.NewsTypeList.push({ "label": value.Text, "id": "" + value.Value });
                });

                $.each(l.data.SentimentsList, function (key, value) {
                    if (value.MediaTypeId == 3 || value.MediaTypeId == 0)
                        $scope.SentimentsList.push({ "label": value.Text, "id": "" + value.Value });
                });                

            }, function (err) {
                GlobalService.ErrorPopup("Error", err.data.Message);
            });
        };

        $scope.SetFileName = function () {
            var file = $("input[type='file']").get(0).files[0];
            if (file) {
                var uploadedFilesExtentions = file.type.split('/')[1];
                $scope.convertToBase64StringAndSend(file);
            }
        };

        $scope.convertToBase64StringAndSend = function (file) {
            var reader = new FileReader();
            reader.addEventListener("loadend", function () {
                console.log(reader.result.length);
                $scope.$apply(function () {
                    // every changes goes here
                    $scope.fileName = file.name;
                    $scope.contentType = file.type;
                    $scope.base64String = reader.result;
                });
            }, false);
            if (file) {
                reader.readAsDataURL(file);
            }
        };

        $scope.init();
    }]);