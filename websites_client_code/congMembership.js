app = angular.module("INCDTDC", ['ngRoute','base64', 'ngStorage', 'angular-md5', 'ngValidate', 'socialbase.sweetAlert', 'angularjs-dropdown-multiselect', 'ngSanitize', 'ui.bootstrap','ngFileUpload','bw.paging','checklist-model','daterangepicker','ngMaterial']);
app.$inject = ['SweetAlert'];
/*var rootUrl = 'http://demo3.coronation.in/aicc/';
var apiUrl  = 'http://demo3.coronation.in/aicc/api/services/';*/
// var rootUrl = 'http://192.168.50.66/incdtdc/beta/';
// var apiUrl  = 'http://192.168.50.66/incdtdc/api/services_beta/';

// var rootUrl = 'http://localhost/incdtdc/beta/';
// var apiUrl  = 'http://localhost/incdtdc/api/services_beta/';	

var rootUrl = 'https://www.congressmembership.com/';
var apiUrl  = 'https://www.congressmembership.com/api_beta/services_beta/';
// var rootUrl = 'http://192.168.50.66/incdtdc/';
// var apiUrl  = 'http://192.168.50.66/incdtdc/api/services/';
app.config(['$locationProvider', '$routeProvider', '$validatorProvider',
function($locationProvider, $routeProvider, $validatorProvider) {
	/** Adding validation method for password **/
	$validatorProvider.addMethod("pwcheck", function(value, element, param) {
		return (/[A-Z]/.test(value) && /\d/.test(value) && /[$@$!%*#?&]/.test(value));
	}, 'Password must contain 1 special character, 1 Capital letter and 1 Digit!');
	$validatorProvider.addMethod("pwcheck", function(value, element) {
		param = typeof param === "string" ? param.replace(/,/g, '|') : "png|jpe?g|gif";
		return this.optional(element) || value.match(new RegExp(".(" + param + ")$", "i"));
	}, 'Please enter a value with a valid extension!');
	/** Adding validation method for letters only **/
	$validatorProvider.addMethod("lettersonly", function(value, element) {
		return this.optional(element) || /^[a-z]+$/i.test(value);
	}, "Special characters and numbers are not allowed!");
	/** Adding validation method for letters only **/
	$validatorProvider.addMethod("alphaonly", function(value, element) {
		return this.optional(element) || /^[a-zA-Z\s]+$/i.test(value);
	}, "Special characters and numbers are not allowed!");
	$locationProvider.hashPrefix('');
	$validatorProvider.addMethod("pwcheck", function(value, element) {
		/*return this.optional(element) || /^http:\/\/mydomain.com/.test(value);*/
		return (/[A-Z]/.test(value) && /\d/.test(value) && /[$@$!%*#?&]/.test(value));
		// has a digit
	}, "Password must contain 1 special character, 1 Capital letter and 1 Digit!");
	$validatorProvider.addMethod('notEqualTo', function(value, element, param) {
		var target = $(param);
		if (this.settings.onfocusout && target.not(".validate-equalTo-blur").length) {
			target.addClass("validate-equalTo-blur").on("blur.validate-equalTo", function() {
				$(element).valid();
			});
		}
		return value !== target.val();
	}, 'Please enter other string, string should be diffrent.');
	$validatorProvider.addMethod('validate_name', function(value, element) {
		/*return this.optional(element) || /^http:\/\/mydomain.com/.test(value);*/
		return (/^[A-Za-z]?[A-Za-z ]*$/.test(value));
		// has a digit
	}, 'Please enter valid name.');
	$validatorProvider.addMethod('floating_val', function(value, element) {
		/*return this.optional(element) || /^http:\/\/mydomain.com/.test(value);*/
		return (/^\d{1,5}([\.](\d{1,4})?)?$/.test(value));
		// has a digit
	}, 'Please enter valid value.');
	/*$validatorProvider.addMethod('email', function(value, element) {
		return (/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(value));
	}, 'Please enter valid email.');*/
	$routeProvider.when("/", {
		templateUrl : "templates/dashboard.html?v=0.0.13",
		controller : "dashboardController",
		title : "Dashboard"
	})
	$routeProvider.when("/dashboard/:user_id", {
		templateUrl : "templates/dashboard.html?v=0.0.13",
		controller : "dashboardController",
		title : "Dashboard"
	})
	$routeProvider.when("/login", {
		templateUrl : "templates/login.html?v=0.0.13",
		controller : "loginController",
		title : "Login"
	})
	$routeProvider.when("/manage_departments/:incharge_type_id", {
		templateUrl : "templates/workers/departments.html?v=0.0.13",
		controller : "departmentsController",
		title : "INCDTDC"
	})
	$routeProvider.when("/landing/:incharge_type_id", {
		templateUrl : "templates/workers/landing.html?v=0.0.13",
		controller : "landingController",
		title : "INCDTDC"
	})
	$routeProvider.when("/manage_users/:department_id/:incharge_type_id/", {
		templateUrl : "templates/workers/list.html?v=0.0.13",
		controller : "usersController",
		title : "INCDTDC"
	})
	$routeProvider.when("/manage_users/:department_id/:incharge_type_id/:parent_id", {
		templateUrl : "templates/workers/list.html?v=0.0.13",
		controller : "usersController",
		title : "INCDTDC"
	})
	$routeProvider.when("/manage_users/:department_id/:incharge_type_id/:parent_id/:all_data", {
		templateUrl : "templates/workers/list.html?v=0.0.13",
		controller : "usersController",
		title : "INCDTDC"
	})
	$routeProvider.when("/pendingApplications", {
		templateUrl : "templates/workers/pending_list.html?v=0.0.13",
		controller : "pendingUsersController",
		title : "INCDTDC"
	})
	$routeProvider.when("/pendingUpdates", {
		templateUrl : "templates/workers/pending_updates_list.html?v=0.0.13",
		controller : "pendingUpdatesController",
		title : "INCDTDC"
	})
	$routeProvider.when("/user_form/:incharge_type_id", {
		templateUrl : "templates/workers/form.html?v=0.0.13",
		controller : "formController",
		title : "INCDTDC"
	})
	$routeProvider.when("/GPCCEnroller", {
		templateUrl : "templates/workers/form_pending.html?v=0.0.13",
		controller : "gpccEnrollerController",
		title : "INCDTDC"
	})
	$routeProvider.when("/upload_form/:incharge_type_id", {
		templateUrl : "templates/workers/upload.html?v=0.0.13",
		controller : "uploadController",
		title : "INCDTDC"
	})
	$routeProvider.when("/user_form/update/:user_id/:incharge_type_id", {
		templateUrl : "templates/workers/form.html?v=0.0.13",
		controller : "formController",
		title : "INCDTDC"
	})

	$routeProvider.when("/user_form/review/:user_id/:incharge_type_id", {
		templateUrl : "templates/workers/form.html?v=0.0.13",
		controller : "formReviewController",
		title : "INCDTDC"
	})



	/** Volunteers Start **/

	$routeProvider.when("/volunteers/import", {
		templateUrl : "templates/volunteers/upload.html?v=0.0.13",
		controller : "uploadVolunteersController",
		title : "INCDTDC"
	})
	$routeProvider.when("/volunteer/update/:volunteers_id/", {
		templateUrl : "templates/volunteers/form.html?v=0.0.13",
		controller : "volunteersFormController",
		title : "INCDTDC"
	})
	$routeProvider.when("/volunteer/create", {
		templateUrl : "templates/volunteers/form.html?v=0.0.13",
		controller : "volunteersFormController",
		title : "INCDTDC"
	})
	$routeProvider.when("/volunteers/", {
		templateUrl : "templates/volunteers/list.html?v=0.0.13",
		controller : "volunteersController",
		title : "INCDTDC"
	})

	/** Volunteers End **/


	$routeProvider.when("/reports/all_district", {
		templateUrl : "templates/reports/all_district.html?v=0.0.13",
		controller : "allDistrictReportController",
		title : "INCDTDC"
	})
	$routeProvider.when("/reports/all_corporation", {
		templateUrl : "templates/reports/all_district.html?v=0.0.13",
		controller : "allCorporationReportController",
		title : "INCDTDC"
	})
	$routeProvider.when("/reports/all_district/details/:row_id/:column_id", {
		templateUrl : "templates/reports/all_district_details.html?v=0.0.13",
		controller : "allDistrictDetailsReportController",
		title : "INCDTDC"
	})

	$routeProvider.when("/reports/district/filled_seats/:row_id/:column_id", {
		templateUrl : "templates/reports/district_filled_seats.html?v=0.0.13",
		controller : "allDistrictFilledReportController",
		title : "INCDTDC"
	})

	$routeProvider.when("/reports/district/filled_seats/:row_id/:column_id/:type", {
		templateUrl : "templates/reports/district_filled_seats.html?v=0.0.13",
		controller : "allDistrictFilledReportController",
		title : "INCDTDC"
	})

	$routeProvider.when("/reports/district/total_seats/:row_id/:column_id", {
		templateUrl : "templates/reports/district_filled_seats.html?v=0.0.13",
		controller : "allDistrictTotalReportController",
		title : "INCDTDC"
	})

	$routeProvider.when("/reports/district/total_seats/:row_id/:column_id/:type", {
		templateUrl : "templates/reports/district_filled_seats.html?v=0.0.13",
		controller : "allDistrictTotalReportController",
		title : "INCDTDC"
	})

	$routeProvider.when("/reports/district_wise/seats/:row_id/:column_id/:type", {
		templateUrl : "templates/reports/district_wise_report_detail.html?v=0.0.13",
		controller : "allDistrictTotalReportController",
		title : "INCDTDC"
	})

	$routeProvider.when("/reports/corporation/filled_seats/:row_id/:column_id", {
		templateUrl : "templates/reports/district_filled_seats.html?v=0.0.13",
		controller : "allCorporationFilledReportController",
		title : "INCDTDC"
	})

	$routeProvider.when("/reports/corporation/total_seats/:row_id/:column_id", {
		templateUrl : "templates/reports/district_filled_seats.html?v=0.0.13",
		controller : "allCorporationTotalReportController",
		title : "INCDTDC"
	})

	$routeProvider.when("/reports/all_corporation/details/:row_id/:column_id", {
		templateUrl : "templates/reports/all_district_details.html?v=0.0.13",
		controller : "allCorporationDetailsReportController",
		title : "INCDTDC"
	})
	$routeProvider.when("/reports/district_wise_report", {
		templateUrl : "templates/reports/district_wise_report.html?v=0.0.13",
		controller : "districtWiseReportController",
		title : "INCDTDC"
	})

	$routeProvider.when("/MigrantLabourHelpline", {
		templateUrl : "templates/workers/helpline_form.html?v=0.0.13",
		controller : "migrantLabourHelplineController",
		title : "INCDTDC"
	})

	.otherwise({
		redirectTo : "/"
	});
	$locationProvider.html5Mode(true);
}]);
app.run(function($route, $rootScope, $location, $localStorage, $http, $window, $routeParams) {
	$rootScope.$on('$routeChangeStart', function(evt, current, previous) {
		$rootScope.isDesktopView = false;
		var path = $location.path();
		$rootScope.activePath = $location.path();
	});
	var original = $location.path;
    $location.path = function (path, reload) {
        if (reload === false) {
            var lastRoute = $route.current;
            var un = $rootScope.$on('$locationChangeSuccess', function () {
                $route.current = lastRoute;
                un();
            });
        }
        return original.apply($location, [path]);
    };
});
app.directive('ngFile', ['$parse',
function($parse) {
	return {
		restrict : 'A',
		link : function(scope, element, attrs) {
			element.bind('change', function() {
				$parse(attrs.ngFile).assign(scope, element[0].files)
				scope.$apply();
			});
		}
	};
}]);
app.directive('capitalize', function() {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
          if (inputValue == undefined) inputValue = '';
          var capitalized = inputValue.toUpperCase();
          if (capitalized !== inputValue) {
            // see where the cursor is before the update so that we can set it back
            var selection = element[0].selectionStart;
            modelCtrl.$setViewValue(capitalized);
            modelCtrl.$render();
            // set back the cursor after rendering
            element[0].selectionStart = selection;
            element[0].selectionEnd = selection;
          }
          return capitalized;
        }
        modelCtrl.$parsers.push(capitalize);
        capitalize(scope[attrs.ngModel]); // capitalize initial value
      }
    };
  });
app.filter('strReplace', function () {
  return function (input, from, to) {
    input = input || '';
    from = from || '';
    to = to || '';
    return input.trim().replace(new RegExp(from, 'g'), to);
  };
});
app.directive('stringToNumber', function() {
	return {
		require : 'ngModel',
		link : function(scope, element, attrs, ngModel) {
			ngModel.$parsers.push(function(value) {
				return '' + value;
			});
			ngModel.$formatters.push(function(value) {
				return parseFloat(value);
			});
		}
	};
});
app.filter('groupBy', function() {
	return _.memoize(function(items, field) {
		return _.groupBy(items, field);
	});
});
app.filter("trustUrl", ['$sce',
function($sce) {
	return function(recordingUrl) {
		return $sce.trustAsResourceUrl(recordingUrl);
	};
}]);
app.filter('sanitizer', ['$sce',
function($sce) {
	return function(url) {
		return $sce.trustAsHtml(url);
	};
}]);
app.controller("MainController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {
	$rootScope.rootUrl = rootUrl;
	$rootScope.apiUrl = apiUrl;
	$rootScope.$storage = $localStorage.$default({
		inc_user_id : null,
		inc_userObj : null,
	});
	$rootScope.toBase64 = function(string) {
        return $base64.encode(unescape(encodeURIComponent(string)));
	}
	$rootScope.fromBase64 = function(string) {
		return decodeURIComponent(escape($base64.decode(string)));
	}
	$rootScope.isBase64 = function(str) {
		/*return decodeURIComponent(escape($base64.decode(string)));*/
		try {
	        return btoa(atob(str)) == str;
	    } catch (err) {
	        return false;
	    }
	}

	$scope.isMenuHidden = false;

	$rootScope.hideMenu = function(){
		$scope.isMenuHidden = true;
	}

	$rootScope.showMenu = function(){
		$scope.isMenuHidden = false;
	}

	if (!$rootScope.$storage.inc_user_id) {
		if($location.path().indexOf("GPCCEnroller") > 0 || $location.path().indexOf("MigrantLabourHelpline") > 0){
		}
		else{
			$location.path('/login');
		}
	}
	$scope.signOut = function(){
		$rootScope.$storage.inc_user_id = null;
		$rootScope.$storage.inc_userObj = {};
		$location.path("/login")
	}
	$scope.navigation = [];
	var api = "hierarchy/hierarchy_list";
	$rootScope.loadNavigation = function(){
		$scope.navigation = [];
		if($rootScope.$storage.inc_userObj && $rootScope.$storage.inc_userObj.state_id){
			api = "hierarchy/navigation";
		}
		$http({
	      method: 'POST',
	      url: apiUrl + api,
	      data : {
	      	user_id : $rootScope.$storage.inc_userObj.user_id,
	      	state_id : $rootScope.$storage.inc_userObj.state_id,
	      	incharge_type_id : $rootScope.$storage.inc_userObj.incharge_type_id
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.navigation = response.hierarchies;
	        }
	    }, function errorCallback(response) {
	    });
	}
	if($rootScope.$storage.inc_user_id){
		$rootScope.loadNavigation();
	}
});


app.controller("volunteersController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {

	if (!$rootScope.$storage.inc_user_id) {
		$location.path('/');
	}	

	$scope.volunteers = [];

	$scope.limit = 30;
	$scope.page = 1;
	$scope.totalRecords = 0;

	$scope.isLoading = false;

	$scope.loadUsers = function(page){
		$scope.users = [];
		$scope.isLoading = true;
		$http({
	      method: 'POST',
	      url: apiUrl + 'volunteers/list',
	      data : {
	      	 limit : $scope.limit,
			 page : page,
			 search : $scope.search
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.users = response.users;
	        	$scope.totalRecords = response.total;
	        }
	        else{
	        	$scope.users = [];
	        	$scope.totalRecords = 0;
	        }
	        $scope.isLoading = false;
	    }, function errorCallback(response) {
	    });
	}

	$scope.loadUsers($scope.page);

	$scope.removeVolunteer = function(volunteers_id){
		var conf = confirm("Are you sure?");
		if(conf){
			$http({
		      method: 'POST',
		      url: apiUrl + 'volunteers/delete',
		      data : {
				 volunteers_id : volunteers_id
		      }
		    }).then(function successCallback(response) {
		        response = response.data;
		        if(response.success == 1){		
		        	$scope.loadUsers($scope.page);
		        }
		    }, function errorCallback(response) {
		    });
		}
	}

});

app.controller("volunteersFormController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {

	if (!$rootScope.$storage.inc_user_id) {
		$location.path('/');
	}

	$scope.volunteerObj = {};



	$scope.states = [];
	$scope.districts = [];
	$scope.assemblies = [];

	$scope.loadStates = function(){
		$http({
	      method: 'POST',
	      url: apiUrl + "volunteers_states",
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
	
	$scope.loadStates();

	$scope.loadDistricts = function(state_id){
		if(state_id){
			$http({
		      method: 'POST',
		      url: apiUrl + "volunteers_districts",
		      data: {
		      	state_id : state_id
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
		else{
			$scope.districts = [];
		}
	}

	$scope.loadAssemblies = function(district_id){
		if(district_id){
			$http({
		      method: 'POST',
		      url: apiUrl + "volunteers_assemblies",
		      data: {
		      	district_id : district_id
		      }
		    }).then(function successCallback(response) {
		        response = response.data;
		        if(response.success == 1){		
		        	$scope.assemblies = response.assemblies;
		        }
		        else{
		        	$scope.assemblies = [];
		        }
		    }, function errorCallback(response) {
		    });
		}
		else{
			$scope.assemblies = [];
		}
	}


	$scope.loadVolunteerDetails = function(volunteers_id){
		if(volunteers_id){
			$http({
		      method: 'POST',
		      url: apiUrl + 'volunteers/details',
		      data : {
		      	volunteers_id : volunteers_id
		      }
		    }).then(function successCallback(response) {
		        response = response.data;
		        if(response.success == 1){		
		        	$scope.volunteerObj = response.volunteer;
		        	if($scope.volunteerObj.state_id){
		        		$scope.loadDistricts($scope.volunteerObj.state_id);
		        	}
		        	if($scope.volunteerObj.district_id){
		        		$scope.loadAssemblies($scope.volunteerObj.district_id);
		        	}
		        }
		        else{
		        	$scope.volunteerObj = {};
		        }  
		    }, function errorCallback(response) {
		    });
		}	
	}

	if($routeParams.volunteers_id){
		$scope.loadVolunteerDetails($rootScope.fromBase64($routeParams.volunteers_id));
	}


	$scope.isSaving = false;
	$scope.saveText = "Save";

	$rootScope.saveVolunteer = function(form){	
		$scope.message = "";
		if(form.validate()){
			$scope.isSaving = true;
			$scope.saveText = "Saving...";
			$http({
		      method: 'POST',
		      url: apiUrl + 'volunteers/save',
		      data : $scope.volunteerObj
		    }).then(function successCallback(response) {
		        response = response.data;
		        $scope.isSaving = false;
		        $scope.saveText = "Save";
		        if(response.success == 1){		
		        	//$route.reload();
		        	// $scope.volunteerObj = {};
		        	// $scope.districts = [];
		        	// $scope.assemblies = [];
		        	// $scope.message = "Thank you for submitting your details.";
		        	$location.path('/volunteers/');
		        	$mdToast.show({
						template : '<md-toast class="md-toast error">'+response.message+'</md-toast>',
						hideDelay : 2000,
						position : 'bottom right'
					}); 
		        }
		        else{
		        	$mdToast.show({
						template : '<md-toast class="md-toast error">'+response.message+'</md-toast>',
						hideDelay : 2000,
						position : 'bottom right'
					}); 
		        }  
		    }, function errorCallback(response) {
		    });
		}
	}


})


app.controller("uploadVolunteersController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {

	if (!$rootScope.$storage.inc_user_id) {
		$location.path('/');
	}

	$scope.volunteerObj = {};

	$scope.states = [];

	$scope.loadStates = function(){
		$http({
	      method: 'POST',
	      url: apiUrl + "volunteers_states",
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
	
	$scope.loadStates();

	
	$scope.isSaving = false;
	$scope.saveText = "Save";

	$scope.volunteerObj = {};

	$rootScope.submitWorker = function(form){	
		$scope.message = "";
		if(form.validate()){
			$scope.isSaving = true;
			$scope.saveText = "Saving...";

			var formData = new FormData();

			angular.forEach($scope.volunteerObj, function(value, key){
	        	if(key == "meta"){
	        		formData.append(key, JSON.stringify(value));
	        	}
	        	else{
	        		formData.append(key, value);
	        	}
	        })
	        formData.append("noJson", "true");
	        
			$http({
		      method: 'POST',
		      url: apiUrl + 'volunteers/import',
		      data : formData,
		      headers: {'Content-Type': undefined}
		    }).then(function successCallback(response) {
		        response = response.data;
		        $scope.isSaving = false;
		        $scope.saveText = "Save";
		        if(response.success == 1){		
		        	//$route.reload();
		        	// $scope.volunteerObj = {};
		        	// $scope.districts = [];
		        	// $scope.assemblies = [];
		        	// $scope.message = "Thank you for submitting your details.";
		        	$location.path('/volunteers/');
		        	$mdToast.show({
						template : '<md-toast class="md-toast error">'+response.message+'</md-toast>',
						hideDelay : 2000,
						position : 'bottom right'
					}); 
		        }
		        else{
		        	$mdToast.show({
						template : '<md-toast class="md-toast error">'+response.message+'</md-toast>',
						hideDelay : 2000,
						position : 'bottom right'
					}); 
		        }  
		    }, function errorCallback(response) {
		    });
		}
	}


})



app.controller("dashboardController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {
	if (!$rootScope.$storage.inc_user_id) {
		$location.path('/');
	}	
	$scope.dashboard = [];
	$rootScope.meta = [];
	var keepGoing = true;
	$scope.inchargeObj = {};
	$scope.inchargeObj.meta = [];
	$scope.disabledMeta = [];
	$rootScope.loadDataFilter = function(parent_id, index){	
		keepGoing = true;
		// $scope.inchargeObj.meta = {};
		if($scope.meta.length > 0){
			$scope.meta.splice(index+1);
			$scope.inchargeObj.meta.splice(index+1);
			// console.log($scope.meta, "meta");
			//$scope.inchargeObj.meta.splice(index);	
		}
		if(parent_id != "" || $rootScope.meta.length == 0){
			$http({
		      method: 'POST',
		      url: apiUrl + 'data/data_list',
		      data : {
		      	 parent_id : parent_id,
		      	 incharge_type_id : $scope.incharge_type_id,
		      	 created_by : $rootScope.$storage.inc_userObj.user_id
		      }
		    }).then(function successCallback(response) {
		        response = response.data;
		        if(response.success == 1){		
		        	if(response.hierarchy){
			        	var dataObj = {
			        		meta_id : response.hierarchy.hierarchy_id,
			        		meta_english : response.hierarchy.hierarchy_label,
			        		meta_hindi : response.hierarchy.hierarchy_hindi,
			        		meta_gujarati : response.hierarchy.hierarchy_gujarati,
			        		meta_list : response.data,
			        		//meta_english : response.hierarchy.hierarchy_label
			        	}	
		        		$scope.meta.push(dataObj);
		        	}
		        }
		    }, function errorCallback(response) {
		    });
		}
	}
	//$rootScope.loadDataFilter();
	var MetaObj = $rootScope.$storage.inc_userObj.meta;
	if(MetaObj){
		var MetaObjKeys = Object.keys(MetaObj);
		if(MetaObjKeys.length > 0){
			var lastKey = MetaObjKeys[MetaObjKeys.length - 1];
			var parent_id = MetaObj[lastKey];
			$rootScope.loadDataFilter(parent_id);
			// $rootScope.loadDataFilter(parent_id);
		}	
		else{
			$rootScope.loadDataFilter();
			// $rootScope.loadDataFilter($rootScope.fromBase64($scope.parent_id));
		}
	}
	else{
		$rootScope.loadDataFilter();
	}
	$scope.filterArray = [];
	$scope.allAtotal = 0; 
	$scope.allAtotalEnrolled = 0;
	$scope.loadCounters = function(form){
		$scope.allAtotal = 0; 
		$scope.allAtotalEnrolled = 0;
		$scope.dashboard = [];
		var user_id = $rootScope.$storage.inc_userObj.user_id;
		if($routeParams.user_id){
			user_id = $rootScope.fromBase64($routeParams.user_id);
		}

		$scope.filterArray.push($rootScope.$storage.inc_userObj.state_id);

		$http({
	      method: 'POST',
	      url: apiUrl + "getDashboardCounts",
	      data : {
	      	user_id : user_id,
	      	filters : $scope.filterArray.join(",")
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){
	        	$scope.totalActiveMembers = 0;
	        	$scope.totalActiveEntrolled = 0;

	        	$scope.dashboard = response.hierarchies;
	        	var groupCounter = 0;
	        	angular.forEach($scope.dashboard, function(value, key){
	        		$scope.allAtotal += Number(value.total);
	        		$scope.allAtotalEnrolled += Number(value.total_enrolled);
	        		console.log(key%3, "modulo");
	        		if(key%3 == 0){
	        			groupCounter++;
	        		}
	        		value.groupCounter = groupCounter;
	        		value.opacity = "opacity"+groupCounter;
	        	});

	        	$scope.totalActiveMembers = response.enrolled_counter.enrolled_members ? response.enrolled_counter.enrolled_members : 0;
	        	$scope.totalActiveEntrolled = response.enrolled_counter.total_enrolled ? response.enrolled_counter.total_enrolled : 0;
	        	$scope.totalRegisteredMembers = response.enrolled_counter.total_members ? response.enrolled_counter.total_members : 0;
	        	$scope.totalMembership = parseInt($scope.totalRegisteredMembers)+parseInt($scope.allAtotalEnrolled);
	        	console.log($scope.dashboard);
	        }
	    }, function errorCallback(response) {
	    });
	}
	$rootScope.setFiler = function(meta){
		$scope.filterArray = [];
		$scope.tempArray = [];
		angular.forEach($scope.inchargeObj.meta, function(value, key){
			angular.forEach($scope.meta, function(v1, k1){
				angular.forEach(v1.meta_list, function(v2, k2){
					if(v2.data_id == value){
						$scope.tempArray.push(v1.meta_english.toLowerCase());
					}
				})
			})
			$scope.filterArray.push(value);
		})
		$scope.loadCounters();
	}
	$scope.loadCounters();
})
app.controller("loginController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {
	if ($rootScope.$storage.inc_user_id) {
		$location.path('/');
	}
	$scope.saveText = "Login";
	$scope.saving = false;
	$scope.userObj = {};
	$scope.userObj.email = "";
	$scope.userObj.password = "";
	$scope.submitLogin = function(form){
		if($scope.saving == false){
			$scope.saving = true;
			$scope.saveText = "Logging In.....";
			if(form.validate()){
				$http({
			      method: 'POST',
			      url: apiUrl + 'sign_in',
			      data : $scope.userObj
			    }).then(function successCallback(response) {
			        response = response.data;
			        if(response.success == 1){		
			        	$rootScope.$storage.inc_user_id = response.user.user_id;
			        	$rootScope.$storage.inc_userObj = response.user;
			    //     	angular.forEach(response.user.meta, function(value, key){
			    //     		key = key.replace("_k", "");
							// $rootScope.$storage.inc_userObj.meta[key] = value;
			    //     	})	
			    //     	return false;
		    			$rootScope.loadNavigation();
		        		$location.path("/");
			        }
			        else{
			        	$scope.saveText = "Login";
				        $mdToast.show({
							template : '<md-toast class="md-toast error">'+response.message+'</md-toast>',
							hideDelay : 2000,
							position : 'bottom right'
						});   
			        }
			        $scope.saving = false;			        
			    }, function errorCallback(response) {
			    	$scope.saving = false;
			    });
			}	
		}
	}
})
app.controller("landingController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {
	if (!$rootScope.$storage.inc_user_id) {
		$location.path('/login');
	}

	if($rootScope.$storage.inc_userObj.incharge_type_id == 2500){
		$location.path("/dashboard");
	}
	$scope.incharge_type_id = $rootScope.fromBase64($routeParams.incharge_type_id);
	$scope.landingData = {};
	$scope.getInchargeTypeDetails = function(){
		$http({
	      method: 'POST',
	      url: apiUrl + 'incharge_types/details',
	      data : {
	      	 incharge_type_id : $scope.incharge_type_id
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.landingData = response.incharge_type;
	        	//$scope.hierarchyObj = response.hierarchy;
	        }
	        else{
	        	$scope.landingData = {};
	        }
	    }, function errorCallback(response) {
	    });
	}
	$scope.getInchargeTypeDetails();
})
app.controller("departmentsController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {
	if (!$rootScope.$storage.inc_user_id) {
		$location.path('/login');
	}

	if($rootScope.$storage.inc_userObj.incharge_type_id == 2500){
		$location.path("/dashboard");
	}
	$scope.incharge_type_id = $rootScope.fromBase64($routeParams.incharge_type_id);
	$scope.departments = [];
	$scope.allDepartmentsTotal = "";
	$rootScope.loadDepartments = function(){	
		$http({
	      method: 'POST',
	      url: apiUrl + 'get_incharge_departments',
	      data : {
	      	incharge_type_id : $scope.incharge_type_id,
	      	created_by : $rootScope.$storage.inc_user_id
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        $scope.allDepartmentsTotal = 0;
	        if(response.success == 1){		
	        	$scope.departments = response.departments;
	        	angular.forEach($scope.departments, function(value, key){
	        		$scope.allDepartmentsTotal += parseInt(value.total)
	        	})
	        }
	        else{
	        	$scope.departments = [];	
	        }
	    }, function errorCallback(response) {
	    });
	}	
	$rootScope.loadDepartments();
});
app.controller("pendingUsersController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {
	if (!$rootScope.$storage.inc_user_id) {
		$location.path('/login');
	}

	if($rootScope.$storage.inc_userObj.incharge_type_id == 2500){
		$location.path("/dashboard");
	}
	$scope.department_id = "all";	
	$scope.parent_id = "";	
	$scope.isSending = true;
	// $scope.sendSms = function(mobile, password, email, worker){
	// 	var message = "Hi, "+worker+", Please login to http://incdtdc.in/ with mobile : "+mobile+" and password :"+password;
	// 	$scope.isSending = true;
	// 	$http({
	// 		method : 'POST',
	// 		url : apiUrl + 'sendSMS',
	// 		data : {
	// 			mobile : mobile,
	// 			message : message
	// 		}
	// 	}).then(function successCallback(response) {
	// 		$mdToast.show({
	// 			template : '<md-toast class="md-toast error">Details has been sent to '+mobile+'!</md-toast>',
	// 			hideDelay : 2000,
	// 			position : 'bottom right'
	// 		});	
	// 		$scope.isSending = false;	
	// 	}, function errorCallback(response) {
	// 		$scope.isSending = false;
	// 	});
	// }
	$scope.hierarchyObj = {};
	$scope.users = [];
	$scope.columns = [];	
	$scope.limit = 30;
	$scope.page = 1;
	$scope.loadUsers = function(page, parent_id){
		$scope.users = [];
		$http({
	      method: 'POST',
	      url: apiUrl + 'users/pending_user_list',
	      data : {
	      	 limit : $scope.limit,
			 page : page,
			 department_id : 1
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.users = response.users;
	        	$scope.columns = response.columns;
	        	$scope.totalRecords = response.total;
	        }
	        else{
	        	$scope.users = [];
	        }
	    }, function errorCallback(response) {
	    });
	}
	$scope.approve = function(user_id){
		console.log("here");
		var conf = confirm("Are you sure?");
		if(conf){
			$http({
		      method: 'POST',
			  url: apiUrl + 'users/approve',
			  data : {
			  	user_id : user_id
			  }
		    }).then(function successCallback(response) {
		        response = response.data;
		        if(response.success == 1){		
		        	$scope.loadUsers($scope.page, $scope.limit);
		        }
		        else{
		        	$mdToast.show({
						template : '<md-toast class="md-toast error">'+response.message+'</md-toast>',
						hideDelay : 2000,
						position : 'bottom right'
					}); 
		        }  
		    }, function errorCallback(response) {
		    });
		}
	}
	$scope.loadUsers($scope.page, $scope.limit);
})


app.controller("pendingUpdatesController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {
	if (!$rootScope.$storage.inc_user_id) {
		$location.path('/login');
	}

	if($rootScope.$storage.inc_userObj.incharge_type_id == 2500){
		$location.path("/dashboard");
	}
	$scope.department_id = "all";	
	$scope.parent_id = "";	
	$scope.isSending = true;
	
	$scope.hierarchyObj = {};
	$scope.users = [];
	$scope.columns = [];	
	$scope.limit = 30;
	$scope.page = 1;

	$scope.isLoadingUsers = false;

	$scope.loadUsers = function(page, parent_id){
		$scope.isLoadingUsers = true;
		$scope.users = [];
		$http({
	      method: 'POST',
	      url: apiUrl + 'users/list_pending_application',
	      data : {
	      	 limit : $scope.limit,
			 page : page,
			 department_id : 1
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.users = response.users;
	        	$scope.columns = response.columns;
	        	$scope.totalRecords = response.total;
	        }
	        else{
	        	$scope.users = [];
	        }
	        $scope.isLoadingUsers = false;
	    }, function errorCallback(response) {
	    });
	}


	$scope.decline = function(user_id){

		var conf = confirm("Are you sure?");
		if(conf){
			$http({
		      method: 'POST',
			  url: apiUrl + 'users/decline_update_user',
			  data : {
			  	user_id : user_id
			  }
		    }).then(function successCallback(response) {
		        response = response.data;
		        if(response.success == 1){		
		        	$scope.loadUsers($scope.page, $scope.limit);
		        } else {
		        	$mdToast.show({
						template : '<md-toast class="md-toast error">'+response.message+'</md-toast>',
						hideDelay : 2000,
						position : 'bottom right'
					}); 
		        }  
		    }, function errorCallback(response) {
		    });
		}	

	}


	$scope.approve = function(application_id){
		var conf = confirm("Are you sure?");
		if(conf){
			$http({
		      method: 'POST',
			  url: apiUrl + 'users/approve_update_user',
			  data : {
			  	application_id : application_id
			  }
		    }).then(function successCallback(response) {
		        response = response.data;
		        if(response.success == 1){		
		        	$scope.loadUsers($scope.page, $scope.limit);
		        } else {
		        	$mdToast.show({
						template : '<md-toast class="md-toast error">'+response.message+'</md-toast>',
						hideDelay : 2000,
						position : 'bottom right'
					}); 
		        }  
		    }, function errorCallback(response) {
		    });
		}
	}
	$scope.loadUsers($scope.page, $scope.limit);
})
app.controller("usersController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {
	if (!$rootScope.$storage.inc_user_id) {
		$location.path('/login');
	}

	if($rootScope.$storage.inc_userObj.incharge_type_id == 2500){
		$location.path("/dashboard");
	}
	if($routeParams.department_id != "all"){
		$scope.department_id = $rootScope.fromBase64($routeParams.department_id);
	}
	else{
		$scope.department_id = "all";	
	}
	$scope.incharge_type_id = $rootScope.fromBase64($routeParams.incharge_type_id);
	if($routeParams.parent_id && $routeParams.parent_id != "all"){
		$scope.parent_id = $routeParams.parent_id;
	}
	else{
		$scope.parent_id = "";	
	}
	$scope.navigationDepartment = {};
	$scope.navigationInchargeType = {};
	$scope.getDepartmentDetails = function(){
		$http({
	      method: 'POST',
	      url: apiUrl + 'getSingleDepartment',
	      data : {
	      	 department_id : $scope.department_id
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.navigationDepartment = response.department;
	        	//$scope.hierarchyObj = response.hierarchy;
	        }
	        else{
	        	$scope.navigationDepartment = {};
	        }
	    }, function errorCallback(response) {
	    });
	}

	$scope.statusList = [];

	$scope.getStatusList = function(){
		$http({
	      method: 'POST',
	      url: apiUrl + 'loadStatusList',
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.statusList = response.status;
	        }
	        else{
	        	$scope.statusList = [];
	        }
	    }, function errorCallback(response) {
	    });
	}

	$scope.getStatusList();

	$scope.openEdit = "";

	$scope.openEditText = function(user_id, status_id){
		if(status_id != '1'){
			$scope.openEdit = user_id;
		}
	}

	$scope.closeEdit = function(){
		$scope.openEdit = "";	
	}

	

	$scope.isSending = true;
	$scope.sendSms = function(mobile, password, email, worker){
		var message = "Hi, "+worker+", Please login to http://incdtdc.in/ with mobile : "+mobile+" and password :"+password;
		$scope.isSending = true;
		$http({
			method : 'POST',
			url : apiUrl + 'sendSMS',
			data : {
				mobile : mobile,
				message : message
			}
		}).then(function successCallback(response) {
			$mdToast.show({
				template : '<md-toast class="md-toast error">Details has been sent to '+mobile+'!</md-toast>',
				hideDelay : 2000,
				position : 'bottom right'
			});	
			$scope.isSending = false;	
		}, function errorCallback(response) {
			$scope.isSending = false;
		});
	}
	$scope.getInchargeTypeDetails = function(){
		$http({
	      method: 'POST',
	      url: apiUrl + 'incharge_types/details',
	      data : {
	      	 incharge_type_id : $scope.incharge_type_id
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.navigationInchargeType = response.incharge_type;
	        	//$scope.hierarchyObj = response.hierarchy;
	        }
	        else{
	        	$scope.navigationInchargeType = {};
	        }
	    }, function errorCallback(response) {
	    });
	}
	$scope.hierarchyNavigation = [];
	$scope.skippedColums = [];
	$scope.loadHierarchyNavigation = function(){
		$scope.skippedColums = [];
		$http({
	      method: 'POST',
	      url: apiUrl + 'loadHierarchyNavigation',
	      data : {
	      	 parent_id : $rootScope.fromBase64($scope.parent_id),
	      	 user_id : $rootScope.$storage.inc_userObj.user_id
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.hierarchyNavigation = response.navigation;
	        	//$scope.hierarchyObj = response.hierarchy;
	        	var allObj = {};
	        	if($routeParams.all_data == 'all'){
	        		allObj.hierarchy_id = "all",
	        		allObj.hierarchy = "All"
	        	}
	        	$scope.hierarchyNavigation.push(allObj);
	        	console.log($scope.hierarchyNavigation, "skipped");
	        	angular.forEach($scope.hierarchyNavigation, function(value, key){
	        		if(value.column){
	        			$scope.skippedColums.push(value.column.toLowerCase());
	        		}	
	        	})
	        	console.log($scope.skippedColums, "skipped");
	        }
	        else{
	        	$scope.hierarchyNavigation = [];
	        }
	    }, function errorCallback(response) {
	    });
	}
	if($scope.department_id != "all"){
		$scope.getDepartmentDetails();
	}
	else{
		$scope.navigationDepartment = {
			"department_id" : "all",
			"department" : "All departments"
		}
	}
	$scope.getInchargeTypeDetails();
	if($scope.parent_id){
		$scope.loadHierarchyNavigation();
	}
	$scope.hierarchyObj = {};
	$scope.data = [];
	$scope.users = [];
	$scope.columns = [];	
	$scope.limit = 30;
	$scope.page = 1;
	$scope.loadUsers = function(page, parent_id){
		$scope.users = [];
		$http({
	      method: 'POST',
	      url: apiUrl + 'users/user_list',
	      data : {
	      	 parent_id : parent_id,
	      	 limit : $scope.limit,
			 page : page,
	      	 incharge_type_id : $scope.incharge_type_id,
	      	 department_id : $scope.department_id,
	      	 search : $scope.search,
	      	 created_by : $rootScope.$storage.inc_user_id,
	      	 filters : $scope.filterArray.join(",")
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.users = response.users;
	        	//$scope.hierarchyObj = response.hierarchy;
	        	$scope.columns = response.columns;
	        	$scope.totalRecords = response.total;
	        }
	        else{
	        	$scope.users = [];
	        }
	    }, function errorCallback(response) {
	    });
	}

	$scope.updateStatus = function(user, index){
		angular.forEach($scope.statusList, function(value, key){
			if(value.status_id == user.phone_status){
				$scope.users[index].phone_status_name = value.status;
			}
		})

		$http({
	      method: 'POST',
	      url: apiUrl + 'users/update_status',
	      data : {
	      	 user_id : user.user_id,
	      	 status_id : user.phone_status
	      }
	    }).then(function successCallback(response) {
	        
	    }, function errorCallback(response) {
	    });

		$scope.openEdit = "";
	}

	$scope.totalCount = "";
	$scope.filterArray = [];
	$scope.tempArray = [];
	$scope.search = "";
	$rootScope.doSearch = function(search){
		$scope.search = search;
		$scope.page = 1;
		$scope.loadUsers($scope.page, $rootScope.fromBase64($scope.parent_id));
	}
	$rootScope.setFiler = function(meta){
		$scope.filterArray = [];
		$scope.tempArray = [];
		angular.forEach($scope.inchargeObj.meta, function(value, key){
			angular.forEach($scope.meta, function(v1, k1){
				angular.forEach(v1.meta_list, function(v2, k2){
					if(v2.data_id == value){
						$scope.tempArray.push(v1.meta_english.toLowerCase());
					}
				})
			})
			$scope.filterArray.push(value);
		})
		$scope.page = 1;
		$scope.loadUsers($scope.page, $rootScope.fromBase64($scope.parent_id));
	}
	$rootScope.loadData = function(parent_id){	
		$http({
	      method: 'POST',
	      url: apiUrl + 'data/data_list_selected',
	      data : {
	      	 parent_id : parent_id,
	      	 incharge_type_id : $scope.incharge_type_id,
	      	 department_id : $scope.department_id,
	      	 created_by : $rootScope.$storage.inc_user_id
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.data.length > 0){		
	        	$scope.data = response.data;
	        	$scope.totalCount = 0;
	        	angular.forEach($scope.data, function(value, key){
	        		$scope.totalCount += parseInt(value.total);
	        	})
	        	$scope.hierarchyObj = response.hierarchy;
	        }
	        else{
	        	$scope.data = [];
	        	$scope.loadUsers($scope.page, parent_id);
	        	$scope.loadDataFilter(parent_id);
	        }
	    }, function errorCallback(response) {
	    });
	}
	$rootScope.meta = [];
	$scope.disable_department = false;
	var keepGoing = true;
	$scope.inchargeObj = {};
	$scope.inchargeObj.meta = [];
	$scope.disabledMeta = [];
	$rootScope.loadDataFilter = function(parent_id, index){	
		keepGoing = true;
		// $scope.inchargeObj.meta = {};
		if($scope.meta.length > 0){
			$scope.meta.splice(index+1);
			$scope.inchargeObj.meta.splice(index+1);
			// console.log($scope.meta, "meta");
			//$scope.inchargeObj.meta.splice(index);	
		}
		if(parent_id != "" || $rootScope.meta.length == 0){
			$http({
		      method: 'POST',
		      url: apiUrl + 'data/data_list',
		      data : {
		      	 parent_id : parent_id,
		      	 incharge_type_id : $scope.incharge_type_id,
		      	 created_by : $rootScope.$storage.inc_userObj.user_id
		      }
		    }).then(function successCallback(response) {
		        response = response.data;
		        if(response.success == 1){		
		        	if(response.hierarchy){
			        	var dataObj = {
			        		meta_id : response.hierarchy.hierarchy_id,
			        		meta_english : response.hierarchy.hierarchy_english,
			        		meta_hindi : response.hierarchy.hierarchy_hindi,
			        		meta_gujarati : response.hierarchy.hierarchy_gujarati,
			        		meta_list : response.data,
			        	}	
		        		$scope.meta.push(dataObj);
		      //   		if($rootScope.$storage.inc_userObj.department_id){
		      //   			$scope.inchargeObj.department_id = $rootScope.$storage.inc_userObj.department_id;
		      //   			$scope.disable_department = true;
		      //   		}
		      //   		angular.forEach($rootScope.$storage.inc_userObj.meta, function(data_id, hierarchy_id){
			     //    		if(typeof($scope.inchargeObj.meta) == "undefined"){
			     //    			$scope.inchargeObj.meta = {};
			     //    		}
			     //    		$scope.disabledMeta.push(hierarchy_id.replace("_k", ""));
			     //    		if(!$scope.inchargeObj.meta[hierarchy_id] && keepGoing){
			     //    			$scope.inchargeObj.meta[hierarchy_id] = data_id;	
								// $scope.loadDataFilter(data_id, parseInt(index+1));
								// keepGoing = false;
			     //    		}
			     //    		else{
			     //    			keepGoing = true;
			     //    		}
			     //    	});
		        	}
		        }
		    }, function errorCallback(response) {
		    });
		}
	}
	var skippedArray = [];
	$scope.visibleFilter = false;
	if($routeParams.parent_id != "all" && $routeParams.all_data != 'all'){
		//$rootScope.loadData($rootScope.fromBase64($scope.parent_id));
		if($scope.parent_id){
			$rootScope.loadData($rootScope.fromBase64($scope.parent_id));
			// $rootScope.loadDataFilter($rootScope.fromBase64($scope.parent_id));
		}
		else{
			var MetaObj = $rootScope.$storage.inc_userObj.meta;
			if(MetaObj){
				var MetaObjKeys = Object.keys(MetaObj);
				if(MetaObjKeys.length > 0){
					var lastKey = MetaObjKeys[MetaObjKeys.length - 1];
					var parent_id = MetaObj[lastKey];
					$rootScope.loadData(parent_id);
					// $rootScope.loadDataFilter(parent_id);
				}	
				else{
					$rootScope.loadData($rootScope.fromBase64($scope.parent_id));
					// $rootScope.loadDataFilter($rootScope.fromBase64($scope.parent_id));
				}
			}
			else{
				$rootScope.loadData($rootScope.fromBase64($scope.parent_id));
			}
		}
		$scope.visibleFilter = false;	
	}
	else{
		$scope.loadUsers($scope.page, $rootScope.fromBase64($scope.parent_id));
		$rootScope.loadDataFilter($rootScope.fromBase64($scope.parent_id));
		$scope.visibleFilter = true;
		console.log("here");
	}
	/*if($routeParams.incharge_type_id){
		$rootScope.loadDataFilter("", 0);
	}*/
})
app.controller("uploadController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {
	if (!$rootScope.$storage.inc_user_id) {
		$location.path('/login');
	}

	if($rootScope.$storage.inc_userObj.incharge_type_id == 2500){
		$location.path("/dashboard");
	}
	$scope.disabledMeta = [];
	$scope.data_id = "";
	//Initial form values
	$scope.communities = [];
	$scope.departments = [];
	$scope.get_occupations = [];
	$scope.inchargeTypeObj = {};
	$scope.inchargeObj = {};
	$scope.incharge_type_id = $rootScope.fromBase64($routeParams.incharge_type_id);
	$rootScope.getSingleUser = function(){
		$http({
	      method: 'POST',
	      url: apiUrl + 'users/details',
	      data : {
	      	user_id : $rootScope.fromBase64($routeParams.user_id)
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.inchargeObj = response.user;
	        	var i = 0;
	        	angular.forEach($scope.inchargeObj.meta, function(data_id, hierarchy_id){
	        		if($scope.incharge_type_id != hierarchy_id.replace("_k","")){
						$rootScope.loadData(data_id, i);
	        		}
	        		i++;
	        	});
	        }
	        else{
	        	$scope.inchargeObj = {};	
	        }
	    }, function errorCallback(response) {
	    });
	}
	if($routeParams.user_id){
		$rootScope.getSingleUser();
	}
	$rootScope.loadInchargeType = function(){	
		$http({
	      method: 'POST',
	      url: apiUrl + 'incharge_types/details',
	      data : {
	      	incharge_type_id : $rootScope.fromBase64($routeParams.incharge_type_id)
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.inchargeTypeObj = response.incharge_type;
	        }
	        else{
	        	$scope.inchargeTypeObj = {};	
	        }
	    }, function errorCallback(response) {
	    });
	}	
	$rootScope.meta = [];
	$scope.disable_department = false;
	var keepGoing = true;
	$rootScope.loadData = function(parent_id, index){	
		keepGoing = true;
		if($scope.meta.length > 0){
			$scope.meta.splice(index+1);	
		}
		if(parent_id != "" || $rootScope.meta.length == 0){
			$http({
		      method: 'POST',
		      url: apiUrl + 'data/data_list',
		      data : {
		      	 parent_id : parent_id,
		      	 incharge_type_id : $scope.incharge_type_id,
		      	 created_by : $rootScope.$storage.inc_userObj.user_id
		      }
		    }).then(function successCallback(response) {
		        response = response.data;
		        if(response.success == 1){		
		        	if(response.hierarchy){
			        	var dataObj = {
			        		meta_id : response.hierarchy.hierarchy_id,
			        		meta_english : response.hierarchy.hierarchy_english,
			        		meta_hindi : response.hierarchy.hierarchy_hindi,
			        		meta_gujarati : response.hierarchy.hierarchy_gujarati,
			        		meta_list : response.data,
			        	}	
		        		$scope.meta.push(dataObj);
		        		//console.log(data_id, "data id");
			        	if($rootScope.$storage.inc_userObj.department_id){
		        			$scope.inchargeObj.department_id = $rootScope.$storage.inc_userObj.department_id;
		        			$scope.disable_department = true;
		        		}
		        		angular.forEach($rootScope.$storage.inc_userObj.meta, function(data_id, hierarchy_id){
			        		if(typeof($scope.inchargeObj.meta) == "undefined"){
			        			$scope.inchargeObj.meta = {};
			        		}
			        		$scope.data_id = data_id;
			        		// console.log(data_id, "data id");
			        		// console.log(hierarchy_id, "hierarchy_id");
			        		$scope.disabledMeta.push(hierarchy_id.replace("_k", ""));
			        		if(!$scope.inchargeObj.meta[hierarchy_id] && keepGoing){
			        			$scope.inchargeObj.meta[hierarchy_id] = data_id;	
								$scope.loadData(data_id, parseInt(index+1));
								keepGoing = false;
			        		}
			        		else{
			        			keepGoing = true;
			        		}
			        	});
		        	}
		        	// angular.forEach($scope.meta, function(value, key){
		        	// 	angular.forEach(value.meta_list, function(value1, key1){
		        	// 		angular.forEach($rootScope.$storage.inc_userObj.meta, function(metaValue, metaKey){
		        	// 			// console.log(value1, "value1");
			        // 			if(typeof($scope.inchargeObj.meta) == "undefined"){
		        	// 				$scope.inchargeObj.meta = {};
		        	// 				$scope.inchargeObj.meta[metaKey] = "";		
		        	// 			}
			        // 			if($rootScope.$storage.inc_userObj.meta[metaKey] && $rootScope.$storage.inc_userObj.meta[metaKey] != ""){
			        // 				if(!$scope.inchargeObj.meta[metaKey]){
				       //  				$scope.inchargeObj.meta[metaKey] = $rootScope.$storage.inc_userObj.meta[metaKey].data_id;
				       //  				$scope.loadData($scope.inchargeObj.meta[metaKey], parseInt(metaKey+1))
			        // 				}
			        // 			}
		        	// 		})
		        	// 	})
		        	// })
		        }
		    }, function errorCallback(response) {
		    });
		}
	}		
	if($routeParams.incharge_type_id){
		$rootScope.loadInchargeType();
		$rootScope.loadData("", 0);
	}
	$scope.saveText = "Save";
	$scope.isSaving = false;
	$rootScope.submitWorker = function(form){	
		if(form.validate()){
			var formData = new FormData();
			$scope.inchargeObj.incharge_type_id = $scope.incharge_type_id;
			$scope.inchargeObj.user_id = $rootScope.$storage.inc_userObj.user_id;
	        angular.forEach($scope.inchargeObj, function(value, key){
	        	if(key == "meta"){
	        		formData.append(key, JSON.stringify(value));
	        	}
	        	else{
	        		formData.append(key, value);
	        	}
	        })
	        formData.append("noJson", "true"); 
			$scope.isSaving = true;
			$scope.saveText = "Saving...";
			$http({
		      method: 'POST',
		      url: apiUrl + 'users/upload',
		      data : formData,
		      headers: {'Content-Type': undefined}
		    }).then(function successCallback(response) {
		        response = response.data;
		        if(response.success == 1){		
		        	$window.history.back();
		        }
		        $mdToast.show({
					template : '<md-toast class="md-toast error">'+response.message+'</md-toast>',
					hideDelay : 2000,
					position : 'bottom right'
				});   
		    }, function errorCallback(response) {
		    });
		}
	}
});
app.controller("gpccEnrollerController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {
	//Initial form values
	$scope.communities = [];
	$scope.departments = [];
	$scope.get_occupations = [];
	$scope.inchargeTypeObj = {};
	$scope.inchargeObj = {};
	$scope.incharge_type_id = 18;
	$scope.disabledMeta = [];
	$rootScope.loadCommunities = function(){	
		$http({
	      method: 'POST',
	      url: apiUrl + 'get_communities',
	      data : $scope.userObj
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.communities = response.communities;
	        }
	        else{
	        	$scope.communities = [];	
	        }
	    }, function errorCallback(response) {
	    });
	}
	$rootScope.loadDepartments = function(){	
		$http({
	      method: 'POST',
	      url: apiUrl + 'get_departments',
	      data : $scope.userObj
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.departments = response.departments;
	        }
	        else{
	        	$scope.departments = [];	
	        }
	    }, function errorCallback(response) {
	    });
	}	
	$rootScope.loadOccupations = function(){	
		$http({
	      method: 'POST',
	      url: apiUrl + 'get_occupations',
	      data : $scope.userObj
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.occupations = response.occupations;
	        }
	        else{
	        	$scope.occupations = [];	
	        }
	    }, function errorCallback(response) {
	    });
	}		
	$rootScope.loadInchargeType = function(){	
		$http({
	      method: 'POST',
	      url: apiUrl + 'incharge_types/details',
	      data : {
	      	incharge_type_id : $scope.incharge_type_id
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.inchargeTypeObj = response.incharge_type;
	        }
	        else{
	        	$scope.inchargeTypeObj = {};	
	        }
	    }, function errorCallback(response) {
	    });
	}	
	$rootScope.meta = [];
	$scope.inchargeObj.meta = {};
	$scope.inchargeObj.meta['20_k'] = "12";
	$scope.disable_department = true;
	var keepGoing = true;
	$rootScope.loadData = function(parent_id, index){	
		keepGoing = true;
		if($scope.meta.length > 0){
			$scope.meta.splice(index+1);	
		}
		if((parent_id != "" || $rootScope.meta.length == 0) && typeof(parent_id) != 'undefined'){
			$http({
		      method: 'POST',
		      url: apiUrl + 'data/data_list',
		      data : {
		      	 parent_id : parent_id,
		      	 incharge_type_id : $scope.incharge_type_id,
		      	 created_by : ""
		      }
		    }).then(function successCallback(response) {
		        response = response.data;
		        if(response.success == 1){		
		        	if(response.hierarchy){
			        	var dataObj = {
			        		meta_id : response.hierarchy.hierarchy_id,
			        		meta_english : response.hierarchy.hierarchy_english,
			        		meta_label : response.hierarchy.hierarchy_label,
			        		meta_hindi : response.hierarchy.hierarchy_hindi,
			        		meta_gujarati : response.hierarchy.hierarchy_gujarati,
			        		meta_list : response.data,
			        		level : response.hierarchy.level
			        	}	
			        	//console.log(dataObj, "data obj");
		        		$scope.meta.push(dataObj);
		        		//console.log(data_id, "data id");
			        	if($rootScope.$storage.inc_userObj.department_id){
		        			$scope.inchargeObj.department_id = $rootScope.$storage.inc_userObj.department_id;
		        			$scope.disable_department = true;
		        		}
		        	}
		        }
		    }, function errorCallback(response) {
		    });
		}
	}		
	if($scope.incharge_type_id){
		$rootScope.loadInchargeType();
		$rootScope.loadCommunities();
		$rootScope.loadOccupations();
		$rootScope.loadDepartments();
		$rootScope.loadData("12", 0);
	}
	$scope.saveText = "Save";
	$scope.isSaving = false;
	$rootScope.saveWorker = function(form){	
		$scope.message = "";
		if(form.validate()){
			$scope.inchargeObj.department_id = 1;
			//$scope.inchargeObj.incharge_type_id = $rootScope.fromBase64($routeParams.incharge_type_id);
			var MetaObj = $scope.inchargeObj.meta;
			var MetaObjKeys = Object.keys(MetaObj);
			var lastKey = "";
			if(MetaObjKeys.length > 0){
				lastKey = MetaObjKeys[MetaObjKeys.length - 1];
			}	
			$scope.inchargeObj.incharge_type_id = lastKey.replace("_k","");
			$scope.inchargeObj.created_by = $rootScope.$storage.inc_user_id;
			$scope.inchargeObj.status = "inactive";
			$scope.isSaving = true;
			$scope.saveText = "Saving...";
			$http({
		      method: 'POST',
		      url: apiUrl + 'users/save',
		      data : $scope.inchargeObj
		    }).then(function successCallback(response) {
		        response = response.data;
		        $scope.isSaving = false;
		        $scope.saveText = "Save";
		        if(response.success == 1){		
		        	//$route.reload();
		        	$scope.inchargeObj = {};
		        	$scope.meta = [];
		        	$scope.loadData("12", "");
		        	$scope.message = "Thank you for submitting your details. Your account will be reviewed by our representatives before approval.";
		        }
		        else{
		        	$mdToast.show({
						template : '<md-toast class="md-toast error">'+response.message+'</md-toast>',
						hideDelay : 2000,
						position : 'bottom right'
					}); 
		        }  
		    }, function errorCallback(response) {
		    });
		}
	}
});
app.controller("formController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {
	if (!$rootScope.$storage.inc_user_id) {
		$location.path('/login');
	}

	$scope.designations = [
		'PCC President',
		'Working President',
		'Vice President',
		'General Secretary',
		'Secretary',
		'Organizing Secretary',
		'Cell / Department Head',
		'Committee member',
		'MP',
		'MLA',
		'MLC',
		'AICC secretary',
		'Ex-MP',
		'Ex MLA/ MLC',
		'Frontal Head',
		'Spokesperson',
		'Others'
	];

	$scope.is_approve = false;

	if($rootScope.$storage.inc_userObj.incharge_type_id == 2500){
		$location.path("/dashboard");
	}
	$scope.disabledMeta = [];
	//Initial form values
	$scope.communities = [];
	$scope.departments = [];
	$scope.get_occupations = [];
	$scope.inchargeTypeObj = {};
	$scope.inchargeObj = {};
	$scope.incharge_type_id = $rootScope.fromBase64($routeParams.incharge_type_id);
	$rootScope.getSingleUser = function(){
		$http({
	      method: 'POST',
	      url: apiUrl + 'users/details',
	      data : {
	      	user_id : $rootScope.fromBase64($routeParams.user_id)
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.inchargeObj = response.user;
	        	var i = 0;
	        	angular.forEach($scope.inchargeObj.meta, function(data_id, hierarchy_id){
	        		if($scope.incharge_type_id != hierarchy_id.replace("_k","") && $scope.incharge_type_id != 25){
						$rootScope.loadData(data_id, i);
	        		}
	        		i++;
	        	});
	        }
	        else{
	        	$scope.inchargeObj = {};	
	        }
	    }, function errorCallback(response) {
	    });
	}
	if($routeParams.user_id){
		$rootScope.getSingleUser();
	}
	$rootScope.loadCommunities = function(){	
		$http({
	      method: 'POST',
	      url: apiUrl + 'get_communities',
	      data : $scope.userObj
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.communities = response.communities;
	        }
	        else{
	        	$scope.communities = [];	
	        }
	    }, function errorCallback(response) {
	    });
	}
	$rootScope.loadDepartments = function(){	
		$http({
	      method: 'POST',
	      url: apiUrl + 'get_departments',
	      data : $scope.userObj
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.departments = response.departments;
	        }
	        else{
	        	$scope.departments = [];	
	        }
	    }, function errorCallback(response) {
	    });
	}	
	$rootScope.loadOccupations = function(){	
		$http({
	      method: 'POST',
	      url: apiUrl + 'get_occupations',
	      data : $scope.userObj
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.occupations = response.occupations;
	        }
	        else{
	        	$scope.occupations = [];	
	        }
	    }, function errorCallback(response) {
	    });
	}		
	$rootScope.loadInchargeType = function(){	
		$http({
	      method: 'POST',
	      url: apiUrl + 'incharge_types/details',
	      data : {
	      	incharge_type_id : $rootScope.fromBase64($routeParams.incharge_type_id)
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.inchargeTypeObj = response.incharge_type;
	        }
	        else{
	        	$scope.inchargeTypeObj = {};	
	        }
	    }, function errorCallback(response) {
	    });
	}	
	$rootScope.meta = [];
	$scope.disable_department = false;
	var keepGoing = true;
	$rootScope.loadData = function(parent_id, index){	
		keepGoing = true;
		if($scope.meta.length > 0){
			$scope.meta.splice(index+1);	

			var metakeys = Object.keys($scope.inchargeObj.meta);

			var i = 0;
			angular.forEach(metakeys, function(value, key){

				if(i > index){
					delete $scope.inchargeObj.meta[value];
				}
				i++;
			})
		}
		if((parent_id != "" || $rootScope.meta.length == 0) && typeof(parent_id) != 'undefined'){
			$http({
		      method: 'POST',
		      url: apiUrl + 'data/data_list',
		      data : {
		      	 parent_id : parent_id,
		      	 incharge_type_id : $scope.incharge_type_id,
		      	 created_by : $rootScope.$storage.inc_userObj.user_id
		      }
		    }).then(function successCallback(response) {
		        response = response.data;
		        if(response.success == 1){		
		        	if(response.hierarchy){
			        	var dataObj = {
			        		meta_id : response.hierarchy.hierarchy_id,
			        		meta_english : response.hierarchy.hierarchy_english,
			        		meta_label : response.hierarchy.hierarchy_label,
			        		meta_hindi : response.hierarchy.hierarchy_hindi,
			        		meta_gujarati : response.hierarchy.hierarchy_gujarati,
			        		meta_list : response.data,
			        		level : response.hierarchy.level
			        	}	
			        	//console.log(dataObj, "data obj");
		        		$scope.meta.push(dataObj);
		        		//console.log(data_id, "data id");
			        	if($rootScope.$storage.inc_userObj.department_id){
		        			$scope.inchargeObj.department_id = $rootScope.$storage.inc_userObj.department_id;
		        			$scope.disable_department = true;
		        		}

		        		angular.forEach($rootScope.$storage.inc_userObj.meta, function(data_id, hierarchy_id){
			        		if(typeof($scope.inchargeObj.meta) == "undefined"){
			        			$scope.inchargeObj.meta = {};
			        		}

			        		$scope.disabledMeta.push(hierarchy_id.replace("_k", ""));
			        		if(!$scope.inchargeObj.meta[hierarchy_id] && keepGoing){
			        			console.log("here");
			        			$scope.inchargeObj.meta[hierarchy_id] = data_id;	
			        			if($scope.incharge_type_id != 25){
									$scope.loadData(data_id, parseInt(index+1));
									keepGoing = false;
			        			}
			        		}
			        		else{
			        			keepGoing = true;
			        		}
			        	});
		        	}
		        	// angular.forEach($scope.meta, function(value, key){
		        	// 	angular.forEach(value.meta_list, function(value1, key1){
		        	// 		angular.forEach($rootScope.$storage.inc_userObj.meta, function(metaValue, metaKey){
		        	// 			// console.log(value1, "value1");
			        // 			if(typeof($scope.inchargeObj.meta) == "undefined"){
		        	// 				$scope.inchargeObj.meta = {};
		        	// 				$scope.inchargeObj.meta[metaKey] = "";		
		        	// 			}
			        // 			if($rootScope.$storage.inc_userObj.meta[metaKey] && $rootScope.$storage.inc_userObj.meta[metaKey] != ""){
			        // 				if(!$scope.inchargeObj.meta[metaKey]){
				       //  				$scope.inchargeObj.meta[metaKey] = $rootScope.$storage.inc_userObj.meta[metaKey].data_id;
				       //  				$scope.loadData($scope.inchargeObj.meta[metaKey], parseInt(metaKey+1))
			        // 				}
			        // 			}
		        	// 		})
		        	// 	})
		        	// })
		        }
		    }, function errorCallback(response) {
		    });
		}
	}		
	if($routeParams.incharge_type_id){
		$rootScope.loadInchargeType();
		$rootScope.loadCommunities();
		$rootScope.loadOccupations();
		$rootScope.loadDepartments();
		$rootScope.loadData("", 0);
	}
	$scope.saveText = "Save";
	$scope.isSaving = false;
	$rootScope.saveWorker = function(form){	
		if(form.validate()){
			var api = 'users/save';

			if($scope.inchargeObj.user_id && $rootScope.$storage.inc_userObj.state_id){
				api = 'users/update';
			}

			$scope.inchargeObj.incharge_type_id = $rootScope.fromBase64($routeParams.incharge_type_id);
			$scope.inchargeObj.created_by = $rootScope.$storage.inc_user_id;
			$scope.isSaving = true;
			$scope.saveText = "Saving...";
			$http({
		      method: 'POST',
		      url: apiUrl + api,
		      data : $scope.inchargeObj
		    }).then(function successCallback(response) {
		        response = response.data;
		        if(response.success == 1){		
		        	$window.history.back();
		        }
		        $mdToast.show({
					template : '<md-toast class="md-toast error">'+response.message+'</md-toast>',
					hideDelay : 2000,
					position : 'bottom right'
				});   
		    }, function errorCallback(response) {
		    });
		}
	}
});


app.controller("formReviewController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {
	if (!$rootScope.$storage.inc_user_id) {
		$location.path('/login');
	}

	if($rootScope.$storage.inc_userObj.incharge_type_id == 2500){
		$location.path("/dashboard");
	}

	$scope.is_approve = true;

	$scope.disabledMeta = [];
	//Initial form values
	$scope.communities = [];
	$scope.departments = [];
	$scope.get_occupations = [];
	$scope.inchargeTypeObj = {};
	$scope.inchargeObj = {};
	$scope.incharge_type_id = $rootScope.fromBase64($routeParams.incharge_type_id);
	$rootScope.getSingleUser = function(){
		$http({
	      method: 'POST',
	      url: apiUrl + 'users/review_details',
	      data : {
	      	user_id : $rootScope.fromBase64($routeParams.user_id)
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.inchargeObj = response.user;
	        	var i = 0;
	        	angular.forEach($scope.inchargeObj.meta, function(data_id, hierarchy_id){
	        		if($scope.incharge_type_id != hierarchy_id.replace("_k","")){
						$rootScope.loadData(data_id, i);
	        		}
	        		i++;
	        	});
	        }
	        else{
	        	$scope.inchargeObj = {};	
	        }
	    }, function errorCallback(response) {
	    });
	}
	if($routeParams.user_id){
		$rootScope.getSingleUser();
	}
	$rootScope.loadCommunities = function(){	
		$http({
	      method: 'POST',
	      url: apiUrl + 'get_communities',
	      data : $scope.userObj
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.communities = response.communities;
	        }
	        else{
	        	$scope.communities = [];	
	        }
	    }, function errorCallback(response) {
	    });
	}
	$rootScope.loadDepartments = function(){	
		$http({
	      method: 'POST',
	      url: apiUrl + 'get_departments',
	      data : $scope.userObj
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.departments = response.departments;
	        }
	        else{
	        	$scope.departments = [];	
	        }
	    }, function errorCallback(response) {
	    });
	}	
	$rootScope.loadOccupations = function(){	
		$http({
	      method: 'POST',
	      url: apiUrl + 'get_occupations',
	      data : $scope.userObj
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.occupations = response.occupations;
	        }
	        else{
	        	$scope.occupations = [];	
	        }
	    }, function errorCallback(response) {
	    });
	}		
	$rootScope.loadInchargeType = function(){	
		$http({
	      method: 'POST',
	      url: apiUrl + 'incharge_types/details',
	      data : {
	      	incharge_type_id : $rootScope.fromBase64($routeParams.incharge_type_id)
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.inchargeTypeObj = response.incharge_type;
	        }
	        else{
	        	$scope.inchargeTypeObj = {};	
	        }
	    }, function errorCallback(response) {
	    });
	}	
	$rootScope.meta = [];
	$scope.disable_department = false;
	var keepGoing = true;
	$rootScope.loadData = function(parent_id, index){	
		keepGoing = true;
		if($scope.meta.length > 0){
			$scope.meta.splice(index+1);	
		}
		if((parent_id != "" || $rootScope.meta.length == 0) && typeof(parent_id) != 'undefined'){
			$http({
		      method: 'POST',
		      url: apiUrl + 'data/data_list',
		      data : {
		      	 parent_id : parent_id,
		      	 incharge_type_id : $scope.incharge_type_id,
		      	 created_by : $rootScope.$storage.inc_userObj.user_id
		      }
		    }).then(function successCallback(response) {
		        response = response.data;
		        if(response.success == 1){		
		        	if(response.hierarchy){
			        	var dataObj = {
			        		meta_id : response.hierarchy.hierarchy_id,
			        		meta_english : response.hierarchy.hierarchy_english,
			        		meta_label : response.hierarchy.hierarchy_label,
			        		meta_hindi : response.hierarchy.hierarchy_hindi,
			        		meta_gujarati : response.hierarchy.hierarchy_gujarati,
			        		meta_list : response.data,
			        		level : response.hierarchy.level
			        	}	
			        	console.log(dataObj, "data obj");
			        	//console.log(dataObj, "data obj");
		        		$scope.meta.push(dataObj);
		        		//console.log(data_id, "data id");
			        	if($rootScope.$storage.inc_userObj.department_id){
		        			$scope.inchargeObj.department_id = $rootScope.$storage.inc_userObj.department_id;
		        			$scope.disable_department = true;
		        		}
		        		angular.forEach($rootScope.$storage.inc_userObj.meta, function(data_id, hierarchy_id){
			        		if(typeof($scope.inchargeObj.meta) == "undefined"){
			        			$scope.inchargeObj.meta = {};
			        		}
			        		$scope.disabledMeta.push(hierarchy_id.replace("_k", ""));
			        		if(!$scope.inchargeObj.meta[hierarchy_id] && keepGoing){
			        			$scope.inchargeObj.meta[hierarchy_id] = data_id;	
			        			if($scope.incharge_type_id != 25){
									$scope.loadData(data_id, parseInt(index+1));
									keepGoing = false;
			        			}
			        		}
			        		else{
			        			keepGoing = true;
			        		}
			        	});
		        	}
		        	// angular.forEach($scope.meta, function(value, key){
		        	// 	angular.forEach(value.meta_list, function(value1, key1){
		        	// 		angular.forEach($rootScope.$storage.inc_userObj.meta, function(metaValue, metaKey){
		        	// 			// console.log(value1, "value1");
			        // 			if(typeof($scope.inchargeObj.meta) == "undefined"){
		        	// 				$scope.inchargeObj.meta = {};
		        	// 				$scope.inchargeObj.meta[metaKey] = "";		
		        	// 			}
			        // 			if($rootScope.$storage.inc_userObj.meta[metaKey] && $rootScope.$storage.inc_userObj.meta[metaKey] != ""){
			        // 				if(!$scope.inchargeObj.meta[metaKey]){
				       //  				$scope.inchargeObj.meta[metaKey] = $rootScope.$storage.inc_userObj.meta[metaKey].data_id;
				       //  				$scope.loadData($scope.inchargeObj.meta[metaKey], parseInt(metaKey+1))
			        // 				}
			        // 			}
		        	// 		})
		        	// 	})
		        	// })
		        }
		    }, function errorCallback(response) {
		    });
		}
	}		
	if($routeParams.incharge_type_id){
		$rootScope.loadInchargeType();
		$rootScope.loadCommunities();
		$rootScope.loadOccupations();
		$rootScope.loadDepartments();
		$rootScope.loadData("", 0);
	}
	$scope.saveText = "Approve";
	$scope.isSaving = false;
	$rootScope.saveWorker = function(form){	
		if(form.validate()){
			var api = 'users/save';

			if($scope.inchargeObj.user_id && $rootScope.$storage.inc_userObj.state_id){
				api = 'users/update';
			}

			$scope.inchargeObj.incharge_type_id = $rootScope.fromBase64($routeParams.incharge_type_id);
			$scope.inchargeObj.created_by = $rootScope.$storage.inc_user_id;
			$scope.isSaving = true;
			$scope.saveText = "Please wait...";
			$http({
		      method: 'POST',
		      url: apiUrl + api,
		      data : $scope.inchargeObj
		    }).then(function successCallback(response) {
		        response = response.data;
		        if(response.success == 1){		
		        	$window.history.back();
		        }
		        $mdToast.show({
					template : '<md-toast class="md-toast error">'+response.message+'</md-toast>',
					hideDelay : 2000,
					position : 'bottom right'
				});   
		    }, function errorCallback(response) {
		    });
		}
	}
});

app.controller("allDistrictReportController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {
	if (!$rootScope.$storage.inc_user_id) {
		$location.path('/login');
	}

	if($rootScope.$storage.inc_userObj.incharge_type_id == 2500)	{
		$location.path("/dashboard");
	}

	$scope.report_type = "district";
	
	$scope.table_rows = [];
	$scope.table_columns = [];
	$scope.loadingReport = false;

	$scope.getAllDistrictReport = function(){
		$scope.loadingReport = true;
		$http({
	      method: 'POST',
	      url: apiUrl + 'reports/all_district',
	      data : {
	      	state_id : $rootScope.$storage.inc_userObj.state_id,
	      	report_type : "district"
	      }
	    }).then(function successCallback(response) {
	        response = response.data;

	        if(response.success == 1){
	        	$scope.table_rows = response.report;
	        	$scope.table_columns = response.table_columns;	
	        }
	        
	        $scope.loadingReport = false;
	    }, function errorCallback(response) {
	    });
	}

	$scope.getAllDistrictReport();

});

app.controller("allCorporationReportController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {
	if (!$rootScope.$storage.inc_user_id) {
		$location.path('/login');
	}

	if($rootScope.$storage.inc_userObj.incharge_type_id == 2500){
		$location.path("/dashboard");
	}
	
	$scope.report_type = "corporation";

	$scope.table_rows = [];
	$scope.table_columns = [];
	$scope.loadingReport = false;

	$scope.getAllDistrictReport = function(){
		$scope.loadingReport = true;
		$http({
	      method: 'POST',
	      url: apiUrl + 'reports/all_district',
	      data : {
	      	state_id : $rootScope.$storage.inc_userObj.state_id,
	      	report_type : "municipal corporation"
	      }
	    }).then(function successCallback(response) {
	        response = response.data;

	        if(response.success == 1){
	        	$scope.table_rows = response.report;
	        	$scope.table_columns = response.table_columns;	
	        }
	        
	        $scope.loadingReport = false;
	    }, function errorCallback(response) {
	    });
	}

	$scope.getAllDistrictReport();

});

app.controller("allDistrictDetailsReportController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {

	if (!$rootScope.$storage.inc_user_id) {
		$location.path('/login');
	}

	if($rootScope.$storage.inc_userObj.incharge_type_id == 2500){
		$location.path("/dashboard");
	}

	$scope.report_type = "district";

	$scope.data_id = $rootScope.fromBase64($routeParams.row_id);
	$scope.incharge_type_id = $rootScope.fromBase64($routeParams.column_id);

	$scope.users = [];
	$scope.columns = [];	
	$scope.limit = 30;
	$scope.page = 1;

	$scope.loadUsers = function(page){
		$scope.users = [];
		$http({
	      method: 'POST',
	      url: apiUrl + 'users/user_list_by_row_column',
	      data : {
	      	 limit : $scope.limit,
			 page : page,
	      	 incharge_type_id : $scope.incharge_type_id,
	      	 data_id : $scope.data_id,
	      	 department_id : "all",
	      	 search : $scope.search,
	      	 created_by : $rootScope.$storage.inc_user_id,
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.users = response.users;
	        	//$scope.hierarchyObj = response.hierarchy;
	        	$scope.columns = response.columns;
	        	$scope.totalRecords = response.total;
	        }
	        else{
	        	$scope.users = [];
	        }
	    }, function errorCallback(response) {
	    });
	}

	$scope.loadUsers($scope.page);

	console.log($scope.data_id, "row_id");
	console.log($scope.incharge_type_id, "column_id");

});

app.controller("allCorporationDetailsReportController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {

	if (!$rootScope.$storage.inc_user_id) {
		$location.path('/login');
	}

	if($rootScope.$storage.inc_userObj.incharge_type_id == 2500){
		$location.path("/dashboard");
	}

	$scope.report_type = "corporation";

	$scope.data_id = $rootScope.fromBase64($routeParams.row_id);
	$scope.incharge_type_id = $rootScope.fromBase64($routeParams.column_id);

	$scope.users = [];
	$scope.columns = [];	
	$scope.limit = 30;
	$scope.page = 1;

	$scope.loadUsers = function(page){
		$scope.users = [];
		$http({
	      method: 'POST',
	      url: apiUrl + 'users/user_list_by_row_column',
	      data : {
	      	 limit : $scope.limit,
			 page : page,
	      	 incharge_type_id : $scope.incharge_type_id,
	      	 data_id : $scope.data_id,
	      	 department_id : "all",
	      	 search : $scope.search,
	      	 created_by : $rootScope.$storage.inc_user_id,
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.users = response.users;
	        	//$scope.hierarchyObj = response.hierarchy;
	        	$scope.columns = response.columns;
	        	$scope.totalRecords = response.total;
	        }
	        else{
	        	$scope.users = [];
	        }
	    }, function errorCallback(response) {
	    });
	}

	$scope.loadUsers($scope.page);

	console.log($scope.data_id, "row_id");
	console.log($scope.incharge_type_id, "column_id");

});

app.controller("districtWiseReportController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {

	if (!$rootScope.$storage.inc_user_id) {
		$location.path('/login');
	}

	if($rootScope.$storage.inc_userObj.incharge_type_id == 2500){
		$location.path("/dashboard");
	}

	$scope.districtDropDown = [];
	$scope.hierarchy = {};

	$scope.report_type = "disrtict_wise";

	// $scope.data_id = $rootScope.fromBase64($routeParams.row_id);
	// $scope.incharge_type_id = $rootScope.fromBase64($routeParams.column_id);

	$scope.data_id = "";
	$scope.incharge_type_id = "";

	$scope.users = [];
	$scope.columns = [];	
	$scope.limit = 30;
	$scope.page = 1;

	$scope.data_id = "";

	$scope.isLoading = false;
	$scope.noResults = false;

	$scope.loadData = function(parent_id){	

		if($rootScope.$storage.inc_userObj.state_id != 5){
			$scope.incharge_type_id = 12
		}

		$http({
	      method: 'POST',
	      url: apiUrl + 'data/data_list',
	      data : {
	      	 parent_id : parent_id,
	      	 incharge_type_id : $scope.incharge_type_id,
	      	 created_by : $rootScope.$storage.inc_userObj.user_id
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.data.length > 0){		
	        	$scope.districtDropDown = response.data;
	        	$scope.hierarchy = response.hierarchy;
	        }
	        else{
	        	
	        }
	    }, function errorCallback(response) {
	    });
	}

	if($rootScope.$storage.inc_userObj.state_id == 5){
		var MetaObj = $rootScope.$storage.inc_userObj.meta;
		if(MetaObj){
			var MetaObjKeys = Object.keys(MetaObj);
			if(MetaObjKeys.length > 0){
				var lastKey = MetaObjKeys[MetaObjKeys.length - 1];
				var parent_id = MetaObj[lastKey];
				$scope.loadData(parent_id);
				// $rootScope.loadDataFilter(parent_id);
			}	
			else{
				$scope.loadData();
				// $rootScope.loadDataFilter($rootScope.fromBase64($scope.parent_id));
			}
		}
		else{
			$scope.loadData();
		}
	}
	else{
		$scope.loadData(12);
	}

	// $scope.loadUsers = function(page){

	// 	console.log(page, "page");

	// 	if($scope.data_id){
	// 		$scope.users = [];
	// 		if(page == 1){
	// 			$scope.totalRecords = 0; 
	// 		}
	// 		$scope.isLoading = true;
	// 		$http({
	// 	      method: 'POST',
	// 	      url: apiUrl + 'users/user_list_by_row_column',
	// 	      data : {
	// 	      	 limit : $scope.limit,
	// 			 page : page,
	// 	      	 incharge_type_id : "",
	// 	      	 data_id : $scope.data_id,
	// 	      	 not_data_id : 12,
	// 	      	 department_id : "all",
	// 	      	 search : $scope.search,
	// 	      	 created_by : $rootScope.$storage.inc_user_id,
	// 	      }
	// 	    }).then(function successCallback(response) {
	// 	        response = response.data;
	// 	        if(response.success == 1){		
	// 	        	$scope.users = response.users;
	// 	        	//$scope.hierarchyObj = response.hierarchy;
	// 	        	$scope.columns = response.columns;
	// 	        	$scope.totalRecords = response.total;
	// 	        	$scope.noResults = false;
	// 	        }
	// 	        else{
	// 	        	$scope.users = [];
	// 	        	$scope.totalRecords = 0;
	// 	        	$scope.noResults = true;
	// 	        }
	// 	        $scope.isLoading = false;
	// 	    }, function errorCallback(response) {
	// 	    });
	// 	}else{
	// 		$scope.users = [];
	// 		$scope.totalRecords = 0;
	// 	}
	// }

	//$scope.loadUsers($scope.page);

	$scope.reportData = [];

	$scope.loadHierarchy = function(){

		if($scope.data_id){
			$scope.isLoading = true;
			$scope.reportData = [];
			$http({
		      method: 'POST',
		      url: apiUrl + 'loadReportHierarchy',
		      data : {
		      	 data_id : $scope.data_id,
		      	 not_data_id : 12,
		      	 department_id : "all",
		      }
		    }).then(function successCallback(response) {
		        response = response.data;
		        if(response.success == 1){		
		        	$scope.reportData = response.data;	
		        }
		        else{
		        	$scope.reportData = [];	
		        }
		        $scope.isLoading = false;
		    }, function errorCallback(response) {
		    	$scope.isLoading = true;
		    });
		}else{
			$scope.reportData = [];	
			$scope.isLoading = true;
		}
	}

});

app.controller("allDistrictFilledReportController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {

	if (!$rootScope.$storage.inc_user_id) {
		$location.path('/login');
	}

	if($rootScope.$storage.inc_userObj.incharge_type_id == 2500){
		$location.path("/dashboard");
	}

	if($routeParams.type){
		$scope.type = $rootScope.fromBase64($routeParams.type);
	}
	else{
		$scope.type = "";
	}

	$scope.report_type = "district";

	$scope.data_id = $rootScope.fromBase64($routeParams.row_id);
	$scope.incharge_type_id = $rootScope.fromBase64($routeParams.column_id);

	$scope.data = [];
	$scope.columns = [];
	$scope.incharge = {};
	$scope.single = {};

	$scope.loadingReport = false;

	$scope.loadUsers = function(){
		$scope.loadingReport = true;
		$scope.data = [];
		$http({
	      method: 'POST',
	      url: apiUrl + 'users/hierarchy_wise_user_list',
	      data : {
	      	 incharge_type_id : $scope.incharge_type_id,
	      	 data_id : $scope.data_id,
	      	 department_id : "all",
	      	 type : $scope.type
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.data = response.data;
	        	$scope.columns = response.columns;
	        }
	        else{
	        	$scope.data = [];
	        }
	        $scope.incharge = response.incharge;
	        $scope.single = response.single;
	        $scope.loadingReport = false;
	    }, function errorCallback(response) {
	    });
	}

	$scope.loadUsers();

});

app.controller("allDistrictTotalReportController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {

	if (!$rootScope.$storage.inc_user_id) {
		$location.path('/login');
	}

	if($rootScope.$storage.inc_userObj.incharge_type_id == 2500){
		$location.path("/dashboard");
	}
	if($routeParams.type){
		$scope.type = $rootScope.fromBase64($routeParams.type);
	}
	else{
		$scope.type = "";
	}

	$scope.report_type = "district";

	$scope.data_id = $rootScope.fromBase64($routeParams.row_id);
	$scope.incharge_type_id = $rootScope.fromBase64($routeParams.column_id);

	$scope.data = [];
	$scope.columns = [];
	$scope.incharge = {};
	$scope.single = {};

	$scope.loadingReport = false;

	$scope.loadUsers = function(){
		$scope.loadingReport = true;
		$scope.data = [];
		$http({
	      method: 'POST',
	      url: apiUrl + 'users/hierarchy_wise_user_list_empty',
	      data : {
	      	 incharge_type_id : $scope.incharge_type_id,
	      	 data_id : $scope.data_id,
	      	 department_id : "all",
	      	 type : $scope.type
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.data = response.data;
	        	$scope.columns = response.columns;
	        }
	        else{
	        	$scope.data = [];
	        }
	        $scope.incharge = response.incharge;
	        $scope.single = response.single;
	        $scope.loadingReport = false;
	    }, function errorCallback(response) {
	    });
	}

	$scope.loadUsers();

});


app.controller("allCorporationFilledReportController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {

	if (!$rootScope.$storage.inc_user_id) {
		$location.path('/login');
	}

	if($rootScope.$storage.inc_userObj.incharge_type_id == 2500){
		$location.path("/dashboard");
	}

	$scope.report_type = "corporation";

	$scope.data_id = $rootScope.fromBase64($routeParams.row_id);
	$scope.incharge_type_id = $rootScope.fromBase64($routeParams.column_id);

	$scope.data = [];
	$scope.columns = [];
	$scope.incharge = {};
	$scope.single = {};

	$scope.loadingReport = false;

	$scope.loadUsers = function(){
		$scope.loadingReport = true;
		$scope.data = [];
		$http({
	      method: 'POST',
	      url: apiUrl + 'users/hierarchy_wise_user_list',
	      data : {
	      	 incharge_type_id : $scope.incharge_type_id,
	      	 data_id : $scope.data_id,
	      	 department_id : "all",
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.data = response.data;
	        	$scope.columns = response.columns;
	        }
	        else{
	        	$scope.data = [];
	        }
	        $scope.incharge = response.incharge;
	        $scope.single = response.single;
	        $scope.loadingReport = false;
	    }, function errorCallback(response) {
	    });
	}

	$scope.loadUsers();

});

app.controller("allCorporationTotalReportController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {

	if (!$rootScope.$storage.inc_user_id) {
		$location.path('/login');
	}

	if($rootScope.$storage.inc_userObj.incharge_type_id == 2500){
		$location.path("/dashboard");
	}

	$scope.report_type = "corporation";

	$scope.data_id = $rootScope.fromBase64($routeParams.row_id);
	$scope.incharge_type_id = $rootScope.fromBase64($routeParams.column_id);

	$scope.data = [];
	$scope.columns = [];
	$scope.incharge = {};
	$scope.single = {};

	$scope.loadingReport = false;

	$scope.loadUsers = function(){
		$scope.loadingReport = true;
		$scope.data = [];
		$http({
	      method: 'POST',
	      url: apiUrl + 'users/hierarchy_wise_user_list_empty',
	      data : {
	      	 incharge_type_id : $scope.incharge_type_id,
	      	 data_id : $scope.data_id,
	      	 department_id : "all",
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.data = response.data;
	        	$scope.columns = response.columns;
	        }
	        else{
	        	$scope.data = [];
	        }
	        $scope.incharge = response.incharge;
	        $scope.single = response.single;
	        $scope.loadingReport = false;
	    }, function errorCallback(response) {
	    });
	}

	$scope.loadUsers();

});

app.controller("migrantLabourHelplineController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {
	
	$scope.labourObj = {};



	$scope.states = [];
	$scope.districts = [];
	$scope.assemblies = [];

	$scope.loadStates = function(){
		$http({
	      method: 'POST',
	      url: apiUrl + "volunteers_states",
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
	
	$scope.loadStates();

	$scope.loadDistricts = function(state_id){
		if(state_id){
			$http({
		      method: 'POST',
		      url: apiUrl + "volunteers_districts",
		      data: {
		      	state_id : state_id
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
		else{
			$scope.districts = [];
		}
	}

	$scope.loadAssemblies = function(district_id){
		if(district_id){
			$http({
		      method: 'POST',
		      url: apiUrl + "volunteers_assemblies",
		      data: {
		      	district_id : district_id
		      }
		    }).then(function successCallback(response) {
		        response = response.data;
		        if(response.success == 1){		
		        	$scope.assemblies = response.assemblies;
		        }
		        else{
		        	$scope.assemblies = [];
		        }
		    }, function errorCallback(response) {
		    });
		}
		else{
			$scope.assemblies = [];
		}
	}


	$scope.validateInchargeForm = {
		messages:{
			name:{required: "Please enter your Full Name!"},
			mobile:{required : "Please enter your Mobile Number!", maxlength: "Please enter a valid Mobile Number", minlength: "Please enter a valid Mobile Number"},
			location: {required: "Please enter your current location!"},
			state: {required: "Please select your state!"},
			what_help: {required: "Please enter about your needs!"}
		}
	}

	$scope.isSaving = false;
	$scope.saveText = "Save";

	$rootScope.saveVolunteer = function(form){	
		$scope.message = "";
		if(form.validate()){
			$scope.isSaving = true;
			$scope.saveText = "Saving...";
			$http({
		      method: 'POST',
		      url: apiUrl + 'labours_help/save',
		      data : $scope.labourObj
		    }).then(function successCallback(response) {
		    	$scope.message = "";
		        response = response.data;
		        $scope.isSaving = false;
		        $scope.saveText = "Save";
		        if(response.success == 1){		
		        	$scope.labourObj = {};
		        	$scope.districts = [];
		        	$scope.assemblies = [];
		        }
		        $scope.message = response.message;
		    }, function errorCallback(response) {
		    });
		}
	}


});

/** Manage Data End **/