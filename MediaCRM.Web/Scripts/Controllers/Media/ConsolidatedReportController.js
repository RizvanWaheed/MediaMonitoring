CRMApp.controller('ConsolidatedReportController', ['$rootScope', '$scope', '$window', '$location', '$stateParams', 'ReportService', 'GlobalService', 'notify', '$uibModal',
    function ($rootScope, $scope, $window, $location, $stateParams, ReportService, GlobalService, notify, $uibModal) {
    $scope.menuItems = [{
        textKey: 'downloadCSV',
        onclick: function () {
            this.downloadCSV();
        }
    }, {
        textKey: 'downloadXLS',
        onclick: function () {
            this.downloadXLS();
        }
    }, {
        textKey: 'downloadPDF',
        onclick: function () {
            this.exportChart({
                type: 'application/pdf'
            });
        }
    }, {
        textKey: 'downloadPNG',
        onclick: function () {
            this.exportChart();
        }
    }, {
        textKey: 'downloadJPEG',
        onclick: function () {
            this.exportChart({
                type: 'image/jpeg'
            });
        }
    }, {
        textKey: 'downloadSVG',
        onclick: function () {
            this.exportChart({
                type: 'image/svg+xml'
            });
        }
    }, {
        textKey: 'printChart',
        onclick: function () {
            this.print();
        }
    }];

    $scope.opts = {
        locale: {
            applyClass: 'btn-green',
            applyLabel: "Apply",
            fromLabel: "From",
            format: "MMMM D, YYYY",
            toLabel: "To",
            cancelLabel: 'Cancel',
            customRangeLabel: 'Custom range'
        },
        maxDate: moment(),
        eventHandlers: {
            'apply.daterangepicker': function (ev, picker) {
                $scope.startDate = $scope.date.startDate;
                $scope.endDate = $scope.date.endDate;
                if ($scope.startDate == $scope.PrevStartDate && $scope.endDate == $scope.PrevEndDate) {
                    //alert('not changed')
                }
                else {
                    $scope.PrevStartDate = $scope.startDate;
                    $scope.PrevEndDate = $scope.endDate;
                    $scope.dateFilterEnum = 5;
                    // call function which will fetch data
                    //get report data for default
                    //$scope.GetTeamData();
                    //end get data
                }

                $scope.GenerateFilterDropdown();
            }
        }
    };

    $scope.date = {
        startDate: moment().subtract(30, "days"),
        endDate: moment()
    };

    $scope.startDate = $scope.date.startDate;
    $scope.PrevStartDate = $scope.startDate;
    $scope.endDate = $scope.date.endDate;
        $scope.PrevEndDate = $scope.endDate;
        $scope.ReportDate = moment($scope.endDate).format('DD-MM-YYYY');
        $scope.SelectedShift = {};

        $scope.init = function () {
            $scope.ShiftTypeList = new Array();
            $scope.ShiftTypeList.push({ "label": 'Shift A (6 am to 2pm)', "id": '1' });
            $scope.ShiftTypeList.push({ "label": 'Shift B (2 pm to 10pm)', "id": '2' });
            $scope.ShiftTypeList.push({ "label": 'Shift C (10 pm to 6am)', "id": '3' });
            $scope.ShiftTypeList.push({ "label": 'All (Today)', "id": '0' });
        $scope.MediaNewsList = new Array();

        $scope.MediaTypeListAll = new Array();
        $scope.NewsTypeListAll = new Array();
        $scope.ChannelsListAll = new Array();
        $scope.CategoriesListAll = new Array();
        $scope.RelevanceListAll = new Array();
        $scope.SentimentListAll = new Array();
        $scope.AgentListAll = new Array();

        $scope.MediaTypeList = new Array();
        $scope.NewsTypeList = new Array();
        $scope.ChannelsList = new Array();
        $scope.CategoriesList = new Array();
        $scope.RelevanceList = new Array();
        $scope.FilterListSentiment = new Array();
        $scope.FilterListSum = new Array();
        $scope.FilterListInd = new Array();
        $scope.FilterListMediaNews = new Array();
        $scope.FilterListRel = new Array();
        $scope.FilterListCat = new Array();
        $scope.FilterListNT = new Array();
        $scope.FilterListAgent = new Array();

        $scope.categoryModel = [];
        $scope.mediaType = [];
        $scope.newsType = [];
        $scope.channelType = [];
        $scope.relevanceModel = [];
        $scope.filterType = [];
        $scope.filterTypeRel = [];
        $scope.filterTypeCat = [];
        $scope.filterTypeNT = [];
        $scope.filterTypeAgent = [];
        $scope.filterTypeNFISum = [];
        $scope.filterTypeNFIInd = [];
        $scope.filterTypeMediaNews = [];
        $scope.script = "";
        $scope.TotalPRValue = 0;
        
        }

        $scope.subWiseCat = [];
        $scope.descWiseCat = [];
        $scope.GenerateReport = function ()
        {
            if ($scope.SelectedShift != null && $scope.SelectedShift.id != undefined && $scope.SelectedShift.id != null) {
                $scope.GetConsolidatedReport();
            }
            else
            {
                GlobalService.ErrorPopup("Error", 'Please Select Shift Type');
            }
            
        }


        $scope.GetConsolidatedReport = function ()
        {
            $scope.subWiseCat = new Array();
            $scope.descWiseCat = new Array();
            ReportService.GetConsolidatedReport($scope.SelectedShift.id)
            .then(function (s)
            {
                $scope.subWiseCat = s.data.CatWiseSubjects;
                $scope.descWiseCat = s.data.CatWiseDesc;
            }, function (err)
            {
                GlobalService.ErrorPopup("Error", err.data.Message);
            }
            );
        }

    $scope.example5customTexts = { buttonDefaultText: 'Select Shift' };

    $scope.example5customTextsMediaType = { buttonDefaultText: 'Select Media Type' };
    $scope.example5customTextsNewsType = { buttonDefaultText: 'Select News Type(s)' };
    $scope.example5customTextsChannel = { buttonDefaultText: 'Select Channel(s)' };
    $scope.example5customTextsCategories = { buttonDefaultText: 'Select Category(s)' };
    $scope.example5customTextsRelavance = { buttonDefaultText: 'Select Relavance(s)' };

    $scope.groupsettings = {
        selectionLimit: 1,
        closeOnSelect: true,
        smartButtonMaxItems: 2,
        scrollable: false,
        scrollableHeight: '300px',
        smartButtonTextConverter: function (itemText, originalItem) {
            return itemText;
        }
    }

    $scope.multiSelectSettings = {
        keyboardControls: true,
        enableSearch: true,
        smartButtonMaxItems: 2,
        scrollable: true,
        scrollableHeight: '300px',
        smartButtonTextConverter: function (itemText, originalItem) {
            return itemText;
        }
    };

    $scope.GenerateFilterDropdown = function () {
        var filterObjArray = new Array();
        //$scope.FilterList = new Array();
        $scope.FilterListSentiment = new Array();
        $scope.FilterListSum = new Array();
        $scope.FilterListInd = new Array();
        $scope.FilterListMediaNews = new Array();
        $scope.FilterListRel = new Array();
        $scope.FilterListCat = new Array();
        $scope.FilterListNT = new Array();
        $scope.FilterListAgent = new Array();

        var filterObject = new Object();
        filterObject.Id = 1;
        filterObject.Name = "Media";
        filterObjArray.push(filterObject);

        filterObject = new Object();
        filterObject.Id = 2;
        filterObject.Name = "News Type";
        filterObjArray.push(filterObject);

        filterObject = new Object();
        filterObject.Id = 3;
        filterObject.Name = "Channel";
        filterObjArray.push(filterObject);

        filterObject = new Object();
        filterObject.Id = 4;
        filterObject.Name = "Category";
        filterObjArray.push(filterObject);

        filterObject = new Object();
        filterObject.Id = 5;
        filterObject.Name = "Per Weekday";
        filterObjArray.push(filterObject);

        filterObject = new Object();
        filterObject.Id = 6;
        filterObject.Name = "Per Hour";
        filterObjArray.push(filterObject);

        filterObject = new Object();
        filterObject.Id = 7;
        filterObject.Name = "Evolution (Volume over time) - Datewise";
        filterObjArray.push(filterObject);

        if (moment.duration($scope.date.endDate.diff($scope.date.startDate)).asDays() <= 31) {
            filterObject = new Object();
            filterObject.Id = 8;
            filterObject.Name = "Evolution (Volume over time) - Hourwise";
            filterObjArray.push(filterObject);
        }

        $.each(filterObjArray, function (key, value) {
            $scope.FilterListSum.push({ "label": "" + value.Name, "id": "" + value.Id });
            $scope.FilterListSentiment.push({ "label": "" + value.Name, "id": "" + value.Id });
            $scope.FilterListInd.push({ "label": "" + value.Name, "id": "" + value.Id });
            $scope.FilterListMediaNews.push({ "label": "" + value.Name, "id": "" + value.Id });
            $scope.FilterListRel.push({ "label": "" + value.Name, "id": "" + value.Id });
            if (value.Id != 4)
                $scope.FilterListCat.push({ "label": "" + value.Name, "id": "" + value.Id });
            if (value.Id != 2)
                $scope.FilterListNT.push({ "label": "" + value.Name, "id": "" + value.Id });
        });
        $scope.FilterListAgent = [
            { "label": "No. of minutes lagging", "id": "1" },
            { "label": "No. of Entries made", "id": "2" },
            { "label": "No. of Entries made Evolution (Volume over time)", "id": "3" },
            { "label": "No. of Entries made by Media Type", "id": "4" },
            { "label": "No. of Edits made", "id": "5" },
            { "label": "No. of Edits made Evolution (Volume over time)", "id": "6" },
            { "label": "No. of Edits made by Media Type", "id": "7" }
        ];

        $scope.filterType = angular.copy($scope.FilterListSentiment[0]);
        $scope.filterTypeNFISum = angular.copy($scope.FilterListSum[0]);
        $scope.filterTypeNFIInd = angular.copy($scope.FilterListInd[0]);
        $scope.filterTypeMediaNews = angular.copy($scope.FilterListMediaNews[0]);
        $scope.filterTypeRel = angular.copy($scope.FilterListRel[0]);
        $scope.filterTypeCat = angular.copy($scope.FilterListCat[0]);
        $scope.filterTypeNT = angular.copy($scope.FilterListNT[0]);
        $scope.filterTypeAgent = angular.copy($scope.FilterListAgent[0]);

        $scope.filterMediaRecords();
    }

        $scope.ConvertPDF = function (isEmail) {

            if ($scope.SelectedShift == null || $scope.SelectedShift.id == undefined || $scope.SelectedShift.id == null) {
                GlobalService.ErrorPopup("Error", 'Please Select Shift Type');
                return;
            }
            else
            {
                window.open('/home/downloadpdf/' + $scope.SelectedShift.id, '_blank');
                return;
            }

        var position = 0;
        var pageHeight = 295;
        var pageWidth = 180;
        var doc = new jsPDF('p', 'mm');

        var options = { doc: doc, canvas: '', position: position, pageHeight: pageHeight, heightLeft: pageHeight };
        var KELogo = 'data:image/png;base64,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';
        options.doc.addImage(KELogo, 'PNG', 0, position, 50, 30);
        position += 30;
        options.doc.line(4, position, 220, position);
        position += 10;
        doc.setFontSize(12);
        options.doc.text(2, position, "PPIC3, LAHORE DAILY SITUATION REPORT " + $scope.ReportDate+", HIGHLIGHTS");
        position += 5;        
        //doc.fromHTML($('#subWiseCat').html(), position, position, { 'width': 180 });        
        var today = new Date();
        var fileName = 'SummaryReport-' + today.getDate() + '' + today.getMonth() + '' + today.getFullYear() + '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds() + '.pdf';
        if (isEmail) {
            var binary = options.doc.output('datauri');
            //var content = binary ? btoa(binary) : "";

            $scope.EmailPdfReport(fileName, binary, "application/pdf");
        }
        else
            options.doc.save(fileName);
    }

    $scope.GetReportsFilter = function () {
        ReportService.GetMediaReportFilters().then(function (l) {
            $scope.MediaTypeListAll = l.data.MediaTypesList;
            var currentUserRoles = $rootScope.UserObject.UserRoles;
            var isAdmin = currentUserRoles.indexOf("Media-Admin") != -1;
            if (isAdmin) {
                $.each($scope.MediaTypeListAll, function (key, value) {
                    $scope.MediaTypeList.push({ "label": value.Text, "id": "" + value.Value });
                });
            } else {
                var mediaType = [];
                if (currentUserRoles.indexOf("Media-Print") != -1) {
                    mediaType = $.grep($scope.MediaTypeListAll, function (a) {
                        return a.MediaTypeId == 3;
                    });
                    $scope.MediaTypeList.push({ "label": mediaType[0].Text, "id": "" + mediaType[0].Value });
                }
                if (currentUserRoles.indexOf("Media-Radio") != -1) {
                    mediaType = $.grep($scope.MediaTypeListAll, function (a) {
                        return a.MediaTypeId == 2;
                    });
                    $scope.MediaTypeList.push({ "label": mediaType[0].Text, "id": "" + mediaType[0].Value });
                }
                if (currentUserRoles.indexOf("Media-TV") != -1) {
                    mediaType = $.grep($scope.MediaTypeListAll, function (a) {
                        return a.MediaTypeId == 1;
                    });
                    $scope.MediaTypeList.push({ "label": mediaType[0].Text, "id": "" + mediaType[0].Value });
                }
            }

            $scope.MediaTypeListAll = l.data.MediaTypesList;
            $scope.NewsTypeListAll = l.data.NewsTypeList;
            $scope.ChannelsListAll = l.data.ChannelsList;
            $scope.CategoriesListAll = l.data.CategoriesList;
            $scope.RelevanceListAll = l.data.NewsRelatedToList;
            $scope.SentimentListAll = l.data.SentimentList;
            $scope.AgentListAll = l.data.AgentList;

            $scope.CategoriesList = new Array();
            $.each($scope.CategoriesListAll, function (key, value) {
                $scope.CategoriesList.push({ label: value.Text, id: value.Value });
            });

            $scope.RelevanceList = new Array();
            $.each($scope.RelevanceListAll, function (key, value) {
                $scope.RelevanceList.push({ label: value.Text, id: value.Value });
            });
        }, function (err) {
            GlobalService.ErrorPopup("Error", err.data.Message);
        });
    };

    $scope.filterMediaRecords = function () {
        var sentimentFilter = parseInt($scope.filterType.id);
        var nfiSumFilter = parseInt($scope.filterTypeNFISum.id);
        var nfiIndFilter = parseInt($scope.filterTypeNFIInd.id);
        var newsFilter = parseInt($scope.filterTypeMediaNews.id);
        var relFilter = parseInt($scope.filterTypeRel.id);
        var catFilter = parseInt($scope.filterTypeCat.id);
        var ntFilter = parseInt($scope.filterTypeNT.id);
        var agentFilter = parseInt($scope.filterTypeAgent.id);

        $scope.GenerateReportWithFilter(1, newsFilter);
        $scope.GenerateReportWithFilter(2, nfiSumFilter);
        $scope.GenerateReportWithFilter(3, nfiIndFilter);
        $scope.GenerateReportWithFilter(4, sentimentFilter);
        $scope.GenerateReportWithFilter(5, relFilter);
        $scope.GenerateReportWithFilter(6, catFilter);
        $scope.GenerateReportWithFilter(7, ntFilter);
        $scope.GenerateReportWithFilter(8, agentFilter);
        $scope.GenerateReportWithFilter(9, 1);
    };

    $scope.mediaEventListeners = {
        onItemSelect: onItemSelectMedia
    };

    function onItemSelectMedia(property) {
        var mediaTypeId = property.id;

        var newsTypeList = $.grep($scope.NewsTypeListAll, function (a) {
            return a.MediaTypeId == mediaTypeId;
        });

        var channelList = $.grep($scope.ChannelsListAll, function (a) {
            return a.MediaTypeId == mediaTypeId;
        });

        $scope.newsType = [];
        $scope.channelType = [];
        $scope.NewsTypeList = new Array();
        $scope.ChannelsList = new Array();


        $.each(newsTypeList, function (key, value) {
            $scope.NewsTypeList.push({ "label": value.Text, "id": "" + value.Value });
        });

        $.each(channelList, function (key, value) {
            $scope.ChannelsList.push({ "label": value.Text, "id": "" + value.Value });
        });

        $scope.filterMediaRecords();
    }

    $scope.newsEventListeners = {
        onSelectionChanged: onItemSelectNews
    };

    function onItemSelectNews() {
        $scope.filterMediaRecords();
    }

    $scope.channelEventListeners = {
        onSelectionChanged: onItemSelectChannel
    };

    function onItemSelectChannel() {
        $scope.filterMediaRecords();
    }

    $scope.categoryEventListeners = {
        onSelectionChanged: onItemSelectCategory
    };

    function onItemSelectCategory() {
        $scope.filterMediaRecords();
    }


    $scope.relavanceEventListeners = {
        onSelectionChanged: onItemSelectRelavance
    };

    function onItemSelectRelavance() {
        $scope.filterMediaRecords();
    }

    $scope.GetHighChartConfig = function (chartType, xAxisType, reportTitle, filterTitle, categories, series, stacking) {
        return {
            options: {
                chart: {
                    type: chartType
                },
                xAxis: {
                    categories: categories,
                    type: xAxisType,
                    labels: {
                        formatter: function () {
                            if (xAxisType == "category")
                                return this.value;
                            else
                                return moment(this.value).format("DD-MM-YYYY HH:mm");
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: filterTitle
                    },
                    allowDecimals: false,
                    plotOptions: {
                        "series": {
                            "stacking": "",
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                                format: '{point.y}'
                            }
                        }
                    }
                },
                plotOptions: {
                    column: {
                        stacking: stacking,
                        dataLabels: {
                            stacking: 'normal',
                            enabled: true,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'black',
                            style: {
                                ////textShadow: '0 0 3px black, 0 0 3px black'
                                "font-size": '22px'
                            }
                        }
                    }
                },
                exporting: {
                    buttons: {
                        contextButton: {
                            menuItems: $scope.menuItems
                        }
                    }
                }
            },
            legend: {
                align: 'right',
                x: -70,
                verticalAlign: 'top',
                y: 20,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.x + '</b><br/>' +
                        this.series.name + ': ' + this.y + '<br/>' +
                        'Total: ' + this.point.stackTotal;
                }
            },
            series: series,
            title: {
                text: reportTitle + ' By ' + filterTitle
            },
            loading: false,
            "credits": {
                "enabled": false
            }
        };
    }

    $scope.GenerateReportWithFilter = function (reportType, filterType) {
        var colorCoding = [{ Name: "Positive", Value: "#00B050" }, { Name: "Neutral", Value: "#FFC000" }, { Name: "Negative", Value: "#C00000" }, { Name: "General", Value: "#4286f4" }, { Name: "KE", Value: "#f5931f" }, { Name: "Other Disco", Value: "#00b050" }];
        var mediaType = $scope.mediaType.id !== undefined ? parseInt($scope.mediaType.id) : 0;
        var newsType = "";
        $scope.newsType.forEach(function (i) {
            newsType += i.id + ","
        });
        if (newsType.length > 0)
            newsType = newsType.substring(0, newsType.length - 1);
        else
            newsType = "0";

        var channel = "";
        $scope.channelType.forEach(function (i) {
            channel += i.id + ","
        });
        if (channel.length > 0)
            channel = channel.substring(0, channel.length - 1);
        else
            channel = "0";

        var categories = "";
        $scope.categoryModel.forEach(function (i) {
            categories += i.id + ","
        });
        if (categories.length > 0)
            categories = categories.substring(0, categories.length - 1);
        else
            categories = "0";

        var relavances = "";
        $scope.relevanceModel.forEach(function (i) {
            relavances += i.id + ","
        });
        if (relavances.length > 0)
            relavances = relavances.substring(0, relavances.length - 1);
        else
            relavances = "0";

        var dateFrom = moment($scope.startDate).add(5, "hours");
        var dateTo = moment($scope.endDate).add(5, "hours");

        ReportService.GetMediaReport(mediaType, newsType, channel, categories, relavances, dateFrom, dateTo, $scope.script, false, reportType, filterType).then(function (l) {
            var response = l.data;
            var reportTitle, filterTitle, chartType, xAxisType = "";
            var mediaTypes = [];
            var series = [];

            if (filterType == 1) {
                filterTitle = "Media Type";
                chartType = "column";
                xAxisType = "category";
            }
            else if (filterType == 2) {
                filterTitle = "News Type";
                chartType = "column";
                xAxisType = "category";
            }
            else if (filterType == 3) {
                filterTitle = "Channel";
                chartType = "column";
                xAxisType = "category";
            }
            else if (filterType == 4) {
                filterTitle = "Category";
                chartType = "column";
                xAxisType = "category";
            }
            else if (filterType == 5) {
                filterTitle = "Per Weekday";
                chartType = "column";
                xAxisType = "category";
            }
            else if (filterType == 6) {
                filterTitle = "Per Hour";
                chartType = "column";
                xAxisType = "category";
            }
            else if (filterType == 7) {
                filterTitle = "Evolution over time (Date wise)";
                chartType = "line";
                xAxisType = "datetime";
            }
            else if (filterType == 8) {
                filterTitle = "Evolution over time (Hour wise)";
                chartType = "line";
                xAxisType = "datetime";
            }

            if (reportType == 1) {
                var recordsData = [];
                reportTitle = "Media News";

                if (filterType >= 1 && filterType <= 6) {
                    response.forEach(function (i) {
                        recordsData.push({
                            name: i.XAxis,
                            y: i.Value1
                        });
                        mediaTypes.push(i.XAxis);
                    });

                    series.push({
                        name: reportTitle,
                        colorByPoint: true,
                        data: recordsData
                    });
                }
                else if (filterType == 7 || filterType == 8) {
                    response.forEach(function (i) {
                        recordsData.push({
                            name: i.InsertionDate,
                            y: i.Value1
                        });
                        mediaTypes.push(i.InsertionDate);
                    });

                    series.push({
                        name: reportTitle,
                        data: recordsData
                    });
                }

                $scope.MediaNewsChartConfig = $scope.GetHighChartConfig(chartType, xAxisType, reportTitle, filterTitle, mediaTypes, series, false);
            }
            else if (reportType == 2) {
                var recordsData = [];
                reportTitle = "Noise Frequency";

                if (filterType >= 1 && filterType <= 6) {
                    response.forEach(function (i) {
                        recordsData.push({
                            name: i.XAxis,
                            y: i.Value1
                        });
                        mediaTypes.push(i.XAxis);
                    });

                    series.push({
                        name: reportTitle,
                        colorByPoint: true,
                        data: recordsData
                    });
                }
                else if (filterType == 7 || filterType == 8) {
                    response.forEach(function (i) {
                        recordsData.push({
                            name: i.InsertionDate,
                            y: i.Value1
                        });
                        mediaTypes.push(i.InsertionDate);
                    });

                    series.push({
                        name: reportTitle,
                        data: recordsData
                    });
                }

                $scope.NoiseFrequencySumChartConfig = $scope.GetHighChartConfig(chartType, xAxisType, reportTitle, filterTitle, mediaTypes, series, false);
            }
            else if (reportType == 3) {
                reportTitle = "Noise Frequency";
                var positiveData = [];
                var negativeData = [];

                if (filterType >= 1 && filterType <= 6) {
                    response.forEach(function (i) {
                        positiveData.push({
                            name: i.XAxis,
                            y: i.Value1
                        });
                        negativeData.push({
                            name: i.XAxis,
                            y: i.Value2
                        });
                        mediaTypes.push(i.XAxis);
                    });
                }
                else if (filterType == 7 || filterType == 8) {
                    response.forEach(function (i) {
                        positiveData.push({
                            name: i.InsertionDate,
                            y: i.Value1
                        });
                        negativeData.push({
                            name: i.InsertionDate,
                            y: i.Value2
                        });
                        mediaTypes.push(i.InsertionDate);
                    });
                }

                series.push({
                    name: 'Positive Index',
                    data: positiveData
                });
                series.push({
                    name: 'Negative Index',
                    data: negativeData
                });

                $scope.NoiseFrequencyIndividualChartConfig = $scope.GetHighChartConfig(chartType, xAxisType, reportTitle, filterTitle, mediaTypes, series, false);
            }
            else if (reportType == 4) {
                reportTitle = "Sentiment Analysis";
                var _2DData = [];

                response.forEach(function (i) {
                    var inc = 1;
                    var name;
                    if (filterType >= 1 && filterType <= 6)
                        name = i.XAxis;
                    else if (filterType == 7 || filterType == 8)
                        name = i.InsertionDate;

                    $scope.SentimentListAll.forEach(function (j) {
                        if (_2DData[inc - 1] == undefined) {
                            _2DData.push([]);
                        }
                        if (i['Value' + inc] == null)
                            i['Value' + inc] = 0;
                        _2DData[inc - 1].push({
                            name: name,
                            y: i['Value' + inc]
                        });
                        inc++;
                    });
                    mediaTypes.push(name);
                });

                var inc = 0;
                _2DData.forEach(function (obj) {
                    series.push({
                        name: $scope.SentimentListAll[inc].Text,
                        color: colorCoding.filter(function (el) {
                            return el.Name == $scope.SentimentListAll[inc].Text;
                        })[0].Value,
                        data: obj
                    });
                    inc++;
                });

                $scope.SentimentAnalysisChartConfig = $scope.GetHighChartConfig(chartType, xAxisType, reportTitle, filterTitle, mediaTypes, series, false);
            }
            else if (reportType == 5) {
                reportTitle = "Relevance Analysis";
                var _2DData = [];

                response.forEach(function (i) {
                    var inc = 1;
                    var name;
                    if (filterType >= 1 && filterType <= 6)
                        name = i.XAxis;
                    else if (filterType == 7 || filterType == 8)
                        name = i.InsertionDate;

                    $scope.RelevanceListAll.forEach(function (j) {
                        if (_2DData[inc - 1] == undefined) {
                            _2DData.push([]);
                        }
                        if (i['Value' + inc] == null)
                            i['Value' + inc] = 0;
                        _2DData[inc - 1].push({
                            name: name,
                            y: i['Value' + inc]
                        });
                        inc++;
                    });
                    mediaTypes.push(name);
                });

                var inc = 0;
                _2DData.forEach(function (obj) {
                    series.push({
                        name: $scope.RelevanceListAll[inc].Text,
                        color: colorCoding.filter(function (el) {
                            return el.Name == $scope.RelevanceListAll[inc].Text;
                        })[0].Value,
                        data: obj
                    });
                    inc++;
                });

                $scope.RelevanceAnalysisChartConfig = $scope.GetHighChartConfig(chartType, xAxisType, reportTitle, filterTitle, mediaTypes, series, false);
            }
            else if (reportType == 6) {
                reportTitle = "Category Analysis";
                var _2DData = [];

                response.forEach(function (i) {
                    var inc = 1;
                    var name;
                    if (filterType >= 1 && filterType <= 6)
                        name = i.XAxis;
                    else if (filterType == 7 || filterType == 8)
                        name = i.InsertionDate;

                    $scope.CategoriesListAll.forEach(function (j) {
                        if (_2DData[inc - 1] == undefined) {
                            _2DData.push([]);
                        }
                        if (i['Value' + inc] == null)
                            i['Value' + inc] = 0;
                        _2DData[inc - 1].push({
                            name: name,
                            y: i['Value' + inc]
                        });
                        inc++;
                    });
                    mediaTypes.push(name);
                });

                var inc = 0;
                _2DData.forEach(function (obj) {
                    series.push({
                        name: $scope.CategoriesListAll[inc].Text,
                        data: obj
                    });
                    inc++;
                });

                $scope.CategoryAnalysisChartConfig = $scope.GetHighChartConfig(chartType, xAxisType, reportTitle, filterTitle, mediaTypes, series, true);
            }
            else if (reportType == 7) {
                reportTitle = "NewsType Analysis";
                var _2DData = [];
                var elementId = [];

                $scope.NewsTypeListAll.filter(el => {
                    if (elementId.indexOf(el.Text) === -1 && (el.MediaTypeId == mediaType || mediaType == 0)) {
                        // If not present in array, then add it
                        elementId.push(el.Text);
                    }
                });

                response.forEach(function (i) {
                    var inc = 1;
                    var name;
                    if (filterType >= 1 && filterType <= 6)
                        name = i.XAxis;
                    else if (filterType == 7 || filterType == 8)
                        name = i.InsertionDate;

                    elementId.forEach(function (j) {
                        if (_2DData[inc - 1] == undefined) {
                            _2DData.push([]);
                        }
                        if (i['Value' + inc] == null)
                            i['Value' + inc] = 0;
                        _2DData[inc - 1].push({
                            name: name,
                            y: i['Value' + inc]
                        });
                        inc++;
                    });
                    mediaTypes.push(name);
                });

                var inc = 0;
                _2DData.forEach(function (obj) {
                    series.push({
                        name: elementId[inc],
                        data: obj
                    });
                    inc++;
                });

                $scope.NewsTypeAnalysisChartConfig = $scope.GetHighChartConfig(chartType, xAxisType, reportTitle, filterTitle, mediaTypes, series, true);
            }
            else if (reportType == 8) {
                reportTitle = "Agent Performance Evaluation";
                var _2DData = [];
                var stacked = false;
                filterTitle = $.grep($scope.FilterListAgent, function (a) {
                    return a.id == $scope.filterTypeAgent.id;
                })[0].label;

                if (filterType == 1 || filterType == 2 || filterType == 5) {
                    response.forEach(function (i) {
                        _2DData.push({
                            name: i.XAxis,
                            y: i.Value1
                        });
                        mediaTypes.push(i.XAxis);
                    });

                    series.push({
                        name: reportTitle,
                        colorByPoint: true,
                        data: _2DData
                    });
                }
                else if (filterType == 3 || filterType == 4 || filterType == 6 || filterType == 7) {
                    response.forEach(function (i) {
                        var inc = 1;
                        var name;
                        if (filterType == 3 || filterType == 6) {
                            name = i.InsertionDate;
                            chartType = "line";
                            xAxisType = "datetime";
                        }
                        else if (filterType == 4 || filterType == 7) {
                            name = i.XAxis;
                            chartType = "column";
                            xAxisType = "category";
                            stacked = true;
                        }

                        $scope.AgentListAll.forEach(function (j) {
                            if (_2DData[inc - 1] == undefined) {
                                _2DData.push([]);
                            }
                            if (i['Value' + inc] == null)
                                i['Value' + inc] = 0;
                            _2DData[inc - 1].push({
                                name: name,
                                y: i['Value' + inc]
                            });
                            inc++;
                        });
                        mediaTypes.push(name);
                    });

                    var inc = 0;
                    _2DData.forEach(function (obj) {
                        series.push({
                            name: $scope.AgentListAll[inc].Text,
                            data: obj
                        });
                        inc++;
                    });
                }
                $scope.AgentPerformanceChartConfig = $scope.GetHighChartConfig(chartType, xAxisType, reportTitle, filterTitle, mediaTypes, series, stacked);
            }
            else if (reportType == 9) {
                $scope.TotalPRValue = response[0].Value1;
            }
        }, function (err) {
            GlobalService.ErrorPopup("Error", err.data.Message);
        });
    }

    $scope.filterEventListeners = {
        onItemSelect: onItemSelectFilter
    };

    function onItemSelectFilter(property) {
        $scope.GenerateReportWithFilter(4, property.id);
    }

    $scope.filterRelEventListeners = {
        onItemSelect: onItemSelectFilterRel
    };

    function onItemSelectFilterRel(property) {
        $scope.GenerateReportWithFilter(5, property.id);
    }

    $scope.filterCatEventListeners = {
        onItemSelect: onItemSelectFilterCat
    };

    function onItemSelectFilterCat(property) {
        $scope.GenerateReportWithFilter(6, property.id);
    }

    $scope.filterNTEventListeners = {
        onItemSelect: onItemSelectFilterNT
    };

    function onItemSelectFilterNT(property) {
        $scope.GenerateReportWithFilter(7, property.id);
    }

    $scope.filterNFISumEventListeners = {
        onItemSelect: onItemSelectFilterNFISum
    };

    function onItemSelectFilterNFISum(property) {
        $scope.GenerateReportWithFilter(2, property.id);
    }

    $scope.filterNFIIndEventListeners = {
        onItemSelect: onItemSelectFilterNFIInd
    };

    function onItemSelectFilterNFIInd(property) {
        $scope.GenerateReportWithFilter(3, property.id);
    }

    $scope.filterMediaNewsEventListeners = {
        onItemSelect: onItemSelectFilterMediaNews
    };

    function onItemSelectFilterMediaNews(property) {
        $scope.GenerateReportWithFilter(1, property.id);
    }

    $scope.filterAgentEventListeners = {
        onItemSelect: onItemSelectFilterAgents
    };

    function onItemSelectFilterAgents(property) {
        $scope.GenerateReportWithFilter(8, property.id);
    }

    //

    $scope.resetMediaRecords = function () {
        $scope.init();
    }

    $scope.EmailPdfReport = function (fileName, content, type) {
        GlobalService.ConfirmPopup("Confirm", "Are you sure you want to email report?", function (selectedItem) {
            //alert($window.location.hash.split('?')[0])
            if (selectedItem) {
                ReportService.EmailPdfReport(fileName, content, type).then(function (l) {
                    var response = l.data;
                    if (response) {
                        var msg = "Media Report successfully sent by Email";
                        notify({
                            message: msg,
                            position: GlobalService.position,
                            duration: GlobalService.duration
                        });
                    }
                }, function (err) {
                    GlobalService.ErrorPopup("Error", err.data.Message);
                });
            }
        });
    };


    if ($rootScope.UserObject != undefined)
        $scope.init();

}]);