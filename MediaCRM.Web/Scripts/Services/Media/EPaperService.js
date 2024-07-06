CRMApp.factory('EPaperService', function ($http) {
    var ePaperService = {};

    ePaperService.SavePaperSetting = function (id, newPaperName, dateFormat) {
        var _data = { Id:id, NewPaperName :newPaperName, DateFormat: dateFormat };
        var request = $http({
            method: 'POST',
            url: base_url + '/api/epapersetting/SavePaperSetting',
            data: JSON.stringify(_data)
        }).then(function (res) {
            return res;
        });
        return request;
    }

    ePaperService.DeleteNewpaperSetting = function (id)
    {
        var _data = { Id: id };
        var request = $http({
            method: 'POST',
            url: base_url + '/api/epapersetting/DeleteNewpaperSetting',
            data: JSON.stringify(_data)
        }).then(function (res) {

            return res;
        });
        return request;
    }

    ePaperService.LoadConfiguredEpaper = function ()
    {
        var requestUrl = base_url + '/api/epapersetting/getconfiguredepapersetting';
        var request = $http({
            method: 'GET',
            url: requestUrl
        }).then(function successCallback(response) {
            return response;
        }, function errorCallback(response) {

        });
        return request;
    }

    ePaperService.GetCities = function ()
    {
        var requestUrl = base_url + '/api/Configuraiton/GetCities';
        var request = $http({
            method: 'GET',
            url: requestUrl
        }).then(function successCallback(response) {
            return response;
        }, function errorCallback(response) {

        });
        return request;
    }

    ePaperService.GetNewspaperById = function (id) {
        var requestUrl = base_url + '/api/epapersetting/GetNewspaperById/'+id;
        var request = $http({
            method: 'GET',
            url: requestUrl
        }).then(function successCallback(response) {
            return response;
        }, function errorCallback(response) {

        });
        return request;
    }

    //Newspaper Url APIS.
    ePaperService.SavePaperUrl = function (id, setupId, cityId, pageNumber, urlTemplate, dateFormat) {
        var _data = { Id: id, SetupId: setupId, CityId: cityId, PageNumber: pageNumber, UrlTemplate: urlTemplate, DateFormat: dateFormat };
        var request = $http({
            method: 'POST',
            url: base_url + '/api/epapersetting/SavePaperUrl',
            data: JSON.stringify(_data)
        }).then(function (res) {
            return res;
        });
        return request;
    }

    ePaperService.DeletePaperUrl = function (id) {
        var _data = { Id: id };
        var request = $http({
            method: 'POST',
            url: base_url + '/api/epapersetting/DeleteNewpaperUrl',
            data: JSON.stringify(_data)
        }).then(function (res) {

            return res;
        });
        return request;
    }


    ePaperService.GetNewspaperUrlByPaperIdThenCityId = function (paperId,cityId) {
        var requestUrl = base_url + '/api/epapersetting/GetNewspaperUrlByPaperIdThenCityId/' + paperId + '/' + cityId;
        var request = $http({
            method: 'GET',
            url: requestUrl
        }).then(function successCallback(response) {
            return response;
        }, function errorCallback(response) {

        });
        return request;
    }

    // APIS For Media Clipping DROPDOWNS

    ePaperService.GetConfiguredNewspaper = function () {
        var requestUrl = base_url + '/api/epapersetting/GetConfiguredNewspaper';
        var request = $http({
            method: 'GET',
            url: requestUrl
        }).then(function successCallback(response) {
            return response;
        }, function errorCallback(response) {

        });
        return request;
    }

    ePaperService.GetNewspaperCities = function (newspaperId) {
        var requestUrl = base_url + '/api/epapersetting/GetNewspaperCities/' + newspaperId;
        var request = $http({
            method: 'GET',
            url: requestUrl
        }).then(function successCallback(response) {
            return response;
        }, function errorCallback(response) {

        });
        return request;
    }

    ePaperService.GetNewspaperPages = function (newspaperId,cityId) {
        var requestUrl = base_url + '/api/epapersetting/GetNewspaperPages/' + newspaperId + '/' + cityId;
        var request = $http({
            method: 'GET',
            url: requestUrl
        }).then(function successCallback(response) {
            return response;
        }, function errorCallback(response) {

        });
        return request;
    }

    // API For Newpaper Images
    ePaperService.FetchNewspaperImage = function (newpaperId,cityId,pageNumber,newsDate)
    {
        var _data = { NewsPaperId: newpaperId, CityId: cityId, PageNumber: pageNumber, NewsDate: newsDate };
        var request = $http({
            method: 'POST',
            url: base_url + '/api/epapersetting/FetchNewspaperImage',
            data: JSON.stringify(_data)
        }).then(function (res) {
            return res;
        });
        return request;
    }

    ePaperService.UploadCroppedNewspaperImage = function (newpaperId, cityId, pageNumber, newsDate, clipPng,
        newsTypeId, newsRelatedToId, categories, sentimentSelectId, columnNumber, columnHeight, advertisingRate,
        prValue,printHeading,printScript) {
        var _data = {
            NewsPaperId: newpaperId, CityId: cityId, PageNumber: pageNumber, NewsDate: newsDate, ClipBase64PNG: clipPng,
            NewsType: newsTypeId, NewsRelevance: newsRelatedToId, Sentiment: sentimentSelectId, ColumnNumber: columnNumber,
            ColumnHeight: columnHeight, AdvertizeRate: advertisingRate, PrValue: prValue, CategoryIds: categories,
            PrintHeading: printHeading, PrintScript:printScript
        };
        var request = $http({
            method: 'POST',
            url: base_url + '/api/epapersetting/UploadCroppedNewspaperImage',
            data: JSON.stringify(_data)
        }).then(function (res) {
            return res;
        });
        return request;
    }

    return ePaperService;
});