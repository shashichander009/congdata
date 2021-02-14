app = angular.module("socialchatbot", ['ngRoute','ngStorage','ngValidate','ngSanitize', 'ngFileUpload','base64']);
/*ngImgCrop*/

app.$inject = ['SweetAlert'];

var base_url = 'https://www.incsmw.in/';
var apiUrl = 'https://www.incsmw.in/api/';

// var base_url = 'http://192.168.50.66/socialchatbot/';
// var apiUrl = 'http://192.168.50.66/socialchatbot/api/';

app.config(['$locationProvider', '$routeProvider', '$validatorProvider',
function($locationProvider, $routeProvider, $validatorProvider) {


	$locationProvider.hashPrefix('');
	
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
		

    $routeProvider.when("/", {
        templateUrl: "templates/full-chat-form.html?ver=09-02-2021",
        controller: 'fullchatFormController',
        title: "Indian National Congress Social Media",
        parent_title: "",
    })

    $routeProvider.when("/referral/:ref_user", {
        templateUrl: "templates/full-chat-form.html?ver=09-02-2021",
        controller: 'fullchatFormController',
        title: "Indian National Congress Social Media",
        parent_title: "",
    })

    // $routeProvider.when("/registration", {
    //     templateUrl: "templates/chat-form.html?ver=09-02-2021",
    //     controller: 'chatFormController',
    //     title: "Indian National Congress Social Media",
    //     parent_title: "",
    // })

    // $routeProvider.when("/half/", {
    //     templateUrl: "templates/chat-container.html?ver=09-02-2021",
    //     controller: 'chatController',
    //     title: "Indian National Congress Social Media",
    //     parent_title: "",
    // })

	.otherwise({
		redirectTo : "/"
	});

	$locationProvider.html5Mode(true);

}]);

app.run(function($rootScope, $location, $localStorage, $http, $window, $routeParams,$filter) {
	$rootScope.$on('$routeChangeStart', function(evt, current, previous,$filter, next) {
		$rootScope.base_url = base_url;
		$rootScope.screenWidth = screen.width;
		$rootScope.activePath = $location.path();
		$rootScope.pageContent = "";
	});

	$rootScope.$on('$locationChangeStart',  function (event, next, current) {
        if (next.indexOf('/uploads/') > 0) {
            event.preventDefault();
        }
	});


	/*$rootScope.$on("$routeChangeSuccess", function(event, next, current) {


	});*/


});


app.directive('ngEnter', function() {
	return function(scope, element, attrs) {
		element.bind("keydown keypress", function(event) {
			if(event.which === 13) {
				scope.$apply(function(){
					scope.$eval(attrs.ngEnter, {'event': event});
				});

				event.preventDefault();
			}
		});
	};
});
app.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }            
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
app.directive('hires', function() {
  return {
    restrict: 'A',
    scope: { hires: '@' },
    link: function(scope, element, attrs) {
        element.one('load', function() {
            element.attr('src', scope.hires);
        });
    }
  };
});

app.directive("limitTo", [function() {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            var limit = parseInt(attrs.limitTo);
            angular.element(elem).on("keypress", function(e) {
                if (this.value.length == limit) e.preventDefault();
            });
        }
    }
}]);
app.directive('starRating',
    function () {
        return {
            restrict: 'A',
            template: '<ul class="rating" ng-class="{readonly: readonly}">'
                     + '    <li  ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">'
                     + '<i class="fa fa-star" aria-hidden="true"></i>'
                     + '</li>'
                     + '</ul>',
            scope: {
                readonly: '=',
                ratingValue: '=',
                max: '=',
                onRatingSelected: '&'
            },
            link: function (scope, elem, attrs) {
                var updateStars = function () {
                    scope.stars = [];
                    for (var i = 0; i < scope.max; i++) {
                        scope.stars.push({
                            filled: i < scope.ratingValue
                        });
                    }
                };

                scope.toggle = function (index) {
                    if (scope.readonly == undefined || scope.readonly === false) {
                        scope.ratingValue = index + 1;
                        scope.onRatingSelected({
                            rating: index + 1
                        });
                    }
                };

                scope.$watch('ratingValue',
                    function (oldVal, newVal) {
                        if (newVal) {
                            updateStars();
                        }
                    }
                );
            }
        };
    }
);

app.directive('ngSpace', function() {
	return function(scope, element, attrs) {
		element.bind("keydown keypress", function(event) {
			if(event.which === 32) {
				scope.$apply(function(){
					scope.$eval(attrs.ngSpace, {'event': event});
				});

				event.preventDefault();
			}
		});
	};
});
app.directive('scrollOnClick', function() {
  return {
    restrict: 'EA',
    template:'<a title="Scroll to Top" class="scrollup">Scroll</a>',
    link: function(scope, $elm) {
		$(window).scroll(function () {
            if ($(this).scrollTop() > 300) {
        		$('.scrollup').fadeIn();
            } else {
                $('.scrollup').fadeOut();
            }
    	});   
	  $elm.on('click', function() {
	    $("html,body").animate({scrollTop: '0px'}, "slow");
	  });
    }
  }
});
app.directive('ngEscape', function() {
	return function(scope, element, attrs) {
		element.bind("keydown keypress", function(event) {
			if(event.which === 27) {
				scope.$apply(function(){
					scope.$eval(attrs.ngEscape, {'event': event});
				});

				event.preventDefault();
			}
		});
	};
});

app.directive('focusClass', function(){
    return {
      link:function(scope, elem, attrs){
         elem.find('input').on('focus', function(){
            elem.toggleClass(attrs.focusClass);
         }).on('blur', function(){
            elem.toggleClass(attrs.focusClass);
         });
      }
    }
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

app.directive('ngFileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.ngFileModel);
            var isMultiple = attrs.multiple;
            var modelSetter = model.assign;
            element.bind('change', function () {
                var values = [];
                angular.forEach(element[0].files, function (item) {
					var value = {
                        name: item.name,
                        size: item.size,
						extension: item.name.substring(item.name.lastIndexOf('.')+1 , item.name.length),
                        url: URL.createObjectURL(item),
                        _file: item
                    };
                    values.push(value);
                });
                scope.$apply(function () {
                    if (isMultiple) {
                        modelSetter(scope, values);
                    } else {
                        modelSetter(scope, values[0]);
                    }
                });
            });
        }
    };
}]);


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

app.filter('dateSuffix', function($filter) {
  var suffixes = ["th", "st", "nd", "rd"];
  return function(input) {
    var dtfilter = $filter('date')(input, 'EEE, MMM dd');
    var day = parseInt(dtfilter.slice(-2));
    var relevantDigits = (day < 30) ? day % 20 : day % 30;
    var suffix = (relevantDigits <= 3) ? suffixes[relevantDigits] : suffixes[0];
    return dtfilter+suffix;
  };
});

app.controller("MainController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, $window, $route, $timeout, $sce, $filter, $base64) {

    $rootScope.toBase64 = function(string) {
        return $base64.encode(unescape(encodeURIComponent(string)));
    }


    $scope.copyToClipboard1 = function(url){
        var copyText = document.getElementById("copyUrl1");
        /* Select the text field */
        copyText.select();
        copyText.setSelectionRange(0, 99999); /*For mobile devices*/

        /* Copy the text inside the text field */
        document.execCommand("copy");
        // console.log(angular.element("#copyUrl").val());
        // document.execCommand('copy', false, angular.element("#copyUrl").val());
        alert("Reference link copied");

        $rootScope.closeSharePopup();

    }

        $rootScope.$storage = $localStorage.$default({
        language : "English",
        defaultNumber : 0,
        registrationObj : {
            name : ""
        },        
        currentAnswerObj : {
            answer : ""
        },
        currentQuestion : {
             name : "language",
            question_id : 1,
            question_english : "Greetings! Would you like to proceed in English or Hindi?",
            question_hindi : "Greetings! Would you like to proceed in English or Hindi?",
            question_type : "option",
            is_skip : false,
            answers : [
                {
                    answer_id : "1",
                    answer_english : "English",
                    answer_hindi : "English",
                },
                {
                    answer_id : "2",
                    answer_english : "à¤¹à¤¿à¤‚à¤¦à¥€",  
                    answer_hindi : "à¤¹à¤¿à¤‚à¤¦à¥€",  
                }
            ],
            is_answered : false,
            answer : "",
        },
        chat_messages : [
        {
            name : "language",
            question_id : 1,
            question_english : "Greetings! Would you like to proceed in English or Hindi?",
            question_hindi : "Greetings! Would you like to proceed in English or Hindi?",
            question_type : "option",
            is_skip : false,
            answers : [
                {
                    answer_id : "1",
                    answer_english : "English",
                    answer_hindi : "English",
                },
                {
                    answer_id : "2",
                    answer_english : "à¤¹à¤¿à¤‚à¤¦à¥€",  
                    answer_hindi : "à¤¹à¤¿à¤‚à¤¦à¥€",  
                }
            ],
            is_answered : false,
            answer : "",
        },
        {
            name : "intro",
            question_id : 2,
            question_english : "Welcome to the Social Media Warrior campaign of the Indian National Congress! <br /><br /> Under this campaign, INC Social Media team will be expanded at every village, city, state and national level in the country! <br /><br /> If you too believe in the ideology of the Congress party and want to contribute to the nation building, then let us be a part of the Congress Social Media Team! <br /><br /> You will be given responsibility at national, state or district level according to your qualifications and compatibility. <br /><br /> Let us join hands and fulfill our obligation to protect our democracy and build a modern India by being part of the world'\s largest democratic movement. <br /><br /> Please provide the following information that will help in giving you the corresponding responsibility! <br /><br /> Thank you ! <br /><br /> <iframe width='100%' height='315' src='https://www.youtube.com/embed/E7gWc7d0tOE' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>",
            question_hindi : "à¤­à¤¾à¤°à¤¤à¥€à¤¯ à¤°à¤¾à¤·à¥à¤Ÿà¥à¤°à¥€à¤¯ à¤•à¤¾à¤‚à¤—à¥à¤°à¥‡à¤¸ à¤•à¥‡ Social Media Warrior à¤…à¤­à¤¿à¤¯à¤¾à¤¨ à¤®à¥‡à¤‚ à¤†à¤ªà¤•à¤¾ à¤¸à¥à¤µà¤¾à¤—à¤¤ à¤¹à¥ˆà¥¤ <br /><br /> à¤‡à¤¸ à¤…à¤­à¤¿à¤¯à¤¾à¤¨ à¤•à¥‡ à¤¤à¤¹à¤¤ à¤¦à¥‡à¤¶ à¤•à¥‡ à¤¹à¤° à¤—à¤¾à¤‚à¤µ, à¤¶à¤¹à¤°, à¤°à¤¾à¤œà¥à¤¯ à¤”à¤° à¤°à¤¾à¤·à¥à¤Ÿà¥à¤°à¥€à¤¯ à¤¸à¥à¤¤à¤° à¤ªà¤° INC Social Media à¤Ÿà¥€à¤® à¤•à¤¾ à¤µà¤¿à¤¸à¥à¤¤à¤¾à¤° à¤•à¤¿à¤¯à¤¾ à¤œà¤¾à¤à¤—à¤¾à¥¤ <br /><br /> à¤…à¤—à¤° à¤†à¤ª à¤­à¥€ à¤•à¤¾à¤‚à¤—à¥à¤°à¥‡à¤¸ à¤•à¥€ à¤µà¤¿à¤šà¤¾à¤°à¤§à¤¾à¤°à¤¾ à¤®à¥‡à¤‚ à¤µà¤¿à¤¶à¥à¤µà¤¾à¤¸ à¤°à¤–à¤¤à¥‡ à¤¹à¥ˆà¤‚ à¤”à¤° à¤°à¤¾à¤·à¥à¤Ÿà¥à¤°à¤¨à¤¿à¤°à¥à¤®à¤¾à¤£ à¤®à¥‡à¤‚ à¤…à¤ªà¤¨à¤¾ à¤¯à¥‹à¤—à¤¦à¤¾à¤¨ à¤¦à¥‡à¤¨à¤¾ à¤šà¤¾à¤¹à¤¤à¥‡ à¤¹à¥ˆà¤‚ à¤¤à¥‹ à¤†à¤‡à¤ à¤•à¤¾à¤‚à¤—à¥à¤°à¥‡à¤¸ à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾ à¤Ÿà¥€à¤® à¤•à¤¾ à¤¹à¤¿à¤¸à¥à¤¸à¤¾ à¤¬à¤¨à¤¿à¤à¥¤ <br /><br /> à¤†à¤ªà¤•à¥€ à¤¯à¥‹à¤—à¥à¤¯à¤¤à¤¾ à¤”à¤° à¤•à¥à¤·à¤®à¤¤à¤¾ à¤•à¥‡ à¤…à¤¨à¥à¤¸à¤¾à¤° à¤†à¤ªà¤•à¥‹ à¤°à¤¾à¤·à¥à¤Ÿà¥à¤°à¥€à¤¯, à¤°à¤¾à¤œà¥à¤¯ à¤¯à¤¾ à¤œà¤¿à¤²à¤¾ à¤¸à¥à¤¤à¤° à¤ªà¤° à¤œà¤¿à¤®à¥à¤®à¥‡à¤¦à¤¾à¤°à¥€ à¤¦à¥€ à¤œà¤¾à¤à¤—à¥€à¥¤ <br /><br /> à¤†à¤‡à¤ à¤¹à¤¾à¤¥ à¤¸à¥‡ à¤¹à¤¾à¤¥ à¤®à¤¿à¤²à¤¾à¤à¤‚ à¤”à¤° à¤µà¤¿à¤¶à¥à¤µ à¤•à¥‡ à¤¸à¤¬à¤¸à¥‡ à¤¬à¤¡à¥‡ à¤²à¥‹à¤•à¤¤à¤¾à¤‚à¤¤à¥à¤°à¤¿à¤• à¤†à¤‚à¤¦à¥‹à¤²à¤¨ à¤•à¤¾ à¤¹à¤¿à¤¸à¥à¤¸à¤¾ à¤¬à¤¨ à¤•à¤° à¤¹à¤®à¤¾à¤°à¥‡ à¤²à¥‹à¤•à¤¤à¤‚à¤¤à¥à¤° à¤•à¥€ à¤°à¤•à¥à¤·à¤¾ à¤”à¤° à¤†à¤§à¥à¤¨à¤¿à¤• à¤­à¤¾à¤°à¤¤ à¤•à¥‡ à¤¨à¤¿à¤°à¥à¤®à¤¾à¤£ à¤•à¤¾ à¤¹à¤®à¤¾à¤°à¤¾ à¤¦à¤¾à¤¯à¤¿à¤¤à¥à¤µ à¤ªà¥‚à¤°à¤¾ à¤•à¤°à¥‡à¤‚à¥¤ <br /><br /> à¤•à¥ƒà¤ªà¤¯à¤¾ à¤¨à¤¿à¤®à¥à¤¨ à¤œà¤¾à¤¨à¤•à¤¾à¤°à¥€ à¤¦à¥‡à¤‚ à¤œà¤¿à¤¸à¤¸à¥‡ à¤†à¤ªà¤•à¥‡ à¤…à¤¨à¥à¤°à¥‚à¤ª à¤œà¤¿à¤®à¥à¤®à¥‡à¤¦à¤¾à¤°à¥€ à¤¦à¥‡à¤¨à¥‡ à¤®à¥‡à¤‚ à¤¸à¤¹à¤¾à¤¯à¤¤à¤¾ à¤®à¤¿à¤²à¥‡à¥¤ <br /><br /> à¤§à¤¨à¥à¤¯à¤µà¤¾à¤¦  <iframe width='100%' height='315' src='https://www.youtube.com/embed/ju1yZKzapnw' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>", 
            question_type : "text",
            is_skip : false,
            answers : [],
            is_answered : false,
            answer : "English",
        },
        {
            name : "name",
            question_id : 5,
            question_english : "Please write your name and surname",
            question_hindi : "à¤•à¥ƒà¤ªà¤¯à¤¾ à¤†à¤ªà¤•à¤¾ à¤¨à¤¾à¤® à¤”à¤° à¤‰à¤ªà¤¨à¤¾à¤® à¤²à¤¿à¤–à¥‡à¤‚",
            question_type : "text",
            is_skip : false,
            answers : [],
            is_answered : false,
            answer : "",
        },
        {
            name : "mobile",
            question_id : 6,
            question_english : "Your phone number?",
            question_hindi : "à¤†à¤ªà¤•à¤¾ à¤«à¥‹à¤¨ à¤¨à¤‚à¤¬à¤°?",
            question_type : "number",
            max_length : 10,
            is_skip : false,
            answers : [],
            is_answered : false,
            answer : "",
        },
        {
            name : "already_registered",
            question_id : 7,
            question_english : "Your mobile number is already registered. Thank You.",
            question_hindi : "à¤†à¤ªà¤•à¤¾ à¤®à¥‹à¤¬à¤¾à¤‡à¤² à¤¨à¤‚à¤¬à¤° à¤ªà¤¹à¤²à¥‡ à¤¸à¥‡ à¤ªà¤‚à¤œà¥€à¤•à¥ƒà¤¤ à¤¹à¥ˆà¥¤ à¤§à¤¨à¥à¤¯à¤µà¤¾à¤¦à¥¤",
            question_type : "none",
            max_length : 10,
            is_skip : false,
            answers : [],
            is_answered : false,
            answer : "",
        },
        {
            name : "otp",
            question_id : 8,
            question_english : "You must have received an OTP. Please type that.",
            question_hindi : "à¤†à¤ªà¤•à¥‹ à¤à¤• OTP à¤ªà¥à¤°à¤¾à¤ªà¥à¤¤ à¤¹à¥à¤† à¤¹à¥‹à¤—à¤¾à¥¤ à¤•à¥ƒà¤ªà¤¯à¤¾ OTP à¤Ÿà¤¾à¤‡à¤ª à¤•à¤°à¥‡à¤‚",
            question_type : "number",
            max_length : 6,
            is_skip : false,
            answers : [],
            is_answered : false,
            answer : "",
        },
        {
            name : "verify_otp",
            question_id : 9,
            question_english : "Invalid verification code, Please try again.",
            question_hindi : "à¤µà¥ˆà¤°à¤¿à¤«à¤¿à¤•à¥‡à¤¶à¤¨ à¤•à¥‹à¤¡ à¤—à¤²à¤¤ à¤¹à¥ˆ.",
            question_type : "none",
            max_length : 6,
            is_skip : false,
            answers : [],
            is_answered : false,
            answer : "",
        },
        {
            name : "is_whatsapp",
            question_id : 10,
            question_english : "Is this also your WhatsApp number?",
            question_hindi : "à¤•à¥à¤¯à¤¾ à¤¯à¤¹ à¤†à¤ªà¤•à¤¾ à¤µà¥à¤¹à¤¾à¤Ÿà¥à¤¸à¤à¤ª à¤¨à¤‚à¤¬à¤° à¤­à¥€ à¤¹à¥ˆ?",
            question_type : "option",
            is_skip : false,
            is_answered : false,
            answers : [
                {
                    answer_id : "1",
                    answer_english : "Yes",
                    answer_hindi : "à¤¹à¤¾à¤",
                },
                {
                    answer_id : "2",
                    answer_english : "No",  
                    answer_hindi : "à¤¨à¤¹à¥€à¤‚",  
                }
            ],
            answer : "",
        },
        {
            name : "whatsapp_number",
            question_id : 11,
            question_english : "What is your WhatsApp number?",
            question_hindi : "à¤†à¤ªà¤•à¤¾ à¤µà¥à¤¹à¤¾à¤Ÿà¥à¤¸à¤à¤ª à¤¨à¤‚à¤¬à¤° à¤•à¥à¤¯à¤¾ à¤¹à¥ˆ?",
            question_type : "text",
            is_skip : false,
            max_length : 10,
            is_answered : false,
            answers : [],
            answer : "",
        },
        {
            name : "state_id",
            question_id : 12,
            question_english : "Which state or union territory are you from?",
            question_hindi : "à¤†à¤ª à¤•à¤¿à¤¸ à¤°à¤¾à¤œà¥à¤¯ à¤¯à¤¾ à¤•à¥‡à¤‚à¤¦à¥à¤° à¤¶à¤¾à¤¸à¤¿à¤¤ à¤ªà¥à¤°à¤¦à¥‡à¤¶ à¤¸à¥‡ à¤¹à¥ˆà¤‚?",
            question_type : "selection",
            is_answered : false,
            is_skip : false,
            answers : [
                {"answer_id":"2","answer_english":"Andaman and Nicobar","answer_hindi":"à¤…à¤£à¥à¤¡à¤®à¤¾à¤¨ à¤”à¤° à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
                {"answer_id":"1","answer_english":"Andhra Pradesh","answer_hindi":"à¤†à¤‚à¤§à¥à¤° à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
                {"answer_id":"3","answer_english":"Arunachal Pradesh","answer_hindi":"à¤…à¤°à¥à¤£à¤¾à¤šà¤² à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
                {"answer_id":"4","answer_english":"Assam","answer_hindi":"à¤…à¤¸à¤®"},
                {"answer_id":"5","answer_english":"Bihar","answer_hindi":"à¤¬à¤¿à¤¹à¤¾à¤°"},
                {"answer_id":"6","answer_english":"Chandigarh","answer_hindi":"à¤šà¤£à¥à¤¡à¥€à¤—à¤¢à¤¼"},
                {"answer_id":"7","answer_english":"Chhattisgarh","answer_hindi":"à¤›à¤¤à¥à¤¤à¥€à¤¸à¤—à¤¢à¤¼"},
                {"answer_id":"8","answer_english":"Dadra and Nagar Haveli and Daman and Diu","answer_hindi":"à¤¦à¤¾à¤¦à¤°à¤¾ à¤¨à¤—à¤° à¤¹à¤µà¥‡à¤²à¥€ à¤”à¤° à¤¦à¤®à¤¨ à¤”à¤° à¤¦à¥€à¤µ"},
                {"answer_id":"9","answer_english":"Delhi","answer_hindi":"à¤¦à¤¿à¤²à¥à¤²à¥€"},
                {"answer_id":"10","answer_english":"Goa","answer_hindi":"à¤—à¥‹à¤µà¤¾"},
                {"answer_id":"11","answer_english":"Gujarat","answer_hindi":"à¤—à¥à¤œà¤°à¤¾à¤¤"},
                {"answer_id":"12","answer_english":"Haryana","answer_hindi":"à¤¹à¤°à¤¿à¤¯à¤¾à¤£à¤¾"},
                {"answer_id":"13","answer_english":"Himachal Pradesh","answer_hindi":"à¤¹à¤¿à¤®à¤¾à¤šà¤² à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
                {"answer_id":"14","answer_english":"Jammu and Kashmir","answer_hindi":"à¤œà¤®à¥à¤®à¥‚ à¤•à¤¶à¥à¤®à¥€à¤°"},
                {"answer_id":"15","answer_english":"Jharkhand","answer_hindi":"à¤à¤¾à¤°à¤–à¤£à¥à¤¡"},
                {"answer_id":"16","answer_english":"Karnataka","answer_hindi":"à¤•à¤°à¥à¤¨à¤¾à¤Ÿà¤•"},
                {"answer_id":"17","answer_english":"Kerala","answer_hindi":"à¤•à¥‡à¤°à¤²"},
                {"answer_id":"18","answer_english":"Ladakh","answer_hindi":"à¤²à¤¦à¥à¤¦à¤¾à¤–"},
                {"answer_id":"19","answer_english":"Lakshadweep","answer_hindi":"à¤²à¤•à¥à¤·à¤¦à¥à¤µà¥€à¤ª"},
                {"answer_id":"20","answer_english":"Madhya Pradesh","answer_hindi":"à¤®à¤§à¥à¤¯à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
                {"answer_id":"21","answer_english":"Maharastra","answer_hindi":"à¤®à¤¹à¤¾à¤°à¤¾à¤·à¥à¤Ÿà¥à¤°"},
                {"answer_id":"22","answer_english":"Manipur","answer_hindi":"à¤®à¤£à¤¿à¤ªà¥à¤°"},
                {"answer_id":"23","answer_english":"Meghalaya","answer_hindi":"à¤®à¥‡à¤˜à¤¾à¤²à¤¯"},
                {"answer_id":"24","answer_english":"Mizoram","answer_hindi":"à¤®à¤¿à¤œà¤¼à¥‹à¤°à¤®"},
                {"answer_id":"25","answer_english":"Nagaland","answer_hindi":"à¤¨à¤¾à¤—à¤¾à¤²à¥ˆà¤£à¥à¤¡"},
                {"answer_id":"26","answer_english":"Odisha","answer_hindi":"à¤“à¤¡à¤¼à¤¿à¤¶à¤¾"},
                {"answer_id":"27","answer_english":"Puducherry","answer_hindi":"à¤ªà¥à¤¦à¥à¤šà¥‡à¤°à¥€"},
                {"answer_id":"28","answer_english":"Punjab","answer_hindi":"à¤ªà¤‚à¤œà¤¾à¤¬"},
                {"answer_id":"29","answer_english":"Rajasthan","answer_hindi":"à¤°à¤¾à¤œà¤¸à¥à¤¥à¤¾à¤¨"},
                {"answer_id":"30","answer_english":"Sikkim","answer_hindi":"à¤¸à¤¿à¤•à¥à¤•à¤¿à¤®"},
                {"answer_id":"31","answer_english":"Tamil Nadu","answer_hindi":"à¤¤à¤®à¤¿à¤²à¤¨à¤¾à¤¡à¥"},
                {"answer_id":"32","answer_english":"Telangana","answer_hindi":"à¤¤à¥‡à¤²à¤‚à¤—à¤¾à¤¨à¤¾"},
                {"answer_id":"33","answer_english":"Tripura","answer_hindi":"à¤¤à¥à¤°à¤¿à¤ªà¥à¤°à¤¾"},
                {"answer_id":"34","answer_english":"Uttar Pradesh","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
                {"answer_id":"35","answer_english":"Uttarakhand","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤°à¤¾à¤–à¤£à¥à¤¡"},
                {"answer_id":"36","answer_english":"West Bengal","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤¬à¤‚à¤—à¤¾à¤²"}
            ],
            answer : "",
        },
        {
            name : "district_id",
            question_id : 13,
            question_english : "Which district are you from?",
            question_hindi : "à¤†à¤ª à¤•à¤¿à¤¸ à¤œà¤¿à¤²à¥‡ à¤¸à¥‡ à¤¹à¥ˆà¤‚",
            question_type : "selection",
            is_answered : false,
            is_parent_check : true,
            is_skip : false,
            answers :[
               {"answer_id":"590","answer_english":"Adilabad","answer_hindi":"à¤†à¤¦à¤¿à¤²à¤¾à¤¬à¤¾à¤¦","parent_id":"32"},
{"answer_id":"363","answer_english":"Agar Malwa","answer_hindi":"à¤†à¤—à¤° à¤®à¤¾à¤²à¤µà¤¾","parent_id":"20"},
{"answer_id":"631","answer_english":"Agra","answer_hindi":"à¤†à¤—à¤°à¤¾","parent_id":"34"},
{"answer_id":"159","answer_english":"Ahmedabad","answer_hindi":"à¤…à¤¹à¤®à¤¦à¤¾à¤¬à¤¾à¤¦","parent_id":"11"},
{"answer_id":"373","answer_english":"Ahmednagar","answer_hindi":"à¤…à¤¹à¤®à¤¦à¤¨à¤—à¤°","parent_id":"21"},
{"answer_id":"436","answer_english":"Aizawl","answer_hindi":"à¤…à¤‡à¤œà¤¼à¥‹à¤²","parent_id":"24"},
{"answer_id":"515","answer_english":"Ajmer","answer_hindi":"à¤…à¤œà¤®à¥‡à¤°","parent_id":"29"},
{"answer_id":"374","answer_english":"Akola","answer_hindi":"à¤…à¤•à¥‹à¤²à¤¾","parent_id":"21"},
{"answer_id":"301","answer_english":"Alappuzha","answer_hindi":"à¤†à¤²à¤¾à¤ªà¥à¤ªà¥à¤¡à¤¼à¤¾","parent_id":"17"},
{"answer_id":"632","answer_english":"Aligarh","answer_hindi":"à¤…à¤²à¥€à¤—à¤¢","parent_id":"34"},
{"answer_id":"719","answer_english":"Alipurduar","answer_hindi":"à¤…à¤²à¥€à¤ªà¥à¤°à¤¦à¥à¤°à¤¾à¤°","parent_id":"36"},
{"answer_id":"331","answer_english":"Alirajpur ","answer_hindi":"à¤…à¤²à¥€à¤°à¤¾à¤œà¤ªà¥à¤°","parent_id":"20"},
{"answer_id":"633","answer_english":"Allahabad","answer_hindi":"à¤‡à¤²à¤¾à¤¹à¤¾à¤¬à¤¾à¤¦\/à¤ªà¥à¤°à¤¯à¤¾à¤—à¤°à¤¾à¤œ","parent_id":"34"},
{"answer_id":"706","answer_english":"Almora","answer_hindi":"à¤…à¤²à¥à¤®à¥‹à¤¡à¤¼à¤¾","parent_id":"35"},
{"answer_id":"516","answer_english":"Alwar","answer_hindi":"à¤…à¤²à¤µà¤°","parent_id":"29"},
{"answer_id":"192","answer_english":"Ambala","answer_hindi":"à¤…à¤®à¥à¤¬à¤¾à¤²à¤¾","parent_id":"12"},
{"answer_id":"634","answer_english":"Ambedkar Nagar","answer_hindi":"à¤…à¤®à¥à¤¬à¥‡à¤¡à¤•à¤°à¤¨à¤—à¤°","parent_id":"34"},
{"answer_id":"635","answer_english":"Amethi","answer_hindi":"à¤…à¤®à¥‡à¤ à¥€Â ","parent_id":"34"},
{"answer_id":"375","answer_english":"Amravati","answer_hindi":"à¤…à¤®à¤°à¤¾à¤µà¤¤à¥€","parent_id":"21"},
{"answer_id":"160","answer_english":"Amreli","answer_hindi":"à¤…à¤®à¤°à¥‡à¤²à¥€","parent_id":"11"},
{"answer_id":"493","answer_english":"Amritsar","answer_hindi":"à¤…à¤®à¥ƒà¤¤à¤¸à¤°","parent_id":"28"},
{"answer_id":"636","answer_english":"Amroha","answer_hindi":"à¤…à¤®à¤°à¥‹à¤¹à¤¾Â ","parent_id":"34"},
{"answer_id":"161","answer_english":"Anand","answer_hindi":"à¤†à¤£à¤‚à¤¦","parent_id":"11"},
{"answer_id":"1","answer_english":"Anantapur","answer_hindi":"à¤…à¤¨à¤‚à¤¤à¤ªà¥à¤°","parent_id":"1"},
{"answer_id":"226","answer_english":"Anantnag","answer_hindi":"à¤…à¤¨à¤¨à¥à¤¤à¤¨à¤¾à¤—","parent_id":"14"},
{"answer_id":"459","answer_english":"Angul","answer_hindi":"à¤…à¤¨à¥à¤—à¥à¤²","parent_id":"26"},
{"answer_id":"17","answer_english":"Anjaw","answer_hindi":"à¤…à¤‚à¤œà¥‰","parent_id":"3"},
{"answer_id":"360","answer_english":"Anuppur ","answer_hindi":"à¤…à¤¨à¥‚à¤ªà¤ªà¥à¤°","parent_id":"20"},
{"answer_id":"76","answer_english":"Araria","answer_hindi":"à¤…à¤°à¤°à¤¿à¤¯à¤¾","parent_id":"5"},
{"answer_id":"162","answer_english":"Aravalli","answer_hindi":"à¤…à¤°à¤¾à¤µà¤²à¥€","parent_id":"11"},
{"answer_id":"552","answer_english":"Ariyalur","answer_hindi":"à¤…à¤°à¤¿à¤¯à¤¾à¤²à¥‚à¤°","parent_id":"31"},
{"answer_id":"77","answer_english":"Arwal","answer_hindi":"à¤…à¤°à¤µà¤²","parent_id":"5"},
{"answer_id":"327","answer_english":"Ashoknagar","answer_hindi":"à¤…à¤¶à¥‹à¤• à¤¨à¤—à¤°","parent_id":"20"},
{"answer_id":"637","answer_english":"Auraiya","answer_hindi":"à¤”à¤°à¥ˆà¤¯à¤¾","parent_id":"34"},
{"answer_id":"78","answer_english":"Aurangabad","answer_hindi":"à¤”à¤°à¤‚à¤—à¤¾à¤¬à¤¾à¤¦","parent_id":"5"},
{"answer_id":"376","answer_english":"Aurangabad","answer_hindi":"à¤”à¤°à¤‚à¤—à¤¾à¤¬à¤¾à¤¦","parent_id":"21"},
{"answer_id":"638","answer_english":"Azamgarh","answer_hindi":"à¤†à¤œà¤®à¤—à¤¢","parent_id":"34"},
{"answer_id":"270","answer_english":"Bagalkot","answer_hindi":"à¤¬à¤¾à¤—à¤²à¤•à¥‹à¤Ÿ","parent_id":"16"},
{"answer_id":"707","answer_english":"Bageshwar","answer_hindi":"à¤¬à¤¾à¤—à¥‡à¤¶à¥à¤µà¤°","parent_id":"35"},
{"answer_id":"639","answer_english":"Bagpat","answer_hindi":"à¤¬à¤¾à¤—à¤ªà¤¤Â ","parent_id":"34"},
{"answer_id":"640","answer_english":"Bahraich","answer_hindi":"à¤¬à¤¹à¤°à¤¾à¤‡à¤š","parent_id":"34"},
{"answer_id":"43","answer_english":"Bajali","answer_hindi":"à¤¬à¤œà¤¾à¤²à¥€","parent_id":"4"},
{"answer_id":"42","answer_english":"Baksa","answer_hindi":"à¤¬à¤•à¥à¤¸à¤¾","parent_id":"4"},
{"answer_id":"339","answer_english":"Balaghat ","answer_hindi":"à¤¬à¤¾à¤²à¤¾à¤˜à¤¾à¤Ÿ","parent_id":"20"},
{"answer_id":"461","answer_english":"Balangir","answer_hindi":"à¤¬à¤²à¤¾à¤‚à¤—à¤¿à¤°","parent_id":"26"},
{"answer_id":"641","answer_english":"Balarampur","answer_hindi":"à¤¬à¤²à¤°à¤¾à¤®à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"463","answer_english":"Balasore","answer_hindi":"à¤¬à¤¾à¤²à¥‡à¤¶à¥à¤µà¤°","parent_id":"26"},
{"answer_id":"642","answer_english":"Ballia","answer_hindi":"à¤¬à¤²à¤¿à¤¯à¤¾","parent_id":"34"},
{"answer_id":"115","answer_english":"Balod","answer_hindi":"à¤¬à¤¾à¤²à¥‹à¤¦","parent_id":"7"},
{"answer_id":"116","answer_english":"Baloda Bazar","answer_hindi":"à¤¬à¤²à¥Œà¤¦à¤¾ à¤¬à¤¾à¤œà¤¾à¤°","parent_id":"7"},
{"answer_id":"117","answer_english":"Balrampur","answer_hindi":"à¤¬à¤²à¤°à¤¾à¤®à¤ªà¥à¤°","parent_id":"7"},
{"answer_id":"163","answer_english":"Banaskantha","answer_hindi":"à¤¬à¤¨à¤¾à¤¸à¤•à¤¾à¤‚à¤ à¤¾","parent_id":"11"},
{"answer_id":"643","answer_english":"Banda","answer_hindi":"à¤¬à¤¾à¤à¤¦à¤¾","parent_id":"34"},
{"answer_id":"228","answer_english":"Bandipora","answer_hindi":"à¤¬à¤¾à¤‚à¤¦à¥€à¤ªà¥à¤°à¤¾","parent_id":"14"},
{"answer_id":"272","answer_english":"Bangalore Rural","answer_hindi":"à¤¬à¤‚à¤—à¤²à¥‹à¤° à¤—à¥à¤°à¤¾à¤®à¥€à¤£","parent_id":"16"},
{"answer_id":"271","answer_english":"Bangalore Urban","answer_hindi":"à¤¬à¤‚à¤—à¤²à¥‹à¤° à¤¶à¤¹à¤°à¥€","parent_id":"16"},
{"answer_id":"79","answer_english":"Banka","answer_hindi":"à¤¬à¤¾à¤à¤•à¤¾","parent_id":"5"},
{"answer_id":"720","answer_english":"Bankura","answer_hindi":"à¤¬à¤¾à¤à¤•à¥à¤¡à¤¼à¤¾","parent_id":"36"},
{"answer_id":"519","answer_english":"Banswara","answer_hindi":"à¤¬à¤¾à¤‚à¤¸à¤µà¤¾à¤¡à¤¼à¤¾","parent_id":"29"},
{"answer_id":"644","answer_english":"Barabanki","answer_hindi":"à¤¬à¤¾à¤°à¤¾à¤¬à¤‚à¤•à¥€","parent_id":"34"},
{"answer_id":"229","answer_english":"Baramulla","answer_hindi":"à¤¬à¤¾à¤°à¤¾à¤®à¥‚à¤²à¤¾","parent_id":"14"},
{"answer_id":"521","answer_english":"Baran","answer_hindi":"à¤¬à¤¾à¤°à¤¾à¤‚","parent_id":"29"},
{"answer_id":"645","answer_english":"Bareilly","answer_hindi":"à¤¬à¤°à¥‡à¤²à¥€","parent_id":"34"},
{"answer_id":"462","answer_english":"Bargarh","answer_hindi":"à¤¬à¤°à¤—à¤¢à¤¼","parent_id":"26"},
{"answer_id":"518","answer_english":"Barmer","answer_hindi":"à¤¬à¤¾à¤¡à¤¼à¤®à¥‡à¤°","parent_id":"29"},
{"answer_id":"494","answer_english":"Barnala","answer_hindi":"à¤¬à¤°à¤¨à¤¾à¤²à¤¾","parent_id":"28"},
{"answer_id":"44","answer_english":"Barpeta","answer_hindi":"à¤¬à¤¾à¤°à¤ªà¥‡à¤Ÿà¤¾","parent_id":"4"},
{"answer_id":"332","answer_english":"Barwani ","answer_hindi":"à¤¬à¤¡à¤¼à¤µà¤¾à¤¨à¥€","parent_id":"20"},
{"answer_id":"118","answer_english":"Bastar","answer_hindi":"à¤¬à¤¸à¥à¤¤à¤°","parent_id":"7"},
{"answer_id":"646","answer_english":"Basti","answer_hindi":"à¤¬à¤¸à¥à¤¤à¥€","parent_id":"34"},
{"answer_id":"495","answer_english":"Bathinda","answer_hindi":"à¤­à¤Ÿà¤¿à¤£à¥à¤¡à¤¾","parent_id":"28"},
{"answer_id":"377","answer_english":"Beed","answer_hindi":"à¤¬à¥€à¤¡","parent_id":"21"},
{"answer_id":"80","answer_english":"Begusarai","answer_hindi":"à¤¬à¥‡à¤—à¥‚à¤¸à¤°à¤¾à¤¯","parent_id":"5"},
{"answer_id":"273","answer_english":"Belgaum","answer_hindi":"à¤¬à¥‡à¤²à¤—à¤¾à¤®","parent_id":"16"},
{"answer_id":"274","answer_english":"Bellary","answer_hindi":"à¤¬à¥‡à¤²à¥à¤²à¤¾à¤°à¥€","parent_id":"16"},
{"answer_id":"119","answer_english":"Bemetara","answer_hindi":"à¤¬à¥‡à¤®à¥‡à¤¤à¤°à¤¾","parent_id":"7"},
{"answer_id":"347","answer_english":"Betul ","answer_hindi":"à¤¬à¥ˆà¤¤à¥‚à¤²","parent_id":"20"},
{"answer_id":"647","answer_english":"Bhadohi","answer_hindi":"à¤­à¤¦à¥‹à¤¹à¥€Â ","parent_id":"34"},
{"answer_id":"592","answer_english":"Bhadradri Kothagudem","answer_hindi":"à¤­à¤¦à¥à¤°à¤¾à¤¦à¥à¤°à¥€ à¤•à¥‹à¤ à¤¾à¤—à¥à¤¡à¤®","parent_id":"32"},
{"answer_id":"464","answer_english":"Bhadrak","answer_hindi":"à¤­à¤¦à¥à¤°à¤•","parent_id":"26"},
{"answer_id":"81","answer_english":"Bhagalpur","answer_hindi":"à¤­à¤¾à¤—à¤²à¤ªà¥à¤°","parent_id":"5"},
{"answer_id":"378","answer_english":"Bhandara","answer_hindi":"à¤­à¤‚à¤¡à¤¾à¤°à¤¾","parent_id":"21"},
{"answer_id":"520","answer_english":"Bharatpur","answer_hindi":"à¤­à¤°à¤¤à¤ªà¥à¤°","parent_id":"29"},
{"answer_id":"164","answer_english":"Bharuch","answer_hindi":"à¤­à¤°à¥à¤š","parent_id":"11"},
{"answer_id":"165","answer_english":"Bhavnagar","answer_hindi":"à¤­à¤¾à¤µà¤¨à¤—à¤°","parent_id":"11"},
{"answer_id":"523","answer_english":"Bhilwara","answer_hindi":"à¤­à¥€à¤²à¤µà¤¾à¤¡à¤¼à¤¾","parent_id":"29"},
{"answer_id":"325","answer_english":"Bhind ","answer_hindi":"à¤­à¤¿à¤‚à¤¡","parent_id":"20"},
{"answer_id":"193","answer_english":"Bhiwani","answer_hindi":"à¤­à¤¿à¤µà¤¾à¤¨à¥€","parent_id":"12"},
{"answer_id":"82","answer_english":"Bhojpur","answer_hindi":"à¤­à¥‹à¤œà¤ªà¥à¤°","parent_id":"5"},
{"answer_id":"318","answer_english":"Bhopal ","answer_hindi":"à¤­à¥‹à¤ªà¤¾à¤²","parent_id":"20"},
{"answer_id":"275","answer_english":"Bidar","answer_hindi":"à¤¬à¥€à¤¦à¤°","parent_id":"16"},
{"answer_id":"276","answer_english":"Bijapur","answer_hindi":"à¤¬à¥€à¤œà¤¾à¤ªà¥à¤°","parent_id":"16"},
{"answer_id":"120","answer_english":"Bijapur","answer_hindi":"à¤¬à¥€à¤œà¤¾à¤ªà¥à¤°","parent_id":"7"},
{"answer_id":"648","answer_english":"Bijnor","answer_hindi":"à¤¬à¤¿à¤œà¤¨à¥Œà¤°","parent_id":"34"},
{"answer_id":"517","answer_english":"Bikaner","answer_hindi":"à¤¬à¥€à¤•à¤¾à¤¨à¥‡à¤°","parent_id":"29"},
{"answer_id":"121","answer_english":"Bilaspur","answer_hindi":"à¤¬à¤¿à¤²à¤¾à¤¸à¤ªà¥à¤°","parent_id":"7"},
{"answer_id":"214","answer_english":"Bilaspur","answer_hindi":"à¤¬à¤¿à¤²à¤¾à¤¸à¤ªà¥à¤°","parent_id":"13"},
{"answer_id":"723","answer_english":"Birbhum","answer_hindi":"à¤¬à¥€à¤°à¤­à¥‚à¤®","parent_id":"36"},
{"answer_id":"409","answer_english":"Bishnupur","answer_hindi":"à¤¬à¤¿à¤·à¥à¤£à¥à¤ªà¥à¤° à¤œà¤¿à¤²à¤¾","parent_id":"22"},
{"answer_id":"45","answer_english":"Biswanath","answer_hindi":"à¤¬à¤¿à¤¶à¥à¤µà¤¨à¤¾à¤¥","parent_id":"4"},
{"answer_id":"254","answer_english":"Bokaro","answer_hindi":"à¤¬à¥‹à¤•à¤¾à¤°à¥‹","parent_id":"15"},
{"answer_id":"46","answer_english":"Bongaigaon","answer_hindi":"à¤¬à¤‚à¤—à¤¾à¤ˆà¤—à¤¾à¤à¤µ","parent_id":"4"},
{"answer_id":"166","answer_english":"Botad","answer_hindi":"à¤¬à¥‹à¤Ÿà¤¾à¤¡","parent_id":"11"},
{"answer_id":"460","answer_english":"Boudh","answer_hindi":"à¤¬à¥Œà¤§","parent_id":"26"},
{"answer_id":"649","answer_english":"Budaun","answer_hindi":"à¤¬à¤¦à¤¾à¤¯à¥‚à¤‚Â ","parent_id":"34"},
{"answer_id":"227","answer_english":"Budgam","answer_hindi":"à¤¬à¤¡à¤¼à¤—à¤¾à¤‚à¤µ","parent_id":"14"},
{"answer_id":"650","answer_english":"Bulandshahr","answer_hindi":"à¤¬à¥à¤²à¤‚à¤¦à¤¶à¤¹à¤°","parent_id":"34"},
{"answer_id":"379","answer_english":"Buldhana","answer_hindi":"à¤¬à¥à¤²à¤¢à¤¾à¤£à¤¾","parent_id":"21"},
{"answer_id":"522","answer_english":"Bundi","answer_hindi":"à¤¬à¥‚à¤‚à¤¦à¥€","parent_id":"29"},
{"answer_id":"333","answer_english":"Burhanpur ","answer_hindi":"à¤¬à¥à¤°à¤¹à¤¾à¤¨à¤ªà¥à¤°","parent_id":"20"},
{"answer_id":"83","answer_english":"Buxar","answer_hindi":"à¤¬à¤•à¥à¤¸à¤°","parent_id":"5"},
{"answer_id":"47","answer_english":"Cachar","answer_hindi":"à¤•à¤›à¤°","parent_id":"4"},
{"answer_id":"147","answer_english":"Central Delhi ","answer_hindi":"à¤®à¤§à¥à¤¯ à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"370","answer_english":"Chachaura-Binaganj","answer_hindi":"à¤šà¤¾à¤šà¥Œà¤¡à¤¼à¤¾","parent_id":"20"},
{"answer_id":"277","answer_english":"Chamarajanagar","answer_hindi":"à¤šà¤¾à¤®à¤°à¤¾à¤œà¤¨à¤—à¤°","parent_id":"16"},
{"answer_id":"215","answer_english":"Chamba","answer_hindi":"à¤šà¤‚à¤¬à¤¾","parent_id":"13"},
{"answer_id":"708","answer_english":"Chamoli","answer_hindi":"à¤šà¤®à¥‹à¤²à¥€","parent_id":"35"},
{"answer_id":"709","answer_english":"Champawat","answer_hindi":"à¤šà¤®à¥à¤ªà¤¾à¤µà¤¤","parent_id":"35"},
{"answer_id":"443","answer_english":"Champhai","answer_hindi":"à¤šà¤®à¥à¤«à¤¾à¤ˆ","parent_id":"24"},
{"answer_id":"651","answer_english":"Chandauli","answer_hindi":"à¤šà¤‚à¤¦à¥Œà¤²à¥€","parent_id":"34"},
{"answer_id":"415","answer_english":"Chandel","answer_hindi":"à¤šà¤¨à¥à¤¡à¥‡à¤² à¤œà¤¿à¤²à¤¾","parent_id":"22"},
{"answer_id":"114","answer_english":"ChandigarhÂ ","answer_hindi":"à¤šà¤£à¥à¤¡à¥€à¤—à¤¢à¤¼","parent_id":"6"},
{"answer_id":"380","answer_english":"Chandrapur","answer_hindi":"à¤šà¤‚à¤¦à¥à¤°à¤ªà¥à¤°","parent_id":"21"},
{"answer_id":"18","answer_english":"Changlang","answer_hindi":"à¤šà¤¾à¤‚à¤—à¤²à¤¾à¤‚à¤—","parent_id":"3"},
{"answer_id":"48","answer_english":"Charaideo","answer_hindi":"à¤šà¤°à¤¾à¤‡à¤¦à¥‡à¤‰","parent_id":"4"},
{"answer_id":"194","answer_english":"Charkhi Dadri","answer_hindi":"à¤šà¤°à¤–à¥€ à¤¦à¤¾à¤¦à¤°à¥€","parent_id":"12"},
{"answer_id":"249","answer_english":"Chatra","answer_hindi":"à¤šà¤¤à¤°à¤¾","parent_id":"15"},
{"answer_id":"553","answer_english":"Chengalpattu","answer_hindi":"à¤šà¥‡à¤‚à¤—à¤²à¤ªà¤Ÿà¥à¤Ÿà¥","parent_id":"31"},
{"answer_id":"554","answer_english":"Chennai","answer_hindi":"à¤šà¥‡à¤¨à¥à¤¨à¤ˆ","parent_id":"31"},
{"answer_id":"354","answer_english":"Chhatarpur ","answer_hindi":"à¤›à¤¤à¤°à¤ªà¥à¤°","parent_id":"20"},
{"answer_id":"340","answer_english":"Chhindwara ","answer_hindi":"à¤›à¤¿à¤‚à¤¦à¤µà¤¾à¤¡à¤¼à¤¾","parent_id":"20"},
{"answer_id":"167","answer_english":"Chhota Udaipur","answer_hindi":"à¤›à¥‹à¤Ÿà¤¾ à¤‰à¤¦à¤¯à¤ªà¥à¤°","parent_id":"11"},
{"answer_id":"278","answer_english":"Chikballapur","answer_hindi":"à¤šà¤¿à¤•à¤¬à¤²à¤¾à¤ªà¥à¤°à¤¾","parent_id":"16"},
{"answer_id":"279","answer_english":"Chikmagalur","answer_hindi":"à¤šà¤¿à¤•à¤®à¤—à¤²à¥‚à¤°","parent_id":"16"},
{"answer_id":"49","answer_english":"Chirang","answer_hindi":"à¤šà¤¿à¤°à¤¾à¤‚à¤—","parent_id":"4"},
{"answer_id":"280","answer_english":"Chitradurga","answer_hindi":"à¤šà¤¿à¤¤à¥à¤°à¤¦à¥à¤°à¥à¤—","parent_id":"16"},
{"answer_id":"652","answer_english":"Chitrakoot","answer_hindi":"à¤šà¤¿à¤¤à¥à¤°à¤•à¥‚à¤Ÿ","parent_id":"34"},
{"answer_id":"2","answer_english":"Chittoor","answer_hindi":"à¤šà¤¿à¤¤à¥à¤¤à¥‚à¤°","parent_id":"1"},
{"answer_id":"525","answer_english":"Chittorgarh","answer_hindi":"à¤šà¤¿à¤¤à¥à¤¤à¥Œà¤¡à¤¼à¤—à¤¢à¤¼","parent_id":"29"},
{"answer_id":"416","answer_english":"Churachandpur","answer_hindi":"à¤šà¥à¤°à¤¾à¤šà¤¾à¤‚à¤¦à¤ªà¥à¤° à¤œà¤¿à¤²à¤¾","parent_id":"22"},
{"answer_id":"524","answer_english":"Churu","answer_hindi":"à¤šà¥à¤°à¥","parent_id":"29"},
{"answer_id":"555","answer_english":"Coimbatore","answer_hindi":"à¤•à¥‹à¤¯à¤®à¥à¤¬à¤¤à¥‚à¤°","parent_id":"31"},
{"answer_id":"724","answer_english":"Cooch Behar","answer_hindi":"à¤•à¥‚à¤šà¤¬à¤¿à¤¹à¤¾à¤°","parent_id":"36"},
{"answer_id":"556","answer_english":"Cuddalore","answer_hindi":"à¤•à¥à¤¡à¥à¤¡à¤²à¥‹à¤°","parent_id":"31"},
{"answer_id":"465","answer_english":"Cuttack","answer_hindi":"à¤•à¤Ÿà¤•","parent_id":"26"},
{"answer_id":"145","answer_english":"Dadra and Nagar Haveli","answer_hindi":"à¤¦à¤¾à¤¦à¤°à¤¾ à¤¨à¤—à¤° à¤¹à¤µà¥‡à¤²à¥€","parent_id":"8"},
{"answer_id":"168","answer_english":"Dahod","answer_hindi":"à¤¦à¤¾à¤¹à¥‹à¤¦","parent_id":"11"},
{"answer_id":"725","answer_english":"Dakshin Dinajpur","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤¦à¤¿à¤¨à¤¾à¤œà¤ªà¥à¤°","parent_id":"36"},
{"answer_id":"281","answer_english":"Dakshina Kannada","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤•à¤¨à¥à¤¨à¤¡à¤¼","parent_id":"16"},
{"answer_id":"143","answer_english":"Daman","answer_hindi":"à¤¦à¤®à¤¨Â ","parent_id":"8"},
{"answer_id":"355","answer_english":"Damoh ","answer_hindi":"à¤¦à¤®à¥‹à¤¹","parent_id":"20"},
{"answer_id":"169","answer_english":"Dang","answer_hindi":"à¤¡à¤¾à¤‚à¤—","parent_id":"11"},
{"answer_id":"122","answer_english":"Dantewada","answer_hindi":"à¤¦à¤¨à¥à¤¤à¥‡à¤µà¤¾à¤¡à¤¼à¤¾ Â (à¤¦à¤•à¥à¤·à¤¿à¤£ à¤¬à¤¸à¥à¤¤à¤°)","parent_id":"7"},
{"answer_id":"84","answer_english":"Darbhanga","answer_hindi":"à¤¦à¤°à¤­à¤‚à¤—à¤¾","parent_id":"5"},
{"answer_id":"726","answer_english":"Darjeeling","answer_hindi":"à¤¦à¤¾à¤°à¥à¤œà¤¿à¤²à¤¿à¤‚à¤—","parent_id":"36"},
{"answer_id":"50","answer_english":"Darrang","answer_hindi":"à¤¦à¤¾à¤°à¤¾à¤‚à¤—","parent_id":"4"},
{"answer_id":"329","answer_english":"Datia ","answer_hindi":"à¤¦à¤¤à¤¿à¤¯à¤¾","parent_id":"20"},
{"answer_id":"526","answer_english":"Dausa","answer_hindi":"à¤¦à¥Œà¤¸à¤¾","parent_id":"29"},
{"answer_id":"282","answer_english":"Davanagere","answer_hindi":"à¤¦à¤¾à¤µà¤£à¤—à¥‡à¤°à¥‡","parent_id":"16"},
{"answer_id":"466","answer_english":"Debagarh","answer_hindi":"à¤¦à¥‡à¤µà¤—à¤¡à¤¼","parent_id":"26"},
{"answer_id":"710","answer_english":"Dehradun","answer_hindi":"à¤¦à¥‡à¤¹à¤°à¤¾à¤¦à¥‚à¤¨","parent_id":"35"},
{"answer_id":"265","answer_english":"Deoghar","answer_hindi":"à¤¦à¥‡à¤µà¤˜à¤°","parent_id":"15"},
{"answer_id":"653","answer_english":"Deoria","answer_hindi":"à¤¦à¥‡à¤µà¤°à¤¿à¤¯à¤¾","parent_id":"34"},
{"answer_id":"170","answer_english":"Devbhoomi Dwarka","answer_hindi":"à¤¦à¥‡à¤µà¤­à¥‚à¤®à¤¿ à¤¦à¥à¤µà¤¾à¤°à¤•à¤¾","parent_id":"11"},
{"answer_id":"364","answer_english":"Dewas","answer_hindi":"à¤¦à¥‡à¤µà¤¾à¤¸","parent_id":"20"},
{"answer_id":"623","answer_english":"Dhalai","answer_hindi":"à¤§à¤²à¤¾à¤ˆ","parent_id":"33"},
{"answer_id":"123","answer_english":"Dhamtari","answer_hindi":"à¤§à¤®à¤¤à¤°à¥€","parent_id":"7"},
{"answer_id":"255","answer_english":"Dhanbad","answer_hindi":"à¤§à¤¨à¤¬à¤¾à¤¦","parent_id":"15"},
{"answer_id":"335","answer_english":"Dhar ","answer_hindi":"à¤§à¤¾à¤°","parent_id":"20"},
{"answer_id":"557","answer_english":"Dharmapuri","answer_hindi":"à¤§à¤°à¥à¤®à¤ªà¥à¤°à¥€","parent_id":"31"},
{"answer_id":"283","answer_english":"Dharwad","answer_hindi":"à¤§à¤¾à¤°à¤µà¤¾à¤¡à¤¼","parent_id":"16"},
{"answer_id":"51","answer_english":"Dhemaji","answer_hindi":"à¤§à¥‡à¤®à¤¾à¤œà¥€","parent_id":"4"},
{"answer_id":"467","answer_english":"Dhenkanal","answer_hindi":"à¤¢à¥‡à¤¨à¥à¤•à¤¾à¤¨à¤¾à¤²","parent_id":"26"},
{"answer_id":"527","answer_english":"Dholpur","answer_hindi":"à¤§à¥Œà¤²à¤ªà¥à¤°","parent_id":"29"},
{"answer_id":"52","answer_english":"Dhubri","answer_hindi":"à¤§à¥à¤¬à¤°à¥€","parent_id":"4"},
{"answer_id":"381","answer_english":"Dhule","answer_hindi":"à¤§à¥à¤²à¥‡","parent_id":"21"},
{"answer_id":"53","answer_english":"Dibrugarh","answer_hindi":"à¤¡à¤¿à¤¬à¥à¤°à¥‚à¤—à¤¢à¤¼","parent_id":"4"},
{"answer_id":"54","answer_english":"Dima Hasao","answer_hindi":"à¤¦à¤¿à¤®à¤¾ à¤¹à¤¸à¤¾à¤“","parent_id":"4"},
{"answer_id":"447","answer_english":"Dimapur","answer_hindi":"à¤¦à¥€à¤®à¤¾à¤ªà¥à¤°","parent_id":"25"},
{"answer_id":"558","answer_english":"Dindigul","answer_hindi":"à¤¡à¤¿à¤‚à¤¡à¤¿à¤—à¥à¤²","parent_id":"31"},
{"answer_id":"346","answer_english":"Dindori ","answer_hindi":"à¤¡à¤¿à¤‚à¤¡à¥Œà¤°à¥€","parent_id":"20"},
{"answer_id":"144","answer_english":"Diu","answer_hindi":"à¤¦à¥€à¤µÂ ","parent_id":"8"},
{"answer_id":"230","answer_english":"Doda","answer_hindi":"à¤¡à¥‹à¤¡à¤¾","parent_id":"14"},
{"answer_id":"266","answer_english":"Dumka","answer_hindi":"à¤¦à¥à¤®à¤•à¤¾","parent_id":"15"},
{"answer_id":"528","answer_english":"Dungarpur","answer_hindi":"à¤¡à¥‚à¤‚à¤—à¤°à¤ªà¥à¤°","parent_id":"29"},
{"answer_id":"124","answer_english":"Durg","answer_hindi":"à¤¦à¥à¤°à¥à¤—","parent_id":"7"},
{"answer_id":"85","answer_english":"East Champaran","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µà¥€ à¤šà¤®à¥à¤ªà¤¾à¤°à¤£ à¤œà¤¿à¤²à¤¾","parent_id":"5"},
{"answer_id":"148","answer_english":"East Delhi","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µà¥€ à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"429","answer_english":"East Garo Hills","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µà¥€ à¤—à¤¾à¤°à¥‹ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"3","answer_english":"East Godavari","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µ à¤—à¥‹à¤¦à¤¾à¤µà¤°à¥€","parent_id":"1"},
{"answer_id":"434","answer_english":"East Jaintia Hills","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µ à¤œà¤¯à¤‚à¤¤à¤¿à¤¯à¤¾ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"19","answer_english":"East Kameng","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µ à¤•à¤®à¥‡à¤‚à¤—","parent_id":"3"},
{"answer_id":"425","answer_english":"East Khasi Hills","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µà¥€ à¤–à¤¾à¤¸à¥€ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"20","answer_english":"East Siang","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µ à¤¸à¤¿à¤¯à¤¾à¤‚à¤—","parent_id":"3"},
{"answer_id":"548","answer_english":"East Sikkim","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µÂ à¤¸à¤¿à¤•à¥à¤•à¤¿à¤®","parent_id":"30"},
{"answer_id":"263","answer_english":"East Singhbhum","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µà¥€ à¤¸à¤¿à¤‚à¤¹à¤­à¥‚à¤®","parent_id":"15"},
{"answer_id":"302","answer_english":"Ernakulam","answer_hindi":"à¤à¤°à¥à¤¨à¤¾à¤•à¥à¤²à¤®","parent_id":"17"},
{"answer_id":"559","answer_english":"Erode","answer_hindi":"à¤ˆà¤°à¥‹à¤¡","parent_id":"31"},
{"answer_id":"654","answer_english":"Etah","answer_hindi":"à¤à¤Ÿà¤¾","parent_id":"34"},
{"answer_id":"655","answer_english":"Etawah","answer_hindi":"à¤‡à¤Ÿà¤¾à¤µà¤¾","parent_id":"34"},
{"answer_id":"656","answer_english":"Faizabad","answer_hindi":"à¤«à¥ˆà¤œà¤¼à¤¾à¤¬à¤¾à¤¦ à¤¶à¤¹à¤° (à¤…à¤¯à¥‹à¤§à¥à¤¯à¤¾)","parent_id":"34"},
{"answer_id":"195","answer_english":"Faridabad","answer_hindi":"à¤«à¤°à¥€à¤¦à¤¾à¤¬à¤¾à¤¦","parent_id":"12"},
{"answer_id":"497","answer_english":"Faridkot","answer_hindi":"à¤«à¤°à¥€à¤¦à¤•à¥‹à¤Ÿ","parent_id":"28"},
{"answer_id":"657","answer_english":"Farrukhabad","answer_hindi":"à¤«à¤¼à¤°à¥à¤°à¥‚à¤–à¤¼à¤¾à¤¬à¤¾à¤¦","parent_id":"34"},
{"answer_id":"196","answer_english":"Fatehabad","answer_hindi":"à¤«à¤¤à¥‡à¤¹à¤¾à¤¬à¤¾à¤¦","parent_id":"12"},
{"answer_id":"498","answer_english":"Fatehgarh Sahib","answer_hindi":"à¤«à¤¤à¥‡à¤¹à¤—à¤¢à¤¼ à¤¸à¤¾à¤¹à¤¿à¤¬","parent_id":"28"},
{"answer_id":"658","answer_english":"Fatehpur","answer_hindi":"à¤«à¤¤à¥‡à¤¹à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"499","answer_english":"Fazilka","answer_hindi":"à¤«à¤¾à¤œà¤¼à¤¿à¤²à¥à¤•à¤¾Â ","parent_id":"28"},
{"answer_id":"659","answer_english":"Firozabad","answer_hindi":"à¤«à¤¼à¤¿à¤°à¥‹à¤œà¤¾à¤¬à¤¾à¤¦","parent_id":"34"},
{"answer_id":"496","answer_english":"Firozpur","answer_hindi":"à¤«à¤¿à¤°à¥‹à¤œà¤ªà¥à¤°","parent_id":"28"},
{"answer_id":"284","answer_english":"Gadag","answer_hindi":"à¤—à¤¦à¤—","parent_id":"16"},
{"answer_id":"382","answer_english":"Gadchiroli","answer_hindi":"à¤—à¤¡à¤šà¤¿à¤°à¥‹à¤²à¥€","parent_id":"21"},
{"answer_id":"469","answer_english":"Gajapati","answer_hindi":"à¤—à¤œà¤ªà¤¤à¤¿","parent_id":"26"},
{"answer_id":"231","answer_english":"Ganderbal","answer_hindi":"à¤—à¤¾à¤‚à¤¦à¤°à¤¬à¤²","parent_id":"14"},
{"answer_id":"171","answer_english":"Gandhinagar","answer_hindi":"à¤—à¤¾à¤‚à¤§à¥€à¤¨à¤—à¤°","parent_id":"11"},
{"answer_id":"529","answer_english":"Ganganagar","answer_hindi":"à¤¶à¥à¤°à¥€à¤—à¤‚à¤—à¤¾à¤¨à¤—à¤°","parent_id":"29"},
{"answer_id":"468","answer_english":"Ganjam","answer_hindi":"à¤—à¤‚à¤œà¤¾à¤®","parent_id":"26"},
{"answer_id":"246","answer_english":"Garhwa","answer_hindi":"à¤—à¤¢à¤µà¤¾","parent_id":"15"},
{"answer_id":"125","answer_english":"Gariaband","answer_hindi":"à¤—à¤°à¤¿à¤¯à¤¾à¤¬à¤‚à¤¦","parent_id":"7"},
{"answer_id":"126","answer_english":"Gaurella-Pendra-Marwahi","answer_hindi":"à¤—à¥Œà¤°à¥‡à¤²à¤¾-à¤ªà¥‡à¤£à¥à¤¡à¥à¤°à¤¾-à¤®à¤°à¤µà¤¾à¤¹à¥€","parent_id":"7"},
{"answer_id":"660","answer_english":"Gautam Buddha Nagar","answer_hindi":"à¤—à¥Œà¤¤à¤®à¤¬à¥à¤¦à¥à¤§ à¤¨à¤—à¤°","parent_id":"34"},
{"answer_id":"86","answer_english":"Gaya","answer_hindi":"à¤—à¤¯à¤¾","parent_id":"5"},
{"answer_id":"661","answer_english":"Ghaziabad","answer_hindi":"à¤—à¤¾à¤œà¤¿à¤¯à¤¾à¤¬à¤¾à¤¦","parent_id":"34"},
{"answer_id":"662","answer_english":"Ghazipur","answer_hindi":"à¤—à¤¼à¤¾à¤œà¤¼à¥€à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"172","answer_english":"Gir Somnath","answer_hindi":"à¤—à¤¿à¤° à¤¸à¥‹à¤®à¤¨à¤¾à¤¥","parent_id":"11"},
{"answer_id":"252","answer_english":"Giridih","answer_hindi":"à¤—à¤¿à¤°à¥€à¤¡à¥€à¤¹","parent_id":"15"},
{"answer_id":"55","answer_english":"Goalpara","answer_hindi":"à¤—à¥‹à¤µà¤¾à¤²à¤ªà¤¾à¤°à¤¾","parent_id":"4"},
{"answer_id":"268","answer_english":"Godda","answer_hindi":"à¤—à¥‹à¤¡à¥à¤¡à¤¾","parent_id":"15"},
{"answer_id":"56","answer_english":"Golaghat","answer_hindi":"à¤—à¥‹à¤²à¤¾à¤˜à¤¾à¤Ÿ","parent_id":"4"},
{"answer_id":"625","answer_english":"Gomati","answer_hindi":"à¤—à¥‹à¤®à¤¤à¥€","parent_id":"33"},
{"answer_id":"663","answer_english":"Gonda","answer_hindi":"à¤—à¥‹à¤‚à¤¡à¤¾","parent_id":"34"},
{"answer_id":"383","answer_english":"Gondia","answer_hindi":"à¤—à¥‹à¤‚à¤¦à¤¿à¤¯à¤¾","parent_id":"21"},
{"answer_id":"87","answer_english":"Gopalganj","answer_hindi":"à¤—à¥‹à¤ªà¤¾à¤²à¤—à¤‚à¤œ","parent_id":"5"},
{"answer_id":"664","answer_english":"Gorakhpur","answer_hindi":"à¤—à¥‹à¤°à¤–à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"285","answer_english":"Gulbarga","answer_hindi":"à¤—à¥à¤²à¤¬à¤°à¥à¤—","parent_id":"16"},
{"answer_id":"256","answer_english":"Gumla","answer_hindi":"à¤—à¥à¤®à¤²à¤¾","parent_id":"15"},
{"answer_id":"330","answer_english":"Guna ","answer_hindi":"à¤—à¥à¤¨à¤¾","parent_id":"20"},
{"answer_id":"4","answer_english":"Guntur","answer_hindi":"à¤—à¥à¤‚à¤Ÿà¥‚à¤°","parent_id":"1"},
{"answer_id":"500","answer_english":"Gurdaspur","answer_hindi":"à¤—à¥à¤°à¤¦à¤¾à¤¸à¤ªà¥à¤°","parent_id":"28"},
{"answer_id":"197","answer_english":"Gurgaon","answer_hindi":"à¤—à¥à¤°à¥à¤—à¥à¤°à¤¾à¤®","parent_id":"12"},
{"answer_id":"326","answer_english":"Gwalior ","answer_hindi":"à¤—à¥à¤µà¤¾à¤²à¤¿à¤¯à¤°","parent_id":"20"},
{"answer_id":"57","answer_english":"Hailakandi","answer_hindi":"à¤¹à¥ˆà¤²à¤¾à¤•à¤¾à¤‚à¤¡à¥€","parent_id":"4"},
{"answer_id":"665","answer_english":"Hamirpur","answer_hindi":"à¤¹à¤®à¥€à¤°à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"216","answer_english":"Hamirpur","answer_hindi":"à¤¹à¤®à¥€à¤°à¤ªà¥à¤°","parent_id":"13"},
{"answer_id":"530","answer_english":"Hanumangarh","answer_hindi":"à¤¹à¤¨à¥à¤®à¤¾à¤¨à¤—à¤¢à¤¼","parent_id":"29"},
{"answer_id":"666","answer_english":"Hapur","answer_hindi":"à¤¹à¤¾à¤ªà¥à¤¡à¤¼","parent_id":"34"},
{"answer_id":"348","answer_english":"Harda ","answer_hindi":"à¤¹à¤°à¤¦à¤¾","parent_id":"20"},
{"answer_id":"667","answer_english":"Hardoi","answer_hindi":"à¤¹à¤°à¤¦à¥‹à¤ˆ","parent_id":"34"},
{"answer_id":"711","answer_english":"Haridwar","answer_hindi":"à¤¹à¤°à¤¿à¤¦à¥à¤µà¤¾à¤°","parent_id":"35"},
{"answer_id":"286","answer_english":"Hassan","answer_hindi":"à¤¹à¤¾à¤¸à¤¨","parent_id":"16"},
{"answer_id":"668","answer_english":"Hathras","answer_hindi":"à¤¹à¤¾à¤¥à¤°à¤¸","parent_id":"34"},
{"answer_id":"287","answer_english":"Haveri","answer_hindi":"à¤¹à¤¾à¤µà¥‡à¤°à¥€","parent_id":"16"},
{"answer_id":"250","answer_english":"Hazaribagh","answer_hindi":"à¤¹à¤œà¤¾à¤°à¥€à¤¬à¤¾à¤—","parent_id":"15"},
{"answer_id":"384","answer_english":"Hingoli","answer_hindi":"à¤¹à¤¿à¤‚à¤—à¥‹à¤²à¥€","parent_id":"21"},
{"answer_id":"198","answer_english":"Hissar","answer_hindi":"à¤¹à¤¿à¤¸à¤¾à¤°","parent_id":"12"},
{"answer_id":"444","answer_english":"Hnahthial","answer_hindi":"à¤¹à¥à¤¨à¤¾à¤¹à¤¥à¤¿à¤†à¤²","parent_id":"24"},
{"answer_id":"58","answer_english":"Hojai","answer_hindi":"à¤¹à¥‹à¤œà¤¾à¤ˆ","parent_id":"4"},
{"answer_id":"727","answer_english":"Hooghly","answer_hindi":"à¤¹à¥à¤—à¤²à¥€","parent_id":"36"},
{"answer_id":"349","answer_english":"Hoshangabad ","answer_hindi":"à¤¹à¥‹à¤¶à¤‚à¤—à¤¾à¤¬à¤¾à¤¦","parent_id":"20"},
{"answer_id":"501","answer_english":"Hoshiarpur","answer_hindi":"à¤¹à¥‹à¤¶à¤¿à¤¯à¤¾à¤°à¤ªà¥à¤°","parent_id":"28"},
{"answer_id":"728","answer_english":"Howrah","answer_hindi":"à¤¹à¤¾à¤µà¤™à¤¾","parent_id":"36"},
{"answer_id":"593","answer_english":"Hyderabad","answer_hindi":"à¤¹à¥ˆà¤¦à¤°à¤¾à¤¬à¤¾à¤¦","parent_id":"32"},
{"answer_id":"303","answer_english":"Idukki","answer_hindi":"à¤‡à¤¡à¥à¤•à¥à¤•à¥€Â ","parent_id":"17"},
{"answer_id":"411","answer_english":"Imphal East","answer_hindi":"à¤‡à¤®à¥à¤«à¤¾à¤² à¤ªà¥‚à¤°à¥à¤µ","parent_id":"22"},
{"answer_id":"412","answer_english":"Imphal West","answer_hindi":"à¤‡à¤®à¥à¤«à¤¾à¤² à¤ªà¤¶à¥à¤šà¤¿à¤®","parent_id":"22"},
{"answer_id":"334","answer_english":"Indore ","answer_hindi":"à¤‡à¤¨à¥à¤¦à¥Œà¤°","parent_id":"20"},
{"answer_id":"341","answer_english":"Jabalpur ","answer_hindi":"à¤œà¤¬à¤²à¤ªà¥à¤°","parent_id":"20"},
{"answer_id":"472","answer_english":"Jagatsinghapur","answer_hindi":"à¤œà¤—à¤¤à¤¸à¤¿à¤‚à¤¹à¤ªà¥à¤°","parent_id":"26"},
{"answer_id":"594","answer_english":"Jagtial","answer_hindi":"à¤œà¤—à¤¿à¤¤à¥à¤¯à¤¾à¤²","parent_id":"32"},
{"answer_id":"534","answer_english":"Jaipur","answer_hindi":"à¤œà¤¯à¤ªà¥à¤°","parent_id":"29"},
{"answer_id":"535","answer_english":"Jaisalmer","answer_hindi":"à¤œà¥ˆà¤¸à¤²à¤®à¥‡à¤°","parent_id":"29"},
{"answer_id":"471","answer_english":"Jajpur","answer_hindi":"à¤œà¤¾à¤œà¤ªà¥à¤°","parent_id":"26"},
{"answer_id":"502","answer_english":"Jalandhar","answer_hindi":"à¤œà¤¾à¤²à¤‚à¤§à¤°","parent_id":"28"},
{"answer_id":"669","answer_english":"Jalaun","answer_hindi":"à¤œà¤²à¥Œà¤¨","parent_id":"34"},
{"answer_id":"385","answer_english":"Jalgaon","answer_hindi":"à¤œà¤³à¤—à¤¾à¤µ","parent_id":"21"},
{"answer_id":"386","answer_english":"Jalna","answer_hindi":"à¤œà¤¾à¤²à¤¨à¤¾","parent_id":"21"},
{"answer_id":"532","answer_english":"Jalore","answer_hindi":"à¤œà¤¾à¤²à¥Œà¤°","parent_id":"29"},
{"answer_id":"729","answer_english":"Jalpaiguri","answer_hindi":"à¤œà¤²à¤ªà¤¾à¤ˆà¤—à¥à¤™à¥€","parent_id":"36"},
{"answer_id":"232","answer_english":"Jammu","answer_hindi":"à¤œà¤®à¥à¤®à¥‚","parent_id":"14"},
{"answer_id":"173","answer_english":"Jamnagar","answer_hindi":"à¤œà¤¾à¤®à¤¨à¤—à¤°","parent_id":"11"},
{"answer_id":"264","answer_english":"Jamtara","answer_hindi":"à¤œà¤¾à¤®à¤¤à¤¾à¤¡à¤¼à¤¾","parent_id":"15"},
{"answer_id":"88","answer_english":"Jamui","answer_hindi":"à¤œà¤®à¥à¤ˆ","parent_id":"5"},
{"answer_id":"595","answer_english":"Jangaon","answer_hindi":"à¤œà¤¨à¤—à¤¾à¤à¤µ","parent_id":"32"},
{"answer_id":"127","answer_english":"Janjgir-Champa","answer_hindi":"à¤œà¤¾à¤‚à¤œà¤—à¥€à¤°-à¤šà¤¾à¤®à¥à¤ªà¤¾","parent_id":"7"},
{"answer_id":"128","answer_english":"Jashpur","answer_hindi":"à¤œà¤¶à¤ªà¥à¤°","parent_id":"7"},
{"answer_id":"670","answer_english":"Jaunpur","answer_hindi":"à¤œà¥Œà¤¨à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"596","answer_english":"Jayashankar Bhupalpally","answer_hindi":"à¤œà¤¯à¤¶à¤‚à¤•à¤° à¤­à¥‚à¤ªà¤²à¤ªà¤²à¥à¤²à¥€","parent_id":"32"},
{"answer_id":"89","answer_english":"Jehanabad","answer_hindi":"à¤œà¤¹à¤¾à¤¨à¤¾à¤¬à¤¾à¤¦","parent_id":"5"},
{"answer_id":"336","answer_english":"Jhabua ","answer_hindi":"à¤à¤¾à¤¬à¥à¤†","parent_id":"20"},
{"answer_id":"199","answer_english":"Jhajjar","answer_hindi":"à¤à¤œà¥à¤œà¤°","parent_id":"12"},
{"answer_id":"536","answer_english":"Jhalawar","answer_hindi":"à¤à¤¾à¤²à¤¾à¤µà¤¾à¤¡à¤¼","parent_id":"29"},
{"answer_id":"671","answer_english":"Jhansi","answer_hindi":"à¤à¤¾à¤à¤¸à¥€","parent_id":"34"},
{"answer_id":"730","answer_english":"Jhargram","answer_hindi":"à¤à¤¾à¤¡à¤¼à¤—à¥à¤°à¤¾à¤®","parent_id":"36"},
{"answer_id":"470","answer_english":"Jharsuguda","answer_hindi":"à¤à¤¾à¤°à¤¸à¥à¤—à¥à¤¡à¤¼à¤¾","parent_id":"26"},
{"answer_id":"531","answer_english":"Jhunjhunu","answer_hindi":"à¤à¥à¤‚à¤à¥à¤¨à¥‚","parent_id":"29"},
{"answer_id":"200","answer_english":"Jind","answer_hindi":"à¤œà¥€à¤‚à¤¦","parent_id":"12"},
{"answer_id":"418","answer_english":"Jiribam","answer_hindi":"à¤œà¤¿à¤°à¤¿à¤¬à¤¾à¤®","parent_id":"22"},
{"answer_id":"533","answer_english":"Jodhpur","answer_hindi":"à¤œà¥‹à¤§à¤ªà¥à¤°","parent_id":"29"},
{"answer_id":"597","answer_english":"Jogulamba Gadwal","answer_hindi":"à¤œà¥‹à¤—à¥à¤²à¤¾à¤®à¥à¤¬à¤¾ à¤—à¤¦à¥à¤µà¤¾à¤²","parent_id":"32"},
{"answer_id":"59","answer_english":"Jorhat","answer_hindi":"à¤œà¥‹à¤°à¤¹à¤¾à¤Ÿ","parent_id":"4"},
{"answer_id":"174","answer_english":"Junagadh","answer_hindi":"à¤œà¥‚à¤¨à¤¾à¤—à¥","parent_id":"11"},
{"answer_id":"129","answer_english":"Kabirdham \/ Kawardha","answer_hindi":"à¤•à¤¬à¥€à¤°à¤§à¤¾à¤® \/ à¤•à¤µà¤°à¥à¤§à¤¾","parent_id":"7"},
{"answer_id":"5","answer_english":"Kadapa","answer_hindi":"à¤•à¤¡à¤¼à¤ªà¥à¤ªà¤¾","parent_id":"1"},
{"answer_id":"90","answer_english":"Kaimur","answer_hindi":"à¤•à¥ˆà¤®à¥‚à¤°","parent_id":"5"},
{"answer_id":"201","answer_english":"Kaithal","answer_hindi":"à¤•à¥ˆà¤¥à¤²","parent_id":"12"},
{"answer_id":"420","answer_english":"Kakching","answer_hindi":"à¤•à¤•à¤šà¤¿à¤‚à¤—Â ","parent_id":"22"},
{"answer_id":"475","answer_english":"Kalahandi","answer_hindi":"à¤•à¤²à¤¾à¤¹à¤¾à¤¨à¥à¤¡à¥€","parent_id":"26"},
{"answer_id":"731","answer_english":"Kalimpong","answer_hindi":"à¤•à¤²à¤¿à¤®à¥à¤ªà¥‹à¤—","parent_id":"36"},
{"answer_id":"560","answer_english":"Kallakurichi","answer_hindi":"à¤•à¤²à¥à¤²à¤¾à¤•à¥à¤°à¤¿à¤šà¥€","parent_id":"31"},
{"answer_id":"598","answer_english":"Kamareddy","answer_hindi":"à¤•à¤¾à¤®à¤¾à¤°à¥‡à¤¡à¥à¤¡à¥€","parent_id":"32"},
{"answer_id":"422","answer_english":"Kamjong","answer_hindi":"à¤•à¤®à¤œà¥‹à¤‚à¤—Â ","parent_id":"22"},
{"answer_id":"21","answer_english":"Kamle","answer_hindi":"à¤•à¤®à¤²à¥‡","parent_id":"3"},
{"answer_id":"61","answer_english":"Kamrup","answer_hindi":"à¤•à¤¾à¤®à¤°à¥‚à¤ª","parent_id":"4"},
{"answer_id":"60","answer_english":"Kamrup Metropolitan","answer_hindi":"à¤•à¤¾à¤®à¤°à¥‚à¤ª à¤®à¤¹à¤¾à¤¨à¤—à¤°","parent_id":"4"},
{"answer_id":"561","answer_english":"Kanchipuram","answer_hindi":"à¤•à¤¾à¤‚à¤šà¥€à¤ªà¥à¤°à¤®","parent_id":"31"},
{"answer_id":"476","answer_english":"Kandhamal","answer_hindi":"à¤•à¤¨à¥à¤§à¤®à¤¾à¤²","parent_id":"26"},
{"answer_id":"419","answer_english":"KangpokpiÂ (Sadar Hills)","answer_hindi":"à¤•à¤‚à¤—à¤ªà¥‹à¤•à¤ªà¥€","parent_id":"22"},
{"answer_id":"217","answer_english":"Kangra","answer_hindi":"à¤•à¤¾à¤à¤—à¤¡à¤¼à¤¾","parent_id":"13"},
{"answer_id":"130","answer_english":"Kanker","answer_hindi":"à¤•à¤¾à¤‚à¤•à¥‡à¤° Â (à¤‰à¤¤à¥à¤¤à¤° à¤¬à¤¸à¥à¤¤à¤°)","parent_id":"7"},
{"answer_id":"672","answer_english":"Kannauj","answer_hindi":"à¤•à¤¨à¥à¤¨à¥Œà¤œ","parent_id":"34"},
{"answer_id":"304","answer_english":"Kannur","answer_hindi":"à¤•à¤¨à¥à¤¨à¥‚à¤°","parent_id":"17"},
{"answer_id":"673","answer_english":"Kanpur Dehat","answer_hindi":"à¤•à¤¾à¤¨à¤ªà¥à¤° à¤¦à¥‡à¤¹à¤¾à¤¤","parent_id":"34"},
{"answer_id":"674","answer_english":"Kanpur Nagar","answer_hindi":"à¤•à¤¾à¤¨à¤ªà¥à¤° à¤¨à¤—à¤°","parent_id":"34"},
{"answer_id":"562","answer_english":"Kanyakumari","answer_hindi":"à¤•à¤¨à¥à¤¯à¤¾à¤•à¥à¤®à¤¾à¤°à¥€","parent_id":"31"},
{"answer_id":"503","answer_english":"Kapurthala","answer_hindi":"à¤•à¤ªà¥‚à¤°à¤¥à¤²à¤¾","parent_id":"28"},
{"answer_id":"489","answer_english":"Karaikal","answer_hindi":"à¤•à¤°à¤¾à¤ˆà¤•à¤²Â ","parent_id":"27"},
{"answer_id":"537","answer_english":"Karauli","answer_hindi":"à¤•à¤°à¥Œà¤²à¥€","parent_id":"29"},
{"answer_id":"62","answer_english":"Karbi Anglong","answer_hindi":"à¤•à¤¾à¤°à¥à¤¬à¥€ à¤†à¤‚à¤—à¤²à¥‹à¤‚à¤—","parent_id":"4"},
{"answer_id":"315","answer_english":"KargilÂ ","answer_hindi":"à¤•à¤¾à¤°à¤—à¤¿à¤²","parent_id":"18"},
{"answer_id":"63","answer_english":"Karimganj","answer_hindi":"à¤•à¤°à¥€à¤®à¤—à¤‚à¤œ","parent_id":"4"},
{"answer_id":"599","answer_english":"Karimnagar","answer_hindi":"à¤•à¤°à¥€à¤®à¤¨à¤—à¤°","parent_id":"32"},
{"answer_id":"202","answer_english":"Karnal","answer_hindi":"à¤•à¤°à¤¨à¤¾à¤²","parent_id":"12"},
{"answer_id":"563","answer_english":"Karur","answer_hindi":"à¤•à¤°à¥‚à¤°","parent_id":"31"},
{"answer_id":"305","answer_english":"Kasaragod","answer_hindi":"à¤•à¤¾à¤¸à¤°à¤—à¥‹à¤¡Â ","parent_id":"17"},
{"answer_id":"675","answer_english":"Kasganj","answer_hindi":"à¤•à¤¾à¤¸à¤—à¤‚à¤œÂ ","parent_id":"34"},
{"answer_id":"233","answer_english":"Kathua","answer_hindi":"à¤•à¤ à¥à¤†","parent_id":"14"},
{"answer_id":"91","answer_english":"Katihar","answer_hindi":"à¤•à¤Ÿà¤¿à¤¹à¤¾à¤°","parent_id":"5"},
{"answer_id":"342","answer_english":"Katni ","answer_hindi":"à¤•à¤Ÿà¤¨à¥€","parent_id":"20"},
{"answer_id":"676","answer_english":"Kaushambi","answer_hindi":"à¤•à¥Œà¤¶à¤¾à¤®à¥à¤¬à¥€","parent_id":"34"},
{"answer_id":"478","answer_english":"Kendrapara","answer_hindi":"à¤•à¥‡à¤¨à¥à¤¦à¥à¤°à¤¾à¤ªà¤¡à¤¼à¤¾","parent_id":"26"},
{"answer_id":"474","answer_english":"Kendujhar","answer_hindi":"à¤•à¥‡à¤¨à¥à¤¦à¥à¤à¤°","parent_id":"26"},
{"answer_id":"92","answer_english":"Khagaria","answer_hindi":"à¤–à¤—à¤¡à¤¼à¤¿à¤¯à¤¾","parent_id":"5"},
{"answer_id":"600","answer_english":"Khammam","answer_hindi":"à¤–à¤®à¥à¤®à¤®","parent_id":"32"},
{"answer_id":"337","answer_english":"Khandwa (East Nimar)","answer_hindi":"à¤–à¤‚à¤¡à¤µà¤¾","parent_id":"20"},
{"answer_id":"338","answer_english":"Khargone (West Nimar)","answer_hindi":"à¤–à¤°à¤—à¥‹à¤¨","parent_id":"20"},
{"answer_id":"445","answer_english":"Khawzawl","answer_hindi":"à¤–à¤¾à¤µà¤œà¥Œà¤²","parent_id":"24"},
{"answer_id":"176","answer_english":"Kheda","answer_hindi":"à¤–à¥‡à¤¡à¤¼à¤¾","parent_id":"11"},
{"answer_id":"473","answer_english":"Khordha","answer_hindi":"à¤–à¥‹à¤°à¥à¤§à¤¾","parent_id":"26"},
{"answer_id":"628","answer_english":"Khowai","answer_hindi":"à¤–à¥‹à¤µà¤¾à¤ˆ","parent_id":"33"},
{"answer_id":"260","answer_english":"Khunti","answer_hindi":"à¤–à¥à¤Ÿà¥€","parent_id":"15"},
{"answer_id":"218","answer_english":"Kinnaur","answer_hindi":"à¤•à¤¿à¤¨à¥à¤¨à¥Œà¤°","parent_id":"13"},
{"answer_id":"448","answer_english":"Kiphire","answer_hindi":"à¤•à¥ˆà¤«à¤¾à¤‡à¤°","parent_id":"25"},
{"answer_id":"93","answer_english":"Kishanganj","answer_hindi":"à¤•à¤¿à¤¶à¤¨à¤—à¤‚à¤œ","parent_id":"5"},
{"answer_id":"234","answer_english":"Kishtwar","answer_hindi":"à¤•à¤¿à¤¶à¥à¤¤à¤µà¤¾à¤¡à¤¼","parent_id":"14"},
{"answer_id":"288","answer_english":"Kodagu","answer_hindi":"à¤•à¥‹à¤¡à¤—à¥","parent_id":"16"},
{"answer_id":"251","answer_english":"Koderma","answer_hindi":"à¤•à¥‹à¤¡à¤°à¤®à¤¾","parent_id":"15"},
{"answer_id":"449","answer_english":"Kohima","answer_hindi":"à¤•à¥‹à¤¹à¤¿à¤®à¤¾","parent_id":"25"},
{"answer_id":"64","answer_english":"Kokrajhar","answer_hindi":"à¤•à¥‹à¤•à¤°à¤¾à¤à¤¾à¤°","parent_id":"4"},
{"answer_id":"289","answer_english":"Kolar","answer_hindi":"à¤•à¥‹à¤²à¤¾à¤°","parent_id":"16"},
{"answer_id":"437","answer_english":"Kolasib","answer_hindi":"à¤•à¥‹à¤²à¤¾à¤¸à¤¿à¤¬","parent_id":"24"},
{"answer_id":"387","answer_english":"Kolhapur","answer_hindi":"à¤•à¥‹à¤²à¥à¤¹à¤¾à¤ªà¥à¤°","parent_id":"21"},
{"answer_id":"732","answer_english":"Kolkata","answer_hindi":"à¤•à¥‹à¤²à¤•à¤¾à¤¤à¤¾","parent_id":"36"},
{"answer_id":"306","answer_english":"Kollam","answer_hindi":"à¤•à¥‹à¤²à¥à¤²à¤®","parent_id":"17"},
{"answer_id":"591","answer_english":"Komaram Bheem","answer_hindi":"à¤•à¥‹à¤®à¤°à¤® à¤­à¥€à¤®","parent_id":"32"},
{"answer_id":"131","answer_english":"Kondagaon","answer_hindi":"à¤•à¥‹à¤‚à¤¡à¤—à¤¾à¤à¤µ","parent_id":"7"},
{"answer_id":"290","answer_english":"Koppal","answer_hindi":"à¤•à¥‹à¤ªà¥à¤ªà¤²","parent_id":"16"},
{"answer_id":"477","answer_english":"Koraput","answer_hindi":"à¤•à¥‹à¤°à¤¾à¤ªà¥à¤Ÿ","parent_id":"26"},
{"answer_id":"132","answer_english":"Korba","answer_hindi":"à¤•à¥‹à¤°à¤¬à¤¾","parent_id":"7"},
{"answer_id":"133","answer_english":"Koriya","answer_hindi":"à¤•à¥‹à¤°à¤¿à¤¯à¤¾","parent_id":"7"},
{"answer_id":"538","answer_english":"Kota","answer_hindi":"à¤•à¥‹à¤Ÿà¤¾","parent_id":"29"},
{"answer_id":"307","answer_english":"Kottayam","answer_hindi":"à¤•à¥‹à¤Ÿà¥à¤Ÿà¤¯à¤®","parent_id":"17"},
{"answer_id":"308","answer_english":"Kozhikode","answer_hindi":"à¤•à¥‹à¤¡à¤¼à¤¿à¤•à¥‹à¤¡","parent_id":"17"},
{"answer_id":"22","answer_english":"Kra Daadi","answer_hindi":"à¤•à¥à¤°à¤¾ à¤¦à¤¾à¤¦à¥€","parent_id":"3"},
{"answer_id":"6","answer_english":"Krishna","answer_hindi":"à¤•à¥ƒà¤·à¥à¤£à¤¾","parent_id":"1"},
{"answer_id":"564","answer_english":"Krishnagiri","answer_hindi":"à¤•à¥ƒà¤·à¥à¤£à¤—à¤¿à¤°à¤¿","parent_id":"31"},
{"answer_id":"235","answer_english":"Kulgam","answer_hindi":"à¤•à¥à¤²à¤—à¤¾à¤®","parent_id":"14"},
{"answer_id":"219","answer_english":"Kullu","answer_hindi":"à¤•à¥à¤²à¥à¤²à¥‚","parent_id":"13"},
{"answer_id":"236","answer_english":"Kupwara","answer_hindi":"à¤•à¥à¤ªà¤µà¤¾à¤¡à¤¼à¤¾","parent_id":"14"},
{"answer_id":"7","answer_english":"Kurnool","answer_hindi":"à¤•à¥à¤°à¥à¤¨à¥‚à¤²","parent_id":"1"},
{"answer_id":"203","answer_english":"Kurukshetra","answer_hindi":"à¤•à¥à¤°à¥à¤•à¥à¤·à¥‡à¤¤à¥à¤°","parent_id":"12"},
{"answer_id":"23","answer_english":"Kurung Kumey","answer_hindi":"à¤•à¥à¤°à¥à¤‚à¤— à¤•à¥à¤®à¥‡","parent_id":"3"},
{"answer_id":"677","answer_english":"Kushinagar","answer_hindi":"à¤•à¥à¤¶à¥€à¤¨à¤—à¤° (à¤ªà¤¡à¤¼à¤°à¥Œà¤¨à¤¾)","parent_id":"34"},
{"answer_id":"175","answer_english":"Kutch","answer_hindi":"à¤•à¤šà¥à¤›","parent_id":"11"},
{"answer_id":"220","answer_english":"Lahaul and Spiti","answer_hindi":"à¤²à¤¾à¤¹à¥Œà¤² à¤”à¤° à¤¸à¥à¤ªà¥€à¤¤à¥€","parent_id":"13"},
{"answer_id":"65","answer_english":"Lakhimpur","answer_hindi":"à¤²à¤–à¥€à¤®à¤ªà¥à¤°","parent_id":"4"},
{"answer_id":"678","answer_english":"Lakhimpur Kheri","answer_hindi":"à¤²à¤–à¥€à¤®à¤ªà¥à¤°-à¤–à¤¿à¤°à¥€","parent_id":"34"},
{"answer_id":"94","answer_english":"Lakhisarai","answer_hindi":"à¤²à¤–à¥€à¤¸à¤°à¤¾à¤¯","parent_id":"5"},
{"answer_id":"317","answer_english":"Lakshadweep","answer_hindi":"à¤²à¤•à¥à¤·à¤¦à¥à¤µà¥€à¤ª","parent_id":"19"},
{"answer_id":"679","answer_english":"Lalitpur","answer_hindi":"à¤²à¤²à¤¿à¤¤à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"248","answer_english":"Latehar","answer_hindi":"à¤²à¤¾à¤¤à¥‡à¤¹à¤¾à¤°","parent_id":"15"},
{"answer_id":"388","answer_english":"Latur","answer_hindi":"à¤²à¤¾à¤¤à¥‚à¤°","parent_id":"21"},
{"answer_id":"438","answer_english":"Lawngtlai","answer_hindi":"à¤²à¥‰à¤™à¥à¤—à¤¤à¤²à¤¾à¤ˆ","parent_id":"24"},
{"answer_id":"316","answer_english":"LehÂ ","answer_hindi":"à¤²à¥‡à¤¹","parent_id":"18"},
{"answer_id":"24","answer_english":"Lepa Rada","answer_hindi":"à¤²à¥‡à¤ªà¤¾ à¤°à¤¾à¤¦à¤¾","parent_id":"3"},
{"answer_id":"257","answer_english":"Lohardaga","answer_hindi":"à¤²à¥‹à¤¹à¤°à¤¦à¤—à¥à¤—à¤¾","parent_id":"15"},
{"answer_id":"25","answer_english":"Lohit","answer_hindi":"à¤²à¥‹à¤¹à¤¿à¤¤","parent_id":"3"},
{"answer_id":"26","answer_english":"Longding","answer_hindi":"à¤²à¥‹à¤‚à¤—à¤¡à¤¿à¤‚à¤—","parent_id":"3"},
{"answer_id":"450","answer_english":"Longleng","answer_hindi":"à¤²à¥‰à¤¨à¥à¤—à¤²à¥‡à¤¨à¥à¤—","parent_id":"25"},
{"answer_id":"27","answer_english":"Lower Dibang Valley","answer_hindi":"à¤¨à¤¿à¤šà¤²à¥€ à¤¦à¤¿à¤¬à¤¾à¤‚à¤— à¤˜à¤¾à¤Ÿà¥€","parent_id":"3"},
{"answer_id":"28","answer_english":"Lower Siang","answer_hindi":"à¤¨à¤¿à¤šà¤²à¤¾ à¤¸à¤¿à¤¯à¤¾à¤‚à¤—","parent_id":"3"},
{"answer_id":"29","answer_english":"Lower Subansiri","answer_hindi":"à¤¨à¤¿à¤šà¤²à¥€ à¤¸à¥à¤¬à¤¨à¤¸à¤¿à¤°à¥€","parent_id":"3"},
{"answer_id":"680","answer_english":"Lucknow","answer_hindi":"à¤²à¤–à¤¨à¤Š","parent_id":"34"},
{"answer_id":"504","answer_english":"Ludhiana","answer_hindi":"à¤²à¥à¤§à¤¿à¤¯à¤¾à¤¨à¤¾","parent_id":"28"},
{"answer_id":"439","answer_english":"Lunglei","answer_hindi":"à¤²à¥à¤‚à¤—à¤²à¥‡à¤ˆ","parent_id":"24"},
{"answer_id":"95","answer_english":"Madhepura","answer_hindi":"à¤®à¤§à¥‡à¤ªà¥à¤°à¤¾","parent_id":"5"},
{"answer_id":"96","answer_english":"Madhubani","answer_hindi":"à¤®à¤§à¥à¤¬à¤¨à¥€","parent_id":"5"},
{"answer_id":"565","answer_english":"Madurai","answer_hindi":"à¤®à¤¦à¥à¤°à¤ˆ","parent_id":"31"},
{"answer_id":"601","answer_english":"Mahabubabad","answer_hindi":"à¤®à¤¹à¤¾à¤¬à¥‚à¤¬à¤¾à¤¬à¤¾à¤¦","parent_id":"32"},
{"answer_id":"681","answer_english":"Maharajganj","answer_hindi":"à¤®à¤¹à¤¾à¤°à¤¾à¤œà¤—à¤‚à¤œ","parent_id":"34"},
{"answer_id":"134","answer_english":"Mahasamund","answer_hindi":"à¤®à¤¹à¤¾à¤¸à¤®à¥à¤¨à¥à¤¦","parent_id":"7"},
{"answer_id":"602","answer_english":"Mahbubnagar","answer_hindi":"à¤®à¤¹à¤¬à¥‚à¤¬à¤¨à¤—à¤°","parent_id":"32"},
{"answer_id":"490","answer_english":"MahÃ©","answer_hindi":"à¤®à¤¾à¤¹à¥‡Â ","parent_id":"27"},
{"answer_id":"204","answer_english":"Mahendragarh","answer_hindi":"à¤®à¤¹à¥‡à¤‚à¤¦à¥à¤°à¤—à¤¢à¤¼","parent_id":"12"},
{"answer_id":"177","answer_english":"Mahisagar","answer_hindi":"à¤®à¤¹à¥€à¤¸à¤¾à¤—à¤°","parent_id":"11"},
{"answer_id":"682","answer_english":"Mahoba","answer_hindi":"à¤®à¤¹à¥‹à¤¬à¤¾","parent_id":"34"},
{"answer_id":"371","answer_english":"Maihar","answer_hindi":"à¤®à¥ˆà¤¹à¤°","parent_id":"20"},
{"answer_id":"683","answer_english":"Mainpuri","answer_hindi":"à¤®à¥ˆà¤¨à¤ªà¥à¤°à¥€","parent_id":"34"},
{"answer_id":"66","answer_english":"Majuli","answer_hindi":"à¤®à¤¾à¤œà¥à¤²à¥€","parent_id":"4"},
{"answer_id":"309","answer_english":"Malappuram","answer_hindi":"à¤®à¤²à¤ªà¥à¤ªà¥à¤°à¤®","parent_id":"17"},
{"answer_id":"733","answer_english":"Maldah","answer_hindi":"à¤®à¤¾à¤²à¤¦à¤¹","parent_id":"36"},
{"answer_id":"479","answer_english":"Malkangiri","answer_hindi":"à¤®à¤¾à¤²à¤•à¤¾à¤¨à¤—à¤¿à¤°à¤¿","parent_id":"26"},
{"answer_id":"440","answer_english":"Mamit","answer_hindi":"à¤®à¤®à¤¿à¤¤","parent_id":"24"},
{"answer_id":"603","answer_english":"Mancherial","answer_hindi":"à¤®à¤‚à¤šà¥‡à¤°à¤¿à¤¯à¤²","parent_id":"32"},
{"answer_id":"221","answer_english":"Mandi","answer_hindi":"à¤®à¤‚à¤¡à¥€","parent_id":"13"},
{"answer_id":"343","answer_english":"Mandla ","answer_hindi":"à¤®à¤‚à¤¡à¤²à¤¾","parent_id":"20"},
{"answer_id":"365","answer_english":"Mandsaur","answer_hindi":"à¤®à¤‚à¤¦à¤¸à¥Œà¤°","parent_id":"20"},
{"answer_id":"291","answer_english":"Mandya","answer_hindi":"à¤®à¤¾à¤‚à¤¡à¤¯à¤¾","parent_id":"16"},
{"answer_id":"505","answer_english":"Mansa","answer_hindi":"à¤®à¤¾à¤¨à¤¸à¤¾","parent_id":"28"},
{"answer_id":"684","answer_english":"Mathura","answer_hindi":"à¤®à¤¥à¥à¤°à¤¾","parent_id":"34"},
{"answer_id":"685","answer_english":"Mau","answer_hindi":"à¤®à¤Š","parent_id":"34"},
{"answer_id":"566","answer_english":"Mayiladuthurai","answer_hindi":"à¤®à¤¯à¥€à¤²à¤¾à¤¡à¥‚à¤¤à¥à¤°à¥ˆ","parent_id":"31"},
{"answer_id":"480","answer_english":"Mayurbhanj","answer_hindi":"à¤®à¤¯à¥‚à¤°à¤­à¤‚à¤œ","parent_id":"26"},
{"answer_id":"604","answer_english":"Medak","answer_hindi":"à¤®à¥‡à¤¦à¤•","parent_id":"32"},
{"answer_id":"605","answer_english":"Medchal-Malkajgiri","answer_hindi":"à¤®à¥‡à¤¡à¥à¤šà¤² à¤®à¤²à¥à¤•à¤¾à¤œà¤—à¤¿à¤°à¤¿","parent_id":"32"},
{"answer_id":"686","answer_english":"Meerut","answer_hindi":"à¤®à¥‡à¤°à¤ ","parent_id":"34"},
{"answer_id":"178","answer_english":"Mehsana","answer_hindi":"à¤®à¥‡à¤¹à¤¸à¤¾à¤£à¤¾","parent_id":"11"},
{"answer_id":"687","answer_english":"Mirzapur","answer_hindi":"à¤®à¤¿à¤°à¥à¤œà¤¼à¤¾à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"506","answer_english":"Moga","answer_hindi":"à¤®à¥‹à¤—à¤¾","parent_id":"28"},
{"answer_id":"451","answer_english":"Mokokchung","answer_hindi":"à¤®à¥‹à¤•à¥‹à¤•à¤šà¥à¤†à¤‚à¤—","parent_id":"25"},
{"answer_id":"452","answer_english":"Mon","answer_hindi":"à¤®à¥‹à¤¨","parent_id":"25"},
{"answer_id":"688","answer_english":"Moradabad","answer_hindi":"à¤®à¥à¤°à¤¾à¤¦à¤¾à¤¬à¤¾à¤¦","parent_id":"34"},
{"answer_id":"179","answer_english":"Morbi","answer_hindi":"à¤®à¥‹à¤°à¤¬à¥€","parent_id":"11"},
{"answer_id":"323","answer_english":"Morena ","answer_hindi":"à¤®à¥à¤°à¥ˆà¤¨à¤¾","parent_id":"20"},
{"answer_id":"67","answer_english":"Morigaon","answer_hindi":"à¤®à¤¾à¤°à¤¿à¤—à¤¾à¤‚à¤µ","parent_id":"4"},
{"answer_id":"606","answer_english":"Mulugu","answer_hindi":"à¤®à¥à¤²à¥à¤—à¥","parent_id":"32"},
{"answer_id":"389","answer_english":"Mumbai","answer_hindi":"à¤®à¥à¤‚à¤¬à¤ˆ","parent_id":"21"},
{"answer_id":"390","answer_english":"Mumbai Suburban","answer_hindi":"à¤®à¥à¤‚à¤¬à¤ˆ (à¤¸à¤¬à¤…à¤°à¥à¤¬à¤¨)","parent_id":"21"},
{"answer_id":"135","answer_english":"Mungeli","answer_hindi":"à¤®à¥à¤‚à¤—à¥‡à¤²à¥€","parent_id":"7"},
{"answer_id":"97","answer_english":"Munger","answer_hindi":"à¤®à¥à¤‚à¤—à¥‡à¤°","parent_id":"5"},
{"answer_id":"734","answer_english":"Murshidabad","answer_hindi":"à¤®à¥à¤°à¥à¤¶à¤¿à¤¦à¤¾à¤¬à¤¾à¤¦","parent_id":"36"},
{"answer_id":"689","answer_english":"Muzaffarnagar","answer_hindi":"à¤®à¥à¤œà¤«à¥à¤«à¤°à¤¨à¤—à¤°","parent_id":"34"},
{"answer_id":"98","answer_english":"Muzaffarpur","answer_hindi":"à¤®à¥à¤œà¤«à¥à¤«à¤°à¤ªà¥à¤°","parent_id":"5"},
{"answer_id":"292","answer_english":"Mysore","answer_hindi":"à¤®à¥ˆà¤¸à¥‚à¤°","parent_id":"16"},
{"answer_id":"481","answer_english":"Nabarangpur","answer_hindi":"à¤¨à¤¬à¤°à¤‚à¤—à¤ªà¥à¤°","parent_id":"26"},
{"answer_id":"735","answer_english":"Nadia","answer_hindi":"à¤¨à¤¾à¤¦à¤¿à¤¯à¤¾","parent_id":"36"},
{"answer_id":"68","answer_english":"Nagaon","answer_hindi":"à¤¨à¤—à¤¾à¤‚à¤µ","parent_id":"4"},
{"answer_id":"567","answer_english":"Nagapattinam","answer_hindi":"à¤¨à¤¾à¤—à¤ªà¤Ÿà¥à¤Ÿà¤¿à¤¨à¤®","parent_id":"31"},
{"answer_id":"609","answer_english":"Nagarkurnool","answer_hindi":"à¤¨à¤¾à¤—à¤°à¤•à¤°à¥à¤¨à¥‚à¤²","parent_id":"32"},
{"answer_id":"539","answer_english":"Nagaur","answer_hindi":"à¤¨à¤¾à¤—à¥Œà¤°","parent_id":"29"},
{"answer_id":"372","answer_english":"Nagda","answer_hindi":"à¤¨à¤¾à¤—à¤¦à¤¾","parent_id":"20"},
{"answer_id":"391","answer_english":"Nagpur","answer_hindi":"à¤¨à¤¾à¤—à¤ªà¥à¤°","parent_id":"21"},
{"answer_id":"712","answer_english":"Nainital","answer_hindi":"à¤¨à¥ˆà¤¨à¥€à¤¤à¤¾à¤²","parent_id":"35"},
{"answer_id":"99","answer_english":"Nalanda","answer_hindi":"à¤¨à¤¾à¤²à¤‚à¤¦à¤¾","parent_id":"5"},
{"answer_id":"69","answer_english":"Nalbari","answer_hindi":"à¤¨à¤²à¤¬à¤¾à¤¡à¤¼à¥€","parent_id":"4"},
{"answer_id":"607","answer_english":"Nalgonda","answer_hindi":"à¤¨à¤²à¤—à¥‹à¤‚à¤¡à¤¾","parent_id":"32"},
{"answer_id":"569","answer_english":"Namakkal","answer_hindi":"à¤¨à¤¾à¤®à¤•à¥à¤•à¤²","parent_id":"31"},
{"answer_id":"30","answer_english":"Namsai","answer_hindi":"à¤¨à¤¾à¤®à¤¸à¤¾à¤ˆ","parent_id":"3"},
{"answer_id":"392","answer_english":"Nanded","answer_hindi":"à¤¨à¤¾à¤‚à¤¦à¥‡à¤¡","parent_id":"21"},
{"answer_id":"393","answer_english":"Nandurbar","answer_hindi":"à¤¨à¤‚à¤¦à¥à¤°à¤¬à¤¾à¤°","parent_id":"21"},
{"answer_id":"608","answer_english":"Narayanpet","answer_hindi":"à¤¨à¤¾à¤°à¤¾à¤¯à¤£à¤ªà¥‡à¤Ÿ","parent_id":"32"},
{"answer_id":"136","answer_english":"Narayanpur","answer_hindi":"à¤¨à¤¾à¤°à¤¾à¤¯à¤£à¤ªà¥à¤°","parent_id":"7"},
{"answer_id":"180","answer_english":"Narmada","answer_hindi":"à¤¨à¤°à¥à¤®à¤¦à¤¾","parent_id":"11"},
{"answer_id":"344","answer_english":"Narsinghpur ","answer_hindi":"à¤¨à¤°à¤¸à¤¿à¤‚à¤¹à¤ªà¥à¤°","parent_id":"20"},
{"answer_id":"394","answer_english":"Nashik","answer_hindi":"à¤¨à¤¾à¤¶à¤¿à¤•","parent_id":"21"},
{"answer_id":"181","answer_english":"Navsari","answer_hindi":"à¤¨à¤µà¤¸à¤¾à¤°à¥€","parent_id":"11"},
{"answer_id":"100","answer_english":"Nawada","answer_hindi":"à¤¨à¤µà¤¾à¤¦à¤¾","parent_id":"5"},
{"answer_id":"483","answer_english":"Nayagarh","answer_hindi":"à¤¨à¤¯à¤¾à¤—à¤¡à¤¼","parent_id":"26"},
{"answer_id":"366","answer_english":"Neemuch","answer_hindi":"à¤¨à¥€à¤®à¤š","parent_id":"20"},
{"answer_id":"8","answer_english":"Nellore","answer_hindi":"à¤¨à¥‡à¤²à¥à¤²à¥Œà¤°","parent_id":"1"},
{"answer_id":"146","answer_english":"New Delhi","answer_hindi":"à¤¨à¤ˆ à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"14","answer_english":"Nicobar","answer_hindi":"à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°","parent_id":"2"},
{"answer_id":"568","answer_english":"Nilgiris","answer_hindi":"à¤¨à¥€à¤²à¤—à¤¿à¤°à¤¿","parent_id":"31"},
{"answer_id":"610","answer_english":"Nirmal","answer_hindi":"à¤¨à¤¿à¤°à¥à¤®à¤²","parent_id":"32"},
{"answer_id":"359","answer_english":"Niwari ","answer_hindi":"à¤¨à¤¿à¤µà¤¾à¤¡à¤¼à¥€","parent_id":"20"},
{"answer_id":"611","answer_english":"Nizamabad","answer_hindi":"à¤¨à¤¿à¤œà¤¼à¤¾à¤®à¤¾à¤¬à¤¾à¤¦","parent_id":"32"},
{"answer_id":"458","answer_english":"Noklak","answer_hindi":"à¤¨à¥‹à¤•à¥à¤²à¤•","parent_id":"25"},
{"answer_id":"423","answer_english":"Noney","answer_hindi":"à¤¨à¥‹à¤¨à¥‡","parent_id":"22"},
{"answer_id":"736","answer_english":"North 24 Parganas","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° 24 à¤ªà¤°à¤—à¤¨à¤¾","parent_id":"36"},
{"answer_id":"15","answer_english":"North and Middle Andaman","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤”à¤° à¤®à¤§à¥à¤¯ à¤…à¤£à¥à¤¡à¤®à¤¾à¤¨ à¤œà¤¿à¤²à¤¾","parent_id":"2"},
{"answer_id":"149","answer_english":"North Delhi ","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"150","answer_english":"North East Delhi","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤ªà¥‚à¤°à¥à¤µà¥€ à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"435","answer_english":"North Garo Hills","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤—à¤¾à¤°à¥‹ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"157","answer_english":"North Goa","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤—à¥‹à¤µà¤¾","parent_id":"10"},
{"answer_id":"549","answer_english":"North Sikkim","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤¸à¤¿à¤•à¥à¤•à¤¿à¤®","parent_id":"30"},
{"answer_id":"626","answer_english":"North Tripura","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤¤à¥à¤°à¤¿à¤ªà¥à¤°à¤¾","parent_id":"33"},
{"answer_id":"151","answer_english":"North West Delhi","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤ªà¤¶à¥à¤šà¤¿à¤® à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"482","answer_english":"Nuapada","answer_hindi":"à¤¨à¥à¤†à¤ªà¤¡à¤¼à¤¾","parent_id":"26"},
{"answer_id":"205","answer_english":"Nuh","answer_hindi":"à¤¨à¥‚à¤¹Â ","parent_id":"12"},
{"answer_id":"395","answer_english":"Osmanabad","answer_hindi":"à¤‰à¤¸à¥à¤®à¤¾à¤¨à¤¾à¤¬à¤¾à¤¦","parent_id":"21"},
{"answer_id":"31","answer_english":"Pakke-Kessang","answer_hindi":"à¤ªà¤•à¥à¤•à¥‡ à¤•à¥‡à¤¸à¤¾à¤‚à¤—","parent_id":"3"},
{"answer_id":"267","answer_english":"Pakur","answer_hindi":"à¤ªà¤¾à¤•à¥à¤¡à¤¼","parent_id":"15"},
{"answer_id":"310","answer_english":"Palakkad","answer_hindi":"à¤ªà¤¾à¤²à¤•à¥à¤•à¤¾à¤¡à¤¼Â ","parent_id":"17"},
{"answer_id":"247","answer_english":"Palamu","answer_hindi":"à¤ªà¤²à¤¾à¤®à¥‚","parent_id":"15"},
{"answer_id":"396","answer_english":"Palghar","answer_hindi":"à¤ªà¤¾à¤²à¤˜à¤°","parent_id":"21"},
{"answer_id":"540","answer_english":"Pali","answer_hindi":"à¤ªà¤¾à¤²à¥€","parent_id":"29"},
{"answer_id":"206","answer_english":"Palwal","answer_hindi":"à¤ªà¤²à¤µà¤²","parent_id":"12"},
{"answer_id":"207","answer_english":"Panchkula","answer_hindi":"à¤ªà¤‚à¤šà¤•à¥à¤²à¤¾","parent_id":"12"},
{"answer_id":"182","answer_english":"Panchmahal","answer_hindi":"à¤ªà¤‚à¤šà¤®à¤¹à¤²","parent_id":"11"},
{"answer_id":"208","answer_english":"Panipat","answer_hindi":"à¤ªà¤¾à¤¨à¥€à¤ªà¤¤","parent_id":"12"},
{"answer_id":"356","answer_english":"Panna ","answer_hindi":"à¤ªà¤¨à¥à¤¨à¤¾","parent_id":"20"},
{"answer_id":"32","answer_english":"Papum Pare","answer_hindi":"à¤ªà¤ªà¥à¤®à¤ªà¤¾à¤°à¥‡","parent_id":"3"},
{"answer_id":"397","answer_english":"Parbhani","answer_hindi":"à¤ªà¤°à¤­à¤£à¥€","parent_id":"21"},
{"answer_id":"721","answer_english":"Paschim Bardhaman","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤®à¥€ à¤µà¤°à¥à¤§à¤®à¤¾à¤¨","parent_id":"36"},
{"answer_id":"737","answer_english":"Paschim Medinipur","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤®à¥‡à¤¦à¤¿à¤¨à¥€à¤ªà¥à¤°","parent_id":"36"},
{"answer_id":"183","answer_english":"Patan","answer_hindi":"à¤ªà¤¾à¤Ÿà¤¨","parent_id":"11"},
{"answer_id":"311","answer_english":"Pathanamthitta","answer_hindi":"à¤ªà¤¤à¤¨à¤®à¤¤à¤¿à¤Ÿà¥à¤Ÿà¤¾","parent_id":"17"},
{"answer_id":"508","answer_english":"Pathankot","answer_hindi":"à¤ªà¤ à¤¾à¤¨à¤•à¥‹à¤Ÿ","parent_id":"28"},
{"answer_id":"509","answer_english":"Patiala","answer_hindi":"à¤ªà¤Ÿà¤¿à¤¯à¤¾à¤²à¤¾","parent_id":"28"},
{"answer_id":"101","answer_english":"Patna","answer_hindi":"à¤ªà¤Ÿà¤¨à¤¾","parent_id":"5"},
{"answer_id":"713","answer_english":"Pauri Garhwal","answer_hindi":"à¤ªà¥Œà¤¡à¤¼à¥€ à¤—à¤¢à¤¼à¤µà¤¾à¤²","parent_id":"35"},
{"answer_id":"612","answer_english":"Peddapalli","answer_hindi":"à¤ªà¥‡à¤¦à¥à¤¦à¤ªà¤²à¥à¤²à¥‡","parent_id":"32"},
{"answer_id":"570","answer_english":"Perambalur","answer_hindi":"à¤ªà¥‡à¤°à¤®à¥à¤¬à¤²à¥à¤°","parent_id":"31"},
{"answer_id":"453","answer_english":"Peren","answer_hindi":"à¤ªà¥‡à¤°à¥‡à¤¨","parent_id":"25"},
{"answer_id":"454","answer_english":"Phek","answer_hindi":"à¤«à¥‡à¤•","parent_id":"25"},
{"answer_id":"424","answer_english":"Pherzawl","answer_hindi":"à¤«à¥‡à¤°à¤œà¤¼à¥Œà¤²Â ","parent_id":"22"},
{"answer_id":"690","answer_english":"Pilibhit","answer_hindi":"à¤ªà¥€à¤²à¥€à¤­à¥€à¤¤","parent_id":"34"},
{"answer_id":"714","answer_english":"Pithoragarh","answer_hindi":"à¤ªà¤¿à¤¥à¥Œà¤°à¤¾à¤—à¤¢à¤¼","parent_id":"35"},
{"answer_id":"237","answer_english":"Poonch","answer_hindi":"à¤ªà¥à¤‚à¤›","parent_id":"14"},
{"answer_id":"184","answer_english":"Porbandar","answer_hindi":"à¤ªà¥‹à¤°à¤¬à¤‚à¤¦à¤°","parent_id":"11"},
{"answer_id":"9","answer_english":"Prakasam","answer_hindi":"à¤ªà¥à¤°à¤•à¤¾à¤¶à¤®","parent_id":"1"},
{"answer_id":"541","answer_english":"Pratapgarh","answer_hindi":"à¤ªà¥à¤°à¤¤à¤¾à¤ªà¤—à¤¢à¤¼","parent_id":"29"},
{"answer_id":"691","answer_english":"Pratapgarh","answer_hindi":"à¤ªà¥à¤°à¤¤à¤¾à¤ªà¤—à¤¢","parent_id":"34"},
{"answer_id":"491","answer_english":"Puducherry","answer_hindi":"à¤ªà¥à¤¦à¥à¤šà¥‡à¤°à¥€","parent_id":"27"},
{"answer_id":"571","answer_english":"Pudukkottai","answer_hindi":"à¤ªà¥à¤¦à¥à¤•à¥‹à¤Ÿà¥à¤Ÿà¤ˆ","parent_id":"31"},
{"answer_id":"238","answer_english":"Pulwama","answer_hindi":"à¤ªà¥à¤²à¤µà¤¾à¤®à¤¾","parent_id":"14"},
{"answer_id":"398","answer_english":"Pune","answer_hindi":"à¤ªà¥à¤£à¥‡","parent_id":"21"},
{"answer_id":"722","answer_english":"Purba Bardhaman","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µ à¤¬à¤°à¥à¤§à¤®à¤¾à¤¨Â ","parent_id":"36"},
{"answer_id":"738","answer_english":"Purba Medinipur","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µ à¤®à¥‡à¤¦à¤¿à¤¨à¥€à¤ªà¥à¤°","parent_id":"36"},
{"answer_id":"484","answer_english":"Puri","answer_hindi":"à¤ªà¥à¤°à¥€","parent_id":"26"},
{"answer_id":"102","answer_english":"Purnia","answer_hindi":"à¤ªà¥‚à¤°à¥à¤£à¤¿à¤¯à¤¾","parent_id":"5"},
{"answer_id":"739","answer_english":"Purulia","answer_hindi":"à¤ªà¥à¤°à¥‚à¤²à¤¿à¤¯à¤¾","parent_id":"36"},
{"answer_id":"692","answer_english":"Raebareli","answer_hindi":"à¤°à¤¾à¤¯à¤¬à¤°à¥‡à¤²à¥€","parent_id":"34"},
{"answer_id":"293","answer_english":"Raichur","answer_hindi":"à¤°à¤¾à¤¯à¤šà¥‚à¤°","parent_id":"16"},
{"answer_id":"399","answer_english":"Raigad","answer_hindi":"à¤°à¤¾à¤¯à¤—à¤¡","parent_id":"21"},
{"answer_id":"137","answer_english":"Raigarh","answer_hindi":"à¤°à¤¾à¤¯à¤—à¤¢","parent_id":"7"},
{"answer_id":"138","answer_english":"Raipur","answer_hindi":"à¤°à¤¾à¤¯à¤ªà¥à¤°","parent_id":"7"},
{"answer_id":"319","answer_english":"Raisen","answer_hindi":"à¤°à¤¾à¤¯à¤¸à¥‡à¤¨","parent_id":"20"},
{"answer_id":"613","answer_english":"Rajanna Sircilla","answer_hindi":"à¤°à¤¾à¤œà¤¨à¥à¤¨à¤¾ à¤¸à¤¿à¤°à¤¸à¤¿à¤²à¥à¤²à¤¾","parent_id":"32"},
{"answer_id":"320","answer_english":"Rajgarh ","answer_hindi":"à¤°à¤¾à¤œà¤—à¤¢à¤¼","parent_id":"20"},
{"answer_id":"185","answer_english":"Rajkot","answer_hindi":"à¤°à¤¾à¤œà¤•à¥‹à¤Ÿ","parent_id":"11"},
{"answer_id":"139","answer_english":"Rajnandgaon","answer_hindi":"à¤°à¤¾à¤œà¤¨à¤¾à¤‚à¤¦à¤—à¤¾à¤‚à¤µ","parent_id":"7"},
{"answer_id":"239","answer_english":"Rajouri","answer_hindi":"à¤°à¤¾à¤œà¥Œà¤°à¥€","parent_id":"14"},
{"answer_id":"542","answer_english":"Rajsamand","answer_hindi":"à¤°à¤¾à¤œà¤¸à¤®à¤‚à¤¦","parent_id":"29"},
{"answer_id":"294","answer_english":"Ramanagara","answer_hindi":"à¤°à¤¾à¤®à¤¨à¤—à¤°","parent_id":"16"},
{"answer_id":"572","answer_english":"Ramanathapuram","answer_hindi":"à¤°à¤¾à¤®à¤¨à¤¾à¤¥à¤ªà¥à¤°à¤®","parent_id":"31"},
{"answer_id":"240","answer_english":"Ramban","answer_hindi":"à¤°à¤¾à¤®à¤¬à¤¨","parent_id":"14"},
{"answer_id":"253","answer_english":"Ramgarh","answer_hindi":"à¤°à¤¾à¤®à¤—à¤¢à¤¼","parent_id":"15"},
{"answer_id":"693","answer_english":"Rampur","answer_hindi":"à¤°à¤¾à¤®à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"259","answer_english":"Ranchi","answer_hindi":"à¤°à¤¾à¤à¤šà¥€","parent_id":"15"},
{"answer_id":"614","answer_english":"Ranga Reddy","answer_hindi":"à¤°à¤‚à¤—à¤¾à¤°à¥‡à¤¡à¥à¤¡à¥€","parent_id":"32"},
{"answer_id":"573","answer_english":"Ranipet","answer_hindi":"à¤°à¤¾à¤¨à¥€à¤ªà¥‡à¤Ÿ","parent_id":"31"},
{"answer_id":"367","answer_english":"Ratlam","answer_hindi":"à¤°à¤¤à¤²à¤¾à¤®","parent_id":"20"},
{"answer_id":"400","answer_english":"Ratnagiri","answer_hindi":"à¤°à¤¤à¥à¤¨à¤¾à¤—à¤¿à¤°à¥€","parent_id":"21"},
{"answer_id":"485","answer_english":"Rayagada","answer_hindi":"à¤°à¤¾à¤¯à¤—à¤¡à¤¼à¤¾","parent_id":"26"},
{"answer_id":"241","answer_english":"Reasi","answer_hindi":"à¤°à¤¿à¤¯à¤¾à¤¸à¥€","parent_id":"14"},
{"answer_id":"350","answer_english":"Rewa ","answer_hindi":"à¤°à¥€à¤µà¤¾","parent_id":"20"},
{"answer_id":"209","answer_english":"Rewari","answer_hindi":"à¤°à¥‡à¤µà¤¾à¤¡à¤¼à¥€","parent_id":"12"},
{"answer_id":"430","answer_english":"Ri Bhoi","answer_hindi":"à¤°à¥€ à¤­à¥‹à¤ˆ","parent_id":"23"},
{"answer_id":"210","answer_english":"Rohtak","answer_hindi":"à¤°à¥‹à¤¹à¤¤à¤•","parent_id":"12"},
{"answer_id":"103","answer_english":"Rohtas","answer_hindi":"à¤°à¥‹à¤¹à¤¤à¤¾à¤¸","parent_id":"5"},
{"answer_id":"715","answer_english":"Rudraprayag","answer_hindi":"à¤°à¥à¤¦à¥à¤°à¤ªà¥à¤°à¤¯à¤¾à¤—","parent_id":"35"},
{"answer_id":"510","answer_english":"Rupnagar","answer_hindi":"à¤°à¥‚à¤ªà¤¨à¤—à¤°","parent_id":"28"},
{"answer_id":"186","answer_english":"Sabarkantha","answer_hindi":"à¤¸à¤¾à¤¬à¤°à¤•à¤¾à¤‚à¤ à¤¾","parent_id":"11"},
{"answer_id":"357","answer_english":"Sagar ","answer_hindi":"à¤¸à¤¾à¤—à¤°","parent_id":"20"},
{"answer_id":"694","answer_english":"Saharanpur","answer_hindi":"à¤¸à¤¹à¤¾à¤°à¤¨à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"104","answer_english":"Saharsa","answer_hindi":"à¤¸à¤¹à¤°à¤¸à¤¾","parent_id":"5"},
{"answer_id":"269","answer_english":"Sahebganj","answer_hindi":"à¤¸à¤¾à¤¹à¤¿à¤¬à¤—à¤‚à¤œ","parent_id":"15"},
{"answer_id":"511","answer_english":"Sahibzada Ajit Singh Nagar","answer_hindi":"à¤®à¥‹à¤¹à¤¾à¤²à¥€\/ à¤¸à¤¾à¤¹à¤¿à¤¬à¤œà¤¾à¤¦à¤¾ à¤…à¤œà¥€à¤¤ à¤¸à¤¿à¤‚à¤¹ à¤¨à¤—à¤°","parent_id":"28"},
{"answer_id":"441","answer_english":"Saiha","answer_hindi":"à¤¸à¤‡à¤¹à¤¾","parent_id":"24"},
{"answer_id":"446","answer_english":"Saitual","answer_hindi":"à¤¸à¤‡à¤¤à¥à¤†à¤²","parent_id":"24"},
{"answer_id":"574","answer_english":"Salem","answer_hindi":"à¤¸à¥‡à¤²à¤®","parent_id":"31"},
{"answer_id":"105","answer_english":"Samastipur","answer_hindi":"à¤¸à¤®à¤¸à¥à¤¤à¥€à¤ªà¥à¤°","parent_id":"5"},
{"answer_id":"242","answer_english":"Samba","answer_hindi":"à¤¸à¤¾à¤‚à¤¬à¤¾","parent_id":"14"},
{"answer_id":"486","answer_english":"Sambalpur","answer_hindi":"à¤¸à¤®à¥à¤¬à¤²à¤ªà¥à¤°","parent_id":"26"},
{"answer_id":"695","answer_english":"Sambhal","answer_hindi":"à¤¸à¤®à¥à¤­à¤²","parent_id":"34"},
{"answer_id":"615","answer_english":"Sangareddy","answer_hindi":"à¤¸à¤‚à¤—à¤¾à¤°à¥‡à¤¡à¥à¤¡à¥€","parent_id":"32"},
{"answer_id":"401","answer_english":"Sangli","answer_hindi":"à¤¸à¤¾à¤‚à¤—à¤²à¥€","parent_id":"21"},
{"answer_id":"512","answer_english":"Sangrur","answer_hindi":"à¤¸à¤‚à¤—à¤°à¥‚à¤°","parent_id":"28"},
{"answer_id":"696","answer_english":"Sant Kabir Nagar","answer_hindi":"à¤¸à¤‚à¤¤ à¤•à¤¬à¥€à¤°à¤¨à¤—à¤°","parent_id":"34"},
{"answer_id":"262","answer_english":"Saraikela Kharsawan","answer_hindi":"à¤¸à¤°à¤¾à¤‡à¤•à¥‡à¤²à¤¾ à¤–à¤°à¤¸à¤¾à¤µà¤¾à¤","parent_id":"15"},
{"answer_id":"106","answer_english":"Saran","answer_hindi":"à¤¸à¤¾à¤°à¤¨","parent_id":"5"},
{"answer_id":"402","answer_english":"Satara","answer_hindi":"à¤¸à¤¾à¤¤à¤¾à¤°à¤¾","parent_id":"21"},
{"answer_id":"351","answer_english":"Satna ","answer_hindi":"à¤¸à¤¤à¤¨à¤¾","parent_id":"20"},
{"answer_id":"544","answer_english":"Sawai Madhopur","answer_hindi":"à¤¸à¤µà¤¾à¤ˆ à¤®à¤¾à¤§à¥‹à¤ªà¥à¤°","parent_id":"29"},
{"answer_id":"321","answer_english":"Sehore ","answer_hindi":"à¤¸à¥€à¤¹à¥‹à¤°","parent_id":"20"},
{"answer_id":"413","answer_english":"Senapati","answer_hindi":"à¤¸à¥‡à¤¨à¤¾à¤ªà¤¤à¤¿ à¤œà¤¿à¤²à¤¾","parent_id":"22"},
{"answer_id":"345","answer_english":"Seoni ","answer_hindi":"à¤¸à¤¿à¤µà¤¨à¥€Â ","parent_id":"20"},
{"answer_id":"442","answer_english":"Serchhip","answer_hindi":"à¤¸à¥‡à¤°à¤›à¤¿à¤ª","parent_id":"24"},
{"answer_id":"152","answer_english":"Shahdara","answer_hindi":"à¤¶à¤¾à¤¹à¤¦à¤°à¤¾","parent_id":"9"},
{"answer_id":"361","answer_english":"Shahdol ","answer_hindi":"à¤¶à¤¹à¤¡à¥‹à¤²","parent_id":"20"},
{"answer_id":"513","answer_english":"Shahid Bhagat Singh Nagar","answer_hindi":"à¤¶à¤¹à¥€à¤¦ à¤­à¤—à¤¤à¤¸à¤¿à¤‚à¤¹à¤¨à¤—à¤°","parent_id":"28"},
{"answer_id":"697","answer_english":"Shahjahanpur","answer_hindi":"à¤¶à¤¾à¤¹à¤œà¤¹à¤¾à¤à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"368","answer_english":"Shajapur","answer_hindi":"à¤¶à¤¾à¤œà¤¾à¤ªà¥à¤°","parent_id":"20"},
{"answer_id":"698","answer_english":"Shamli","answer_hindi":"à¤¶à¤¾à¤®à¤²à¥€","parent_id":"34"},
{"answer_id":"107","answer_english":"Sheikhpura","answer_hindi":"à¤¶à¥‡à¤–à¤ªà¥à¤°à¤¾","parent_id":"5"},
{"answer_id":"108","answer_english":"Sheohar","answer_hindi":"à¤¶à¤¿à¤µà¤¹à¤°","parent_id":"5"},
{"answer_id":"324","answer_english":"Sheopur ","answer_hindi":"à¤¶à¥à¤¯à¥‹à¤ªà¥à¤°","parent_id":"20"},
{"answer_id":"33","answer_english":"Shi Yomi","answer_hindi":"à¤¶à¤¿à¤“à¤®à¥€","parent_id":"3"},
{"answer_id":"222","answer_english":"Shimla","answer_hindi":"à¤¶à¤¿à¤®à¤²à¤¾","parent_id":"13"},
{"answer_id":"295","answer_english":"Shimoga","answer_hindi":"à¤¶à¤¿à¤®à¥‹à¤—à¤¾","parent_id":"16"},
{"answer_id":"328","answer_english":"Shivpuri ","answer_hindi":"à¤¶à¤¿à¤µà¤ªà¥à¤°à¥€","parent_id":"20"},
{"answer_id":"243","answer_english":"Shopian","answer_hindi":"à¤¶à¥‹à¤ªà¤¿à¤¯à¤¾à¤‚","parent_id":"14"},
{"answer_id":"699","answer_english":"Shravasti","answer_hindi":"à¤¶à¥à¤°à¤¾à¤µà¤¸à¥à¤¤à¥€","parent_id":"34"},
{"answer_id":"34","answer_english":"Siang","answer_hindi":"à¤¸à¤¿à¤¯à¤¾à¤‚à¤—","parent_id":"3"},
{"answer_id":"700","answer_english":"Siddharthnagar","answer_hindi":"à¤¸à¤¿à¤¦à¥à¤§à¤¾à¤°à¥à¤¥à¤¨à¤—à¤°","parent_id":"34"},
{"answer_id":"616","answer_english":"Siddipet","answer_hindi":"à¤¸à¤¿à¤¦à¥à¤¦à¤¿à¤ªà¥‡à¤Ÿ","parent_id":"32"},
{"answer_id":"352","answer_english":"Sidhi ","answer_hindi":"à¤¸à¥€à¤§à¥€","parent_id":"20"},
{"answer_id":"543","answer_english":"Sikar","answer_hindi":"à¤¸à¥€à¤•à¤°","parent_id":"29"},
{"answer_id":"258","answer_english":"Simdega","answer_hindi":"à¤¸à¤¿à¤®à¤¡à¥‡à¤—à¤¾","parent_id":"15"},
{"answer_id":"403","answer_english":"Sindhudurg","answer_hindi":"à¤¸à¤¿à¤‚à¤§à¥à¤¦à¥à¤°à¥à¤—","parent_id":"21"},
{"answer_id":"353","answer_english":"Singrauli ","answer_hindi":"à¤¸à¤¿à¤‚à¤—à¤°à¥Œà¤²à¥€","parent_id":"20"},
{"answer_id":"627","answer_english":"Sipahijala","answer_hindi":"à¤¸à¤¿à¤ªà¤¾à¤¹à¥€à¤œà¤¾à¤²à¤¾","parent_id":"33"},
{"answer_id":"223","answer_english":"Sirmaur","answer_hindi":"à¤¸à¤¿à¤°à¤®à¥Œà¤°","parent_id":"13"},
{"answer_id":"545","answer_english":"Sirohi","answer_hindi":"à¤¸à¤¿à¤°à¥‹à¤¹à¥€","parent_id":"29"},
{"answer_id":"211","answer_english":"Sirsa","answer_hindi":"à¤¸à¤¿à¤°à¤¸à¤¾","parent_id":"12"},
{"answer_id":"109","answer_english":"Sitamarhi","answer_hindi":"à¤¸à¥€à¤¤à¤¾à¤®à¤¢à¤¼à¥€","parent_id":"5"},
{"answer_id":"701","answer_english":"Sitapur","answer_hindi":"à¤¸à¥€à¤¤à¤¾à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"575","answer_english":"Sivaganga","answer_hindi":"à¤¶à¤¿à¤µà¤—à¤‚à¤—à¤¾","parent_id":"31"},
{"answer_id":"70","answer_english":"Sivasagar","answer_hindi":"à¤¶à¤¿à¤µà¤¸à¤¾à¤—à¤°","parent_id":"4"},
{"answer_id":"110","answer_english":"Siwan","answer_hindi":"à¤¸à¥€à¤µà¤¾à¤¨","parent_id":"5"},
{"answer_id":"224","answer_english":"Solan","answer_hindi":"à¤¸à¥‹à¤²à¤¨","parent_id":"13"},
{"answer_id":"404","answer_english":"Solapur","answer_hindi":"à¤¸à¥‹à¤²à¤¾à¤ªà¥à¤°","parent_id":"21"},
{"answer_id":"702","answer_english":"Sonbhadra","answer_hindi":"à¤¸à¥‹à¤¨à¤­à¤¦à¥à¤°","parent_id":"34"},
{"answer_id":"212","answer_english":"Sonipat","answer_hindi":"à¤¸à¥‹à¤¨à¥€à¤ªà¤¤","parent_id":"12"},
{"answer_id":"71","answer_english":"Sonitpur","answer_hindi":"à¤¶à¥‹à¤£à¤¿à¤¤à¤ªà¥à¤°","parent_id":"4"},
{"answer_id":"740","answer_english":"South 24 Parganas","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ 24 à¤ªà¤°à¤—à¤¨à¤¾","parent_id":"36"},
{"answer_id":"16","answer_english":"South Andaman","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤…à¤£à¥à¤¡à¤®à¤¾à¤¨","parent_id":"2"},
{"answer_id":"153","answer_english":"South Delhi ","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"154","answer_english":"South East Delhi","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤ªà¥‚à¤°à¥à¤µà¥€ à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"431","answer_english":"South Garo Hills","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤—à¤¾à¤°à¥‹ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"158","answer_english":"South Goa","answer_hindi":"Â à¤¦à¤•à¥à¤·à¤¿à¤£ à¤—à¥‹à¤µà¤¾","parent_id":"10"},
{"answer_id":"72","answer_english":"South Salmara-Mankachar","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤¸à¤¾à¤²à¤®à¤¾à¤°à¤¾-à¤®à¤¨à¤•à¤¾à¤šà¤°","parent_id":"4"},
{"answer_id":"550","answer_english":"South Sikkim","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£Â à¤¸à¤¿à¤•à¥à¤•à¤¿à¤®","parent_id":"30"},
{"answer_id":"624","answer_english":"South Tripura","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤¤à¥à¤°à¤¿à¤ªà¥à¤°à¤¾","parent_id":"33"},
{"answer_id":"155","answer_english":"South West Delhi","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤ªà¤¶à¥à¤šà¤¿à¤® à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"432","answer_english":"South West Garo Hills","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤ªà¤¶à¥à¤šà¤¿à¤® à¤—à¤¾à¤°à¥‹ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"433","answer_english":"South West Khasi Hills","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤ªà¤¶à¥à¤šà¤¿à¤® à¤–à¤¾à¤¸à¥€ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"507","answer_english":"Sri Muktsar Sahib","answer_hindi":"à¤®à¥à¤•à¥à¤¤à¤¸à¤°","parent_id":"28"},
{"answer_id":"10","answer_english":"Srikakulam","answer_hindi":"à¤¶à¥à¤°à¥€à¤•à¤¾à¤•à¥à¤²à¤®","parent_id":"1"},
{"answer_id":"244","answer_english":"Srinagar","answer_hindi":"à¤¶à¥à¤°à¥€à¤¨à¤—à¤°","parent_id":"14"},
{"answer_id":"487","answer_english":"Subarnapur(Sonepur)","answer_hindi":"à¤¸à¥à¤¬à¤°à¥à¤£à¤ªà¥à¤° (à¤¸à¥‹à¤¨à¤ªà¥à¤°)","parent_id":"26"},
{"answer_id":"140","answer_english":"Sukma","answer_hindi":"à¤¸à¥à¤•à¤®à¤¾","parent_id":"7"},
{"answer_id":"703","answer_english":"Sultanpur","answer_hindi":"à¤¸à¥à¤²à¥à¤¤à¤¾à¤¨à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"488","answer_english":"Sundargarh","answer_hindi":"à¤¸à¥à¤¨à¥à¤¦à¤°à¤—à¤¡à¤¼","parent_id":"26"},
{"answer_id":"111","answer_english":"Supaul","answer_hindi":"à¤¸à¥à¤ªà¥Œà¤²","parent_id":"5"},
{"answer_id":"141","answer_english":"Surajpur","answer_hindi":"à¤¸à¥‚à¤°à¤œà¤ªà¥à¤°","parent_id":"7"},
{"answer_id":"187","answer_english":"Surat","answer_hindi":"à¤¸à¥‚à¤°à¤¤","parent_id":"11"},
{"answer_id":"188","answer_english":"Surendranagar","answer_hindi":"à¤¸à¥à¤°à¥‡à¤‚à¤¦à¥à¤°à¤¨à¤—à¤°","parent_id":"11"},
{"answer_id":"142","answer_english":"Surguja","answer_hindi":"à¤¸à¤°à¤—à¥à¤œà¤¾","parent_id":"7"},
{"answer_id":"617","answer_english":"Suryapet","answer_hindi":"à¤¸à¥‚à¤°à¥à¤¯à¤¾à¤ªà¥‡à¤Ÿ","parent_id":"32"},
{"answer_id":"417","answer_english":"Tamenglong","answer_hindi":"à¤¤à¤®à¥‡à¤‚à¤—à¤²à¥‰à¤¨à¥à¤— à¤œà¤¿à¤²à¤¾","parent_id":"22"},
{"answer_id":"189","answer_english":"Tapi","answer_hindi":"à¤¤à¤¾à¤ªà¥€","parent_id":"11"},
{"answer_id":"514","answer_english":"Tarn Taran","answer_hindi":"à¤¤à¤°à¤¨ à¤¤à¤¾à¤°à¤¨ à¤¸à¤¾à¤¹à¤¿à¤¬","parent_id":"28"},
{"answer_id":"35","answer_english":"Tawang","answer_hindi":"à¤¤à¤µà¤¾à¤‚à¤—","parent_id":"3"},
{"answer_id":"716","answer_english":"Tehri Garhwal","answer_hindi":"à¤Ÿà¤¿à¤¹à¤°à¥€ à¤—à¤¢à¤¼à¤µà¤¾à¤²","parent_id":"35"},
{"answer_id":"421","answer_english":"Tengnoupal","answer_hindi":"à¤¤à¥‡à¤‚à¤—à¤¨à¥‹à¤‰à¤ªà¤²Â ","parent_id":"22"},
{"answer_id":"576","answer_english":"Tenkasi","answer_hindi":"à¤¤à¥‡à¤¨à¤•à¤¾à¤¶à¥€","parent_id":"31"},
{"answer_id":"405","answer_english":"Thane","answer_hindi":"à¤ à¤¾à¤£à¥‡","parent_id":"21"},
{"answer_id":"581","answer_english":"Thanjavur","answer_hindi":"à¤¤à¤‚à¤œà¤¾à¤µà¥à¤°","parent_id":"31"},
{"answer_id":"579","answer_english":"Theni","answer_hindi":"à¤¤à¥‡à¤¨à¥€","parent_id":"31"},
{"answer_id":"312","answer_english":"Thiruvananthapuram","answer_hindi":"à¤¤à¤¿à¤°à¥à¤µà¤¨à¤¨à¥à¤¤à¤ªà¥à¤°à¤®Â ","parent_id":"17"},
{"answer_id":"582","answer_english":"Thoothukudi","answer_hindi":"à¤¤à¥‚à¤¤à¥à¤•à¥à¤¡à¤¼à¥€","parent_id":"31"},
{"answer_id":"410","answer_english":"Thoubal","answer_hindi":"à¤¥à¥Œà¤¬à¤² à¤œà¤¿à¤²à¤¾","parent_id":"22"},
{"answer_id":"313","answer_english":"Thrissur","answer_hindi":"à¤¤à¥à¤°à¤¿à¤¸à¥à¤¸à¥‚à¤°Â ","parent_id":"17"},
{"answer_id":"358","answer_english":"Tikamgarh ","answer_hindi":"à¤Ÿà¥€à¤•à¤®à¤—à¤¢à¤¼","parent_id":"20"},
{"answer_id":"73","answer_english":"Tinsukia","answer_hindi":"à¤¤à¤¿à¤¨à¤¸à¥à¤•à¤¿à¤¯à¤¾","parent_id":"4"},
{"answer_id":"36","answer_english":"Tirap","answer_hindi":"à¤¤à¤¿à¤°à¤¾à¤ª","parent_id":"3"},
{"answer_id":"578","answer_english":"Tiruchirappalli","answer_hindi":"à¤¤à¤¿à¤°à¥à¤šà¤¿à¤°à¤¾à¤ªà¤²à¥à¤²à¥€","parent_id":"31"},
{"answer_id":"580","answer_english":"Tirunelveli","answer_hindi":"à¤¤à¤¿à¤°à¥‚à¤¨à¥‡à¤²à¤µà¥‡à¤²à¥€","parent_id":"31"},
{"answer_id":"583","answer_english":"Tirupattur","answer_hindi":"à¤¤à¤¿à¤°à¥à¤ªà¤¤à¥à¤¤à¥à¤°","parent_id":"31"},
{"answer_id":"577","answer_english":"Tirupur","answer_hindi":"à¤¤à¤¿à¤°à¥à¤ªà¥à¤°","parent_id":"31"},
{"answer_id":"584","answer_english":"Tiruvallur","answer_hindi":"à¤¤à¤¿à¤°à¥à¤µà¤²à¥à¤²à¥à¤°","parent_id":"31"},
{"answer_id":"586","answer_english":"Tiruvannamalai","answer_hindi":"à¤¤à¤¿à¤°à¥à¤µà¤¨à¥à¤¨à¤¾à¤®à¤²à¤ˆ","parent_id":"31"},
{"answer_id":"585","answer_english":"Tiruvarur","answer_hindi":"à¤¤à¤¿à¤°à¥à¤µà¤¾à¤°à¥à¤°","parent_id":"31"},
{"answer_id":"546","answer_english":"Tonk","answer_hindi":"à¤Ÿà¥‹à¤‚à¤•","parent_id":"29"},
{"answer_id":"455","answer_english":"Tuensang","answer_hindi":"à¤Ÿà¥à¤µà¥‡à¤¨à¤¸à¤¾à¤‚à¤—","parent_id":"25"},
{"answer_id":"296","answer_english":"Tumkur","answer_hindi":"à¤¤à¥à¤®à¤•à¥‚à¤°","parent_id":"16"},
{"answer_id":"547","answer_english":"Udaipur","answer_hindi":"à¤‰à¤¦à¤¯à¤ªà¥à¤°","parent_id":"29"},
{"answer_id":"74","answer_english":"Udalguri","answer_hindi":"à¤‰à¤¦à¤²à¤—à¥à¤¡à¤¼à¥€","parent_id":"4"},
{"answer_id":"717","answer_english":"Udham Singh Nagar","answer_hindi":"à¤‰à¤§à¤®à¤¸à¤¿à¤‚à¤¹ à¤¨à¤—à¤°","parent_id":"35"},
{"answer_id":"245","answer_english":"Udhampur","answer_hindi":"à¤‰à¤§à¤®à¤ªà¥à¤°","parent_id":"14"},
{"answer_id":"297","answer_english":"Udupi","answer_hindi":"à¤‰à¤¡à¥à¤ªà¥€","parent_id":"16"},
{"answer_id":"369","answer_english":"Ujjain","answer_hindi":"à¤‰à¤œà¥à¤œà¥ˆà¤¨","parent_id":"20"},
{"answer_id":"414","answer_english":"Ukhrul","answer_hindi":"à¤‰à¤–à¤°à¥à¤² à¤œà¤¿à¤²à¤¾","parent_id":"22"},
{"answer_id":"362","answer_english":"Umaria ","answer_hindi":"à¤‰à¤®à¤°à¤¿à¤¯à¤¾","parent_id":"20"},
{"answer_id":"225","answer_english":"Una","answer_hindi":"à¤‰à¤¨à¤¾","parent_id":"13"},
{"answer_id":"630","answer_english":"Unakoti","answer_hindi":"à¤‰à¤¨à¤¾à¤•à¥‹à¤Ÿà¥€","parent_id":"33"},
{"answer_id":"704","answer_english":"Unnao","answer_hindi":"à¤‰à¤¨à¥à¤¨à¤¾à¤µ","parent_id":"34"},
{"answer_id":"37","answer_english":"Upper Dibang Valley","answer_hindi":"à¤Šà¤ªà¤°à¥€ à¤¦à¤¿à¤¬à¤¾à¤‚à¤— à¤˜à¤¾à¤Ÿà¥€","parent_id":"3"},
{"answer_id":"38","answer_english":"Upper Siang","answer_hindi":"à¤Šà¤ªà¤°à¥€ à¤¸à¤¿à¤¯à¤¾à¤‚à¤—","parent_id":"3"},
{"answer_id":"39","answer_english":"Upper Subansiri","answer_hindi":"à¤Šà¤ªà¤°à¥€ à¤¸à¥à¤¬à¤¨à¤¸à¤¿à¤°à¥€","parent_id":"3"},
{"answer_id":"741","answer_english":"Uttar Dinajpur","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤¦à¤¿à¤¨à¤¾à¤œà¤ªà¥à¤°","parent_id":"36"},
{"answer_id":"298","answer_english":"Uttara Kannada","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤•à¤¨à¥à¤¨à¤¡à¤¼","parent_id":"16"},
{"answer_id":"718","answer_english":"Uttarkashi","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤°à¤•à¤¾à¤¶à¥€","parent_id":"35"},
{"answer_id":"190","answer_english":"Vadodara","answer_hindi":"à¤µà¥œà¥‹à¤¦à¤°à¤¾","parent_id":"11"},
{"answer_id":"112","answer_english":"Vaishali","answer_hindi":"à¤µà¥ˆà¤¶à¤¾à¤²à¥€","parent_id":"5"},
{"answer_id":"191","answer_english":"Valsad","answer_hindi":"à¤µà¤²à¤¸à¤¾à¤¡","parent_id":"11"},
{"answer_id":"705","answer_english":"Varanasi","answer_hindi":"à¤µà¤¾à¤°à¤¾à¤£à¤¸à¥€","parent_id":"34"},
{"answer_id":"587","answer_english":"Vellore","answer_hindi":"à¤µà¥‡à¤²à¥à¤²à¥‚à¤°","parent_id":"31"},
{"answer_id":"322","answer_english":"Vidisha ","answer_hindi":"à¤µà¤¿à¤¦à¤¿à¤¶à¤¾","parent_id":"20"},
{"answer_id":"299","answer_english":"Vijayanagara","answer_hindi":"à¤µà¤¿à¤œà¤¯à¤¨à¤—à¤°","parent_id":"16"},
{"answer_id":"618","answer_english":"Vikarabad","answer_hindi":"à¤µà¤¿à¤•à¤¼à¤¾à¤°à¤¾à¤¬à¤¾à¤¦","parent_id":"32"},
{"answer_id":"588","answer_english":"Viluppuram","answer_hindi":"à¤µà¤¿à¤²à¥à¤ªà¥à¤ªà¥à¤°à¤®","parent_id":"31"},
{"answer_id":"589","answer_english":"Virudhunagar","answer_hindi":"à¤µà¤¿à¤°à¥à¤§à¥à¤¨à¤—à¤°","parent_id":"31"},
{"answer_id":"11","answer_english":"Visakhapatnam","answer_hindi":"à¤µà¤¿à¤¶à¤¾à¤–à¤¾à¤ªà¤Ÿà¥à¤Ÿà¤¨à¤®","parent_id":"1"},
{"answer_id":"12","answer_english":"Vizianagaram","answer_hindi":"à¤µà¤¿à¤œà¤¯à¤¨à¤—à¤°à¤®","parent_id":"1"},
{"answer_id":"619","answer_english":"Wanaparthy","answer_hindi":"à¤µà¤¾à¤¨à¤ªà¤°à¥à¤¤à¤¿","parent_id":"32"},
{"answer_id":"621","answer_english":"Warangal Rural","answer_hindi":"à¤µà¤°à¤‚à¤—à¤² à¤—à¥à¤°à¤¾à¤®à¥€à¤£","parent_id":"32"},
{"answer_id":"620","answer_english":"Warangal Urban","answer_hindi":"à¤µà¤¾à¤°à¤‚à¤—à¤² à¤…à¤°à¥à¤¬à¤¨","parent_id":"32"},
{"answer_id":"406","answer_english":"Wardha","answer_hindi":"à¤µà¤°à¥à¤§à¤¾","parent_id":"21"},
{"answer_id":"407","answer_english":"Washim","answer_hindi":"à¤µà¤¾à¤¶à¥€à¤®","parent_id":"21"},
{"answer_id":"314","answer_english":"Wayanad","answer_hindi":"à¤µà¤¾à¤¯à¤¨à¤¾à¤¡Â ","parent_id":"17"},
{"answer_id":"113","answer_english":"West Champaran","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤®à¥€ à¤šà¤®à¥à¤ªà¤¾à¤°à¤£ à¤œà¤¿à¤²à¤¾","parent_id":"5"},
{"answer_id":"156","answer_english":"West Delhi","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"426","answer_english":"West Garo Hills","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤—à¤¾à¤°à¥‹ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"13","answer_english":"West Godavari","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤—à¥‹à¤¦à¤¾à¤µà¤°à¥€","parent_id":"1"},
{"answer_id":"427","answer_english":"West Jaintia Hills","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤œà¤¯à¤‚à¤¤à¤¿à¤¯à¤¾ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"40","answer_english":"West Kameng","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤•à¤®à¥‡à¤‚à¤—","parent_id":"3"},
{"answer_id":"75","answer_english":"West Karbi Anglong","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤•à¤¾à¤°à¥à¤¬à¥€ à¤†à¤‚à¤—à¤²à¥‹à¤‚à¤—","parent_id":"4"},
{"answer_id":"428","answer_english":"West Khasi Hills","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤–à¤¾à¤¸à¥€ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"41","answer_english":"West Siang","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤¸à¤¿à¤¯à¤¾à¤‚à¤—","parent_id":"3"},
{"answer_id":"551","answer_english":"West Sikkim","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤®Â à¤¸à¤¿à¤•à¥à¤•à¤¿à¤®","parent_id":"30"},
{"answer_id":"261","answer_english":"West Singhbhum","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤®à¥€ à¤¸à¤¿à¤‚à¤¹à¤­à¥‚à¤® ","parent_id":"15"},
{"answer_id":"629","answer_english":"West Tripura","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤¤à¥à¤°à¤¿à¤ªà¥à¤°à¤¾","parent_id":"33"},
{"answer_id":"456","answer_english":"Wokha","answer_hindi":"à¤µà¥‹à¤–à¤¾","parent_id":"25"},
{"answer_id":"622","answer_english":"Yadadri Bhuvanagiri","answer_hindi":"à¤¯à¤¾à¤¦à¤¾à¤¦à¥à¤°à¥€ à¤­à¥à¤µà¤¨à¤—à¤¿à¤°à¥€","parent_id":"32"},
{"answer_id":"300","answer_english":"Yadgir","answer_hindi":"à¤¯à¤¾à¤¦à¤—à¥€à¤°","parent_id":"16"},
{"answer_id":"213","answer_english":"Yamuna Nagar","answer_hindi":"à¤¯à¤®à¥à¤¨à¤¾à¤¨à¤—à¤°","parent_id":"12"},
{"answer_id":"492","answer_english":"Yanam","answer_hindi":"à¤¯à¤¾à¤¨à¤®","parent_id":"27"},
{"answer_id":"408","answer_english":"Yavatmal","answer_hindi":"à¤¯à¤µà¤¤à¤®à¤¾à¤³","parent_id":"21"},
{"answer_id":"457","answer_english":"Zunheboto","answer_hindi":"à¤œà¤¼à¥à¤¨à¥à¤¹à¥‡à¤¬à¥‹à¤Ÿà¥‹","parent_id":"25"}
                ],
            answer : "",
        },
        {
            name : "pincode",
            question_id : 14,
            question_english : "Please enter your PIN code",
            question_hindi : "à¤œà¥€ à¤•à¥ƒà¤ªà¤¯à¤¾ à¤…à¤ªà¤¨à¤¾ à¤ªà¤¿à¤¨ à¤•à¥‹à¤¡ à¤¦à¤°à¥à¤œ à¤•à¤°à¥‡à¤‚",
            question_type : "number",
            max_length : 6,
            is_skip : false,
            is_answered : false,
            answers : [],
            answer : "",
        },
        {
            name : "qualification",
            question_id : 15,
            question_english : "What is your educational qualification?",
            question_hindi : "à¤†à¤ªà¤•à¥€ à¤¶à¥ˆà¤•à¥à¤·à¤£à¤¿à¤• à¤¯à¥‹à¤—à¥à¤¯à¤¤à¤¾ à¤•à¥à¤¯à¤¾ à¤¹à¥ˆ?",
            question_type : "selection",
            is_answered : false,
            is_skip : false,
            answers : [
                {"answer_id":"1","answer_english":"School","answer_hindi":"à¤¸à¥à¤•à¥‚à¤²"},
                {"answer_id":"2","answer_english":"Graduate","answer_hindi":"à¤—à¥à¤°à¥‡à¤œà¥à¤à¤Ÿ"},
                {"answer_id":"3","answer_english":"Post graduate","answer_hindi":"à¤ªà¥‹à¤¸à¥à¤Ÿ à¤—à¥à¤°à¥‡à¤œà¥à¤à¤Ÿ"},
                {"answer_id":"4","answer_english":"PhD","answer_hindi":"à¤ªà¥€à¤à¤šà¤¡à¥€"},
            ],
            answer : "",
        },
        {
            name : "profession",
            question_id : 16,
            question_english : "What is your occupational / employment status?",
            question_hindi : "à¤†à¤ªà¤•à¥€  à¤µà¥à¤¯à¤µà¤¸à¤¾à¤¯à¤¿à¤• / à¤°à¥‹à¤œà¤—à¤¾à¤° à¤¸à¥à¤¥à¤¿à¤¤à¤¿ à¤•à¥à¤¯à¤¾ à¤¹à¥ˆ?",
            question_type : "selection",
            is_answered : false,
            is_skip : false,
            answers : [
                {"answer_id":"1","answer_english":"Student","answer_hindi":"à¤›à¤¾à¤¤à¥à¤°"},
                {"answer_id":"2","answer_english":"Self Employed/ Business","answer_hindi":"à¤¸à¥à¤µ - à¤°à¥‹à¤œà¤—à¤¾à¤° / à¤µà¥à¤¯à¤¾à¤ªà¤¾à¤°"},
                {"answer_id":"3","answer_english":"Private Service","answer_hindi":"à¤ªà¥à¤°à¤¾à¤‡à¤µà¥‡à¤Ÿ à¤¸à¤°à¥à¤µà¤¿à¤¸"},
                {"answer_id":"4","answer_english":"Govt/ Semi Government","answer_hindi":"à¤¸à¤°à¤•à¤¾à¤°à¥€ / à¤…à¤°à¥à¤§ à¤¸à¤°à¤•à¤¾à¤°à¥€ à¤¸à¥‡à¤µà¤¾"},
                {"answer_id":"5","answer_english":"NGO","answer_hindi":"à¤à¤¨à¤œà¥€à¤“"},
                {"answer_id":"6","answer_english":"Other","answer_hindi":"à¤…à¤¨à¥à¤¯"}
            ],
            answer : "",
        },
        // {
        //     name : "interested_position",
        //     question_id : 17,
        //     question_english : "At what level would you like to work on?",
        //     question_hindi : "à¤†à¤ª à¤•à¤¿à¤¸ à¤¸à¥à¤¤à¤° à¤ªà¤° à¤•à¤¾à¤® à¤•à¤°à¤¨à¤¾ à¤šà¤¾à¤¹à¥‡à¤‚à¤—à¥‡?",
        //     question_type : "selection",
        //     max_length : 15,
        //     is_skip : false,
        //     is_answered : false,
        //     answers : [
        //         {"answer_id":"1","answer_english":"National","answer_hindi":"à¤°à¤¾à¤·à¥à¤Ÿà¥à¤°à¥€à¤¯"},
        //         {"answer_id":"2","answer_english":"State","answer_hindi":"à¤°à¤¾à¤œà¥à¤¯"},
        //         {"answer_id":"3","answer_english":"District","answer_hindi":"à¤œà¤¿à¤²à¤¾"},
        //     ],
        //     answer : "",
        // },
        {
            name : "prefered_working_hours",
            question_id : 18,
            question_english : "How many hours per day are you willing to devote to working with the Congress social media team?",
            question_hindi : "à¤†à¤ª à¤ªà¥à¤°à¤¤à¤¿ à¤¦à¤¿à¤¨ à¤•à¤¿à¤¤à¤¨à¥‡ à¤˜à¤‚à¤Ÿà¥‡ à¤•à¤¾à¤‚à¤—à¥à¤°à¥‡à¤¸ à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾ à¤Ÿà¥€à¤® à¤•à¥‡ à¤¸à¤¾à¤¥ à¤•à¤¾à¤® à¤•à¤°à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤¸à¤®à¤°à¥à¤ªà¤¿à¤¤ à¤•à¤°à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤¤à¥ˆà¤¯à¤¾à¤° à¤¹à¥ˆà¤‚?",
            question_type : "selection",
            is_answered : false,
            is_skip : false,
            answers : [
                {"answer_id":"1","answer_english":"1-2 Hours","answer_hindi":"1-2 à¤˜à¤‚à¤Ÿà¥‡"},
                {"answer_id":"2","answer_english":"2-4 Hours","answer_hindi":"2-4 à¤˜à¤‚à¤Ÿà¥‡"},
                {"answer_id":"3","answer_english":"4-6 Hours","answer_hindi":"4-6 à¤˜à¤‚à¤Ÿà¥‡"},
                {"answer_id":"4","answer_english":"More than 6 Hours","answer_hindi":"6 à¤˜à¤‚à¤Ÿà¥‡ à¤¸à¥‡ à¤œà¥à¤¯à¤¾à¤¦à¤¾"},
            ],
            answer : "",
        },
        {
            name : "prefered_working",
            question_id : 19,
            question_english : " In which of the following areas are you willing to work with the Congress social media team?",
            question_hindi : "à¤†à¤ª à¤¨à¤¿à¤®à¥à¤¨à¤²à¤¿à¤–à¤¿à¤¤ à¤®à¥‡à¤‚ à¤¸à¥‡ à¤•à¤¿à¤¸ à¤•à¥à¤·à¥‡à¤¤à¥à¤° à¤®à¥‡à¤‚ à¤•à¤¾à¤‚à¤—à¥à¤°à¥‡à¤¸ à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾ à¤Ÿà¥€à¤® à¤•à¥‡ à¤¸à¤¾à¤¥ à¤•à¤¾à¤® à¤•à¤°à¤¨à¥‡ à¤•à¥‡ à¤‡à¤šà¥à¤›à¥à¤• à¤¹à¥ˆà¤‚?",
            max_check : 15,
            question_type : "checkbox",
            is_answered : false,
            is_skip : false,
            answers : [
                {"answer_id":"1","answer_english":"Training","answer_hindi":"à¤Ÿà¥à¤°à¥‡à¤¨à¤¿à¤‚à¤—"},
                {"answer_id":"2","answer_english":"Research","answer_hindi":"à¤°à¤¿à¤¸à¤°à¥à¤š"},
                {"answer_id":"3","answer_english":"Content (writing)","answer_hindi":"à¤•à¤‚à¤Ÿà¥‡à¤‚à¤Ÿ à¤²à¥‡à¤–à¤¨"},
                {"answer_id":"4","answer_english":"Content Creation (Video, Audio, Graphics)","answer_hindi":"à¤•à¤‚à¤Ÿà¥‡à¤‚à¤Ÿ à¤•à¥à¤°à¤¿à¤à¤¶à¤¨ (à¤µà¥€à¤¡à¤¿à¤¯à¥‹ / à¤‘à¤¡à¤¿à¤¯à¥‹ / à¤—à¥à¤°à¤¾à¤«à¤¿à¤•à¥à¤¸)"},
                {"answer_id":"5","answer_english":"Outreach / Team Development","answer_hindi":"à¤†à¤‰à¤Ÿà¤°à¥€à¤š / à¤Ÿà¥€à¤® à¤¤à¥ˆà¤¯à¤¾à¤° à¤•à¤°à¤¨à¤¾"},
                {"answer_id":"6","answer_english":"Content Dissemination / Viral","answer_hindi":"à¤•à¤‚à¤Ÿà¥‡à¤‚à¤Ÿ à¤µà¤¿à¤¤à¤°à¤£"},
            ],
            answer : "",
        },
        {
            name : "activity_area",
            question_id : 20,
            question_english : "If there is any other area or activity you want to involve with the social media team (not mentioned in the previous options), please let us know.",
            question_hindi : "à¤¯à¤¦à¤¿ à¤•à¥‹à¤ˆ à¤…à¤¨à¥à¤¯ à¤•à¥à¤·à¥‡à¤¤à¥à¤° à¤¯à¤¾ à¤—à¤¤à¤¿à¤µà¤¿à¤§à¤¿ à¤†à¤ª à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾ à¤Ÿà¥€à¤® (à¤ªà¤¿à¤›à¤²à¥‡ à¤µà¤¿à¤•à¤²à¥à¤ªà¥‹à¤‚ à¤®à¥‡à¤‚ à¤‰à¤²à¥à¤²à¤¿à¤–à¤¿à¤¤ à¤¨à¤¹à¥€à¤‚) à¤•à¥‡ à¤¸à¤¾à¤¥ à¤¶à¤¾à¤®à¤¿à¤² à¤•à¤°à¤¨à¤¾ à¤šà¤¾à¤¹à¤¤à¥‡ à¤¹à¥ˆà¤‚, à¤¤à¥‹ à¤•à¥ƒà¤ªà¤¯à¤¾ à¤¹à¤®à¥‡à¤‚ à¤¬à¤¤à¤¾à¤à¤‚.",
            question_type : "text",
            is_answered : false,
            is_skip : false,
            answers : [
            ],
            answer : "",
        },
        {
            name : "social_media_platforms",
            question_id : 21,
            question_english : "Which of these social media platforms are you more active on?",
            question_hindi : "à¤†à¤ª à¤‡à¤¨à¤®à¥‡à¤‚ à¤¸à¥‡ à¤•à¤¿à¤¸ à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾ à¤ªà¥à¤²à¥‡à¤Ÿà¤«à¥‰à¤°à¥à¤® à¤ªà¤° à¤œà¥à¤¯à¤¾à¤¦à¤¾ à¤¸à¤•à¥à¤°à¤¿à¤¯ à¤¹à¥ˆà¤‚?",
            question_type : "checkbox",
            max_check : 15,
            is_answered : false,
            is_skip : false,
            answers : [
                {"answer_id":"2","answer_english":"Facebook","answer_hindi":"à¤«à¥‡à¤¸à¤¬à¥à¤•"},
                {"answer_id":"1","answer_english":"WhatsApp","answer_hindi":"à¤µà¥à¤¹à¤¾à¤Ÿà¥à¤¸à¤à¤ª"},
                {"answer_id":"3","answer_english":"Twitter","answer_hindi":"à¤Ÿà¥à¤µà¤¿à¤Ÿà¤°"},
                {"answer_id":"5","answer_english":"Instagram","answer_hindi":"à¤‡à¤‚à¤¸à¥à¤Ÿà¤¾à¤—à¥à¤°à¤¾à¤®"},
                {"answer_id":"4","answer_english":"YouTube","answer_hindi":"à¤¯à¥‚à¤Ÿà¥à¤¯à¥‚à¤¬"},
                {"answer_id":"6","answer_english":"linkedIn","answer_hindi":"à¤²à¤¿à¤‚à¤•à¤¡à¤¿à¤¨"},
                {"answer_id":"7","answer_english":"Quora","answer_hindi":"à¤•à¥à¤µà¥‹à¤°à¤¾"},
                {"answer_id":"5","answer_english":"Other","answer_hindi":"à¤…à¤¨à¥à¤¯"},
            ],
            answer : "",
        },
        {
            name : "social_media_platforms_other",
            question_id : 22,
            question_english : "Mention your other social media platform.",
            question_hindi : "à¤†à¤ª à¤…à¤¨à¥à¤¯ à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾ à¤ªà¥à¤²à¥‡à¤Ÿà¤«à¥‰à¤°à¥à¤® à¤•à¤¾ à¤‰à¤²à¥à¤²à¥‡à¤– à¤•à¤°à¥‡à¤‚.",
            question_type : "text",
            is_answered : false,
            is_skip : false,
            answers : [],
            answer : "",
        },
        {
            name : "social_media_platform_links",
            question_id : 23,
            question_english : "Please provide your most active social media handle link. <a href='https://www.incsmw.in/assets/SocialMedia.mp4' target='_blank'>(How to get Links)</a>",
            question_hindi : "à¤•à¥ƒà¤ªà¤¯à¤¾ à¤…à¤ªà¤¨à¥‡ à¤¸à¤¬à¤¸à¥‡ à¤¸à¤•à¥à¤°à¤¿à¤¯ à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾ à¤¹à¥ˆà¤‚à¤¡à¤² à¤•à¤¾ à¤²à¤¿à¤‚à¤• à¤ªà¥à¤°à¤¦à¤¾à¤¨ à¤•à¤°à¥‡à¤‚. <a href='https://www.incsmw.in/assets/SocialMedia.mp4' target='_blank'>(à¤²à¤¿à¤‚à¤• à¤•à¥ˆà¤¸à¥‡ à¤ªà¥à¤°à¤¾à¤ªà¥à¤¤ à¤•à¤°à¥‡à¤‚)</a>",
            question_type : "text",
            is_answered : false,
            is_skip : false,
            answers : [
            ],
            answer : "",
        },
        {
            name : "email",
            question_id : 24,
            question_english : "Write your email address",
            question_hindi : "à¤†à¤ªà¤•à¤¾ à¤ˆà¤®à¥‡à¤² à¤à¤¡à¥à¤°à¥‡à¤¸ à¤²à¤¿à¤–à¥‡à¤‚",
            question_type : "text",
            is_answered : false,
            is_skip : false,
            answers : [
            ],
            answer : "",
        },
        {
            name : "thankyou",
            question_id : 25,
            question_english : "Thank you for your response. We will contact you soon! <br /><br /> Please share the <a href='https://www.congressmembership.com/chatbot/' target='_blank'>link</a> with your friends and give them opportunities to become congress social media warrior. Jai Hind !",
            question_hindi : "à¤†à¤ªà¤•à¥€ à¤ªà¥à¤°à¤¤à¤¿à¤•à¥à¤°à¤¿à¤¯à¤¾ à¤•à¥‡ à¤²à¤¿à¤ à¤†à¤ªà¤•à¤¾ à¤§à¤¨à¥à¤¯à¤µà¤¾à¤¦à¥¤ à¤¹à¤® à¤¶à¥€à¤˜à¥à¤° à¤¹à¥€ à¤†à¤ªà¤¸à¥‡ à¤¸à¤‚à¤ªà¤°à¥à¤• à¤•à¤°à¥‡à¤‚à¤—à¥‡! <br /><br /> à¤•à¥ƒà¤ªà¤¯à¤¾ à¤…à¤ªà¤¨à¥‡ à¤¦à¥‹à¤¸à¥à¤¤à¥‹à¤‚ à¤•à¥‡ à¤¸à¤¾à¤¥ <a href='https://www.congressmembership.com/chatbot/' target='_blank'>à¤²à¤¿à¤‚à¤•</a> à¤¸à¤¾à¤à¤¾ à¤•à¤°à¥‡à¤‚ à¤”à¤° à¤‰à¤¨à¥à¤¹à¥‡à¤‚ à¤•à¤¾à¤‚à¤—à¥à¤°à¥‡à¤¸ à¤•à¥‡ à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾ à¤µà¤¾à¤°à¤¿à¤¯à¤° à¤¬à¤¨à¤¨à¥‡ à¤•à¥‡ à¤…à¤µà¤¸à¤° à¤ªà¥à¤°à¤¦à¤¾à¤¨ à¤•à¤°à¥‡à¤‚à¥¤ à¤œà¤¯ à¤¹à¤¿à¤¨à¥à¤¦ !",
            question_type : "none",
            is_answered : false,
            is_skip : false,
            answers : [
            ],
            answer : "",
        }]
    }); 
    
    $rootScope.isPopupOpen = false;

    $rootScope.toggleSharePopup = function(){
        if($rootScope.isPopupOpen){
            $rootScope.isPopupOpen = false;
        }
        else{
            $rootScope.isPopupOpen = true;
        }
    }

    $rootScope.closeSharePopup = function(){
        $rootScope.isPopupOpen = false; 
    }

    $rootScope.loadDefaultStorageAlert = function(){
        var conf = confirm("Are you sure? This will reset your current data.");
        if(conf){
            $rootScope.loadDefaultStorage();
            window.location.reload();
        }
    }
    
    $rootScope.loadDefaultStorage = function(){

        $rootScope.$storage.language = "English";
        $rootScope.$storage.defaultNumber = 0;
        $rootScope.$storage.registrationObj = {
            name : "",
        }
        $rootScope.$storage.currentAnswerObj = {
            answer : ""
        }
        $rootScope.$storage.currentQuestion = {
             name : "language",
            question_id : 1,
            question_english : "Greetings! Would you like to proceed in English or Hindi?",
            question_hindi : "Greetings! Would you like to proceed in English or Hindi?",
            question_type : "option",
            is_skip : false,
            answers : [
                {
                    answer_id : "1",
                    answer_english : "English",
                    answer_hindi : "English",
                },
                {
                    answer_id : "2",
                    answer_english : "à¤¹à¤¿à¤‚à¤¦à¥€",  
                    answer_hindi : "à¤¹à¤¿à¤‚à¤¦à¥€",  
                }
            ],
            is_answered : false,
            answer : "",
        }
        $rootScope.$storage.chat_messages = [
            {
                name : "language",
                question_id : 1,
                question_english : "Greetings! Would you like to proceed in English or Hindi?",
                question_hindi : "Greetings! Would you like to proceed in English or Hindi?",
                question_type : "option",
                is_skip : false,
                answers : [
                    {
                        answer_id : "1",
                        answer_english : "English",
                        answer_hindi : "English",
                    },
                    {
                        answer_id : "2",
                        answer_english : "à¤¹à¤¿à¤‚à¤¦à¥€",  
                        answer_hindi : "à¤¹à¤¿à¤‚à¤¦à¥€",  
                    }
                ],
                is_answered : false,
                answer : "",
            },
            {
                name : "intro",
                question_id : 2,
                question_english : "Welcome to the Social Media Warrior campaign of the Indian National Congress! <br /><br /> Under this campaign, INC Social Media team will be expanded at every village, city, state and national level in the country! <br /><br /> If you too believe in the ideology of the Congress party and want to contribute to the nation building, then let us be a part of the Congress Social Media Team! <br /><br /> You will be given responsibility at national, state or district level according to your qualifications and compatibility. <br /><br /> Let us join hands and fulfill our obligation to protect our democracy and build a modern India by being part of the world'\s largest democratic movement. <br /><br /> Please provide the following information that will help in giving you the corresponding responsibility! <br /><br /> Thank you ! <br /><br /> <iframe width='100%' height='315' src='https://www.youtube.com/embed/E7gWc7d0tOE' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>",
                question_hindi : "à¤­à¤¾à¤°à¤¤à¥€à¤¯ à¤°à¤¾à¤·à¥à¤Ÿà¥à¤°à¥€à¤¯ à¤•à¤¾à¤‚à¤—à¥à¤°à¥‡à¤¸ à¤•à¥‡ Social Media Warrior à¤…à¤­à¤¿à¤¯à¤¾à¤¨ à¤®à¥‡à¤‚ à¤†à¤ªà¤•à¤¾ à¤¸à¥à¤µà¤¾à¤—à¤¤ à¤¹à¥ˆà¥¤ <br /><br /> à¤‡à¤¸ à¤…à¤­à¤¿à¤¯à¤¾à¤¨ à¤•à¥‡ à¤¤à¤¹à¤¤ à¤¦à¥‡à¤¶ à¤•à¥‡ à¤¹à¤° à¤—à¤¾à¤‚à¤µ, à¤¶à¤¹à¤°, à¤°à¤¾à¤œà¥à¤¯ à¤”à¤° à¤°à¤¾à¤·à¥à¤Ÿà¥à¤°à¥€à¤¯ à¤¸à¥à¤¤à¤° à¤ªà¤° INC Social Media à¤Ÿà¥€à¤® à¤•à¤¾ à¤µà¤¿à¤¸à¥à¤¤à¤¾à¤° à¤•à¤¿à¤¯à¤¾ à¤œà¤¾à¤à¤—à¤¾à¥¤ <br /><br /> à¤…à¤—à¤° à¤†à¤ª à¤­à¥€ à¤•à¤¾à¤‚à¤—à¥à¤°à¥‡à¤¸ à¤•à¥€ à¤µà¤¿à¤šà¤¾à¤°à¤§à¤¾à¤°à¤¾ à¤®à¥‡à¤‚ à¤µà¤¿à¤¶à¥à¤µà¤¾à¤¸ à¤°à¤–à¤¤à¥‡ à¤¹à¥ˆà¤‚ à¤”à¤° à¤°à¤¾à¤·à¥à¤Ÿà¥à¤°à¤¨à¤¿à¤°à¥à¤®à¤¾à¤£ à¤®à¥‡à¤‚ à¤…à¤ªà¤¨à¤¾ à¤¯à¥‹à¤—à¤¦à¤¾à¤¨ à¤¦à¥‡à¤¨à¤¾ à¤šà¤¾à¤¹à¤¤à¥‡ à¤¹à¥ˆà¤‚ à¤¤à¥‹ à¤†à¤‡à¤ à¤•à¤¾à¤‚à¤—à¥à¤°à¥‡à¤¸ à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾ à¤Ÿà¥€à¤® à¤•à¤¾ à¤¹à¤¿à¤¸à¥à¤¸à¤¾ à¤¬à¤¨à¤¿à¤à¥¤ <br /><br /> à¤†à¤ªà¤•à¥€ à¤¯à¥‹à¤—à¥à¤¯à¤¤à¤¾ à¤”à¤° à¤•à¥à¤·à¤®à¤¤à¤¾ à¤•à¥‡ à¤…à¤¨à¥à¤¸à¤¾à¤° à¤†à¤ªà¤•à¥‹ à¤°à¤¾à¤·à¥à¤Ÿà¥à¤°à¥€à¤¯, à¤°à¤¾à¤œà¥à¤¯ à¤¯à¤¾ à¤œà¤¿à¤²à¤¾ à¤¸à¥à¤¤à¤° à¤ªà¤° à¤œà¤¿à¤®à¥à¤®à¥‡à¤¦à¤¾à¤°à¥€ à¤¦à¥€ à¤œà¤¾à¤à¤—à¥€à¥¤ <br /><br /> à¤†à¤‡à¤ à¤¹à¤¾à¤¥ à¤¸à¥‡ à¤¹à¤¾à¤¥ à¤®à¤¿à¤²à¤¾à¤à¤‚ à¤”à¤° à¤µà¤¿à¤¶à¥à¤µ à¤•à¥‡ à¤¸à¤¬à¤¸à¥‡ à¤¬à¤¡à¥‡ à¤²à¥‹à¤•à¤¤à¤¾à¤‚à¤¤à¥à¤°à¤¿à¤• à¤†à¤‚à¤¦à¥‹à¤²à¤¨ à¤•à¤¾ à¤¹à¤¿à¤¸à¥à¤¸à¤¾ à¤¬à¤¨ à¤•à¤° à¤¹à¤®à¤¾à¤°à¥‡ à¤²à¥‹à¤•à¤¤à¤‚à¤¤à¥à¤° à¤•à¥€ à¤°à¤•à¥à¤·à¤¾ à¤”à¤° à¤†à¤§à¥à¤¨à¤¿à¤• à¤­à¤¾à¤°à¤¤ à¤•à¥‡ à¤¨à¤¿à¤°à¥à¤®à¤¾à¤£ à¤•à¤¾ à¤¹à¤®à¤¾à¤°à¤¾ à¤¦à¤¾à¤¯à¤¿à¤¤à¥à¤µ à¤ªà¥‚à¤°à¤¾ à¤•à¤°à¥‡à¤‚à¥¤ <br /><br /> à¤•à¥ƒà¤ªà¤¯à¤¾ à¤¨à¤¿à¤®à¥à¤¨ à¤œà¤¾à¤¨à¤•à¤¾à¤°à¥€ à¤¦à¥‡à¤‚ à¤œà¤¿à¤¸à¤¸à¥‡ à¤†à¤ªà¤•à¥‡ à¤…à¤¨à¥à¤°à¥‚à¤ª à¤œà¤¿à¤®à¥à¤®à¥‡à¤¦à¤¾à¤°à¥€ à¤¦à¥‡à¤¨à¥‡ à¤®à¥‡à¤‚ à¤¸à¤¹à¤¾à¤¯à¤¤à¤¾ à¤®à¤¿à¤²à¥‡à¥¤ <br /><br /> à¤§à¤¨à¥à¤¯à¤µà¤¾à¤¦  <iframe width='100%' height='315' src='https://www.youtube.com/embed/ju1yZKzapnw' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>", 
                question_type : "text",
                is_skip : false,
                answers : [],
                is_answered : false,
                answer : "English",
            },
            {
                name : "name",
                question_id : 5,
                question_english : "Please write your name and surname",
                question_hindi : "à¤•à¥ƒà¤ªà¤¯à¤¾ à¤†à¤ªà¤•à¤¾ à¤¨à¤¾à¤® à¤”à¤° à¤‰à¤ªà¤¨à¤¾à¤® à¤²à¤¿à¤–à¥‡à¤‚",
                question_type : "text",
                is_skip : false,
                answers : [],
                is_answered : false,
                answer : "",
            },
            {
                name : "mobile",
                question_id : 6,
                question_english : "Your phone number?",
                question_hindi : "à¤†à¤ªà¤•à¤¾ à¤«à¥‹à¤¨ à¤¨à¤‚à¤¬à¤°?",
                question_type : "number",
                max_length : 10,
                is_skip : false,
                answers : [],
                is_answered : false,
                answer : "",
            },
            {
                name : "already_registered",
                question_id : 7,
                question_english : "Your mobile number is already registered. Thank You.",
                question_hindi : "à¤†à¤ªà¤•à¤¾ à¤®à¥‹à¤¬à¤¾à¤‡à¤² à¤¨à¤‚à¤¬à¤° à¤ªà¤¹à¤²à¥‡ à¤¸à¥‡ à¤ªà¤‚à¤œà¥€à¤•à¥ƒà¤¤ à¤¹à¥ˆà¥¤ à¤§à¤¨à¥à¤¯à¤µà¤¾à¤¦à¥¤",
                question_type : "none",
                max_length : 10,
                is_skip : false,
                answers : [],
                is_answered : false,
                answer : "",
            },
            {
                name : "otp",
                question_id : 8,
                question_english : "You must have received an OTP. Please type that.",
                question_hindi : "à¤†à¤ªà¤•à¥‹ à¤à¤• OTP à¤ªà¥à¤°à¤¾à¤ªà¥à¤¤ à¤¹à¥à¤† à¤¹à¥‹à¤—à¤¾à¥¤ à¤•à¥ƒà¤ªà¤¯à¤¾ OTP à¤Ÿà¤¾à¤‡à¤ª à¤•à¤°à¥‡à¤‚",
                question_type : "number",
                max_length : 6,
                is_skip : false,
                answers : [],
                is_answered : false,
                answer : "",
            },
            {
                name : "verify_otp",
                question_id : 9,
                question_english : "Invalid verification code, Please try again.",
                question_hindi : "à¤µà¥ˆà¤°à¤¿à¤«à¤¿à¤•à¥‡à¤¶à¤¨ à¤•à¥‹à¤¡ à¤—à¤²à¤¤ à¤¹à¥ˆ.",
                question_type : "none",
                max_length : 6,
                is_skip : false,
                answers : [],
                is_answered : false,
                answer : "",
            },
            {
                name : "is_whatsapp",
                question_id : 10,
                question_english : "Is this also your WhatsApp number?",
                question_hindi : "à¤•à¥à¤¯à¤¾ à¤¯à¤¹ à¤†à¤ªà¤•à¤¾ à¤µà¥à¤¹à¤¾à¤Ÿà¥à¤¸à¤à¤ª à¤¨à¤‚à¤¬à¤° à¤­à¥€ à¤¹à¥ˆ?",
                question_type : "option",
                is_skip : false,
                is_answered : false,
                answers : [
                    {
                        answer_id : "1",
                        answer_english : "Yes",
                        answer_hindi : "à¤¹à¤¾à¤",
                    },
                    {
                        answer_id : "2",
                        answer_english : "No",  
                        answer_hindi : "à¤¨à¤¹à¥€à¤‚",  
                    }
                ],
                answer : "",
            },
            {
                name : "whatsapp_number",
                question_id : 11,
                question_english : "What is your WhatsApp number?",
                question_hindi : "à¤†à¤ªà¤•à¤¾ à¤µà¥à¤¹à¤¾à¤Ÿà¥à¤¸à¤à¤ª à¤¨à¤‚à¤¬à¤° à¤•à¥à¤¯à¤¾ à¤¹à¥ˆ?",
                question_type : "text",
                is_skip : false,
                max_length : 10,
                is_answered : false,
                answers : [],
                answer : "",
            },
            {
                name : "state_id",
                question_id : 12,
                question_english : "Which state or union territory are you from?",
                question_hindi : "à¤†à¤ª à¤•à¤¿à¤¸ à¤°à¤¾à¤œà¥à¤¯ à¤¯à¤¾ à¤•à¥‡à¤‚à¤¦à¥à¤° à¤¶à¤¾à¤¸à¤¿à¤¤ à¤ªà¥à¤°à¤¦à¥‡à¤¶ à¤¸à¥‡ à¤¹à¥ˆà¤‚?",
                question_type : "selection",
                is_answered : false,
                is_skip : false,
                answers : [
                    {"answer_id":"2","answer_english":"Andaman and Nicobar","answer_hindi":"à¤…à¤£à¥à¤¡à¤®à¤¾à¤¨ à¤”à¤° à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
                    {"answer_id":"1","answer_english":"Andhra Pradesh","answer_hindi":"à¤†à¤‚à¤§à¥à¤° à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
                    {"answer_id":"3","answer_english":"Arunachal Pradesh","answer_hindi":"à¤…à¤°à¥à¤£à¤¾à¤šà¤² à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
                    {"answer_id":"4","answer_english":"Assam","answer_hindi":"à¤…à¤¸à¤®"},
                    {"answer_id":"5","answer_english":"Bihar","answer_hindi":"à¤¬à¤¿à¤¹à¤¾à¤°"},
                    {"answer_id":"6","answer_english":"Chandigarh","answer_hindi":"à¤šà¤£à¥à¤¡à¥€à¤—à¤¢à¤¼"},
                    {"answer_id":"7","answer_english":"Chhattisgarh","answer_hindi":"à¤›à¤¤à¥à¤¤à¥€à¤¸à¤—à¤¢à¤¼"},
                    {"answer_id":"8","answer_english":"Dadra and Nagar Haveli and Daman and Diu","answer_hindi":"à¤¦à¤¾à¤¦à¤°à¤¾ à¤¨à¤—à¤° à¤¹à¤µà¥‡à¤²à¥€ à¤”à¤° à¤¦à¤®à¤¨ à¤”à¤° à¤¦à¥€à¤µ"},
                    {"answer_id":"9","answer_english":"Delhi","answer_hindi":"à¤¦à¤¿à¤²à¥à¤²à¥€"},
                    {"answer_id":"10","answer_english":"Goa","answer_hindi":"à¤—à¥‹à¤µà¤¾"},
                    {"answer_id":"11","answer_english":"Gujarat","answer_hindi":"à¤—à¥à¤œà¤°à¤¾à¤¤"},
                    {"answer_id":"12","answer_english":"Haryana","answer_hindi":"à¤¹à¤°à¤¿à¤¯à¤¾à¤£à¤¾"},
                    {"answer_id":"13","answer_english":"Himachal Pradesh","answer_hindi":"à¤¹à¤¿à¤®à¤¾à¤šà¤² à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
                    {"answer_id":"14","answer_english":"Jammu and Kashmir","answer_hindi":"à¤œà¤®à¥à¤®à¥‚ à¤•à¤¶à¥à¤®à¥€à¤°"},
                    {"answer_id":"15","answer_english":"Jharkhand","answer_hindi":"à¤à¤¾à¤°à¤–à¤£à¥à¤¡"},
                    {"answer_id":"16","answer_english":"Karnataka","answer_hindi":"à¤•à¤°à¥à¤¨à¤¾à¤Ÿà¤•"},
                    {"answer_id":"17","answer_english":"Kerala","answer_hindi":"à¤•à¥‡à¤°à¤²"},
                    {"answer_id":"18","answer_english":"Ladakh","answer_hindi":"à¤²à¤¦à¥à¤¦à¤¾à¤–"},
                    {"answer_id":"19","answer_english":"Lakshadweep","answer_hindi":"à¤²à¤•à¥à¤·à¤¦à¥à¤µà¥€à¤ª"},
                    {"answer_id":"20","answer_english":"Madhya Pradesh","answer_hindi":"à¤®à¤§à¥à¤¯à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
                    {"answer_id":"21","answer_english":"Maharastra","answer_hindi":"à¤®à¤¹à¤¾à¤°à¤¾à¤·à¥à¤Ÿà¥à¤°"},
                    {"answer_id":"22","answer_english":"Manipur","answer_hindi":"à¤®à¤£à¤¿à¤ªà¥à¤°"},
                    {"answer_id":"23","answer_english":"Meghalaya","answer_hindi":"à¤®à¥‡à¤˜à¤¾à¤²à¤¯"},
                    {"answer_id":"24","answer_english":"Mizoram","answer_hindi":"à¤®à¤¿à¤œà¤¼à¥‹à¤°à¤®"},
                    {"answer_id":"25","answer_english":"Nagaland","answer_hindi":"à¤¨à¤¾à¤—à¤¾à¤²à¥ˆà¤£à¥à¤¡"},
                    {"answer_id":"26","answer_english":"Odisha","answer_hindi":"à¤“à¤¡à¤¼à¤¿à¤¶à¤¾"},
                    {"answer_id":"27","answer_english":"Puducherry","answer_hindi":"à¤ªà¥à¤¦à¥à¤šà¥‡à¤°à¥€"},
                    {"answer_id":"28","answer_english":"Punjab","answer_hindi":"à¤ªà¤‚à¤œà¤¾à¤¬"},
                    {"answer_id":"29","answer_english":"Rajasthan","answer_hindi":"à¤°à¤¾à¤œà¤¸à¥à¤¥à¤¾à¤¨"},
                    {"answer_id":"30","answer_english":"Sikkim","answer_hindi":"à¤¸à¤¿à¤•à¥à¤•à¤¿à¤®"},
                    {"answer_id":"31","answer_english":"Tamil Nadu","answer_hindi":"à¤¤à¤®à¤¿à¤²à¤¨à¤¾à¤¡à¥"},
                    {"answer_id":"32","answer_english":"Telangana","answer_hindi":"à¤¤à¥‡à¤²à¤‚à¤—à¤¾à¤¨à¤¾"},
                    {"answer_id":"33","answer_english":"Tripura","answer_hindi":"à¤¤à¥à¤°à¤¿à¤ªà¥à¤°à¤¾"},
                    {"answer_id":"34","answer_english":"Uttar Pradesh","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
                    {"answer_id":"35","answer_english":"Uttarakhand","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤°à¤¾à¤–à¤£à¥à¤¡"},
                    {"answer_id":"36","answer_english":"West Bengal","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤¬à¤‚à¤—à¤¾à¤²"}
                ],
                answer : "",
            },
            {
                name : "district_id",
                question_id : 13,
                question_english : "Which district are you from?",
                question_hindi : "à¤†à¤ª à¤•à¤¿à¤¸ à¤œà¤¿à¤²à¥‡ à¤¸à¥‡ à¤¹à¥ˆà¤‚",
                question_type : "selection",
                is_answered : false,
                is_parent_check : true,
                is_skip : false,
                answers :[
                   {"answer_id":"590","answer_english":"Adilabad","answer_hindi":"à¤†à¤¦à¤¿à¤²à¤¾à¤¬à¤¾à¤¦","parent_id":"32"},
{"answer_id":"363","answer_english":"Agar Malwa","answer_hindi":"à¤†à¤—à¤° à¤®à¤¾à¤²à¤µà¤¾","parent_id":"20"},
{"answer_id":"631","answer_english":"Agra","answer_hindi":"à¤†à¤—à¤°à¤¾","parent_id":"34"},
{"answer_id":"159","answer_english":"Ahmedabad","answer_hindi":"à¤…à¤¹à¤®à¤¦à¤¾à¤¬à¤¾à¤¦","parent_id":"11"},
{"answer_id":"373","answer_english":"Ahmednagar","answer_hindi":"à¤…à¤¹à¤®à¤¦à¤¨à¤—à¤°","parent_id":"21"},
{"answer_id":"436","answer_english":"Aizawl","answer_hindi":"à¤…à¤‡à¤œà¤¼à¥‹à¤²","parent_id":"24"},
{"answer_id":"515","answer_english":"Ajmer","answer_hindi":"à¤…à¤œà¤®à¥‡à¤°","parent_id":"29"},
{"answer_id":"374","answer_english":"Akola","answer_hindi":"à¤…à¤•à¥‹à¤²à¤¾","parent_id":"21"},
{"answer_id":"301","answer_english":"Alappuzha","answer_hindi":"à¤†à¤²à¤¾à¤ªà¥à¤ªà¥à¤¡à¤¼à¤¾","parent_id":"17"},
{"answer_id":"632","answer_english":"Aligarh","answer_hindi":"à¤…à¤²à¥€à¤—à¤¢","parent_id":"34"},
{"answer_id":"719","answer_english":"Alipurduar","answer_hindi":"à¤…à¤²à¥€à¤ªà¥à¤°à¤¦à¥à¤°à¤¾à¤°","parent_id":"36"},
{"answer_id":"331","answer_english":"Alirajpur ","answer_hindi":"à¤…à¤²à¥€à¤°à¤¾à¤œà¤ªà¥à¤°","parent_id":"20"},
{"answer_id":"633","answer_english":"Allahabad","answer_hindi":"à¤‡à¤²à¤¾à¤¹à¤¾à¤¬à¤¾à¤¦\/à¤ªà¥à¤°à¤¯à¤¾à¤—à¤°à¤¾à¤œ","parent_id":"34"},
{"answer_id":"706","answer_english":"Almora","answer_hindi":"à¤…à¤²à¥à¤®à¥‹à¤¡à¤¼à¤¾","parent_id":"35"},
{"answer_id":"516","answer_english":"Alwar","answer_hindi":"à¤…à¤²à¤µà¤°","parent_id":"29"},
{"answer_id":"192","answer_english":"Ambala","answer_hindi":"à¤…à¤®à¥à¤¬à¤¾à¤²à¤¾","parent_id":"12"},
{"answer_id":"634","answer_english":"Ambedkar Nagar","answer_hindi":"à¤…à¤®à¥à¤¬à¥‡à¤¡à¤•à¤°à¤¨à¤—à¤°","parent_id":"34"},
{"answer_id":"635","answer_english":"Amethi","answer_hindi":"à¤…à¤®à¥‡à¤ à¥€Â ","parent_id":"34"},
{"answer_id":"375","answer_english":"Amravati","answer_hindi":"à¤…à¤®à¤°à¤¾à¤µà¤¤à¥€","parent_id":"21"},
{"answer_id":"160","answer_english":"Amreli","answer_hindi":"à¤…à¤®à¤°à¥‡à¤²à¥€","parent_id":"11"},
{"answer_id":"493","answer_english":"Amritsar","answer_hindi":"à¤…à¤®à¥ƒà¤¤à¤¸à¤°","parent_id":"28"},
{"answer_id":"636","answer_english":"Amroha","answer_hindi":"à¤…à¤®à¤°à¥‹à¤¹à¤¾Â ","parent_id":"34"},
{"answer_id":"161","answer_english":"Anand","answer_hindi":"à¤†à¤£à¤‚à¤¦","parent_id":"11"},
{"answer_id":"1","answer_english":"Anantapur","answer_hindi":"à¤…à¤¨à¤‚à¤¤à¤ªà¥à¤°","parent_id":"1"},
{"answer_id":"226","answer_english":"Anantnag","answer_hindi":"à¤…à¤¨à¤¨à¥à¤¤à¤¨à¤¾à¤—","parent_id":"14"},
{"answer_id":"459","answer_english":"Angul","answer_hindi":"à¤…à¤¨à¥à¤—à¥à¤²","parent_id":"26"},
{"answer_id":"17","answer_english":"Anjaw","answer_hindi":"à¤…à¤‚à¤œà¥‰","parent_id":"3"},
{"answer_id":"360","answer_english":"Anuppur ","answer_hindi":"à¤…à¤¨à¥‚à¤ªà¤ªà¥à¤°","parent_id":"20"},
{"answer_id":"76","answer_english":"Araria","answer_hindi":"à¤…à¤°à¤°à¤¿à¤¯à¤¾","parent_id":"5"},
{"answer_id":"162","answer_english":"Aravalli","answer_hindi":"à¤…à¤°à¤¾à¤µà¤²à¥€","parent_id":"11"},
{"answer_id":"552","answer_english":"Ariyalur","answer_hindi":"à¤…à¤°à¤¿à¤¯à¤¾à¤²à¥‚à¤°","parent_id":"31"},
{"answer_id":"77","answer_english":"Arwal","answer_hindi":"à¤…à¤°à¤µà¤²","parent_id":"5"},
{"answer_id":"327","answer_english":"Ashoknagar","answer_hindi":"à¤…à¤¶à¥‹à¤• à¤¨à¤—à¤°","parent_id":"20"},
{"answer_id":"637","answer_english":"Auraiya","answer_hindi":"à¤”à¤°à¥ˆà¤¯à¤¾","parent_id":"34"},
{"answer_id":"78","answer_english":"Aurangabad","answer_hindi":"à¤”à¤°à¤‚à¤—à¤¾à¤¬à¤¾à¤¦","parent_id":"5"},
{"answer_id":"376","answer_english":"Aurangabad","answer_hindi":"à¤”à¤°à¤‚à¤—à¤¾à¤¬à¤¾à¤¦","parent_id":"21"},
{"answer_id":"638","answer_english":"Azamgarh","answer_hindi":"à¤†à¤œà¤®à¤—à¤¢","parent_id":"34"},
{"answer_id":"270","answer_english":"Bagalkot","answer_hindi":"à¤¬à¤¾à¤—à¤²à¤•à¥‹à¤Ÿ","parent_id":"16"},
{"answer_id":"707","answer_english":"Bageshwar","answer_hindi":"à¤¬à¤¾à¤—à¥‡à¤¶à¥à¤µà¤°","parent_id":"35"},
{"answer_id":"639","answer_english":"Bagpat","answer_hindi":"à¤¬à¤¾à¤—à¤ªà¤¤Â ","parent_id":"34"},
{"answer_id":"640","answer_english":"Bahraich","answer_hindi":"à¤¬à¤¹à¤°à¤¾à¤‡à¤š","parent_id":"34"},
{"answer_id":"43","answer_english":"Bajali","answer_hindi":"à¤¬à¤œà¤¾à¤²à¥€","parent_id":"4"},
{"answer_id":"42","answer_english":"Baksa","answer_hindi":"à¤¬à¤•à¥à¤¸à¤¾","parent_id":"4"},
{"answer_id":"339","answer_english":"Balaghat ","answer_hindi":"à¤¬à¤¾à¤²à¤¾à¤˜à¤¾à¤Ÿ","parent_id":"20"},
{"answer_id":"461","answer_english":"Balangir","answer_hindi":"à¤¬à¤²à¤¾à¤‚à¤—à¤¿à¤°","parent_id":"26"},
{"answer_id":"641","answer_english":"Balarampur","answer_hindi":"à¤¬à¤²à¤°à¤¾à¤®à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"463","answer_english":"Balasore","answer_hindi":"à¤¬à¤¾à¤²à¥‡à¤¶à¥à¤µà¤°","parent_id":"26"},
{"answer_id":"642","answer_english":"Ballia","answer_hindi":"à¤¬à¤²à¤¿à¤¯à¤¾","parent_id":"34"},
{"answer_id":"115","answer_english":"Balod","answer_hindi":"à¤¬à¤¾à¤²à¥‹à¤¦","parent_id":"7"},
{"answer_id":"116","answer_english":"Baloda Bazar","answer_hindi":"à¤¬à¤²à¥Œà¤¦à¤¾ à¤¬à¤¾à¤œà¤¾à¤°","parent_id":"7"},
{"answer_id":"117","answer_english":"Balrampur","answer_hindi":"à¤¬à¤²à¤°à¤¾à¤®à¤ªà¥à¤°","parent_id":"7"},
{"answer_id":"163","answer_english":"Banaskantha","answer_hindi":"à¤¬à¤¨à¤¾à¤¸à¤•à¤¾à¤‚à¤ à¤¾","parent_id":"11"},
{"answer_id":"643","answer_english":"Banda","answer_hindi":"à¤¬à¤¾à¤à¤¦à¤¾","parent_id":"34"},
{"answer_id":"228","answer_english":"Bandipora","answer_hindi":"à¤¬à¤¾à¤‚à¤¦à¥€à¤ªà¥à¤°à¤¾","parent_id":"14"},
{"answer_id":"272","answer_english":"Bangalore Rural","answer_hindi":"à¤¬à¤‚à¤—à¤²à¥‹à¤° à¤—à¥à¤°à¤¾à¤®à¥€à¤£","parent_id":"16"},
{"answer_id":"271","answer_english":"Bangalore Urban","answer_hindi":"à¤¬à¤‚à¤—à¤²à¥‹à¤° à¤¶à¤¹à¤°à¥€","parent_id":"16"},
{"answer_id":"79","answer_english":"Banka","answer_hindi":"à¤¬à¤¾à¤à¤•à¤¾","parent_id":"5"},
{"answer_id":"720","answer_english":"Bankura","answer_hindi":"à¤¬à¤¾à¤à¤•à¥à¤¡à¤¼à¤¾","parent_id":"36"},
{"answer_id":"519","answer_english":"Banswara","answer_hindi":"à¤¬à¤¾à¤‚à¤¸à¤µà¤¾à¤¡à¤¼à¤¾","parent_id":"29"},
{"answer_id":"644","answer_english":"Barabanki","answer_hindi":"à¤¬à¤¾à¤°à¤¾à¤¬à¤‚à¤•à¥€","parent_id":"34"},
{"answer_id":"229","answer_english":"Baramulla","answer_hindi":"à¤¬à¤¾à¤°à¤¾à¤®à¥‚à¤²à¤¾","parent_id":"14"},
{"answer_id":"521","answer_english":"Baran","answer_hindi":"à¤¬à¤¾à¤°à¤¾à¤‚","parent_id":"29"},
{"answer_id":"645","answer_english":"Bareilly","answer_hindi":"à¤¬à¤°à¥‡à¤²à¥€","parent_id":"34"},
{"answer_id":"462","answer_english":"Bargarh","answer_hindi":"à¤¬à¤°à¤—à¤¢à¤¼","parent_id":"26"},
{"answer_id":"518","answer_english":"Barmer","answer_hindi":"à¤¬à¤¾à¤¡à¤¼à¤®à¥‡à¤°","parent_id":"29"},
{"answer_id":"494","answer_english":"Barnala","answer_hindi":"à¤¬à¤°à¤¨à¤¾à¤²à¤¾","parent_id":"28"},
{"answer_id":"44","answer_english":"Barpeta","answer_hindi":"à¤¬à¤¾à¤°à¤ªà¥‡à¤Ÿà¤¾","parent_id":"4"},
{"answer_id":"332","answer_english":"Barwani ","answer_hindi":"à¤¬à¤¡à¤¼à¤µà¤¾à¤¨à¥€","parent_id":"20"},
{"answer_id":"118","answer_english":"Bastar","answer_hindi":"à¤¬à¤¸à¥à¤¤à¤°","parent_id":"7"},
{"answer_id":"646","answer_english":"Basti","answer_hindi":"à¤¬à¤¸à¥à¤¤à¥€","parent_id":"34"},
{"answer_id":"495","answer_english":"Bathinda","answer_hindi":"à¤­à¤Ÿà¤¿à¤£à¥à¤¡à¤¾","parent_id":"28"},
{"answer_id":"377","answer_english":"Beed","answer_hindi":"à¤¬à¥€à¤¡","parent_id":"21"},
{"answer_id":"80","answer_english":"Begusarai","answer_hindi":"à¤¬à¥‡à¤—à¥‚à¤¸à¤°à¤¾à¤¯","parent_id":"5"},
{"answer_id":"273","answer_english":"Belgaum","answer_hindi":"à¤¬à¥‡à¤²à¤—à¤¾à¤®","parent_id":"16"},
{"answer_id":"274","answer_english":"Bellary","answer_hindi":"à¤¬à¥‡à¤²à¥à¤²à¤¾à¤°à¥€","parent_id":"16"},
{"answer_id":"119","answer_english":"Bemetara","answer_hindi":"à¤¬à¥‡à¤®à¥‡à¤¤à¤°à¤¾","parent_id":"7"},
{"answer_id":"347","answer_english":"Betul ","answer_hindi":"à¤¬à¥ˆà¤¤à¥‚à¤²","parent_id":"20"},
{"answer_id":"647","answer_english":"Bhadohi","answer_hindi":"à¤­à¤¦à¥‹à¤¹à¥€Â ","parent_id":"34"},
{"answer_id":"592","answer_english":"Bhadradri Kothagudem","answer_hindi":"à¤­à¤¦à¥à¤°à¤¾à¤¦à¥à¤°à¥€ à¤•à¥‹à¤ à¤¾à¤—à¥à¤¡à¤®","parent_id":"32"},
{"answer_id":"464","answer_english":"Bhadrak","answer_hindi":"à¤­à¤¦à¥à¤°à¤•","parent_id":"26"},
{"answer_id":"81","answer_english":"Bhagalpur","answer_hindi":"à¤­à¤¾à¤—à¤²à¤ªà¥à¤°","parent_id":"5"},
{"answer_id":"378","answer_english":"Bhandara","answer_hindi":"à¤­à¤‚à¤¡à¤¾à¤°à¤¾","parent_id":"21"},
{"answer_id":"520","answer_english":"Bharatpur","answer_hindi":"à¤­à¤°à¤¤à¤ªà¥à¤°","parent_id":"29"},
{"answer_id":"164","answer_english":"Bharuch","answer_hindi":"à¤­à¤°à¥à¤š","parent_id":"11"},
{"answer_id":"165","answer_english":"Bhavnagar","answer_hindi":"à¤­à¤¾à¤µà¤¨à¤—à¤°","parent_id":"11"},
{"answer_id":"523","answer_english":"Bhilwara","answer_hindi":"à¤­à¥€à¤²à¤µà¤¾à¤¡à¤¼à¤¾","parent_id":"29"},
{"answer_id":"325","answer_english":"Bhind ","answer_hindi":"à¤­à¤¿à¤‚à¤¡","parent_id":"20"},
{"answer_id":"193","answer_english":"Bhiwani","answer_hindi":"à¤­à¤¿à¤µà¤¾à¤¨à¥€","parent_id":"12"},
{"answer_id":"82","answer_english":"Bhojpur","answer_hindi":"à¤­à¥‹à¤œà¤ªà¥à¤°","parent_id":"5"},
{"answer_id":"318","answer_english":"Bhopal ","answer_hindi":"à¤­à¥‹à¤ªà¤¾à¤²","parent_id":"20"},
{"answer_id":"275","answer_english":"Bidar","answer_hindi":"à¤¬à¥€à¤¦à¤°","parent_id":"16"},
{"answer_id":"276","answer_english":"Bijapur","answer_hindi":"à¤¬à¥€à¤œà¤¾à¤ªà¥à¤°","parent_id":"16"},
{"answer_id":"120","answer_english":"Bijapur","answer_hindi":"à¤¬à¥€à¤œà¤¾à¤ªà¥à¤°","parent_id":"7"},
{"answer_id":"648","answer_english":"Bijnor","answer_hindi":"à¤¬à¤¿à¤œà¤¨à¥Œà¤°","parent_id":"34"},
{"answer_id":"517","answer_english":"Bikaner","answer_hindi":"à¤¬à¥€à¤•à¤¾à¤¨à¥‡à¤°","parent_id":"29"},
{"answer_id":"121","answer_english":"Bilaspur","answer_hindi":"à¤¬à¤¿à¤²à¤¾à¤¸à¤ªà¥à¤°","parent_id":"7"},
{"answer_id":"214","answer_english":"Bilaspur","answer_hindi":"à¤¬à¤¿à¤²à¤¾à¤¸à¤ªà¥à¤°","parent_id":"13"},
{"answer_id":"723","answer_english":"Birbhum","answer_hindi":"à¤¬à¥€à¤°à¤­à¥‚à¤®","parent_id":"36"},
{"answer_id":"409","answer_english":"Bishnupur","answer_hindi":"à¤¬à¤¿à¤·à¥à¤£à¥à¤ªà¥à¤° à¤œà¤¿à¤²à¤¾","parent_id":"22"},
{"answer_id":"45","answer_english":"Biswanath","answer_hindi":"à¤¬à¤¿à¤¶à¥à¤µà¤¨à¤¾à¤¥","parent_id":"4"},
{"answer_id":"254","answer_english":"Bokaro","answer_hindi":"à¤¬à¥‹à¤•à¤¾à¤°à¥‹","parent_id":"15"},
{"answer_id":"46","answer_english":"Bongaigaon","answer_hindi":"à¤¬à¤‚à¤—à¤¾à¤ˆà¤—à¤¾à¤à¤µ","parent_id":"4"},
{"answer_id":"166","answer_english":"Botad","answer_hindi":"à¤¬à¥‹à¤Ÿà¤¾à¤¡","parent_id":"11"},
{"answer_id":"460","answer_english":"Boudh","answer_hindi":"à¤¬à¥Œà¤§","parent_id":"26"},
{"answer_id":"649","answer_english":"Budaun","answer_hindi":"à¤¬à¤¦à¤¾à¤¯à¥‚à¤‚Â ","parent_id":"34"},
{"answer_id":"227","answer_english":"Budgam","answer_hindi":"à¤¬à¤¡à¤¼à¤—à¤¾à¤‚à¤µ","parent_id":"14"},
{"answer_id":"650","answer_english":"Bulandshahr","answer_hindi":"à¤¬à¥à¤²à¤‚à¤¦à¤¶à¤¹à¤°","parent_id":"34"},
{"answer_id":"379","answer_english":"Buldhana","answer_hindi":"à¤¬à¥à¤²à¤¢à¤¾à¤£à¤¾","parent_id":"21"},
{"answer_id":"522","answer_english":"Bundi","answer_hindi":"à¤¬à¥‚à¤‚à¤¦à¥€","parent_id":"29"},
{"answer_id":"333","answer_english":"Burhanpur ","answer_hindi":"à¤¬à¥à¤°à¤¹à¤¾à¤¨à¤ªà¥à¤°","parent_id":"20"},
{"answer_id":"83","answer_english":"Buxar","answer_hindi":"à¤¬à¤•à¥à¤¸à¤°","parent_id":"5"},
{"answer_id":"47","answer_english":"Cachar","answer_hindi":"à¤•à¤›à¤°","parent_id":"4"},
{"answer_id":"147","answer_english":"Central Delhi ","answer_hindi":"à¤®à¤§à¥à¤¯ à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"370","answer_english":"Chachaura-Binaganj","answer_hindi":"à¤šà¤¾à¤šà¥Œà¤¡à¤¼à¤¾","parent_id":"20"},
{"answer_id":"277","answer_english":"Chamarajanagar","answer_hindi":"à¤šà¤¾à¤®à¤°à¤¾à¤œà¤¨à¤—à¤°","parent_id":"16"},
{"answer_id":"215","answer_english":"Chamba","answer_hindi":"à¤šà¤‚à¤¬à¤¾","parent_id":"13"},
{"answer_id":"708","answer_english":"Chamoli","answer_hindi":"à¤šà¤®à¥‹à¤²à¥€","parent_id":"35"},
{"answer_id":"709","answer_english":"Champawat","answer_hindi":"à¤šà¤®à¥à¤ªà¤¾à¤µà¤¤","parent_id":"35"},
{"answer_id":"443","answer_english":"Champhai","answer_hindi":"à¤šà¤®à¥à¤«à¤¾à¤ˆ","parent_id":"24"},
{"answer_id":"651","answer_english":"Chandauli","answer_hindi":"à¤šà¤‚à¤¦à¥Œà¤²à¥€","parent_id":"34"},
{"answer_id":"415","answer_english":"Chandel","answer_hindi":"à¤šà¤¨à¥à¤¡à¥‡à¤² à¤œà¤¿à¤²à¤¾","parent_id":"22"},
{"answer_id":"114","answer_english":"ChandigarhÂ ","answer_hindi":"à¤šà¤£à¥à¤¡à¥€à¤—à¤¢à¤¼","parent_id":"6"},
{"answer_id":"380","answer_english":"Chandrapur","answer_hindi":"à¤šà¤‚à¤¦à¥à¤°à¤ªà¥à¤°","parent_id":"21"},
{"answer_id":"18","answer_english":"Changlang","answer_hindi":"à¤šà¤¾à¤‚à¤—à¤²à¤¾à¤‚à¤—","parent_id":"3"},
{"answer_id":"48","answer_english":"Charaideo","answer_hindi":"à¤šà¤°à¤¾à¤‡à¤¦à¥‡à¤‰","parent_id":"4"},
{"answer_id":"194","answer_english":"Charkhi Dadri","answer_hindi":"à¤šà¤°à¤–à¥€ à¤¦à¤¾à¤¦à¤°à¥€","parent_id":"12"},
{"answer_id":"249","answer_english":"Chatra","answer_hindi":"à¤šà¤¤à¤°à¤¾","parent_id":"15"},
{"answer_id":"553","answer_english":"Chengalpattu","answer_hindi":"à¤šà¥‡à¤‚à¤—à¤²à¤ªà¤Ÿà¥à¤Ÿà¥","parent_id":"31"},
{"answer_id":"554","answer_english":"Chennai","answer_hindi":"à¤šà¥‡à¤¨à¥à¤¨à¤ˆ","parent_id":"31"},
{"answer_id":"354","answer_english":"Chhatarpur ","answer_hindi":"à¤›à¤¤à¤°à¤ªà¥à¤°","parent_id":"20"},
{"answer_id":"340","answer_english":"Chhindwara ","answer_hindi":"à¤›à¤¿à¤‚à¤¦à¤µà¤¾à¤¡à¤¼à¤¾","parent_id":"20"},
{"answer_id":"167","answer_english":"Chhota Udaipur","answer_hindi":"à¤›à¥‹à¤Ÿà¤¾ à¤‰à¤¦à¤¯à¤ªà¥à¤°","parent_id":"11"},
{"answer_id":"278","answer_english":"Chikballapur","answer_hindi":"à¤šà¤¿à¤•à¤¬à¤²à¤¾à¤ªà¥à¤°à¤¾","parent_id":"16"},
{"answer_id":"279","answer_english":"Chikmagalur","answer_hindi":"à¤šà¤¿à¤•à¤®à¤—à¤²à¥‚à¤°","parent_id":"16"},
{"answer_id":"49","answer_english":"Chirang","answer_hindi":"à¤šà¤¿à¤°à¤¾à¤‚à¤—","parent_id":"4"},
{"answer_id":"280","answer_english":"Chitradurga","answer_hindi":"à¤šà¤¿à¤¤à¥à¤°à¤¦à¥à¤°à¥à¤—","parent_id":"16"},
{"answer_id":"652","answer_english":"Chitrakoot","answer_hindi":"à¤šà¤¿à¤¤à¥à¤°à¤•à¥‚à¤Ÿ","parent_id":"34"},
{"answer_id":"2","answer_english":"Chittoor","answer_hindi":"à¤šà¤¿à¤¤à¥à¤¤à¥‚à¤°","parent_id":"1"},
{"answer_id":"525","answer_english":"Chittorgarh","answer_hindi":"à¤šà¤¿à¤¤à¥à¤¤à¥Œà¤¡à¤¼à¤—à¤¢à¤¼","parent_id":"29"},
{"answer_id":"416","answer_english":"Churachandpur","answer_hindi":"à¤šà¥à¤°à¤¾à¤šà¤¾à¤‚à¤¦à¤ªà¥à¤° à¤œà¤¿à¤²à¤¾","parent_id":"22"},
{"answer_id":"524","answer_english":"Churu","answer_hindi":"à¤šà¥à¤°à¥","parent_id":"29"},
{"answer_id":"555","answer_english":"Coimbatore","answer_hindi":"à¤•à¥‹à¤¯à¤®à¥à¤¬à¤¤à¥‚à¤°","parent_id":"31"},
{"answer_id":"724","answer_english":"Cooch Behar","answer_hindi":"à¤•à¥‚à¤šà¤¬à¤¿à¤¹à¤¾à¤°","parent_id":"36"},
{"answer_id":"556","answer_english":"Cuddalore","answer_hindi":"à¤•à¥à¤¡à¥à¤¡à¤²à¥‹à¤°","parent_id":"31"},
{"answer_id":"465","answer_english":"Cuttack","answer_hindi":"à¤•à¤Ÿà¤•","parent_id":"26"},
{"answer_id":"145","answer_english":"Dadra and Nagar Haveli","answer_hindi":"à¤¦à¤¾à¤¦à¤°à¤¾ à¤¨à¤—à¤° à¤¹à¤µà¥‡à¤²à¥€","parent_id":"8"},
{"answer_id":"168","answer_english":"Dahod","answer_hindi":"à¤¦à¤¾à¤¹à¥‹à¤¦","parent_id":"11"},
{"answer_id":"725","answer_english":"Dakshin Dinajpur","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤¦à¤¿à¤¨à¤¾à¤œà¤ªà¥à¤°","parent_id":"36"},
{"answer_id":"281","answer_english":"Dakshina Kannada","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤•à¤¨à¥à¤¨à¤¡à¤¼","parent_id":"16"},
{"answer_id":"143","answer_english":"Daman","answer_hindi":"à¤¦à¤®à¤¨Â ","parent_id":"8"},
{"answer_id":"355","answer_english":"Damoh ","answer_hindi":"à¤¦à¤®à¥‹à¤¹","parent_id":"20"},
{"answer_id":"169","answer_english":"Dang","answer_hindi":"à¤¡à¤¾à¤‚à¤—","parent_id":"11"},
{"answer_id":"122","answer_english":"Dantewada","answer_hindi":"à¤¦à¤¨à¥à¤¤à¥‡à¤µà¤¾à¤¡à¤¼à¤¾ Â (à¤¦à¤•à¥à¤·à¤¿à¤£ à¤¬à¤¸à¥à¤¤à¤°)","parent_id":"7"},
{"answer_id":"84","answer_english":"Darbhanga","answer_hindi":"à¤¦à¤°à¤­à¤‚à¤—à¤¾","parent_id":"5"},
{"answer_id":"726","answer_english":"Darjeeling","answer_hindi":"à¤¦à¤¾à¤°à¥à¤œà¤¿à¤²à¤¿à¤‚à¤—","parent_id":"36"},
{"answer_id":"50","answer_english":"Darrang","answer_hindi":"à¤¦à¤¾à¤°à¤¾à¤‚à¤—","parent_id":"4"},
{"answer_id":"329","answer_english":"Datia ","answer_hindi":"à¤¦à¤¤à¤¿à¤¯à¤¾","parent_id":"20"},
{"answer_id":"526","answer_english":"Dausa","answer_hindi":"à¤¦à¥Œà¤¸à¤¾","parent_id":"29"},
{"answer_id":"282","answer_english":"Davanagere","answer_hindi":"à¤¦à¤¾à¤µà¤£à¤—à¥‡à¤°à¥‡","parent_id":"16"},
{"answer_id":"466","answer_english":"Debagarh","answer_hindi":"à¤¦à¥‡à¤µà¤—à¤¡à¤¼","parent_id":"26"},
{"answer_id":"710","answer_english":"Dehradun","answer_hindi":"à¤¦à¥‡à¤¹à¤°à¤¾à¤¦à¥‚à¤¨","parent_id":"35"},
{"answer_id":"265","answer_english":"Deoghar","answer_hindi":"à¤¦à¥‡à¤µà¤˜à¤°","parent_id":"15"},
{"answer_id":"653","answer_english":"Deoria","answer_hindi":"à¤¦à¥‡à¤µà¤°à¤¿à¤¯à¤¾","parent_id":"34"},
{"answer_id":"170","answer_english":"Devbhoomi Dwarka","answer_hindi":"à¤¦à¥‡à¤µà¤­à¥‚à¤®à¤¿ à¤¦à¥à¤µà¤¾à¤°à¤•à¤¾","parent_id":"11"},
{"answer_id":"364","answer_english":"Dewas","answer_hindi":"à¤¦à¥‡à¤µà¤¾à¤¸","parent_id":"20"},
{"answer_id":"623","answer_english":"Dhalai","answer_hindi":"à¤§à¤²à¤¾à¤ˆ","parent_id":"33"},
{"answer_id":"123","answer_english":"Dhamtari","answer_hindi":"à¤§à¤®à¤¤à¤°à¥€","parent_id":"7"},
{"answer_id":"255","answer_english":"Dhanbad","answer_hindi":"à¤§à¤¨à¤¬à¤¾à¤¦","parent_id":"15"},
{"answer_id":"335","answer_english":"Dhar ","answer_hindi":"à¤§à¤¾à¤°","parent_id":"20"},
{"answer_id":"557","answer_english":"Dharmapuri","answer_hindi":"à¤§à¤°à¥à¤®à¤ªà¥à¤°à¥€","parent_id":"31"},
{"answer_id":"283","answer_english":"Dharwad","answer_hindi":"à¤§à¤¾à¤°à¤µà¤¾à¤¡à¤¼","parent_id":"16"},
{"answer_id":"51","answer_english":"Dhemaji","answer_hindi":"à¤§à¥‡à¤®à¤¾à¤œà¥€","parent_id":"4"},
{"answer_id":"467","answer_english":"Dhenkanal","answer_hindi":"à¤¢à¥‡à¤¨à¥à¤•à¤¾à¤¨à¤¾à¤²","parent_id":"26"},
{"answer_id":"527","answer_english":"Dholpur","answer_hindi":"à¤§à¥Œà¤²à¤ªà¥à¤°","parent_id":"29"},
{"answer_id":"52","answer_english":"Dhubri","answer_hindi":"à¤§à¥à¤¬à¤°à¥€","parent_id":"4"},
{"answer_id":"381","answer_english":"Dhule","answer_hindi":"à¤§à¥à¤²à¥‡","parent_id":"21"},
{"answer_id":"53","answer_english":"Dibrugarh","answer_hindi":"à¤¡à¤¿à¤¬à¥à¤°à¥‚à¤—à¤¢à¤¼","parent_id":"4"},
{"answer_id":"54","answer_english":"Dima Hasao","answer_hindi":"à¤¦à¤¿à¤®à¤¾ à¤¹à¤¸à¤¾à¤“","parent_id":"4"},
{"answer_id":"447","answer_english":"Dimapur","answer_hindi":"à¤¦à¥€à¤®à¤¾à¤ªà¥à¤°","parent_id":"25"},
{"answer_id":"558","answer_english":"Dindigul","answer_hindi":"à¤¡à¤¿à¤‚à¤¡à¤¿à¤—à¥à¤²","parent_id":"31"},
{"answer_id":"346","answer_english":"Dindori ","answer_hindi":"à¤¡à¤¿à¤‚à¤¡à¥Œà¤°à¥€","parent_id":"20"},
{"answer_id":"144","answer_english":"Diu","answer_hindi":"à¤¦à¥€à¤µÂ ","parent_id":"8"},
{"answer_id":"230","answer_english":"Doda","answer_hindi":"à¤¡à¥‹à¤¡à¤¾","parent_id":"14"},
{"answer_id":"266","answer_english":"Dumka","answer_hindi":"à¤¦à¥à¤®à¤•à¤¾","parent_id":"15"},
{"answer_id":"528","answer_english":"Dungarpur","answer_hindi":"à¤¡à¥‚à¤‚à¤—à¤°à¤ªà¥à¤°","parent_id":"29"},
{"answer_id":"124","answer_english":"Durg","answer_hindi":"à¤¦à¥à¤°à¥à¤—","parent_id":"7"},
{"answer_id":"85","answer_english":"East Champaran","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µà¥€ à¤šà¤®à¥à¤ªà¤¾à¤°à¤£ à¤œà¤¿à¤²à¤¾","parent_id":"5"},
{"answer_id":"148","answer_english":"East Delhi","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µà¥€ à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"429","answer_english":"East Garo Hills","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µà¥€ à¤—à¤¾à¤°à¥‹ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"3","answer_english":"East Godavari","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µ à¤—à¥‹à¤¦à¤¾à¤µà¤°à¥€","parent_id":"1"},
{"answer_id":"434","answer_english":"East Jaintia Hills","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µ à¤œà¤¯à¤‚à¤¤à¤¿à¤¯à¤¾ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"19","answer_english":"East Kameng","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µ à¤•à¤®à¥‡à¤‚à¤—","parent_id":"3"},
{"answer_id":"425","answer_english":"East Khasi Hills","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µà¥€ à¤–à¤¾à¤¸à¥€ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"20","answer_english":"East Siang","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µ à¤¸à¤¿à¤¯à¤¾à¤‚à¤—","parent_id":"3"},
{"answer_id":"548","answer_english":"East Sikkim","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µÂ à¤¸à¤¿à¤•à¥à¤•à¤¿à¤®","parent_id":"30"},
{"answer_id":"263","answer_english":"East Singhbhum","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µà¥€ à¤¸à¤¿à¤‚à¤¹à¤­à¥‚à¤®","parent_id":"15"},
{"answer_id":"302","answer_english":"Ernakulam","answer_hindi":"à¤à¤°à¥à¤¨à¤¾à¤•à¥à¤²à¤®","parent_id":"17"},
{"answer_id":"559","answer_english":"Erode","answer_hindi":"à¤ˆà¤°à¥‹à¤¡","parent_id":"31"},
{"answer_id":"654","answer_english":"Etah","answer_hindi":"à¤à¤Ÿà¤¾","parent_id":"34"},
{"answer_id":"655","answer_english":"Etawah","answer_hindi":"à¤‡à¤Ÿà¤¾à¤µà¤¾","parent_id":"34"},
{"answer_id":"656","answer_english":"Faizabad","answer_hindi":"à¤«à¥ˆà¤œà¤¼à¤¾à¤¬à¤¾à¤¦ à¤¶à¤¹à¤° (à¤…à¤¯à¥‹à¤§à¥à¤¯à¤¾)","parent_id":"34"},
{"answer_id":"195","answer_english":"Faridabad","answer_hindi":"à¤«à¤°à¥€à¤¦à¤¾à¤¬à¤¾à¤¦","parent_id":"12"},
{"answer_id":"497","answer_english":"Faridkot","answer_hindi":"à¤«à¤°à¥€à¤¦à¤•à¥‹à¤Ÿ","parent_id":"28"},
{"answer_id":"657","answer_english":"Farrukhabad","answer_hindi":"à¤«à¤¼à¤°à¥à¤°à¥‚à¤–à¤¼à¤¾à¤¬à¤¾à¤¦","parent_id":"34"},
{"answer_id":"196","answer_english":"Fatehabad","answer_hindi":"à¤«à¤¤à¥‡à¤¹à¤¾à¤¬à¤¾à¤¦","parent_id":"12"},
{"answer_id":"498","answer_english":"Fatehgarh Sahib","answer_hindi":"à¤«à¤¤à¥‡à¤¹à¤—à¤¢à¤¼ à¤¸à¤¾à¤¹à¤¿à¤¬","parent_id":"28"},
{"answer_id":"658","answer_english":"Fatehpur","answer_hindi":"à¤«à¤¤à¥‡à¤¹à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"499","answer_english":"Fazilka","answer_hindi":"à¤«à¤¾à¤œà¤¼à¤¿à¤²à¥à¤•à¤¾Â ","parent_id":"28"},
{"answer_id":"659","answer_english":"Firozabad","answer_hindi":"à¤«à¤¼à¤¿à¤°à¥‹à¤œà¤¾à¤¬à¤¾à¤¦","parent_id":"34"},
{"answer_id":"496","answer_english":"Firozpur","answer_hindi":"à¤«à¤¿à¤°à¥‹à¤œà¤ªà¥à¤°","parent_id":"28"},
{"answer_id":"284","answer_english":"Gadag","answer_hindi":"à¤—à¤¦à¤—","parent_id":"16"},
{"answer_id":"382","answer_english":"Gadchiroli","answer_hindi":"à¤—à¤¡à¤šà¤¿à¤°à¥‹à¤²à¥€","parent_id":"21"},
{"answer_id":"469","answer_english":"Gajapati","answer_hindi":"à¤—à¤œà¤ªà¤¤à¤¿","parent_id":"26"},
{"answer_id":"231","answer_english":"Ganderbal","answer_hindi":"à¤—à¤¾à¤‚à¤¦à¤°à¤¬à¤²","parent_id":"14"},
{"answer_id":"171","answer_english":"Gandhinagar","answer_hindi":"à¤—à¤¾à¤‚à¤§à¥€à¤¨à¤—à¤°","parent_id":"11"},
{"answer_id":"529","answer_english":"Ganganagar","answer_hindi":"à¤¶à¥à¤°à¥€à¤—à¤‚à¤—à¤¾à¤¨à¤—à¤°","parent_id":"29"},
{"answer_id":"468","answer_english":"Ganjam","answer_hindi":"à¤—à¤‚à¤œà¤¾à¤®","parent_id":"26"},
{"answer_id":"246","answer_english":"Garhwa","answer_hindi":"à¤—à¤¢à¤µà¤¾","parent_id":"15"},
{"answer_id":"125","answer_english":"Gariaband","answer_hindi":"à¤—à¤°à¤¿à¤¯à¤¾à¤¬à¤‚à¤¦","parent_id":"7"},
{"answer_id":"126","answer_english":"Gaurella-Pendra-Marwahi","answer_hindi":"à¤—à¥Œà¤°à¥‡à¤²à¤¾-à¤ªà¥‡à¤£à¥à¤¡à¥à¤°à¤¾-à¤®à¤°à¤µà¤¾à¤¹à¥€","parent_id":"7"},
{"answer_id":"660","answer_english":"Gautam Buddha Nagar","answer_hindi":"à¤—à¥Œà¤¤à¤®à¤¬à¥à¤¦à¥à¤§ à¤¨à¤—à¤°","parent_id":"34"},
{"answer_id":"86","answer_english":"Gaya","answer_hindi":"à¤—à¤¯à¤¾","parent_id":"5"},
{"answer_id":"661","answer_english":"Ghaziabad","answer_hindi":"à¤—à¤¾à¤œà¤¿à¤¯à¤¾à¤¬à¤¾à¤¦","parent_id":"34"},
{"answer_id":"662","answer_english":"Ghazipur","answer_hindi":"à¤—à¤¼à¤¾à¤œà¤¼à¥€à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"172","answer_english":"Gir Somnath","answer_hindi":"à¤—à¤¿à¤° à¤¸à¥‹à¤®à¤¨à¤¾à¤¥","parent_id":"11"},
{"answer_id":"252","answer_english":"Giridih","answer_hindi":"à¤—à¤¿à¤°à¥€à¤¡à¥€à¤¹","parent_id":"15"},
{"answer_id":"55","answer_english":"Goalpara","answer_hindi":"à¤—à¥‹à¤µà¤¾à¤²à¤ªà¤¾à¤°à¤¾","parent_id":"4"},
{"answer_id":"268","answer_english":"Godda","answer_hindi":"à¤—à¥‹à¤¡à¥à¤¡à¤¾","parent_id":"15"},
{"answer_id":"56","answer_english":"Golaghat","answer_hindi":"à¤—à¥‹à¤²à¤¾à¤˜à¤¾à¤Ÿ","parent_id":"4"},
{"answer_id":"625","answer_english":"Gomati","answer_hindi":"à¤—à¥‹à¤®à¤¤à¥€","parent_id":"33"},
{"answer_id":"663","answer_english":"Gonda","answer_hindi":"à¤—à¥‹à¤‚à¤¡à¤¾","parent_id":"34"},
{"answer_id":"383","answer_english":"Gondia","answer_hindi":"à¤—à¥‹à¤‚à¤¦à¤¿à¤¯à¤¾","parent_id":"21"},
{"answer_id":"87","answer_english":"Gopalganj","answer_hindi":"à¤—à¥‹à¤ªà¤¾à¤²à¤—à¤‚à¤œ","parent_id":"5"},
{"answer_id":"664","answer_english":"Gorakhpur","answer_hindi":"à¤—à¥‹à¤°à¤–à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"285","answer_english":"Gulbarga","answer_hindi":"à¤—à¥à¤²à¤¬à¤°à¥à¤—","parent_id":"16"},
{"answer_id":"256","answer_english":"Gumla","answer_hindi":"à¤—à¥à¤®à¤²à¤¾","parent_id":"15"},
{"answer_id":"330","answer_english":"Guna ","answer_hindi":"à¤—à¥à¤¨à¤¾","parent_id":"20"},
{"answer_id":"4","answer_english":"Guntur","answer_hindi":"à¤—à¥à¤‚à¤Ÿà¥‚à¤°","parent_id":"1"},
{"answer_id":"500","answer_english":"Gurdaspur","answer_hindi":"à¤—à¥à¤°à¤¦à¤¾à¤¸à¤ªà¥à¤°","parent_id":"28"},
{"answer_id":"197","answer_english":"Gurgaon","answer_hindi":"à¤—à¥à¤°à¥à¤—à¥à¤°à¤¾à¤®","parent_id":"12"},
{"answer_id":"326","answer_english":"Gwalior ","answer_hindi":"à¤—à¥à¤µà¤¾à¤²à¤¿à¤¯à¤°","parent_id":"20"},
{"answer_id":"57","answer_english":"Hailakandi","answer_hindi":"à¤¹à¥ˆà¤²à¤¾à¤•à¤¾à¤‚à¤¡à¥€","parent_id":"4"},
{"answer_id":"665","answer_english":"Hamirpur","answer_hindi":"à¤¹à¤®à¥€à¤°à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"216","answer_english":"Hamirpur","answer_hindi":"à¤¹à¤®à¥€à¤°à¤ªà¥à¤°","parent_id":"13"},
{"answer_id":"530","answer_english":"Hanumangarh","answer_hindi":"à¤¹à¤¨à¥à¤®à¤¾à¤¨à¤—à¤¢à¤¼","parent_id":"29"},
{"answer_id":"666","answer_english":"Hapur","answer_hindi":"à¤¹à¤¾à¤ªà¥à¤¡à¤¼","parent_id":"34"},
{"answer_id":"348","answer_english":"Harda ","answer_hindi":"à¤¹à¤°à¤¦à¤¾","parent_id":"20"},
{"answer_id":"667","answer_english":"Hardoi","answer_hindi":"à¤¹à¤°à¤¦à¥‹à¤ˆ","parent_id":"34"},
{"answer_id":"711","answer_english":"Haridwar","answer_hindi":"à¤¹à¤°à¤¿à¤¦à¥à¤µà¤¾à¤°","parent_id":"35"},
{"answer_id":"286","answer_english":"Hassan","answer_hindi":"à¤¹à¤¾à¤¸à¤¨","parent_id":"16"},
{"answer_id":"668","answer_english":"Hathras","answer_hindi":"à¤¹à¤¾à¤¥à¤°à¤¸","parent_id":"34"},
{"answer_id":"287","answer_english":"Haveri","answer_hindi":"à¤¹à¤¾à¤µà¥‡à¤°à¥€","parent_id":"16"},
{"answer_id":"250","answer_english":"Hazaribagh","answer_hindi":"à¤¹à¤œà¤¾à¤°à¥€à¤¬à¤¾à¤—","parent_id":"15"},
{"answer_id":"384","answer_english":"Hingoli","answer_hindi":"à¤¹à¤¿à¤‚à¤—à¥‹à¤²à¥€","parent_id":"21"},
{"answer_id":"198","answer_english":"Hissar","answer_hindi":"à¤¹à¤¿à¤¸à¤¾à¤°","parent_id":"12"},
{"answer_id":"444","answer_english":"Hnahthial","answer_hindi":"à¤¹à¥à¤¨à¤¾à¤¹à¤¥à¤¿à¤†à¤²","parent_id":"24"},
{"answer_id":"58","answer_english":"Hojai","answer_hindi":"à¤¹à¥‹à¤œà¤¾à¤ˆ","parent_id":"4"},
{"answer_id":"727","answer_english":"Hooghly","answer_hindi":"à¤¹à¥à¤—à¤²à¥€","parent_id":"36"},
{"answer_id":"349","answer_english":"Hoshangabad ","answer_hindi":"à¤¹à¥‹à¤¶à¤‚à¤—à¤¾à¤¬à¤¾à¤¦","parent_id":"20"},
{"answer_id":"501","answer_english":"Hoshiarpur","answer_hindi":"à¤¹à¥‹à¤¶à¤¿à¤¯à¤¾à¤°à¤ªà¥à¤°","parent_id":"28"},
{"answer_id":"728","answer_english":"Howrah","answer_hindi":"à¤¹à¤¾à¤µà¤™à¤¾","parent_id":"36"},
{"answer_id":"593","answer_english":"Hyderabad","answer_hindi":"à¤¹à¥ˆà¤¦à¤°à¤¾à¤¬à¤¾à¤¦","parent_id":"32"},
{"answer_id":"303","answer_english":"Idukki","answer_hindi":"à¤‡à¤¡à¥à¤•à¥à¤•à¥€Â ","parent_id":"17"},
{"answer_id":"411","answer_english":"Imphal East","answer_hindi":"à¤‡à¤®à¥à¤«à¤¾à¤² à¤ªà¥‚à¤°à¥à¤µ","parent_id":"22"},
{"answer_id":"412","answer_english":"Imphal West","answer_hindi":"à¤‡à¤®à¥à¤«à¤¾à¤² à¤ªà¤¶à¥à¤šà¤¿à¤®","parent_id":"22"},
{"answer_id":"334","answer_english":"Indore ","answer_hindi":"à¤‡à¤¨à¥à¤¦à¥Œà¤°","parent_id":"20"},
{"answer_id":"341","answer_english":"Jabalpur ","answer_hindi":"à¤œà¤¬à¤²à¤ªà¥à¤°","parent_id":"20"},
{"answer_id":"472","answer_english":"Jagatsinghapur","answer_hindi":"à¤œà¤—à¤¤à¤¸à¤¿à¤‚à¤¹à¤ªà¥à¤°","parent_id":"26"},
{"answer_id":"594","answer_english":"Jagtial","answer_hindi":"à¤œà¤—à¤¿à¤¤à¥à¤¯à¤¾à¤²","parent_id":"32"},
{"answer_id":"534","answer_english":"Jaipur","answer_hindi":"à¤œà¤¯à¤ªà¥à¤°","parent_id":"29"},
{"answer_id":"535","answer_english":"Jaisalmer","answer_hindi":"à¤œà¥ˆà¤¸à¤²à¤®à¥‡à¤°","parent_id":"29"},
{"answer_id":"471","answer_english":"Jajpur","answer_hindi":"à¤œà¤¾à¤œà¤ªà¥à¤°","parent_id":"26"},
{"answer_id":"502","answer_english":"Jalandhar","answer_hindi":"à¤œà¤¾à¤²à¤‚à¤§à¤°","parent_id":"28"},
{"answer_id":"669","answer_english":"Jalaun","answer_hindi":"à¤œà¤²à¥Œà¤¨","parent_id":"34"},
{"answer_id":"385","answer_english":"Jalgaon","answer_hindi":"à¤œà¤³à¤—à¤¾à¤µ","parent_id":"21"},
{"answer_id":"386","answer_english":"Jalna","answer_hindi":"à¤œà¤¾à¤²à¤¨à¤¾","parent_id":"21"},
{"answer_id":"532","answer_english":"Jalore","answer_hindi":"à¤œà¤¾à¤²à¥Œà¤°","parent_id":"29"},
{"answer_id":"729","answer_english":"Jalpaiguri","answer_hindi":"à¤œà¤²à¤ªà¤¾à¤ˆà¤—à¥à¤™à¥€","parent_id":"36"},
{"answer_id":"232","answer_english":"Jammu","answer_hindi":"à¤œà¤®à¥à¤®à¥‚","parent_id":"14"},
{"answer_id":"173","answer_english":"Jamnagar","answer_hindi":"à¤œà¤¾à¤®à¤¨à¤—à¤°","parent_id":"11"},
{"answer_id":"264","answer_english":"Jamtara","answer_hindi":"à¤œà¤¾à¤®à¤¤à¤¾à¤¡à¤¼à¤¾","parent_id":"15"},
{"answer_id":"88","answer_english":"Jamui","answer_hindi":"à¤œà¤®à¥à¤ˆ","parent_id":"5"},
{"answer_id":"595","answer_english":"Jangaon","answer_hindi":"à¤œà¤¨à¤—à¤¾à¤à¤µ","parent_id":"32"},
{"answer_id":"127","answer_english":"Janjgir-Champa","answer_hindi":"à¤œà¤¾à¤‚à¤œà¤—à¥€à¤°-à¤šà¤¾à¤®à¥à¤ªà¤¾","parent_id":"7"},
{"answer_id":"128","answer_english":"Jashpur","answer_hindi":"à¤œà¤¶à¤ªà¥à¤°","parent_id":"7"},
{"answer_id":"670","answer_english":"Jaunpur","answer_hindi":"à¤œà¥Œà¤¨à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"596","answer_english":"Jayashankar Bhupalpally","answer_hindi":"à¤œà¤¯à¤¶à¤‚à¤•à¤° à¤­à¥‚à¤ªà¤²à¤ªà¤²à¥à¤²à¥€","parent_id":"32"},
{"answer_id":"89","answer_english":"Jehanabad","answer_hindi":"à¤œà¤¹à¤¾à¤¨à¤¾à¤¬à¤¾à¤¦","parent_id":"5"},
{"answer_id":"336","answer_english":"Jhabua ","answer_hindi":"à¤à¤¾à¤¬à¥à¤†","parent_id":"20"},
{"answer_id":"199","answer_english":"Jhajjar","answer_hindi":"à¤à¤œà¥à¤œà¤°","parent_id":"12"},
{"answer_id":"536","answer_english":"Jhalawar","answer_hindi":"à¤à¤¾à¤²à¤¾à¤µà¤¾à¤¡à¤¼","parent_id":"29"},
{"answer_id":"671","answer_english":"Jhansi","answer_hindi":"à¤à¤¾à¤à¤¸à¥€","parent_id":"34"},
{"answer_id":"730","answer_english":"Jhargram","answer_hindi":"à¤à¤¾à¤¡à¤¼à¤—à¥à¤°à¤¾à¤®","parent_id":"36"},
{"answer_id":"470","answer_english":"Jharsuguda","answer_hindi":"à¤à¤¾à¤°à¤¸à¥à¤—à¥à¤¡à¤¼à¤¾","parent_id":"26"},
{"answer_id":"531","answer_english":"Jhunjhunu","answer_hindi":"à¤à¥à¤‚à¤à¥à¤¨à¥‚","parent_id":"29"},
{"answer_id":"200","answer_english":"Jind","answer_hindi":"à¤œà¥€à¤‚à¤¦","parent_id":"12"},
{"answer_id":"418","answer_english":"Jiribam","answer_hindi":"à¤œà¤¿à¤°à¤¿à¤¬à¤¾à¤®","parent_id":"22"},
{"answer_id":"533","answer_english":"Jodhpur","answer_hindi":"à¤œà¥‹à¤§à¤ªà¥à¤°","parent_id":"29"},
{"answer_id":"597","answer_english":"Jogulamba Gadwal","answer_hindi":"à¤œà¥‹à¤—à¥à¤²à¤¾à¤®à¥à¤¬à¤¾ à¤—à¤¦à¥à¤µà¤¾à¤²","parent_id":"32"},
{"answer_id":"59","answer_english":"Jorhat","answer_hindi":"à¤œà¥‹à¤°à¤¹à¤¾à¤Ÿ","parent_id":"4"},
{"answer_id":"174","answer_english":"Junagadh","answer_hindi":"à¤œà¥‚à¤¨à¤¾à¤—à¥","parent_id":"11"},
{"answer_id":"129","answer_english":"Kabirdham \/ Kawardha","answer_hindi":"à¤•à¤¬à¥€à¤°à¤§à¤¾à¤® \/ à¤•à¤µà¤°à¥à¤§à¤¾","parent_id":"7"},
{"answer_id":"5","answer_english":"Kadapa","answer_hindi":"à¤•à¤¡à¤¼à¤ªà¥à¤ªà¤¾","parent_id":"1"},
{"answer_id":"90","answer_english":"Kaimur","answer_hindi":"à¤•à¥ˆà¤®à¥‚à¤°","parent_id":"5"},
{"answer_id":"201","answer_english":"Kaithal","answer_hindi":"à¤•à¥ˆà¤¥à¤²","parent_id":"12"},
{"answer_id":"420","answer_english":"Kakching","answer_hindi":"à¤•à¤•à¤šà¤¿à¤‚à¤—Â ","parent_id":"22"},
{"answer_id":"475","answer_english":"Kalahandi","answer_hindi":"à¤•à¤²à¤¾à¤¹à¤¾à¤¨à¥à¤¡à¥€","parent_id":"26"},
{"answer_id":"731","answer_english":"Kalimpong","answer_hindi":"à¤•à¤²à¤¿à¤®à¥à¤ªà¥‹à¤—","parent_id":"36"},
{"answer_id":"560","answer_english":"Kallakurichi","answer_hindi":"à¤•à¤²à¥à¤²à¤¾à¤•à¥à¤°à¤¿à¤šà¥€","parent_id":"31"},
{"answer_id":"598","answer_english":"Kamareddy","answer_hindi":"à¤•à¤¾à¤®à¤¾à¤°à¥‡à¤¡à¥à¤¡à¥€","parent_id":"32"},
{"answer_id":"422","answer_english":"Kamjong","answer_hindi":"à¤•à¤®à¤œà¥‹à¤‚à¤—Â ","parent_id":"22"},
{"answer_id":"21","answer_english":"Kamle","answer_hindi":"à¤•à¤®à¤²à¥‡","parent_id":"3"},
{"answer_id":"61","answer_english":"Kamrup","answer_hindi":"à¤•à¤¾à¤®à¤°à¥‚à¤ª","parent_id":"4"},
{"answer_id":"60","answer_english":"Kamrup Metropolitan","answer_hindi":"à¤•à¤¾à¤®à¤°à¥‚à¤ª à¤®à¤¹à¤¾à¤¨à¤—à¤°","parent_id":"4"},
{"answer_id":"561","answer_english":"Kanchipuram","answer_hindi":"à¤•à¤¾à¤‚à¤šà¥€à¤ªà¥à¤°à¤®","parent_id":"31"},
{"answer_id":"476","answer_english":"Kandhamal","answer_hindi":"à¤•à¤¨à¥à¤§à¤®à¤¾à¤²","parent_id":"26"},
{"answer_id":"419","answer_english":"KangpokpiÂ (Sadar Hills)","answer_hindi":"à¤•à¤‚à¤—à¤ªà¥‹à¤•à¤ªà¥€","parent_id":"22"},
{"answer_id":"217","answer_english":"Kangra","answer_hindi":"à¤•à¤¾à¤à¤—à¤¡à¤¼à¤¾","parent_id":"13"},
{"answer_id":"130","answer_english":"Kanker","answer_hindi":"à¤•à¤¾à¤‚à¤•à¥‡à¤° Â (à¤‰à¤¤à¥à¤¤à¤° à¤¬à¤¸à¥à¤¤à¤°)","parent_id":"7"},
{"answer_id":"672","answer_english":"Kannauj","answer_hindi":"à¤•à¤¨à¥à¤¨à¥Œà¤œ","parent_id":"34"},
{"answer_id":"304","answer_english":"Kannur","answer_hindi":"à¤•à¤¨à¥à¤¨à¥‚à¤°","parent_id":"17"},
{"answer_id":"673","answer_english":"Kanpur Dehat","answer_hindi":"à¤•à¤¾à¤¨à¤ªà¥à¤° à¤¦à¥‡à¤¹à¤¾à¤¤","parent_id":"34"},
{"answer_id":"674","answer_english":"Kanpur Nagar","answer_hindi":"à¤•à¤¾à¤¨à¤ªà¥à¤° à¤¨à¤—à¤°","parent_id":"34"},
{"answer_id":"562","answer_english":"Kanyakumari","answer_hindi":"à¤•à¤¨à¥à¤¯à¤¾à¤•à¥à¤®à¤¾à¤°à¥€","parent_id":"31"},
{"answer_id":"503","answer_english":"Kapurthala","answer_hindi":"à¤•à¤ªà¥‚à¤°à¤¥à¤²à¤¾","parent_id":"28"},
{"answer_id":"489","answer_english":"Karaikal","answer_hindi":"à¤•à¤°à¤¾à¤ˆà¤•à¤²Â ","parent_id":"27"},
{"answer_id":"537","answer_english":"Karauli","answer_hindi":"à¤•à¤°à¥Œà¤²à¥€","parent_id":"29"},
{"answer_id":"62","answer_english":"Karbi Anglong","answer_hindi":"à¤•à¤¾à¤°à¥à¤¬à¥€ à¤†à¤‚à¤—à¤²à¥‹à¤‚à¤—","parent_id":"4"},
{"answer_id":"315","answer_english":"KargilÂ ","answer_hindi":"à¤•à¤¾à¤°à¤—à¤¿à¤²","parent_id":"18"},
{"answer_id":"63","answer_english":"Karimganj","answer_hindi":"à¤•à¤°à¥€à¤®à¤—à¤‚à¤œ","parent_id":"4"},
{"answer_id":"599","answer_english":"Karimnagar","answer_hindi":"à¤•à¤°à¥€à¤®à¤¨à¤—à¤°","parent_id":"32"},
{"answer_id":"202","answer_english":"Karnal","answer_hindi":"à¤•à¤°à¤¨à¤¾à¤²","parent_id":"12"},
{"answer_id":"563","answer_english":"Karur","answer_hindi":"à¤•à¤°à¥‚à¤°","parent_id":"31"},
{"answer_id":"305","answer_english":"Kasaragod","answer_hindi":"à¤•à¤¾à¤¸à¤°à¤—à¥‹à¤¡Â ","parent_id":"17"},
{"answer_id":"675","answer_english":"Kasganj","answer_hindi":"à¤•à¤¾à¤¸à¤—à¤‚à¤œÂ ","parent_id":"34"},
{"answer_id":"233","answer_english":"Kathua","answer_hindi":"à¤•à¤ à¥à¤†","parent_id":"14"},
{"answer_id":"91","answer_english":"Katihar","answer_hindi":"à¤•à¤Ÿà¤¿à¤¹à¤¾à¤°","parent_id":"5"},
{"answer_id":"342","answer_english":"Katni ","answer_hindi":"à¤•à¤Ÿà¤¨à¥€","parent_id":"20"},
{"answer_id":"676","answer_english":"Kaushambi","answer_hindi":"à¤•à¥Œà¤¶à¤¾à¤®à¥à¤¬à¥€","parent_id":"34"},
{"answer_id":"478","answer_english":"Kendrapara","answer_hindi":"à¤•à¥‡à¤¨à¥à¤¦à¥à¤°à¤¾à¤ªà¤¡à¤¼à¤¾","parent_id":"26"},
{"answer_id":"474","answer_english":"Kendujhar","answer_hindi":"à¤•à¥‡à¤¨à¥à¤¦à¥à¤à¤°","parent_id":"26"},
{"answer_id":"92","answer_english":"Khagaria","answer_hindi":"à¤–à¤—à¤¡à¤¼à¤¿à¤¯à¤¾","parent_id":"5"},
{"answer_id":"600","answer_english":"Khammam","answer_hindi":"à¤–à¤®à¥à¤®à¤®","parent_id":"32"},
{"answer_id":"337","answer_english":"Khandwa (East Nimar)","answer_hindi":"à¤–à¤‚à¤¡à¤µà¤¾","parent_id":"20"},
{"answer_id":"338","answer_english":"Khargone (West Nimar)","answer_hindi":"à¤–à¤°à¤—à¥‹à¤¨","parent_id":"20"},
{"answer_id":"445","answer_english":"Khawzawl","answer_hindi":"à¤–à¤¾à¤µà¤œà¥Œà¤²","parent_id":"24"},
{"answer_id":"176","answer_english":"Kheda","answer_hindi":"à¤–à¥‡à¤¡à¤¼à¤¾","parent_id":"11"},
{"answer_id":"473","answer_english":"Khordha","answer_hindi":"à¤–à¥‹à¤°à¥à¤§à¤¾","parent_id":"26"},
{"answer_id":"628","answer_english":"Khowai","answer_hindi":"à¤–à¥‹à¤µà¤¾à¤ˆ","parent_id":"33"},
{"answer_id":"260","answer_english":"Khunti","answer_hindi":"à¤–à¥à¤Ÿà¥€","parent_id":"15"},
{"answer_id":"218","answer_english":"Kinnaur","answer_hindi":"à¤•à¤¿à¤¨à¥à¤¨à¥Œà¤°","parent_id":"13"},
{"answer_id":"448","answer_english":"Kiphire","answer_hindi":"à¤•à¥ˆà¤«à¤¾à¤‡à¤°","parent_id":"25"},
{"answer_id":"93","answer_english":"Kishanganj","answer_hindi":"à¤•à¤¿à¤¶à¤¨à¤—à¤‚à¤œ","parent_id":"5"},
{"answer_id":"234","answer_english":"Kishtwar","answer_hindi":"à¤•à¤¿à¤¶à¥à¤¤à¤µà¤¾à¤¡à¤¼","parent_id":"14"},
{"answer_id":"288","answer_english":"Kodagu","answer_hindi":"à¤•à¥‹à¤¡à¤—à¥","parent_id":"16"},
{"answer_id":"251","answer_english":"Koderma","answer_hindi":"à¤•à¥‹à¤¡à¤°à¤®à¤¾","parent_id":"15"},
{"answer_id":"449","answer_english":"Kohima","answer_hindi":"à¤•à¥‹à¤¹à¤¿à¤®à¤¾","parent_id":"25"},
{"answer_id":"64","answer_english":"Kokrajhar","answer_hindi":"à¤•à¥‹à¤•à¤°à¤¾à¤à¤¾à¤°","parent_id":"4"},
{"answer_id":"289","answer_english":"Kolar","answer_hindi":"à¤•à¥‹à¤²à¤¾à¤°","parent_id":"16"},
{"answer_id":"437","answer_english":"Kolasib","answer_hindi":"à¤•à¥‹à¤²à¤¾à¤¸à¤¿à¤¬","parent_id":"24"},
{"answer_id":"387","answer_english":"Kolhapur","answer_hindi":"à¤•à¥‹à¤²à¥à¤¹à¤¾à¤ªà¥à¤°","parent_id":"21"},
{"answer_id":"732","answer_english":"Kolkata","answer_hindi":"à¤•à¥‹à¤²à¤•à¤¾à¤¤à¤¾","parent_id":"36"},
{"answer_id":"306","answer_english":"Kollam","answer_hindi":"à¤•à¥‹à¤²à¥à¤²à¤®","parent_id":"17"},
{"answer_id":"591","answer_english":"Komaram Bheem","answer_hindi":"à¤•à¥‹à¤®à¤°à¤® à¤­à¥€à¤®","parent_id":"32"},
{"answer_id":"131","answer_english":"Kondagaon","answer_hindi":"à¤•à¥‹à¤‚à¤¡à¤—à¤¾à¤à¤µ","parent_id":"7"},
{"answer_id":"290","answer_english":"Koppal","answer_hindi":"à¤•à¥‹à¤ªà¥à¤ªà¤²","parent_id":"16"},
{"answer_id":"477","answer_english":"Koraput","answer_hindi":"à¤•à¥‹à¤°à¤¾à¤ªà¥à¤Ÿ","parent_id":"26"},
{"answer_id":"132","answer_english":"Korba","answer_hindi":"à¤•à¥‹à¤°à¤¬à¤¾","parent_id":"7"},
{"answer_id":"133","answer_english":"Koriya","answer_hindi":"à¤•à¥‹à¤°à¤¿à¤¯à¤¾","parent_id":"7"},
{"answer_id":"538","answer_english":"Kota","answer_hindi":"à¤•à¥‹à¤Ÿà¤¾","parent_id":"29"},
{"answer_id":"307","answer_english":"Kottayam","answer_hindi":"à¤•à¥‹à¤Ÿà¥à¤Ÿà¤¯à¤®","parent_id":"17"},
{"answer_id":"308","answer_english":"Kozhikode","answer_hindi":"à¤•à¥‹à¤¡à¤¼à¤¿à¤•à¥‹à¤¡","parent_id":"17"},
{"answer_id":"22","answer_english":"Kra Daadi","answer_hindi":"à¤•à¥à¤°à¤¾ à¤¦à¤¾à¤¦à¥€","parent_id":"3"},
{"answer_id":"6","answer_english":"Krishna","answer_hindi":"à¤•à¥ƒà¤·à¥à¤£à¤¾","parent_id":"1"},
{"answer_id":"564","answer_english":"Krishnagiri","answer_hindi":"à¤•à¥ƒà¤·à¥à¤£à¤—à¤¿à¤°à¤¿","parent_id":"31"},
{"answer_id":"235","answer_english":"Kulgam","answer_hindi":"à¤•à¥à¤²à¤—à¤¾à¤®","parent_id":"14"},
{"answer_id":"219","answer_english":"Kullu","answer_hindi":"à¤•à¥à¤²à¥à¤²à¥‚","parent_id":"13"},
{"answer_id":"236","answer_english":"Kupwara","answer_hindi":"à¤•à¥à¤ªà¤µà¤¾à¤¡à¤¼à¤¾","parent_id":"14"},
{"answer_id":"7","answer_english":"Kurnool","answer_hindi":"à¤•à¥à¤°à¥à¤¨à¥‚à¤²","parent_id":"1"},
{"answer_id":"203","answer_english":"Kurukshetra","answer_hindi":"à¤•à¥à¤°à¥à¤•à¥à¤·à¥‡à¤¤à¥à¤°","parent_id":"12"},
{"answer_id":"23","answer_english":"Kurung Kumey","answer_hindi":"à¤•à¥à¤°à¥à¤‚à¤— à¤•à¥à¤®à¥‡","parent_id":"3"},
{"answer_id":"677","answer_english":"Kushinagar","answer_hindi":"à¤•à¥à¤¶à¥€à¤¨à¤—à¤° (à¤ªà¤¡à¤¼à¤°à¥Œà¤¨à¤¾)","parent_id":"34"},
{"answer_id":"175","answer_english":"Kutch","answer_hindi":"à¤•à¤šà¥à¤›","parent_id":"11"},
{"answer_id":"220","answer_english":"Lahaul and Spiti","answer_hindi":"à¤²à¤¾à¤¹à¥Œà¤² à¤”à¤° à¤¸à¥à¤ªà¥€à¤¤à¥€","parent_id":"13"},
{"answer_id":"65","answer_english":"Lakhimpur","answer_hindi":"à¤²à¤–à¥€à¤®à¤ªà¥à¤°","parent_id":"4"},
{"answer_id":"678","answer_english":"Lakhimpur Kheri","answer_hindi":"à¤²à¤–à¥€à¤®à¤ªà¥à¤°-à¤–à¤¿à¤°à¥€","parent_id":"34"},
{"answer_id":"94","answer_english":"Lakhisarai","answer_hindi":"à¤²à¤–à¥€à¤¸à¤°à¤¾à¤¯","parent_id":"5"},
{"answer_id":"317","answer_english":"Lakshadweep","answer_hindi":"à¤²à¤•à¥à¤·à¤¦à¥à¤µà¥€à¤ª","parent_id":"19"},
{"answer_id":"679","answer_english":"Lalitpur","answer_hindi":"à¤²à¤²à¤¿à¤¤à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"248","answer_english":"Latehar","answer_hindi":"à¤²à¤¾à¤¤à¥‡à¤¹à¤¾à¤°","parent_id":"15"},
{"answer_id":"388","answer_english":"Latur","answer_hindi":"à¤²à¤¾à¤¤à¥‚à¤°","parent_id":"21"},
{"answer_id":"438","answer_english":"Lawngtlai","answer_hindi":"à¤²à¥‰à¤™à¥à¤—à¤¤à¤²à¤¾à¤ˆ","parent_id":"24"},
{"answer_id":"316","answer_english":"LehÂ ","answer_hindi":"à¤²à¥‡à¤¹","parent_id":"18"},
{"answer_id":"24","answer_english":"Lepa Rada","answer_hindi":"à¤²à¥‡à¤ªà¤¾ à¤°à¤¾à¤¦à¤¾","parent_id":"3"},
{"answer_id":"257","answer_english":"Lohardaga","answer_hindi":"à¤²à¥‹à¤¹à¤°à¤¦à¤—à¥à¤—à¤¾","parent_id":"15"},
{"answer_id":"25","answer_english":"Lohit","answer_hindi":"à¤²à¥‹à¤¹à¤¿à¤¤","parent_id":"3"},
{"answer_id":"26","answer_english":"Longding","answer_hindi":"à¤²à¥‹à¤‚à¤—à¤¡à¤¿à¤‚à¤—","parent_id":"3"},
{"answer_id":"450","answer_english":"Longleng","answer_hindi":"à¤²à¥‰à¤¨à¥à¤—à¤²à¥‡à¤¨à¥à¤—","parent_id":"25"},
{"answer_id":"27","answer_english":"Lower Dibang Valley","answer_hindi":"à¤¨à¤¿à¤šà¤²à¥€ à¤¦à¤¿à¤¬à¤¾à¤‚à¤— à¤˜à¤¾à¤Ÿà¥€","parent_id":"3"},
{"answer_id":"28","answer_english":"Lower Siang","answer_hindi":"à¤¨à¤¿à¤šà¤²à¤¾ à¤¸à¤¿à¤¯à¤¾à¤‚à¤—","parent_id":"3"},
{"answer_id":"29","answer_english":"Lower Subansiri","answer_hindi":"à¤¨à¤¿à¤šà¤²à¥€ à¤¸à¥à¤¬à¤¨à¤¸à¤¿à¤°à¥€","parent_id":"3"},
{"answer_id":"680","answer_english":"Lucknow","answer_hindi":"à¤²à¤–à¤¨à¤Š","parent_id":"34"},
{"answer_id":"504","answer_english":"Ludhiana","answer_hindi":"à¤²à¥à¤§à¤¿à¤¯à¤¾à¤¨à¤¾","parent_id":"28"},
{"answer_id":"439","answer_english":"Lunglei","answer_hindi":"à¤²à¥à¤‚à¤—à¤²à¥‡à¤ˆ","parent_id":"24"},
{"answer_id":"95","answer_english":"Madhepura","answer_hindi":"à¤®à¤§à¥‡à¤ªà¥à¤°à¤¾","parent_id":"5"},
{"answer_id":"96","answer_english":"Madhubani","answer_hindi":"à¤®à¤§à¥à¤¬à¤¨à¥€","parent_id":"5"},
{"answer_id":"565","answer_english":"Madurai","answer_hindi":"à¤®à¤¦à¥à¤°à¤ˆ","parent_id":"31"},
{"answer_id":"601","answer_english":"Mahabubabad","answer_hindi":"à¤®à¤¹à¤¾à¤¬à¥‚à¤¬à¤¾à¤¬à¤¾à¤¦","parent_id":"32"},
{"answer_id":"681","answer_english":"Maharajganj","answer_hindi":"à¤®à¤¹à¤¾à¤°à¤¾à¤œà¤—à¤‚à¤œ","parent_id":"34"},
{"answer_id":"134","answer_english":"Mahasamund","answer_hindi":"à¤®à¤¹à¤¾à¤¸à¤®à¥à¤¨à¥à¤¦","parent_id":"7"},
{"answer_id":"602","answer_english":"Mahbubnagar","answer_hindi":"à¤®à¤¹à¤¬à¥‚à¤¬à¤¨à¤—à¤°","parent_id":"32"},
{"answer_id":"490","answer_english":"MahÃ©","answer_hindi":"à¤®à¤¾à¤¹à¥‡Â ","parent_id":"27"},
{"answer_id":"204","answer_english":"Mahendragarh","answer_hindi":"à¤®à¤¹à¥‡à¤‚à¤¦à¥à¤°à¤—à¤¢à¤¼","parent_id":"12"},
{"answer_id":"177","answer_english":"Mahisagar","answer_hindi":"à¤®à¤¹à¥€à¤¸à¤¾à¤—à¤°","parent_id":"11"},
{"answer_id":"682","answer_english":"Mahoba","answer_hindi":"à¤®à¤¹à¥‹à¤¬à¤¾","parent_id":"34"},
{"answer_id":"371","answer_english":"Maihar","answer_hindi":"à¤®à¥ˆà¤¹à¤°","parent_id":"20"},
{"answer_id":"683","answer_english":"Mainpuri","answer_hindi":"à¤®à¥ˆà¤¨à¤ªà¥à¤°à¥€","parent_id":"34"},
{"answer_id":"66","answer_english":"Majuli","answer_hindi":"à¤®à¤¾à¤œà¥à¤²à¥€","parent_id":"4"},
{"answer_id":"309","answer_english":"Malappuram","answer_hindi":"à¤®à¤²à¤ªà¥à¤ªà¥à¤°à¤®","parent_id":"17"},
{"answer_id":"733","answer_english":"Maldah","answer_hindi":"à¤®à¤¾à¤²à¤¦à¤¹","parent_id":"36"},
{"answer_id":"479","answer_english":"Malkangiri","answer_hindi":"à¤®à¤¾à¤²à¤•à¤¾à¤¨à¤—à¤¿à¤°à¤¿","parent_id":"26"},
{"answer_id":"440","answer_english":"Mamit","answer_hindi":"à¤®à¤®à¤¿à¤¤","parent_id":"24"},
{"answer_id":"603","answer_english":"Mancherial","answer_hindi":"à¤®à¤‚à¤šà¥‡à¤°à¤¿à¤¯à¤²","parent_id":"32"},
{"answer_id":"221","answer_english":"Mandi","answer_hindi":"à¤®à¤‚à¤¡à¥€","parent_id":"13"},
{"answer_id":"343","answer_english":"Mandla ","answer_hindi":"à¤®à¤‚à¤¡à¤²à¤¾","parent_id":"20"},
{"answer_id":"365","answer_english":"Mandsaur","answer_hindi":"à¤®à¤‚à¤¦à¤¸à¥Œà¤°","parent_id":"20"},
{"answer_id":"291","answer_english":"Mandya","answer_hindi":"à¤®à¤¾à¤‚à¤¡à¤¯à¤¾","parent_id":"16"},
{"answer_id":"505","answer_english":"Mansa","answer_hindi":"à¤®à¤¾à¤¨à¤¸à¤¾","parent_id":"28"},
{"answer_id":"684","answer_english":"Mathura","answer_hindi":"à¤®à¤¥à¥à¤°à¤¾","parent_id":"34"},
{"answer_id":"685","answer_english":"Mau","answer_hindi":"à¤®à¤Š","parent_id":"34"},
{"answer_id":"566","answer_english":"Mayiladuthurai","answer_hindi":"à¤®à¤¯à¥€à¤²à¤¾à¤¡à¥‚à¤¤à¥à¤°à¥ˆ","parent_id":"31"},
{"answer_id":"480","answer_english":"Mayurbhanj","answer_hindi":"à¤®à¤¯à¥‚à¤°à¤­à¤‚à¤œ","parent_id":"26"},
{"answer_id":"604","answer_english":"Medak","answer_hindi":"à¤®à¥‡à¤¦à¤•","parent_id":"32"},
{"answer_id":"605","answer_english":"Medchal-Malkajgiri","answer_hindi":"à¤®à¥‡à¤¡à¥à¤šà¤² à¤®à¤²à¥à¤•à¤¾à¤œà¤—à¤¿à¤°à¤¿","parent_id":"32"},
{"answer_id":"686","answer_english":"Meerut","answer_hindi":"à¤®à¥‡à¤°à¤ ","parent_id":"34"},
{"answer_id":"178","answer_english":"Mehsana","answer_hindi":"à¤®à¥‡à¤¹à¤¸à¤¾à¤£à¤¾","parent_id":"11"},
{"answer_id":"687","answer_english":"Mirzapur","answer_hindi":"à¤®à¤¿à¤°à¥à¤œà¤¼à¤¾à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"506","answer_english":"Moga","answer_hindi":"à¤®à¥‹à¤—à¤¾","parent_id":"28"},
{"answer_id":"451","answer_english":"Mokokchung","answer_hindi":"à¤®à¥‹à¤•à¥‹à¤•à¤šà¥à¤†à¤‚à¤—","parent_id":"25"},
{"answer_id":"452","answer_english":"Mon","answer_hindi":"à¤®à¥‹à¤¨","parent_id":"25"},
{"answer_id":"688","answer_english":"Moradabad","answer_hindi":"à¤®à¥à¤°à¤¾à¤¦à¤¾à¤¬à¤¾à¤¦","parent_id":"34"},
{"answer_id":"179","answer_english":"Morbi","answer_hindi":"à¤®à¥‹à¤°à¤¬à¥€","parent_id":"11"},
{"answer_id":"323","answer_english":"Morena ","answer_hindi":"à¤®à¥à¤°à¥ˆà¤¨à¤¾","parent_id":"20"},
{"answer_id":"67","answer_english":"Morigaon","answer_hindi":"à¤®à¤¾à¤°à¤¿à¤—à¤¾à¤‚à¤µ","parent_id":"4"},
{"answer_id":"606","answer_english":"Mulugu","answer_hindi":"à¤®à¥à¤²à¥à¤—à¥","parent_id":"32"},
{"answer_id":"389","answer_english":"Mumbai","answer_hindi":"à¤®à¥à¤‚à¤¬à¤ˆ","parent_id":"21"},
{"answer_id":"390","answer_english":"Mumbai Suburban","answer_hindi":"à¤®à¥à¤‚à¤¬à¤ˆ (à¤¸à¤¬à¤…à¤°à¥à¤¬à¤¨)","parent_id":"21"},
{"answer_id":"135","answer_english":"Mungeli","answer_hindi":"à¤®à¥à¤‚à¤—à¥‡à¤²à¥€","parent_id":"7"},
{"answer_id":"97","answer_english":"Munger","answer_hindi":"à¤®à¥à¤‚à¤—à¥‡à¤°","parent_id":"5"},
{"answer_id":"734","answer_english":"Murshidabad","answer_hindi":"à¤®à¥à¤°à¥à¤¶à¤¿à¤¦à¤¾à¤¬à¤¾à¤¦","parent_id":"36"},
{"answer_id":"689","answer_english":"Muzaffarnagar","answer_hindi":"à¤®à¥à¤œà¤«à¥à¤«à¤°à¤¨à¤—à¤°","parent_id":"34"},
{"answer_id":"98","answer_english":"Muzaffarpur","answer_hindi":"à¤®à¥à¤œà¤«à¥à¤«à¤°à¤ªà¥à¤°","parent_id":"5"},
{"answer_id":"292","answer_english":"Mysore","answer_hindi":"à¤®à¥ˆà¤¸à¥‚à¤°","parent_id":"16"},
{"answer_id":"481","answer_english":"Nabarangpur","answer_hindi":"à¤¨à¤¬à¤°à¤‚à¤—à¤ªà¥à¤°","parent_id":"26"},
{"answer_id":"735","answer_english":"Nadia","answer_hindi":"à¤¨à¤¾à¤¦à¤¿à¤¯à¤¾","parent_id":"36"},
{"answer_id":"68","answer_english":"Nagaon","answer_hindi":"à¤¨à¤—à¤¾à¤‚à¤µ","parent_id":"4"},
{"answer_id":"567","answer_english":"Nagapattinam","answer_hindi":"à¤¨à¤¾à¤—à¤ªà¤Ÿà¥à¤Ÿà¤¿à¤¨à¤®","parent_id":"31"},
{"answer_id":"609","answer_english":"Nagarkurnool","answer_hindi":"à¤¨à¤¾à¤—à¤°à¤•à¤°à¥à¤¨à¥‚à¤²","parent_id":"32"},
{"answer_id":"539","answer_english":"Nagaur","answer_hindi":"à¤¨à¤¾à¤—à¥Œà¤°","parent_id":"29"},
{"answer_id":"372","answer_english":"Nagda","answer_hindi":"à¤¨à¤¾à¤—à¤¦à¤¾","parent_id":"20"},
{"answer_id":"391","answer_english":"Nagpur","answer_hindi":"à¤¨à¤¾à¤—à¤ªà¥à¤°","parent_id":"21"},
{"answer_id":"712","answer_english":"Nainital","answer_hindi":"à¤¨à¥ˆà¤¨à¥€à¤¤à¤¾à¤²","parent_id":"35"},
{"answer_id":"99","answer_english":"Nalanda","answer_hindi":"à¤¨à¤¾à¤²à¤‚à¤¦à¤¾","parent_id":"5"},
{"answer_id":"69","answer_english":"Nalbari","answer_hindi":"à¤¨à¤²à¤¬à¤¾à¤¡à¤¼à¥€","parent_id":"4"},
{"answer_id":"607","answer_english":"Nalgonda","answer_hindi":"à¤¨à¤²à¤—à¥‹à¤‚à¤¡à¤¾","parent_id":"32"},
{"answer_id":"569","answer_english":"Namakkal","answer_hindi":"à¤¨à¤¾à¤®à¤•à¥à¤•à¤²","parent_id":"31"},
{"answer_id":"30","answer_english":"Namsai","answer_hindi":"à¤¨à¤¾à¤®à¤¸à¤¾à¤ˆ","parent_id":"3"},
{"answer_id":"392","answer_english":"Nanded","answer_hindi":"à¤¨à¤¾à¤‚à¤¦à¥‡à¤¡","parent_id":"21"},
{"answer_id":"393","answer_english":"Nandurbar","answer_hindi":"à¤¨à¤‚à¤¦à¥à¤°à¤¬à¤¾à¤°","parent_id":"21"},
{"answer_id":"608","answer_english":"Narayanpet","answer_hindi":"à¤¨à¤¾à¤°à¤¾à¤¯à¤£à¤ªà¥‡à¤Ÿ","parent_id":"32"},
{"answer_id":"136","answer_english":"Narayanpur","answer_hindi":"à¤¨à¤¾à¤°à¤¾à¤¯à¤£à¤ªà¥à¤°","parent_id":"7"},
{"answer_id":"180","answer_english":"Narmada","answer_hindi":"à¤¨à¤°à¥à¤®à¤¦à¤¾","parent_id":"11"},
{"answer_id":"344","answer_english":"Narsinghpur ","answer_hindi":"à¤¨à¤°à¤¸à¤¿à¤‚à¤¹à¤ªà¥à¤°","parent_id":"20"},
{"answer_id":"394","answer_english":"Nashik","answer_hindi":"à¤¨à¤¾à¤¶à¤¿à¤•","parent_id":"21"},
{"answer_id":"181","answer_english":"Navsari","answer_hindi":"à¤¨à¤µà¤¸à¤¾à¤°à¥€","parent_id":"11"},
{"answer_id":"100","answer_english":"Nawada","answer_hindi":"à¤¨à¤µà¤¾à¤¦à¤¾","parent_id":"5"},
{"answer_id":"483","answer_english":"Nayagarh","answer_hindi":"à¤¨à¤¯à¤¾à¤—à¤¡à¤¼","parent_id":"26"},
{"answer_id":"366","answer_english":"Neemuch","answer_hindi":"à¤¨à¥€à¤®à¤š","parent_id":"20"},
{"answer_id":"8","answer_english":"Nellore","answer_hindi":"à¤¨à¥‡à¤²à¥à¤²à¥Œà¤°","parent_id":"1"},
{"answer_id":"146","answer_english":"New Delhi","answer_hindi":"à¤¨à¤ˆ à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"14","answer_english":"Nicobar","answer_hindi":"à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°","parent_id":"2"},
{"answer_id":"568","answer_english":"Nilgiris","answer_hindi":"à¤¨à¥€à¤²à¤—à¤¿à¤°à¤¿","parent_id":"31"},
{"answer_id":"610","answer_english":"Nirmal","answer_hindi":"à¤¨à¤¿à¤°à¥à¤®à¤²","parent_id":"32"},
{"answer_id":"359","answer_english":"Niwari ","answer_hindi":"à¤¨à¤¿à¤µà¤¾à¤¡à¤¼à¥€","parent_id":"20"},
{"answer_id":"611","answer_english":"Nizamabad","answer_hindi":"à¤¨à¤¿à¤œà¤¼à¤¾à¤®à¤¾à¤¬à¤¾à¤¦","parent_id":"32"},
{"answer_id":"458","answer_english":"Noklak","answer_hindi":"à¤¨à¥‹à¤•à¥à¤²à¤•","parent_id":"25"},
{"answer_id":"423","answer_english":"Noney","answer_hindi":"à¤¨à¥‹à¤¨à¥‡","parent_id":"22"},
{"answer_id":"736","answer_english":"North 24 Parganas","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° 24 à¤ªà¤°à¤—à¤¨à¤¾","parent_id":"36"},
{"answer_id":"15","answer_english":"North and Middle Andaman","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤”à¤° à¤®à¤§à¥à¤¯ à¤…à¤£à¥à¤¡à¤®à¤¾à¤¨ à¤œà¤¿à¤²à¤¾","parent_id":"2"},
{"answer_id":"149","answer_english":"North Delhi ","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"150","answer_english":"North East Delhi","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤ªà¥‚à¤°à¥à¤µà¥€ à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"435","answer_english":"North Garo Hills","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤—à¤¾à¤°à¥‹ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"157","answer_english":"North Goa","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤—à¥‹à¤µà¤¾","parent_id":"10"},
{"answer_id":"549","answer_english":"North Sikkim","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤¸à¤¿à¤•à¥à¤•à¤¿à¤®","parent_id":"30"},
{"answer_id":"626","answer_english":"North Tripura","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤¤à¥à¤°à¤¿à¤ªà¥à¤°à¤¾","parent_id":"33"},
{"answer_id":"151","answer_english":"North West Delhi","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤ªà¤¶à¥à¤šà¤¿à¤® à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"482","answer_english":"Nuapada","answer_hindi":"à¤¨à¥à¤†à¤ªà¤¡à¤¼à¤¾","parent_id":"26"},
{"answer_id":"205","answer_english":"Nuh","answer_hindi":"à¤¨à¥‚à¤¹Â ","parent_id":"12"},
{"answer_id":"395","answer_english":"Osmanabad","answer_hindi":"à¤‰à¤¸à¥à¤®à¤¾à¤¨à¤¾à¤¬à¤¾à¤¦","parent_id":"21"},
{"answer_id":"31","answer_english":"Pakke-Kessang","answer_hindi":"à¤ªà¤•à¥à¤•à¥‡ à¤•à¥‡à¤¸à¤¾à¤‚à¤—","parent_id":"3"},
{"answer_id":"267","answer_english":"Pakur","answer_hindi":"à¤ªà¤¾à¤•à¥à¤¡à¤¼","parent_id":"15"},
{"answer_id":"310","answer_english":"Palakkad","answer_hindi":"à¤ªà¤¾à¤²à¤•à¥à¤•à¤¾à¤¡à¤¼Â ","parent_id":"17"},
{"answer_id":"247","answer_english":"Palamu","answer_hindi":"à¤ªà¤²à¤¾à¤®à¥‚","parent_id":"15"},
{"answer_id":"396","answer_english":"Palghar","answer_hindi":"à¤ªà¤¾à¤²à¤˜à¤°","parent_id":"21"},
{"answer_id":"540","answer_english":"Pali","answer_hindi":"à¤ªà¤¾à¤²à¥€","parent_id":"29"},
{"answer_id":"206","answer_english":"Palwal","answer_hindi":"à¤ªà¤²à¤µà¤²","parent_id":"12"},
{"answer_id":"207","answer_english":"Panchkula","answer_hindi":"à¤ªà¤‚à¤šà¤•à¥à¤²à¤¾","parent_id":"12"},
{"answer_id":"182","answer_english":"Panchmahal","answer_hindi":"à¤ªà¤‚à¤šà¤®à¤¹à¤²","parent_id":"11"},
{"answer_id":"208","answer_english":"Panipat","answer_hindi":"à¤ªà¤¾à¤¨à¥€à¤ªà¤¤","parent_id":"12"},
{"answer_id":"356","answer_english":"Panna ","answer_hindi":"à¤ªà¤¨à¥à¤¨à¤¾","parent_id":"20"},
{"answer_id":"32","answer_english":"Papum Pare","answer_hindi":"à¤ªà¤ªà¥à¤®à¤ªà¤¾à¤°à¥‡","parent_id":"3"},
{"answer_id":"397","answer_english":"Parbhani","answer_hindi":"à¤ªà¤°à¤­à¤£à¥€","parent_id":"21"},
{"answer_id":"721","answer_english":"Paschim Bardhaman","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤®à¥€ à¤µà¤°à¥à¤§à¤®à¤¾à¤¨","parent_id":"36"},
{"answer_id":"737","answer_english":"Paschim Medinipur","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤®à¥‡à¤¦à¤¿à¤¨à¥€à¤ªà¥à¤°","parent_id":"36"},
{"answer_id":"183","answer_english":"Patan","answer_hindi":"à¤ªà¤¾à¤Ÿà¤¨","parent_id":"11"},
{"answer_id":"311","answer_english":"Pathanamthitta","answer_hindi":"à¤ªà¤¤à¤¨à¤®à¤¤à¤¿à¤Ÿà¥à¤Ÿà¤¾","parent_id":"17"},
{"answer_id":"508","answer_english":"Pathankot","answer_hindi":"à¤ªà¤ à¤¾à¤¨à¤•à¥‹à¤Ÿ","parent_id":"28"},
{"answer_id":"509","answer_english":"Patiala","answer_hindi":"à¤ªà¤Ÿà¤¿à¤¯à¤¾à¤²à¤¾","parent_id":"28"},
{"answer_id":"101","answer_english":"Patna","answer_hindi":"à¤ªà¤Ÿà¤¨à¤¾","parent_id":"5"},
{"answer_id":"713","answer_english":"Pauri Garhwal","answer_hindi":"à¤ªà¥Œà¤¡à¤¼à¥€ à¤—à¤¢à¤¼à¤µà¤¾à¤²","parent_id":"35"},
{"answer_id":"612","answer_english":"Peddapalli","answer_hindi":"à¤ªà¥‡à¤¦à¥à¤¦à¤ªà¤²à¥à¤²à¥‡","parent_id":"32"},
{"answer_id":"570","answer_english":"Perambalur","answer_hindi":"à¤ªà¥‡à¤°à¤®à¥à¤¬à¤²à¥à¤°","parent_id":"31"},
{"answer_id":"453","answer_english":"Peren","answer_hindi":"à¤ªà¥‡à¤°à¥‡à¤¨","parent_id":"25"},
{"answer_id":"454","answer_english":"Phek","answer_hindi":"à¤«à¥‡à¤•","parent_id":"25"},
{"answer_id":"424","answer_english":"Pherzawl","answer_hindi":"à¤«à¥‡à¤°à¤œà¤¼à¥Œà¤²Â ","parent_id":"22"},
{"answer_id":"690","answer_english":"Pilibhit","answer_hindi":"à¤ªà¥€à¤²à¥€à¤­à¥€à¤¤","parent_id":"34"},
{"answer_id":"714","answer_english":"Pithoragarh","answer_hindi":"à¤ªà¤¿à¤¥à¥Œà¤°à¤¾à¤—à¤¢à¤¼","parent_id":"35"},
{"answer_id":"237","answer_english":"Poonch","answer_hindi":"à¤ªà¥à¤‚à¤›","parent_id":"14"},
{"answer_id":"184","answer_english":"Porbandar","answer_hindi":"à¤ªà¥‹à¤°à¤¬à¤‚à¤¦à¤°","parent_id":"11"},
{"answer_id":"9","answer_english":"Prakasam","answer_hindi":"à¤ªà¥à¤°à¤•à¤¾à¤¶à¤®","parent_id":"1"},
{"answer_id":"541","answer_english":"Pratapgarh","answer_hindi":"à¤ªà¥à¤°à¤¤à¤¾à¤ªà¤—à¤¢à¤¼","parent_id":"29"},
{"answer_id":"691","answer_english":"Pratapgarh","answer_hindi":"à¤ªà¥à¤°à¤¤à¤¾à¤ªà¤—à¤¢","parent_id":"34"},
{"answer_id":"491","answer_english":"Puducherry","answer_hindi":"à¤ªà¥à¤¦à¥à¤šà¥‡à¤°à¥€","parent_id":"27"},
{"answer_id":"571","answer_english":"Pudukkottai","answer_hindi":"à¤ªà¥à¤¦à¥à¤•à¥‹à¤Ÿà¥à¤Ÿà¤ˆ","parent_id":"31"},
{"answer_id":"238","answer_english":"Pulwama","answer_hindi":"à¤ªà¥à¤²à¤µà¤¾à¤®à¤¾","parent_id":"14"},
{"answer_id":"398","answer_english":"Pune","answer_hindi":"à¤ªà¥à¤£à¥‡","parent_id":"21"},
{"answer_id":"722","answer_english":"Purba Bardhaman","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µ à¤¬à¤°à¥à¤§à¤®à¤¾à¤¨Â ","parent_id":"36"},
{"answer_id":"738","answer_english":"Purba Medinipur","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µ à¤®à¥‡à¤¦à¤¿à¤¨à¥€à¤ªà¥à¤°","parent_id":"36"},
{"answer_id":"484","answer_english":"Puri","answer_hindi":"à¤ªà¥à¤°à¥€","parent_id":"26"},
{"answer_id":"102","answer_english":"Purnia","answer_hindi":"à¤ªà¥‚à¤°à¥à¤£à¤¿à¤¯à¤¾","parent_id":"5"},
{"answer_id":"739","answer_english":"Purulia","answer_hindi":"à¤ªà¥à¤°à¥‚à¤²à¤¿à¤¯à¤¾","parent_id":"36"},
{"answer_id":"692","answer_english":"Raebareli","answer_hindi":"à¤°à¤¾à¤¯à¤¬à¤°à¥‡à¤²à¥€","parent_id":"34"},
{"answer_id":"293","answer_english":"Raichur","answer_hindi":"à¤°à¤¾à¤¯à¤šà¥‚à¤°","parent_id":"16"},
{"answer_id":"399","answer_english":"Raigad","answer_hindi":"à¤°à¤¾à¤¯à¤—à¤¡","parent_id":"21"},
{"answer_id":"137","answer_english":"Raigarh","answer_hindi":"à¤°à¤¾à¤¯à¤—à¤¢","parent_id":"7"},
{"answer_id":"138","answer_english":"Raipur","answer_hindi":"à¤°à¤¾à¤¯à¤ªà¥à¤°","parent_id":"7"},
{"answer_id":"319","answer_english":"Raisen","answer_hindi":"à¤°à¤¾à¤¯à¤¸à¥‡à¤¨","parent_id":"20"},
{"answer_id":"613","answer_english":"Rajanna Sircilla","answer_hindi":"à¤°à¤¾à¤œà¤¨à¥à¤¨à¤¾ à¤¸à¤¿à¤°à¤¸à¤¿à¤²à¥à¤²à¤¾","parent_id":"32"},
{"answer_id":"320","answer_english":"Rajgarh ","answer_hindi":"à¤°à¤¾à¤œà¤—à¤¢à¤¼","parent_id":"20"},
{"answer_id":"185","answer_english":"Rajkot","answer_hindi":"à¤°à¤¾à¤œà¤•à¥‹à¤Ÿ","parent_id":"11"},
{"answer_id":"139","answer_english":"Rajnandgaon","answer_hindi":"à¤°à¤¾à¤œà¤¨à¤¾à¤‚à¤¦à¤—à¤¾à¤‚à¤µ","parent_id":"7"},
{"answer_id":"239","answer_english":"Rajouri","answer_hindi":"à¤°à¤¾à¤œà¥Œà¤°à¥€","parent_id":"14"},
{"answer_id":"542","answer_english":"Rajsamand","answer_hindi":"à¤°à¤¾à¤œà¤¸à¤®à¤‚à¤¦","parent_id":"29"},
{"answer_id":"294","answer_english":"Ramanagara","answer_hindi":"à¤°à¤¾à¤®à¤¨à¤—à¤°","parent_id":"16"},
{"answer_id":"572","answer_english":"Ramanathapuram","answer_hindi":"à¤°à¤¾à¤®à¤¨à¤¾à¤¥à¤ªà¥à¤°à¤®","parent_id":"31"},
{"answer_id":"240","answer_english":"Ramban","answer_hindi":"à¤°à¤¾à¤®à¤¬à¤¨","parent_id":"14"},
{"answer_id":"253","answer_english":"Ramgarh","answer_hindi":"à¤°à¤¾à¤®à¤—à¤¢à¤¼","parent_id":"15"},
{"answer_id":"693","answer_english":"Rampur","answer_hindi":"à¤°à¤¾à¤®à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"259","answer_english":"Ranchi","answer_hindi":"à¤°à¤¾à¤à¤šà¥€","parent_id":"15"},
{"answer_id":"614","answer_english":"Ranga Reddy","answer_hindi":"à¤°à¤‚à¤—à¤¾à¤°à¥‡à¤¡à¥à¤¡à¥€","parent_id":"32"},
{"answer_id":"573","answer_english":"Ranipet","answer_hindi":"à¤°à¤¾à¤¨à¥€à¤ªà¥‡à¤Ÿ","parent_id":"31"},
{"answer_id":"367","answer_english":"Ratlam","answer_hindi":"à¤°à¤¤à¤²à¤¾à¤®","parent_id":"20"},
{"answer_id":"400","answer_english":"Ratnagiri","answer_hindi":"à¤°à¤¤à¥à¤¨à¤¾à¤—à¤¿à¤°à¥€","parent_id":"21"},
{"answer_id":"485","answer_english":"Rayagada","answer_hindi":"à¤°à¤¾à¤¯à¤—à¤¡à¤¼à¤¾","parent_id":"26"},
{"answer_id":"241","answer_english":"Reasi","answer_hindi":"à¤°à¤¿à¤¯à¤¾à¤¸à¥€","parent_id":"14"},
{"answer_id":"350","answer_english":"Rewa ","answer_hindi":"à¤°à¥€à¤µà¤¾","parent_id":"20"},
{"answer_id":"209","answer_english":"Rewari","answer_hindi":"à¤°à¥‡à¤µà¤¾à¤¡à¤¼à¥€","parent_id":"12"},
{"answer_id":"430","answer_english":"Ri Bhoi","answer_hindi":"à¤°à¥€ à¤­à¥‹à¤ˆ","parent_id":"23"},
{"answer_id":"210","answer_english":"Rohtak","answer_hindi":"à¤°à¥‹à¤¹à¤¤à¤•","parent_id":"12"},
{"answer_id":"103","answer_english":"Rohtas","answer_hindi":"à¤°à¥‹à¤¹à¤¤à¤¾à¤¸","parent_id":"5"},
{"answer_id":"715","answer_english":"Rudraprayag","answer_hindi":"à¤°à¥à¤¦à¥à¤°à¤ªà¥à¤°à¤¯à¤¾à¤—","parent_id":"35"},
{"answer_id":"510","answer_english":"Rupnagar","answer_hindi":"à¤°à¥‚à¤ªà¤¨à¤—à¤°","parent_id":"28"},
{"answer_id":"186","answer_english":"Sabarkantha","answer_hindi":"à¤¸à¤¾à¤¬à¤°à¤•à¤¾à¤‚à¤ à¤¾","parent_id":"11"},
{"answer_id":"357","answer_english":"Sagar ","answer_hindi":"à¤¸à¤¾à¤—à¤°","parent_id":"20"},
{"answer_id":"694","answer_english":"Saharanpur","answer_hindi":"à¤¸à¤¹à¤¾à¤°à¤¨à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"104","answer_english":"Saharsa","answer_hindi":"à¤¸à¤¹à¤°à¤¸à¤¾","parent_id":"5"},
{"answer_id":"269","answer_english":"Sahebganj","answer_hindi":"à¤¸à¤¾à¤¹à¤¿à¤¬à¤—à¤‚à¤œ","parent_id":"15"},
{"answer_id":"511","answer_english":"Sahibzada Ajit Singh Nagar","answer_hindi":"à¤®à¥‹à¤¹à¤¾à¤²à¥€\/ à¤¸à¤¾à¤¹à¤¿à¤¬à¤œà¤¾à¤¦à¤¾ à¤…à¤œà¥€à¤¤ à¤¸à¤¿à¤‚à¤¹ à¤¨à¤—à¤°","parent_id":"28"},
{"answer_id":"441","answer_english":"Saiha","answer_hindi":"à¤¸à¤‡à¤¹à¤¾","parent_id":"24"},
{"answer_id":"446","answer_english":"Saitual","answer_hindi":"à¤¸à¤‡à¤¤à¥à¤†à¤²","parent_id":"24"},
{"answer_id":"574","answer_english":"Salem","answer_hindi":"à¤¸à¥‡à¤²à¤®","parent_id":"31"},
{"answer_id":"105","answer_english":"Samastipur","answer_hindi":"à¤¸à¤®à¤¸à¥à¤¤à¥€à¤ªà¥à¤°","parent_id":"5"},
{"answer_id":"242","answer_english":"Samba","answer_hindi":"à¤¸à¤¾à¤‚à¤¬à¤¾","parent_id":"14"},
{"answer_id":"486","answer_english":"Sambalpur","answer_hindi":"à¤¸à¤®à¥à¤¬à¤²à¤ªà¥à¤°","parent_id":"26"},
{"answer_id":"695","answer_english":"Sambhal","answer_hindi":"à¤¸à¤®à¥à¤­à¤²","parent_id":"34"},
{"answer_id":"615","answer_english":"Sangareddy","answer_hindi":"à¤¸à¤‚à¤—à¤¾à¤°à¥‡à¤¡à¥à¤¡à¥€","parent_id":"32"},
{"answer_id":"401","answer_english":"Sangli","answer_hindi":"à¤¸à¤¾à¤‚à¤—à¤²à¥€","parent_id":"21"},
{"answer_id":"512","answer_english":"Sangrur","answer_hindi":"à¤¸à¤‚à¤—à¤°à¥‚à¤°","parent_id":"28"},
{"answer_id":"696","answer_english":"Sant Kabir Nagar","answer_hindi":"à¤¸à¤‚à¤¤ à¤•à¤¬à¥€à¤°à¤¨à¤—à¤°","parent_id":"34"},
{"answer_id":"262","answer_english":"Saraikela Kharsawan","answer_hindi":"à¤¸à¤°à¤¾à¤‡à¤•à¥‡à¤²à¤¾ à¤–à¤°à¤¸à¤¾à¤µà¤¾à¤","parent_id":"15"},
{"answer_id":"106","answer_english":"Saran","answer_hindi":"à¤¸à¤¾à¤°à¤¨","parent_id":"5"},
{"answer_id":"402","answer_english":"Satara","answer_hindi":"à¤¸à¤¾à¤¤à¤¾à¤°à¤¾","parent_id":"21"},
{"answer_id":"351","answer_english":"Satna ","answer_hindi":"à¤¸à¤¤à¤¨à¤¾","parent_id":"20"},
{"answer_id":"544","answer_english":"Sawai Madhopur","answer_hindi":"à¤¸à¤µà¤¾à¤ˆ à¤®à¤¾à¤§à¥‹à¤ªà¥à¤°","parent_id":"29"},
{"answer_id":"321","answer_english":"Sehore ","answer_hindi":"à¤¸à¥€à¤¹à¥‹à¤°","parent_id":"20"},
{"answer_id":"413","answer_english":"Senapati","answer_hindi":"à¤¸à¥‡à¤¨à¤¾à¤ªà¤¤à¤¿ à¤œà¤¿à¤²à¤¾","parent_id":"22"},
{"answer_id":"345","answer_english":"Seoni ","answer_hindi":"à¤¸à¤¿à¤µà¤¨à¥€Â ","parent_id":"20"},
{"answer_id":"442","answer_english":"Serchhip","answer_hindi":"à¤¸à¥‡à¤°à¤›à¤¿à¤ª","parent_id":"24"},
{"answer_id":"152","answer_english":"Shahdara","answer_hindi":"à¤¶à¤¾à¤¹à¤¦à¤°à¤¾","parent_id":"9"},
{"answer_id":"361","answer_english":"Shahdol ","answer_hindi":"à¤¶à¤¹à¤¡à¥‹à¤²","parent_id":"20"},
{"answer_id":"513","answer_english":"Shahid Bhagat Singh Nagar","answer_hindi":"à¤¶à¤¹à¥€à¤¦ à¤­à¤—à¤¤à¤¸à¤¿à¤‚à¤¹à¤¨à¤—à¤°","parent_id":"28"},
{"answer_id":"697","answer_english":"Shahjahanpur","answer_hindi":"à¤¶à¤¾à¤¹à¤œà¤¹à¤¾à¤à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"368","answer_english":"Shajapur","answer_hindi":"à¤¶à¤¾à¤œà¤¾à¤ªà¥à¤°","parent_id":"20"},
{"answer_id":"698","answer_english":"Shamli","answer_hindi":"à¤¶à¤¾à¤®à¤²à¥€","parent_id":"34"},
{"answer_id":"107","answer_english":"Sheikhpura","answer_hindi":"à¤¶à¥‡à¤–à¤ªà¥à¤°à¤¾","parent_id":"5"},
{"answer_id":"108","answer_english":"Sheohar","answer_hindi":"à¤¶à¤¿à¤µà¤¹à¤°","parent_id":"5"},
{"answer_id":"324","answer_english":"Sheopur ","answer_hindi":"à¤¶à¥à¤¯à¥‹à¤ªà¥à¤°","parent_id":"20"},
{"answer_id":"33","answer_english":"Shi Yomi","answer_hindi":"à¤¶à¤¿à¤“à¤®à¥€","parent_id":"3"},
{"answer_id":"222","answer_english":"Shimla","answer_hindi":"à¤¶à¤¿à¤®à¤²à¤¾","parent_id":"13"},
{"answer_id":"295","answer_english":"Shimoga","answer_hindi":"à¤¶à¤¿à¤®à¥‹à¤—à¤¾","parent_id":"16"},
{"answer_id":"328","answer_english":"Shivpuri ","answer_hindi":"à¤¶à¤¿à¤µà¤ªà¥à¤°à¥€","parent_id":"20"},
{"answer_id":"243","answer_english":"Shopian","answer_hindi":"à¤¶à¥‹à¤ªà¤¿à¤¯à¤¾à¤‚","parent_id":"14"},
{"answer_id":"699","answer_english":"Shravasti","answer_hindi":"à¤¶à¥à¤°à¤¾à¤µà¤¸à¥à¤¤à¥€","parent_id":"34"},
{"answer_id":"34","answer_english":"Siang","answer_hindi":"à¤¸à¤¿à¤¯à¤¾à¤‚à¤—","parent_id":"3"},
{"answer_id":"700","answer_english":"Siddharthnagar","answer_hindi":"à¤¸à¤¿à¤¦à¥à¤§à¤¾à¤°à¥à¤¥à¤¨à¤—à¤°","parent_id":"34"},
{"answer_id":"616","answer_english":"Siddipet","answer_hindi":"à¤¸à¤¿à¤¦à¥à¤¦à¤¿à¤ªà¥‡à¤Ÿ","parent_id":"32"},
{"answer_id":"352","answer_english":"Sidhi ","answer_hindi":"à¤¸à¥€à¤§à¥€","parent_id":"20"},
{"answer_id":"543","answer_english":"Sikar","answer_hindi":"à¤¸à¥€à¤•à¤°","parent_id":"29"},
{"answer_id":"258","answer_english":"Simdega","answer_hindi":"à¤¸à¤¿à¤®à¤¡à¥‡à¤—à¤¾","parent_id":"15"},
{"answer_id":"403","answer_english":"Sindhudurg","answer_hindi":"à¤¸à¤¿à¤‚à¤§à¥à¤¦à¥à¤°à¥à¤—","parent_id":"21"},
{"answer_id":"353","answer_english":"Singrauli ","answer_hindi":"à¤¸à¤¿à¤‚à¤—à¤°à¥Œà¤²à¥€","parent_id":"20"},
{"answer_id":"627","answer_english":"Sipahijala","answer_hindi":"à¤¸à¤¿à¤ªà¤¾à¤¹à¥€à¤œà¤¾à¤²à¤¾","parent_id":"33"},
{"answer_id":"223","answer_english":"Sirmaur","answer_hindi":"à¤¸à¤¿à¤°à¤®à¥Œà¤°","parent_id":"13"},
{"answer_id":"545","answer_english":"Sirohi","answer_hindi":"à¤¸à¤¿à¤°à¥‹à¤¹à¥€","parent_id":"29"},
{"answer_id":"211","answer_english":"Sirsa","answer_hindi":"à¤¸à¤¿à¤°à¤¸à¤¾","parent_id":"12"},
{"answer_id":"109","answer_english":"Sitamarhi","answer_hindi":"à¤¸à¥€à¤¤à¤¾à¤®à¤¢à¤¼à¥€","parent_id":"5"},
{"answer_id":"701","answer_english":"Sitapur","answer_hindi":"à¤¸à¥€à¤¤à¤¾à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"575","answer_english":"Sivaganga","answer_hindi":"à¤¶à¤¿à¤µà¤—à¤‚à¤—à¤¾","parent_id":"31"},
{"answer_id":"70","answer_english":"Sivasagar","answer_hindi":"à¤¶à¤¿à¤µà¤¸à¤¾à¤—à¤°","parent_id":"4"},
{"answer_id":"110","answer_english":"Siwan","answer_hindi":"à¤¸à¥€à¤µà¤¾à¤¨","parent_id":"5"},
{"answer_id":"224","answer_english":"Solan","answer_hindi":"à¤¸à¥‹à¤²à¤¨","parent_id":"13"},
{"answer_id":"404","answer_english":"Solapur","answer_hindi":"à¤¸à¥‹à¤²à¤¾à¤ªà¥à¤°","parent_id":"21"},
{"answer_id":"702","answer_english":"Sonbhadra","answer_hindi":"à¤¸à¥‹à¤¨à¤­à¤¦à¥à¤°","parent_id":"34"},
{"answer_id":"212","answer_english":"Sonipat","answer_hindi":"à¤¸à¥‹à¤¨à¥€à¤ªà¤¤","parent_id":"12"},
{"answer_id":"71","answer_english":"Sonitpur","answer_hindi":"à¤¶à¥‹à¤£à¤¿à¤¤à¤ªà¥à¤°","parent_id":"4"},
{"answer_id":"740","answer_english":"South 24 Parganas","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ 24 à¤ªà¤°à¤—à¤¨à¤¾","parent_id":"36"},
{"answer_id":"16","answer_english":"South Andaman","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤…à¤£à¥à¤¡à¤®à¤¾à¤¨","parent_id":"2"},
{"answer_id":"153","answer_english":"South Delhi ","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"154","answer_english":"South East Delhi","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤ªà¥‚à¤°à¥à¤µà¥€ à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"431","answer_english":"South Garo Hills","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤—à¤¾à¤°à¥‹ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"158","answer_english":"South Goa","answer_hindi":"Â à¤¦à¤•à¥à¤·à¤¿à¤£ à¤—à¥‹à¤µà¤¾","parent_id":"10"},
{"answer_id":"72","answer_english":"South Salmara-Mankachar","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤¸à¤¾à¤²à¤®à¤¾à¤°à¤¾-à¤®à¤¨à¤•à¤¾à¤šà¤°","parent_id":"4"},
{"answer_id":"550","answer_english":"South Sikkim","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£Â à¤¸à¤¿à¤•à¥à¤•à¤¿à¤®","parent_id":"30"},
{"answer_id":"624","answer_english":"South Tripura","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤¤à¥à¤°à¤¿à¤ªà¥à¤°à¤¾","parent_id":"33"},
{"answer_id":"155","answer_english":"South West Delhi","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤ªà¤¶à¥à¤šà¤¿à¤® à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"432","answer_english":"South West Garo Hills","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤ªà¤¶à¥à¤šà¤¿à¤® à¤—à¤¾à¤°à¥‹ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"433","answer_english":"South West Khasi Hills","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤ªà¤¶à¥à¤šà¤¿à¤® à¤–à¤¾à¤¸à¥€ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"507","answer_english":"Sri Muktsar Sahib","answer_hindi":"à¤®à¥à¤•à¥à¤¤à¤¸à¤°","parent_id":"28"},
{"answer_id":"10","answer_english":"Srikakulam","answer_hindi":"à¤¶à¥à¤°à¥€à¤•à¤¾à¤•à¥à¤²à¤®","parent_id":"1"},
{"answer_id":"244","answer_english":"Srinagar","answer_hindi":"à¤¶à¥à¤°à¥€à¤¨à¤—à¤°","parent_id":"14"},
{"answer_id":"487","answer_english":"Subarnapur(Sonepur)","answer_hindi":"à¤¸à¥à¤¬à¤°à¥à¤£à¤ªà¥à¤° (à¤¸à¥‹à¤¨à¤ªà¥à¤°)","parent_id":"26"},
{"answer_id":"140","answer_english":"Sukma","answer_hindi":"à¤¸à¥à¤•à¤®à¤¾","parent_id":"7"},
{"answer_id":"703","answer_english":"Sultanpur","answer_hindi":"à¤¸à¥à¤²à¥à¤¤à¤¾à¤¨à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"488","answer_english":"Sundargarh","answer_hindi":"à¤¸à¥à¤¨à¥à¤¦à¤°à¤—à¤¡à¤¼","parent_id":"26"},
{"answer_id":"111","answer_english":"Supaul","answer_hindi":"à¤¸à¥à¤ªà¥Œà¤²","parent_id":"5"},
{"answer_id":"141","answer_english":"Surajpur","answer_hindi":"à¤¸à¥‚à¤°à¤œà¤ªà¥à¤°","parent_id":"7"},
{"answer_id":"187","answer_english":"Surat","answer_hindi":"à¤¸à¥‚à¤°à¤¤","parent_id":"11"},
{"answer_id":"188","answer_english":"Surendranagar","answer_hindi":"à¤¸à¥à¤°à¥‡à¤‚à¤¦à¥à¤°à¤¨à¤—à¤°","parent_id":"11"},
{"answer_id":"142","answer_english":"Surguja","answer_hindi":"à¤¸à¤°à¤—à¥à¤œà¤¾","parent_id":"7"},
{"answer_id":"617","answer_english":"Suryapet","answer_hindi":"à¤¸à¥‚à¤°à¥à¤¯à¤¾à¤ªà¥‡à¤Ÿ","parent_id":"32"},
{"answer_id":"417","answer_english":"Tamenglong","answer_hindi":"à¤¤à¤®à¥‡à¤‚à¤—à¤²à¥‰à¤¨à¥à¤— à¤œà¤¿à¤²à¤¾","parent_id":"22"},
{"answer_id":"189","answer_english":"Tapi","answer_hindi":"à¤¤à¤¾à¤ªà¥€","parent_id":"11"},
{"answer_id":"514","answer_english":"Tarn Taran","answer_hindi":"à¤¤à¤°à¤¨ à¤¤à¤¾à¤°à¤¨ à¤¸à¤¾à¤¹à¤¿à¤¬","parent_id":"28"},
{"answer_id":"35","answer_english":"Tawang","answer_hindi":"à¤¤à¤µà¤¾à¤‚à¤—","parent_id":"3"},
{"answer_id":"716","answer_english":"Tehri Garhwal","answer_hindi":"à¤Ÿà¤¿à¤¹à¤°à¥€ à¤—à¤¢à¤¼à¤µà¤¾à¤²","parent_id":"35"},
{"answer_id":"421","answer_english":"Tengnoupal","answer_hindi":"à¤¤à¥‡à¤‚à¤—à¤¨à¥‹à¤‰à¤ªà¤²Â ","parent_id":"22"},
{"answer_id":"576","answer_english":"Tenkasi","answer_hindi":"à¤¤à¥‡à¤¨à¤•à¤¾à¤¶à¥€","parent_id":"31"},
{"answer_id":"405","answer_english":"Thane","answer_hindi":"à¤ à¤¾à¤£à¥‡","parent_id":"21"},
{"answer_id":"581","answer_english":"Thanjavur","answer_hindi":"à¤¤à¤‚à¤œà¤¾à¤µà¥à¤°","parent_id":"31"},
{"answer_id":"579","answer_english":"Theni","answer_hindi":"à¤¤à¥‡à¤¨à¥€","parent_id":"31"},
{"answer_id":"312","answer_english":"Thiruvananthapuram","answer_hindi":"à¤¤à¤¿à¤°à¥à¤µà¤¨à¤¨à¥à¤¤à¤ªà¥à¤°à¤®Â ","parent_id":"17"},
{"answer_id":"582","answer_english":"Thoothukudi","answer_hindi":"à¤¤à¥‚à¤¤à¥à¤•à¥à¤¡à¤¼à¥€","parent_id":"31"},
{"answer_id":"410","answer_english":"Thoubal","answer_hindi":"à¤¥à¥Œà¤¬à¤² à¤œà¤¿à¤²à¤¾","parent_id":"22"},
{"answer_id":"313","answer_english":"Thrissur","answer_hindi":"à¤¤à¥à¤°à¤¿à¤¸à¥à¤¸à¥‚à¤°Â ","parent_id":"17"},
{"answer_id":"358","answer_english":"Tikamgarh ","answer_hindi":"à¤Ÿà¥€à¤•à¤®à¤—à¤¢à¤¼","parent_id":"20"},
{"answer_id":"73","answer_english":"Tinsukia","answer_hindi":"à¤¤à¤¿à¤¨à¤¸à¥à¤•à¤¿à¤¯à¤¾","parent_id":"4"},
{"answer_id":"36","answer_english":"Tirap","answer_hindi":"à¤¤à¤¿à¤°à¤¾à¤ª","parent_id":"3"},
{"answer_id":"578","answer_english":"Tiruchirappalli","answer_hindi":"à¤¤à¤¿à¤°à¥à¤šà¤¿à¤°à¤¾à¤ªà¤²à¥à¤²à¥€","parent_id":"31"},
{"answer_id":"580","answer_english":"Tirunelveli","answer_hindi":"à¤¤à¤¿à¤°à¥‚à¤¨à¥‡à¤²à¤µà¥‡à¤²à¥€","parent_id":"31"},
{"answer_id":"583","answer_english":"Tirupattur","answer_hindi":"à¤¤à¤¿à¤°à¥à¤ªà¤¤à¥à¤¤à¥à¤°","parent_id":"31"},
{"answer_id":"577","answer_english":"Tirupur","answer_hindi":"à¤¤à¤¿à¤°à¥à¤ªà¥à¤°","parent_id":"31"},
{"answer_id":"584","answer_english":"Tiruvallur","answer_hindi":"à¤¤à¤¿à¤°à¥à¤µà¤²à¥à¤²à¥à¤°","parent_id":"31"},
{"answer_id":"586","answer_english":"Tiruvannamalai","answer_hindi":"à¤¤à¤¿à¤°à¥à¤µà¤¨à¥à¤¨à¤¾à¤®à¤²à¤ˆ","parent_id":"31"},
{"answer_id":"585","answer_english":"Tiruvarur","answer_hindi":"à¤¤à¤¿à¤°à¥à¤µà¤¾à¤°à¥à¤°","parent_id":"31"},
{"answer_id":"546","answer_english":"Tonk","answer_hindi":"à¤Ÿà¥‹à¤‚à¤•","parent_id":"29"},
{"answer_id":"455","answer_english":"Tuensang","answer_hindi":"à¤Ÿà¥à¤µà¥‡à¤¨à¤¸à¤¾à¤‚à¤—","parent_id":"25"},
{"answer_id":"296","answer_english":"Tumkur","answer_hindi":"à¤¤à¥à¤®à¤•à¥‚à¤°","parent_id":"16"},
{"answer_id":"547","answer_english":"Udaipur","answer_hindi":"à¤‰à¤¦à¤¯à¤ªà¥à¤°","parent_id":"29"},
{"answer_id":"74","answer_english":"Udalguri","answer_hindi":"à¤‰à¤¦à¤²à¤—à¥à¤¡à¤¼à¥€","parent_id":"4"},
{"answer_id":"717","answer_english":"Udham Singh Nagar","answer_hindi":"à¤‰à¤§à¤®à¤¸à¤¿à¤‚à¤¹ à¤¨à¤—à¤°","parent_id":"35"},
{"answer_id":"245","answer_english":"Udhampur","answer_hindi":"à¤‰à¤§à¤®à¤ªà¥à¤°","parent_id":"14"},
{"answer_id":"297","answer_english":"Udupi","answer_hindi":"à¤‰à¤¡à¥à¤ªà¥€","parent_id":"16"},
{"answer_id":"369","answer_english":"Ujjain","answer_hindi":"à¤‰à¤œà¥à¤œà¥ˆà¤¨","parent_id":"20"},
{"answer_id":"414","answer_english":"Ukhrul","answer_hindi":"à¤‰à¤–à¤°à¥à¤² à¤œà¤¿à¤²à¤¾","parent_id":"22"},
{"answer_id":"362","answer_english":"Umaria ","answer_hindi":"à¤‰à¤®à¤°à¤¿à¤¯à¤¾","parent_id":"20"},
{"answer_id":"225","answer_english":"Una","answer_hindi":"à¤‰à¤¨à¤¾","parent_id":"13"},
{"answer_id":"630","answer_english":"Unakoti","answer_hindi":"à¤‰à¤¨à¤¾à¤•à¥‹à¤Ÿà¥€","parent_id":"33"},
{"answer_id":"704","answer_english":"Unnao","answer_hindi":"à¤‰à¤¨à¥à¤¨à¤¾à¤µ","parent_id":"34"},
{"answer_id":"37","answer_english":"Upper Dibang Valley","answer_hindi":"à¤Šà¤ªà¤°à¥€ à¤¦à¤¿à¤¬à¤¾à¤‚à¤— à¤˜à¤¾à¤Ÿà¥€","parent_id":"3"},
{"answer_id":"38","answer_english":"Upper Siang","answer_hindi":"à¤Šà¤ªà¤°à¥€ à¤¸à¤¿à¤¯à¤¾à¤‚à¤—","parent_id":"3"},
{"answer_id":"39","answer_english":"Upper Subansiri","answer_hindi":"à¤Šà¤ªà¤°à¥€ à¤¸à¥à¤¬à¤¨à¤¸à¤¿à¤°à¥€","parent_id":"3"},
{"answer_id":"741","answer_english":"Uttar Dinajpur","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤¦à¤¿à¤¨à¤¾à¤œà¤ªà¥à¤°","parent_id":"36"},
{"answer_id":"298","answer_english":"Uttara Kannada","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤•à¤¨à¥à¤¨à¤¡à¤¼","parent_id":"16"},
{"answer_id":"718","answer_english":"Uttarkashi","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤°à¤•à¤¾à¤¶à¥€","parent_id":"35"},
{"answer_id":"190","answer_english":"Vadodara","answer_hindi":"à¤µà¥œà¥‹à¤¦à¤°à¤¾","parent_id":"11"},
{"answer_id":"112","answer_english":"Vaishali","answer_hindi":"à¤µà¥ˆà¤¶à¤¾à¤²à¥€","parent_id":"5"},
{"answer_id":"191","answer_english":"Valsad","answer_hindi":"à¤µà¤²à¤¸à¤¾à¤¡","parent_id":"11"},
{"answer_id":"705","answer_english":"Varanasi","answer_hindi":"à¤µà¤¾à¤°à¤¾à¤£à¤¸à¥€","parent_id":"34"},
{"answer_id":"587","answer_english":"Vellore","answer_hindi":"à¤µà¥‡à¤²à¥à¤²à¥‚à¤°","parent_id":"31"},
{"answer_id":"322","answer_english":"Vidisha ","answer_hindi":"à¤µà¤¿à¤¦à¤¿à¤¶à¤¾","parent_id":"20"},
{"answer_id":"299","answer_english":"Vijayanagara","answer_hindi":"à¤µà¤¿à¤œà¤¯à¤¨à¤—à¤°","parent_id":"16"},
{"answer_id":"618","answer_english":"Vikarabad","answer_hindi":"à¤µà¤¿à¤•à¤¼à¤¾à¤°à¤¾à¤¬à¤¾à¤¦","parent_id":"32"},
{"answer_id":"588","answer_english":"Viluppuram","answer_hindi":"à¤µà¤¿à¤²à¥à¤ªà¥à¤ªà¥à¤°à¤®","parent_id":"31"},
{"answer_id":"589","answer_english":"Virudhunagar","answer_hindi":"à¤µà¤¿à¤°à¥à¤§à¥à¤¨à¤—à¤°","parent_id":"31"},
{"answer_id":"11","answer_english":"Visakhapatnam","answer_hindi":"à¤µà¤¿à¤¶à¤¾à¤–à¤¾à¤ªà¤Ÿà¥à¤Ÿà¤¨à¤®","parent_id":"1"},
{"answer_id":"12","answer_english":"Vizianagaram","answer_hindi":"à¤µà¤¿à¤œà¤¯à¤¨à¤—à¤°à¤®","parent_id":"1"},
{"answer_id":"619","answer_english":"Wanaparthy","answer_hindi":"à¤µà¤¾à¤¨à¤ªà¤°à¥à¤¤à¤¿","parent_id":"32"},
{"answer_id":"621","answer_english":"Warangal Rural","answer_hindi":"à¤µà¤°à¤‚à¤—à¤² à¤—à¥à¤°à¤¾à¤®à¥€à¤£","parent_id":"32"},
{"answer_id":"620","answer_english":"Warangal Urban","answer_hindi":"à¤µà¤¾à¤°à¤‚à¤—à¤² à¤…à¤°à¥à¤¬à¤¨","parent_id":"32"},
{"answer_id":"406","answer_english":"Wardha","answer_hindi":"à¤µà¤°à¥à¤§à¤¾","parent_id":"21"},
{"answer_id":"407","answer_english":"Washim","answer_hindi":"à¤µà¤¾à¤¶à¥€à¤®","parent_id":"21"},
{"answer_id":"314","answer_english":"Wayanad","answer_hindi":"à¤µà¤¾à¤¯à¤¨à¤¾à¤¡Â ","parent_id":"17"},
{"answer_id":"113","answer_english":"West Champaran","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤®à¥€ à¤šà¤®à¥à¤ªà¤¾à¤°à¤£ à¤œà¤¿à¤²à¤¾","parent_id":"5"},
{"answer_id":"156","answer_english":"West Delhi","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"426","answer_english":"West Garo Hills","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤—à¤¾à¤°à¥‹ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"13","answer_english":"West Godavari","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤—à¥‹à¤¦à¤¾à¤µà¤°à¥€","parent_id":"1"},
{"answer_id":"427","answer_english":"West Jaintia Hills","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤œà¤¯à¤‚à¤¤à¤¿à¤¯à¤¾ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"40","answer_english":"West Kameng","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤•à¤®à¥‡à¤‚à¤—","parent_id":"3"},
{"answer_id":"75","answer_english":"West Karbi Anglong","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤•à¤¾à¤°à¥à¤¬à¥€ à¤†à¤‚à¤—à¤²à¥‹à¤‚à¤—","parent_id":"4"},
{"answer_id":"428","answer_english":"West Khasi Hills","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤–à¤¾à¤¸à¥€ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"41","answer_english":"West Siang","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤¸à¤¿à¤¯à¤¾à¤‚à¤—","parent_id":"3"},
{"answer_id":"551","answer_english":"West Sikkim","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤®Â à¤¸à¤¿à¤•à¥à¤•à¤¿à¤®","parent_id":"30"},
{"answer_id":"261","answer_english":"West Singhbhum","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤®à¥€ à¤¸à¤¿à¤‚à¤¹à¤­à¥‚à¤® ","parent_id":"15"},
{"answer_id":"629","answer_english":"West Tripura","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤¤à¥à¤°à¤¿à¤ªà¥à¤°à¤¾","parent_id":"33"},
{"answer_id":"456","answer_english":"Wokha","answer_hindi":"à¤µà¥‹à¤–à¤¾","parent_id":"25"},
{"answer_id":"622","answer_english":"Yadadri Bhuvanagiri","answer_hindi":"à¤¯à¤¾à¤¦à¤¾à¤¦à¥à¤°à¥€ à¤­à¥à¤µà¤¨à¤—à¤¿à¤°à¥€","parent_id":"32"},
{"answer_id":"300","answer_english":"Yadgir","answer_hindi":"à¤¯à¤¾à¤¦à¤—à¥€à¤°","parent_id":"16"},
{"answer_id":"213","answer_english":"Yamuna Nagar","answer_hindi":"à¤¯à¤®à¥à¤¨à¤¾à¤¨à¤—à¤°","parent_id":"12"},
{"answer_id":"492","answer_english":"Yanam","answer_hindi":"à¤¯à¤¾à¤¨à¤®","parent_id":"27"},
{"answer_id":"408","answer_english":"Yavatmal","answer_hindi":"à¤¯à¤µà¤¤à¤®à¤¾à¤³","parent_id":"21"},
{"answer_id":"457","answer_english":"Zunheboto","answer_hindi":"à¤œà¤¼à¥à¤¨à¥à¤¹à¥‡à¤¬à¥‹à¤Ÿà¥‹","parent_id":"25"}
                    ],
                answer : "",
            },
            {
                name : "pincode",
                question_id : 14,
                question_english : "Please enter your PIN code",
                question_hindi : "à¤œà¥€ à¤•à¥ƒà¤ªà¤¯à¤¾ à¤…à¤ªà¤¨à¤¾ à¤ªà¤¿à¤¨ à¤•à¥‹à¤¡ à¤¦à¤°à¥à¤œ à¤•à¤°à¥‡à¤‚",
                question_type : "number",
                max_length : 6,
                is_skip : false,
                is_answered : false,
                answers : [],
                answer : "",
            },
            {
                name : "qualification",
                question_id : 15,
                question_english : "What is your educational qualification?",
                question_hindi : "à¤†à¤ªà¤•à¥€ à¤¶à¥ˆà¤•à¥à¤·à¤£à¤¿à¤• à¤¯à¥‹à¤—à¥à¤¯à¤¤à¤¾ à¤•à¥à¤¯à¤¾ à¤¹à¥ˆ?",
                question_type : "selection",
                is_answered : false,
                is_skip : false,
                answers : [
                    {"answer_id":"1","answer_english":"School","answer_hindi":"à¤¸à¥à¤•à¥‚à¤²"},
                    {"answer_id":"2","answer_english":"Graduate","answer_hindi":"à¤—à¥à¤°à¥‡à¤œà¥à¤à¤Ÿ"},
                    {"answer_id":"3","answer_english":"Post graduate","answer_hindi":"à¤ªà¥‹à¤¸à¥à¤Ÿ à¤—à¥à¤°à¥‡à¤œà¥à¤à¤Ÿ"},
                    {"answer_id":"4","answer_english":"PhD","answer_hindi":"à¤ªà¥€à¤à¤šà¤¡à¥€"},
                ],
                answer : "",
            },
            {
                name : "profession",
                question_id : 16,
                question_english : "What is your occupational / employment status?",
                question_hindi : "à¤†à¤ªà¤•à¥€  à¤µà¥à¤¯à¤µà¤¸à¤¾à¤¯à¤¿à¤• / à¤°à¥‹à¤œà¤—à¤¾à¤° à¤¸à¥à¤¥à¤¿à¤¤à¤¿ à¤•à¥à¤¯à¤¾ à¤¹à¥ˆ?",
                question_type : "selection",
                is_answered : false,
                is_skip : false,
                answers : [
                    {"answer_id":"1","answer_english":"Student","answer_hindi":"à¤›à¤¾à¤¤à¥à¤°"},
                    {"answer_id":"2","answer_english":"Self Employed/ Business","answer_hindi":"à¤¸à¥à¤µ - à¤°à¥‹à¤œà¤—à¤¾à¤° / à¤µà¥à¤¯à¤¾à¤ªà¤¾à¤°"},
                    {"answer_id":"3","answer_english":"Private Service","answer_hindi":"à¤ªà¥à¤°à¤¾à¤‡à¤µà¥‡à¤Ÿ à¤¸à¤°à¥à¤µà¤¿à¤¸"},
                    {"answer_id":"4","answer_english":"Govt/ Semi Government","answer_hindi":"à¤¸à¤°à¤•à¤¾à¤°à¥€ / à¤…à¤°à¥à¤§ à¤¸à¤°à¤•à¤¾à¤°à¥€ à¤¸à¥‡à¤µà¤¾"},
                    {"answer_id":"5","answer_english":"NGO","answer_hindi":"à¤à¤¨à¤œà¥€à¤“"},
                    {"answer_id":"6","answer_english":"Other","answer_hindi":"à¤…à¤¨à¥à¤¯"}
                ],
                answer : "",
            },
            // {
            //     name : "interested_position",
            //     question_id : 17,
            //     question_english : "At what level would you like to work on?",
            //     question_hindi : "à¤†à¤ª à¤•à¤¿à¤¸ à¤¸à¥à¤¤à¤° à¤ªà¤° à¤•à¤¾à¤® à¤•à¤°à¤¨à¤¾ à¤šà¤¾à¤¹à¥‡à¤‚à¤—à¥‡?",
            //     question_type : "selection",
            //     max_length : 15,
            //     is_skip : false,
            //     is_answered : false,
            //     answers : [
            //         {"answer_id":"1","answer_english":"National","answer_hindi":"à¤°à¤¾à¤·à¥à¤Ÿà¥à¤°à¥€à¤¯"},
            //         {"answer_id":"2","answer_english":"State","answer_hindi":"à¤°à¤¾à¤œà¥à¤¯"},
            //         {"answer_id":"3","answer_english":"District","answer_hindi":"à¤œà¤¿à¤²à¤¾"},
            //     ],
            //     answer : "",
            // },
            {
                name : "prefered_working_hours",
                question_id : 18,
                question_english : "How many hours per day are you willing to devote to working with the Congress social media team?",
                question_hindi : "à¤†à¤ª à¤ªà¥à¤°à¤¤à¤¿ à¤¦à¤¿à¤¨ à¤•à¤¿à¤¤à¤¨à¥‡ à¤˜à¤‚à¤Ÿà¥‡ à¤•à¤¾à¤‚à¤—à¥à¤°à¥‡à¤¸ à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾ à¤Ÿà¥€à¤® à¤•à¥‡ à¤¸à¤¾à¤¥ à¤•à¤¾à¤® à¤•à¤°à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤¸à¤®à¤°à¥à¤ªà¤¿à¤¤ à¤•à¤°à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤¤à¥ˆà¤¯à¤¾à¤° à¤¹à¥ˆà¤‚?",
                question_type : "selection",
                is_answered : false,
                is_skip : false,
                answers : [
                    {"answer_id":"1","answer_english":"1-2 Hours","answer_hindi":"1-2 à¤˜à¤‚à¤Ÿà¥‡"},
                    {"answer_id":"2","answer_english":"2-4 Hours","answer_hindi":"2-4 à¤˜à¤‚à¤Ÿà¥‡"},
                    {"answer_id":"3","answer_english":"4-6 Hours","answer_hindi":"4-6 à¤˜à¤‚à¤Ÿà¥‡"},
                    {"answer_id":"4","answer_english":"More than 6 Hours","answer_hindi":"6 à¤˜à¤‚à¤Ÿà¥‡ à¤¸à¥‡ à¤œà¥à¤¯à¤¾à¤¦à¤¾"},
                ],
                answer : "",
            },
            {
                name : "prefered_working",
                question_id : 19,
                question_english : " In which of the following areas are you willing to work with the Congress social media team?",
                question_hindi : "à¤†à¤ª à¤¨à¤¿à¤®à¥à¤¨à¤²à¤¿à¤–à¤¿à¤¤ à¤®à¥‡à¤‚ à¤¸à¥‡ à¤•à¤¿à¤¸ à¤•à¥à¤·à¥‡à¤¤à¥à¤° à¤®à¥‡à¤‚ à¤•à¤¾à¤‚à¤—à¥à¤°à¥‡à¤¸ à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾ à¤Ÿà¥€à¤® à¤•à¥‡ à¤¸à¤¾à¤¥ à¤•à¤¾à¤® à¤•à¤°à¤¨à¥‡ à¤•à¥‡ à¤‡à¤šà¥à¤›à¥à¤• à¤¹à¥ˆà¤‚?",
                max_check : 15,
                question_type : "checkbox",
                is_answered : false,
                is_skip : false,
                answers : [
                    {"answer_id":"1","answer_english":"Training","answer_hindi":"à¤Ÿà¥à¤°à¥‡à¤¨à¤¿à¤‚à¤—"},
                    {"answer_id":"2","answer_english":"Research","answer_hindi":"à¤°à¤¿à¤¸à¤°à¥à¤š"},
                    {"answer_id":"3","answer_english":"Content (writing)","answer_hindi":"à¤•à¤‚à¤Ÿà¥‡à¤‚à¤Ÿ à¤²à¥‡à¤–à¤¨"},
                    {"answer_id":"4","answer_english":"Content Creation (Video, Audio, Graphics)","answer_hindi":"à¤•à¤‚à¤Ÿà¥‡à¤‚à¤Ÿ à¤•à¥à¤°à¤¿à¤à¤¶à¤¨ (à¤µà¥€à¤¡à¤¿à¤¯à¥‹ / à¤‘à¤¡à¤¿à¤¯à¥‹ / à¤—à¥à¤°à¤¾à¤«à¤¿à¤•à¥à¤¸)"},
                    {"answer_id":"5","answer_english":"Outreach / Team Development","answer_hindi":"à¤†à¤‰à¤Ÿà¤°à¥€à¤š / à¤Ÿà¥€à¤® à¤¤à¥ˆà¤¯à¤¾à¤° à¤•à¤°à¤¨à¤¾"},
                    {"answer_id":"6","answer_english":"Content Dissemination / Viral","answer_hindi":"à¤•à¤‚à¤Ÿà¥‡à¤‚à¤Ÿ à¤µà¤¿à¤¤à¤°à¤£"},
                ],
                answer : "",
            },
            {
                name : "activity_area",
                question_id : 20,
                question_english : "If there is any other area or activity you want to involve with the social media team (not mentioned in the previous options), please let us know.",
                question_hindi : "à¤¯à¤¦à¤¿ à¤•à¥‹à¤ˆ à¤…à¤¨à¥à¤¯ à¤•à¥à¤·à¥‡à¤¤à¥à¤° à¤¯à¤¾ à¤—à¤¤à¤¿à¤µà¤¿à¤§à¤¿ à¤†à¤ª à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾ à¤Ÿà¥€à¤® (à¤ªà¤¿à¤›à¤²à¥‡ à¤µà¤¿à¤•à¤²à¥à¤ªà¥‹à¤‚ à¤®à¥‡à¤‚ à¤‰à¤²à¥à¤²à¤¿à¤–à¤¿à¤¤ à¤¨à¤¹à¥€à¤‚) à¤•à¥‡ à¤¸à¤¾à¤¥ à¤¶à¤¾à¤®à¤¿à¤² à¤•à¤°à¤¨à¤¾ à¤šà¤¾à¤¹à¤¤à¥‡ à¤¹à¥ˆà¤‚, à¤¤à¥‹ à¤•à¥ƒà¤ªà¤¯à¤¾ à¤¹à¤®à¥‡à¤‚ à¤¬à¤¤à¤¾à¤à¤‚.",
                question_type : "text",
                is_answered : false,
                is_skip : false,
                answers : [
                ],
                answer : "",
            },
            {
                name : "social_media_platforms",
                question_id : 21,
                question_english : "Which of these social media platforms are you more active on?",
                question_hindi : "à¤†à¤ª à¤‡à¤¨à¤®à¥‡à¤‚ à¤¸à¥‡ à¤•à¤¿à¤¸ à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾ à¤ªà¥à¤²à¥‡à¤Ÿà¤«à¥‰à¤°à¥à¤® à¤ªà¤° à¤œà¥à¤¯à¤¾à¤¦à¤¾ à¤¸à¤•à¥à¤°à¤¿à¤¯ à¤¹à¥ˆà¤‚?",
                question_type : "checkbox",
                max_check : 15,
                is_answered : false,
                is_skip : false,
                answers : [
                    {"answer_id":"2","answer_english":"Facebook","answer_hindi":"à¤«à¥‡à¤¸à¤¬à¥à¤•"},
                    {"answer_id":"1","answer_english":"WhatsApp","answer_hindi":"à¤µà¥à¤¹à¤¾à¤Ÿà¥à¤¸à¤à¤ª"},
                    {"answer_id":"3","answer_english":"Twitter","answer_hindi":"à¤Ÿà¥à¤µà¤¿à¤Ÿà¤°"},
                    {"answer_id":"5","answer_english":"Instagram","answer_hindi":"à¤‡à¤‚à¤¸à¥à¤Ÿà¤¾à¤—à¥à¤°à¤¾à¤®"},
                    {"answer_id":"4","answer_english":"YouTube","answer_hindi":"à¤¯à¥‚à¤Ÿà¥à¤¯à¥‚à¤¬"},
                    {"answer_id":"6","answer_english":"linkedIn","answer_hindi":"à¤²à¤¿à¤‚à¤•à¤¡à¤¿à¤¨"},
                    {"answer_id":"7","answer_english":"Quora","answer_hindi":"à¤•à¥à¤µà¥‹à¤°à¤¾"},
                    {"answer_id":"5","answer_english":"Other","answer_hindi":"à¤…à¤¨à¥à¤¯"},
                ],
                answer : "",
            },
            {
                name : "social_media_platforms_other",
                question_id : 22,
                question_english : "Mention your other social media platform.",
                question_hindi : "à¤†à¤ª à¤…à¤¨à¥à¤¯ à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾ à¤ªà¥à¤²à¥‡à¤Ÿà¤«à¥‰à¤°à¥à¤® à¤•à¤¾ à¤‰à¤²à¥à¤²à¥‡à¤– à¤•à¤°à¥‡à¤‚.",
                question_type : "text",
                is_answered : false,
                is_skip : false,
                answers : [],
                answer : "",
            },
            {
                name : "social_media_platform_links",
                question_id : 23,
                question_english : "Please provide your most active social media handle link.<a href='https://www.incsmw.in/assets/SocialMedia.mp4' target='_blank'>(How to get Links)</a>",
                question_hindi : "à¤•à¥ƒà¤ªà¤¯à¤¾ à¤…à¤ªà¤¨à¥‡ à¤¸à¤¬à¤¸à¥‡ à¤¸à¤•à¥à¤°à¤¿à¤¯ à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾ à¤¹à¥ˆà¤‚à¤¡à¤² à¤•à¤¾ à¤²à¤¿à¤‚à¤• à¤ªà¥à¤°à¤¦à¤¾à¤¨ à¤•à¤°à¥‡à¤‚. <a href='https://www.incsmw.in/assets/SocialMedia.mp4' target='_blank'>(à¤²à¤¿à¤‚à¤• à¤•à¥ˆà¤¸à¥‡ à¤ªà¥à¤°à¤¾à¤ªà¥à¤¤ à¤•à¤°à¥‡à¤‚)</a>",
                question_type : "text",
                is_answered : false,
                is_skip : false,
                answers : [
                ],
                answer : "",
            },
            {
                name : "email",
                question_id : 24,
                question_english : "Write your email address",
                question_hindi : "à¤†à¤ªà¤•à¤¾ à¤ˆà¤®à¥‡à¤² à¤à¤¡à¥à¤°à¥‡à¤¸ à¤²à¤¿à¤–à¥‡à¤‚",
                question_type : "text",
                is_answered : false,
                is_skip : false,
                answers : [
                ],
                answer : "",
            },
            {
                name : "thankyou",
                question_id : 25,
                question_english : "Thank you for your response. We will contact you soon! <br /><br /> Please share the <a href='https://www.congressmembership.com/chatbot/' target='_blank'>link</a> with your friends and give them opportunities to become congress social media warrior. Jai Hind !",
            question_hindi : "à¤†à¤ªà¤•à¥€ à¤ªà¥à¤°à¤¤à¤¿à¤•à¥à¤°à¤¿à¤¯à¤¾ à¤•à¥‡ à¤²à¤¿à¤ à¤†à¤ªà¤•à¤¾ à¤§à¤¨à¥à¤¯à¤µà¤¾à¤¦à¥¤ à¤¹à¤® à¤¶à¥€à¤˜à¥à¤° à¤¹à¥€ à¤†à¤ªà¤¸à¥‡ à¤¸à¤‚à¤ªà¤°à¥à¤• à¤•à¤°à¥‡à¤‚à¤—à¥‡! <br /><br /> à¤•à¥ƒà¤ªà¤¯à¤¾ à¤…à¤ªà¤¨à¥‡ à¤¦à¥‹à¤¸à¥à¤¤à¥‹à¤‚ à¤•à¥‡ à¤¸à¤¾à¤¥ <a href='https://www.congressmembership.com/chatbot/' target='_blank'>à¤²à¤¿à¤‚à¤•</a> à¤¸à¤¾à¤à¤¾ à¤•à¤°à¥‡à¤‚ à¤”à¤° à¤‰à¤¨à¥à¤¹à¥‡à¤‚ à¤•à¤¾à¤‚à¤—à¥à¤°à¥‡à¤¸ à¤•à¥‡ à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾ à¤µà¤¾à¤°à¤¿à¤¯à¤° à¤¬à¤¨à¤¨à¥‡ à¤•à¥‡ à¤…à¤µà¤¸à¤° à¤ªà¥à¤°à¤¦à¤¾à¤¨ à¤•à¤°à¥‡à¤‚à¥¤ à¤œà¤¯ à¤¹à¤¿à¤¨à¥à¤¦ !",
                question_type : "none",
                is_answered : false,
                is_skip : false,
                answers : [
                ],
                answer : "",
            }]
    }

})

app.controller("chatController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, $window, $route, $timeout, $sce, $filter) {

    $scope.scrolltoBottom = function(){
        $("html,body").animate({scrollTop: angular.element("html").height()}, "slow");
    }


    $scope.states = [
        {"answer_id":"1","answer_english":"Andaman Nicobar","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
        {"answer_id":"2","answer_english":"Andhra Pradesh","answer_hindi":"à¤†à¤‚à¤§à¥à¤° à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
        {"answer_id":"3","answer_english":"Arunachal Pradesh","answer_hindi":"à¤…à¤°à¥à¤£à¤¾à¤šà¤² à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
        {"answer_id":"4","answer_english":"Assam","answer_hindi":"à¤…à¤¸à¤®"},
        {"answer_id":"5","answer_english":"Bihar","answer_hindi":"à¤¬à¤¿à¤¹à¤¾à¤°"},
        {"answer_id":"6","answer_english":"Chandigarh","answer_hindi":"à¤šà¤‚à¤¡à¥€à¤—à¤¢à¤¼"},
        {"answer_id":"7","answer_english":"Chhattisgarh","answer_hindi":"à¤›à¤¤à¥à¤¤à¥€à¤¸à¤—à¤¢à¤¼"},
        {"answer_id":"8","answer_english":"Dadra and Nagar Haveli","answer_hindi":"à¤¦à¤¾à¤¦à¤°à¤¾ à¤”à¤° à¤¨à¤—à¤° à¤¹à¤µà¥‡à¤²à¥€"},
        {"answer_id":"9","answer_english":"Delhi","answer_hindi":"à¤¦à¤¿à¤²à¥à¤²à¥€"},
        {"answer_id":"10","answer_english":"Diu Daman","answer_hindi":"à¤¦à¥€à¤µ à¤¦à¤®à¤¨"},
        {"answer_id":"11","answer_english":"Goa","answer_hindi":"à¤—à¥‹à¤µà¤¾"},
        {"answer_id":"12","answer_english":"Gujarat","answer_hindi":"à¤—à¥à¤œà¤°à¤¾à¤¤"},
        {"answer_id":"13","answer_english":"Haryana","answer_hindi":"à¤¹à¤°à¤¿à¤¯à¤¾à¤£à¤¾"},
        {"answer_id":"14","answer_english":"Himachal Pradesh","answer_hindi":"à¤¹à¤¿à¤®à¤¾à¤šà¤² à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
        {"answer_id":"15","answer_english":"Jammu Kashmir","answer_hindi":"à¤œà¤®à¥à¤®à¥‚ à¤•à¤¶à¥à¤®à¥€à¤°"},
        {"answer_id":"16","answer_english":"Jharkhand","answer_hindi":"à¤à¤¾à¤°à¤–à¤‚à¤¡"},
        {"answer_id":"17","answer_english":"Karnataka","answer_hindi":"à¤•à¤°à¥à¤¨à¤¾à¤Ÿà¤•"},
        {"answer_id":"18","answer_english":"Kerala","answer_hindi":"à¤•à¥‡à¤°à¤²"},
        {"answer_id":"19","answer_english":"Lakshadweep","answer_hindi":"à¤²à¤•à¥à¤·à¤¦à¥à¤µà¥€à¤ª"},
        {"answer_id":"20","answer_english":"Madhya Pradesh","answer_hindi":"à¤®à¤§à¥à¤¯ à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
        {"answer_id":"21","answer_english":"Maharashtra","answer_hindi":"à¤®à¤¹à¤¾à¤°à¤¾à¤·à¥à¤Ÿà¥à¤°"},
        {"answer_id":"22","answer_english":"Manipur","answer_hindi":"à¤®à¤£à¤¿à¤ªà¥à¤°"},
        {"answer_id":"23","answer_english":"Meghalaya","answer_hindi":"à¤®à¥‡à¤˜à¤¾à¤²à¤¯"},
        {"answer_id":"24","answer_english":"Mizoram","answer_hindi":"à¤®à¤¿à¤œà¥‹à¤°à¤®"},
        {"answer_id":"25","answer_english":"Nagaland","answer_hindi":"à¤¨à¤—à¤¾à¤²à¥ˆà¤‚à¤¡"},
        {"answer_id":"26","answer_english":"Odisha","answer_hindi":"à¤“à¤¡à¤¿à¤¶à¤¾"},
        {"answer_id":"27","answer_english":"Puducherry","answer_hindi":"à¤ªà¥à¤¡à¥à¤šà¥‡à¤°à¥€"},
        {"answer_id":"28","answer_english":"Punjab","answer_hindi":"à¤ªà¤‚à¤œà¤¾à¤¬"},
        {"answer_id":"29","answer_english":"Rajasthan","answer_hindi":"à¤°à¤¾à¤œà¤¸à¥à¤¥à¤¾à¤¨"},
        {"answer_id":"30","answer_english":"Sikkim","answer_hindi":"à¤¸à¤¿à¤•à¥à¤•à¤¿à¤®"},
        {"answer_id":"31","answer_english":"Tamil Nadu","answer_hindi":"à¤¤à¤®à¤¿à¤²à¤¨à¤¾à¤¡à¥"},
        {"answer_id":"32","answer_english":"Telangana","answer_hindi":"à¤¤à¥‡à¤²à¤‚à¤—à¤¾à¤¨à¤¾"},
        {"answer_id":"33","answer_english":"Tripura","answer_hindi":"à¤¤à¥à¤°à¤¿à¤ªà¥à¤°à¤¾"},
        {"answer_id":"34","answer_english":"Uttar Pradesh","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
        {"answer_id":"35","answer_english":"Uttarakhand","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤°à¤¾à¤–à¤‚à¤¡"},
        {"answer_id":"36","answer_english":"West Bengal","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤¬à¤‚à¤—à¤¾à¤²"},
        // {"answer_id":"37","answer_english":"Mumbai","answer_hindi":"à¤®à¥à¤‚à¤¬à¤ˆ"},
        {"answer_id":"38","answer_english":"Ladakh","answer_hindi":"à¤²à¤¦à¥à¤¦à¤¾à¤–"}
    ];

    $rootScope.$storage.currentQuestion = {
         name : "language",
        question_id : 1,
        question_english : "Greetings! Would you like to proceed in English or Hindi?",
        question_hindi : "Greetings! Would you like to proceed in English or Hindi?",
        question_type : "option",
        is_skip : false,
        answers : [
            {
                answer_id : "1",
                answer_english : "English",
                answer_hindi : "English",
            },
            {
                answer_id : "2",
                answer_english : "à¤¹à¤¿à¤‚à¤¦à¥€",  
                answer_hindi : "à¤¹à¤¿à¤‚à¤¦à¥€",  
            }
        ],
        is_answered : false,
        answer : "",
    };
    //$rootScope.$storage.language = "English";

    $rootScope.$storage.chat_messages = [
        {
            name : "language",
            question_id : 1,
            question_english : "Greetings! Would you like to proceed in English or Hindi?",
            question_hindi : "Greetings! Would you like to proceed in English or Hindi?",
            question_type : "option",
            is_skip : false,
            answers : [
                {
                    answer_id : "1",
                    answer_english : "English",
                    answer_hindi : "English",
                },
                {
                    answer_id : "2",
                    answer_english : "à¤¹à¤¿à¤‚à¤¦à¥€",  
                    answer_hindi : "à¤¹à¤¿à¤‚à¤¦à¥€",  
                }
            ],
            is_answered : false,
            answer : "",
        },
        {
            name : "intro",
            question_id : 2,
            question_english : "Welcome to the Indian National Congress Social Media recruitment campaign! We are launching an initiative to identify and select talented individuals for the INC at the village, town, state and all-India level. By becoming part of our organisation you will play an impactful leadership role in shaping the national discourse, and help us to  build a secular, modern, hate free and prosperous India. <br /><br /> You may like to watch the video below to understand our objectives, and your role in our team! <br /><br /> <a href='https://www.youtube.com/watch?v=E7gWc7d0tOE' target='_blank'>https://www.youtube.com/watch?v=E7gWc7d0tOE</a>",
            question_hindi : "à¤­à¤¾à¤°à¤¤à¥€à¤¯ à¤°à¤¾à¤·à¥à¤Ÿà¥à¤°à¥€à¤¯ à¤•à¤¾à¤‚à¤—à¥à¤°à¥‡à¤¸ à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾ à¤­à¤°à¥à¤¤à¥€ à¤…à¤­à¤¿à¤¯à¤¾à¤¨ à¤®à¥‡à¤‚ à¤†à¤ªà¤•à¤¾ à¤¸à¥à¤µà¤¾à¤—à¤¤ à¤¹à¥ˆ! à¤¹à¤® à¤—à¤¾à¤‚à¤µ, à¤¶à¤¹à¤°, à¤°à¤¾à¤œà¥à¤¯ à¤”à¤° à¤…à¤–à¤¿à¤² à¤­à¤¾à¤°à¤¤à¥€à¤¯ à¤¸à¥à¤¤à¤° à¤ªà¤° INC à¤•à¥‡ à¤²à¤¿à¤ à¤ªà¥à¤°à¤¤à¤¿à¤­à¤¾à¤¶à¤¾à¤²à¥€ à¤µà¥à¤¯à¤•à¥à¤¤à¤¿à¤¯à¥‹à¤‚ à¤•à¥€ à¤ªà¤¹à¤šà¤¾à¤¨ à¤”à¤° à¤šà¤¯à¤¨ à¤•à¤°à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤à¤• à¤ªà¤¹à¤² à¤¶à¥à¤°à¥‚ à¤•à¤° à¤°à¤¹à¥‡ à¤¹à¥ˆà¤‚à¥¤ à¤¹à¤®à¤¾à¤°à¥‡ à¤¸à¤‚à¤—à¤ à¤¨ à¤•à¤¾ à¤¹à¤¿à¤¸à¥à¤¸à¤¾ à¤¬à¤¨à¤•à¤° à¤†à¤ª à¤°à¤¾à¤·à¥à¤Ÿà¥à¤°à¥€à¤¯ à¤ªà¥à¤°à¤µà¤šà¤¨ à¤•à¥‹ à¤†à¤•à¤¾à¤° à¤¦à¥‡à¤¨à¥‡ à¤®à¥‡à¤‚ à¤à¤• à¤ªà¥à¤°à¤­à¤¾à¤µà¤¶à¤¾à¤²à¥€ à¤¨à¥‡à¤¤à¥ƒà¤¤à¥à¤µà¤•à¤¾à¤°à¥€ à¤­à¥‚à¤®à¤¿à¤•à¤¾ à¤¨à¤¿à¤­à¤¾à¤à¤‚à¤—à¥‡à¥¤ à¤†à¤ª à¤à¤• à¤§à¤°à¥à¤®à¤¨à¤¿à¤°à¤ªà¥‡à¤•à¥à¤·, à¤†à¤§à¥à¤¨à¤¿à¤•, à¤¨à¤«à¤°à¤¤ à¤®à¥à¤•à¥à¤¤ à¤”à¤° à¤¸à¤®à¥ƒà¤¦à¥à¤§ à¤­à¤¾à¤°à¤¤ à¤¬à¤¨à¤¾à¤¨à¥‡ à¤®à¥‡à¤‚ à¤®à¤¦à¤¦ à¤•à¤°à¥‡à¤‚à¤—à¥‡à¥¤ <br /><br /> à¤•à¥ƒà¤ªà¤¯à¤¾ à¤¹à¤®à¤¾à¤°à¥‡ à¤‰à¤¦à¥à¤¦à¥‡à¤¶à¥à¤¯à¥‹à¤‚ à¤”à¤° à¤¹à¤®à¤¾à¤°à¥€ à¤Ÿà¥€à¤® à¤®à¥‡à¤‚ à¤†à¤ªà¤•à¥€ à¤­à¥‚à¤®à¤¿à¤•à¤¾ à¤•à¥‹ à¤¸à¤®à¤à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤¨à¥€à¤šà¥‡ à¤¦à¤¿à¤¯à¤¾ à¤—à¤¯à¤¾ à¤µà¥€à¤¡à¤¿à¤¯à¥‹ à¤¦à¥‡à¤–à¥‡à¤‚ <a href='https://www.youtube.com/watch?v=E7gWc7d0tOE' target='_blank'>https://www.youtube.com/watch?v=E7gWc7d0tOE</a>!", 
            question_type : "text",
            is_skip : false,
            answers : [],
            is_answered : false,
            answer : "English",
        },
        {
            name : "is_above_18",
            question_id : 3,
            question_english : "Are you above 18 years of age?",
            question_hindi : "à¤•à¥à¤¯à¤¾ à¤†à¤ªà¤•à¥€ à¤†à¤¯à¥ 18 à¤µà¤°à¥à¤· à¤¸à¥‡ à¤…à¤§à¤¿à¤• à¤¹à¥ˆ?",
            question_type : "option",
            is_skip : false,
            answers : [
                {
                    answer_id : "1",
                    answer_english : "Yes",
                    answer_hindi : "à¤¹à¤¾à¤",
                },
                {
                    answer_id : "2",
                    answer_english : "No",  
                    answer_hindi : "à¤¨à¤¹à¥€à¤‚",  
                }
            ],
            is_answered : false,
            answer : "",
        },
        {
            name : "age_false",
            question_id : 4,
            question_english : "Thank you for your interest in the Congress social media team. At this time we are accepting applications from those over 18 years of age only.",
            question_hindi : "à¤•à¤¾à¤‚à¤—à¥à¤°à¥‡à¤¸ à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾ à¤Ÿà¥€à¤® à¤®à¥‡à¤‚ à¤†à¤ªà¤•à¥€ à¤°à¥à¤šà¤¿ à¤•à¥‡ à¤²à¤¿à¤ à¤§à¤¨à¥à¤¯à¤µà¤¾à¤¦à¥¤ à¤‡à¤¸ à¤¸à¤®à¤¯ à¤¹à¤® à¤•à¥‡à¤µà¤² 18 à¤µà¤°à¥à¤· à¤¸à¥‡ à¤…à¤§à¤¿à¤• à¤‰à¤®à¥à¤° à¤•à¥‡ à¤²à¥‹à¤—à¥‹à¤‚ à¤•à¥‡ à¤†à¤µà¥‡à¤¦à¤¨ à¤¸à¥à¤µà¥€à¤•à¤¾à¤° à¤•à¤° à¤°à¤¹à¥‡ à¤¹à¥ˆà¤‚à¥¤",
            question_type : "none",
            is_skip : false,
            answers : [],
            is_answered : false,
            answer : "",
        },
        {
            name : "name",
            question_id : 5,
            question_english : "Your Name? Please give first name and surname only.",
            question_hindi : "à¤†à¤ªà¤•à¤¾ à¤¨à¤¾à¤®? à¤•à¥ƒà¤ªà¤¯à¤¾ à¤•à¥‡à¤µà¤² à¤ªà¤¹à¤²à¤¾ à¤¨à¤¾à¤® à¤”à¤° à¤‰à¤ªà¤¨à¤¾à¤® à¤Ÿà¤¾à¤‡à¤ª à¤•à¤°à¥‡à¤‚",
            question_type : "text",
            is_skip : false,
            answers : [],
            is_answered : false,
            answer : "",
        },
        // {
        //     name : "inside_india",
        //     question_id : 6,
        //     question_english : "Are you presently in India or outside India?",
        //     question_hindi : "à¤†à¤ª à¤µà¤°à¥à¤¤à¤®à¤¾à¤¨ à¤®à¥‡à¤‚ à¤­à¤¾à¤°à¤¤ à¤®à¥‡à¤‚ à¤¹à¥ˆà¤‚ à¤¯à¤¾ à¤­à¤¾à¤°à¤¤ à¤•à¥‡ à¤¬à¤¾à¤¹à¤°?",
        //     question_type : "option",
        //     is_skip : false,
        //     is_answered : false,
        //     answers : [
        //         {
        //             answer_id : "1",
        //             answer_english : "Inside India",
        //             answer_hindi : "à¤­à¤¾à¤°à¤¤ à¤®à¥‡à¤‚",
        //         },
        //         {
        //             answer_id : "2",
        //             answer_english : "Outside India",  
        //             answer_hindi : "à¤­à¤¾à¤°à¤¤ à¤•à¥‡ à¤¬à¤¾à¤¹à¤°",  
        //         }
        //     ],
        //     answer : "",
        // },
        // {
        //     name : "not_in_india",
        //     question_id : 7,
        //     question_english : "Thank you for your interest in the Congress social media team. At this time we are accepting applications from India Only.",
        //     question_hindi : "à¤•à¤¾à¤‚à¤—à¥à¤°à¥‡à¤¸ à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾ à¤Ÿà¥€à¤® à¤®à¥‡à¤‚ à¤†à¤ªà¤•à¥€ à¤°à¥à¤šà¤¿ à¤•à¥‡ à¤²à¤¿à¤ à¤§à¤¨à¥à¤¯à¤µà¤¾à¤¦à¥¤ à¤‡à¤¸ à¤¸à¤®à¤¯ à¤¹à¤® à¤•à¥‡à¤µà¤² à¤­à¤¾à¤°à¤¤ à¤¸à¥‡ à¤†à¤µà¥‡à¤¦à¤¨ à¤¸à¥à¤µà¥€à¤•à¤¾à¤° à¤•à¤° à¤°à¤¹à¥‡ à¤¹à¥ˆà¤‚",
        //     question_type : "none",
        //     is_skip : false,
        //     is_answered : false,
        //     answers : [],
        //     answer : "",
        // },
        {
            name : "mobile",
            question_id : 6,
            question_english : "Please Type Your 10 digit mobile Phone Number",
            question_hindi : "à¤†à¤ªà¤•à¤¾ à¤«à¥‹à¤¨ à¤¨à¤‚à¤¬à¤°?",
            question_type : "number",
            max_length : 10,
            is_skip : false,
            answers : [],
            is_answered : false,
            answer : "",
        },
        {
            name : "already_registered",
            question_id : 7,
            question_english : "Your mobile number is already registered. Thank You.",
            question_hindi : "à¤†à¤ªà¤•à¤¾ à¤®à¥‹à¤¬à¤¾à¤‡à¤² à¤¨à¤‚à¤¬à¤° à¤ªà¤¹à¤²à¥‡ à¤¸à¥‡ à¤ªà¤‚à¤œà¥€à¤•à¥ƒà¤¤ à¤¹à¥ˆà¥¤ à¤§à¤¨à¥à¤¯à¤µà¤¾à¤¦à¥¤",
            question_type : "none",
            max_length : 10,
            is_skip : false,
            answers : [],
            is_answered : false,
            answer : "",
        },
        {
            name : "otp",
            question_id : 8,
            question_english : "You must have received an OTP. Please type that.",
            question_hindi : "à¤†à¤ªà¤•à¥‹ à¤à¤• OTP à¤ªà¥à¤°à¤¾à¤ªà¥à¤¤ à¤¹à¥à¤† à¤¹à¥‹à¤—à¤¾à¥¤ à¤•à¥ƒà¤ªà¤¯à¤¾ OTP à¤Ÿà¤¾à¤‡à¤ª à¤•à¤°à¥‡à¤‚",
            question_type : "number",
            max_length : 6,
            is_skip : false,
            answers : [],
            is_answered : false,
            answer : "",
        },
        {
            name : "verify_otp",
            question_id : 9,
            question_english : "Invalid verification code, Please try again.",
            question_hindi : "à¤µà¥ˆà¤°à¤¿à¤«à¤¿à¤•à¥‡à¤¶à¤¨ à¤•à¥‹à¤¡ à¤—à¤²à¤¤ à¤¹à¥ˆ.",
            question_type : "none",
            max_length : 6,
            is_skip : false,
            answers : [],
            is_answered : false,
            answer : "",
        },
        {
            name : "is_whatsapp",
            question_id : 10,
            question_english : "Is this also your WhatsApp number?",
            question_hindi : "à¤•à¥à¤¯à¤¾ à¤¯à¤¹ à¤†à¤ªà¤•à¤¾ à¤µà¥à¤¹à¤¾à¤Ÿà¥à¤¸à¤à¤ª à¤¨à¤‚à¤¬à¤° à¤­à¥€ à¤¹à¥ˆ?",
            question_type : "option",
            is_skip : false,
            is_answered : false,
            answers : [
                {
                    answer_id : "1",
                    answer_english : "Yes",
                    answer_hindi : "à¤¹à¤¾à¤",
                },
                {
                    answer_id : "2",
                    answer_english : "No",  
                    answer_hindi : "à¤¨à¤¹à¥€à¤‚",  
                }
            ],
            answer : "",
        },
        {
            name : "whatsapp_number",
            question_id : 11,
            question_english : "Please Type Your 10 digit WhatsApp Phone Number",
            question_hindi : "à¤†à¤ªà¤•à¤¾ à¤µà¥à¤¹à¤¾à¤Ÿà¥à¤¸à¤à¤ª à¤¨à¤‚à¤¬à¤° à¤•à¥à¤¯à¤¾ à¤¹à¥ˆ?",
            question_type : "text",
            is_skip : false,
            max_length : 10,
            is_answered : false,
            answers : [],
            answer : "",
        },
        {
            name : "state_id",
            question_id : 12,
            question_english : "Which State Or Union Territory do you belong to?",
            question_hindi : "à¤†à¤ª à¤•à¤¿à¤¸ à¤°à¤¾à¤œà¥à¤¯ à¤¯à¤¾ à¤•à¥‡à¤‚à¤¦à¥à¤° à¤¶à¤¾à¤¸à¤¿à¤¤ à¤ªà¥à¤°à¤¦à¥‡à¤¶ à¤¸à¥‡ à¤¹à¥ˆà¤‚?",
            question_type : "selection",
            is_answered : false,
            is_skip : false,
            answers : [
                {"answer_id":"2","answer_english":"Andaman and Nicobar","answer_hindi":"à¤…à¤£à¥à¤¡à¤®à¤¾à¤¨ à¤”à¤° à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
                {"answer_id":"1","answer_english":"Andhra Pradesh","answer_hindi":"à¤†à¤‚à¤§à¥à¤° à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
                {"answer_id":"3","answer_english":"Arunachal Pradesh","answer_hindi":"à¤…à¤°à¥à¤£à¤¾à¤šà¤² à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
                {"answer_id":"4","answer_english":"Assam","answer_hindi":"à¤…à¤¸à¤®"},
                {"answer_id":"5","answer_english":"Bihar","answer_hindi":"à¤¬à¤¿à¤¹à¤¾à¤°"},
                {"answer_id":"6","answer_english":"Chandigarh","answer_hindi":"à¤šà¤£à¥à¤¡à¥€à¤—à¤¢à¤¼"},
                {"answer_id":"7","answer_english":"Chhattisgarh","answer_hindi":"à¤›à¤¤à¥à¤¤à¥€à¤¸à¤—à¤¢à¤¼"},
                {"answer_id":"8","answer_english":"Dadra and Nagar Haveli and Daman and Diu","answer_hindi":"à¤¦à¤¾à¤¦à¤°à¤¾ à¤¨à¤—à¤° à¤¹à¤µà¥‡à¤²à¥€ à¤”à¤° à¤¦à¤®à¤¨ à¤”à¤° à¤¦à¥€à¤µ"},
                {"answer_id":"9","answer_english":"Delhi","answer_hindi":"à¤¦à¤¿à¤²à¥à¤²à¥€"},
                {"answer_id":"10","answer_english":"Goa","answer_hindi":"à¤—à¥‹à¤µà¤¾"},
                {"answer_id":"11","answer_english":"Gujarat","answer_hindi":"à¤—à¥à¤œà¤°à¤¾à¤¤"},
                {"answer_id":"12","answer_english":"Haryana","answer_hindi":"à¤¹à¤°à¤¿à¤¯à¤¾à¤£à¤¾"},
                {"answer_id":"13","answer_english":"Himachal Pradesh","answer_hindi":"à¤¹à¤¿à¤®à¤¾à¤šà¤² à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
                {"answer_id":"14","answer_english":"Jammu and Kashmir","answer_hindi":"à¤œà¤®à¥à¤®à¥‚ à¤•à¤¶à¥à¤®à¥€à¤°"},
                {"answer_id":"15","answer_english":"Jharkhand","answer_hindi":"à¤à¤¾à¤°à¤–à¤£à¥à¤¡"},
                {"answer_id":"16","answer_english":"Karnataka","answer_hindi":"à¤•à¤°à¥à¤¨à¤¾à¤Ÿà¤•"},
                {"answer_id":"17","answer_english":"Kerala","answer_hindi":"à¤•à¥‡à¤°à¤²"},
                {"answer_id":"18","answer_english":"Ladakh","answer_hindi":"à¤²à¤¦à¥à¤¦à¤¾à¤–"},
                {"answer_id":"19","answer_english":"Lakshadweep","answer_hindi":"à¤²à¤•à¥à¤·à¤¦à¥à¤µà¥€à¤ª"},
                {"answer_id":"20","answer_english":"Madhya Pradesh","answer_hindi":"à¤®à¤§à¥à¤¯à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
                {"answer_id":"21","answer_english":"Maharastra","answer_hindi":"à¤®à¤¹à¤¾à¤°à¤¾à¤·à¥à¤Ÿà¥à¤°"},
                {"answer_id":"22","answer_english":"Manipur","answer_hindi":"à¤®à¤£à¤¿à¤ªà¥à¤°"},
                {"answer_id":"23","answer_english":"Meghalaya","answer_hindi":"à¤®à¥‡à¤˜à¤¾à¤²à¤¯"},
                {"answer_id":"24","answer_english":"Mizoram","answer_hindi":"à¤®à¤¿à¤œà¤¼à¥‹à¤°à¤®"},
                {"answer_id":"25","answer_english":"Nagaland","answer_hindi":"à¤¨à¤¾à¤—à¤¾à¤²à¥ˆà¤£à¥à¤¡"},
                {"answer_id":"26","answer_english":"Odisha","answer_hindi":"à¤“à¤¡à¤¼à¤¿à¤¶à¤¾"},
                {"answer_id":"27","answer_english":"Puducherry","answer_hindi":"à¤ªà¥à¤¦à¥à¤šà¥‡à¤°à¥€"},
                {"answer_id":"28","answer_english":"Punjab","answer_hindi":"à¤ªà¤‚à¤œà¤¾à¤¬"},
                {"answer_id":"29","answer_english":"Rajasthan","answer_hindi":"à¤°à¤¾à¤œà¤¸à¥à¤¥à¤¾à¤¨"},
                {"answer_id":"30","answer_english":"Sikkim","answer_hindi":"à¤¸à¤¿à¤•à¥à¤•à¤¿à¤®"},
                {"answer_id":"31","answer_english":"Tamil Nadu","answer_hindi":"à¤¤à¤®à¤¿à¤²à¤¨à¤¾à¤¡à¥"},
                {"answer_id":"32","answer_english":"Telangana","answer_hindi":"à¤¤à¥‡à¤²à¤‚à¤—à¤¾à¤¨à¤¾"},
                {"answer_id":"33","answer_english":"Tripura","answer_hindi":"à¤¤à¥à¤°à¤¿à¤ªà¥à¤°à¤¾"},
                {"answer_id":"34","answer_english":"Uttar Pradesh","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
                {"answer_id":"35","answer_english":"Uttarakhand","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤°à¤¾à¤–à¤£à¥à¤¡"},
                {"answer_id":"36","answer_english":"West Bengal","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤¬à¤‚à¤—à¤¾à¤²"}
            ],
            answer : "",
        },
        {
            name : "pincode",
            question_id : 13,
            question_english : "Please enter your pin code",
            question_hindi : "à¤œà¥€ à¤•à¥ƒà¤ªà¤¯à¤¾ à¤…à¤ªà¤¨à¤¾ à¤ªà¤¿à¤¨ à¤•à¥‹à¤¡ à¤¦à¤°à¥à¤œ à¤•à¤°à¥‡à¤‚",
            question_type : "number",
            max_length : 6,
            is_skip : false,
            is_answered : false,
            answers : [],
            answer : "",
        },
        {
            name : "thankyou",
            question_id : 14,
            question_english : "Thank you for your response. We will contact you soon! <br /><br /> Please share the <a href='https://www.congressmembership.com/chatbot/' target='_blank'>link</a> with your friends and give them opportunities to become congress social media warrior. Jai Hind !",
            question_hindi : "à¤†à¤ªà¤•à¥€ à¤ªà¥à¤°à¤¤à¤¿à¤•à¥à¤°à¤¿à¤¯à¤¾ à¤•à¥‡ à¤²à¤¿à¤ à¤†à¤ªà¤•à¤¾ à¤§à¤¨à¥à¤¯à¤µà¤¾à¤¦à¥¤ à¤¹à¤® à¤¶à¥€à¤˜à¥à¤° à¤¹à¥€ à¤†à¤ªà¤¸à¥‡ à¤¸à¤‚à¤ªà¤°à¥à¤• à¤•à¤°à¥‡à¤‚à¤—à¥‡! <br /><br /> à¤•à¥ƒà¤ªà¤¯à¤¾ à¤…à¤ªà¤¨à¥‡ à¤¦à¥‹à¤¸à¥à¤¤à¥‹à¤‚ à¤•à¥‡ à¤¸à¤¾à¤¥ <a href='https://www.congressmembership.com/chatbot/' target='_blank'>à¤²à¤¿à¤‚à¤•</a> à¤¸à¤¾à¤à¤¾ à¤•à¤°à¥‡à¤‚ à¤”à¤° à¤‰à¤¨à¥à¤¹à¥‡à¤‚ à¤•à¤¾à¤‚à¤—à¥à¤°à¥‡à¤¸ à¤•à¥‡ à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾ à¤µà¤¾à¤°à¤¿à¤¯à¤° à¤¬à¤¨à¤¨à¥‡ à¤•à¥‡ à¤…à¤µà¤¸à¤° à¤ªà¥à¤°à¤¦à¤¾à¤¨ à¤•à¤°à¥‡à¤‚à¥¤ à¤œà¤¯ à¤¹à¤¿à¤¨à¥à¤¦ !",
            question_type : "none",
            is_skip : false,
            is_answered : false,
            answers : [],
            answer : "",
        }
    ] 

    

    $scope.selectedStateObj = {};
    $scope.selectedStateObj.state_id = "";

    $scope.selectedDistrictObj = {};
    $scope.selectedDistrictObj.district_id = "";

    //$rootScope.$storage.defaultNumber = 0;

    $scope.errorMessage = "";
    $scope.isError = false;

    $scope.submitSelection = function(question, answer, flag){

        // var question = $rootScope.$storage.chat_messages.filter(function(item) { if(item.question_id == questionRef.question_id) { return item } })[0];
        // console.log(question);  

        console.log(question.is_answered, "test");
        console.log(answer, "answer");

        if(question.is_answered == false && answer != ''){

            console.log("here1");
            console.log("here2");

            if(question.name == "mobile"){
                if(answer.length != 10){

                    if($rootScope.$storage.language == "English"){
                        $scope.errorMessage = "Please enter a valid 10 digit number!";
                    }
                    else{
                        $scope.errorMessage = "à¤•à¥ƒà¤ªà¤¯à¤¾ 10 à¤…à¤‚à¤•à¥‹à¤‚ à¤•à¥€ à¤®à¤¾à¤¨à¥à¤¯ à¤¸à¤‚à¤–à¥à¤¯à¤¾ à¤¦à¤°à¥à¤œ à¤•à¤°à¥‡à¤‚!"; 
                    }

                    $scope.isError = true;
                    $timeout(function() {
                        $scope.isError = false;
                    }, 2000);
                    return false;
                }
            }

            if(question.name == "pincode"){
                if(answer.length != 6){
                    if($rootScope.$storage.language == "English"){
                        $scope.errorMessage = "Please enter a valid 6 digit Pincode!";
                    }
                    else{
                        $scope.errorMessage = "à¤•à¥ƒà¤ªà¤¯à¤¾ à¤à¤• à¤®à¤¾à¤¨à¥à¤¯ 6 à¤…à¤‚à¤• à¤ªà¤¿à¤¨ à¤•à¥‹à¤¡ à¤¦à¤°à¥à¤œ à¤•à¤°à¥‡à¤‚!"; 
                    }
                    $scope.isError = true;
                    $timeout(function() {
                        $scope.isError = false;
                    }, 2000);
                    return false;
                }
            }

            if(question.name == "otp"){
                if(answer.length != 6){
                    if($rootScope.$storage.language == "English"){
                        $scope.errorMessage = "Please enter a valid 6 digit OTP!";
                    }
                    else{
                        $scope.errorMessage = "à¤•à¥ƒà¤ªà¤¯à¤¾ à¤à¤• à¤®à¤¾à¤¨à¥à¤¯ 6 à¤…à¤‚à¤• OTP à¤¦à¤°à¥à¤œ à¤•à¤°à¥‡à¤‚!"; 
                    }
                    $scope.isError = true;
                    $timeout(function() {
                        $scope.isError = false;
                    }, 2000);
                    return false;
                }
            }

            if(question.name == "state_id"){
                angular.forEach($scope.states, function(value, key){
                    if(value.answer_id == answer){
                        if($rootScope.$storage.language == "English"){
                            $rootScope.$storage.chat_messages[$rootScope.$storage.defaultNumber] = value.answer_english;
                        }
                        else{
                            $rootScope.$storage.chat_messages[$rootScope.$storage.defaultNumber] = value.answer_hindi;
                        }

                    }
                })
            }

            if(question.name == "district_id"){
                angular.forEach($scope.district, function(value, key){
                    if(value.answer_id == answer){
                        if($rootScope.$storage.language == "English"){
                            $rootScope.$storage.chat_messages[$rootScope.$storage.defaultNumber] = value.answer_english;
                        }
                        else{
                            $rootScope.$storage.chat_messages[$rootScope.$storage.defaultNumber] = value.answer_hindi;
                        }

                    }
                })
            }

            else{
                //question.answer = answer;
                $rootScope.$storage.chat_messages[$rootScope.$storage.defaultNumber] = answer;

                console.log("testing testing");
                console.log($rootScope.$storage.chat_messages[$rootScope.$storage.defaultNumber], "default");

                // angular.forEach($rootScope.$storage.chat_messages, function(value, key){
                //     if(value.question_id == question.question_id){
                //         $rootScope.$storage.chat_messages[$index]
                //     }
                // })
            }

            //console.log(question, "question");

            question.is_answered = true;
            $rootScope.$storage.currentQuestion = question;

            var addition = 1;

            if(question.name == "language"){
                addition = 2;

                if(answer == "English"){
                    $rootScope.$storage.language = "English";
                }
                else{
                    $rootScope.$storage.language = "Hindi";
                }

            }

            if(question.name == "is_above_18"){
                if(answer == "Yes" || answer == "à¤¹à¤¾à¤"){
                    addition = 2;
                    angular.forEach($rootScope.$storage.chat_messages, function (value, key){
                        if(value.name == "age_false"){
                            $rootScope.$storage.chat_messages[key].is_skip = true;
                        }
                    });     
                }
            }

            if(question.name == "inside_india"){
                if(answer == "Inside India" || answer == "à¤­à¤¾à¤°à¤¤ à¤®à¥‡à¤‚"){
                    addition = 2;
                    angular.forEach($rootScope.$storage.chat_messages, function (value, key){
                        if(value.name == "not_in_india"){
                            $rootScope.$storage.chat_messages[key].is_skip = true;
                        }
                    });     
                }
            }

            if(question.name == "is_whatsapp"){
                if(answer == "Yes" || answer == "à¤¹à¤¾à¤"){
                    addition = 2;
                    angular.forEach($rootScope.$storage.chat_messages, function (value, key){
                        if(value.name == "whatsapp_number"){
                            $rootScope.$storage.chat_messages[key].is_skip = true;
                        }
                    })
                    $rootScope.$storage.registrationObj['whatsapp_number'] = $rootScope.$storage.registrationObj['mobile'];
                }
            }


            if(question.name == "mobile"){

                $rootScope.$storage.currentAnswerObj.answer = "";

                $http({
                  method: 'POST',
                  url: apiUrl + 'services/workerOtp',
                  data : {
                     mobile : answer,
                     name : $rootScope.$storage.registrationObj.name
                  }
                }).then(function successCallback(response) {
                    response = response.data;
                    if(response.success == 1){    

                        addition = 2;

                        angular.forEach($rootScope.$storage.chat_messages, function (value, key){
                            if(value.name == "already_registered"){
                                $rootScope.$storage.chat_messages[key].is_skip = true;
                            }
                        })

                        $rootScope.$storage.currentQuestion = $rootScope.$storage.chat_messages[$rootScope.$storage.defaultNumber + addition];
                        $rootScope.$storage.defaultNumber += addition;
                        $rootScope.$storage.registrationObj[question.name] = answer;
                        $rootScope.$storage.currentAnswerObj.answer = ""; 
                        $scope.scrolltoBottom();
                    }
                    else if(response.success == 2){

                        $rootScope.$storage.currentQuestion = $rootScope.$storage.chat_messages[$rootScope.$storage.defaultNumber + addition];
                        $rootScope.$storage.defaultNumber += addition;
                        $rootScope.$storage.registrationObj[question.name] = answer;
                        $rootScope.$storage.currentAnswerObj.answer = "";
                        $scope.scrolltoBottom();

                    }

                    $scope.isLoading = false;
                }, function errorCallback(response) {
                });
            }
            else if(question.name == "otp"){

                $rootScope.$storage.currentAnswerObj.answer = "";

                $http({
                  method: 'POST',
                  url: apiUrl + 'services/verify_otp',
                  data : {
                     mobile : $rootScope.$storage.registrationObj.mobile,
                     code : answer
                  }
                }).then(function successCallback(response) {
                    response = response.data;
                    if(response.success == 1){    

                        addition = 2;

                        angular.forEach($rootScope.$storage.chat_messages, function (value, key){
                            if(value.name == "verify_otp"){
                                $rootScope.$storage.chat_messages[key].is_skip = true;
                            }
                        })

                        $rootScope.$storage.currentQuestion = $rootScope.$storage.chat_messages[$rootScope.$storage.defaultNumber + addition];
                        $rootScope.$storage.defaultNumber += addition;
                        $rootScope.$storage.registrationObj[question.name] = answer;
                        $rootScope.$storage.currentAnswerObj.answer = ""; 
                        $scope.scrolltoBottom();
                    }
                    else{

                        question.is_answered = false;
                        if($rootScope.$storage.language == "English"){
                            $scope.errorMessage = "Incorrect OTP, Please try again!";
                        }
                        else{
                            $scope.errorMessage = "à¤—à¤²à¤¤ OTP, à¤•à¥ƒà¤ªà¤¯à¤¾ à¤ªà¥à¤¨à¤ƒ à¤ªà¥à¤°à¤¯à¤¾à¤¸ à¤•à¤°à¥‡à¤‚!!"; 
                        }

                        $scope.isError = true;
                        $timeout(function() {
                            $scope.isError = false;
                        }, 2000);
                        return false;

                        // $rootScope.$storage.currentQuestion = $rootScope.$storage.chat_messages[$rootScope.$storage.defaultNumber + addition];
                        // $rootScope.$storage.defaultNumber += addition;
                        // $rootScope.$storage.registrationObj[question.name] = answer;
                        // $rootScope.$storage.currentAnswerObj.answer = "";
                        // $scope.scrolltoBottom();
                    }

                    $scope.isLoading = false;
                }, function errorCallback(response) {
                });
            }
            else if(question.name == "pincode"){

                $rootScope.$storage.currentQuestion = $rootScope.$storage.chat_messages[$rootScope.$storage.defaultNumber + addition];
                $rootScope.$storage.defaultNumber += addition;
                $rootScope.$storage.registrationObj[question.name] = answer;
                $rootScope.$storage.currentAnswerObj.answer = "";
                $scope.scrolltoBottom();

                $http({
                  method: 'POST',
                  url: apiUrl + 'services/save_social_user',
                  data : $rootScope.$storage.registrationObj,
                }).then(function successCallback(response) {
                    
                }, function errorCallback(response) {
                });
            }
            else{
                $rootScope.$storage.currentQuestion = $rootScope.$storage.chat_messages[$rootScope.$storage.defaultNumber + addition];
                $rootScope.$storage.defaultNumber += addition;
                $rootScope.$storage.registrationObj[question.name] = answer;
                $rootScope.$storage.currentAnswerObj.answer = "";

                $scope.scrolltoBottom();
            }

        }

    }

})


app.controller("chatFormController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, $window, $route, $timeout, $sce, $filter) {

    $scope.scrolltoBottom = function(){
        $("html,body").animate({scrollTop: angular.element("html").height()}, "slow");
    }

    $scope.states = [
        {"answer_id":"2","answer_english":"Andaman and Nicobar","answer_hindi":"à¤…à¤£à¥à¤¡à¤®à¤¾à¤¨ à¤”à¤° à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
        {"answer_id":"1","answer_english":"Andhra Pradesh","answer_hindi":"à¤†à¤‚à¤§à¥à¤° à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
        {"answer_id":"3","answer_english":"Arunachal Pradesh","answer_hindi":"à¤…à¤°à¥à¤£à¤¾à¤šà¤² à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
        {"answer_id":"4","answer_english":"Assam","answer_hindi":"à¤…à¤¸à¤®"},
        {"answer_id":"5","answer_english":"Bihar","answer_hindi":"à¤¬à¤¿à¤¹à¤¾à¤°"},
        {"answer_id":"6","answer_english":"Chandigarh","answer_hindi":"à¤šà¤£à¥à¤¡à¥€à¤—à¤¢à¤¼"},
        {"answer_id":"7","answer_english":"Chhattisgarh","answer_hindi":"à¤›à¤¤à¥à¤¤à¥€à¤¸à¤—à¤¢à¤¼"},
        {"answer_id":"8","answer_english":"Dadra and Nagar Haveli and Daman and Diu","answer_hindi":"à¤¦à¤¾à¤¦à¤°à¤¾ à¤¨à¤—à¤° à¤¹à¤µà¥‡à¤²à¥€ à¤”à¤° à¤¦à¤®à¤¨ à¤”à¤° à¤¦à¥€à¤µ"},
        {"answer_id":"9","answer_english":"Delhi","answer_hindi":"à¤¦à¤¿à¤²à¥à¤²à¥€"},
        {"answer_id":"10","answer_english":"Goa","answer_hindi":"à¤—à¥‹à¤µà¤¾"},
        {"answer_id":"11","answer_english":"Gujarat","answer_hindi":"à¤—à¥à¤œà¤°à¤¾à¤¤"},
        {"answer_id":"12","answer_english":"Haryana","answer_hindi":"à¤¹à¤°à¤¿à¤¯à¤¾à¤£à¤¾"},
        {"answer_id":"13","answer_english":"Himachal Pradesh","answer_hindi":"à¤¹à¤¿à¤®à¤¾à¤šà¤² à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
        {"answer_id":"14","answer_english":"Jammu and Kashmir","answer_hindi":"à¤œà¤®à¥à¤®à¥‚ à¤•à¤¶à¥à¤®à¥€à¤°"},
        {"answer_id":"15","answer_english":"Jharkhand","answer_hindi":"à¤à¤¾à¤°à¤–à¤£à¥à¤¡"},
        {"answer_id":"16","answer_english":"Karnataka","answer_hindi":"à¤•à¤°à¥à¤¨à¤¾à¤Ÿà¤•"},
        {"answer_id":"17","answer_english":"Kerala","answer_hindi":"à¤•à¥‡à¤°à¤²"},
        {"answer_id":"18","answer_english":"Ladakh","answer_hindi":"à¤²à¤¦à¥à¤¦à¤¾à¤–"},
        {"answer_id":"19","answer_english":"Lakshadweep","answer_hindi":"à¤²à¤•à¥à¤·à¤¦à¥à¤µà¥€à¤ª"},
        {"answer_id":"20","answer_english":"Madhya Pradesh","answer_hindi":"à¤®à¤§à¥à¤¯à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
        {"answer_id":"21","answer_english":"Maharastra","answer_hindi":"à¤®à¤¹à¤¾à¤°à¤¾à¤·à¥à¤Ÿà¥à¤°"},
        {"answer_id":"22","answer_english":"Manipur","answer_hindi":"à¤®à¤£à¤¿à¤ªà¥à¤°"},
        {"answer_id":"23","answer_english":"Meghalaya","answer_hindi":"à¤®à¥‡à¤˜à¤¾à¤²à¤¯"},
        {"answer_id":"24","answer_english":"Mizoram","answer_hindi":"à¤®à¤¿à¤œà¤¼à¥‹à¤°à¤®"},
        {"answer_id":"25","answer_english":"Nagaland","answer_hindi":"à¤¨à¤¾à¤—à¤¾à¤²à¥ˆà¤£à¥à¤¡"},
        {"answer_id":"26","answer_english":"Odisha","answer_hindi":"à¤“à¤¡à¤¼à¤¿à¤¶à¤¾"},
        {"answer_id":"27","answer_english":"Puducherry","answer_hindi":"à¤ªà¥à¤¦à¥à¤šà¥‡à¤°à¥€"},
        {"answer_id":"28","answer_english":"Punjab","answer_hindi":"à¤ªà¤‚à¤œà¤¾à¤¬"},
        {"answer_id":"29","answer_english":"Rajasthan","answer_hindi":"à¤°à¤¾à¤œà¤¸à¥à¤¥à¤¾à¤¨"},
        {"answer_id":"30","answer_english":"Sikkim","answer_hindi":"à¤¸à¤¿à¤•à¥à¤•à¤¿à¤®"},
        {"answer_id":"31","answer_english":"Tamil Nadu","answer_hindi":"à¤¤à¤®à¤¿à¤²à¤¨à¤¾à¤¡à¥"},
        {"answer_id":"32","answer_english":"Telangana","answer_hindi":"à¤¤à¥‡à¤²à¤‚à¤—à¤¾à¤¨à¤¾"},
        {"answer_id":"33","answer_english":"Tripura","answer_hindi":"à¤¤à¥à¤°à¤¿à¤ªà¥à¤°à¤¾"},
        {"answer_id":"34","answer_english":"Uttar Pradesh","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
        {"answer_id":"35","answer_english":"Uttarakhand","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤°à¤¾à¤–à¤£à¥à¤¡"},
        {"answer_id":"36","answer_english":"West Bengal","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤¬à¤‚à¤—à¤¾à¤²"}
        // {"answer_id":"1","answer_english":"Andaman Nicobar","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
        // {"answer_id":"2","answer_english":"Andhra Pradesh","answer_hindi":"à¤†à¤‚à¤§à¥à¤° à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
        // {"answer_id":"3","answer_english":"Arunachal Pradesh","answer_hindi":"à¤…à¤°à¥à¤£à¤¾à¤šà¤² à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
        // {"answer_id":"4","answer_english":"Assam","answer_hindi":"à¤…à¤¸à¤®"},
        // {"answer_id":"5","answer_english":"Bihar","answer_hindi":"à¤¬à¤¿à¤¹à¤¾à¤°"},
        // {"answer_id":"6","answer_english":"Chandigarh","answer_hindi":"à¤šà¤‚à¤¡à¥€à¤—à¤¢à¤¼"},
        // {"answer_id":"7","answer_english":"Chhattisgarh","answer_hindi":"à¤›à¤¤à¥à¤¤à¥€à¤¸à¤—à¤¢à¤¼"},
        // {"answer_id":"8","answer_english":"Dadra and Nagar Haveli","answer_hindi":"à¤¦à¤¾à¤¦à¤°à¤¾ à¤”à¤° à¤¨à¤—à¤° à¤¹à¤µà¥‡à¤²à¥€"},
        // {"answer_id":"9","answer_english":"Delhi","answer_hindi":"à¤¦à¤¿à¤²à¥à¤²à¥€"},
        // {"answer_id":"10","answer_english":"Diu Daman","answer_hindi":"à¤¦à¥€à¤µ à¤¦à¤®à¤¨"},
        // {"answer_id":"11","answer_english":"Goa","answer_hindi":"à¤—à¥‹à¤µà¤¾"},
        // {"answer_id":"12","answer_english":"Gujarat","answer_hindi":"à¤—à¥à¤œà¤°à¤¾à¤¤"},
        // {"answer_id":"13","answer_english":"Haryana","answer_hindi":"à¤¹à¤°à¤¿à¤¯à¤¾à¤£à¤¾"},
        // {"answer_id":"14","answer_english":"Himachal Pradesh","answer_hindi":"à¤¹à¤¿à¤®à¤¾à¤šà¤² à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
        // {"answer_id":"15","answer_english":"Jammu Kashmir","answer_hindi":"à¤œà¤®à¥à¤®à¥‚ à¤•à¤¶à¥à¤®à¥€à¤°"},
        // {"answer_id":"16","answer_english":"Jharkhand","answer_hindi":"à¤à¤¾à¤°à¤–à¤‚à¤¡"},
        // {"answer_id":"17","answer_english":"Karnataka","answer_hindi":"à¤•à¤°à¥à¤¨à¤¾à¤Ÿà¤•"},
        // {"answer_id":"18","answer_english":"Kerala","answer_hindi":"à¤•à¥‡à¤°à¤²"},
        // {"answer_id":"19","answer_english":"Lakshadweep","answer_hindi":"à¤²à¤•à¥à¤·à¤¦à¥à¤µà¥€à¤ª"},
        // {"answer_id":"20","answer_english":"Madhya Pradesh","answer_hindi":"à¤®à¤§à¥à¤¯ à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
        // {"answer_id":"21","answer_english":"Maharashtra","answer_hindi":"à¤®à¤¹à¤¾à¤°à¤¾à¤·à¥à¤Ÿà¥à¤°"},
        // {"answer_id":"22","answer_english":"Manipur","answer_hindi":"à¤®à¤£à¤¿à¤ªà¥à¤°"},
        // {"answer_id":"23","answer_english":"Meghalaya","answer_hindi":"à¤®à¥‡à¤˜à¤¾à¤²à¤¯"},
        // {"answer_id":"24","answer_english":"Mizoram","answer_hindi":"à¤®à¤¿à¤œà¥‹à¤°à¤®"},
        // {"answer_id":"25","answer_english":"Nagaland","answer_hindi":"à¤¨à¤—à¤¾à¤²à¥ˆà¤‚à¤¡"},
        // {"answer_id":"26","answer_english":"Odisha","answer_hindi":"à¤“à¤¡à¤¿à¤¶à¤¾"},
        // {"answer_id":"27","answer_english":"Puducherry","answer_hindi":"à¤ªà¥à¤¡à¥à¤šà¥‡à¤°à¥€"},
        // {"answer_id":"28","answer_english":"Punjab","answer_hindi":"à¤ªà¤‚à¤œà¤¾à¤¬"},
        // {"answer_id":"29","answer_english":"Rajasthan","answer_hindi":"à¤°à¤¾à¤œà¤¸à¥à¤¥à¤¾à¤¨"},
        // {"answer_id":"30","answer_english":"Sikkim","answer_hindi":"à¤¸à¤¿à¤•à¥à¤•à¤¿à¤®"},
        // {"answer_id":"31","answer_english":"Tamil Nadu","answer_hindi":"à¤¤à¤®à¤¿à¤²à¤¨à¤¾à¤¡à¥"},
        // {"answer_id":"32","answer_english":"Telangana","answer_hindi":"à¤¤à¥‡à¤²à¤‚à¤—à¤¾à¤¨à¤¾"},
        // {"answer_id":"33","answer_english":"Tripura","answer_hindi":"à¤¤à¥à¤°à¤¿à¤ªà¥à¤°à¤¾"},
        // {"answer_id":"34","answer_english":"Uttar Pradesh","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
        // {"answer_id":"35","answer_english":"Uttarakhand","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤°à¤¾à¤–à¤‚à¤¡"},
        // {"answer_id":"36","answer_english":"West Bengal","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤¬à¤‚à¤—à¤¾à¤²"},
        // {"answer_id":"38","answer_english":"Ladakh","answer_hindi":"à¤²à¤¦à¥à¤¦à¤¾à¤–"}
    ];

    $scope.districts = [
        {"answer_id":"590","answer_english":"Adilabad","answer_hindi":"à¤†à¤¦à¤¿à¤²à¤¾à¤¬à¤¾à¤¦","parent_id":"32"},
{"answer_id":"363","answer_english":"Agar Malwa","answer_hindi":"à¤†à¤—à¤° à¤®à¤¾à¤²à¤µà¤¾","parent_id":"20"},
{"answer_id":"631","answer_english":"Agra","answer_hindi":"à¤†à¤—à¤°à¤¾","parent_id":"34"},
{"answer_id":"159","answer_english":"Ahmedabad","answer_hindi":"à¤…à¤¹à¤®à¤¦à¤¾à¤¬à¤¾à¤¦","parent_id":"11"},
{"answer_id":"373","answer_english":"Ahmednagar","answer_hindi":"à¤…à¤¹à¤®à¤¦à¤¨à¤—à¤°","parent_id":"21"},
{"answer_id":"436","answer_english":"Aizawl","answer_hindi":"à¤…à¤‡à¤œà¤¼à¥‹à¤²","parent_id":"24"},
{"answer_id":"515","answer_english":"Ajmer","answer_hindi":"à¤…à¤œà¤®à¥‡à¤°","parent_id":"29"},
{"answer_id":"374","answer_english":"Akola","answer_hindi":"à¤…à¤•à¥‹à¤²à¤¾","parent_id":"21"},
{"answer_id":"301","answer_english":"Alappuzha","answer_hindi":"à¤†à¤²à¤¾à¤ªà¥à¤ªà¥à¤¡à¤¼à¤¾","parent_id":"17"},
{"answer_id":"632","answer_english":"Aligarh","answer_hindi":"à¤…à¤²à¥€à¤—à¤¢","parent_id":"34"},
{"answer_id":"719","answer_english":"Alipurduar","answer_hindi":"à¤…à¤²à¥€à¤ªà¥à¤°à¤¦à¥à¤°à¤¾à¤°","parent_id":"36"},
{"answer_id":"331","answer_english":"Alirajpur ","answer_hindi":"à¤…à¤²à¥€à¤°à¤¾à¤œà¤ªà¥à¤°","parent_id":"20"},
{"answer_id":"633","answer_english":"Allahabad","answer_hindi":"à¤‡à¤²à¤¾à¤¹à¤¾à¤¬à¤¾à¤¦\/à¤ªà¥à¤°à¤¯à¤¾à¤—à¤°à¤¾à¤œ","parent_id":"34"},
{"answer_id":"706","answer_english":"Almora","answer_hindi":"à¤…à¤²à¥à¤®à¥‹à¤¡à¤¼à¤¾","parent_id":"35"},
{"answer_id":"516","answer_english":"Alwar","answer_hindi":"à¤…à¤²à¤µà¤°","parent_id":"29"},
{"answer_id":"192","answer_english":"Ambala","answer_hindi":"à¤…à¤®à¥à¤¬à¤¾à¤²à¤¾","parent_id":"12"},
{"answer_id":"634","answer_english":"Ambedkar Nagar","answer_hindi":"à¤…à¤®à¥à¤¬à¥‡à¤¡à¤•à¤°à¤¨à¤—à¤°","parent_id":"34"},
{"answer_id":"635","answer_english":"Amethi","answer_hindi":"à¤…à¤®à¥‡à¤ à¥€Â ","parent_id":"34"},
{"answer_id":"375","answer_english":"Amravati","answer_hindi":"à¤…à¤®à¤°à¤¾à¤µà¤¤à¥€","parent_id":"21"},
{"answer_id":"160","answer_english":"Amreli","answer_hindi":"à¤…à¤®à¤°à¥‡à¤²à¥€","parent_id":"11"},
{"answer_id":"493","answer_english":"Amritsar","answer_hindi":"à¤…à¤®à¥ƒà¤¤à¤¸à¤°","parent_id":"28"},
{"answer_id":"636","answer_english":"Amroha","answer_hindi":"à¤…à¤®à¤°à¥‹à¤¹à¤¾Â ","parent_id":"34"},
{"answer_id":"161","answer_english":"Anand","answer_hindi":"à¤†à¤£à¤‚à¤¦","parent_id":"11"},
{"answer_id":"1","answer_english":"Anantapur","answer_hindi":"à¤…à¤¨à¤‚à¤¤à¤ªà¥à¤°","parent_id":"1"},
{"answer_id":"226","answer_english":"Anantnag","answer_hindi":"à¤…à¤¨à¤¨à¥à¤¤à¤¨à¤¾à¤—","parent_id":"14"},
{"answer_id":"459","answer_english":"Angul","answer_hindi":"à¤…à¤¨à¥à¤—à¥à¤²","parent_id":"26"},
{"answer_id":"17","answer_english":"Anjaw","answer_hindi":"à¤…à¤‚à¤œà¥‰","parent_id":"3"},
{"answer_id":"360","answer_english":"Anuppur ","answer_hindi":"à¤…à¤¨à¥‚à¤ªà¤ªà¥à¤°","parent_id":"20"},
{"answer_id":"76","answer_english":"Araria","answer_hindi":"à¤…à¤°à¤°à¤¿à¤¯à¤¾","parent_id":"5"},
{"answer_id":"162","answer_english":"Aravalli","answer_hindi":"à¤…à¤°à¤¾à¤µà¤²à¥€","parent_id":"11"},
{"answer_id":"552","answer_english":"Ariyalur","answer_hindi":"à¤…à¤°à¤¿à¤¯à¤¾à¤²à¥‚à¤°","parent_id":"31"},
{"answer_id":"77","answer_english":"Arwal","answer_hindi":"à¤…à¤°à¤µà¤²","parent_id":"5"},
{"answer_id":"327","answer_english":"Ashoknagar","answer_hindi":"à¤…à¤¶à¥‹à¤• à¤¨à¤—à¤°","parent_id":"20"},
{"answer_id":"637","answer_english":"Auraiya","answer_hindi":"à¤”à¤°à¥ˆà¤¯à¤¾","parent_id":"34"},
{"answer_id":"78","answer_english":"Aurangabad","answer_hindi":"à¤”à¤°à¤‚à¤—à¤¾à¤¬à¤¾à¤¦","parent_id":"5"},
{"answer_id":"376","answer_english":"Aurangabad","answer_hindi":"à¤”à¤°à¤‚à¤—à¤¾à¤¬à¤¾à¤¦","parent_id":"21"},
{"answer_id":"638","answer_english":"Azamgarh","answer_hindi":"à¤†à¤œà¤®à¤—à¤¢","parent_id":"34"},
{"answer_id":"270","answer_english":"Bagalkot","answer_hindi":"à¤¬à¤¾à¤—à¤²à¤•à¥‹à¤Ÿ","parent_id":"16"},
{"answer_id":"707","answer_english":"Bageshwar","answer_hindi":"à¤¬à¤¾à¤—à¥‡à¤¶à¥à¤µà¤°","parent_id":"35"},
{"answer_id":"639","answer_english":"Bagpat","answer_hindi":"à¤¬à¤¾à¤—à¤ªà¤¤Â ","parent_id":"34"},
{"answer_id":"640","answer_english":"Bahraich","answer_hindi":"à¤¬à¤¹à¤°à¤¾à¤‡à¤š","parent_id":"34"},
{"answer_id":"43","answer_english":"Bajali","answer_hindi":"à¤¬à¤œà¤¾à¤²à¥€","parent_id":"4"},
{"answer_id":"42","answer_english":"Baksa","answer_hindi":"à¤¬à¤•à¥à¤¸à¤¾","parent_id":"4"},
{"answer_id":"339","answer_english":"Balaghat ","answer_hindi":"à¤¬à¤¾à¤²à¤¾à¤˜à¤¾à¤Ÿ","parent_id":"20"},
{"answer_id":"461","answer_english":"Balangir","answer_hindi":"à¤¬à¤²à¤¾à¤‚à¤—à¤¿à¤°","parent_id":"26"},
{"answer_id":"641","answer_english":"Balarampur","answer_hindi":"à¤¬à¤²à¤°à¤¾à¤®à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"463","answer_english":"Balasore","answer_hindi":"à¤¬à¤¾à¤²à¥‡à¤¶à¥à¤µà¤°","parent_id":"26"},
{"answer_id":"642","answer_english":"Ballia","answer_hindi":"à¤¬à¤²à¤¿à¤¯à¤¾","parent_id":"34"},
{"answer_id":"115","answer_english":"Balod","answer_hindi":"à¤¬à¤¾à¤²à¥‹à¤¦","parent_id":"7"},
{"answer_id":"116","answer_english":"Baloda Bazar","answer_hindi":"à¤¬à¤²à¥Œà¤¦à¤¾ à¤¬à¤¾à¤œà¤¾à¤°","parent_id":"7"},
{"answer_id":"117","answer_english":"Balrampur","answer_hindi":"à¤¬à¤²à¤°à¤¾à¤®à¤ªà¥à¤°","parent_id":"7"},
{"answer_id":"163","answer_english":"Banaskantha","answer_hindi":"à¤¬à¤¨à¤¾à¤¸à¤•à¤¾à¤‚à¤ à¤¾","parent_id":"11"},
{"answer_id":"643","answer_english":"Banda","answer_hindi":"à¤¬à¤¾à¤à¤¦à¤¾","parent_id":"34"},
{"answer_id":"228","answer_english":"Bandipora","answer_hindi":"à¤¬à¤¾à¤‚à¤¦à¥€à¤ªà¥à¤°à¤¾","parent_id":"14"},
{"answer_id":"272","answer_english":"Bangalore Rural","answer_hindi":"à¤¬à¤‚à¤—à¤²à¥‹à¤° à¤—à¥à¤°à¤¾à¤®à¥€à¤£","parent_id":"16"},
{"answer_id":"271","answer_english":"Bangalore Urban","answer_hindi":"à¤¬à¤‚à¤—à¤²à¥‹à¤° à¤¶à¤¹à¤°à¥€","parent_id":"16"},
{"answer_id":"79","answer_english":"Banka","answer_hindi":"à¤¬à¤¾à¤à¤•à¤¾","parent_id":"5"},
{"answer_id":"720","answer_english":"Bankura","answer_hindi":"à¤¬à¤¾à¤à¤•à¥à¤¡à¤¼à¤¾","parent_id":"36"},
{"answer_id":"519","answer_english":"Banswara","answer_hindi":"à¤¬à¤¾à¤‚à¤¸à¤µà¤¾à¤¡à¤¼à¤¾","parent_id":"29"},
{"answer_id":"644","answer_english":"Barabanki","answer_hindi":"à¤¬à¤¾à¤°à¤¾à¤¬à¤‚à¤•à¥€","parent_id":"34"},
{"answer_id":"229","answer_english":"Baramulla","answer_hindi":"à¤¬à¤¾à¤°à¤¾à¤®à¥‚à¤²à¤¾","parent_id":"14"},
{"answer_id":"521","answer_english":"Baran","answer_hindi":"à¤¬à¤¾à¤°à¤¾à¤‚","parent_id":"29"},
{"answer_id":"645","answer_english":"Bareilly","answer_hindi":"à¤¬à¤°à¥‡à¤²à¥€","parent_id":"34"},
{"answer_id":"462","answer_english":"Bargarh","answer_hindi":"à¤¬à¤°à¤—à¤¢à¤¼","parent_id":"26"},
{"answer_id":"518","answer_english":"Barmer","answer_hindi":"à¤¬à¤¾à¤¡à¤¼à¤®à¥‡à¤°","parent_id":"29"},
{"answer_id":"494","answer_english":"Barnala","answer_hindi":"à¤¬à¤°à¤¨à¤¾à¤²à¤¾","parent_id":"28"},
{"answer_id":"44","answer_english":"Barpeta","answer_hindi":"à¤¬à¤¾à¤°à¤ªà¥‡à¤Ÿà¤¾","parent_id":"4"},
{"answer_id":"332","answer_english":"Barwani ","answer_hindi":"à¤¬à¤¡à¤¼à¤µà¤¾à¤¨à¥€","parent_id":"20"},
{"answer_id":"118","answer_english":"Bastar","answer_hindi":"à¤¬à¤¸à¥à¤¤à¤°","parent_id":"7"},
{"answer_id":"646","answer_english":"Basti","answer_hindi":"à¤¬à¤¸à¥à¤¤à¥€","parent_id":"34"},
{"answer_id":"495","answer_english":"Bathinda","answer_hindi":"à¤­à¤Ÿà¤¿à¤£à¥à¤¡à¤¾","parent_id":"28"},
{"answer_id":"377","answer_english":"Beed","answer_hindi":"à¤¬à¥€à¤¡","parent_id":"21"},
{"answer_id":"80","answer_english":"Begusarai","answer_hindi":"à¤¬à¥‡à¤—à¥‚à¤¸à¤°à¤¾à¤¯","parent_id":"5"},
{"answer_id":"273","answer_english":"Belgaum","answer_hindi":"à¤¬à¥‡à¤²à¤—à¤¾à¤®","parent_id":"16"},
{"answer_id":"274","answer_english":"Bellary","answer_hindi":"à¤¬à¥‡à¤²à¥à¤²à¤¾à¤°à¥€","parent_id":"16"},
{"answer_id":"119","answer_english":"Bemetara","answer_hindi":"à¤¬à¥‡à¤®à¥‡à¤¤à¤°à¤¾","parent_id":"7"},
{"answer_id":"347","answer_english":"Betul ","answer_hindi":"à¤¬à¥ˆà¤¤à¥‚à¤²","parent_id":"20"},
{"answer_id":"647","answer_english":"Bhadohi","answer_hindi":"à¤­à¤¦à¥‹à¤¹à¥€Â ","parent_id":"34"},
{"answer_id":"592","answer_english":"Bhadradri Kothagudem","answer_hindi":"à¤­à¤¦à¥à¤°à¤¾à¤¦à¥à¤°à¥€ à¤•à¥‹à¤ à¤¾à¤—à¥à¤¡à¤®","parent_id":"32"},
{"answer_id":"464","answer_english":"Bhadrak","answer_hindi":"à¤­à¤¦à¥à¤°à¤•","parent_id":"26"},
{"answer_id":"81","answer_english":"Bhagalpur","answer_hindi":"à¤­à¤¾à¤—à¤²à¤ªà¥à¤°","parent_id":"5"},
{"answer_id":"378","answer_english":"Bhandara","answer_hindi":"à¤­à¤‚à¤¡à¤¾à¤°à¤¾","parent_id":"21"},
{"answer_id":"520","answer_english":"Bharatpur","answer_hindi":"à¤­à¤°à¤¤à¤ªà¥à¤°","parent_id":"29"},
{"answer_id":"164","answer_english":"Bharuch","answer_hindi":"à¤­à¤°à¥à¤š","parent_id":"11"},
{"answer_id":"165","answer_english":"Bhavnagar","answer_hindi":"à¤­à¤¾à¤µà¤¨à¤—à¤°","parent_id":"11"},
{"answer_id":"523","answer_english":"Bhilwara","answer_hindi":"à¤­à¥€à¤²à¤µà¤¾à¤¡à¤¼à¤¾","parent_id":"29"},
{"answer_id":"325","answer_english":"Bhind ","answer_hindi":"à¤­à¤¿à¤‚à¤¡","parent_id":"20"},
{"answer_id":"193","answer_english":"Bhiwani","answer_hindi":"à¤­à¤¿à¤µà¤¾à¤¨à¥€","parent_id":"12"},
{"answer_id":"82","answer_english":"Bhojpur","answer_hindi":"à¤­à¥‹à¤œà¤ªà¥à¤°","parent_id":"5"},
{"answer_id":"318","answer_english":"Bhopal ","answer_hindi":"à¤­à¥‹à¤ªà¤¾à¤²","parent_id":"20"},
{"answer_id":"275","answer_english":"Bidar","answer_hindi":"à¤¬à¥€à¤¦à¤°","parent_id":"16"},
{"answer_id":"276","answer_english":"Bijapur","answer_hindi":"à¤¬à¥€à¤œà¤¾à¤ªà¥à¤°","parent_id":"16"},
{"answer_id":"120","answer_english":"Bijapur","answer_hindi":"à¤¬à¥€à¤œà¤¾à¤ªà¥à¤°","parent_id":"7"},
{"answer_id":"648","answer_english":"Bijnor","answer_hindi":"à¤¬à¤¿à¤œà¤¨à¥Œà¤°","parent_id":"34"},
{"answer_id":"517","answer_english":"Bikaner","answer_hindi":"à¤¬à¥€à¤•à¤¾à¤¨à¥‡à¤°","parent_id":"29"},
{"answer_id":"121","answer_english":"Bilaspur","answer_hindi":"à¤¬à¤¿à¤²à¤¾à¤¸à¤ªà¥à¤°","parent_id":"7"},
{"answer_id":"214","answer_english":"Bilaspur","answer_hindi":"à¤¬à¤¿à¤²à¤¾à¤¸à¤ªà¥à¤°","parent_id":"13"},
{"answer_id":"723","answer_english":"Birbhum","answer_hindi":"à¤¬à¥€à¤°à¤­à¥‚à¤®","parent_id":"36"},
{"answer_id":"409","answer_english":"Bishnupur","answer_hindi":"à¤¬à¤¿à¤·à¥à¤£à¥à¤ªà¥à¤° à¤œà¤¿à¤²à¤¾","parent_id":"22"},
{"answer_id":"45","answer_english":"Biswanath","answer_hindi":"à¤¬à¤¿à¤¶à¥à¤µà¤¨à¤¾à¤¥","parent_id":"4"},
{"answer_id":"254","answer_english":"Bokaro","answer_hindi":"à¤¬à¥‹à¤•à¤¾à¤°à¥‹","parent_id":"15"},
{"answer_id":"46","answer_english":"Bongaigaon","answer_hindi":"à¤¬à¤‚à¤—à¤¾à¤ˆà¤—à¤¾à¤à¤µ","parent_id":"4"},
{"answer_id":"166","answer_english":"Botad","answer_hindi":"à¤¬à¥‹à¤Ÿà¤¾à¤¡","parent_id":"11"},
{"answer_id":"460","answer_english":"Boudh","answer_hindi":"à¤¬à¥Œà¤§","parent_id":"26"},
{"answer_id":"649","answer_english":"Budaun","answer_hindi":"à¤¬à¤¦à¤¾à¤¯à¥‚à¤‚Â ","parent_id":"34"},
{"answer_id":"227","answer_english":"Budgam","answer_hindi":"à¤¬à¤¡à¤¼à¤—à¤¾à¤‚à¤µ","parent_id":"14"},
{"answer_id":"650","answer_english":"Bulandshahr","answer_hindi":"à¤¬à¥à¤²à¤‚à¤¦à¤¶à¤¹à¤°","parent_id":"34"},
{"answer_id":"379","answer_english":"Buldhana","answer_hindi":"à¤¬à¥à¤²à¤¢à¤¾à¤£à¤¾","parent_id":"21"},
{"answer_id":"522","answer_english":"Bundi","answer_hindi":"à¤¬à¥‚à¤‚à¤¦à¥€","parent_id":"29"},
{"answer_id":"333","answer_english":"Burhanpur ","answer_hindi":"à¤¬à¥à¤°à¤¹à¤¾à¤¨à¤ªà¥à¤°","parent_id":"20"},
{"answer_id":"83","answer_english":"Buxar","answer_hindi":"à¤¬à¤•à¥à¤¸à¤°","parent_id":"5"},
{"answer_id":"47","answer_english":"Cachar","answer_hindi":"à¤•à¤›à¤°","parent_id":"4"},
{"answer_id":"147","answer_english":"Central Delhi ","answer_hindi":"à¤®à¤§à¥à¤¯ à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"370","answer_english":"Chachaura-Binaganj","answer_hindi":"à¤šà¤¾à¤šà¥Œà¤¡à¤¼à¤¾","parent_id":"20"},
{"answer_id":"277","answer_english":"Chamarajanagar","answer_hindi":"à¤šà¤¾à¤®à¤°à¤¾à¤œà¤¨à¤—à¤°","parent_id":"16"},
{"answer_id":"215","answer_english":"Chamba","answer_hindi":"à¤šà¤‚à¤¬à¤¾","parent_id":"13"},
{"answer_id":"708","answer_english":"Chamoli","answer_hindi":"à¤šà¤®à¥‹à¤²à¥€","parent_id":"35"},
{"answer_id":"709","answer_english":"Champawat","answer_hindi":"à¤šà¤®à¥à¤ªà¤¾à¤µà¤¤","parent_id":"35"},
{"answer_id":"443","answer_english":"Champhai","answer_hindi":"à¤šà¤®à¥à¤«à¤¾à¤ˆ","parent_id":"24"},
{"answer_id":"651","answer_english":"Chandauli","answer_hindi":"à¤šà¤‚à¤¦à¥Œà¤²à¥€","parent_id":"34"},
{"answer_id":"415","answer_english":"Chandel","answer_hindi":"à¤šà¤¨à¥à¤¡à¥‡à¤² à¤œà¤¿à¤²à¤¾","parent_id":"22"},
{"answer_id":"114","answer_english":"ChandigarhÂ ","answer_hindi":"à¤šà¤£à¥à¤¡à¥€à¤—à¤¢à¤¼","parent_id":"6"},
{"answer_id":"380","answer_english":"Chandrapur","answer_hindi":"à¤šà¤‚à¤¦à¥à¤°à¤ªà¥à¤°","parent_id":"21"},
{"answer_id":"18","answer_english":"Changlang","answer_hindi":"à¤šà¤¾à¤‚à¤—à¤²à¤¾à¤‚à¤—","parent_id":"3"},
{"answer_id":"48","answer_english":"Charaideo","answer_hindi":"à¤šà¤°à¤¾à¤‡à¤¦à¥‡à¤‰","parent_id":"4"},
{"answer_id":"194","answer_english":"Charkhi Dadri","answer_hindi":"à¤šà¤°à¤–à¥€ à¤¦à¤¾à¤¦à¤°à¥€","parent_id":"12"},
{"answer_id":"249","answer_english":"Chatra","answer_hindi":"à¤šà¤¤à¤°à¤¾","parent_id":"15"},
{"answer_id":"553","answer_english":"Chengalpattu","answer_hindi":"à¤šà¥‡à¤‚à¤—à¤²à¤ªà¤Ÿà¥à¤Ÿà¥","parent_id":"31"},
{"answer_id":"554","answer_english":"Chennai","answer_hindi":"à¤šà¥‡à¤¨à¥à¤¨à¤ˆ","parent_id":"31"},
{"answer_id":"354","answer_english":"Chhatarpur ","answer_hindi":"à¤›à¤¤à¤°à¤ªà¥à¤°","parent_id":"20"},
{"answer_id":"340","answer_english":"Chhindwara ","answer_hindi":"à¤›à¤¿à¤‚à¤¦à¤µà¤¾à¤¡à¤¼à¤¾","parent_id":"20"},
{"answer_id":"167","answer_english":"Chhota Udaipur","answer_hindi":"à¤›à¥‹à¤Ÿà¤¾ à¤‰à¤¦à¤¯à¤ªà¥à¤°","parent_id":"11"},
{"answer_id":"278","answer_english":"Chikballapur","answer_hindi":"à¤šà¤¿à¤•à¤¬à¤²à¤¾à¤ªà¥à¤°à¤¾","parent_id":"16"},
{"answer_id":"279","answer_english":"Chikmagalur","answer_hindi":"à¤šà¤¿à¤•à¤®à¤—à¤²à¥‚à¤°","parent_id":"16"},
{"answer_id":"49","answer_english":"Chirang","answer_hindi":"à¤šà¤¿à¤°à¤¾à¤‚à¤—","parent_id":"4"},
{"answer_id":"280","answer_english":"Chitradurga","answer_hindi":"à¤šà¤¿à¤¤à¥à¤°à¤¦à¥à¤°à¥à¤—","parent_id":"16"},
{"answer_id":"652","answer_english":"Chitrakoot","answer_hindi":"à¤šà¤¿à¤¤à¥à¤°à¤•à¥‚à¤Ÿ","parent_id":"34"},
{"answer_id":"2","answer_english":"Chittoor","answer_hindi":"à¤šà¤¿à¤¤à¥à¤¤à¥‚à¤°","parent_id":"1"},
{"answer_id":"525","answer_english":"Chittorgarh","answer_hindi":"à¤šà¤¿à¤¤à¥à¤¤à¥Œà¤¡à¤¼à¤—à¤¢à¤¼","parent_id":"29"},
{"answer_id":"416","answer_english":"Churachandpur","answer_hindi":"à¤šà¥à¤°à¤¾à¤šà¤¾à¤‚à¤¦à¤ªà¥à¤° à¤œà¤¿à¤²à¤¾","parent_id":"22"},
{"answer_id":"524","answer_english":"Churu","answer_hindi":"à¤šà¥à¤°à¥","parent_id":"29"},
{"answer_id":"555","answer_english":"Coimbatore","answer_hindi":"à¤•à¥‹à¤¯à¤®à¥à¤¬à¤¤à¥‚à¤°","parent_id":"31"},
{"answer_id":"724","answer_english":"Cooch Behar","answer_hindi":"à¤•à¥‚à¤šà¤¬à¤¿à¤¹à¤¾à¤°","parent_id":"36"},
{"answer_id":"556","answer_english":"Cuddalore","answer_hindi":"à¤•à¥à¤¡à¥à¤¡à¤²à¥‹à¤°","parent_id":"31"},
{"answer_id":"465","answer_english":"Cuttack","answer_hindi":"à¤•à¤Ÿà¤•","parent_id":"26"},
{"answer_id":"145","answer_english":"Dadra and Nagar Haveli","answer_hindi":"à¤¦à¤¾à¤¦à¤°à¤¾ à¤¨à¤—à¤° à¤¹à¤µà¥‡à¤²à¥€","parent_id":"8"},
{"answer_id":"168","answer_english":"Dahod","answer_hindi":"à¤¦à¤¾à¤¹à¥‹à¤¦","parent_id":"11"},
{"answer_id":"725","answer_english":"Dakshin Dinajpur","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤¦à¤¿à¤¨à¤¾à¤œà¤ªà¥à¤°","parent_id":"36"},
{"answer_id":"281","answer_english":"Dakshina Kannada","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤•à¤¨à¥à¤¨à¤¡à¤¼","parent_id":"16"},
{"answer_id":"143","answer_english":"Daman","answer_hindi":"à¤¦à¤®à¤¨Â ","parent_id":"8"},
{"answer_id":"355","answer_english":"Damoh ","answer_hindi":"à¤¦à¤®à¥‹à¤¹","parent_id":"20"},
{"answer_id":"169","answer_english":"Dang","answer_hindi":"à¤¡à¤¾à¤‚à¤—","parent_id":"11"},
{"answer_id":"122","answer_english":"Dantewada","answer_hindi":"à¤¦à¤¨à¥à¤¤à¥‡à¤µà¤¾à¤¡à¤¼à¤¾ Â (à¤¦à¤•à¥à¤·à¤¿à¤£ à¤¬à¤¸à¥à¤¤à¤°)","parent_id":"7"},
{"answer_id":"84","answer_english":"Darbhanga","answer_hindi":"à¤¦à¤°à¤­à¤‚à¤—à¤¾","parent_id":"5"},
{"answer_id":"726","answer_english":"Darjeeling","answer_hindi":"à¤¦à¤¾à¤°à¥à¤œà¤¿à¤²à¤¿à¤‚à¤—","parent_id":"36"},
{"answer_id":"50","answer_english":"Darrang","answer_hindi":"à¤¦à¤¾à¤°à¤¾à¤‚à¤—","parent_id":"4"},
{"answer_id":"329","answer_english":"Datia ","answer_hindi":"à¤¦à¤¤à¤¿à¤¯à¤¾","parent_id":"20"},
{"answer_id":"526","answer_english":"Dausa","answer_hindi":"à¤¦à¥Œà¤¸à¤¾","parent_id":"29"},
{"answer_id":"282","answer_english":"Davanagere","answer_hindi":"à¤¦à¤¾à¤µà¤£à¤—à¥‡à¤°à¥‡","parent_id":"16"},
{"answer_id":"466","answer_english":"Debagarh","answer_hindi":"à¤¦à¥‡à¤µà¤—à¤¡à¤¼","parent_id":"26"},
{"answer_id":"710","answer_english":"Dehradun","answer_hindi":"à¤¦à¥‡à¤¹à¤°à¤¾à¤¦à¥‚à¤¨","parent_id":"35"},
{"answer_id":"265","answer_english":"Deoghar","answer_hindi":"à¤¦à¥‡à¤µà¤˜à¤°","parent_id":"15"},
{"answer_id":"653","answer_english":"Deoria","answer_hindi":"à¤¦à¥‡à¤µà¤°à¤¿à¤¯à¤¾","parent_id":"34"},
{"answer_id":"170","answer_english":"Devbhoomi Dwarka","answer_hindi":"à¤¦à¥‡à¤µà¤­à¥‚à¤®à¤¿ à¤¦à¥à¤µà¤¾à¤°à¤•à¤¾","parent_id":"11"},
{"answer_id":"364","answer_english":"Dewas","answer_hindi":"à¤¦à¥‡à¤µà¤¾à¤¸","parent_id":"20"},
{"answer_id":"623","answer_english":"Dhalai","answer_hindi":"à¤§à¤²à¤¾à¤ˆ","parent_id":"33"},
{"answer_id":"123","answer_english":"Dhamtari","answer_hindi":"à¤§à¤®à¤¤à¤°à¥€","parent_id":"7"},
{"answer_id":"255","answer_english":"Dhanbad","answer_hindi":"à¤§à¤¨à¤¬à¤¾à¤¦","parent_id":"15"},
{"answer_id":"335","answer_english":"Dhar ","answer_hindi":"à¤§à¤¾à¤°","parent_id":"20"},
{"answer_id":"557","answer_english":"Dharmapuri","answer_hindi":"à¤§à¤°à¥à¤®à¤ªà¥à¤°à¥€","parent_id":"31"},
{"answer_id":"283","answer_english":"Dharwad","answer_hindi":"à¤§à¤¾à¤°à¤µà¤¾à¤¡à¤¼","parent_id":"16"},
{"answer_id":"51","answer_english":"Dhemaji","answer_hindi":"à¤§à¥‡à¤®à¤¾à¤œà¥€","parent_id":"4"},
{"answer_id":"467","answer_english":"Dhenkanal","answer_hindi":"à¤¢à¥‡à¤¨à¥à¤•à¤¾à¤¨à¤¾à¤²","parent_id":"26"},
{"answer_id":"527","answer_english":"Dholpur","answer_hindi":"à¤§à¥Œà¤²à¤ªà¥à¤°","parent_id":"29"},
{"answer_id":"52","answer_english":"Dhubri","answer_hindi":"à¤§à¥à¤¬à¤°à¥€","parent_id":"4"},
{"answer_id":"381","answer_english":"Dhule","answer_hindi":"à¤§à¥à¤²à¥‡","parent_id":"21"},
{"answer_id":"53","answer_english":"Dibrugarh","answer_hindi":"à¤¡à¤¿à¤¬à¥à¤°à¥‚à¤—à¤¢à¤¼","parent_id":"4"},
{"answer_id":"54","answer_english":"Dima Hasao","answer_hindi":"à¤¦à¤¿à¤®à¤¾ à¤¹à¤¸à¤¾à¤“","parent_id":"4"},
{"answer_id":"447","answer_english":"Dimapur","answer_hindi":"à¤¦à¥€à¤®à¤¾à¤ªà¥à¤°","parent_id":"25"},
{"answer_id":"558","answer_english":"Dindigul","answer_hindi":"à¤¡à¤¿à¤‚à¤¡à¤¿à¤—à¥à¤²","parent_id":"31"},
{"answer_id":"346","answer_english":"Dindori ","answer_hindi":"à¤¡à¤¿à¤‚à¤¡à¥Œà¤°à¥€","parent_id":"20"},
{"answer_id":"144","answer_english":"Diu","answer_hindi":"à¤¦à¥€à¤µÂ ","parent_id":"8"},
{"answer_id":"230","answer_english":"Doda","answer_hindi":"à¤¡à¥‹à¤¡à¤¾","parent_id":"14"},
{"answer_id":"266","answer_english":"Dumka","answer_hindi":"à¤¦à¥à¤®à¤•à¤¾","parent_id":"15"},
{"answer_id":"528","answer_english":"Dungarpur","answer_hindi":"à¤¡à¥‚à¤‚à¤—à¤°à¤ªà¥à¤°","parent_id":"29"},
{"answer_id":"124","answer_english":"Durg","answer_hindi":"à¤¦à¥à¤°à¥à¤—","parent_id":"7"},
{"answer_id":"85","answer_english":"East Champaran","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µà¥€ à¤šà¤®à¥à¤ªà¤¾à¤°à¤£ à¤œà¤¿à¤²à¤¾","parent_id":"5"},
{"answer_id":"148","answer_english":"East Delhi","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µà¥€ à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"429","answer_english":"East Garo Hills","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µà¥€ à¤—à¤¾à¤°à¥‹ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"3","answer_english":"East Godavari","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µ à¤—à¥‹à¤¦à¤¾à¤µà¤°à¥€","parent_id":"1"},
{"answer_id":"434","answer_english":"East Jaintia Hills","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µ à¤œà¤¯à¤‚à¤¤à¤¿à¤¯à¤¾ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"19","answer_english":"East Kameng","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µ à¤•à¤®à¥‡à¤‚à¤—","parent_id":"3"},
{"answer_id":"425","answer_english":"East Khasi Hills","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µà¥€ à¤–à¤¾à¤¸à¥€ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"20","answer_english":"East Siang","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µ à¤¸à¤¿à¤¯à¤¾à¤‚à¤—","parent_id":"3"},
{"answer_id":"548","answer_english":"East Sikkim","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µÂ à¤¸à¤¿à¤•à¥à¤•à¤¿à¤®","parent_id":"30"},
{"answer_id":"263","answer_english":"East Singhbhum","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µà¥€ à¤¸à¤¿à¤‚à¤¹à¤­à¥‚à¤®","parent_id":"15"},
{"answer_id":"302","answer_english":"Ernakulam","answer_hindi":"à¤à¤°à¥à¤¨à¤¾à¤•à¥à¤²à¤®","parent_id":"17"},
{"answer_id":"559","answer_english":"Erode","answer_hindi":"à¤ˆà¤°à¥‹à¤¡","parent_id":"31"},
{"answer_id":"654","answer_english":"Etah","answer_hindi":"à¤à¤Ÿà¤¾","parent_id":"34"},
{"answer_id":"655","answer_english":"Etawah","answer_hindi":"à¤‡à¤Ÿà¤¾à¤µà¤¾","parent_id":"34"},
{"answer_id":"656","answer_english":"Faizabad","answer_hindi":"à¤«à¥ˆà¤œà¤¼à¤¾à¤¬à¤¾à¤¦ à¤¶à¤¹à¤° (à¤…à¤¯à¥‹à¤§à¥à¤¯à¤¾)","parent_id":"34"},
{"answer_id":"195","answer_english":"Faridabad","answer_hindi":"à¤«à¤°à¥€à¤¦à¤¾à¤¬à¤¾à¤¦","parent_id":"12"},
{"answer_id":"497","answer_english":"Faridkot","answer_hindi":"à¤«à¤°à¥€à¤¦à¤•à¥‹à¤Ÿ","parent_id":"28"},
{"answer_id":"657","answer_english":"Farrukhabad","answer_hindi":"à¤«à¤¼à¤°à¥à¤°à¥‚à¤–à¤¼à¤¾à¤¬à¤¾à¤¦","parent_id":"34"},
{"answer_id":"196","answer_english":"Fatehabad","answer_hindi":"à¤«à¤¤à¥‡à¤¹à¤¾à¤¬à¤¾à¤¦","parent_id":"12"},
{"answer_id":"498","answer_english":"Fatehgarh Sahib","answer_hindi":"à¤«à¤¤à¥‡à¤¹à¤—à¤¢à¤¼ à¤¸à¤¾à¤¹à¤¿à¤¬","parent_id":"28"},
{"answer_id":"658","answer_english":"Fatehpur","answer_hindi":"à¤«à¤¤à¥‡à¤¹à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"499","answer_english":"Fazilka","answer_hindi":"à¤«à¤¾à¤œà¤¼à¤¿à¤²à¥à¤•à¤¾Â ","parent_id":"28"},
{"answer_id":"659","answer_english":"Firozabad","answer_hindi":"à¤«à¤¼à¤¿à¤°à¥‹à¤œà¤¾à¤¬à¤¾à¤¦","parent_id":"34"},
{"answer_id":"496","answer_english":"Firozpur","answer_hindi":"à¤«à¤¿à¤°à¥‹à¤œà¤ªà¥à¤°","parent_id":"28"},
{"answer_id":"284","answer_english":"Gadag","answer_hindi":"à¤—à¤¦à¤—","parent_id":"16"},
{"answer_id":"382","answer_english":"Gadchiroli","answer_hindi":"à¤—à¤¡à¤šà¤¿à¤°à¥‹à¤²à¥€","parent_id":"21"},
{"answer_id":"469","answer_english":"Gajapati","answer_hindi":"à¤—à¤œà¤ªà¤¤à¤¿","parent_id":"26"},
{"answer_id":"231","answer_english":"Ganderbal","answer_hindi":"à¤—à¤¾à¤‚à¤¦à¤°à¤¬à¤²","parent_id":"14"},
{"answer_id":"171","answer_english":"Gandhinagar","answer_hindi":"à¤—à¤¾à¤‚à¤§à¥€à¤¨à¤—à¤°","parent_id":"11"},
{"answer_id":"529","answer_english":"Ganganagar","answer_hindi":"à¤¶à¥à¤°à¥€à¤—à¤‚à¤—à¤¾à¤¨à¤—à¤°","parent_id":"29"},
{"answer_id":"468","answer_english":"Ganjam","answer_hindi":"à¤—à¤‚à¤œà¤¾à¤®","parent_id":"26"},
{"answer_id":"246","answer_english":"Garhwa","answer_hindi":"à¤—à¤¢à¤µà¤¾","parent_id":"15"},
{"answer_id":"125","answer_english":"Gariaband","answer_hindi":"à¤—à¤°à¤¿à¤¯à¤¾à¤¬à¤‚à¤¦","parent_id":"7"},
{"answer_id":"126","answer_english":"Gaurella-Pendra-Marwahi","answer_hindi":"à¤—à¥Œà¤°à¥‡à¤²à¤¾-à¤ªà¥‡à¤£à¥à¤¡à¥à¤°à¤¾-à¤®à¤°à¤µà¤¾à¤¹à¥€","parent_id":"7"},
{"answer_id":"660","answer_english":"Gautam Buddha Nagar","answer_hindi":"à¤—à¥Œà¤¤à¤®à¤¬à¥à¤¦à¥à¤§ à¤¨à¤—à¤°","parent_id":"34"},
{"answer_id":"86","answer_english":"Gaya","answer_hindi":"à¤—à¤¯à¤¾","parent_id":"5"},
{"answer_id":"661","answer_english":"Ghaziabad","answer_hindi":"à¤—à¤¾à¤œà¤¿à¤¯à¤¾à¤¬à¤¾à¤¦","parent_id":"34"},
{"answer_id":"662","answer_english":"Ghazipur","answer_hindi":"à¤—à¤¼à¤¾à¤œà¤¼à¥€à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"172","answer_english":"Gir Somnath","answer_hindi":"à¤—à¤¿à¤° à¤¸à¥‹à¤®à¤¨à¤¾à¤¥","parent_id":"11"},
{"answer_id":"252","answer_english":"Giridih","answer_hindi":"à¤—à¤¿à¤°à¥€à¤¡à¥€à¤¹","parent_id":"15"},
{"answer_id":"55","answer_english":"Goalpara","answer_hindi":"à¤—à¥‹à¤µà¤¾à¤²à¤ªà¤¾à¤°à¤¾","parent_id":"4"},
{"answer_id":"268","answer_english":"Godda","answer_hindi":"à¤—à¥‹à¤¡à¥à¤¡à¤¾","parent_id":"15"},
{"answer_id":"56","answer_english":"Golaghat","answer_hindi":"à¤—à¥‹à¤²à¤¾à¤˜à¤¾à¤Ÿ","parent_id":"4"},
{"answer_id":"625","answer_english":"Gomati","answer_hindi":"à¤—à¥‹à¤®à¤¤à¥€","parent_id":"33"},
{"answer_id":"663","answer_english":"Gonda","answer_hindi":"à¤—à¥‹à¤‚à¤¡à¤¾","parent_id":"34"},
{"answer_id":"383","answer_english":"Gondia","answer_hindi":"à¤—à¥‹à¤‚à¤¦à¤¿à¤¯à¤¾","parent_id":"21"},
{"answer_id":"87","answer_english":"Gopalganj","answer_hindi":"à¤—à¥‹à¤ªà¤¾à¤²à¤—à¤‚à¤œ","parent_id":"5"},
{"answer_id":"664","answer_english":"Gorakhpur","answer_hindi":"à¤—à¥‹à¤°à¤–à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"285","answer_english":"Gulbarga","answer_hindi":"à¤—à¥à¤²à¤¬à¤°à¥à¤—","parent_id":"16"},
{"answer_id":"256","answer_english":"Gumla","answer_hindi":"à¤—à¥à¤®à¤²à¤¾","parent_id":"15"},
{"answer_id":"330","answer_english":"Guna ","answer_hindi":"à¤—à¥à¤¨à¤¾","parent_id":"20"},
{"answer_id":"4","answer_english":"Guntur","answer_hindi":"à¤—à¥à¤‚à¤Ÿà¥‚à¤°","parent_id":"1"},
{"answer_id":"500","answer_english":"Gurdaspur","answer_hindi":"à¤—à¥à¤°à¤¦à¤¾à¤¸à¤ªà¥à¤°","parent_id":"28"},
{"answer_id":"197","answer_english":"Gurgaon","answer_hindi":"à¤—à¥à¤°à¥à¤—à¥à¤°à¤¾à¤®","parent_id":"12"},
{"answer_id":"326","answer_english":"Gwalior ","answer_hindi":"à¤—à¥à¤µà¤¾à¤²à¤¿à¤¯à¤°","parent_id":"20"},
{"answer_id":"57","answer_english":"Hailakandi","answer_hindi":"à¤¹à¥ˆà¤²à¤¾à¤•à¤¾à¤‚à¤¡à¥€","parent_id":"4"},
{"answer_id":"665","answer_english":"Hamirpur","answer_hindi":"à¤¹à¤®à¥€à¤°à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"216","answer_english":"Hamirpur","answer_hindi":"à¤¹à¤®à¥€à¤°à¤ªà¥à¤°","parent_id":"13"},
{"answer_id":"530","answer_english":"Hanumangarh","answer_hindi":"à¤¹à¤¨à¥à¤®à¤¾à¤¨à¤—à¤¢à¤¼","parent_id":"29"},
{"answer_id":"666","answer_english":"Hapur","answer_hindi":"à¤¹à¤¾à¤ªà¥à¤¡à¤¼","parent_id":"34"},
{"answer_id":"348","answer_english":"Harda ","answer_hindi":"à¤¹à¤°à¤¦à¤¾","parent_id":"20"},
{"answer_id":"667","answer_english":"Hardoi","answer_hindi":"à¤¹à¤°à¤¦à¥‹à¤ˆ","parent_id":"34"},
{"answer_id":"711","answer_english":"Haridwar","answer_hindi":"à¤¹à¤°à¤¿à¤¦à¥à¤µà¤¾à¤°","parent_id":"35"},
{"answer_id":"286","answer_english":"Hassan","answer_hindi":"à¤¹à¤¾à¤¸à¤¨","parent_id":"16"},
{"answer_id":"668","answer_english":"Hathras","answer_hindi":"à¤¹à¤¾à¤¥à¤°à¤¸","parent_id":"34"},
{"answer_id":"287","answer_english":"Haveri","answer_hindi":"à¤¹à¤¾à¤µà¥‡à¤°à¥€","parent_id":"16"},
{"answer_id":"250","answer_english":"Hazaribagh","answer_hindi":"à¤¹à¤œà¤¾à¤°à¥€à¤¬à¤¾à¤—","parent_id":"15"},
{"answer_id":"384","answer_english":"Hingoli","answer_hindi":"à¤¹à¤¿à¤‚à¤—à¥‹à¤²à¥€","parent_id":"21"},
{"answer_id":"198","answer_english":"Hissar","answer_hindi":"à¤¹à¤¿à¤¸à¤¾à¤°","parent_id":"12"},
{"answer_id":"444","answer_english":"Hnahthial","answer_hindi":"à¤¹à¥à¤¨à¤¾à¤¹à¤¥à¤¿à¤†à¤²","parent_id":"24"},
{"answer_id":"58","answer_english":"Hojai","answer_hindi":"à¤¹à¥‹à¤œà¤¾à¤ˆ","parent_id":"4"},
{"answer_id":"727","answer_english":"Hooghly","answer_hindi":"à¤¹à¥à¤—à¤²à¥€","parent_id":"36"},
{"answer_id":"349","answer_english":"Hoshangabad ","answer_hindi":"à¤¹à¥‹à¤¶à¤‚à¤—à¤¾à¤¬à¤¾à¤¦","parent_id":"20"},
{"answer_id":"501","answer_english":"Hoshiarpur","answer_hindi":"à¤¹à¥‹à¤¶à¤¿à¤¯à¤¾à¤°à¤ªà¥à¤°","parent_id":"28"},
{"answer_id":"728","answer_english":"Howrah","answer_hindi":"à¤¹à¤¾à¤µà¤™à¤¾","parent_id":"36"},
{"answer_id":"593","answer_english":"Hyderabad","answer_hindi":"à¤¹à¥ˆà¤¦à¤°à¤¾à¤¬à¤¾à¤¦","parent_id":"32"},
{"answer_id":"303","answer_english":"Idukki","answer_hindi":"à¤‡à¤¡à¥à¤•à¥à¤•à¥€Â ","parent_id":"17"},
{"answer_id":"411","answer_english":"Imphal East","answer_hindi":"à¤‡à¤®à¥à¤«à¤¾à¤² à¤ªà¥‚à¤°à¥à¤µ","parent_id":"22"},
{"answer_id":"412","answer_english":"Imphal West","answer_hindi":"à¤‡à¤®à¥à¤«à¤¾à¤² à¤ªà¤¶à¥à¤šà¤¿à¤®","parent_id":"22"},
{"answer_id":"334","answer_english":"Indore ","answer_hindi":"à¤‡à¤¨à¥à¤¦à¥Œà¤°","parent_id":"20"},
{"answer_id":"341","answer_english":"Jabalpur ","answer_hindi":"à¤œà¤¬à¤²à¤ªà¥à¤°","parent_id":"20"},
{"answer_id":"472","answer_english":"Jagatsinghapur","answer_hindi":"à¤œà¤—à¤¤à¤¸à¤¿à¤‚à¤¹à¤ªà¥à¤°","parent_id":"26"},
{"answer_id":"594","answer_english":"Jagtial","answer_hindi":"à¤œà¤—à¤¿à¤¤à¥à¤¯à¤¾à¤²","parent_id":"32"},
{"answer_id":"534","answer_english":"Jaipur","answer_hindi":"à¤œà¤¯à¤ªà¥à¤°","parent_id":"29"},
{"answer_id":"535","answer_english":"Jaisalmer","answer_hindi":"à¤œà¥ˆà¤¸à¤²à¤®à¥‡à¤°","parent_id":"29"},
{"answer_id":"471","answer_english":"Jajpur","answer_hindi":"à¤œà¤¾à¤œà¤ªà¥à¤°","parent_id":"26"},
{"answer_id":"502","answer_english":"Jalandhar","answer_hindi":"à¤œà¤¾à¤²à¤‚à¤§à¤°","parent_id":"28"},
{"answer_id":"669","answer_english":"Jalaun","answer_hindi":"à¤œà¤²à¥Œà¤¨","parent_id":"34"},
{"answer_id":"385","answer_english":"Jalgaon","answer_hindi":"à¤œà¤³à¤—à¤¾à¤µ","parent_id":"21"},
{"answer_id":"386","answer_english":"Jalna","answer_hindi":"à¤œà¤¾à¤²à¤¨à¤¾","parent_id":"21"},
{"answer_id":"532","answer_english":"Jalore","answer_hindi":"à¤œà¤¾à¤²à¥Œà¤°","parent_id":"29"},
{"answer_id":"729","answer_english":"Jalpaiguri","answer_hindi":"à¤œà¤²à¤ªà¤¾à¤ˆà¤—à¥à¤™à¥€","parent_id":"36"},
{"answer_id":"232","answer_english":"Jammu","answer_hindi":"à¤œà¤®à¥à¤®à¥‚","parent_id":"14"},
{"answer_id":"173","answer_english":"Jamnagar","answer_hindi":"à¤œà¤¾à¤®à¤¨à¤—à¤°","parent_id":"11"},
{"answer_id":"264","answer_english":"Jamtara","answer_hindi":"à¤œà¤¾à¤®à¤¤à¤¾à¤¡à¤¼à¤¾","parent_id":"15"},
{"answer_id":"88","answer_english":"Jamui","answer_hindi":"à¤œà¤®à¥à¤ˆ","parent_id":"5"},
{"answer_id":"595","answer_english":"Jangaon","answer_hindi":"à¤œà¤¨à¤—à¤¾à¤à¤µ","parent_id":"32"},
{"answer_id":"127","answer_english":"Janjgir-Champa","answer_hindi":"à¤œà¤¾à¤‚à¤œà¤—à¥€à¤°-à¤šà¤¾à¤®à¥à¤ªà¤¾","parent_id":"7"},
{"answer_id":"128","answer_english":"Jashpur","answer_hindi":"à¤œà¤¶à¤ªà¥à¤°","parent_id":"7"},
{"answer_id":"670","answer_english":"Jaunpur","answer_hindi":"à¤œà¥Œà¤¨à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"596","answer_english":"Jayashankar Bhupalpally","answer_hindi":"à¤œà¤¯à¤¶à¤‚à¤•à¤° à¤­à¥‚à¤ªà¤²à¤ªà¤²à¥à¤²à¥€","parent_id":"32"},
{"answer_id":"89","answer_english":"Jehanabad","answer_hindi":"à¤œà¤¹à¤¾à¤¨à¤¾à¤¬à¤¾à¤¦","parent_id":"5"},
{"answer_id":"336","answer_english":"Jhabua ","answer_hindi":"à¤à¤¾à¤¬à¥à¤†","parent_id":"20"},
{"answer_id":"199","answer_english":"Jhajjar","answer_hindi":"à¤à¤œà¥à¤œà¤°","parent_id":"12"},
{"answer_id":"536","answer_english":"Jhalawar","answer_hindi":"à¤à¤¾à¤²à¤¾à¤µà¤¾à¤¡à¤¼","parent_id":"29"},
{"answer_id":"671","answer_english":"Jhansi","answer_hindi":"à¤à¤¾à¤à¤¸à¥€","parent_id":"34"},
{"answer_id":"730","answer_english":"Jhargram","answer_hindi":"à¤à¤¾à¤¡à¤¼à¤—à¥à¤°à¤¾à¤®","parent_id":"36"},
{"answer_id":"470","answer_english":"Jharsuguda","answer_hindi":"à¤à¤¾à¤°à¤¸à¥à¤—à¥à¤¡à¤¼à¤¾","parent_id":"26"},
{"answer_id":"531","answer_english":"Jhunjhunu","answer_hindi":"à¤à¥à¤‚à¤à¥à¤¨à¥‚","parent_id":"29"},
{"answer_id":"200","answer_english":"Jind","answer_hindi":"à¤œà¥€à¤‚à¤¦","parent_id":"12"},
{"answer_id":"418","answer_english":"Jiribam","answer_hindi":"à¤œà¤¿à¤°à¤¿à¤¬à¤¾à¤®","parent_id":"22"},
{"answer_id":"533","answer_english":"Jodhpur","answer_hindi":"à¤œà¥‹à¤§à¤ªà¥à¤°","parent_id":"29"},
{"answer_id":"597","answer_english":"Jogulamba Gadwal","answer_hindi":"à¤œà¥‹à¤—à¥à¤²à¤¾à¤®à¥à¤¬à¤¾ à¤—à¤¦à¥à¤µà¤¾à¤²","parent_id":"32"},
{"answer_id":"59","answer_english":"Jorhat","answer_hindi":"à¤œà¥‹à¤°à¤¹à¤¾à¤Ÿ","parent_id":"4"},
{"answer_id":"174","answer_english":"Junagadh","answer_hindi":"à¤œà¥‚à¤¨à¤¾à¤—à¥","parent_id":"11"},
{"answer_id":"129","answer_english":"Kabirdham \/ Kawardha","answer_hindi":"à¤•à¤¬à¥€à¤°à¤§à¤¾à¤® \/ à¤•à¤µà¤°à¥à¤§à¤¾","parent_id":"7"},
{"answer_id":"5","answer_english":"Kadapa","answer_hindi":"à¤•à¤¡à¤¼à¤ªà¥à¤ªà¤¾","parent_id":"1"},
{"answer_id":"90","answer_english":"Kaimur","answer_hindi":"à¤•à¥ˆà¤®à¥‚à¤°","parent_id":"5"},
{"answer_id":"201","answer_english":"Kaithal","answer_hindi":"à¤•à¥ˆà¤¥à¤²","parent_id":"12"},
{"answer_id":"420","answer_english":"Kakching","answer_hindi":"à¤•à¤•à¤šà¤¿à¤‚à¤—Â ","parent_id":"22"},
{"answer_id":"475","answer_english":"Kalahandi","answer_hindi":"à¤•à¤²à¤¾à¤¹à¤¾à¤¨à¥à¤¡à¥€","parent_id":"26"},
{"answer_id":"731","answer_english":"Kalimpong","answer_hindi":"à¤•à¤²à¤¿à¤®à¥à¤ªà¥‹à¤—","parent_id":"36"},
{"answer_id":"560","answer_english":"Kallakurichi","answer_hindi":"à¤•à¤²à¥à¤²à¤¾à¤•à¥à¤°à¤¿à¤šà¥€","parent_id":"31"},
{"answer_id":"598","answer_english":"Kamareddy","answer_hindi":"à¤•à¤¾à¤®à¤¾à¤°à¥‡à¤¡à¥à¤¡à¥€","parent_id":"32"},
{"answer_id":"422","answer_english":"Kamjong","answer_hindi":"à¤•à¤®à¤œà¥‹à¤‚à¤—Â ","parent_id":"22"},
{"answer_id":"21","answer_english":"Kamle","answer_hindi":"à¤•à¤®à¤²à¥‡","parent_id":"3"},
{"answer_id":"61","answer_english":"Kamrup","answer_hindi":"à¤•à¤¾à¤®à¤°à¥‚à¤ª","parent_id":"4"},
{"answer_id":"60","answer_english":"Kamrup Metropolitan","answer_hindi":"à¤•à¤¾à¤®à¤°à¥‚à¤ª à¤®à¤¹à¤¾à¤¨à¤—à¤°","parent_id":"4"},
{"answer_id":"561","answer_english":"Kanchipuram","answer_hindi":"à¤•à¤¾à¤‚à¤šà¥€à¤ªà¥à¤°à¤®","parent_id":"31"},
{"answer_id":"476","answer_english":"Kandhamal","answer_hindi":"à¤•à¤¨à¥à¤§à¤®à¤¾à¤²","parent_id":"26"},
{"answer_id":"419","answer_english":"KangpokpiÂ (Sadar Hills)","answer_hindi":"à¤•à¤‚à¤—à¤ªà¥‹à¤•à¤ªà¥€","parent_id":"22"},
{"answer_id":"217","answer_english":"Kangra","answer_hindi":"à¤•à¤¾à¤à¤—à¤¡à¤¼à¤¾","parent_id":"13"},
{"answer_id":"130","answer_english":"Kanker","answer_hindi":"à¤•à¤¾à¤‚à¤•à¥‡à¤° Â (à¤‰à¤¤à¥à¤¤à¤° à¤¬à¤¸à¥à¤¤à¤°)","parent_id":"7"},
{"answer_id":"672","answer_english":"Kannauj","answer_hindi":"à¤•à¤¨à¥à¤¨à¥Œà¤œ","parent_id":"34"},
{"answer_id":"304","answer_english":"Kannur","answer_hindi":"à¤•à¤¨à¥à¤¨à¥‚à¤°","parent_id":"17"},
{"answer_id":"673","answer_english":"Kanpur Dehat","answer_hindi":"à¤•à¤¾à¤¨à¤ªà¥à¤° à¤¦à¥‡à¤¹à¤¾à¤¤","parent_id":"34"},
{"answer_id":"674","answer_english":"Kanpur Nagar","answer_hindi":"à¤•à¤¾à¤¨à¤ªà¥à¤° à¤¨à¤—à¤°","parent_id":"34"},
{"answer_id":"562","answer_english":"Kanyakumari","answer_hindi":"à¤•à¤¨à¥à¤¯à¤¾à¤•à¥à¤®à¤¾à¤°à¥€","parent_id":"31"},
{"answer_id":"503","answer_english":"Kapurthala","answer_hindi":"à¤•à¤ªà¥‚à¤°à¤¥à¤²à¤¾","parent_id":"28"},
{"answer_id":"489","answer_english":"Karaikal","answer_hindi":"à¤•à¤°à¤¾à¤ˆà¤•à¤²Â ","parent_id":"27"},
{"answer_id":"537","answer_english":"Karauli","answer_hindi":"à¤•à¤°à¥Œà¤²à¥€","parent_id":"29"},
{"answer_id":"62","answer_english":"Karbi Anglong","answer_hindi":"à¤•à¤¾à¤°à¥à¤¬à¥€ à¤†à¤‚à¤—à¤²à¥‹à¤‚à¤—","parent_id":"4"},
{"answer_id":"315","answer_english":"KargilÂ ","answer_hindi":"à¤•à¤¾à¤°à¤—à¤¿à¤²","parent_id":"18"},
{"answer_id":"63","answer_english":"Karimganj","answer_hindi":"à¤•à¤°à¥€à¤®à¤—à¤‚à¤œ","parent_id":"4"},
{"answer_id":"599","answer_english":"Karimnagar","answer_hindi":"à¤•à¤°à¥€à¤®à¤¨à¤—à¤°","parent_id":"32"},
{"answer_id":"202","answer_english":"Karnal","answer_hindi":"à¤•à¤°à¤¨à¤¾à¤²","parent_id":"12"},
{"answer_id":"563","answer_english":"Karur","answer_hindi":"à¤•à¤°à¥‚à¤°","parent_id":"31"},
{"answer_id":"305","answer_english":"Kasaragod","answer_hindi":"à¤•à¤¾à¤¸à¤°à¤—à¥‹à¤¡Â ","parent_id":"17"},
{"answer_id":"675","answer_english":"Kasganj","answer_hindi":"à¤•à¤¾à¤¸à¤—à¤‚à¤œÂ ","parent_id":"34"},
{"answer_id":"233","answer_english":"Kathua","answer_hindi":"à¤•à¤ à¥à¤†","parent_id":"14"},
{"answer_id":"91","answer_english":"Katihar","answer_hindi":"à¤•à¤Ÿà¤¿à¤¹à¤¾à¤°","parent_id":"5"},
{"answer_id":"342","answer_english":"Katni ","answer_hindi":"à¤•à¤Ÿà¤¨à¥€","parent_id":"20"},
{"answer_id":"676","answer_english":"Kaushambi","answer_hindi":"à¤•à¥Œà¤¶à¤¾à¤®à¥à¤¬à¥€","parent_id":"34"},
{"answer_id":"478","answer_english":"Kendrapara","answer_hindi":"à¤•à¥‡à¤¨à¥à¤¦à¥à¤°à¤¾à¤ªà¤¡à¤¼à¤¾","parent_id":"26"},
{"answer_id":"474","answer_english":"Kendujhar","answer_hindi":"à¤•à¥‡à¤¨à¥à¤¦à¥à¤à¤°","parent_id":"26"},
{"answer_id":"92","answer_english":"Khagaria","answer_hindi":"à¤–à¤—à¤¡à¤¼à¤¿à¤¯à¤¾","parent_id":"5"},
{"answer_id":"600","answer_english":"Khammam","answer_hindi":"à¤–à¤®à¥à¤®à¤®","parent_id":"32"},
{"answer_id":"337","answer_english":"Khandwa (East Nimar)","answer_hindi":"à¤–à¤‚à¤¡à¤µà¤¾","parent_id":"20"},
{"answer_id":"338","answer_english":"Khargone (West Nimar)","answer_hindi":"à¤–à¤°à¤—à¥‹à¤¨","parent_id":"20"},
{"answer_id":"445","answer_english":"Khawzawl","answer_hindi":"à¤–à¤¾à¤µà¤œà¥Œà¤²","parent_id":"24"},
{"answer_id":"176","answer_english":"Kheda","answer_hindi":"à¤–à¥‡à¤¡à¤¼à¤¾","parent_id":"11"},
{"answer_id":"473","answer_english":"Khordha","answer_hindi":"à¤–à¥‹à¤°à¥à¤§à¤¾","parent_id":"26"},
{"answer_id":"628","answer_english":"Khowai","answer_hindi":"à¤–à¥‹à¤µà¤¾à¤ˆ","parent_id":"33"},
{"answer_id":"260","answer_english":"Khunti","answer_hindi":"à¤–à¥à¤Ÿà¥€","parent_id":"15"},
{"answer_id":"218","answer_english":"Kinnaur","answer_hindi":"à¤•à¤¿à¤¨à¥à¤¨à¥Œà¤°","parent_id":"13"},
{"answer_id":"448","answer_english":"Kiphire","answer_hindi":"à¤•à¥ˆà¤«à¤¾à¤‡à¤°","parent_id":"25"},
{"answer_id":"93","answer_english":"Kishanganj","answer_hindi":"à¤•à¤¿à¤¶à¤¨à¤—à¤‚à¤œ","parent_id":"5"},
{"answer_id":"234","answer_english":"Kishtwar","answer_hindi":"à¤•à¤¿à¤¶à¥à¤¤à¤µà¤¾à¤¡à¤¼","parent_id":"14"},
{"answer_id":"288","answer_english":"Kodagu","answer_hindi":"à¤•à¥‹à¤¡à¤—à¥","parent_id":"16"},
{"answer_id":"251","answer_english":"Koderma","answer_hindi":"à¤•à¥‹à¤¡à¤°à¤®à¤¾","parent_id":"15"},
{"answer_id":"449","answer_english":"Kohima","answer_hindi":"à¤•à¥‹à¤¹à¤¿à¤®à¤¾","parent_id":"25"},
{"answer_id":"64","answer_english":"Kokrajhar","answer_hindi":"à¤•à¥‹à¤•à¤°à¤¾à¤à¤¾à¤°","parent_id":"4"},
{"answer_id":"289","answer_english":"Kolar","answer_hindi":"à¤•à¥‹à¤²à¤¾à¤°","parent_id":"16"},
{"answer_id":"437","answer_english":"Kolasib","answer_hindi":"à¤•à¥‹à¤²à¤¾à¤¸à¤¿à¤¬","parent_id":"24"},
{"answer_id":"387","answer_english":"Kolhapur","answer_hindi":"à¤•à¥‹à¤²à¥à¤¹à¤¾à¤ªà¥à¤°","parent_id":"21"},
{"answer_id":"732","answer_english":"Kolkata","answer_hindi":"à¤•à¥‹à¤²à¤•à¤¾à¤¤à¤¾","parent_id":"36"},
{"answer_id":"306","answer_english":"Kollam","answer_hindi":"à¤•à¥‹à¤²à¥à¤²à¤®","parent_id":"17"},
{"answer_id":"591","answer_english":"Komaram Bheem","answer_hindi":"à¤•à¥‹à¤®à¤°à¤® à¤­à¥€à¤®","parent_id":"32"},
{"answer_id":"131","answer_english":"Kondagaon","answer_hindi":"à¤•à¥‹à¤‚à¤¡à¤—à¤¾à¤à¤µ","parent_id":"7"},
{"answer_id":"290","answer_english":"Koppal","answer_hindi":"à¤•à¥‹à¤ªà¥à¤ªà¤²","parent_id":"16"},
{"answer_id":"477","answer_english":"Koraput","answer_hindi":"à¤•à¥‹à¤°à¤¾à¤ªà¥à¤Ÿ","parent_id":"26"},
{"answer_id":"132","answer_english":"Korba","answer_hindi":"à¤•à¥‹à¤°à¤¬à¤¾","parent_id":"7"},
{"answer_id":"133","answer_english":"Koriya","answer_hindi":"à¤•à¥‹à¤°à¤¿à¤¯à¤¾","parent_id":"7"},
{"answer_id":"538","answer_english":"Kota","answer_hindi":"à¤•à¥‹à¤Ÿà¤¾","parent_id":"29"},
{"answer_id":"307","answer_english":"Kottayam","answer_hindi":"à¤•à¥‹à¤Ÿà¥à¤Ÿà¤¯à¤®","parent_id":"17"},
{"answer_id":"308","answer_english":"Kozhikode","answer_hindi":"à¤•à¥‹à¤¡à¤¼à¤¿à¤•à¥‹à¤¡","parent_id":"17"},
{"answer_id":"22","answer_english":"Kra Daadi","answer_hindi":"à¤•à¥à¤°à¤¾ à¤¦à¤¾à¤¦à¥€","parent_id":"3"},
{"answer_id":"6","answer_english":"Krishna","answer_hindi":"à¤•à¥ƒà¤·à¥à¤£à¤¾","parent_id":"1"},
{"answer_id":"564","answer_english":"Krishnagiri","answer_hindi":"à¤•à¥ƒà¤·à¥à¤£à¤—à¤¿à¤°à¤¿","parent_id":"31"},
{"answer_id":"235","answer_english":"Kulgam","answer_hindi":"à¤•à¥à¤²à¤—à¤¾à¤®","parent_id":"14"},
{"answer_id":"219","answer_english":"Kullu","answer_hindi":"à¤•à¥à¤²à¥à¤²à¥‚","parent_id":"13"},
{"answer_id":"236","answer_english":"Kupwara","answer_hindi":"à¤•à¥à¤ªà¤µà¤¾à¤¡à¤¼à¤¾","parent_id":"14"},
{"answer_id":"7","answer_english":"Kurnool","answer_hindi":"à¤•à¥à¤°à¥à¤¨à¥‚à¤²","parent_id":"1"},
{"answer_id":"203","answer_english":"Kurukshetra","answer_hindi":"à¤•à¥à¤°à¥à¤•à¥à¤·à¥‡à¤¤à¥à¤°","parent_id":"12"},
{"answer_id":"23","answer_english":"Kurung Kumey","answer_hindi":"à¤•à¥à¤°à¥à¤‚à¤— à¤•à¥à¤®à¥‡","parent_id":"3"},
{"answer_id":"677","answer_english":"Kushinagar","answer_hindi":"à¤•à¥à¤¶à¥€à¤¨à¤—à¤° (à¤ªà¤¡à¤¼à¤°à¥Œà¤¨à¤¾)","parent_id":"34"},
{"answer_id":"175","answer_english":"Kutch","answer_hindi":"à¤•à¤šà¥à¤›","parent_id":"11"},
{"answer_id":"220","answer_english":"Lahaul and Spiti","answer_hindi":"à¤²à¤¾à¤¹à¥Œà¤² à¤”à¤° à¤¸à¥à¤ªà¥€à¤¤à¥€","parent_id":"13"},
{"answer_id":"65","answer_english":"Lakhimpur","answer_hindi":"à¤²à¤–à¥€à¤®à¤ªà¥à¤°","parent_id":"4"},
{"answer_id":"678","answer_english":"Lakhimpur Kheri","answer_hindi":"à¤²à¤–à¥€à¤®à¤ªà¥à¤°-à¤–à¤¿à¤°à¥€","parent_id":"34"},
{"answer_id":"94","answer_english":"Lakhisarai","answer_hindi":"à¤²à¤–à¥€à¤¸à¤°à¤¾à¤¯","parent_id":"5"},
{"answer_id":"317","answer_english":"Lakshadweep","answer_hindi":"à¤²à¤•à¥à¤·à¤¦à¥à¤µà¥€à¤ª","parent_id":"19"},
{"answer_id":"679","answer_english":"Lalitpur","answer_hindi":"à¤²à¤²à¤¿à¤¤à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"248","answer_english":"Latehar","answer_hindi":"à¤²à¤¾à¤¤à¥‡à¤¹à¤¾à¤°","parent_id":"15"},
{"answer_id":"388","answer_english":"Latur","answer_hindi":"à¤²à¤¾à¤¤à¥‚à¤°","parent_id":"21"},
{"answer_id":"438","answer_english":"Lawngtlai","answer_hindi":"à¤²à¥‰à¤™à¥à¤—à¤¤à¤²à¤¾à¤ˆ","parent_id":"24"},
{"answer_id":"316","answer_english":"LehÂ ","answer_hindi":"à¤²à¥‡à¤¹","parent_id":"18"},
{"answer_id":"24","answer_english":"Lepa Rada","answer_hindi":"à¤²à¥‡à¤ªà¤¾ à¤°à¤¾à¤¦à¤¾","parent_id":"3"},
{"answer_id":"257","answer_english":"Lohardaga","answer_hindi":"à¤²à¥‹à¤¹à¤°à¤¦à¤—à¥à¤—à¤¾","parent_id":"15"},
{"answer_id":"25","answer_english":"Lohit","answer_hindi":"à¤²à¥‹à¤¹à¤¿à¤¤","parent_id":"3"},
{"answer_id":"26","answer_english":"Longding","answer_hindi":"à¤²à¥‹à¤‚à¤—à¤¡à¤¿à¤‚à¤—","parent_id":"3"},
{"answer_id":"450","answer_english":"Longleng","answer_hindi":"à¤²à¥‰à¤¨à¥à¤—à¤²à¥‡à¤¨à¥à¤—","parent_id":"25"},
{"answer_id":"27","answer_english":"Lower Dibang Valley","answer_hindi":"à¤¨à¤¿à¤šà¤²à¥€ à¤¦à¤¿à¤¬à¤¾à¤‚à¤— à¤˜à¤¾à¤Ÿà¥€","parent_id":"3"},
{"answer_id":"28","answer_english":"Lower Siang","answer_hindi":"à¤¨à¤¿à¤šà¤²à¤¾ à¤¸à¤¿à¤¯à¤¾à¤‚à¤—","parent_id":"3"},
{"answer_id":"29","answer_english":"Lower Subansiri","answer_hindi":"à¤¨à¤¿à¤šà¤²à¥€ à¤¸à¥à¤¬à¤¨à¤¸à¤¿à¤°à¥€","parent_id":"3"},
{"answer_id":"680","answer_english":"Lucknow","answer_hindi":"à¤²à¤–à¤¨à¤Š","parent_id":"34"},
{"answer_id":"504","answer_english":"Ludhiana","answer_hindi":"à¤²à¥à¤§à¤¿à¤¯à¤¾à¤¨à¤¾","parent_id":"28"},
{"answer_id":"439","answer_english":"Lunglei","answer_hindi":"à¤²à¥à¤‚à¤—à¤²à¥‡à¤ˆ","parent_id":"24"},
{"answer_id":"95","answer_english":"Madhepura","answer_hindi":"à¤®à¤§à¥‡à¤ªà¥à¤°à¤¾","parent_id":"5"},
{"answer_id":"96","answer_english":"Madhubani","answer_hindi":"à¤®à¤§à¥à¤¬à¤¨à¥€","parent_id":"5"},
{"answer_id":"565","answer_english":"Madurai","answer_hindi":"à¤®à¤¦à¥à¤°à¤ˆ","parent_id":"31"},
{"answer_id":"601","answer_english":"Mahabubabad","answer_hindi":"à¤®à¤¹à¤¾à¤¬à¥‚à¤¬à¤¾à¤¬à¤¾à¤¦","parent_id":"32"},
{"answer_id":"681","answer_english":"Maharajganj","answer_hindi":"à¤®à¤¹à¤¾à¤°à¤¾à¤œà¤—à¤‚à¤œ","parent_id":"34"},
{"answer_id":"134","answer_english":"Mahasamund","answer_hindi":"à¤®à¤¹à¤¾à¤¸à¤®à¥à¤¨à¥à¤¦","parent_id":"7"},
{"answer_id":"602","answer_english":"Mahbubnagar","answer_hindi":"à¤®à¤¹à¤¬à¥‚à¤¬à¤¨à¤—à¤°","parent_id":"32"},
{"answer_id":"490","answer_english":"MahÃ©","answer_hindi":"à¤®à¤¾à¤¹à¥‡Â ","parent_id":"27"},
{"answer_id":"204","answer_english":"Mahendragarh","answer_hindi":"à¤®à¤¹à¥‡à¤‚à¤¦à¥à¤°à¤—à¤¢à¤¼","parent_id":"12"},
{"answer_id":"177","answer_english":"Mahisagar","answer_hindi":"à¤®à¤¹à¥€à¤¸à¤¾à¤—à¤°","parent_id":"11"},
{"answer_id":"682","answer_english":"Mahoba","answer_hindi":"à¤®à¤¹à¥‹à¤¬à¤¾","parent_id":"34"},
{"answer_id":"371","answer_english":"Maihar","answer_hindi":"à¤®à¥ˆà¤¹à¤°","parent_id":"20"},
{"answer_id":"683","answer_english":"Mainpuri","answer_hindi":"à¤®à¥ˆà¤¨à¤ªà¥à¤°à¥€","parent_id":"34"},
{"answer_id":"66","answer_english":"Majuli","answer_hindi":"à¤®à¤¾à¤œà¥à¤²à¥€","parent_id":"4"},
{"answer_id":"309","answer_english":"Malappuram","answer_hindi":"à¤®à¤²à¤ªà¥à¤ªà¥à¤°à¤®","parent_id":"17"},
{"answer_id":"733","answer_english":"Maldah","answer_hindi":"à¤®à¤¾à¤²à¤¦à¤¹","parent_id":"36"},
{"answer_id":"479","answer_english":"Malkangiri","answer_hindi":"à¤®à¤¾à¤²à¤•à¤¾à¤¨à¤—à¤¿à¤°à¤¿","parent_id":"26"},
{"answer_id":"440","answer_english":"Mamit","answer_hindi":"à¤®à¤®à¤¿à¤¤","parent_id":"24"},
{"answer_id":"603","answer_english":"Mancherial","answer_hindi":"à¤®à¤‚à¤šà¥‡à¤°à¤¿à¤¯à¤²","parent_id":"32"},
{"answer_id":"221","answer_english":"Mandi","answer_hindi":"à¤®à¤‚à¤¡à¥€","parent_id":"13"},
{"answer_id":"343","answer_english":"Mandla ","answer_hindi":"à¤®à¤‚à¤¡à¤²à¤¾","parent_id":"20"},
{"answer_id":"365","answer_english":"Mandsaur","answer_hindi":"à¤®à¤‚à¤¦à¤¸à¥Œà¤°","parent_id":"20"},
{"answer_id":"291","answer_english":"Mandya","answer_hindi":"à¤®à¤¾à¤‚à¤¡à¤¯à¤¾","parent_id":"16"},
{"answer_id":"505","answer_english":"Mansa","answer_hindi":"à¤®à¤¾à¤¨à¤¸à¤¾","parent_id":"28"},
{"answer_id":"684","answer_english":"Mathura","answer_hindi":"à¤®à¤¥à¥à¤°à¤¾","parent_id":"34"},
{"answer_id":"685","answer_english":"Mau","answer_hindi":"à¤®à¤Š","parent_id":"34"},
{"answer_id":"566","answer_english":"Mayiladuthurai","answer_hindi":"à¤®à¤¯à¥€à¤²à¤¾à¤¡à¥‚à¤¤à¥à¤°à¥ˆ","parent_id":"31"},
{"answer_id":"480","answer_english":"Mayurbhanj","answer_hindi":"à¤®à¤¯à¥‚à¤°à¤­à¤‚à¤œ","parent_id":"26"},
{"answer_id":"604","answer_english":"Medak","answer_hindi":"à¤®à¥‡à¤¦à¤•","parent_id":"32"},
{"answer_id":"605","answer_english":"Medchal-Malkajgiri","answer_hindi":"à¤®à¥‡à¤¡à¥à¤šà¤² à¤®à¤²à¥à¤•à¤¾à¤œà¤—à¤¿à¤°à¤¿","parent_id":"32"},
{"answer_id":"686","answer_english":"Meerut","answer_hindi":"à¤®à¥‡à¤°à¤ ","parent_id":"34"},
{"answer_id":"178","answer_english":"Mehsana","answer_hindi":"à¤®à¥‡à¤¹à¤¸à¤¾à¤£à¤¾","parent_id":"11"},
{"answer_id":"687","answer_english":"Mirzapur","answer_hindi":"à¤®à¤¿à¤°à¥à¤œà¤¼à¤¾à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"506","answer_english":"Moga","answer_hindi":"à¤®à¥‹à¤—à¤¾","parent_id":"28"},
{"answer_id":"451","answer_english":"Mokokchung","answer_hindi":"à¤®à¥‹à¤•à¥‹à¤•à¤šà¥à¤†à¤‚à¤—","parent_id":"25"},
{"answer_id":"452","answer_english":"Mon","answer_hindi":"à¤®à¥‹à¤¨","parent_id":"25"},
{"answer_id":"688","answer_english":"Moradabad","answer_hindi":"à¤®à¥à¤°à¤¾à¤¦à¤¾à¤¬à¤¾à¤¦","parent_id":"34"},
{"answer_id":"179","answer_english":"Morbi","answer_hindi":"à¤®à¥‹à¤°à¤¬à¥€","parent_id":"11"},
{"answer_id":"323","answer_english":"Morena ","answer_hindi":"à¤®à¥à¤°à¥ˆà¤¨à¤¾","parent_id":"20"},
{"answer_id":"67","answer_english":"Morigaon","answer_hindi":"à¤®à¤¾à¤°à¤¿à¤—à¤¾à¤‚à¤µ","parent_id":"4"},
{"answer_id":"606","answer_english":"Mulugu","answer_hindi":"à¤®à¥à¤²à¥à¤—à¥","parent_id":"32"},
{"answer_id":"389","answer_english":"Mumbai","answer_hindi":"à¤®à¥à¤‚à¤¬à¤ˆ","parent_id":"21"},
{"answer_id":"390","answer_english":"Mumbai Suburban","answer_hindi":"à¤®à¥à¤‚à¤¬à¤ˆ (à¤¸à¤¬à¤…à¤°à¥à¤¬à¤¨)","parent_id":"21"},
{"answer_id":"135","answer_english":"Mungeli","answer_hindi":"à¤®à¥à¤‚à¤—à¥‡à¤²à¥€","parent_id":"7"},
{"answer_id":"97","answer_english":"Munger","answer_hindi":"à¤®à¥à¤‚à¤—à¥‡à¤°","parent_id":"5"},
{"answer_id":"734","answer_english":"Murshidabad","answer_hindi":"à¤®à¥à¤°à¥à¤¶à¤¿à¤¦à¤¾à¤¬à¤¾à¤¦","parent_id":"36"},
{"answer_id":"689","answer_english":"Muzaffarnagar","answer_hindi":"à¤®à¥à¤œà¤«à¥à¤«à¤°à¤¨à¤—à¤°","parent_id":"34"},
{"answer_id":"98","answer_english":"Muzaffarpur","answer_hindi":"à¤®à¥à¤œà¤«à¥à¤«à¤°à¤ªà¥à¤°","parent_id":"5"},
{"answer_id":"292","answer_english":"Mysore","answer_hindi":"à¤®à¥ˆà¤¸à¥‚à¤°","parent_id":"16"},
{"answer_id":"481","answer_english":"Nabarangpur","answer_hindi":"à¤¨à¤¬à¤°à¤‚à¤—à¤ªà¥à¤°","parent_id":"26"},
{"answer_id":"735","answer_english":"Nadia","answer_hindi":"à¤¨à¤¾à¤¦à¤¿à¤¯à¤¾","parent_id":"36"},
{"answer_id":"68","answer_english":"Nagaon","answer_hindi":"à¤¨à¤—à¤¾à¤‚à¤µ","parent_id":"4"},
{"answer_id":"567","answer_english":"Nagapattinam","answer_hindi":"à¤¨à¤¾à¤—à¤ªà¤Ÿà¥à¤Ÿà¤¿à¤¨à¤®","parent_id":"31"},
{"answer_id":"609","answer_english":"Nagarkurnool","answer_hindi":"à¤¨à¤¾à¤—à¤°à¤•à¤°à¥à¤¨à¥‚à¤²","parent_id":"32"},
{"answer_id":"539","answer_english":"Nagaur","answer_hindi":"à¤¨à¤¾à¤—à¥Œà¤°","parent_id":"29"},
{"answer_id":"372","answer_english":"Nagda","answer_hindi":"à¤¨à¤¾à¤—à¤¦à¤¾","parent_id":"20"},
{"answer_id":"391","answer_english":"Nagpur","answer_hindi":"à¤¨à¤¾à¤—à¤ªà¥à¤°","parent_id":"21"},
{"answer_id":"712","answer_english":"Nainital","answer_hindi":"à¤¨à¥ˆà¤¨à¥€à¤¤à¤¾à¤²","parent_id":"35"},
{"answer_id":"99","answer_english":"Nalanda","answer_hindi":"à¤¨à¤¾à¤²à¤‚à¤¦à¤¾","parent_id":"5"},
{"answer_id":"69","answer_english":"Nalbari","answer_hindi":"à¤¨à¤²à¤¬à¤¾à¤¡à¤¼à¥€","parent_id":"4"},
{"answer_id":"607","answer_english":"Nalgonda","answer_hindi":"à¤¨à¤²à¤—à¥‹à¤‚à¤¡à¤¾","parent_id":"32"},
{"answer_id":"569","answer_english":"Namakkal","answer_hindi":"à¤¨à¤¾à¤®à¤•à¥à¤•à¤²","parent_id":"31"},
{"answer_id":"30","answer_english":"Namsai","answer_hindi":"à¤¨à¤¾à¤®à¤¸à¤¾à¤ˆ","parent_id":"3"},
{"answer_id":"392","answer_english":"Nanded","answer_hindi":"à¤¨à¤¾à¤‚à¤¦à¥‡à¤¡","parent_id":"21"},
{"answer_id":"393","answer_english":"Nandurbar","answer_hindi":"à¤¨à¤‚à¤¦à¥à¤°à¤¬à¤¾à¤°","parent_id":"21"},
{"answer_id":"608","answer_english":"Narayanpet","answer_hindi":"à¤¨à¤¾à¤°à¤¾à¤¯à¤£à¤ªà¥‡à¤Ÿ","parent_id":"32"},
{"answer_id":"136","answer_english":"Narayanpur","answer_hindi":"à¤¨à¤¾à¤°à¤¾à¤¯à¤£à¤ªà¥à¤°","parent_id":"7"},
{"answer_id":"180","answer_english":"Narmada","answer_hindi":"à¤¨à¤°à¥à¤®à¤¦à¤¾","parent_id":"11"},
{"answer_id":"344","answer_english":"Narsinghpur ","answer_hindi":"à¤¨à¤°à¤¸à¤¿à¤‚à¤¹à¤ªà¥à¤°","parent_id":"20"},
{"answer_id":"394","answer_english":"Nashik","answer_hindi":"à¤¨à¤¾à¤¶à¤¿à¤•","parent_id":"21"},
{"answer_id":"181","answer_english":"Navsari","answer_hindi":"à¤¨à¤µà¤¸à¤¾à¤°à¥€","parent_id":"11"},
{"answer_id":"100","answer_english":"Nawada","answer_hindi":"à¤¨à¤µà¤¾à¤¦à¤¾","parent_id":"5"},
{"answer_id":"483","answer_english":"Nayagarh","answer_hindi":"à¤¨à¤¯à¤¾à¤—à¤¡à¤¼","parent_id":"26"},
{"answer_id":"366","answer_english":"Neemuch","answer_hindi":"à¤¨à¥€à¤®à¤š","parent_id":"20"},
{"answer_id":"8","answer_english":"Nellore","answer_hindi":"à¤¨à¥‡à¤²à¥à¤²à¥Œà¤°","parent_id":"1"},
{"answer_id":"146","answer_english":"New Delhi","answer_hindi":"à¤¨à¤ˆ à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"14","answer_english":"Nicobar","answer_hindi":"à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°","parent_id":"2"},
{"answer_id":"568","answer_english":"Nilgiris","answer_hindi":"à¤¨à¥€à¤²à¤—à¤¿à¤°à¤¿","parent_id":"31"},
{"answer_id":"610","answer_english":"Nirmal","answer_hindi":"à¤¨à¤¿à¤°à¥à¤®à¤²","parent_id":"32"},
{"answer_id":"359","answer_english":"Niwari ","answer_hindi":"à¤¨à¤¿à¤µà¤¾à¤¡à¤¼à¥€","parent_id":"20"},
{"answer_id":"611","answer_english":"Nizamabad","answer_hindi":"à¤¨à¤¿à¤œà¤¼à¤¾à¤®à¤¾à¤¬à¤¾à¤¦","parent_id":"32"},
{"answer_id":"458","answer_english":"Noklak","answer_hindi":"à¤¨à¥‹à¤•à¥à¤²à¤•","parent_id":"25"},
{"answer_id":"423","answer_english":"Noney","answer_hindi":"à¤¨à¥‹à¤¨à¥‡","parent_id":"22"},
{"answer_id":"736","answer_english":"North 24 Parganas","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° 24 à¤ªà¤°à¤—à¤¨à¤¾","parent_id":"36"},
{"answer_id":"15","answer_english":"North and Middle Andaman","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤”à¤° à¤®à¤§à¥à¤¯ à¤…à¤£à¥à¤¡à¤®à¤¾à¤¨ à¤œà¤¿à¤²à¤¾","parent_id":"2"},
{"answer_id":"149","answer_english":"North Delhi ","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"150","answer_english":"North East Delhi","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤ªà¥‚à¤°à¥à¤µà¥€ à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"435","answer_english":"North Garo Hills","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤—à¤¾à¤°à¥‹ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"157","answer_english":"North Goa","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤—à¥‹à¤µà¤¾","parent_id":"10"},
{"answer_id":"549","answer_english":"North Sikkim","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤¸à¤¿à¤•à¥à¤•à¤¿à¤®","parent_id":"30"},
{"answer_id":"626","answer_english":"North Tripura","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤¤à¥à¤°à¤¿à¤ªà¥à¤°à¤¾","parent_id":"33"},
{"answer_id":"151","answer_english":"North West Delhi","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤ªà¤¶à¥à¤šà¤¿à¤® à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"482","answer_english":"Nuapada","answer_hindi":"à¤¨à¥à¤†à¤ªà¤¡à¤¼à¤¾","parent_id":"26"},
{"answer_id":"205","answer_english":"Nuh","answer_hindi":"à¤¨à¥‚à¤¹Â ","parent_id":"12"},
{"answer_id":"395","answer_english":"Osmanabad","answer_hindi":"à¤‰à¤¸à¥à¤®à¤¾à¤¨à¤¾à¤¬à¤¾à¤¦","parent_id":"21"},
{"answer_id":"31","answer_english":"Pakke-Kessang","answer_hindi":"à¤ªà¤•à¥à¤•à¥‡ à¤•à¥‡à¤¸à¤¾à¤‚à¤—","parent_id":"3"},
{"answer_id":"267","answer_english":"Pakur","answer_hindi":"à¤ªà¤¾à¤•à¥à¤¡à¤¼","parent_id":"15"},
{"answer_id":"310","answer_english":"Palakkad","answer_hindi":"à¤ªà¤¾à¤²à¤•à¥à¤•à¤¾à¤¡à¤¼Â ","parent_id":"17"},
{"answer_id":"247","answer_english":"Palamu","answer_hindi":"à¤ªà¤²à¤¾à¤®à¥‚","parent_id":"15"},
{"answer_id":"396","answer_english":"Palghar","answer_hindi":"à¤ªà¤¾à¤²à¤˜à¤°","parent_id":"21"},
{"answer_id":"540","answer_english":"Pali","answer_hindi":"à¤ªà¤¾à¤²à¥€","parent_id":"29"},
{"answer_id":"206","answer_english":"Palwal","answer_hindi":"à¤ªà¤²à¤µà¤²","parent_id":"12"},
{"answer_id":"207","answer_english":"Panchkula","answer_hindi":"à¤ªà¤‚à¤šà¤•à¥à¤²à¤¾","parent_id":"12"},
{"answer_id":"182","answer_english":"Panchmahal","answer_hindi":"à¤ªà¤‚à¤šà¤®à¤¹à¤²","parent_id":"11"},
{"answer_id":"208","answer_english":"Panipat","answer_hindi":"à¤ªà¤¾à¤¨à¥€à¤ªà¤¤","parent_id":"12"},
{"answer_id":"356","answer_english":"Panna ","answer_hindi":"à¤ªà¤¨à¥à¤¨à¤¾","parent_id":"20"},
{"answer_id":"32","answer_english":"Papum Pare","answer_hindi":"à¤ªà¤ªà¥à¤®à¤ªà¤¾à¤°à¥‡","parent_id":"3"},
{"answer_id":"397","answer_english":"Parbhani","answer_hindi":"à¤ªà¤°à¤­à¤£à¥€","parent_id":"21"},
{"answer_id":"721","answer_english":"Paschim Bardhaman","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤®à¥€ à¤µà¤°à¥à¤§à¤®à¤¾à¤¨","parent_id":"36"},
{"answer_id":"737","answer_english":"Paschim Medinipur","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤®à¥‡à¤¦à¤¿à¤¨à¥€à¤ªà¥à¤°","parent_id":"36"},
{"answer_id":"183","answer_english":"Patan","answer_hindi":"à¤ªà¤¾à¤Ÿà¤¨","parent_id":"11"},
{"answer_id":"311","answer_english":"Pathanamthitta","answer_hindi":"à¤ªà¤¤à¤¨à¤®à¤¤à¤¿à¤Ÿà¥à¤Ÿà¤¾","parent_id":"17"},
{"answer_id":"508","answer_english":"Pathankot","answer_hindi":"à¤ªà¤ à¤¾à¤¨à¤•à¥‹à¤Ÿ","parent_id":"28"},
{"answer_id":"509","answer_english":"Patiala","answer_hindi":"à¤ªà¤Ÿà¤¿à¤¯à¤¾à¤²à¤¾","parent_id":"28"},
{"answer_id":"101","answer_english":"Patna","answer_hindi":"à¤ªà¤Ÿà¤¨à¤¾","parent_id":"5"},
{"answer_id":"713","answer_english":"Pauri Garhwal","answer_hindi":"à¤ªà¥Œà¤¡à¤¼à¥€ à¤—à¤¢à¤¼à¤µà¤¾à¤²","parent_id":"35"},
{"answer_id":"612","answer_english":"Peddapalli","answer_hindi":"à¤ªà¥‡à¤¦à¥à¤¦à¤ªà¤²à¥à¤²à¥‡","parent_id":"32"},
{"answer_id":"570","answer_english":"Perambalur","answer_hindi":"à¤ªà¥‡à¤°à¤®à¥à¤¬à¤²à¥à¤°","parent_id":"31"},
{"answer_id":"453","answer_english":"Peren","answer_hindi":"à¤ªà¥‡à¤°à¥‡à¤¨","parent_id":"25"},
{"answer_id":"454","answer_english":"Phek","answer_hindi":"à¤«à¥‡à¤•","parent_id":"25"},
{"answer_id":"424","answer_english":"Pherzawl","answer_hindi":"à¤«à¥‡à¤°à¤œà¤¼à¥Œà¤²Â ","parent_id":"22"},
{"answer_id":"690","answer_english":"Pilibhit","answer_hindi":"à¤ªà¥€à¤²à¥€à¤­à¥€à¤¤","parent_id":"34"},
{"answer_id":"714","answer_english":"Pithoragarh","answer_hindi":"à¤ªà¤¿à¤¥à¥Œà¤°à¤¾à¤—à¤¢à¤¼","parent_id":"35"},
{"answer_id":"237","answer_english":"Poonch","answer_hindi":"à¤ªà¥à¤‚à¤›","parent_id":"14"},
{"answer_id":"184","answer_english":"Porbandar","answer_hindi":"à¤ªà¥‹à¤°à¤¬à¤‚à¤¦à¤°","parent_id":"11"},
{"answer_id":"9","answer_english":"Prakasam","answer_hindi":"à¤ªà¥à¤°à¤•à¤¾à¤¶à¤®","parent_id":"1"},
{"answer_id":"541","answer_english":"Pratapgarh","answer_hindi":"à¤ªà¥à¤°à¤¤à¤¾à¤ªà¤—à¤¢à¤¼","parent_id":"29"},
{"answer_id":"691","answer_english":"Pratapgarh","answer_hindi":"à¤ªà¥à¤°à¤¤à¤¾à¤ªà¤—à¤¢","parent_id":"34"},
{"answer_id":"491","answer_english":"Puducherry","answer_hindi":"à¤ªà¥à¤¦à¥à¤šà¥‡à¤°à¥€","parent_id":"27"},
{"answer_id":"571","answer_english":"Pudukkottai","answer_hindi":"à¤ªà¥à¤¦à¥à¤•à¥‹à¤Ÿà¥à¤Ÿà¤ˆ","parent_id":"31"},
{"answer_id":"238","answer_english":"Pulwama","answer_hindi":"à¤ªà¥à¤²à¤µà¤¾à¤®à¤¾","parent_id":"14"},
{"answer_id":"398","answer_english":"Pune","answer_hindi":"à¤ªà¥à¤£à¥‡","parent_id":"21"},
{"answer_id":"722","answer_english":"Purba Bardhaman","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µ à¤¬à¤°à¥à¤§à¤®à¤¾à¤¨Â ","parent_id":"36"},
{"answer_id":"738","answer_english":"Purba Medinipur","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µ à¤®à¥‡à¤¦à¤¿à¤¨à¥€à¤ªà¥à¤°","parent_id":"36"},
{"answer_id":"484","answer_english":"Puri","answer_hindi":"à¤ªà¥à¤°à¥€","parent_id":"26"},
{"answer_id":"102","answer_english":"Purnia","answer_hindi":"à¤ªà¥‚à¤°à¥à¤£à¤¿à¤¯à¤¾","parent_id":"5"},
{"answer_id":"739","answer_english":"Purulia","answer_hindi":"à¤ªà¥à¤°à¥‚à¤²à¤¿à¤¯à¤¾","parent_id":"36"},
{"answer_id":"692","answer_english":"Raebareli","answer_hindi":"à¤°à¤¾à¤¯à¤¬à¤°à¥‡à¤²à¥€","parent_id":"34"},
{"answer_id":"293","answer_english":"Raichur","answer_hindi":"à¤°à¤¾à¤¯à¤šà¥‚à¤°","parent_id":"16"},
{"answer_id":"399","answer_english":"Raigad","answer_hindi":"à¤°à¤¾à¤¯à¤—à¤¡","parent_id":"21"},
{"answer_id":"137","answer_english":"Raigarh","answer_hindi":"à¤°à¤¾à¤¯à¤—à¤¢","parent_id":"7"},
{"answer_id":"138","answer_english":"Raipur","answer_hindi":"à¤°à¤¾à¤¯à¤ªà¥à¤°","parent_id":"7"},
{"answer_id":"319","answer_english":"Raisen","answer_hindi":"à¤°à¤¾à¤¯à¤¸à¥‡à¤¨","parent_id":"20"},
{"answer_id":"613","answer_english":"Rajanna Sircilla","answer_hindi":"à¤°à¤¾à¤œà¤¨à¥à¤¨à¤¾ à¤¸à¤¿à¤°à¤¸à¤¿à¤²à¥à¤²à¤¾","parent_id":"32"},
{"answer_id":"320","answer_english":"Rajgarh ","answer_hindi":"à¤°à¤¾à¤œà¤—à¤¢à¤¼","parent_id":"20"},
{"answer_id":"185","answer_english":"Rajkot","answer_hindi":"à¤°à¤¾à¤œà¤•à¥‹à¤Ÿ","parent_id":"11"},
{"answer_id":"139","answer_english":"Rajnandgaon","answer_hindi":"à¤°à¤¾à¤œà¤¨à¤¾à¤‚à¤¦à¤—à¤¾à¤‚à¤µ","parent_id":"7"},
{"answer_id":"239","answer_english":"Rajouri","answer_hindi":"à¤°à¤¾à¤œà¥Œà¤°à¥€","parent_id":"14"},
{"answer_id":"542","answer_english":"Rajsamand","answer_hindi":"à¤°à¤¾à¤œà¤¸à¤®à¤‚à¤¦","parent_id":"29"},
{"answer_id":"294","answer_english":"Ramanagara","answer_hindi":"à¤°à¤¾à¤®à¤¨à¤—à¤°","parent_id":"16"},
{"answer_id":"572","answer_english":"Ramanathapuram","answer_hindi":"à¤°à¤¾à¤®à¤¨à¤¾à¤¥à¤ªà¥à¤°à¤®","parent_id":"31"},
{"answer_id":"240","answer_english":"Ramban","answer_hindi":"à¤°à¤¾à¤®à¤¬à¤¨","parent_id":"14"},
{"answer_id":"253","answer_english":"Ramgarh","answer_hindi":"à¤°à¤¾à¤®à¤—à¤¢à¤¼","parent_id":"15"},
{"answer_id":"693","answer_english":"Rampur","answer_hindi":"à¤°à¤¾à¤®à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"259","answer_english":"Ranchi","answer_hindi":"à¤°à¤¾à¤à¤šà¥€","parent_id":"15"},
{"answer_id":"614","answer_english":"Ranga Reddy","answer_hindi":"à¤°à¤‚à¤—à¤¾à¤°à¥‡à¤¡à¥à¤¡à¥€","parent_id":"32"},
{"answer_id":"573","answer_english":"Ranipet","answer_hindi":"à¤°à¤¾à¤¨à¥€à¤ªà¥‡à¤Ÿ","parent_id":"31"},
{"answer_id":"367","answer_english":"Ratlam","answer_hindi":"à¤°à¤¤à¤²à¤¾à¤®","parent_id":"20"},
{"answer_id":"400","answer_english":"Ratnagiri","answer_hindi":"à¤°à¤¤à¥à¤¨à¤¾à¤—à¤¿à¤°à¥€","parent_id":"21"},
{"answer_id":"485","answer_english":"Rayagada","answer_hindi":"à¤°à¤¾à¤¯à¤—à¤¡à¤¼à¤¾","parent_id":"26"},
{"answer_id":"241","answer_english":"Reasi","answer_hindi":"à¤°à¤¿à¤¯à¤¾à¤¸à¥€","parent_id":"14"},
{"answer_id":"350","answer_english":"Rewa ","answer_hindi":"à¤°à¥€à¤µà¤¾","parent_id":"20"},
{"answer_id":"209","answer_english":"Rewari","answer_hindi":"à¤°à¥‡à¤µà¤¾à¤¡à¤¼à¥€","parent_id":"12"},
{"answer_id":"430","answer_english":"Ri Bhoi","answer_hindi":"à¤°à¥€ à¤­à¥‹à¤ˆ","parent_id":"23"},
{"answer_id":"210","answer_english":"Rohtak","answer_hindi":"à¤°à¥‹à¤¹à¤¤à¤•","parent_id":"12"},
{"answer_id":"103","answer_english":"Rohtas","answer_hindi":"à¤°à¥‹à¤¹à¤¤à¤¾à¤¸","parent_id":"5"},
{"answer_id":"715","answer_english":"Rudraprayag","answer_hindi":"à¤°à¥à¤¦à¥à¤°à¤ªà¥à¤°à¤¯à¤¾à¤—","parent_id":"35"},
{"answer_id":"510","answer_english":"Rupnagar","answer_hindi":"à¤°à¥‚à¤ªà¤¨à¤—à¤°","parent_id":"28"},
{"answer_id":"186","answer_english":"Sabarkantha","answer_hindi":"à¤¸à¤¾à¤¬à¤°à¤•à¤¾à¤‚à¤ à¤¾","parent_id":"11"},
{"answer_id":"357","answer_english":"Sagar ","answer_hindi":"à¤¸à¤¾à¤—à¤°","parent_id":"20"},
{"answer_id":"694","answer_english":"Saharanpur","answer_hindi":"à¤¸à¤¹à¤¾à¤°à¤¨à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"104","answer_english":"Saharsa","answer_hindi":"à¤¸à¤¹à¤°à¤¸à¤¾","parent_id":"5"},
{"answer_id":"269","answer_english":"Sahebganj","answer_hindi":"à¤¸à¤¾à¤¹à¤¿à¤¬à¤—à¤‚à¤œ","parent_id":"15"},
{"answer_id":"511","answer_english":"Sahibzada Ajit Singh Nagar","answer_hindi":"à¤®à¥‹à¤¹à¤¾à¤²à¥€\/ à¤¸à¤¾à¤¹à¤¿à¤¬à¤œà¤¾à¤¦à¤¾ à¤…à¤œà¥€à¤¤ à¤¸à¤¿à¤‚à¤¹ à¤¨à¤—à¤°","parent_id":"28"},
{"answer_id":"441","answer_english":"Saiha","answer_hindi":"à¤¸à¤‡à¤¹à¤¾","parent_id":"24"},
{"answer_id":"446","answer_english":"Saitual","answer_hindi":"à¤¸à¤‡à¤¤à¥à¤†à¤²","parent_id":"24"},
{"answer_id":"574","answer_english":"Salem","answer_hindi":"à¤¸à¥‡à¤²à¤®","parent_id":"31"},
{"answer_id":"105","answer_english":"Samastipur","answer_hindi":"à¤¸à¤®à¤¸à¥à¤¤à¥€à¤ªà¥à¤°","parent_id":"5"},
{"answer_id":"242","answer_english":"Samba","answer_hindi":"à¤¸à¤¾à¤‚à¤¬à¤¾","parent_id":"14"},
{"answer_id":"486","answer_english":"Sambalpur","answer_hindi":"à¤¸à¤®à¥à¤¬à¤²à¤ªà¥à¤°","parent_id":"26"},
{"answer_id":"695","answer_english":"Sambhal","answer_hindi":"à¤¸à¤®à¥à¤­à¤²","parent_id":"34"},
{"answer_id":"615","answer_english":"Sangareddy","answer_hindi":"à¤¸à¤‚à¤—à¤¾à¤°à¥‡à¤¡à¥à¤¡à¥€","parent_id":"32"},
{"answer_id":"401","answer_english":"Sangli","answer_hindi":"à¤¸à¤¾à¤‚à¤—à¤²à¥€","parent_id":"21"},
{"answer_id":"512","answer_english":"Sangrur","answer_hindi":"à¤¸à¤‚à¤—à¤°à¥‚à¤°","parent_id":"28"},
{"answer_id":"696","answer_english":"Sant Kabir Nagar","answer_hindi":"à¤¸à¤‚à¤¤ à¤•à¤¬à¥€à¤°à¤¨à¤—à¤°","parent_id":"34"},
{"answer_id":"262","answer_english":"Saraikela Kharsawan","answer_hindi":"à¤¸à¤°à¤¾à¤‡à¤•à¥‡à¤²à¤¾ à¤–à¤°à¤¸à¤¾à¤µà¤¾à¤","parent_id":"15"},
{"answer_id":"106","answer_english":"Saran","answer_hindi":"à¤¸à¤¾à¤°à¤¨","parent_id":"5"},
{"answer_id":"402","answer_english":"Satara","answer_hindi":"à¤¸à¤¾à¤¤à¤¾à¤°à¤¾","parent_id":"21"},
{"answer_id":"351","answer_english":"Satna ","answer_hindi":"à¤¸à¤¤à¤¨à¤¾","parent_id":"20"},
{"answer_id":"544","answer_english":"Sawai Madhopur","answer_hindi":"à¤¸à¤µà¤¾à¤ˆ à¤®à¤¾à¤§à¥‹à¤ªà¥à¤°","parent_id":"29"},
{"answer_id":"321","answer_english":"Sehore ","answer_hindi":"à¤¸à¥€à¤¹à¥‹à¤°","parent_id":"20"},
{"answer_id":"413","answer_english":"Senapati","answer_hindi":"à¤¸à¥‡à¤¨à¤¾à¤ªà¤¤à¤¿ à¤œà¤¿à¤²à¤¾","parent_id":"22"},
{"answer_id":"345","answer_english":"Seoni ","answer_hindi":"à¤¸à¤¿à¤µà¤¨à¥€Â ","parent_id":"20"},
{"answer_id":"442","answer_english":"Serchhip","answer_hindi":"à¤¸à¥‡à¤°à¤›à¤¿à¤ª","parent_id":"24"},
{"answer_id":"152","answer_english":"Shahdara","answer_hindi":"à¤¶à¤¾à¤¹à¤¦à¤°à¤¾","parent_id":"9"},
{"answer_id":"361","answer_english":"Shahdol ","answer_hindi":"à¤¶à¤¹à¤¡à¥‹à¤²","parent_id":"20"},
{"answer_id":"513","answer_english":"Shahid Bhagat Singh Nagar","answer_hindi":"à¤¶à¤¹à¥€à¤¦ à¤­à¤—à¤¤à¤¸à¤¿à¤‚à¤¹à¤¨à¤—à¤°","parent_id":"28"},
{"answer_id":"697","answer_english":"Shahjahanpur","answer_hindi":"à¤¶à¤¾à¤¹à¤œà¤¹à¤¾à¤à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"368","answer_english":"Shajapur","answer_hindi":"à¤¶à¤¾à¤œà¤¾à¤ªà¥à¤°","parent_id":"20"},
{"answer_id":"698","answer_english":"Shamli","answer_hindi":"à¤¶à¤¾à¤®à¤²à¥€","parent_id":"34"},
{"answer_id":"107","answer_english":"Sheikhpura","answer_hindi":"à¤¶à¥‡à¤–à¤ªà¥à¤°à¤¾","parent_id":"5"},
{"answer_id":"108","answer_english":"Sheohar","answer_hindi":"à¤¶à¤¿à¤µà¤¹à¤°","parent_id":"5"},
{"answer_id":"324","answer_english":"Sheopur ","answer_hindi":"à¤¶à¥à¤¯à¥‹à¤ªà¥à¤°","parent_id":"20"},
{"answer_id":"33","answer_english":"Shi Yomi","answer_hindi":"à¤¶à¤¿à¤“à¤®à¥€","parent_id":"3"},
{"answer_id":"222","answer_english":"Shimla","answer_hindi":"à¤¶à¤¿à¤®à¤²à¤¾","parent_id":"13"},
{"answer_id":"295","answer_english":"Shimoga","answer_hindi":"à¤¶à¤¿à¤®à¥‹à¤—à¤¾","parent_id":"16"},
{"answer_id":"328","answer_english":"Shivpuri ","answer_hindi":"à¤¶à¤¿à¤µà¤ªà¥à¤°à¥€","parent_id":"20"},
{"answer_id":"243","answer_english":"Shopian","answer_hindi":"à¤¶à¥‹à¤ªà¤¿à¤¯à¤¾à¤‚","parent_id":"14"},
{"answer_id":"699","answer_english":"Shravasti","answer_hindi":"à¤¶à¥à¤°à¤¾à¤µà¤¸à¥à¤¤à¥€","parent_id":"34"},
{"answer_id":"34","answer_english":"Siang","answer_hindi":"à¤¸à¤¿à¤¯à¤¾à¤‚à¤—","parent_id":"3"},
{"answer_id":"700","answer_english":"Siddharthnagar","answer_hindi":"à¤¸à¤¿à¤¦à¥à¤§à¤¾à¤°à¥à¤¥à¤¨à¤—à¤°","parent_id":"34"},
{"answer_id":"616","answer_english":"Siddipet","answer_hindi":"à¤¸à¤¿à¤¦à¥à¤¦à¤¿à¤ªà¥‡à¤Ÿ","parent_id":"32"},
{"answer_id":"352","answer_english":"Sidhi ","answer_hindi":"à¤¸à¥€à¤§à¥€","parent_id":"20"},
{"answer_id":"543","answer_english":"Sikar","answer_hindi":"à¤¸à¥€à¤•à¤°","parent_id":"29"},
{"answer_id":"258","answer_english":"Simdega","answer_hindi":"à¤¸à¤¿à¤®à¤¡à¥‡à¤—à¤¾","parent_id":"15"},
{"answer_id":"403","answer_english":"Sindhudurg","answer_hindi":"à¤¸à¤¿à¤‚à¤§à¥à¤¦à¥à¤°à¥à¤—","parent_id":"21"},
{"answer_id":"353","answer_english":"Singrauli ","answer_hindi":"à¤¸à¤¿à¤‚à¤—à¤°à¥Œà¤²à¥€","parent_id":"20"},
{"answer_id":"627","answer_english":"Sipahijala","answer_hindi":"à¤¸à¤¿à¤ªà¤¾à¤¹à¥€à¤œà¤¾à¤²à¤¾","parent_id":"33"},
{"answer_id":"223","answer_english":"Sirmaur","answer_hindi":"à¤¸à¤¿à¤°à¤®à¥Œà¤°","parent_id":"13"},
{"answer_id":"545","answer_english":"Sirohi","answer_hindi":"à¤¸à¤¿à¤°à¥‹à¤¹à¥€","parent_id":"29"},
{"answer_id":"211","answer_english":"Sirsa","answer_hindi":"à¤¸à¤¿à¤°à¤¸à¤¾","parent_id":"12"},
{"answer_id":"109","answer_english":"Sitamarhi","answer_hindi":"à¤¸à¥€à¤¤à¤¾à¤®à¤¢à¤¼à¥€","parent_id":"5"},
{"answer_id":"701","answer_english":"Sitapur","answer_hindi":"à¤¸à¥€à¤¤à¤¾à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"575","answer_english":"Sivaganga","answer_hindi":"à¤¶à¤¿à¤µà¤—à¤‚à¤—à¤¾","parent_id":"31"},
{"answer_id":"70","answer_english":"Sivasagar","answer_hindi":"à¤¶à¤¿à¤µà¤¸à¤¾à¤—à¤°","parent_id":"4"},
{"answer_id":"110","answer_english":"Siwan","answer_hindi":"à¤¸à¥€à¤µà¤¾à¤¨","parent_id":"5"},
{"answer_id":"224","answer_english":"Solan","answer_hindi":"à¤¸à¥‹à¤²à¤¨","parent_id":"13"},
{"answer_id":"404","answer_english":"Solapur","answer_hindi":"à¤¸à¥‹à¤²à¤¾à¤ªà¥à¤°","parent_id":"21"},
{"answer_id":"702","answer_english":"Sonbhadra","answer_hindi":"à¤¸à¥‹à¤¨à¤­à¤¦à¥à¤°","parent_id":"34"},
{"answer_id":"212","answer_english":"Sonipat","answer_hindi":"à¤¸à¥‹à¤¨à¥€à¤ªà¤¤","parent_id":"12"},
{"answer_id":"71","answer_english":"Sonitpur","answer_hindi":"à¤¶à¥‹à¤£à¤¿à¤¤à¤ªà¥à¤°","parent_id":"4"},
{"answer_id":"740","answer_english":"South 24 Parganas","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ 24 à¤ªà¤°à¤—à¤¨à¤¾","parent_id":"36"},
{"answer_id":"16","answer_english":"South Andaman","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤…à¤£à¥à¤¡à¤®à¤¾à¤¨","parent_id":"2"},
{"answer_id":"153","answer_english":"South Delhi ","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"154","answer_english":"South East Delhi","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤ªà¥‚à¤°à¥à¤µà¥€ à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"431","answer_english":"South Garo Hills","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤—à¤¾à¤°à¥‹ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"158","answer_english":"South Goa","answer_hindi":"Â à¤¦à¤•à¥à¤·à¤¿à¤£ à¤—à¥‹à¤µà¤¾","parent_id":"10"},
{"answer_id":"72","answer_english":"South Salmara-Mankachar","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤¸à¤¾à¤²à¤®à¤¾à¤°à¤¾-à¤®à¤¨à¤•à¤¾à¤šà¤°","parent_id":"4"},
{"answer_id":"550","answer_english":"South Sikkim","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£Â à¤¸à¤¿à¤•à¥à¤•à¤¿à¤®","parent_id":"30"},
{"answer_id":"624","answer_english":"South Tripura","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤¤à¥à¤°à¤¿à¤ªà¥à¤°à¤¾","parent_id":"33"},
{"answer_id":"155","answer_english":"South West Delhi","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤ªà¤¶à¥à¤šà¤¿à¤® à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"432","answer_english":"South West Garo Hills","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤ªà¤¶à¥à¤šà¤¿à¤® à¤—à¤¾à¤°à¥‹ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"433","answer_english":"South West Khasi Hills","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤ªà¤¶à¥à¤šà¤¿à¤® à¤–à¤¾à¤¸à¥€ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"507","answer_english":"Sri Muktsar Sahib","answer_hindi":"à¤®à¥à¤•à¥à¤¤à¤¸à¤°","parent_id":"28"},
{"answer_id":"10","answer_english":"Srikakulam","answer_hindi":"à¤¶à¥à¤°à¥€à¤•à¤¾à¤•à¥à¤²à¤®","parent_id":"1"},
{"answer_id":"244","answer_english":"Srinagar","answer_hindi":"à¤¶à¥à¤°à¥€à¤¨à¤—à¤°","parent_id":"14"},
{"answer_id":"487","answer_english":"Subarnapur(Sonepur)","answer_hindi":"à¤¸à¥à¤¬à¤°à¥à¤£à¤ªà¥à¤° (à¤¸à¥‹à¤¨à¤ªà¥à¤°)","parent_id":"26"},
{"answer_id":"140","answer_english":"Sukma","answer_hindi":"à¤¸à¥à¤•à¤®à¤¾","parent_id":"7"},
{"answer_id":"703","answer_english":"Sultanpur","answer_hindi":"à¤¸à¥à¤²à¥à¤¤à¤¾à¤¨à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"488","answer_english":"Sundargarh","answer_hindi":"à¤¸à¥à¤¨à¥à¤¦à¤°à¤—à¤¡à¤¼","parent_id":"26"},
{"answer_id":"111","answer_english":"Supaul","answer_hindi":"à¤¸à¥à¤ªà¥Œà¤²","parent_id":"5"},
{"answer_id":"141","answer_english":"Surajpur","answer_hindi":"à¤¸à¥‚à¤°à¤œà¤ªà¥à¤°","parent_id":"7"},
{"answer_id":"187","answer_english":"Surat","answer_hindi":"à¤¸à¥‚à¤°à¤¤","parent_id":"11"},
{"answer_id":"188","answer_english":"Surendranagar","answer_hindi":"à¤¸à¥à¤°à¥‡à¤‚à¤¦à¥à¤°à¤¨à¤—à¤°","parent_id":"11"},
{"answer_id":"142","answer_english":"Surguja","answer_hindi":"à¤¸à¤°à¤—à¥à¤œà¤¾","parent_id":"7"},
{"answer_id":"617","answer_english":"Suryapet","answer_hindi":"à¤¸à¥‚à¤°à¥à¤¯à¤¾à¤ªà¥‡à¤Ÿ","parent_id":"32"},
{"answer_id":"417","answer_english":"Tamenglong","answer_hindi":"à¤¤à¤®à¥‡à¤‚à¤—à¤²à¥‰à¤¨à¥à¤— à¤œà¤¿à¤²à¤¾","parent_id":"22"},
{"answer_id":"189","answer_english":"Tapi","answer_hindi":"à¤¤à¤¾à¤ªà¥€","parent_id":"11"},
{"answer_id":"514","answer_english":"Tarn Taran","answer_hindi":"à¤¤à¤°à¤¨ à¤¤à¤¾à¤°à¤¨ à¤¸à¤¾à¤¹à¤¿à¤¬","parent_id":"28"},
{"answer_id":"35","answer_english":"Tawang","answer_hindi":"à¤¤à¤µà¤¾à¤‚à¤—","parent_id":"3"},
{"answer_id":"716","answer_english":"Tehri Garhwal","answer_hindi":"à¤Ÿà¤¿à¤¹à¤°à¥€ à¤—à¤¢à¤¼à¤µà¤¾à¤²","parent_id":"35"},
{"answer_id":"421","answer_english":"Tengnoupal","answer_hindi":"à¤¤à¥‡à¤‚à¤—à¤¨à¥‹à¤‰à¤ªà¤²Â ","parent_id":"22"},
{"answer_id":"576","answer_english":"Tenkasi","answer_hindi":"à¤¤à¥‡à¤¨à¤•à¤¾à¤¶à¥€","parent_id":"31"},
{"answer_id":"405","answer_english":"Thane","answer_hindi":"à¤ à¤¾à¤£à¥‡","parent_id":"21"},
{"answer_id":"581","answer_english":"Thanjavur","answer_hindi":"à¤¤à¤‚à¤œà¤¾à¤µà¥à¤°","parent_id":"31"},
{"answer_id":"579","answer_english":"Theni","answer_hindi":"à¤¤à¥‡à¤¨à¥€","parent_id":"31"},
{"answer_id":"312","answer_english":"Thiruvananthapuram","answer_hindi":"à¤¤à¤¿à¤°à¥à¤µà¤¨à¤¨à¥à¤¤à¤ªà¥à¤°à¤®Â ","parent_id":"17"},
{"answer_id":"582","answer_english":"Thoothukudi","answer_hindi":"à¤¤à¥‚à¤¤à¥à¤•à¥à¤¡à¤¼à¥€","parent_id":"31"},
{"answer_id":"410","answer_english":"Thoubal","answer_hindi":"à¤¥à¥Œà¤¬à¤² à¤œà¤¿à¤²à¤¾","parent_id":"22"},
{"answer_id":"313","answer_english":"Thrissur","answer_hindi":"à¤¤à¥à¤°à¤¿à¤¸à¥à¤¸à¥‚à¤°Â ","parent_id":"17"},
{"answer_id":"358","answer_english":"Tikamgarh ","answer_hindi":"à¤Ÿà¥€à¤•à¤®à¤—à¤¢à¤¼","parent_id":"20"},
{"answer_id":"73","answer_english":"Tinsukia","answer_hindi":"à¤¤à¤¿à¤¨à¤¸à¥à¤•à¤¿à¤¯à¤¾","parent_id":"4"},
{"answer_id":"36","answer_english":"Tirap","answer_hindi":"à¤¤à¤¿à¤°à¤¾à¤ª","parent_id":"3"},
{"answer_id":"578","answer_english":"Tiruchirappalli","answer_hindi":"à¤¤à¤¿à¤°à¥à¤šà¤¿à¤°à¤¾à¤ªà¤²à¥à¤²à¥€","parent_id":"31"},
{"answer_id":"580","answer_english":"Tirunelveli","answer_hindi":"à¤¤à¤¿à¤°à¥‚à¤¨à¥‡à¤²à¤µà¥‡à¤²à¥€","parent_id":"31"},
{"answer_id":"583","answer_english":"Tirupattur","answer_hindi":"à¤¤à¤¿à¤°à¥à¤ªà¤¤à¥à¤¤à¥à¤°","parent_id":"31"},
{"answer_id":"577","answer_english":"Tirupur","answer_hindi":"à¤¤à¤¿à¤°à¥à¤ªà¥à¤°","parent_id":"31"},
{"answer_id":"584","answer_english":"Tiruvallur","answer_hindi":"à¤¤à¤¿à¤°à¥à¤µà¤²à¥à¤²à¥à¤°","parent_id":"31"},
{"answer_id":"586","answer_english":"Tiruvannamalai","answer_hindi":"à¤¤à¤¿à¤°à¥à¤µà¤¨à¥à¤¨à¤¾à¤®à¤²à¤ˆ","parent_id":"31"},
{"answer_id":"585","answer_english":"Tiruvarur","answer_hindi":"à¤¤à¤¿à¤°à¥à¤µà¤¾à¤°à¥à¤°","parent_id":"31"},
{"answer_id":"546","answer_english":"Tonk","answer_hindi":"à¤Ÿà¥‹à¤‚à¤•","parent_id":"29"},
{"answer_id":"455","answer_english":"Tuensang","answer_hindi":"à¤Ÿà¥à¤µà¥‡à¤¨à¤¸à¤¾à¤‚à¤—","parent_id":"25"},
{"answer_id":"296","answer_english":"Tumkur","answer_hindi":"à¤¤à¥à¤®à¤•à¥‚à¤°","parent_id":"16"},
{"answer_id":"547","answer_english":"Udaipur","answer_hindi":"à¤‰à¤¦à¤¯à¤ªà¥à¤°","parent_id":"29"},
{"answer_id":"74","answer_english":"Udalguri","answer_hindi":"à¤‰à¤¦à¤²à¤—à¥à¤¡à¤¼à¥€","parent_id":"4"},
{"answer_id":"717","answer_english":"Udham Singh Nagar","answer_hindi":"à¤‰à¤§à¤®à¤¸à¤¿à¤‚à¤¹ à¤¨à¤—à¤°","parent_id":"35"},
{"answer_id":"245","answer_english":"Udhampur","answer_hindi":"à¤‰à¤§à¤®à¤ªà¥à¤°","parent_id":"14"},
{"answer_id":"297","answer_english":"Udupi","answer_hindi":"à¤‰à¤¡à¥à¤ªà¥€","parent_id":"16"},
{"answer_id":"369","answer_english":"Ujjain","answer_hindi":"à¤‰à¤œà¥à¤œà¥ˆà¤¨","parent_id":"20"},
{"answer_id":"414","answer_english":"Ukhrul","answer_hindi":"à¤‰à¤–à¤°à¥à¤² à¤œà¤¿à¤²à¤¾","parent_id":"22"},
{"answer_id":"362","answer_english":"Umaria ","answer_hindi":"à¤‰à¤®à¤°à¤¿à¤¯à¤¾","parent_id":"20"},
{"answer_id":"225","answer_english":"Una","answer_hindi":"à¤‰à¤¨à¤¾","parent_id":"13"},
{"answer_id":"630","answer_english":"Unakoti","answer_hindi":"à¤‰à¤¨à¤¾à¤•à¥‹à¤Ÿà¥€","parent_id":"33"},
{"answer_id":"704","answer_english":"Unnao","answer_hindi":"à¤‰à¤¨à¥à¤¨à¤¾à¤µ","parent_id":"34"},
{"answer_id":"37","answer_english":"Upper Dibang Valley","answer_hindi":"à¤Šà¤ªà¤°à¥€ à¤¦à¤¿à¤¬à¤¾à¤‚à¤— à¤˜à¤¾à¤Ÿà¥€","parent_id":"3"},
{"answer_id":"38","answer_english":"Upper Siang","answer_hindi":"à¤Šà¤ªà¤°à¥€ à¤¸à¤¿à¤¯à¤¾à¤‚à¤—","parent_id":"3"},
{"answer_id":"39","answer_english":"Upper Subansiri","answer_hindi":"à¤Šà¤ªà¤°à¥€ à¤¸à¥à¤¬à¤¨à¤¸à¤¿à¤°à¥€","parent_id":"3"},
{"answer_id":"741","answer_english":"Uttar Dinajpur","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤¦à¤¿à¤¨à¤¾à¤œà¤ªà¥à¤°","parent_id":"36"},
{"answer_id":"298","answer_english":"Uttara Kannada","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤•à¤¨à¥à¤¨à¤¡à¤¼","parent_id":"16"},
{"answer_id":"718","answer_english":"Uttarkashi","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤°à¤•à¤¾à¤¶à¥€","parent_id":"35"},
{"answer_id":"190","answer_english":"Vadodara","answer_hindi":"à¤µà¥œà¥‹à¤¦à¤°à¤¾","parent_id":"11"},
{"answer_id":"112","answer_english":"Vaishali","answer_hindi":"à¤µà¥ˆà¤¶à¤¾à¤²à¥€","parent_id":"5"},
{"answer_id":"191","answer_english":"Valsad","answer_hindi":"à¤µà¤²à¤¸à¤¾à¤¡","parent_id":"11"},
{"answer_id":"705","answer_english":"Varanasi","answer_hindi":"à¤µà¤¾à¤°à¤¾à¤£à¤¸à¥€","parent_id":"34"},
{"answer_id":"587","answer_english":"Vellore","answer_hindi":"à¤µà¥‡à¤²à¥à¤²à¥‚à¤°","parent_id":"31"},
{"answer_id":"322","answer_english":"Vidisha ","answer_hindi":"à¤µà¤¿à¤¦à¤¿à¤¶à¤¾","parent_id":"20"},
{"answer_id":"299","answer_english":"Vijayanagara","answer_hindi":"à¤µà¤¿à¤œà¤¯à¤¨à¤—à¤°","parent_id":"16"},
{"answer_id":"618","answer_english":"Vikarabad","answer_hindi":"à¤µà¤¿à¤•à¤¼à¤¾à¤°à¤¾à¤¬à¤¾à¤¦","parent_id":"32"},
{"answer_id":"588","answer_english":"Viluppuram","answer_hindi":"à¤µà¤¿à¤²à¥à¤ªà¥à¤ªà¥à¤°à¤®","parent_id":"31"},
{"answer_id":"589","answer_english":"Virudhunagar","answer_hindi":"à¤µà¤¿à¤°à¥à¤§à¥à¤¨à¤—à¤°","parent_id":"31"},
{"answer_id":"11","answer_english":"Visakhapatnam","answer_hindi":"à¤µà¤¿à¤¶à¤¾à¤–à¤¾à¤ªà¤Ÿà¥à¤Ÿà¤¨à¤®","parent_id":"1"},
{"answer_id":"12","answer_english":"Vizianagaram","answer_hindi":"à¤µà¤¿à¤œà¤¯à¤¨à¤—à¤°à¤®","parent_id":"1"},
{"answer_id":"619","answer_english":"Wanaparthy","answer_hindi":"à¤µà¤¾à¤¨à¤ªà¤°à¥à¤¤à¤¿","parent_id":"32"},
{"answer_id":"621","answer_english":"Warangal Rural","answer_hindi":"à¤µà¤°à¤‚à¤—à¤² à¤—à¥à¤°à¤¾à¤®à¥€à¤£","parent_id":"32"},
{"answer_id":"620","answer_english":"Warangal Urban","answer_hindi":"à¤µà¤¾à¤°à¤‚à¤—à¤² à¤…à¤°à¥à¤¬à¤¨","parent_id":"32"},
{"answer_id":"406","answer_english":"Wardha","answer_hindi":"à¤µà¤°à¥à¤§à¤¾","parent_id":"21"},
{"answer_id":"407","answer_english":"Washim","answer_hindi":"à¤µà¤¾à¤¶à¥€à¤®","parent_id":"21"},
{"answer_id":"314","answer_english":"Wayanad","answer_hindi":"à¤µà¤¾à¤¯à¤¨à¤¾à¤¡Â ","parent_id":"17"},
{"answer_id":"113","answer_english":"West Champaran","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤®à¥€ à¤šà¤®à¥à¤ªà¤¾à¤°à¤£ à¤œà¤¿à¤²à¤¾","parent_id":"5"},
{"answer_id":"156","answer_english":"West Delhi","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"426","answer_english":"West Garo Hills","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤—à¤¾à¤°à¥‹ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"13","answer_english":"West Godavari","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤—à¥‹à¤¦à¤¾à¤µà¤°à¥€","parent_id":"1"},
{"answer_id":"427","answer_english":"West Jaintia Hills","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤œà¤¯à¤‚à¤¤à¤¿à¤¯à¤¾ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"40","answer_english":"West Kameng","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤•à¤®à¥‡à¤‚à¤—","parent_id":"3"},
{"answer_id":"75","answer_english":"West Karbi Anglong","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤•à¤¾à¤°à¥à¤¬à¥€ à¤†à¤‚à¤—à¤²à¥‹à¤‚à¤—","parent_id":"4"},
{"answer_id":"428","answer_english":"West Khasi Hills","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤–à¤¾à¤¸à¥€ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"41","answer_english":"West Siang","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤¸à¤¿à¤¯à¤¾à¤‚à¤—","parent_id":"3"},
{"answer_id":"551","answer_english":"West Sikkim","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤®Â à¤¸à¤¿à¤•à¥à¤•à¤¿à¤®","parent_id":"30"},
{"answer_id":"261","answer_english":"West Singhbhum","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤®à¥€ à¤¸à¤¿à¤‚à¤¹à¤­à¥‚à¤® ","parent_id":"15"},
{"answer_id":"629","answer_english":"West Tripura","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤¤à¥à¤°à¤¿à¤ªà¥à¤°à¤¾","parent_id":"33"},
{"answer_id":"456","answer_english":"Wokha","answer_hindi":"à¤µà¥‹à¤–à¤¾","parent_id":"25"},
{"answer_id":"622","answer_english":"Yadadri Bhuvanagiri","answer_hindi":"à¤¯à¤¾à¤¦à¤¾à¤¦à¥à¤°à¥€ à¤­à¥à¤µà¤¨à¤—à¤¿à¤°à¥€","parent_id":"32"},
{"answer_id":"300","answer_english":"Yadgir","answer_hindi":"à¤¯à¤¾à¤¦à¤—à¥€à¤°","parent_id":"16"},
{"answer_id":"213","answer_english":"Yamuna Nagar","answer_hindi":"à¤¯à¤®à¥à¤¨à¤¾à¤¨à¤—à¤°","parent_id":"12"},
{"answer_id":"492","answer_english":"Yanam","answer_hindi":"à¤¯à¤¾à¤¨à¤®","parent_id":"27"},
{"answer_id":"408","answer_english":"Yavatmal","answer_hindi":"à¤¯à¤µà¤¤à¤®à¤¾à¤³","parent_id":"21"},
{"answer_id":"457","answer_english":"Zunheboto","answer_hindi":"à¤œà¤¼à¥à¤¨à¥à¤¹à¥‡à¤¬à¥‹à¤Ÿà¥‹","parent_id":"25"}
        ];

    $rootScope.$storage.currentQuestion = {
         name : "language",
        question_id : 1,
        question_english : "Greetings! Would you like to proceed in English or Hindi?",
        question_hindi : "Greetings! Would you like to proceed in English or Hindi?",
        question_type : "option",
        is_skip : false,
        answers : [
            {
                answer_id : "1",
                answer_english : "English",
                answer_hindi : "English",
            },
            {
                answer_id : "2",
                answer_english : "à¤¹à¤¿à¤‚à¤¦à¥€",  
                answer_hindi : "à¤¹à¤¿à¤‚à¤¦à¥€",  
            }
        ],
        is_answered : false,
        answer : "",
    };
    $rootScope.$storage.language = "English";

    $rootScope.$storage.chat_messages = [
        {
            name : "language",
            question_id : 1,
            question_english : "Greetings! Would you like to proceed in English or Hindi?",
            question_hindi : "Greetings! Would you like to proceed in English or Hindi?",
            question_type : "option",
            is_skip : false,
            answers : [
                {
                    answer_id : "1",
                    answer_english : "English",
                    answer_hindi : "English",
                },
                {
                    answer_id : "2",
                    answer_english : "à¤¹à¤¿à¤‚à¤¦à¥€",  
                    answer_hindi : "à¤¹à¤¿à¤‚à¤¦à¥€",  
                }
            ],
            is_answered : false,
            answer : "",
        },
        {
            name : "mobile",
            question_id : 2,
            question_english : "Please type the primary phone number that you had registered with us",
            question_hindi : "à¤•à¥ƒà¤ªà¤¯à¤¾ à¤µà¤¹ à¤ªà¥à¤°à¤¾à¤¥à¤®à¤¿à¤• à¤«à¤¼à¥‹à¤¨ à¤¨à¤‚à¤¬à¤° à¤²à¤¿à¤–à¥‡à¤‚, à¤œà¥‹ à¤†à¤ªà¤¨à¥‡ à¤¹à¤®à¤¾à¤°à¥‡ à¤¸à¤¾à¤¥ à¤ªà¤‚à¤œà¥€à¤•à¥ƒà¤¤ à¤•à¤¿à¤¯à¤¾ à¤¥à¤¾",
            question_type : "number",
            max_length : 10,
            is_skip : false,
            answers : [],
            is_answered : false,
            answer : "",
        },
        {
            name : "not_registered",
            question_id : 3,
            question_english : "Your mobile number is not registered with us. <br /><br /> Please register your application on <a href='"+base_url+"' target='_blank'>"+base_url+"</a>",
            question_hindi : "à¤†à¤ªà¤•à¤¾ à¤®à¥‹à¤¬à¤¾à¤‡à¤² à¤¨à¤‚à¤¬à¤° à¤¹à¤®à¤¾à¤°à¥‡ à¤¸à¤¾à¤¥ à¤ªà¤‚à¤œà¥€à¤•à¥ƒà¤¤ à¤¨à¤¹à¥€à¤‚ à¤¹à¥ˆà¥¤ <br /><br />à¤•à¥ƒà¤ªà¤¯à¤¾ à¤…à¤ªà¤¨à¤¾ à¤†à¤µà¥‡à¤¦à¤¨ <a href='"+base_url+"' target='_blank'>"+base_url+"</a> à¤ªà¤° à¤ªà¤‚à¤œà¥€à¤•à¥ƒà¤¤ à¤•à¤°à¥‡à¤‚",
            question_type : "none",
            max_length : 10,
            is_skip : false,
            answers : [],
            is_answered : false,
            answer : "",
        },
        {
            name : "otp",
            question_id : 4,
            question_english : "You must have received an OTP. Please type that.",
            question_hindi : "à¤†à¤ªà¤•à¥‹ à¤à¤• OTP à¤ªà¥à¤°à¤¾à¤ªà¥à¤¤ à¤¹à¥à¤† à¤¹à¥‹à¤—à¤¾à¥¤ à¤•à¥ƒà¤ªà¤¯à¤¾ OTP à¤Ÿà¤¾à¤‡à¤ª à¤•à¤°à¥‡à¤‚",
            question_type : "number",
            max_length : 6,
            is_skip : false,
            answers : [],
            is_answered : false,
            answer : "",
        },
        {
            name : "verify_otp",
            question_id : 5,
            question_english : "Invalid verification code, Please try again.",
            question_hindi : "à¤µà¥ˆà¤°à¤¿à¤«à¤¿à¤•à¥‡à¤¶à¤¨ à¤•à¥‹à¤¡ à¤—à¤²à¤¤ à¤¹à¥ˆ.",
            question_type : "none",
            max_length : 6,
            is_skip : false,
            answers : [],
            is_answered : false,
            answer : "",
        },
        {
            name : "info",
            question_id : 6,
            question_english : "Congratulations for showing your interest for congress social media department. We would like to know more about you and your interest in our organization",
            question_hindi : "à¤•à¤¾à¤‚à¤—à¥à¤°à¥‡à¤¸ à¤•à¥‡ à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾ à¤µà¤¿à¤­à¤¾à¤— à¤•à¥‡ à¤²à¤¿à¤ à¤†à¤ªà¤•à¥€ à¤°à¥à¤šà¤¿ à¤¦à¤¿à¤–à¤¾à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤¬à¤§à¤¾à¤ˆà¥¤ à¤¹à¤® à¤†à¤ªà¤•à¥‡ à¤”à¤° à¤¹à¤®à¤¾à¤°à¥‡ à¤¸à¤‚à¤—à¤ à¤¨ à¤®à¥‡à¤‚ à¤†à¤ªà¤•à¥€ à¤°à¥à¤šà¤¿ à¤•à¥‡ à¤¬à¤¾à¤°à¥‡ à¤®à¥‡à¤‚ à¤…à¤§à¤¿à¤• à¤œà¤¾à¤¨à¤¨à¤¾ à¤šà¤¾à¤¹à¥‡à¤‚à¤—à¥‡",
            question_type : "none",
            max_length : 6,
            is_skip : false,
            answers : [],
            is_answered : false,
            answer : "",
        },
        {
            name : "qualification",
            question_id : 7,
            question_english : "What is your educational qualification?",
            question_hindi : "à¤†à¤ªà¤•à¥€ à¤à¤œà¥à¤•à¥‡à¤¶à¤¨à¤² à¤•à¥à¤µà¤¾à¤²à¤¿à¤«à¤¿à¤•à¥‡à¤¶à¤¨Â à¤•à¥à¤¯à¤¾ à¤¹à¥ˆ?",
            question_type : "selection",
            is_answered : false,
            is_skip : false,
            answers : [
                {"answer_id":"1","answer_english":"School","answer_hindi":"à¤¸à¥à¤•à¥‚à¤²"},
                {"answer_id":"2","answer_english":"Graduate","answer_hindi":"à¤—à¥à¤°à¥‡à¤œà¥à¤à¤Ÿ"},
                {"answer_id":"3","answer_english":"Post graduate","answer_hindi":"à¤ªà¥‹à¤¸à¥à¤Ÿ à¤—à¥à¤°à¥‡à¤œà¥à¤à¤Ÿ"},
                {"answer_id":"4","answer_english":"PhD","answer_hindi":"à¤ªà¥€à¤à¤šà¤¡à¥€"},
            ],
            answer : "",
        },
        {
            name : "profession",
            question_id : 8,
            question_english : "What is your professional/ employment status",
            question_hindi : "à¤†à¤ªà¤•à¥€ à¤µà¥à¤¯à¤¾à¤µà¤¸à¤¾à¤¯à¤¿à¤• / à¤°à¥‹à¤œà¤—à¤¾à¤° à¤¸à¥à¤¥à¤¿à¤¤à¤¿ à¤•à¥à¤¯à¤¾ à¤¹à¥ˆ?",
            question_type : "selection",
            is_answered : false,
            is_skip : false,
            answers : [
                {"answer_id":"1","answer_english":"Student","answer_hindi":"à¤›à¤¾à¤¤à¥à¤°"},
                {"answer_id":"2","answer_english":"Self Employed/ Business","answer_hindi":"à¤¸à¥à¤µ - à¤°à¥‹à¤œà¤—à¤¾à¤° / à¤µà¥à¤¯à¤¾à¤ªà¤¾à¤°"},
                {"answer_id":"3","answer_english":"Private Service","answer_hindi":"à¤ªà¥à¤°à¤¾à¤‡à¤µà¥‡à¤Ÿ à¤¸à¤°à¥à¤µà¤¿à¤¸"},
                {"answer_id":"4","answer_english":"Govt/ Semi Government","answer_hindi":"à¤¸à¤°à¤•à¤¾à¤°à¥€ / à¤…à¤°à¥à¤§ à¤¸à¤°à¤•à¤¾à¤°à¥€ à¤¸à¥‡à¤µà¤¾"},
                {"answer_id":"5","answer_english":"NGO","answer_hindi":"à¤à¤¨à¤œà¥€à¤“"},
                {"answer_id":"6","answer_english":"Other","answer_hindi":"à¤…à¤¨à¥à¤¯"}
            ],
            answer : "",
        },
        {
            name : "prefered_working",
            question_id : 9,
            question_english : "How many hours per day are you willing to dedicate to working with the Congress Social Media team?",
            question_hindi : "à¤†à¤ª à¤ªà¥à¤°à¤¤à¤¿ à¤¦à¤¿à¤¨ à¤•à¤¿à¤¤à¤¨à¥‡ à¤˜à¤‚à¤Ÿà¥‡ à¤•à¤¾à¤‚à¤—à¥à¤°à¥‡à¤¸ à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾ à¤Ÿà¥€à¤® à¤•à¥‡ à¤¸à¤¾à¤¥ à¤•à¤¾à¤® à¤•à¤°à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤¸à¤®à¤°à¥à¤ªà¤¿à¤¤ à¤•à¤°à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤¤à¥ˆà¤¯à¤¾à¤° à¤¹à¥ˆà¤‚?",
            question_type : "selection",
            is_answered : false,
            is_skip : false,
            answers : [
                {"answer_id":"1","answer_english":"1-2 Hours","answer_hindi":"1-2 à¤˜à¤‚à¤Ÿà¥‡"},
                {"answer_id":"2","answer_english":"2-4 Hours","answer_hindi":"2-4 à¤˜à¤‚à¤Ÿà¥‡"},
                {"answer_id":"3","answer_english":"4-6 Hours","answer_hindi":"4-6 à¤˜à¤‚à¤Ÿà¥‡"},
                {"answer_id":"4","answer_english":"More than 6 Hours","answer_hindi":"6 à¤˜à¤‚à¤Ÿà¥‡ à¤¸à¥‡ à¤œà¥à¤¯à¤¾à¤¦à¤¾"},
            ],
            answer : "",
        },
        {
            name : "prefered_working",
            question_id : 10,
            // question_english : "In which of the following areas are you willing to work with the Congress Social Media team? Please mention top TWO only. <br /><br />Training,<br /> Research,<br /> Content (writing),<br /> Content Creation,<br /> Outreach/ Team Development,<br /> Outreach/ Team Development,<br /> Content Distribution.",
            // question_hindi : "à¤†à¤ª à¤¨à¤¿à¤®à¥à¤¨à¤²à¤¿à¤–à¤¿à¤¤ à¤®à¥‡à¤‚ à¤¸à¥‡ à¤•à¤¿à¤¸ à¤•à¥à¤·à¥‡à¤¤à¥à¤° à¤®à¥‡à¤‚ à¤•à¤¾à¤‚à¤—à¥à¤°à¥‡à¤¸ à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾ à¤Ÿà¥€à¤® à¤•à¥‡ à¤¸à¤¾à¤¥ à¤•à¤¾à¤® à¤•à¤°à¤¨à¥‡ à¤•à¥‡ à¤‡à¤šà¥à¤›à¥à¤• à¤¹à¥ˆà¤‚? à¤•à¥ƒà¤ªà¤¯à¤¾ à¤•à¥‡à¤µà¤² à¤¦à¥‹ à¤•à¤¾ à¤‰à¤²à¥à¤²à¥‡à¤– à¤•à¤°à¥‡à¤‚.<br /><br /> à¤Ÿà¥à¤°à¥‡à¤¨à¤¿à¤‚à¤—,<br /> à¤°à¤¿à¤¸à¤°à¥à¤š,<br /> à¤•à¤‚à¤Ÿà¥‡à¤‚à¤Ÿ à¤²à¥‡à¤–à¤¨,<br /> à¤•à¤‚à¤Ÿà¥‡à¤‚à¤Ÿ (à¤µà¥€à¤¡à¤¿à¤¯à¥‹ / à¤‘à¤¡à¤¿à¤¯à¥‹ / à¤—à¥à¤°à¤¾à¤«à¤¿à¤•à¥à¤¸,<br />à¤†à¤‰à¤Ÿà¤°à¥€à¤š / à¤Ÿà¥€à¤® à¤¤à¥ˆà¤¯à¤¾à¤° à¤•à¤°à¤¨à¤¾,<br />à¤•à¤‚à¤Ÿà¥‡à¤‚à¤Ÿ à¤µà¤¿à¤¤à¤°à¤£",
            question_english : "Please select your areas of interest you are willing to work with the Congress Social Media team?",
            question_hindi : "à¤†à¤ª à¤¨à¤¿à¤®à¥à¤¨à¤²à¤¿à¤–à¤¿à¤¤ à¤®à¥‡à¤‚ à¤¸à¥‡ à¤•à¤¿à¤¸ à¤•à¥à¤·à¥‡à¤¤à¥à¤° à¤®à¥‡à¤‚ à¤•à¤¾à¤‚à¤—à¥à¤°à¥‡à¤¸ à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾ à¤Ÿà¥€à¤® à¤•à¥‡ à¤¸à¤¾à¤¥ à¤•à¤¾à¤® à¤•à¤°à¤¨à¥‡ à¤•à¥‡ à¤‡à¤šà¥à¤›à¥à¤• à¤¹à¥ˆà¤‚?",
            max_check : 2,
            question_type : "checkbox",
            is_answered : false,
            is_skip : false,
            answers : [
                {"answer_id":"1","answer_english":"Training","answer_hindi":"à¤Ÿà¥à¤°à¥‡à¤¨à¤¿à¤‚à¤—"},
                {"answer_id":"2","answer_english":"Research","answer_hindi":"à¤°à¤¿à¤¸à¤°à¥à¤š"},
                {"answer_id":"3","answer_english":"Content (writing)","answer_hindi":"à¤•à¤‚à¤Ÿà¥‡à¤‚à¤Ÿ à¤²à¥‡à¤–à¤¨"},
                {"answer_id":"4","answer_english":"Content Creation (Video, Audio, Graphics)","answer_hindi":"à¤•à¤‚à¤Ÿà¥‡à¤‚à¤Ÿ à¤•à¥à¤°à¤¿à¤à¤¶à¤¨ (à¤µà¥€à¤¡à¤¿à¤¯à¥‹ / à¤‘à¤¡à¤¿à¤¯à¥‹ / à¤—à¥à¤°à¤¾à¤«à¤¿à¤•à¥à¤¸)"},
                {"answer_id":"5","answer_english":"Outreach/ Team Development","answer_hindi":"à¤†à¤‰à¤Ÿà¤°à¥€à¤š / à¤Ÿà¥€à¤® à¤¤à¥ˆà¤¯à¤¾à¤° à¤•à¤°à¤¨à¤¾"},
                {"answer_id":"6","answer_english":"Content Distribution","answer_hindi":"à¤•à¤‚à¤Ÿà¥‡à¤‚à¤Ÿ à¤µà¤¿à¤¤à¤°à¤£"},
            ],
            answer : "",
        },
        {
            name : "activity_area",
            question_id : 11,
            question_english : "Let us know if there any other area or activity you would like to be involved in with the social media team (not mentioned in previous options), please note them here",
            question_hindi : "à¤¯à¤¦à¤¿ à¤•à¥‹à¤ˆ à¤…à¤¨à¥à¤¯ à¤•à¥à¤·à¥‡à¤¤à¥à¤° à¤¯à¤¾ à¤—à¤¤à¤¿à¤µà¤¿à¤§à¤¿ à¤†à¤ª à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾ à¤Ÿà¥€à¤® (à¤ªà¤¿à¤›à¤²à¥‡ à¤µà¤¿à¤•à¤²à¥à¤ªà¥‹à¤‚ à¤®à¥‡à¤‚ à¤‰à¤²à¥à¤²à¤¿à¤–à¤¿à¤¤ à¤¨à¤¹à¥€à¤‚) à¤•à¥‡ à¤¸à¤¾à¤¥ à¤¶à¤¾à¤®à¤¿à¤² à¤•à¤°à¤¨à¤¾ à¤šà¤¾à¤¹à¤¤à¥‡ à¤¹à¥ˆà¤‚, à¤¤à¥‹ à¤•à¥ƒà¤ªà¤¯à¤¾ à¤¹à¤®à¥‡à¤‚ à¤¬à¤¤à¤¾à¤à¤‚.",
            question_type : "text",
            is_answered : false,
            is_skip : false,
            answers : [
                // {"answer_id":"1","answer_english":"Training","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
                // {"answer_id":"2","answer_english":"Research","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
                // {"answer_id":"3","answer_english":"Content (writing)","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
                // {"answer_id":"4","answer_english":"Content Creation","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
                // {"answer_id":"5","answer_english":"Outreach/ Team Development","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
                // {"answer_id":"5","answer_english":"Content Distribution","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
            ],
            answer : "",
        },
        {
            name : "social_media_platforms",
            question_id : 12,
            question_english : "Which of these social media platforms you are more active on?",
            question_hindi : "à¤†à¤ª à¤‡à¤¨à¤®à¥‡à¤‚ à¤¸à¥‡ à¤•à¤¿à¤¸ à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾ à¤ªà¥à¤²à¥‡à¤Ÿà¤«à¥‰à¤°à¥à¤® à¤ªà¤° à¤¸à¤•à¥à¤°à¤¿à¤¯ à¤¹à¥ˆà¤‚? à¤•à¥‡à¤µà¤² à¤¶à¥€à¤°à¥à¤· à¤¦à¥‹ à¤•à¤¾ à¤‰à¤²à¥à¤²à¥‡à¤– à¤•à¤°à¥‡à¤‚.",
            question_type : "checkbox",
            max_check : 15,
            is_answered : false,
            is_skip : false,
            answers : [
                {"answer_id":"2","answer_english":"Facebook","answer_hindi":"à¤«à¥‡à¤¸à¤¬à¥à¤•"},
                {"answer_id":"1","answer_english":"WhatsApp","answer_hindi":"à¤µà¥à¤¹à¤¾à¤Ÿà¥à¤¸à¤à¤ª"},
                {"answer_id":"3","answer_english":"Twitter","answer_hindi":"à¤Ÿà¥à¤µà¤¿à¤Ÿà¤°"},
                {"answer_id":"5","answer_english":"Instagram","answer_hindi":"à¤‡à¤‚à¤¸à¥à¤Ÿà¤¾à¤—à¥à¤°à¤¾à¤®"},
                {"answer_id":"4","answer_english":"YouTube","answer_hindi":"à¤¯à¥‚à¤Ÿà¥à¤¯à¥‚à¤¬"},
                {"answer_id":"6","answer_english":"linkedIn","answer_hindi":"à¤²à¤¿à¤‚à¤•à¤¡à¤¿à¤¨"},
                {"answer_id":"7","answer_english":"Quora","answer_hindi":"à¤•à¥à¤µà¥‹à¤°à¤¾"},
                {"answer_id":"5","answer_english":"Other","answer_hindi":"à¤…à¤¨à¥à¤¯"},
            ],
            answer : "",
        },
        {
            name : "social_media_platform_links",
            question_id : 13,
            question_english : "please provide the links of your social media IDs on your top 2 platforms (as mentioned by you previously)",
            question_hindi : "à¤•à¥ƒà¤ªà¤¯à¤¾ à¤…à¤ªà¤¨à¥‡ à¤¶à¥€à¤°à¥à¤· 2 à¤ªà¥à¤²à¥‡à¤Ÿà¤«à¤¾à¤°à¥à¤®à¥‹à¤‚ à¤ªà¤° à¤…à¤ªà¤¨à¥‡ à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾ à¤†à¤ˆà¤¡à¥€ à¤•à¥‡ à¤²à¤¿à¤‚à¤• à¤ªà¥à¤°à¤¦à¤¾à¤¨ à¤•à¤°à¥‡à¤‚ (à¤œà¥ˆà¤¸à¤¾ à¤•à¤¿ à¤†à¤ªà¤¨à¥‡ à¤ªà¤¹à¤²à¥‡ à¤‰à¤²à¥à¤²à¥‡à¤– à¤•à¤¿à¤¯à¤¾ à¤¹à¥ˆ",
            question_type : "text",
            is_answered : false,
            is_skip : false,
            answers : [
                // {"answer_id":"1","answer_english":"Training","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
                // {"answer_id":"2","answer_english":"Research","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
                // {"answer_id":"3","answer_english":"Content (writing)","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
                // {"answer_id":"4","answer_english":"Content Creation","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
                // {"answer_id":"5","answer_english":"Outreach/ Team Development","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
                // {"answer_id":"5","answer_english":"Content Distribution","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
            ],
            answer : "",
        },
        {
            name : "email",
            question_id : 14,
            question_english : "please provide your email id if you have any, otherwise write 'NA'",
            question_hindi : "à¤¯à¤¦à¤¿ à¤†à¤ªà¤•à¥‡ à¤ªà¤¾à¤¸ à¤•à¥‹à¤ˆ à¤ˆà¤®à¥‡à¤² à¤†à¤ˆà¤¡à¥€ à¤¹à¥ˆ, à¤¤à¥‹ à¤•à¥ƒà¤ªà¤¯à¤¾ à¤‡à¤¸à¥‡ à¤²à¤¿à¤–à¥‡à¤‚, à¤…à¤¨à¥à¤¯à¤¥à¤¾ 'NA' à¤²à¤¿à¤–à¥‡à¤‚.",
            question_type : "text",
            is_answered : false,
            is_skip : false,
            answers : [
                // {"answer_id":"1","answer_english":"Training","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
                // {"answer_id":"2","answer_english":"Research","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
                // {"answer_id":"3","answer_english":"Content (writing)","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
                // {"answer_id":"4","answer_english":"Content Creation","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
                // {"answer_id":"5","answer_english":"Outreach/ Team Development","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
                // {"answer_id":"5","answer_english":"Content Distribution","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
            ],
            answer : "",
        },
        {
            name : "thankyou",
            question_id : 15,
            question_english : "Thank you for your feedback. We look forward to your interview with us!",
            question_hindi : "à¤†à¤ªà¤•à¥€ à¤ªà¥à¤°à¤¤à¤¿à¤•à¥à¤°à¤¿à¤¯à¤¾ à¤•à¥‡ à¤²à¤¿à¤ à¤†à¤ªà¤•à¤¾ à¤§à¤¨à¥à¤¯à¤µà¤¾à¤¦à¥¤ à¤¹à¤® à¤¶à¥€à¤˜à¥à¤° à¤¹à¥€ à¤†à¤ªà¤¸à¥‡ à¤‡à¤‚à¤Ÿà¤°à¤µà¥à¤¯à¥‚ à¤•à¤°à¥‡à¤‚à¤—à¥‡!",
            question_type : "none",
            is_answered : false,
            is_skip : false,
            answers : [
                // {"answer_id":"1","answer_english":"Training","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
                // {"answer_id":"2","answer_english":"Research","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
                // {"answer_id":"3","answer_english":"Content (writing)","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
                // {"answer_id":"4","answer_english":"Content Creation","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
                // {"answer_id":"5","answer_english":"Outreach/ Team Development","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
                // {"answer_id":"5","answer_english":"Content Distribution","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
            ],
            answer : "",
        },
    ] 

    // $rootScope.$storage.registrationObj = {
    //     name : ""
    // }

    $rootScope.$storage.currentAnswerObj = {

    };
    $rootScope.$storage.currentAnswerObj.answer = "";

    $scope.selectedStateObj = {};

    $scope.selectedStateObj.state_id = "";

    $scope.selectedDistrictObj = {};
    $scope.selectedDistrictObj.district_id = "";

    $scope.selectedObject = {};

    $scope.selectedObject.answer = {}

    $scope.selectedObject.answer[7] = "";

    //$rootScope.$storage.defaultNumber = 0;

    $scope.errorMessage = "";
    $scope.isError = false;
    $scope.name = "";
    $scope.user_id = "";


    $scope.answerChecks = {};

    $scope.submitChecks = function (question, answer, flag){

        if(!$scope.answerChecks[question.question_id]){
            $scope.answerChecks[question.question_id] = [];
        } 

        if(question.is_answered == false && answer != '' && $scope.answerChecks[question.question_id].indexOf(answer) < 0){

            $scope.answerChecks[question.question_id].push(answer);

            if($scope.answerChecks[question.question_id].length > question.max_check){
                $scope.answerChecks[question.question_id].splice(0, 1); 
            }

            $rootScope.$storage.currentAnswerObj.answer = $scope.answerChecks[question.question_id].join(",");
            // rootScope.storage.log($scope.currentAnswerObj.answer);
            rootScope.storage.log($scope.currentAnswerObj.answer, "answer");

        }
        // console.log($scope.answerChecks, "answer checks");

    }


    $scope.submitSelection = function(question, answer, flag){

        // var question = $rootScope.$storage.chat_messages.filter(function(item) { if(item.question_id == questionRef.question_id) { return item } })[0];
        // console.log(question);  
        if(question.is_answered == false && answer != ''){

            if(question.name == "mobile"){
                if(answer.length != 10){

                    if($rootScope.$storage.language == "English"){
                        $scope.errorMessage = "Please enter a valid 10 digit number!";
                    }
                    else{
                        $scope.errorMessage = "à¤•à¥ƒà¤ªà¤¯à¤¾ 10 à¤…à¤‚à¤•à¥‹à¤‚ à¤•à¥€ à¤®à¤¾à¤¨à¥à¤¯ à¤¸à¤‚à¤–à¥à¤¯à¤¾ à¤¦à¤°à¥à¤œ à¤•à¤°à¥‡à¤‚!"; 
                    }

                    $scope.isError = true;
                    $timeout(function() {
                        $scope.isError = false;
                    }, 2000);
                    return false;
                }
            }

            if(question.name == "otp"){
                if(answer.length != 6){
                    if($rootScope.$storage.language == "English"){
                        $scope.errorMessage = "Please enter a valid 6 digit OTP!";
                    }
                    else{
                        $scope.errorMessage = "à¤•à¥ƒà¤ªà¤¯à¤¾ à¤à¤• à¤®à¤¾à¤¨à¥à¤¯ 6 à¤…à¤‚à¤• OTP à¤¦à¤°à¥à¤œ à¤•à¤°à¥‡à¤‚!"; 
                    }
                    $scope.isError = true;
                    $timeout(function() {
                        $scope.isError = false;
                    }, 2000);
                    return false;
                }
            }

            question.answer = answer;
            question.is_answered = true;
            $rootScope.$storage.currentQuestion = question;

            var addition = 1;

            if(question.name == "language"){
                if(answer == "English"){
                    $rootScope.$storage.language = "English";
                }
                else{
                    $rootScope.$storage.language = "Hindi";
                }

            }


            if(question.name == "mobile"){

                $rootScope.$storage.currentAnswerObj.answer = "";

                $http({
                  method: 'POST',
                  url: apiUrl + 'services/workerOtpDb',
                  data : {
                     mobile : answer,
                     name : $rootScope.$storage.registrationObj.name
                  }
                }).then(function successCallback(response) {
                    response = response.data;
                    if(response.success == 1){    
                        addition = 2;

                        angular.forEach($rootScope.$storage.chat_messages, function (value, key){
                            if(value.name == "not_registered"){
                                $rootScope.$storage.chat_messages[key].is_skip = true;
                            }
                        })
                        $rootScope.$storage.currentQuestion = $rootScope.$storage.chat_messages[$rootScope.$storage.defaultNumber + addition];
                        $rootScope.$storage.defaultNumber += addition;
                        $rootScope.$storage.registrationObj[question.name] = answer;
                        $rootScope.$storage.currentAnswerObj.answer = ""; 
                        $scope.scrolltoBottom();
                    }
                    else if(response.success == 2){

                        $rootScope.$storage.currentQuestion = $rootScope.$storage.chat_messages[$rootScope.$storage.defaultNumber + addition];
                        $rootScope.$storage.defaultNumber += addition;
                        $rootScope.$storage.registrationObj[question.name] = answer;
                        $rootScope.$storage.currentAnswerObj.answer = "";
                        $scope.scrolltoBottom();

                    }

                    $scope.isLoading = false;
                }, function errorCallback(response) {
                });
            }
            else if(question.name == "otp"){

                $rootScope.$storage.currentAnswerObj.answer = "";

                $http({
                  method: 'POST',
                  url: apiUrl + 'services/verify_otp_db',
                  data : {
                     mobile : $rootScope.$storage.registrationObj.mobile,
                     code : answer
                  }
                }).then(function successCallback(response) {
                    response = response.data;
                    if(response.success == 1){    

                        addition = 3;

                        $scope.name = response.user_name;
                        $rootScope.$storage.registrationObj.user_id = response.user_id;

                        angular.forEach($rootScope.$storage.chat_messages, function (value, key){
                            if(value.name == "verify_otp"){
                                $rootScope.$storage.chat_messages[key].is_skip = true;
                            }
                        })

                        $rootScope.$storage.currentQuestion = $rootScope.$storage.chat_messages[$rootScope.$storage.defaultNumber + addition];
                        $rootScope.$storage.defaultNumber += addition;
                        $rootScope.$storage.registrationObj[question.name] = answer;
                        $rootScope.$storage.currentAnswerObj.answer = ""; 
                        $scope.scrolltoBottom();
                    }
                    else{

                        question.is_answered = false;
                        if($rootScope.$storage.language == "English"){
                            $scope.errorMessage = "Incorrect OTP, Please try again!";
                        }
                        else{
                            $scope.errorMessage = "à¤—à¤²à¤¤ OTP, à¤•à¥ƒà¤ªà¤¯à¤¾ à¤ªà¥à¤¨à¤ƒ à¤ªà¥à¤°à¤¯à¤¾à¤¸ à¤•à¤°à¥‡à¤‚!!"; 
                        }

                        $scope.isError = true;
                        $timeout(function() {
                            $scope.isError = false;
                        }, 2000);
                        return false;

                        // $rootScope.$storage.currentQuestion = $rootScope.$storage.chat_messages[$rootScope.$storage.defaultNumber + addition];
                        // $rootScope.$storage.defaultNumber += addition;
                        // $rootScope.$storage.registrationObj[question.name] = answer;
                        // $rootScope.$storage.currentAnswerObj.answer = "";
                        // $scope.scrolltoBottom();
                    }

                    $scope.isLoading = false;
                }, function errorCallback(response) {
                });
            }
            else if(question.name == "email"){

                $rootScope.$storage.currentQuestion = $rootScope.$storage.chat_messages[$rootScope.$storage.defaultNumber + addition];
                $rootScope.$storage.defaultNumber += addition;
                $rootScope.$storage.registrationObj[question.name] = answer;
                $rootScope.$storage.currentAnswerObj.answer = "";
                $scope.scrolltoBottom();

                $http({
                  method: 'POST',
                  url: apiUrl + 'services/update_social_user',
                  data : $rootScope.$storage.registrationObj,
                }).then(function successCallback(response) {
                    
                }, function errorCallback(response) {
                });
            }
            else{
                $rootScope.$storage.currentQuestion = $rootScope.$storage.chat_messages[$rootScope.$storage.defaultNumber + addition];
                $rootScope.$storage.defaultNumber += addition;
                $rootScope.$storage.registrationObj[question.name] = answer;
                $rootScope.$storage.currentAnswerObj.answer = "";

                $scope.scrolltoBottom();
            }

        }

    }

})


app.controller("fullchatFormController", function($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, $window, $route, $timeout, $sce, $filter, $interval) {

    $scope.scrolltoBottom = function(){
        //angular.element("#finalInputBox").focus();
        $timeout(function(){ 
            angular.element("html,body").animate({scrollTop: angular.element("html").height()}, 'slow');   
        }, 100);
    }

    if($rootScope.$storage.defaultNumber >= 21){
        $rootScope.loadDefaultStorage();
    }

    $scope.states = [
        {"answer_id":"2","answer_english":"Andaman and Nicobar","answer_hindi":"à¤…à¤£à¥à¤¡à¤®à¤¾à¤¨ à¤”à¤° à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
        {"answer_id":"1","answer_english":"Andhra Pradesh","answer_hindi":"à¤†à¤‚à¤§à¥à¤° à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
        {"answer_id":"3","answer_english":"Arunachal Pradesh","answer_hindi":"à¤…à¤°à¥à¤£à¤¾à¤šà¤² à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
        {"answer_id":"4","answer_english":"Assam","answer_hindi":"à¤…à¤¸à¤®"},
        {"answer_id":"5","answer_english":"Bihar","answer_hindi":"à¤¬à¤¿à¤¹à¤¾à¤°"},
        {"answer_id":"6","answer_english":"Chandigarh","answer_hindi":"à¤šà¤£à¥à¤¡à¥€à¤—à¤¢à¤¼"},
        {"answer_id":"7","answer_english":"Chhattisgarh","answer_hindi":"à¤›à¤¤à¥à¤¤à¥€à¤¸à¤—à¤¢à¤¼"},
        {"answer_id":"8","answer_english":"Dadra and Nagar Haveli and Daman and Diu","answer_hindi":"à¤¦à¤¾à¤¦à¤°à¤¾ à¤¨à¤—à¤° à¤¹à¤µà¥‡à¤²à¥€ à¤”à¤° à¤¦à¤®à¤¨ à¤”à¤° à¤¦à¥€à¤µ"},
        {"answer_id":"9","answer_english":"Delhi","answer_hindi":"à¤¦à¤¿à¤²à¥à¤²à¥€"},
        {"answer_id":"10","answer_english":"Goa","answer_hindi":"à¤—à¥‹à¤µà¤¾"},
        {"answer_id":"11","answer_english":"Gujarat","answer_hindi":"à¤—à¥à¤œà¤°à¤¾à¤¤"},
        {"answer_id":"12","answer_english":"Haryana","answer_hindi":"à¤¹à¤°à¤¿à¤¯à¤¾à¤£à¤¾"},
        {"answer_id":"13","answer_english":"Himachal Pradesh","answer_hindi":"à¤¹à¤¿à¤®à¤¾à¤šà¤² à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
        {"answer_id":"14","answer_english":"Jammu and Kashmir","answer_hindi":"à¤œà¤®à¥à¤®à¥‚ à¤•à¤¶à¥à¤®à¥€à¤°"},
        {"answer_id":"15","answer_english":"Jharkhand","answer_hindi":"à¤à¤¾à¤°à¤–à¤£à¥à¤¡"},
        {"answer_id":"16","answer_english":"Karnataka","answer_hindi":"à¤•à¤°à¥à¤¨à¤¾à¤Ÿà¤•"},
        {"answer_id":"17","answer_english":"Kerala","answer_hindi":"à¤•à¥‡à¤°à¤²"},
        {"answer_id":"18","answer_english":"Ladakh","answer_hindi":"à¤²à¤¦à¥à¤¦à¤¾à¤–"},
        {"answer_id":"19","answer_english":"Lakshadweep","answer_hindi":"à¤²à¤•à¥à¤·à¤¦à¥à¤µà¥€à¤ª"},
        {"answer_id":"20","answer_english":"Madhya Pradesh","answer_hindi":"à¤®à¤§à¥à¤¯à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
        {"answer_id":"21","answer_english":"Maharastra","answer_hindi":"à¤®à¤¹à¤¾à¤°à¤¾à¤·à¥à¤Ÿà¥à¤°"},
        {"answer_id":"22","answer_english":"Manipur","answer_hindi":"à¤®à¤£à¤¿à¤ªà¥à¤°"},
        {"answer_id":"23","answer_english":"Meghalaya","answer_hindi":"à¤®à¥‡à¤˜à¤¾à¤²à¤¯"},
        {"answer_id":"24","answer_english":"Mizoram","answer_hindi":"à¤®à¤¿à¤œà¤¼à¥‹à¤°à¤®"},
        {"answer_id":"25","answer_english":"Nagaland","answer_hindi":"à¤¨à¤¾à¤—à¤¾à¤²à¥ˆà¤£à¥à¤¡"},
        {"answer_id":"26","answer_english":"Odisha","answer_hindi":"à¤“à¤¡à¤¼à¤¿à¤¶à¤¾"},
        {"answer_id":"27","answer_english":"Puducherry","answer_hindi":"à¤ªà¥à¤¦à¥à¤šà¥‡à¤°à¥€"},
        {"answer_id":"28","answer_english":"Punjab","answer_hindi":"à¤ªà¤‚à¤œà¤¾à¤¬"},
        {"answer_id":"29","answer_english":"Rajasthan","answer_hindi":"à¤°à¤¾à¤œà¤¸à¥à¤¥à¤¾à¤¨"},
        {"answer_id":"30","answer_english":"Sikkim","answer_hindi":"à¤¸à¤¿à¤•à¥à¤•à¤¿à¤®"},
        {"answer_id":"31","answer_english":"Tamil Nadu","answer_hindi":"à¤¤à¤®à¤¿à¤²à¤¨à¤¾à¤¡à¥"},
        {"answer_id":"32","answer_english":"Telangana","answer_hindi":"à¤¤à¥‡à¤²à¤‚à¤—à¤¾à¤¨à¤¾"},
        {"answer_id":"33","answer_english":"Tripura","answer_hindi":"à¤¤à¥à¤°à¤¿à¤ªà¥à¤°à¤¾"},
        {"answer_id":"34","answer_english":"Uttar Pradesh","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
        {"answer_id":"35","answer_english":"Uttarakhand","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤°à¤¾à¤–à¤£à¥à¤¡"},
        {"answer_id":"36","answer_english":"West Bengal","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤¬à¤‚à¤—à¤¾à¤²"}
    ];


    $scope.districts = [
        {"answer_id":"590","answer_english":"Adilabad","answer_hindi":"à¤†à¤¦à¤¿à¤²à¤¾à¤¬à¤¾à¤¦","parent_id":"32"},
{"answer_id":"363","answer_english":"Agar Malwa","answer_hindi":"à¤†à¤—à¤° à¤®à¤¾à¤²à¤µà¤¾","parent_id":"20"},
{"answer_id":"631","answer_english":"Agra","answer_hindi":"à¤†à¤—à¤°à¤¾","parent_id":"34"},
{"answer_id":"159","answer_english":"Ahmedabad","answer_hindi":"à¤…à¤¹à¤®à¤¦à¤¾à¤¬à¤¾à¤¦","parent_id":"11"},
{"answer_id":"373","answer_english":"Ahmednagar","answer_hindi":"à¤…à¤¹à¤®à¤¦à¤¨à¤—à¤°","parent_id":"21"},
{"answer_id":"436","answer_english":"Aizawl","answer_hindi":"à¤…à¤‡à¤œà¤¼à¥‹à¤²","parent_id":"24"},
{"answer_id":"515","answer_english":"Ajmer","answer_hindi":"à¤…à¤œà¤®à¥‡à¤°","parent_id":"29"},
{"answer_id":"374","answer_english":"Akola","answer_hindi":"à¤…à¤•à¥‹à¤²à¤¾","parent_id":"21"},
{"answer_id":"301","answer_english":"Alappuzha","answer_hindi":"à¤†à¤²à¤¾à¤ªà¥à¤ªà¥à¤¡à¤¼à¤¾","parent_id":"17"},
{"answer_id":"632","answer_english":"Aligarh","answer_hindi":"à¤…à¤²à¥€à¤—à¤¢","parent_id":"34"},
{"answer_id":"719","answer_english":"Alipurduar","answer_hindi":"à¤…à¤²à¥€à¤ªà¥à¤°à¤¦à¥à¤°à¤¾à¤°","parent_id":"36"},
{"answer_id":"331","answer_english":"Alirajpur ","answer_hindi":"à¤…à¤²à¥€à¤°à¤¾à¤œà¤ªà¥à¤°","parent_id":"20"},
{"answer_id":"633","answer_english":"Allahabad","answer_hindi":"à¤‡à¤²à¤¾à¤¹à¤¾à¤¬à¤¾à¤¦\/à¤ªà¥à¤°à¤¯à¤¾à¤—à¤°à¤¾à¤œ","parent_id":"34"},
{"answer_id":"706","answer_english":"Almora","answer_hindi":"à¤…à¤²à¥à¤®à¥‹à¤¡à¤¼à¤¾","parent_id":"35"},
{"answer_id":"516","answer_english":"Alwar","answer_hindi":"à¤…à¤²à¤µà¤°","parent_id":"29"},
{"answer_id":"192","answer_english":"Ambala","answer_hindi":"à¤…à¤®à¥à¤¬à¤¾à¤²à¤¾","parent_id":"12"},
{"answer_id":"634","answer_english":"Ambedkar Nagar","answer_hindi":"à¤…à¤®à¥à¤¬à¥‡à¤¡à¤•à¤°à¤¨à¤—à¤°","parent_id":"34"},
{"answer_id":"635","answer_english":"Amethi","answer_hindi":"à¤…à¤®à¥‡à¤ à¥€Â ","parent_id":"34"},
{"answer_id":"375","answer_english":"Amravati","answer_hindi":"à¤…à¤®à¤°à¤¾à¤µà¤¤à¥€","parent_id":"21"},
{"answer_id":"160","answer_english":"Amreli","answer_hindi":"à¤…à¤®à¤°à¥‡à¤²à¥€","parent_id":"11"},
{"answer_id":"493","answer_english":"Amritsar","answer_hindi":"à¤…à¤®à¥ƒà¤¤à¤¸à¤°","parent_id":"28"},
{"answer_id":"636","answer_english":"Amroha","answer_hindi":"à¤…à¤®à¤°à¥‹à¤¹à¤¾Â ","parent_id":"34"},
{"answer_id":"161","answer_english":"Anand","answer_hindi":"à¤†à¤£à¤‚à¤¦","parent_id":"11"},
{"answer_id":"1","answer_english":"Anantapur","answer_hindi":"à¤…à¤¨à¤‚à¤¤à¤ªà¥à¤°","parent_id":"1"},
{"answer_id":"226","answer_english":"Anantnag","answer_hindi":"à¤…à¤¨à¤¨à¥à¤¤à¤¨à¤¾à¤—","parent_id":"14"},
{"answer_id":"459","answer_english":"Angul","answer_hindi":"à¤…à¤¨à¥à¤—à¥à¤²","parent_id":"26"},
{"answer_id":"17","answer_english":"Anjaw","answer_hindi":"à¤…à¤‚à¤œà¥‰","parent_id":"3"},
{"answer_id":"360","answer_english":"Anuppur ","answer_hindi":"à¤…à¤¨à¥‚à¤ªà¤ªà¥à¤°","parent_id":"20"},
{"answer_id":"76","answer_english":"Araria","answer_hindi":"à¤…à¤°à¤°à¤¿à¤¯à¤¾","parent_id":"5"},
{"answer_id":"162","answer_english":"Aravalli","answer_hindi":"à¤…à¤°à¤¾à¤µà¤²à¥€","parent_id":"11"},
{"answer_id":"552","answer_english":"Ariyalur","answer_hindi":"à¤…à¤°à¤¿à¤¯à¤¾à¤²à¥‚à¤°","parent_id":"31"},
{"answer_id":"77","answer_english":"Arwal","answer_hindi":"à¤…à¤°à¤µà¤²","parent_id":"5"},
{"answer_id":"327","answer_english":"Ashoknagar","answer_hindi":"à¤…à¤¶à¥‹à¤• à¤¨à¤—à¤°","parent_id":"20"},
{"answer_id":"637","answer_english":"Auraiya","answer_hindi":"à¤”à¤°à¥ˆà¤¯à¤¾","parent_id":"34"},
{"answer_id":"78","answer_english":"Aurangabad","answer_hindi":"à¤”à¤°à¤‚à¤—à¤¾à¤¬à¤¾à¤¦","parent_id":"5"},
{"answer_id":"376","answer_english":"Aurangabad","answer_hindi":"à¤”à¤°à¤‚à¤—à¤¾à¤¬à¤¾à¤¦","parent_id":"21"},
{"answer_id":"638","answer_english":"Azamgarh","answer_hindi":"à¤†à¤œà¤®à¤—à¤¢","parent_id":"34"},
{"answer_id":"270","answer_english":"Bagalkot","answer_hindi":"à¤¬à¤¾à¤—à¤²à¤•à¥‹à¤Ÿ","parent_id":"16"},
{"answer_id":"707","answer_english":"Bageshwar","answer_hindi":"à¤¬à¤¾à¤—à¥‡à¤¶à¥à¤µà¤°","parent_id":"35"},
{"answer_id":"639","answer_english":"Bagpat","answer_hindi":"à¤¬à¤¾à¤—à¤ªà¤¤Â ","parent_id":"34"},
{"answer_id":"640","answer_english":"Bahraich","answer_hindi":"à¤¬à¤¹à¤°à¤¾à¤‡à¤š","parent_id":"34"},
{"answer_id":"43","answer_english":"Bajali","answer_hindi":"à¤¬à¤œà¤¾à¤²à¥€","parent_id":"4"},
{"answer_id":"42","answer_english":"Baksa","answer_hindi":"à¤¬à¤•à¥à¤¸à¤¾","parent_id":"4"},
{"answer_id":"339","answer_english":"Balaghat ","answer_hindi":"à¤¬à¤¾à¤²à¤¾à¤˜à¤¾à¤Ÿ","parent_id":"20"},
{"answer_id":"461","answer_english":"Balangir","answer_hindi":"à¤¬à¤²à¤¾à¤‚à¤—à¤¿à¤°","parent_id":"26"},
{"answer_id":"641","answer_english":"Balarampur","answer_hindi":"à¤¬à¤²à¤°à¤¾à¤®à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"463","answer_english":"Balasore","answer_hindi":"à¤¬à¤¾à¤²à¥‡à¤¶à¥à¤µà¤°","parent_id":"26"},
{"answer_id":"642","answer_english":"Ballia","answer_hindi":"à¤¬à¤²à¤¿à¤¯à¤¾","parent_id":"34"},
{"answer_id":"115","answer_english":"Balod","answer_hindi":"à¤¬à¤¾à¤²à¥‹à¤¦","parent_id":"7"},
{"answer_id":"116","answer_english":"Baloda Bazar","answer_hindi":"à¤¬à¤²à¥Œà¤¦à¤¾ à¤¬à¤¾à¤œà¤¾à¤°","parent_id":"7"},
{"answer_id":"117","answer_english":"Balrampur","answer_hindi":"à¤¬à¤²à¤°à¤¾à¤®à¤ªà¥à¤°","parent_id":"7"},
{"answer_id":"163","answer_english":"Banaskantha","answer_hindi":"à¤¬à¤¨à¤¾à¤¸à¤•à¤¾à¤‚à¤ à¤¾","parent_id":"11"},
{"answer_id":"643","answer_english":"Banda","answer_hindi":"à¤¬à¤¾à¤à¤¦à¤¾","parent_id":"34"},
{"answer_id":"228","answer_english":"Bandipora","answer_hindi":"à¤¬à¤¾à¤‚à¤¦à¥€à¤ªà¥à¤°à¤¾","parent_id":"14"},
{"answer_id":"272","answer_english":"Bangalore Rural","answer_hindi":"à¤¬à¤‚à¤—à¤²à¥‹à¤° à¤—à¥à¤°à¤¾à¤®à¥€à¤£","parent_id":"16"},
{"answer_id":"271","answer_english":"Bangalore Urban","answer_hindi":"à¤¬à¤‚à¤—à¤²à¥‹à¤° à¤¶à¤¹à¤°à¥€","parent_id":"16"},
{"answer_id":"79","answer_english":"Banka","answer_hindi":"à¤¬à¤¾à¤à¤•à¤¾","parent_id":"5"},
{"answer_id":"720","answer_english":"Bankura","answer_hindi":"à¤¬à¤¾à¤à¤•à¥à¤¡à¤¼à¤¾","parent_id":"36"},
{"answer_id":"519","answer_english":"Banswara","answer_hindi":"à¤¬à¤¾à¤‚à¤¸à¤µà¤¾à¤¡à¤¼à¤¾","parent_id":"29"},
{"answer_id":"644","answer_english":"Barabanki","answer_hindi":"à¤¬à¤¾à¤°à¤¾à¤¬à¤‚à¤•à¥€","parent_id":"34"},
{"answer_id":"229","answer_english":"Baramulla","answer_hindi":"à¤¬à¤¾à¤°à¤¾à¤®à¥‚à¤²à¤¾","parent_id":"14"},
{"answer_id":"521","answer_english":"Baran","answer_hindi":"à¤¬à¤¾à¤°à¤¾à¤‚","parent_id":"29"},
{"answer_id":"645","answer_english":"Bareilly","answer_hindi":"à¤¬à¤°à¥‡à¤²à¥€","parent_id":"34"},
{"answer_id":"462","answer_english":"Bargarh","answer_hindi":"à¤¬à¤°à¤—à¤¢à¤¼","parent_id":"26"},
{"answer_id":"518","answer_english":"Barmer","answer_hindi":"à¤¬à¤¾à¤¡à¤¼à¤®à¥‡à¤°","parent_id":"29"},
{"answer_id":"494","answer_english":"Barnala","answer_hindi":"à¤¬à¤°à¤¨à¤¾à¤²à¤¾","parent_id":"28"},
{"answer_id":"44","answer_english":"Barpeta","answer_hindi":"à¤¬à¤¾à¤°à¤ªà¥‡à¤Ÿà¤¾","parent_id":"4"},
{"answer_id":"332","answer_english":"Barwani ","answer_hindi":"à¤¬à¤¡à¤¼à¤µà¤¾à¤¨à¥€","parent_id":"20"},
{"answer_id":"118","answer_english":"Bastar","answer_hindi":"à¤¬à¤¸à¥à¤¤à¤°","parent_id":"7"},
{"answer_id":"646","answer_english":"Basti","answer_hindi":"à¤¬à¤¸à¥à¤¤à¥€","parent_id":"34"},
{"answer_id":"495","answer_english":"Bathinda","answer_hindi":"à¤­à¤Ÿà¤¿à¤£à¥à¤¡à¤¾","parent_id":"28"},
{"answer_id":"377","answer_english":"Beed","answer_hindi":"à¤¬à¥€à¤¡","parent_id":"21"},
{"answer_id":"80","answer_english":"Begusarai","answer_hindi":"à¤¬à¥‡à¤—à¥‚à¤¸à¤°à¤¾à¤¯","parent_id":"5"},
{"answer_id":"273","answer_english":"Belgaum","answer_hindi":"à¤¬à¥‡à¤²à¤—à¤¾à¤®","parent_id":"16"},
{"answer_id":"274","answer_english":"Bellary","answer_hindi":"à¤¬à¥‡à¤²à¥à¤²à¤¾à¤°à¥€","parent_id":"16"},
{"answer_id":"119","answer_english":"Bemetara","answer_hindi":"à¤¬à¥‡à¤®à¥‡à¤¤à¤°à¤¾","parent_id":"7"},
{"answer_id":"347","answer_english":"Betul ","answer_hindi":"à¤¬à¥ˆà¤¤à¥‚à¤²","parent_id":"20"},
{"answer_id":"647","answer_english":"Bhadohi","answer_hindi":"à¤­à¤¦à¥‹à¤¹à¥€Â ","parent_id":"34"},
{"answer_id":"592","answer_english":"Bhadradri Kothagudem","answer_hindi":"à¤­à¤¦à¥à¤°à¤¾à¤¦à¥à¤°à¥€ à¤•à¥‹à¤ à¤¾à¤—à¥à¤¡à¤®","parent_id":"32"},
{"answer_id":"464","answer_english":"Bhadrak","answer_hindi":"à¤­à¤¦à¥à¤°à¤•","parent_id":"26"},
{"answer_id":"81","answer_english":"Bhagalpur","answer_hindi":"à¤­à¤¾à¤—à¤²à¤ªà¥à¤°","parent_id":"5"},
{"answer_id":"378","answer_english":"Bhandara","answer_hindi":"à¤­à¤‚à¤¡à¤¾à¤°à¤¾","parent_id":"21"},
{"answer_id":"520","answer_english":"Bharatpur","answer_hindi":"à¤­à¤°à¤¤à¤ªà¥à¤°","parent_id":"29"},
{"answer_id":"164","answer_english":"Bharuch","answer_hindi":"à¤­à¤°à¥à¤š","parent_id":"11"},
{"answer_id":"165","answer_english":"Bhavnagar","answer_hindi":"à¤­à¤¾à¤µà¤¨à¤—à¤°","parent_id":"11"},
{"answer_id":"523","answer_english":"Bhilwara","answer_hindi":"à¤­à¥€à¤²à¤µà¤¾à¤¡à¤¼à¤¾","parent_id":"29"},
{"answer_id":"325","answer_english":"Bhind ","answer_hindi":"à¤­à¤¿à¤‚à¤¡","parent_id":"20"},
{"answer_id":"193","answer_english":"Bhiwani","answer_hindi":"à¤­à¤¿à¤µà¤¾à¤¨à¥€","parent_id":"12"},
{"answer_id":"82","answer_english":"Bhojpur","answer_hindi":"à¤­à¥‹à¤œà¤ªà¥à¤°","parent_id":"5"},
{"answer_id":"318","answer_english":"Bhopal ","answer_hindi":"à¤­à¥‹à¤ªà¤¾à¤²","parent_id":"20"},
{"answer_id":"275","answer_english":"Bidar","answer_hindi":"à¤¬à¥€à¤¦à¤°","parent_id":"16"},
{"answer_id":"276","answer_english":"Bijapur","answer_hindi":"à¤¬à¥€à¤œà¤¾à¤ªà¥à¤°","parent_id":"16"},
{"answer_id":"120","answer_english":"Bijapur","answer_hindi":"à¤¬à¥€à¤œà¤¾à¤ªà¥à¤°","parent_id":"7"},
{"answer_id":"648","answer_english":"Bijnor","answer_hindi":"à¤¬à¤¿à¤œà¤¨à¥Œà¤°","parent_id":"34"},
{"answer_id":"517","answer_english":"Bikaner","answer_hindi":"à¤¬à¥€à¤•à¤¾à¤¨à¥‡à¤°","parent_id":"29"},
{"answer_id":"121","answer_english":"Bilaspur","answer_hindi":"à¤¬à¤¿à¤²à¤¾à¤¸à¤ªà¥à¤°","parent_id":"7"},
{"answer_id":"214","answer_english":"Bilaspur","answer_hindi":"à¤¬à¤¿à¤²à¤¾à¤¸à¤ªà¥à¤°","parent_id":"13"},
{"answer_id":"723","answer_english":"Birbhum","answer_hindi":"à¤¬à¥€à¤°à¤­à¥‚à¤®","parent_id":"36"},
{"answer_id":"409","answer_english":"Bishnupur","answer_hindi":"à¤¬à¤¿à¤·à¥à¤£à¥à¤ªà¥à¤° à¤œà¤¿à¤²à¤¾","parent_id":"22"},
{"answer_id":"45","answer_english":"Biswanath","answer_hindi":"à¤¬à¤¿à¤¶à¥à¤µà¤¨à¤¾à¤¥","parent_id":"4"},
{"answer_id":"254","answer_english":"Bokaro","answer_hindi":"à¤¬à¥‹à¤•à¤¾à¤°à¥‹","parent_id":"15"},
{"answer_id":"46","answer_english":"Bongaigaon","answer_hindi":"à¤¬à¤‚à¤—à¤¾à¤ˆà¤—à¤¾à¤à¤µ","parent_id":"4"},
{"answer_id":"166","answer_english":"Botad","answer_hindi":"à¤¬à¥‹à¤Ÿà¤¾à¤¡","parent_id":"11"},
{"answer_id":"460","answer_english":"Boudh","answer_hindi":"à¤¬à¥Œà¤§","parent_id":"26"},
{"answer_id":"649","answer_english":"Budaun","answer_hindi":"à¤¬à¤¦à¤¾à¤¯à¥‚à¤‚Â ","parent_id":"34"},
{"answer_id":"227","answer_english":"Budgam","answer_hindi":"à¤¬à¤¡à¤¼à¤—à¤¾à¤‚à¤µ","parent_id":"14"},
{"answer_id":"650","answer_english":"Bulandshahr","answer_hindi":"à¤¬à¥à¤²à¤‚à¤¦à¤¶à¤¹à¤°","parent_id":"34"},
{"answer_id":"379","answer_english":"Buldhana","answer_hindi":"à¤¬à¥à¤²à¤¢à¤¾à¤£à¤¾","parent_id":"21"},
{"answer_id":"522","answer_english":"Bundi","answer_hindi":"à¤¬à¥‚à¤‚à¤¦à¥€","parent_id":"29"},
{"answer_id":"333","answer_english":"Burhanpur ","answer_hindi":"à¤¬à¥à¤°à¤¹à¤¾à¤¨à¤ªà¥à¤°","parent_id":"20"},
{"answer_id":"83","answer_english":"Buxar","answer_hindi":"à¤¬à¤•à¥à¤¸à¤°","parent_id":"5"},
{"answer_id":"47","answer_english":"Cachar","answer_hindi":"à¤•à¤›à¤°","parent_id":"4"},
{"answer_id":"147","answer_english":"Central Delhi ","answer_hindi":"à¤®à¤§à¥à¤¯ à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"370","answer_english":"Chachaura-Binaganj","answer_hindi":"à¤šà¤¾à¤šà¥Œà¤¡à¤¼à¤¾","parent_id":"20"},
{"answer_id":"277","answer_english":"Chamarajanagar","answer_hindi":"à¤šà¤¾à¤®à¤°à¤¾à¤œà¤¨à¤—à¤°","parent_id":"16"},
{"answer_id":"215","answer_english":"Chamba","answer_hindi":"à¤šà¤‚à¤¬à¤¾","parent_id":"13"},
{"answer_id":"708","answer_english":"Chamoli","answer_hindi":"à¤šà¤®à¥‹à¤²à¥€","parent_id":"35"},
{"answer_id":"709","answer_english":"Champawat","answer_hindi":"à¤šà¤®à¥à¤ªà¤¾à¤µà¤¤","parent_id":"35"},
{"answer_id":"443","answer_english":"Champhai","answer_hindi":"à¤šà¤®à¥à¤«à¤¾à¤ˆ","parent_id":"24"},
{"answer_id":"651","answer_english":"Chandauli","answer_hindi":"à¤šà¤‚à¤¦à¥Œà¤²à¥€","parent_id":"34"},
{"answer_id":"415","answer_english":"Chandel","answer_hindi":"à¤šà¤¨à¥à¤¡à¥‡à¤² à¤œà¤¿à¤²à¤¾","parent_id":"22"},
{"answer_id":"114","answer_english":"ChandigarhÂ ","answer_hindi":"à¤šà¤£à¥à¤¡à¥€à¤—à¤¢à¤¼","parent_id":"6"},
{"answer_id":"380","answer_english":"Chandrapur","answer_hindi":"à¤šà¤‚à¤¦à¥à¤°à¤ªà¥à¤°","parent_id":"21"},
{"answer_id":"18","answer_english":"Changlang","answer_hindi":"à¤šà¤¾à¤‚à¤—à¤²à¤¾à¤‚à¤—","parent_id":"3"},
{"answer_id":"48","answer_english":"Charaideo","answer_hindi":"à¤šà¤°à¤¾à¤‡à¤¦à¥‡à¤‰","parent_id":"4"},
{"answer_id":"194","answer_english":"Charkhi Dadri","answer_hindi":"à¤šà¤°à¤–à¥€ à¤¦à¤¾à¤¦à¤°à¥€","parent_id":"12"},
{"answer_id":"249","answer_english":"Chatra","answer_hindi":"à¤šà¤¤à¤°à¤¾","parent_id":"15"},
{"answer_id":"553","answer_english":"Chengalpattu","answer_hindi":"à¤šà¥‡à¤‚à¤—à¤²à¤ªà¤Ÿà¥à¤Ÿà¥","parent_id":"31"},
{"answer_id":"554","answer_english":"Chennai","answer_hindi":"à¤šà¥‡à¤¨à¥à¤¨à¤ˆ","parent_id":"31"},
{"answer_id":"354","answer_english":"Chhatarpur ","answer_hindi":"à¤›à¤¤à¤°à¤ªà¥à¤°","parent_id":"20"},
{"answer_id":"340","answer_english":"Chhindwara ","answer_hindi":"à¤›à¤¿à¤‚à¤¦à¤µà¤¾à¤¡à¤¼à¤¾","parent_id":"20"},
{"answer_id":"167","answer_english":"Chhota Udaipur","answer_hindi":"à¤›à¥‹à¤Ÿà¤¾ à¤‰à¤¦à¤¯à¤ªà¥à¤°","parent_id":"11"},
{"answer_id":"278","answer_english":"Chikballapur","answer_hindi":"à¤šà¤¿à¤•à¤¬à¤²à¤¾à¤ªà¥à¤°à¤¾","parent_id":"16"},
{"answer_id":"279","answer_english":"Chikmagalur","answer_hindi":"à¤šà¤¿à¤•à¤®à¤—à¤²à¥‚à¤°","parent_id":"16"},
{"answer_id":"49","answer_english":"Chirang","answer_hindi":"à¤šà¤¿à¤°à¤¾à¤‚à¤—","parent_id":"4"},
{"answer_id":"280","answer_english":"Chitradurga","answer_hindi":"à¤šà¤¿à¤¤à¥à¤°à¤¦à¥à¤°à¥à¤—","parent_id":"16"},
{"answer_id":"652","answer_english":"Chitrakoot","answer_hindi":"à¤šà¤¿à¤¤à¥à¤°à¤•à¥‚à¤Ÿ","parent_id":"34"},
{"answer_id":"2","answer_english":"Chittoor","answer_hindi":"à¤šà¤¿à¤¤à¥à¤¤à¥‚à¤°","parent_id":"1"},
{"answer_id":"525","answer_english":"Chittorgarh","answer_hindi":"à¤šà¤¿à¤¤à¥à¤¤à¥Œà¤¡à¤¼à¤—à¤¢à¤¼","parent_id":"29"},
{"answer_id":"416","answer_english":"Churachandpur","answer_hindi":"à¤šà¥à¤°à¤¾à¤šà¤¾à¤‚à¤¦à¤ªà¥à¤° à¤œà¤¿à¤²à¤¾","parent_id":"22"},
{"answer_id":"524","answer_english":"Churu","answer_hindi":"à¤šà¥à¤°à¥","parent_id":"29"},
{"answer_id":"555","answer_english":"Coimbatore","answer_hindi":"à¤•à¥‹à¤¯à¤®à¥à¤¬à¤¤à¥‚à¤°","parent_id":"31"},
{"answer_id":"724","answer_english":"Cooch Behar","answer_hindi":"à¤•à¥‚à¤šà¤¬à¤¿à¤¹à¤¾à¤°","parent_id":"36"},
{"answer_id":"556","answer_english":"Cuddalore","answer_hindi":"à¤•à¥à¤¡à¥à¤¡à¤²à¥‹à¤°","parent_id":"31"},
{"answer_id":"465","answer_english":"Cuttack","answer_hindi":"à¤•à¤Ÿà¤•","parent_id":"26"},
{"answer_id":"145","answer_english":"Dadra and Nagar Haveli","answer_hindi":"à¤¦à¤¾à¤¦à¤°à¤¾ à¤¨à¤—à¤° à¤¹à¤µà¥‡à¤²à¥€","parent_id":"8"},
{"answer_id":"168","answer_english":"Dahod","answer_hindi":"à¤¦à¤¾à¤¹à¥‹à¤¦","parent_id":"11"},
{"answer_id":"725","answer_english":"Dakshin Dinajpur","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤¦à¤¿à¤¨à¤¾à¤œà¤ªà¥à¤°","parent_id":"36"},
{"answer_id":"281","answer_english":"Dakshina Kannada","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤•à¤¨à¥à¤¨à¤¡à¤¼","parent_id":"16"},
{"answer_id":"143","answer_english":"Daman","answer_hindi":"à¤¦à¤®à¤¨Â ","parent_id":"8"},
{"answer_id":"355","answer_english":"Damoh ","answer_hindi":"à¤¦à¤®à¥‹à¤¹","parent_id":"20"},
{"answer_id":"169","answer_english":"Dang","answer_hindi":"à¤¡à¤¾à¤‚à¤—","parent_id":"11"},
{"answer_id":"122","answer_english":"Dantewada","answer_hindi":"à¤¦à¤¨à¥à¤¤à¥‡à¤µà¤¾à¤¡à¤¼à¤¾ Â (à¤¦à¤•à¥à¤·à¤¿à¤£ à¤¬à¤¸à¥à¤¤à¤°)","parent_id":"7"},
{"answer_id":"84","answer_english":"Darbhanga","answer_hindi":"à¤¦à¤°à¤­à¤‚à¤—à¤¾","parent_id":"5"},
{"answer_id":"726","answer_english":"Darjeeling","answer_hindi":"à¤¦à¤¾à¤°à¥à¤œà¤¿à¤²à¤¿à¤‚à¤—","parent_id":"36"},
{"answer_id":"50","answer_english":"Darrang","answer_hindi":"à¤¦à¤¾à¤°à¤¾à¤‚à¤—","parent_id":"4"},
{"answer_id":"329","answer_english":"Datia ","answer_hindi":"à¤¦à¤¤à¤¿à¤¯à¤¾","parent_id":"20"},
{"answer_id":"526","answer_english":"Dausa","answer_hindi":"à¤¦à¥Œà¤¸à¤¾","parent_id":"29"},
{"answer_id":"282","answer_english":"Davanagere","answer_hindi":"à¤¦à¤¾à¤µà¤£à¤—à¥‡à¤°à¥‡","parent_id":"16"},
{"answer_id":"466","answer_english":"Debagarh","answer_hindi":"à¤¦à¥‡à¤µà¤—à¤¡à¤¼","parent_id":"26"},
{"answer_id":"710","answer_english":"Dehradun","answer_hindi":"à¤¦à¥‡à¤¹à¤°à¤¾à¤¦à¥‚à¤¨","parent_id":"35"},
{"answer_id":"265","answer_english":"Deoghar","answer_hindi":"à¤¦à¥‡à¤µà¤˜à¤°","parent_id":"15"},
{"answer_id":"653","answer_english":"Deoria","answer_hindi":"à¤¦à¥‡à¤µà¤°à¤¿à¤¯à¤¾","parent_id":"34"},
{"answer_id":"170","answer_english":"Devbhoomi Dwarka","answer_hindi":"à¤¦à¥‡à¤µà¤­à¥‚à¤®à¤¿ à¤¦à¥à¤µà¤¾à¤°à¤•à¤¾","parent_id":"11"},
{"answer_id":"364","answer_english":"Dewas","answer_hindi":"à¤¦à¥‡à¤µà¤¾à¤¸","parent_id":"20"},
{"answer_id":"623","answer_english":"Dhalai","answer_hindi":"à¤§à¤²à¤¾à¤ˆ","parent_id":"33"},
{"answer_id":"123","answer_english":"Dhamtari","answer_hindi":"à¤§à¤®à¤¤à¤°à¥€","parent_id":"7"},
{"answer_id":"255","answer_english":"Dhanbad","answer_hindi":"à¤§à¤¨à¤¬à¤¾à¤¦","parent_id":"15"},
{"answer_id":"335","answer_english":"Dhar ","answer_hindi":"à¤§à¤¾à¤°","parent_id":"20"},
{"answer_id":"557","answer_english":"Dharmapuri","answer_hindi":"à¤§à¤°à¥à¤®à¤ªà¥à¤°à¥€","parent_id":"31"},
{"answer_id":"283","answer_english":"Dharwad","answer_hindi":"à¤§à¤¾à¤°à¤µà¤¾à¤¡à¤¼","parent_id":"16"},
{"answer_id":"51","answer_english":"Dhemaji","answer_hindi":"à¤§à¥‡à¤®à¤¾à¤œà¥€","parent_id":"4"},
{"answer_id":"467","answer_english":"Dhenkanal","answer_hindi":"à¤¢à¥‡à¤¨à¥à¤•à¤¾à¤¨à¤¾à¤²","parent_id":"26"},
{"answer_id":"527","answer_english":"Dholpur","answer_hindi":"à¤§à¥Œà¤²à¤ªà¥à¤°","parent_id":"29"},
{"answer_id":"52","answer_english":"Dhubri","answer_hindi":"à¤§à¥à¤¬à¤°à¥€","parent_id":"4"},
{"answer_id":"381","answer_english":"Dhule","answer_hindi":"à¤§à¥à¤²à¥‡","parent_id":"21"},
{"answer_id":"53","answer_english":"Dibrugarh","answer_hindi":"à¤¡à¤¿à¤¬à¥à¤°à¥‚à¤—à¤¢à¤¼","parent_id":"4"},
{"answer_id":"54","answer_english":"Dima Hasao","answer_hindi":"à¤¦à¤¿à¤®à¤¾ à¤¹à¤¸à¤¾à¤“","parent_id":"4"},
{"answer_id":"447","answer_english":"Dimapur","answer_hindi":"à¤¦à¥€à¤®à¤¾à¤ªà¥à¤°","parent_id":"25"},
{"answer_id":"558","answer_english":"Dindigul","answer_hindi":"à¤¡à¤¿à¤‚à¤¡à¤¿à¤—à¥à¤²","parent_id":"31"},
{"answer_id":"346","answer_english":"Dindori ","answer_hindi":"à¤¡à¤¿à¤‚à¤¡à¥Œà¤°à¥€","parent_id":"20"},
{"answer_id":"144","answer_english":"Diu","answer_hindi":"à¤¦à¥€à¤µÂ ","parent_id":"8"},
{"answer_id":"230","answer_english":"Doda","answer_hindi":"à¤¡à¥‹à¤¡à¤¾","parent_id":"14"},
{"answer_id":"266","answer_english":"Dumka","answer_hindi":"à¤¦à¥à¤®à¤•à¤¾","parent_id":"15"},
{"answer_id":"528","answer_english":"Dungarpur","answer_hindi":"à¤¡à¥‚à¤‚à¤—à¤°à¤ªà¥à¤°","parent_id":"29"},
{"answer_id":"124","answer_english":"Durg","answer_hindi":"à¤¦à¥à¤°à¥à¤—","parent_id":"7"},
{"answer_id":"85","answer_english":"East Champaran","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µà¥€ à¤šà¤®à¥à¤ªà¤¾à¤°à¤£ à¤œà¤¿à¤²à¤¾","parent_id":"5"},
{"answer_id":"148","answer_english":"East Delhi","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µà¥€ à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"429","answer_english":"East Garo Hills","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µà¥€ à¤—à¤¾à¤°à¥‹ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"3","answer_english":"East Godavari","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µ à¤—à¥‹à¤¦à¤¾à¤µà¤°à¥€","parent_id":"1"},
{"answer_id":"434","answer_english":"East Jaintia Hills","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µ à¤œà¤¯à¤‚à¤¤à¤¿à¤¯à¤¾ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"19","answer_english":"East Kameng","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µ à¤•à¤®à¥‡à¤‚à¤—","parent_id":"3"},
{"answer_id":"425","answer_english":"East Khasi Hills","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µà¥€ à¤–à¤¾à¤¸à¥€ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"20","answer_english":"East Siang","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µ à¤¸à¤¿à¤¯à¤¾à¤‚à¤—","parent_id":"3"},
{"answer_id":"548","answer_english":"East Sikkim","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µÂ à¤¸à¤¿à¤•à¥à¤•à¤¿à¤®","parent_id":"30"},
{"answer_id":"263","answer_english":"East Singhbhum","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µà¥€ à¤¸à¤¿à¤‚à¤¹à¤­à¥‚à¤®","parent_id":"15"},
{"answer_id":"302","answer_english":"Ernakulam","answer_hindi":"à¤à¤°à¥à¤¨à¤¾à¤•à¥à¤²à¤®","parent_id":"17"},
{"answer_id":"559","answer_english":"Erode","answer_hindi":"à¤ˆà¤°à¥‹à¤¡","parent_id":"31"},
{"answer_id":"654","answer_english":"Etah","answer_hindi":"à¤à¤Ÿà¤¾","parent_id":"34"},
{"answer_id":"655","answer_english":"Etawah","answer_hindi":"à¤‡à¤Ÿà¤¾à¤µà¤¾","parent_id":"34"},
{"answer_id":"656","answer_english":"Faizabad","answer_hindi":"à¤«à¥ˆà¤œà¤¼à¤¾à¤¬à¤¾à¤¦ à¤¶à¤¹à¤° (à¤…à¤¯à¥‹à¤§à¥à¤¯à¤¾)","parent_id":"34"},
{"answer_id":"195","answer_english":"Faridabad","answer_hindi":"à¤«à¤°à¥€à¤¦à¤¾à¤¬à¤¾à¤¦","parent_id":"12"},
{"answer_id":"497","answer_english":"Faridkot","answer_hindi":"à¤«à¤°à¥€à¤¦à¤•à¥‹à¤Ÿ","parent_id":"28"},
{"answer_id":"657","answer_english":"Farrukhabad","answer_hindi":"à¤«à¤¼à¤°à¥à¤°à¥‚à¤–à¤¼à¤¾à¤¬à¤¾à¤¦","parent_id":"34"},
{"answer_id":"196","answer_english":"Fatehabad","answer_hindi":"à¤«à¤¤à¥‡à¤¹à¤¾à¤¬à¤¾à¤¦","parent_id":"12"},
{"answer_id":"498","answer_english":"Fatehgarh Sahib","answer_hindi":"à¤«à¤¤à¥‡à¤¹à¤—à¤¢à¤¼ à¤¸à¤¾à¤¹à¤¿à¤¬","parent_id":"28"},
{"answer_id":"658","answer_english":"Fatehpur","answer_hindi":"à¤«à¤¤à¥‡à¤¹à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"499","answer_english":"Fazilka","answer_hindi":"à¤«à¤¾à¤œà¤¼à¤¿à¤²à¥à¤•à¤¾Â ","parent_id":"28"},
{"answer_id":"659","answer_english":"Firozabad","answer_hindi":"à¤«à¤¼à¤¿à¤°à¥‹à¤œà¤¾à¤¬à¤¾à¤¦","parent_id":"34"},
{"answer_id":"496","answer_english":"Firozpur","answer_hindi":"à¤«à¤¿à¤°à¥‹à¤œà¤ªà¥à¤°","parent_id":"28"},
{"answer_id":"284","answer_english":"Gadag","answer_hindi":"à¤—à¤¦à¤—","parent_id":"16"},
{"answer_id":"382","answer_english":"Gadchiroli","answer_hindi":"à¤—à¤¡à¤šà¤¿à¤°à¥‹à¤²à¥€","parent_id":"21"},
{"answer_id":"469","answer_english":"Gajapati","answer_hindi":"à¤—à¤œà¤ªà¤¤à¤¿","parent_id":"26"},
{"answer_id":"231","answer_english":"Ganderbal","answer_hindi":"à¤—à¤¾à¤‚à¤¦à¤°à¤¬à¤²","parent_id":"14"},
{"answer_id":"171","answer_english":"Gandhinagar","answer_hindi":"à¤—à¤¾à¤‚à¤§à¥€à¤¨à¤—à¤°","parent_id":"11"},
{"answer_id":"529","answer_english":"Ganganagar","answer_hindi":"à¤¶à¥à¤°à¥€à¤—à¤‚à¤—à¤¾à¤¨à¤—à¤°","parent_id":"29"},
{"answer_id":"468","answer_english":"Ganjam","answer_hindi":"à¤—à¤‚à¤œà¤¾à¤®","parent_id":"26"},
{"answer_id":"246","answer_english":"Garhwa","answer_hindi":"à¤—à¤¢à¤µà¤¾","parent_id":"15"},
{"answer_id":"125","answer_english":"Gariaband","answer_hindi":"à¤—à¤°à¤¿à¤¯à¤¾à¤¬à¤‚à¤¦","parent_id":"7"},
{"answer_id":"126","answer_english":"Gaurella-Pendra-Marwahi","answer_hindi":"à¤—à¥Œà¤°à¥‡à¤²à¤¾-à¤ªà¥‡à¤£à¥à¤¡à¥à¤°à¤¾-à¤®à¤°à¤µà¤¾à¤¹à¥€","parent_id":"7"},
{"answer_id":"660","answer_english":"Gautam Buddha Nagar","answer_hindi":"à¤—à¥Œà¤¤à¤®à¤¬à¥à¤¦à¥à¤§ à¤¨à¤—à¤°","parent_id":"34"},
{"answer_id":"86","answer_english":"Gaya","answer_hindi":"à¤—à¤¯à¤¾","parent_id":"5"},
{"answer_id":"661","answer_english":"Ghaziabad","answer_hindi":"à¤—à¤¾à¤œà¤¿à¤¯à¤¾à¤¬à¤¾à¤¦","parent_id":"34"},
{"answer_id":"662","answer_english":"Ghazipur","answer_hindi":"à¤—à¤¼à¤¾à¤œà¤¼à¥€à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"172","answer_english":"Gir Somnath","answer_hindi":"à¤—à¤¿à¤° à¤¸à¥‹à¤®à¤¨à¤¾à¤¥","parent_id":"11"},
{"answer_id":"252","answer_english":"Giridih","answer_hindi":"à¤—à¤¿à¤°à¥€à¤¡à¥€à¤¹","parent_id":"15"},
{"answer_id":"55","answer_english":"Goalpara","answer_hindi":"à¤—à¥‹à¤µà¤¾à¤²à¤ªà¤¾à¤°à¤¾","parent_id":"4"},
{"answer_id":"268","answer_english":"Godda","answer_hindi":"à¤—à¥‹à¤¡à¥à¤¡à¤¾","parent_id":"15"},
{"answer_id":"56","answer_english":"Golaghat","answer_hindi":"à¤—à¥‹à¤²à¤¾à¤˜à¤¾à¤Ÿ","parent_id":"4"},
{"answer_id":"625","answer_english":"Gomati","answer_hindi":"à¤—à¥‹à¤®à¤¤à¥€","parent_id":"33"},
{"answer_id":"663","answer_english":"Gonda","answer_hindi":"à¤—à¥‹à¤‚à¤¡à¤¾","parent_id":"34"},
{"answer_id":"383","answer_english":"Gondia","answer_hindi":"à¤—à¥‹à¤‚à¤¦à¤¿à¤¯à¤¾","parent_id":"21"},
{"answer_id":"87","answer_english":"Gopalganj","answer_hindi":"à¤—à¥‹à¤ªà¤¾à¤²à¤—à¤‚à¤œ","parent_id":"5"},
{"answer_id":"664","answer_english":"Gorakhpur","answer_hindi":"à¤—à¥‹à¤°à¤–à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"285","answer_english":"Gulbarga","answer_hindi":"à¤—à¥à¤²à¤¬à¤°à¥à¤—","parent_id":"16"},
{"answer_id":"256","answer_english":"Gumla","answer_hindi":"à¤—à¥à¤®à¤²à¤¾","parent_id":"15"},
{"answer_id":"330","answer_english":"Guna ","answer_hindi":"à¤—à¥à¤¨à¤¾","parent_id":"20"},
{"answer_id":"4","answer_english":"Guntur","answer_hindi":"à¤—à¥à¤‚à¤Ÿà¥‚à¤°","parent_id":"1"},
{"answer_id":"500","answer_english":"Gurdaspur","answer_hindi":"à¤—à¥à¤°à¤¦à¤¾à¤¸à¤ªà¥à¤°","parent_id":"28"},
{"answer_id":"197","answer_english":"Gurgaon","answer_hindi":"à¤—à¥à¤°à¥à¤—à¥à¤°à¤¾à¤®","parent_id":"12"},
{"answer_id":"326","answer_english":"Gwalior ","answer_hindi":"à¤—à¥à¤µà¤¾à¤²à¤¿à¤¯à¤°","parent_id":"20"},
{"answer_id":"57","answer_english":"Hailakandi","answer_hindi":"à¤¹à¥ˆà¤²à¤¾à¤•à¤¾à¤‚à¤¡à¥€","parent_id":"4"},
{"answer_id":"665","answer_english":"Hamirpur","answer_hindi":"à¤¹à¤®à¥€à¤°à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"216","answer_english":"Hamirpur","answer_hindi":"à¤¹à¤®à¥€à¤°à¤ªà¥à¤°","parent_id":"13"},
{"answer_id":"530","answer_english":"Hanumangarh","answer_hindi":"à¤¹à¤¨à¥à¤®à¤¾à¤¨à¤—à¤¢à¤¼","parent_id":"29"},
{"answer_id":"666","answer_english":"Hapur","answer_hindi":"à¤¹à¤¾à¤ªà¥à¤¡à¤¼","parent_id":"34"},
{"answer_id":"348","answer_english":"Harda ","answer_hindi":"à¤¹à¤°à¤¦à¤¾","parent_id":"20"},
{"answer_id":"667","answer_english":"Hardoi","answer_hindi":"à¤¹à¤°à¤¦à¥‹à¤ˆ","parent_id":"34"},
{"answer_id":"711","answer_english":"Haridwar","answer_hindi":"à¤¹à¤°à¤¿à¤¦à¥à¤µà¤¾à¤°","parent_id":"35"},
{"answer_id":"286","answer_english":"Hassan","answer_hindi":"à¤¹à¤¾à¤¸à¤¨","parent_id":"16"},
{"answer_id":"668","answer_english":"Hathras","answer_hindi":"à¤¹à¤¾à¤¥à¤°à¤¸","parent_id":"34"},
{"answer_id":"287","answer_english":"Haveri","answer_hindi":"à¤¹à¤¾à¤µà¥‡à¤°à¥€","parent_id":"16"},
{"answer_id":"250","answer_english":"Hazaribagh","answer_hindi":"à¤¹à¤œà¤¾à¤°à¥€à¤¬à¤¾à¤—","parent_id":"15"},
{"answer_id":"384","answer_english":"Hingoli","answer_hindi":"à¤¹à¤¿à¤‚à¤—à¥‹à¤²à¥€","parent_id":"21"},
{"answer_id":"198","answer_english":"Hissar","answer_hindi":"à¤¹à¤¿à¤¸à¤¾à¤°","parent_id":"12"},
{"answer_id":"444","answer_english":"Hnahthial","answer_hindi":"à¤¹à¥à¤¨à¤¾à¤¹à¤¥à¤¿à¤†à¤²","parent_id":"24"},
{"answer_id":"58","answer_english":"Hojai","answer_hindi":"à¤¹à¥‹à¤œà¤¾à¤ˆ","parent_id":"4"},
{"answer_id":"727","answer_english":"Hooghly","answer_hindi":"à¤¹à¥à¤—à¤²à¥€","parent_id":"36"},
{"answer_id":"349","answer_english":"Hoshangabad ","answer_hindi":"à¤¹à¥‹à¤¶à¤‚à¤—à¤¾à¤¬à¤¾à¤¦","parent_id":"20"},
{"answer_id":"501","answer_english":"Hoshiarpur","answer_hindi":"à¤¹à¥‹à¤¶à¤¿à¤¯à¤¾à¤°à¤ªà¥à¤°","parent_id":"28"},
{"answer_id":"728","answer_english":"Howrah","answer_hindi":"à¤¹à¤¾à¤µà¤™à¤¾","parent_id":"36"},
{"answer_id":"593","answer_english":"Hyderabad","answer_hindi":"à¤¹à¥ˆà¤¦à¤°à¤¾à¤¬à¤¾à¤¦","parent_id":"32"},
{"answer_id":"303","answer_english":"Idukki","answer_hindi":"à¤‡à¤¡à¥à¤•à¥à¤•à¥€Â ","parent_id":"17"},
{"answer_id":"411","answer_english":"Imphal East","answer_hindi":"à¤‡à¤®à¥à¤«à¤¾à¤² à¤ªà¥‚à¤°à¥à¤µ","parent_id":"22"},
{"answer_id":"412","answer_english":"Imphal West","answer_hindi":"à¤‡à¤®à¥à¤«à¤¾à¤² à¤ªà¤¶à¥à¤šà¤¿à¤®","parent_id":"22"},
{"answer_id":"334","answer_english":"Indore ","answer_hindi":"à¤‡à¤¨à¥à¤¦à¥Œà¤°","parent_id":"20"},
{"answer_id":"341","answer_english":"Jabalpur ","answer_hindi":"à¤œà¤¬à¤²à¤ªà¥à¤°","parent_id":"20"},
{"answer_id":"472","answer_english":"Jagatsinghapur","answer_hindi":"à¤œà¤—à¤¤à¤¸à¤¿à¤‚à¤¹à¤ªà¥à¤°","parent_id":"26"},
{"answer_id":"594","answer_english":"Jagtial","answer_hindi":"à¤œà¤—à¤¿à¤¤à¥à¤¯à¤¾à¤²","parent_id":"32"},
{"answer_id":"534","answer_english":"Jaipur","answer_hindi":"à¤œà¤¯à¤ªà¥à¤°","parent_id":"29"},
{"answer_id":"535","answer_english":"Jaisalmer","answer_hindi":"à¤œà¥ˆà¤¸à¤²à¤®à¥‡à¤°","parent_id":"29"},
{"answer_id":"471","answer_english":"Jajpur","answer_hindi":"à¤œà¤¾à¤œà¤ªà¥à¤°","parent_id":"26"},
{"answer_id":"502","answer_english":"Jalandhar","answer_hindi":"à¤œà¤¾à¤²à¤‚à¤§à¤°","parent_id":"28"},
{"answer_id":"669","answer_english":"Jalaun","answer_hindi":"à¤œà¤²à¥Œà¤¨","parent_id":"34"},
{"answer_id":"385","answer_english":"Jalgaon","answer_hindi":"à¤œà¤³à¤—à¤¾à¤µ","parent_id":"21"},
{"answer_id":"386","answer_english":"Jalna","answer_hindi":"à¤œà¤¾à¤²à¤¨à¤¾","parent_id":"21"},
{"answer_id":"532","answer_english":"Jalore","answer_hindi":"à¤œà¤¾à¤²à¥Œà¤°","parent_id":"29"},
{"answer_id":"729","answer_english":"Jalpaiguri","answer_hindi":"à¤œà¤²à¤ªà¤¾à¤ˆà¤—à¥à¤™à¥€","parent_id":"36"},
{"answer_id":"232","answer_english":"Jammu","answer_hindi":"à¤œà¤®à¥à¤®à¥‚","parent_id":"14"},
{"answer_id":"173","answer_english":"Jamnagar","answer_hindi":"à¤œà¤¾à¤®à¤¨à¤—à¤°","parent_id":"11"},
{"answer_id":"264","answer_english":"Jamtara","answer_hindi":"à¤œà¤¾à¤®à¤¤à¤¾à¤¡à¤¼à¤¾","parent_id":"15"},
{"answer_id":"88","answer_english":"Jamui","answer_hindi":"à¤œà¤®à¥à¤ˆ","parent_id":"5"},
{"answer_id":"595","answer_english":"Jangaon","answer_hindi":"à¤œà¤¨à¤—à¤¾à¤à¤µ","parent_id":"32"},
{"answer_id":"127","answer_english":"Janjgir-Champa","answer_hindi":"à¤œà¤¾à¤‚à¤œà¤—à¥€à¤°-à¤šà¤¾à¤®à¥à¤ªà¤¾","parent_id":"7"},
{"answer_id":"128","answer_english":"Jashpur","answer_hindi":"à¤œà¤¶à¤ªà¥à¤°","parent_id":"7"},
{"answer_id":"670","answer_english":"Jaunpur","answer_hindi":"à¤œà¥Œà¤¨à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"596","answer_english":"Jayashankar Bhupalpally","answer_hindi":"à¤œà¤¯à¤¶à¤‚à¤•à¤° à¤­à¥‚à¤ªà¤²à¤ªà¤²à¥à¤²à¥€","parent_id":"32"},
{"answer_id":"89","answer_english":"Jehanabad","answer_hindi":"à¤œà¤¹à¤¾à¤¨à¤¾à¤¬à¤¾à¤¦","parent_id":"5"},
{"answer_id":"336","answer_english":"Jhabua ","answer_hindi":"à¤à¤¾à¤¬à¥à¤†","parent_id":"20"},
{"answer_id":"199","answer_english":"Jhajjar","answer_hindi":"à¤à¤œà¥à¤œà¤°","parent_id":"12"},
{"answer_id":"536","answer_english":"Jhalawar","answer_hindi":"à¤à¤¾à¤²à¤¾à¤µà¤¾à¤¡à¤¼","parent_id":"29"},
{"answer_id":"671","answer_english":"Jhansi","answer_hindi":"à¤à¤¾à¤à¤¸à¥€","parent_id":"34"},
{"answer_id":"730","answer_english":"Jhargram","answer_hindi":"à¤à¤¾à¤¡à¤¼à¤—à¥à¤°à¤¾à¤®","parent_id":"36"},
{"answer_id":"470","answer_english":"Jharsuguda","answer_hindi":"à¤à¤¾à¤°à¤¸à¥à¤—à¥à¤¡à¤¼à¤¾","parent_id":"26"},
{"answer_id":"531","answer_english":"Jhunjhunu","answer_hindi":"à¤à¥à¤‚à¤à¥à¤¨à¥‚","parent_id":"29"},
{"answer_id":"200","answer_english":"Jind","answer_hindi":"à¤œà¥€à¤‚à¤¦","parent_id":"12"},
{"answer_id":"418","answer_english":"Jiribam","answer_hindi":"à¤œà¤¿à¤°à¤¿à¤¬à¤¾à¤®","parent_id":"22"},
{"answer_id":"533","answer_english":"Jodhpur","answer_hindi":"à¤œà¥‹à¤§à¤ªà¥à¤°","parent_id":"29"},
{"answer_id":"597","answer_english":"Jogulamba Gadwal","answer_hindi":"à¤œà¥‹à¤—à¥à¤²à¤¾à¤®à¥à¤¬à¤¾ à¤—à¤¦à¥à¤µà¤¾à¤²","parent_id":"32"},
{"answer_id":"59","answer_english":"Jorhat","answer_hindi":"à¤œà¥‹à¤°à¤¹à¤¾à¤Ÿ","parent_id":"4"},
{"answer_id":"174","answer_english":"Junagadh","answer_hindi":"à¤œà¥‚à¤¨à¤¾à¤—à¥","parent_id":"11"},
{"answer_id":"129","answer_english":"Kabirdham \/ Kawardha","answer_hindi":"à¤•à¤¬à¥€à¤°à¤§à¤¾à¤® \/ à¤•à¤µà¤°à¥à¤§à¤¾","parent_id":"7"},
{"answer_id":"5","answer_english":"Kadapa","answer_hindi":"à¤•à¤¡à¤¼à¤ªà¥à¤ªà¤¾","parent_id":"1"},
{"answer_id":"90","answer_english":"Kaimur","answer_hindi":"à¤•à¥ˆà¤®à¥‚à¤°","parent_id":"5"},
{"answer_id":"201","answer_english":"Kaithal","answer_hindi":"à¤•à¥ˆà¤¥à¤²","parent_id":"12"},
{"answer_id":"420","answer_english":"Kakching","answer_hindi":"à¤•à¤•à¤šà¤¿à¤‚à¤—Â ","parent_id":"22"},
{"answer_id":"475","answer_english":"Kalahandi","answer_hindi":"à¤•à¤²à¤¾à¤¹à¤¾à¤¨à¥à¤¡à¥€","parent_id":"26"},
{"answer_id":"731","answer_english":"Kalimpong","answer_hindi":"à¤•à¤²à¤¿à¤®à¥à¤ªà¥‹à¤—","parent_id":"36"},
{"answer_id":"560","answer_english":"Kallakurichi","answer_hindi":"à¤•à¤²à¥à¤²à¤¾à¤•à¥à¤°à¤¿à¤šà¥€","parent_id":"31"},
{"answer_id":"598","answer_english":"Kamareddy","answer_hindi":"à¤•à¤¾à¤®à¤¾à¤°à¥‡à¤¡à¥à¤¡à¥€","parent_id":"32"},
{"answer_id":"422","answer_english":"Kamjong","answer_hindi":"à¤•à¤®à¤œà¥‹à¤‚à¤—Â ","parent_id":"22"},
{"answer_id":"21","answer_english":"Kamle","answer_hindi":"à¤•à¤®à¤²à¥‡","parent_id":"3"},
{"answer_id":"61","answer_english":"Kamrup","answer_hindi":"à¤•à¤¾à¤®à¤°à¥‚à¤ª","parent_id":"4"},
{"answer_id":"60","answer_english":"Kamrup Metropolitan","answer_hindi":"à¤•à¤¾à¤®à¤°à¥‚à¤ª à¤®à¤¹à¤¾à¤¨à¤—à¤°","parent_id":"4"},
{"answer_id":"561","answer_english":"Kanchipuram","answer_hindi":"à¤•à¤¾à¤‚à¤šà¥€à¤ªà¥à¤°à¤®","parent_id":"31"},
{"answer_id":"476","answer_english":"Kandhamal","answer_hindi":"à¤•à¤¨à¥à¤§à¤®à¤¾à¤²","parent_id":"26"},
{"answer_id":"419","answer_english":"KangpokpiÂ (Sadar Hills)","answer_hindi":"à¤•à¤‚à¤—à¤ªà¥‹à¤•à¤ªà¥€","parent_id":"22"},
{"answer_id":"217","answer_english":"Kangra","answer_hindi":"à¤•à¤¾à¤à¤—à¤¡à¤¼à¤¾","parent_id":"13"},
{"answer_id":"130","answer_english":"Kanker","answer_hindi":"à¤•à¤¾à¤‚à¤•à¥‡à¤° Â (à¤‰à¤¤à¥à¤¤à¤° à¤¬à¤¸à¥à¤¤à¤°)","parent_id":"7"},
{"answer_id":"672","answer_english":"Kannauj","answer_hindi":"à¤•à¤¨à¥à¤¨à¥Œà¤œ","parent_id":"34"},
{"answer_id":"304","answer_english":"Kannur","answer_hindi":"à¤•à¤¨à¥à¤¨à¥‚à¤°","parent_id":"17"},
{"answer_id":"673","answer_english":"Kanpur Dehat","answer_hindi":"à¤•à¤¾à¤¨à¤ªà¥à¤° à¤¦à¥‡à¤¹à¤¾à¤¤","parent_id":"34"},
{"answer_id":"674","answer_english":"Kanpur Nagar","answer_hindi":"à¤•à¤¾à¤¨à¤ªà¥à¤° à¤¨à¤—à¤°","parent_id":"34"},
{"answer_id":"562","answer_english":"Kanyakumari","answer_hindi":"à¤•à¤¨à¥à¤¯à¤¾à¤•à¥à¤®à¤¾à¤°à¥€","parent_id":"31"},
{"answer_id":"503","answer_english":"Kapurthala","answer_hindi":"à¤•à¤ªà¥‚à¤°à¤¥à¤²à¤¾","parent_id":"28"},
{"answer_id":"489","answer_english":"Karaikal","answer_hindi":"à¤•à¤°à¤¾à¤ˆà¤•à¤²Â ","parent_id":"27"},
{"answer_id":"537","answer_english":"Karauli","answer_hindi":"à¤•à¤°à¥Œà¤²à¥€","parent_id":"29"},
{"answer_id":"62","answer_english":"Karbi Anglong","answer_hindi":"à¤•à¤¾à¤°à¥à¤¬à¥€ à¤†à¤‚à¤—à¤²à¥‹à¤‚à¤—","parent_id":"4"},
{"answer_id":"315","answer_english":"KargilÂ ","answer_hindi":"à¤•à¤¾à¤°à¤—à¤¿à¤²","parent_id":"18"},
{"answer_id":"63","answer_english":"Karimganj","answer_hindi":"à¤•à¤°à¥€à¤®à¤—à¤‚à¤œ","parent_id":"4"},
{"answer_id":"599","answer_english":"Karimnagar","answer_hindi":"à¤•à¤°à¥€à¤®à¤¨à¤—à¤°","parent_id":"32"},
{"answer_id":"202","answer_english":"Karnal","answer_hindi":"à¤•à¤°à¤¨à¤¾à¤²","parent_id":"12"},
{"answer_id":"563","answer_english":"Karur","answer_hindi":"à¤•à¤°à¥‚à¤°","parent_id":"31"},
{"answer_id":"305","answer_english":"Kasaragod","answer_hindi":"à¤•à¤¾à¤¸à¤°à¤—à¥‹à¤¡Â ","parent_id":"17"},
{"answer_id":"675","answer_english":"Kasganj","answer_hindi":"à¤•à¤¾à¤¸à¤—à¤‚à¤œÂ ","parent_id":"34"},
{"answer_id":"233","answer_english":"Kathua","answer_hindi":"à¤•à¤ à¥à¤†","parent_id":"14"},
{"answer_id":"91","answer_english":"Katihar","answer_hindi":"à¤•à¤Ÿà¤¿à¤¹à¤¾à¤°","parent_id":"5"},
{"answer_id":"342","answer_english":"Katni ","answer_hindi":"à¤•à¤Ÿà¤¨à¥€","parent_id":"20"},
{"answer_id":"676","answer_english":"Kaushambi","answer_hindi":"à¤•à¥Œà¤¶à¤¾à¤®à¥à¤¬à¥€","parent_id":"34"},
{"answer_id":"478","answer_english":"Kendrapara","answer_hindi":"à¤•à¥‡à¤¨à¥à¤¦à¥à¤°à¤¾à¤ªà¤¡à¤¼à¤¾","parent_id":"26"},
{"answer_id":"474","answer_english":"Kendujhar","answer_hindi":"à¤•à¥‡à¤¨à¥à¤¦à¥à¤à¤°","parent_id":"26"},
{"answer_id":"92","answer_english":"Khagaria","answer_hindi":"à¤–à¤—à¤¡à¤¼à¤¿à¤¯à¤¾","parent_id":"5"},
{"answer_id":"600","answer_english":"Khammam","answer_hindi":"à¤–à¤®à¥à¤®à¤®","parent_id":"32"},
{"answer_id":"337","answer_english":"Khandwa (East Nimar)","answer_hindi":"à¤–à¤‚à¤¡à¤µà¤¾","parent_id":"20"},
{"answer_id":"338","answer_english":"Khargone (West Nimar)","answer_hindi":"à¤–à¤°à¤—à¥‹à¤¨","parent_id":"20"},
{"answer_id":"445","answer_english":"Khawzawl","answer_hindi":"à¤–à¤¾à¤µà¤œà¥Œà¤²","parent_id":"24"},
{"answer_id":"176","answer_english":"Kheda","answer_hindi":"à¤–à¥‡à¤¡à¤¼à¤¾","parent_id":"11"},
{"answer_id":"473","answer_english":"Khordha","answer_hindi":"à¤–à¥‹à¤°à¥à¤§à¤¾","parent_id":"26"},
{"answer_id":"628","answer_english":"Khowai","answer_hindi":"à¤–à¥‹à¤µà¤¾à¤ˆ","parent_id":"33"},
{"answer_id":"260","answer_english":"Khunti","answer_hindi":"à¤–à¥à¤Ÿà¥€","parent_id":"15"},
{"answer_id":"218","answer_english":"Kinnaur","answer_hindi":"à¤•à¤¿à¤¨à¥à¤¨à¥Œà¤°","parent_id":"13"},
{"answer_id":"448","answer_english":"Kiphire","answer_hindi":"à¤•à¥ˆà¤«à¤¾à¤‡à¤°","parent_id":"25"},
{"answer_id":"93","answer_english":"Kishanganj","answer_hindi":"à¤•à¤¿à¤¶à¤¨à¤—à¤‚à¤œ","parent_id":"5"},
{"answer_id":"234","answer_english":"Kishtwar","answer_hindi":"à¤•à¤¿à¤¶à¥à¤¤à¤µà¤¾à¤¡à¤¼","parent_id":"14"},
{"answer_id":"288","answer_english":"Kodagu","answer_hindi":"à¤•à¥‹à¤¡à¤—à¥","parent_id":"16"},
{"answer_id":"251","answer_english":"Koderma","answer_hindi":"à¤•à¥‹à¤¡à¤°à¤®à¤¾","parent_id":"15"},
{"answer_id":"449","answer_english":"Kohima","answer_hindi":"à¤•à¥‹à¤¹à¤¿à¤®à¤¾","parent_id":"25"},
{"answer_id":"64","answer_english":"Kokrajhar","answer_hindi":"à¤•à¥‹à¤•à¤°à¤¾à¤à¤¾à¤°","parent_id":"4"},
{"answer_id":"289","answer_english":"Kolar","answer_hindi":"à¤•à¥‹à¤²à¤¾à¤°","parent_id":"16"},
{"answer_id":"437","answer_english":"Kolasib","answer_hindi":"à¤•à¥‹à¤²à¤¾à¤¸à¤¿à¤¬","parent_id":"24"},
{"answer_id":"387","answer_english":"Kolhapur","answer_hindi":"à¤•à¥‹à¤²à¥à¤¹à¤¾à¤ªà¥à¤°","parent_id":"21"},
{"answer_id":"732","answer_english":"Kolkata","answer_hindi":"à¤•à¥‹à¤²à¤•à¤¾à¤¤à¤¾","parent_id":"36"},
{"answer_id":"306","answer_english":"Kollam","answer_hindi":"à¤•à¥‹à¤²à¥à¤²à¤®","parent_id":"17"},
{"answer_id":"591","answer_english":"Komaram Bheem","answer_hindi":"à¤•à¥‹à¤®à¤°à¤® à¤­à¥€à¤®","parent_id":"32"},
{"answer_id":"131","answer_english":"Kondagaon","answer_hindi":"à¤•à¥‹à¤‚à¤¡à¤—à¤¾à¤à¤µ","parent_id":"7"},
{"answer_id":"290","answer_english":"Koppal","answer_hindi":"à¤•à¥‹à¤ªà¥à¤ªà¤²","parent_id":"16"},
{"answer_id":"477","answer_english":"Koraput","answer_hindi":"à¤•à¥‹à¤°à¤¾à¤ªà¥à¤Ÿ","parent_id":"26"},
{"answer_id":"132","answer_english":"Korba","answer_hindi":"à¤•à¥‹à¤°à¤¬à¤¾","parent_id":"7"},
{"answer_id":"133","answer_english":"Koriya","answer_hindi":"à¤•à¥‹à¤°à¤¿à¤¯à¤¾","parent_id":"7"},
{"answer_id":"538","answer_english":"Kota","answer_hindi":"à¤•à¥‹à¤Ÿà¤¾","parent_id":"29"},
{"answer_id":"307","answer_english":"Kottayam","answer_hindi":"à¤•à¥‹à¤Ÿà¥à¤Ÿà¤¯à¤®","parent_id":"17"},
{"answer_id":"308","answer_english":"Kozhikode","answer_hindi":"à¤•à¥‹à¤¡à¤¼à¤¿à¤•à¥‹à¤¡","parent_id":"17"},
{"answer_id":"22","answer_english":"Kra Daadi","answer_hindi":"à¤•à¥à¤°à¤¾ à¤¦à¤¾à¤¦à¥€","parent_id":"3"},
{"answer_id":"6","answer_english":"Krishna","answer_hindi":"à¤•à¥ƒà¤·à¥à¤£à¤¾","parent_id":"1"},
{"answer_id":"564","answer_english":"Krishnagiri","answer_hindi":"à¤•à¥ƒà¤·à¥à¤£à¤—à¤¿à¤°à¤¿","parent_id":"31"},
{"answer_id":"235","answer_english":"Kulgam","answer_hindi":"à¤•à¥à¤²à¤—à¤¾à¤®","parent_id":"14"},
{"answer_id":"219","answer_english":"Kullu","answer_hindi":"à¤•à¥à¤²à¥à¤²à¥‚","parent_id":"13"},
{"answer_id":"236","answer_english":"Kupwara","answer_hindi":"à¤•à¥à¤ªà¤µà¤¾à¤¡à¤¼à¤¾","parent_id":"14"},
{"answer_id":"7","answer_english":"Kurnool","answer_hindi":"à¤•à¥à¤°à¥à¤¨à¥‚à¤²","parent_id":"1"},
{"answer_id":"203","answer_english":"Kurukshetra","answer_hindi":"à¤•à¥à¤°à¥à¤•à¥à¤·à¥‡à¤¤à¥à¤°","parent_id":"12"},
{"answer_id":"23","answer_english":"Kurung Kumey","answer_hindi":"à¤•à¥à¤°à¥à¤‚à¤— à¤•à¥à¤®à¥‡","parent_id":"3"},
{"answer_id":"677","answer_english":"Kushinagar","answer_hindi":"à¤•à¥à¤¶à¥€à¤¨à¤—à¤° (à¤ªà¤¡à¤¼à¤°à¥Œà¤¨à¤¾)","parent_id":"34"},
{"answer_id":"175","answer_english":"Kutch","answer_hindi":"à¤•à¤šà¥à¤›","parent_id":"11"},
{"answer_id":"220","answer_english":"Lahaul and Spiti","answer_hindi":"à¤²à¤¾à¤¹à¥Œà¤² à¤”à¤° à¤¸à¥à¤ªà¥€à¤¤à¥€","parent_id":"13"},
{"answer_id":"65","answer_english":"Lakhimpur","answer_hindi":"à¤²à¤–à¥€à¤®à¤ªà¥à¤°","parent_id":"4"},
{"answer_id":"678","answer_english":"Lakhimpur Kheri","answer_hindi":"à¤²à¤–à¥€à¤®à¤ªà¥à¤°-à¤–à¤¿à¤°à¥€","parent_id":"34"},
{"answer_id":"94","answer_english":"Lakhisarai","answer_hindi":"à¤²à¤–à¥€à¤¸à¤°à¤¾à¤¯","parent_id":"5"},
{"answer_id":"317","answer_english":"Lakshadweep","answer_hindi":"à¤²à¤•à¥à¤·à¤¦à¥à¤µà¥€à¤ª","parent_id":"19"},
{"answer_id":"679","answer_english":"Lalitpur","answer_hindi":"à¤²à¤²à¤¿à¤¤à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"248","answer_english":"Latehar","answer_hindi":"à¤²à¤¾à¤¤à¥‡à¤¹à¤¾à¤°","parent_id":"15"},
{"answer_id":"388","answer_english":"Latur","answer_hindi":"à¤²à¤¾à¤¤à¥‚à¤°","parent_id":"21"},
{"answer_id":"438","answer_english":"Lawngtlai","answer_hindi":"à¤²à¥‰à¤™à¥à¤—à¤¤à¤²à¤¾à¤ˆ","parent_id":"24"},
{"answer_id":"316","answer_english":"LehÂ ","answer_hindi":"à¤²à¥‡à¤¹","parent_id":"18"},
{"answer_id":"24","answer_english":"Lepa Rada","answer_hindi":"à¤²à¥‡à¤ªà¤¾ à¤°à¤¾à¤¦à¤¾","parent_id":"3"},
{"answer_id":"257","answer_english":"Lohardaga","answer_hindi":"à¤²à¥‹à¤¹à¤°à¤¦à¤—à¥à¤—à¤¾","parent_id":"15"},
{"answer_id":"25","answer_english":"Lohit","answer_hindi":"à¤²à¥‹à¤¹à¤¿à¤¤","parent_id":"3"},
{"answer_id":"26","answer_english":"Longding","answer_hindi":"à¤²à¥‹à¤‚à¤—à¤¡à¤¿à¤‚à¤—","parent_id":"3"},
{"answer_id":"450","answer_english":"Longleng","answer_hindi":"à¤²à¥‰à¤¨à¥à¤—à¤²à¥‡à¤¨à¥à¤—","parent_id":"25"},
{"answer_id":"27","answer_english":"Lower Dibang Valley","answer_hindi":"à¤¨à¤¿à¤šà¤²à¥€ à¤¦à¤¿à¤¬à¤¾à¤‚à¤— à¤˜à¤¾à¤Ÿà¥€","parent_id":"3"},
{"answer_id":"28","answer_english":"Lower Siang","answer_hindi":"à¤¨à¤¿à¤šà¤²à¤¾ à¤¸à¤¿à¤¯à¤¾à¤‚à¤—","parent_id":"3"},
{"answer_id":"29","answer_english":"Lower Subansiri","answer_hindi":"à¤¨à¤¿à¤šà¤²à¥€ à¤¸à¥à¤¬à¤¨à¤¸à¤¿à¤°à¥€","parent_id":"3"},
{"answer_id":"680","answer_english":"Lucknow","answer_hindi":"à¤²à¤–à¤¨à¤Š","parent_id":"34"},
{"answer_id":"504","answer_english":"Ludhiana","answer_hindi":"à¤²à¥à¤§à¤¿à¤¯à¤¾à¤¨à¤¾","parent_id":"28"},
{"answer_id":"439","answer_english":"Lunglei","answer_hindi":"à¤²à¥à¤‚à¤—à¤²à¥‡à¤ˆ","parent_id":"24"},
{"answer_id":"95","answer_english":"Madhepura","answer_hindi":"à¤®à¤§à¥‡à¤ªà¥à¤°à¤¾","parent_id":"5"},
{"answer_id":"96","answer_english":"Madhubani","answer_hindi":"à¤®à¤§à¥à¤¬à¤¨à¥€","parent_id":"5"},
{"answer_id":"565","answer_english":"Madurai","answer_hindi":"à¤®à¤¦à¥à¤°à¤ˆ","parent_id":"31"},
{"answer_id":"601","answer_english":"Mahabubabad","answer_hindi":"à¤®à¤¹à¤¾à¤¬à¥‚à¤¬à¤¾à¤¬à¤¾à¤¦","parent_id":"32"},
{"answer_id":"681","answer_english":"Maharajganj","answer_hindi":"à¤®à¤¹à¤¾à¤°à¤¾à¤œà¤—à¤‚à¤œ","parent_id":"34"},
{"answer_id":"134","answer_english":"Mahasamund","answer_hindi":"à¤®à¤¹à¤¾à¤¸à¤®à¥à¤¨à¥à¤¦","parent_id":"7"},
{"answer_id":"602","answer_english":"Mahbubnagar","answer_hindi":"à¤®à¤¹à¤¬à¥‚à¤¬à¤¨à¤—à¤°","parent_id":"32"},
{"answer_id":"490","answer_english":"MahÃ©","answer_hindi":"à¤®à¤¾à¤¹à¥‡Â ","parent_id":"27"},
{"answer_id":"204","answer_english":"Mahendragarh","answer_hindi":"à¤®à¤¹à¥‡à¤‚à¤¦à¥à¤°à¤—à¤¢à¤¼","parent_id":"12"},
{"answer_id":"177","answer_english":"Mahisagar","answer_hindi":"à¤®à¤¹à¥€à¤¸à¤¾à¤—à¤°","parent_id":"11"},
{"answer_id":"682","answer_english":"Mahoba","answer_hindi":"à¤®à¤¹à¥‹à¤¬à¤¾","parent_id":"34"},
{"answer_id":"371","answer_english":"Maihar","answer_hindi":"à¤®à¥ˆà¤¹à¤°","parent_id":"20"},
{"answer_id":"683","answer_english":"Mainpuri","answer_hindi":"à¤®à¥ˆà¤¨à¤ªà¥à¤°à¥€","parent_id":"34"},
{"answer_id":"66","answer_english":"Majuli","answer_hindi":"à¤®à¤¾à¤œà¥à¤²à¥€","parent_id":"4"},
{"answer_id":"309","answer_english":"Malappuram","answer_hindi":"à¤®à¤²à¤ªà¥à¤ªà¥à¤°à¤®","parent_id":"17"},
{"answer_id":"733","answer_english":"Maldah","answer_hindi":"à¤®à¤¾à¤²à¤¦à¤¹","parent_id":"36"},
{"answer_id":"479","answer_english":"Malkangiri","answer_hindi":"à¤®à¤¾à¤²à¤•à¤¾à¤¨à¤—à¤¿à¤°à¤¿","parent_id":"26"},
{"answer_id":"440","answer_english":"Mamit","answer_hindi":"à¤®à¤®à¤¿à¤¤","parent_id":"24"},
{"answer_id":"603","answer_english":"Mancherial","answer_hindi":"à¤®à¤‚à¤šà¥‡à¤°à¤¿à¤¯à¤²","parent_id":"32"},
{"answer_id":"221","answer_english":"Mandi","answer_hindi":"à¤®à¤‚à¤¡à¥€","parent_id":"13"},
{"answer_id":"343","answer_english":"Mandla ","answer_hindi":"à¤®à¤‚à¤¡à¤²à¤¾","parent_id":"20"},
{"answer_id":"365","answer_english":"Mandsaur","answer_hindi":"à¤®à¤‚à¤¦à¤¸à¥Œà¤°","parent_id":"20"},
{"answer_id":"291","answer_english":"Mandya","answer_hindi":"à¤®à¤¾à¤‚à¤¡à¤¯à¤¾","parent_id":"16"},
{"answer_id":"505","answer_english":"Mansa","answer_hindi":"à¤®à¤¾à¤¨à¤¸à¤¾","parent_id":"28"},
{"answer_id":"684","answer_english":"Mathura","answer_hindi":"à¤®à¤¥à¥à¤°à¤¾","parent_id":"34"},
{"answer_id":"685","answer_english":"Mau","answer_hindi":"à¤®à¤Š","parent_id":"34"},
{"answer_id":"566","answer_english":"Mayiladuthurai","answer_hindi":"à¤®à¤¯à¥€à¤²à¤¾à¤¡à¥‚à¤¤à¥à¤°à¥ˆ","parent_id":"31"},
{"answer_id":"480","answer_english":"Mayurbhanj","answer_hindi":"à¤®à¤¯à¥‚à¤°à¤­à¤‚à¤œ","parent_id":"26"},
{"answer_id":"604","answer_english":"Medak","answer_hindi":"à¤®à¥‡à¤¦à¤•","parent_id":"32"},
{"answer_id":"605","answer_english":"Medchal-Malkajgiri","answer_hindi":"à¤®à¥‡à¤¡à¥à¤šà¤² à¤®à¤²à¥à¤•à¤¾à¤œà¤—à¤¿à¤°à¤¿","parent_id":"32"},
{"answer_id":"686","answer_english":"Meerut","answer_hindi":"à¤®à¥‡à¤°à¤ ","parent_id":"34"},
{"answer_id":"178","answer_english":"Mehsana","answer_hindi":"à¤®à¥‡à¤¹à¤¸à¤¾à¤£à¤¾","parent_id":"11"},
{"answer_id":"687","answer_english":"Mirzapur","answer_hindi":"à¤®à¤¿à¤°à¥à¤œà¤¼à¤¾à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"506","answer_english":"Moga","answer_hindi":"à¤®à¥‹à¤—à¤¾","parent_id":"28"},
{"answer_id":"451","answer_english":"Mokokchung","answer_hindi":"à¤®à¥‹à¤•à¥‹à¤•à¤šà¥à¤†à¤‚à¤—","parent_id":"25"},
{"answer_id":"452","answer_english":"Mon","answer_hindi":"à¤®à¥‹à¤¨","parent_id":"25"},
{"answer_id":"688","answer_english":"Moradabad","answer_hindi":"à¤®à¥à¤°à¤¾à¤¦à¤¾à¤¬à¤¾à¤¦","parent_id":"34"},
{"answer_id":"179","answer_english":"Morbi","answer_hindi":"à¤®à¥‹à¤°à¤¬à¥€","parent_id":"11"},
{"answer_id":"323","answer_english":"Morena ","answer_hindi":"à¤®à¥à¤°à¥ˆà¤¨à¤¾","parent_id":"20"},
{"answer_id":"67","answer_english":"Morigaon","answer_hindi":"à¤®à¤¾à¤°à¤¿à¤—à¤¾à¤‚à¤µ","parent_id":"4"},
{"answer_id":"606","answer_english":"Mulugu","answer_hindi":"à¤®à¥à¤²à¥à¤—à¥","parent_id":"32"},
{"answer_id":"389","answer_english":"Mumbai","answer_hindi":"à¤®à¥à¤‚à¤¬à¤ˆ","parent_id":"21"},
{"answer_id":"390","answer_english":"Mumbai Suburban","answer_hindi":"à¤®à¥à¤‚à¤¬à¤ˆ (à¤¸à¤¬à¤…à¤°à¥à¤¬à¤¨)","parent_id":"21"},
{"answer_id":"135","answer_english":"Mungeli","answer_hindi":"à¤®à¥à¤‚à¤—à¥‡à¤²à¥€","parent_id":"7"},
{"answer_id":"97","answer_english":"Munger","answer_hindi":"à¤®à¥à¤‚à¤—à¥‡à¤°","parent_id":"5"},
{"answer_id":"734","answer_english":"Murshidabad","answer_hindi":"à¤®à¥à¤°à¥à¤¶à¤¿à¤¦à¤¾à¤¬à¤¾à¤¦","parent_id":"36"},
{"answer_id":"689","answer_english":"Muzaffarnagar","answer_hindi":"à¤®à¥à¤œà¤«à¥à¤«à¤°à¤¨à¤—à¤°","parent_id":"34"},
{"answer_id":"98","answer_english":"Muzaffarpur","answer_hindi":"à¤®à¥à¤œà¤«à¥à¤«à¤°à¤ªà¥à¤°","parent_id":"5"},
{"answer_id":"292","answer_english":"Mysore","answer_hindi":"à¤®à¥ˆà¤¸à¥‚à¤°","parent_id":"16"},
{"answer_id":"481","answer_english":"Nabarangpur","answer_hindi":"à¤¨à¤¬à¤°à¤‚à¤—à¤ªà¥à¤°","parent_id":"26"},
{"answer_id":"735","answer_english":"Nadia","answer_hindi":"à¤¨à¤¾à¤¦à¤¿à¤¯à¤¾","parent_id":"36"},
{"answer_id":"68","answer_english":"Nagaon","answer_hindi":"à¤¨à¤—à¤¾à¤‚à¤µ","parent_id":"4"},
{"answer_id":"567","answer_english":"Nagapattinam","answer_hindi":"à¤¨à¤¾à¤—à¤ªà¤Ÿà¥à¤Ÿà¤¿à¤¨à¤®","parent_id":"31"},
{"answer_id":"609","answer_english":"Nagarkurnool","answer_hindi":"à¤¨à¤¾à¤—à¤°à¤•à¤°à¥à¤¨à¥‚à¤²","parent_id":"32"},
{"answer_id":"539","answer_english":"Nagaur","answer_hindi":"à¤¨à¤¾à¤—à¥Œà¤°","parent_id":"29"},
{"answer_id":"372","answer_english":"Nagda","answer_hindi":"à¤¨à¤¾à¤—à¤¦à¤¾","parent_id":"20"},
{"answer_id":"391","answer_english":"Nagpur","answer_hindi":"à¤¨à¤¾à¤—à¤ªà¥à¤°","parent_id":"21"},
{"answer_id":"712","answer_english":"Nainital","answer_hindi":"à¤¨à¥ˆà¤¨à¥€à¤¤à¤¾à¤²","parent_id":"35"},
{"answer_id":"99","answer_english":"Nalanda","answer_hindi":"à¤¨à¤¾à¤²à¤‚à¤¦à¤¾","parent_id":"5"},
{"answer_id":"69","answer_english":"Nalbari","answer_hindi":"à¤¨à¤²à¤¬à¤¾à¤¡à¤¼à¥€","parent_id":"4"},
{"answer_id":"607","answer_english":"Nalgonda","answer_hindi":"à¤¨à¤²à¤—à¥‹à¤‚à¤¡à¤¾","parent_id":"32"},
{"answer_id":"569","answer_english":"Namakkal","answer_hindi":"à¤¨à¤¾à¤®à¤•à¥à¤•à¤²","parent_id":"31"},
{"answer_id":"30","answer_english":"Namsai","answer_hindi":"à¤¨à¤¾à¤®à¤¸à¤¾à¤ˆ","parent_id":"3"},
{"answer_id":"392","answer_english":"Nanded","answer_hindi":"à¤¨à¤¾à¤‚à¤¦à¥‡à¤¡","parent_id":"21"},
{"answer_id":"393","answer_english":"Nandurbar","answer_hindi":"à¤¨à¤‚à¤¦à¥à¤°à¤¬à¤¾à¤°","parent_id":"21"},
{"answer_id":"608","answer_english":"Narayanpet","answer_hindi":"à¤¨à¤¾à¤°à¤¾à¤¯à¤£à¤ªà¥‡à¤Ÿ","parent_id":"32"},
{"answer_id":"136","answer_english":"Narayanpur","answer_hindi":"à¤¨à¤¾à¤°à¤¾à¤¯à¤£à¤ªà¥à¤°","parent_id":"7"},
{"answer_id":"180","answer_english":"Narmada","answer_hindi":"à¤¨à¤°à¥à¤®à¤¦à¤¾","parent_id":"11"},
{"answer_id":"344","answer_english":"Narsinghpur ","answer_hindi":"à¤¨à¤°à¤¸à¤¿à¤‚à¤¹à¤ªà¥à¤°","parent_id":"20"},
{"answer_id":"394","answer_english":"Nashik","answer_hindi":"à¤¨à¤¾à¤¶à¤¿à¤•","parent_id":"21"},
{"answer_id":"181","answer_english":"Navsari","answer_hindi":"à¤¨à¤µà¤¸à¤¾à¤°à¥€","parent_id":"11"},
{"answer_id":"100","answer_english":"Nawada","answer_hindi":"à¤¨à¤µà¤¾à¤¦à¤¾","parent_id":"5"},
{"answer_id":"483","answer_english":"Nayagarh","answer_hindi":"à¤¨à¤¯à¤¾à¤—à¤¡à¤¼","parent_id":"26"},
{"answer_id":"366","answer_english":"Neemuch","answer_hindi":"à¤¨à¥€à¤®à¤š","parent_id":"20"},
{"answer_id":"8","answer_english":"Nellore","answer_hindi":"à¤¨à¥‡à¤²à¥à¤²à¥Œà¤°","parent_id":"1"},
{"answer_id":"146","answer_english":"New Delhi","answer_hindi":"à¤¨à¤ˆ à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"14","answer_english":"Nicobar","answer_hindi":"à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°","parent_id":"2"},
{"answer_id":"568","answer_english":"Nilgiris","answer_hindi":"à¤¨à¥€à¤²à¤—à¤¿à¤°à¤¿","parent_id":"31"},
{"answer_id":"610","answer_english":"Nirmal","answer_hindi":"à¤¨à¤¿à¤°à¥à¤®à¤²","parent_id":"32"},
{"answer_id":"359","answer_english":"Niwari ","answer_hindi":"à¤¨à¤¿à¤µà¤¾à¤¡à¤¼à¥€","parent_id":"20"},
{"answer_id":"611","answer_english":"Nizamabad","answer_hindi":"à¤¨à¤¿à¤œà¤¼à¤¾à¤®à¤¾à¤¬à¤¾à¤¦","parent_id":"32"},
{"answer_id":"458","answer_english":"Noklak","answer_hindi":"à¤¨à¥‹à¤•à¥à¤²à¤•","parent_id":"25"},
{"answer_id":"423","answer_english":"Noney","answer_hindi":"à¤¨à¥‹à¤¨à¥‡","parent_id":"22"},
{"answer_id":"736","answer_english":"North 24 Parganas","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° 24 à¤ªà¤°à¤—à¤¨à¤¾","parent_id":"36"},
{"answer_id":"15","answer_english":"North and Middle Andaman","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤”à¤° à¤®à¤§à¥à¤¯ à¤…à¤£à¥à¤¡à¤®à¤¾à¤¨ à¤œà¤¿à¤²à¤¾","parent_id":"2"},
{"answer_id":"149","answer_english":"North Delhi ","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"150","answer_english":"North East Delhi","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤ªà¥‚à¤°à¥à¤µà¥€ à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"435","answer_english":"North Garo Hills","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤—à¤¾à¤°à¥‹ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"157","answer_english":"North Goa","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤—à¥‹à¤µà¤¾","parent_id":"10"},
{"answer_id":"549","answer_english":"North Sikkim","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤¸à¤¿à¤•à¥à¤•à¤¿à¤®","parent_id":"30"},
{"answer_id":"626","answer_english":"North Tripura","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤¤à¥à¤°à¤¿à¤ªà¥à¤°à¤¾","parent_id":"33"},
{"answer_id":"151","answer_english":"North West Delhi","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤ªà¤¶à¥à¤šà¤¿à¤® à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"482","answer_english":"Nuapada","answer_hindi":"à¤¨à¥à¤†à¤ªà¤¡à¤¼à¤¾","parent_id":"26"},
{"answer_id":"205","answer_english":"Nuh","answer_hindi":"à¤¨à¥‚à¤¹Â ","parent_id":"12"},
{"answer_id":"395","answer_english":"Osmanabad","answer_hindi":"à¤‰à¤¸à¥à¤®à¤¾à¤¨à¤¾à¤¬à¤¾à¤¦","parent_id":"21"},
{"answer_id":"31","answer_english":"Pakke-Kessang","answer_hindi":"à¤ªà¤•à¥à¤•à¥‡ à¤•à¥‡à¤¸à¤¾à¤‚à¤—","parent_id":"3"},
{"answer_id":"267","answer_english":"Pakur","answer_hindi":"à¤ªà¤¾à¤•à¥à¤¡à¤¼","parent_id":"15"},
{"answer_id":"310","answer_english":"Palakkad","answer_hindi":"à¤ªà¤¾à¤²à¤•à¥à¤•à¤¾à¤¡à¤¼Â ","parent_id":"17"},
{"answer_id":"247","answer_english":"Palamu","answer_hindi":"à¤ªà¤²à¤¾à¤®à¥‚","parent_id":"15"},
{"answer_id":"396","answer_english":"Palghar","answer_hindi":"à¤ªà¤¾à¤²à¤˜à¤°","parent_id":"21"},
{"answer_id":"540","answer_english":"Pali","answer_hindi":"à¤ªà¤¾à¤²à¥€","parent_id":"29"},
{"answer_id":"206","answer_english":"Palwal","answer_hindi":"à¤ªà¤²à¤µà¤²","parent_id":"12"},
{"answer_id":"207","answer_english":"Panchkula","answer_hindi":"à¤ªà¤‚à¤šà¤•à¥à¤²à¤¾","parent_id":"12"},
{"answer_id":"182","answer_english":"Panchmahal","answer_hindi":"à¤ªà¤‚à¤šà¤®à¤¹à¤²","parent_id":"11"},
{"answer_id":"208","answer_english":"Panipat","answer_hindi":"à¤ªà¤¾à¤¨à¥€à¤ªà¤¤","parent_id":"12"},
{"answer_id":"356","answer_english":"Panna ","answer_hindi":"à¤ªà¤¨à¥à¤¨à¤¾","parent_id":"20"},
{"answer_id":"32","answer_english":"Papum Pare","answer_hindi":"à¤ªà¤ªà¥à¤®à¤ªà¤¾à¤°à¥‡","parent_id":"3"},
{"answer_id":"397","answer_english":"Parbhani","answer_hindi":"à¤ªà¤°à¤­à¤£à¥€","parent_id":"21"},
{"answer_id":"721","answer_english":"Paschim Bardhaman","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤®à¥€ à¤µà¤°à¥à¤§à¤®à¤¾à¤¨","parent_id":"36"},
{"answer_id":"737","answer_english":"Paschim Medinipur","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤®à¥‡à¤¦à¤¿à¤¨à¥€à¤ªà¥à¤°","parent_id":"36"},
{"answer_id":"183","answer_english":"Patan","answer_hindi":"à¤ªà¤¾à¤Ÿà¤¨","parent_id":"11"},
{"answer_id":"311","answer_english":"Pathanamthitta","answer_hindi":"à¤ªà¤¤à¤¨à¤®à¤¤à¤¿à¤Ÿà¥à¤Ÿà¤¾","parent_id":"17"},
{"answer_id":"508","answer_english":"Pathankot","answer_hindi":"à¤ªà¤ à¤¾à¤¨à¤•à¥‹à¤Ÿ","parent_id":"28"},
{"answer_id":"509","answer_english":"Patiala","answer_hindi":"à¤ªà¤Ÿà¤¿à¤¯à¤¾à¤²à¤¾","parent_id":"28"},
{"answer_id":"101","answer_english":"Patna","answer_hindi":"à¤ªà¤Ÿà¤¨à¤¾","parent_id":"5"},
{"answer_id":"713","answer_english":"Pauri Garhwal","answer_hindi":"à¤ªà¥Œà¤¡à¤¼à¥€ à¤—à¤¢à¤¼à¤µà¤¾à¤²","parent_id":"35"},
{"answer_id":"612","answer_english":"Peddapalli","answer_hindi":"à¤ªà¥‡à¤¦à¥à¤¦à¤ªà¤²à¥à¤²à¥‡","parent_id":"32"},
{"answer_id":"570","answer_english":"Perambalur","answer_hindi":"à¤ªà¥‡à¤°à¤®à¥à¤¬à¤²à¥à¤°","parent_id":"31"},
{"answer_id":"453","answer_english":"Peren","answer_hindi":"à¤ªà¥‡à¤°à¥‡à¤¨","parent_id":"25"},
{"answer_id":"454","answer_english":"Phek","answer_hindi":"à¤«à¥‡à¤•","parent_id":"25"},
{"answer_id":"424","answer_english":"Pherzawl","answer_hindi":"à¤«à¥‡à¤°à¤œà¤¼à¥Œà¤²Â ","parent_id":"22"},
{"answer_id":"690","answer_english":"Pilibhit","answer_hindi":"à¤ªà¥€à¤²à¥€à¤­à¥€à¤¤","parent_id":"34"},
{"answer_id":"714","answer_english":"Pithoragarh","answer_hindi":"à¤ªà¤¿à¤¥à¥Œà¤°à¤¾à¤—à¤¢à¤¼","parent_id":"35"},
{"answer_id":"237","answer_english":"Poonch","answer_hindi":"à¤ªà¥à¤‚à¤›","parent_id":"14"},
{"answer_id":"184","answer_english":"Porbandar","answer_hindi":"à¤ªà¥‹à¤°à¤¬à¤‚à¤¦à¤°","parent_id":"11"},
{"answer_id":"9","answer_english":"Prakasam","answer_hindi":"à¤ªà¥à¤°à¤•à¤¾à¤¶à¤®","parent_id":"1"},
{"answer_id":"541","answer_english":"Pratapgarh","answer_hindi":"à¤ªà¥à¤°à¤¤à¤¾à¤ªà¤—à¤¢à¤¼","parent_id":"29"},
{"answer_id":"691","answer_english":"Pratapgarh","answer_hindi":"à¤ªà¥à¤°à¤¤à¤¾à¤ªà¤—à¤¢","parent_id":"34"},
{"answer_id":"491","answer_english":"Puducherry","answer_hindi":"à¤ªà¥à¤¦à¥à¤šà¥‡à¤°à¥€","parent_id":"27"},
{"answer_id":"571","answer_english":"Pudukkottai","answer_hindi":"à¤ªà¥à¤¦à¥à¤•à¥‹à¤Ÿà¥à¤Ÿà¤ˆ","parent_id":"31"},
{"answer_id":"238","answer_english":"Pulwama","answer_hindi":"à¤ªà¥à¤²à¤µà¤¾à¤®à¤¾","parent_id":"14"},
{"answer_id":"398","answer_english":"Pune","answer_hindi":"à¤ªà¥à¤£à¥‡","parent_id":"21"},
{"answer_id":"722","answer_english":"Purba Bardhaman","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µ à¤¬à¤°à¥à¤§à¤®à¤¾à¤¨Â ","parent_id":"36"},
{"answer_id":"738","answer_english":"Purba Medinipur","answer_hindi":"à¤ªà¥‚à¤°à¥à¤µ à¤®à¥‡à¤¦à¤¿à¤¨à¥€à¤ªà¥à¤°","parent_id":"36"},
{"answer_id":"484","answer_english":"Puri","answer_hindi":"à¤ªà¥à¤°à¥€","parent_id":"26"},
{"answer_id":"102","answer_english":"Purnia","answer_hindi":"à¤ªà¥‚à¤°à¥à¤£à¤¿à¤¯à¤¾","parent_id":"5"},
{"answer_id":"739","answer_english":"Purulia","answer_hindi":"à¤ªà¥à¤°à¥‚à¤²à¤¿à¤¯à¤¾","parent_id":"36"},
{"answer_id":"692","answer_english":"Raebareli","answer_hindi":"à¤°à¤¾à¤¯à¤¬à¤°à¥‡à¤²à¥€","parent_id":"34"},
{"answer_id":"293","answer_english":"Raichur","answer_hindi":"à¤°à¤¾à¤¯à¤šà¥‚à¤°","parent_id":"16"},
{"answer_id":"399","answer_english":"Raigad","answer_hindi":"à¤°à¤¾à¤¯à¤—à¤¡","parent_id":"21"},
{"answer_id":"137","answer_english":"Raigarh","answer_hindi":"à¤°à¤¾à¤¯à¤—à¤¢","parent_id":"7"},
{"answer_id":"138","answer_english":"Raipur","answer_hindi":"à¤°à¤¾à¤¯à¤ªà¥à¤°","parent_id":"7"},
{"answer_id":"319","answer_english":"Raisen","answer_hindi":"à¤°à¤¾à¤¯à¤¸à¥‡à¤¨","parent_id":"20"},
{"answer_id":"613","answer_english":"Rajanna Sircilla","answer_hindi":"à¤°à¤¾à¤œà¤¨à¥à¤¨à¤¾ à¤¸à¤¿à¤°à¤¸à¤¿à¤²à¥à¤²à¤¾","parent_id":"32"},
{"answer_id":"320","answer_english":"Rajgarh ","answer_hindi":"à¤°à¤¾à¤œà¤—à¤¢à¤¼","parent_id":"20"},
{"answer_id":"185","answer_english":"Rajkot","answer_hindi":"à¤°à¤¾à¤œà¤•à¥‹à¤Ÿ","parent_id":"11"},
{"answer_id":"139","answer_english":"Rajnandgaon","answer_hindi":"à¤°à¤¾à¤œà¤¨à¤¾à¤‚à¤¦à¤—à¤¾à¤‚à¤µ","parent_id":"7"},
{"answer_id":"239","answer_english":"Rajouri","answer_hindi":"à¤°à¤¾à¤œà¥Œà¤°à¥€","parent_id":"14"},
{"answer_id":"542","answer_english":"Rajsamand","answer_hindi":"à¤°à¤¾à¤œà¤¸à¤®à¤‚à¤¦","parent_id":"29"},
{"answer_id":"294","answer_english":"Ramanagara","answer_hindi":"à¤°à¤¾à¤®à¤¨à¤—à¤°","parent_id":"16"},
{"answer_id":"572","answer_english":"Ramanathapuram","answer_hindi":"à¤°à¤¾à¤®à¤¨à¤¾à¤¥à¤ªà¥à¤°à¤®","parent_id":"31"},
{"answer_id":"240","answer_english":"Ramban","answer_hindi":"à¤°à¤¾à¤®à¤¬à¤¨","parent_id":"14"},
{"answer_id":"253","answer_english":"Ramgarh","answer_hindi":"à¤°à¤¾à¤®à¤—à¤¢à¤¼","parent_id":"15"},
{"answer_id":"693","answer_english":"Rampur","answer_hindi":"à¤°à¤¾à¤®à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"259","answer_english":"Ranchi","answer_hindi":"à¤°à¤¾à¤à¤šà¥€","parent_id":"15"},
{"answer_id":"614","answer_english":"Ranga Reddy","answer_hindi":"à¤°à¤‚à¤—à¤¾à¤°à¥‡à¤¡à¥à¤¡à¥€","parent_id":"32"},
{"answer_id":"573","answer_english":"Ranipet","answer_hindi":"à¤°à¤¾à¤¨à¥€à¤ªà¥‡à¤Ÿ","parent_id":"31"},
{"answer_id":"367","answer_english":"Ratlam","answer_hindi":"à¤°à¤¤à¤²à¤¾à¤®","parent_id":"20"},
{"answer_id":"400","answer_english":"Ratnagiri","answer_hindi":"à¤°à¤¤à¥à¤¨à¤¾à¤—à¤¿à¤°à¥€","parent_id":"21"},
{"answer_id":"485","answer_english":"Rayagada","answer_hindi":"à¤°à¤¾à¤¯à¤—à¤¡à¤¼à¤¾","parent_id":"26"},
{"answer_id":"241","answer_english":"Reasi","answer_hindi":"à¤°à¤¿à¤¯à¤¾à¤¸à¥€","parent_id":"14"},
{"answer_id":"350","answer_english":"Rewa ","answer_hindi":"à¤°à¥€à¤µà¤¾","parent_id":"20"},
{"answer_id":"209","answer_english":"Rewari","answer_hindi":"à¤°à¥‡à¤µà¤¾à¤¡à¤¼à¥€","parent_id":"12"},
{"answer_id":"430","answer_english":"Ri Bhoi","answer_hindi":"à¤°à¥€ à¤­à¥‹à¤ˆ","parent_id":"23"},
{"answer_id":"210","answer_english":"Rohtak","answer_hindi":"à¤°à¥‹à¤¹à¤¤à¤•","parent_id":"12"},
{"answer_id":"103","answer_english":"Rohtas","answer_hindi":"à¤°à¥‹à¤¹à¤¤à¤¾à¤¸","parent_id":"5"},
{"answer_id":"715","answer_english":"Rudraprayag","answer_hindi":"à¤°à¥à¤¦à¥à¤°à¤ªà¥à¤°à¤¯à¤¾à¤—","parent_id":"35"},
{"answer_id":"510","answer_english":"Rupnagar","answer_hindi":"à¤°à¥‚à¤ªà¤¨à¤—à¤°","parent_id":"28"},
{"answer_id":"186","answer_english":"Sabarkantha","answer_hindi":"à¤¸à¤¾à¤¬à¤°à¤•à¤¾à¤‚à¤ à¤¾","parent_id":"11"},
{"answer_id":"357","answer_english":"Sagar ","answer_hindi":"à¤¸à¤¾à¤—à¤°","parent_id":"20"},
{"answer_id":"694","answer_english":"Saharanpur","answer_hindi":"à¤¸à¤¹à¤¾à¤°à¤¨à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"104","answer_english":"Saharsa","answer_hindi":"à¤¸à¤¹à¤°à¤¸à¤¾","parent_id":"5"},
{"answer_id":"269","answer_english":"Sahebganj","answer_hindi":"à¤¸à¤¾à¤¹à¤¿à¤¬à¤—à¤‚à¤œ","parent_id":"15"},
{"answer_id":"511","answer_english":"Sahibzada Ajit Singh Nagar","answer_hindi":"à¤®à¥‹à¤¹à¤¾à¤²à¥€\/ à¤¸à¤¾à¤¹à¤¿à¤¬à¤œà¤¾à¤¦à¤¾ à¤…à¤œà¥€à¤¤ à¤¸à¤¿à¤‚à¤¹ à¤¨à¤—à¤°","parent_id":"28"},
{"answer_id":"441","answer_english":"Saiha","answer_hindi":"à¤¸à¤‡à¤¹à¤¾","parent_id":"24"},
{"answer_id":"446","answer_english":"Saitual","answer_hindi":"à¤¸à¤‡à¤¤à¥à¤†à¤²","parent_id":"24"},
{"answer_id":"574","answer_english":"Salem","answer_hindi":"à¤¸à¥‡à¤²à¤®","parent_id":"31"},
{"answer_id":"105","answer_english":"Samastipur","answer_hindi":"à¤¸à¤®à¤¸à¥à¤¤à¥€à¤ªà¥à¤°","parent_id":"5"},
{"answer_id":"242","answer_english":"Samba","answer_hindi":"à¤¸à¤¾à¤‚à¤¬à¤¾","parent_id":"14"},
{"answer_id":"486","answer_english":"Sambalpur","answer_hindi":"à¤¸à¤®à¥à¤¬à¤²à¤ªà¥à¤°","parent_id":"26"},
{"answer_id":"695","answer_english":"Sambhal","answer_hindi":"à¤¸à¤®à¥à¤­à¤²","parent_id":"34"},
{"answer_id":"615","answer_english":"Sangareddy","answer_hindi":"à¤¸à¤‚à¤—à¤¾à¤°à¥‡à¤¡à¥à¤¡à¥€","parent_id":"32"},
{"answer_id":"401","answer_english":"Sangli","answer_hindi":"à¤¸à¤¾à¤‚à¤—à¤²à¥€","parent_id":"21"},
{"answer_id":"512","answer_english":"Sangrur","answer_hindi":"à¤¸à¤‚à¤—à¤°à¥‚à¤°","parent_id":"28"},
{"answer_id":"696","answer_english":"Sant Kabir Nagar","answer_hindi":"à¤¸à¤‚à¤¤ à¤•à¤¬à¥€à¤°à¤¨à¤—à¤°","parent_id":"34"},
{"answer_id":"262","answer_english":"Saraikela Kharsawan","answer_hindi":"à¤¸à¤°à¤¾à¤‡à¤•à¥‡à¤²à¤¾ à¤–à¤°à¤¸à¤¾à¤µà¤¾à¤","parent_id":"15"},
{"answer_id":"106","answer_english":"Saran","answer_hindi":"à¤¸à¤¾à¤°à¤¨","parent_id":"5"},
{"answer_id":"402","answer_english":"Satara","answer_hindi":"à¤¸à¤¾à¤¤à¤¾à¤°à¤¾","parent_id":"21"},
{"answer_id":"351","answer_english":"Satna ","answer_hindi":"à¤¸à¤¤à¤¨à¤¾","parent_id":"20"},
{"answer_id":"544","answer_english":"Sawai Madhopur","answer_hindi":"à¤¸à¤µà¤¾à¤ˆ à¤®à¤¾à¤§à¥‹à¤ªà¥à¤°","parent_id":"29"},
{"answer_id":"321","answer_english":"Sehore ","answer_hindi":"à¤¸à¥€à¤¹à¥‹à¤°","parent_id":"20"},
{"answer_id":"413","answer_english":"Senapati","answer_hindi":"à¤¸à¥‡à¤¨à¤¾à¤ªà¤¤à¤¿ à¤œà¤¿à¤²à¤¾","parent_id":"22"},
{"answer_id":"345","answer_english":"Seoni ","answer_hindi":"à¤¸à¤¿à¤µà¤¨à¥€Â ","parent_id":"20"},
{"answer_id":"442","answer_english":"Serchhip","answer_hindi":"à¤¸à¥‡à¤°à¤›à¤¿à¤ª","parent_id":"24"},
{"answer_id":"152","answer_english":"Shahdara","answer_hindi":"à¤¶à¤¾à¤¹à¤¦à¤°à¤¾","parent_id":"9"},
{"answer_id":"361","answer_english":"Shahdol ","answer_hindi":"à¤¶à¤¹à¤¡à¥‹à¤²","parent_id":"20"},
{"answer_id":"513","answer_english":"Shahid Bhagat Singh Nagar","answer_hindi":"à¤¶à¤¹à¥€à¤¦ à¤­à¤—à¤¤à¤¸à¤¿à¤‚à¤¹à¤¨à¤—à¤°","parent_id":"28"},
{"answer_id":"697","answer_english":"Shahjahanpur","answer_hindi":"à¤¶à¤¾à¤¹à¤œà¤¹à¤¾à¤à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"368","answer_english":"Shajapur","answer_hindi":"à¤¶à¤¾à¤œà¤¾à¤ªà¥à¤°","parent_id":"20"},
{"answer_id":"698","answer_english":"Shamli","answer_hindi":"à¤¶à¤¾à¤®à¤²à¥€","parent_id":"34"},
{"answer_id":"107","answer_english":"Sheikhpura","answer_hindi":"à¤¶à¥‡à¤–à¤ªà¥à¤°à¤¾","parent_id":"5"},
{"answer_id":"108","answer_english":"Sheohar","answer_hindi":"à¤¶à¤¿à¤µà¤¹à¤°","parent_id":"5"},
{"answer_id":"324","answer_english":"Sheopur ","answer_hindi":"à¤¶à¥à¤¯à¥‹à¤ªà¥à¤°","parent_id":"20"},
{"answer_id":"33","answer_english":"Shi Yomi","answer_hindi":"à¤¶à¤¿à¤“à¤®à¥€","parent_id":"3"},
{"answer_id":"222","answer_english":"Shimla","answer_hindi":"à¤¶à¤¿à¤®à¤²à¤¾","parent_id":"13"},
{"answer_id":"295","answer_english":"Shimoga","answer_hindi":"à¤¶à¤¿à¤®à¥‹à¤—à¤¾","parent_id":"16"},
{"answer_id":"328","answer_english":"Shivpuri ","answer_hindi":"à¤¶à¤¿à¤µà¤ªà¥à¤°à¥€","parent_id":"20"},
{"answer_id":"243","answer_english":"Shopian","answer_hindi":"à¤¶à¥‹à¤ªà¤¿à¤¯à¤¾à¤‚","parent_id":"14"},
{"answer_id":"699","answer_english":"Shravasti","answer_hindi":"à¤¶à¥à¤°à¤¾à¤µà¤¸à¥à¤¤à¥€","parent_id":"34"},
{"answer_id":"34","answer_english":"Siang","answer_hindi":"à¤¸à¤¿à¤¯à¤¾à¤‚à¤—","parent_id":"3"},
{"answer_id":"700","answer_english":"Siddharthnagar","answer_hindi":"à¤¸à¤¿à¤¦à¥à¤§à¤¾à¤°à¥à¤¥à¤¨à¤—à¤°","parent_id":"34"},
{"answer_id":"616","answer_english":"Siddipet","answer_hindi":"à¤¸à¤¿à¤¦à¥à¤¦à¤¿à¤ªà¥‡à¤Ÿ","parent_id":"32"},
{"answer_id":"352","answer_english":"Sidhi ","answer_hindi":"à¤¸à¥€à¤§à¥€","parent_id":"20"},
{"answer_id":"543","answer_english":"Sikar","answer_hindi":"à¤¸à¥€à¤•à¤°","parent_id":"29"},
{"answer_id":"258","answer_english":"Simdega","answer_hindi":"à¤¸à¤¿à¤®à¤¡à¥‡à¤—à¤¾","parent_id":"15"},
{"answer_id":"403","answer_english":"Sindhudurg","answer_hindi":"à¤¸à¤¿à¤‚à¤§à¥à¤¦à¥à¤°à¥à¤—","parent_id":"21"},
{"answer_id":"353","answer_english":"Singrauli ","answer_hindi":"à¤¸à¤¿à¤‚à¤—à¤°à¥Œà¤²à¥€","parent_id":"20"},
{"answer_id":"627","answer_english":"Sipahijala","answer_hindi":"à¤¸à¤¿à¤ªà¤¾à¤¹à¥€à¤œà¤¾à¤²à¤¾","parent_id":"33"},
{"answer_id":"223","answer_english":"Sirmaur","answer_hindi":"à¤¸à¤¿à¤°à¤®à¥Œà¤°","parent_id":"13"},
{"answer_id":"545","answer_english":"Sirohi","answer_hindi":"à¤¸à¤¿à¤°à¥‹à¤¹à¥€","parent_id":"29"},
{"answer_id":"211","answer_english":"Sirsa","answer_hindi":"à¤¸à¤¿à¤°à¤¸à¤¾","parent_id":"12"},
{"answer_id":"109","answer_english":"Sitamarhi","answer_hindi":"à¤¸à¥€à¤¤à¤¾à¤®à¤¢à¤¼à¥€","parent_id":"5"},
{"answer_id":"701","answer_english":"Sitapur","answer_hindi":"à¤¸à¥€à¤¤à¤¾à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"575","answer_english":"Sivaganga","answer_hindi":"à¤¶à¤¿à¤µà¤—à¤‚à¤—à¤¾","parent_id":"31"},
{"answer_id":"70","answer_english":"Sivasagar","answer_hindi":"à¤¶à¤¿à¤µà¤¸à¤¾à¤—à¤°","parent_id":"4"},
{"answer_id":"110","answer_english":"Siwan","answer_hindi":"à¤¸à¥€à¤µà¤¾à¤¨","parent_id":"5"},
{"answer_id":"224","answer_english":"Solan","answer_hindi":"à¤¸à¥‹à¤²à¤¨","parent_id":"13"},
{"answer_id":"404","answer_english":"Solapur","answer_hindi":"à¤¸à¥‹à¤²à¤¾à¤ªà¥à¤°","parent_id":"21"},
{"answer_id":"702","answer_english":"Sonbhadra","answer_hindi":"à¤¸à¥‹à¤¨à¤­à¤¦à¥à¤°","parent_id":"34"},
{"answer_id":"212","answer_english":"Sonipat","answer_hindi":"à¤¸à¥‹à¤¨à¥€à¤ªà¤¤","parent_id":"12"},
{"answer_id":"71","answer_english":"Sonitpur","answer_hindi":"à¤¶à¥‹à¤£à¤¿à¤¤à¤ªà¥à¤°","parent_id":"4"},
{"answer_id":"740","answer_english":"South 24 Parganas","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ 24 à¤ªà¤°à¤—à¤¨à¤¾","parent_id":"36"},
{"answer_id":"16","answer_english":"South Andaman","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤…à¤£à¥à¤¡à¤®à¤¾à¤¨","parent_id":"2"},
{"answer_id":"153","answer_english":"South Delhi ","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"154","answer_english":"South East Delhi","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤ªà¥‚à¤°à¥à¤µà¥€ à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"431","answer_english":"South Garo Hills","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤—à¤¾à¤°à¥‹ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"158","answer_english":"South Goa","answer_hindi":"Â à¤¦à¤•à¥à¤·à¤¿à¤£ à¤—à¥‹à¤µà¤¾","parent_id":"10"},
{"answer_id":"72","answer_english":"South Salmara-Mankachar","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤¸à¤¾à¤²à¤®à¤¾à¤°à¤¾-à¤®à¤¨à¤•à¤¾à¤šà¤°","parent_id":"4"},
{"answer_id":"550","answer_english":"South Sikkim","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£Â à¤¸à¤¿à¤•à¥à¤•à¤¿à¤®","parent_id":"30"},
{"answer_id":"624","answer_english":"South Tripura","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤¤à¥à¤°à¤¿à¤ªà¥à¤°à¤¾","parent_id":"33"},
{"answer_id":"155","answer_english":"South West Delhi","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤ªà¤¶à¥à¤šà¤¿à¤® à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"432","answer_english":"South West Garo Hills","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤ªà¤¶à¥à¤šà¤¿à¤® à¤—à¤¾à¤°à¥‹ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"433","answer_english":"South West Khasi Hills","answer_hindi":"à¤¦à¤•à¥à¤·à¤¿à¤£ à¤ªà¤¶à¥à¤šà¤¿à¤® à¤–à¤¾à¤¸à¥€ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"507","answer_english":"Sri Muktsar Sahib","answer_hindi":"à¤®à¥à¤•à¥à¤¤à¤¸à¤°","parent_id":"28"},
{"answer_id":"10","answer_english":"Srikakulam","answer_hindi":"à¤¶à¥à¤°à¥€à¤•à¤¾à¤•à¥à¤²à¤®","parent_id":"1"},
{"answer_id":"244","answer_english":"Srinagar","answer_hindi":"à¤¶à¥à¤°à¥€à¤¨à¤—à¤°","parent_id":"14"},
{"answer_id":"487","answer_english":"Subarnapur(Sonepur)","answer_hindi":"à¤¸à¥à¤¬à¤°à¥à¤£à¤ªà¥à¤° (à¤¸à¥‹à¤¨à¤ªà¥à¤°)","parent_id":"26"},
{"answer_id":"140","answer_english":"Sukma","answer_hindi":"à¤¸à¥à¤•à¤®à¤¾","parent_id":"7"},
{"answer_id":"703","answer_english":"Sultanpur","answer_hindi":"à¤¸à¥à¤²à¥à¤¤à¤¾à¤¨à¤ªà¥à¤°","parent_id":"34"},
{"answer_id":"488","answer_english":"Sundargarh","answer_hindi":"à¤¸à¥à¤¨à¥à¤¦à¤°à¤—à¤¡à¤¼","parent_id":"26"},
{"answer_id":"111","answer_english":"Supaul","answer_hindi":"à¤¸à¥à¤ªà¥Œà¤²","parent_id":"5"},
{"answer_id":"141","answer_english":"Surajpur","answer_hindi":"à¤¸à¥‚à¤°à¤œà¤ªà¥à¤°","parent_id":"7"},
{"answer_id":"187","answer_english":"Surat","answer_hindi":"à¤¸à¥‚à¤°à¤¤","parent_id":"11"},
{"answer_id":"188","answer_english":"Surendranagar","answer_hindi":"à¤¸à¥à¤°à¥‡à¤‚à¤¦à¥à¤°à¤¨à¤—à¤°","parent_id":"11"},
{"answer_id":"142","answer_english":"Surguja","answer_hindi":"à¤¸à¤°à¤—à¥à¤œà¤¾","parent_id":"7"},
{"answer_id":"617","answer_english":"Suryapet","answer_hindi":"à¤¸à¥‚à¤°à¥à¤¯à¤¾à¤ªà¥‡à¤Ÿ","parent_id":"32"},
{"answer_id":"417","answer_english":"Tamenglong","answer_hindi":"à¤¤à¤®à¥‡à¤‚à¤—à¤²à¥‰à¤¨à¥à¤— à¤œà¤¿à¤²à¤¾","parent_id":"22"},
{"answer_id":"189","answer_english":"Tapi","answer_hindi":"à¤¤à¤¾à¤ªà¥€","parent_id":"11"},
{"answer_id":"514","answer_english":"Tarn Taran","answer_hindi":"à¤¤à¤°à¤¨ à¤¤à¤¾à¤°à¤¨ à¤¸à¤¾à¤¹à¤¿à¤¬","parent_id":"28"},
{"answer_id":"35","answer_english":"Tawang","answer_hindi":"à¤¤à¤µà¤¾à¤‚à¤—","parent_id":"3"},
{"answer_id":"716","answer_english":"Tehri Garhwal","answer_hindi":"à¤Ÿà¤¿à¤¹à¤°à¥€ à¤—à¤¢à¤¼à¤µà¤¾à¤²","parent_id":"35"},
{"answer_id":"421","answer_english":"Tengnoupal","answer_hindi":"à¤¤à¥‡à¤‚à¤—à¤¨à¥‹à¤‰à¤ªà¤²Â ","parent_id":"22"},
{"answer_id":"576","answer_english":"Tenkasi","answer_hindi":"à¤¤à¥‡à¤¨à¤•à¤¾à¤¶à¥€","parent_id":"31"},
{"answer_id":"405","answer_english":"Thane","answer_hindi":"à¤ à¤¾à¤£à¥‡","parent_id":"21"},
{"answer_id":"581","answer_english":"Thanjavur","answer_hindi":"à¤¤à¤‚à¤œà¤¾à¤µà¥à¤°","parent_id":"31"},
{"answer_id":"579","answer_english":"Theni","answer_hindi":"à¤¤à¥‡à¤¨à¥€","parent_id":"31"},
{"answer_id":"312","answer_english":"Thiruvananthapuram","answer_hindi":"à¤¤à¤¿à¤°à¥à¤µà¤¨à¤¨à¥à¤¤à¤ªà¥à¤°à¤®Â ","parent_id":"17"},
{"answer_id":"582","answer_english":"Thoothukudi","answer_hindi":"à¤¤à¥‚à¤¤à¥à¤•à¥à¤¡à¤¼à¥€","parent_id":"31"},
{"answer_id":"410","answer_english":"Thoubal","answer_hindi":"à¤¥à¥Œà¤¬à¤² à¤œà¤¿à¤²à¤¾","parent_id":"22"},
{"answer_id":"313","answer_english":"Thrissur","answer_hindi":"à¤¤à¥à¤°à¤¿à¤¸à¥à¤¸à¥‚à¤°Â ","parent_id":"17"},
{"answer_id":"358","answer_english":"Tikamgarh ","answer_hindi":"à¤Ÿà¥€à¤•à¤®à¤—à¤¢à¤¼","parent_id":"20"},
{"answer_id":"73","answer_english":"Tinsukia","answer_hindi":"à¤¤à¤¿à¤¨à¤¸à¥à¤•à¤¿à¤¯à¤¾","parent_id":"4"},
{"answer_id":"36","answer_english":"Tirap","answer_hindi":"à¤¤à¤¿à¤°à¤¾à¤ª","parent_id":"3"},
{"answer_id":"578","answer_english":"Tiruchirappalli","answer_hindi":"à¤¤à¤¿à¤°à¥à¤šà¤¿à¤°à¤¾à¤ªà¤²à¥à¤²à¥€","parent_id":"31"},
{"answer_id":"580","answer_english":"Tirunelveli","answer_hindi":"à¤¤à¤¿à¤°à¥‚à¤¨à¥‡à¤²à¤µà¥‡à¤²à¥€","parent_id":"31"},
{"answer_id":"583","answer_english":"Tirupattur","answer_hindi":"à¤¤à¤¿à¤°à¥à¤ªà¤¤à¥à¤¤à¥à¤°","parent_id":"31"},
{"answer_id":"577","answer_english":"Tirupur","answer_hindi":"à¤¤à¤¿à¤°à¥à¤ªà¥à¤°","parent_id":"31"},
{"answer_id":"584","answer_english":"Tiruvallur","answer_hindi":"à¤¤à¤¿à¤°à¥à¤µà¤²à¥à¤²à¥à¤°","parent_id":"31"},
{"answer_id":"586","answer_english":"Tiruvannamalai","answer_hindi":"à¤¤à¤¿à¤°à¥à¤µà¤¨à¥à¤¨à¤¾à¤®à¤²à¤ˆ","parent_id":"31"},
{"answer_id":"585","answer_english":"Tiruvarur","answer_hindi":"à¤¤à¤¿à¤°à¥à¤µà¤¾à¤°à¥à¤°","parent_id":"31"},
{"answer_id":"546","answer_english":"Tonk","answer_hindi":"à¤Ÿà¥‹à¤‚à¤•","parent_id":"29"},
{"answer_id":"455","answer_english":"Tuensang","answer_hindi":"à¤Ÿà¥à¤µà¥‡à¤¨à¤¸à¤¾à¤‚à¤—","parent_id":"25"},
{"answer_id":"296","answer_english":"Tumkur","answer_hindi":"à¤¤à¥à¤®à¤•à¥‚à¤°","parent_id":"16"},
{"answer_id":"547","answer_english":"Udaipur","answer_hindi":"à¤‰à¤¦à¤¯à¤ªà¥à¤°","parent_id":"29"},
{"answer_id":"74","answer_english":"Udalguri","answer_hindi":"à¤‰à¤¦à¤²à¤—à¥à¤¡à¤¼à¥€","parent_id":"4"},
{"answer_id":"717","answer_english":"Udham Singh Nagar","answer_hindi":"à¤‰à¤§à¤®à¤¸à¤¿à¤‚à¤¹ à¤¨à¤—à¤°","parent_id":"35"},
{"answer_id":"245","answer_english":"Udhampur","answer_hindi":"à¤‰à¤§à¤®à¤ªà¥à¤°","parent_id":"14"},
{"answer_id":"297","answer_english":"Udupi","answer_hindi":"à¤‰à¤¡à¥à¤ªà¥€","parent_id":"16"},
{"answer_id":"369","answer_english":"Ujjain","answer_hindi":"à¤‰à¤œà¥à¤œà¥ˆà¤¨","parent_id":"20"},
{"answer_id":"414","answer_english":"Ukhrul","answer_hindi":"à¤‰à¤–à¤°à¥à¤² à¤œà¤¿à¤²à¤¾","parent_id":"22"},
{"answer_id":"362","answer_english":"Umaria ","answer_hindi":"à¤‰à¤®à¤°à¤¿à¤¯à¤¾","parent_id":"20"},
{"answer_id":"225","answer_english":"Una","answer_hindi":"à¤‰à¤¨à¤¾","parent_id":"13"},
{"answer_id":"630","answer_english":"Unakoti","answer_hindi":"à¤‰à¤¨à¤¾à¤•à¥‹à¤Ÿà¥€","parent_id":"33"},
{"answer_id":"704","answer_english":"Unnao","answer_hindi":"à¤‰à¤¨à¥à¤¨à¤¾à¤µ","parent_id":"34"},
{"answer_id":"37","answer_english":"Upper Dibang Valley","answer_hindi":"à¤Šà¤ªà¤°à¥€ à¤¦à¤¿à¤¬à¤¾à¤‚à¤— à¤˜à¤¾à¤Ÿà¥€","parent_id":"3"},
{"answer_id":"38","answer_english":"Upper Siang","answer_hindi":"à¤Šà¤ªà¤°à¥€ à¤¸à¤¿à¤¯à¤¾à¤‚à¤—","parent_id":"3"},
{"answer_id":"39","answer_english":"Upper Subansiri","answer_hindi":"à¤Šà¤ªà¤°à¥€ à¤¸à¥à¤¬à¤¨à¤¸à¤¿à¤°à¥€","parent_id":"3"},
{"answer_id":"741","answer_english":"Uttar Dinajpur","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤¦à¤¿à¤¨à¤¾à¤œà¤ªà¥à¤°","parent_id":"36"},
{"answer_id":"298","answer_english":"Uttara Kannada","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤•à¤¨à¥à¤¨à¤¡à¤¼","parent_id":"16"},
{"answer_id":"718","answer_english":"Uttarkashi","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤°à¤•à¤¾à¤¶à¥€","parent_id":"35"},
{"answer_id":"190","answer_english":"Vadodara","answer_hindi":"à¤µà¥œà¥‹à¤¦à¤°à¤¾","parent_id":"11"},
{"answer_id":"112","answer_english":"Vaishali","answer_hindi":"à¤µà¥ˆà¤¶à¤¾à¤²à¥€","parent_id":"5"},
{"answer_id":"191","answer_english":"Valsad","answer_hindi":"à¤µà¤²à¤¸à¤¾à¤¡","parent_id":"11"},
{"answer_id":"705","answer_english":"Varanasi","answer_hindi":"à¤µà¤¾à¤°à¤¾à¤£à¤¸à¥€","parent_id":"34"},
{"answer_id":"587","answer_english":"Vellore","answer_hindi":"à¤µà¥‡à¤²à¥à¤²à¥‚à¤°","parent_id":"31"},
{"answer_id":"322","answer_english":"Vidisha ","answer_hindi":"à¤µà¤¿à¤¦à¤¿à¤¶à¤¾","parent_id":"20"},
{"answer_id":"299","answer_english":"Vijayanagara","answer_hindi":"à¤µà¤¿à¤œà¤¯à¤¨à¤—à¤°","parent_id":"16"},
{"answer_id":"618","answer_english":"Vikarabad","answer_hindi":"à¤µà¤¿à¤•à¤¼à¤¾à¤°à¤¾à¤¬à¤¾à¤¦","parent_id":"32"},
{"answer_id":"588","answer_english":"Viluppuram","answer_hindi":"à¤µà¤¿à¤²à¥à¤ªà¥à¤ªà¥à¤°à¤®","parent_id":"31"},
{"answer_id":"589","answer_english":"Virudhunagar","answer_hindi":"à¤µà¤¿à¤°à¥à¤§à¥à¤¨à¤—à¤°","parent_id":"31"},
{"answer_id":"11","answer_english":"Visakhapatnam","answer_hindi":"à¤µà¤¿à¤¶à¤¾à¤–à¤¾à¤ªà¤Ÿà¥à¤Ÿà¤¨à¤®","parent_id":"1"},
{"answer_id":"12","answer_english":"Vizianagaram","answer_hindi":"à¤µà¤¿à¤œà¤¯à¤¨à¤—à¤°à¤®","parent_id":"1"},
{"answer_id":"619","answer_english":"Wanaparthy","answer_hindi":"à¤µà¤¾à¤¨à¤ªà¤°à¥à¤¤à¤¿","parent_id":"32"},
{"answer_id":"621","answer_english":"Warangal Rural","answer_hindi":"à¤µà¤°à¤‚à¤—à¤² à¤—à¥à¤°à¤¾à¤®à¥€à¤£","parent_id":"32"},
{"answer_id":"620","answer_english":"Warangal Urban","answer_hindi":"à¤µà¤¾à¤°à¤‚à¤—à¤² à¤…à¤°à¥à¤¬à¤¨","parent_id":"32"},
{"answer_id":"406","answer_english":"Wardha","answer_hindi":"à¤µà¤°à¥à¤§à¤¾","parent_id":"21"},
{"answer_id":"407","answer_english":"Washim","answer_hindi":"à¤µà¤¾à¤¶à¥€à¤®","parent_id":"21"},
{"answer_id":"314","answer_english":"Wayanad","answer_hindi":"à¤µà¤¾à¤¯à¤¨à¤¾à¤¡Â ","parent_id":"17"},
{"answer_id":"113","answer_english":"West Champaran","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤®à¥€ à¤šà¤®à¥à¤ªà¤¾à¤°à¤£ à¤œà¤¿à¤²à¤¾","parent_id":"5"},
{"answer_id":"156","answer_english":"West Delhi","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤¦à¤¿à¤²à¥à¤²à¥€","parent_id":"9"},
{"answer_id":"426","answer_english":"West Garo Hills","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤—à¤¾à¤°à¥‹ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"13","answer_english":"West Godavari","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤—à¥‹à¤¦à¤¾à¤µà¤°à¥€","parent_id":"1"},
{"answer_id":"427","answer_english":"West Jaintia Hills","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤œà¤¯à¤‚à¤¤à¤¿à¤¯à¤¾ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"40","answer_english":"West Kameng","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤•à¤®à¥‡à¤‚à¤—","parent_id":"3"},
{"answer_id":"75","answer_english":"West Karbi Anglong","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤•à¤¾à¤°à¥à¤¬à¥€ à¤†à¤‚à¤—à¤²à¥‹à¤‚à¤—","parent_id":"4"},
{"answer_id":"428","answer_english":"West Khasi Hills","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤–à¤¾à¤¸à¥€ à¤¹à¤¿à¤²à¥à¤¸","parent_id":"23"},
{"answer_id":"41","answer_english":"West Siang","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤¸à¤¿à¤¯à¤¾à¤‚à¤—","parent_id":"3"},
{"answer_id":"551","answer_english":"West Sikkim","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤®Â à¤¸à¤¿à¤•à¥à¤•à¤¿à¤®","parent_id":"30"},
{"answer_id":"261","answer_english":"West Singhbhum","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤®à¥€ à¤¸à¤¿à¤‚à¤¹à¤­à¥‚à¤® ","parent_id":"15"},
{"answer_id":"629","answer_english":"West Tripura","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤¤à¥à¤°à¤¿à¤ªà¥à¤°à¤¾","parent_id":"33"},
{"answer_id":"456","answer_english":"Wokha","answer_hindi":"à¤µà¥‹à¤–à¤¾","parent_id":"25"},
{"answer_id":"622","answer_english":"Yadadri Bhuvanagiri","answer_hindi":"à¤¯à¤¾à¤¦à¤¾à¤¦à¥à¤°à¥€ à¤­à¥à¤µà¤¨à¤—à¤¿à¤°à¥€","parent_id":"32"},
{"answer_id":"300","answer_english":"Yadgir","answer_hindi":"à¤¯à¤¾à¤¦à¤—à¥€à¤°","parent_id":"16"},
{"answer_id":"213","answer_english":"Yamuna Nagar","answer_hindi":"à¤¯à¤®à¥à¤¨à¤¾à¤¨à¤—à¤°","parent_id":"12"},
{"answer_id":"492","answer_english":"Yanam","answer_hindi":"à¤¯à¤¾à¤¨à¤®","parent_id":"27"},
{"answer_id":"408","answer_english":"Yavatmal","answer_hindi":"à¤¯à¤µà¤¤à¤®à¤¾à¤³","parent_id":"21"},
{"answer_id":"457","answer_english":"Zunheboto","answer_hindi":"à¤œà¤¼à¥à¤¨à¥à¤¹à¥‡à¤¬à¥‹à¤Ÿà¥‹","parent_id":"25"}
    ];

    
    $rootScope.$storage.language = "English";

    // $rootScope.$storage.chat_messages = [
    //     {
    //         name : "language",
    //         question_id : 1,
    //         question_english : "Greetings! Would you like to proceed in English or Hindi?",
    //         question_hindi : "Greetings! Would you like to proceed in English or Hindi?",
    //         question_type : "option",
    //         is_skip : false,
    //         answers : [
    //             {
    //                 answer_id : "1",
    //                 answer_english : "English",
    //                 answer_hindi : "English",
    //             },
    //             {
    //                 answer_id : "2",
    //                 answer_english : "à¤¹à¤¿à¤‚à¤¦à¥€",  
    //                 answer_hindi : "à¤¹à¤¿à¤‚à¤¦à¥€",  
    //             }
    //         ],
    //         is_answered : false,
    //         answer : "",
    //     },
    //     {
    //         name : "intro",
    //         question_id : 2,
    //         question_english : $sce.trustAsHtml("Welcome to the Social Media Warrior campaign of the Indian National Congress! <br /><br /> Under this campaign, INC Social Media team will be expanded at every village, city, state and national level in the country! <br /><br /> If you too believe in the ideology of the Congress party and want to contribute to the nation building, then let us be a part of the Congress Social Media Team! <br /><br /> You will be given responsibility at national, state or district level according to your qualifications and compatibility. <br /><br /> Let us join hands and fulfill our obligation to protect our democracy and build a modern India by being part of the world'\s largest democratic movement. <br /><br /> Please provide the following information that will help in giving you the corresponding responsibility! <br /><br /> Thank you ! <br /><br /> <iframe width='100%' height='315' src='https://www.youtube.com/embed/E7gWc7d0tOE' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>"),
    //         question_hindi : $sce.trustAsHtml("à¤­à¤¾à¤°à¤¤à¥€à¤¯ à¤°à¤¾à¤·à¥à¤Ÿà¥à¤°à¥€à¤¯ à¤•à¤¾à¤‚à¤—à¥à¤°à¥‡à¤¸ à¤•à¥‡ Social Media Warrior à¤…à¤­à¤¿à¤¯à¤¾à¤¨ à¤®à¥‡à¤‚ à¤†à¤ªà¤•à¤¾ à¤¸à¥à¤µà¤¾à¤—à¤¤ à¤¹à¥ˆà¥¤ <br /><br /> à¤‡à¤¸ à¤…à¤­à¤¿à¤¯à¤¾à¤¨ à¤•à¥‡ à¤¤à¤¹à¤¤ à¤¦à¥‡à¤¶ à¤•à¥‡ à¤¹à¤° à¤—à¤¾à¤‚à¤µ, à¤¶à¤¹à¤°, à¤°à¤¾à¤œà¥à¤¯ à¤”à¤° à¤°à¤¾à¤·à¥à¤Ÿà¥à¤°à¥€à¤¯ à¤¸à¥à¤¤à¤° à¤ªà¤° INC Social Media à¤Ÿà¥€à¤® à¤•à¤¾ à¤µà¤¿à¤¸à¥à¤¤à¤¾à¤° à¤•à¤¿à¤¯à¤¾ à¤œà¤¾à¤à¤—à¤¾à¥¤ <br /><br /> à¤…à¤—à¤° à¤†à¤ª à¤­à¥€ à¤•à¤¾à¤‚à¤—à¥à¤°à¥‡à¤¸ à¤•à¥€ à¤µà¤¿à¤šà¤¾à¤°à¤§à¤¾à¤°à¤¾ à¤®à¥‡à¤‚ à¤µà¤¿à¤¶à¥à¤µà¤¾à¤¸ à¤°à¤–à¤¤à¥‡ à¤¹à¥ˆà¤‚ à¤”à¤° à¤°à¤¾à¤·à¥à¤Ÿà¥à¤°à¤¨à¤¿à¤°à¥à¤®à¤¾à¤£ à¤®à¥‡à¤‚ à¤…à¤ªà¤¨à¤¾ à¤¯à¥‹à¤—à¤¦à¤¾à¤¨ à¤¦à¥‡à¤¨à¤¾ à¤šà¤¾à¤¹à¤¤à¥‡ à¤¹à¥ˆà¤‚ à¤¤à¥‹ à¤†à¤‡à¤ à¤•à¤¾à¤‚à¤—à¥à¤°à¥‡à¤¸ à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾ à¤Ÿà¥€à¤® à¤•à¤¾ à¤¹à¤¿à¤¸à¥à¤¸à¤¾ à¤¬à¤¨à¤¿à¤à¥¤ <br /><br /> à¤†à¤ªà¤•à¥€ à¤¯à¥‹à¤—à¥à¤¯à¤¤à¤¾ à¤”à¤° à¤•à¥à¤·à¤®à¤¤à¤¾ à¤•à¥‡ à¤…à¤¨à¥à¤¸à¤¾à¤° à¤†à¤ªà¤•à¥‹ à¤°à¤¾à¤·à¥à¤Ÿà¥à¤°à¥€à¤¯, à¤°à¤¾à¤œà¥à¤¯ à¤¯à¤¾ à¤œà¤¿à¤²à¤¾ à¤¸à¥à¤¤à¤° à¤ªà¤° à¤œà¤¿à¤®à¥à¤®à¥‡à¤¦à¤¾à¤°à¥€ à¤¦à¥€ à¤œà¤¾à¤à¤—à¥€à¥¤ <br /><br /> à¤†à¤‡à¤ à¤¹à¤¾à¤¥ à¤¸à¥‡ à¤¹à¤¾à¤¥ à¤®à¤¿à¤²à¤¾à¤à¤‚ à¤”à¤° à¤µà¤¿à¤¶à¥à¤µ à¤•à¥‡ à¤¸à¤¬à¤¸à¥‡ à¤¬à¤¡à¥‡ à¤²à¥‹à¤•à¤¤à¤¾à¤‚à¤¤à¥à¤°à¤¿à¤• à¤†à¤‚à¤¦à¥‹à¤²à¤¨ à¤•à¤¾ à¤¹à¤¿à¤¸à¥à¤¸à¤¾ à¤¬à¤¨ à¤•à¤° à¤¹à¤®à¤¾à¤°à¥‡ à¤²à¥‹à¤•à¤¤à¤‚à¤¤à¥à¤° à¤•à¥€ à¤°à¤•à¥à¤·à¤¾ à¤”à¤° à¤†à¤§à¥à¤¨à¤¿à¤• à¤­à¤¾à¤°à¤¤ à¤•à¥‡ à¤¨à¤¿à¤°à¥à¤®à¤¾à¤£ à¤•à¤¾ à¤¹à¤®à¤¾à¤°à¤¾ à¤¦à¤¾à¤¯à¤¿à¤¤à¥à¤µ à¤ªà¥‚à¤°à¤¾ à¤•à¤°à¥‡à¤‚à¥¤ <br /><br /> à¤•à¥ƒà¤ªà¤¯à¤¾ à¤¨à¤¿à¤®à¥à¤¨ à¤œà¤¾à¤¨à¤•à¤¾à¤°à¥€ à¤¦à¥‡à¤‚ à¤œà¤¿à¤¸à¤¸à¥‡ à¤†à¤ªà¤•à¥‡ à¤…à¤¨à¥à¤°à¥‚à¤ª à¤œà¤¿à¤®à¥à¤®à¥‡à¤¦à¤¾à¤°à¥€ à¤¦à¥‡à¤¨à¥‡ à¤®à¥‡à¤‚ à¤¸à¤¹à¤¾à¤¯à¤¤à¤¾ à¤®à¤¿à¤²à¥‡à¥¤ <br /><br /> à¤§à¤¨à¥à¤¯à¤µà¤¾à¤¦  <iframe width='100%' height='315' src='https://www.youtube.com/embed/ju1yZKzapnw' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>"), 
    //         question_type : "text",
    //         is_skip : false,
    //         answers : [],
    //         is_answered : false,
    //         answer : "English",
    //     },
    //     {
    //         name : "name",
    //         question_id : 5,
    //         question_english : "Please type your name and surname",
    //         question_hindi : "à¤•à¥ƒà¤ªà¤¯à¤¾ à¤†à¤ªà¤•à¤¾ à¤¨à¤¾à¤® à¤”à¤° à¤‰à¤ªà¤¨à¤¾à¤® à¤Ÿà¤¾à¤‡à¤ª à¤•à¤°à¥‡à¤‚",
    //         question_type : "text",
    //         is_skip : false,
    //         answers : [],
    //         is_answered : false,
    //         answer : "",
    //     },
    //     {
    //         name : "mobile",
    //         question_id : 6,
    //         question_english : "Your phone number?",
    //         question_hindi : "à¤†à¤ªà¤•à¤¾ à¤«à¥‹à¤¨ à¤¨à¤‚à¤¬à¤°?",
    //         question_type : "number",
    //         max_length : 10,
    //         is_skip : false,
    //         answers : [],
    //         is_answered : false,
    //         answer : "",
    //     },
    //     {
    //         name : "already_registered",
    //         question_id : 7,
    //         question_english : "Your mobile number is already registered. Thank You.",
    //         question_hindi : "à¤†à¤ªà¤•à¤¾ à¤®à¥‹à¤¬à¤¾à¤‡à¤² à¤¨à¤‚à¤¬à¤° à¤ªà¤¹à¤²à¥‡ à¤¸à¥‡ à¤ªà¤‚à¤œà¥€à¤•à¥ƒà¤¤ à¤¹à¥ˆà¥¤ à¤§à¤¨à¥à¤¯à¤µà¤¾à¤¦à¥¤",
    //         question_type : "none",
    //         max_length : 10,
    //         is_skip : false,
    //         answers : [],
    //         is_answered : false,
    //         answer : "",
    //     },
    //     {
    //         name : "otp",
    //         question_id : 8,
    //         question_english : "You must have received an OTP. Please type that.",
    //         question_hindi : "à¤†à¤ªà¤•à¥‹ à¤à¤• OTP à¤ªà¥à¤°à¤¾à¤ªà¥à¤¤ à¤¹à¥à¤† à¤¹à¥‹à¤—à¤¾à¥¤ à¤•à¥ƒà¤ªà¤¯à¤¾ OTP à¤Ÿà¤¾à¤‡à¤ª à¤•à¤°à¥‡à¤‚",
    //         question_type : "number",
    //         max_length : 6,
    //         is_skip : false,
    //         answers : [],
    //         is_answered : false,
    //         answer : "",
    //     },
    //     {
    //         name : "verify_otp",
    //         question_id : 9,
    //         question_english : "Invalid verification code, Please try again.",
    //         question_hindi : "à¤µà¥ˆà¤°à¤¿à¤«à¤¿à¤•à¥‡à¤¶à¤¨ à¤•à¥‹à¤¡ à¤—à¤²à¤¤ à¤¹à¥ˆ.",
    //         question_type : "none",
    //         max_length : 6,
    //         is_skip : false,
    //         answers : [],
    //         is_answered : false,
    //         answer : "",
    //     },
    //     {
    //         name : "is_whatsapp",
    //         question_id : 10,
    //         question_english : "Is this also your WhatsApp number?",
    //         question_hindi : "à¤•à¥à¤¯à¤¾ à¤¯à¤¹ à¤†à¤ªà¤•à¤¾ à¤µà¥à¤¹à¤¾à¤Ÿà¥à¤¸à¤à¤ª à¤¨à¤‚à¤¬à¤° à¤­à¥€ à¤¹à¥ˆ?",
    //         question_type : "option",
    //         is_skip : false,
    //         is_answered : false,
    //         answers : [
    //             {
    //                 answer_id : "1",
    //                 answer_english : "Yes",
    //                 answer_hindi : "à¤¹à¤¾à¤",
    //             },
    //             {
    //                 answer_id : "2",
    //                 answer_english : "No",  
    //                 answer_hindi : "à¤¨à¤¹à¥€à¤‚",  
    //             }
    //         ],
    //         answer : "",
    //     },
    //     {
    //         name : "whatsapp_number",
    //         question_id : 11,
    //         question_english : "What is your WhatsApp number?",
    //         question_hindi : "à¤†à¤ªà¤•à¤¾ à¤µà¥à¤¹à¤¾à¤Ÿà¥à¤¸à¤à¤ª à¤¨à¤‚à¤¬à¤° à¤•à¥à¤¯à¤¾ à¤¹à¥ˆ?",
    //         question_type : "text",
    //         is_skip : false,
    //         max_length : 10,
    //         is_answered : false,
    //         answers : [],
    //         answer : "",
    //     },
    //     {
    //         name : "state_id",
    //         question_id : 12,
    //         question_english : "Which state or union territory are you from?",
    //         question_hindi : "à¤†à¤ª à¤•à¤¿à¤¸ à¤°à¤¾à¤œà¥à¤¯ à¤¯à¤¾ à¤•à¥‡à¤‚à¤¦à¥à¤° à¤¶à¤¾à¤¸à¤¿à¤¤ à¤ªà¥à¤°à¤¦à¥‡à¤¶ à¤¸à¥‡ à¤¹à¥ˆà¤‚?",
    //         question_type : "selection",
    //         is_answered : false,
    //         is_skip : false,
    //         answers : [
    //             {"answer_id":"1","answer_english":"Andaman Nicobar","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
    //             {"answer_id":"2","answer_english":"Andhra Pradesh","answer_hindi":"à¤†à¤‚à¤§à¥à¤° à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
    //             {"answer_id":"3","answer_english":"Arunachal Pradesh","answer_hindi":"à¤…à¤°à¥à¤£à¤¾à¤šà¤² à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
    //             {"answer_id":"4","answer_english":"Assam","answer_hindi":"à¤…à¤¸à¤®"},
    //             {"answer_id":"5","answer_english":"Bihar","answer_hindi":"à¤¬à¤¿à¤¹à¤¾à¤°"},
    //             {"answer_id":"6","answer_english":"Chandigarh","answer_hindi":"à¤šà¤‚à¤¡à¥€à¤—à¤¢à¤¼"},
    //             {"answer_id":"7","answer_english":"Chhattisgarh","answer_hindi":"à¤›à¤¤à¥à¤¤à¥€à¤¸à¤—à¤¢à¤¼"},
    //             {"answer_id":"8","answer_english":"Dadra and Nagar Haveli","answer_hindi":"à¤¦à¤¾à¤¦à¤°à¤¾ à¤”à¤° à¤¨à¤—à¤° à¤¹à¤µà¥‡à¤²à¥€"},
    //             {"answer_id":"9","answer_english":"Delhi","answer_hindi":"à¤¦à¤¿à¤²à¥à¤²à¥€"},
    //             {"answer_id":"10","answer_english":"Diu Daman","answer_hindi":"à¤¦à¥€à¤µ à¤¦à¤®à¤¨"},
    //             {"answer_id":"11","answer_english":"Goa","answer_hindi":"à¤—à¥‹à¤µà¤¾"},
    //             {"answer_id":"12","answer_english":"Gujarat","answer_hindi":"à¤—à¥à¤œà¤°à¤¾à¤¤"},
    //             {"answer_id":"13","answer_english":"Haryana","answer_hindi":"à¤¹à¤°à¤¿à¤¯à¤¾à¤£à¤¾"},
    //             {"answer_id":"14","answer_english":"Himachal Pradesh","answer_hindi":"à¤¹à¤¿à¤®à¤¾à¤šà¤² à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
    //             {"answer_id":"15","answer_english":"Jammu Kashmir","answer_hindi":"à¤œà¤®à¥à¤®à¥‚ à¤•à¤¶à¥à¤®à¥€à¤°"},
    //             {"answer_id":"16","answer_english":"Jharkhand","answer_hindi":"à¤à¤¾à¤°à¤–à¤‚à¤¡"},
    //             {"answer_id":"17","answer_english":"Karnataka","answer_hindi":"à¤•à¤°à¥à¤¨à¤¾à¤Ÿà¤•"},
    //             {"answer_id":"18","answer_english":"Kerala","answer_hindi":"à¤•à¥‡à¤°à¤²"},
    //             {"answer_id":"19","answer_english":"Lakshadweep","answer_hindi":"à¤²à¤•à¥à¤·à¤¦à¥à¤µà¥€à¤ª"},
    //             {"answer_id":"20","answer_english":"Madhya Pradesh","answer_hindi":"à¤®à¤§à¥à¤¯ à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
    //             {"answer_id":"21","answer_english":"Maharashtra","answer_hindi":"à¤®à¤¹à¤¾à¤°à¤¾à¤·à¥à¤Ÿà¥à¤°"},
    //             {"answer_id":"22","answer_english":"Manipur","answer_hindi":"à¤®à¤£à¤¿à¤ªà¥à¤°"},
    //             {"answer_id":"23","answer_english":"Meghalaya","answer_hindi":"à¤®à¥‡à¤˜à¤¾à¤²à¤¯"},
    //             {"answer_id":"24","answer_english":"Mizoram","answer_hindi":"à¤®à¤¿à¤œà¥‹à¤°à¤®"},
    //             {"answer_id":"25","answer_english":"Nagaland","answer_hindi":"à¤¨à¤—à¤¾à¤²à¥ˆà¤‚à¤¡"},
    //             {"answer_id":"26","answer_english":"Odisha","answer_hindi":"à¤“à¤¡à¤¿à¤¶à¤¾"},
    //             {"answer_id":"27","answer_english":"Puducherry","answer_hindi":"à¤ªà¥à¤¡à¥à¤šà¥‡à¤°à¥€"},
    //             {"answer_id":"28","answer_english":"Punjab","answer_hindi":"à¤ªà¤‚à¤œà¤¾à¤¬"},
    //             {"answer_id":"29","answer_english":"Rajasthan","answer_hindi":"à¤°à¤¾à¤œà¤¸à¥à¤¥à¤¾à¤¨"},
    //             {"answer_id":"30","answer_english":"Sikkim","answer_hindi":"à¤¸à¤¿à¤•à¥à¤•à¤¿à¤®"},
    //             {"answer_id":"31","answer_english":"Tamil Nadu","answer_hindi":"à¤¤à¤®à¤¿à¤²à¤¨à¤¾à¤¡à¥"},
    //             {"answer_id":"32","answer_english":"Telangana","answer_hindi":"à¤¤à¥‡à¤²à¤‚à¤—à¤¾à¤¨à¤¾"},
    //             {"answer_id":"33","answer_english":"Tripura","answer_hindi":"à¤¤à¥à¤°à¤¿à¤ªà¥à¤°à¤¾"},
    //             {"answer_id":"34","answer_english":"Uttar Pradesh","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤° à¤ªà¥à¤°à¤¦à¥‡à¤¶"},
    //             {"answer_id":"35","answer_english":"Uttarakhand","answer_hindi":"à¤‰à¤¤à¥à¤¤à¤°à¤¾à¤–à¤‚à¤¡"},
    //             {"answer_id":"36","answer_english":"West Bengal","answer_hindi":"à¤ªà¤¶à¥à¤šà¤¿à¤® à¤¬à¤‚à¤—à¤¾à¤²"},
    //             // {"answer_id":"37","answer_english":"Mumbai","answer_hindi":"à¤®à¥à¤‚à¤¬à¤ˆ"},
    //             {"answer_id":"38","answer_english":"Ladakh","answer_hindi":"à¤²à¤¦à¥à¤¦à¤¾à¤–"}
    //         ],
    //         answer : "",
    //     },
    //     {
    //         name : "pincode",
    //         question_id : 13,
    //         question_english : "Please enter your PIN code",
    //         question_hindi : "à¤œà¥€ à¤•à¥ƒà¤ªà¤¯à¤¾ à¤…à¤ªà¤¨à¤¾ à¤ªà¤¿à¤¨ à¤•à¥‹à¤¡ à¤¦à¤°à¥à¤œ à¤•à¤°à¥‡à¤‚",
    //         question_type : "number",
    //         max_length : 6,
    //         is_skip : false,
    //         is_answered : false,
    //         answers : [],
    //         answer : "",
    //     },
    //     // {
    //     //     name : "thankyou",
    //     //     question_id : 16,
    //     //     question_english : "Thank you for your feedback. We will be in touch with you shortly! Your reference number is the same as your primary phone number.",
    //     //     question_hindi : "à¤†à¤ªà¤•à¥€ à¤ªà¥à¤°à¤¤à¤¿à¤•à¥à¤°à¤¿à¤¯à¤¾ à¤•à¥‡ à¤²à¤¿à¤ à¤†à¤ªà¤•à¤¾ à¤§à¤¨à¥à¤¯à¤µà¤¾à¤¦à¥¤ à¤¹à¤® à¤†à¤ªà¤¸à¥‡ à¤¶à¥€à¤˜à¥à¤° à¤¹à¥€ à¤¸à¤‚à¤ªà¤°à¥à¤• à¤•à¤°à¥‡à¤‚à¤—à¥‡! à¤†à¤ªà¤•à¤¾ à¤¸à¤‚à¤¦à¤°à¥à¤­ à¤¸à¤‚à¤–à¥à¤¯à¤¾ à¤†à¤ªà¤•à¤¾ à¤ªà¥à¤°à¤¾à¤¥à¤®à¤¿à¤• à¤«à¤¼à¥‹à¤¨ à¤¨à¤‚à¤¬à¤° à¤¹à¥ˆ",
    //     //     question_type : "none",
    //     //     is_skip : false,
    //     //     is_answered : false,
    //     //     answers : [],
    //     //     answer : "",
    //     // },
    //     {
    //         name : "qualification",
    //         question_id : 14,
    //         question_english : "What is your educational qualification?",
    //         question_hindi : "à¤†à¤ªà¤•à¥€ à¤¶à¥ˆà¤•à¥à¤·à¤£à¤¿à¤• à¤¯à¥‹à¤—à¥à¤¯à¤¤à¤¾ à¤•à¥à¤¯à¤¾ à¤¹à¥ˆ?",
    //         question_type : "selection",
    //         is_answered : false,
    //         is_skip : false,
    //         answers : [
    //             {"answer_id":"1","answer_english":"School","answer_hindi":"à¤¸à¥à¤•à¥‚à¤²"},
    //             {"answer_id":"2","answer_english":"Graduate","answer_hindi":"à¤—à¥à¤°à¥‡à¤œà¥à¤à¤Ÿ"},
    //             {"answer_id":"3","answer_english":"Post graduate","answer_hindi":"à¤ªà¥‹à¤¸à¥à¤Ÿ à¤—à¥à¤°à¥‡à¤œà¥à¤à¤Ÿ"},
    //             {"answer_id":"4","answer_english":"PhD","answer_hindi":"à¤ªà¥€à¤à¤šà¤¡à¥€"},
    //         ],
    //         answer : "",
    //     },
    //     {
    //         name : "profession",
    //         question_id : 15,
    //         question_english : "What is your occupational / employment status?",
    //         question_hindi : "à¤†à¤ªà¤•à¥€  à¤µà¥à¤¯à¤µà¤¸à¤¾à¤¯à¤¿à¤• / à¤°à¥‹à¤œà¤—à¤¾à¤° à¤¸à¥à¤¥à¤¿à¤¤à¤¿ à¤•à¥à¤¯à¤¾ à¤¹à¥ˆ?",
    //         question_type : "selection",
    //         is_answered : false,
    //         is_skip : false,
    //         answers : [
    //             {"answer_id":"1","answer_english":"Student","answer_hindi":"à¤›à¤¾à¤¤à¥à¤°"},
    //             {"answer_id":"2","answer_english":"Self Employed/ Business","answer_hindi":"à¤¸à¥à¤µ - à¤°à¥‹à¤œà¤—à¤¾à¤° / à¤µà¥à¤¯à¤¾à¤ªà¤¾à¤°"},
    //             {"answer_id":"3","answer_english":"Private Service","answer_hindi":"à¤ªà¥à¤°à¤¾à¤‡à¤µà¥‡à¤Ÿ à¤¸à¤°à¥à¤µà¤¿à¤¸"},
    //             {"answer_id":"4","answer_english":"Govt/ Semi Government","answer_hindi":"à¤¸à¤°à¤•à¤¾à¤°à¥€ / à¤…à¤°à¥à¤§ à¤¸à¤°à¤•à¤¾à¤°à¥€ à¤¸à¥‡à¤µà¤¾"},
    //             {"answer_id":"5","answer_english":"NGO","answer_hindi":"à¤à¤¨à¤œà¥€à¤“"},
    //             {"answer_id":"6","answer_english":"Other","answer_hindi":"à¤…à¤¨à¥à¤¯"}
    //         ],
    //         answer : "",
    //     },
    //     {
    //         name : "interested_position",
    //         question_id : 16,
    //         question_english : "On What position would you like to work on?",
    //         question_hindi : "à¤•à¤¿à¤¸ à¤¸à¥à¤¤à¤¾ à¤ªà¤° à¤•à¤¾à¤® à¤•à¤°à¤¨à¤¾ à¤šà¤¾à¤¹à¥‡à¤‚à¤—à¥‡?",
    //         question_type : "text",
    //         max_length : 15,
    //         is_skip : false,
    //         is_answered : false,
    //         answers : [],
    //         answer : "",
    //     },
    //     {
    //         name : "prefered_working_hours",
    //         question_id : 18,
    //         question_english : "How many hours per day are you willing to devote to working with the Congress social media team?",
    //         question_hindi : "à¤†à¤ª à¤ªà¥à¤°à¤¤à¤¿ à¤¦à¤¿à¤¨ à¤•à¤¿à¤¤à¤¨à¥‡ à¤˜à¤‚à¤Ÿà¥‡ à¤•à¤¾à¤‚à¤—à¥à¤°à¥‡à¤¸ à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾ à¤Ÿà¥€à¤® à¤•à¥‡ à¤¸à¤¾à¤¥ à¤•à¤¾à¤® à¤•à¤°à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤¸à¤®à¤°à¥à¤ªà¤¿à¤¤ à¤•à¤°à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤¤à¥ˆà¤¯à¤¾à¤° à¤¹à¥ˆà¤‚?",
    //         question_type : "selection",
    //         is_answered : false,
    //         is_skip : false,
    //         answers : [
    //             {"answer_id":"1","answer_english":"1-2 Hours","answer_hindi":"1-2 à¤˜à¤‚à¤Ÿà¥‡"},
    //             {"answer_id":"2","answer_english":"2-4 Hours","answer_hindi":"2-4 à¤˜à¤‚à¤Ÿà¥‡"},
    //             {"answer_id":"3","answer_english":"4-6 Hours","answer_hindi":"4-6 à¤˜à¤‚à¤Ÿà¥‡"},
    //             {"answer_id":"4","answer_english":"More than 6 Hours","answer_hindi":"6 à¤˜à¤‚à¤Ÿà¥‡ à¤¸à¥‡ à¤œà¥à¤¯à¤¾à¤¦à¤¾"},
    //         ],
    //         answer : "",
    //     },
    //     {
    //         name : "prefered_working",
    //         question_id : 19,
    //         // question_english : "In which of the following areas are you willing to work with the Congress Social Media team? Please mention top TWO only. <br /><br />Training,<br /> Research,<br /> Content (writing),<br /> Content Creation,<br /> Outreach/ Team Development,<br /> Outreach/ Team Development,<br /> Content Distribution.",
    //         // question_hindi : "à¤†à¤ª à¤¨à¤¿à¤®à¥à¤¨à¤²à¤¿à¤–à¤¿à¤¤ à¤®à¥‡à¤‚ à¤¸à¥‡ à¤•à¤¿à¤¸ à¤•à¥à¤·à¥‡à¤¤à¥à¤° à¤®à¥‡à¤‚ à¤•à¤¾à¤‚à¤—à¥à¤°à¥‡à¤¸ à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾ à¤Ÿà¥€à¤® à¤•à¥‡ à¤¸à¤¾à¤¥ à¤•à¤¾à¤® à¤•à¤°à¤¨à¥‡ à¤•à¥‡ à¤‡à¤šà¥à¤›à¥à¤• à¤¹à¥ˆà¤‚? à¤•à¥ƒà¤ªà¤¯à¤¾ à¤•à¥‡à¤µà¤² à¤¦à¥‹ à¤•à¤¾ à¤‰à¤²à¥à¤²à¥‡à¤– à¤•à¤°à¥‡à¤‚.<br /><br /> à¤Ÿà¥à¤°à¥‡à¤¨à¤¿à¤‚à¤—,<br /> à¤°à¤¿à¤¸à¤°à¥à¤š,<br /> à¤•à¤‚à¤Ÿà¥‡à¤‚à¤Ÿ à¤²à¥‡à¤–à¤¨,<br /> à¤•à¤‚à¤Ÿà¥‡à¤‚à¤Ÿ (à¤µà¥€à¤¡à¤¿à¤¯à¥‹ / à¤‘à¤¡à¤¿à¤¯à¥‹ / à¤—à¥à¤°à¤¾à¤«à¤¿à¤•à¥à¤¸,<br />à¤†à¤‰à¤Ÿà¤°à¥€à¤š / à¤Ÿà¥€à¤® à¤¤à¥ˆà¤¯à¤¾à¤° à¤•à¤°à¤¨à¤¾,<br />à¤•à¤‚à¤Ÿà¥‡à¤‚à¤Ÿ à¤µà¤¿à¤¤à¤°à¤£",
    //         question_english : " In which of the following areas are you willing to work with the Congress social media team?",
    //         question_hindi : "à¤†à¤ª à¤¨à¤¿à¤®à¥à¤¨à¤²à¤¿à¤–à¤¿à¤¤ à¤®à¥‡à¤‚ à¤¸à¥‡ à¤•à¤¿à¤¸ à¤•à¥à¤·à¥‡à¤¤à¥à¤° à¤®à¥‡à¤‚ à¤•à¤¾à¤‚à¤—à¥à¤°à¥‡à¤¸ à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾ à¤Ÿà¥€à¤® à¤•à¥‡ à¤¸à¤¾à¤¥ à¤•à¤¾à¤® à¤•à¤°à¤¨à¥‡ à¤•à¥‡ à¤‡à¤šà¥à¤›à¥à¤• à¤¹à¥ˆà¤‚?",
    //         max_check : 15,
    //         question_type : "checkbox",
    //         is_answered : false,
    //         is_skip : false,
    //         answers : [
    //             {"answer_id":"1","answer_english":"Training","answer_hindi":"à¤Ÿà¥à¤°à¥‡à¤¨à¤¿à¤‚à¤—"},
    //             {"answer_id":"2","answer_english":"Research","answer_hindi":"à¤°à¤¿à¤¸à¤°à¥à¤š"},
    //             {"answer_id":"3","answer_english":"Content (writing)","answer_hindi":"à¤•à¤‚à¤Ÿà¥‡à¤‚à¤Ÿ à¤²à¥‡à¤–à¤¨"},
    //             {"answer_id":"4","answer_english":"Content Creation","answer_hindi":"à¤•à¤‚à¤Ÿà¥‡à¤‚à¤Ÿ à¤•à¥à¤°à¤¿à¤à¤¶à¤¨"},
    //             {"answer_id":"5","answer_english":"Outreach/ Team Development","answer_hindi":"à¤†à¤‰à¤Ÿà¤°à¥€à¤š / à¤Ÿà¥€à¤® à¤¤à¥ˆà¤¯à¤¾à¤° à¤•à¤°à¤¨à¤¾"},
    //             {"answer_id":"5","answer_english":"Content Distribution","answer_hindi":"à¤•à¤‚à¤Ÿà¥‡à¤‚à¤Ÿ à¤µà¤¿à¤¤à¤°à¤£"},
    //         ],
    //         answer : "",
    //     },
    //     {
    //         name : "activity_area",
    //         question_id : 20,
    //         question_english : "If there is any other area or activity you want to involve with the social media team (not mentioned in the previous options), please let us know.",
    //         question_hindi : "à¤¯à¤¦à¤¿ à¤•à¥‹à¤ˆ à¤…à¤¨à¥à¤¯ à¤•à¥à¤·à¥‡à¤¤à¥à¤° à¤¯à¤¾ à¤—à¤¤à¤¿à¤µà¤¿à¤§à¤¿ à¤†à¤ª à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾ à¤Ÿà¥€à¤® (à¤ªà¤¿à¤›à¤²à¥‡ à¤µà¤¿à¤•à¤²à¥à¤ªà¥‹à¤‚ à¤®à¥‡à¤‚ à¤‰à¤²à¥à¤²à¤¿à¤–à¤¿à¤¤ à¤¨à¤¹à¥€à¤‚) à¤•à¥‡ à¤¸à¤¾à¤¥ à¤¶à¤¾à¤®à¤¿à¤² à¤•à¤°à¤¨à¤¾ à¤šà¤¾à¤¹à¤¤à¥‡ à¤¹à¥ˆà¤‚, à¤¤à¥‹ à¤•à¥ƒà¤ªà¤¯à¤¾ à¤¹à¤®à¥‡à¤‚ à¤¬à¤¤à¤¾à¤à¤‚.",
    //         question_type : "text",
    //         is_answered : false,
    //         is_skip : false,
    //         answers : [
    //             // {"answer_id":"1","answer_english":"Training","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
    //             // {"answer_id":"2","answer_english":"Research","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
    //             // {"answer_id":"3","answer_english":"Content (writing)","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
    //             // {"answer_id":"4","answer_english":"Content Creation","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
    //             // {"answer_id":"5","answer_english":"Outreach/ Team Development","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
    //             // {"answer_id":"5","answer_english":"Content Distribution","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
    //         ],
    //         answer : "",
    //     },
    //     {
    //         name : "social_media_platforms",
    //         question_id : 21,
    //         question_english : "Which of these social media platforms are you more active on? Mention the top three.",
    //         question_hindi : "à¤†à¤ª à¤‡à¤¨à¤®à¥‡à¤‚ à¤¸à¥‡ à¤•à¤¿à¤¸ à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾ à¤ªà¥à¤²à¥‡à¤Ÿà¤«à¥‰à¤°à¥à¤® à¤ªà¤° à¤œà¥à¤¯à¤¾à¤¦à¤¾ à¤¸à¤•à¥à¤°à¤¿à¤¯ à¤¹à¥ˆà¤‚? à¤¶à¥€à¤°à¥à¤· à¤¤à¥€à¤¨ à¤•à¤¾ à¤‰à¤²à¥à¤²à¥‡à¤– à¤•à¤°à¥‡à¤‚.",
    //         question_type : "checkbox",
    //         max_check : 3,
    //         is_answered : false,
    //         is_skip : false,
    //         answers : [
    //             {"answer_id":"1","answer_english":"WhatsApp","answer_hindi":"à¤µà¥à¤¹à¤¾à¤Ÿà¥à¤¸à¤à¤ª"},
    //             {"answer_id":"2","answer_english":"Facebook","answer_hindi":"à¤«à¥‡à¤¸à¤¬à¥à¤•"},
    //             {"answer_id":"3","answer_english":"Twitter","answer_hindi":"à¤Ÿà¥à¤µà¤¿à¤Ÿà¤°"},
    //             {"answer_id":"4","answer_english":"YouTube","answer_hindi":"à¤¯à¥‚à¤Ÿà¥à¤¯à¥‚à¤¬"},
    //             {"answer_id":"5","answer_english":"Instagram","answer_hindi":"à¤‡à¤‚à¤¸à¥à¤Ÿà¤¾à¤—à¥à¤°à¤¾à¤®"},
    //             {"answer_id":"5","answer_english":"Other","answer_hindi":"à¤…à¤¨à¥à¤¯"},
    //         ],
    //         answer : "",
    //     },
    //     {
    //         name : "social_media_platform_links",
    //         question_id : 22,
    //         question_english : "Please provide your most active social media handle link on your top three platforms (how to link)",
    //         question_hindi : "à¤•à¥ƒà¤ªà¤¯à¤¾ à¤…à¤ªà¤¨à¥‡ à¤¶à¥€à¤°à¥à¤· à¤¤à¥€à¤¨ à¤ªà¥à¤²à¥‡à¤Ÿà¤«à¤¾à¤°à¥à¤®à¥‹à¤‚ à¤ªà¤° à¤…à¤ªà¤¨à¥‡ à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾ à¤†à¤ˆà¤¡à¥€ à¤•à¥‡ à¤²à¤¿à¤‚à¤• à¤ªà¥à¤°à¤¦à¤¾à¤¨ à¤•à¤°à¥‡à¤‚ ( à¤²à¤¿à¤‚à¤• à¤•à¥ˆà¤¸à¥‡ à¤¦à¥‡à¤‚",
    //         question_type : "text",
    //         is_answered : false,
    //         is_skip : false,
    //         answers : [
    //             // {"answer_id":"1","answer_english":"Training","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
    //             // {"answer_id":"2","answer_english":"Research","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
    //             // {"answer_id":"3","answer_english":"Content (writing)","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
    //             // {"answer_id":"4","answer_english":"Content Creation","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
    //             // {"answer_id":"5","answer_english":"Outreach/ Team Development","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
    //             // {"answer_id":"5","answer_english":"Content Distribution","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
    //         ],
    //         answer : "",
    //     },
    //     {
    //         name : "email",
    //         question_id : 23,
    //         question_english : "Write your email address",
    //         question_hindi : "à¤†à¤ªà¤•à¤¾ à¤ˆà¤®à¥‡à¤² à¤à¤¡à¥à¤°à¥‡à¤¸ à¤²à¤¿à¤–à¥‡à¤‚",
    //         question_type : "text",
    //         is_answered : false,
    //         is_skip : false,
    //         answers : [
    //             // {"answer_id":"1","answer_english":"Training","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
    //             // {"answer_id":"2","answer_english":"Research","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
    //             // {"answer_id":"3","answer_english":"Content (writing)","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
    //             // {"answer_id":"4","answer_english":"Content Creation","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
    //             // {"answer_id":"5","answer_english":"Outreach/ Team Development","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
    //             // {"answer_id":"5","answer_english":"Content Distribution","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
    //         ],
    //         answer : "",
    //     },
    //     {
    //         name : "thankyou",
    //         question_id : 24,
    //         question_english : "Thank you for your response. We will contact you soon! <br /><br /> Please send this link to your colleagues and give them an opportunity to join this campaign. Jai Hind !",
    //         question_hindi : "à¤†à¤ªà¤•à¥€ à¤ªà¥à¤°à¤¤à¤¿à¤•à¥à¤°à¤¿à¤¯à¤¾ à¤•à¥‡ à¤²à¤¿à¤ à¤†à¤ªà¤•à¤¾ à¤§à¤¨à¥à¤¯à¤µà¤¾à¤¦à¥¤ à¤¹à¤® à¤¶à¥€à¤˜à¥à¤° à¤¹à¥€ à¤†à¤ªà¤¸à¥‡ à¤¸à¤‚à¤ªà¤°à¥à¤• à¤•à¤°à¥‡à¤‚à¤—à¥‡! <br /><br /> à¤•à¥ƒà¤ªà¤¯à¤¾ à¤…à¤ªà¤¨à¥‡ à¤¸à¤¾à¤¥à¤¿à¤¯à¥‹à¤‚ à¤•à¥‹ à¤¯à¤¹ à¤²à¤¿à¤‚à¤• à¤­à¥‡à¤œ à¤•à¤° à¤‰à¤¨à¤•à¥‹ à¤­à¥€ à¤‡à¤¸ à¤…à¤­à¤¿à¤¯à¤¾à¤¨ à¤¸à¥‡ à¤œà¥à¤¡à¤¨à¥‡ à¤•à¤¾ à¤…à¤µà¤¸à¤° à¤¦à¥‡à¤‚à¥¤ à¤œà¤¯ à¤¹à¤¿à¤¨à¥à¤¦ !",
    //         question_type : "none",
    //         is_answered : false,
    //         is_skip : false,
    //         answers : [
    //             // {"answer_id":"1","answer_english":"Training","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
    //             // {"answer_id":"2","answer_english":"Research","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
    //             // {"answer_id":"3","answer_english":"Content (writing)","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
    //             // {"answer_id":"4","answer_english":"Content Creation","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
    //             // {"answer_id":"5","answer_english":"Outreach/ Team Development","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
    //             // {"answer_id":"5","answer_english":"Content Distribution","answer_hindi":"à¤…à¤‚à¤¡à¤®à¤¾à¤¨ à¤¨à¤¿à¤•à¥‹à¤¬à¤¾à¤°"},
    //         ],
    //         answer : "",
    //     },
    // ] 

    // $rootScope.$storage.registrationObj = {
    //     name : "",
    //     user_id : "",
    // }


    $scope.selectedStateObj = {};
    $scope.selectedStateObj.state_id = "";

    $scope.selectedDistrictObj = {};
    $scope.selectedDistrictObj.district_id = "";

    $scope.selectedObject = {};

    $scope.selectedObject.answer = {}

    $scope.selectedObject.answer[7] = "";

    //$rootScope.$storage.defaultNumber = 0;

    $scope.errorMessage = "";
    $scope.isError = false;

    $scope.answerChecks = {};

    $scope.submitChecks = function (question, answer, flag){

        if(!$scope.answerChecks[question.question_id]){
            $scope.answerChecks[question.question_id] = [];
        } 

        if(question.is_answered == false && answer != '' && $scope.answerChecks[question.question_id].indexOf(answer) < 0){

            $scope.answerChecks[question.question_id].push(answer);

            if($scope.answerChecks[question.question_id].length > question.max_check){
                $scope.answerChecks[question.question_id].splice(0, 1); 
            }

            $rootScope.$storage.currentAnswerObj.answer = $scope.answerChecks[question.question_id].join(",");
            // rootScope.storage.log($scope.currentAnswerObj.answer);
            $rootScope.storage.log($scope.currentAnswerObj.answer, "answer");

        }
        // console.log($scope.answerChecks, "answer checks");

    }

    $scope.resendOTP = function(){
        $http({
          method: 'POST',
          url: apiUrl + 'services/workerOtp',
          data : {
             mobile : $rootScope.$storage.registrationObj.mobile,
             name : $rootScope.$storage.registrationObj.name
          }
        }).then(function successCallback(response) {
            $scope.jc_expire_second = 120;
            response = response.data;
        }, function errorCallback(response) {
        });
    }

    $scope.submitSelection = function(question, answer, flag){

        // var question = $rootScope.$storage.chat_messages.filter(function(item) { if(item.question_id == questionRef.question_id) { return item } })[0];
        // console.log(question);  
        if(question.is_answered == false && answer != ''){

            if(question.name == "mobile"){
                if(answer.length != 10){

                    if($rootScope.$storage.language == "English"){
                        $scope.errorMessage = "Please enter a valid 10 digit number!";
                    }
                    else{
                        $scope.errorMessage = "à¤•à¥ƒà¤ªà¤¯à¤¾ 10 à¤…à¤‚à¤•à¥‹à¤‚ à¤•à¥€ à¤®à¤¾à¤¨à¥à¤¯ à¤¸à¤‚à¤–à¥à¤¯à¤¾ à¤¦à¤°à¥à¤œ à¤•à¤°à¥‡à¤‚!"; 
                    }

                    $scope.isError = true;
                    $timeout(function() {
                        $scope.isError = false;
                    }, 2000);
                    return false;
                }
            }

            if(question.name == "pincode"){
                if(answer.length != 6){
                    if($rootScope.$storage.language == "English"){
                        $scope.errorMessage = "Please enter a valid 6 digit Pincode!";
                    }
                    else{
                        $scope.errorMessage = "à¤•à¥ƒà¤ªà¤¯à¤¾ à¤à¤• à¤®à¤¾à¤¨à¥à¤¯ 6 à¤…à¤‚à¤• à¤ªà¤¿à¤¨ à¤•à¥‹à¤¡ à¤¦à¤°à¥à¤œ à¤•à¤°à¥‡à¤‚!"; 
                    }
                    $scope.isError = true;
                    $timeout(function() {
                        $scope.isError = false;
                    }, 2000);
                    return false;
                }
            }

            if(question.name == "otp"){
                if(answer.length != 6){
                    if($rootScope.$storage.language == "English"){
                        $scope.errorMessage = "Please enter a valid 6 digit OTP!";
                    }
                    else{
                        $scope.errorMessage = "à¤•à¥ƒà¤ªà¤¯à¤¾ à¤à¤• à¤®à¤¾à¤¨à¥à¤¯ 6 à¤…à¤‚à¤• OTP à¤¦à¤°à¥à¤œ à¤•à¤°à¥‡à¤‚!"; 
                    }
                    $scope.isError = true;
                    $timeout(function() {
                        $scope.isError = false;
                    }, 2000);
                    return false;
                }
            }

            if(question.name == "email"){
                var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
                if (!testEmail.test(answer)){
                    if($rootScope.$storage.language == "English"){
                        $scope.errorMessage = "Please enter a valid email address!";
                    } else {
                        $scope.errorMessage = "à¤•à¥ƒà¤ªà¤¯à¤¾ à¤à¤• à¤®à¤¾à¤¨à¥à¤¯ à¤ˆ - à¤®à¥‡à¤² à¤à¤¡à¥à¤°à¥‡à¤¸ à¤¡à¤¾à¤²à¥‡à¤‚!"; 
                    }
                    $scope.isError = true;
                    $timeout(function() {
                        $scope.isError = false;
                    }, 2000);
                    return false;
                }
            }

            if(question.name == "state_id"){
                console.log("1");
                angular.forEach($scope.states, function(value, key){

                    if(value.answer_id == answer){

                        if($rootScope.$storage.language == "English"){
                            $rootScope.$storage.chat_messages[$rootScope.$storage.defaultNumber].answer = value.answer_english;
                        }
                        else{
                            $rootScope.$storage.chat_messages[$rootScope.$storage.defaultNumber].answer = value.answer_hindi;
                        }

                    }
                })
            }
            else if(question.name == "district_id"){
                console.log("2");
                angular.forEach($scope.districts, function(value, key){

                    console.log(value.answer_id, "answer id");
                    console.log(answer, "answer");
                    if(value.answer_id == answer){


                        if($rootScope.$storage.language == "English"){
                            $rootScope.$storage.chat_messages[$rootScope.$storage.defaultNumber].answer = value.answer_english;
                        }
                        else{
                            $rootScope.$storage.chat_messages[$rootScope.$storage.defaultNumber].answer = value.answer_hindi;
                        }

                    }
                })
            }
            else{
                // question.answer = answer;

                // console.log($rootScope.$storage.chat_messages, "question");
                // console.log(question, "question");

                // angular.forEach($rootScope.$storage.chat_messages, function(value, key){
                //     if(value.question_id == question.question_id){
                //         console.log(key , "keyt");
                //         console.log($rootScope.$storage.defaultNumber, "default")
                //     }
                // })
                $rootScope.$storage.chat_messages[$rootScope.$storage.defaultNumber].answer = answer;
            }

            

            console.log(question , "question");

            question.is_answered = true;


            $rootScope.$storage.currentQuestion = question;

            console.log($rootScope.$storage.currentQuestion, "current question");

            if($rootScope.$storage.currentQuestion.question_id == 6){
                // Resed OTP Link

                $scope.jc_expire_second = 120;

                console.log("set timer");

                $interval(function() {
                    if ($scope.jc_expire_second > 0) {
                        $scope.jc_expire_second -= 1;
                    }
                }, 1000);

                // <div class="text-center  whitecolor " style="margin: 40px auto 10px;">
                //     <p class="active_color font_14">Dont receive the OTP? <a class="yellow_font inter_bold" style="cursor: pointer;" ng-click="resendOTP()"><b style="color:#28ace2;">RESEND OTP</b></a></p></div>

            }

            var addition = 1;

            if(question.name == "language"){
                addition = 2;

                if(answer == "English"){
                    $rootScope.$storage.language = "English";
                }
                else{
                    $rootScope.$storage.language = "Hindi";
                }

            }

            if(question.name == "social_media_platforms"){
                console.log(answer, "answer");
                console.log(answer.indexOf("Other"), "other index");
                if(answer.indexOf("Other") > -1 || answer.indexOf("à¤…à¤¨à¥à¤¯") > -1){
                    console.log("here");
                }
                else{
                    addition = 2;
                    angular.forEach($rootScope.$storage.chat_messages, function (value, key){
                        if(value.name == "social_media_platforms_other"){
                            $rootScope.$storage.chat_messages[key].is_skip = true;
                            console.log("there");
                        }

                        console.log("there 2")
                    });     
                }
            }

            if(question.name == "is_above_18"){
                if(answer == "Yes" || answer == "à¤¹à¤¾à¤"){
                    addition = 2;
                    angular.forEach($rootScope.$storage.chat_messages, function (value, key){
                        if(value.name == "age_false"){
                            $rootScope.$storage.chat_messages[key].is_skip = true;
                        }
                    });     
                }
            }

            if(question.name == "inside_india"){
                if(answer == "Inside India" || answer == "à¤­à¤¾à¤°à¤¤ à¤®à¥‡à¤‚"){
                    addition = 2;
                    angular.forEach($rootScope.$storage.chat_messages, function (value, key){
                        if(value.name == "not_in_india"){
                            $rootScope.$storage.chat_messages[key].is_skip = true;
                        }
                    });     
                }
            }

            if(question.name == "is_whatsapp"){
                if(answer == "Yes" || answer == "à¤¹à¤¾à¤"){
                    addition = 2;
                    angular.forEach($rootScope.$storage.chat_messages, function (value, key){
                        if(value.name == "whatsapp_number"){
                            $rootScope.$storage.chat_messages[key].is_skip = true;
                        }
                    })
                    $rootScope.$storage.registrationObj['whatsapp_number'] = $rootScope.$storage.registrationObj['mobile'];
                }
            }


            if(question.name == "mobile"){

                $rootScope.$storage.currentAnswerObj.answer = "";

                $http({
                  method: 'POST',
                  url: apiUrl + 'services/workerOtp',
                  data : {
                     mobile : answer,
                     name : $rootScope.$storage.registrationObj.name
                  }
                }).then(function successCallback(response) {
                    response = response.data;
                    if(response.success == 1){    

                        addition = 2;

                        angular.forEach($rootScope.$storage.chat_messages, function (value, key){
                            if(value.name == "already_registered"){
                                $rootScope.$storage.chat_messages[key].is_skip = true;
                            }
                        })

                        $rootScope.$storage.currentQuestion = $rootScope.$storage.chat_messages[$rootScope.$storage.defaultNumber + addition];
                        $rootScope.$storage.defaultNumber += addition;
                        $rootScope.$storage.registrationObj[question.name] = answer;
                        $rootScope.$storage.currentAnswerObj.answer = ""; 
                        $scope.scrolltoBottom();
                    }
                    else if(response.success == 2){

                        $rootScope.$storage.currentQuestion = $rootScope.$storage.chat_messages[$rootScope.$storage.defaultNumber + addition];
                        $rootScope.$storage.defaultNumber += addition;
                        $rootScope.$storage.registrationObj[question.name] = answer;
                        $rootScope.$storage.currentAnswerObj.answer = "";
                        $scope.scrolltoBottom();

                    }

                    $scope.isLoading = false;
                }, function errorCallback(response) {
                });
            }
            else if(question.name == "otp"){

                $rootScope.$storage.currentAnswerObj.answer = "";

                $http({
                  method: 'POST',
                  url: apiUrl + 'services/verify_otp',
                  data : {
                     mobile : $rootScope.$storage.registrationObj.mobile,
                     name : $rootScope.$storage.registrationObj.name,
                     code : answer
                  }
                }).then(function successCallback(response) {
                    response = response.data;
                    if(response.success == 1){    

                        addition = 2;

                        angular.forEach($rootScope.$storage.chat_messages, function (value, key){
                            if(value.name == "verify_otp"){
                                $rootScope.$storage.chat_messages[key].is_skip = true;
                                $rootScope.$storage.registrationObj.user_id = response.user_id
                            }
                        })

                        $rootScope.$storage.currentQuestion = $rootScope.$storage.chat_messages[$rootScope.$storage.defaultNumber + addition];
                        $rootScope.$storage.defaultNumber += addition;
                        $rootScope.$storage.registrationObj[question.name] = answer;
                        $rootScope.$storage.currentAnswerObj.answer = ""; 
                        $scope.scrolltoBottom();
                    }
                    else{

                        question.is_answered = false;
                        if($rootScope.$storage.language == "English"){
                            $scope.errorMessage = "Incorrect OTP, Please try again!";
                        }
                        else{
                            $scope.errorMessage = "à¤—à¤²à¤¤ OTP, à¤•à¥ƒà¤ªà¤¯à¤¾ à¤ªà¥à¤¨à¤ƒ à¤ªà¥à¤°à¤¯à¤¾à¤¸ à¤•à¤°à¥‡à¤‚!!"; 
                        }

                        $scope.isError = true;
                        $timeout(function() {
                            $scope.isError = false;
                        }, 2000);
                        return false;

                        // $rootScope.$storage.currentQuestion = $rootScope.$storage.chat_messages[$rootScope.$storage.defaultNumber + addition];
                        // $rootScope.$storage.defaultNumber += addition;
                        // $rootScope.$storage.registrationObj[question.name] = answer;
                        // $rootScope.$storage.currentAnswerObj.answer = "";
                        // $scope.scrolltoBottom();
                    }

                    $scope.isLoading = false;
                }, function errorCallback(response) {
                });
            }
            else if(question.name == "email"){

                $rootScope.$storage.currentQuestion = $rootScope.$storage.chat_messages[$rootScope.$storage.defaultNumber + addition];
                $rootScope.$storage.defaultNumber += addition;
                $rootScope.$storage.registrationObj[question.name] = answer;
                $rootScope.$storage.currentAnswerObj.answer = "";
                $scope.scrolltoBottom();

                
            }
            else{
                $rootScope.$storage.currentQuestion = $rootScope.$storage.chat_messages[$rootScope.$storage.defaultNumber + addition];
                $rootScope.$storage.defaultNumber += addition;
                $rootScope.$storage.registrationObj[question.name] = answer;
                $rootScope.$storage.currentAnswerObj.answer = "";

                $scope.scrolltoBottom();
            }


            if(question.question_id > 9){
                $scope.updateUserData();
            }
        }

    }

    $scope.updateUserData = function(){

        if($routeParams.ref_user){
            $rootScope.$storage.registrationObj.ref_user_id = $routeParams.ref_user;
        }

        $http({
          method: 'POST',
          url: apiUrl + 'services/update_user',
          data : $rootScope.$storage.registrationObj,
        }).then(function successCallback(response) {
            
        }, function errorCallback(response) {
        });
    }

})

