var app = angular.module("CongressSandesh", ['ngRoute', 'base64', 'ngStorage', 'angular-md5', 'ngValidate', 'socialbase.sweetAlert', 'google.places', 'directive.g+signin', 'checklist-model', 'ngSanitize', 'infinite-scroll', 'rzModule', 'ksSwiper', 'angular-scroll-animate', 'ui.swiper', 'ui.bootstrap', 'ngMaterial', 'ngFileUpload', 'ui.select2', 'daterangepicker', 
    'socialLogin','720kb.socialshare', 'textAngular','bw.paging', 'ngTagsInput', 'vcRecaptcha', 'hl.sticky']);
app.$inject = ['SweetAlert'];

var rootUrl = 'http://congresssandesh.co.in/';
var serviceUrl = 'http://congresssandesh.co.in/beta/api/services/';
var apiKey = 'YzMxYjMyMzY0Y2UxOWNhOGZjZDE1MGE0MTdlY2NlNTg=';
// var apiUrl = 'http://congresssandesh.co.in/beta/api/admin_services/';
var apiUrl = 'http://congresssandesh.co.in/beta/api/admin_services/'
var imageToolLink = "http://congresssandesh.co.in/beta/api/image-tool/index.php?src=";


// var rootUrl = 'http://192.168.50.67/nyaysandesh/';
// var serviceUrl = 'http://192.168.50.67/nyaysandesh/beta/api/services/';
// var apiKey = 'YzMxYjMyMzY0Y2UxOWNhOGZjZDE1MGE0MTdlY2NlNTg=';
// var apiUrl = 'http://192.168.50.67/nyaysandesh/beta/api/admin_services/';
// var imageToolLink = "http://192.168.50.67/nyaysandesh/beta/api/image-tool/index.php?src=";

// https://ifsc.razorpay.com/SBIN0013370

/*var APIKEY = 'OTU4MTkuOTM2Njk2MjQ5MjI=';*/

app.config(['$locationProvider', '$routeProvider', '$validatorProvider', 'socialProvider', function ($locationProvider, $routeProvider, $validatorProvider, socialProvider) {

    /** Adding validation method for password **/
    $validatorProvider.addMethod("pwcheck", function (value, element, param) {
        return (/[A-Z]/.test(value) && /\d/.test(value) && /[$@$!%*#?&]/.test(value));
    }, 'Password must contain 1 special character, 1 Capital letter and 1 Digit!');

    $validatorProvider.addMethod("pwcheck", function (value, element) {
        param = typeof param === "string" ? param.replace(/,/g, '|') : "png|jpe?g|gif";
        return this.optional(element) || value.match(new RegExp(".(" + param + ")$", "i"));
    }, 'Please enter a value with a valid extension!');

    /** Adding validation method for letters only **/
    $validatorProvider.addMethod("lettersonly", function (value, element) {
        return this.optional(element) || /^[a-z]+$/i.test(value);
    }, "Special characters and numbers are not allowed!");

    /** Adding validation method for letters only **/
    $validatorProvider.addMethod("alphaonly", function (value, element) {
        return this.optional(element) || /^[a-zA-Z\s]+$/i.test(value);
    }, "Special characters and numbers are not allowed!");

    /** Adding validation method for product name only **/
    $validatorProvider.addMethod("alphanum", function (value, element) {
        return this.optional(element) || /^[a-zA-Z0-9&\s]+$/i.test(value);
    }, "Enter valid name!");


    $locationProvider.hashPrefix('');
    $validatorProvider.addMethod("pwcheck", function (value, element) {
        /*return this.optional(element) || /^http:\/\/mydomain.com/.test(value);*/
        return (/[A-Z]/.test(value) && /\d/.test(value) && /[$@$!%*#?&]/.test(value));
        // has a digit
    }, "Password must contain 1 special character, 1 Capital letter and 1 Digit!");
    $validatorProvider.addMethod('notEqualTo', function (value, element, param) {
        var target = $(param);
        if (this.settings.onfocusout && target.not(".validate-equalTo-blur").length) {
            target.addClass("validate-equalTo-blur").on("blur.validate-equalTo", function () {
                $(element).valid();
            });
        }
        return value !== target.val();
    }, 'Please enter other string, string should be diffrent.');

    $validatorProvider.addMethod('validate_name', function (value, element) {
        /*return this.optional(element) || /^http:\/\/mydomain.com/.test(value);*/
        return (/^[A-Za-z]?[A-Za-z ]*$/.test(value));
        // has a digit
    }, 'Please enter valid name.');

    $validatorProvider.addMethod('floating_val', function (value, element) {
        /*return this.optional(element) || /^http:\/\/mydomain.com/.test(value);*/
        return (/^\d{1,5}([\.](\d{1,4})?)?$/.test(value));
        // has a digit
    }, 'Please enter valid value.');
    $validatorProvider.addMethod('email', function (value, element) {
        /*return this.optional(element) || /^http:\/\/mydomain.com/.test(value);*/
        return (/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(value));
        // has a digit
    }, 'Please enter valid email.');

    $validatorProvider.addMethod("url", function(value, element) {
        if (value) {
            return this.optional(element) || /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}(:[0-9]{1,6})?(\/.*)?$/i.test(value);
        } else {
            return 1;
        }

        // return this.optional(element) || /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(value);

    }, "Please enter valid url!");

    socialProvider.setGoogleKey("959225726665-mpkhleai0t91e7i1jd0altjncpsrvqmh.apps.googleusercontent.com");
    socialProvider.setFbKey({appId: "952576291562900", apiVersion: "v2.10"});


    $routeProvider
        .when("/login", { templateUrl: "templates/login.html?v=8.9", title: "LogIn" })
        // .when("/dashboard", { templateUrl: "templates/dashboard.html?v=8.9", controller: "dashboardController", title: "Dashboard" })
        .when("/", { templateUrl: "templates/dashboard_user.html?v=8.9", controller: "userDashboardController",title: "Dashboard" })
        .when("/profile", { templateUrl: "templates/profile.html?v=8.9", controller: "userController", title: "My Profile" })
        .when("/manage-news", { templateUrl: "templates/news.html?v=8.9", controller: "NewsController", title: "Manage News" })
        .when("/documents", { templateUrl: "templates/filemanager.html?v=8.9", controller: "fileManagerController", title: "Documents", is_filterd_page : true, is_sort_page : true })
        .when("/videos", { templateUrl: "templates/filemanager.html?v=8.9", controller: "fileManagerController", title: "Videos", is_filterd_page : true, is_sort_page : true })
        .when("/resource-center", { templateUrl: "templates/filemanager.html?v=8.9", controller: "fileManagerController", title: "Resource Center" })
        .when("/resource-center/videos", { templateUrl: "templates/filemanager.html?v=8.9", controller: "fileManagerController", title: "Resource Center", is_sort_page : true })
        .when("/resource-center/docs", { templateUrl: "templates/filemanager.html?v=8.9", controller: "fileManagerController", title: "Resource Center", is_sort_page : true })
        .when("/resource-center/creatives", { templateUrl: "templates/filemanager.html?v=8.9", controller: "fileManagerController", title: "Resource Center", is_sort_page : true })
        .when("/resource-center/news_links", { templateUrl: "templates/filemanager.html?v=8.9", controller: "fileManagerController", title: "Resource Center", is_sort_page : true })
        .when("/resource-center/:file_id/:file_name", { templateUrl: "templates/file_details.html?v=8.9", controller: "fileDetailsController", title: "Resource Center" })
        // .when("/campaign", { templateUrl: "templates/filemanager.html?v=8.9", controller: "fileManagerController", title: "Campaign" })
        .when("/links", { templateUrl: "templates/filemanager.html?v=8.9", controller: "fileManagerController", title: "Links" })   
        .when("/manage_categories", { templateUrl: "templates/manage_categories.html?v=8.9", controller: "fileManagerController", title: "Manage Categories" })
        .when("/search", { templateUrl: "templates/dashboard.html?v=8.9", controller: "fileManagerController",title: "Search Posts" })
        .when("/search/:search_str", { templateUrl: "templates/filemanager.html?v=8.9", controller: "fileManagerController", title: "Search Results" })
        .when("/documents/:folder_id/:folder_name", { templateUrl: "templates/filemanager.html?v=8.9", controller: "fileManagerController", title: "Documents" })
        .when("/videos/:folder_id/:folder_name", { templateUrl: "templates/filemanager.html?v=8.9", controller: "fileManagerController", title: "Videos" })
        .when("/links/:folder_id/:folder_name", { templateUrl: "templates/filemanager.html?v=8.9", controller: "fileManagerController", title: "Links" })
        .when("/spokes-persons/:spokePersonId/:spoke_person_name", { templateUrl: "templates/spokes_persons.html?v=8.9", controller: "fileManagerController", title: "Links" })
        .when("/reset_password/:token", { templateUrl: "templates/reset_password.html?v=8.9", title: "Reset Password" })
        .when("/spokes-persons", { templateUrl: "templates/spokes_persons.html?v=8.9", controller: "spokesPersonsController", title: "Spokespersons" })
        .when("/manage_spokesperson", { templateUrl: "templates/manage_spokesperson.html?v=8.9", controller: "spokesPersonsController", title: "Manage Spokespersons" })
        .when("/aicc-communication-twitter", { templateUrl: "templates/aicc-communication-twitter.html?v=8.9", controller: "feeds", title: "AICC Communication Feeds" })
        .when("/incIndia-twitter", { templateUrl: "templates/incIndia-twitter.html?v=8.9", controller: "feeds", title: "INC India Feeds" })
        .when("/rahulgandhi-twitter", { templateUrl: "templates/rahulgandhi-twitter.html?v=8.9", controller: "feeds", title: "Rahul Gandhi Twitter Feeds" })
        .when("/randeepsingh-twitter", { templateUrl: "templates/randeepsingh-twitter.html?v=8.9", controller: "feeds", title: "Randeep Singh Twitter Feeds" })
        .when("/manage_suggestions", { templateUrl: "templates/suggestion_list.html?v=8.9", controller: "suggationsController", title: "Manage Suggestions" })
        .when("/suggestion", { templateUrl: "templates/suggestion.html?v=8.9", controller: "fileManagerController", title: "Leave your Suggestion" })
        .when("/verify/:token", {templateUrl : "templates/login.html?v=8.9", title : "Verify Account"})
        .when("/privacy", { templateUrl: "templates/privacy.html?v=8.9", controller: "privacyController", title: "Privacy" })
        .when("/manage_user", { templateUrl: "templates/manage_user.html?v=8.9", controller: "userController", title: "Manage User" })
        .when("/notification", { templateUrl: "templates/notification.html?v=8.9", controller: "userController", title: "Notification" })
        .when("/notifications", { templateUrl: "templates/notifications.html?v=8.9", controller: "notificationController", title: "Notifications" })
        .otherwise({ redirectTo: "/" });

    $locationProvider.html5Mode(true);

}]);


app.run(function ($rootScope, $location, $localStorage, $http, $window, $document, $route) {
    /*$rootScope.rootUrl = rootUrl;*/
    $rootScope.hideHeader = false;
    var history = [];
    $rootScope.screen_width = screen.width;

    $rootScope.$on('$routeChangeStart', function (evt, current, previous) {
        $rootScope.is_filterd_page = false;
        $rootScope.is_sort_page = false;
        $rootScope.pageLoaded = true;

        if ($location.path().indexOf('manage_user') !== -1 && $location.search().q == '4') {
            $rootScope.hideHeader = true;
            $rootScope.is_mobile_view = true;
        } else {
            $rootScope.is_mobile_view = false;
        }

        if (!previous) {
            $rootScope.pageLoaded = false;
            // landingScreen();
            if (!$rootScope.hideHeader) {
                $(".landing_loader").fadeIn();
                $("body").css("overflow-y", "hidden");
            }
        
        // setTimeout(function() {
        //     $(".landing_loader").fadeOut();
        //     $("body").css("overflow-y", "auto");
        // }, 3000);
        }

        $rootScope.baseUrl = new $window.URL($location.absUrl()).origin;
        rootUrl = $rootScope.baseUrl + '/';
        // rootUrl = $rootScope.baseUrl + '/';
        serviceUrl = rootUrl+'beta/api/services/';
        apiUrl = rootUrl+'beta/api/admin_services/';
        imageToolLink = rootUrl+"beta/api/image-tool/index.php?src=";
        
        $rootScope.page_title = current.$$route ? current.$$route.title : "";
        $rootScope.activeMenu =current.$$route ?  current.$$route.activeMenu : "";
        $rootScope.activeSubmenu = current.$$route ? current.$$route.activeSubmenu : "";
        $rootScope.is_filterd_page = current.$$route ? current.$$route.is_filterd_page : false;
        $rootScope.is_sort_page = current.$$route ? current.$$route.is_sort_page : false;


        var path = $location.path();

        if ($location.path().indexOf('reset_password') === -1) {
            if ($location.path().indexOf("/search") !== -1 && !$rootScope.$storage.cgu_id) {
                $location.path("/login");
            }
        }

        if ($location.path().indexOf('verify') !== -1) {
            $rootScope.verifyUser();
        }

        // if ($location.path() == "/" || $location.path().indexOf('reset_password') !== -1) {
        //     if ($rootScope.$storage.cgu_id) {
        //         $location.path("/");
        //     }
        // }


        $rootScope.activePath = $location.path();
    });

    $rootScope.$on('$routeChangeSuccess', function (evt, next, current) {
        setTimeout(function() {
             $(".landing_loader").fadeOut();
            $("body").css("overflow-y", "auto");
        }, 2000);
        $rootScope.pageLoaded = true;
    });
});

app.directive('ngFile', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('change', function () {
                $parse(attrs.ngFile).assign(scope, element[0].files)
                scope.$apply();
            });
        }
    };
}]);

app.directive("whenScrolled", function(){
  return{
    
    restrict: 'A',
    link: function(scope, elem, attrs){
    
      // we get a list of elements of size 1 and need the first element
      raw = elem[0];
    
      // we load more elements when scrolled past a limit
      elem.bind("scroll", function(){
        if(raw.scrollTop+raw.offsetHeight+5 >= raw.scrollHeight){
          scope.loading = true;
          
        // we can give any function which loads more elements into the list
          scope.$apply(attrs.whenScrolled);
        }
      });
    }
  }
});

app.directive('stringToNumber', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(value) {
        return '' + value;
      });
      ngModel.$formatters.push(function(value) {
        return parseFloat(value);
      });
    }
  };
});

app.directive('modal', ['$document',
function($document) {
    return {
        template : '<div class="modal fade">' + '<div class="modal-dialog">' + '<div class="modal-content">' + '<div class="modal-header">' + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + '<h4 class="modal-title">{{ title }}</h4>' + '</div>' + '<div class="modal-body" ng-transclude></div>' + '</div>' + '</div>' + '</div>',
        restrict : 'E',
        transclude : true,
        replace : true,
        scope : true,
        link : function postLink(scope, element, attrs) {
            scope.title = attrs.title;
            scope.$watch(attrs.visible, function(value) {
                if (value == true) {
                    $(element).modal('show');
                    $('body').css({
                        "overflow" : "hidden"
                    });
                    $('.page-container').css({
                        "z-index" : "999999"
                    });
                } else {
                    $(element).modal('hide');
                    $('body').css({
                        "overflow-y" : "visible"
                    });
                    $('.page-container').css({
                        "z-index" : "999"
                    });
                }
            });
            $(element).on('shown.bs.modal', function() {
                scope.$apply(function() {
                    scope.$parent[attrs.visible] = true;
                    $('input:text:visible:first', this).focus();
                });
            });
            $(element).on('hidden.bs.modal', function() {
                scope.$apply(function() {
                    scope.$parent[attrs.visible] = false;
                });
            });

            function escHandler(event) {
                if (event.keyCode === 27) {
                    scope.$apply(function() {
                        scope.$parent[attrs.visible] = false;
                    });
                }
            }
            $document.on('keydown', escHandler);
        }
    };
}]);

app.directive('hires', function() {
    return {
        restrict : 'A',
        scope : {
            hires : '@'
        },
        link : function(scope, element, attrs) {
            element.one('load', function() {
                element.attr('src', scope.hires);
            });
        }
    };
});

app.filter('groupBy', function () {
    return _.memoize(function (items, field) {
        return _.groupBy(items, field);
    });
});

app.filter("trustUrl", ['$sce', function ($sce) {
    return function (recordingUrl) {
        return $sce.trustAsResourceUrl(recordingUrl);
    };
}]);

app.filter('trustAsResourceUrl', ['$sce', function ($sce) {
    return function (val) {
        return $sce.trustAsResourceUrl(val);
    };
}]);


app.filter('strReplace', function () {
  return function (input, from, to) {
    input = input || '';
    from = from || '';
    to = to || '';
    return input.trim().replace(new RegExp(from, 'g'), to);
  };
});

app.controller("MainController", function ($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $mdToast, $timeout, $document) {
    $rootScope.baseUrl = new $window.URL($location.absUrl()).origin;
    rootUrl = $rootScope.baseUrl + '/';
    // rootUrl = $rootScope.baseUrl + '/';
    serviceUrl = rootUrl+'beta/api/services/';
    apiUrl = rootUrl+'beta/api/admin_services/';
    imageToolLink = rootUrl+"beta/api/image-tool/index.php?src=";
  

    $("body").on("click", ".modal", function(e) {
        if ($(e.target).hasClass('modal')) {
            var hidePopup = $(e.target).attr('id');
            $('#' + hidePopup).modal('hide');
        }
    });

    $scope.is_show_pwd = false;
    $scope.is_show_old_pwd = false;
    $scope.is_show_new_pwd = false;
    $scope.is_show_cp_pwd = false;

    $scope.togglePassword = function(id) {
        if ($("#"+id).attr("type") == "password") {
            $("#"+id).attr("type", "text");
            if (id == 'password') {
                $scope.is_show_pwd = true;
            } else if (id == 'old_password') {
                $scope.is_show_old_pwd = true;
            } else if (id == 'new_password') {
                $scope.is_show_new_pwd = true;
            } else if (id == 'cp_password') {
                $scope.is_show_cp_pwd = true;
            }
        } else {
            $("#"+id).attr("type", "password");
            if (id == 'password') {
                $scope.is_show_pwd = false;
            } else if (id == 'old_password') {
                $scope.is_show_old_pwd = false;
            } else if (id == 'new_password') {
                $scope.is_show_new_pwd = false;
            } else if (id == 'cp_password') {
                $scope.is_show_cp_pwd = false;
            }
        }
    }

    $scope.toggleSideBar = function () {
        if ($("#container").hasClass('mainnav-sm')) {
            $("#container").removeClass('mainnav-sm');
            $("#container").addClass('mainnav-lg');
            $(".hidden_close_nav").removeClass('brand-icon_visible');
            $(".menu_overlay").fadeIn();
            $('.mobile_show_menu').addClass('show');
        } else {
            // $('.mobile_show_menu').addClass('show');
            $("#container").removeClass('mainnav-lg');
            $("#container").addClass('mainnav-sm');
            $(".hidden_close_nav").addClass('brand-icon_visible');
            $(".menu_overlay").fadeIn();
        }
    }


    $scope.downloadCreatives = function(files) {
        angular.forEach(files, function (file) {
            var link = document.createElement('a');
            link.setAttribute('download', '');
            link.setAttribute('target', "_blank");
            link.style.display = 'none';

            document.body.appendChild(link);
            link.setAttribute('href', file.image_org_path);
            link.click();
            document.body.removeChild(link);
        });

    }
    
    $scope.open_filter_drawer = function () {
        $(".sort_filter_drawer_mobile").removeClass('open');        
        $(".filter_sort_overlay").removeClass('open');        
        $(".display_mobile_filters").toggleClass('open');        
        $(".filter_overlay").toggleClass('open');        
    }

    $scope.open_sort_filter_drawer = function () {
        $(".display_mobile_filters").removeClass('open');        
        $(".filter_overlay").removeClass('open');        
        $(".sort_filter_drawer_mobile").toggleClass('open');        
        $(".filter_sort_overlay").toggleClass('open');        
    }

    $scope.open_search_popup_mobile = function () {
        $(".mobile_search_files_videos").toggleClass('open');  
    }

    $scope.toggleSideBar_close_only = function () {
        if ($("#container").hasClass('mainnav-lg')) {
            $('.mobile_show_menu').removeClass('show');
            $("#container").removeClass('mainnav-lg');
            $("#container").addClass('mainnav-sm');
            $(".hidden_close_nav").removeClass('brand-icon_visible');
        } else {
            $("#container").addClass('mainnav-sm');
        }

        $(".menu_overlay").fadeOut();

        
    }
    
    $scope.tab = 1;

    $scope.setTab = function(newTab){
      $scope.tab = newTab;
    };

    $scope.isSet = function(tabNum){
      return $scope.tab === tabNum;
    };
    
    $rootScope.active_tab_sign_up = function(tabNum){
        $scope.tab = tabNum;
    }

    // $scope.mobile_toggleSideBar = function () {
    //     if ($("#mainnav-container").hasClass('mobile_nav')) {
    //         $("#mainnav-container").addClass('mobile_nav_open');
    //         $(".overlay_mobile_menu").addClass('open');
    //     } else {
    //         $("#mainnav-container").removeClass('mobile_nav_open');
    //         $(".overlay_mobile_menu").removeClass('open');
    //     }        
    // }

    // if ($(window).width() < 767) {
    //     $scope.mobile_toggleSideBar=function() {
    //         $scope.toggle = !$scope.toggle;
    //     }
    // }

    $rootScope.$storage = $localStorage;
    $scope.imageToolLink = imageToolLink;
    $scope.rootUrl =rootUrl;


    $rootScope.toBase64 = function(string) {
        return $base64.encode(unescape(encodeURIComponent(string)));
    }
    $rootScope.fromBase64 = function(string) {
        return decodeURIComponent(escape($base64.decode(string)));
    }

    $rootScope.toSlug  = function(string) {
        string = string ? string.trim() : "";
        return string ? string.replace(/\s+/g, '-').toLowerCase() : "";
    }

    $rootScope.removeUderscore  = function(string) {
        string = string ? string.trim() : "";
        return string ? string.replace(/_/g, ' ') : "";
    }
    
    $rootScope.removeDash  = function(string) {
        string = string.trim();
        return string.replace(/-/g, ' ');
    }

    // $rootScope.toggleMobileMenu = function () {
    //     $('.mobile_show_menu').toggleClass('show');
    // }
    $rootScope.ch_pass_open = false;
    $scope.openChangePModal = function () {
        $rootScope.ch_pass_open = true;
        $rootScope.openCpModal();
    }

    $scope.login = {};
    $rootScope.showLoginBox = true;

    $rootScope.toggleLoginBox = function(){
        $rootScope.showLoginBox = !$rootScope.showLoginBox;
        $rootScope.login_message = "";
        $rootScope.login_message_class = "";
        $scope.login = {};
    }

    $scope.validateLogin = {
        onkeyup: function(element) {
            this.element(element);
        },
        rules : {
            user_name: {
                required: true,
            },
            email : {
                required : true,
                digits: true,
                rangelength  : [10, 10],
            },
            password : {
                required : true
            }
        },
        messages : {
            user_name: {
                required: "Enter your Email Address / Contact no.",
            },
            email : {
                required : "Enter an Contact no address.",
                digits    : "Contact no must be of 10 digits.",
                rangelength  : "Contact no must be of 10 digits."
            },
            password : {
                required : "Enter a password."
            }
        }
    }

    $scope.getLoginUserData = function() {
        if ($rootScope.$storage.cgu_id) {
            $http({
              method: 'POST',
              url: apiUrl + 'getUserDetails',
              data : {
                'apiId': apiKey,
                'user_id': $rootScope.$storage.cgu_id
              }
            }).then(function successCallback(response) {
                response = response.data;
                if(response.success == 1){
                    if (response.user.user_type != 0) {
                        $rootScope.$storage.cgu_name = response.user.fullname;
                        $rootScope.$storage.cgu_pic = response.user.profile_pic_path;
                        if (response.user.user_type == 4) {
                           $rootScope.$storage.cgu_type = 'third-party';
                        } else {
                            $rootScope.$storage.cgu_type = 'user';
                        }
                    } else {
                        $rootScope.$storage.cgu_name = response.user.fullname;
                        $rootScope.$storage.cgu_pic = response.user.profile_pic_path;
                        $rootScope.$storage.cgu_type = 'admin';
                    }

                    if (($rootScope.$storage.cgu_email != response.user.email) || ($rootScope.$storage.cgu_phone != response.user.phone)) {
                        // $rootScope.logout();
                    } else {
                        $rootScope.$storage.cgu_email = response.user.email;
                        $rootScope.$storage.cgu_phone = response.user.phone;
                    }
                }
            }, function errorCallback(response) {
            
            });
        }
    }
    $scope.getLoginUserData();

    $scope.submittingLogin = false;
    $scope.login = {};
    $scope.do_login = function(form){
         if(form.validate() && !$scope.submittingLogin) {
            $scope.submittingLogin = true;
            $http({
              method: 'POST',
              url: apiUrl + 'login',
              data : {
                'apiId': apiKey,
                'email' : $scope.login.user_name,
                'password' : $scope.login.password,
                'device_type': "desktop",
                'login_user_id': $rootScope.$storage.cgu_id
              }
            }).then(function successCallback(response) {
                response = response.data;
                if(response.success == 1){
                    $scope.login = {};
                    if (response.user.redirect_to_admin != 1) {
                        // $rootScope.login_message = "Incorrect email or password, Please try again!";
                        // $rootScope.login_message_class = "error-label";
                        $rootScope.login_message = response.message;
                        $rootScope.login_message_class = "success-label";
                        $timeout(function () {
                            $rootScope.$storage.cgu_id = $rootScope.toBase64(response.user.id);
                            $rootScope.$storage.cgu_name = response.user.fullname;
                            $rootScope.$storage.cgu_pic = response.user.profile_pic;
                            $rootScope.$storage.cgu_email = response.user.email;
                            $rootScope.$storage.cgu_phone = response.user.phone;
                            if (response.user.user_type == 4) {
                               $rootScope.$storage.cgu_type = 'third-party';
                            } else {
                                $rootScope.$storage.cgu_type = 'user';
                            }
                            $rootScope.$storage.cgu_snout = Number(moment().add(1, 'day').format('x'));

                            $rootScope.login_message = "";
                            $rootScope.login_message_class = "";

                            $location.path("/");  
                        }, 1000);
                    } else {
                        $rootScope.login_message = response.message;
                        $rootScope.login_message_class = "success-label";
                        $timeout(function () {
                            $rootScope.$storage.cgu_id = $rootScope.toBase64(response.user.id);
                            $rootScope.$storage.cgu_name = response.user.fullname;
                            $rootScope.$storage.cgu_pic = response.user.profile_pic;
                            $rootScope.$storage.cgu_type = 'admin';
                            $rootScope.$storage.cgu_email = response.user.email;
                            $rootScope.$storage.cgu_phone = response.user.phone;
                            $rootScope.$storage.cgu_snout = Number(moment().add(1, 'day').format('x'));
                            $rootScope.login_message = "";
                            $rootScope.login_message_class = "";
                            
                            $location.path("/");  
                        }, 1000);
                    }

                    $rootScope.$storage.cgu_ac_type = response.user.account_type;

                }
                else{
                    $scope.login.password = "";
                    $rootScope.login_message = response.message;
                    $rootScope.login_message_class = "error-label";
                }
                
                $scope.submittingLogin = false;

                $timeout(function () {
                    $rootScope.login_message = "";
                    $rootScope.login_message_class = "";
                }, 10000);
                
            }, function errorCallback(response) {
            
            });
                    
         }
    }

    $scope.submittingForgotForm = false;
    
    $scope.validateForgotPassword = {
        onkeyup: function(element) {
            this.element(element);
        },
        rules : {
            email : {
                required : true,
                email  : true
            }
        },
        messages : {
            email : {
                required : "Enter an email address.",
                email    : "Email must be in format of example@domain.ext"
            }
        }   
    }

    $scope.validateregister = {
        onkeyup: function(element) {
            this.element(element);
        },
        rules : {
            fullname: {
                required: true
            },
            // user_name: {
            //     required: true
            // },
            email : {
                required : true,
                email  : true
            },
            contact : {
                required : true,
                number:true,
                minlength:10,
                maxlength:10
            },
            state: {
                required : true
            },
            city: {
                required : true
            },
            account_type: {
                required : true
            },
            facebook_link: {
                url : true
            },
            twitter_link: {
                url : true
            }

            // position : {
            //     required : true
            // },
            // reg_password : {
            //     required : true,
            //     pwcheck : true,
            // },
            // reg_con_password : {
            //     required : true,
            //     equalTo : "#reg_password"   
            // }
        },
        messages : {
            fullname: {
                required: "Enter your Full Name."
            },
            // user_name: {
            //     required: "Enter your User Name."
            // },
            email : {
                required : "Enter an email address.",
                email    : "Email must be in format of example@domain.ext"
            },
            contact: {
                required : "Enter Contact Number.",
                number: "Please enter valid Contact Number.",
                minlength:"Please enter minmum 10 numbers.",
                maxlength:"Please enter maximum 10 numbers."
            },
            state:{
                required : "Select your state."
            },
            city:{
                required : "Select your district."
            },
            account_type:{
                required : "Select user type."
            },
            facebook_link: {
                url : "Please enter valid link."
            },
            twitter_link: {
                url : "Please enter valid link."
            }
            // position: {
            //     required : "Enter your position.",
            // },
            // reg_password : {
            //     required : "Please enter new password!"
            // },
            // reg_con_password : {
            //     required : "Please re enter your new password!",
            //     equalTo : "Passwords do not matched, Please re enter again!"    
            // }
        }
    }

    $scope.states = [];
    $scope.getStates = function() {
        $http({
          method: 'POST',
          url: apiUrl + 'states',
          data: {
            apiId: apiKey
          }
        }).then(function successCallback(response) {
            response = response.data;
            if(response.success == 1){
                $scope.states = response.states;
            }
            else{
                $scope.states = [];
            }
        }, function errorCallback(response) {
        
        });
    }

    $scope.getStates();


    $scope.districts = [];
    $scope.loadDistricts = function(state) {
        $http({
          method: 'POST',
          url: apiUrl + 'districts',
          data: {
            apiId: apiKey,
            state: state
          }
        }).then(function successCallback(response) {
            response = response.data;
            if(response.success == 1){
                $scope.districts = response.districts;
            }
            else{
                $scope.districts = [];
            }
        }, function errorCallback(response) {
        
        });
    }


    $scope.submittingLogin = false;
    $scope.register = {};
    $scope.register_user = function(form){
         if(form.validate() && !$scope.submittingLogin) {
            $scope.submittingLogin = true;
            $scope.register.apiId = apiKey;
            $scope.register.from_app = 'true';
            $scope.register.account_type = 'Other';

            var formData = new FormData();
            angular.forEach($scope.register, function (val, key) {
                formData.append(key, val);
            });

            $http({
              method: 'POST',
              url: apiUrl + 'signup',
              data: formData,
              headers: {'Content-Type': undefined}
            }).then(function successCallback(response) {
                response = response.data;
                if(response.success == 1){
                    $scope.register = {};
                    $rootScope.login_message = response.message;
                    $rootScope.login_message_class = "success-label";
                }
                else{
                    $rootScope.login_message = response.message;
                    $rootScope.login_message_class = "error-label";
                }
                $scope.submittingLogin = false;
            }, function errorCallback(response) {
            
            });
                    
         }
    }

    $rootScope.verifyUser = function () {
        
        $timeout(function () {
            if ($routeParams.token) {
                $http({
                  method: 'POST',
                  url: apiUrl + 'verify_user',
                  data : {
                    'apiId': apiKey,
                    'auth_token' : $routeParams.token,
                  }
                }).then(function successCallback(response) {
                    response = response.data;
                    if(response.success == 1){
                        $location.path("/login");
                       
                        $timeout(function () {
                            $rootScope.login_message = response.message;
                            $rootScope.login_message_class = "success-label";
                        }, 100);

                        $timeout(function () {
                            $rootScope.login_message = "";
                            $rootScope.login_message_class = "";
                        }, 6000);
                    }
                    else{
                       
                        $timeout(function () {
                            $rootScope.login_message = response.message;
                        $rootScope.login_message_class = "error-label";
                        }, 100);

                         $timeout(function () {
                            $rootScope.login_message = "";
                            $rootScope.login_message_class = "";
                        }, 6000);
                    }

                 
                }, function errorCallback(response) {
                });
            }   
        }, 1000);
    }


    $scope.loadCounters = function () {

        $http({
            method: "POST",
            url: apiUrl + "totalCounters",
            data: {
                apiId: apiKey,
                login_user_id: $rootScope.$storage.cgu_id
            }
        }).then(function (response) {
            response = response.data;
            if (response.success == 1) {
                $rootScope.document_files = response.document_files;
                $rootScope.image_files = response.image_files;
                $rootScope.zip_files = response.zip_files;
                $rootScope.video_files = response.video_files;
                $rootScope.total_folders = response.total_folders;
                $rootScope.total_news = response.total_news;
                $rootScope.total_published_news = response.total_published_news;
                $rootScope.total_draft_news = response.total_draft_news;
                $rootScope.total_trash_news = response.total_trash_news;
                $rootScope.doc_files_count = response.doc_files_count;
                $rootScope.video_files_count = response.video_files_count;
                $rootScope.link_files_count = response.link_files_count;
                $rootScope.rc_files_count = response.rc_files_count;
                $rootScope.campaign_files_count = response.campaign_files_count;
            }
        }, function (error) {
        })
    }

    $scope.loadCounters();
    
    $scope.submitForgotPassword = function(form){
         if(form.validate() && !$scope.submittingForgotForm) {
            $scope.submittingForgotForm = true;
            $http({
              method: 'POST',
              url: apiUrl + 'forgot_password',
              data : {
                'apiId' : apiKey,
                'email' : $scope.login.email,
              }
            }).then(function successCallback(response) {
                response = response.data;
                if(response.success == 1){
                    $rootScope.toggleLoginBox();
                    $timeout(function () {
                        $rootScope.login_message = response.message;
                        $rootScope.login_message_class = "success-label";
                    }, 10);
                    $scope.login = {};
                }
                else{
                    $rootScope.login_message = response.message;
                    $rootScope.login_message_class = "error-label";
                }
                $scope.submittingForgotForm = false;
            }, function errorCallback(response) {
            
            });
                    
         }
    }

    $scope.validateResetPassword = {
        onkeyup: function(element) {
            this.element(element);
        },
        rules : {
            new_password : {
                required : true,
                minlength : 5,
            },
            re_password : {
                required : true,
                equalTo : "#new_password" 
            }
        },
        messages : {
            new_password : {
                required : "Please enter new password!",
                minlength: "Your Password must be contains at list 5 characters long.",
            },
            re_password : {
                required : "Please re enter your new password!",
                equalTo : "Passwords do not matched, Please re enter again!"    
            }
        }
    }

    $scope.pwd = {};
    $scope.submittingReset = false;
    $scope.submitResetPW = function(form){
         if(form.validate() && !$scope.submittingReset) {
            $scope.submittingReset = true;
            $http({
              method: 'POST',
              url: apiUrl + 'reset_password',
              data : {
                'apiId' : apiKey,
                'new_password' : md5.createHash($scope.pwd.new_password),
                'new_password_org' : $scope.pwd.new_password,
                'reset_token' : $routeParams.token,
              }
            }).then(function successCallback(response) {
                response = response.data;
                if(response.success == 1){
                    $rootScope.login_message = response.message;
                    $rootScope.login_message_class = "success-label";

                    $location.path("/");
                    $scope.pwd = {};
                }
                else{
                    $rootScope.response_message = response.message;
                    $rootScope.response_class = "error-label";
                }
                $scope.submittingReset = false;
            }, function errorCallback(response) {
            
            });
                    
         }
    }

    $scope.root_folders = [];
    $scope.loadRootFolders = function () {
        if (!$scope.root_loading) {
            $scope.root_loading = true;
            $http({
                method: "POST",
                url: apiUrl + "root_folders",
                data: {
                    apiId: apiKey,
                    login_user_id: $rootScope.$storage.cgu_id
                }
            }).then(function (response) {
                response = response.data;
                if (response.success == 1) {
                    $scope.root_folders = response.folders;
                    $scope.root_loading = false;
                    if (!$routeParams.folder_id && $scope.root_folders.length > 0) {
                        // $rootScope.active_folder_id = $scope.root_folders[0]["id"];
                        if ($routeParams.folder_id) {
                            $rootScope.loadFolders(0, '15', $routeParams.folder_id);
                        }
                    } else {
                        // $rootScope.active_folder_id = $rootScope.fromBase64($routeParams.folder_id);
                    }

                    if ($routeParams.folder_id) {
                        $rootScope.active_folder_id = $rootScope.fromBase64($routeParams.folder_id);
                    } else {
                        $rootScope.active_folder_id = "";
                    }
                }  else {
                    $scope.root_loading = false;
                }
                
            }, function (error) {
            })
        }
    }

    $scope.loadRootFolders();

    $scope.searchFiles = function (page, limit, folder_id, search) {
        // if ($location.path().indexOf("file-manager") !== -1 && $routeParams.folder_id) {
        //     // $location.path("/search/"+search);
        //     $("#search-input").focusout();
        //     $window.location.href = rootUrl + "#/search/"+search;
        //     // if ( $routeParams.folder_id) {
        //     //     $rootScope.loadFolders(page, limit,  $routeParams.folder_id);
        //     // } else {
        //     //     $rootScope.loadFolders(page, limit);
        //     // }

        // } else {
        //     // $location.path("/search/"+search);
        //     $("#search-input").focusout();
        //     $window.location.href = rootUrl + "#/search/"+search;
        //     // if ( $routeParams.folder_id) {
        //     //     $rootScope.loadFolders(page, limit,  $routeParams.folder_id);
        //     // } else {
        //     //     $rootScope.loadFolders(page, limit);
        //     // }
        // }

        $timeout(function () {
            $("#search-input").trigger('focusout');
        }, 1000);

        $window.location.href = rootUrl + "search/"+search;
          
    }

    $scope.getUserData = function () {
        $http({
            method: "POST",
            url: apiUrl + "getUserDetails",
            data: {
                apiId: apiKey,
                user_id: $rootScope.$storage.cgu_id,
                login_user_id: $rootScope.$storage.cgu_id
            }
        }).then(function (response) {
            response = response.data;
            if (response.success == 1) {
                $scope.user = response.user;
            } else {
                $mdToast.show({
                    template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                    hideDelay: 5000,
                    position: 'bottom right'
                });
            }
        }, function (error) {
            console.log(error);
        });
    };

    if ($rootScope.$storage.cgu_id) {
        $scope.getUserData();
    }

    $scope.loadingNotification = false;
    $scope.noti_post_busy = false;
    $scope.no_more_noti = false;
    $scope.notification_page = 0;
    $scope.notification_limit = 10;

    $scope.notifications = [];


    $scope.getVideoId = function(url) {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = url.match(regExp);

        if (match && match[2].length == 11) {
            return match[2];
        } else {
            return 'error';
        }
    }


    $scope.loadNotifications = function (page, limit) {
        console.log($scope.noti_post_busy, $scope.no_more_noti, $scope.loadingNotification);




        if (!$scope.noti_post_busy && !$scope.no_more_noti && !$scope.loadingNotification) {
            $scope.loadingNotification = true;
            $scope.noti_post_busy = true;

            $http({
                method: "POST",
                url: apiUrl + "notifications",
                data: {
                    apiId: apiKey,
                    login_user_id: $rootScope.$storage.cgu_id,
                    user_id: $rootScope.$storage.cgu_id,
                    page: page,
                    limit: limit
                }
            }).then(function (response) {
                response = response.data;
                if (response.success == 1) {
                    $scope.total_notifications = response.count;
                    if (page == 0) {
                        $scope.notifications = [];
                    }

                    angular.forEach(response.notifications, function (notification) {
                        if ((notification.post_type == "video" || notification.post_type == "resource_center" || notification.post_type == "campaign")&& notification.link) {
                            var videoId = $scope.getVideoId(notification.link);
                            notification.video_thumb = "https://img.youtube.com/vi/"+videoId+"/hqdefault.jpg";
                        }
                        $scope.notifications.push(notification);
                    });

                    if (response.notifications.length < $scope.notification_limit) {
                        $scope.no_more_noti = true;
                    }

                    console.log($scope.notifications.length, $scope.no_more_noti);

                    $scope.notification_page = page + 1;
                    $scope.noti_post_busy = false;
                    $scope.loadingNotification = false;
                } else {
                    $scope.no_more_noti = true;
                    $scope.noti_post_busy = false;
                    $scope.loadingNotification = false;
                }
            }, function (error) {
            })
        }


    }
    // $scope.loadNotifications($scope.notification_page, $scope.notification_limit);


    $scope.previewImg = function (id) {
        $("#"+id).fadeIn();
    }

    $scope.close_prev_img = function (id) {
        $("#"+id).fadeOut();
    }

    $scope.activeIndex = 0;
    $scope.previewCreativeImg = function (id, index) {
        $scope.activeIndex = index;
        $("#"+id).fadeIn();
    }

    $scope.close_creative_prev_img = function (id) {
        $("#"+id).fadeOut();
        $scope.activeIndex = 0;
    }

    $scope.moveSlide = function(direction, album) {
        if (direction == 'left') {
            if ($scope.activeIndex != 0) {
                $scope.activeIndex -= 1;
            } else {
                $scope.activeIndex = album.length - 1;
            }
        } else {
            if ($scope.activeIndex <  (album.length -1)) {
                $scope.activeIndex += 1;
            } else {
                $scope.activeIndex = 0;
            }
        }
    }


    $scope.notificationDivOpen = function (type) {
        if (type == "open") {
            $(".notification_sidebar").addClass("open");
            $(".menu_overlay").fadeIn(); 
        } else {
            $(".notification_sidebar").removeClass("open");
            $(".menu_overlay").fadeOut(); 
            $scope.loadingNotification = false;
            $scope.noti_post_busy = false;
            $scope.no_more_noti = false;
            $scope.notification_page = 0;
        }
    }

    $rootScope.logout = function () {
        $rootScope.$storage.cgu_id = null;
        $rootScope.$storage.cgu_name = null;
        $rootScope.$storage.cgu_pic = null;
        $rootScope.$storage.cgu_type = null;
        $rootScope.$storage.cgu_email = null;
        $rootScope.$storage.cgu_phone = null;
        $location.path("/");
    }
});
app.controller("dashboardController", function ($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $mdToast, $timeout) {
    $scope.loadCounters = function () {
        $http({
            method: "POST",
            url: apiUrl + "totalCounters",
            data: {
                apiId: apiKey,
                login_user_id: $rootScope.$storage.cgu_id
            }
        }).then(function (response) {
            response = response.data;
            if (response.success == 1) {
                $scope.document_files = response.document_files;
                $scope.image_files = response.image_files;
                $scope.zip_files = response.zip_files;
                $scope.video_files = response.video_files;
                $scope.total_folders = response.total_folders;
                $scope.total_news = response.total_news;
                $scope.total_published_news = response.total_published_news;
                $scope.total_draft_news = response.total_draft_news;
                $scope.total_trash_news = response.total_trash_news;
            }
        }, function (error) {
        })
    }

    $scope.loadCounters();
});
app.controller("fileManagerController", function ($scope, $location, $sce, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $mdToast, $timeout, Upload, vcRecaptchaService) {
    
    $scope.current_page = 0;
    $scope.page_limit = "15";
    $scope.loading = false;
    $scope.root_loading = false;
    $scope.root_folders = [];
    $scope.folders = [];
    $scope.files = [];
    $scope.breadcrumbs = [];
    $scope.selection = {ids: [], file_ids: []};
    $rootScope.search = {};
    $scope.filters = {categories:[],sub_folder:''};
    $scope.sort_by = "date_modified_desc";

    $scope.creative_imgs = [];
    $scope.file_album = [];

    if ($location.path().indexOf("search") !== -1) {
        $scope.search_page = true;
    } else {
        $scope.search_page = false;
    }

    if ($routeParams.folder_id) {
        $rootScope.active_folder_id = $rootScope.fromBase64($routeParams.folder_id);
    } else {
        $rootScope.active_folder_id = "";
    }



    $scope.audio_file_ext = ['wav', 'mp3', 'dct', 'ogg', 'gsm', 'dct', 'flac', 'au', 'aiff', 'vox', 'raw', 'm4a','aac','oga'];
    $scope.image_file_ext = ['ai', 'bmp', 'gif', 'ico', 'jpeg', 'jpg', 'png', 'ps', 'psd', 'svg', 'tif', 'tiff'];
    $scope.creative_file_ext = ['webp'];
    $scope.video_file_ext = ['3g2', '3gp', 'avi', 'flv', 'h264', 'm4v', 'mkv', 'mov', 'mp4', 'mpg', 'mpeg', 'rm', 'swf', 'vob', 'wmv'];
    $scope.music_file_ext = ['aif', 'cda', 'mid', 'midi', 'mp3', 'mpa', 'ogg', 'wav', 'wma', 'wpl'];
    $scope.zip_file_ext = ['7z', 'arj', 'deb', 'pkg', 'rar', 'rpm', 'tar.gz', 'gz', 'z', 'zip'];
    $scope.doc_file_ext = ['doc', 'docx', 'odt'];
    $scope.excel_file_ext = ['xlsx', 'xlr', 'xls'];
    $scope.pdf_file_ext = ['pdf'];
    $scope.text_file_ext = ['txt'];
    $scope.csv_file_ext = ['csv'];

    if ($location.path().indexOf("documents") !== -1) {
        $rootScope.active_tab = "documents";
        $scope.file_exts = "'."+$scope.doc_file_ext.join(',.') + ',.' + $scope.excel_file_ext.join(',.') + ",.pdf,.csv,.txt'";
    } else if ($location.path().indexOf("links") !== -1 && $location.path().indexOf("news_links") === -1) {
        $rootScope.active_tab = "links";
    } else if ($location.path().indexOf("resource-center") !== -1) {
        $rootScope.active_tab = "resource_centers";
        $scope.file_exts = "'."+$scope.doc_file_ext.join(',.') + ',.' + $scope.excel_file_ext.join(',.') + ',.' + $scope.video_file_ext.join(',.') + ',.' + $scope.image_file_ext.join(',.') + ',.' + $scope.audio_file_ext.join(',.') + ",.pdf,.csv,.txt'";
    } else if ($location.path().indexOf("videos") !== -1) {
        $rootScope.active_tab = "videos";
        $scope.file_exts = "'."+$scope.video_file_ext.join(',.')+"'";
    } else if ($location.path().indexOf("campaign") !== -1) {
        $rootScope.active_tab = "campaigns";
        $scope.file_exts = "'."+$scope.doc_file_ext.join(',.') + ',.' + $scope.excel_file_ext.join(',.') + ',.' + $scope.video_file_ext.join(',.') + ',.' + $scope.image_file_ext.join(',.') + ',.' + $scope.audio_file_ext.join(',.') + ",.pdf,.csv,.txt'";
    }


    $scope.upload_video = function(file) {
        if ($scope.file_obj.folder_name != 'creatives') {
            if (file) {
                var fileReader = new FileReader();
                  
                fileReader.onload = function(e) {
                    var blob = new Blob([fileReader.result], {type: file.type});
                    var url = URL.createObjectURL(blob);
                    var video = document.createElement('video');
                    var timeupdate = function() {
                        if (snapImage()) {
                            video.removeEventListener('timeupdate', timeupdate);
                            video.pause();
                        }
                    };
                    video.addEventListener('loadeddata', function() {
                        if (snapImage()) {
                            video.removeEventListener('timeupdate', timeupdate);
                        }
                    });

                    var snapImage = function() {
                        var canvas = document.createElement('canvas');
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                        var image = canvas.toDataURL();
                        var success = image.length > 60000;
                        if (success) {
                          // var img = document.createElement('img');
                          // img.src = image;

                          // console.log(image, '+++');
                          $scope.file_obj.video_thumb = image;
                          $("#video_thumb").val(image);
                          // document.getElementsByTagName('div')[0].appendChild(img);
                          URL.revokeObjectURL(url);
                        } else {
                            // console.log(image.length, 'image.length');
                        }
                        return success;
                    };

                    video.addEventListener('timeupdate', timeupdate);
                    video.preload = 'metadata';
                    video.src = url;
                    // Load video in Safari / IE11
                    video.muted = true;
                    video.playsInline = true;
                    video.play();
                };
                fileReader.readAsArrayBuffer(file);
            }

        }
    }

    

    $scope.getId = function(url) {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = url.match(regExp);

        if (match && match[2].length == 11) {
            return match[2];
        } else {
            return 'error';
        }
    }



    // $scope.post_busy = false;
    // $scope.no_more_data = false;
    $scope.loadRootFolders = function () {
        if (!$scope.root_loading) {
            $scope.root_loading = true;
            $http({
                method: "POST",
                url: apiUrl + "root_folders",
                data: {
                    apiId: apiKey,
                    login_user_id: $rootScope.$storage.cgu_id
                }
            }).then(function (response) {
                response = response.data;
                if (response.success == 1) {
                    $scope.root_folders = response.folders;
                    $scope.root_loading = false;
                }  else {
                    $scope.root_loading = false;
                }
                
            }, function (error) {
            })
        }
    }

    $scope.loadRootFolders();

    $scope.cat_loading = false;
    $scope.categories = [];
    $scope.filter_categories = [];
    $scope.all_categories = [];
    $scope.loadCategories = function (searchSTR, flag) {
        if (!$scope.cat_loading) {

            if($rootScope.$storage.cgu_type == 'user'){
                $filtered = "filtered";
            }
            else{
                $filtered = "";   
            }
            $scope.cat_loading = true;
            $http({
                method: "POST",
                url: apiUrl + "categories",
                data: {
                    apiId: apiKey,
                    post_type: ($rootScope.active_tab && flag !== 'all') ? $rootScope.active_tab.substr(0, $rootScope.active_tab.length - 1) : "",
                    flag: ($scope.search_page && flag !== 'all') ? 'filtered' : '',
                    search_str: searchSTR ? searchSTR : "",
                    login_user_id: $rootScope.$storage.cgu_id
                }
            }).then(function (response) {
                response = response.data;
                if (response.success == 1) {
                    $scope.categories = response.categories;

                    if (searchSTR) {
                        $scope.search_cat_string = searchSTR;
                    } else {
                        $scope.search_cat_string = "";
                    }

                    if ($scope.search_page) {
                        $scope.filter_categories = response.categories;
                    }

                    if (flag == 'all') {
                        $scope.all_categories = response.categories;
                    }


                    if($rootScope.$storage.cgu_type == 'user'){
                       $scope.categories = $scope.categories.filter(function (a) {
                            if (Number(a.total_file) > 0) {
                                return a;
                            }

                       })
                    }

                    $scope.cat_loading = false;
                }  else {
                    $scope.cat_loading = false;
                }
                
            }, function (error) {
            })
        }
    }

    $scope.loadCategories();

    $scope.clearCatSearch = function () {
        $scope.loadCategories();
        $("#demo-input-searchBox").val("");
    }

    $scope.spoke_person_loading = false;

    $scope.spokespersons = [];
    $scope.filter_spokespersons = [];
    $scope.all_spokespersons = [];
    $scope.loadSpokePersons = function (searchSTR, flag) {
        if (!$scope.spoke_person_loading) {
            $scope.spoke_person_loading = true;
            $http({
                method: "POST",
                url: apiUrl + "spokes_persons",
                data: {
                    apiId: apiKey,
                    flag: (($scope.search_page || $rootScope.$storage.cgu_type == 'user') && flag !== 'all') ? 'filtered' : '',
                    search_str: searchSTR ? searchSTR : "",
                    login_user_id: $rootScope.$storage.cgu_id
                }
            }).then(function (response) {
                response = response.data;
                if (response.success == 1) {

                    $scope.spokespersons = response.spokes_persons;
                     
                    if ($scope.search_page) {
                        $scope.filter_spokespersons = response.spokes_persons;
                    }

                    if (flag == "all") {
                        $scope.all_spokespersons = response.spokes_persons;
                    }

                    $scope.spoke_person_loading = false;
                }  else {
                    $scope.spoke_person_loading = false;
                }
                
            }, function (error) {
            })
        }
    }



    $scope.loadSpokePersons();

    $scope.file_obj = {};

    $scope.today = function() {
        $scope.file_obj.publishdate = new Date();
    };
    $scope.today();

    $scope.clear = function() {
        $scope.file_obj.publishdate = null;
    };    

    $scope.popup1 = {
       opened: false
    };
    $scope.dateOptions = {
        // dateDisabled: disabled,
        startingDay: 1
    };

    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };

    function disabled(data) {
        var date = data.date,
        mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }

    $scope.datePicker = {};
    $scope.minDate = moment().subtract(6, 'months');
    $scope.maxDate = moment();
    $scope.datePicker.date = {startDate:  null, endDate: null};

    $scope.options = {
      applyClass: 'btn-green',
      locale: {
        applyLabel: "Apply",
        fromLabel: "From",
        format: "DD-MM-YYYY",
        toLabel: "To",
        cancelLabel: 'Cancel',
        customRangeLabel: 'Custom range'
      },
      ranges: {
        'Today': [moment().startOf('day'), moment()],
        'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'),  moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'months').startOf('month'),  moment().subtract(1, 'months').endOf('month')]
      },
      eventHandlers: {'apply.daterangepicker' : function(ev, picker) { 
        $rootScope.loadFolders(0,'15', $routeParams.folder_id);
      }}
    }

    $scope.clearDate = function() {
        $scope.datePicker.date = "";
        $scope.datePicker.date = "";
        $rootScope.loadFolders(0,'15', $routeParams.folder_id);
    }

    $scope.exact_match = "0";

    $scope.updateSOption = function (option) {
       $scope.exact_match = option; 
    }

    $scope.appliedFilterCat = "";
    $scope.applyCatFilter = function(category_id) {
        if ($scope.appliedFilterCat == category_id) {
            $scope.appliedFilterCat = "";
        } else {
            $scope.appliedFilterCat = category_id;
        }

        $rootScope.loadFolders(0, $scope.page_limit);
    }


    $scope.search_loading = false;
    $rootScope.loadFolders = function (page, limit, folder_id, flag) {
        // $rootScope.search.str = $routeParams.search_str;

        if (!$scope.loading) {
            $scope.loading = true;

         

            if (!$scope.search_page) {
                $http({
                    method: "POST",
                    url: apiUrl + "folders",
                    data: {
                        apiId: apiKey,
                        parent_id: (folder_id && !$routeParams.spokePersonId) ? folder_id : "",
                        search_str: $rootScope.search.str,
                        categories: $scope.appliedFilterCat,
                        // categories: $scope.filters.categories.join(","),
                        folder_name: $scope.filters.sub_folder,
                        post_type: $rootScope.active_tab ? $rootScope.active_tab.substr(0, $rootScope.active_tab.length - 1) : "",
                        from_date: $scope.datePicker.date.startDate ? new Date($scope.datePicker.date.startDate).getTime() / 1000 : '',
                        to_date: $scope.datePicker.date.endDate ? new Date($scope.datePicker.date.endDate).getTime() / 1000 : '',
                        page: page,
                        limit: limit,
                        sort_by: $scope.sort_by,
                        spokespersons: $routeParams.spokePersonId ? $rootScope.fromBase64($routeParams.spokePersonId) : "",
                        flag: $rootScope.$storage.cgu_id ? 'filtered' : '',
                        login_user_id: $rootScope.$storage.cgu_id
                    }
                }).then(function (response) {
                    response = response.data;
                    if (response.success == 1) {
                        $scope.folders = response.folders;
                        $scope.files = response.files;
                        $scope.breadcrumbs = response.breadcrumbs;
                        $scope.total_records = response.count;
                        if (!$scope.filters.sub_folder) {
                            $scope.parent_total_file = response.count;
                        }


                        // if ($(window).width() < 768){
                            // if (flag) {
                            //     if ($scope.filters.categories.length > 0) {
                            //         $scope.appliedFilterCat = $scope.filters.categories[0];
                            //     } else {
                            //         $scope.appliedFilterCat = "";
                            //     }
                            //     $scope.filters.categories = [];
                            // }
                        // }

                        // console.log($scope.total_records, "PPPPPPP");

                        // $rootScope.active_tab = $scope.breadcrumbs[0] ? $scope.breadcrumbs[0].name : "";
                        // if ($rootScope.active_tab == "Photos") {
                        //     $scope.file_exts = "'."+$scope.image_file_ext.join(',.') + "'";
                        // } else if ($rootScope.active_tab == "Videos") {
                        //     $scope.file_exts = "'."+$scope.video_file_ext.join(',.')+"'";
                        // } else if ($rootScope.active_tab == "Documents") {
                        //     $scope.file_exts = "'."+$scope.doc_file_ext.join(',.') + ',.' + $scope.excel_file_ext.join(',.') + ",.pdf,.csv,.txt'";
                        // }

                        $scope.files =  $scope.files.map(function (f) {
                            if ((f.post_type == 'video' || f.post_type == 'resource_center' || f.post_type == 'campaign') && f.link && f.link.indexOf("youtube") !== -1) {
                                f.youtubeId = $scope.getId(f.link);
                                // f.keywords = keywords.split(',');
                                f.video_thumb = "https://img.youtube.com/vi/"+f.youtubeId+"/hqdefault.jpg";
                                f.embed_link = $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + f.youtubeId);
                            } else {
                                f.youtubeId = "";
                                f.video_thumb = "";
                                f.embed_link = "";
                                // f.keywords = "";
                            }
                            f.tags = f.keywords.split(",");
                                
                            return f;
                         });

                        if ($scope.active_tab == 'resource_centers') {
                            $scope.files_audio = $scope.files.filter(function (f) {
                                if ($scope.audio_file_ext.indexOf(f.file_type) !== -1) {
                                    return f;
                                }
                            });

                            console.log($scope.files_audio);
                            $scope.files_video = $scope.files.filter(function (f) {
                                if (f.link || $scope.audio_file_ext.indexOf(f.file_type) === -1) {
                                    return f;
                                }
                            });

                            console.log($scope.files_video);

                        }

                        $scope.current_page = page + 1;

                        if ($rootScope.search.str) {
                            $scope.search_string = $rootScope.search.str;
                        } else {
                            $scope.search_string = "";
                        }
                    }
                    $scope.loading = false;
                }, function (error) {
                })
            } else {
               $http({
                    method: "POST",
                    url: apiUrl + "folders",
                    data: {
                        apiId: apiKey,
                        search_str: $scope.filters.string ? $scope.filters.string : '',
                        page: page,
                        limit: limit,
                        // post_type: $scope.filters.post_type ? $scope.filters.post_type+"s" : "",
                        from_date: $scope.datePicker.date.startDate ? new Date($scope.datePicker.date.startDate).getTime() / 1000 : '',
                        to_date: $scope.datePicker.date.endDate ? new Date($scope.datePicker.date.endDate).getTime() / 1000 : '',
                        post_type: $scope.filters.post_type.join(","),
                        categories: $scope.filters.categories.join(","),
                        spokespersons: $scope.filters.spokespersons.join(","),
                        sort_by: $scope.sort_by,
                        flag: $rootScope.$storage.cgu_id ? 'filtered' : '',
                        exact_match : $scope.exact_match,
                        login_user_id: $rootScope.$storage.cgu_id
                    }
                }).then(function (response) {
                    response = response.data;
                    if (response.success == 1) {
                        $scope.files = response.files;
                        $scope.total_records = response.count;


                        $scope.grpupedFiles = _.groupBy($scope.files, "is_youtube_link");
                        console.log($scope.grpupedFiles);
                            
                        // if ($scope.filters.categories.length == 0) {
                        //     $scope.filter_categories = response.filter_categories;
                        // }
                        // if ($scope.filters.spokespersons.length == 0) {
                        //     $scope.filter_spokespersons = response.filter_spokespersons;
                        // }

                        //console.log($scope.total_records);
                        $scope.breadcrumbs = [];
                      
                         $scope.files =  $scope.files.map(function (f) {
                            if ((f.post_type == 'video' || f.post_type == 'resource_center' || f.post_type == 'campaign') && f.link && f.link.indexOf("youtube") !== -1) {
                                f.youtubeId = $scope.getId(f.link);
                                // f.keywords = keywords.split(',');
                                f.embed_link = $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + f.youtubeId);
                            }else {
                                f.youtubeId = "";
                                f.embed_link = "";
                                // f.keywords = "";
                            }
                            f.tags = f.keywords.split(",");
                                
                            return f;
                         })

                          $scope.current_page = page + 1;

                        if ($scope.filters.categories.length == 0 && $scope.filters.spokespersons.length == 0) {
                            $scope.loadCategories($scope.filters.string);
                            $scope.loadSpokePersons($scope.filters.string);
                        }

                    }
                    $scope.search_loading = false;
                    $scope.loading = false;
                    $scope.searchModal = false;

                }, function (error) {
                }) 
            }

        }

        
    }

    $scope.openSubFoler = function(subfolder) {
        $scope.filters.sub_folder = subfolder;
        $rootScope.loadFolders(0, $scope.page_limit);
    }

    $scope.closeSubFolder = function() {
        $scope.filters.sub_folder = "";
        $rootScope.loadFolders(0, $scope.page_limit);
    }

    

    if ($routeParams.folder_id) {
        $rootScope.loadFolders(0,'15', $routeParams.folder_id);
    } else if ($scope.search_page && $routeParams.search_str) {
        $rootScope.loadFolders(0,'15');
    } else if ($routeParams.spokePersonId) {
        $rootScope.active_sp_id = $routeParams.spokePersonId;
        $rootScope.active_sp_name = $routeParams.spoke_person_name.trim().replace(/-/gi,' ');
        $rootScope.loadFolders(0,'15');
    }
    else if ($location.path().indexOf("/videos") !== -1 || $location.path().indexOf("/documents") !== -1 || $location.path().indexOf("/resource-center") !== -1 || $location.path().indexOf("/campaign") !== -1) {
        
        if ($location.path().indexOf("/resource-center/videos") !== -1) {
            $scope.filters.sub_folder = 'videos';
        } else if ($location.path().indexOf("/resource-center/docs") !== -1) {
            $scope.filters.sub_folder = 'docs';
        } else if ($location.path().indexOf("/resource-center/creatives") !== -1) {
            $scope.filters.sub_folder = 'creatives';
        } else if ($location.path().indexOf("/resource-center/news_links") !== -1) {
            $scope.filters.sub_folder = 'news_links';
        }

        $rootScope.loadFolders(0,'15');
    }
    else if (!$rootScope.$storage.cgu_id) {
        $rootScope.loadFolders(0,'15');
    }
    // else if ($location.path().('spokes-persons')) {
    //     $rootScope.loadFolders(0,'15');
    //     alert();
    // }

    // $scope.clearSearch = function () {
    //     $("#search-input").val('');
    //     $rootScope.search.str = "";
    //     $scope.search_string = "";
    //     $location.path("/search");
    //     $rootScope.loadFolders();
    // }

    $scope.clearSearch = function () {
        $scope.adv_search = {};
        $scope.filters = {};
        $scope.search_string = "";
        $rootScope.search.str = "";
        $rootScope.is_filterd_page = false;
        $rootScope.is_sort_page = false;

        if ($location.path().indexOf("search") == -1) {
            $rootScope.loadFolders(0, $scope.page_limit, ($scope.active_folder_id ? $rootScope.toBase64($scope.active_folder_id) : ""));
        } else {
            $scope.datePicker.date = "";
            $scope.datePicker.date = "";
        }
    }


    if ($routeParams.folder_id) {
        $rootScope.active_folder_id = $rootScope.fromBase64($routeParams.folder_id);
        $rootScope.loadFolders($scope.current_page, $scope.page_limit, $routeParams.folder_id);
    }

    $scope.searchModal = false;
    $scope.openSearchModal = function (type) {
        $(".modal-title").text("SEARCH BY " + type.toUpperCase());
        if(type == "topic"){
            $(".modal-title").text("SEARCH BY " + type.toUpperCase() + " / KEYWORDS");
        }


        $scope.adv_search = {};
        $scope.adv_search.search_by = type;
        $scope.adv_search.post_type = [];
        // $scope.adv_search.post_type = "";
        $scope.adv_search.categories = [];
        $scope.adv_search.spokespersons = [];
        $scope.searchModal = true;
    }


    $scope.filter_by_cat = false;
    $scope.filter_by_cat_modal = function () {
        alert();
        $scope.filter_by_cat = true;
    }


    $scope.updateSorting = function (sort_by) {
        $scope.sort_by = sort_by ? sort_by : "";
        $rootScope.loadFolders($scope.current_page - 1, $scope.page_limit, $routeParams.folder_id);
    }


    $scope.modifySearch = function () {
        $scope.adv_search.str = $scope.filters.string;
        $scope.adv_search.search_by = $scope.filters.search_by;
        // $scope.adv_search.post_type = $scope.filters.post_type;
        $scope.adv_search.post_type = $scope.filters.post_type.map(function (a) {return a});
        $scope.adv_search.categories = $scope.filters.categories.map(function (a) {return a});
        $scope.adv_search.spokespersons = $scope.filters.spokespersons.map(function (a) {return a});
        $scope.searchModal = true;
    }

    $scope.reloadData = function () {
        if ($routeParams.folder_id) {
            $rootScope.loadFolders($scope.current_page - 1, $scope.page_limit, $routeParams.folder_id);

        } else if ($routeParams.search_str) {
            $rootScope.loadFolders($scope.current_page - 1, $scope.page_limit);
        } else {
            $scope.loadCategories();
            $scope.loadCounters();
        }


    }

    $scope.folder = {};
    $scope.newFolderModal = false;
    $scope.renameFolderModal = false;
    $scope.openFolderModal = function () {
        $scope.folder = {};
        $scope.folder.parent_id = $rootScope.active_folder_id ? $rootScope.toBase64($rootScope.active_folder_id) : "";
        $scope.newFolderModal = true;
        $timeout(function () {
            $("#folder_name").focus();
        }, 800);
    }

    $scope.openRenameFolderModal = function (folder) {
        $scope.folder = {};
        $scope.folder.folder_id = $rootScope.toBase64(folder.id);
        $scope.folder.folder_name = folder.name;
        $scope.renameFolderModal = true;
        $timeout(function () {
            $("#folder_name").focus();
        }, 800);
    }

    $scope.filter_by_cat = false;
    $scope.filter_by_cat_modal = function () {
        $scope.filter_by_cat = true;
    }

    $scope.searchDocument = function (form) {
        // if (form.validate() && form.$valid && !$scope.search_loading) {
            $rootScope.is_filterd_page = true;
            $rootScope.is_sort_page = true;
            $scope.search_loading = true;
            $scope.filters = {
                is_filterd:1,
                search_by: $scope.adv_search.search_by,
                string: $scope.adv_search.str,
                categories: $scope.adv_search.categories,
                spokespersons: $scope.adv_search.spokespersons,
                post_type: $scope.adv_search.post_type
            };
            

            $rootScope.loadFolders(0, $scope.page_limit);
        // }
    }


    $scope.validateFolder = {
        onkeyup: function(element) {
            this.element(element);
        },
        rules : {
            folder_name : {
                required : true
            }
        },
        messages : {
            folder_name : {
                required : "Enter folder name."
            }
        }   
    };

    
    // $scope.validateSearch = {
    //     onkeyup: function(element) {
    //         this.element(element);
    //     },
    //     rules : {
    //         str : {
    //             required : true
    //         }
    //     },
    //     messages : {
    //         str : {
    //             required : "Enter keyword."
    //         }
    //     }   
    // };

    $scope.processing = false;
    $scope.createFolder = function (form) {
        if (form.validate() && form.$valid && !$scope.processing) {
            $scope.processing = true;
            $scope.folder.apiId = apiKey;
            $scope.folder.login_user_id = $rootScope.$storage.cgu_id;

            $http({
                method: "POST",
                url: apiUrl + "create_folder",
                data: $scope.folder
            }).then(function (response) {
                response = response.data;
                if (response.success == 1) {
                    // if ($rootScope.active_folder_id) {
                    //     $rootScope.loadFolders($scope.current_page - 1, $scope.page_limit, $scope.folder.parent_id);
                       
                    // } else {
                    //     $scope.loadRootFolders();
                    // }

                    $scope.loadCategories();
                    $scope.loadCounters();
                    $scope.processing = false;
                    $scope.newFolderModal = false;
                } else {
                    $scope.processing = false;
                    $mdToast.show({
                        template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                        hideDelay: 6000,
                        position: 'bottom right'
                    });
                }
            }, function (error) {
            })
        }
    }

    $scope.uploadFiles = function (files) {
      if (files && files.length) {
        $(".waiting_loader").fadeIn();
        angular.forEach(files, function (file, key) {
            var formData = new FormData();
            formData.append("file", file);
            formData.append("from_app", 'true');
            formData.append("apiId", apiKey);
            formData.append("user_id", $rootScope.fromBase64($rootScope.$storage.cgu_id));
            formData.append("login_user_id", $rootScope.$storage.cgu_id);
            formData.append("folder_id", $rootScope.toBase64($rootScope.active_folder_id));

            $http({
                url: apiUrl + "upload_files",
                method: 'POST',
                data:formData,
                headers: {'Content-Type': undefined}
            }).then(function (response) {
                response = response.data;

                if (key == files.length - 1) {
                    $mdToast.show({
                        template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                        hideDelay: 6000,
                        position: 'bottom right'
                    });
                    $scope.reloadData();
                    $(".waiting_loader").fadeOut();
                }
            }, function (resp) {
            });
        });
      }
    }

    $scope.renameFolder = function (form) {
        if (form.validate() && form.$valid && !$scope.processing) {
            $scope.processing = true;
            $scope.folder.apiId = apiKey;
            $scope.folder.login_user_id = $rootScope.$storage.cgu_id;
            $http({
                method: "POST",
                url: apiUrl + "rename_folder",
                data: $scope.folder
            }).then(function (response) {
                response = response.data;
                if (response.success == 1) {
                    $scope.loadCategories();
                    $scope.loadCounters();
                    $scope.processing = false;
                    $scope.renameFolderModal = false;
                } else {
                    $scope.processing = false;
                    $mdToast.show({
                        template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                        hideDelay: 6000,
                        position: 'bottom right'
                    });
                }
            }, function (error) {
            })
        }
    }

    $scope.checkAll = function () {
        if ($("#folder-list-all").is(":checked")) {
            // $scope.selection.ids = $scope.folders.map(function (a) {
            //     return a.id;
            // });
            $scope.selection.ids = [];

            $scope.selection.file_ids = $scope.files.map(function (a) {
                return a.id;
            });
        } else {
            $scope.selection.ids = [];
            $scope.selection.file_ids = [];
        }
    }

    $scope.deleteFolder = function (type, id) {

        if (id) {

            if (type == "folder") {

                swal({

                    text: "Are You Sure? <br/> If you delete this folder then lost all data in this folder.",

                    type: 'warning',

                    showCancelButton: true,

                    cancelButtonColor: '#25476a',

                    confirmButtonColor: '#42b655',

                    confirmButtonText: 'Yes'

                }).then(function () {

                    if (type == "folder") {

                        var appUrl = "deleteFolders";

                    } else {

                        var appUrl = "deleteFiles";

                    }



                    $http({

                        method: 'POST',

                        url: apiUrl + appUrl,

                        data: {

                            login_user_id: $rootScope.$storage.cgu_id,

                            apiId: apiKey,

                            id: id

                        }

                    }).then(function successCallback(response) {

                        response = response.data;

                        if (response.success == 1) {
                            $rootScope.loadFolders(0,'15', $routeParams.folder_id);
                            $scope.reloadData();

                            $scope.loadRootFolders();
                            $scope.loadSubfolders();
                             $mdToast.show({

                                template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',

                                hideDelay: 6000,

                                position: 'bottom right'

                            });

                        } else {

                            $mdToast.show({

                                template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',

                                hideDelay: 6000,

                                position: 'bottom right'

                            });

                        }

                    });

                });

            } else {

                swal({

                    text: "Do you want to delete this "+type+"?",

                    type: 'warning',

                    showCancelButton: true,

                    cancelButtonColor: '#25476a',

                    confirmButtonColor: '#42b655',

                    confirmButtonText: 'Yes'

                }).then(function () {

                    if (type == "folder") {

                        var appUrl = "deleteFolders";

                    } else {

                        var appUrl = "deleteFiles";

                    }



                    $http({

                        method: 'POST',

                        url: apiUrl + appUrl,

                        data: {

                            login_user_id: $rootScope.$storage.cgu_id,

                            apiId: apiKey,

                            id: id

                        }

                    }).then(function successCallback(response) {

                        response = response.data;

                        if (response.success == 1) {
                            $rootScope.loadFolders(0,'15', $routeParams.folder_id);
                            $scope.reloadData();

                            $scope.loadRootFolders();
                            $scope.loadSubfolders();
                             $mdToast.show({

                                template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',

                                hideDelay: 6000,

                                position: 'bottom right'

                            });

                        } else {

                            $mdToast.show({

                                template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',

                                hideDelay: 6000,

                                position: 'bottom right'

                            });

                        }

                    });

                });

            }

        } else {

            if (($scope.selection.ids.length + $scope.selection.file_ids.length) > 0) {

                swal({

                    text: "Are you sure to delete ?",

                    type: 'warning',

                    showCancelButton: true,

                    cancelButtonColor: '#25476a',

                    confirmButtonColor: '#42b655',

                    confirmButtonText: 'Yes'

                }).then(function () {

                    if ($scope.selection.ids.length > 0) {

                        $http({

                            method: 'POST',

                            url: apiUrl + 'deleteFolders',

                            data: {

                                login_user_id: $rootScope.$storage.cgu_id,

                                apiId: apiKey,

                                id: $scope.selection.ids.join(",")

                            }

                        }).then(function successCallback(response) {

                            response = response.data;

                            if (response.success == 1) {

                                if ($scope.selection.file_ids.length > 0) {

                                    $http({

                                        method: 'POST',

                                        url: apiUrl + 'deleteFiles',

                                        data: {

                                            login_user_id: $rootScope.$storage.cgu_id,

                                            apiId: apiKey,

                                            id: $scope.selection.file_ids.join(",")

                                        }

                                    }).then(function successCallback(response) {

                                        response = response.data;

                                        if (response.success == 1) {
                                            $rootScope.loadFolders(0,'15', $routeParams.folder_id);
                                            $scope.reloadData();
                                            $scope.loadSubfolders();
                                            $scope.selection.ids = [];

                                            $mdToast.show({

                                                template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',

                                                hideDelay: 6000,

                                                position: 'bottom right'

                                            });

                                        } else {

                                            $mdToast.show({

                                                template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',

                                                hideDelay: 6000,

                                                position: 'bottom right'

                                            });

                                        }

                                    });

                                } else {
                                    $rootScope.loadFolders(0,'15', $routeParams.folder_id);
                                    $scope.reloadData();

                                    $scope.selection.ids = [];

                                    $mdToast.show({

                                        template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',

                                        hideDelay: 6000,

                                        position: 'bottom right'

                                    });

                                }

                            } else {

                                $mdToast.show({

                                    template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',

                                    hideDelay: 6000,

                                    position: 'bottom right'

                                });

                            }

                        });

                    } else {

                        $http({

                            method: 'POST',

                            url: apiUrl + 'deleteFiles',

                            data: {

                                login_user_id: $rootScope.$storage.cgu_id,

                                apiId: apiKey,

                                id: $scope.selection.file_ids.join(",")

                            }

                        }).then(function successCallback(response) {

                            response = response.data;

                            if (response.success == 1) {
                                $rootScope.loadFolders(0,'15', $routeParams.folder_id);
                                $scope.reloadData();
                                $scope.loadSubfolders();
                                $scope.selection.ids = [];

                                $mdToast.show({

                                    template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',

                                    hideDelay: 6000,

                                    position: 'bottom right'

                                });

                            } else {

                                $mdToast.show({

                                    template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',

                                    hideDelay: 6000,

                                    position: 'bottom right'

                                });

                            }

                        });

                    }

                });

            } else {

                $mdToast.show({

                    template: '<md-toast class="md-toast error">Please select at least one folder to perform the operation.</md-toast>',

                    hideDelay: 6000,

                    position: 'bottom right'

                });

            }

        }

    }

    $scope.fileUploadModal = false;
    $scope.addFile = true;
    $scope.openFileModal = function () {
        $scope.addFile = true;
        $scope.file_obj = {};
        $scope.creative_imgs = [];
        $scope.file_album = [];
        if ($rootScope.active_tab == "documents") {
            $scope.file_obj.post_type = "document";
        } else if ($rootScope.active_tab == "links") {
            $scope.file_obj.post_type = "link";
        } else if ($rootScope.active_tab == "videos") {
            $scope.file_obj.post_type = "video";
        } else if ($rootScope.active_tab == "resource_centers") {
            $scope.file_obj.post_type = "resource_center";
        } else if ($rootScope.active_tab == "campaigns") {
            $scope.file_obj.post_type = "campaign";
        } 
        $scope.getSubfolders();
        $scope.getFileTypes();
        $scope.fileUploadModal = true;
    }

    $scope.getFileTypes = function () {
        if ($scope.file_obj.post_type == "document") {
            $scope.file_exts = "'."+$scope.doc_file_ext.join(',.') + ',.' + $scope.excel_file_ext.join(',.') + ",.pdf,.csv,.txt'";
        } else if ($scope.file_obj.post_type == "link") {
            $scope.file_exts = "";
        } else if ($scope.file_obj.post_type == "video") {
            $scope.file_exts = "'."+$scope.video_file_ext.join(',.')+"'";
        } else if ($scope.file_obj.post_type == "resource_center") {

            if ($scope.file_obj.folder_name == 'songs') {
                $scope.file_exts = "'." + $scope.video_file_ext.join(',.') + ',.' + $scope.audio_file_ext.join(',.') + "'";
            } else if ($scope.file_obj.folder_name == 'tv_ads') {
                $scope.file_exts = "'." + $scope.video_file_ext.join(',.') + "'";
            } else if ($scope.file_obj.folder_name == 'radio_ads') {
                $scope.file_exts = "'." + $scope.audio_file_ext.join(',.') + "'";
            } else if ($scope.file_obj.folder_name == 'jingles') {
                $scope.file_exts = "'." + $scope.audio_file_ext.join(',.') + "'";
            } else if ($scope.file_obj.folder_name == 'banner_hoardings') {
                $scope.file_exts = "'." + $scope.image_file_ext.join(',.') + "'";
            } else if ($scope.file_obj.folder_name == 'prints') {
                $scope.file_exts = "'." + $scope.image_file_ext.join(',.') + "'";
            } else if ($scope.file_obj.folder_name == 'videos') {
                $scope.file_exts = "'." + $scope.video_file_ext.join(',.') + ',.' + $scope.audio_file_ext.join(',.') + "'";
            } else if ($scope.file_obj.folder_name == 'docs') {
                $scope.file_exts = "'."+$scope.doc_file_ext.join(',.') + ',.' + $scope.excel_file_ext.join(',.') + ",.pdf,.csv,.txt'";
            } else if ($scope.file_obj.folder_name == 'creatives') {
                $scope.file_exts = "'." + $scope.creative_file_ext.join(',.')  + ',.' + $scope.image_file_ext.join(',.');
                // $scope.file_exts = "'." + $scope.creative_file_ext.join(',.') + ',.' + $scope.doc_file_ext.join(',.') + ',.' + $scope.excel_file_ext.join(',.') + ',.' + $scope.video_file_ext.join(',.') + ',.' + $scope.image_file_ext.join(',.') + ',.' + $scope.audio_file_ext.join(',.') + ",.pdf,.csv,.txt'";
            } else if ($scope.file_obj.folder_name == 'news_links') {
                $scope.file_exts = "'." + $scope.image_file_ext.join(',.');
            } else {
                $scope.file_exts = "'."+$scope.doc_file_ext.join(',.') + ',.' + $scope.excel_file_ext.join(',.') + ',.' + $scope.video_file_ext.join(',.') + ',.' + $scope.image_file_ext.join(',.') + ',.' + $scope.audio_file_ext.join(',.') + ",.pdf,.csv,.txt'";
            }

            $scope.file_obj.file = "";

        } else if ($scope.file_obj.post_type == "campaigns") {
            $scope.file_exts = "'."+$scope.doc_file_ext.join(',.') + ',.' + $scope.excel_file_ext.join(',.') + ',.' + $scope.video_file_ext.join(',.') + ',.' + $scope.image_file_ext.join(',.') + ',.' + $scope.audio_file_ext.join(',.') + ",.pdf,.csv,.txt'";
        }
    }

    $scope.subFolders = [];
    $scope.getSubfolders = function () {
        $http({
            method: "POST",
            url: apiUrl + "sub_folders",
            data: {
                login_user_id: $rootScope.$storage.cgu_id,
                apiId: apiKey,
                post_type: $scope.file_obj.post_type
            },
        }).then(function (response) {
            response = response.data;
            if (response.success == 1) {
                $scope.subFolders = response.folders;
                if ($scope.subFolders.length > 0 && !$scope.file_obj.folder_name) {
                    $scope.file_obj.folder_name = $scope.subFolders[0].folder_org_name;
                } else {
                    if (!$scope.file_obj.folder_name) {
                        $scope.file_obj.folder_name = "";
                    }
                }
                $scope.getFileTypes();
            }
        }, function (error) {
        })
    }

    $scope.loadSubfolders = function () {
        $http({
            method: "POST",
            url: apiUrl + "sub_folders",
            data: {
                login_user_id: $rootScope.$storage.cgu_id,
                apiId: apiKey,
                flag: 'all',
                post_type: $scope.file_obj.post_type
            },
        }).then(function (response) {
            response = response.data;
            if (response.success == 1) {
                $scope.sub_folders = response.folders;

                if ($scope.sub_folders && $scope.sub_folders.length > 0) {
                    $scope.parent_total_file = 0;
                    angular.forEach($scope.sub_folders, function (fl) {
                        $scope.parent_total_file += Number(fl.total_file);
                    });
                }
            }
        }, function (error) {
        })
    }
    $scope.loadSubfolders();


    $scope.openKeyWordsModal = function (file) {
        $scope.addFile = false;
        $scope.is_touched = true;
        $scope.file_obj = {};
        $scope.creative_imgs = [];
        $scope.file_album = [];
        if (file.album && file.album.length > 0) {
            $scope.file_album = file.album;
        }
        $scope.file_obj.file_id = file.id;
        $scope.file_obj.keywords = file.keywords ? file.keywords.split(",") : [];
        $scope.file_obj.topic = file.topic;
        $scope.file_obj.link = file.link;
        $scope.file_obj.categories = file.categories.map(function (a) {return a.id});
        $scope.file_obj.spokespersons = file.spokespersons.map(function (a) {return a.id});
        $scope.file_obj.old_file = file.file_name;
        $scope.file_obj.description = file.description;
        $scope.file_obj.post_type = file.post_type;
        $scope.file_obj.folder_name = file.folder_name;
        $scope.file_obj.publishdate = new Date(Number(file.publish_date) * 1000);
        $scope.getSubfolders();
        $scope.fileUploadModal = true;

        if ($scope.search_page) {
            $scope.loadCategories("", "all");
            $scope.loadSpokePersons("", "all");
        }
    }

    $scope.validateFile = {
        onkeyup: function(element) {
            this.element(element);
        },
        rules : {
            topic : {
                required : true
            },
            link : {
                url: true
            },
            publish_date : {
                required : true
            }
        },
        messages : {
            topic : {
                required : "Enter the topic."
            },
            link : {
                url: "Enter valid link."
            },
            publish_date : {
                required : "Select Publish Date"
            }
        }
    }

    $scope.is_touched = false;

    $scope.getKeywords = function (file) {
       $scope.is_touched = true;
        if ($scope.file_obj.folder_name != 'creatives') {
           if (file) {
               var str = file.name.replace(/\s/g,' ');
               str = str.replace(/\-/g,' ');
               str = str.replace(/\_/g,' ');
               str = str.replace(/\,/g,' ');
               str = str.replace(/\&/g,' ');
               str = str.replace(/\#/g,' ');

               var dot_index = str.lastIndexOf('.');
               str = str.substr(0, dot_index);
               var keywords = str.split(" ").filter(function (a) {
                   if (a && (a.trim()).length > 0) {
                       return a;
                   }
               }).map(function (b) {
                   return {text: b};
               });

               var text_arr = keywords.map(function (c) {
                   return c.text
               }).join(" ");

               keywords = _.uniq(keywords, "text");
               $scope.file_obj.keywords = keywords;
               $scope.file_obj.topic = text_arr;
           }
        }
   }

   $scope.uploadCreatives = function (files) {
       $scope.is_touched = true;

       angular.forEach(files, function(file) {
        $scope.creative_imgs.push(file);
       });
   }


   $scope.upload_image_notifation = function () {
       if($('#send-notification').is(':checked')){
            $('#upload_noti_files').show();
       }
       else{
            $('#upload_noti_files').hide();
       }
   }

    $scope.show_file_error = false;

    $scope.uploading_file = false;
     $scope.uploadDocument = function (form) {
        if (form.validate() && form.$valid && !$scope.uploading_file) {

            $scope.show_file_error = false;
            $scope.uploading_file = true;
            $(".waiting_loader").fadeIn();
            // if ($scope.addFile) {
                if ($scope.file_obj.post_type !== 'notification') {
                    var formData = new FormData();
                    if ($scope.file_obj.folder_name == 'creatives') {

                        var is_file_uploaded = false;

                        if ($scope.file_album.length > 0) {
                            angular.forEach($scope.file_album, function(val, key) {
                                if (val.image_id == '0') {
                                    is_file_uploaded = true;
                                } 
                            });

                            formData.append("file_album", JSON.stringify($scope.file_album));
                        }

                        angular.forEach($scope.creative_imgs, function(val, key) {
                            if (!is_file_uploaded && key == 0) {
                                formData.append("file", val);
                            } else {
                                if (!is_file_uploaded) {
                                    formData.append("albums["+(key-1)+"]", val);
                                } else {
                                    formData.append("albums["+key+"]", val);
                                }
                            }
                        });


                    } else {
                        formData.append("file", $scope.file_obj.file);
                    }


                    formData.append("noti_img_file", $scope.file_obj.noti_img_file);
                    formData.append("keywords", ($scope.file_obj.keywords && $scope.file_obj.keywords.length > 0) ? $scope.file_obj.keywords.map(function (a) {return a.text}).join(",")  : "");
                    formData.append("from_app", 'true');
                    formData.append("apiId", apiKey);
                    formData.append("user_id", $rootScope.fromBase64($rootScope.$storage.cgu_id));
                    formData.append("folder_id", $rootScope.toBase64($rootScope.active_folder_id));
                    formData.append("topic", $scope.file_obj.topic);
                    formData.append("link", $scope.file_obj.link ? $scope.file_obj.link : "");
                    formData.append("send_notification", ($('#send-notification').is(':checked'))? '1':'0');
                    formData.append("categories", ($scope.file_obj.categories && $scope.file_obj.categories.length > 0) ? $scope.file_obj.categories.join(",") : "");
                    formData.append("spokespersons", ($scope.file_obj.spokespersons && $scope.file_obj.spokespersons.length > 0) ? $scope.file_obj.spokespersons.join(",") : "" );
                    if ($scope.file_obj.publishdate) {
                        formData.append("publish_date", moment($scope.file_obj.publishdate).format("YYYY-MM-DD"));
                    } else {
                        formData.append("publish_date", "");
                    }
                    formData.append("post_type", $scope.file_obj.post_type);
                    formData.append("folder_name", $scope.file_obj.folder_name);
                    formData.append("description", $scope.file_obj.description);
                    formData.append("read_doc", ($("#read_doc").is(":checked")) ? 'true' : 'false');

                    if ($scope.file_obj.post_type == 'video' || ($scope.file_obj.post_type == 'resource_center' && $scope.file_obj.folder_name === 'videos')) {
                       formData.append("video_thumb", $scope.file_obj.video_thumb);
                    }

                    if ($scope.addFile) {
                        formData.append("flag", "insert");
                    } else {
                        formData.append("flag", "edit");
                        formData.append("file_id", $scope.file_obj.file_id);
                        if (!$scope.file_obj.file) {
                            formData.append("old_file", $scope.file_obj.old_file);
                        }
                    }

                    formData.append("login_user_id", $rootScope.$storage.cgu_id);
                    

                    $http({
                        url: apiUrl + "upload_files",
                        method: 'POST',
                        data:formData,
                        headers: {'Content-Type': undefined}
                    }).then(function (response) {
                        response = response.data;
                        if (response.success == 1) {
                            $mdToast.show({
                                template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                                hideDelay: 6000,
                                position: 'bottom right'
                            });
                            $scope.reloadData();
                            $rootScope.loadFolders(0,'15', $routeParams.folder_id);
                            $scope.loadSubfolders();
                            $scope.fileUploadModal = false;
                            $scope.uploading_file = false;
                        } else {
                            $mdToast.show({
                                template: '<md-toast class="md-toast error">Oopppsss..! Some error occured.</md-toast>',
                                hideDelay: 6000,
                                position: 'bottom right'
                            });
                            $scope.uploading_file = false;
                        }
                        $(".waiting_loader").fadeOut();
                    }, function (error) {
                        $mdToast.show({
                            template: '<md-toast class="md-toast error">Oopppsss..! Some error occured.</md-toast>',
                            hideDelay: 6000,
                            position: 'bottom right'
                        });
                    });
                } else {
                    var formdata = new FormData();
                    formdata.append("apiId", apiKey);
                    formdata.append("from_app", true);
                    formdata.append("notification_title", $scope.file_obj.topic);
                    formdata.append("noti_message", $scope.file_obj.noti_message);
                    formdata.append("login_user_id", $rootScope.$storage.cgu_id);
                    formdata.append("image", $scope.file_obj.noti_img);

                    $http({
                      method: 'POST',
                      url: apiUrl + 'user_notification',
                      data : formdata,
                      headers: {'Content-Type': undefined}
                    }).then(function successCallback(response) {
                        response = response.data;
                        if(response.success == 1){
                            $rootScope.message = response.message;
                            $mdToast.show({
                                template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                                hideDelay: 6000,
                                position: 'bottom right'
                            });
                            $(".waiting_loader").fadeOut();
                            $scope.fileUploadModal = false;
                            $scope.uploading_file = false;
                        }
                        else{
                            $scope.response_message = response.message;
                            $scope.uploading_file = false;
                            $mdToast.show({
                                template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                                hideDelay: 6000,
                                position: 'bottom right'
                            });
                            $(".waiting_loader").fadeOut();
                        }
                    }, function errorCallback(response) {
                    
                    });
                }
            // } else {
            //     $http({
            //         url: apiUrl + "update_file_keywords",
            //         method: 'POST',
            //         data:{
            //             apiId: apiKey,
            //             file_id: $rootScope.toBase64($scope.file_obj.file_id),
            //             keywords: $scope.file_obj.keywords.map(function (a) {return a.text}).join(",")
            //         }
            //     }).then(function (response) {
            //         response = response.data;
            //         if (response.success == 1) {
            //             $mdToast.show({
            //                 template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
            //                 hideDelay: 6000,
            //                 position: 'bottom right'
            //             });
            //             $scope.reloadData();
            //             $scope.fileUploadModal = false;
            //             $scope.uploading_file = false;
            //         } else {
            //             $mdToast.show({
            //                 template: '<md-toast class="md-toast error">Oopppsss..! Some error occured.</md-toast>',
            //                 hideDelay: 6000,
            //                 position: 'bottom right'
            //             });
            //             $scope.uploading_file = false;
            //         }
            //         $(".waiting_loader").fadeOut();
            //     }, function (error) {
            //         $mdToast.show({
            //             template: '<md-toast class="md-toast error">Oopppsss..! Some error occured.</md-toast>',
            //             hideDelay: 6000,
            //             position: 'bottom right'
            //         });
            //     });
            // }
        } else {
            $scope.show_file_error = true;
        }
    }

    $scope.validateSuggestion = {
        onkeyup: function(element) {
            this.element(element);
        },
        rules : {
            name : {
                required : true,
            },
            email : {
                required : true,
                email:true,
            },
            mobile : {
                required : true,
                number:true,
                minlength:10,
                maxlength:10
            },
            suggestion : {
                required : true,
            },
            state : {
                required : true
            },
            city : {
                required : true
            },
            facebook_link: {
                url : true
            },
            twitter_link: {
                url : true
            }

        },
        messages : {
            name : {
                required : "Enter your name."
            },
            email : {
                required : "Enter Email Address.",
                email:"Please enter valid Email Id."
            },
            mobile : {
                required : "Enter enter Contact Number.",
                number: "Please enter valid Contact Number.",
                minlength:"Please enter minmum 10 numbers.",
                maxlength:"Please enter maximum 10 numbers."
            },
            suggestion : {
                required : "Please give your Suggestions."
            },
            state : {
                required: "Select the state."
            },
            city : {
                required: "Select the district."
            },
            facebook_link: {
                url : "Please enter valid link."
            },
            twitter_link: {
                url : "Please enter valid link."
            }
        }   
    };

    $scope.suggetion ={};
    $scope.submittingsugetion_box = false;

    $scope.suggestion_submit = function (form) {
            
        if (form.validate()) {
            if(vcRecaptchaService.getResponse() === ""){ //if string is empty
                // alert("Please resolve the captcha and submit!")
                $mdToast.show({
                    template: '<md-toast class="md-toast error">Please resolve the captcha and submit!</md-toast>',
                    hideDelay: 6000,
                    position: 'bottom right'
                });
            } else {
                $scope.suggetion.apiId = apiKey;
                $scope.suggetion.from_app = true;
                $scope.submittingsugetion_box = true;
                $scope.suggetion.login_user_id = $rootScope.$storage.cgu_id;
                $scope.suggetion.post_from = 'web';
                $scope.suggetion['g-recaptcha-response'] = vcRecaptchaService.getResponse();

                var formdata = new FormData();
                angular.forEach($scope.suggetion, function(sug, key) {
                    formdata.append(key, sug);
                });

                $http({
                    method: "POST",
                    url: apiUrl + "user_suggestion",
                    data: formdata,
                    headers: {"Content-Type": undefined}
                }).then(function (response) {
                    response = response.data;
                    if (response.success == 1) {
                        $scope.submittingsugetion_box = false;
                        $mdToast.show({
                            template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                            hideDelay: 6000,
                            position: 'bottom right'
                        });
                        $location.path("/");
                    } else {
                        $scope.processing = false;
                        $mdToast.show({
                            template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                            hideDelay: 6000,
                            position: 'bottom right'
                        });
                    }
                    $scope.submittingsugetion_box = false;
                }, function (error) {
                })
            }
        }
    }

});

app.controller("spokesPersonsController", function ($scope, $location, $sce, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $mdToast, $timeout, Upload) {
    if(!$rootScope.$storage.cgu_id){
        $location.path("/");
    }

    $scope.selection = {
        ids: []
    };
    $scope.searchPerson = {};
    $scope.filtersObj = {};
    $scope.spokespersons = [];
    $scope.all_spokespersons = [];
    $scope.spoke_person_loading = false;
    $rootScope.active_sp_id = "";


    $scope.loadSpokePersons = function (searchSTR, flag) {
        if (!$scope.spoke_person_loading) {
            $scope.spoke_person_loading = true;
            $http({
                method: "POST",
                url: apiUrl + "spokes_persons",
                data: {
                    apiId: apiKey,
                    //search_str: $scope.searchPerson.str,
                    search_str: searchSTR ? searchSTR : "",
                    flag: ($location.path().indexOf("manage_spokesperson") === -1 && flag !== 'all') ? 'filtered' : '',
                    // flag: ($scope.search_page || $rootScope.$storage.cgu_type == 'user') ? 'filtered' : '',
                    login_user_id: $rootScope.$storage.cgu_id
                }
            }).then(function (response) {
                response = response.data;
                if (response.success == 1) {

                    if (flag !== 'all') {
                        $scope.spokespersons = response.spokes_persons;
                    } else {
                        $scope.all_spokespersons = response.spokes_persons;
                    }

                    if (searchSTR) {
                        $scope.search_sp_string = searchSTR;
                    } else {
                        $scope.search_sp_string = "";
                    }

                    if ($scope.searchPerson.str) {
                        $scope.search_string = $scope.searchPerson.str;
                    } else {
                        $scope.search_string = "";
                    }
                    $scope.spoke_person_loading = false;
                }  else {
                    $scope.spoke_person_loading = false;
                }
                
            }, function (error) {
            })
        }
    }

    $scope.cat_loading = false;
    $scope.categories = [];
    $scope.loadCategories = function (searchSTR) {
        if (!$scope.cat_loading) {
            $scope.cat_loading = true;
            $http({
                method: "POST",
                url: apiUrl + "categories",
                data: {
                    apiId: apiKey,
                    post_type: "",
                    flag: '',
                    search_str: "",
                    login_user_id: $rootScope.$storage.cgu_id
                }
            }).then(function (response) {
                response = response.data;
                if (response.success == 1) {
                    $scope.categories = response.categories;
                    $scope.cat_loading = false;
                }  else {
                    $scope.cat_loading = false;
                }
                
            }, function (error) {
            })
        }
    }

    $scope.loadCategories();

    $scope.loadSpokePersons();

    $scope.clearspSearch = function () {
        $scope.loadSpokePersons();
        $("#demo-input-search3").val("");
    }

    $scope.newSpeakerModal = false;
    $scope.renameSpeakerModal = false; 

    $scope.validateSpokesPerson = {
        onkeyup: function(element) {
            this.element(element);
        },
        rules : {
            name : {
                required : true
            }
        },
        messages : {
            name : {
                required : "Enter spokes person's name."
            }
        }   
    };

     $scope.search_loading = false;

      $scope.getId = function(url) {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = url.match(regExp);

        if (match && match[2].length == 11) {
            return match[2];
        } else {
            return 'error';
        }
    }

    $scope.folders = [];
    $scope.filtersObj = {spokespersons: []};
    $scope.files = [];
    $scope.breadcrumbs = [];
    $scope.current_page = 0;
    $scope.page_limit = "15";
    $scope.loading = false;
    $scope.loadSpFolders = function (page, limit) {
        if (!$scope.loading) {
            $scope.loading = true;
            $http({
                method: "POST",
                url: apiUrl + "folders",
                data: {
                    apiId: apiKey,
                    page: page,
                    limit: limit,
                    sort_by: $scope.sort_by,
                    spokesperson_files: "true",
                    spokespersons: $scope.filtersObj.spokespersons.join(","),
                    search_str: $scope.searchPerson.str ? $scope.searchPerson.str : "",
                    login_user_id: $rootScope.$storage.cgu_id
                }
            }).then(function (response) {
                response = response.data;
                if (response.success == 1) {
                    $scope.loading = true;
                    $scope.folders = response.folders;
                    $scope.files = response.files;
                    $scope.breadcrumbs = response.breadcrumbs;
                    $scope.total_records = response.count;

                    $scope.files =  $scope.files.map(function (f) {
                        if (f.post_type == 'video' && f.link && f.link.indexOf("youtube") !== -1) {
                            f.youtubeId = $scope.getId(f.link);
                            f.embed_link = $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + f.youtubeId);
                        }else {
                            f.youtubeId = "";
                            f.embed_link = "";
                        }
                        f.tags = f.keywords.split(",");
                            
                        return f;
                     });

                    if ($scope.searchPerson.str) {
                        $scope.search_string = $scope.searchPerson.str;
                    } else {
                        $scope.search_string = "";
                    }

                    $scope.grpupedFiles = _.groupBy($scope.files, "post_type");
                    $scope.current_page = page + 1;
                }
                $scope.loading = false;
            }, function (error) {
            })
        }

        
    }

    // if (!$rootScope.$storage.cgu_id) {
        $scope.loadSpFolders($scope.current_page, $scope.page_limit);
    // }

    $scope.openPersonModal = function () {
        $scope.speaker = {};
        $scope.newSpeakerModal = true;
        $scope.speaker.flag = "insert";
    }

    $scope.renamePerson = function (person) {
        $scope.speaker = {};
        $scope.speaker.id = person.id;
        $scope.speaker.name = person.name;
        $scope.speaker.flag = "edit";
        $scope.renameSpeakerModal = true;
    }

    $scope.processing = false;
    $scope.addSpokesPersons = function (form) {
        if (form.validate() && form.$valid && !$scope.processing) {
            $scope.processing = true;
            $scope.speaker.apiId = apiKey;
            $scope.speaker.login_user_id = $rootScope.$storage.cgu_id;

             $http({
                method: "POST",
                url: apiUrl + "add_spokers_person",
                data: $scope.speaker
            }).then(function (response) {
                response = response.data;
                if (response.success == 1) {
                     $scope.processing = false;
                    $scope.loadSpokePersons();
                    $scope.newSpeakerModal = false;
                    $scope.renameSpeakerModal = false;
                } else {
                    $scope.processing = false;
                    $mdToast.show({
                        template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                        hideDelay: 6000,
                        position: 'bottom right'
                    });
                }
            }, function (error) {
                console.log(error);
            });

        }
    }

    $scope.checkAll = function () {
        if ($("#folder-list-all").is(":checked")) {
            $scope.selection.ids = $scope.spokespersons.map(function (a) {
                return a.id;
            });
        } else {
            $scope.selection.ids = [];
        }
    }

    $scope.deletePerson = function (id) {
        if (id) {
            swal({
                text: "Do you want to delete this spokes person?",
                type: 'warning',
                showCancelButton: true,
                cancelButtonColor: '#25476a',
                confirmButtonColor: '#42b655',
                confirmButtonText: 'Yes'
            }).then(function () {
                $http({
                    method: 'POST',
                    url: apiUrl + "delete_spoke_person",
                    data: {
                        login_user_id: $rootScope.$storage.cgu_id,
                        apiId: apiKey,
                        id: id
                    }
                }).then(function successCallback(response) {
                    response = response.data;
                    if (response.success == 1) {
                        $scope.loadSpokePersons();
                         $mdToast.show({
                            template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                            hideDelay: 6000,
                            position: 'bottom right'
                        });
                    } else {
                        $mdToast.show({
                            template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                            hideDelay: 6000,
                            position: 'bottom right'
                        });
                    }
                });
            });
        } else {
            if ($scope.selection.ids.length > 0) {
                swal({
                    text: "Are you sure to delete ?",
                    type: 'warning',
                    showCancelButton: true,
                    cancelButtonColor: '#25476a',
                    confirmButtonColor: '#42b655',
                    confirmButtonText: 'Yes'
                }).then(function () {
                    $http({
                        method: 'POST',
                        url: apiUrl + 'delete_spoke_person',
                        data: {
                            login_user_id: $rootScope.$storage.cgu_id,
                            apiId: apiKey,
                            id: $scope.selection.ids.join(",")
                        }
                    }).then(function successCallback(response) {
                        response = response.data;
                        if (response.success == 1) {
                            $scope.loadSpokePersons();
                            $scope.selection.ids = [];
                            $mdToast.show({
                                template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                                hideDelay: 6000,
                                position: 'bottom right'
                            });
                        } else {
                            $mdToast.show({
                                template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                                hideDelay: 6000,
                                position: 'bottom right'
                            });
                        }
                    });
                });
            } else {
                $mdToast.show({
                    template: '<md-toast class="md-toast error">Please select at least one spokespersons to perform the operation.</md-toast>',
                    hideDelay: 6000,
                    position: 'bottom right'
                });
            }
        }
    }

    $scope.clearSearch = function () {
        $scope.searchPerson.str = "";
        $scope.search_string = "";
        // $scope.loadSpokePersons();
        $scope.loadSpFolders(0, $scope.page_limit);
    }

    $scope.file_obj = {};

    $scope.today = function() {
        $scope.file_obj.publishdate = new Date();
    };
    $scope.today();

    $scope.clear = function() {
        $scope.file_obj.publishdate = null;
    };    

    $scope.popup1 = {
       opened: false
    };
    $scope.dateOptions = {
        // dateDisabled: disabled,
        startingDay: 1
    };

    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };

    function disabled(data) {
        var date = data.date,
        mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }

    $scope.getFileTypes = function () {
        if ($scope.file_obj.post_type == "document") {
            $scope.file_exts = "'."+$scope.doc_file_ext.join(',.') + ',.' + $scope.excel_file_ext.join(',.') + ",.pdf,.csv,.txt'";
        } else if ($scope.file_obj.post_type == "link") {
            $scope.file_exts = "";
        } else if ($scope.file_obj.post_type == "video") {
            $scope.file_exts = "'."+$scope.video_file_ext.join(',.')+"'";
        }
    }

    $scope.fileUploadModal = false;
    $scope.addFile = true;

    $scope.openKeyWordsModal = function (file) {
        $scope.loadSpokePersons('', 'all');
        $scope.addFile = false;
        $scope.file_obj = {};
        $scope.creative_imgs = [];
        $scope.file_album = [];
        $scope.file_obj.file_id = file.id;
        $scope.file_obj.keywords = file.keywords ? file.keywords.split(",") : [];
        $scope.file_obj.topic = file.topic;
        $scope.file_obj.link = file.link;
        $scope.file_obj.categories = file.categories.map(function (a) {return a.id});
        $scope.file_obj.spokespersons = file.spokespersons.map(function (a) {return a.id});
        $scope.file_obj.old_file = file.file_name;
        $scope.file_obj.post_type = file.post_type;
        $scope.file_obj.publishdate = new Date(Number(file.publish_date) * 1000);
        $scope.fileUploadModal = true;
    }


    $scope.deleteFolder = function (type, id) {

        swal({

            text: "Do you want to delete this "+type+"?",

            type: 'warning',

            showCancelButton: true,

            cancelButtonColor: '#25476a',

            confirmButtonColor: '#42b655',

            confirmButtonText: 'Yes'

        }).then(function () {

            if (type == "folder") {

                var appUrl = "deleteFolders";

            } else {

                var appUrl = "deleteFiles";

            }



            $http({

                method: 'POST',

                url: apiUrl + appUrl,

                data: {

                    login_user_id: $rootScope.$storage.cgu_id,

                    apiId: apiKey,

                    id: id

                }

            }).then(function successCallback(response) {

                response = response.data;

                if (response.success == 1) {
                    $scope.loadSpFolders($scope.current_page - 1, $scope.page_limit);
                    $scope.loadSubfolders();
                     $mdToast.show({

                        template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',

                        hideDelay: 6000,

                        position: 'bottom right'

                    });

                } else {

                    $mdToast.show({

                        template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',

                        hideDelay: 6000,

                        position: 'bottom right'

                    });

                }

            });

        });

    }

    $scope.show_file_error = false;

    $scope.uploading_file = false;
    $scope.uploadDocument = function (form) {
        if (form.validate() && form.$valid && !$scope.uploading_file) {

            $scope.show_file_error = false;
            $scope.uploading_file = true;
            $(".waiting_loader").fadeIn();
            // if ($scope.addFile) {
                var formData = new FormData();
                formData.append("file", $scope.file_obj.file);
                formData.append("noti_img_file", $scope.file_obj.noti_img_file);
                formData.append("keywords", ($scope.file_obj.keywords && $scope.file_obj.keywords.length > 0) ? $scope.file_obj.keywords.map(function (a) {return a.text}).join(",")  : "");
                formData.append("from_app", 'true');
                formData.append("apiId", apiKey);
                formData.append("user_id", $rootScope.fromBase64($rootScope.$storage.cgu_id));
                formData.append("folder_id", $rootScope.toBase64($rootScope.active_folder_id));
                formData.append("topic", $scope.file_obj.topic);
                formData.append("link", $scope.file_obj.link ? $scope.file_obj.link : "");
                formData.append("send_notification", ($('#send-notification').is(':checked'))? '1':'0');
                formData.append("categories", ($scope.file_obj.categories && $scope.file_obj.categories.length > 0) ? $scope.file_obj.categories.join(",") : "");
                formData.append("spokespersons", ($scope.file_obj.spokespersons && $scope.file_obj.spokespersons.length > 0) ? $scope.file_obj.spokespersons.join(",") : "" );
                if ($scope.file_obj.publishdate) {
                    formData.append("publish_date", moment($scope.file_obj.publishdate).format("YYYY-MM-DD"));
                } else {
                    formData.append("publish_date", "");
                }
                formData.append("post_type", $scope.file_obj.post_type);
                formData.append("read_doc", ($("#read_doc").is(":checked")) ? 'true' : 'false');

                if ($scope.addFile) {
                    formData.append("flag", "insert");
                } else {
                    formData.append("flag", "edit");
                    formData.append("file_id", $scope.file_obj.file_id);
                    if (!$scope.file_obj.file) {
                        formData.append("old_file", $scope.file_obj.old_file);
                    }
                }

                formData.append("login_user_id", $rootScope.$storage.cgu_id);

                $http({
                    url: apiUrl + "upload_files",
                    method: 'POST',
                    data:formData,
                    headers: {'Content-Type': undefined}
                }).then(function (response) {
                    response = response.data;
                    if (response.success == 1) {
                        $mdToast.show({
                            template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                            hideDelay: 6000,
                            position: 'bottom right'
                        });
                        $scope.loadSpFolders(0, $scope.page_limit);
                        $scope.fileUploadModal = false;
                        $scope.uploading_file = false;
                    } else {
                        $mdToast.show({
                            template: '<md-toast class="md-toast error">Oopppsss..! Some error occured.</md-toast>',
                            hideDelay: 6000,
                            position: 'bottom right'
                        });
                        $scope.uploading_file = false;
                    }
                    $(".waiting_loader").fadeOut();
                }, function (error) {
                    $mdToast.show({
                        template: '<md-toast class="md-toast error">Oopppsss..! Some error occured.</md-toast>',
                        hideDelay: 6000,
                        position: 'bottom right'
                    });
                });
           
        } else {
            $scope.show_file_error = true;
        }
    }

});

app.controller("privacyController", function ($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $mdToast, $timeout, Upload) {
    if ($location.search().q == "1") {
        $rootScope.hideHeader = true;
        $rootScope.is_mobile_view = true;

    } else {
        $rootScope.hideHeader = false;
        $rootScope.is_mobile_view = false;
    }
});
app.controller("userController", function ($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $mdToast, $timeout, Upload) {

    if ($location.search().q == "4") {
        $rootScope.hideHeader = true;
        $rootScope.is_mobile_view = true;

    } else {
        $rootScope.is_mobile_view = false;
        if (!$rootScope.$storage.cgu_id) {
            $location.path('/login');
        }
        
        // if ($rootScope.$storage.cgu_type != 'admin' && $rootScope.$storage.cgu_type != 'third-party') {
        //     $location.path('/');
        // }
    }

    $scope.activeTab = 'Registered';
    $scope.user = {};
    $scope.getUserData = function () {
        $http({
            method: "POST",
            url: apiUrl + "getUserDetails",
            data: {
                apiId: apiKey,
                user_id: $rootScope.$storage.cgu_id,
                login_user_id: $rootScope.$storage.cgu_id
            }
        }).then(function (response) {
            response = response.data;
            if (response.success == 1) {
                $scope.user = response.user;
            } else {
                $mdToast.show({
                    template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                    hideDelay: 5000,
                    position: 'bottom right'
                });
            }
        }, function (error) {
            console.log(error);
        });
    };

    if ($rootScope.$storage.cgu_id) {
        $scope.getUserData();
    }



    $scope.active_user_id = "";
    $scope.userCPModal = false;
    $scope.openUserPwdModal = function (user_id) {
        $scope.active_user_id = user_id;
        $scope.active_user = {};
        $scope.userCPModal = true;
    }

    $scope.load_processing = false;
    $scope.ChangeUserPassword = function(form){
         if(form.validate() && !$scope.load_processing) {
            $scope.load_processing = true;
            $http({
              method: 'POST',
              url: apiUrl + 'change_user_password',
              data : {
                'apiId' : apiKey,
                'new_password' : md5.createHash($scope.active_user.new_password),
                'new_password_org' : $scope.active_user.new_password,
                'user_id' : $rootScope.toBase64($scope.active_user_id)
              }
            }).then(function successCallback(response) {
                response = response.data;
                if(response.success == 1){
                    $scope.load_processing = false;
                    $scope.userCPModal = false;
                    $scope.active_user = {};
                    $mdToast.show({
                        template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                        hideDelay: 6000,
                        position: 'bottom right'
                    });
                }
                else{
                    $scope.response_message = response.message;
                    $scope.response_class = "error-label";
                    $scope.load_processing = false;
                }
            }, function errorCallback(response) {
            
            });
                    
         }
    }

    
    $scope.senUserPassword = function(user){
         if(!user.op_loading) {
            user.op_loading = true;
            $http({
              method: 'POST',
              url: apiUrl + 'send_user_password',
              data : {
                'apiId' : apiKey,
                'user_id' : $rootScope.toBase64(user.id)
              }
            }).then(function successCallback(response) {
                response = response.data;
                if(response.success == 1){
                    user.op_loading = false;
                    $mdToast.show({
                        template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                        hideDelay: 6000,
                        position: 'bottom right'
                    });
                }
                else{
                    user.op_loading = false;
                }
            }, function errorCallback(response) {
            
            });
                    
         }
    }

    $scope.userDetialsModel = false;
    $scope.activeUser = {};
    $scope.openDetails = function (user) {
        $scope.activeUser = user;
        $("#userDetialsModel").attr("title", $scope.activeUser.fullname);
        $scope.userDetialsModel = true;
        $("#userDetialsModel .modal-title").text($scope.activeUser.fullname);
    }

    $scope.validateProfile = {
        onkeyup: function(element) {
            this.element(element);
        },
        rules : {
            first_name : {
                required : true,
                lettersonly: true
            },
            last_name : {
                required : true,
                lettersonly: true
            },
            email : {
                required : true,
                email  : true
            },
            phone : {
                required : true,
                digits: true,
                rangelength: [10,10]
            }
        },
        messages : {
            first_name : {
                required : "Enter your first name.",
                lettersonly: "Enter valid name."
            },
            last_name : {
                required : "Enter your last name.",
                lettersonly: "Enter valid name."
            },
            email : {
                required : "Enter an email address.",
                email    : "Email must be in format of example@domain.ext"
            },
            phone : {
                required : "Enter your contact number",
                digits: "Contact no must be of 10 digits.",
                rangelength: "Contact no must be of 10 digits."
            }
        }
    }

    $scope.submitProfile = false;
    $scope.updateProfile = function (form) {
        console.log(form.validate());
        console.log(form.$valid);
        console.log(!$scope.submitProfile);
        if (form.validate() && form.$valid && !$scope.submitProfile) {
            $scope.submitProfile = true;
            $scope.user.user_id = $rootScope.$storage.cgu_id;
            $scope.user.apiId = apiKey;
            $scope.user.from_app = "true";

            var user_data = new FormData();

            angular.forEach($scope.user, function (val, key) {
                user_data.append(key, val);
            });

            user_data.append("login_user_id", $rootScope.$storage.cgu_id);

            $http({
                method: "POST",
                url: apiUrl + "updateUserProfile",
                data: user_data,
                headers: {"Content-Type" : undefined}
            }).then(function (response) {
                response = response.data;
                if (response.success == 1) {
                    $rootScope.login_message = response.message;
                    $rootScope.login_message_class = "success-label";
                    $rootScope.$storage.cgu_name = response.user.fullname;
                    $rootScope.$storage.cgu_pic = response.user.profile_pic_path;

                    $timeout(function () {
                        $rootScope.login_message = "";
                        $rootScope.login_message_class = "";
                    }, 6000);
                    $scope.submitProfile = false;
                } else {
                    $mdToast.show({
                        template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                        hideDelay: 6000,
                        position: 'bottom right'
                    });
                    $scope.submitProfile = false;
                }
            }, function (error) {
                console.log(error);
            });
        }
    }

    $scope.changePasswordModal = false;

    $rootScope.openCpModal = function () {

        $scope.user.old_password = "";
        $scope.user.new_password = "";
        $scope.user.cp_password = "";
        $rootScope.login_message = "";
        $rootScope.login_message_class = "";
        $rootScope.response_class = "";
        $rootScope.response_message = "";
        $scope.response_message = "";
        $scope.response_class = "";
        $scope.changePasswordModal = true;
        $timeout(function() {
            $rootScope.ch_pass_open = false;
        }, 1000);
    }

    if ($rootScope.ch_pass_open) {
        $rootScope.openCpModal();
    }
    
    $scope.validateChangePassword = {
        onkeyup: function(element) {
            this.element(element);
        },
        rules : {
            old_password: {
                required: true
            },
            new_password : {
                required : true,
                minlength: 5
            },
            cp_password : {
                required : true,
                minlength: 5,
                equalTo : "#new_password"   
            }
        },
        messages : {
            old_password: {
                required: "Please enter your current password."
            },
            new_password : {
                required : "Please enter new password!",
                minlength: "Your Password must be contains at list 5 characters long.",
            },
            cp_password : {
                required : "Please re enter your new password!",
                minlength: "Your Password must be contains at list 5 characters long.",
                equalTo : "Passwords do not matched, Please re enter again!",
            }
        }
    }

    $scope.processing = false;
    $scope.submitChangePassword = function(form){
         if(form.validate() && !$scope.processing) {
            $scope.processing = true;
            $http({
              method: 'POST',
              url: apiUrl + 'change_password',
              data : {
                'apiId' : apiKey,
                'old_password' : md5.createHash($scope.user.old_password),
                'new_password' : md5.createHash($scope.user.new_password),
                'new_password_org' : $scope.user.new_password,
                'user_id' : $rootScope.$storage.cgu_id
              }
            }).then(function successCallback(response) {
                response = response.data;
                if(response.success == 1){
                    $rootScope.login_message = response.message;
                    $rootScope.login_message_class = "success-label";
                    $scope.changePasswordModal = false;
                    $timeout(function () {
                        $rootScope.login_message = "";
                        $rootScope.login_message_class = "";
                    }, 6000);
                    $scope.user.old_password = "";
                    $scope.user.new_password = "";
                    $scope.user.cp_password = "";
                    $scope.processing = false;
                }
                else{
                    $scope.response_message = response.message;
                    $scope.response_class = "error-label";
                    $scope.processing = false;
                }
            }, function errorCallback(response) {
            
            });
                    
         }
    }

    $scope.validateContactInfo = {
        onkeyup: function(element) {
            this.element(element);
        },
        rules : {
            temp_email: {
                required: true,
                email: true
            },
            temp_phone : {
                required : true,
                digits : true,
                rangelength : [10, 10]
            }
        },
        messages : {
            temp_email: {
                required: "Please enter your Email-ID.",
                email: "Please enter valid Email-ID."
            },
            temp_phone : {
                required : "Please enter your contact number!",
                digits : "Please enter valid 10 digits contact number!",
                rangelength: "Please enter valid 10 digits contact number!",
            }
        }
    }

    $scope.ContactInfoModal = false;

    $scope.openLoginDtModal = function () {
        $scope.user.temp_email = $scope.user.email;
        $scope.user.temp_phone = $scope.user.phone;
        $scope.ContactInfoModal = true;
    }


    $scope.updateContactInfo = function(form){
         if(form.validate() && !$scope.processing) {
            $scope.processing = true;
            $http({
              method: 'POST',
              url: apiUrl + 'updateContactInfo',
              data : {
                'apiId' : apiKey,
                'email' : $scope.user.temp_email,
                'phone' : $scope.user.temp_phone,
                'user_id' : $rootScope.fromBase64($rootScope.$storage.cgu_id)
              }
            }).then(function successCallback(response) {
                response = response.data;
                if(response.success == 1){
                    $scope.ContactInfoModal = false;
                    $scope.user.temp_email = "";
                    $scope.user.temp_phone = "";
                }
                $scope.processing = false;
                
                $mdToast.show({
                    template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                    hideDelay: 6000,
                    position: 'bottom right'
                });
            }, function errorCallback(response) {
            
            });
        }
    }

    $scope.datePicker = {};
    $scope.minDate = moment().subtract(6, 'months');
    $scope.maxDate = moment();
    $scope.datePicker.date = {startDate:  null, endDate: null};

    $scope.fromD = "";
    $scope.toD = "";

    $scope.users =[];
    $scope.search_user = {};
    $scope.selection = {user_ids: []};
    $scope.current_page = 0;
    $scope.total_users = 0;
    $scope.page_limit = "15";
    $scope.loaddingUsers = false;
    $scope.loadUsers = function (page, limit) {
        $scope.loaddingUsers = true;
        var user_from_date = "";
        var user_to_date = "";
        if ($scope.datePicker.date.startDate && $scope.datePicker.date.endDate) {
            user_from_date = Math.round(new Date($scope.datePicker.date.startDate).getTime() / 1000);
            user_to_date = Math.round(new Date($scope.datePicker.date.endDate).getTime() / 1000);
        } 

        $http({
            method: "POST",
            url: apiUrl + "Users_list",
            data: {
                apiId: apiKey,
                page: page,
                limit: limit,
                search_str: $scope.search_user.str,
                login_user_id: $rootScope.$storage.cgu_id,
                type: $scope.activeTab,
                from_date: user_from_date,
                to_date: user_to_date
            }
        }).then(function (response) {
            response = response.data;
            if (response.success == 1) {
                $scope.users = response.users;
                $scope.total_users = response.count;

                $scope.current_page = page+1;
                $scope.loaddingUsers = false;
            } else {
                $scope.loaddingUsers = false;
            }
            $(".waiting_loader").fadeOut();

        }, function (error) {
        });
    }
    $scope.loadUsers($scope.current_page, $scope.page_limit);

    

    $scope.options = {
      applyClass: 'btn-green',
      locale: {
        applyLabel: "Apply",
        fromLabel: "From",
        format: "DD-MM-YYYY",
        toLabel: "To",
        cancelLabel: 'Cancel',
        customRangeLabel: 'Custom range'
      },
      ranges: {
        'Today': [moment().startOf('day'), moment()],
        'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'),  moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'months').startOf('month'),  moment().subtract(1, 'months').endOf('month')]
      },
      eventHandlers: {'apply.daterangepicker' : function(ev, picker) { 
        $scope.loadUsers(0, $scope.page_limit);
        if ($scope.datePicker.date.startDate && $scope.datePicker.date.endDate) {
            $scope.fromD = moment($scope.datePicker.date.startDate).format('YYYY-MM-DD');
            $scope.toD = moment($scope.datePicker.date.endDate).format('YYYY-MM-DD');
        } else {
            $scope.fromD = "";
            $scope.toD = "";
        }
      }}
    }
    
    $scope.clearDate = function() {
        $scope.datePicker.date = "";
        $scope.datePicker.date = "";
        $scope.fromD = "";
        $scope.toD = "";
        $scope.loadUsers(0, $scope.page_limit);
    }

    $scope.changeTab = function(tab) {
        $(".waiting_loader").fadeIn();
        $scope.search_user.str = "";
        $scope.activeTab = tab;
        $scope.loadUsers(0, $scope.page_limit);
    }

    
    $scope.manage_user = {};
    $scope.manage_user.action = "";

    $scope.manage_user = {};
    $scope.manageUsers = function (id, operation) {
        if (id) {
            swal({

                text: "Do you want to "+operation+" this user?",

                type: 'warning',

                showCancelButton: true,

                cancelButtonColor: '#25476a',

                confirmButtonColor: '#42b655',

                confirmButtonText: 'Yes'

            }).then(function () {

                if (operation == 'unapprove') {
                    swal({
                        text: "Do you want to send mail to this user?",
                        type: 'warning',
                        showCancelButton: true,
                        cancelButtonColor: '#25476a',
                        confirmButtonColor: '#42b655',
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No',
                        closeOnCancel: false
                    }).then(function () {
                        $http({
                            method: 'POST',
                            url: apiUrl + 'manage_user',
                            data: {
                                login_user_id: $rootScope.$storage.cgu_id,
                                apiId: apiKey,
                                user_id: id,
                                flag : operation,
                                send_mail: 'true'
                            }
                        }).then(function successCallback(response) {
                            response = response.data;
                            if (response.success == 1) {
                                $scope.loadUsers($scope.current_page - 1, $scope.page_limit);
                                $scope.userDetialsModel = false;
                                $mdToast.show({
                                    template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                                    hideDelay: 6000,
                                    position: 'bottom right'
                                });

                            } else {
                                $mdToast.show({
                                    template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                                    hideDelay: 6000,
                                    position: 'bottom right'
                                });
                            }

                        });
                    }, function(isClosed) {
                        if (isClosed == 'cancel') {
                            $http({
                                method: 'POST',
                                url: apiUrl + 'manage_user',
                                data: {
                                    login_user_id: $rootScope.$storage.cgu_id,
                                    apiId: apiKey,
                                    user_id: id,
                                    flag : operation,
                                }
                            }).then(function successCallback(response) {
                                response = response.data;
                                if (response.success == 1) {
                                    $scope.loadUsers($scope.current_page - 1, $scope.page_limit);
                                    $scope.userDetialsModel = false;
                                    $mdToast.show({
                                        template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                                        hideDelay: 6000,
                                        position: 'bottom right'
                                    });

                                } else {
                                    $mdToast.show({
                                        template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                                        hideDelay: 6000,
                                        position: 'bottom right'
                                    });
                                }

                            });
                        }
                    });
                } else {
                    $http({

                        method: 'POST',

                        url: apiUrl + 'manage_user',

                        data: {

                            login_user_id: $rootScope.$storage.cgu_id,

                            apiId: apiKey,

                            user_id: id,

                            flag : operation

                        }

                    }).then(function successCallback(response) {

                        response = response.data;

                        if (response.success == 1) {
                            
                            $scope.loadUsers($scope.current_page - 1, $scope.page_limit);

                            $scope.userDetialsModel = false;
                            
                            $mdToast.show({

                                template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',

                                hideDelay: 6000,

                                position: 'bottom right'

                            });

                        } else {

                            $mdToast.show({

                                template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',

                                hideDelay: 6000,

                                position: 'bottom right'

                            });

                        }

                    });
                }

            });

        } else {
            if ($scope.manage_user.action) {
                if ($scope.selection.user_ids.length > 0) {

                    swal({

                        text: "Are you sure to "+$scope.manage_user.action+" ?",

                        type: 'warning',

                        showCancelButton: true,

                        cancelButtonColor: '#25476a',

                        confirmButtonColor: '#42b655',

                        confirmButtonText: 'Yes'

                    }).then(function () {
                        if ($scope.manage_user.action == 'unapprove') {
                            swal({
                                text: "Do you want to send mail to this users?",
                                type: 'warning',
                                showCancelButton: true,
                                cancelButtonColor: '#25476a',
                                confirmButtonColor: '#42b655',
                                confirmButtonText: 'Yes',
                                cancelButtonText: 'No',
                                closeOnCancel: false
                            }).then(function () {
                                $http({
                                    method: 'POST',
                                    url: apiUrl + 'manage_user',
                                    data: {
                                        login_user_id: $rootScope.$storage.cgu_id,
                                        apiId: apiKey,
                                        user_id: $scope.selection.user_ids.join(","),
                                        flag : $scope.manage_user.action
                                    }

                                }).then(function successCallback(response) {
                                    response = response.data;
                                    if (response.success == 1) {
                                            $scope.loadUsers($scope.current_page - 1, $scope.page_limit);
                                            $scope.userDetialsModel = false;
                                            $scope.manage_user.action = "";
                                            $scope.selection.user_ids = [];
                                            $mdToast.show({
                                                template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                                                hideDelay: 6000,
                                                position: 'bottom right'

                                            });
                                    } else {
                                        $mdToast.show({
                                            template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                                            hideDelay: 6000,
                                            position: 'bottom right'
                                        });

                                    }
                                });
                            }, function(isClosed) {
                                if (isClosed == 'cancel') {
                                    $http({
                                        method: 'POST',
                                        url: apiUrl + 'manage_user',
                                        data: {
                                            login_user_id: $rootScope.$storage.cgu_id,
                                            apiId: apiKey,
                                            user_id: $scope.selection.user_ids.join(","),
                                            flag : $scope.manage_user.action,
                                            send_mail: 'true'
                                        }

                                    }).then(function successCallback(response) {
                                        response = response.data;
                                        if (response.success == 1) {
                                                $scope.loadUsers($scope.current_page - 1, $scope.page_limit);
                                                $scope.userDetialsModel = false;
                                                $scope.manage_user.action = "";
                                                $scope.selection.user_ids = [];
                                                $mdToast.show({
                                                    template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                                                    hideDelay: 6000,
                                                    position: 'bottom right'

                                                });
                                        } else {
                                            $mdToast.show({
                                                template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                                                hideDelay: 6000,
                                                position: 'bottom right'
                                            });

                                        }
                                    });
                                }
                            });
                        } else {
                            $http({
                                method: 'POST',
                                url: apiUrl + 'manage_user',
                                data: {
                                    login_user_id: $rootScope.$storage.cgu_id,
                                    apiId: apiKey,
                                    user_id: $scope.selection.user_ids.join(","),
                                    flag : $scope.manage_user.action
                                }

                            }).then(function successCallback(response) {
                                response = response.data;
                                if (response.success == 1) {
                                        $scope.loadUsers($scope.current_page - 1, $scope.page_limit);

                                        $scope.userDetialsModel = false;

                                        $scope.manage_user.action = "";

                                        $scope.selection.user_ids = [];

                                        $mdToast.show({

                                            template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',

                                            hideDelay: 6000,

                                            position: 'bottom right'

                                        });

                                } else {
                                    $mdToast.show({
                                        template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                                        hideDelay: 6000,
                                        position: 'bottom right'
                                    });

                                }
                            });
                        }

                    });

                } else {

                    $mdToast.show({

                        template: '<md-toast class="md-toast error">Please select at least one user to perform the operation.</md-toast>',

                        hideDelay: 6000,

                        position: 'bottom right'

                    });

                }
            } else {
                $mdToast.show({
                    template: '<md-toast class="md-toast error">Please select the operation you want to perform.</md-toast>',
                    hideDelay: 6000,
                    position: 'bottom right'
                });
            }

        }

    }

    $scope.manageRequests = function (id, operation, active_user_data) {
        
        if (active_user_data) {
            if (operation == 'approve') {
                active_user_data.rap_loading = true;
            } else if (operation == 'reject') {
                active_user_data.ruap_loading = true;
            }
        }

        if (id) {
            swal({

                text: "Do you want to "+operation+" this request?",

                type: 'warning',

                showCancelButton: true,

                cancelButtonColor: '#25476a',

                confirmButtonColor: '#42b655',

                confirmButtonText: 'Yes'

            }).then(function () {
                
                $http({

                    method: 'POST',

                    url: apiUrl + 'manageContactRequest/'+operation,

                    data: {

                        login_user_id: $rootScope.$storage.cgu_id,

                        apiId: apiKey,

                        user_id: id

                    }

                }).then(function successCallback(response) {

                    response = response.data;

                    if (response.success == 1) {
                        
                        $scope.loadUsers($scope.current_page - 1, $scope.page_limit);

                        if (active_user_data) {
                            if (operation == 'approve') {
                                active_user_data.rap_loading = false;
                            } else if (operation == 'reject') {
                                active_user_data.ruap_loading = false;
                            }
                        }

                        $timeout(function() {

                            $scope.userDetialsModel = false;
                        }, 1000);
                        
                        $mdToast.show({

                            template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',

                            hideDelay: 6000,

                            position: 'bottom right'

                        });

                    } else {
                        if (active_user_data) {
                            if (operation == 'approve') {
                                active_user_data.rap_loading = false;
                            } else if (operation == 'reject') {
                                active_user_data.ruap_loading = false;
                            }
                        }

                        $mdToast.show({

                            template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',

                            hideDelay: 6000,

                            position: 'bottom right'

                        });

                    }

                });

            });

        }

    }

    $scope.submittingnotification_box = false;
    $scope.notificationObj = {};
    $scope.notifacation_submit = function(form){
        if(form.validate() && !$scope.submittingnotification_box) {
            $scope.submittingnotification_box = true;

            var formdata = new FormData();
            formdata.append("apiId", apiKey);
            formdata.append("from_app", true);
            formdata.append("notification_title", $scope.notificationObj.notification_title);
            formdata.append("noti_message", $scope.notificationObj.noti_message);
            formdata.append("login_user_id", $rootScope.$storage.cgu_id);
            formdata.append("image", $scope.notificationObj.noti_img);


            $http({
              method: 'POST',
              url: apiUrl + 'user_notification',
              data : formdata,
              headers: {'Content-Type': undefined}
            }).then(function successCallback(response) {
                response = response.data;
                if(response.success == 1){
                    $rootScope.message = response.message;
                    $scope.submittingnotification_box = false;
                    $mdToast.show({
                        template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                        hideDelay: 6000,
                        position: 'bottom right'
                    });
                    $location.path("/");
                }
                else{
                    $scope.response_message = response.message;
                    $scope.submittingnotification_box = false;
                    $mdToast.show({
                        template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                        hideDelay: 6000,
                        position: 'bottom right'
                    });
                }
            }, function errorCallback(response) {
            
            });
                    
        }
    }


    $scope.addUser = {};
    $scope.addUserModal = false;
    
    $rootScope.openAddUserModal = function () {
        $scope.addUser = {};
        $scope.addUserModal = true;
    }

    $scope.validateUserData = {
        onkeyup: function(element) {
            this.element(element);
        },
        rules : {
            fullname: {
                required: true
            },
            email : {
                required : true,
                email  : true
            },
            contact : {
                required : true,
                number:true,
                minlength:10,
                maxlength:10
            },
            state : {
                required: true
            },
            city : {
                required: true
            }
        },
        messages : {
            fullname: {
                required: "Enter user's Full Name."
            },
            email : {
                required : "Enter an email address.",
                email    : "Email must be in format of example@domain.ext"
            },
            contact: {
                required : "Enter Contact Number.",
                number: "Please enter valid Contact Number.",
                minlength:"Please enter minmum 10 numbers.",
                maxlength:"Please enter maximum 10 numbers."
            },
            state : {
                required: "Select the state."
            },
            city : {
                required: "Select the district."
            }
        }
    }

    $scope.createNewUser = function(form){
         if(form.validate() && !$scope.processing) {
            $scope.processing = true;
            $scope.addUser.apiId = apiKey;
            $scope.addUser.added_by = 'admin';
            $scope.addUser.from_app = "true";

            var formData = new FormData();
            angular.forEach($scope.addUser, function(val, key) {
                formData.append(key, val);
            });

            $http({
              method: 'POST',
              url: apiUrl + 'signup',
              data: formData,
              headers: {'Content-Type': undefined}
            }).then(function successCallback(response) {
                response = response.data;
                if(response.success == 1){
                    $mdToast.show({
                        template: '<md-toast class="md-toast error">Account has been successfully created!</md-toast>',
                        // template: '<md-toast class="md-toast error">Account has been successfully created! Password sent to registered email address. </md-toast>',
                        hideDelay: 6000,
                        position: 'bottom right'
                    });
                    $scope.processing = false;
                    $scope.addUserModal = false;

                    $scope.loadUsers(0, $scope.page_limit);
                }
                else{
                     $mdToast.show({
                        template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                        hideDelay: 6000,
                        position: 'bottom right'
                    });
                    $scope.processing = false;
                }
            }, function errorCallback(response) {
                $scope.processing = false;
            });
                    
         }
    }


});

app.controller("suggationsController", function ($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $mdToast, $timeout, Upload) {

    if ($location.search().q == "4") {
        $rootScope.hideHeader = true;
        $rootScope.is_mobile_view = true;

    } else {
        $rootScope.is_mobile_view = false;
        if (!$rootScope.$storage.cgu_id) {
            $location.path('/login');
        }
        
        if ($rootScope.$storage.cgu_type != 'admin' && $rootScope.$storage.cgu_type != 'third-party') {
            $location.path('/');
        }
    }
    $scope.encodedURL = function(string) {
        return encodeURI(string);
    }
    $scope.suggestions =[];
    $scope.searchObj = {};
    $scope.selection = {suggetion_ids: []};
    $scope.current_page = 0;
    $scope.total_suggestions = 0;
    $scope.page_limit = "15";
    $scope.loaddingSuggestions = false;


    $scope.datePicker = {};
    $scope.minDate = moment().subtract(6, 'months');
    $scope.maxDate = moment();
    $scope.datePicker.date = {startDate:  null, endDate: null};

    $scope.fromD = "";
    $scope.toD = "";


    $scope.options = {
      applyClass: 'btn-green',
      locale: {
        applyLabel: "Apply",
        fromLabel: "From",
        format: "DD-MM-YYYY",
        toLabel: "To",
        cancelLabel: 'Cancel',
        customRangeLabel: 'Custom range'
      },
      ranges: {
        'Today': [moment().startOf('day'), moment()],
        'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'),  moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'months').startOf('month'),  moment().subtract(1, 'months').endOf('month')]
      },
      eventHandlers: {'apply.daterangepicker' : function(ev, picker) { 
        $scope.loadSuggestions(0,$scope.page_limit);
        if ($scope.datePicker.date.startDate && $scope.datePicker.date.endDate) {
            $scope.fromD = moment($scope.datePicker.date.startDate).format('YYYY-MM-DD');
            $scope.toD = moment($scope.datePicker.date.endDate).format('YYYY-MM-DD');
        } else {
            $scope.fromD = "";
            $scope.toD = "";
        }
      }}
    }

   $scope.filter_states = [];
   $scope.filter_cities = [];
   $scope.filters = {
       states: "",
       cities: ""
   };
    $scope.loadSuggestions = function (page, limit) {
        $scope.loaddingSuggestions = true;

        var postData = {
            apiId: apiKey,
            page: page,
            limit: limit,
            states: $scope.filters.states,
            cities: $scope.filters.cities,
            search_str: $scope.searchObj.str,
            login_user_id: $rootScope.$storage.cgu_id
        };

        if ($scope.datePicker.date.startDate && $scope.datePicker.date.endDate) {
            postData.from_date = Math.round(new Date($scope.datePicker.date.startDate).getTime() / 1000);
            postData.to_date = Math.round(new Date($scope.datePicker.date.endDate).getTime() / 1000);
        }


        $http({
            method: "POST",
            url: apiUrl + "load_suggestions",
            data: postData
        }).then(function (response) {
            response = response.data;
            if (response.success == 1) {
                $scope.suggestions = response.suggestions;
                $scope.total_suggestions = response.count;

                $scope.filter_states = response.filters.states;
               $scope.filter_cities = response.filters.cities;

                $scope.current_page = page+1;
                $scope.loaddingSuggestions = false;
            } else {
                $scope.loaddingSuggestions = false;
            }
        }, function (error) {
        });
    }
    $scope.loadSuggestions($scope.current_page, $scope.page_limit);

    $scope.clearDate = function() {
        $scope.datePicker.date = "";
        $scope.datePicker.date = "";
        $scope.fromD = "";
        $scope.toD = "";
        $scope.loadSuggestions(0,$scope.page_limit);
    }

    $scope.suggestionDetialsModel = false;
    $scope.activeSuggestion = {};
    $scope.openDetails = function (suggestion) {
        $scope.activeSuggestion = suggestion;
        $("#suggestionDetialsModel").attr("title", $scope.activeSuggestion.name);
        $scope.suggestionDetialsModel = true;
        $("#suggestionDetialsModel .modal-title").text($scope.activeSuggestion.name);
    }

    
    $scope.manage_suggestion = {};
    $scope.manage_suggestion.action = "";

    $scope.manageSuggestions = function (id, operation) {
        if (id) {
            swal({
                text: "Do you want to "+operation+" for this suggestion?",
                type: 'warning',
                showCancelButton: true,
                cancelButtonColor: '#25476a',
                confirmButtonColor: '#42b655',
                confirmButtonText: 'Yes'
            }).then(function () {
                if (operation == 'reply') {
                    swal({
                        text: "Send Mail To User For.....",
                        type: 'warning',
                        showCancelButton: true,
                        cancelButtonColor: '#25476a',
                        confirmButtonColor: '#42b655',
                        confirmButtonText: 'Registration',
                        cancelButtonText: 'Thank You',
                        closeOnCancel: false
                    }).then(function (isConfirm) {
                        $http({
                            method: 'POST',
                            url: apiUrl + 'manage_suggestions',
                            data: {
                                login_user_id: $rootScope.$storage.cgu_id,
                                approved_by: $rootScope.$storage.cgu_id,
                                apiId: apiKey,
                                suggestion_id: id,
                                flag : operation,
                                mail_type: 'Registration'
                            }

                        }).then(function successCallback(response) {
                            response = response.data;
                            if (response.success == 1) {
                                $scope.loadSuggestions($scope.current_page - 1, $scope.page_limit);
                                $scope.suggestionDetialsModel = false;
                            }
                            $mdToast.show({
                                template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                                hideDelay: 6000,
                                position: 'bottom right'
                            });
                        });
                    }, function(isClosed) {
                        if (isClosed == 'cancel') {
                            $http({
                                method: 'POST',
                                url: apiUrl + 'manage_suggestions',
                                data: {
                                    login_user_id: $rootScope.$storage.cgu_id,
                                    approved_by: $rootScope.$storage.cgu_id,
                                    apiId: apiKey,
                                    suggestion_id: id,
                                    flag : operation,
                                    mail_type: 'Thank You'
                                }

                            }).then(function successCallback(response) {
                                response = response.data;
                                if (response.success == 1) {
                                    $scope.loadSuggestions($scope.current_page - 1, $scope.page_limit);
                                    $scope.suggestionDetialsModel = false;
                                }
                                $mdToast.show({
                                    template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                                    hideDelay: 6000,
                                    position: 'bottom right'
                                });
                            });
                        }
                    });
                } else {
                    $http({
                        method: 'POST',
                        url: apiUrl + 'manage_suggestions',
                        data: {
                            login_user_id: $rootScope.$storage.cgu_id,
                            approved_by: $rootScope.$storage.cgu_id,
                            apiId: apiKey,
                            suggestion_id: id,
                            flag : operation
                        }

                    }).then(function successCallback(response) {
                        response = response.data;
                        if (response.success == 1) {
                            $scope.loadSuggestions($scope.current_page - 1, $scope.page_limit);
                            $scope.suggestionDetialsModel = false;
                        }
                        $mdToast.show({
                            template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                            hideDelay: 6000,
                            position: 'bottom right'
                        });
                    });
                }


            });

        } else {
            if ($scope.manage_suggestion.action) {
                if ($scope.selection.suggetion_ids.length > 0) {
                    swal({
                        text: "Are you sure to "+$scope.manage_suggestion.action+" ?",
                        type: 'warning',
                        showCancelButton: true,
                        cancelButtonColor: '#25476a',
                        confirmButtonColor: '#42b655',
                        confirmButtonText: 'Yes'
                    }).then(function () {
                        if ($scope.manage_suggestion.action == 'reply') {
                            swal({
                                text: "Send Mail To User For.....",
                                type: 'warning',
                                showCancelButton: true,
                                cancelButtonColor: '#25476a',
                                confirmButtonColor: '#42b655',
                                confirmButtonText: 'Registration',
                                cancelButtonText: 'Thank You',
                                closeOnCancel: false
                            }).then(function (isConfirm) {
                                $http({
                                    method: 'POST',
                                    url: apiUrl + 'manage_suggestions',
                                    data: {
                                        login_user_id: $rootScope.$storage.cgu_id,
                                        approved_by: $rootScope.$storage.cgu_id,
                                        apiId: apiKey,
                                        suggestion_id: $scope.selection.suggetion_ids.join(","),
                                        flag : $scope.manage_suggestion.action,
                                        mail_type: 'Registration'
                                    }

                                }).then(function successCallback(response) {

                                    response = response.data;
                                    if (response.success == 1) {
                                        $scope.loadSuggestions($scope.current_page - 1, $scope.page_limit);
                                        $scope.suggestionDetialsModel = false;
                                        $scope.manage_suggestion.action = "";
                                        $scope.selection.suggetion_ids = [];
                                        $("#checkAllRow").attr("checked", false);
                                        $("#checkAllRow").removeAttr("checked");
                                    } 
                                    $mdToast.show({
                                        template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                                        hideDelay: 6000,
                                        position: 'bottom right'
                                    });
                                });
                            }, function(isClosed) {
                                if (isClosed == 'cancel') {
                                    $http({
                                        method: 'POST',
                                        url: apiUrl + 'manage_suggestions',
                                        data: {
                                            login_user_id: $rootScope.$storage.cgu_id,
                                            approved_by: $rootScope.$storage.cgu_id,
                                            apiId: apiKey,
                                            suggestion_id: $scope.selection.suggetion_ids.join(","),
                                            flag : $scope.manage_suggestion.action,
                                            mail_type: 'Thank You'
                                        }

                                    }).then(function successCallback(response) {
                                        response = response.data;
                                        if (response.success == 1) {
                                            $scope.loadSuggestions($scope.current_page - 1, $scope.page_limit);
                                            $scope.manage_suggestion.action = "";
                                            $scope.suggestionDetialsModel = false;
                                            $scope.selection.suggetion_ids = [];
                                            $("#checkAllRow").attr("checked", false);
                                            $("#checkAllRow").removeAttr("checked");
                                        } 
                                        $mdToast.show({
                                            template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                                            hideDelay: 6000,
                                            position: 'bottom right'
                                        });
                                    });
                                }
                            });
                        } else {
                            $http({
                                method: 'POST',
                                url: apiUrl + 'manage_suggestions',
                                data: {
                                    login_user_id: $rootScope.$storage.cgu_id,
                                    approved_by: $rootScope.$storage.cgu_id,
                                    apiId: apiKey,
                                    suggestion_id: $scope.selection.suggetion_ids.join(","),
                                    flag : $scope.manage_suggestion.action
                                }

                            }).then(function successCallback(response) {

                                response = response.data;
                                if (response.success == 1) {
                                    $scope.loadSuggestions($scope.current_page - 1, $scope.page_limit);
                                    $scope.manage_suggestion.action = "";
                                    $scope.selection.suggetion_ids = [];
                                    $scope.suggestionDetialsModel = false;
                                    $("#checkAllRow").attr("checked", false);
                                    $("#checkAllRow").removeAttr("checked");
                                } 
                                $mdToast.show({
                                    template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                                    hideDelay: 6000,
                                    position: 'bottom right'
                                });
                            });
                        }
                    });

                } else {
                    $mdToast.show({
                        template: '<md-toast class="md-toast error">Please select at least one row to perform the operation.</md-toast>',
                        hideDelay: 6000,
                        position: 'bottom right'
                    });
                }
            } else {
                $mdToast.show({
                    template: '<md-toast class="md-toast error">Please select the operation you want to perform.</md-toast>',
                    hideDelay: 6000,
                    position: 'bottom right'
                });
            }

        }

    }

    $scope.forwardObj = {};
    $scope.forwardSuggestionModal = false;
    $scope.openForwardMail = function(suggestion) {
        $scope.forwardObj = {};
        $scope.forwardObj.suggestion_id = suggestion.suggestion_id;
        $scope.forwardObj.subject = "Fwd: Congress Sandesh - Suggestion";
        $scope.forwardObj.to = [{}];
        $scope.forwardObj.mail_body = suggestion.suggestions;
        $scope.forwardSuggestionModal = true;
    };

    $scope.addMoreTo = function () {
        $scope.forwardObj.to.push({});
    }

    $scope.validateForwardMail = {
        onkeyup : function(element) {
            this.element(element);
        },

        rules : {
            subject: {
                required : true
            },
            'email[]' : {
                required : true,
                email : true
            },
            mail_body : {
                required : true
            }
        },

        messages : {
            subject: {
                required : "Enter subject of the mail."
            },
            'email[]' : {
                required : "Enter Email-ID.",
                email : "Enter valid Email-ID."
            },
            mail_body : {
                required : "Enter suggetion."
            }
        }
    }

    $scope.load_processing = false;
    $scope.forwardSuggestion = function (form) {
        if (form.validate() && form.$valid && !$scope.load_processing) {
            $scope.load_processing = true;
            var data = {
                apiId : apiKey,
                from_app : "true"
            };

            angular.forEach($scope.forwardObj, function (val, key) {
                if (key == 'to') {
                    data[key] = JSON.stringify(val);
                } else {
                    data[key] = val;
                }
            });

            $http({
                method: 'POST',
                url: apiUrl + 'forward_suggestion',
                data: data
            }).then(function successCallback(response) {
                response = response.data;
                if (response.success == 1) {
                    $scope.forwardSuggestionModal = false;
                } 
                $mdToast.show({
                    template: '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                    hideDelay: 6000,
                    position: 'bottom right'
                });
                $scope.load_processing = false;
            }, function errorCallback(response) {
            });
        }
    }

    $scope.checkAll = function () {
        if ($("#checkAllRow").is(":checked")) {
            $scope.selection.suggetion_ids = $scope.suggestions.map(function (a) {
                return a.suggestion_id;
            });
        } else {
            $scope.selection.suggetion_ids = [];
        }
    }

});
app.controller("NewsController", function ($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $mdToast, $timeout) {

    $scope.tab = 1;
    $scope.setTab = function(newTab){
        $scope.NewsData = {};
        $scope.NewsData.images = [];
        $scope.NewsData.old_images = [];
        $scope.NewsData.status = "Draft";
        $scope.NewsData.flag = "insert";
        $scope.tab = newTab;
    };


    $scope.isSet = function(tabNum){
        return $scope.tab === tabNum;
    };

    $scope.ValidateNewsdetails = {

    onkeyup: function(element) {
        this.element(element);
      },
        rules : {
          title : {
            required : true
          },
          short_description : {
            required : true
          },
          long_description : {
            required : true
          }
          
        },
        messages : {
          title : {
            required : "Please enter News title !!"
          },
          short_description : {
            required : "Please enter sort description !!"
          },
          long_description : {
            required : "Please enter long_description !!"
          }
          
        }
      }

    $scope.curent_page = 0;
    $scope.curent_limit = '15';
    $scope.totalpage = [];
    $scope.allListOfNews = [];
    $scope.loading = false;
    $scope.ListOfNews = function (page, limit) {
        $scope.loading = true;
        $http({
            method: 'POST',
            url: apiUrl + 'post_news_list',
            data: {
                apiId: apiKey,
                user_id: $rootScope.$storage.cgu_id,
                page: page,
                limit: limit,
                search_str: $scope.search_str,
                flag: "all",
            }
        }).then(function successCallback(response) {
            response = response.data;
            if (response.success == 1) {
                $scope.allListOfNews = response.NewsList;
                angular.forEach($scope.allListOfNews, function (news) {
                    // if (news.long_description.length > 200) {
                    //     news.long_description = news.long_description.substr(0, 200)+"..."; 
                    // }

                    // if (news.short_description.length > 200) {
                    //     news.short_description = news.short_description.substr(0, 200)+"..."; 
                    // }
                })


                $scope.totalpage = response.count;
                $scope.curent_page = page + 1;

                if ($scope.search_str) {
                    $scope.search_string = $scope.search_str;
                } else {
                    $scope.search_string = "";
                }


                $scope.loading = false;
            } else {
                $scope.loading = false;
            }
        }, function errorCallback(response) {
        });
    };

    $scope.ListOfNews($scope.curent_page, $scope.curent_limit);

    $scope.NewsData = {};
    $scope.NewsData.status = "published";
    $scope.processing = false;
    $scope.AddNews = function (form, tabNum) {
        if (form.validate()) {
            $scope.NewsData.apiId = apiKey;
            $scope.NewsData.id = 1;
            $scope.NewsData.from_app = 'true';
            $scope.loading = true;
            var formData = new FormData();

            angular.forEach($scope.NewsData, function (value, key) {
                if (key == "images") {
                    angular.forEach($scope.NewsData.images, function(value_, key_) {
                        formData.append("images["+key_+"]", value_);
                    });
                } else if (key == "old_images") {
                    formData.append("old_images", JSON.stringify($scope.NewsData.old_images));
                } else {
                    formData.append(key, value);
                }
            });


            $scope.processing = true;
            $http({
                method: 'POST',
                url: apiUrl + 'post_news',
                data: formData,
                headers: {'Content-Type': undefined}
            }).then(function successCallback(response) {
                response = response.data;
                if (response.success == 1) {
                    $scope.tab = 1;
                    $scope.ListOfNews($scope.curent_page - 1, $scope.curent_limit);
                    $scope.NewsData.message = response.message;
                    $scope.loading = false;
                    $scope.processing = false;
                }else {
                    $scope.NewsData.message = response.message;
                    $scope.loading = false;
                    $scope.processing = false;
                }
            }, function errorCallback(response) {
            });
        }
    }


    $scope.EditNews = function (news) {
        $scope.tab = 2;
        $http({
            method: 'POST',
            url: apiUrl + 'getnewsDetails',
            data: {
                news_id: news.id,
                apiId: apiKey
            }
        }).then(function successCallback(response) {
            response = response.data;
            if (response.success == 1) {
                $scope.NewsData.news_id = response.news.id;
                $scope.NewsData.title = response.news.title;
                $scope.NewsData.short_description = response.news.short_description;
                $scope.NewsData.long_description = response.news.long_description;
                $scope.NewsData.old_images = response.news.images;
                $scope.NewsData.status = response.news.status;
                $scope.NewsData.images = [];
                $scope.NewsData.flag = "edit";
            } else {
                $(".waiting_loader").fadeOut();
            }
        });
    };

    $scope.changeHeight = function () {
        $timeout(function () {
            var w = $(".rfDiv").height();
            $(".lfDiv").css("height", w+"px");
        });
    }
    $scope.changeHeight();


    $scope.NewsData.images = [];
    $scope.NewsData.old_images = [];
    $scope.appendImages = function (files) {
        angular.forEach(files, function (file) {
            $scope.NewsData.images.push(file);
        });
    }


    $scope.RemoveNews = function (id) {
        swal({
            text: "Do you want to move this news to trash ?",
            type: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#25476A',
            confirmButtonColor: '#91a13c',
            confirmButtonText: 'Yes'
        }).then(function () {
        $http({
              method: 'POST',
              url: apiUrl + 'removenews',
              data: {
                  id: $rootScope.$storage.cgu_id,
                  apiId: apiKey,
                  news_id: id
              }
          }).then(function successCallback(response) {
              response = response.data;
              if (response.success == 1) {
                    $scope.ListOfNews($scope.curent_page - 1, $scope.curent_limit);
              }
          });
        });
    }


    

     $scope.manageNews = function (status) {
        if ($scope.check_records.ids.length > 0) {
            if (status == "Publish") {
                var text = "Do you want to publish news ?"
            } else if (status == "Draft") {
                var text = "Do you want to save news as draft ?"
            } else if (status == "Trash") {
                var text = "Do you want to move news to trash ?"
            } else if (status == "Delete") {
                var text = "Do you want to delete news permanently ?"
            }


            swal({
                text: text,
                type: 'warning',
                showCancelButton: true,
                cancelButtonColor: '#25476A',
                confirmButtonColor: '#91a13c',
                confirmButtonText: 'Yes'
            }).then(function () {
                $http({
                  method: 'POST',
                  url: apiUrl + 'manageNews',
                  data: {
                      id: $rootScope.$storage.cgu_id,
                      apiId: apiKey,
                      news_id: $scope.check_records.ids.join(","),
                      status: status
                  }
              }).then(function successCallback(response) {
                  response = response.data;
                  if (response.success == 1) {
                        $scope.ListOfNews($scope.curent_page - 1, $scope.curent_limit);
                        $scope.check_records.ids = [];
                  } else {
                    $mdToast.show({
                        template: '<md-toast class="md-toast error">' + response.message + '</md-toast>',
                        hideDelay: 6000,
                        position: 'bottom right'
                    });
                  }
              });
            });
        } else {
            $mdToast.show({
                template: '<md-toast class="md-toast error">Please select at least one record to perform the operation.</md-toast>',
                hideDelay: 6000,
                position: 'bottom right'
            });
        }
    }

    $scope.check_records = {ids: []};
    $scope.toggleAllCheckbox = function () {
        if ($("#checkAll").is(":checked")) { 
            $scope.check_records.ids = $scope.allListOfNews.map(function (a) {
                return a.id;
            });
        } else {
            $scope.check_records.ids = [];
        }

    }

    $scope.unClickToggle = function (id) {
        var index = $scope.check_records.ids.indexOf(id);
        if (index == -1 && $("#checkAll").is(":checked")) {
            $("#checkAll").removeAttr("checked");
        }
    }
});


app.controller("userDashboardController", function ($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $mdToast, $timeout) {
    $scope.loadCounters = function () {
        $http({
            method: "POST",
            url: apiUrl + "totalCounters",
            data: {
                apiId: apiKey,
                login_user_id: $rootScope.$storage.cgu_id
            }
        }).then(function (response) {
            response = response.data;
            if (response.success == 1) {
                $scope.document_files = response.document_files;
                $scope.image_files = response.image_files;
                $scope.zip_files = response.zip_files;
                $scope.video_files = response.video_files;
                $scope.total_folders = response.total_folders;
                $scope.total_news = response.total_news;
                $scope.total_published_news = response.total_published_news;
                $scope.total_draft_news = response.total_draft_news;
                $scope.total_trash_news = response.total_trash_news;
            }
        }, function (error) {
        })
    }
    $scope.loadCounters();

});

app.controller("notificationController", function ($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $mdToast, $timeout) {
    $scope.loadingNotification = false;
    $scope.noti_post_busy = false;
    $scope.no_more_noti = false;
    $scope.notification_page = 0;
    $scope.notification_limit = 10;

    $scope.notifications = [];

    $scope.loadNotifications = function (page, limit) {
        if (!$scope.noti_post_busy && !$scope.no_more_noti && !$scope.loadingNotification) {
            $scope.loadingNotification = true;
            $scope.noti_post_busy = true;

            $http({
                method: "POST",
                url: apiUrl + "notifications",
                data: {
                    apiId: apiKey,
                    login_user_id: $rootScope.$storage.cgu_id,
                    user_id: $rootScope.$storage.cgu_id
                }
            }).then(function (response) {
                response = response.data;
                if (response.success == 1) {

                    angular.forEach(response.notifications, function (notification) {
                        $scope.notifications.push(notification);
                    });

                    if (response.notifications.length < $scope.notification_limit) {
                        $scope.no_more_noti = true;
                    }

                    console.log($scope.notifications.length);

                    $scope.notification_page = page + 1;
                    $scope.noti_post_busy = false;
                } else {
                    $scope.no_more_noti = true;
                    $scope.noti_post_busy = false;
                }
                $scope.loadingNotification = false;
            }, function (error) {
            })
        }


    }
    $scope.loadNotifications($scope.notification_page, $scope.notification_limit);
});


app.controller("fileDetailsController", function ($scope, $location,$sce, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $mdToast, $timeout) {
    $scope.loadingDetails = false;
    $scope.file_data = {};

    $scope.getVideoId = function(url) {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = url.match(regExp);

        if (match && match[2].length == 11) {
            return match[2];
        } else {
            return 'error';
        }
    }

    $scope.album = [];
    $scope.getFileDetails = function (page, limit) {
        $scope.loadingDetails = true;
        $http({
            method: "POST",
            url: apiUrl + "file_data",
            data: {
                apiId: apiKey,
                login_user_id: $rootScope.$storage.cgu_id,
                user_id: $rootScope.$storage.cgu_id,
                file_id: $routeParams.file_id
            }
        }).then(function (response) {
            response = response.data;
            if (response.success == 1) {
                $scope.file_data = response.data;
                if ($scope.file_data.file_thumb_path) {
                    $scope.album = [{
                      src: $scope.file_data.file_thumb_path,
                      thumb: $scope.file_data.file_thumb_path,
                      caption: $scope.file_data.topic
                    }];
                }

                if (($scope.file_data.post_type == "video" || $scope.file_data.post_type == "resource_center" || $scope.file_data.post_type == "campaign") && $scope.file_data.link) {
                    var videoId = $scope.getVideoId($scope.file_data.link);
                    $scope.file_data.video_thumb = "https://img.youtube.com/vi/"+videoId+"/hqdefault.jpg";
                    $scope.file_data.embed_link = $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + videoId);
                }
            }
            $scope.loadingDetails = false;
        }, function (error) {
        })

    }
    $scope.getFileDetails();
});