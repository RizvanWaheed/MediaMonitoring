CRMApp.controller('LoginController', ['$rootScope', '$scope', 'AuthService', '$location', '$window', '$cookies', '$stateParams', 'GlobalService', 'notify', function ($rootScope, $scope, AuthService, $location, $window, $cookies, $stateParams, GlobalService, notify) {
    $scope.appType = $stateParams.appType;

    $scope.GetSSODetails = function () {
        
        var ssoToken = $location.search().ssotoken;
        var app = $location.search().app;
        if (ssoToken && app && ssoToken.length > 0 && app.length > 0) {
            $scope.GetSSOUserName(ssoToken, app);
        }

    }

    $scope.GetSSOUserName = function (ssoToken, appId) {
        AuthService.GetSSOUserName(ssoToken, appId).then(function (l) {
            if (l != null) {
                if (l.data && l.data.trim().length > 0) {
                    $scope.Email = l.data;
                    $scope.DoSSOLogin(l.data);
                }
            }
            else {
                // alert('Invalid Username or Password.');
                GlobalService.ErrorPopup("Error", "Invalid Username or Password, please try again.");
            }
        }, function (err) {
            //alert('Error in login, please try again.');
            GlobalService.ErrorPopup("Error", err.responseJSON.error_description);
            //GlobalService.ErrorPopup("Error", "The user Id or password you entered is incorrect. Kindly check caps lock and (or) enter correct user Id/password and try again.");
            console.log(err);

            $scope.credCheck = "Block";
        });

    }
    $scope.DoSSOLogin = function (userName) {
        AuthService.SSOLogin(userName).then(function (l) {
            if (l != null) {
                AuthService.ExternalUserProfile($scope.Email).then(function (l) {
                    if (l != null) {
                        l.data.AppType = l.data.AppType !== "" ? l.data.AppType : "Media";
                        $cookies.putObject("userSession", l.data, { path: '/' });
                        var MediaType = "";
                        if (l.data.UserRoles.indexOf("Media-Admin") !== -1 || l.data.UserRoles.indexOf("Media-TV") !== -1)
                            MediaType = "TV";
                        if (l.data.UserRoles.indexOf("Media-Print") !== -1)
                            MediaType = "Print";
                        if (l.data.UserRoles.indexOf("Media-Radio") !== -1)
                            MediaType = "Radio";
                        if ($scope.appType == "Media")
                            $location.url("/Media/AddMediaNews?Media=" + MediaType);
                            //$window.location.href = "#/Media/AddMediaNews?Media=" + MediaType;
                    }
                    else {
                        GlobalService.ErrorPopup("Error", "Error in fetching data, please try again.");

                    }
                }, function (err) {
                    //alert('Error in fetching data, please try again.');
                    GlobalService.ErrorPopup("Error", "Error in fetching data, please try again.");
                    console.log(err);
                });
            }
            else {
                // alert('Invalid Username or Password.');
                GlobalService.ErrorPopup("Error", "Invalid Username or Password, please try again.");
            }
        }, function (err) {
            //alert('Error in login, please try again.');
            GlobalService.ErrorPopup("Error", err.responseJSON.error_description);
            //GlobalService.ErrorPopup("Error", "The user Id or password you entered is incorrect. Kindly check caps lock and (or) enter correct user Id/password and try again.");
            console.log(err);

            $scope.credCheck = "Block";
        });

    }
     
    /*AuthService.VerifyCookies().then(function (l) {
        if (l.data == true) {
            if ($rootScope.IsAdmin == true)
                $window.location.href = "#/MembershipPackages";
            else
                $window.location.href = "#/PersonalProfile";
        }
    });*/

    $scope.currentDate = new Date();
    $scope.Login = function () {
        AuthService.Login($scope.Email, $scope.Password, $scope.appType).then(function (l) {
            if (l != null) {
                AuthService.UserProfile($scope.Email, $scope.appType).then(function (l) {
                    if (l != null) {
                        $cookies.putObject("userSession", l.data, { path: '/' });

                        var MediaType = "";
                        if (l.data.UserRoles.indexOf("Media-Admin") !== -1 || l.data.UserRoles.indexOf("Media-TV") !== -1)
                            MediaType = "TV";
                        if (l.data.UserRoles.indexOf("Media-Print") !== -1)
                            MediaType = "Print";
                        if (l.data.UserRoles.indexOf("Media-Radio") !== -1)
                            MediaType = "Radio";
                        
                        if ($scope.appType == "Media")
                            $window.location.href = "#/Media/AddMediaNews?Media=" + MediaType;
                    }
                    else {
                        GlobalService.ErrorPopup("Error", "Error in fetching data, please try again.");
                    }
                }, function (err) {
                    GlobalService.ErrorPopup("Error", "Error in fetching data, please try again.");
                    console.log(err);
                });

            }
            else {
               // alert('Invalid Username or Password.');
                GlobalService.ErrorPopup("Error", "Invalid Username or Password, please try again.");

               
            }
        }, function (err) {
            //alert('Error in login, please try again.');
            GlobalService.ErrorPopup("Error", 'Unable to login');
            //GlobalService.ErrorPopup("Error", "The user Id or password you entered is incorrect. Kindly check caps lock and (or) enter correct user Id/password and try again.");
            console.log(err);
        });
    }
    $scope.GetSSODetails();
}]);