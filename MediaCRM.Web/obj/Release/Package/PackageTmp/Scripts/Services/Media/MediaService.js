CRMApp.factory('MediaService', function ($http) {
    var mediaService = {};

    mediaService.GetMediaFormsList = function (mediaTypeId, newsTypeIds, channelIds, categoryIds, sentimentIds, relevanceIds, createdBy, script, startDate, endDate, getOptions, pageNumber) {
        //var requestUrl = base_url + '/api/Media/GetMediaFormsList/' + mediaTypeId + '/' + newsTypeId + '/' + channelId + '/' + categoryIds + '/' + sentimentId + '/' + getOptions;

        var _data = { mediaTypeId: mediaTypeId, newsTypeIds: newsTypeIds, channelIds: channelIds, categoryIds: categoryIds, sentimentIds: sentimentIds, relevanceIds: relevanceIds, createdBy: createdBy, script: script, startDate: startDate, endDate: endDate, getOptions: getOptions, pageNumber: pageNumber };

        var request = $http({
            method: 'POST',
            url: base_url + '/api/Media/GetMediaFormsList',
            data: JSON.stringify(_data)
        }).then(function successCallback(response) {
            return response;
        }, function errorCallback(response) {

        });
        return request;
    }

    mediaService.SaveMediaForm = function (Id, MediaTypeId, NewsTypeId, ChannelId, CityId, TransmissionDate, TransmissionTime, CategoryIds,
        SentimentId, Subject, Script, Base64String, ContentType, FileName, ColumnNumber, ColumnHeight, AdvertisingRate, Multiplier, NumOfRepeatition,
        NewsRelation, PrValue, FullEdit, PageNumber, IsKEActivity, channelIds) {

        var ClippingAttachment = new Object();
        ClippingAttachment.Base64String = Base64String; 
        ClippingAttachment.ContentType = ContentType; 
        ClippingAttachment.FileName = FileName;

        var _data = {
            Id: Id, MediaTypeId: MediaTypeId, NewsTypeId: NewsTypeId, ChannelId: ChannelId, CityId: CityId,
            TransmissionDate: TransmissionDate, TransmissionTime: TransmissionTime, CategoryIds: CategoryIds,
            SentimentId: SentimentId, Subject: Subject, Script: Script, ClippingAttachment: ClippingAttachment,
            ColumnNumber: ColumnNumber, ColumnHeight: ColumnHeight, AdvertisingRate: AdvertisingRate, Multiplier: Multiplier,
            NumOfRepeatition: NumOfRepeatition, NewsRelation: NewsRelation, PrValue: PrValue, FullEdit: FullEdit, PageNumber: PageNumber,
            IsKEActivity: IsKEActivity, ChannelIds: channelIds
        };

        var request = $http({
            method: 'POST',
            url: base_url + '/api/Media/SaveMediaForm',
            data: JSON.stringify(_data)
        }).then(function (res) {

            return res;
        });
        return request;
    }

    mediaService.DeleteMediaForm = function (id) {
        var requestUrl = base_url + '/api/Media/DeleteMediaForm/' + id;
        var request = $http({
            method: 'GET',
            url: requestUrl
        }).then(function successCallback(response) {
            return response;
        }, function errorCallback(response) {

        });
        return request;
    }

    mediaService.GetMediaForm = function (id) {
        var requestUrl = base_url + '/api/Media/GetMediaForm/' + id;
        var request = $http({
            method: 'GET',
            url: requestUrl
        }).then(function successCallback(response) {
            return response;
        }, function errorCallback(response) {

        });
        return request;
    }

    mediaService.ExportMediaNewsAll = function (mediaTypeId, newsTypeIds, channelIds, categoryIds, sentimentIds, relevanceIds, createdBy, script, startDate, endDate, getOptions, pageNumber) {
        //var requestUrl = base_url + '/api/Media/GetMediaFormsList/' + mediaTypeId + '/' + newsTypeId + '/' + channelId + '/' + categoryIds + '/' + sentimentId + '/' + getOptions;

        var _data = { mediaTypeId: mediaTypeId, newsTypeIds: newsTypeIds, channelIds: channelIds, categoryIds: categoryIds, sentimentIds: sentimentIds, relevanceIds: relevanceIds, createdBy: createdBy, script: script, startDate: startDate, endDate: endDate, getOptions: getOptions, pageNumber: pageNumber };

        var request = $http({
            method: 'POST',
            url: base_url + '/api/Media/ExportMediaNewsToExcel',
            data: JSON.stringify(_data)
        }).then(function successCallback(response) {
            return response;
        }, function errorCallback(response) {

        });
        return request;
    }

    mediaService.GetChannels = function (pageNumber) {
        var requestUrl = base_url + '/api/Media/GetMediaChannels/' + pageNumber;
        var request = $http({
            method: 'GET',
            url: requestUrl
        }).then(function successCallback(response) {
            return response;
        }, function errorCallback(response) {
            
        });
        return request;
    }

    mediaService.SaveMediaChannel = function (Id, ChannelName, MediaTypeId) {
        var _data = { Id: Id, ChannelName: ChannelName, MediaTypeId: MediaTypeId };
        var request = $http({
            method: 'POST',
            url: base_url + '/api/Media/SaveMediaChannel',
            data: JSON.stringify(_data)
        }).then(function (res) {

            return res;
        });
        return request;
    }

    mediaService.DeleteChannel = function (id) {
        var requestUrl = base_url + '/api/Media/DeleteMediaChannel/' + id;
        var request = $http({
            method: 'GET',
            url: requestUrl
        }).then(function successCallback(response) {
            return response;
        }, function errorCallback(response) {

        });
        return request;
    }

    mediaService.GetCategories = function (pageNumber) {
        var requestUrl = base_url + '/api/Media/GetCategoriesList/' + pageNumber;
        var request = $http({
            method: 'GET',
            url: requestUrl
        }).then(function successCallback(response) {
            return response;
        }, function errorCallback(response) {

        });
        return request;
    }

    mediaService.SaveCategory = function (Id, ChannelName) {
        var _data = { Id: Id, ChannelName: ChannelName };
        var request = $http({
            method: 'POST',
            url: base_url + '/api/Media/SaveCategory',
            data: JSON.stringify(_data)
        }).then(function (res) {

            return res;
        });
        return request;
    }

    mediaService.DeleteCategory = function (id) {
        var requestUrl = base_url + '/api/Media/DeleteCategory/' + id;
        var request = $http({
            method: 'GET',
            url: requestUrl
        }).then(function successCallback(response) {
            return response;
        }, function errorCallback(response) {

        });
        return request;
    }

    mediaService.UploadChannelFile = function (FileName, ContentType, Base64String) {
        var _data = { FileName: FileName, ContentType: ContentType, Base64String: Base64String };
        var request = $http({
            method: 'POST',
            url: base_url + '/api/Media/UploadMediaChannelFile',
            data: JSON.stringify(_data)
        }).then(function (res) {
            return res;
        });
        return request;
    }

    mediaService.EmailMediaRecords = function (ids, isEmail) {
        var _data = { ids: ids, isEmail, isEmail };
        var requestUrl = base_url + '/api/Media/EmailMediaRecords';
        var request = $http({
            method: 'POST',
            url: requestUrl,
            data: JSON.stringify(_data)
        }).then(function successCallback(response) {
            return response;
        });
        return request;
    }

    mediaService.GetAttachmentAsBase64String = function (id) {
        var requestUrl = base_url + '/api/Media/GetAttachmentAsBase64String/' + id;
        var request = $http({
            method: 'GET',
            url: requestUrl
        }).then(function successCallback(response) {
            return response;
        }, function errorCallback(response) {

        });
        return request;
    }

    mediaService.GetNewsTypeByPage = function (pageNumber) {
        var requestUrl = base_url + '/api/Configuraiton/GetNewsTypeByPage/' + pageNumber+'/10';
        var request = $http({
            method: 'GET',
            url: requestUrl
        }).then(function successCallback(response) {
            return response;
        }, function errorCallback(response) {

        });
        return request;
    }
    mediaService.SaveNewsType = function (Id, NewsTypeName, MediaTypeId) {
        var _data = { Id: Id, NewsTypeName: NewsTypeName, MediaTypeId: MediaTypeId };
        var request = $http({
            method: 'POST',
            url: base_url + '/api/Configuraiton/SaveNewsType',
            data: JSON.stringify(_data)
        }).then(function (res) {

            return res;
        });
        return request;
    }

    mediaService.DeleteNewsType = function (Id) {
        var _data = { Id: Id};
        var request = $http({
            method: 'POST',
            url: base_url + '/api/Configuraiton/DeleteNewsType',
            data: JSON.stringify(_data)
        }).then(function (res) {

            return res;
        });
        return request;
    }

    //Relavance
    mediaService.GetRelevancesByPage = function (pageNumber) {
        var requestUrl = base_url + '/api/Configuraiton/GetRelavanceByPage/' + pageNumber + '/10';
        var request = $http({
            method: 'GET',
            url: requestUrl
        }).then(function successCallback(response) {
            return response;
        }, function errorCallback(response) {

        });
        return request;
    }
    mediaService.SaveRelavance = function (Id, RelavanceName) {
        var _data = { Id: Id, Name: RelavanceName };
        var request = $http({
            method: 'POST',
            url: base_url + '/api/Configuraiton/SaveRelavance',
            data: JSON.stringify(_data)
        }).then(function (res) {

            return res;
        });
        return request;
    }

    mediaService.DeleteRelavance = function (Id) {
        var _data = { Id: Id };
        var request = $http({
            method: 'POST',
            url: base_url + '/api/Configuraiton/DeleteRelavance',
            data: JSON.stringify(_data)
        }).then(function (res) {

            return res;
        });
        return request;
    }



    return mediaService;
});