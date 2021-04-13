app = angular.module("INCDTDC", ['ngRoute','base64', 'ngStorage', 'angular-md5', 'ngValidate', 'socialbase.sweetAlert', 'angularjs-dropdown-multiselect', 'ngSanitize', 'ui.bootstrap','ngFileUpload','bw.paging','checklist-model','daterangepicker','ngMaterial']);
app.$inject = ['SweetAlert'];
/*var rootUrl = 'http://demo3.coronation.in/aicc/';
var apiUrl  = 'http://demo3.coronation.in/aicc/api/services/';*/
// var rootUrl = 'http://192.168.50.66/incdtdc/beta/';
// var apiUrl  = 'http://192.168.50.66/incdtdc/api/services_beta/';

// var rootUrl = 'https://www.congressmembership.com/socialworkers/';
// var apiUrl  = 'https://www.congressmembership.com/socialworkers/api/services/';

// var rootUrl = 'https://www.congressmembership.com/chatbot/admin/';
// var apiUrl = 'https://www.congressmembership.com/chatbot/api/services/';

var rootUrl = 'https://www.incsmw.in/admin/';
var apiUrl = 'https://www.incsmw.in/api/services/';
var frontUrl = 'https://www.incsmw.in/';

// var rootUrl = 'https://www.congressmembership.com/beta/';
// var apiUrl  = 'https://www.congressmembership.com/api_beta/services_beta/';
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
		templateUrl : "templates/dashboard.html?v=0.0.5",
		controller : "dashboardController",
		title : "Dashboard"
	})
	$routeProvider.when("/login", {
		templateUrl : "templates/login.html?v=0.0.5",
		controller : "loginController",
		title : "Login"
	})
	
	// $routeProvider.when("/workers/:volunteer_type/update/:interviewer_id/", {
	// 	templateUrl : "templates/interviewers/form.html?v=0.0.5",
	// 	controller : "interviewersFormController",
	// 	title : "INCDTDC"
	// })
	// $routeProvider.when("/workers/:volunteer_type/create", {
	// 	templateUrl : "templates/interviewers/form.html?v=0.0.5",
	// 	controller : "interviewersFormController",
	// 	title : "INCDTDC"
	// })
	$routeProvider.when("/workers/interviewers-panel/create", {
		templateUrl : "templates/interviewers-panel/form.html?v=0.0.5",
		controller : "interviewersPanelFormController",
		title : "INCDTDC"
	})
	
	$routeProvider.when("/workers/:volunteer_type/create", {
		templateUrl : "templates/interviewers/form.html?v=0.0.5",
		controller : "interviewersFormController",
		title : "INCDTDC"
	})

	$routeProvider.when("/workers/:volunteer_type/update/:interviewer_id/", {
		templateUrl : "templates/interviewers/form.html?v=0.0.5",
		controller : "interviewersFormController",
		title : "INCDTDC"
	})
	$routeProvider.when("/workers/interviewers/", {
		templateUrl : "templates/interviewers/list.html?v=0.0.5",
		controller : "interviewersController",
		title : "INCDTDC"
	})
	$routeProvider.when("/workers/interviewers/:panel_id", {
		templateUrl : "templates/interviewers/list.html?v=0.0.5",
		controller : "interviewersController",
		title : "INCDTDC"
	})
	$routeProvider.when("/workers/interviewers/import", {
		templateUrl : "templates/interviewers/upload.html",
		controller : "uploadInterviewersController",
		title : "INCDTDC"
	})
	$routeProvider.when("/workers/socialchat", {
		templateUrl : "templates/socialchat/list.html?v=0.0.5",
		controller : "socialchatController",
		title : "INCDTDC"
	})
	$routeProvider.when("/workers/socialchat/:state_id", {
		templateUrl : "templates/socialchat/list.html?v=0.0.5",
		controller : "socialchatController",
		title : "INCDTDC"
	})
	$routeProvider.when("/workers/socialchat/details/:user_id", {
		templateUrl : "templates/socialchat/details.html?v=0.0.5",
		controller : "socialchatDetailsController",
		title : "INCDTDC"
	})
	$routeProvider.when("/workers/google_socialchat/details/:user_id", {
		templateUrl : "templates/socialchat/google_details.html?v=0.0.5",
		controller : "socialchatGoogleDetailsController",
		title : "INCDTDC"
	})
	$routeProvider.when("/workers/ioc_socialchat/details/:user_id", {
		templateUrl : "templates/socialchat/ioc_details.html?v=0.0.5",
		controller : "iocSocialchatDetailsController",
		title : "INCDTDC"
	})
	$routeProvider.when("/workers/interviewers-panel", {
		templateUrl : "templates/interviewers-panel/list.html?v=0.0.5",
		controller : "interviewersPanelController",
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


app.directive('contenteditable', ['$sce', function($sce) {
  return {
    restrict: 'A', // only activate on element attribute
    require: '?ngModel', // get a hold of NgModelController
    link: function(scope, element, attrs, ngModel) {
      if (!ngModel) return; // do nothing if no ng-model

      // Specify how UI should be updated
      ngModel.$render = function() {
        element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
      };

      // Listen for change events to enable binding
      element.on('blur keyup change', function() {
        scope.$evalAsync(read);
      });
      read(); // initialize

      // Write data to the model
      function read() {
        var html = element.html();
        // When we clear the content editable the browser leaves a <br> behind
        // If strip-br attribute is provided then we strip this out
        if ( attrs.stripBr && html == '<br>' ) {
          html = '';
        }
        ngModel.$setViewValue(html);
      }
    }
  };
}]);

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
		social_chat_user_id : null,
		social_userObj : null,
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


	if($rootScope.$storage.social_chat_user_id == "1" || $rootScope.$storage.social_chat_user_id == "7"){
		console.log("here");
		$rootScope.volunteer_types = ['supporters', 'social_media','social_media_chat',"with_congress", 'main_congress', 'frontal_departments', 'voters', 'interviewers', 'socialchat'];
	}
	else{
		console.log("there");
		$rootScope.volunteer_types = ['supporters', 'social_media','social_media_chat','main_congress', 'frontal_departments', 'voters', 'interviewers', 'socialchat'];
	}

	console.log($rootScope.volunteer_types);

	$rootScope.volunteer_titles = [];

	$rootScope.volunteer_titles['supporters'] = "Supporters";
	$rootScope.volunteer_titles['social_media'] = "Social Media";
	$rootScope.volunteer_titles['social_media_chat'] = "Social Media (Chat)";
	$rootScope.volunteer_titles['with_congress'] = "Social Media (W.C.)";
	$rootScope.volunteer_titles['main_congress'] = "Main Congress";
	$rootScope.volunteer_titles['frontal_departments'] = "Frontal Cell Departments";
	$rootScope.volunteer_titles['voters'] = "Voters";
	$rootScope.volunteer_titles['interviewers'] = "Interviewers";
	$rootScope.volunteer_titles['socialchat'] = "Socialchat";

	console.log($rootScope.volunteer_titles, "vol");

	$scope.isMenuHidden = false;

	$rootScope.hideMenu = function(){
		$scope.isMenuHidden = true;
	}

	$rootScope.showMenu = function(){
		$scope.isMenuHidden = false;
	}

	if (!$rootScope.$storage.social_chat_user_id) {
		if($location.path().indexOf("GPCCEnroller") > 0){
		}
		else{
			$location.path('/login');
		}
	}
	$scope.signOut = function(){
		$rootScope.$storage.social_chat_user_id = null;
		$rootScope.$storage.social_userObj = {};
		$location.path("/login")
	}
	$scope.navigation = [];
	var api = "hierarchy/hierarchy_list";
	$rootScope.loadNavigation = function(){
		$scope.navigation = [];
		if($rootScope.$storage.social_userObj && $rootScope.$storage.social_userObj.state_id){
			api = "hierarchy/navigation";
		}
		$http({
	      method: 'POST',
	      url: apiUrl + api,
	      data : {
	      	user_id : $rootScope.$storage.social_userObj.user_id,
	      	state_id : $rootScope.$storage.social_userObj.state_id,
	      	incharge_type_id : $rootScope.$storage.social_userObj.incharge_type_id
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.navigation = response.hierarchies;
	        }
	    }, function errorCallback(response) {
	    });
	}
	if($rootScope.$storage.social_chat_user_id){
		$rootScope.loadNavigation();
	}

	/*$scope.stateCounters = [];
	$rootScope.dashboardCounter = function(){
		$http({
	      method: 'POST',
	      url: apiUrl + 'get_dashboard_socail_chat_counters',
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.stateCounters = response.states;
	        } else {
	        	$scope.stateCounters = [];
	        }
	    }, function errorCallback(response) {
	    });
	}
	$rootScope.dashboardCounter();*/

	$scope.dashboardfilterObj = {};
	$scope.dashboardfilterObj.date = {startDate:  null, endDate: null};
	$scope.stateCounters = [];
	$rootScope.dashboardCounter = function(){
		$http({
	      method: 'POST',
	      url: apiUrl + 'get_dashboard_socail_chat_counters',
	      data : {
      		from_date: $scope.dashboardfilterObj.date.startDate ? moment($scope.dashboardfilterObj.date.startDate).format("YYYY-MM-DD") : "",
        	to_date: $scope.dashboardfilterObj.date.endDate ? moment($scope.dashboardfilterObj.date.endDate).format("YYYY-MM-DD") : "",
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.stateCounters = response.states;
	        	$scope.countryCounters = response.countries;
	        	$scope.total_records = response.total_records;
	        	$scope.total_records_google = response.total_records_google;
	        	$scope.grand_total_records = response.grand_total_records;
	        	$scope.country_total_record = response.country_total_record;
	        } else {
	        	$scope.stateCounters = [];
	        }
	    }, function errorCallback(response) {
	    });
	}
	$rootScope.dashboardCounter();

	$scope.clearDateReport = function () {
        $scope.dashboardfilterObj = {};
		$scope.dashboardfilterObj.date = {startDate:  null, endDate: null};
        $rootScope.dashboardCounter();
    }

	$scope.options = {
     	applyClass: 'btn-green',
      	locale: {
	        applyLabel: "Apply",
	        fromLabel: "From",
	        format: "MM-DD-YYYY",
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
	        if ($scope.dashboardfilterObj.date.startDate == null && $scope.dashboardfilterObj.date.endDate == null) {
	            $scope.dashboardfilterObj.date.startDate = moment().startOf('day');
	            $scope.dashboardfilterObj.date.endDate = moment();
	            $(".ranges li:first-child").addClass("active");
	        
	            $("#filter_date").val(moment().startOf('day').format("MM-DD-YYYY")+" - "+moment().format("MM-DD-YYYY"));
	        }
        	$rootScope.dashboardCounter();
      	}}
    }
 	$scope.clearSelection = function() {
 		$timeout(function () {
            $(".ranges li:first-child").removeClass("active");
        }, 100);
    }
});


app.controller("volunteersController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {

	if (!$rootScope.$storage.social_chat_user_id) {
		$location.path('/');
	}	

	$scope.volunteers = [];

	$scope.limit = 30;
	$scope.page = 1;
	$scope.totalRecords = 0;

	$scope.search = "";

	$scope.isLoading = false;

	$scope.volunteer_type = "";

	// if($routeParams.volunteer_type != ""){
	// 	if($rootScope.volunteer_types.indexOf($routeParams.volunteer_type) > -1){
	// 		$scope.volunteer_type = $routeParams.volunteer_type;
	// 	}
	// 	else{
	// 		$location.path('/');	
	// 	}
	// }
	// else{
	// 	$location.path('/');
	// }

	if($routeParams.state_id){
		$scope.state_id = $rootScope.fromBase64($routeParams.state_id);
	}
	else{
		$scope.state_id = "";
	}

	$scope.stateObj = {};

	$scope.update = function(userContent){
		console.log(userContent, "user");
	}

	$scope.loadUsers = function(page){
		$scope.users = [];
		$scope.isLoading = true;
		$http({
	      method: 'POST',
	      url: apiUrl + 'volunteers/list',
	      data : {
	      	 limit : $scope.limit,
			 page : page,
			 search : $scope.search,
			 volunteers_id : $rootScope.$storage.social_chat_user_id,
			 state_id : $scope.state_id,
			 volunteer_type : $scope.volunteer_type
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.users = response.users;
	        	$scope.totalRecords = response.total;
	        	$scope.stateObj = response.stateObj;
	        }
	        else{
	        	$scope.users = [];
	        	$scope.totalRecords = 0;
	        	$scope.stateObj = response.stateObj;
	        }
	        $scope.isLoading = false;
	    }, function errorCallback(response) {
	    });
	}

	$scope.loadUsers($scope.page);

	$scope.doSearch = function(search){
		$scope.search = search;
		$scope.loadUsers(1);
	}

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

app.controller("interviewersController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {

	if (!$rootScope.$storage.social_chat_user_id) {
		$location.path('/');
	}	

	// $scope.volunteers = [];

	// $scope.limit = 30;
	// $scope.page = 1;
	// $scope.totalRecords = 0;

	// $scope.search_string = "";

	$scope.isLoading = false;

	$scope.volunteer_type = "";

	// if($routeParams.volunteer_type != ""){
	// 	if($rootScope.volunteer_types.indexOf($routeParams.volunteer_type) > -1){
	// 		$scope.volunteer_type = $routeParams.volunteer_type;
	// 	}
	// 	else{
	// 		$location.path('/');	
	// 	}
	// }
	// else{
	// 	$location.path('/');
	// }

	// if($routeParams.state_id){
	// 	$scope.state_id = $rootScope.fromBase64($routeParams.state_id);
	// }
	// else{
	// 	$scope.state_id = "";
	// }

	// $scope.stateObj = {};

	// $scope.update = function(userContent){
	// 	console.log(userContent, "user");
	// }

	// $scope.loadUsers = function(page){
	// 	$scope.users = [];
	// 	$scope.isLoading = true;
	// 	$http({
	//       method: 'POST',
	//       url: apiUrl + 'interviewers/list',
	//       data : {
	//       	 limit : $scope.limit,
	// 		 page : page,
	// 		 search_string : $scope.search_string,
	// 		 volunteers_id : $rootScope.$storage.social_chat_user_id,
	// 		 state_id : $scope.state_id,
	// 		 volunteer_type : $scope.volunteer_type
	//       }
	//     }).then(function successCallback(response) {
	//         response = response.data;
	//         if(response.success == 1){		
	//         	$scope.users = response.users;
	//         	$scope.totalRecords = response.total;
	//         	$scope.stateObj = response.stateObj;
	//         }
	//         else{
	//         	$scope.users = [];
	//         	$scope.totalRecords = 0;
	//         	$scope.stateObj = response.stateObj;
	//         }
	//         $scope.isLoading = false;
	//     }, function errorCallback(response) {
	//     });
	// }

	// $scope.loadUsers($scope.page);

	$scope.curpage = 0;

    $scope.page_limit = 30;

	$scope.interviewers_list = [];

	$scope.stateObj = {};

	$scope.search_string = "";

	$scope.interviewersLoad = function(limit, page){

		$scope.isLoading = true;
		$http({
			method : 'POST',
			url : apiUrl + 'interviewers/list',
			data: {
				page: page,
				limit: $scope.page_limit,
				search_string : $scope.search_string,
				state_id : $routeParams.panel_id ? $routeParams.panel_id : "",
			},
		}).then(function successCallback(response) {
			response = response.data;
			if(response.success == 1){
				$scope.interviewers_list = response.interviewers;
				$scope.stateObj = response.stateObj;

				$scope.total_records = response.total_records;

				if($scope.total_records > $scope.page_limit){
					$scope.curpage = page + 1;
				}
			}
			else{
				$scope.interviewers_list = [];
				$scope.stateObj = {};
				$scope.total_records = "0";
			}
			$scope.isLoading = false;
		}, function errorCallback(response) {
			$scope.isLoading = false;
		});
	}

	$scope.interviewersLoad();


	// $scope.doSearch = function(search_string){
	// 	$scope.search_string = search_string;
	// 	$scope.loadUsers(1);
	// }

	// $scope.removeInterviewers = function(interviewer_id){
	// 	var conf = confirm("Are you sure?");
	// 	if(conf){
	// 		$http({
	// 	      method: 'POST',
	// 	      url: apiUrl + 'interviewers/remove',
	// 	      data : {
	// 			 interviewer_id : interviewer_id
	// 	      }
	// 	    }).then(function successCallback(response) {
	// 	        response = response.data;
	// 	        if(response.success == 1){		
	// 	        	$scope.loadUsers($scope.page);
	// 	        }
	// 	    }, function errorCallback(response) {
	// 	    });
	// 	}
	// }

	$scope.removeInterviewers = function(interviewer_id, index){
        swal({
            text: "Are you sure, You want to perform this operation?",
            type: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#c2935b',
            confirmButtonColor: '#a4cdc1',
            confirmButtonText: 'Yes'
        }).then(function () {
            $http({
                method : 'POST',
                url: apiUrl + 'interviewers/remove',
                data : {
                    interviewer_id : interviewer_id,
                    from_app :true
                }
            }).then(function successCallback(response) {
                response = response.data;
                if(response.success == 1){
                    $scope.interviewers_list.splice(index, 1);
                    $scope.giftListLoad();
                }
                $mdToast.show({
                    template : '<md-toast class="md-toast error">'+response.message+'</md-toast>',
                    hideDelay : 2000,
                    position : 'bottom right'
                });
            }, function errorCallback(response) {
            });
        });
    }

});

app.controller("interviewersFormController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast, $filter) {

	if (!$rootScope.$storage.social_chat_user_id) {
		$location.path('/');
	}

	$scope.volunteerObj = {};

	$scope.volunteer_type = "";

	if($routeParams.volunteer_type != ""){
		if($rootScope.volunteer_types.indexOf($routeParams.volunteer_type) > -1){
			$scope.volunteer_type = $routeParams.volunteer_type;
		}
		else{
			$location.path('/');	
		}
	}
	else{
		$location.path('/');
	}

	$scope.departments = [];

	$scope.LoadDepartments = function(department_id){
		$http({
			method: 'POST',
			url: apiUrl + 'get_departments',
			data : {
				department_id : department_id
			},
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

	$scope.LoadDepartments();

	$scope.states = [];
	$scope.panels = [];
	$scope.districts = [];
	$scope.assemblies = [];

	$scope.what_same_as_mobile = true;
	$scope.tel_same_as_mobile = true;

	$scope.toggle_fb = false;


	$scope.copyMobileToWhats = function(mobile){

		if($scope.what_same_as_mobile){
			$scope.volunteerObj.whatsapp = mobile;
		}

	}

	$scope.copyMobileToTelegram = function(mobile){

		if($scope.tel_same_as_mobile){
			$scope.volunteerObj.telegram = mobile;
		}

	}

	$scope.loadStates = function(){
		$http({
	      method: 'POST',
	      url: apiUrl + "volunteers_states",
	      data : {
	      	 // user_id : $rootScope.$storage.social_chat_user_id
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
	
	$scope.loadStates();

	$scope.loadinterviewerPanel = function(state_id){
		if(state_id){
			$http({
		      method: 'POST',
		      url: apiUrl + "interviewer_Panel",
		      data: {
		      	state_id : state_id
		      }
		    }).then(function successCallback(response) {
		        response = response.data;
		        if(response.success == 1){		
		        	$scope.panels = response.interviewer_Panel;
		        }
		        else{
		        	$scope.panels = [];
		        }
		    }, function errorCallback(response) {
		    });
		}
		else{
			$scope.panels = [];
		}
	}

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

	// $scope.loadAssemblies = function(district_id){
	// 	if(district_id){
	// 		$http({
	// 	      method: 'POST',
	// 	      url: apiUrl + "volunteers_assemblies",
	// 	      data: {
	// 	      	district_id : district_id
	// 	      }
	// 	    }).then(function successCallback(response) {
	// 	        response = response.data;
	// 	        if(response.success == 1){		
	// 	        	$scope.assemblies = response.assemblies;
	// 	        }
	// 	        else{
	// 	        	$scope.assemblies = [];
	// 	        }
	// 	    }, function errorCallback(response) {
	// 	    });
	// 	}
	// 	else{
	// 		$scope.assemblies = [];
	// 	}
	// }


	$scope.loadVolunteerDetails = function(interviewer_id){
		if(interviewer_id){
			$http({
		      method: 'POST',
		      url: apiUrl + 'interviewers/details',
		      data : {
		      	interviewer_id : interviewer_id
		      }
		    }).then(function successCallback(response) {
		        response = response.data;
		        if(response.success == 1){		
		        	$scope.volunteerObj = response.interviewers;
		        	if($scope.volunteerObj.state_id){
		        		$scope.loadDistricts($scope.volunteerObj.state_id);
		        	}
		        	if($scope.volunteerObj.state_id){
		        		$scope.loadinterviewerPanel($scope.volunteerObj.state_id);
		        	}
		        	// if($scope.volunteerObj.district_id){
		        	// 	$scope.loadAssemblies($scope.volunteerObj.district_id);
		        	// }
		        	// if($scope.volunteerObj.id){
		        	// 	$scope.loadAssemblies($scope.volunteerObj.id);
		        	// }

		        	if(response.interviewers.facebook_page){
		        		$scope.toggle_fb = true;
		        	}

		        	$scope.what_same_as_mobile = false;
		        	$scope.tel_same_as_mobile = false;
		        }
		        else{
		        	$scope.volunteerObj = {};
		        }  
		    }, function errorCallback(response) {
		    });
		}	
	}

	if($routeParams.interviewer_id){
		$scope.loadVolunteerDetails($rootScope.fromBase64($routeParams.interviewer_id));
	}


	$scope.isSaving = false;
	$scope.saveText = "Save";

	$rootScope.saveVolunteer = function(form){	
		$scope.message = "";
		if(form.validate()){

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
	        formData.append("volunteer_type", $scope.volunteer_type);
	        
			$scope.isSaving = true;
			$scope.saveText = "Saving...";


			$http({
		      method: 'POST',
		      url: apiUrl + 'interviewers/save',
		      data: formData,
		      headers: {'Content-Type': undefined}
		      // data : $scope.volunteerObj
		    }).then(function successCallback(response) {
		        response = response.data;
		        $scope.isSaving = false;
		        $scope.saveText = "Save";
		        if(response.success == 1){
		        	$location.path('/workers/'+$scope.volunteer_type);
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

app.controller("uploadInterviewersController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {

	if (!$rootScope.$storage.social_chat_user_id) {
		$location.path('/');
	}

	$scope.volunteerObj = {};

	$scope.states = [];

	// $scope.volunteer_type = "";

	// if($routeParams.volunteer_type != ""){
	// 	if($rootScope.volunteer_types.indexOf($routeParams.volunteer_type) > -1){
	// 		$scope.volunteer_type = $routeParams.volunteer_type;
	// 	}
	// 	else{
	// 		$location.path('/');	
	// 	}
	// }
	// else{
	// 	$location.path('/');
	// }

	$scope.loadStates = function(){
		$http({
	      method: 'POST',
	      url: apiUrl + "volunteers_states",
	      data : {
	      	// user_id : $rootScope.$storage.social_user_id
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
	
	$scope.loadStates();

	
	$scope.isSaving = false;
	$scope.saveText = "Save";

	// $scope.volunteerObj = {};

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
	        // formData.append("user_id", $rootScope.$storage.social_user_id);
	        // formData.append("volunteer_type", $scope.volunteer_type);
	        
			$http({
		      method: 'POST',
		      url: apiUrl + 'interviewers/import',
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
		        	$location.path('/workers/interviewers');
		        	$mdToast.show({
						template : '<md-toast class="md-toast error">'+response.message+'</md-toast>',
						hideDelay : 3000,
						position : 'bottom right'
					}); 
		        }
		        else{
		        	$mdToast.show({
						template : '<md-toast class="md-toast error">'+response.message+'</md-toast>',
						hideDelay : 3000,
						position : 'bottom right'
					}); 
		        }  
		    }, function errorCallback(response) {
		    });
		}
	}


})

app.controller("interviewersPanelController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {

	if (!$rootScope.$storage.social_chat_user_id) {
		$location.path('/');
	}

	$scope.isLoading = false;

	$scope.curpage = 0;

    $scope.page_limit = 50000;

	$scope.interviewerpanels_list = [];

	$scope.stateObj = {};

	$scope.search_string = "";

	$scope.interviewersPanelLoad = function(limit, page){

		$scope.isLoading = true;
		$http({
			method : 'POST',
			url : apiUrl + 'interviewersPanel/list',
			data: {
				page: page,
				limit: $scope.page_limit,
				search_string : $scope.search_string
			},
		}).then(function successCallback(response) {
			response = response.data;
			if(response.success == 1){
				$scope.interviewerpanels_list = response.interviewer_panels;
				$scope.stateObj = response.stateObj;

				$scope.total_records = response.total_records;

				if($scope.total_records > $scope.page_limit){
					$scope.curpage = page + 1;
				}
			}
			else{
				$scope.interviewerpanels_list = [];
				$scope.stateObj = {};
				$scope.total_records = "0";
			}
			$scope.isLoading = false;
		}, function errorCallback(response) {
			$scope.isLoading = false;
		});
	}

	$scope.interviewersPanelLoad();

});

app.controller("interviewersPanelFormController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast, $filter) {

	if (!$rootScope.$storage.social_chat_user_id) {
		$location.path('/');
	}

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

	$rootScope.saveVolunteer = function(form){	
		$scope.message = "";
		if(form.validate()){

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
	        
			$scope.isSaving = true;
			$scope.saveText = "Saving...";

			$http({
		      method: 'POST',
		      url: apiUrl + 'interviewersPanel/save',
		      data: formData,
		      headers: {'Content-Type': undefined}
		    }).then(function successCallback(response) {
		        response = response.data;
		        $scope.isSaving = false;
		        $scope.saveText = "Save";
		        if(response.success == 1){
		        	$location.path('/workers/interviewers-panel/');
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

app.controller("socialchatController_8_2_2021", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {

	if (!$rootScope.$storage.social_chat_user_id) {
		$location.path('/');
	}	

	$scope.isLoading = false;

	$scope.volunteer_type = "";

	// if($routeParams.volunteer_type != ""){
	// 	if($rootScope.volunteer_types.indexOf($routeParams.volunteer_type) > -1){
	// 		$scope.volunteer_type = $routeParams.volunteer_type;
	// 	}
	// 	else{
	// 		$location.path('/');	
	// 	}
	// }
	// else{
	// 	$location.path('/');
	// }


	$scope.page = 1;
    $scope.limit = 10;
    $scope.totalRecords = 0;

	$scope.socialchat_list = [];

	$scope.search_string = "";

	$scope.states = {};
	$scope.state_id = "";

	$scope.socialchatLoad = function(page){

		$scope.isLoading = true;

		console.log(page, "page");

		$http({
			method : 'POST',
			url : apiUrl + 'socialchat/list',
			data: {
				page: page,
				limit: $scope.limit,
				search_string : $scope.search_string,
				state : $scope.state_id
			},
		}).then(function successCallback(response) {
			response = response.data;
			if(response.success == 1){
				$scope.socialchat_list = response.social_chat;
				$scope.totalRecords = response.total_records;

				// if($scope.total_records > $scope.page_limit){
				// 	$scope.page = page + 1;
				// }
			}
			else{
				$scope.socialchat_list = [];
				$scope.total_records = "0";
			}
			$scope.isLoading = false;
		}, function errorCallback(response) {
			$scope.isLoading = false;
		});
	}

	$scope.searchData = function(){
		$scope.page = 1;
		$scope.socialchatLoad($scope.page);
	}

	$scope.socialchatLoad($scope.page);

	
	$scope.loadStates = function(){
		$http({
	      method: 'POST',
	      url: apiUrl + "volunteers_states",
	      data : {
	      	 user_id : $rootScope.$storage.social_chat_user_id
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
	
	$scope.loadStates();

	$scope.loadStates = function(){
		$http({
	      method: 'POST',
	      url: apiUrl + "volunteers_states",
	      data : {
	      	 user_id : $rootScope.$storage.social_chat_user_id
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
	$scope.loadStates();

	$scope.filterByState = function(){
		$scope.page = 1;
		$scope.socialchatLoad($scope.page);
	}


	$scope.panelList = [];
	$scope.load_panle_by_state = function(state_id){
		if(state_id){
			$scope.socialchat_ids.social_id = [];
			$http({
		      method: 'POST',
		      url: apiUrl + "socialchat/load_panle_by_state",
		      data : {
		      	 state_id : state_id ? state_id : ""
		      }
		    }).then(function successCallback(response) {
		        response = response.data;
		        if(response.success == 1){		
		        	$scope.panelList = response.panels;
		        }
		        else{
		        	$scope.panelList = [];
		        }
		    }, function errorCallback(response) {
		    });
		} 
		
	}

	$scope.socialchat_ids = {};
	$scope.socialchat_ids.social_id = [];
	$scope.is_panel_submitting = false;
	$scope.Move_To_Panel = function(){
		if($scope.is_panel_submitting == false){
			$scope.is_panel_submitting = true;
			if($scope.socialchat_ids && $scope.socialchat_ids.social_id.length > 0){
				$http({
					method: 'POST',
					url: apiUrl + 'socialchat/move_to_panel',
					data : $scope.socialchat_ids,
				}).then(function successCallback(response) {
					response = response.data;
					if(response.success == 1){
						$scope.socialchat_ids= [];
						$mdToast.show({
							template : '<md-toast class="md-toast error">'+response.message+'</md-toast>',
							hideDelay : 2000,
							position : 'bottom right'
						});
					}
					$scope.is_panel_submitting = false;
					$scope.page = 1;
					$scope.socialchatLoad($scope.page);
				}, function errorCallback(response) {
					$scope.is_panel_submitting = false;
				});
			} else {
				$mdToast.show({
					template : '<md-toast class="md-toast error">'+response.message+'</md-toast>',
					hideDelay : 2000,
					position : 'bottom right'
				});
			}
		} 
	}
});

app.controller("socialchatController_9-2-2021", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {

	if (!$rootScope.$storage.social_chat_user_id) {
		$location.path('/');
	}	

	$scope.isLoading = false;

	$scope.volunteer_type = "";

	// if($routeParams.volunteer_type != ""){
	// 	if($rootScope.volunteer_types.indexOf($routeParams.volunteer_type) > -1){
	// 		$scope.volunteer_type = $routeParams.volunteer_type;
	// 	}
	// 	else{
	// 		$location.path('/');	
	// 	}
	// }
	// else{
	// 	$location.path('/');
	// }


	$scope.page = 1;
    $scope.limit = 10;
    $scope.totalRecords = 0;

	$scope.socialchat_list = [];

	$scope.search_string = "";

	$scope.states = {};
	$scope.state_id = "";


	$scope.socialchatLoad = function(page){
		$scope.isLoading = true;
		if($routeParams.state_id){
			$scope.state_id = $routeParams.state_id ? $rootScope.fromBase64($routeParams.state_id) : "";
		}

		$http({
			method : 'POST',
			url : apiUrl + 'socialchat/list',
			data: {
				page: page,
				limit: $scope.limit,
				search_string : $scope.search_string,
				state : $scope.state_id
			},
		}).then(function successCallback(response) {
			response = response.data;
			if(response.success == 1){
				$scope.socialchat_list = response.social_chat;
				$scope.totalRecords = response.total_records;

				// if($scope.total_records > $scope.page_limit){
				// 	$scope.page = page + 1;
				// }
			}
			else{
				$scope.socialchat_list = [];
				$scope.total_records = "0";
			}
			$scope.isLoading = false;
		}, function errorCallback(response) {
			$scope.isLoading = false;
		});
	}

	$scope.searchData = function(){
		$scope.page = 1;
		$scope.socialchatLoad($scope.page);
	}

	$scope.socialchatLoad($scope.page);

	
	$scope.loadStates = function(){
		$http({
	      method: 'POST',
	      url: apiUrl + "volunteers_states",
	      data : {
	      	 user_id : $rootScope.$storage.social_chat_user_id
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.states = response.states;

	        	if($routeParams.state_id){
	        		$scope.state_id = $rootScope.fromBase64($routeParams.state_id);
	        	}
	        }
	        else{
	        	$scope.states = [];
	        }
	    }, function errorCallback(response) {
	    });
	}
	
	$scope.loadStates();

	$scope.loadStates = function(){
		$http({
	      method: 'POST',
	      url: apiUrl + "volunteers_states",
	      data : {
	      	 user_id : $rootScope.$storage.social_chat_user_id
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.states = response.states;
	        	if($routeParams.state_id){
	        		$scope.state_id = $rootScope.fromBase64($routeParams.state_id);
	        	}
	        }
	        else{
	        	$scope.states = [];
	        }
	    }, function errorCallback(response) {
	    });
	}
	$scope.loadStates();

	$scope.filterByState = function(){
		if($routeParams.state_id){
			$location.path("workers/socialchat/"+$rootScope.toBase64($scope.state_id));
		}
		$scope.page = 1;
		$scope.socialchatLoad($scope.page);
		

	}


	$scope.panelList = [];
	$scope.load_panle_by_state = function(state_id){
		if(state_id){
			$scope.socialchat_ids.social_id = [];
			$http({
		      method: 'POST',
		      url: apiUrl + "socialchat/load_panle_by_state",
		      data : {
		      	 state_id : state_id ? state_id : ""
		      }
		    }).then(function successCallback(response) {
		        response = response.data;
		        if(response.success == 1){		
		        	$scope.panelList = response.panels;
		        }
		        else{
		        	$scope.panelList = [];
		        }
		    }, function errorCallback(response) {
		    });
		} 
		
	}

	$scope.socialchat_ids = {};
	$scope.socialchat_ids.social_id = [];
	$scope.is_panel_submitting = false;
	$scope.Move_To_Panel = function(){
		if($scope.is_panel_submitting == false){
			$scope.is_panel_submitting = true;
			if($scope.socialchat_ids && $scope.socialchat_ids.social_id.length > 0){
				$http({
					method: 'POST',
					url: apiUrl + 'socialchat/move_to_panel',
					data : $scope.socialchat_ids,
				}).then(function successCallback(response) {
					response = response.data;
					if(response.success == 1){
						$scope.socialchat_ids= [];
						$mdToast.show({
							template : '<md-toast class="md-toast error">'+response.message+'</md-toast>',
							hideDelay : 2000,
							position : 'bottom right'
						});
					}
					$scope.is_panel_submitting = false;
					$scope.page = 1;
					$scope.socialchatLoad($scope.page);
				}, function errorCallback(response) {
					$scope.is_panel_submitting = false;
				});
			} else {
				$mdToast.show({
					template : '<md-toast class="md-toast error">'+response.message+'</md-toast>',
					hideDelay : 2000,
					position : 'bottom right'
				});
			}
		} 
	}
});

app.controller("socialchatDetailsController_9_2_2021", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {

	if (!$rootScope.$storage.social_chat_user_id) {
		$location.path('/');
	}	
	if(!$routeParams.user_id){
		$location.path('workers/socialchat');
	}
	$scope.userDetails = [];
	$scope.userDetails = function(){
		$http({
			method: 'POST',
			url: apiUrl + "social_chat_details",
			data :{
				user_id : $routeParams.user_id ? $rootScope.fromBase64($routeParams.user_id) : "",
			}
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.userDetails = response.user;
	        } else {
	        	$scope.userDetails = [];
	        }
	    }, function errorCallback(response) {
	    });
	}
	
	$scope.userDetails();

});
app.controller("socialchatController_12_2_2021", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {

	if (!$rootScope.$storage.social_chat_user_id) {
		$location.path('/');
	}	

	$scope.isLoading = false;

	$scope.volunteer_type = "";

	$scope.activeTab = "socialchat";

	// if($routeParams.volunteer_type != ""){
	// 	if($rootScope.volunteer_types.indexOf($routeParams.volunteer_type) > -1){
	// 		$scope.volunteer_type = $routeParams.volunteer_type;
	// 	}
	// 	else{
	// 		$location.path('/');	
	// 	}
	// }
	// else{
	// 	$location.path('/');
	// }


	$scope.page = 1;
    $scope.limit = 10;
    $scope.totalRecords = 0;

    

	$scope.socialchat_list = [];

	$scope.search_string = "";

	$scope.states = {};
	$scope.filterObj = {};
	$scope.filterObj.date = {startDate:  null, endDate: null};
	$scope.filterObj.state_id = "";
	$scope.district_id = "";


	$scope.socialchatLoad = function(page){
		$scope.isLoading = true;
		if($routeParams.state_id){
			$scope.state_id = $routeParams.state_id ? $rootScope.fromBase64($routeParams.state_id) : "";
		}
		$scope.exportLink = "";
		$http({
			method : 'POST',
			url : apiUrl + 'socialchat/list',
			data: {
				page: page,
				limit: $scope.limit,
				search_string : $scope.search_string,
				state : $scope.filterObj.state_id ? $scope.filterObj.state_id : "",
				district : $scope.filterObj.district_id ? $scope.filterObj.district_id : "",
				from_date: $scope.filterObj.date.startDate ? moment($scope.filterObj.date.startDate).format("YYYY-MM-DD") : "",
            	to_date: $scope.filterObj.date.endDate ? moment($scope.filterObj.date.endDate).format("YYYY-MM-DD") : "",
			},
		}).then(function successCallback(response) {
			response = response.data;
			if(response.success == 1){

				$scope.linkParam = "";
				if($scope.state_id){
					$scope.linkParam = $scope.linkParam + "&state="+$scope.state_id;	
				}
				if($scope.district_id){
					$scope.linkParam = $scope.linkParam + "&district="+$scope.district_id;	
				}
				if($scope.from_date){
					$scope.linkParam = $scope.linkParam + "&from_date="+moment($scope.filterObj.date.startDate).format("YYYY-MM-DD");	
				}
				if($scope.to_date){
					$scope.linkParam = $scope.linkParam + "&to_date"+moment($scope.filterObj.date.endDate).format("YYYY-MM-DD");	
				}
				$scope.exportLink = frontUrl+"export/export_social_chat.php?1=1"+$scope.linkParam;

				$scope.socialchat_list = response.social_chat;
				$scope.totalRecords = response.total_records;

				if($scope.total_records > $scope.page_limit){
					$scope.page = page + 1;
				}
			}
			else{
				$scope.socialchat_list = [];
				$scope.total_records = "0";
			}
			$scope.isLoading = false;
		}, function errorCallback(response) {
			$scope.isLoading = false;
		});
	}

	$scope.searchData = function(){
		$scope.page = 1;
		$scope.socialchatLoad($scope.page);
	}

	$scope.socialchatLoad($scope.page);

	
	$scope.loadStates = function(){
		$http({
	      method: 'POST',
	      url: apiUrl + "volunteers_states",
	      data : {
	      	 user_id : $rootScope.$storage.social_chat_user_id
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.states = response.states;
	        	$scope.districts = [];
	        	if($routeParams.state_id){
	        		$scope.state_id = $rootScope.fromBase64($routeParams.state_id);
	        	}
	        }
	        else{
	        	$scope.districts = [];
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
		        } else {
		        	$scope.districts = [];
		        }
		    }, function errorCallback(response) {
		    });
		} else {
			$scope.districts = [];
		}
	}	
	if($routeParams.state_id){
		$scope.loadDistricts($rootScope.fromBase64($routeParams.state_id));
	}


	$scope.filterByState = function(){
		if($routeParams.state_id){
			$location.path("workers/socialchat/"+$rootScope.toBase64($scope.state_id));
		}

		$scope.page = 1;
		$scope.socialchatLoad($scope.page);
	}


	$scope.panelList = [];
	$scope.load_panle_by_state = function(state_id){
		if(state_id){
			$scope.socialchat_ids.social_id = [];
			$http({
		      method: 'POST',
		      url: apiUrl + "socialchat/load_panle_by_state",
		      data : {
		      	 state_id : state_id ? state_id : ""
		      }
		    }).then(function successCallback(response) {
		        response = response.data;
		        if(response.success == 1){		
		        	$scope.panelList = response.panels;
		        }
		        else{
		        	$scope.panelList = [];
		        }
		    }, function errorCallback(response) {
		    });
		} 
		
	}

	$scope.socialchat_ids = {};
	$scope.socialchat_ids.social_id = [];
	$scope.is_panel_submitting = false;
	$scope.Move_To_Panel = function(){
		if($scope.is_panel_submitting == false){
			$scope.is_panel_submitting = true;
			if($scope.socialchat_ids && $scope.socialchat_ids.social_id.length > 0){
				$http({
					method: 'POST',
					url: apiUrl + 'socialchat/move_to_panel',
					data : $scope.socialchat_ids,
				}).then(function successCallback(response) {
					response = response.data;
					if(response.success == 1){
						$scope.socialchat_ids= [];
						$mdToast.show({
							template : '<md-toast class="md-toast error">'+response.message+'</md-toast>',
							hideDelay : 2000,
							position : 'bottom right'
						});
					}
					$scope.is_panel_submitting = false;
					$scope.page = 1;
					$scope.socialchatLoad($scope.page);
				}, function errorCallback(response) {
					$scope.is_panel_submitting = false;
				});
			} else {
				$mdToast.show({
					template : '<md-toast class="md-toast error">'+response.message+'</md-toast>',
					hideDelay : 2000,
					position : 'bottom right'
				});
			}
		} 
	}



	$scope.clearDateReport = function () {
        $scope.filterObj.date = {startDate:  null, endDate: null};
        $scope.socialchatLoad(1);
    }
    
    $scope.options = {
     	applyClass: 'btn-green',
      	locale: {
	        applyLabel: "Apply",
	        fromLabel: "From",
	        format: "MM-DD-YYYY",
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
	        if ($scope.filterObj.date.startDate == null && $scope.filterObj.date.endDate == null) {
	            $scope.filterObj.date.startDate = moment().startOf('day');
	            $scope.filterObj.date.endDate = moment();
	            $(".ranges li:first-child").addClass("active");
	        
	            $("#filter_date").val(moment().startOf('day').format("MM-DD-YYYY")+" - "+moment().format("MM-DD-YYYY"));
	        }
        	$scope.socialchatLoad(1);
      	}}
    }
 	$scope.clearSelection = function() {
        $timeout(function () {
            $(".ranges li:first-child").removeClass("active");
        }, 100);
    }


    $scope.page_google = 1;
    $scope.limit_google = 10;
    $scope.totalRecords_google = 0;
    $scope.socialchat_list_google = [];
    $scope.filterGoogleObj = {};
    $scope.filterGoogleObj.search_string = "";
	$scope.filterGoogleObj.date = {startDate:  null, endDate: null};
	$scope.filterGoogleObj.google_state_id = "";
    $scope.socialchatLoadGoogle = function(page){
    	console.log($scope.filterGoogleObj.search_string)
		$scope.isLoading = true;
		$scope.exportLinkGoogle = "";
		$http({
			method : 'POST',
			url : apiUrl + 'google_form_socialchat/list',
			data: {
				page: page,
				limit: $scope.limit,
				search_string : $scope.filterGoogleObj.search_string ? $scope.filterGoogleObj.search_string : "",
				state : $scope.filterGoogleObj.google_state_id ? $scope.filterGoogleObj.google_state_id : "",
				from_date: $scope.filterGoogleObj.date.startDate ? moment($scope.filterGoogleObj.date.startDate).format("YYYY-MM-DD") : "",
            	to_date: $scope.filterGoogleObj.date.endDate ? moment($scope.filterGoogleObj.date.endDate).format("YYYY-MM-DD") : "",
			},
		}).then(function successCallback(response) {
			response = response.data;
			if(response.success == 1){

				$scope.linkParamGoogle = "";
				if($scope.filterGoogleObj.google_state_id){
					$scope.linkParamGoogle = $scope.linkParamGoogle + "&state="+$scope.filterGoogleObj.google_state_id;	
				}
				if($scope.from_date){
					$scope.linkParamGoogle = $scope.linkParamGoogle + "&from_date="+moment($scope.filterGoogleObj.date.startDate).format("YYYY-MM-DD");	
				}
				if($scope.to_date){
					$scope.linkParamGoogle = $scope.linkParamGoogle + "&to_date"+moment($scope.filterGoogleObj.date.endDate).format("YYYY-MM-DD");	
				}
				$scope.exportLinkGoogle = frontUrl+"export/export_google_social_chat.php?1=1"+$scope.linkParamGoogle;

				$scope.socialchat_list_google = response.social_chat;
				$scope.totalRecords_google = response.total_records;

				if($scope.totalRecords_google > $scope.page_limit_google){
					$scope.page_google = page + 1;
				}
			}
			else{
				$scope.socialchat_list_google = [];
				$scope.totalRecords_google = "0";
			}
			$scope.isLoading = false;
		}, function errorCallback(response) {
			$scope.isLoading = false;
		});
	}
	$scope.socialchatLoadGoogle($scope.page);
	$scope.clearDateReportGoogle = function () {
        $scope.filterGoogleObj.date = {startDate:  null, endDate: null};
        $scope.socialchatLoadGoogle(1);
    }
    $scope.searchDataGoogle = function(){
		$scope.page = 1;
		$scope.socialchatLoadGoogle($scope.page);
	}
    
    $scope.options = {
     	applyClass: 'btn-green',
      	locale: {
	        applyLabel: "Apply",
	        fromLabel: "From",
	        format: "MM-DD-YYYY",
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
	        if ($scope.filterGoogleObj.date.startDate == null && $scope.filterGoogleObj.date.endDate == null) {
	            $scope.filterGoogleObj.date.startDate = moment().startOf('day');
	            $scope.filterGoogleObj.date.endDate = moment();
	            $(".ranges li:first-child").addClass("active");
	        
	            $("#filter_date").val(moment().startOf('day').format("MM-DD-YYYY")+" - "+moment().format("MM-DD-YYYY"));
	        }
        	$scope.socialchatLoadGoogle(1);
      	}}
    }
 	$scope.clearSelectionGoogle = function() {
        $timeout(function () {
            $(".ranges li:first-child").removeClass("active");
        }, 100);
    }
    $scope.filterByStateGoogle = function(){
		if($routeParams.state_id){
			$location.path("workers/socialchat/"+$rootScope.toBase64($scope.state_id));
		}
		$scope.page = 1;
		$scope.socialchatLoadGoogle($scope.page);
	}
});
app.controller("socialchatController_11_2_2021", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {

	if (!$rootScope.$storage.social_chat_user_id) {
		$location.path('/');
	}	

	$scope.isLoading = false;

	$scope.volunteer_type = "";
	$scope.activeTab = "socialchat";

	//$scope.activeTab = "socialchat";

	// if($routeParams.volunteer_type != ""){
	// 	if($rootScope.volunteer_types.indexOf($routeParams.volunteer_type) > -1){
	// 		$scope.volunteer_type = $routeParams.volunteer_type;
	// 	}
	// 	else{
	// 		$location.path('/');	
	// 	}
	// }
	// else{
	// 	$location.path('/');
	// }


	$scope.page = 1;
    $scope.limit = 10;
    $scope.totalRecords = 0;

	$scope.socialchat_list = [];

	$scope.search_string = "";

	$scope.states = {};
	$scope.filterObj = {};
	$scope.filterObj.date = {startDate:  null, endDate: null};
	$scope.state_id = "";
	$scope.district_id = "";


	$scope.socialchatLoad = function(page){
		$scope.isLoading = true;
		if($routeParams.state_id){
			$scope.state_id = $routeParams.state_id ? $rootScope.fromBase64($routeParams.state_id) : "";
		}
		$scope.exportLink = "";
		$http({
			method : 'POST',
			url : apiUrl + 'socialchat/list',
			data: {
				page: page,
				limit: $scope.limit,
				search_string : $scope.search_string,
				state : $scope.state_id,
				district : $scope.district_id,
				from_date: $scope.filterObj.date.startDate ? moment($scope.filterObj.date.startDate).format("YYYY-MM-DD") : "",
            	to_date: $scope.filterObj.date.endDate ? moment($scope.filterObj.date.endDate).format("YYYY-MM-DD") : "",
			},
		}).then(function successCallback(response) {
			response = response.data;
			if(response.success == 1){

				$scope.linkParam = "";
				if($scope.state_id){
					$scope.linkParam = $scope.linkParam + "&state="+$scope.state_id;	
				}
				if($scope.district_id){
					$scope.linkParam = $scope.linkParam + "&district="+$scope.district_id;	
				}
				if($scope.from_date){
					$scope.linkParam = $scope.linkParam + "&from_date="+moment($scope.filterObj.date.startDate).format("YYYY-MM-DD");	
				}
				if($scope.to_date){
					$scope.linkParam = $scope.linkParam + "&to_date"+moment($scope.filterObj.date.endDate).format("YYYY-MM-DD");	
				}
				$scope.exportLink = frontUrl+"export/export_social_chat.php?1=1"+$scope.linkParam;

				$scope.socialchat_list = response.social_chat;
				$scope.totalRecords = response.total_records;

				// if($scope.total_records > $scope.page_limit){
				// 	$scope.page = page + 1;
				// }
			}
			else{
				$scope.socialchat_list = [];
				$scope.total_records = "0";
			}
			$scope.isLoading = false;
		}, function errorCallback(response) {
			$scope.isLoading = false;
		});
	}

	$scope.searchData = function(){
		$scope.page = 1;
		$scope.socialchatLoad($scope.page);
	}

	$scope.socialchatLoad($scope.page);

	
	$scope.loadStates = function(){
		$http({
	      method: 'POST',
	      url: apiUrl + "volunteers_states",
	      data : {
	      	 user_id : $rootScope.$storage.social_chat_user_id
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.states = response.states;
	        	$scope.districts = [];
	        	if($routeParams.state_id){
	        		$scope.state_id = $rootScope.fromBase64($routeParams.state_id);
	        	}
	        }
	        else{
	        	$scope.districts = [];
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
		        } else {
		        	$scope.districts = [];
		        }
		    }, function errorCallback(response) {
		    });
		} else {
			$scope.districts = [];
		}
	}	
	if($routeParams.state_id){
		$scope.loadDistricts($rootScope.fromBase64($routeParams.state_id));
	}


	$scope.filterByState = function(){
		if($routeParams.state_id){
			$location.path("workers/socialchat/"+$rootScope.toBase64($scope.state_id));
		}
		$scope.page = 1;
		$scope.socialchatLoad($scope.page);
	}


	$scope.panelList = [];
	$scope.load_panle_by_state = function(state_id){
		if(state_id){
			$scope.socialchat_ids.social_id = [];
			$http({
		      method: 'POST',
		      url: apiUrl + "socialchat/load_panle_by_state",
		      data : {
		      	 state_id : state_id ? state_id : ""
		      }
		    }).then(function successCallback(response) {
		        response = response.data;
		        if(response.success == 1){		
		        	$scope.panelList = response.panels;
		        }
		        else{
		        	$scope.panelList = [];
		        }
		    }, function errorCallback(response) {
		    });
		} 
		
	}

	$scope.socialchat_ids = {};
	$scope.socialchat_ids.social_id = [];
	$scope.is_panel_submitting = false;
	$scope.Move_To_Panel = function(){
		if($scope.is_panel_submitting == false){
			$scope.is_panel_submitting = true;
			if($scope.socialchat_ids && $scope.socialchat_ids.social_id.length > 0){
				$http({
					method: 'POST',
					url: apiUrl + 'socialchat/move_to_panel',
					data : $scope.socialchat_ids,
				}).then(function successCallback(response) {
					response = response.data;
					if(response.success == 1){
						$scope.socialchat_ids= [];
						$mdToast.show({
							template : '<md-toast class="md-toast error">'+response.message+'</md-toast>',
							hideDelay : 2000,
							position : 'bottom right'
						});
					}
					$scope.is_panel_submitting = false;
					$scope.page = 1;
					$scope.socialchatLoad($scope.page);
				}, function errorCallback(response) {
					$scope.is_panel_submitting = false;
				});
			} else {
				$mdToast.show({
					template : '<md-toast class="md-toast error">'+response.message+'</md-toast>',
					hideDelay : 2000,
					position : 'bottom right'
				});
			}
		} 
	}



	$scope.clearDateReport = function () {
        $scope.filterObj.date = {startDate:  null, endDate: null};
        $scope.socialchatLoad(1);
    }
    
    $scope.options = {
     	applyClass: 'btn-green',
      	locale: {
	        applyLabel: "Apply",
	        fromLabel: "From",
	        format: "MM-DD-YYYY",
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
	        if ($scope.filterObj.date.startDate == null && $scope.filterObj.date.endDate == null) {
	            $scope.filterObj.date.startDate = moment().startOf('day');
	            $scope.filterObj.date.endDate = moment();
	            $(".ranges li:first-child").addClass("active");
	        
	            $("#filter_date").val(moment().startOf('day').format("MM-DD-YYYY")+" - "+moment().format("MM-DD-YYYY"));
	        }
        	$scope.socialchatLoad(1);
      	}}
    }
 	$scope.clearSelection = function() {
        $timeout(function () {
            $(".ranges li:first-child").removeClass("active");
        }, 100);
    }


    $scope.page_google = 1;
    $scope.limit_google = 10;
    $scope.totalRecords_google = 0;
    $scope.socialchat_list_google = [];
    $scope.filterGoogleObj = {};
    $scope.filterGoogleObj.search_string = "";
	$scope.filterGoogleObj.date = {startDate:  null, endDate: null};
	$scope.filterGoogleObj.google_state_id = "";
    $scope.socialchatLoadGoogle = function(page){
    	console.log($scope.filterGoogleObj.search_string)
		$scope.isLoading = true;
		$scope.exportLinkGoogle = "";
		$http({
			method : 'POST',
			url : apiUrl + 'google_form_socialchat/list',
			data: {
				page: page,
				limit: $scope.limit,
				search_string : $scope.filterGoogleObj.search_string ? $scope.filterGoogleObj.search_string : "",
				state : $scope.filterGoogleObj.google_state_id ? $scope.filterGoogleObj.google_state_id : "",
				from_date: $scope.filterGoogleObj.date.startDate ? moment($scope.filterGoogleObj.date.startDate).format("YYYY-MM-DD") : "",
            	to_date: $scope.filterGoogleObj.date.endDate ? moment($scope.filterGoogleObj.date.endDate).format("YYYY-MM-DD") : "",
			},
		}).then(function successCallback(response) {
			response = response.data;
			if(response.success == 1){

				$scope.linkParamGoogle = "";
				if($scope.filterGoogleObj.google_state_id){
					$scope.linkParamGoogle = $scope.linkParamGoogle + "&state="+$scope.filterGoogleObj.google_state_id;	
				}
				if($scope.from_date){
					$scope.linkParamGoogle = $scope.linkParamGoogle + "&from_date="+moment($scope.filterGoogleObj.date.startDate).format("YYYY-MM-DD");	
				}
				if($scope.to_date){
					$scope.linkParamGoogle = $scope.linkParamGoogle + "&to_date"+moment($scope.filterGoogleObj.date.endDate).format("YYYY-MM-DD");	
				}
				$scope.exportLinkGoogle = frontUrl+"export/export_google_social_chat.php?1=1"+$scope.linkParamGoogle;

				$scope.socialchat_list_google = response.social_chat;
				$scope.totalRecords_google = response.total_records;

				if($scope.totalRecords_google > $scope.page_limit_google){
					$scope.page_google = page + 1;
				}
			}
			else{
				$scope.socialchat_list_google = [];
				$scope.totalRecords_google = "0";
			}
			$scope.isLoading = false;
		}, function errorCallback(response) {
			$scope.isLoading = false;
		});
	}
	$scope.socialchatLoadGoogle($scope.page);
	$scope.clearDateReportGoogle = function () {
        $scope.filterGoogleObj.date = {startDate:  null, endDate: null};
        $scope.socialchatLoadGoogle(1);
    }
    $scope.searchDataGoogle = function(){
		$scope.page = 1;
		$scope.socialchatLoadGoogle($scope.page);
	}
    
    $scope.options = {
     	applyClass: 'btn-green',
      	locale: {
	        applyLabel: "Apply",
	        fromLabel: "From",
	        format: "MM-DD-YYYY",
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
	        if ($scope.filterGoogleObj.date.startDate == null && $scope.filterGoogleObj.date.endDate == null) {
	            $scope.filterGoogleObj.date.startDate = moment().startOf('day');
	            $scope.filterGoogleObj.date.endDate = moment();
	            $(".ranges li:first-child").addClass("active");
	        
	            $("#filter_date").val(moment().startOf('day').format("MM-DD-YYYY")+" - "+moment().format("MM-DD-YYYY"));
	        }
        	$scope.socialchatLoadGoogle(1);
      	}}
    }
 	$scope.clearSelectionGoogle = function() {
        $timeout(function () {
            $(".ranges li:first-child").removeClass("active");
        }, 100);
    }
    $scope.filterByStateGoogle = function(){
		if($routeParams.state_id){
			$location.path("workers/socialchat/"+$rootScope.toBase64($scope.state_id));
		}
		$scope.page = 1;
		$scope.socialchatLoadGoogle($scope.page);
	}
});

app.controller("socialchatDetailsController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {

	if (!$rootScope.$storage.social_chat_user_id) {
		$location.path('/');
	}	
	if(!$routeParams.user_id){
		$location.path('workers/socialchat');
	}
	$scope.userDetails = [];
	$scope.userDetails = function(){
		$http({
			method: 'POST',
			url: apiUrl + "social_chat_details",
			data :{
				user_id : $routeParams.user_id ? $rootScope.fromBase64($routeParams.user_id) : "",
			}
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.userDetails = response.user;
	        } else {
	        	$scope.userDetails = [];
	        }
	    }, function errorCallback(response) {
	    });
	}
	
	$scope.userDetails();

});

app.controller("volunteersFormController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast, $filter) {

	if (!$rootScope.$storage.social_chat_user_id) {
		$location.path('/');
	}

	$scope.volunteerObj = {};

	$scope.volunteer_type = "";

	if($routeParams.volunteer_type != ""){
		if($rootScope.volunteer_types.indexOf($routeParams.volunteer_type) > -1){
			$scope.volunteer_type = $routeParams.volunteer_type;
		}
		else{
			$location.path('/');	
		}
	}
	else{
		$location.path('/');
	}

	$scope.departments = [];

	$scope.LoadDepartments = function(){
		$http({
			method: 'POST',
			url: apiUrl + 'get_departments',
			data : {

			},  
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

	$scope.LoadDepartments();

	$scope.states = [];
	$scope.districts = [];
	$scope.assemblies = [];

	$scope.what_same_as_mobile = true;
	$scope.tel_same_as_mobile = true;

	$scope.toggle_fb = false;


	$scope.copyMobileToWhats = function(mobile){

		if($scope.what_same_as_mobile){
			$scope.volunteerObj.whatsapp = mobile;
		}

	}

	$scope.copyMobileToTelegram = function(mobile){

		if($scope.tel_same_as_mobile){
			$scope.volunteerObj.telegram = mobile;
		}

	}

	$scope.loadStates = function(){
		$http({
	      method: 'POST',
	      url: apiUrl + "volunteers_states",
	      data : {
	      	 user_id : $rootScope.$storage.social_chat_user_id
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
		        	$scope.volunteerObj.date_of_birth = new Date(response.volunteer.date_of_birth);
		        	if($scope.volunteerObj.state_id){
		        		$scope.loadDistricts($scope.volunteerObj.state_id);
		        	}
		        	if($scope.volunteerObj.district_id){
		        		$scope.loadAssemblies($scope.volunteerObj.district_id);
		        	}

		        	if(response.volunteer.facebook_page){
		        		$scope.toggle_fb = true;
		        	}

		        	$scope.what_same_as_mobile = false;
		        	$scope.tel_same_as_mobile = false;
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
	$scope.maxdate = $filter('date')(new Date(), "yyyy-MM-dd");;

	console.log($scope.maxdate, "max date");

	$rootScope.saveVolunteer = function(form){	
		$scope.message = "";
		if(form.validate()){

			var formData = new FormData();

			$scope.volunteerObj.date_of_birth = $filter('date')($scope.volunteerObj.date_of_birth, "yyyy-MM-dd");

			angular.forEach($scope.volunteerObj, function(value, key){
	        	if(key == "meta"){
	        		formData.append(key, JSON.stringify(value));
	        	}
	        	else{
	        		formData.append(key, value);
	        	}
	        })
	        formData.append("noJson", "true");
	        formData.append("user_id", $rootScope.$storage.social_chat_user_id);
	        formData.append("volunteer_type", $scope.volunteer_type);
	        
			$scope.isSaving = true;
			$scope.saveText = "Saving...";


			$http({
		      method: 'POST',
		      url: apiUrl + 'volunteers/save',
		      data: formData,
		      headers: {'Content-Type': undefined}
		      // data : $scope.volunteerObj
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
		        	$location.path('/workers/'+$scope.volunteer_type);
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

	if (!$rootScope.$storage.social_chat_user_id) {
		$location.path('/');
	}

	$scope.volunteerObj = {};

	$scope.states = [];

	$scope.volunteer_type = "";

	if($routeParams.volunteer_type != ""){
		if($rootScope.volunteer_types.indexOf($routeParams.volunteer_type) > -1){
			$scope.volunteer_type = $routeParams.volunteer_type;
		}
		else{
			$location.path('/');	
		}
	}
	else{
		$location.path('/');
	}

	$scope.loadStates = function(){
		$http({
	      method: 'POST',
	      url: apiUrl + "volunteers_states",
	      data : {
	      	 user_id : $rootScope.$storage.social_chat_user_id
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
	        formData.append("user_id", $rootScope.$storage.social_chat_user_id);
	        formData.append("volunteer_type", $scope.volunteer_type);
	        
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
		        	$location.path('/workers/'+$scope.volunteer_type);
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
	if (!$rootScope.$storage.social_chat_user_id) {
		$location.path('/');
	}	
	$scope.dashboardblocks = [];

	$scope.states = [];
	$scope.districts = [];
	$scope.total = 0;
	$scope.with_congress_total = 0;
	$scope.incomplete_total = 0;

	$scope.activeStates = [];

	$scope.loadUserActiveStates = function(){

		$scope.activeStates = [];
		$http({
	      method: 'POST',
	      url: apiUrl + "volunteers_assigned_states",
	      data : {
	      	user_id : $rootScope.$storage.social_chat_user_id
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.activeStates = response.states;
	        	console.log($scope.activeStates, "active states");
	        }
	        else{
	        	$scope.activeStates = [];
	        }
	    }, function errorCallback(response) {
	    });
	}

	$scope.loadUserActiveStates();
		
	$scope.loadStates = function(){

		$scope.states = [];
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
			$scope.districts = [];
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

	$scope.setState = function(state_id){
		$scope.district_id = "";
		$scope.state_id = state_id;
		$scope.loadDistricts(state_id);
		$scope.loadDashboardCounts();
	}


	$scope.setDistrict = function(district_id){
		$scope.district_id = district_id;
		$scope.loadDashboardCounts();
	}

	

	$scope.loadDashboardCounts = function(){

		var api = "volunteers_dashboard";

		if($scope.state_id){
			api = "volunteers_dashboard_state_wise";
		}

		if($scope.district_id){
			api = "volunteers_dashboard_district_wise";
		}


		$scope.dashboardblocks = [];
		$http({
	      method: 'POST',
	      url: apiUrl + api,
	      data : {
	      	"state_id" : $scope.state_id,
	      	"district_id" : $scope.district_id,
	      	"user_id" : $rootScope.$storage.social_chat_user_id
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	
	        	$scope.dashboardblocks = response.types;
	        	// $scope.total = response.total;
	        	// $scope.with_congress_total = response.with_congress_total;
	        	// $scope.incomplete_total = response.incomplete_total;
	        }
	        else{
	        	$scope.dashboardblocks = [];
	        }
	        $scope.saving = false;			        
	    }, function errorCallback(response) {
	    	$scope.saving = false;
	    });

	}	

	$scope.loadDashboardCounts();
	
})
app.controller("loginController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {
	if ($rootScope.$storage.social_chat_user_id) {
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
			      url: apiUrl + 'volunteer_sign_in',
			      data : $scope.userObj
			    }).then(function successCallback(response) {
			        response = response.data;
			        if(response.success == 1){		
			        	$rootScope.$storage.social_chat_user_id = response.user.user_id;
			        	$rootScope.$storage.social_userObj = response.user;
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

app.controller("socialchatGoogleDetailsController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {

	if (!$rootScope.$storage.social_chat_user_id) {
		$location.path('/');
	}	
	if(!$routeParams.user_id){
		$location.path('workers/socialchat');
	}
	$scope.userDetails = [];
	$scope.getUserDetails = function(){
		$http({
			method: 'POST',
			url: apiUrl + "google_form_socialchat/details",
			data :{
				user_id : $routeParams.user_id ? $rootScope.fromBase64($routeParams.user_id) : "",
			}
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.userDetails = response.user;
	        } else {
	        	$scope.userDetails = [];
	        }
	    }, function errorCallback(response) {
	    });
	}
	
	$scope.getUserDetails();

});

app.controller("iocSocialchatDetailsController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {

	if (!$rootScope.$storage.social_chat_user_id) {
		$location.path('/');
	}	
	if(!$routeParams.user_id){
		$location.path('workers/socialchat');
	}
	$scope.userDetails = [];
	$scope.getUserDetails = function(){
		$http({
			method: 'POST',
			url: apiUrl + "socialchat_ioc/details",
			data :{
				user_id : $routeParams.user_id ? $rootScope.fromBase64($routeParams.user_id) : "",
			}
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.userDetails = response.user;
	        	console.log($scope.userDetails);
	        } else {
	        	$scope.userDetails = [];
	        }
	    }, function errorCallback(response) {
	    });
	}
	
	$scope.getUserDetails();

});
app.controller("socialchatController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, md5, $window, SweetAlert, $route, $base64, $timeout, $mdToast) {

	if (!$rootScope.$storage.social_chat_user_id) {
		$location.path('/');
	}	

	$scope.isLoading = false;

	$scope.volunteer_type = "";

	$scope.activeTab = "socialchat";

	// if($routeParams.volunteer_type != ""){
	// 	if($rootScope.volunteer_types.indexOf($routeParams.volunteer_type) > -1){
	// 		$scope.volunteer_type = $routeParams.volunteer_type;
	// 	}
	// 	else{
	// 		$location.path('/');	
	// 	}
	// }
	// else{
	// 	$location.path('/');
	// }


	$scope.page = 1;
    $scope.limit = 10;
    $scope.totalRecords = 0;

    

	$scope.socialchat_list = [];

	$scope.search_string = "";

	$scope.states = {};
	$scope.filterObj = {};
	$scope.filterObj.date = {startDate:  null, endDate: null};
	$scope.filterObj.state_id = "";
	$scope.district_id = "";


	$scope.socialchatLoad = function(page){
		$scope.isLoading = true;
		if($routeParams.state_id){
			$scope.filterObj.state_id = $routeParams.state_id ? $rootScope.fromBase64($routeParams.state_id) : "";
		}
		$scope.exportLink = "";
		$http({
			method : 'POST',
			url : apiUrl + 'socialchat/list',
			data: {
				page: page,
				limit: $scope.limit,
				search_string : $scope.search_string,
				state : $scope.filterObj.state_id ? $scope.filterObj.state_id : "",
				district : $scope.filterObj.district_id ? $scope.filterObj.district_id : "",
				from_date: $scope.filterObj.date.startDate ? moment($scope.filterObj.date.startDate).format("YYYY-MM-DD") : "",
            	to_date: $scope.filterObj.date.endDate ? moment($scope.filterObj.date.endDate).format("YYYY-MM-DD") : "",
			},
		}).then(function successCallback(response) {
			response = response.data;
			if(response.success == 1){

				$scope.linkParam = "";
				if($scope.state_id){
					$scope.linkParam = $scope.linkParam + "&state="+$scope.state_id;	
				}
				if($scope.district_id){
					$scope.linkParam = $scope.linkParam + "&district="+$scope.district_id;	
				}
				if($scope.from_date){
					$scope.linkParam = $scope.linkParam + "&from_date="+moment($scope.filterObj.date.startDate).format("YYYY-MM-DD");	
				}
				if($scope.to_date){
					$scope.linkParam = $scope.linkParam + "&to_date"+moment($scope.filterObj.date.endDate).format("YYYY-MM-DD");	
				}
				$scope.exportLink = frontUrl+"export/export_social_chat.php?1=1"+$scope.linkParam;

				$scope.socialchat_list = response.social_chat;
				$scope.totalRecords = response.total_records;

				if($scope.total_records > $scope.page_limit){
					$scope.page = page + 1;
				}
			}
			else{
				$scope.socialchat_list = [];
				$scope.total_records = "0";
			}
			$scope.isLoading = false;
		}, function errorCallback(response) {
			$scope.isLoading = false;
		});
	}

	$scope.searchData = function(){
		$scope.page = 1;
		$scope.socialchatLoad($scope.page);
	}

	$scope.socialchatLoad($scope.page);


	$scope.countries = [];
	$scope.loadCountry = function(){
		$http({
	      method: 'POST',
	      url: apiUrl + "volunteers_country",
	      data : {
	      	 user_id : $rootScope.$storage.social_chat_user_id
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.countries = response.country;
	        }else{
	        	$scope.countries = [];
	        }
	    }, function errorCallback(response) {
	    });
	}
	$scope.loadCountry();
	
	$scope.loadStates = function(){
		$http({
	      method: 'POST',
	      url: apiUrl + "volunteers_states",
	      data : {
	      	 user_id : $rootScope.$storage.social_chat_user_id
	      }
	    }).then(function successCallback(response) {
	        response = response.data;
	        if(response.success == 1){		
	        	$scope.states = response.states;
	        	$scope.districts = [];
	        	if($routeParams.state_id){
	        		$scope.filterObj.state_id = $rootScope.fromBase64($routeParams.state_id);
	        	}
	        } else {
	        	$scope.districts = [];
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
		        } else {
		        	$scope.districts = [];
		        }
		    }, function errorCallback(response) {
		    });
		} else {
			$scope.districts = [];
		}
	}	
	if($routeParams.state_id){
		$scope.loadDistricts($rootScope.fromBase64($routeParams.state_id));
	}


	$scope.filterByState = function(){
		if($routeParams.state_id){
			$location.path("workers/socialchat/"+$rootScope.toBase64($scope.filterObj.state_id));
		}

		$scope.page = 1;
		$scope.socialchatLoad($scope.page);
	}


	$scope.panelList = [];
	$scope.load_panle_by_state = function(state_id){
		/*if(state_id){
			$scope.socialchat_ids.social_id = [];
			$http({
		      method: 'POST',
		      url: apiUrl + "socialchat/load_panle_by_state",
		      data : {
		      	 state_id : state_id ? state_id : ""
		      }
		    }).then(function successCallback(response) {
		        response = response.data;
		        if(response.success == 1){		
		        	$scope.panelList = response.panels;
		        }
		        else{
		        	$scope.panelList = [];
		        }
		    }, function errorCallback(response) {
		    });
		}*/ 
		
	}

	$scope.socialchat_ids = {};
	$scope.socialchat_ids.social_id = [];
	$scope.is_panel_submitting = false;
	$scope.Move_To_Panel = function(){
		/*if($scope.is_panel_submitting == false){
			$scope.is_panel_submitting = true;
			if($scope.socialchat_ids && $scope.socialchat_ids.social_id.length > 0){
				$http({
					method: 'POST',
					url: apiUrl + 'socialchat/move_to_panel',
					data : $scope.socialchat_ids,
				}).then(function successCallback(response) {
					response = response.data;
					if(response.success == 1){
						$scope.socialchat_ids= [];
						$mdToast.show({
							template : '<md-toast class="md-toast error">'+response.message+'</md-toast>',
							hideDelay : 2000,
							position : 'bottom right'
						});
					}
					$scope.is_panel_submitting = false;
					$scope.page = 1;
					$scope.socialchatLoad($scope.page);
				}, function errorCallback(response) {
					$scope.is_panel_submitting = false;
				});
			} else {
				$mdToast.show({
					template : '<md-toast class="md-toast error">'+response.message+'</md-toast>',
					hideDelay : 2000,
					position : 'bottom right'
				});
			}
		}*/ 
	}



	$scope.clearDateReport = function () {
        $scope.filterObj.date = {startDate:  null, endDate: null};
        $scope.socialchatLoad(1);
    }
    
    $scope.options = {
     	applyClass: 'btn-green',
      	locale: {
	        applyLabel: "Apply",
	        fromLabel: "From",
	        format: "MM-DD-YYYY",
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
	        if ($scope.filterObj.date.startDate == null && $scope.filterObj.date.endDate == null) {
	            $scope.filterObj.date.startDate = moment().startOf('day');
	            $scope.filterObj.date.endDate = moment();
	            $(".ranges li:first-child").addClass("active");
	        
	            $("#filter_date").val(moment().startOf('day').format("MM-DD-YYYY")+" - "+moment().format("MM-DD-YYYY"));
	        }
        	$scope.socialchatLoad(1);
      	}}
    }
 	$scope.clearSelection = function() {
        $timeout(function () {
            $(".ranges li:first-child").removeClass("active");
        }, 100);
    }


    $scope.page_google = 1;
    $scope.limit_google = 10;
    $scope.totalRecords_google = 0;
    $scope.socialchat_list_google = [];
    $scope.filterGoogleObj = {};
    $scope.filterGoogleObj.search_string = "";
	$scope.filterGoogleObj.date = {startDate:  null, endDate: null};
	$scope.filterGoogleObj.google_state_id = "";
    $scope.socialchatLoadGoogle = function(page){
    	
		$scope.isLoading = true;
		$scope.exportLinkGoogle = "";
		$http({
			method : 'POST',
			url : apiUrl + 'google_form_socialchat/list',
			data: {
				page: page,
				limit: $scope.limit,
				search_string : $scope.filterGoogleObj.search_string ? $scope.filterGoogleObj.search_string : "",
				state : $scope.filterGoogleObj.google_state_id ? $scope.filterGoogleObj.google_state_id : "",
				from_date: $scope.filterGoogleObj.date.startDate ? moment($scope.filterGoogleObj.date.startDate).format("YYYY-MM-DD") : "",
            	to_date: $scope.filterGoogleObj.date.endDate ? moment($scope.filterGoogleObj.date.endDate).format("YYYY-MM-DD") : "",
			},
		}).then(function successCallback(response) {
			response = response.data;
			if(response.success == 1){

				$scope.linkParamGoogle = "";
				if($scope.filterGoogleObj.google_state_id){
					$scope.linkParamGoogle = $scope.linkParamGoogle + "&state="+$scope.filterGoogleObj.google_state_id;	
				}
				if($scope.from_date){
					$scope.linkParamGoogle = $scope.linkParamGoogle + "&from_date="+moment($scope.filterGoogleObj.date.startDate).format("YYYY-MM-DD");	
				}
				if($scope.to_date){
					$scope.linkParamGoogle = $scope.linkParamGoogle + "&to_date"+moment($scope.filterGoogleObj.date.endDate).format("YYYY-MM-DD");	
				}
				$scope.exportLinkGoogle = frontUrl+"export/export_google_social_chat.php?1=1"+$scope.linkParamGoogle;

				$scope.socialchat_list_google = response.social_chat;
				$scope.totalRecords_google = response.total_records;

				if($scope.totalRecords_google > $scope.page_limit_google){
					$scope.page_google = page + 1;
				}
			}
			else{
				$scope.socialchat_list_google = [];
				$scope.totalRecords_google = "0";
			}
			$scope.isLoading = false;
		}, function errorCallback(response) {
			$scope.isLoading = false;
		});
	}
	$scope.socialchatLoadGoogle($scope.page);
	$scope.clearDateReportGoogle = function () {
        $scope.filterGoogleObj.date = {startDate:  null, endDate: null};
        $scope.socialchatLoadGoogle(1);
    }
    $scope.searchDataGoogle = function(){
		$scope.page = 1;
		$scope.socialchatLoadGoogle($scope.page);
	}
    
    $scope.options = {
     	applyClass: 'btn-green',
      	locale: {
	        applyLabel: "Apply",
	        fromLabel: "From",
	        format: "MM-DD-YYYY",
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
	        if ($scope.filterGoogleObj.date.startDate == null && $scope.filterGoogleObj.date.endDate == null) {
	            $scope.filterGoogleObj.date.startDate = moment().startOf('day');
	            $scope.filterGoogleObj.date.endDate = moment();
	            $(".ranges li:first-child").addClass("active");
	        
	            $("#filter_date").val(moment().startOf('day').format("MM-DD-YYYY")+" - "+moment().format("MM-DD-YYYY"));
	        }
        	$scope.socialchatLoadGoogle(1);
      	}}
    }
 	$scope.clearSelectionGoogle = function() {
        $timeout(function () {
            $(".ranges li:first-child").removeClass("active");
        }, 100);
    }
    $scope.filterByStateGoogle = function(){
		$scope.page = 1;
		$scope.socialchatLoadGoogle($scope.page);
	}



















	$scope.page_international = 1;
    $scope.limit_international = 10;
    $scope.totalRecords_google = 0;
    $scope.socialchat_list_international = [];
    $scope.filterInternationalObj = {};
    $scope.filterInternationalObj.search_string = "";
	$scope.filterInternationalObj.date = {startDate:  null, endDate: null};
	$scope.filterInternationalObj.country_id = "";
    $scope.socialchatLoadInternational = function(page){
    	$scope.isLoading = true;
		$scope.exportLinkGoogle = "";
		$http({
			method : 'POST',
			url : apiUrl + 'socialchat_ioc/list',
			data: {
				page: page,
				limit: $scope.limit_international,
				search_string : $scope.filterInternationalObj.search_string ? $scope.filterInternationalObj.search_string : "",
				country_id : $scope.filterInternationalObj.country_id ? $scope.filterInternationalObj.country_id : "",
				from_date: $scope.filterInternationalObj.date.startDate ? moment($scope.filterInternationalObj.date.startDate).format("YYYY-MM-DD") : "",
            	to_date: $scope.filterInternationalObj.date.endDate ? moment($scope.filterInternationalObj.date.endDate).format("YYYY-MM-DD") : "",
			},
		}).then(function successCallback(response) {
			response = response.data;
			if(response.success == 1){

				$scope.linkParamIoc = "";
				if($scope.filterInternationalObj.country_id){
					$scope.linkParamIoc = $scope.linkParamIoc + "&country="+$scope.filterInternationalObj.country_id;	
				}
				if($scope.from_date){
					$scope.linkParamIoc = $scope.linkParamIoc + "&from_date="+moment($scope.filterInternationalObj.date.startDate).format("YYYY-MM-DD");	
				}
				if($scope.to_date){
					$scope.linkParamIoc = $scope.linkParamIoc + "&to_date"+moment($scope.filterInternationalObj.date.endDate).format("YYYY-MM-DD");	
				}
				$scope.exportLinkIoc = frontUrl+"export/export_ioc_social_chat.php?1=1"+$scope.linkParamIoc;

				$scope.socialchat_list_international = response.social_chat_ioc;
				$scope.totalRecords_international = response.total_records;

				if($scope.totalRecords_international > $scope.page_limit_google){
					$scope.page_international = page + 1;
				}
			}
			else{
				$scope.socialchat_list_international = [];
				$scope.totalRecords_international = "0";
			}
			$scope.isLoading = false;
		}, function errorCallback(response) {
			$scope.isLoading = false;
		});
	}
	$scope.socialchatLoadInternational($scope.page_international);
	$scope.clearDateReportInternational = function () {
        $scope.filterInternationalObj.date = {startDate:  null, endDate: null};
        $scope.socialchatLoadInternational(1);
    }
    $scope.searchDataInternational = function(){
		$scope.page_international = 1;
		$scope.socialchatLoadInternational($scope.page_international);
	}
    
    $scope.options = {
     	applyClass: 'btn-green',
      	locale: {
	        applyLabel: "Apply",
	        fromLabel: "From",
	        format: "MM-DD-YYYY",
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
	        if ($scope.filterInternationalObj.date.startDate == null && $scope.filterInternationalObj.date.endDate == null) {
	            $scope.filterInternationalObj.date.startDate = moment().startOf('day');
	            $scope.filterInternationalObj.date.endDate = moment();
	            $(".ranges li:first-child").addClass("active");
	        
	            $("#filter_date").val(moment().startOf('day').format("MM-DD-YYYY")+" - "+moment().format("MM-DD-YYYY"));
	        }
        	$scope.socialchatLoadInternational(1);
      	}}
    }
 	$scope.clearSelectionInternational = function() {
        $timeout(function () {
            $(".ranges li:first-child").removeClass("active");
        }, 100);
    }
    $scope.filterByCountryInternational = function(){
		$scope.page_international = 1;
		$scope.socialchatLoadInternational($scope.page_international);
	}

});