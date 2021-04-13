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
        templateUrl: "templates/full-chat-form.html?ver=17-02-2021",
        controller: 'fullchatFormController',
        title: "Indian National Congress Social Media",
        parent_title: "",
    })

    $routeProvider.when("/referral/:ref_user", {
        templateUrl: "templates/full-chat-form.html?ver=17-02-2021",
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
        authorization : "",
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
                    answer_english : "हिंदी",  
                    answer_hindi : "हिंदी",  
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
                    answer_english : "हिंदी",  
                    answer_hindi : "हिंदी",  
                }
            ],
            is_answered : false,
            answer : "",
        },
        {
            name : "intro",
            question_id : 2,
            question_english : "Welcome to the Social Media Warrior campaign of the Indian National Congress! <br /><br /> Under this campaign, INC Social Media team will be expanded at every village, city, state and national level in the country! <br /><br /> If you too believe in the ideology of the Congress party and want to contribute to the nation building, then let us be a part of the Congress Social Media Team! <br /><br /> You will be given responsibility at national, state or district level according to your qualifications and compatibility. <br /><br /> Let us join hands and fulfill our obligation to protect our democracy and build a modern India by being part of the world'\s largest democratic movement. <br /><br /> Please provide the following information that will help in giving you the corresponding responsibility! <br /><br /> Thank you ! <br /><br /> <iframe width='100%' height='315' src='https://www.youtube.com/embed/E7gWc7d0tOE' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>",
            question_hindi : "भारतीय राष्ट्रीय कांग्रेस के Social Media Warrior अभियान में आपका स्वागत है। <br /><br /> इस अभियान के तहत देश के हर गांव, शहर, राज्य और राष्ट्रीय स्तर पर INC Social Media टीम का विस्तार किया जाएगा। <br /><br /> अगर आप भी कांग्रेस की विचारधारा में विश्वास रखते हैं और राष्ट्रनिर्माण में अपना योगदान देना चाहते हैं तो आइए कांग्रेस सोशल मीडिया टीम का हिस्सा बनिए। <br /><br /> आपकी योग्यता और क्षमता के अनुसार आपको राष्ट्रीय, राज्य या जिला स्तर पर जिम्मेदारी दी जाएगी। <br /><br /> आइए हाथ से हाथ मिलाएं और विश्व के सबसे बडे लोकतांत्रिक आंदोलन का हिस्सा बन कर हमारे लोकतंत्र की रक्षा और आधुनिक भारत के निर्माण का हमारा दायित्व पूरा करें। <br /><br /> कृपया निम्न जानकारी दें जिससे आपके अनुरूप जिम्मेदारी देने में सहायता मिले। <br /><br /> धन्यवाद  <iframe width='100%' height='315' src='https://www.youtube.com/embed/ju1yZKzapnw' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>", 
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
            question_hindi : "कृपया आपका नाम और उपनाम लिखें",
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
            question_hindi : "आपका फोन नंबर?",
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
            question_hindi : "आपका मोबाइल नंबर पहले से पंजीकृत है। धन्यवाद।",
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
            question_hindi : "आपको एक OTP प्राप्त हुआ होगा। कृपया OTP टाइप करें",
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
            question_hindi : "वैरिफिकेशन कोड गलत है.",
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
            question_hindi : "क्या यह आपका व्हाट्सएप नंबर भी है?",
            question_type : "option",
            is_skip : false,
            is_answered : false,
            answers : [
                {
                    answer_id : "1",
                    answer_english : "Yes",
                    answer_hindi : "हाँ",
                },
                {
                    answer_id : "2",
                    answer_english : "No",  
                    answer_hindi : "नहीं",  
                }
            ],
            answer : "",
        },
        {
            name : "whatsapp_number",
            question_id : 11,
            question_english : "What is your WhatsApp number?",
            question_hindi : "आपका व्हाट्सएप नंबर क्या है?",
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
            question_hindi : "आप किस राज्य या केंद्र शासित प्रदेश से हैं?",
            question_type : "selection",
            is_answered : false,
            is_skip : false,
            answers : [
                {"answer_id":"2","answer_english":"Andaman and Nicobar","answer_hindi":"अण्डमान और निकोबार"},
                {"answer_id":"1","answer_english":"Andhra Pradesh","answer_hindi":"आंध्र प्रदेश"},
                {"answer_id":"3","answer_english":"Arunachal Pradesh","answer_hindi":"अरुणाचल प्रदेश"},
                {"answer_id":"4","answer_english":"Assam","answer_hindi":"असम"},
                {"answer_id":"5","answer_english":"Bihar","answer_hindi":"बिहार"},
                {"answer_id":"6","answer_english":"Chandigarh","answer_hindi":"चण्डीगढ़"},
                {"answer_id":"7","answer_english":"Chhattisgarh","answer_hindi":"छत्तीसगढ़"},
                {"answer_id":"8","answer_english":"Dadra and Nagar Haveli and Daman and Diu","answer_hindi":"दादरा नगर हवेली और दमन और दीव"},
                {"answer_id":"9","answer_english":"Delhi","answer_hindi":"दिल्ली"},
                {"answer_id":"10","answer_english":"Goa","answer_hindi":"गोवा"},
                {"answer_id":"11","answer_english":"Gujarat","answer_hindi":"गुजरात"},
                {"answer_id":"12","answer_english":"Haryana","answer_hindi":"हरियाणा"},
                {"answer_id":"13","answer_english":"Himachal Pradesh","answer_hindi":"हिमाचल प्रदेश"},
                {"answer_id":"14","answer_english":"Jammu and Kashmir","answer_hindi":"जम्मू कश्मीर"},
                {"answer_id":"15","answer_english":"Jharkhand","answer_hindi":"झारखण्ड"},
                {"answer_id":"16","answer_english":"Karnataka","answer_hindi":"कर्नाटक"},
                {"answer_id":"17","answer_english":"Kerala","answer_hindi":"केरल"},
                {"answer_id":"18","answer_english":"Ladakh","answer_hindi":"लद्दाख"},
                {"answer_id":"19","answer_english":"Lakshadweep","answer_hindi":"लक्षद्वीप"},
                {"answer_id":"20","answer_english":"Madhya Pradesh","answer_hindi":"मध्यप्रदेश"},
                {"answer_id":"21","answer_english":"Maharastra","answer_hindi":"महाराष्ट्र"},
                {"answer_id":"22","answer_english":"Manipur","answer_hindi":"मणिपुर"},
                {"answer_id":"23","answer_english":"Meghalaya","answer_hindi":"मेघालय"},
                {"answer_id":"24","answer_english":"Mizoram","answer_hindi":"मिज़ोरम"},
                {"answer_id":"25","answer_english":"Nagaland","answer_hindi":"नागालैण्ड"},
                {"answer_id":"26","answer_english":"Odisha","answer_hindi":"ओड़िशा"},
                {"answer_id":"27","answer_english":"Puducherry","answer_hindi":"पुदुचेरी"},
                {"answer_id":"28","answer_english":"Punjab","answer_hindi":"पंजाब"},
                {"answer_id":"29","answer_english":"Rajasthan","answer_hindi":"राजस्थान"},
                {"answer_id":"30","answer_english":"Sikkim","answer_hindi":"सिक्किम"},
                {"answer_id":"31","answer_english":"Tamil Nadu","answer_hindi":"तमिलनाडु"},
                {"answer_id":"32","answer_english":"Telangana","answer_hindi":"तेलंगाना"},
                {"answer_id":"33","answer_english":"Tripura","answer_hindi":"त्रिपुरा"},
                {"answer_id":"34","answer_english":"Uttar Pradesh","answer_hindi":"उत्तर प्रदेश"},
                {"answer_id":"35","answer_english":"Uttarakhand","answer_hindi":"उत्तराखण्ड"},
                {"answer_id":"36","answer_english":"West Bengal","answer_hindi":"पश्चिम बंगाल"}
            ],
            answer : "",
        },
        {
            name : "district_id",
            question_id : 13,
            question_english : "Which district are you from?",
            question_hindi : "आप किस जिले से हैं",
            question_type : "selection",
            is_answered : false,
            is_parent_check : true,
            is_skip : false,
            answers :[
               {"answer_id":"590","answer_english":"Adilabad","answer_hindi":"आदिलाबाद","parent_id":"32"},
{"answer_id":"363","answer_english":"Agar Malwa","answer_hindi":"आगर मालवा","parent_id":"20"},
{"answer_id":"631","answer_english":"Agra","answer_hindi":"आगरा","parent_id":"34"},
{"answer_id":"159","answer_english":"Ahmedabad","answer_hindi":"अहमदाबाद","parent_id":"11"},
{"answer_id":"373","answer_english":"Ahmednagar","answer_hindi":"अहमदनगर","parent_id":"21"},
{"answer_id":"436","answer_english":"Aizawl","answer_hindi":"अइज़ोल","parent_id":"24"},
{"answer_id":"515","answer_english":"Ajmer","answer_hindi":"अजमेर","parent_id":"29"},
{"answer_id":"374","answer_english":"Akola","answer_hindi":"अकोला","parent_id":"21"},
{"answer_id":"301","answer_english":"Alappuzha","answer_hindi":"आलाप्पुड़ा","parent_id":"17"},
{"answer_id":"632","answer_english":"Aligarh","answer_hindi":"अलीगढ","parent_id":"34"},
{"answer_id":"719","answer_english":"Alipurduar","answer_hindi":"अलीपुरद्रार","parent_id":"36"},
{"answer_id":"331","answer_english":"Alirajpur ","answer_hindi":"अलीराजपुर","parent_id":"20"},
{"answer_id":"633","answer_english":"Allahabad","answer_hindi":"इलाहाबाद\/प्रयागराज","parent_id":"34"},
{"answer_id":"706","answer_english":"Almora","answer_hindi":"अल्मोड़ा","parent_id":"35"},
{"answer_id":"516","answer_english":"Alwar","answer_hindi":"अलवर","parent_id":"29"},
{"answer_id":"192","answer_english":"Ambala","answer_hindi":"अम्बाला","parent_id":"12"},
{"answer_id":"634","answer_english":"Ambedkar Nagar","answer_hindi":"अम्बेडकरनगर","parent_id":"34"},
{"answer_id":"635","answer_english":"Amethi","answer_hindi":"अमेठी ","parent_id":"34"},
{"answer_id":"375","answer_english":"Amravati","answer_hindi":"अमरावती","parent_id":"21"},
{"answer_id":"160","answer_english":"Amreli","answer_hindi":"अमरेली","parent_id":"11"},
{"answer_id":"493","answer_english":"Amritsar","answer_hindi":"अमृतसर","parent_id":"28"},
{"answer_id":"636","answer_english":"Amroha","answer_hindi":"अमरोहा ","parent_id":"34"},
{"answer_id":"161","answer_english":"Anand","answer_hindi":"आणंद","parent_id":"11"},
{"answer_id":"1","answer_english":"Anantapur","answer_hindi":"अनंतपुर","parent_id":"1"},
{"answer_id":"226","answer_english":"Anantnag","answer_hindi":"अनन्तनाग","parent_id":"14"},
{"answer_id":"459","answer_english":"Angul","answer_hindi":"अनुगुल","parent_id":"26"},
{"answer_id":"17","answer_english":"Anjaw","answer_hindi":"अंजॉ","parent_id":"3"},
{"answer_id":"360","answer_english":"Anuppur ","answer_hindi":"अनूपपुर","parent_id":"20"},
{"answer_id":"76","answer_english":"Araria","answer_hindi":"अररिया","parent_id":"5"},
{"answer_id":"162","answer_english":"Aravalli","answer_hindi":"अरावली","parent_id":"11"},
{"answer_id":"552","answer_english":"Ariyalur","answer_hindi":"अरियालूर","parent_id":"31"},
{"answer_id":"77","answer_english":"Arwal","answer_hindi":"अरवल","parent_id":"5"},
{"answer_id":"327","answer_english":"Ashoknagar","answer_hindi":"अशोक नगर","parent_id":"20"},
{"answer_id":"637","answer_english":"Auraiya","answer_hindi":"औरैया","parent_id":"34"},
{"answer_id":"78","answer_english":"Aurangabad","answer_hindi":"औरंगाबाद","parent_id":"5"},
{"answer_id":"376","answer_english":"Aurangabad","answer_hindi":"औरंगाबाद","parent_id":"21"},
{"answer_id":"638","answer_english":"Azamgarh","answer_hindi":"आजमगढ","parent_id":"34"},
{"answer_id":"270","answer_english":"Bagalkot","answer_hindi":"बागलकोट","parent_id":"16"},
{"answer_id":"707","answer_english":"Bageshwar","answer_hindi":"बागेश्वर","parent_id":"35"},
{"answer_id":"639","answer_english":"Bagpat","answer_hindi":"बागपत ","parent_id":"34"},
{"answer_id":"640","answer_english":"Bahraich","answer_hindi":"बहराइच","parent_id":"34"},
{"answer_id":"43","answer_english":"Bajali","answer_hindi":"बजाली","parent_id":"4"},
{"answer_id":"42","answer_english":"Baksa","answer_hindi":"बक्सा","parent_id":"4"},
{"answer_id":"339","answer_english":"Balaghat ","answer_hindi":"बालाघाट","parent_id":"20"},
{"answer_id":"461","answer_english":"Balangir","answer_hindi":"बलांगिर","parent_id":"26"},
{"answer_id":"641","answer_english":"Balarampur","answer_hindi":"बलरामपुर","parent_id":"34"},
{"answer_id":"463","answer_english":"Balasore","answer_hindi":"बालेश्वर","parent_id":"26"},
{"answer_id":"642","answer_english":"Ballia","answer_hindi":"बलिया","parent_id":"34"},
{"answer_id":"115","answer_english":"Balod","answer_hindi":"बालोद","parent_id":"7"},
{"answer_id":"116","answer_english":"Baloda Bazar","answer_hindi":"बलौदा बाजार","parent_id":"7"},
{"answer_id":"117","answer_english":"Balrampur","answer_hindi":"बलरामपुर","parent_id":"7"},
{"answer_id":"163","answer_english":"Banaskantha","answer_hindi":"बनासकांठा","parent_id":"11"},
{"answer_id":"643","answer_english":"Banda","answer_hindi":"बाँदा","parent_id":"34"},
{"answer_id":"228","answer_english":"Bandipora","answer_hindi":"बांदीपुरा","parent_id":"14"},
{"answer_id":"272","answer_english":"Bangalore Rural","answer_hindi":"बंगलोर ग्रामीण","parent_id":"16"},
{"answer_id":"271","answer_english":"Bangalore Urban","answer_hindi":"बंगलोर शहरी","parent_id":"16"},
{"answer_id":"79","answer_english":"Banka","answer_hindi":"बाँका","parent_id":"5"},
{"answer_id":"720","answer_english":"Bankura","answer_hindi":"बाँकुड़ा","parent_id":"36"},
{"answer_id":"519","answer_english":"Banswara","answer_hindi":"बांसवाड़ा","parent_id":"29"},
{"answer_id":"644","answer_english":"Barabanki","answer_hindi":"बाराबंकी","parent_id":"34"},
{"answer_id":"229","answer_english":"Baramulla","answer_hindi":"बारामूला","parent_id":"14"},
{"answer_id":"521","answer_english":"Baran","answer_hindi":"बारां","parent_id":"29"},
{"answer_id":"645","answer_english":"Bareilly","answer_hindi":"बरेली","parent_id":"34"},
{"answer_id":"462","answer_english":"Bargarh","answer_hindi":"बरगढ़","parent_id":"26"},
{"answer_id":"518","answer_english":"Barmer","answer_hindi":"बाड़मेर","parent_id":"29"},
{"answer_id":"494","answer_english":"Barnala","answer_hindi":"बरनाला","parent_id":"28"},
{"answer_id":"44","answer_english":"Barpeta","answer_hindi":"बारपेटा","parent_id":"4"},
{"answer_id":"332","answer_english":"Barwani ","answer_hindi":"बड़वानी","parent_id":"20"},
{"answer_id":"118","answer_english":"Bastar","answer_hindi":"बस्तर","parent_id":"7"},
{"answer_id":"646","answer_english":"Basti","answer_hindi":"बस्ती","parent_id":"34"},
{"answer_id":"495","answer_english":"Bathinda","answer_hindi":"भटिण्डा","parent_id":"28"},
{"answer_id":"377","answer_english":"Beed","answer_hindi":"बीड","parent_id":"21"},
{"answer_id":"80","answer_english":"Begusarai","answer_hindi":"बेगूसराय","parent_id":"5"},
{"answer_id":"273","answer_english":"Belgaum","answer_hindi":"बेलगाम","parent_id":"16"},
{"answer_id":"274","answer_english":"Bellary","answer_hindi":"बेल्लारी","parent_id":"16"},
{"answer_id":"119","answer_english":"Bemetara","answer_hindi":"बेमेतरा","parent_id":"7"},
{"answer_id":"347","answer_english":"Betul ","answer_hindi":"बैतूल","parent_id":"20"},
{"answer_id":"647","answer_english":"Bhadohi","answer_hindi":"भदोही ","parent_id":"34"},
{"answer_id":"592","answer_english":"Bhadradri Kothagudem","answer_hindi":"भद्राद्री कोठागुडम","parent_id":"32"},
{"answer_id":"464","answer_english":"Bhadrak","answer_hindi":"भद्रक","parent_id":"26"},
{"answer_id":"81","answer_english":"Bhagalpur","answer_hindi":"भागलपुर","parent_id":"5"},
{"answer_id":"378","answer_english":"Bhandara","answer_hindi":"भंडारा","parent_id":"21"},
{"answer_id":"520","answer_english":"Bharatpur","answer_hindi":"भरतपुर","parent_id":"29"},
{"answer_id":"164","answer_english":"Bharuch","answer_hindi":"भरुच","parent_id":"11"},
{"answer_id":"165","answer_english":"Bhavnagar","answer_hindi":"भावनगर","parent_id":"11"},
{"answer_id":"523","answer_english":"Bhilwara","answer_hindi":"भीलवाड़ा","parent_id":"29"},
{"answer_id":"325","answer_english":"Bhind ","answer_hindi":"भिंड","parent_id":"20"},
{"answer_id":"193","answer_english":"Bhiwani","answer_hindi":"भिवानी","parent_id":"12"},
{"answer_id":"82","answer_english":"Bhojpur","answer_hindi":"भोजपुर","parent_id":"5"},
{"answer_id":"318","answer_english":"Bhopal ","answer_hindi":"भोपाल","parent_id":"20"},
{"answer_id":"275","answer_english":"Bidar","answer_hindi":"बीदर","parent_id":"16"},
{"answer_id":"276","answer_english":"Bijapur","answer_hindi":"बीजापुर","parent_id":"16"},
{"answer_id":"120","answer_english":"Bijapur","answer_hindi":"बीजापुर","parent_id":"7"},
{"answer_id":"648","answer_english":"Bijnor","answer_hindi":"बिजनौर","parent_id":"34"},
{"answer_id":"517","answer_english":"Bikaner","answer_hindi":"बीकानेर","parent_id":"29"},
{"answer_id":"121","answer_english":"Bilaspur","answer_hindi":"बिलासपुर","parent_id":"7"},
{"answer_id":"214","answer_english":"Bilaspur","answer_hindi":"बिलासपुर","parent_id":"13"},
{"answer_id":"723","answer_english":"Birbhum","answer_hindi":"बीरभूम","parent_id":"36"},
{"answer_id":"409","answer_english":"Bishnupur","answer_hindi":"बिष्णुपुर जिला","parent_id":"22"},
{"answer_id":"45","answer_english":"Biswanath","answer_hindi":"बिश्वनाथ","parent_id":"4"},
{"answer_id":"254","answer_english":"Bokaro","answer_hindi":"बोकारो","parent_id":"15"},
{"answer_id":"46","answer_english":"Bongaigaon","answer_hindi":"बंगाईगाँव","parent_id":"4"},
{"answer_id":"166","answer_english":"Botad","answer_hindi":"बोटाड","parent_id":"11"},
{"answer_id":"460","answer_english":"Boudh","answer_hindi":"बौध","parent_id":"26"},
{"answer_id":"649","answer_english":"Budaun","answer_hindi":"बदायूं ","parent_id":"34"},
{"answer_id":"227","answer_english":"Budgam","answer_hindi":"बड़गांव","parent_id":"14"},
{"answer_id":"650","answer_english":"Bulandshahr","answer_hindi":"बुलंदशहर","parent_id":"34"},
{"answer_id":"379","answer_english":"Buldhana","answer_hindi":"बुलढाणा","parent_id":"21"},
{"answer_id":"522","answer_english":"Bundi","answer_hindi":"बूंदी","parent_id":"29"},
{"answer_id":"333","answer_english":"Burhanpur ","answer_hindi":"बुरहानपुर","parent_id":"20"},
{"answer_id":"83","answer_english":"Buxar","answer_hindi":"बक्सर","parent_id":"5"},
{"answer_id":"47","answer_english":"Cachar","answer_hindi":"कछर","parent_id":"4"},
{"answer_id":"147","answer_english":"Central Delhi ","answer_hindi":"मध्य दिल्ली","parent_id":"9"},
{"answer_id":"370","answer_english":"Chachaura-Binaganj","answer_hindi":"चाचौड़ा","parent_id":"20"},
{"answer_id":"277","answer_english":"Chamarajanagar","answer_hindi":"चामराजनगर","parent_id":"16"},
{"answer_id":"215","answer_english":"Chamba","answer_hindi":"चंबा","parent_id":"13"},
{"answer_id":"708","answer_english":"Chamoli","answer_hindi":"चमोली","parent_id":"35"},
{"answer_id":"709","answer_english":"Champawat","answer_hindi":"चम्पावत","parent_id":"35"},
{"answer_id":"443","answer_english":"Champhai","answer_hindi":"चम्फाई","parent_id":"24"},
{"answer_id":"651","answer_english":"Chandauli","answer_hindi":"चंदौली","parent_id":"34"},
{"answer_id":"415","answer_english":"Chandel","answer_hindi":"चन्डेल जिला","parent_id":"22"},
{"answer_id":"114","answer_english":"Chandigarh ","answer_hindi":"चण्डीगढ़","parent_id":"6"},
{"answer_id":"380","answer_english":"Chandrapur","answer_hindi":"चंद्रपुर","parent_id":"21"},
{"answer_id":"18","answer_english":"Changlang","answer_hindi":"चांगलांग","parent_id":"3"},
{"answer_id":"48","answer_english":"Charaideo","answer_hindi":"चराइदेउ","parent_id":"4"},
{"answer_id":"194","answer_english":"Charkhi Dadri","answer_hindi":"चरखी दादरी","parent_id":"12"},
{"answer_id":"249","answer_english":"Chatra","answer_hindi":"चतरा","parent_id":"15"},
{"answer_id":"553","answer_english":"Chengalpattu","answer_hindi":"चेंगलपट्टु","parent_id":"31"},
{"answer_id":"554","answer_english":"Chennai","answer_hindi":"चेन्नई","parent_id":"31"},
{"answer_id":"354","answer_english":"Chhatarpur ","answer_hindi":"छतरपुर","parent_id":"20"},
{"answer_id":"340","answer_english":"Chhindwara ","answer_hindi":"छिंदवाड़ा","parent_id":"20"},
{"answer_id":"167","answer_english":"Chhota Udaipur","answer_hindi":"छोटा उदयपुर","parent_id":"11"},
{"answer_id":"278","answer_english":"Chikballapur","answer_hindi":"चिकबलापुरा","parent_id":"16"},
{"answer_id":"279","answer_english":"Chikmagalur","answer_hindi":"चिकमगलूर","parent_id":"16"},
{"answer_id":"49","answer_english":"Chirang","answer_hindi":"चिरांग","parent_id":"4"},
{"answer_id":"280","answer_english":"Chitradurga","answer_hindi":"चित्रदुर्ग","parent_id":"16"},
{"answer_id":"652","answer_english":"Chitrakoot","answer_hindi":"चित्रकूट","parent_id":"34"},
{"answer_id":"2","answer_english":"Chittoor","answer_hindi":"चित्तूर","parent_id":"1"},
{"answer_id":"525","answer_english":"Chittorgarh","answer_hindi":"चित्तौड़गढ़","parent_id":"29"},
{"answer_id":"416","answer_english":"Churachandpur","answer_hindi":"चुराचांदपुर जिला","parent_id":"22"},
{"answer_id":"524","answer_english":"Churu","answer_hindi":"चुरु","parent_id":"29"},
{"answer_id":"555","answer_english":"Coimbatore","answer_hindi":"कोयम्बतूर","parent_id":"31"},
{"answer_id":"724","answer_english":"Cooch Behar","answer_hindi":"कूचबिहार","parent_id":"36"},
{"answer_id":"556","answer_english":"Cuddalore","answer_hindi":"कुड्डलोर","parent_id":"31"},
{"answer_id":"465","answer_english":"Cuttack","answer_hindi":"कटक","parent_id":"26"},
{"answer_id":"145","answer_english":"Dadra and Nagar Haveli","answer_hindi":"दादरा नगर हवेली","parent_id":"8"},
{"answer_id":"168","answer_english":"Dahod","answer_hindi":"दाहोद","parent_id":"11"},
{"answer_id":"725","answer_english":"Dakshin Dinajpur","answer_hindi":"दक्षिण दिनाजपुर","parent_id":"36"},
{"answer_id":"281","answer_english":"Dakshina Kannada","answer_hindi":"दक्षिण कन्नड़","parent_id":"16"},
{"answer_id":"143","answer_english":"Daman","answer_hindi":"दमन ","parent_id":"8"},
{"answer_id":"355","answer_english":"Damoh ","answer_hindi":"दमोह","parent_id":"20"},
{"answer_id":"169","answer_english":"Dang","answer_hindi":"डांग","parent_id":"11"},
{"answer_id":"122","answer_english":"Dantewada","answer_hindi":"दन्तेवाड़ा  (दक्षिण बस्तर)","parent_id":"7"},
{"answer_id":"84","answer_english":"Darbhanga","answer_hindi":"दरभंगा","parent_id":"5"},
{"answer_id":"726","answer_english":"Darjeeling","answer_hindi":"दार्जिलिंग","parent_id":"36"},
{"answer_id":"50","answer_english":"Darrang","answer_hindi":"दारांग","parent_id":"4"},
{"answer_id":"329","answer_english":"Datia ","answer_hindi":"दतिया","parent_id":"20"},
{"answer_id":"526","answer_english":"Dausa","answer_hindi":"दौसा","parent_id":"29"},
{"answer_id":"282","answer_english":"Davanagere","answer_hindi":"दावणगेरे","parent_id":"16"},
{"answer_id":"466","answer_english":"Debagarh","answer_hindi":"देवगड़","parent_id":"26"},
{"answer_id":"710","answer_english":"Dehradun","answer_hindi":"देहरादून","parent_id":"35"},
{"answer_id":"265","answer_english":"Deoghar","answer_hindi":"देवघर","parent_id":"15"},
{"answer_id":"653","answer_english":"Deoria","answer_hindi":"देवरिया","parent_id":"34"},
{"answer_id":"170","answer_english":"Devbhoomi Dwarka","answer_hindi":"देवभूमि द्वारका","parent_id":"11"},
{"answer_id":"364","answer_english":"Dewas","answer_hindi":"देवास","parent_id":"20"},
{"answer_id":"623","answer_english":"Dhalai","answer_hindi":"धलाई","parent_id":"33"},
{"answer_id":"123","answer_english":"Dhamtari","answer_hindi":"धमतरी","parent_id":"7"},
{"answer_id":"255","answer_english":"Dhanbad","answer_hindi":"धनबाद","parent_id":"15"},
{"answer_id":"335","answer_english":"Dhar ","answer_hindi":"धार","parent_id":"20"},
{"answer_id":"557","answer_english":"Dharmapuri","answer_hindi":"धर्मपुरी","parent_id":"31"},
{"answer_id":"283","answer_english":"Dharwad","answer_hindi":"धारवाड़","parent_id":"16"},
{"answer_id":"51","answer_english":"Dhemaji","answer_hindi":"धेमाजी","parent_id":"4"},
{"answer_id":"467","answer_english":"Dhenkanal","answer_hindi":"ढेन्कानाल","parent_id":"26"},
{"answer_id":"527","answer_english":"Dholpur","answer_hindi":"धौलपुर","parent_id":"29"},
{"answer_id":"52","answer_english":"Dhubri","answer_hindi":"धुबरी","parent_id":"4"},
{"answer_id":"381","answer_english":"Dhule","answer_hindi":"धुले","parent_id":"21"},
{"answer_id":"53","answer_english":"Dibrugarh","answer_hindi":"डिब्रूगढ़","parent_id":"4"},
{"answer_id":"54","answer_english":"Dima Hasao","answer_hindi":"दिमा हसाओ","parent_id":"4"},
{"answer_id":"447","answer_english":"Dimapur","answer_hindi":"दीमापुर","parent_id":"25"},
{"answer_id":"558","answer_english":"Dindigul","answer_hindi":"डिंडिगुल","parent_id":"31"},
{"answer_id":"346","answer_english":"Dindori ","answer_hindi":"डिंडौरी","parent_id":"20"},
{"answer_id":"144","answer_english":"Diu","answer_hindi":"दीव ","parent_id":"8"},
{"answer_id":"230","answer_english":"Doda","answer_hindi":"डोडा","parent_id":"14"},
{"answer_id":"266","answer_english":"Dumka","answer_hindi":"दुमका","parent_id":"15"},
{"answer_id":"528","answer_english":"Dungarpur","answer_hindi":"डूंगरपुर","parent_id":"29"},
{"answer_id":"124","answer_english":"Durg","answer_hindi":"दुर्ग","parent_id":"7"},
{"answer_id":"85","answer_english":"East Champaran","answer_hindi":"पूर्वी चम्पारण जिला","parent_id":"5"},
{"answer_id":"148","answer_english":"East Delhi","answer_hindi":"पूर्वी दिल्ली","parent_id":"9"},
{"answer_id":"429","answer_english":"East Garo Hills","answer_hindi":"पूर्वी गारो हिल्स","parent_id":"23"},
{"answer_id":"3","answer_english":"East Godavari","answer_hindi":"पूर्व गोदावरी","parent_id":"1"},
{"answer_id":"434","answer_english":"East Jaintia Hills","answer_hindi":"पूर्व जयंतिया हिल्स","parent_id":"23"},
{"answer_id":"19","answer_english":"East Kameng","answer_hindi":"पूर्व कमेंग","parent_id":"3"},
{"answer_id":"425","answer_english":"East Khasi Hills","answer_hindi":"पूर्वी खासी हिल्स","parent_id":"23"},
{"answer_id":"20","answer_english":"East Siang","answer_hindi":"पूर्व सियांग","parent_id":"3"},
{"answer_id":"548","answer_english":"East Sikkim","answer_hindi":"पूर्व सिक्किम","parent_id":"30"},
{"answer_id":"263","answer_english":"East Singhbhum","answer_hindi":"पूर्वी सिंहभूम","parent_id":"15"},
{"answer_id":"302","answer_english":"Ernakulam","answer_hindi":"एर्नाकुलम","parent_id":"17"},
{"answer_id":"559","answer_english":"Erode","answer_hindi":"ईरोड","parent_id":"31"},
{"answer_id":"654","answer_english":"Etah","answer_hindi":"एटा","parent_id":"34"},
{"answer_id":"655","answer_english":"Etawah","answer_hindi":"इटावा","parent_id":"34"},
{"answer_id":"656","answer_english":"Faizabad","answer_hindi":"फैज़ाबाद शहर (अयोध्या)","parent_id":"34"},
{"answer_id":"195","answer_english":"Faridabad","answer_hindi":"फरीदाबाद","parent_id":"12"},
{"answer_id":"497","answer_english":"Faridkot","answer_hindi":"फरीदकोट","parent_id":"28"},
{"answer_id":"657","answer_english":"Farrukhabad","answer_hindi":"फ़र्रूख़ाबाद","parent_id":"34"},
{"answer_id":"196","answer_english":"Fatehabad","answer_hindi":"फतेहाबाद","parent_id":"12"},
{"answer_id":"498","answer_english":"Fatehgarh Sahib","answer_hindi":"फतेहगढ़ साहिब","parent_id":"28"},
{"answer_id":"658","answer_english":"Fatehpur","answer_hindi":"फतेहपुर","parent_id":"34"},
{"answer_id":"499","answer_english":"Fazilka","answer_hindi":"फाज़िल्का ","parent_id":"28"},
{"answer_id":"659","answer_english":"Firozabad","answer_hindi":"फ़िरोजाबाद","parent_id":"34"},
{"answer_id":"496","answer_english":"Firozpur","answer_hindi":"फिरोजपुर","parent_id":"28"},
{"answer_id":"284","answer_english":"Gadag","answer_hindi":"गदग","parent_id":"16"},
{"answer_id":"382","answer_english":"Gadchiroli","answer_hindi":"गडचिरोली","parent_id":"21"},
{"answer_id":"469","answer_english":"Gajapati","answer_hindi":"गजपति","parent_id":"26"},
{"answer_id":"231","answer_english":"Ganderbal","answer_hindi":"गांदरबल","parent_id":"14"},
{"answer_id":"171","answer_english":"Gandhinagar","answer_hindi":"गांधीनगर","parent_id":"11"},
{"answer_id":"529","answer_english":"Ganganagar","answer_hindi":"श्रीगंगानगर","parent_id":"29"},
{"answer_id":"468","answer_english":"Ganjam","answer_hindi":"गंजाम","parent_id":"26"},
{"answer_id":"246","answer_english":"Garhwa","answer_hindi":"गढवा","parent_id":"15"},
{"answer_id":"125","answer_english":"Gariaband","answer_hindi":"गरियाबंद","parent_id":"7"},
{"answer_id":"126","answer_english":"Gaurella-Pendra-Marwahi","answer_hindi":"गौरेला-पेण्ड्रा-मरवाही","parent_id":"7"},
{"answer_id":"660","answer_english":"Gautam Buddha Nagar","answer_hindi":"गौतमबुद्ध नगर","parent_id":"34"},
{"answer_id":"86","answer_english":"Gaya","answer_hindi":"गया","parent_id":"5"},
{"answer_id":"661","answer_english":"Ghaziabad","answer_hindi":"गाजियाबाद","parent_id":"34"},
{"answer_id":"662","answer_english":"Ghazipur","answer_hindi":"ग़ाज़ीपुर","parent_id":"34"},
{"answer_id":"172","answer_english":"Gir Somnath","answer_hindi":"गिर सोमनाथ","parent_id":"11"},
{"answer_id":"252","answer_english":"Giridih","answer_hindi":"गिरीडीह","parent_id":"15"},
{"answer_id":"55","answer_english":"Goalpara","answer_hindi":"गोवालपारा","parent_id":"4"},
{"answer_id":"268","answer_english":"Godda","answer_hindi":"गोड्डा","parent_id":"15"},
{"answer_id":"56","answer_english":"Golaghat","answer_hindi":"गोलाघाट","parent_id":"4"},
{"answer_id":"625","answer_english":"Gomati","answer_hindi":"गोमती","parent_id":"33"},
{"answer_id":"663","answer_english":"Gonda","answer_hindi":"गोंडा","parent_id":"34"},
{"answer_id":"383","answer_english":"Gondia","answer_hindi":"गोंदिया","parent_id":"21"},
{"answer_id":"87","answer_english":"Gopalganj","answer_hindi":"गोपालगंज","parent_id":"5"},
{"answer_id":"664","answer_english":"Gorakhpur","answer_hindi":"गोरखपुर","parent_id":"34"},
{"answer_id":"285","answer_english":"Gulbarga","answer_hindi":"गुलबर्ग","parent_id":"16"},
{"answer_id":"256","answer_english":"Gumla","answer_hindi":"गुमला","parent_id":"15"},
{"answer_id":"330","answer_english":"Guna ","answer_hindi":"गुना","parent_id":"20"},
{"answer_id":"4","answer_english":"Guntur","answer_hindi":"गुंटूर","parent_id":"1"},
{"answer_id":"500","answer_english":"Gurdaspur","answer_hindi":"गुरदासपुर","parent_id":"28"},
{"answer_id":"197","answer_english":"Gurgaon","answer_hindi":"गुरुग्राम","parent_id":"12"},
{"answer_id":"326","answer_english":"Gwalior ","answer_hindi":"ग्वालियर","parent_id":"20"},
{"answer_id":"57","answer_english":"Hailakandi","answer_hindi":"हैलाकांडी","parent_id":"4"},
{"answer_id":"665","answer_english":"Hamirpur","answer_hindi":"हमीरपुर","parent_id":"34"},
{"answer_id":"216","answer_english":"Hamirpur","answer_hindi":"हमीरपुर","parent_id":"13"},
{"answer_id":"530","answer_english":"Hanumangarh","answer_hindi":"हनुमानगढ़","parent_id":"29"},
{"answer_id":"666","answer_english":"Hapur","answer_hindi":"हापुड़","parent_id":"34"},
{"answer_id":"348","answer_english":"Harda ","answer_hindi":"हरदा","parent_id":"20"},
{"answer_id":"667","answer_english":"Hardoi","answer_hindi":"हरदोई","parent_id":"34"},
{"answer_id":"711","answer_english":"Haridwar","answer_hindi":"हरिद्वार","parent_id":"35"},
{"answer_id":"286","answer_english":"Hassan","answer_hindi":"हासन","parent_id":"16"},
{"answer_id":"668","answer_english":"Hathras","answer_hindi":"हाथरस","parent_id":"34"},
{"answer_id":"287","answer_english":"Haveri","answer_hindi":"हावेरी","parent_id":"16"},
{"answer_id":"250","answer_english":"Hazaribagh","answer_hindi":"हजारीबाग","parent_id":"15"},
{"answer_id":"384","answer_english":"Hingoli","answer_hindi":"हिंगोली","parent_id":"21"},
{"answer_id":"198","answer_english":"Hissar","answer_hindi":"हिसार","parent_id":"12"},
{"answer_id":"444","answer_english":"Hnahthial","answer_hindi":"ह्नाहथिआल","parent_id":"24"},
{"answer_id":"58","answer_english":"Hojai","answer_hindi":"होजाई","parent_id":"4"},
{"answer_id":"727","answer_english":"Hooghly","answer_hindi":"हुगली","parent_id":"36"},
{"answer_id":"349","answer_english":"Hoshangabad ","answer_hindi":"होशंगाबाद","parent_id":"20"},
{"answer_id":"501","answer_english":"Hoshiarpur","answer_hindi":"होशियारपुर","parent_id":"28"},
{"answer_id":"728","answer_english":"Howrah","answer_hindi":"हावङा","parent_id":"36"},
{"answer_id":"593","answer_english":"Hyderabad","answer_hindi":"हैदराबाद","parent_id":"32"},
{"answer_id":"303","answer_english":"Idukki","answer_hindi":"इडुक्की ","parent_id":"17"},
{"answer_id":"411","answer_english":"Imphal East","answer_hindi":"इम्फाल पूर्व","parent_id":"22"},
{"answer_id":"412","answer_english":"Imphal West","answer_hindi":"इम्फाल पश्चिम","parent_id":"22"},
{"answer_id":"334","answer_english":"Indore ","answer_hindi":"इन्दौर","parent_id":"20"},
{"answer_id":"341","answer_english":"Jabalpur ","answer_hindi":"जबलपुर","parent_id":"20"},
{"answer_id":"472","answer_english":"Jagatsinghapur","answer_hindi":"जगतसिंहपुर","parent_id":"26"},
{"answer_id":"594","answer_english":"Jagtial","answer_hindi":"जगित्याल","parent_id":"32"},
{"answer_id":"534","answer_english":"Jaipur","answer_hindi":"जयपुर","parent_id":"29"},
{"answer_id":"535","answer_english":"Jaisalmer","answer_hindi":"जैसलमेर","parent_id":"29"},
{"answer_id":"471","answer_english":"Jajpur","answer_hindi":"जाजपुर","parent_id":"26"},
{"answer_id":"502","answer_english":"Jalandhar","answer_hindi":"जालंधर","parent_id":"28"},
{"answer_id":"669","answer_english":"Jalaun","answer_hindi":"जलौन","parent_id":"34"},
{"answer_id":"385","answer_english":"Jalgaon","answer_hindi":"जळगाव","parent_id":"21"},
{"answer_id":"386","answer_english":"Jalna","answer_hindi":"जालना","parent_id":"21"},
{"answer_id":"532","answer_english":"Jalore","answer_hindi":"जालौर","parent_id":"29"},
{"answer_id":"729","answer_english":"Jalpaiguri","answer_hindi":"जलपाईगुङी","parent_id":"36"},
{"answer_id":"232","answer_english":"Jammu","answer_hindi":"जम्मू","parent_id":"14"},
{"answer_id":"173","answer_english":"Jamnagar","answer_hindi":"जामनगर","parent_id":"11"},
{"answer_id":"264","answer_english":"Jamtara","answer_hindi":"जामताड़ा","parent_id":"15"},
{"answer_id":"88","answer_english":"Jamui","answer_hindi":"जमुई","parent_id":"5"},
{"answer_id":"595","answer_english":"Jangaon","answer_hindi":"जनगाँव","parent_id":"32"},
{"answer_id":"127","answer_english":"Janjgir-Champa","answer_hindi":"जांजगीर-चाम्पा","parent_id":"7"},
{"answer_id":"128","answer_english":"Jashpur","answer_hindi":"जशपुर","parent_id":"7"},
{"answer_id":"670","answer_english":"Jaunpur","answer_hindi":"जौनपुर","parent_id":"34"},
{"answer_id":"596","answer_english":"Jayashankar Bhupalpally","answer_hindi":"जयशंकर भूपलपल्ली","parent_id":"32"},
{"answer_id":"89","answer_english":"Jehanabad","answer_hindi":"जहानाबाद","parent_id":"5"},
{"answer_id":"336","answer_english":"Jhabua ","answer_hindi":"झाबुआ","parent_id":"20"},
{"answer_id":"199","answer_english":"Jhajjar","answer_hindi":"झज्जर","parent_id":"12"},
{"answer_id":"536","answer_english":"Jhalawar","answer_hindi":"झालावाड़","parent_id":"29"},
{"answer_id":"671","answer_english":"Jhansi","answer_hindi":"झाँसी","parent_id":"34"},
{"answer_id":"730","answer_english":"Jhargram","answer_hindi":"झाड़ग्राम","parent_id":"36"},
{"answer_id":"470","answer_english":"Jharsuguda","answer_hindi":"झारसुगुड़ा","parent_id":"26"},
{"answer_id":"531","answer_english":"Jhunjhunu","answer_hindi":"झुंझुनू","parent_id":"29"},
{"answer_id":"200","answer_english":"Jind","answer_hindi":"जींद","parent_id":"12"},
{"answer_id":"418","answer_english":"Jiribam","answer_hindi":"जिरिबाम","parent_id":"22"},
{"answer_id":"533","answer_english":"Jodhpur","answer_hindi":"जोधपुर","parent_id":"29"},
{"answer_id":"597","answer_english":"Jogulamba Gadwal","answer_hindi":"जोगुलाम्बा गद्वाल","parent_id":"32"},
{"answer_id":"59","answer_english":"Jorhat","answer_hindi":"जोरहाट","parent_id":"4"},
{"answer_id":"174","answer_english":"Junagadh","answer_hindi":"जूनागढ़","parent_id":"11"},
{"answer_id":"129","answer_english":"Kabirdham \/ Kawardha","answer_hindi":"कबीरधाम \/ कवर्धा","parent_id":"7"},
{"answer_id":"5","answer_english":"Kadapa","answer_hindi":"कड़प्पा","parent_id":"1"},
{"answer_id":"90","answer_english":"Kaimur","answer_hindi":"कैमूर","parent_id":"5"},
{"answer_id":"201","answer_english":"Kaithal","answer_hindi":"कैथल","parent_id":"12"},
{"answer_id":"420","answer_english":"Kakching","answer_hindi":"ककचिंग ","parent_id":"22"},
{"answer_id":"475","answer_english":"Kalahandi","answer_hindi":"कलाहान्डी","parent_id":"26"},
{"answer_id":"731","answer_english":"Kalimpong","answer_hindi":"कलिम्पोग","parent_id":"36"},
{"answer_id":"560","answer_english":"Kallakurichi","answer_hindi":"कल्लाकुरिची","parent_id":"31"},
{"answer_id":"598","answer_english":"Kamareddy","answer_hindi":"कामारेड्डी","parent_id":"32"},
{"answer_id":"422","answer_english":"Kamjong","answer_hindi":"कमजोंग ","parent_id":"22"},
{"answer_id":"21","answer_english":"Kamle","answer_hindi":"कमले","parent_id":"3"},
{"answer_id":"61","answer_english":"Kamrup","answer_hindi":"कामरूप","parent_id":"4"},
{"answer_id":"60","answer_english":"Kamrup Metropolitan","answer_hindi":"कामरूप महानगर","parent_id":"4"},
{"answer_id":"561","answer_english":"Kanchipuram","answer_hindi":"कांचीपुरम","parent_id":"31"},
{"answer_id":"476","answer_english":"Kandhamal","answer_hindi":"कन्धमाल","parent_id":"26"},
{"answer_id":"419","answer_english":"Kangpokpi (Sadar Hills)","answer_hindi":"कंगपोकपी","parent_id":"22"},
{"answer_id":"217","answer_english":"Kangra","answer_hindi":"काँगड़ा","parent_id":"13"},
{"answer_id":"130","answer_english":"Kanker","answer_hindi":"कांकेर  (उत्तर बस्तर)","parent_id":"7"},
{"answer_id":"672","answer_english":"Kannauj","answer_hindi":"कन्नौज","parent_id":"34"},
{"answer_id":"304","answer_english":"Kannur","answer_hindi":"कन्नूर","parent_id":"17"},
{"answer_id":"673","answer_english":"Kanpur Dehat","answer_hindi":"कानपुर देहात","parent_id":"34"},
{"answer_id":"674","answer_english":"Kanpur Nagar","answer_hindi":"कानपुर नगर","parent_id":"34"},
{"answer_id":"562","answer_english":"Kanyakumari","answer_hindi":"कन्याकुमारी","parent_id":"31"},
{"answer_id":"503","answer_english":"Kapurthala","answer_hindi":"कपूरथला","parent_id":"28"},
{"answer_id":"489","answer_english":"Karaikal","answer_hindi":"कराईकल ","parent_id":"27"},
{"answer_id":"537","answer_english":"Karauli","answer_hindi":"करौली","parent_id":"29"},
{"answer_id":"62","answer_english":"Karbi Anglong","answer_hindi":"कार्बी आंगलोंग","parent_id":"4"},
{"answer_id":"315","answer_english":"Kargil ","answer_hindi":"कारगिल","parent_id":"18"},
{"answer_id":"63","answer_english":"Karimganj","answer_hindi":"करीमगंज","parent_id":"4"},
{"answer_id":"599","answer_english":"Karimnagar","answer_hindi":"करीमनगर","parent_id":"32"},
{"answer_id":"202","answer_english":"Karnal","answer_hindi":"करनाल","parent_id":"12"},
{"answer_id":"563","answer_english":"Karur","answer_hindi":"करूर","parent_id":"31"},
{"answer_id":"305","answer_english":"Kasaragod","answer_hindi":"कासरगोड ","parent_id":"17"},
{"answer_id":"675","answer_english":"Kasganj","answer_hindi":"कासगंज ","parent_id":"34"},
{"answer_id":"233","answer_english":"Kathua","answer_hindi":"कठुआ","parent_id":"14"},
{"answer_id":"91","answer_english":"Katihar","answer_hindi":"कटिहार","parent_id":"5"},
{"answer_id":"342","answer_english":"Katni ","answer_hindi":"कटनी","parent_id":"20"},
{"answer_id":"676","answer_english":"Kaushambi","answer_hindi":"कौशाम्बी","parent_id":"34"},
{"answer_id":"478","answer_english":"Kendrapara","answer_hindi":"केन्द्रापड़ा","parent_id":"26"},
{"answer_id":"474","answer_english":"Kendujhar","answer_hindi":"केन्दुझर","parent_id":"26"},
{"answer_id":"92","answer_english":"Khagaria","answer_hindi":"खगड़िया","parent_id":"5"},
{"answer_id":"600","answer_english":"Khammam","answer_hindi":"खम्मम","parent_id":"32"},
{"answer_id":"337","answer_english":"Khandwa (East Nimar)","answer_hindi":"खंडवा","parent_id":"20"},
{"answer_id":"338","answer_english":"Khargone (West Nimar)","answer_hindi":"खरगोन","parent_id":"20"},
{"answer_id":"445","answer_english":"Khawzawl","answer_hindi":"खावजौल","parent_id":"24"},
{"answer_id":"176","answer_english":"Kheda","answer_hindi":"खेड़ा","parent_id":"11"},
{"answer_id":"473","answer_english":"Khordha","answer_hindi":"खोर्धा","parent_id":"26"},
{"answer_id":"628","answer_english":"Khowai","answer_hindi":"खोवाई","parent_id":"33"},
{"answer_id":"260","answer_english":"Khunti","answer_hindi":"खुटी","parent_id":"15"},
{"answer_id":"218","answer_english":"Kinnaur","answer_hindi":"किन्नौर","parent_id":"13"},
{"answer_id":"448","answer_english":"Kiphire","answer_hindi":"कैफाइर","parent_id":"25"},
{"answer_id":"93","answer_english":"Kishanganj","answer_hindi":"किशनगंज","parent_id":"5"},
{"answer_id":"234","answer_english":"Kishtwar","answer_hindi":"किश्तवाड़","parent_id":"14"},
{"answer_id":"288","answer_english":"Kodagu","answer_hindi":"कोडगु","parent_id":"16"},
{"answer_id":"251","answer_english":"Koderma","answer_hindi":"कोडरमा","parent_id":"15"},
{"answer_id":"449","answer_english":"Kohima","answer_hindi":"कोहिमा","parent_id":"25"},
{"answer_id":"64","answer_english":"Kokrajhar","answer_hindi":"कोकराझार","parent_id":"4"},
{"answer_id":"289","answer_english":"Kolar","answer_hindi":"कोलार","parent_id":"16"},
{"answer_id":"437","answer_english":"Kolasib","answer_hindi":"कोलासिब","parent_id":"24"},
{"answer_id":"387","answer_english":"Kolhapur","answer_hindi":"कोल्हापुर","parent_id":"21"},
{"answer_id":"732","answer_english":"Kolkata","answer_hindi":"कोलकाता","parent_id":"36"},
{"answer_id":"306","answer_english":"Kollam","answer_hindi":"कोल्लम","parent_id":"17"},
{"answer_id":"591","answer_english":"Komaram Bheem","answer_hindi":"कोमरम भीम","parent_id":"32"},
{"answer_id":"131","answer_english":"Kondagaon","answer_hindi":"कोंडगाँव","parent_id":"7"},
{"answer_id":"290","answer_english":"Koppal","answer_hindi":"कोप्पल","parent_id":"16"},
{"answer_id":"477","answer_english":"Koraput","answer_hindi":"कोरापुट","parent_id":"26"},
{"answer_id":"132","answer_english":"Korba","answer_hindi":"कोरबा","parent_id":"7"},
{"answer_id":"133","answer_english":"Koriya","answer_hindi":"कोरिया","parent_id":"7"},
{"answer_id":"538","answer_english":"Kota","answer_hindi":"कोटा","parent_id":"29"},
{"answer_id":"307","answer_english":"Kottayam","answer_hindi":"कोट्टयम","parent_id":"17"},
{"answer_id":"308","answer_english":"Kozhikode","answer_hindi":"कोड़िकोड","parent_id":"17"},
{"answer_id":"22","answer_english":"Kra Daadi","answer_hindi":"क्रा दादी","parent_id":"3"},
{"answer_id":"6","answer_english":"Krishna","answer_hindi":"कृष्णा","parent_id":"1"},
{"answer_id":"564","answer_english":"Krishnagiri","answer_hindi":"कृष्णगिरि","parent_id":"31"},
{"answer_id":"235","answer_english":"Kulgam","answer_hindi":"कुलगाम","parent_id":"14"},
{"answer_id":"219","answer_english":"Kullu","answer_hindi":"कुल्लू","parent_id":"13"},
{"answer_id":"236","answer_english":"Kupwara","answer_hindi":"कुपवाड़ा","parent_id":"14"},
{"answer_id":"7","answer_english":"Kurnool","answer_hindi":"कुर्नूल","parent_id":"1"},
{"answer_id":"203","answer_english":"Kurukshetra","answer_hindi":"कुरुक्षेत्र","parent_id":"12"},
{"answer_id":"23","answer_english":"Kurung Kumey","answer_hindi":"कुरुंग कुमे","parent_id":"3"},
{"answer_id":"677","answer_english":"Kushinagar","answer_hindi":"कुशीनगर (पड़रौना)","parent_id":"34"},
{"answer_id":"175","answer_english":"Kutch","answer_hindi":"कच्छ","parent_id":"11"},
{"answer_id":"220","answer_english":"Lahaul and Spiti","answer_hindi":"लाहौल और स्पीती","parent_id":"13"},
{"answer_id":"65","answer_english":"Lakhimpur","answer_hindi":"लखीमपुर","parent_id":"4"},
{"answer_id":"678","answer_english":"Lakhimpur Kheri","answer_hindi":"लखीमपुर-खिरी","parent_id":"34"},
{"answer_id":"94","answer_english":"Lakhisarai","answer_hindi":"लखीसराय","parent_id":"5"},
{"answer_id":"317","answer_english":"Lakshadweep","answer_hindi":"लक्षद्वीप","parent_id":"19"},
{"answer_id":"679","answer_english":"Lalitpur","answer_hindi":"ललितपुर","parent_id":"34"},
{"answer_id":"248","answer_english":"Latehar","answer_hindi":"लातेहार","parent_id":"15"},
{"answer_id":"388","answer_english":"Latur","answer_hindi":"लातूर","parent_id":"21"},
{"answer_id":"438","answer_english":"Lawngtlai","answer_hindi":"लॉङ्गतलाई","parent_id":"24"},
{"answer_id":"316","answer_english":"Leh ","answer_hindi":"लेह","parent_id":"18"},
{"answer_id":"24","answer_english":"Lepa Rada","answer_hindi":"लेपा रादा","parent_id":"3"},
{"answer_id":"257","answer_english":"Lohardaga","answer_hindi":"लोहरदग्गा","parent_id":"15"},
{"answer_id":"25","answer_english":"Lohit","answer_hindi":"लोहित","parent_id":"3"},
{"answer_id":"26","answer_english":"Longding","answer_hindi":"लोंगडिंग","parent_id":"3"},
{"answer_id":"450","answer_english":"Longleng","answer_hindi":"लॉन्गलेन्ग","parent_id":"25"},
{"answer_id":"27","answer_english":"Lower Dibang Valley","answer_hindi":"निचली दिबांग घाटी","parent_id":"3"},
{"answer_id":"28","answer_english":"Lower Siang","answer_hindi":"निचला सियांग","parent_id":"3"},
{"answer_id":"29","answer_english":"Lower Subansiri","answer_hindi":"निचली सुबनसिरी","parent_id":"3"},
{"answer_id":"680","answer_english":"Lucknow","answer_hindi":"लखनऊ","parent_id":"34"},
{"answer_id":"504","answer_english":"Ludhiana","answer_hindi":"लुधियाना","parent_id":"28"},
{"answer_id":"439","answer_english":"Lunglei","answer_hindi":"लुंगलेई","parent_id":"24"},
{"answer_id":"95","answer_english":"Madhepura","answer_hindi":"मधेपुरा","parent_id":"5"},
{"answer_id":"96","answer_english":"Madhubani","answer_hindi":"मधुबनी","parent_id":"5"},
{"answer_id":"565","answer_english":"Madurai","answer_hindi":"मदुरई","parent_id":"31"},
{"answer_id":"601","answer_english":"Mahabubabad","answer_hindi":"महाबूबाबाद","parent_id":"32"},
{"answer_id":"681","answer_english":"Maharajganj","answer_hindi":"महाराजगंज","parent_id":"34"},
{"answer_id":"134","answer_english":"Mahasamund","answer_hindi":"महासमुन्द","parent_id":"7"},
{"answer_id":"602","answer_english":"Mahbubnagar","answer_hindi":"महबूबनगर","parent_id":"32"},
{"answer_id":"490","answer_english":"Mahé","answer_hindi":"माहे ","parent_id":"27"},
{"answer_id":"204","answer_english":"Mahendragarh","answer_hindi":"महेंद्रगढ़","parent_id":"12"},
{"answer_id":"177","answer_english":"Mahisagar","answer_hindi":"महीसागर","parent_id":"11"},
{"answer_id":"682","answer_english":"Mahoba","answer_hindi":"महोबा","parent_id":"34"},
{"answer_id":"371","answer_english":"Maihar","answer_hindi":"मैहर","parent_id":"20"},
{"answer_id":"683","answer_english":"Mainpuri","answer_hindi":"मैनपुरी","parent_id":"34"},
{"answer_id":"66","answer_english":"Majuli","answer_hindi":"माजुली","parent_id":"4"},
{"answer_id":"309","answer_english":"Malappuram","answer_hindi":"मलप्पुरम","parent_id":"17"},
{"answer_id":"733","answer_english":"Maldah","answer_hindi":"मालदह","parent_id":"36"},
{"answer_id":"479","answer_english":"Malkangiri","answer_hindi":"मालकानगिरि","parent_id":"26"},
{"answer_id":"440","answer_english":"Mamit","answer_hindi":"ममित","parent_id":"24"},
{"answer_id":"603","answer_english":"Mancherial","answer_hindi":"मंचेरियल","parent_id":"32"},
{"answer_id":"221","answer_english":"Mandi","answer_hindi":"मंडी","parent_id":"13"},
{"answer_id":"343","answer_english":"Mandla ","answer_hindi":"मंडला","parent_id":"20"},
{"answer_id":"365","answer_english":"Mandsaur","answer_hindi":"मंदसौर","parent_id":"20"},
{"answer_id":"291","answer_english":"Mandya","answer_hindi":"मांडया","parent_id":"16"},
{"answer_id":"505","answer_english":"Mansa","answer_hindi":"मानसा","parent_id":"28"},
{"answer_id":"684","answer_english":"Mathura","answer_hindi":"मथुरा","parent_id":"34"},
{"answer_id":"685","answer_english":"Mau","answer_hindi":"मऊ","parent_id":"34"},
{"answer_id":"566","answer_english":"Mayiladuthurai","answer_hindi":"मयीलाडूतुरै","parent_id":"31"},
{"answer_id":"480","answer_english":"Mayurbhanj","answer_hindi":"मयूरभंज","parent_id":"26"},
{"answer_id":"604","answer_english":"Medak","answer_hindi":"मेदक","parent_id":"32"},
{"answer_id":"605","answer_english":"Medchal-Malkajgiri","answer_hindi":"मेड्चल मल्काजगिरि","parent_id":"32"},
{"answer_id":"686","answer_english":"Meerut","answer_hindi":"मेरठ","parent_id":"34"},
{"answer_id":"178","answer_english":"Mehsana","answer_hindi":"मेहसाणा","parent_id":"11"},
{"answer_id":"687","answer_english":"Mirzapur","answer_hindi":"मिर्ज़ापुर","parent_id":"34"},
{"answer_id":"506","answer_english":"Moga","answer_hindi":"मोगा","parent_id":"28"},
{"answer_id":"451","answer_english":"Mokokchung","answer_hindi":"मोकोकचुआंग","parent_id":"25"},
{"answer_id":"452","answer_english":"Mon","answer_hindi":"मोन","parent_id":"25"},
{"answer_id":"688","answer_english":"Moradabad","answer_hindi":"मुरादाबाद","parent_id":"34"},
{"answer_id":"179","answer_english":"Morbi","answer_hindi":"मोरबी","parent_id":"11"},
{"answer_id":"323","answer_english":"Morena ","answer_hindi":"मुरैना","parent_id":"20"},
{"answer_id":"67","answer_english":"Morigaon","answer_hindi":"मारिगांव","parent_id":"4"},
{"answer_id":"606","answer_english":"Mulugu","answer_hindi":"मुलुगु","parent_id":"32"},
{"answer_id":"389","answer_english":"Mumbai","answer_hindi":"मुंबई","parent_id":"21"},
{"answer_id":"390","answer_english":"Mumbai Suburban","answer_hindi":"मुंबई (सबअर्बन)","parent_id":"21"},
{"answer_id":"135","answer_english":"Mungeli","answer_hindi":"मुंगेली","parent_id":"7"},
{"answer_id":"97","answer_english":"Munger","answer_hindi":"मुंगेर","parent_id":"5"},
{"answer_id":"734","answer_english":"Murshidabad","answer_hindi":"मुर्शिदाबाद","parent_id":"36"},
{"answer_id":"689","answer_english":"Muzaffarnagar","answer_hindi":"मुजफ्फरनगर","parent_id":"34"},
{"answer_id":"98","answer_english":"Muzaffarpur","answer_hindi":"मुजफ्फरपुर","parent_id":"5"},
{"answer_id":"292","answer_english":"Mysore","answer_hindi":"मैसूर","parent_id":"16"},
{"answer_id":"481","answer_english":"Nabarangpur","answer_hindi":"नबरंगपुर","parent_id":"26"},
{"answer_id":"735","answer_english":"Nadia","answer_hindi":"नादिया","parent_id":"36"},
{"answer_id":"68","answer_english":"Nagaon","answer_hindi":"नगांव","parent_id":"4"},
{"answer_id":"567","answer_english":"Nagapattinam","answer_hindi":"नागपट्टिनम","parent_id":"31"},
{"answer_id":"609","answer_english":"Nagarkurnool","answer_hindi":"नागरकर्नूल","parent_id":"32"},
{"answer_id":"539","answer_english":"Nagaur","answer_hindi":"नागौर","parent_id":"29"},
{"answer_id":"372","answer_english":"Nagda","answer_hindi":"नागदा","parent_id":"20"},
{"answer_id":"391","answer_english":"Nagpur","answer_hindi":"नागपुर","parent_id":"21"},
{"answer_id":"712","answer_english":"Nainital","answer_hindi":"नैनीताल","parent_id":"35"},
{"answer_id":"99","answer_english":"Nalanda","answer_hindi":"नालंदा","parent_id":"5"},
{"answer_id":"69","answer_english":"Nalbari","answer_hindi":"नलबाड़ी","parent_id":"4"},
{"answer_id":"607","answer_english":"Nalgonda","answer_hindi":"नलगोंडा","parent_id":"32"},
{"answer_id":"569","answer_english":"Namakkal","answer_hindi":"नामक्कल","parent_id":"31"},
{"answer_id":"30","answer_english":"Namsai","answer_hindi":"नामसाई","parent_id":"3"},
{"answer_id":"392","answer_english":"Nanded","answer_hindi":"नांदेड","parent_id":"21"},
{"answer_id":"393","answer_english":"Nandurbar","answer_hindi":"नंदुरबार","parent_id":"21"},
{"answer_id":"608","answer_english":"Narayanpet","answer_hindi":"नारायणपेट","parent_id":"32"},
{"answer_id":"136","answer_english":"Narayanpur","answer_hindi":"नारायणपुर","parent_id":"7"},
{"answer_id":"180","answer_english":"Narmada","answer_hindi":"नर्मदा","parent_id":"11"},
{"answer_id":"344","answer_english":"Narsinghpur ","answer_hindi":"नरसिंहपुर","parent_id":"20"},
{"answer_id":"394","answer_english":"Nashik","answer_hindi":"नाशिक","parent_id":"21"},
{"answer_id":"181","answer_english":"Navsari","answer_hindi":"नवसारी","parent_id":"11"},
{"answer_id":"100","answer_english":"Nawada","answer_hindi":"नवादा","parent_id":"5"},
{"answer_id":"483","answer_english":"Nayagarh","answer_hindi":"नयागड़","parent_id":"26"},
{"answer_id":"366","answer_english":"Neemuch","answer_hindi":"नीमच","parent_id":"20"},
{"answer_id":"8","answer_english":"Nellore","answer_hindi":"नेल्लौर","parent_id":"1"},
{"answer_id":"146","answer_english":"New Delhi","answer_hindi":"नई दिल्ली","parent_id":"9"},
{"answer_id":"14","answer_english":"Nicobar","answer_hindi":"निकोबार","parent_id":"2"},
{"answer_id":"568","answer_english":"Nilgiris","answer_hindi":"नीलगिरि","parent_id":"31"},
{"answer_id":"610","answer_english":"Nirmal","answer_hindi":"निर्मल","parent_id":"32"},
{"answer_id":"359","answer_english":"Niwari ","answer_hindi":"निवाड़ी","parent_id":"20"},
{"answer_id":"611","answer_english":"Nizamabad","answer_hindi":"निज़ामाबाद","parent_id":"32"},
{"answer_id":"458","answer_english":"Noklak","answer_hindi":"नोक्लक","parent_id":"25"},
{"answer_id":"423","answer_english":"Noney","answer_hindi":"नोने","parent_id":"22"},
{"answer_id":"736","answer_english":"North 24 Parganas","answer_hindi":"उत्तर 24 परगना","parent_id":"36"},
{"answer_id":"15","answer_english":"North and Middle Andaman","answer_hindi":"उत्तर और मध्य अण्डमान जिला","parent_id":"2"},
{"answer_id":"149","answer_english":"North Delhi ","answer_hindi":"उत्तर दिल्ली","parent_id":"9"},
{"answer_id":"150","answer_english":"North East Delhi","answer_hindi":"उत्तर पूर्वी दिल्ली","parent_id":"9"},
{"answer_id":"435","answer_english":"North Garo Hills","answer_hindi":"उत्तर गारो हिल्स","parent_id":"23"},
{"answer_id":"157","answer_english":"North Goa","answer_hindi":"उत्तर गोवा","parent_id":"10"},
{"answer_id":"549","answer_english":"North Sikkim","answer_hindi":"उत्तर सिक्किम","parent_id":"30"},
{"answer_id":"626","answer_english":"North Tripura","answer_hindi":"उत्तर त्रिपुरा","parent_id":"33"},
{"answer_id":"151","answer_english":"North West Delhi","answer_hindi":"उत्तर पश्चिम दिल्ली","parent_id":"9"},
{"answer_id":"482","answer_english":"Nuapada","answer_hindi":"नुआपड़ा","parent_id":"26"},
{"answer_id":"205","answer_english":"Nuh","answer_hindi":"नूह ","parent_id":"12"},
{"answer_id":"395","answer_english":"Osmanabad","answer_hindi":"उस्मानाबाद","parent_id":"21"},
{"answer_id":"31","answer_english":"Pakke-Kessang","answer_hindi":"पक्के केसांग","parent_id":"3"},
{"answer_id":"267","answer_english":"Pakur","answer_hindi":"पाकुड़","parent_id":"15"},
{"answer_id":"310","answer_english":"Palakkad","answer_hindi":"पालक्काड़ ","parent_id":"17"},
{"answer_id":"247","answer_english":"Palamu","answer_hindi":"पलामू","parent_id":"15"},
{"answer_id":"396","answer_english":"Palghar","answer_hindi":"पालघर","parent_id":"21"},
{"answer_id":"540","answer_english":"Pali","answer_hindi":"पाली","parent_id":"29"},
{"answer_id":"206","answer_english":"Palwal","answer_hindi":"पलवल","parent_id":"12"},
{"answer_id":"207","answer_english":"Panchkula","answer_hindi":"पंचकुला","parent_id":"12"},
{"answer_id":"182","answer_english":"Panchmahal","answer_hindi":"पंचमहल","parent_id":"11"},
{"answer_id":"208","answer_english":"Panipat","answer_hindi":"पानीपत","parent_id":"12"},
{"answer_id":"356","answer_english":"Panna ","answer_hindi":"पन्ना","parent_id":"20"},
{"answer_id":"32","answer_english":"Papum Pare","answer_hindi":"पपुमपारे","parent_id":"3"},
{"answer_id":"397","answer_english":"Parbhani","answer_hindi":"परभणी","parent_id":"21"},
{"answer_id":"721","answer_english":"Paschim Bardhaman","answer_hindi":"पश्चिमी वर्धमान","parent_id":"36"},
{"answer_id":"737","answer_english":"Paschim Medinipur","answer_hindi":"पश्चिम मेदिनीपुर","parent_id":"36"},
{"answer_id":"183","answer_english":"Patan","answer_hindi":"पाटन","parent_id":"11"},
{"answer_id":"311","answer_english":"Pathanamthitta","answer_hindi":"पतनमतिट्टा","parent_id":"17"},
{"answer_id":"508","answer_english":"Pathankot","answer_hindi":"पठानकोट","parent_id":"28"},
{"answer_id":"509","answer_english":"Patiala","answer_hindi":"पटियाला","parent_id":"28"},
{"answer_id":"101","answer_english":"Patna","answer_hindi":"पटना","parent_id":"5"},
{"answer_id":"713","answer_english":"Pauri Garhwal","answer_hindi":"पौड़ी गढ़वाल","parent_id":"35"},
{"answer_id":"612","answer_english":"Peddapalli","answer_hindi":"पेद्दपल्ले","parent_id":"32"},
{"answer_id":"570","answer_english":"Perambalur","answer_hindi":"पेरम्बलुर","parent_id":"31"},
{"answer_id":"453","answer_english":"Peren","answer_hindi":"पेरेन","parent_id":"25"},
{"answer_id":"454","answer_english":"Phek","answer_hindi":"फेक","parent_id":"25"},
{"answer_id":"424","answer_english":"Pherzawl","answer_hindi":"फेरज़ौल ","parent_id":"22"},
{"answer_id":"690","answer_english":"Pilibhit","answer_hindi":"पीलीभीत","parent_id":"34"},
{"answer_id":"714","answer_english":"Pithoragarh","answer_hindi":"पिथौरागढ़","parent_id":"35"},
{"answer_id":"237","answer_english":"Poonch","answer_hindi":"पुंछ","parent_id":"14"},
{"answer_id":"184","answer_english":"Porbandar","answer_hindi":"पोरबंदर","parent_id":"11"},
{"answer_id":"9","answer_english":"Prakasam","answer_hindi":"प्रकाशम","parent_id":"1"},
{"answer_id":"541","answer_english":"Pratapgarh","answer_hindi":"प्रतापगढ़","parent_id":"29"},
{"answer_id":"691","answer_english":"Pratapgarh","answer_hindi":"प्रतापगढ","parent_id":"34"},
{"answer_id":"491","answer_english":"Puducherry","answer_hindi":"पुदुचेरी","parent_id":"27"},
{"answer_id":"571","answer_english":"Pudukkottai","answer_hindi":"पुदुकोट्टई","parent_id":"31"},
{"answer_id":"238","answer_english":"Pulwama","answer_hindi":"पुलवामा","parent_id":"14"},
{"answer_id":"398","answer_english":"Pune","answer_hindi":"पुणे","parent_id":"21"},
{"answer_id":"722","answer_english":"Purba Bardhaman","answer_hindi":"पूर्व बर्धमान ","parent_id":"36"},
{"answer_id":"738","answer_english":"Purba Medinipur","answer_hindi":"पूर्व मेदिनीपुर","parent_id":"36"},
{"answer_id":"484","answer_english":"Puri","answer_hindi":"पुरी","parent_id":"26"},
{"answer_id":"102","answer_english":"Purnia","answer_hindi":"पूर्णिया","parent_id":"5"},
{"answer_id":"739","answer_english":"Purulia","answer_hindi":"पुरूलिया","parent_id":"36"},
{"answer_id":"692","answer_english":"Raebareli","answer_hindi":"रायबरेली","parent_id":"34"},
{"answer_id":"293","answer_english":"Raichur","answer_hindi":"रायचूर","parent_id":"16"},
{"answer_id":"399","answer_english":"Raigad","answer_hindi":"रायगड","parent_id":"21"},
{"answer_id":"137","answer_english":"Raigarh","answer_hindi":"रायगढ","parent_id":"7"},
{"answer_id":"138","answer_english":"Raipur","answer_hindi":"रायपुर","parent_id":"7"},
{"answer_id":"319","answer_english":"Raisen","answer_hindi":"रायसेन","parent_id":"20"},
{"answer_id":"613","answer_english":"Rajanna Sircilla","answer_hindi":"राजन्ना सिरसिल्ला","parent_id":"32"},
{"answer_id":"320","answer_english":"Rajgarh ","answer_hindi":"राजगढ़","parent_id":"20"},
{"answer_id":"185","answer_english":"Rajkot","answer_hindi":"राजकोट","parent_id":"11"},
{"answer_id":"139","answer_english":"Rajnandgaon","answer_hindi":"राजनांदगांव","parent_id":"7"},
{"answer_id":"239","answer_english":"Rajouri","answer_hindi":"राजौरी","parent_id":"14"},
{"answer_id":"542","answer_english":"Rajsamand","answer_hindi":"राजसमंद","parent_id":"29"},
{"answer_id":"294","answer_english":"Ramanagara","answer_hindi":"रामनगर","parent_id":"16"},
{"answer_id":"572","answer_english":"Ramanathapuram","answer_hindi":"रामनाथपुरम","parent_id":"31"},
{"answer_id":"240","answer_english":"Ramban","answer_hindi":"रामबन","parent_id":"14"},
{"answer_id":"253","answer_english":"Ramgarh","answer_hindi":"रामगढ़","parent_id":"15"},
{"answer_id":"693","answer_english":"Rampur","answer_hindi":"रामपुर","parent_id":"34"},
{"answer_id":"259","answer_english":"Ranchi","answer_hindi":"राँची","parent_id":"15"},
{"answer_id":"614","answer_english":"Ranga Reddy","answer_hindi":"रंगारेड्डी","parent_id":"32"},
{"answer_id":"573","answer_english":"Ranipet","answer_hindi":"रानीपेट","parent_id":"31"},
{"answer_id":"367","answer_english":"Ratlam","answer_hindi":"रतलाम","parent_id":"20"},
{"answer_id":"400","answer_english":"Ratnagiri","answer_hindi":"रत्नागिरी","parent_id":"21"},
{"answer_id":"485","answer_english":"Rayagada","answer_hindi":"रायगड़ा","parent_id":"26"},
{"answer_id":"241","answer_english":"Reasi","answer_hindi":"रियासी","parent_id":"14"},
{"answer_id":"350","answer_english":"Rewa ","answer_hindi":"रीवा","parent_id":"20"},
{"answer_id":"209","answer_english":"Rewari","answer_hindi":"रेवाड़ी","parent_id":"12"},
{"answer_id":"430","answer_english":"Ri Bhoi","answer_hindi":"री भोई","parent_id":"23"},
{"answer_id":"210","answer_english":"Rohtak","answer_hindi":"रोहतक","parent_id":"12"},
{"answer_id":"103","answer_english":"Rohtas","answer_hindi":"रोहतास","parent_id":"5"},
{"answer_id":"715","answer_english":"Rudraprayag","answer_hindi":"रुद्रप्रयाग","parent_id":"35"},
{"answer_id":"510","answer_english":"Rupnagar","answer_hindi":"रूपनगर","parent_id":"28"},
{"answer_id":"186","answer_english":"Sabarkantha","answer_hindi":"साबरकांठा","parent_id":"11"},
{"answer_id":"357","answer_english":"Sagar ","answer_hindi":"सागर","parent_id":"20"},
{"answer_id":"694","answer_english":"Saharanpur","answer_hindi":"सहारनपुर","parent_id":"34"},
{"answer_id":"104","answer_english":"Saharsa","answer_hindi":"सहरसा","parent_id":"5"},
{"answer_id":"269","answer_english":"Sahebganj","answer_hindi":"साहिबगंज","parent_id":"15"},
{"answer_id":"511","answer_english":"Sahibzada Ajit Singh Nagar","answer_hindi":"मोहाली\/ साहिबजादा अजीत सिंह नगर","parent_id":"28"},
{"answer_id":"441","answer_english":"Saiha","answer_hindi":"सइहा","parent_id":"24"},
{"answer_id":"446","answer_english":"Saitual","answer_hindi":"सइतुआल","parent_id":"24"},
{"answer_id":"574","answer_english":"Salem","answer_hindi":"सेलम","parent_id":"31"},
{"answer_id":"105","answer_english":"Samastipur","answer_hindi":"समस्तीपुर","parent_id":"5"},
{"answer_id":"242","answer_english":"Samba","answer_hindi":"सांबा","parent_id":"14"},
{"answer_id":"486","answer_english":"Sambalpur","answer_hindi":"सम्बलपुर","parent_id":"26"},
{"answer_id":"695","answer_english":"Sambhal","answer_hindi":"सम्भल","parent_id":"34"},
{"answer_id":"615","answer_english":"Sangareddy","answer_hindi":"संगारेड्डी","parent_id":"32"},
{"answer_id":"401","answer_english":"Sangli","answer_hindi":"सांगली","parent_id":"21"},
{"answer_id":"512","answer_english":"Sangrur","answer_hindi":"संगरूर","parent_id":"28"},
{"answer_id":"696","answer_english":"Sant Kabir Nagar","answer_hindi":"संत कबीरनगर","parent_id":"34"},
{"answer_id":"262","answer_english":"Saraikela Kharsawan","answer_hindi":"सराइकेला खरसावाँ","parent_id":"15"},
{"answer_id":"106","answer_english":"Saran","answer_hindi":"सारन","parent_id":"5"},
{"answer_id":"402","answer_english":"Satara","answer_hindi":"सातारा","parent_id":"21"},
{"answer_id":"351","answer_english":"Satna ","answer_hindi":"सतना","parent_id":"20"},
{"answer_id":"544","answer_english":"Sawai Madhopur","answer_hindi":"सवाई माधोपुर","parent_id":"29"},
{"answer_id":"321","answer_english":"Sehore ","answer_hindi":"सीहोर","parent_id":"20"},
{"answer_id":"413","answer_english":"Senapati","answer_hindi":"सेनापति जिला","parent_id":"22"},
{"answer_id":"345","answer_english":"Seoni ","answer_hindi":"सिवनी ","parent_id":"20"},
{"answer_id":"442","answer_english":"Serchhip","answer_hindi":"सेरछिप","parent_id":"24"},
{"answer_id":"152","answer_english":"Shahdara","answer_hindi":"शाहदरा","parent_id":"9"},
{"answer_id":"361","answer_english":"Shahdol ","answer_hindi":"शहडोल","parent_id":"20"},
{"answer_id":"513","answer_english":"Shahid Bhagat Singh Nagar","answer_hindi":"शहीद भगतसिंहनगर","parent_id":"28"},
{"answer_id":"697","answer_english":"Shahjahanpur","answer_hindi":"शाहजहाँपुर","parent_id":"34"},
{"answer_id":"368","answer_english":"Shajapur","answer_hindi":"शाजापुर","parent_id":"20"},
{"answer_id":"698","answer_english":"Shamli","answer_hindi":"शामली","parent_id":"34"},
{"answer_id":"107","answer_english":"Sheikhpura","answer_hindi":"शेखपुरा","parent_id":"5"},
{"answer_id":"108","answer_english":"Sheohar","answer_hindi":"शिवहर","parent_id":"5"},
{"answer_id":"324","answer_english":"Sheopur ","answer_hindi":"श्योपुर","parent_id":"20"},
{"answer_id":"33","answer_english":"Shi Yomi","answer_hindi":"शिओमी","parent_id":"3"},
{"answer_id":"222","answer_english":"Shimla","answer_hindi":"शिमला","parent_id":"13"},
{"answer_id":"295","answer_english":"Shimoga","answer_hindi":"शिमोगा","parent_id":"16"},
{"answer_id":"328","answer_english":"Shivpuri ","answer_hindi":"शिवपुरी","parent_id":"20"},
{"answer_id":"243","answer_english":"Shopian","answer_hindi":"शोपियां","parent_id":"14"},
{"answer_id":"699","answer_english":"Shravasti","answer_hindi":"श्रावस्ती","parent_id":"34"},
{"answer_id":"34","answer_english":"Siang","answer_hindi":"सियांग","parent_id":"3"},
{"answer_id":"700","answer_english":"Siddharthnagar","answer_hindi":"सिद्धार्थनगर","parent_id":"34"},
{"answer_id":"616","answer_english":"Siddipet","answer_hindi":"सिद्दिपेट","parent_id":"32"},
{"answer_id":"352","answer_english":"Sidhi ","answer_hindi":"सीधी","parent_id":"20"},
{"answer_id":"543","answer_english":"Sikar","answer_hindi":"सीकर","parent_id":"29"},
{"answer_id":"258","answer_english":"Simdega","answer_hindi":"सिमडेगा","parent_id":"15"},
{"answer_id":"403","answer_english":"Sindhudurg","answer_hindi":"सिंधुदुर्ग","parent_id":"21"},
{"answer_id":"353","answer_english":"Singrauli ","answer_hindi":"सिंगरौली","parent_id":"20"},
{"answer_id":"627","answer_english":"Sipahijala","answer_hindi":"सिपाहीजाला","parent_id":"33"},
{"answer_id":"223","answer_english":"Sirmaur","answer_hindi":"सिरमौर","parent_id":"13"},
{"answer_id":"545","answer_english":"Sirohi","answer_hindi":"सिरोही","parent_id":"29"},
{"answer_id":"211","answer_english":"Sirsa","answer_hindi":"सिरसा","parent_id":"12"},
{"answer_id":"109","answer_english":"Sitamarhi","answer_hindi":"सीतामढ़ी","parent_id":"5"},
{"answer_id":"701","answer_english":"Sitapur","answer_hindi":"सीतापुर","parent_id":"34"},
{"answer_id":"575","answer_english":"Sivaganga","answer_hindi":"शिवगंगा","parent_id":"31"},
{"answer_id":"70","answer_english":"Sivasagar","answer_hindi":"शिवसागर","parent_id":"4"},
{"answer_id":"110","answer_english":"Siwan","answer_hindi":"सीवान","parent_id":"5"},
{"answer_id":"224","answer_english":"Solan","answer_hindi":"सोलन","parent_id":"13"},
{"answer_id":"404","answer_english":"Solapur","answer_hindi":"सोलापुर","parent_id":"21"},
{"answer_id":"702","answer_english":"Sonbhadra","answer_hindi":"सोनभद्र","parent_id":"34"},
{"answer_id":"212","answer_english":"Sonipat","answer_hindi":"सोनीपत","parent_id":"12"},
{"answer_id":"71","answer_english":"Sonitpur","answer_hindi":"शोणितपुर","parent_id":"4"},
{"answer_id":"740","answer_english":"South 24 Parganas","answer_hindi":"दक्षिण 24 परगना","parent_id":"36"},
{"answer_id":"16","answer_english":"South Andaman","answer_hindi":"दक्षिण अण्डमान","parent_id":"2"},
{"answer_id":"153","answer_english":"South Delhi ","answer_hindi":"दक्षिण दिल्ली","parent_id":"9"},
{"answer_id":"154","answer_english":"South East Delhi","answer_hindi":"दक्षिण पूर्वी दिल्ली","parent_id":"9"},
{"answer_id":"431","answer_english":"South Garo Hills","answer_hindi":"दक्षिण गारो हिल्स","parent_id":"23"},
{"answer_id":"158","answer_english":"South Goa","answer_hindi":" दक्षिण गोवा","parent_id":"10"},
{"answer_id":"72","answer_english":"South Salmara-Mankachar","answer_hindi":"दक्षिण सालमारा-मनकाचर","parent_id":"4"},
{"answer_id":"550","answer_english":"South Sikkim","answer_hindi":"दक्षिण सिक्किम","parent_id":"30"},
{"answer_id":"624","answer_english":"South Tripura","answer_hindi":"दक्षिण त्रिपुरा","parent_id":"33"},
{"answer_id":"155","answer_english":"South West Delhi","answer_hindi":"दक्षिण पश्चिम दिल्ली","parent_id":"9"},
{"answer_id":"432","answer_english":"South West Garo Hills","answer_hindi":"दक्षिण पश्चिम गारो हिल्स","parent_id":"23"},
{"answer_id":"433","answer_english":"South West Khasi Hills","answer_hindi":"दक्षिण पश्चिम खासी हिल्स","parent_id":"23"},
{"answer_id":"507","answer_english":"Sri Muktsar Sahib","answer_hindi":"मुक्तसर","parent_id":"28"},
{"answer_id":"10","answer_english":"Srikakulam","answer_hindi":"श्रीकाकुलम","parent_id":"1"},
{"answer_id":"244","answer_english":"Srinagar","answer_hindi":"श्रीनगर","parent_id":"14"},
{"answer_id":"487","answer_english":"Subarnapur(Sonepur)","answer_hindi":"सुबर्णपुर (सोनपुर)","parent_id":"26"},
{"answer_id":"140","answer_english":"Sukma","answer_hindi":"सुकमा","parent_id":"7"},
{"answer_id":"703","answer_english":"Sultanpur","answer_hindi":"सुल्तानपुर","parent_id":"34"},
{"answer_id":"488","answer_english":"Sundargarh","answer_hindi":"सुन्दरगड़","parent_id":"26"},
{"answer_id":"111","answer_english":"Supaul","answer_hindi":"सुपौल","parent_id":"5"},
{"answer_id":"141","answer_english":"Surajpur","answer_hindi":"सूरजपुर","parent_id":"7"},
{"answer_id":"187","answer_english":"Surat","answer_hindi":"सूरत","parent_id":"11"},
{"answer_id":"188","answer_english":"Surendranagar","answer_hindi":"सुरेंद्रनगर","parent_id":"11"},
{"answer_id":"142","answer_english":"Surguja","answer_hindi":"सरगुजा","parent_id":"7"},
{"answer_id":"617","answer_english":"Suryapet","answer_hindi":"सूर्यापेट","parent_id":"32"},
{"answer_id":"417","answer_english":"Tamenglong","answer_hindi":"तमेंगलॉन्ग जिला","parent_id":"22"},
{"answer_id":"189","answer_english":"Tapi","answer_hindi":"तापी","parent_id":"11"},
{"answer_id":"514","answer_english":"Tarn Taran","answer_hindi":"तरन तारन साहिब","parent_id":"28"},
{"answer_id":"35","answer_english":"Tawang","answer_hindi":"तवांग","parent_id":"3"},
{"answer_id":"716","answer_english":"Tehri Garhwal","answer_hindi":"टिहरी गढ़वाल","parent_id":"35"},
{"answer_id":"421","answer_english":"Tengnoupal","answer_hindi":"तेंगनोउपल ","parent_id":"22"},
{"answer_id":"576","answer_english":"Tenkasi","answer_hindi":"तेनकाशी","parent_id":"31"},
{"answer_id":"405","answer_english":"Thane","answer_hindi":"ठाणे","parent_id":"21"},
{"answer_id":"581","answer_english":"Thanjavur","answer_hindi":"तंजावुर","parent_id":"31"},
{"answer_id":"579","answer_english":"Theni","answer_hindi":"तेनी","parent_id":"31"},
{"answer_id":"312","answer_english":"Thiruvananthapuram","answer_hindi":"तिरुवनन्तपुरम ","parent_id":"17"},
{"answer_id":"582","answer_english":"Thoothukudi","answer_hindi":"तूतुकुड़ी","parent_id":"31"},
{"answer_id":"410","answer_english":"Thoubal","answer_hindi":"थौबल जिला","parent_id":"22"},
{"answer_id":"313","answer_english":"Thrissur","answer_hindi":"त्रिस्सूर ","parent_id":"17"},
{"answer_id":"358","answer_english":"Tikamgarh ","answer_hindi":"टीकमगढ़","parent_id":"20"},
{"answer_id":"73","answer_english":"Tinsukia","answer_hindi":"तिनसुकिया","parent_id":"4"},
{"answer_id":"36","answer_english":"Tirap","answer_hindi":"तिराप","parent_id":"3"},
{"answer_id":"578","answer_english":"Tiruchirappalli","answer_hindi":"तिरुचिरापल्ली","parent_id":"31"},
{"answer_id":"580","answer_english":"Tirunelveli","answer_hindi":"तिरूनेलवेली","parent_id":"31"},
{"answer_id":"583","answer_english":"Tirupattur","answer_hindi":"तिरुपत्तुर","parent_id":"31"},
{"answer_id":"577","answer_english":"Tirupur","answer_hindi":"तिरुपुर","parent_id":"31"},
{"answer_id":"584","answer_english":"Tiruvallur","answer_hindi":"तिरुवल्लुर","parent_id":"31"},
{"answer_id":"586","answer_english":"Tiruvannamalai","answer_hindi":"तिरुवन्नामलई","parent_id":"31"},
{"answer_id":"585","answer_english":"Tiruvarur","answer_hindi":"तिरुवारुर","parent_id":"31"},
{"answer_id":"546","answer_english":"Tonk","answer_hindi":"टोंक","parent_id":"29"},
{"answer_id":"455","answer_english":"Tuensang","answer_hindi":"ट्वेनसांग","parent_id":"25"},
{"answer_id":"296","answer_english":"Tumkur","answer_hindi":"तुमकूर","parent_id":"16"},
{"answer_id":"547","answer_english":"Udaipur","answer_hindi":"उदयपुर","parent_id":"29"},
{"answer_id":"74","answer_english":"Udalguri","answer_hindi":"उदलगुड़ी","parent_id":"4"},
{"answer_id":"717","answer_english":"Udham Singh Nagar","answer_hindi":"उधमसिंह नगर","parent_id":"35"},
{"answer_id":"245","answer_english":"Udhampur","answer_hindi":"उधमपुर","parent_id":"14"},
{"answer_id":"297","answer_english":"Udupi","answer_hindi":"उडुपी","parent_id":"16"},
{"answer_id":"369","answer_english":"Ujjain","answer_hindi":"उज्जैन","parent_id":"20"},
{"answer_id":"414","answer_english":"Ukhrul","answer_hindi":"उखरुल जिला","parent_id":"22"},
{"answer_id":"362","answer_english":"Umaria ","answer_hindi":"उमरिया","parent_id":"20"},
{"answer_id":"225","answer_english":"Una","answer_hindi":"उना","parent_id":"13"},
{"answer_id":"630","answer_english":"Unakoti","answer_hindi":"उनाकोटी","parent_id":"33"},
{"answer_id":"704","answer_english":"Unnao","answer_hindi":"उन्नाव","parent_id":"34"},
{"answer_id":"37","answer_english":"Upper Dibang Valley","answer_hindi":"ऊपरी दिबांग घाटी","parent_id":"3"},
{"answer_id":"38","answer_english":"Upper Siang","answer_hindi":"ऊपरी सियांग","parent_id":"3"},
{"answer_id":"39","answer_english":"Upper Subansiri","answer_hindi":"ऊपरी सुबनसिरी","parent_id":"3"},
{"answer_id":"741","answer_english":"Uttar Dinajpur","answer_hindi":"उत्तर दिनाजपुर","parent_id":"36"},
{"answer_id":"298","answer_english":"Uttara Kannada","answer_hindi":"उत्तर कन्नड़","parent_id":"16"},
{"answer_id":"718","answer_english":"Uttarkashi","answer_hindi":"उत्तरकाशी","parent_id":"35"},
{"answer_id":"190","answer_english":"Vadodara","answer_hindi":"वड़ोदरा","parent_id":"11"},
{"answer_id":"112","answer_english":"Vaishali","answer_hindi":"वैशाली","parent_id":"5"},
{"answer_id":"191","answer_english":"Valsad","answer_hindi":"वलसाड","parent_id":"11"},
{"answer_id":"705","answer_english":"Varanasi","answer_hindi":"वाराणसी","parent_id":"34"},
{"answer_id":"587","answer_english":"Vellore","answer_hindi":"वेल्लूर","parent_id":"31"},
{"answer_id":"322","answer_english":"Vidisha ","answer_hindi":"विदिशा","parent_id":"20"},
{"answer_id":"299","answer_english":"Vijayanagara","answer_hindi":"विजयनगर","parent_id":"16"},
{"answer_id":"618","answer_english":"Vikarabad","answer_hindi":"विक़ाराबाद","parent_id":"32"},
{"answer_id":"588","answer_english":"Viluppuram","answer_hindi":"विलुप्पुरम","parent_id":"31"},
{"answer_id":"589","answer_english":"Virudhunagar","answer_hindi":"विरुधुनगर","parent_id":"31"},
{"answer_id":"11","answer_english":"Visakhapatnam","answer_hindi":"विशाखापट्टनम","parent_id":"1"},
{"answer_id":"12","answer_english":"Vizianagaram","answer_hindi":"विजयनगरम","parent_id":"1"},
{"answer_id":"619","answer_english":"Wanaparthy","answer_hindi":"वानपर्ति","parent_id":"32"},
{"answer_id":"621","answer_english":"Warangal Rural","answer_hindi":"वरंगल ग्रामीण","parent_id":"32"},
{"answer_id":"620","answer_english":"Warangal Urban","answer_hindi":"वारंगल अर्बन","parent_id":"32"},
{"answer_id":"406","answer_english":"Wardha","answer_hindi":"वर्धा","parent_id":"21"},
{"answer_id":"407","answer_english":"Washim","answer_hindi":"वाशीम","parent_id":"21"},
{"answer_id":"314","answer_english":"Wayanad","answer_hindi":"वायनाड ","parent_id":"17"},
{"answer_id":"113","answer_english":"West Champaran","answer_hindi":"पश्चिमी चम्पारण जिला","parent_id":"5"},
{"answer_id":"156","answer_english":"West Delhi","answer_hindi":"पश्चिम दिल्ली","parent_id":"9"},
{"answer_id":"426","answer_english":"West Garo Hills","answer_hindi":"पश्चिम गारो हिल्स","parent_id":"23"},
{"answer_id":"13","answer_english":"West Godavari","answer_hindi":"पश्चिम गोदावरी","parent_id":"1"},
{"answer_id":"427","answer_english":"West Jaintia Hills","answer_hindi":"पश्चिम जयंतिया हिल्स","parent_id":"23"},
{"answer_id":"40","answer_english":"West Kameng","answer_hindi":"पश्चिम कमेंग","parent_id":"3"},
{"answer_id":"75","answer_english":"West Karbi Anglong","answer_hindi":"पश्चिम कार्बी आंगलोंग","parent_id":"4"},
{"answer_id":"428","answer_english":"West Khasi Hills","answer_hindi":"पश्चिम खासी हिल्स","parent_id":"23"},
{"answer_id":"41","answer_english":"West Siang","answer_hindi":"पश्चिम सियांग","parent_id":"3"},
{"answer_id":"551","answer_english":"West Sikkim","answer_hindi":"पश्चिम सिक्किम","parent_id":"30"},
{"answer_id":"261","answer_english":"West Singhbhum","answer_hindi":"पश्चिमी सिंहभूम ","parent_id":"15"},
{"answer_id":"629","answer_english":"West Tripura","answer_hindi":"पश्चिम त्रिपुरा","parent_id":"33"},
{"answer_id":"456","answer_english":"Wokha","answer_hindi":"वोखा","parent_id":"25"},
{"answer_id":"622","answer_english":"Yadadri Bhuvanagiri","answer_hindi":"यादाद्री भुवनगिरी","parent_id":"32"},
{"answer_id":"300","answer_english":"Yadgir","answer_hindi":"यादगीर","parent_id":"16"},
{"answer_id":"213","answer_english":"Yamuna Nagar","answer_hindi":"यमुनानगर","parent_id":"12"},
{"answer_id":"492","answer_english":"Yanam","answer_hindi":"यानम","parent_id":"27"},
{"answer_id":"408","answer_english":"Yavatmal","answer_hindi":"यवतमाळ","parent_id":"21"},
{"answer_id":"457","answer_english":"Zunheboto","answer_hindi":"ज़ुन्हेबोटो","parent_id":"25"}
                ],
            answer : "",
        },
        {
            name : "pincode",
            question_id : 14,
            question_english : "Please enter your PIN code",
            question_hindi : "जी कृपया अपना पिन कोड दर्ज करें",
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
            question_hindi : "आपकी शैक्षणिक योग्यता क्या है?",
            question_type : "selection",
            is_answered : false,
            is_skip : false,
            answers : [
                {"answer_id":"1","answer_english":"School","answer_hindi":"स्कूल"},
                {"answer_id":"2","answer_english":"Graduate","answer_hindi":"ग्रेजुएट"},
                {"answer_id":"3","answer_english":"Post graduate","answer_hindi":"पोस्ट ग्रेजुएट"},
                {"answer_id":"4","answer_english":"PhD","answer_hindi":"पीएचडी"},
            ],
            answer : "",
        },
        {
            name : "profession",
            question_id : 16,
            question_english : "What is your occupational / employment status?",
            question_hindi : "आपकी  व्यवसायिक / रोजगार स्थिति क्या है?",
            question_type : "selection",
            is_answered : false,
            is_skip : false,
            answers : [
                {"answer_id":"1","answer_english":"Student","answer_hindi":"छात्र"},
                {"answer_id":"2","answer_english":"Self Employed/ Business","answer_hindi":"स्व - रोजगार / व्यापार"},
                {"answer_id":"3","answer_english":"Private Service","answer_hindi":"प्राइवेट सर्विस"},
                {"answer_id":"4","answer_english":"Govt/ Semi Government","answer_hindi":"सरकारी / अर्ध सरकारी सेवा"},
                {"answer_id":"5","answer_english":"NGO","answer_hindi":"एनजीओ"},
                {"answer_id":"6","answer_english":"Other","answer_hindi":"अन्य"}
            ],
            answer : "",
        },
        // {
        //     name : "interested_position",
        //     question_id : 17,
        //     question_english : "At what level would you like to work on?",
        //     question_hindi : "आप किस स्तर पर काम करना चाहेंगे?",
        //     question_type : "selection",
        //     max_length : 15,
        //     is_skip : false,
        //     is_answered : false,
        //     answers : [
        //         {"answer_id":"1","answer_english":"National","answer_hindi":"राष्ट्रीय"},
        //         {"answer_id":"2","answer_english":"State","answer_hindi":"राज्य"},
        //         {"answer_id":"3","answer_english":"District","answer_hindi":"जिला"},
        //     ],
        //     answer : "",
        // },
        {
            name : "prefered_working_hours",
            question_id : 18,
            question_english : "How many hours per day are you willing to devote to working with the Congress social media team?",
            question_hindi : "आप प्रति दिन कितने घंटे कांग्रेस सोशल मीडिया टीम के साथ काम करने के लिए समर्पित करने के लिए तैयार हैं?",
            question_type : "selection",
            is_answered : false,
            is_skip : false,
            answers : [
                {"answer_id":"1","answer_english":"1-2 Hours","answer_hindi":"1-2 घंटे"},
                {"answer_id":"2","answer_english":"2-4 Hours","answer_hindi":"2-4 घंटे"},
                {"answer_id":"3","answer_english":"4-6 Hours","answer_hindi":"4-6 घंटे"},
                {"answer_id":"4","answer_english":"More than 6 Hours","answer_hindi":"6 घंटे से ज्यादा"},
            ],
            answer : "",
        },
        {
            name : "prefered_working",
            question_id : 19,
            question_english : " In which of the following areas are you willing to work with the Congress social media team?",
            question_hindi : "आप निम्नलिखित में से किस क्षेत्र में कांग्रेस सोशल मीडिया टीम के साथ काम करने के इच्छुक हैं?",
            max_check : 15,
            question_type : "checkbox",
            is_answered : false,
            is_skip : false,
            answers : [
                {"answer_id":"1","answer_english":"Training","answer_hindi":"ट्रेनिंग"},
                {"answer_id":"2","answer_english":"Research","answer_hindi":"रिसर्च"},
                {"answer_id":"3","answer_english":"Content (writing)","answer_hindi":"कंटेंट लेखन"},
                {"answer_id":"4","answer_english":"Content Creation (Video, Audio, Graphics)","answer_hindi":"कंटेंट क्रिएशन (वीडियो / ऑडियो / ग्राफिक्स)"},
                {"answer_id":"5","answer_english":"Outreach / Team Development","answer_hindi":"आउटरीच / टीम तैयार करना"},
                {"answer_id":"6","answer_english":"Content Dissemination / Viral","answer_hindi":"कंटेंट वितरण"},
            ],
            answer : "",
        },
        {
            name : "activity_area",
            question_id : 20,
            question_english : "If there is any other area or activity you want to involve with the social media team (not mentioned in the previous options), please let us know.",
            question_hindi : "यदि कोई अन्य क्षेत्र या गतिविधि आप सोशल मीडिया टीम (पिछले विकल्पों में उल्लिखित नहीं) के साथ शामिल करना चाहते हैं, तो कृपया हमें बताएं.",
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
            question_hindi : "आप इनमें से किस सोशल मीडिया प्लेटफॉर्म पर ज्यादा सक्रिय हैं?",
            question_type : "checkbox",
            max_check : 15,
            is_answered : false,
            is_skip : false,
            answers : [
                {"answer_id":"2","answer_english":"Facebook","answer_hindi":"फेसबुक"},
                {"answer_id":"1","answer_english":"WhatsApp","answer_hindi":"व्हाट्सएप"},
                {"answer_id":"3","answer_english":"Twitter","answer_hindi":"ट्विटर"},
                {"answer_id":"5","answer_english":"Instagram","answer_hindi":"इंस्टाग्राम"},
                {"answer_id":"4","answer_english":"YouTube","answer_hindi":"यूट्यूब"},
                {"answer_id":"6","answer_english":"linkedIn","answer_hindi":"लिंकडिन"},
                {"answer_id":"7","answer_english":"Quora","answer_hindi":"क्वोरा"},
                {"answer_id":"5","answer_english":"Other","answer_hindi":"अन्य"},
            ],
            answer : "",
        },
        {
            name : "social_media_platforms_other",
            question_id : 22,
            question_english : "Mention your other social media platform.",
            question_hindi : "आप अन्य सोशल मीडिया प्लेटफॉर्म का उल्लेख करें.",
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
            question_hindi : "कृपया अपने सबसे सक्रिय सोशल मीडिया हैंडल का लिंक प्रदान करें. <a href='https://www.incsmw.in/assets/SocialMedia.mp4' target='_blank'>(लिंक कैसे प्राप्त करें)</a>",
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
            question_hindi : "आपका ईमेल एड्रेस लिखें",
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
            question_hindi : "आपकी प्रतिक्रिया के लिए आपका धन्यवाद। हम शीघ्र ही आपसे संपर्क करेंगे! <br /><br /> कृपया अपने दोस्तों के साथ <a href='https://www.congressmembership.com/chatbot/' target='_blank'>लिंक</a> साझा करें और उन्हें कांग्रेस के सोशल मीडिया वारियर बनने के अवसर प्रदान करें। जय हिन्द !",
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

        $rootScope.$storage.authorization = "";
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
                    answer_english : "हिंदी",  
                    answer_hindi : "हिंदी",  
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
                        answer_english : "हिंदी",  
                        answer_hindi : "हिंदी",  
                    }
                ],
                is_answered : false,
                answer : "",
            },
            {
                name : "intro",
                question_id : 2,
                question_english : "Welcome to the Social Media Warrior campaign of the Indian National Congress! <br /><br /> Under this campaign, INC Social Media team will be expanded at every village, city, state and national level in the country! <br /><br /> If you too believe in the ideology of the Congress party and want to contribute to the nation building, then let us be a part of the Congress Social Media Team! <br /><br /> You will be given responsibility at national, state or district level according to your qualifications and compatibility. <br /><br /> Let us join hands and fulfill our obligation to protect our democracy and build a modern India by being part of the world'\s largest democratic movement. <br /><br /> Please provide the following information that will help in giving you the corresponding responsibility! <br /><br /> Thank you ! <br /><br /> <iframe width='100%' height='315' src='https://www.youtube.com/embed/E7gWc7d0tOE' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>",
                question_hindi : "भारतीय राष्ट्रीय कांग्रेस के Social Media Warrior अभियान में आपका स्वागत है। <br /><br /> इस अभियान के तहत देश के हर गांव, शहर, राज्य और राष्ट्रीय स्तर पर INC Social Media टीम का विस्तार किया जाएगा। <br /><br /> अगर आप भी कांग्रेस की विचारधारा में विश्वास रखते हैं और राष्ट्रनिर्माण में अपना योगदान देना चाहते हैं तो आइए कांग्रेस सोशल मीडिया टीम का हिस्सा बनिए। <br /><br /> आपकी योग्यता और क्षमता के अनुसार आपको राष्ट्रीय, राज्य या जिला स्तर पर जिम्मेदारी दी जाएगी। <br /><br /> आइए हाथ से हाथ मिलाएं और विश्व के सबसे बडे लोकतांत्रिक आंदोलन का हिस्सा बन कर हमारे लोकतंत्र की रक्षा और आधुनिक भारत के निर्माण का हमारा दायित्व पूरा करें। <br /><br /> कृपया निम्न जानकारी दें जिससे आपके अनुरूप जिम्मेदारी देने में सहायता मिले। <br /><br /> धन्यवाद  <iframe width='100%' height='315' src='https://www.youtube.com/embed/ju1yZKzapnw' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>", 
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
                question_hindi : "कृपया आपका नाम और उपनाम लिखें",
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
                question_hindi : "आपका फोन नंबर?",
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
                question_hindi : "आपका मोबाइल नंबर पहले से पंजीकृत है। धन्यवाद।",
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
                question_hindi : "आपको एक OTP प्राप्त हुआ होगा। कृपया OTP टाइप करें",
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
                question_hindi : "वैरिफिकेशन कोड गलत है.",
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
                question_hindi : "क्या यह आपका व्हाट्सएप नंबर भी है?",
                question_type : "option",
                is_skip : false,
                is_answered : false,
                answers : [
                    {
                        answer_id : "1",
                        answer_english : "Yes",
                        answer_hindi : "हाँ",
                    },
                    {
                        answer_id : "2",
                        answer_english : "No",  
                        answer_hindi : "नहीं",  
                    }
                ],
                answer : "",
            },
            {
                name : "whatsapp_number",
                question_id : 11,
                question_english : "What is your WhatsApp number?",
                question_hindi : "आपका व्हाट्सएप नंबर क्या है?",
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
                question_hindi : "आप किस राज्य या केंद्र शासित प्रदेश से हैं?",
                question_type : "selection",
                is_answered : false,
                is_skip : false,
                answers : [
                    {"answer_id":"2","answer_english":"Andaman and Nicobar","answer_hindi":"अण्डमान और निकोबार"},
                    {"answer_id":"1","answer_english":"Andhra Pradesh","answer_hindi":"आंध्र प्रदेश"},
                    {"answer_id":"3","answer_english":"Arunachal Pradesh","answer_hindi":"अरुणाचल प्रदेश"},
                    {"answer_id":"4","answer_english":"Assam","answer_hindi":"असम"},
                    {"answer_id":"5","answer_english":"Bihar","answer_hindi":"बिहार"},
                    {"answer_id":"6","answer_english":"Chandigarh","answer_hindi":"चण्डीगढ़"},
                    {"answer_id":"7","answer_english":"Chhattisgarh","answer_hindi":"छत्तीसगढ़"},
                    {"answer_id":"8","answer_english":"Dadra and Nagar Haveli and Daman and Diu","answer_hindi":"दादरा नगर हवेली और दमन और दीव"},
                    {"answer_id":"9","answer_english":"Delhi","answer_hindi":"दिल्ली"},
                    {"answer_id":"10","answer_english":"Goa","answer_hindi":"गोवा"},
                    {"answer_id":"11","answer_english":"Gujarat","answer_hindi":"गुजरात"},
                    {"answer_id":"12","answer_english":"Haryana","answer_hindi":"हरियाणा"},
                    {"answer_id":"13","answer_english":"Himachal Pradesh","answer_hindi":"हिमाचल प्रदेश"},
                    {"answer_id":"14","answer_english":"Jammu and Kashmir","answer_hindi":"जम्मू कश्मीर"},
                    {"answer_id":"15","answer_english":"Jharkhand","answer_hindi":"झारखण्ड"},
                    {"answer_id":"16","answer_english":"Karnataka","answer_hindi":"कर्नाटक"},
                    {"answer_id":"17","answer_english":"Kerala","answer_hindi":"केरल"},
                    {"answer_id":"18","answer_english":"Ladakh","answer_hindi":"लद्दाख"},
                    {"answer_id":"19","answer_english":"Lakshadweep","answer_hindi":"लक्षद्वीप"},
                    {"answer_id":"20","answer_english":"Madhya Pradesh","answer_hindi":"मध्यप्रदेश"},
                    {"answer_id":"21","answer_english":"Maharastra","answer_hindi":"महाराष्ट्र"},
                    {"answer_id":"22","answer_english":"Manipur","answer_hindi":"मणिपुर"},
                    {"answer_id":"23","answer_english":"Meghalaya","answer_hindi":"मेघालय"},
                    {"answer_id":"24","answer_english":"Mizoram","answer_hindi":"मिज़ोरम"},
                    {"answer_id":"25","answer_english":"Nagaland","answer_hindi":"नागालैण्ड"},
                    {"answer_id":"26","answer_english":"Odisha","answer_hindi":"ओड़िशा"},
                    {"answer_id":"27","answer_english":"Puducherry","answer_hindi":"पुदुचेरी"},
                    {"answer_id":"28","answer_english":"Punjab","answer_hindi":"पंजाब"},
                    {"answer_id":"29","answer_english":"Rajasthan","answer_hindi":"राजस्थान"},
                    {"answer_id":"30","answer_english":"Sikkim","answer_hindi":"सिक्किम"},
                    {"answer_id":"31","answer_english":"Tamil Nadu","answer_hindi":"तमिलनाडु"},
                    {"answer_id":"32","answer_english":"Telangana","answer_hindi":"तेलंगाना"},
                    {"answer_id":"33","answer_english":"Tripura","answer_hindi":"त्रिपुरा"},
                    {"answer_id":"34","answer_english":"Uttar Pradesh","answer_hindi":"उत्तर प्रदेश"},
                    {"answer_id":"35","answer_english":"Uttarakhand","answer_hindi":"उत्तराखण्ड"},
                    {"answer_id":"36","answer_english":"West Bengal","answer_hindi":"पश्चिम बंगाल"}
                ],
                answer : "",
            },
            {
                name : "district_id",
                question_id : 13,
                question_english : "Which district are you from?",
                question_hindi : "आप किस जिले से हैं",
                question_type : "selection",
                is_answered : false,
                is_parent_check : true,
                is_skip : false,
                answers :[
                   {"answer_id":"590","answer_english":"Adilabad","answer_hindi":"आदिलाबाद","parent_id":"32"},
{"answer_id":"363","answer_english":"Agar Malwa","answer_hindi":"आगर मालवा","parent_id":"20"},
{"answer_id":"631","answer_english":"Agra","answer_hindi":"आगरा","parent_id":"34"},
{"answer_id":"159","answer_english":"Ahmedabad","answer_hindi":"अहमदाबाद","parent_id":"11"},
{"answer_id":"373","answer_english":"Ahmednagar","answer_hindi":"अहमदनगर","parent_id":"21"},
{"answer_id":"436","answer_english":"Aizawl","answer_hindi":"अइज़ोल","parent_id":"24"},
{"answer_id":"515","answer_english":"Ajmer","answer_hindi":"अजमेर","parent_id":"29"},
{"answer_id":"374","answer_english":"Akola","answer_hindi":"अकोला","parent_id":"21"},
{"answer_id":"301","answer_english":"Alappuzha","answer_hindi":"आलाप्पुड़ा","parent_id":"17"},
{"answer_id":"632","answer_english":"Aligarh","answer_hindi":"अलीगढ","parent_id":"34"},
{"answer_id":"719","answer_english":"Alipurduar","answer_hindi":"अलीपुरद्रार","parent_id":"36"},
{"answer_id":"331","answer_english":"Alirajpur ","answer_hindi":"अलीराजपुर","parent_id":"20"},
{"answer_id":"633","answer_english":"Allahabad","answer_hindi":"इलाहाबाद\/प्रयागराज","parent_id":"34"},
{"answer_id":"706","answer_english":"Almora","answer_hindi":"अल्मोड़ा","parent_id":"35"},
{"answer_id":"516","answer_english":"Alwar","answer_hindi":"अलवर","parent_id":"29"},
{"answer_id":"192","answer_english":"Ambala","answer_hindi":"अम्बाला","parent_id":"12"},
{"answer_id":"634","answer_english":"Ambedkar Nagar","answer_hindi":"अम्बेडकरनगर","parent_id":"34"},
{"answer_id":"635","answer_english":"Amethi","answer_hindi":"अमेठी ","parent_id":"34"},
{"answer_id":"375","answer_english":"Amravati","answer_hindi":"अमरावती","parent_id":"21"},
{"answer_id":"160","answer_english":"Amreli","answer_hindi":"अमरेली","parent_id":"11"},
{"answer_id":"493","answer_english":"Amritsar","answer_hindi":"अमृतसर","parent_id":"28"},
{"answer_id":"636","answer_english":"Amroha","answer_hindi":"अमरोहा ","parent_id":"34"},
{"answer_id":"161","answer_english":"Anand","answer_hindi":"आणंद","parent_id":"11"},
{"answer_id":"1","answer_english":"Anantapur","answer_hindi":"अनंतपुर","parent_id":"1"},
{"answer_id":"226","answer_english":"Anantnag","answer_hindi":"अनन्तनाग","parent_id":"14"},
{"answer_id":"459","answer_english":"Angul","answer_hindi":"अनुगुल","parent_id":"26"},
{"answer_id":"17","answer_english":"Anjaw","answer_hindi":"अंजॉ","parent_id":"3"},
{"answer_id":"360","answer_english":"Anuppur ","answer_hindi":"अनूपपुर","parent_id":"20"},
{"answer_id":"76","answer_english":"Araria","answer_hindi":"अररिया","parent_id":"5"},
{"answer_id":"162","answer_english":"Aravalli","answer_hindi":"अरावली","parent_id":"11"},
{"answer_id":"552","answer_english":"Ariyalur","answer_hindi":"अरियालूर","parent_id":"31"},
{"answer_id":"77","answer_english":"Arwal","answer_hindi":"अरवल","parent_id":"5"},
{"answer_id":"327","answer_english":"Ashoknagar","answer_hindi":"अशोक नगर","parent_id":"20"},
{"answer_id":"637","answer_english":"Auraiya","answer_hindi":"औरैया","parent_id":"34"},
{"answer_id":"78","answer_english":"Aurangabad","answer_hindi":"औरंगाबाद","parent_id":"5"},
{"answer_id":"376","answer_english":"Aurangabad","answer_hindi":"औरंगाबाद","parent_id":"21"},
{"answer_id":"638","answer_english":"Azamgarh","answer_hindi":"आजमगढ","parent_id":"34"},
{"answer_id":"270","answer_english":"Bagalkot","answer_hindi":"बागलकोट","parent_id":"16"},
{"answer_id":"707","answer_english":"Bageshwar","answer_hindi":"बागेश्वर","parent_id":"35"},
{"answer_id":"639","answer_english":"Bagpat","answer_hindi":"बागपत ","parent_id":"34"},
{"answer_id":"640","answer_english":"Bahraich","answer_hindi":"बहराइच","parent_id":"34"},
{"answer_id":"43","answer_english":"Bajali","answer_hindi":"बजाली","parent_id":"4"},
{"answer_id":"42","answer_english":"Baksa","answer_hindi":"बक्सा","parent_id":"4"},
{"answer_id":"339","answer_english":"Balaghat ","answer_hindi":"बालाघाट","parent_id":"20"},
{"answer_id":"461","answer_english":"Balangir","answer_hindi":"बलांगिर","parent_id":"26"},
{"answer_id":"641","answer_english":"Balarampur","answer_hindi":"बलरामपुर","parent_id":"34"},
{"answer_id":"463","answer_english":"Balasore","answer_hindi":"बालेश्वर","parent_id":"26"},
{"answer_id":"642","answer_english":"Ballia","answer_hindi":"बलिया","parent_id":"34"},
{"answer_id":"115","answer_english":"Balod","answer_hindi":"बालोद","parent_id":"7"},
{"answer_id":"116","answer_english":"Baloda Bazar","answer_hindi":"बलौदा बाजार","parent_id":"7"},
{"answer_id":"117","answer_english":"Balrampur","answer_hindi":"बलरामपुर","parent_id":"7"},
{"answer_id":"163","answer_english":"Banaskantha","answer_hindi":"बनासकांठा","parent_id":"11"},
{"answer_id":"643","answer_english":"Banda","answer_hindi":"बाँदा","parent_id":"34"},
{"answer_id":"228","answer_english":"Bandipora","answer_hindi":"बांदीपुरा","parent_id":"14"},
{"answer_id":"272","answer_english":"Bangalore Rural","answer_hindi":"बंगलोर ग्रामीण","parent_id":"16"},
{"answer_id":"271","answer_english":"Bangalore Urban","answer_hindi":"बंगलोर शहरी","parent_id":"16"},
{"answer_id":"79","answer_english":"Banka","answer_hindi":"बाँका","parent_id":"5"},
{"answer_id":"720","answer_english":"Bankura","answer_hindi":"बाँकुड़ा","parent_id":"36"},
{"answer_id":"519","answer_english":"Banswara","answer_hindi":"बांसवाड़ा","parent_id":"29"},
{"answer_id":"644","answer_english":"Barabanki","answer_hindi":"बाराबंकी","parent_id":"34"},
{"answer_id":"229","answer_english":"Baramulla","answer_hindi":"बारामूला","parent_id":"14"},
{"answer_id":"521","answer_english":"Baran","answer_hindi":"बारां","parent_id":"29"},
{"answer_id":"645","answer_english":"Bareilly","answer_hindi":"बरेली","parent_id":"34"},
{"answer_id":"462","answer_english":"Bargarh","answer_hindi":"बरगढ़","parent_id":"26"},
{"answer_id":"518","answer_english":"Barmer","answer_hindi":"बाड़मेर","parent_id":"29"},
{"answer_id":"494","answer_english":"Barnala","answer_hindi":"बरनाला","parent_id":"28"},
{"answer_id":"44","answer_english":"Barpeta","answer_hindi":"बारपेटा","parent_id":"4"},
{"answer_id":"332","answer_english":"Barwani ","answer_hindi":"बड़वानी","parent_id":"20"},
{"answer_id":"118","answer_english":"Bastar","answer_hindi":"बस्तर","parent_id":"7"},
{"answer_id":"646","answer_english":"Basti","answer_hindi":"बस्ती","parent_id":"34"},
{"answer_id":"495","answer_english":"Bathinda","answer_hindi":"भटिण्डा","parent_id":"28"},
{"answer_id":"377","answer_english":"Beed","answer_hindi":"बीड","parent_id":"21"},
{"answer_id":"80","answer_english":"Begusarai","answer_hindi":"बेगूसराय","parent_id":"5"},
{"answer_id":"273","answer_english":"Belgaum","answer_hindi":"बेलगाम","parent_id":"16"},
{"answer_id":"274","answer_english":"Bellary","answer_hindi":"बेल्लारी","parent_id":"16"},
{"answer_id":"119","answer_english":"Bemetara","answer_hindi":"बेमेतरा","parent_id":"7"},
{"answer_id":"347","answer_english":"Betul ","answer_hindi":"बैतूल","parent_id":"20"},
{"answer_id":"647","answer_english":"Bhadohi","answer_hindi":"भदोही ","parent_id":"34"},
{"answer_id":"592","answer_english":"Bhadradri Kothagudem","answer_hindi":"भद्राद्री कोठागुडम","parent_id":"32"},
{"answer_id":"464","answer_english":"Bhadrak","answer_hindi":"भद्रक","parent_id":"26"},
{"answer_id":"81","answer_english":"Bhagalpur","answer_hindi":"भागलपुर","parent_id":"5"},
{"answer_id":"378","answer_english":"Bhandara","answer_hindi":"भंडारा","parent_id":"21"},
{"answer_id":"520","answer_english":"Bharatpur","answer_hindi":"भरतपुर","parent_id":"29"},
{"answer_id":"164","answer_english":"Bharuch","answer_hindi":"भरुच","parent_id":"11"},
{"answer_id":"165","answer_english":"Bhavnagar","answer_hindi":"भावनगर","parent_id":"11"},
{"answer_id":"523","answer_english":"Bhilwara","answer_hindi":"भीलवाड़ा","parent_id":"29"},
{"answer_id":"325","answer_english":"Bhind ","answer_hindi":"भिंड","parent_id":"20"},
{"answer_id":"193","answer_english":"Bhiwani","answer_hindi":"भिवानी","parent_id":"12"},
{"answer_id":"82","answer_english":"Bhojpur","answer_hindi":"भोजपुर","parent_id":"5"},
{"answer_id":"318","answer_english":"Bhopal ","answer_hindi":"भोपाल","parent_id":"20"},
{"answer_id":"275","answer_english":"Bidar","answer_hindi":"बीदर","parent_id":"16"},
{"answer_id":"276","answer_english":"Bijapur","answer_hindi":"बीजापुर","parent_id":"16"},
{"answer_id":"120","answer_english":"Bijapur","answer_hindi":"बीजापुर","parent_id":"7"},
{"answer_id":"648","answer_english":"Bijnor","answer_hindi":"बिजनौर","parent_id":"34"},
{"answer_id":"517","answer_english":"Bikaner","answer_hindi":"बीकानेर","parent_id":"29"},
{"answer_id":"121","answer_english":"Bilaspur","answer_hindi":"बिलासपुर","parent_id":"7"},
{"answer_id":"214","answer_english":"Bilaspur","answer_hindi":"बिलासपुर","parent_id":"13"},
{"answer_id":"723","answer_english":"Birbhum","answer_hindi":"बीरभूम","parent_id":"36"},
{"answer_id":"409","answer_english":"Bishnupur","answer_hindi":"बिष्णुपुर जिला","parent_id":"22"},
{"answer_id":"45","answer_english":"Biswanath","answer_hindi":"बिश्वनाथ","parent_id":"4"},
{"answer_id":"254","answer_english":"Bokaro","answer_hindi":"बोकारो","parent_id":"15"},
{"answer_id":"46","answer_english":"Bongaigaon","answer_hindi":"बंगाईगाँव","parent_id":"4"},
{"answer_id":"166","answer_english":"Botad","answer_hindi":"बोटाड","parent_id":"11"},
{"answer_id":"460","answer_english":"Boudh","answer_hindi":"बौध","parent_id":"26"},
{"answer_id":"649","answer_english":"Budaun","answer_hindi":"बदायूं ","parent_id":"34"},
{"answer_id":"227","answer_english":"Budgam","answer_hindi":"बड़गांव","parent_id":"14"},
{"answer_id":"650","answer_english":"Bulandshahr","answer_hindi":"बुलंदशहर","parent_id":"34"},
{"answer_id":"379","answer_english":"Buldhana","answer_hindi":"बुलढाणा","parent_id":"21"},
{"answer_id":"522","answer_english":"Bundi","answer_hindi":"बूंदी","parent_id":"29"},
{"answer_id":"333","answer_english":"Burhanpur ","answer_hindi":"बुरहानपुर","parent_id":"20"},
{"answer_id":"83","answer_english":"Buxar","answer_hindi":"बक्सर","parent_id":"5"},
{"answer_id":"47","answer_english":"Cachar","answer_hindi":"कछर","parent_id":"4"},
{"answer_id":"147","answer_english":"Central Delhi ","answer_hindi":"मध्य दिल्ली","parent_id":"9"},
{"answer_id":"370","answer_english":"Chachaura-Binaganj","answer_hindi":"चाचौड़ा","parent_id":"20"},
{"answer_id":"277","answer_english":"Chamarajanagar","answer_hindi":"चामराजनगर","parent_id":"16"},
{"answer_id":"215","answer_english":"Chamba","answer_hindi":"चंबा","parent_id":"13"},
{"answer_id":"708","answer_english":"Chamoli","answer_hindi":"चमोली","parent_id":"35"},
{"answer_id":"709","answer_english":"Champawat","answer_hindi":"चम्पावत","parent_id":"35"},
{"answer_id":"443","answer_english":"Champhai","answer_hindi":"चम्फाई","parent_id":"24"},
{"answer_id":"651","answer_english":"Chandauli","answer_hindi":"चंदौली","parent_id":"34"},
{"answer_id":"415","answer_english":"Chandel","answer_hindi":"चन्डेल जिला","parent_id":"22"},
{"answer_id":"114","answer_english":"Chandigarh ","answer_hindi":"चण्डीगढ़","parent_id":"6"},
{"answer_id":"380","answer_english":"Chandrapur","answer_hindi":"चंद्रपुर","parent_id":"21"},
{"answer_id":"18","answer_english":"Changlang","answer_hindi":"चांगलांग","parent_id":"3"},
{"answer_id":"48","answer_english":"Charaideo","answer_hindi":"चराइदेउ","parent_id":"4"},
{"answer_id":"194","answer_english":"Charkhi Dadri","answer_hindi":"चरखी दादरी","parent_id":"12"},
{"answer_id":"249","answer_english":"Chatra","answer_hindi":"चतरा","parent_id":"15"},
{"answer_id":"553","answer_english":"Chengalpattu","answer_hindi":"चेंगलपट्टु","parent_id":"31"},
{"answer_id":"554","answer_english":"Chennai","answer_hindi":"चेन्नई","parent_id":"31"},
{"answer_id":"354","answer_english":"Chhatarpur ","answer_hindi":"छतरपुर","parent_id":"20"},
{"answer_id":"340","answer_english":"Chhindwara ","answer_hindi":"छिंदवाड़ा","parent_id":"20"},
{"answer_id":"167","answer_english":"Chhota Udaipur","answer_hindi":"छोटा उदयपुर","parent_id":"11"},
{"answer_id":"278","answer_english":"Chikballapur","answer_hindi":"चिकबलापुरा","parent_id":"16"},
{"answer_id":"279","answer_english":"Chikmagalur","answer_hindi":"चिकमगलूर","parent_id":"16"},
{"answer_id":"49","answer_english":"Chirang","answer_hindi":"चिरांग","parent_id":"4"},
{"answer_id":"280","answer_english":"Chitradurga","answer_hindi":"चित्रदुर्ग","parent_id":"16"},
{"answer_id":"652","answer_english":"Chitrakoot","answer_hindi":"चित्रकूट","parent_id":"34"},
{"answer_id":"2","answer_english":"Chittoor","answer_hindi":"चित्तूर","parent_id":"1"},
{"answer_id":"525","answer_english":"Chittorgarh","answer_hindi":"चित्तौड़गढ़","parent_id":"29"},
{"answer_id":"416","answer_english":"Churachandpur","answer_hindi":"चुराचांदपुर जिला","parent_id":"22"},
{"answer_id":"524","answer_english":"Churu","answer_hindi":"चुरु","parent_id":"29"},
{"answer_id":"555","answer_english":"Coimbatore","answer_hindi":"कोयम्बतूर","parent_id":"31"},
{"answer_id":"724","answer_english":"Cooch Behar","answer_hindi":"कूचबिहार","parent_id":"36"},
{"answer_id":"556","answer_english":"Cuddalore","answer_hindi":"कुड्डलोर","parent_id":"31"},
{"answer_id":"465","answer_english":"Cuttack","answer_hindi":"कटक","parent_id":"26"},
{"answer_id":"145","answer_english":"Dadra and Nagar Haveli","answer_hindi":"दादरा नगर हवेली","parent_id":"8"},
{"answer_id":"168","answer_english":"Dahod","answer_hindi":"दाहोद","parent_id":"11"},
{"answer_id":"725","answer_english":"Dakshin Dinajpur","answer_hindi":"दक्षिण दिनाजपुर","parent_id":"36"},
{"answer_id":"281","answer_english":"Dakshina Kannada","answer_hindi":"दक्षिण कन्नड़","parent_id":"16"},
{"answer_id":"143","answer_english":"Daman","answer_hindi":"दमन ","parent_id":"8"},
{"answer_id":"355","answer_english":"Damoh ","answer_hindi":"दमोह","parent_id":"20"},
{"answer_id":"169","answer_english":"Dang","answer_hindi":"डांग","parent_id":"11"},
{"answer_id":"122","answer_english":"Dantewada","answer_hindi":"दन्तेवाड़ा  (दक्षिण बस्तर)","parent_id":"7"},
{"answer_id":"84","answer_english":"Darbhanga","answer_hindi":"दरभंगा","parent_id":"5"},
{"answer_id":"726","answer_english":"Darjeeling","answer_hindi":"दार्जिलिंग","parent_id":"36"},
{"answer_id":"50","answer_english":"Darrang","answer_hindi":"दारांग","parent_id":"4"},
{"answer_id":"329","answer_english":"Datia ","answer_hindi":"दतिया","parent_id":"20"},
{"answer_id":"526","answer_english":"Dausa","answer_hindi":"दौसा","parent_id":"29"},
{"answer_id":"282","answer_english":"Davanagere","answer_hindi":"दावणगेरे","parent_id":"16"},
{"answer_id":"466","answer_english":"Debagarh","answer_hindi":"देवगड़","parent_id":"26"},
{"answer_id":"710","answer_english":"Dehradun","answer_hindi":"देहरादून","parent_id":"35"},
{"answer_id":"265","answer_english":"Deoghar","answer_hindi":"देवघर","parent_id":"15"},
{"answer_id":"653","answer_english":"Deoria","answer_hindi":"देवरिया","parent_id":"34"},
{"answer_id":"170","answer_english":"Devbhoomi Dwarka","answer_hindi":"देवभूमि द्वारका","parent_id":"11"},
{"answer_id":"364","answer_english":"Dewas","answer_hindi":"देवास","parent_id":"20"},
{"answer_id":"623","answer_english":"Dhalai","answer_hindi":"धलाई","parent_id":"33"},
{"answer_id":"123","answer_english":"Dhamtari","answer_hindi":"धमतरी","parent_id":"7"},
{"answer_id":"255","answer_english":"Dhanbad","answer_hindi":"धनबाद","parent_id":"15"},
{"answer_id":"335","answer_english":"Dhar ","answer_hindi":"धार","parent_id":"20"},
{"answer_id":"557","answer_english":"Dharmapuri","answer_hindi":"धर्मपुरी","parent_id":"31"},
{"answer_id":"283","answer_english":"Dharwad","answer_hindi":"धारवाड़","parent_id":"16"},
{"answer_id":"51","answer_english":"Dhemaji","answer_hindi":"धेमाजी","parent_id":"4"},
{"answer_id":"467","answer_english":"Dhenkanal","answer_hindi":"ढेन्कानाल","parent_id":"26"},
{"answer_id":"527","answer_english":"Dholpur","answer_hindi":"धौलपुर","parent_id":"29"},
{"answer_id":"52","answer_english":"Dhubri","answer_hindi":"धुबरी","parent_id":"4"},
{"answer_id":"381","answer_english":"Dhule","answer_hindi":"धुले","parent_id":"21"},
{"answer_id":"53","answer_english":"Dibrugarh","answer_hindi":"डिब्रूगढ़","parent_id":"4"},
{"answer_id":"54","answer_english":"Dima Hasao","answer_hindi":"दिमा हसाओ","parent_id":"4"},
{"answer_id":"447","answer_english":"Dimapur","answer_hindi":"दीमापुर","parent_id":"25"},
{"answer_id":"558","answer_english":"Dindigul","answer_hindi":"डिंडिगुल","parent_id":"31"},
{"answer_id":"346","answer_english":"Dindori ","answer_hindi":"डिंडौरी","parent_id":"20"},
{"answer_id":"144","answer_english":"Diu","answer_hindi":"दीव ","parent_id":"8"},
{"answer_id":"230","answer_english":"Doda","answer_hindi":"डोडा","parent_id":"14"},
{"answer_id":"266","answer_english":"Dumka","answer_hindi":"दुमका","parent_id":"15"},
{"answer_id":"528","answer_english":"Dungarpur","answer_hindi":"डूंगरपुर","parent_id":"29"},
{"answer_id":"124","answer_english":"Durg","answer_hindi":"दुर्ग","parent_id":"7"},
{"answer_id":"85","answer_english":"East Champaran","answer_hindi":"पूर्वी चम्पारण जिला","parent_id":"5"},
{"answer_id":"148","answer_english":"East Delhi","answer_hindi":"पूर्वी दिल्ली","parent_id":"9"},
{"answer_id":"429","answer_english":"East Garo Hills","answer_hindi":"पूर्वी गारो हिल्स","parent_id":"23"},
{"answer_id":"3","answer_english":"East Godavari","answer_hindi":"पूर्व गोदावरी","parent_id":"1"},
{"answer_id":"434","answer_english":"East Jaintia Hills","answer_hindi":"पूर्व जयंतिया हिल्स","parent_id":"23"},
{"answer_id":"19","answer_english":"East Kameng","answer_hindi":"पूर्व कमेंग","parent_id":"3"},
{"answer_id":"425","answer_english":"East Khasi Hills","answer_hindi":"पूर्वी खासी हिल्स","parent_id":"23"},
{"answer_id":"20","answer_english":"East Siang","answer_hindi":"पूर्व सियांग","parent_id":"3"},
{"answer_id":"548","answer_english":"East Sikkim","answer_hindi":"पूर्व सिक्किम","parent_id":"30"},
{"answer_id":"263","answer_english":"East Singhbhum","answer_hindi":"पूर्वी सिंहभूम","parent_id":"15"},
{"answer_id":"302","answer_english":"Ernakulam","answer_hindi":"एर्नाकुलम","parent_id":"17"},
{"answer_id":"559","answer_english":"Erode","answer_hindi":"ईरोड","parent_id":"31"},
{"answer_id":"654","answer_english":"Etah","answer_hindi":"एटा","parent_id":"34"},
{"answer_id":"655","answer_english":"Etawah","answer_hindi":"इटावा","parent_id":"34"},
{"answer_id":"656","answer_english":"Faizabad","answer_hindi":"फैज़ाबाद शहर (अयोध्या)","parent_id":"34"},
{"answer_id":"195","answer_english":"Faridabad","answer_hindi":"फरीदाबाद","parent_id":"12"},
{"answer_id":"497","answer_english":"Faridkot","answer_hindi":"फरीदकोट","parent_id":"28"},
{"answer_id":"657","answer_english":"Farrukhabad","answer_hindi":"फ़र्रूख़ाबाद","parent_id":"34"},
{"answer_id":"196","answer_english":"Fatehabad","answer_hindi":"फतेहाबाद","parent_id":"12"},
{"answer_id":"498","answer_english":"Fatehgarh Sahib","answer_hindi":"फतेहगढ़ साहिब","parent_id":"28"},
{"answer_id":"658","answer_english":"Fatehpur","answer_hindi":"फतेहपुर","parent_id":"34"},
{"answer_id":"499","answer_english":"Fazilka","answer_hindi":"फाज़िल्का ","parent_id":"28"},
{"answer_id":"659","answer_english":"Firozabad","answer_hindi":"फ़िरोजाबाद","parent_id":"34"},
{"answer_id":"496","answer_english":"Firozpur","answer_hindi":"फिरोजपुर","parent_id":"28"},
{"answer_id":"284","answer_english":"Gadag","answer_hindi":"गदग","parent_id":"16"},
{"answer_id":"382","answer_english":"Gadchiroli","answer_hindi":"गडचिरोली","parent_id":"21"},
{"answer_id":"469","answer_english":"Gajapati","answer_hindi":"गजपति","parent_id":"26"},
{"answer_id":"231","answer_english":"Ganderbal","answer_hindi":"गांदरबल","parent_id":"14"},
{"answer_id":"171","answer_english":"Gandhinagar","answer_hindi":"गांधीनगर","parent_id":"11"},
{"answer_id":"529","answer_english":"Ganganagar","answer_hindi":"श्रीगंगानगर","parent_id":"29"},
{"answer_id":"468","answer_english":"Ganjam","answer_hindi":"गंजाम","parent_id":"26"},
{"answer_id":"246","answer_english":"Garhwa","answer_hindi":"गढवा","parent_id":"15"},
{"answer_id":"125","answer_english":"Gariaband","answer_hindi":"गरियाबंद","parent_id":"7"},
{"answer_id":"126","answer_english":"Gaurella-Pendra-Marwahi","answer_hindi":"गौरेला-पेण्ड्रा-मरवाही","parent_id":"7"},
{"answer_id":"660","answer_english":"Gautam Buddha Nagar","answer_hindi":"गौतमबुद्ध नगर","parent_id":"34"},
{"answer_id":"86","answer_english":"Gaya","answer_hindi":"गया","parent_id":"5"},
{"answer_id":"661","answer_english":"Ghaziabad","answer_hindi":"गाजियाबाद","parent_id":"34"},
{"answer_id":"662","answer_english":"Ghazipur","answer_hindi":"ग़ाज़ीपुर","parent_id":"34"},
{"answer_id":"172","answer_english":"Gir Somnath","answer_hindi":"गिर सोमनाथ","parent_id":"11"},
{"answer_id":"252","answer_english":"Giridih","answer_hindi":"गिरीडीह","parent_id":"15"},
{"answer_id":"55","answer_english":"Goalpara","answer_hindi":"गोवालपारा","parent_id":"4"},
{"answer_id":"268","answer_english":"Godda","answer_hindi":"गोड्डा","parent_id":"15"},
{"answer_id":"56","answer_english":"Golaghat","answer_hindi":"गोलाघाट","parent_id":"4"},
{"answer_id":"625","answer_english":"Gomati","answer_hindi":"गोमती","parent_id":"33"},
{"answer_id":"663","answer_english":"Gonda","answer_hindi":"गोंडा","parent_id":"34"},
{"answer_id":"383","answer_english":"Gondia","answer_hindi":"गोंदिया","parent_id":"21"},
{"answer_id":"87","answer_english":"Gopalganj","answer_hindi":"गोपालगंज","parent_id":"5"},
{"answer_id":"664","answer_english":"Gorakhpur","answer_hindi":"गोरखपुर","parent_id":"34"},
{"answer_id":"285","answer_english":"Gulbarga","answer_hindi":"गुलबर्ग","parent_id":"16"},
{"answer_id":"256","answer_english":"Gumla","answer_hindi":"गुमला","parent_id":"15"},
{"answer_id":"330","answer_english":"Guna ","answer_hindi":"गुना","parent_id":"20"},
{"answer_id":"4","answer_english":"Guntur","answer_hindi":"गुंटूर","parent_id":"1"},
{"answer_id":"500","answer_english":"Gurdaspur","answer_hindi":"गुरदासपुर","parent_id":"28"},
{"answer_id":"197","answer_english":"Gurgaon","answer_hindi":"गुरुग्राम","parent_id":"12"},
{"answer_id":"326","answer_english":"Gwalior ","answer_hindi":"ग्वालियर","parent_id":"20"},
{"answer_id":"57","answer_english":"Hailakandi","answer_hindi":"हैलाकांडी","parent_id":"4"},
{"answer_id":"665","answer_english":"Hamirpur","answer_hindi":"हमीरपुर","parent_id":"34"},
{"answer_id":"216","answer_english":"Hamirpur","answer_hindi":"हमीरपुर","parent_id":"13"},
{"answer_id":"530","answer_english":"Hanumangarh","answer_hindi":"हनुमानगढ़","parent_id":"29"},
{"answer_id":"666","answer_english":"Hapur","answer_hindi":"हापुड़","parent_id":"34"},
{"answer_id":"348","answer_english":"Harda ","answer_hindi":"हरदा","parent_id":"20"},
{"answer_id":"667","answer_english":"Hardoi","answer_hindi":"हरदोई","parent_id":"34"},
{"answer_id":"711","answer_english":"Haridwar","answer_hindi":"हरिद्वार","parent_id":"35"},
{"answer_id":"286","answer_english":"Hassan","answer_hindi":"हासन","parent_id":"16"},
{"answer_id":"668","answer_english":"Hathras","answer_hindi":"हाथरस","parent_id":"34"},
{"answer_id":"287","answer_english":"Haveri","answer_hindi":"हावेरी","parent_id":"16"},
{"answer_id":"250","answer_english":"Hazaribagh","answer_hindi":"हजारीबाग","parent_id":"15"},
{"answer_id":"384","answer_english":"Hingoli","answer_hindi":"हिंगोली","parent_id":"21"},
{"answer_id":"198","answer_english":"Hissar","answer_hindi":"हिसार","parent_id":"12"},
{"answer_id":"444","answer_english":"Hnahthial","answer_hindi":"ह्नाहथिआल","parent_id":"24"},
{"answer_id":"58","answer_english":"Hojai","answer_hindi":"होजाई","parent_id":"4"},
{"answer_id":"727","answer_english":"Hooghly","answer_hindi":"हुगली","parent_id":"36"},
{"answer_id":"349","answer_english":"Hoshangabad ","answer_hindi":"होशंगाबाद","parent_id":"20"},
{"answer_id":"501","answer_english":"Hoshiarpur","answer_hindi":"होशियारपुर","parent_id":"28"},
{"answer_id":"728","answer_english":"Howrah","answer_hindi":"हावङा","parent_id":"36"},
{"answer_id":"593","answer_english":"Hyderabad","answer_hindi":"हैदराबाद","parent_id":"32"},
{"answer_id":"303","answer_english":"Idukki","answer_hindi":"इडुक्की ","parent_id":"17"},
{"answer_id":"411","answer_english":"Imphal East","answer_hindi":"इम्फाल पूर्व","parent_id":"22"},
{"answer_id":"412","answer_english":"Imphal West","answer_hindi":"इम्फाल पश्चिम","parent_id":"22"},
{"answer_id":"334","answer_english":"Indore ","answer_hindi":"इन्दौर","parent_id":"20"},
{"answer_id":"341","answer_english":"Jabalpur ","answer_hindi":"जबलपुर","parent_id":"20"},
{"answer_id":"472","answer_english":"Jagatsinghapur","answer_hindi":"जगतसिंहपुर","parent_id":"26"},
{"answer_id":"594","answer_english":"Jagtial","answer_hindi":"जगित्याल","parent_id":"32"},
{"answer_id":"534","answer_english":"Jaipur","answer_hindi":"जयपुर","parent_id":"29"},
{"answer_id":"535","answer_english":"Jaisalmer","answer_hindi":"जैसलमेर","parent_id":"29"},
{"answer_id":"471","answer_english":"Jajpur","answer_hindi":"जाजपुर","parent_id":"26"},
{"answer_id":"502","answer_english":"Jalandhar","answer_hindi":"जालंधर","parent_id":"28"},
{"answer_id":"669","answer_english":"Jalaun","answer_hindi":"जलौन","parent_id":"34"},
{"answer_id":"385","answer_english":"Jalgaon","answer_hindi":"जळगाव","parent_id":"21"},
{"answer_id":"386","answer_english":"Jalna","answer_hindi":"जालना","parent_id":"21"},
{"answer_id":"532","answer_english":"Jalore","answer_hindi":"जालौर","parent_id":"29"},
{"answer_id":"729","answer_english":"Jalpaiguri","answer_hindi":"जलपाईगुङी","parent_id":"36"},
{"answer_id":"232","answer_english":"Jammu","answer_hindi":"जम्मू","parent_id":"14"},
{"answer_id":"173","answer_english":"Jamnagar","answer_hindi":"जामनगर","parent_id":"11"},
{"answer_id":"264","answer_english":"Jamtara","answer_hindi":"जामताड़ा","parent_id":"15"},
{"answer_id":"88","answer_english":"Jamui","answer_hindi":"जमुई","parent_id":"5"},
{"answer_id":"595","answer_english":"Jangaon","answer_hindi":"जनगाँव","parent_id":"32"},
{"answer_id":"127","answer_english":"Janjgir-Champa","answer_hindi":"जांजगीर-चाम्पा","parent_id":"7"},
{"answer_id":"128","answer_english":"Jashpur","answer_hindi":"जशपुर","parent_id":"7"},
{"answer_id":"670","answer_english":"Jaunpur","answer_hindi":"जौनपुर","parent_id":"34"},
{"answer_id":"596","answer_english":"Jayashankar Bhupalpally","answer_hindi":"जयशंकर भूपलपल्ली","parent_id":"32"},
{"answer_id":"89","answer_english":"Jehanabad","answer_hindi":"जहानाबाद","parent_id":"5"},
{"answer_id":"336","answer_english":"Jhabua ","answer_hindi":"झाबुआ","parent_id":"20"},
{"answer_id":"199","answer_english":"Jhajjar","answer_hindi":"झज्जर","parent_id":"12"},
{"answer_id":"536","answer_english":"Jhalawar","answer_hindi":"झालावाड़","parent_id":"29"},
{"answer_id":"671","answer_english":"Jhansi","answer_hindi":"झाँसी","parent_id":"34"},
{"answer_id":"730","answer_english":"Jhargram","answer_hindi":"झाड़ग्राम","parent_id":"36"},
{"answer_id":"470","answer_english":"Jharsuguda","answer_hindi":"झारसुगुड़ा","parent_id":"26"},
{"answer_id":"531","answer_english":"Jhunjhunu","answer_hindi":"झुंझुनू","parent_id":"29"},
{"answer_id":"200","answer_english":"Jind","answer_hindi":"जींद","parent_id":"12"},
{"answer_id":"418","answer_english":"Jiribam","answer_hindi":"जिरिबाम","parent_id":"22"},
{"answer_id":"533","answer_english":"Jodhpur","answer_hindi":"जोधपुर","parent_id":"29"},
{"answer_id":"597","answer_english":"Jogulamba Gadwal","answer_hindi":"जोगुलाम्बा गद्वाल","parent_id":"32"},
{"answer_id":"59","answer_english":"Jorhat","answer_hindi":"जोरहाट","parent_id":"4"},
{"answer_id":"174","answer_english":"Junagadh","answer_hindi":"जूनागढ़","parent_id":"11"},
{"answer_id":"129","answer_english":"Kabirdham \/ Kawardha","answer_hindi":"कबीरधाम \/ कवर्धा","parent_id":"7"},
{"answer_id":"5","answer_english":"Kadapa","answer_hindi":"कड़प्पा","parent_id":"1"},
{"answer_id":"90","answer_english":"Kaimur","answer_hindi":"कैमूर","parent_id":"5"},
{"answer_id":"201","answer_english":"Kaithal","answer_hindi":"कैथल","parent_id":"12"},
{"answer_id":"420","answer_english":"Kakching","answer_hindi":"ककचिंग ","parent_id":"22"},
{"answer_id":"475","answer_english":"Kalahandi","answer_hindi":"कलाहान्डी","parent_id":"26"},
{"answer_id":"731","answer_english":"Kalimpong","answer_hindi":"कलिम्पोग","parent_id":"36"},
{"answer_id":"560","answer_english":"Kallakurichi","answer_hindi":"कल्लाकुरिची","parent_id":"31"},
{"answer_id":"598","answer_english":"Kamareddy","answer_hindi":"कामारेड्डी","parent_id":"32"},
{"answer_id":"422","answer_english":"Kamjong","answer_hindi":"कमजोंग ","parent_id":"22"},
{"answer_id":"21","answer_english":"Kamle","answer_hindi":"कमले","parent_id":"3"},
{"answer_id":"61","answer_english":"Kamrup","answer_hindi":"कामरूप","parent_id":"4"},
{"answer_id":"60","answer_english":"Kamrup Metropolitan","answer_hindi":"कामरूप महानगर","parent_id":"4"},
{"answer_id":"561","answer_english":"Kanchipuram","answer_hindi":"कांचीपुरम","parent_id":"31"},
{"answer_id":"476","answer_english":"Kandhamal","answer_hindi":"कन्धमाल","parent_id":"26"},
{"answer_id":"419","answer_english":"Kangpokpi (Sadar Hills)","answer_hindi":"कंगपोकपी","parent_id":"22"},
{"answer_id":"217","answer_english":"Kangra","answer_hindi":"काँगड़ा","parent_id":"13"},
{"answer_id":"130","answer_english":"Kanker","answer_hindi":"कांकेर  (उत्तर बस्तर)","parent_id":"7"},
{"answer_id":"672","answer_english":"Kannauj","answer_hindi":"कन्नौज","parent_id":"34"},
{"answer_id":"304","answer_english":"Kannur","answer_hindi":"कन्नूर","parent_id":"17"},
{"answer_id":"673","answer_english":"Kanpur Dehat","answer_hindi":"कानपुर देहात","parent_id":"34"},
{"answer_id":"674","answer_english":"Kanpur Nagar","answer_hindi":"कानपुर नगर","parent_id":"34"},
{"answer_id":"562","answer_english":"Kanyakumari","answer_hindi":"कन्याकुमारी","parent_id":"31"},
{"answer_id":"503","answer_english":"Kapurthala","answer_hindi":"कपूरथला","parent_id":"28"},
{"answer_id":"489","answer_english":"Karaikal","answer_hindi":"कराईकल ","parent_id":"27"},
{"answer_id":"537","answer_english":"Karauli","answer_hindi":"करौली","parent_id":"29"},
{"answer_id":"62","answer_english":"Karbi Anglong","answer_hindi":"कार्बी आंगलोंग","parent_id":"4"},
{"answer_id":"315","answer_english":"Kargil ","answer_hindi":"कारगिल","parent_id":"18"},
{"answer_id":"63","answer_english":"Karimganj","answer_hindi":"करीमगंज","parent_id":"4"},
{"answer_id":"599","answer_english":"Karimnagar","answer_hindi":"करीमनगर","parent_id":"32"},
{"answer_id":"202","answer_english":"Karnal","answer_hindi":"करनाल","parent_id":"12"},
{"answer_id":"563","answer_english":"Karur","answer_hindi":"करूर","parent_id":"31"},
{"answer_id":"305","answer_english":"Kasaragod","answer_hindi":"कासरगोड ","parent_id":"17"},
{"answer_id":"675","answer_english":"Kasganj","answer_hindi":"कासगंज ","parent_id":"34"},
{"answer_id":"233","answer_english":"Kathua","answer_hindi":"कठुआ","parent_id":"14"},
{"answer_id":"91","answer_english":"Katihar","answer_hindi":"कटिहार","parent_id":"5"},
{"answer_id":"342","answer_english":"Katni ","answer_hindi":"कटनी","parent_id":"20"},
{"answer_id":"676","answer_english":"Kaushambi","answer_hindi":"कौशाम्बी","parent_id":"34"},
{"answer_id":"478","answer_english":"Kendrapara","answer_hindi":"केन्द्रापड़ा","parent_id":"26"},
{"answer_id":"474","answer_english":"Kendujhar","answer_hindi":"केन्दुझर","parent_id":"26"},
{"answer_id":"92","answer_english":"Khagaria","answer_hindi":"खगड़िया","parent_id":"5"},
{"answer_id":"600","answer_english":"Khammam","answer_hindi":"खम्मम","parent_id":"32"},
{"answer_id":"337","answer_english":"Khandwa (East Nimar)","answer_hindi":"खंडवा","parent_id":"20"},
{"answer_id":"338","answer_english":"Khargone (West Nimar)","answer_hindi":"खरगोन","parent_id":"20"},
{"answer_id":"445","answer_english":"Khawzawl","answer_hindi":"खावजौल","parent_id":"24"},
{"answer_id":"176","answer_english":"Kheda","answer_hindi":"खेड़ा","parent_id":"11"},
{"answer_id":"473","answer_english":"Khordha","answer_hindi":"खोर्धा","parent_id":"26"},
{"answer_id":"628","answer_english":"Khowai","answer_hindi":"खोवाई","parent_id":"33"},
{"answer_id":"260","answer_english":"Khunti","answer_hindi":"खुटी","parent_id":"15"},
{"answer_id":"218","answer_english":"Kinnaur","answer_hindi":"किन्नौर","parent_id":"13"},
{"answer_id":"448","answer_english":"Kiphire","answer_hindi":"कैफाइर","parent_id":"25"},
{"answer_id":"93","answer_english":"Kishanganj","answer_hindi":"किशनगंज","parent_id":"5"},
{"answer_id":"234","answer_english":"Kishtwar","answer_hindi":"किश्तवाड़","parent_id":"14"},
{"answer_id":"288","answer_english":"Kodagu","answer_hindi":"कोडगु","parent_id":"16"},
{"answer_id":"251","answer_english":"Koderma","answer_hindi":"कोडरमा","parent_id":"15"},
{"answer_id":"449","answer_english":"Kohima","answer_hindi":"कोहिमा","parent_id":"25"},
{"answer_id":"64","answer_english":"Kokrajhar","answer_hindi":"कोकराझार","parent_id":"4"},
{"answer_id":"289","answer_english":"Kolar","answer_hindi":"कोलार","parent_id":"16"},
{"answer_id":"437","answer_english":"Kolasib","answer_hindi":"कोलासिब","parent_id":"24"},
{"answer_id":"387","answer_english":"Kolhapur","answer_hindi":"कोल्हापुर","parent_id":"21"},
{"answer_id":"732","answer_english":"Kolkata","answer_hindi":"कोलकाता","parent_id":"36"},
{"answer_id":"306","answer_english":"Kollam","answer_hindi":"कोल्लम","parent_id":"17"},
{"answer_id":"591","answer_english":"Komaram Bheem","answer_hindi":"कोमरम भीम","parent_id":"32"},
{"answer_id":"131","answer_english":"Kondagaon","answer_hindi":"कोंडगाँव","parent_id":"7"},
{"answer_id":"290","answer_english":"Koppal","answer_hindi":"कोप्पल","parent_id":"16"},
{"answer_id":"477","answer_english":"Koraput","answer_hindi":"कोरापुट","parent_id":"26"},
{"answer_id":"132","answer_english":"Korba","answer_hindi":"कोरबा","parent_id":"7"},
{"answer_id":"133","answer_english":"Koriya","answer_hindi":"कोरिया","parent_id":"7"},
{"answer_id":"538","answer_english":"Kota","answer_hindi":"कोटा","parent_id":"29"},
{"answer_id":"307","answer_english":"Kottayam","answer_hindi":"कोट्टयम","parent_id":"17"},
{"answer_id":"308","answer_english":"Kozhikode","answer_hindi":"कोड़िकोड","parent_id":"17"},
{"answer_id":"22","answer_english":"Kra Daadi","answer_hindi":"क्रा दादी","parent_id":"3"},
{"answer_id":"6","answer_english":"Krishna","answer_hindi":"कृष्णा","parent_id":"1"},
{"answer_id":"564","answer_english":"Krishnagiri","answer_hindi":"कृष्णगिरि","parent_id":"31"},
{"answer_id":"235","answer_english":"Kulgam","answer_hindi":"कुलगाम","parent_id":"14"},
{"answer_id":"219","answer_english":"Kullu","answer_hindi":"कुल्लू","parent_id":"13"},
{"answer_id":"236","answer_english":"Kupwara","answer_hindi":"कुपवाड़ा","parent_id":"14"},
{"answer_id":"7","answer_english":"Kurnool","answer_hindi":"कुर्नूल","parent_id":"1"},
{"answer_id":"203","answer_english":"Kurukshetra","answer_hindi":"कुरुक्षेत्र","parent_id":"12"},
{"answer_id":"23","answer_english":"Kurung Kumey","answer_hindi":"कुरुंग कुमे","parent_id":"3"},
{"answer_id":"677","answer_english":"Kushinagar","answer_hindi":"कुशीनगर (पड़रौना)","parent_id":"34"},
{"answer_id":"175","answer_english":"Kutch","answer_hindi":"कच्छ","parent_id":"11"},
{"answer_id":"220","answer_english":"Lahaul and Spiti","answer_hindi":"लाहौल और स्पीती","parent_id":"13"},
{"answer_id":"65","answer_english":"Lakhimpur","answer_hindi":"लखीमपुर","parent_id":"4"},
{"answer_id":"678","answer_english":"Lakhimpur Kheri","answer_hindi":"लखीमपुर-खिरी","parent_id":"34"},
{"answer_id":"94","answer_english":"Lakhisarai","answer_hindi":"लखीसराय","parent_id":"5"},
{"answer_id":"317","answer_english":"Lakshadweep","answer_hindi":"लक्षद्वीप","parent_id":"19"},
{"answer_id":"679","answer_english":"Lalitpur","answer_hindi":"ललितपुर","parent_id":"34"},
{"answer_id":"248","answer_english":"Latehar","answer_hindi":"लातेहार","parent_id":"15"},
{"answer_id":"388","answer_english":"Latur","answer_hindi":"लातूर","parent_id":"21"},
{"answer_id":"438","answer_english":"Lawngtlai","answer_hindi":"लॉङ्गतलाई","parent_id":"24"},
{"answer_id":"316","answer_english":"Leh ","answer_hindi":"लेह","parent_id":"18"},
{"answer_id":"24","answer_english":"Lepa Rada","answer_hindi":"लेपा रादा","parent_id":"3"},
{"answer_id":"257","answer_english":"Lohardaga","answer_hindi":"लोहरदग्गा","parent_id":"15"},
{"answer_id":"25","answer_english":"Lohit","answer_hindi":"लोहित","parent_id":"3"},
{"answer_id":"26","answer_english":"Longding","answer_hindi":"लोंगडिंग","parent_id":"3"},
{"answer_id":"450","answer_english":"Longleng","answer_hindi":"लॉन्गलेन्ग","parent_id":"25"},
{"answer_id":"27","answer_english":"Lower Dibang Valley","answer_hindi":"निचली दिबांग घाटी","parent_id":"3"},
{"answer_id":"28","answer_english":"Lower Siang","answer_hindi":"निचला सियांग","parent_id":"3"},
{"answer_id":"29","answer_english":"Lower Subansiri","answer_hindi":"निचली सुबनसिरी","parent_id":"3"},
{"answer_id":"680","answer_english":"Lucknow","answer_hindi":"लखनऊ","parent_id":"34"},
{"answer_id":"504","answer_english":"Ludhiana","answer_hindi":"लुधियाना","parent_id":"28"},
{"answer_id":"439","answer_english":"Lunglei","answer_hindi":"लुंगलेई","parent_id":"24"},
{"answer_id":"95","answer_english":"Madhepura","answer_hindi":"मधेपुरा","parent_id":"5"},
{"answer_id":"96","answer_english":"Madhubani","answer_hindi":"मधुबनी","parent_id":"5"},
{"answer_id":"565","answer_english":"Madurai","answer_hindi":"मदुरई","parent_id":"31"},
{"answer_id":"601","answer_english":"Mahabubabad","answer_hindi":"महाबूबाबाद","parent_id":"32"},
{"answer_id":"681","answer_english":"Maharajganj","answer_hindi":"महाराजगंज","parent_id":"34"},
{"answer_id":"134","answer_english":"Mahasamund","answer_hindi":"महासमुन्द","parent_id":"7"},
{"answer_id":"602","answer_english":"Mahbubnagar","answer_hindi":"महबूबनगर","parent_id":"32"},
{"answer_id":"490","answer_english":"Mahé","answer_hindi":"माहे ","parent_id":"27"},
{"answer_id":"204","answer_english":"Mahendragarh","answer_hindi":"महेंद्रगढ़","parent_id":"12"},
{"answer_id":"177","answer_english":"Mahisagar","answer_hindi":"महीसागर","parent_id":"11"},
{"answer_id":"682","answer_english":"Mahoba","answer_hindi":"महोबा","parent_id":"34"},
{"answer_id":"371","answer_english":"Maihar","answer_hindi":"मैहर","parent_id":"20"},
{"answer_id":"683","answer_english":"Mainpuri","answer_hindi":"मैनपुरी","parent_id":"34"},
{"answer_id":"66","answer_english":"Majuli","answer_hindi":"माजुली","parent_id":"4"},
{"answer_id":"309","answer_english":"Malappuram","answer_hindi":"मलप्पुरम","parent_id":"17"},
{"answer_id":"733","answer_english":"Maldah","answer_hindi":"मालदह","parent_id":"36"},
{"answer_id":"479","answer_english":"Malkangiri","answer_hindi":"मालकानगिरि","parent_id":"26"},
{"answer_id":"440","answer_english":"Mamit","answer_hindi":"ममित","parent_id":"24"},
{"answer_id":"603","answer_english":"Mancherial","answer_hindi":"मंचेरियल","parent_id":"32"},
{"answer_id":"221","answer_english":"Mandi","answer_hindi":"मंडी","parent_id":"13"},
{"answer_id":"343","answer_english":"Mandla ","answer_hindi":"मंडला","parent_id":"20"},
{"answer_id":"365","answer_english":"Mandsaur","answer_hindi":"मंदसौर","parent_id":"20"},
{"answer_id":"291","answer_english":"Mandya","answer_hindi":"मांडया","parent_id":"16"},
{"answer_id":"505","answer_english":"Mansa","answer_hindi":"मानसा","parent_id":"28"},
{"answer_id":"684","answer_english":"Mathura","answer_hindi":"मथुरा","parent_id":"34"},
{"answer_id":"685","answer_english":"Mau","answer_hindi":"मऊ","parent_id":"34"},
{"answer_id":"566","answer_english":"Mayiladuthurai","answer_hindi":"मयीलाडूतुरै","parent_id":"31"},
{"answer_id":"480","answer_english":"Mayurbhanj","answer_hindi":"मयूरभंज","parent_id":"26"},
{"answer_id":"604","answer_english":"Medak","answer_hindi":"मेदक","parent_id":"32"},
{"answer_id":"605","answer_english":"Medchal-Malkajgiri","answer_hindi":"मेड्चल मल्काजगिरि","parent_id":"32"},
{"answer_id":"686","answer_english":"Meerut","answer_hindi":"मेरठ","parent_id":"34"},
{"answer_id":"178","answer_english":"Mehsana","answer_hindi":"मेहसाणा","parent_id":"11"},
{"answer_id":"687","answer_english":"Mirzapur","answer_hindi":"मिर्ज़ापुर","parent_id":"34"},
{"answer_id":"506","answer_english":"Moga","answer_hindi":"मोगा","parent_id":"28"},
{"answer_id":"451","answer_english":"Mokokchung","answer_hindi":"मोकोकचुआंग","parent_id":"25"},
{"answer_id":"452","answer_english":"Mon","answer_hindi":"मोन","parent_id":"25"},
{"answer_id":"688","answer_english":"Moradabad","answer_hindi":"मुरादाबाद","parent_id":"34"},
{"answer_id":"179","answer_english":"Morbi","answer_hindi":"मोरबी","parent_id":"11"},
{"answer_id":"323","answer_english":"Morena ","answer_hindi":"मुरैना","parent_id":"20"},
{"answer_id":"67","answer_english":"Morigaon","answer_hindi":"मारिगांव","parent_id":"4"},
{"answer_id":"606","answer_english":"Mulugu","answer_hindi":"मुलुगु","parent_id":"32"},
{"answer_id":"389","answer_english":"Mumbai","answer_hindi":"मुंबई","parent_id":"21"},
{"answer_id":"390","answer_english":"Mumbai Suburban","answer_hindi":"मुंबई (सबअर्बन)","parent_id":"21"},
{"answer_id":"135","answer_english":"Mungeli","answer_hindi":"मुंगेली","parent_id":"7"},
{"answer_id":"97","answer_english":"Munger","answer_hindi":"मुंगेर","parent_id":"5"},
{"answer_id":"734","answer_english":"Murshidabad","answer_hindi":"मुर्शिदाबाद","parent_id":"36"},
{"answer_id":"689","answer_english":"Muzaffarnagar","answer_hindi":"मुजफ्फरनगर","parent_id":"34"},
{"answer_id":"98","answer_english":"Muzaffarpur","answer_hindi":"मुजफ्फरपुर","parent_id":"5"},
{"answer_id":"292","answer_english":"Mysore","answer_hindi":"मैसूर","parent_id":"16"},
{"answer_id":"481","answer_english":"Nabarangpur","answer_hindi":"नबरंगपुर","parent_id":"26"},
{"answer_id":"735","answer_english":"Nadia","answer_hindi":"नादिया","parent_id":"36"},
{"answer_id":"68","answer_english":"Nagaon","answer_hindi":"नगांव","parent_id":"4"},
{"answer_id":"567","answer_english":"Nagapattinam","answer_hindi":"नागपट्टिनम","parent_id":"31"},
{"answer_id":"609","answer_english":"Nagarkurnool","answer_hindi":"नागरकर्नूल","parent_id":"32"},
{"answer_id":"539","answer_english":"Nagaur","answer_hindi":"नागौर","parent_id":"29"},
{"answer_id":"372","answer_english":"Nagda","answer_hindi":"नागदा","parent_id":"20"},
{"answer_id":"391","answer_english":"Nagpur","answer_hindi":"नागपुर","parent_id":"21"},
{"answer_id":"712","answer_english":"Nainital","answer_hindi":"नैनीताल","parent_id":"35"},
{"answer_id":"99","answer_english":"Nalanda","answer_hindi":"नालंदा","parent_id":"5"},
{"answer_id":"69","answer_english":"Nalbari","answer_hindi":"नलबाड़ी","parent_id":"4"},
{"answer_id":"607","answer_english":"Nalgonda","answer_hindi":"नलगोंडा","parent_id":"32"},
{"answer_id":"569","answer_english":"Namakkal","answer_hindi":"नामक्कल","parent_id":"31"},
{"answer_id":"30","answer_english":"Namsai","answer_hindi":"नामसाई","parent_id":"3"},
{"answer_id":"392","answer_english":"Nanded","answer_hindi":"नांदेड","parent_id":"21"},
{"answer_id":"393","answer_english":"Nandurbar","answer_hindi":"नंदुरबार","parent_id":"21"},
{"answer_id":"608","answer_english":"Narayanpet","answer_hindi":"नारायणपेट","parent_id":"32"},
{"answer_id":"136","answer_english":"Narayanpur","answer_hindi":"नारायणपुर","parent_id":"7"},
{"answer_id":"180","answer_english":"Narmada","answer_hindi":"नर्मदा","parent_id":"11"},
{"answer_id":"344","answer_english":"Narsinghpur ","answer_hindi":"नरसिंहपुर","parent_id":"20"},
{"answer_id":"394","answer_english":"Nashik","answer_hindi":"नाशिक","parent_id":"21"},
{"answer_id":"181","answer_english":"Navsari","answer_hindi":"नवसारी","parent_id":"11"},
{"answer_id":"100","answer_english":"Nawada","answer_hindi":"नवादा","parent_id":"5"},
{"answer_id":"483","answer_english":"Nayagarh","answer_hindi":"नयागड़","parent_id":"26"},
{"answer_id":"366","answer_english":"Neemuch","answer_hindi":"नीमच","parent_id":"20"},
{"answer_id":"8","answer_english":"Nellore","answer_hindi":"नेल्लौर","parent_id":"1"},
{"answer_id":"146","answer_english":"New Delhi","answer_hindi":"नई दिल्ली","parent_id":"9"},
{"answer_id":"14","answer_english":"Nicobar","answer_hindi":"निकोबार","parent_id":"2"},
{"answer_id":"568","answer_english":"Nilgiris","answer_hindi":"नीलगिरि","parent_id":"31"},
{"answer_id":"610","answer_english":"Nirmal","answer_hindi":"निर्मल","parent_id":"32"},
{"answer_id":"359","answer_english":"Niwari ","answer_hindi":"निवाड़ी","parent_id":"20"},
{"answer_id":"611","answer_english":"Nizamabad","answer_hindi":"निज़ामाबाद","parent_id":"32"},
{"answer_id":"458","answer_english":"Noklak","answer_hindi":"नोक्लक","parent_id":"25"},
{"answer_id":"423","answer_english":"Noney","answer_hindi":"नोने","parent_id":"22"},
{"answer_id":"736","answer_english":"North 24 Parganas","answer_hindi":"उत्तर 24 परगना","parent_id":"36"},
{"answer_id":"15","answer_english":"North and Middle Andaman","answer_hindi":"उत्तर और मध्य अण्डमान जिला","parent_id":"2"},
{"answer_id":"149","answer_english":"North Delhi ","answer_hindi":"उत्तर दिल्ली","parent_id":"9"},
{"answer_id":"150","answer_english":"North East Delhi","answer_hindi":"उत्तर पूर्वी दिल्ली","parent_id":"9"},
{"answer_id":"435","answer_english":"North Garo Hills","answer_hindi":"उत्तर गारो हिल्स","parent_id":"23"},
{"answer_id":"157","answer_english":"North Goa","answer_hindi":"उत्तर गोवा","parent_id":"10"},
{"answer_id":"549","answer_english":"North Sikkim","answer_hindi":"उत्तर सिक्किम","parent_id":"30"},
{"answer_id":"626","answer_english":"North Tripura","answer_hindi":"उत्तर त्रिपुरा","parent_id":"33"},
{"answer_id":"151","answer_english":"North West Delhi","answer_hindi":"उत्तर पश्चिम दिल्ली","parent_id":"9"},
{"answer_id":"482","answer_english":"Nuapada","answer_hindi":"नुआपड़ा","parent_id":"26"},
{"answer_id":"205","answer_english":"Nuh","answer_hindi":"नूह ","parent_id":"12"},
{"answer_id":"395","answer_english":"Osmanabad","answer_hindi":"उस्मानाबाद","parent_id":"21"},
{"answer_id":"31","answer_english":"Pakke-Kessang","answer_hindi":"पक्के केसांग","parent_id":"3"},
{"answer_id":"267","answer_english":"Pakur","answer_hindi":"पाकुड़","parent_id":"15"},
{"answer_id":"310","answer_english":"Palakkad","answer_hindi":"पालक्काड़ ","parent_id":"17"},
{"answer_id":"247","answer_english":"Palamu","answer_hindi":"पलामू","parent_id":"15"},
{"answer_id":"396","answer_english":"Palghar","answer_hindi":"पालघर","parent_id":"21"},
{"answer_id":"540","answer_english":"Pali","answer_hindi":"पाली","parent_id":"29"},
{"answer_id":"206","answer_english":"Palwal","answer_hindi":"पलवल","parent_id":"12"},
{"answer_id":"207","answer_english":"Panchkula","answer_hindi":"पंचकुला","parent_id":"12"},
{"answer_id":"182","answer_english":"Panchmahal","answer_hindi":"पंचमहल","parent_id":"11"},
{"answer_id":"208","answer_english":"Panipat","answer_hindi":"पानीपत","parent_id":"12"},
{"answer_id":"356","answer_english":"Panna ","answer_hindi":"पन्ना","parent_id":"20"},
{"answer_id":"32","answer_english":"Papum Pare","answer_hindi":"पपुमपारे","parent_id":"3"},
{"answer_id":"397","answer_english":"Parbhani","answer_hindi":"परभणी","parent_id":"21"},
{"answer_id":"721","answer_english":"Paschim Bardhaman","answer_hindi":"पश्चिमी वर्धमान","parent_id":"36"},
{"answer_id":"737","answer_english":"Paschim Medinipur","answer_hindi":"पश्चिम मेदिनीपुर","parent_id":"36"},
{"answer_id":"183","answer_english":"Patan","answer_hindi":"पाटन","parent_id":"11"},
{"answer_id":"311","answer_english":"Pathanamthitta","answer_hindi":"पतनमतिट्टा","parent_id":"17"},
{"answer_id":"508","answer_english":"Pathankot","answer_hindi":"पठानकोट","parent_id":"28"},
{"answer_id":"509","answer_english":"Patiala","answer_hindi":"पटियाला","parent_id":"28"},
{"answer_id":"101","answer_english":"Patna","answer_hindi":"पटना","parent_id":"5"},
{"answer_id":"713","answer_english":"Pauri Garhwal","answer_hindi":"पौड़ी गढ़वाल","parent_id":"35"},
{"answer_id":"612","answer_english":"Peddapalli","answer_hindi":"पेद्दपल्ले","parent_id":"32"},
{"answer_id":"570","answer_english":"Perambalur","answer_hindi":"पेरम्बलुर","parent_id":"31"},
{"answer_id":"453","answer_english":"Peren","answer_hindi":"पेरेन","parent_id":"25"},
{"answer_id":"454","answer_english":"Phek","answer_hindi":"फेक","parent_id":"25"},
{"answer_id":"424","answer_english":"Pherzawl","answer_hindi":"फेरज़ौल ","parent_id":"22"},
{"answer_id":"690","answer_english":"Pilibhit","answer_hindi":"पीलीभीत","parent_id":"34"},
{"answer_id":"714","answer_english":"Pithoragarh","answer_hindi":"पिथौरागढ़","parent_id":"35"},
{"answer_id":"237","answer_english":"Poonch","answer_hindi":"पुंछ","parent_id":"14"},
{"answer_id":"184","answer_english":"Porbandar","answer_hindi":"पोरबंदर","parent_id":"11"},
{"answer_id":"9","answer_english":"Prakasam","answer_hindi":"प्रकाशम","parent_id":"1"},
{"answer_id":"541","answer_english":"Pratapgarh","answer_hindi":"प्रतापगढ़","parent_id":"29"},
{"answer_id":"691","answer_english":"Pratapgarh","answer_hindi":"प्रतापगढ","parent_id":"34"},
{"answer_id":"491","answer_english":"Puducherry","answer_hindi":"पुदुचेरी","parent_id":"27"},
{"answer_id":"571","answer_english":"Pudukkottai","answer_hindi":"पुदुकोट्टई","parent_id":"31"},
{"answer_id":"238","answer_english":"Pulwama","answer_hindi":"पुलवामा","parent_id":"14"},
{"answer_id":"398","answer_english":"Pune","answer_hindi":"पुणे","parent_id":"21"},
{"answer_id":"722","answer_english":"Purba Bardhaman","answer_hindi":"पूर्व बर्धमान ","parent_id":"36"},
{"answer_id":"738","answer_english":"Purba Medinipur","answer_hindi":"पूर्व मेदिनीपुर","parent_id":"36"},
{"answer_id":"484","answer_english":"Puri","answer_hindi":"पुरी","parent_id":"26"},
{"answer_id":"102","answer_english":"Purnia","answer_hindi":"पूर्णिया","parent_id":"5"},
{"answer_id":"739","answer_english":"Purulia","answer_hindi":"पुरूलिया","parent_id":"36"},
{"answer_id":"692","answer_english":"Raebareli","answer_hindi":"रायबरेली","parent_id":"34"},
{"answer_id":"293","answer_english":"Raichur","answer_hindi":"रायचूर","parent_id":"16"},
{"answer_id":"399","answer_english":"Raigad","answer_hindi":"रायगड","parent_id":"21"},
{"answer_id":"137","answer_english":"Raigarh","answer_hindi":"रायगढ","parent_id":"7"},
{"answer_id":"138","answer_english":"Raipur","answer_hindi":"रायपुर","parent_id":"7"},
{"answer_id":"319","answer_english":"Raisen","answer_hindi":"रायसेन","parent_id":"20"},
{"answer_id":"613","answer_english":"Rajanna Sircilla","answer_hindi":"राजन्ना सिरसिल्ला","parent_id":"32"},
{"answer_id":"320","answer_english":"Rajgarh ","answer_hindi":"राजगढ़","parent_id":"20"},
{"answer_id":"185","answer_english":"Rajkot","answer_hindi":"राजकोट","parent_id":"11"},
{"answer_id":"139","answer_english":"Rajnandgaon","answer_hindi":"राजनांदगांव","parent_id":"7"},
{"answer_id":"239","answer_english":"Rajouri","answer_hindi":"राजौरी","parent_id":"14"},
{"answer_id":"542","answer_english":"Rajsamand","answer_hindi":"राजसमंद","parent_id":"29"},
{"answer_id":"294","answer_english":"Ramanagara","answer_hindi":"रामनगर","parent_id":"16"},
{"answer_id":"572","answer_english":"Ramanathapuram","answer_hindi":"रामनाथपुरम","parent_id":"31"},
{"answer_id":"240","answer_english":"Ramban","answer_hindi":"रामबन","parent_id":"14"},
{"answer_id":"253","answer_english":"Ramgarh","answer_hindi":"रामगढ़","parent_id":"15"},
{"answer_id":"693","answer_english":"Rampur","answer_hindi":"रामपुर","parent_id":"34"},
{"answer_id":"259","answer_english":"Ranchi","answer_hindi":"राँची","parent_id":"15"},
{"answer_id":"614","answer_english":"Ranga Reddy","answer_hindi":"रंगारेड्डी","parent_id":"32"},
{"answer_id":"573","answer_english":"Ranipet","answer_hindi":"रानीपेट","parent_id":"31"},
{"answer_id":"367","answer_english":"Ratlam","answer_hindi":"रतलाम","parent_id":"20"},
{"answer_id":"400","answer_english":"Ratnagiri","answer_hindi":"रत्नागिरी","parent_id":"21"},
{"answer_id":"485","answer_english":"Rayagada","answer_hindi":"रायगड़ा","parent_id":"26"},
{"answer_id":"241","answer_english":"Reasi","answer_hindi":"रियासी","parent_id":"14"},
{"answer_id":"350","answer_english":"Rewa ","answer_hindi":"रीवा","parent_id":"20"},
{"answer_id":"209","answer_english":"Rewari","answer_hindi":"रेवाड़ी","parent_id":"12"},
{"answer_id":"430","answer_english":"Ri Bhoi","answer_hindi":"री भोई","parent_id":"23"},
{"answer_id":"210","answer_english":"Rohtak","answer_hindi":"रोहतक","parent_id":"12"},
{"answer_id":"103","answer_english":"Rohtas","answer_hindi":"रोहतास","parent_id":"5"},
{"answer_id":"715","answer_english":"Rudraprayag","answer_hindi":"रुद्रप्रयाग","parent_id":"35"},
{"answer_id":"510","answer_english":"Rupnagar","answer_hindi":"रूपनगर","parent_id":"28"},
{"answer_id":"186","answer_english":"Sabarkantha","answer_hindi":"साबरकांठा","parent_id":"11"},
{"answer_id":"357","answer_english":"Sagar ","answer_hindi":"सागर","parent_id":"20"},
{"answer_id":"694","answer_english":"Saharanpur","answer_hindi":"सहारनपुर","parent_id":"34"},
{"answer_id":"104","answer_english":"Saharsa","answer_hindi":"सहरसा","parent_id":"5"},
{"answer_id":"269","answer_english":"Sahebganj","answer_hindi":"साहिबगंज","parent_id":"15"},
{"answer_id":"511","answer_english":"Sahibzada Ajit Singh Nagar","answer_hindi":"मोहाली\/ साहिबजादा अजीत सिंह नगर","parent_id":"28"},
{"answer_id":"441","answer_english":"Saiha","answer_hindi":"सइहा","parent_id":"24"},
{"answer_id":"446","answer_english":"Saitual","answer_hindi":"सइतुआल","parent_id":"24"},
{"answer_id":"574","answer_english":"Salem","answer_hindi":"सेलम","parent_id":"31"},
{"answer_id":"105","answer_english":"Samastipur","answer_hindi":"समस्तीपुर","parent_id":"5"},
{"answer_id":"242","answer_english":"Samba","answer_hindi":"सांबा","parent_id":"14"},
{"answer_id":"486","answer_english":"Sambalpur","answer_hindi":"सम्बलपुर","parent_id":"26"},
{"answer_id":"695","answer_english":"Sambhal","answer_hindi":"सम्भल","parent_id":"34"},
{"answer_id":"615","answer_english":"Sangareddy","answer_hindi":"संगारेड्डी","parent_id":"32"},
{"answer_id":"401","answer_english":"Sangli","answer_hindi":"सांगली","parent_id":"21"},
{"answer_id":"512","answer_english":"Sangrur","answer_hindi":"संगरूर","parent_id":"28"},
{"answer_id":"696","answer_english":"Sant Kabir Nagar","answer_hindi":"संत कबीरनगर","parent_id":"34"},
{"answer_id":"262","answer_english":"Saraikela Kharsawan","answer_hindi":"सराइकेला खरसावाँ","parent_id":"15"},
{"answer_id":"106","answer_english":"Saran","answer_hindi":"सारन","parent_id":"5"},
{"answer_id":"402","answer_english":"Satara","answer_hindi":"सातारा","parent_id":"21"},
{"answer_id":"351","answer_english":"Satna ","answer_hindi":"सतना","parent_id":"20"},
{"answer_id":"544","answer_english":"Sawai Madhopur","answer_hindi":"सवाई माधोपुर","parent_id":"29"},
{"answer_id":"321","answer_english":"Sehore ","answer_hindi":"सीहोर","parent_id":"20"},
{"answer_id":"413","answer_english":"Senapati","answer_hindi":"सेनापति जिला","parent_id":"22"},
{"answer_id":"345","answer_english":"Seoni ","answer_hindi":"सिवनी ","parent_id":"20"},
{"answer_id":"442","answer_english":"Serchhip","answer_hindi":"सेरछिप","parent_id":"24"},
{"answer_id":"152","answer_english":"Shahdara","answer_hindi":"शाहदरा","parent_id":"9"},
{"answer_id":"361","answer_english":"Shahdol ","answer_hindi":"शहडोल","parent_id":"20"},
{"answer_id":"513","answer_english":"Shahid Bhagat Singh Nagar","answer_hindi":"शहीद भगतसिंहनगर","parent_id":"28"},
{"answer_id":"697","answer_english":"Shahjahanpur","answer_hindi":"शाहजहाँपुर","parent_id":"34"},
{"answer_id":"368","answer_english":"Shajapur","answer_hindi":"शाजापुर","parent_id":"20"},
{"answer_id":"698","answer_english":"Shamli","answer_hindi":"शामली","parent_id":"34"},
{"answer_id":"107","answer_english":"Sheikhpura","answer_hindi":"शेखपुरा","parent_id":"5"},
{"answer_id":"108","answer_english":"Sheohar","answer_hindi":"शिवहर","parent_id":"5"},
{"answer_id":"324","answer_english":"Sheopur ","answer_hindi":"श्योपुर","parent_id":"20"},
{"answer_id":"33","answer_english":"Shi Yomi","answer_hindi":"शिओमी","parent_id":"3"},
{"answer_id":"222","answer_english":"Shimla","answer_hindi":"शिमला","parent_id":"13"},
{"answer_id":"295","answer_english":"Shimoga","answer_hindi":"शिमोगा","parent_id":"16"},
{"answer_id":"328","answer_english":"Shivpuri ","answer_hindi":"शिवपुरी","parent_id":"20"},
{"answer_id":"243","answer_english":"Shopian","answer_hindi":"शोपियां","parent_id":"14"},
{"answer_id":"699","answer_english":"Shravasti","answer_hindi":"श्रावस्ती","parent_id":"34"},
{"answer_id":"34","answer_english":"Siang","answer_hindi":"सियांग","parent_id":"3"},
{"answer_id":"700","answer_english":"Siddharthnagar","answer_hindi":"सिद्धार्थनगर","parent_id":"34"},
{"answer_id":"616","answer_english":"Siddipet","answer_hindi":"सिद्दिपेट","parent_id":"32"},
{"answer_id":"352","answer_english":"Sidhi ","answer_hindi":"सीधी","parent_id":"20"},
{"answer_id":"543","answer_english":"Sikar","answer_hindi":"सीकर","parent_id":"29"},
{"answer_id":"258","answer_english":"Simdega","answer_hindi":"सिमडेगा","parent_id":"15"},
{"answer_id":"403","answer_english":"Sindhudurg","answer_hindi":"सिंधुदुर्ग","parent_id":"21"},
{"answer_id":"353","answer_english":"Singrauli ","answer_hindi":"सिंगरौली","parent_id":"20"},
{"answer_id":"627","answer_english":"Sipahijala","answer_hindi":"सिपाहीजाला","parent_id":"33"},
{"answer_id":"223","answer_english":"Sirmaur","answer_hindi":"सिरमौर","parent_id":"13"},
{"answer_id":"545","answer_english":"Sirohi","answer_hindi":"सिरोही","parent_id":"29"},
{"answer_id":"211","answer_english":"Sirsa","answer_hindi":"सिरसा","parent_id":"12"},
{"answer_id":"109","answer_english":"Sitamarhi","answer_hindi":"सीतामढ़ी","parent_id":"5"},
{"answer_id":"701","answer_english":"Sitapur","answer_hindi":"सीतापुर","parent_id":"34"},
{"answer_id":"575","answer_english":"Sivaganga","answer_hindi":"शिवगंगा","parent_id":"31"},
{"answer_id":"70","answer_english":"Sivasagar","answer_hindi":"शिवसागर","parent_id":"4"},
{"answer_id":"110","answer_english":"Siwan","answer_hindi":"सीवान","parent_id":"5"},
{"answer_id":"224","answer_english":"Solan","answer_hindi":"सोलन","parent_id":"13"},
{"answer_id":"404","answer_english":"Solapur","answer_hindi":"सोलापुर","parent_id":"21"},
{"answer_id":"702","answer_english":"Sonbhadra","answer_hindi":"सोनभद्र","parent_id":"34"},
{"answer_id":"212","answer_english":"Sonipat","answer_hindi":"सोनीपत","parent_id":"12"},
{"answer_id":"71","answer_english":"Sonitpur","answer_hindi":"शोणितपुर","parent_id":"4"},
{"answer_id":"740","answer_english":"South 24 Parganas","answer_hindi":"दक्षिण 24 परगना","parent_id":"36"},
{"answer_id":"16","answer_english":"South Andaman","answer_hindi":"दक्षिण अण्डमान","parent_id":"2"},
{"answer_id":"153","answer_english":"South Delhi ","answer_hindi":"दक्षिण दिल्ली","parent_id":"9"},
{"answer_id":"154","answer_english":"South East Delhi","answer_hindi":"दक्षिण पूर्वी दिल्ली","parent_id":"9"},
{"answer_id":"431","answer_english":"South Garo Hills","answer_hindi":"दक्षिण गारो हिल्स","parent_id":"23"},
{"answer_id":"158","answer_english":"South Goa","answer_hindi":" दक्षिण गोवा","parent_id":"10"},
{"answer_id":"72","answer_english":"South Salmara-Mankachar","answer_hindi":"दक्षिण सालमारा-मनकाचर","parent_id":"4"},
{"answer_id":"550","answer_english":"South Sikkim","answer_hindi":"दक्षिण सिक्किम","parent_id":"30"},
{"answer_id":"624","answer_english":"South Tripura","answer_hindi":"दक्षिण त्रिपुरा","parent_id":"33"},
{"answer_id":"155","answer_english":"South West Delhi","answer_hindi":"दक्षिण पश्चिम दिल्ली","parent_id":"9"},
{"answer_id":"432","answer_english":"South West Garo Hills","answer_hindi":"दक्षिण पश्चिम गारो हिल्स","parent_id":"23"},
{"answer_id":"433","answer_english":"South West Khasi Hills","answer_hindi":"दक्षिण पश्चिम खासी हिल्स","parent_id":"23"},
{"answer_id":"507","answer_english":"Sri Muktsar Sahib","answer_hindi":"मुक्तसर","parent_id":"28"},
{"answer_id":"10","answer_english":"Srikakulam","answer_hindi":"श्रीकाकुलम","parent_id":"1"},
{"answer_id":"244","answer_english":"Srinagar","answer_hindi":"श्रीनगर","parent_id":"14"},
{"answer_id":"487","answer_english":"Subarnapur(Sonepur)","answer_hindi":"सुबर्णपुर (सोनपुर)","parent_id":"26"},
{"answer_id":"140","answer_english":"Sukma","answer_hindi":"सुकमा","parent_id":"7"},
{"answer_id":"703","answer_english":"Sultanpur","answer_hindi":"सुल्तानपुर","parent_id":"34"},
{"answer_id":"488","answer_english":"Sundargarh","answer_hindi":"सुन्दरगड़","parent_id":"26"},
{"answer_id":"111","answer_english":"Supaul","answer_hindi":"सुपौल","parent_id":"5"},
{"answer_id":"141","answer_english":"Surajpur","answer_hindi":"सूरजपुर","parent_id":"7"},
{"answer_id":"187","answer_english":"Surat","answer_hindi":"सूरत","parent_id":"11"},
{"answer_id":"188","answer_english":"Surendranagar","answer_hindi":"सुरेंद्रनगर","parent_id":"11"},
{"answer_id":"142","answer_english":"Surguja","answer_hindi":"सरगुजा","parent_id":"7"},
{"answer_id":"617","answer_english":"Suryapet","answer_hindi":"सूर्यापेट","parent_id":"32"},
{"answer_id":"417","answer_english":"Tamenglong","answer_hindi":"तमेंगलॉन्ग जिला","parent_id":"22"},
{"answer_id":"189","answer_english":"Tapi","answer_hindi":"तापी","parent_id":"11"},
{"answer_id":"514","answer_english":"Tarn Taran","answer_hindi":"तरन तारन साहिब","parent_id":"28"},
{"answer_id":"35","answer_english":"Tawang","answer_hindi":"तवांग","parent_id":"3"},
{"answer_id":"716","answer_english":"Tehri Garhwal","answer_hindi":"टिहरी गढ़वाल","parent_id":"35"},
{"answer_id":"421","answer_english":"Tengnoupal","answer_hindi":"तेंगनोउपल ","parent_id":"22"},
{"answer_id":"576","answer_english":"Tenkasi","answer_hindi":"तेनकाशी","parent_id":"31"},
{"answer_id":"405","answer_english":"Thane","answer_hindi":"ठाणे","parent_id":"21"},
{"answer_id":"581","answer_english":"Thanjavur","answer_hindi":"तंजावुर","parent_id":"31"},
{"answer_id":"579","answer_english":"Theni","answer_hindi":"तेनी","parent_id":"31"},
{"answer_id":"312","answer_english":"Thiruvananthapuram","answer_hindi":"तिरुवनन्तपुरम ","parent_id":"17"},
{"answer_id":"582","answer_english":"Thoothukudi","answer_hindi":"तूतुकुड़ी","parent_id":"31"},
{"answer_id":"410","answer_english":"Thoubal","answer_hindi":"थौबल जिला","parent_id":"22"},
{"answer_id":"313","answer_english":"Thrissur","answer_hindi":"त्रिस्सूर ","parent_id":"17"},
{"answer_id":"358","answer_english":"Tikamgarh ","answer_hindi":"टीकमगढ़","parent_id":"20"},
{"answer_id":"73","answer_english":"Tinsukia","answer_hindi":"तिनसुकिया","parent_id":"4"},
{"answer_id":"36","answer_english":"Tirap","answer_hindi":"तिराप","parent_id":"3"},
{"answer_id":"578","answer_english":"Tiruchirappalli","answer_hindi":"तिरुचिरापल्ली","parent_id":"31"},
{"answer_id":"580","answer_english":"Tirunelveli","answer_hindi":"तिरूनेलवेली","parent_id":"31"},
{"answer_id":"583","answer_english":"Tirupattur","answer_hindi":"तिरुपत्तुर","parent_id":"31"},
{"answer_id":"577","answer_english":"Tirupur","answer_hindi":"तिरुपुर","parent_id":"31"},
{"answer_id":"584","answer_english":"Tiruvallur","answer_hindi":"तिरुवल्लुर","parent_id":"31"},
{"answer_id":"586","answer_english":"Tiruvannamalai","answer_hindi":"तिरुवन्नामलई","parent_id":"31"},
{"answer_id":"585","answer_english":"Tiruvarur","answer_hindi":"तिरुवारुर","parent_id":"31"},
{"answer_id":"546","answer_english":"Tonk","answer_hindi":"टोंक","parent_id":"29"},
{"answer_id":"455","answer_english":"Tuensang","answer_hindi":"ट्वेनसांग","parent_id":"25"},
{"answer_id":"296","answer_english":"Tumkur","answer_hindi":"तुमकूर","parent_id":"16"},
{"answer_id":"547","answer_english":"Udaipur","answer_hindi":"उदयपुर","parent_id":"29"},
{"answer_id":"74","answer_english":"Udalguri","answer_hindi":"उदलगुड़ी","parent_id":"4"},
{"answer_id":"717","answer_english":"Udham Singh Nagar","answer_hindi":"उधमसिंह नगर","parent_id":"35"},
{"answer_id":"245","answer_english":"Udhampur","answer_hindi":"उधमपुर","parent_id":"14"},
{"answer_id":"297","answer_english":"Udupi","answer_hindi":"उडुपी","parent_id":"16"},
{"answer_id":"369","answer_english":"Ujjain","answer_hindi":"उज्जैन","parent_id":"20"},
{"answer_id":"414","answer_english":"Ukhrul","answer_hindi":"उखरुल जिला","parent_id":"22"},
{"answer_id":"362","answer_english":"Umaria ","answer_hindi":"उमरिया","parent_id":"20"},
{"answer_id":"225","answer_english":"Una","answer_hindi":"उना","parent_id":"13"},
{"answer_id":"630","answer_english":"Unakoti","answer_hindi":"उनाकोटी","parent_id":"33"},
{"answer_id":"704","answer_english":"Unnao","answer_hindi":"उन्नाव","parent_id":"34"},
{"answer_id":"37","answer_english":"Upper Dibang Valley","answer_hindi":"ऊपरी दिबांग घाटी","parent_id":"3"},
{"answer_id":"38","answer_english":"Upper Siang","answer_hindi":"ऊपरी सियांग","parent_id":"3"},
{"answer_id":"39","answer_english":"Upper Subansiri","answer_hindi":"ऊपरी सुबनसिरी","parent_id":"3"},
{"answer_id":"741","answer_english":"Uttar Dinajpur","answer_hindi":"उत्तर दिनाजपुर","parent_id":"36"},
{"answer_id":"298","answer_english":"Uttara Kannada","answer_hindi":"उत्तर कन्नड़","parent_id":"16"},
{"answer_id":"718","answer_english":"Uttarkashi","answer_hindi":"उत्तरकाशी","parent_id":"35"},
{"answer_id":"190","answer_english":"Vadodara","answer_hindi":"वड़ोदरा","parent_id":"11"},
{"answer_id":"112","answer_english":"Vaishali","answer_hindi":"वैशाली","parent_id":"5"},
{"answer_id":"191","answer_english":"Valsad","answer_hindi":"वलसाड","parent_id":"11"},
{"answer_id":"705","answer_english":"Varanasi","answer_hindi":"वाराणसी","parent_id":"34"},
{"answer_id":"587","answer_english":"Vellore","answer_hindi":"वेल्लूर","parent_id":"31"},
{"answer_id":"322","answer_english":"Vidisha ","answer_hindi":"विदिशा","parent_id":"20"},
{"answer_id":"299","answer_english":"Vijayanagara","answer_hindi":"विजयनगर","parent_id":"16"},
{"answer_id":"618","answer_english":"Vikarabad","answer_hindi":"विक़ाराबाद","parent_id":"32"},
{"answer_id":"588","answer_english":"Viluppuram","answer_hindi":"विलुप्पुरम","parent_id":"31"},
{"answer_id":"589","answer_english":"Virudhunagar","answer_hindi":"विरुधुनगर","parent_id":"31"},
{"answer_id":"11","answer_english":"Visakhapatnam","answer_hindi":"विशाखापट्टनम","parent_id":"1"},
{"answer_id":"12","answer_english":"Vizianagaram","answer_hindi":"विजयनगरम","parent_id":"1"},
{"answer_id":"619","answer_english":"Wanaparthy","answer_hindi":"वानपर्ति","parent_id":"32"},
{"answer_id":"621","answer_english":"Warangal Rural","answer_hindi":"वरंगल ग्रामीण","parent_id":"32"},
{"answer_id":"620","answer_english":"Warangal Urban","answer_hindi":"वारंगल अर्बन","parent_id":"32"},
{"answer_id":"406","answer_english":"Wardha","answer_hindi":"वर्धा","parent_id":"21"},
{"answer_id":"407","answer_english":"Washim","answer_hindi":"वाशीम","parent_id":"21"},
{"answer_id":"314","answer_english":"Wayanad","answer_hindi":"वायनाड ","parent_id":"17"},
{"answer_id":"113","answer_english":"West Champaran","answer_hindi":"पश्चिमी चम्पारण जिला","parent_id":"5"},
{"answer_id":"156","answer_english":"West Delhi","answer_hindi":"पश्चिम दिल्ली","parent_id":"9"},
{"answer_id":"426","answer_english":"West Garo Hills","answer_hindi":"पश्चिम गारो हिल्स","parent_id":"23"},
{"answer_id":"13","answer_english":"West Godavari","answer_hindi":"पश्चिम गोदावरी","parent_id":"1"},
{"answer_id":"427","answer_english":"West Jaintia Hills","answer_hindi":"पश्चिम जयंतिया हिल्स","parent_id":"23"},
{"answer_id":"40","answer_english":"West Kameng","answer_hindi":"पश्चिम कमेंग","parent_id":"3"},
{"answer_id":"75","answer_english":"West Karbi Anglong","answer_hindi":"पश्चिम कार्बी आंगलोंग","parent_id":"4"},
{"answer_id":"428","answer_english":"West Khasi Hills","answer_hindi":"पश्चिम खासी हिल्स","parent_id":"23"},
{"answer_id":"41","answer_english":"West Siang","answer_hindi":"पश्चिम सियांग","parent_id":"3"},
{"answer_id":"551","answer_english":"West Sikkim","answer_hindi":"पश्चिम सिक्किम","parent_id":"30"},
{"answer_id":"261","answer_english":"West Singhbhum","answer_hindi":"पश्चिमी सिंहभूम ","parent_id":"15"},
{"answer_id":"629","answer_english":"West Tripura","answer_hindi":"पश्चिम त्रिपुरा","parent_id":"33"},
{"answer_id":"456","answer_english":"Wokha","answer_hindi":"वोखा","parent_id":"25"},
{"answer_id":"622","answer_english":"Yadadri Bhuvanagiri","answer_hindi":"यादाद्री भुवनगिरी","parent_id":"32"},
{"answer_id":"300","answer_english":"Yadgir","answer_hindi":"यादगीर","parent_id":"16"},
{"answer_id":"213","answer_english":"Yamuna Nagar","answer_hindi":"यमुनानगर","parent_id":"12"},
{"answer_id":"492","answer_english":"Yanam","answer_hindi":"यानम","parent_id":"27"},
{"answer_id":"408","answer_english":"Yavatmal","answer_hindi":"यवतमाळ","parent_id":"21"},
{"answer_id":"457","answer_english":"Zunheboto","answer_hindi":"ज़ुन्हेबोटो","parent_id":"25"}
                    ],
                answer : "",
            },
            {
                name : "pincode",
                question_id : 14,
                question_english : "Please enter your PIN code",
                question_hindi : "जी कृपया अपना पिन कोड दर्ज करें",
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
                question_hindi : "आपकी शैक्षणिक योग्यता क्या है?",
                question_type : "selection",
                is_answered : false,
                is_skip : false,
                answers : [
                    {"answer_id":"1","answer_english":"School","answer_hindi":"स्कूल"},
                    {"answer_id":"2","answer_english":"Graduate","answer_hindi":"ग्रेजुएट"},
                    {"answer_id":"3","answer_english":"Post graduate","answer_hindi":"पोस्ट ग्रेजुएट"},
                    {"answer_id":"4","answer_english":"PhD","answer_hindi":"पीएचडी"},
                ],
                answer : "",
            },
            {
                name : "profession",
                question_id : 16,
                question_english : "What is your occupational / employment status?",
                question_hindi : "आपकी  व्यवसायिक / रोजगार स्थिति क्या है?",
                question_type : "selection",
                is_answered : false,
                is_skip : false,
                answers : [
                    {"answer_id":"1","answer_english":"Student","answer_hindi":"छात्र"},
                    {"answer_id":"2","answer_english":"Self Employed/ Business","answer_hindi":"स्व - रोजगार / व्यापार"},
                    {"answer_id":"3","answer_english":"Private Service","answer_hindi":"प्राइवेट सर्विस"},
                    {"answer_id":"4","answer_english":"Govt/ Semi Government","answer_hindi":"सरकारी / अर्ध सरकारी सेवा"},
                    {"answer_id":"5","answer_english":"NGO","answer_hindi":"एनजीओ"},
                    {"answer_id":"6","answer_english":"Other","answer_hindi":"अन्य"}
                ],
                answer : "",
            },
            // {
            //     name : "interested_position",
            //     question_id : 17,
            //     question_english : "At what level would you like to work on?",
            //     question_hindi : "आप किस स्तर पर काम करना चाहेंगे?",
            //     question_type : "selection",
            //     max_length : 15,
            //     is_skip : false,
            //     is_answered : false,
            //     answers : [
            //         {"answer_id":"1","answer_english":"National","answer_hindi":"राष्ट्रीय"},
            //         {"answer_id":"2","answer_english":"State","answer_hindi":"राज्य"},
            //         {"answer_id":"3","answer_english":"District","answer_hindi":"जिला"},
            //     ],
            //     answer : "",
            // },
            {
                name : "prefered_working_hours",
                question_id : 18,
                question_english : "How many hours per day are you willing to devote to working with the Congress social media team?",
                question_hindi : "आप प्रति दिन कितने घंटे कांग्रेस सोशल मीडिया टीम के साथ काम करने के लिए समर्पित करने के लिए तैयार हैं?",
                question_type : "selection",
                is_answered : false,
                is_skip : false,
                answers : [
                    {"answer_id":"1","answer_english":"1-2 Hours","answer_hindi":"1-2 घंटे"},
                    {"answer_id":"2","answer_english":"2-4 Hours","answer_hindi":"2-4 घंटे"},
                    {"answer_id":"3","answer_english":"4-6 Hours","answer_hindi":"4-6 घंटे"},
                    {"answer_id":"4","answer_english":"More than 6 Hours","answer_hindi":"6 घंटे से ज्यादा"},
                ],
                answer : "",
            },
            {
                name : "prefered_working",
                question_id : 19,
                question_english : " In which of the following areas are you willing to work with the Congress social media team?",
                question_hindi : "आप निम्नलिखित में से किस क्षेत्र में कांग्रेस सोशल मीडिया टीम के साथ काम करने के इच्छुक हैं?",
                max_check : 15,
                question_type : "checkbox",
                is_answered : false,
                is_skip : false,
                answers : [
                    {"answer_id":"1","answer_english":"Training","answer_hindi":"ट्रेनिंग"},
                    {"answer_id":"2","answer_english":"Research","answer_hindi":"रिसर्च"},
                    {"answer_id":"3","answer_english":"Content (writing)","answer_hindi":"कंटेंट लेखन"},
                    {"answer_id":"4","answer_english":"Content Creation (Video, Audio, Graphics)","answer_hindi":"कंटेंट क्रिएशन (वीडियो / ऑडियो / ग्राफिक्स)"},
                    {"answer_id":"5","answer_english":"Outreach / Team Development","answer_hindi":"आउटरीच / टीम तैयार करना"},
                    {"answer_id":"6","answer_english":"Content Dissemination / Viral","answer_hindi":"कंटेंट वितरण"},
                ],
                answer : "",
            },
            {
                name : "activity_area",
                question_id : 20,
                question_english : "If there is any other area or activity you want to involve with the social media team (not mentioned in the previous options), please let us know.",
                question_hindi : "यदि कोई अन्य क्षेत्र या गतिविधि आप सोशल मीडिया टीम (पिछले विकल्पों में उल्लिखित नहीं) के साथ शामिल करना चाहते हैं, तो कृपया हमें बताएं.",
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
                question_hindi : "आप इनमें से किस सोशल मीडिया प्लेटफॉर्म पर ज्यादा सक्रिय हैं?",
                question_type : "checkbox",
                max_check : 15,
                is_answered : false,
                is_skip : false,
                answers : [
                    {"answer_id":"2","answer_english":"Facebook","answer_hindi":"फेसबुक"},
                    {"answer_id":"1","answer_english":"WhatsApp","answer_hindi":"व्हाट्सएप"},
                    {"answer_id":"3","answer_english":"Twitter","answer_hindi":"ट्विटर"},
                    {"answer_id":"5","answer_english":"Instagram","answer_hindi":"इंस्टाग्राम"},
                    {"answer_id":"4","answer_english":"YouTube","answer_hindi":"यूट्यूब"},
                    {"answer_id":"6","answer_english":"linkedIn","answer_hindi":"लिंकडिन"},
                    {"answer_id":"7","answer_english":"Quora","answer_hindi":"क्वोरा"},
                    {"answer_id":"5","answer_english":"Other","answer_hindi":"अन्य"},
                ],
                answer : "",
            },
            {
                name : "social_media_platforms_other",
                question_id : 22,
                question_english : "Mention your other social media platform.",
                question_hindi : "आप अन्य सोशल मीडिया प्लेटफॉर्म का उल्लेख करें.",
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
                question_hindi : "कृपया अपने सबसे सक्रिय सोशल मीडिया हैंडल का लिंक प्रदान करें. <a href='https://www.incsmw.in/assets/SocialMedia.mp4' target='_blank'>(लिंक कैसे प्राप्त करें)</a>",
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
                question_hindi : "आपका ईमेल एड्रेस लिखें",
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
            question_hindi : "आपकी प्रतिक्रिया के लिए आपका धन्यवाद। हम शीघ्र ही आपसे संपर्क करेंगे! <br /><br /> कृपया अपने दोस्तों के साथ <a href='https://www.congressmembership.com/chatbot/' target='_blank'>लिंक</a> साझा करें और उन्हें कांग्रेस के सोशल मीडिया वारियर बनने के अवसर प्रदान करें। जय हिन्द !",
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
        {"answer_id":"1","answer_english":"Andaman Nicobar","answer_hindi":"अंडमान निकोबार"},
        {"answer_id":"2","answer_english":"Andhra Pradesh","answer_hindi":"आंध्र प्रदेश"},
        {"answer_id":"3","answer_english":"Arunachal Pradesh","answer_hindi":"अरुणाचल प्रदेश"},
        {"answer_id":"4","answer_english":"Assam","answer_hindi":"असम"},
        {"answer_id":"5","answer_english":"Bihar","answer_hindi":"बिहार"},
        {"answer_id":"6","answer_english":"Chandigarh","answer_hindi":"चंडीगढ़"},
        {"answer_id":"7","answer_english":"Chhattisgarh","answer_hindi":"छत्तीसगढ़"},
        {"answer_id":"8","answer_english":"Dadra and Nagar Haveli","answer_hindi":"दादरा और नगर हवेली"},
        {"answer_id":"9","answer_english":"Delhi","answer_hindi":"दिल्ली"},
        {"answer_id":"10","answer_english":"Diu Daman","answer_hindi":"दीव दमन"},
        {"answer_id":"11","answer_english":"Goa","answer_hindi":"गोवा"},
        {"answer_id":"12","answer_english":"Gujarat","answer_hindi":"गुजरात"},
        {"answer_id":"13","answer_english":"Haryana","answer_hindi":"हरियाणा"},
        {"answer_id":"14","answer_english":"Himachal Pradesh","answer_hindi":"हिमाचल प्रदेश"},
        {"answer_id":"15","answer_english":"Jammu Kashmir","answer_hindi":"जम्मू कश्मीर"},
        {"answer_id":"16","answer_english":"Jharkhand","answer_hindi":"झारखंड"},
        {"answer_id":"17","answer_english":"Karnataka","answer_hindi":"कर्नाटक"},
        {"answer_id":"18","answer_english":"Kerala","answer_hindi":"केरल"},
        {"answer_id":"19","answer_english":"Lakshadweep","answer_hindi":"लक्षद्वीप"},
        {"answer_id":"20","answer_english":"Madhya Pradesh","answer_hindi":"मध्य प्रदेश"},
        {"answer_id":"21","answer_english":"Maharashtra","answer_hindi":"महाराष्ट्र"},
        {"answer_id":"22","answer_english":"Manipur","answer_hindi":"मणिपुर"},
        {"answer_id":"23","answer_english":"Meghalaya","answer_hindi":"मेघालय"},
        {"answer_id":"24","answer_english":"Mizoram","answer_hindi":"मिजोरम"},
        {"answer_id":"25","answer_english":"Nagaland","answer_hindi":"नगालैंड"},
        {"answer_id":"26","answer_english":"Odisha","answer_hindi":"ओडिशा"},
        {"answer_id":"27","answer_english":"Puducherry","answer_hindi":"पुडुचेरी"},
        {"answer_id":"28","answer_english":"Punjab","answer_hindi":"पंजाब"},
        {"answer_id":"29","answer_english":"Rajasthan","answer_hindi":"राजस्थान"},
        {"answer_id":"30","answer_english":"Sikkim","answer_hindi":"सिक्किम"},
        {"answer_id":"31","answer_english":"Tamil Nadu","answer_hindi":"तमिलनाडु"},
        {"answer_id":"32","answer_english":"Telangana","answer_hindi":"तेलंगाना"},
        {"answer_id":"33","answer_english":"Tripura","answer_hindi":"त्रिपुरा"},
        {"answer_id":"34","answer_english":"Uttar Pradesh","answer_hindi":"उत्तर प्रदेश"},
        {"answer_id":"35","answer_english":"Uttarakhand","answer_hindi":"उत्तराखंड"},
        {"answer_id":"36","answer_english":"West Bengal","answer_hindi":"पश्चिम बंगाल"},
        // {"answer_id":"37","answer_english":"Mumbai","answer_hindi":"मुंबई"},
        {"answer_id":"38","answer_english":"Ladakh","answer_hindi":"लद्दाख"}
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
                answer_english : "हिंदी",  
                answer_hindi : "हिंदी",  
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
                    answer_english : "हिंदी",  
                    answer_hindi : "हिंदी",  
                }
            ],
            is_answered : false,
            answer : "",
        },
        {
            name : "intro",
            question_id : 2,
            question_english : "Welcome to the Indian National Congress Social Media recruitment campaign! We are launching an initiative to identify and select talented individuals for the INC at the village, town, state and all-India level. By becoming part of our organisation you will play an impactful leadership role in shaping the national discourse, and help us to  build a secular, modern, hate free and prosperous India. <br /><br /> You may like to watch the video below to understand our objectives, and your role in our team! <br /><br /> <a href='https://www.youtube.com/watch?v=E7gWc7d0tOE' target='_blank'>https://www.youtube.com/watch?v=E7gWc7d0tOE</a>",
            question_hindi : "भारतीय राष्ट्रीय कांग्रेस सोशल मीडिया भर्ती अभियान में आपका स्वागत है! हम गांव, शहर, राज्य और अखिल भारतीय स्तर पर INC के लिए प्रतिभाशाली व्यक्तियों की पहचान और चयन करने के लिए एक पहल शुरू कर रहे हैं। हमारे संगठन का हिस्सा बनकर आप राष्ट्रीय प्रवचन को आकार देने में एक प्रभावशाली नेतृत्वकारी भूमिका निभाएंगे। आप एक धर्मनिरपेक्ष, आधुनिक, नफरत मुक्त और समृद्ध भारत बनाने में मदद करेंगे। <br /><br /> कृपया हमारे उद्देश्यों और हमारी टीम में आपकी भूमिका को समझने के लिए नीचे दिया गया वीडियो देखें <a href='https://www.youtube.com/watch?v=E7gWc7d0tOE' target='_blank'>https://www.youtube.com/watch?v=E7gWc7d0tOE</a>!", 
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
            question_hindi : "क्या आपकी आयु 18 वर्ष से अधिक है?",
            question_type : "option",
            is_skip : false,
            answers : [
                {
                    answer_id : "1",
                    answer_english : "Yes",
                    answer_hindi : "हाँ",
                },
                {
                    answer_id : "2",
                    answer_english : "No",  
                    answer_hindi : "नहीं",  
                }
            ],
            is_answered : false,
            answer : "",
        },
        {
            name : "age_false",
            question_id : 4,
            question_english : "Thank you for your interest in the Congress social media team. At this time we are accepting applications from those over 18 years of age only.",
            question_hindi : "कांग्रेस सोशल मीडिया टीम में आपकी रुचि के लिए धन्यवाद। इस समय हम केवल 18 वर्ष से अधिक उम्र के लोगों के आवेदन स्वीकार कर रहे हैं।",
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
            question_hindi : "आपका नाम? कृपया केवल पहला नाम और उपनाम टाइप करें",
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
        //     question_hindi : "आप वर्तमान में भारत में हैं या भारत के बाहर?",
        //     question_type : "option",
        //     is_skip : false,
        //     is_answered : false,
        //     answers : [
        //         {
        //             answer_id : "1",
        //             answer_english : "Inside India",
        //             answer_hindi : "भारत में",
        //         },
        //         {
        //             answer_id : "2",
        //             answer_english : "Outside India",  
        //             answer_hindi : "भारत के बाहर",  
        //         }
        //     ],
        //     answer : "",
        // },
        // {
        //     name : "not_in_india",
        //     question_id : 7,
        //     question_english : "Thank you for your interest in the Congress social media team. At this time we are accepting applications from India Only.",
        //     question_hindi : "कांग्रेस सोशल मीडिया टीम में आपकी रुचि के लिए धन्यवाद। इस समय हम केवल भारत से आवेदन स्वीकार कर रहे हैं",
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
            question_hindi : "आपका फोन नंबर?",
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
            question_hindi : "आपका मोबाइल नंबर पहले से पंजीकृत है। धन्यवाद।",
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
            question_hindi : "आपको एक OTP प्राप्त हुआ होगा। कृपया OTP टाइप करें",
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
            question_hindi : "वैरिफिकेशन कोड गलत है.",
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
            question_hindi : "क्या यह आपका व्हाट्सएप नंबर भी है?",
            question_type : "option",
            is_skip : false,
            is_answered : false,
            answers : [
                {
                    answer_id : "1",
                    answer_english : "Yes",
                    answer_hindi : "हाँ",
                },
                {
                    answer_id : "2",
                    answer_english : "No",  
                    answer_hindi : "नहीं",  
                }
            ],
            answer : "",
        },
        {
            name : "whatsapp_number",
            question_id : 11,
            question_english : "Please Type Your 10 digit WhatsApp Phone Number",
            question_hindi : "आपका व्हाट्सएप नंबर क्या है?",
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
            question_hindi : "आप किस राज्य या केंद्र शासित प्रदेश से हैं?",
            question_type : "selection",
            is_answered : false,
            is_skip : false,
            answers : [
                {"answer_id":"2","answer_english":"Andaman and Nicobar","answer_hindi":"अण्डमान और निकोबार"},
                {"answer_id":"1","answer_english":"Andhra Pradesh","answer_hindi":"आंध्र प्रदेश"},
                {"answer_id":"3","answer_english":"Arunachal Pradesh","answer_hindi":"अरुणाचल प्रदेश"},
                {"answer_id":"4","answer_english":"Assam","answer_hindi":"असम"},
                {"answer_id":"5","answer_english":"Bihar","answer_hindi":"बिहार"},
                {"answer_id":"6","answer_english":"Chandigarh","answer_hindi":"चण्डीगढ़"},
                {"answer_id":"7","answer_english":"Chhattisgarh","answer_hindi":"छत्तीसगढ़"},
                {"answer_id":"8","answer_english":"Dadra and Nagar Haveli and Daman and Diu","answer_hindi":"दादरा नगर हवेली और दमन और दीव"},
                {"answer_id":"9","answer_english":"Delhi","answer_hindi":"दिल्ली"},
                {"answer_id":"10","answer_english":"Goa","answer_hindi":"गोवा"},
                {"answer_id":"11","answer_english":"Gujarat","answer_hindi":"गुजरात"},
                {"answer_id":"12","answer_english":"Haryana","answer_hindi":"हरियाणा"},
                {"answer_id":"13","answer_english":"Himachal Pradesh","answer_hindi":"हिमाचल प्रदेश"},
                {"answer_id":"14","answer_english":"Jammu and Kashmir","answer_hindi":"जम्मू कश्मीर"},
                {"answer_id":"15","answer_english":"Jharkhand","answer_hindi":"झारखण्ड"},
                {"answer_id":"16","answer_english":"Karnataka","answer_hindi":"कर्नाटक"},
                {"answer_id":"17","answer_english":"Kerala","answer_hindi":"केरल"},
                {"answer_id":"18","answer_english":"Ladakh","answer_hindi":"लद्दाख"},
                {"answer_id":"19","answer_english":"Lakshadweep","answer_hindi":"लक्षद्वीप"},
                {"answer_id":"20","answer_english":"Madhya Pradesh","answer_hindi":"मध्यप्रदेश"},
                {"answer_id":"21","answer_english":"Maharastra","answer_hindi":"महाराष्ट्र"},
                {"answer_id":"22","answer_english":"Manipur","answer_hindi":"मणिपुर"},
                {"answer_id":"23","answer_english":"Meghalaya","answer_hindi":"मेघालय"},
                {"answer_id":"24","answer_english":"Mizoram","answer_hindi":"मिज़ोरम"},
                {"answer_id":"25","answer_english":"Nagaland","answer_hindi":"नागालैण्ड"},
                {"answer_id":"26","answer_english":"Odisha","answer_hindi":"ओड़िशा"},
                {"answer_id":"27","answer_english":"Puducherry","answer_hindi":"पुदुचेरी"},
                {"answer_id":"28","answer_english":"Punjab","answer_hindi":"पंजाब"},
                {"answer_id":"29","answer_english":"Rajasthan","answer_hindi":"राजस्थान"},
                {"answer_id":"30","answer_english":"Sikkim","answer_hindi":"सिक्किम"},
                {"answer_id":"31","answer_english":"Tamil Nadu","answer_hindi":"तमिलनाडु"},
                {"answer_id":"32","answer_english":"Telangana","answer_hindi":"तेलंगाना"},
                {"answer_id":"33","answer_english":"Tripura","answer_hindi":"त्रिपुरा"},
                {"answer_id":"34","answer_english":"Uttar Pradesh","answer_hindi":"उत्तर प्रदेश"},
                {"answer_id":"35","answer_english":"Uttarakhand","answer_hindi":"उत्तराखण्ड"},
                {"answer_id":"36","answer_english":"West Bengal","answer_hindi":"पश्चिम बंगाल"}
            ],
            answer : "",
        },
        {
            name : "pincode",
            question_id : 13,
            question_english : "Please enter your pin code",
            question_hindi : "जी कृपया अपना पिन कोड दर्ज करें",
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
            question_hindi : "आपकी प्रतिक्रिया के लिए आपका धन्यवाद। हम शीघ्र ही आपसे संपर्क करेंगे! <br /><br /> कृपया अपने दोस्तों के साथ <a href='https://www.congressmembership.com/chatbot/' target='_blank'>लिंक</a> साझा करें और उन्हें कांग्रेस के सोशल मीडिया वारियर बनने के अवसर प्रदान करें। जय हिन्द !",
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
                        $scope.errorMessage = "कृपया 10 अंकों की मान्य संख्या दर्ज करें!"; 
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
                        $scope.errorMessage = "कृपया एक मान्य 6 अंक पिन कोड दर्ज करें!"; 
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
                        $scope.errorMessage = "कृपया एक मान्य 6 अंक OTP दर्ज करें!"; 
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
                if(answer == "Yes" || answer == "हाँ"){
                    addition = 2;
                    angular.forEach($rootScope.$storage.chat_messages, function (value, key){
                        if(value.name == "age_false"){
                            $rootScope.$storage.chat_messages[key].is_skip = true;
                        }
                    });     
                }
            }

            if(question.name == "inside_india"){
                if(answer == "Inside India" || answer == "भारत में"){
                    addition = 2;
                    angular.forEach($rootScope.$storage.chat_messages, function (value, key){
                        if(value.name == "not_in_india"){
                            $rootScope.$storage.chat_messages[key].is_skip = true;
                        }
                    });     
                }
            }

            if(question.name == "is_whatsapp"){
                if(answer == "Yes" || answer == "हाँ"){
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
                            $scope.errorMessage = "गलत OTP, कृपया पुनः प्रयास करें!!"; 
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
        {"answer_id":"2","answer_english":"Andaman and Nicobar","answer_hindi":"अण्डमान और निकोबार"},
        {"answer_id":"1","answer_english":"Andhra Pradesh","answer_hindi":"आंध्र प्रदेश"},
        {"answer_id":"3","answer_english":"Arunachal Pradesh","answer_hindi":"अरुणाचल प्रदेश"},
        {"answer_id":"4","answer_english":"Assam","answer_hindi":"असम"},
        {"answer_id":"5","answer_english":"Bihar","answer_hindi":"बिहार"},
        {"answer_id":"6","answer_english":"Chandigarh","answer_hindi":"चण्डीगढ़"},
        {"answer_id":"7","answer_english":"Chhattisgarh","answer_hindi":"छत्तीसगढ़"},
        {"answer_id":"8","answer_english":"Dadra and Nagar Haveli and Daman and Diu","answer_hindi":"दादरा नगर हवेली और दमन और दीव"},
        {"answer_id":"9","answer_english":"Delhi","answer_hindi":"दिल्ली"},
        {"answer_id":"10","answer_english":"Goa","answer_hindi":"गोवा"},
        {"answer_id":"11","answer_english":"Gujarat","answer_hindi":"गुजरात"},
        {"answer_id":"12","answer_english":"Haryana","answer_hindi":"हरियाणा"},
        {"answer_id":"13","answer_english":"Himachal Pradesh","answer_hindi":"हिमाचल प्रदेश"},
        {"answer_id":"14","answer_english":"Jammu and Kashmir","answer_hindi":"जम्मू कश्मीर"},
        {"answer_id":"15","answer_english":"Jharkhand","answer_hindi":"झारखण्ड"},
        {"answer_id":"16","answer_english":"Karnataka","answer_hindi":"कर्नाटक"},
        {"answer_id":"17","answer_english":"Kerala","answer_hindi":"केरल"},
        {"answer_id":"18","answer_english":"Ladakh","answer_hindi":"लद्दाख"},
        {"answer_id":"19","answer_english":"Lakshadweep","answer_hindi":"लक्षद्वीप"},
        {"answer_id":"20","answer_english":"Madhya Pradesh","answer_hindi":"मध्यप्रदेश"},
        {"answer_id":"21","answer_english":"Maharastra","answer_hindi":"महाराष्ट्र"},
        {"answer_id":"22","answer_english":"Manipur","answer_hindi":"मणिपुर"},
        {"answer_id":"23","answer_english":"Meghalaya","answer_hindi":"मेघालय"},
        {"answer_id":"24","answer_english":"Mizoram","answer_hindi":"मिज़ोरम"},
        {"answer_id":"25","answer_english":"Nagaland","answer_hindi":"नागालैण्ड"},
        {"answer_id":"26","answer_english":"Odisha","answer_hindi":"ओड़िशा"},
        {"answer_id":"27","answer_english":"Puducherry","answer_hindi":"पुदुचेरी"},
        {"answer_id":"28","answer_english":"Punjab","answer_hindi":"पंजाब"},
        {"answer_id":"29","answer_english":"Rajasthan","answer_hindi":"राजस्थान"},
        {"answer_id":"30","answer_english":"Sikkim","answer_hindi":"सिक्किम"},
        {"answer_id":"31","answer_english":"Tamil Nadu","answer_hindi":"तमिलनाडु"},
        {"answer_id":"32","answer_english":"Telangana","answer_hindi":"तेलंगाना"},
        {"answer_id":"33","answer_english":"Tripura","answer_hindi":"त्रिपुरा"},
        {"answer_id":"34","answer_english":"Uttar Pradesh","answer_hindi":"उत्तर प्रदेश"},
        {"answer_id":"35","answer_english":"Uttarakhand","answer_hindi":"उत्तराखण्ड"},
        {"answer_id":"36","answer_english":"West Bengal","answer_hindi":"पश्चिम बंगाल"}
        // {"answer_id":"1","answer_english":"Andaman Nicobar","answer_hindi":"अंडमान निकोबार"},
        // {"answer_id":"2","answer_english":"Andhra Pradesh","answer_hindi":"आंध्र प्रदेश"},
        // {"answer_id":"3","answer_english":"Arunachal Pradesh","answer_hindi":"अरुणाचल प्रदेश"},
        // {"answer_id":"4","answer_english":"Assam","answer_hindi":"असम"},
        // {"answer_id":"5","answer_english":"Bihar","answer_hindi":"बिहार"},
        // {"answer_id":"6","answer_english":"Chandigarh","answer_hindi":"चंडीगढ़"},
        // {"answer_id":"7","answer_english":"Chhattisgarh","answer_hindi":"छत्तीसगढ़"},
        // {"answer_id":"8","answer_english":"Dadra and Nagar Haveli","answer_hindi":"दादरा और नगर हवेली"},
        // {"answer_id":"9","answer_english":"Delhi","answer_hindi":"दिल्ली"},
        // {"answer_id":"10","answer_english":"Diu Daman","answer_hindi":"दीव दमन"},
        // {"answer_id":"11","answer_english":"Goa","answer_hindi":"गोवा"},
        // {"answer_id":"12","answer_english":"Gujarat","answer_hindi":"गुजरात"},
        // {"answer_id":"13","answer_english":"Haryana","answer_hindi":"हरियाणा"},
        // {"answer_id":"14","answer_english":"Himachal Pradesh","answer_hindi":"हिमाचल प्रदेश"},
        // {"answer_id":"15","answer_english":"Jammu Kashmir","answer_hindi":"जम्मू कश्मीर"},
        // {"answer_id":"16","answer_english":"Jharkhand","answer_hindi":"झारखंड"},
        // {"answer_id":"17","answer_english":"Karnataka","answer_hindi":"कर्नाटक"},
        // {"answer_id":"18","answer_english":"Kerala","answer_hindi":"केरल"},
        // {"answer_id":"19","answer_english":"Lakshadweep","answer_hindi":"लक्षद्वीप"},
        // {"answer_id":"20","answer_english":"Madhya Pradesh","answer_hindi":"मध्य प्रदेश"},
        // {"answer_id":"21","answer_english":"Maharashtra","answer_hindi":"महाराष्ट्र"},
        // {"answer_id":"22","answer_english":"Manipur","answer_hindi":"मणिपुर"},
        // {"answer_id":"23","answer_english":"Meghalaya","answer_hindi":"मेघालय"},
        // {"answer_id":"24","answer_english":"Mizoram","answer_hindi":"मिजोरम"},
        // {"answer_id":"25","answer_english":"Nagaland","answer_hindi":"नगालैंड"},
        // {"answer_id":"26","answer_english":"Odisha","answer_hindi":"ओडिशा"},
        // {"answer_id":"27","answer_english":"Puducherry","answer_hindi":"पुडुचेरी"},
        // {"answer_id":"28","answer_english":"Punjab","answer_hindi":"पंजाब"},
        // {"answer_id":"29","answer_english":"Rajasthan","answer_hindi":"राजस्थान"},
        // {"answer_id":"30","answer_english":"Sikkim","answer_hindi":"सिक्किम"},
        // {"answer_id":"31","answer_english":"Tamil Nadu","answer_hindi":"तमिलनाडु"},
        // {"answer_id":"32","answer_english":"Telangana","answer_hindi":"तेलंगाना"},
        // {"answer_id":"33","answer_english":"Tripura","answer_hindi":"त्रिपुरा"},
        // {"answer_id":"34","answer_english":"Uttar Pradesh","answer_hindi":"उत्तर प्रदेश"},
        // {"answer_id":"35","answer_english":"Uttarakhand","answer_hindi":"उत्तराखंड"},
        // {"answer_id":"36","answer_english":"West Bengal","answer_hindi":"पश्चिम बंगाल"},
        // {"answer_id":"38","answer_english":"Ladakh","answer_hindi":"लद्दाख"}
    ];

    $scope.districts = [
        {"answer_id":"590","answer_english":"Adilabad","answer_hindi":"आदिलाबाद","parent_id":"32"},
{"answer_id":"363","answer_english":"Agar Malwa","answer_hindi":"आगर मालवा","parent_id":"20"},
{"answer_id":"631","answer_english":"Agra","answer_hindi":"आगरा","parent_id":"34"},
{"answer_id":"159","answer_english":"Ahmedabad","answer_hindi":"अहमदाबाद","parent_id":"11"},
{"answer_id":"373","answer_english":"Ahmednagar","answer_hindi":"अहमदनगर","parent_id":"21"},
{"answer_id":"436","answer_english":"Aizawl","answer_hindi":"अइज़ोल","parent_id":"24"},
{"answer_id":"515","answer_english":"Ajmer","answer_hindi":"अजमेर","parent_id":"29"},
{"answer_id":"374","answer_english":"Akola","answer_hindi":"अकोला","parent_id":"21"},
{"answer_id":"301","answer_english":"Alappuzha","answer_hindi":"आलाप्पुड़ा","parent_id":"17"},
{"answer_id":"632","answer_english":"Aligarh","answer_hindi":"अलीगढ","parent_id":"34"},
{"answer_id":"719","answer_english":"Alipurduar","answer_hindi":"अलीपुरद्रार","parent_id":"36"},
{"answer_id":"331","answer_english":"Alirajpur ","answer_hindi":"अलीराजपुर","parent_id":"20"},
{"answer_id":"633","answer_english":"Allahabad","answer_hindi":"इलाहाबाद\/प्रयागराज","parent_id":"34"},
{"answer_id":"706","answer_english":"Almora","answer_hindi":"अल्मोड़ा","parent_id":"35"},
{"answer_id":"516","answer_english":"Alwar","answer_hindi":"अलवर","parent_id":"29"},
{"answer_id":"192","answer_english":"Ambala","answer_hindi":"अम्बाला","parent_id":"12"},
{"answer_id":"634","answer_english":"Ambedkar Nagar","answer_hindi":"अम्बेडकरनगर","parent_id":"34"},
{"answer_id":"635","answer_english":"Amethi","answer_hindi":"अमेठी ","parent_id":"34"},
{"answer_id":"375","answer_english":"Amravati","answer_hindi":"अमरावती","parent_id":"21"},
{"answer_id":"160","answer_english":"Amreli","answer_hindi":"अमरेली","parent_id":"11"},
{"answer_id":"493","answer_english":"Amritsar","answer_hindi":"अमृतसर","parent_id":"28"},
{"answer_id":"636","answer_english":"Amroha","answer_hindi":"अमरोहा ","parent_id":"34"},
{"answer_id":"161","answer_english":"Anand","answer_hindi":"आणंद","parent_id":"11"},
{"answer_id":"1","answer_english":"Anantapur","answer_hindi":"अनंतपुर","parent_id":"1"},
{"answer_id":"226","answer_english":"Anantnag","answer_hindi":"अनन्तनाग","parent_id":"14"},
{"answer_id":"459","answer_english":"Angul","answer_hindi":"अनुगुल","parent_id":"26"},
{"answer_id":"17","answer_english":"Anjaw","answer_hindi":"अंजॉ","parent_id":"3"},
{"answer_id":"360","answer_english":"Anuppur ","answer_hindi":"अनूपपुर","parent_id":"20"},
{"answer_id":"76","answer_english":"Araria","answer_hindi":"अररिया","parent_id":"5"},
{"answer_id":"162","answer_english":"Aravalli","answer_hindi":"अरावली","parent_id":"11"},
{"answer_id":"552","answer_english":"Ariyalur","answer_hindi":"अरियालूर","parent_id":"31"},
{"answer_id":"77","answer_english":"Arwal","answer_hindi":"अरवल","parent_id":"5"},
{"answer_id":"327","answer_english":"Ashoknagar","answer_hindi":"अशोक नगर","parent_id":"20"},
{"answer_id":"637","answer_english":"Auraiya","answer_hindi":"औरैया","parent_id":"34"},
{"answer_id":"78","answer_english":"Aurangabad","answer_hindi":"औरंगाबाद","parent_id":"5"},
{"answer_id":"376","answer_english":"Aurangabad","answer_hindi":"औरंगाबाद","parent_id":"21"},
{"answer_id":"638","answer_english":"Azamgarh","answer_hindi":"आजमगढ","parent_id":"34"},
{"answer_id":"270","answer_english":"Bagalkot","answer_hindi":"बागलकोट","parent_id":"16"},
{"answer_id":"707","answer_english":"Bageshwar","answer_hindi":"बागेश्वर","parent_id":"35"},
{"answer_id":"639","answer_english":"Bagpat","answer_hindi":"बागपत ","parent_id":"34"},
{"answer_id":"640","answer_english":"Bahraich","answer_hindi":"बहराइच","parent_id":"34"},
{"answer_id":"43","answer_english":"Bajali","answer_hindi":"बजाली","parent_id":"4"},
{"answer_id":"42","answer_english":"Baksa","answer_hindi":"बक्सा","parent_id":"4"},
{"answer_id":"339","answer_english":"Balaghat ","answer_hindi":"बालाघाट","parent_id":"20"},
{"answer_id":"461","answer_english":"Balangir","answer_hindi":"बलांगिर","parent_id":"26"},
{"answer_id":"641","answer_english":"Balarampur","answer_hindi":"बलरामपुर","parent_id":"34"},
{"answer_id":"463","answer_english":"Balasore","answer_hindi":"बालेश्वर","parent_id":"26"},
{"answer_id":"642","answer_english":"Ballia","answer_hindi":"बलिया","parent_id":"34"},
{"answer_id":"115","answer_english":"Balod","answer_hindi":"बालोद","parent_id":"7"},
{"answer_id":"116","answer_english":"Baloda Bazar","answer_hindi":"बलौदा बाजार","parent_id":"7"},
{"answer_id":"117","answer_english":"Balrampur","answer_hindi":"बलरामपुर","parent_id":"7"},
{"answer_id":"163","answer_english":"Banaskantha","answer_hindi":"बनासकांठा","parent_id":"11"},
{"answer_id":"643","answer_english":"Banda","answer_hindi":"बाँदा","parent_id":"34"},
{"answer_id":"228","answer_english":"Bandipora","answer_hindi":"बांदीपुरा","parent_id":"14"},
{"answer_id":"272","answer_english":"Bangalore Rural","answer_hindi":"बंगलोर ग्रामीण","parent_id":"16"},
{"answer_id":"271","answer_english":"Bangalore Urban","answer_hindi":"बंगलोर शहरी","parent_id":"16"},
{"answer_id":"79","answer_english":"Banka","answer_hindi":"बाँका","parent_id":"5"},
{"answer_id":"720","answer_english":"Bankura","answer_hindi":"बाँकुड़ा","parent_id":"36"},
{"answer_id":"519","answer_english":"Banswara","answer_hindi":"बांसवाड़ा","parent_id":"29"},
{"answer_id":"644","answer_english":"Barabanki","answer_hindi":"बाराबंकी","parent_id":"34"},
{"answer_id":"229","answer_english":"Baramulla","answer_hindi":"बारामूला","parent_id":"14"},
{"answer_id":"521","answer_english":"Baran","answer_hindi":"बारां","parent_id":"29"},
{"answer_id":"645","answer_english":"Bareilly","answer_hindi":"बरेली","parent_id":"34"},
{"answer_id":"462","answer_english":"Bargarh","answer_hindi":"बरगढ़","parent_id":"26"},
{"answer_id":"518","answer_english":"Barmer","answer_hindi":"बाड़मेर","parent_id":"29"},
{"answer_id":"494","answer_english":"Barnala","answer_hindi":"बरनाला","parent_id":"28"},
{"answer_id":"44","answer_english":"Barpeta","answer_hindi":"बारपेटा","parent_id":"4"},
{"answer_id":"332","answer_english":"Barwani ","answer_hindi":"बड़वानी","parent_id":"20"},
{"answer_id":"118","answer_english":"Bastar","answer_hindi":"बस्तर","parent_id":"7"},
{"answer_id":"646","answer_english":"Basti","answer_hindi":"बस्ती","parent_id":"34"},
{"answer_id":"495","answer_english":"Bathinda","answer_hindi":"भटिण्डा","parent_id":"28"},
{"answer_id":"377","answer_english":"Beed","answer_hindi":"बीड","parent_id":"21"},
{"answer_id":"80","answer_english":"Begusarai","answer_hindi":"बेगूसराय","parent_id":"5"},
{"answer_id":"273","answer_english":"Belgaum","answer_hindi":"बेलगाम","parent_id":"16"},
{"answer_id":"274","answer_english":"Bellary","answer_hindi":"बेल्लारी","parent_id":"16"},
{"answer_id":"119","answer_english":"Bemetara","answer_hindi":"बेमेतरा","parent_id":"7"},
{"answer_id":"347","answer_english":"Betul ","answer_hindi":"बैतूल","parent_id":"20"},
{"answer_id":"647","answer_english":"Bhadohi","answer_hindi":"भदोही ","parent_id":"34"},
{"answer_id":"592","answer_english":"Bhadradri Kothagudem","answer_hindi":"भद्राद्री कोठागुडम","parent_id":"32"},
{"answer_id":"464","answer_english":"Bhadrak","answer_hindi":"भद्रक","parent_id":"26"},
{"answer_id":"81","answer_english":"Bhagalpur","answer_hindi":"भागलपुर","parent_id":"5"},
{"answer_id":"378","answer_english":"Bhandara","answer_hindi":"भंडारा","parent_id":"21"},
{"answer_id":"520","answer_english":"Bharatpur","answer_hindi":"भरतपुर","parent_id":"29"},
{"answer_id":"164","answer_english":"Bharuch","answer_hindi":"भरुच","parent_id":"11"},
{"answer_id":"165","answer_english":"Bhavnagar","answer_hindi":"भावनगर","parent_id":"11"},
{"answer_id":"523","answer_english":"Bhilwara","answer_hindi":"भीलवाड़ा","parent_id":"29"},
{"answer_id":"325","answer_english":"Bhind ","answer_hindi":"भिंड","parent_id":"20"},
{"answer_id":"193","answer_english":"Bhiwani","answer_hindi":"भिवानी","parent_id":"12"},
{"answer_id":"82","answer_english":"Bhojpur","answer_hindi":"भोजपुर","parent_id":"5"},
{"answer_id":"318","answer_english":"Bhopal ","answer_hindi":"भोपाल","parent_id":"20"},
{"answer_id":"275","answer_english":"Bidar","answer_hindi":"बीदर","parent_id":"16"},
{"answer_id":"276","answer_english":"Bijapur","answer_hindi":"बीजापुर","parent_id":"16"},
{"answer_id":"120","answer_english":"Bijapur","answer_hindi":"बीजापुर","parent_id":"7"},
{"answer_id":"648","answer_english":"Bijnor","answer_hindi":"बिजनौर","parent_id":"34"},
{"answer_id":"517","answer_english":"Bikaner","answer_hindi":"बीकानेर","parent_id":"29"},
{"answer_id":"121","answer_english":"Bilaspur","answer_hindi":"बिलासपुर","parent_id":"7"},
{"answer_id":"214","answer_english":"Bilaspur","answer_hindi":"बिलासपुर","parent_id":"13"},
{"answer_id":"723","answer_english":"Birbhum","answer_hindi":"बीरभूम","parent_id":"36"},
{"answer_id":"409","answer_english":"Bishnupur","answer_hindi":"बिष्णुपुर जिला","parent_id":"22"},
{"answer_id":"45","answer_english":"Biswanath","answer_hindi":"बिश्वनाथ","parent_id":"4"},
{"answer_id":"254","answer_english":"Bokaro","answer_hindi":"बोकारो","parent_id":"15"},
{"answer_id":"46","answer_english":"Bongaigaon","answer_hindi":"बंगाईगाँव","parent_id":"4"},
{"answer_id":"166","answer_english":"Botad","answer_hindi":"बोटाड","parent_id":"11"},
{"answer_id":"460","answer_english":"Boudh","answer_hindi":"बौध","parent_id":"26"},
{"answer_id":"649","answer_english":"Budaun","answer_hindi":"बदायूं ","parent_id":"34"},
{"answer_id":"227","answer_english":"Budgam","answer_hindi":"बड़गांव","parent_id":"14"},
{"answer_id":"650","answer_english":"Bulandshahr","answer_hindi":"बुलंदशहर","parent_id":"34"},
{"answer_id":"379","answer_english":"Buldhana","answer_hindi":"बुलढाणा","parent_id":"21"},
{"answer_id":"522","answer_english":"Bundi","answer_hindi":"बूंदी","parent_id":"29"},
{"answer_id":"333","answer_english":"Burhanpur ","answer_hindi":"बुरहानपुर","parent_id":"20"},
{"answer_id":"83","answer_english":"Buxar","answer_hindi":"बक्सर","parent_id":"5"},
{"answer_id":"47","answer_english":"Cachar","answer_hindi":"कछर","parent_id":"4"},
{"answer_id":"147","answer_english":"Central Delhi ","answer_hindi":"मध्य दिल्ली","parent_id":"9"},
{"answer_id":"370","answer_english":"Chachaura-Binaganj","answer_hindi":"चाचौड़ा","parent_id":"20"},
{"answer_id":"277","answer_english":"Chamarajanagar","answer_hindi":"चामराजनगर","parent_id":"16"},
{"answer_id":"215","answer_english":"Chamba","answer_hindi":"चंबा","parent_id":"13"},
{"answer_id":"708","answer_english":"Chamoli","answer_hindi":"चमोली","parent_id":"35"},
{"answer_id":"709","answer_english":"Champawat","answer_hindi":"चम्पावत","parent_id":"35"},
{"answer_id":"443","answer_english":"Champhai","answer_hindi":"चम्फाई","parent_id":"24"},
{"answer_id":"651","answer_english":"Chandauli","answer_hindi":"चंदौली","parent_id":"34"},
{"answer_id":"415","answer_english":"Chandel","answer_hindi":"चन्डेल जिला","parent_id":"22"},
{"answer_id":"114","answer_english":"Chandigarh ","answer_hindi":"चण्डीगढ़","parent_id":"6"},
{"answer_id":"380","answer_english":"Chandrapur","answer_hindi":"चंद्रपुर","parent_id":"21"},
{"answer_id":"18","answer_english":"Changlang","answer_hindi":"चांगलांग","parent_id":"3"},
{"answer_id":"48","answer_english":"Charaideo","answer_hindi":"चराइदेउ","parent_id":"4"},
{"answer_id":"194","answer_english":"Charkhi Dadri","answer_hindi":"चरखी दादरी","parent_id":"12"},
{"answer_id":"249","answer_english":"Chatra","answer_hindi":"चतरा","parent_id":"15"},
{"answer_id":"553","answer_english":"Chengalpattu","answer_hindi":"चेंगलपट्टु","parent_id":"31"},
{"answer_id":"554","answer_english":"Chennai","answer_hindi":"चेन्नई","parent_id":"31"},
{"answer_id":"354","answer_english":"Chhatarpur ","answer_hindi":"छतरपुर","parent_id":"20"},
{"answer_id":"340","answer_english":"Chhindwara ","answer_hindi":"छिंदवाड़ा","parent_id":"20"},
{"answer_id":"167","answer_english":"Chhota Udaipur","answer_hindi":"छोटा उदयपुर","parent_id":"11"},
{"answer_id":"278","answer_english":"Chikballapur","answer_hindi":"चिकबलापुरा","parent_id":"16"},
{"answer_id":"279","answer_english":"Chikmagalur","answer_hindi":"चिकमगलूर","parent_id":"16"},
{"answer_id":"49","answer_english":"Chirang","answer_hindi":"चिरांग","parent_id":"4"},
{"answer_id":"280","answer_english":"Chitradurga","answer_hindi":"चित्रदुर्ग","parent_id":"16"},
{"answer_id":"652","answer_english":"Chitrakoot","answer_hindi":"चित्रकूट","parent_id":"34"},
{"answer_id":"2","answer_english":"Chittoor","answer_hindi":"चित्तूर","parent_id":"1"},
{"answer_id":"525","answer_english":"Chittorgarh","answer_hindi":"चित्तौड़गढ़","parent_id":"29"},
{"answer_id":"416","answer_english":"Churachandpur","answer_hindi":"चुराचांदपुर जिला","parent_id":"22"},
{"answer_id":"524","answer_english":"Churu","answer_hindi":"चुरु","parent_id":"29"},
{"answer_id":"555","answer_english":"Coimbatore","answer_hindi":"कोयम्बतूर","parent_id":"31"},
{"answer_id":"724","answer_english":"Cooch Behar","answer_hindi":"कूचबिहार","parent_id":"36"},
{"answer_id":"556","answer_english":"Cuddalore","answer_hindi":"कुड्डलोर","parent_id":"31"},
{"answer_id":"465","answer_english":"Cuttack","answer_hindi":"कटक","parent_id":"26"},
{"answer_id":"145","answer_english":"Dadra and Nagar Haveli","answer_hindi":"दादरा नगर हवेली","parent_id":"8"},
{"answer_id":"168","answer_english":"Dahod","answer_hindi":"दाहोद","parent_id":"11"},
{"answer_id":"725","answer_english":"Dakshin Dinajpur","answer_hindi":"दक्षिण दिनाजपुर","parent_id":"36"},
{"answer_id":"281","answer_english":"Dakshina Kannada","answer_hindi":"दक्षिण कन्नड़","parent_id":"16"},
{"answer_id":"143","answer_english":"Daman","answer_hindi":"दमन ","parent_id":"8"},
{"answer_id":"355","answer_english":"Damoh ","answer_hindi":"दमोह","parent_id":"20"},
{"answer_id":"169","answer_english":"Dang","answer_hindi":"डांग","parent_id":"11"},
{"answer_id":"122","answer_english":"Dantewada","answer_hindi":"दन्तेवाड़ा  (दक्षिण बस्तर)","parent_id":"7"},
{"answer_id":"84","answer_english":"Darbhanga","answer_hindi":"दरभंगा","parent_id":"5"},
{"answer_id":"726","answer_english":"Darjeeling","answer_hindi":"दार्जिलिंग","parent_id":"36"},
{"answer_id":"50","answer_english":"Darrang","answer_hindi":"दारांग","parent_id":"4"},
{"answer_id":"329","answer_english":"Datia ","answer_hindi":"दतिया","parent_id":"20"},
{"answer_id":"526","answer_english":"Dausa","answer_hindi":"दौसा","parent_id":"29"},
{"answer_id":"282","answer_english":"Davanagere","answer_hindi":"दावणगेरे","parent_id":"16"},
{"answer_id":"466","answer_english":"Debagarh","answer_hindi":"देवगड़","parent_id":"26"},
{"answer_id":"710","answer_english":"Dehradun","answer_hindi":"देहरादून","parent_id":"35"},
{"answer_id":"265","answer_english":"Deoghar","answer_hindi":"देवघर","parent_id":"15"},
{"answer_id":"653","answer_english":"Deoria","answer_hindi":"देवरिया","parent_id":"34"},
{"answer_id":"170","answer_english":"Devbhoomi Dwarka","answer_hindi":"देवभूमि द्वारका","parent_id":"11"},
{"answer_id":"364","answer_english":"Dewas","answer_hindi":"देवास","parent_id":"20"},
{"answer_id":"623","answer_english":"Dhalai","answer_hindi":"धलाई","parent_id":"33"},
{"answer_id":"123","answer_english":"Dhamtari","answer_hindi":"धमतरी","parent_id":"7"},
{"answer_id":"255","answer_english":"Dhanbad","answer_hindi":"धनबाद","parent_id":"15"},
{"answer_id":"335","answer_english":"Dhar ","answer_hindi":"धार","parent_id":"20"},
{"answer_id":"557","answer_english":"Dharmapuri","answer_hindi":"धर्मपुरी","parent_id":"31"},
{"answer_id":"283","answer_english":"Dharwad","answer_hindi":"धारवाड़","parent_id":"16"},
{"answer_id":"51","answer_english":"Dhemaji","answer_hindi":"धेमाजी","parent_id":"4"},
{"answer_id":"467","answer_english":"Dhenkanal","answer_hindi":"ढेन्कानाल","parent_id":"26"},
{"answer_id":"527","answer_english":"Dholpur","answer_hindi":"धौलपुर","parent_id":"29"},
{"answer_id":"52","answer_english":"Dhubri","answer_hindi":"धुबरी","parent_id":"4"},
{"answer_id":"381","answer_english":"Dhule","answer_hindi":"धुले","parent_id":"21"},
{"answer_id":"53","answer_english":"Dibrugarh","answer_hindi":"डिब्रूगढ़","parent_id":"4"},
{"answer_id":"54","answer_english":"Dima Hasao","answer_hindi":"दिमा हसाओ","parent_id":"4"},
{"answer_id":"447","answer_english":"Dimapur","answer_hindi":"दीमापुर","parent_id":"25"},
{"answer_id":"558","answer_english":"Dindigul","answer_hindi":"डिंडिगुल","parent_id":"31"},
{"answer_id":"346","answer_english":"Dindori ","answer_hindi":"डिंडौरी","parent_id":"20"},
{"answer_id":"144","answer_english":"Diu","answer_hindi":"दीव ","parent_id":"8"},
{"answer_id":"230","answer_english":"Doda","answer_hindi":"डोडा","parent_id":"14"},
{"answer_id":"266","answer_english":"Dumka","answer_hindi":"दुमका","parent_id":"15"},
{"answer_id":"528","answer_english":"Dungarpur","answer_hindi":"डूंगरपुर","parent_id":"29"},
{"answer_id":"124","answer_english":"Durg","answer_hindi":"दुर्ग","parent_id":"7"},
{"answer_id":"85","answer_english":"East Champaran","answer_hindi":"पूर्वी चम्पारण जिला","parent_id":"5"},
{"answer_id":"148","answer_english":"East Delhi","answer_hindi":"पूर्वी दिल्ली","parent_id":"9"},
{"answer_id":"429","answer_english":"East Garo Hills","answer_hindi":"पूर्वी गारो हिल्स","parent_id":"23"},
{"answer_id":"3","answer_english":"East Godavari","answer_hindi":"पूर्व गोदावरी","parent_id":"1"},
{"answer_id":"434","answer_english":"East Jaintia Hills","answer_hindi":"पूर्व जयंतिया हिल्स","parent_id":"23"},
{"answer_id":"19","answer_english":"East Kameng","answer_hindi":"पूर्व कमेंग","parent_id":"3"},
{"answer_id":"425","answer_english":"East Khasi Hills","answer_hindi":"पूर्वी खासी हिल्स","parent_id":"23"},
{"answer_id":"20","answer_english":"East Siang","answer_hindi":"पूर्व सियांग","parent_id":"3"},
{"answer_id":"548","answer_english":"East Sikkim","answer_hindi":"पूर्व सिक्किम","parent_id":"30"},
{"answer_id":"263","answer_english":"East Singhbhum","answer_hindi":"पूर्वी सिंहभूम","parent_id":"15"},
{"answer_id":"302","answer_english":"Ernakulam","answer_hindi":"एर्नाकुलम","parent_id":"17"},
{"answer_id":"559","answer_english":"Erode","answer_hindi":"ईरोड","parent_id":"31"},
{"answer_id":"654","answer_english":"Etah","answer_hindi":"एटा","parent_id":"34"},
{"answer_id":"655","answer_english":"Etawah","answer_hindi":"इटावा","parent_id":"34"},
{"answer_id":"656","answer_english":"Faizabad","answer_hindi":"फैज़ाबाद शहर (अयोध्या)","parent_id":"34"},
{"answer_id":"195","answer_english":"Faridabad","answer_hindi":"फरीदाबाद","parent_id":"12"},
{"answer_id":"497","answer_english":"Faridkot","answer_hindi":"फरीदकोट","parent_id":"28"},
{"answer_id":"657","answer_english":"Farrukhabad","answer_hindi":"फ़र्रूख़ाबाद","parent_id":"34"},
{"answer_id":"196","answer_english":"Fatehabad","answer_hindi":"फतेहाबाद","parent_id":"12"},
{"answer_id":"498","answer_english":"Fatehgarh Sahib","answer_hindi":"फतेहगढ़ साहिब","parent_id":"28"},
{"answer_id":"658","answer_english":"Fatehpur","answer_hindi":"फतेहपुर","parent_id":"34"},
{"answer_id":"499","answer_english":"Fazilka","answer_hindi":"फाज़िल्का ","parent_id":"28"},
{"answer_id":"659","answer_english":"Firozabad","answer_hindi":"फ़िरोजाबाद","parent_id":"34"},
{"answer_id":"496","answer_english":"Firozpur","answer_hindi":"फिरोजपुर","parent_id":"28"},
{"answer_id":"284","answer_english":"Gadag","answer_hindi":"गदग","parent_id":"16"},
{"answer_id":"382","answer_english":"Gadchiroli","answer_hindi":"गडचिरोली","parent_id":"21"},
{"answer_id":"469","answer_english":"Gajapati","answer_hindi":"गजपति","parent_id":"26"},
{"answer_id":"231","answer_english":"Ganderbal","answer_hindi":"गांदरबल","parent_id":"14"},
{"answer_id":"171","answer_english":"Gandhinagar","answer_hindi":"गांधीनगर","parent_id":"11"},
{"answer_id":"529","answer_english":"Ganganagar","answer_hindi":"श्रीगंगानगर","parent_id":"29"},
{"answer_id":"468","answer_english":"Ganjam","answer_hindi":"गंजाम","parent_id":"26"},
{"answer_id":"246","answer_english":"Garhwa","answer_hindi":"गढवा","parent_id":"15"},
{"answer_id":"125","answer_english":"Gariaband","answer_hindi":"गरियाबंद","parent_id":"7"},
{"answer_id":"126","answer_english":"Gaurella-Pendra-Marwahi","answer_hindi":"गौरेला-पेण्ड्रा-मरवाही","parent_id":"7"},
{"answer_id":"660","answer_english":"Gautam Buddha Nagar","answer_hindi":"गौतमबुद्ध नगर","parent_id":"34"},
{"answer_id":"86","answer_english":"Gaya","answer_hindi":"गया","parent_id":"5"},
{"answer_id":"661","answer_english":"Ghaziabad","answer_hindi":"गाजियाबाद","parent_id":"34"},
{"answer_id":"662","answer_english":"Ghazipur","answer_hindi":"ग़ाज़ीपुर","parent_id":"34"},
{"answer_id":"172","answer_english":"Gir Somnath","answer_hindi":"गिर सोमनाथ","parent_id":"11"},
{"answer_id":"252","answer_english":"Giridih","answer_hindi":"गिरीडीह","parent_id":"15"},
{"answer_id":"55","answer_english":"Goalpara","answer_hindi":"गोवालपारा","parent_id":"4"},
{"answer_id":"268","answer_english":"Godda","answer_hindi":"गोड्डा","parent_id":"15"},
{"answer_id":"56","answer_english":"Golaghat","answer_hindi":"गोलाघाट","parent_id":"4"},
{"answer_id":"625","answer_english":"Gomati","answer_hindi":"गोमती","parent_id":"33"},
{"answer_id":"663","answer_english":"Gonda","answer_hindi":"गोंडा","parent_id":"34"},
{"answer_id":"383","answer_english":"Gondia","answer_hindi":"गोंदिया","parent_id":"21"},
{"answer_id":"87","answer_english":"Gopalganj","answer_hindi":"गोपालगंज","parent_id":"5"},
{"answer_id":"664","answer_english":"Gorakhpur","answer_hindi":"गोरखपुर","parent_id":"34"},
{"answer_id":"285","answer_english":"Gulbarga","answer_hindi":"गुलबर्ग","parent_id":"16"},
{"answer_id":"256","answer_english":"Gumla","answer_hindi":"गुमला","parent_id":"15"},
{"answer_id":"330","answer_english":"Guna ","answer_hindi":"गुना","parent_id":"20"},
{"answer_id":"4","answer_english":"Guntur","answer_hindi":"गुंटूर","parent_id":"1"},
{"answer_id":"500","answer_english":"Gurdaspur","answer_hindi":"गुरदासपुर","parent_id":"28"},
{"answer_id":"197","answer_english":"Gurgaon","answer_hindi":"गुरुग्राम","parent_id":"12"},
{"answer_id":"326","answer_english":"Gwalior ","answer_hindi":"ग्वालियर","parent_id":"20"},
{"answer_id":"57","answer_english":"Hailakandi","answer_hindi":"हैलाकांडी","parent_id":"4"},
{"answer_id":"665","answer_english":"Hamirpur","answer_hindi":"हमीरपुर","parent_id":"34"},
{"answer_id":"216","answer_english":"Hamirpur","answer_hindi":"हमीरपुर","parent_id":"13"},
{"answer_id":"530","answer_english":"Hanumangarh","answer_hindi":"हनुमानगढ़","parent_id":"29"},
{"answer_id":"666","answer_english":"Hapur","answer_hindi":"हापुड़","parent_id":"34"},
{"answer_id":"348","answer_english":"Harda ","answer_hindi":"हरदा","parent_id":"20"},
{"answer_id":"667","answer_english":"Hardoi","answer_hindi":"हरदोई","parent_id":"34"},
{"answer_id":"711","answer_english":"Haridwar","answer_hindi":"हरिद्वार","parent_id":"35"},
{"answer_id":"286","answer_english":"Hassan","answer_hindi":"हासन","parent_id":"16"},
{"answer_id":"668","answer_english":"Hathras","answer_hindi":"हाथरस","parent_id":"34"},
{"answer_id":"287","answer_english":"Haveri","answer_hindi":"हावेरी","parent_id":"16"},
{"answer_id":"250","answer_english":"Hazaribagh","answer_hindi":"हजारीबाग","parent_id":"15"},
{"answer_id":"384","answer_english":"Hingoli","answer_hindi":"हिंगोली","parent_id":"21"},
{"answer_id":"198","answer_english":"Hissar","answer_hindi":"हिसार","parent_id":"12"},
{"answer_id":"444","answer_english":"Hnahthial","answer_hindi":"ह्नाहथिआल","parent_id":"24"},
{"answer_id":"58","answer_english":"Hojai","answer_hindi":"होजाई","parent_id":"4"},
{"answer_id":"727","answer_english":"Hooghly","answer_hindi":"हुगली","parent_id":"36"},
{"answer_id":"349","answer_english":"Hoshangabad ","answer_hindi":"होशंगाबाद","parent_id":"20"},
{"answer_id":"501","answer_english":"Hoshiarpur","answer_hindi":"होशियारपुर","parent_id":"28"},
{"answer_id":"728","answer_english":"Howrah","answer_hindi":"हावङा","parent_id":"36"},
{"answer_id":"593","answer_english":"Hyderabad","answer_hindi":"हैदराबाद","parent_id":"32"},
{"answer_id":"303","answer_english":"Idukki","answer_hindi":"इडुक्की ","parent_id":"17"},
{"answer_id":"411","answer_english":"Imphal East","answer_hindi":"इम्फाल पूर्व","parent_id":"22"},
{"answer_id":"412","answer_english":"Imphal West","answer_hindi":"इम्फाल पश्चिम","parent_id":"22"},
{"answer_id":"334","answer_english":"Indore ","answer_hindi":"इन्दौर","parent_id":"20"},
{"answer_id":"341","answer_english":"Jabalpur ","answer_hindi":"जबलपुर","parent_id":"20"},
{"answer_id":"472","answer_english":"Jagatsinghapur","answer_hindi":"जगतसिंहपुर","parent_id":"26"},
{"answer_id":"594","answer_english":"Jagtial","answer_hindi":"जगित्याल","parent_id":"32"},
{"answer_id":"534","answer_english":"Jaipur","answer_hindi":"जयपुर","parent_id":"29"},
{"answer_id":"535","answer_english":"Jaisalmer","answer_hindi":"जैसलमेर","parent_id":"29"},
{"answer_id":"471","answer_english":"Jajpur","answer_hindi":"जाजपुर","parent_id":"26"},
{"answer_id":"502","answer_english":"Jalandhar","answer_hindi":"जालंधर","parent_id":"28"},
{"answer_id":"669","answer_english":"Jalaun","answer_hindi":"जलौन","parent_id":"34"},
{"answer_id":"385","answer_english":"Jalgaon","answer_hindi":"जळगाव","parent_id":"21"},
{"answer_id":"386","answer_english":"Jalna","answer_hindi":"जालना","parent_id":"21"},
{"answer_id":"532","answer_english":"Jalore","answer_hindi":"जालौर","parent_id":"29"},
{"answer_id":"729","answer_english":"Jalpaiguri","answer_hindi":"जलपाईगुङी","parent_id":"36"},
{"answer_id":"232","answer_english":"Jammu","answer_hindi":"जम्मू","parent_id":"14"},
{"answer_id":"173","answer_english":"Jamnagar","answer_hindi":"जामनगर","parent_id":"11"},
{"answer_id":"264","answer_english":"Jamtara","answer_hindi":"जामताड़ा","parent_id":"15"},
{"answer_id":"88","answer_english":"Jamui","answer_hindi":"जमुई","parent_id":"5"},
{"answer_id":"595","answer_english":"Jangaon","answer_hindi":"जनगाँव","parent_id":"32"},
{"answer_id":"127","answer_english":"Janjgir-Champa","answer_hindi":"जांजगीर-चाम्पा","parent_id":"7"},
{"answer_id":"128","answer_english":"Jashpur","answer_hindi":"जशपुर","parent_id":"7"},
{"answer_id":"670","answer_english":"Jaunpur","answer_hindi":"जौनपुर","parent_id":"34"},
{"answer_id":"596","answer_english":"Jayashankar Bhupalpally","answer_hindi":"जयशंकर भूपलपल्ली","parent_id":"32"},
{"answer_id":"89","answer_english":"Jehanabad","answer_hindi":"जहानाबाद","parent_id":"5"},
{"answer_id":"336","answer_english":"Jhabua ","answer_hindi":"झाबुआ","parent_id":"20"},
{"answer_id":"199","answer_english":"Jhajjar","answer_hindi":"झज्जर","parent_id":"12"},
{"answer_id":"536","answer_english":"Jhalawar","answer_hindi":"झालावाड़","parent_id":"29"},
{"answer_id":"671","answer_english":"Jhansi","answer_hindi":"झाँसी","parent_id":"34"},
{"answer_id":"730","answer_english":"Jhargram","answer_hindi":"झाड़ग्राम","parent_id":"36"},
{"answer_id":"470","answer_english":"Jharsuguda","answer_hindi":"झारसुगुड़ा","parent_id":"26"},
{"answer_id":"531","answer_english":"Jhunjhunu","answer_hindi":"झुंझुनू","parent_id":"29"},
{"answer_id":"200","answer_english":"Jind","answer_hindi":"जींद","parent_id":"12"},
{"answer_id":"418","answer_english":"Jiribam","answer_hindi":"जिरिबाम","parent_id":"22"},
{"answer_id":"533","answer_english":"Jodhpur","answer_hindi":"जोधपुर","parent_id":"29"},
{"answer_id":"597","answer_english":"Jogulamba Gadwal","answer_hindi":"जोगुलाम्बा गद्वाल","parent_id":"32"},
{"answer_id":"59","answer_english":"Jorhat","answer_hindi":"जोरहाट","parent_id":"4"},
{"answer_id":"174","answer_english":"Junagadh","answer_hindi":"जूनागढ़","parent_id":"11"},
{"answer_id":"129","answer_english":"Kabirdham \/ Kawardha","answer_hindi":"कबीरधाम \/ कवर्धा","parent_id":"7"},
{"answer_id":"5","answer_english":"Kadapa","answer_hindi":"कड़प्पा","parent_id":"1"},
{"answer_id":"90","answer_english":"Kaimur","answer_hindi":"कैमूर","parent_id":"5"},
{"answer_id":"201","answer_english":"Kaithal","answer_hindi":"कैथल","parent_id":"12"},
{"answer_id":"420","answer_english":"Kakching","answer_hindi":"ककचिंग ","parent_id":"22"},
{"answer_id":"475","answer_english":"Kalahandi","answer_hindi":"कलाहान्डी","parent_id":"26"},
{"answer_id":"731","answer_english":"Kalimpong","answer_hindi":"कलिम्पोग","parent_id":"36"},
{"answer_id":"560","answer_english":"Kallakurichi","answer_hindi":"कल्लाकुरिची","parent_id":"31"},
{"answer_id":"598","answer_english":"Kamareddy","answer_hindi":"कामारेड्डी","parent_id":"32"},
{"answer_id":"422","answer_english":"Kamjong","answer_hindi":"कमजोंग ","parent_id":"22"},
{"answer_id":"21","answer_english":"Kamle","answer_hindi":"कमले","parent_id":"3"},
{"answer_id":"61","answer_english":"Kamrup","answer_hindi":"कामरूप","parent_id":"4"},
{"answer_id":"60","answer_english":"Kamrup Metropolitan","answer_hindi":"कामरूप महानगर","parent_id":"4"},
{"answer_id":"561","answer_english":"Kanchipuram","answer_hindi":"कांचीपुरम","parent_id":"31"},
{"answer_id":"476","answer_english":"Kandhamal","answer_hindi":"कन्धमाल","parent_id":"26"},
{"answer_id":"419","answer_english":"Kangpokpi (Sadar Hills)","answer_hindi":"कंगपोकपी","parent_id":"22"},
{"answer_id":"217","answer_english":"Kangra","answer_hindi":"काँगड़ा","parent_id":"13"},
{"answer_id":"130","answer_english":"Kanker","answer_hindi":"कांकेर  (उत्तर बस्तर)","parent_id":"7"},
{"answer_id":"672","answer_english":"Kannauj","answer_hindi":"कन्नौज","parent_id":"34"},
{"answer_id":"304","answer_english":"Kannur","answer_hindi":"कन्नूर","parent_id":"17"},
{"answer_id":"673","answer_english":"Kanpur Dehat","answer_hindi":"कानपुर देहात","parent_id":"34"},
{"answer_id":"674","answer_english":"Kanpur Nagar","answer_hindi":"कानपुर नगर","parent_id":"34"},
{"answer_id":"562","answer_english":"Kanyakumari","answer_hindi":"कन्याकुमारी","parent_id":"31"},
{"answer_id":"503","answer_english":"Kapurthala","answer_hindi":"कपूरथला","parent_id":"28"},
{"answer_id":"489","answer_english":"Karaikal","answer_hindi":"कराईकल ","parent_id":"27"},
{"answer_id":"537","answer_english":"Karauli","answer_hindi":"करौली","parent_id":"29"},
{"answer_id":"62","answer_english":"Karbi Anglong","answer_hindi":"कार्बी आंगलोंग","parent_id":"4"},
{"answer_id":"315","answer_english":"Kargil ","answer_hindi":"कारगिल","parent_id":"18"},
{"answer_id":"63","answer_english":"Karimganj","answer_hindi":"करीमगंज","parent_id":"4"},
{"answer_id":"599","answer_english":"Karimnagar","answer_hindi":"करीमनगर","parent_id":"32"},
{"answer_id":"202","answer_english":"Karnal","answer_hindi":"करनाल","parent_id":"12"},
{"answer_id":"563","answer_english":"Karur","answer_hindi":"करूर","parent_id":"31"},
{"answer_id":"305","answer_english":"Kasaragod","answer_hindi":"कासरगोड ","parent_id":"17"},
{"answer_id":"675","answer_english":"Kasganj","answer_hindi":"कासगंज ","parent_id":"34"},
{"answer_id":"233","answer_english":"Kathua","answer_hindi":"कठुआ","parent_id":"14"},
{"answer_id":"91","answer_english":"Katihar","answer_hindi":"कटिहार","parent_id":"5"},
{"answer_id":"342","answer_english":"Katni ","answer_hindi":"कटनी","parent_id":"20"},
{"answer_id":"676","answer_english":"Kaushambi","answer_hindi":"कौशाम्बी","parent_id":"34"},
{"answer_id":"478","answer_english":"Kendrapara","answer_hindi":"केन्द्रापड़ा","parent_id":"26"},
{"answer_id":"474","answer_english":"Kendujhar","answer_hindi":"केन्दुझर","parent_id":"26"},
{"answer_id":"92","answer_english":"Khagaria","answer_hindi":"खगड़िया","parent_id":"5"},
{"answer_id":"600","answer_english":"Khammam","answer_hindi":"खम्मम","parent_id":"32"},
{"answer_id":"337","answer_english":"Khandwa (East Nimar)","answer_hindi":"खंडवा","parent_id":"20"},
{"answer_id":"338","answer_english":"Khargone (West Nimar)","answer_hindi":"खरगोन","parent_id":"20"},
{"answer_id":"445","answer_english":"Khawzawl","answer_hindi":"खावजौल","parent_id":"24"},
{"answer_id":"176","answer_english":"Kheda","answer_hindi":"खेड़ा","parent_id":"11"},
{"answer_id":"473","answer_english":"Khordha","answer_hindi":"खोर्धा","parent_id":"26"},
{"answer_id":"628","answer_english":"Khowai","answer_hindi":"खोवाई","parent_id":"33"},
{"answer_id":"260","answer_english":"Khunti","answer_hindi":"खुटी","parent_id":"15"},
{"answer_id":"218","answer_english":"Kinnaur","answer_hindi":"किन्नौर","parent_id":"13"},
{"answer_id":"448","answer_english":"Kiphire","answer_hindi":"कैफाइर","parent_id":"25"},
{"answer_id":"93","answer_english":"Kishanganj","answer_hindi":"किशनगंज","parent_id":"5"},
{"answer_id":"234","answer_english":"Kishtwar","answer_hindi":"किश्तवाड़","parent_id":"14"},
{"answer_id":"288","answer_english":"Kodagu","answer_hindi":"कोडगु","parent_id":"16"},
{"answer_id":"251","answer_english":"Koderma","answer_hindi":"कोडरमा","parent_id":"15"},
{"answer_id":"449","answer_english":"Kohima","answer_hindi":"कोहिमा","parent_id":"25"},
{"answer_id":"64","answer_english":"Kokrajhar","answer_hindi":"कोकराझार","parent_id":"4"},
{"answer_id":"289","answer_english":"Kolar","answer_hindi":"कोलार","parent_id":"16"},
{"answer_id":"437","answer_english":"Kolasib","answer_hindi":"कोलासिब","parent_id":"24"},
{"answer_id":"387","answer_english":"Kolhapur","answer_hindi":"कोल्हापुर","parent_id":"21"},
{"answer_id":"732","answer_english":"Kolkata","answer_hindi":"कोलकाता","parent_id":"36"},
{"answer_id":"306","answer_english":"Kollam","answer_hindi":"कोल्लम","parent_id":"17"},
{"answer_id":"591","answer_english":"Komaram Bheem","answer_hindi":"कोमरम भीम","parent_id":"32"},
{"answer_id":"131","answer_english":"Kondagaon","answer_hindi":"कोंडगाँव","parent_id":"7"},
{"answer_id":"290","answer_english":"Koppal","answer_hindi":"कोप्पल","parent_id":"16"},
{"answer_id":"477","answer_english":"Koraput","answer_hindi":"कोरापुट","parent_id":"26"},
{"answer_id":"132","answer_english":"Korba","answer_hindi":"कोरबा","parent_id":"7"},
{"answer_id":"133","answer_english":"Koriya","answer_hindi":"कोरिया","parent_id":"7"},
{"answer_id":"538","answer_english":"Kota","answer_hindi":"कोटा","parent_id":"29"},
{"answer_id":"307","answer_english":"Kottayam","answer_hindi":"कोट्टयम","parent_id":"17"},
{"answer_id":"308","answer_english":"Kozhikode","answer_hindi":"कोड़िकोड","parent_id":"17"},
{"answer_id":"22","answer_english":"Kra Daadi","answer_hindi":"क्रा दादी","parent_id":"3"},
{"answer_id":"6","answer_english":"Krishna","answer_hindi":"कृष्णा","parent_id":"1"},
{"answer_id":"564","answer_english":"Krishnagiri","answer_hindi":"कृष्णगिरि","parent_id":"31"},
{"answer_id":"235","answer_english":"Kulgam","answer_hindi":"कुलगाम","parent_id":"14"},
{"answer_id":"219","answer_english":"Kullu","answer_hindi":"कुल्लू","parent_id":"13"},
{"answer_id":"236","answer_english":"Kupwara","answer_hindi":"कुपवाड़ा","parent_id":"14"},
{"answer_id":"7","answer_english":"Kurnool","answer_hindi":"कुर्नूल","parent_id":"1"},
{"answer_id":"203","answer_english":"Kurukshetra","answer_hindi":"कुरुक्षेत्र","parent_id":"12"},
{"answer_id":"23","answer_english":"Kurung Kumey","answer_hindi":"कुरुंग कुमे","parent_id":"3"},
{"answer_id":"677","answer_english":"Kushinagar","answer_hindi":"कुशीनगर (पड़रौना)","parent_id":"34"},
{"answer_id":"175","answer_english":"Kutch","answer_hindi":"कच्छ","parent_id":"11"},
{"answer_id":"220","answer_english":"Lahaul and Spiti","answer_hindi":"लाहौल और स्पीती","parent_id":"13"},
{"answer_id":"65","answer_english":"Lakhimpur","answer_hindi":"लखीमपुर","parent_id":"4"},
{"answer_id":"678","answer_english":"Lakhimpur Kheri","answer_hindi":"लखीमपुर-खिरी","parent_id":"34"},
{"answer_id":"94","answer_english":"Lakhisarai","answer_hindi":"लखीसराय","parent_id":"5"},
{"answer_id":"317","answer_english":"Lakshadweep","answer_hindi":"लक्षद्वीप","parent_id":"19"},
{"answer_id":"679","answer_english":"Lalitpur","answer_hindi":"ललितपुर","parent_id":"34"},
{"answer_id":"248","answer_english":"Latehar","answer_hindi":"लातेहार","parent_id":"15"},
{"answer_id":"388","answer_english":"Latur","answer_hindi":"लातूर","parent_id":"21"},
{"answer_id":"438","answer_english":"Lawngtlai","answer_hindi":"लॉङ्गतलाई","parent_id":"24"},
{"answer_id":"316","answer_english":"Leh ","answer_hindi":"लेह","parent_id":"18"},
{"answer_id":"24","answer_english":"Lepa Rada","answer_hindi":"लेपा रादा","parent_id":"3"},
{"answer_id":"257","answer_english":"Lohardaga","answer_hindi":"लोहरदग्गा","parent_id":"15"},
{"answer_id":"25","answer_english":"Lohit","answer_hindi":"लोहित","parent_id":"3"},
{"answer_id":"26","answer_english":"Longding","answer_hindi":"लोंगडिंग","parent_id":"3"},
{"answer_id":"450","answer_english":"Longleng","answer_hindi":"लॉन्गलेन्ग","parent_id":"25"},
{"answer_id":"27","answer_english":"Lower Dibang Valley","answer_hindi":"निचली दिबांग घाटी","parent_id":"3"},
{"answer_id":"28","answer_english":"Lower Siang","answer_hindi":"निचला सियांग","parent_id":"3"},
{"answer_id":"29","answer_english":"Lower Subansiri","answer_hindi":"निचली सुबनसिरी","parent_id":"3"},
{"answer_id":"680","answer_english":"Lucknow","answer_hindi":"लखनऊ","parent_id":"34"},
{"answer_id":"504","answer_english":"Ludhiana","answer_hindi":"लुधियाना","parent_id":"28"},
{"answer_id":"439","answer_english":"Lunglei","answer_hindi":"लुंगलेई","parent_id":"24"},
{"answer_id":"95","answer_english":"Madhepura","answer_hindi":"मधेपुरा","parent_id":"5"},
{"answer_id":"96","answer_english":"Madhubani","answer_hindi":"मधुबनी","parent_id":"5"},
{"answer_id":"565","answer_english":"Madurai","answer_hindi":"मदुरई","parent_id":"31"},
{"answer_id":"601","answer_english":"Mahabubabad","answer_hindi":"महाबूबाबाद","parent_id":"32"},
{"answer_id":"681","answer_english":"Maharajganj","answer_hindi":"महाराजगंज","parent_id":"34"},
{"answer_id":"134","answer_english":"Mahasamund","answer_hindi":"महासमुन्द","parent_id":"7"},
{"answer_id":"602","answer_english":"Mahbubnagar","answer_hindi":"महबूबनगर","parent_id":"32"},
{"answer_id":"490","answer_english":"Mahé","answer_hindi":"माहे ","parent_id":"27"},
{"answer_id":"204","answer_english":"Mahendragarh","answer_hindi":"महेंद्रगढ़","parent_id":"12"},
{"answer_id":"177","answer_english":"Mahisagar","answer_hindi":"महीसागर","parent_id":"11"},
{"answer_id":"682","answer_english":"Mahoba","answer_hindi":"महोबा","parent_id":"34"},
{"answer_id":"371","answer_english":"Maihar","answer_hindi":"मैहर","parent_id":"20"},
{"answer_id":"683","answer_english":"Mainpuri","answer_hindi":"मैनपुरी","parent_id":"34"},
{"answer_id":"66","answer_english":"Majuli","answer_hindi":"माजुली","parent_id":"4"},
{"answer_id":"309","answer_english":"Malappuram","answer_hindi":"मलप्पुरम","parent_id":"17"},
{"answer_id":"733","answer_english":"Maldah","answer_hindi":"मालदह","parent_id":"36"},
{"answer_id":"479","answer_english":"Malkangiri","answer_hindi":"मालकानगिरि","parent_id":"26"},
{"answer_id":"440","answer_english":"Mamit","answer_hindi":"ममित","parent_id":"24"},
{"answer_id":"603","answer_english":"Mancherial","answer_hindi":"मंचेरियल","parent_id":"32"},
{"answer_id":"221","answer_english":"Mandi","answer_hindi":"मंडी","parent_id":"13"},
{"answer_id":"343","answer_english":"Mandla ","answer_hindi":"मंडला","parent_id":"20"},
{"answer_id":"365","answer_english":"Mandsaur","answer_hindi":"मंदसौर","parent_id":"20"},
{"answer_id":"291","answer_english":"Mandya","answer_hindi":"मांडया","parent_id":"16"},
{"answer_id":"505","answer_english":"Mansa","answer_hindi":"मानसा","parent_id":"28"},
{"answer_id":"684","answer_english":"Mathura","answer_hindi":"मथुरा","parent_id":"34"},
{"answer_id":"685","answer_english":"Mau","answer_hindi":"मऊ","parent_id":"34"},
{"answer_id":"566","answer_english":"Mayiladuthurai","answer_hindi":"मयीलाडूतुरै","parent_id":"31"},
{"answer_id":"480","answer_english":"Mayurbhanj","answer_hindi":"मयूरभंज","parent_id":"26"},
{"answer_id":"604","answer_english":"Medak","answer_hindi":"मेदक","parent_id":"32"},
{"answer_id":"605","answer_english":"Medchal-Malkajgiri","answer_hindi":"मेड्चल मल्काजगिरि","parent_id":"32"},
{"answer_id":"686","answer_english":"Meerut","answer_hindi":"मेरठ","parent_id":"34"},
{"answer_id":"178","answer_english":"Mehsana","answer_hindi":"मेहसाणा","parent_id":"11"},
{"answer_id":"687","answer_english":"Mirzapur","answer_hindi":"मिर्ज़ापुर","parent_id":"34"},
{"answer_id":"506","answer_english":"Moga","answer_hindi":"मोगा","parent_id":"28"},
{"answer_id":"451","answer_english":"Mokokchung","answer_hindi":"मोकोकचुआंग","parent_id":"25"},
{"answer_id":"452","answer_english":"Mon","answer_hindi":"मोन","parent_id":"25"},
{"answer_id":"688","answer_english":"Moradabad","answer_hindi":"मुरादाबाद","parent_id":"34"},
{"answer_id":"179","answer_english":"Morbi","answer_hindi":"मोरबी","parent_id":"11"},
{"answer_id":"323","answer_english":"Morena ","answer_hindi":"मुरैना","parent_id":"20"},
{"answer_id":"67","answer_english":"Morigaon","answer_hindi":"मारिगांव","parent_id":"4"},
{"answer_id":"606","answer_english":"Mulugu","answer_hindi":"मुलुगु","parent_id":"32"},
{"answer_id":"389","answer_english":"Mumbai","answer_hindi":"मुंबई","parent_id":"21"},
{"answer_id":"390","answer_english":"Mumbai Suburban","answer_hindi":"मुंबई (सबअर्बन)","parent_id":"21"},
{"answer_id":"135","answer_english":"Mungeli","answer_hindi":"मुंगेली","parent_id":"7"},
{"answer_id":"97","answer_english":"Munger","answer_hindi":"मुंगेर","parent_id":"5"},
{"answer_id":"734","answer_english":"Murshidabad","answer_hindi":"मुर्शिदाबाद","parent_id":"36"},
{"answer_id":"689","answer_english":"Muzaffarnagar","answer_hindi":"मुजफ्फरनगर","parent_id":"34"},
{"answer_id":"98","answer_english":"Muzaffarpur","answer_hindi":"मुजफ्फरपुर","parent_id":"5"},
{"answer_id":"292","answer_english":"Mysore","answer_hindi":"मैसूर","parent_id":"16"},
{"answer_id":"481","answer_english":"Nabarangpur","answer_hindi":"नबरंगपुर","parent_id":"26"},
{"answer_id":"735","answer_english":"Nadia","answer_hindi":"नादिया","parent_id":"36"},
{"answer_id":"68","answer_english":"Nagaon","answer_hindi":"नगांव","parent_id":"4"},
{"answer_id":"567","answer_english":"Nagapattinam","answer_hindi":"नागपट्टिनम","parent_id":"31"},
{"answer_id":"609","answer_english":"Nagarkurnool","answer_hindi":"नागरकर्नूल","parent_id":"32"},
{"answer_id":"539","answer_english":"Nagaur","answer_hindi":"नागौर","parent_id":"29"},
{"answer_id":"372","answer_english":"Nagda","answer_hindi":"नागदा","parent_id":"20"},
{"answer_id":"391","answer_english":"Nagpur","answer_hindi":"नागपुर","parent_id":"21"},
{"answer_id":"712","answer_english":"Nainital","answer_hindi":"नैनीताल","parent_id":"35"},
{"answer_id":"99","answer_english":"Nalanda","answer_hindi":"नालंदा","parent_id":"5"},
{"answer_id":"69","answer_english":"Nalbari","answer_hindi":"नलबाड़ी","parent_id":"4"},
{"answer_id":"607","answer_english":"Nalgonda","answer_hindi":"नलगोंडा","parent_id":"32"},
{"answer_id":"569","answer_english":"Namakkal","answer_hindi":"नामक्कल","parent_id":"31"},
{"answer_id":"30","answer_english":"Namsai","answer_hindi":"नामसाई","parent_id":"3"},
{"answer_id":"392","answer_english":"Nanded","answer_hindi":"नांदेड","parent_id":"21"},
{"answer_id":"393","answer_english":"Nandurbar","answer_hindi":"नंदुरबार","parent_id":"21"},
{"answer_id":"608","answer_english":"Narayanpet","answer_hindi":"नारायणपेट","parent_id":"32"},
{"answer_id":"136","answer_english":"Narayanpur","answer_hindi":"नारायणपुर","parent_id":"7"},
{"answer_id":"180","answer_english":"Narmada","answer_hindi":"नर्मदा","parent_id":"11"},
{"answer_id":"344","answer_english":"Narsinghpur ","answer_hindi":"नरसिंहपुर","parent_id":"20"},
{"answer_id":"394","answer_english":"Nashik","answer_hindi":"नाशिक","parent_id":"21"},
{"answer_id":"181","answer_english":"Navsari","answer_hindi":"नवसारी","parent_id":"11"},
{"answer_id":"100","answer_english":"Nawada","answer_hindi":"नवादा","parent_id":"5"},
{"answer_id":"483","answer_english":"Nayagarh","answer_hindi":"नयागड़","parent_id":"26"},
{"answer_id":"366","answer_english":"Neemuch","answer_hindi":"नीमच","parent_id":"20"},
{"answer_id":"8","answer_english":"Nellore","answer_hindi":"नेल्लौर","parent_id":"1"},
{"answer_id":"146","answer_english":"New Delhi","answer_hindi":"नई दिल्ली","parent_id":"9"},
{"answer_id":"14","answer_english":"Nicobar","answer_hindi":"निकोबार","parent_id":"2"},
{"answer_id":"568","answer_english":"Nilgiris","answer_hindi":"नीलगिरि","parent_id":"31"},
{"answer_id":"610","answer_english":"Nirmal","answer_hindi":"निर्मल","parent_id":"32"},
{"answer_id":"359","answer_english":"Niwari ","answer_hindi":"निवाड़ी","parent_id":"20"},
{"answer_id":"611","answer_english":"Nizamabad","answer_hindi":"निज़ामाबाद","parent_id":"32"},
{"answer_id":"458","answer_english":"Noklak","answer_hindi":"नोक्लक","parent_id":"25"},
{"answer_id":"423","answer_english":"Noney","answer_hindi":"नोने","parent_id":"22"},
{"answer_id":"736","answer_english":"North 24 Parganas","answer_hindi":"उत्तर 24 परगना","parent_id":"36"},
{"answer_id":"15","answer_english":"North and Middle Andaman","answer_hindi":"उत्तर और मध्य अण्डमान जिला","parent_id":"2"},
{"answer_id":"149","answer_english":"North Delhi ","answer_hindi":"उत्तर दिल्ली","parent_id":"9"},
{"answer_id":"150","answer_english":"North East Delhi","answer_hindi":"उत्तर पूर्वी दिल्ली","parent_id":"9"},
{"answer_id":"435","answer_english":"North Garo Hills","answer_hindi":"उत्तर गारो हिल्स","parent_id":"23"},
{"answer_id":"157","answer_english":"North Goa","answer_hindi":"उत्तर गोवा","parent_id":"10"},
{"answer_id":"549","answer_english":"North Sikkim","answer_hindi":"उत्तर सिक्किम","parent_id":"30"},
{"answer_id":"626","answer_english":"North Tripura","answer_hindi":"उत्तर त्रिपुरा","parent_id":"33"},
{"answer_id":"151","answer_english":"North West Delhi","answer_hindi":"उत्तर पश्चिम दिल्ली","parent_id":"9"},
{"answer_id":"482","answer_english":"Nuapada","answer_hindi":"नुआपड़ा","parent_id":"26"},
{"answer_id":"205","answer_english":"Nuh","answer_hindi":"नूह ","parent_id":"12"},
{"answer_id":"395","answer_english":"Osmanabad","answer_hindi":"उस्मानाबाद","parent_id":"21"},
{"answer_id":"31","answer_english":"Pakke-Kessang","answer_hindi":"पक्के केसांग","parent_id":"3"},
{"answer_id":"267","answer_english":"Pakur","answer_hindi":"पाकुड़","parent_id":"15"},
{"answer_id":"310","answer_english":"Palakkad","answer_hindi":"पालक्काड़ ","parent_id":"17"},
{"answer_id":"247","answer_english":"Palamu","answer_hindi":"पलामू","parent_id":"15"},
{"answer_id":"396","answer_english":"Palghar","answer_hindi":"पालघर","parent_id":"21"},
{"answer_id":"540","answer_english":"Pali","answer_hindi":"पाली","parent_id":"29"},
{"answer_id":"206","answer_english":"Palwal","answer_hindi":"पलवल","parent_id":"12"},
{"answer_id":"207","answer_english":"Panchkula","answer_hindi":"पंचकुला","parent_id":"12"},
{"answer_id":"182","answer_english":"Panchmahal","answer_hindi":"पंचमहल","parent_id":"11"},
{"answer_id":"208","answer_english":"Panipat","answer_hindi":"पानीपत","parent_id":"12"},
{"answer_id":"356","answer_english":"Panna ","answer_hindi":"पन्ना","parent_id":"20"},
{"answer_id":"32","answer_english":"Papum Pare","answer_hindi":"पपुमपारे","parent_id":"3"},
{"answer_id":"397","answer_english":"Parbhani","answer_hindi":"परभणी","parent_id":"21"},
{"answer_id":"721","answer_english":"Paschim Bardhaman","answer_hindi":"पश्चिमी वर्धमान","parent_id":"36"},
{"answer_id":"737","answer_english":"Paschim Medinipur","answer_hindi":"पश्चिम मेदिनीपुर","parent_id":"36"},
{"answer_id":"183","answer_english":"Patan","answer_hindi":"पाटन","parent_id":"11"},
{"answer_id":"311","answer_english":"Pathanamthitta","answer_hindi":"पतनमतिट्टा","parent_id":"17"},
{"answer_id":"508","answer_english":"Pathankot","answer_hindi":"पठानकोट","parent_id":"28"},
{"answer_id":"509","answer_english":"Patiala","answer_hindi":"पटियाला","parent_id":"28"},
{"answer_id":"101","answer_english":"Patna","answer_hindi":"पटना","parent_id":"5"},
{"answer_id":"713","answer_english":"Pauri Garhwal","answer_hindi":"पौड़ी गढ़वाल","parent_id":"35"},
{"answer_id":"612","answer_english":"Peddapalli","answer_hindi":"पेद्दपल्ले","parent_id":"32"},
{"answer_id":"570","answer_english":"Perambalur","answer_hindi":"पेरम्बलुर","parent_id":"31"},
{"answer_id":"453","answer_english":"Peren","answer_hindi":"पेरेन","parent_id":"25"},
{"answer_id":"454","answer_english":"Phek","answer_hindi":"फेक","parent_id":"25"},
{"answer_id":"424","answer_english":"Pherzawl","answer_hindi":"फेरज़ौल ","parent_id":"22"},
{"answer_id":"690","answer_english":"Pilibhit","answer_hindi":"पीलीभीत","parent_id":"34"},
{"answer_id":"714","answer_english":"Pithoragarh","answer_hindi":"पिथौरागढ़","parent_id":"35"},
{"answer_id":"237","answer_english":"Poonch","answer_hindi":"पुंछ","parent_id":"14"},
{"answer_id":"184","answer_english":"Porbandar","answer_hindi":"पोरबंदर","parent_id":"11"},
{"answer_id":"9","answer_english":"Prakasam","answer_hindi":"प्रकाशम","parent_id":"1"},
{"answer_id":"541","answer_english":"Pratapgarh","answer_hindi":"प्रतापगढ़","parent_id":"29"},
{"answer_id":"691","answer_english":"Pratapgarh","answer_hindi":"प्रतापगढ","parent_id":"34"},
{"answer_id":"491","answer_english":"Puducherry","answer_hindi":"पुदुचेरी","parent_id":"27"},
{"answer_id":"571","answer_english":"Pudukkottai","answer_hindi":"पुदुकोट्टई","parent_id":"31"},
{"answer_id":"238","answer_english":"Pulwama","answer_hindi":"पुलवामा","parent_id":"14"},
{"answer_id":"398","answer_english":"Pune","answer_hindi":"पुणे","parent_id":"21"},
{"answer_id":"722","answer_english":"Purba Bardhaman","answer_hindi":"पूर्व बर्धमान ","parent_id":"36"},
{"answer_id":"738","answer_english":"Purba Medinipur","answer_hindi":"पूर्व मेदिनीपुर","parent_id":"36"},
{"answer_id":"484","answer_english":"Puri","answer_hindi":"पुरी","parent_id":"26"},
{"answer_id":"102","answer_english":"Purnia","answer_hindi":"पूर्णिया","parent_id":"5"},
{"answer_id":"739","answer_english":"Purulia","answer_hindi":"पुरूलिया","parent_id":"36"},
{"answer_id":"692","answer_english":"Raebareli","answer_hindi":"रायबरेली","parent_id":"34"},
{"answer_id":"293","answer_english":"Raichur","answer_hindi":"रायचूर","parent_id":"16"},
{"answer_id":"399","answer_english":"Raigad","answer_hindi":"रायगड","parent_id":"21"},
{"answer_id":"137","answer_english":"Raigarh","answer_hindi":"रायगढ","parent_id":"7"},
{"answer_id":"138","answer_english":"Raipur","answer_hindi":"रायपुर","parent_id":"7"},
{"answer_id":"319","answer_english":"Raisen","answer_hindi":"रायसेन","parent_id":"20"},
{"answer_id":"613","answer_english":"Rajanna Sircilla","answer_hindi":"राजन्ना सिरसिल्ला","parent_id":"32"},
{"answer_id":"320","answer_english":"Rajgarh ","answer_hindi":"राजगढ़","parent_id":"20"},
{"answer_id":"185","answer_english":"Rajkot","answer_hindi":"राजकोट","parent_id":"11"},
{"answer_id":"139","answer_english":"Rajnandgaon","answer_hindi":"राजनांदगांव","parent_id":"7"},
{"answer_id":"239","answer_english":"Rajouri","answer_hindi":"राजौरी","parent_id":"14"},
{"answer_id":"542","answer_english":"Rajsamand","answer_hindi":"राजसमंद","parent_id":"29"},
{"answer_id":"294","answer_english":"Ramanagara","answer_hindi":"रामनगर","parent_id":"16"},
{"answer_id":"572","answer_english":"Ramanathapuram","answer_hindi":"रामनाथपुरम","parent_id":"31"},
{"answer_id":"240","answer_english":"Ramban","answer_hindi":"रामबन","parent_id":"14"},
{"answer_id":"253","answer_english":"Ramgarh","answer_hindi":"रामगढ़","parent_id":"15"},
{"answer_id":"693","answer_english":"Rampur","answer_hindi":"रामपुर","parent_id":"34"},
{"answer_id":"259","answer_english":"Ranchi","answer_hindi":"राँची","parent_id":"15"},
{"answer_id":"614","answer_english":"Ranga Reddy","answer_hindi":"रंगारेड्डी","parent_id":"32"},
{"answer_id":"573","answer_english":"Ranipet","answer_hindi":"रानीपेट","parent_id":"31"},
{"answer_id":"367","answer_english":"Ratlam","answer_hindi":"रतलाम","parent_id":"20"},
{"answer_id":"400","answer_english":"Ratnagiri","answer_hindi":"रत्नागिरी","parent_id":"21"},
{"answer_id":"485","answer_english":"Rayagada","answer_hindi":"रायगड़ा","parent_id":"26"},
{"answer_id":"241","answer_english":"Reasi","answer_hindi":"रियासी","parent_id":"14"},
{"answer_id":"350","answer_english":"Rewa ","answer_hindi":"रीवा","parent_id":"20"},
{"answer_id":"209","answer_english":"Rewari","answer_hindi":"रेवाड़ी","parent_id":"12"},
{"answer_id":"430","answer_english":"Ri Bhoi","answer_hindi":"री भोई","parent_id":"23"},
{"answer_id":"210","answer_english":"Rohtak","answer_hindi":"रोहतक","parent_id":"12"},
{"answer_id":"103","answer_english":"Rohtas","answer_hindi":"रोहतास","parent_id":"5"},
{"answer_id":"715","answer_english":"Rudraprayag","answer_hindi":"रुद्रप्रयाग","parent_id":"35"},
{"answer_id":"510","answer_english":"Rupnagar","answer_hindi":"रूपनगर","parent_id":"28"},
{"answer_id":"186","answer_english":"Sabarkantha","answer_hindi":"साबरकांठा","parent_id":"11"},
{"answer_id":"357","answer_english":"Sagar ","answer_hindi":"सागर","parent_id":"20"},
{"answer_id":"694","answer_english":"Saharanpur","answer_hindi":"सहारनपुर","parent_id":"34"},
{"answer_id":"104","answer_english":"Saharsa","answer_hindi":"सहरसा","parent_id":"5"},
{"answer_id":"269","answer_english":"Sahebganj","answer_hindi":"साहिबगंज","parent_id":"15"},
{"answer_id":"511","answer_english":"Sahibzada Ajit Singh Nagar","answer_hindi":"मोहाली\/ साहिबजादा अजीत सिंह नगर","parent_id":"28"},
{"answer_id":"441","answer_english":"Saiha","answer_hindi":"सइहा","parent_id":"24"},
{"answer_id":"446","answer_english":"Saitual","answer_hindi":"सइतुआल","parent_id":"24"},
{"answer_id":"574","answer_english":"Salem","answer_hindi":"सेलम","parent_id":"31"},
{"answer_id":"105","answer_english":"Samastipur","answer_hindi":"समस्तीपुर","parent_id":"5"},
{"answer_id":"242","answer_english":"Samba","answer_hindi":"सांबा","parent_id":"14"},
{"answer_id":"486","answer_english":"Sambalpur","answer_hindi":"सम्बलपुर","parent_id":"26"},
{"answer_id":"695","answer_english":"Sambhal","answer_hindi":"सम्भल","parent_id":"34"},
{"answer_id":"615","answer_english":"Sangareddy","answer_hindi":"संगारेड्डी","parent_id":"32"},
{"answer_id":"401","answer_english":"Sangli","answer_hindi":"सांगली","parent_id":"21"},
{"answer_id":"512","answer_english":"Sangrur","answer_hindi":"संगरूर","parent_id":"28"},
{"answer_id":"696","answer_english":"Sant Kabir Nagar","answer_hindi":"संत कबीरनगर","parent_id":"34"},
{"answer_id":"262","answer_english":"Saraikela Kharsawan","answer_hindi":"सराइकेला खरसावाँ","parent_id":"15"},
{"answer_id":"106","answer_english":"Saran","answer_hindi":"सारन","parent_id":"5"},
{"answer_id":"402","answer_english":"Satara","answer_hindi":"सातारा","parent_id":"21"},
{"answer_id":"351","answer_english":"Satna ","answer_hindi":"सतना","parent_id":"20"},
{"answer_id":"544","answer_english":"Sawai Madhopur","answer_hindi":"सवाई माधोपुर","parent_id":"29"},
{"answer_id":"321","answer_english":"Sehore ","answer_hindi":"सीहोर","parent_id":"20"},
{"answer_id":"413","answer_english":"Senapati","answer_hindi":"सेनापति जिला","parent_id":"22"},
{"answer_id":"345","answer_english":"Seoni ","answer_hindi":"सिवनी ","parent_id":"20"},
{"answer_id":"442","answer_english":"Serchhip","answer_hindi":"सेरछिप","parent_id":"24"},
{"answer_id":"152","answer_english":"Shahdara","answer_hindi":"शाहदरा","parent_id":"9"},
{"answer_id":"361","answer_english":"Shahdol ","answer_hindi":"शहडोल","parent_id":"20"},
{"answer_id":"513","answer_english":"Shahid Bhagat Singh Nagar","answer_hindi":"शहीद भगतसिंहनगर","parent_id":"28"},
{"answer_id":"697","answer_english":"Shahjahanpur","answer_hindi":"शाहजहाँपुर","parent_id":"34"},
{"answer_id":"368","answer_english":"Shajapur","answer_hindi":"शाजापुर","parent_id":"20"},
{"answer_id":"698","answer_english":"Shamli","answer_hindi":"शामली","parent_id":"34"},
{"answer_id":"107","answer_english":"Sheikhpura","answer_hindi":"शेखपुरा","parent_id":"5"},
{"answer_id":"108","answer_english":"Sheohar","answer_hindi":"शिवहर","parent_id":"5"},
{"answer_id":"324","answer_english":"Sheopur ","answer_hindi":"श्योपुर","parent_id":"20"},
{"answer_id":"33","answer_english":"Shi Yomi","answer_hindi":"शिओमी","parent_id":"3"},
{"answer_id":"222","answer_english":"Shimla","answer_hindi":"शिमला","parent_id":"13"},
{"answer_id":"295","answer_english":"Shimoga","answer_hindi":"शिमोगा","parent_id":"16"},
{"answer_id":"328","answer_english":"Shivpuri ","answer_hindi":"शिवपुरी","parent_id":"20"},
{"answer_id":"243","answer_english":"Shopian","answer_hindi":"शोपियां","parent_id":"14"},
{"answer_id":"699","answer_english":"Shravasti","answer_hindi":"श्रावस्ती","parent_id":"34"},
{"answer_id":"34","answer_english":"Siang","answer_hindi":"सियांग","parent_id":"3"},
{"answer_id":"700","answer_english":"Siddharthnagar","answer_hindi":"सिद्धार्थनगर","parent_id":"34"},
{"answer_id":"616","answer_english":"Siddipet","answer_hindi":"सिद्दिपेट","parent_id":"32"},
{"answer_id":"352","answer_english":"Sidhi ","answer_hindi":"सीधी","parent_id":"20"},
{"answer_id":"543","answer_english":"Sikar","answer_hindi":"सीकर","parent_id":"29"},
{"answer_id":"258","answer_english":"Simdega","answer_hindi":"सिमडेगा","parent_id":"15"},
{"answer_id":"403","answer_english":"Sindhudurg","answer_hindi":"सिंधुदुर्ग","parent_id":"21"},
{"answer_id":"353","answer_english":"Singrauli ","answer_hindi":"सिंगरौली","parent_id":"20"},
{"answer_id":"627","answer_english":"Sipahijala","answer_hindi":"सिपाहीजाला","parent_id":"33"},
{"answer_id":"223","answer_english":"Sirmaur","answer_hindi":"सिरमौर","parent_id":"13"},
{"answer_id":"545","answer_english":"Sirohi","answer_hindi":"सिरोही","parent_id":"29"},
{"answer_id":"211","answer_english":"Sirsa","answer_hindi":"सिरसा","parent_id":"12"},
{"answer_id":"109","answer_english":"Sitamarhi","answer_hindi":"सीतामढ़ी","parent_id":"5"},
{"answer_id":"701","answer_english":"Sitapur","answer_hindi":"सीतापुर","parent_id":"34"},
{"answer_id":"575","answer_english":"Sivaganga","answer_hindi":"शिवगंगा","parent_id":"31"},
{"answer_id":"70","answer_english":"Sivasagar","answer_hindi":"शिवसागर","parent_id":"4"},
{"answer_id":"110","answer_english":"Siwan","answer_hindi":"सीवान","parent_id":"5"},
{"answer_id":"224","answer_english":"Solan","answer_hindi":"सोलन","parent_id":"13"},
{"answer_id":"404","answer_english":"Solapur","answer_hindi":"सोलापुर","parent_id":"21"},
{"answer_id":"702","answer_english":"Sonbhadra","answer_hindi":"सोनभद्र","parent_id":"34"},
{"answer_id":"212","answer_english":"Sonipat","answer_hindi":"सोनीपत","parent_id":"12"},
{"answer_id":"71","answer_english":"Sonitpur","answer_hindi":"शोणितपुर","parent_id":"4"},
{"answer_id":"740","answer_english":"South 24 Parganas","answer_hindi":"दक्षिण 24 परगना","parent_id":"36"},
{"answer_id":"16","answer_english":"South Andaman","answer_hindi":"दक्षिण अण्डमान","parent_id":"2"},
{"answer_id":"153","answer_english":"South Delhi ","answer_hindi":"दक्षिण दिल्ली","parent_id":"9"},
{"answer_id":"154","answer_english":"South East Delhi","answer_hindi":"दक्षिण पूर्वी दिल्ली","parent_id":"9"},
{"answer_id":"431","answer_english":"South Garo Hills","answer_hindi":"दक्षिण गारो हिल्स","parent_id":"23"},
{"answer_id":"158","answer_english":"South Goa","answer_hindi":" दक्षिण गोवा","parent_id":"10"},
{"answer_id":"72","answer_english":"South Salmara-Mankachar","answer_hindi":"दक्षिण सालमारा-मनकाचर","parent_id":"4"},
{"answer_id":"550","answer_english":"South Sikkim","answer_hindi":"दक्षिण सिक्किम","parent_id":"30"},
{"answer_id":"624","answer_english":"South Tripura","answer_hindi":"दक्षिण त्रिपुरा","parent_id":"33"},
{"answer_id":"155","answer_english":"South West Delhi","answer_hindi":"दक्षिण पश्चिम दिल्ली","parent_id":"9"},
{"answer_id":"432","answer_english":"South West Garo Hills","answer_hindi":"दक्षिण पश्चिम गारो हिल्स","parent_id":"23"},
{"answer_id":"433","answer_english":"South West Khasi Hills","answer_hindi":"दक्षिण पश्चिम खासी हिल्स","parent_id":"23"},
{"answer_id":"507","answer_english":"Sri Muktsar Sahib","answer_hindi":"मुक्तसर","parent_id":"28"},
{"answer_id":"10","answer_english":"Srikakulam","answer_hindi":"श्रीकाकुलम","parent_id":"1"},
{"answer_id":"244","answer_english":"Srinagar","answer_hindi":"श्रीनगर","parent_id":"14"},
{"answer_id":"487","answer_english":"Subarnapur(Sonepur)","answer_hindi":"सुबर्णपुर (सोनपुर)","parent_id":"26"},
{"answer_id":"140","answer_english":"Sukma","answer_hindi":"सुकमा","parent_id":"7"},
{"answer_id":"703","answer_english":"Sultanpur","answer_hindi":"सुल्तानपुर","parent_id":"34"},
{"answer_id":"488","answer_english":"Sundargarh","answer_hindi":"सुन्दरगड़","parent_id":"26"},
{"answer_id":"111","answer_english":"Supaul","answer_hindi":"सुपौल","parent_id":"5"},
{"answer_id":"141","answer_english":"Surajpur","answer_hindi":"सूरजपुर","parent_id":"7"},
{"answer_id":"187","answer_english":"Surat","answer_hindi":"सूरत","parent_id":"11"},
{"answer_id":"188","answer_english":"Surendranagar","answer_hindi":"सुरेंद्रनगर","parent_id":"11"},
{"answer_id":"142","answer_english":"Surguja","answer_hindi":"सरगुजा","parent_id":"7"},
{"answer_id":"617","answer_english":"Suryapet","answer_hindi":"सूर्यापेट","parent_id":"32"},
{"answer_id":"417","answer_english":"Tamenglong","answer_hindi":"तमेंगलॉन्ग जिला","parent_id":"22"},
{"answer_id":"189","answer_english":"Tapi","answer_hindi":"तापी","parent_id":"11"},
{"answer_id":"514","answer_english":"Tarn Taran","answer_hindi":"तरन तारन साहिब","parent_id":"28"},
{"answer_id":"35","answer_english":"Tawang","answer_hindi":"तवांग","parent_id":"3"},
{"answer_id":"716","answer_english":"Tehri Garhwal","answer_hindi":"टिहरी गढ़वाल","parent_id":"35"},
{"answer_id":"421","answer_english":"Tengnoupal","answer_hindi":"तेंगनोउपल ","parent_id":"22"},
{"answer_id":"576","answer_english":"Tenkasi","answer_hindi":"तेनकाशी","parent_id":"31"},
{"answer_id":"405","answer_english":"Thane","answer_hindi":"ठाणे","parent_id":"21"},
{"answer_id":"581","answer_english":"Thanjavur","answer_hindi":"तंजावुर","parent_id":"31"},
{"answer_id":"579","answer_english":"Theni","answer_hindi":"तेनी","parent_id":"31"},
{"answer_id":"312","answer_english":"Thiruvananthapuram","answer_hindi":"तिरुवनन्तपुरम ","parent_id":"17"},
{"answer_id":"582","answer_english":"Thoothukudi","answer_hindi":"तूतुकुड़ी","parent_id":"31"},
{"answer_id":"410","answer_english":"Thoubal","answer_hindi":"थौबल जिला","parent_id":"22"},
{"answer_id":"313","answer_english":"Thrissur","answer_hindi":"त्रिस्सूर ","parent_id":"17"},
{"answer_id":"358","answer_english":"Tikamgarh ","answer_hindi":"टीकमगढ़","parent_id":"20"},
{"answer_id":"73","answer_english":"Tinsukia","answer_hindi":"तिनसुकिया","parent_id":"4"},
{"answer_id":"36","answer_english":"Tirap","answer_hindi":"तिराप","parent_id":"3"},
{"answer_id":"578","answer_english":"Tiruchirappalli","answer_hindi":"तिरुचिरापल्ली","parent_id":"31"},
{"answer_id":"580","answer_english":"Tirunelveli","answer_hindi":"तिरूनेलवेली","parent_id":"31"},
{"answer_id":"583","answer_english":"Tirupattur","answer_hindi":"तिरुपत्तुर","parent_id":"31"},
{"answer_id":"577","answer_english":"Tirupur","answer_hindi":"तिरुपुर","parent_id":"31"},
{"answer_id":"584","answer_english":"Tiruvallur","answer_hindi":"तिरुवल्लुर","parent_id":"31"},
{"answer_id":"586","answer_english":"Tiruvannamalai","answer_hindi":"तिरुवन्नामलई","parent_id":"31"},
{"answer_id":"585","answer_english":"Tiruvarur","answer_hindi":"तिरुवारुर","parent_id":"31"},
{"answer_id":"546","answer_english":"Tonk","answer_hindi":"टोंक","parent_id":"29"},
{"answer_id":"455","answer_english":"Tuensang","answer_hindi":"ट्वेनसांग","parent_id":"25"},
{"answer_id":"296","answer_english":"Tumkur","answer_hindi":"तुमकूर","parent_id":"16"},
{"answer_id":"547","answer_english":"Udaipur","answer_hindi":"उदयपुर","parent_id":"29"},
{"answer_id":"74","answer_english":"Udalguri","answer_hindi":"उदलगुड़ी","parent_id":"4"},
{"answer_id":"717","answer_english":"Udham Singh Nagar","answer_hindi":"उधमसिंह नगर","parent_id":"35"},
{"answer_id":"245","answer_english":"Udhampur","answer_hindi":"उधमपुर","parent_id":"14"},
{"answer_id":"297","answer_english":"Udupi","answer_hindi":"उडुपी","parent_id":"16"},
{"answer_id":"369","answer_english":"Ujjain","answer_hindi":"उज्जैन","parent_id":"20"},
{"answer_id":"414","answer_english":"Ukhrul","answer_hindi":"उखरुल जिला","parent_id":"22"},
{"answer_id":"362","answer_english":"Umaria ","answer_hindi":"उमरिया","parent_id":"20"},
{"answer_id":"225","answer_english":"Una","answer_hindi":"उना","parent_id":"13"},
{"answer_id":"630","answer_english":"Unakoti","answer_hindi":"उनाकोटी","parent_id":"33"},
{"answer_id":"704","answer_english":"Unnao","answer_hindi":"उन्नाव","parent_id":"34"},
{"answer_id":"37","answer_english":"Upper Dibang Valley","answer_hindi":"ऊपरी दिबांग घाटी","parent_id":"3"},
{"answer_id":"38","answer_english":"Upper Siang","answer_hindi":"ऊपरी सियांग","parent_id":"3"},
{"answer_id":"39","answer_english":"Upper Subansiri","answer_hindi":"ऊपरी सुबनसिरी","parent_id":"3"},
{"answer_id":"741","answer_english":"Uttar Dinajpur","answer_hindi":"उत्तर दिनाजपुर","parent_id":"36"},
{"answer_id":"298","answer_english":"Uttara Kannada","answer_hindi":"उत्तर कन्नड़","parent_id":"16"},
{"answer_id":"718","answer_english":"Uttarkashi","answer_hindi":"उत्तरकाशी","parent_id":"35"},
{"answer_id":"190","answer_english":"Vadodara","answer_hindi":"वड़ोदरा","parent_id":"11"},
{"answer_id":"112","answer_english":"Vaishali","answer_hindi":"वैशाली","parent_id":"5"},
{"answer_id":"191","answer_english":"Valsad","answer_hindi":"वलसाड","parent_id":"11"},
{"answer_id":"705","answer_english":"Varanasi","answer_hindi":"वाराणसी","parent_id":"34"},
{"answer_id":"587","answer_english":"Vellore","answer_hindi":"वेल्लूर","parent_id":"31"},
{"answer_id":"322","answer_english":"Vidisha ","answer_hindi":"विदिशा","parent_id":"20"},
{"answer_id":"299","answer_english":"Vijayanagara","answer_hindi":"विजयनगर","parent_id":"16"},
{"answer_id":"618","answer_english":"Vikarabad","answer_hindi":"विक़ाराबाद","parent_id":"32"},
{"answer_id":"588","answer_english":"Viluppuram","answer_hindi":"विलुप्पुरम","parent_id":"31"},
{"answer_id":"589","answer_english":"Virudhunagar","answer_hindi":"विरुधुनगर","parent_id":"31"},
{"answer_id":"11","answer_english":"Visakhapatnam","answer_hindi":"विशाखापट्टनम","parent_id":"1"},
{"answer_id":"12","answer_english":"Vizianagaram","answer_hindi":"विजयनगरम","parent_id":"1"},
{"answer_id":"619","answer_english":"Wanaparthy","answer_hindi":"वानपर्ति","parent_id":"32"},
{"answer_id":"621","answer_english":"Warangal Rural","answer_hindi":"वरंगल ग्रामीण","parent_id":"32"},
{"answer_id":"620","answer_english":"Warangal Urban","answer_hindi":"वारंगल अर्बन","parent_id":"32"},
{"answer_id":"406","answer_english":"Wardha","answer_hindi":"वर्धा","parent_id":"21"},
{"answer_id":"407","answer_english":"Washim","answer_hindi":"वाशीम","parent_id":"21"},
{"answer_id":"314","answer_english":"Wayanad","answer_hindi":"वायनाड ","parent_id":"17"},
{"answer_id":"113","answer_english":"West Champaran","answer_hindi":"पश्चिमी चम्पारण जिला","parent_id":"5"},
{"answer_id":"156","answer_english":"West Delhi","answer_hindi":"पश्चिम दिल्ली","parent_id":"9"},
{"answer_id":"426","answer_english":"West Garo Hills","answer_hindi":"पश्चिम गारो हिल्स","parent_id":"23"},
{"answer_id":"13","answer_english":"West Godavari","answer_hindi":"पश्चिम गोदावरी","parent_id":"1"},
{"answer_id":"427","answer_english":"West Jaintia Hills","answer_hindi":"पश्चिम जयंतिया हिल्स","parent_id":"23"},
{"answer_id":"40","answer_english":"West Kameng","answer_hindi":"पश्चिम कमेंग","parent_id":"3"},
{"answer_id":"75","answer_english":"West Karbi Anglong","answer_hindi":"पश्चिम कार्बी आंगलोंग","parent_id":"4"},
{"answer_id":"428","answer_english":"West Khasi Hills","answer_hindi":"पश्चिम खासी हिल्स","parent_id":"23"},
{"answer_id":"41","answer_english":"West Siang","answer_hindi":"पश्चिम सियांग","parent_id":"3"},
{"answer_id":"551","answer_english":"West Sikkim","answer_hindi":"पश्चिम सिक्किम","parent_id":"30"},
{"answer_id":"261","answer_english":"West Singhbhum","answer_hindi":"पश्चिमी सिंहभूम ","parent_id":"15"},
{"answer_id":"629","answer_english":"West Tripura","answer_hindi":"पश्चिम त्रिपुरा","parent_id":"33"},
{"answer_id":"456","answer_english":"Wokha","answer_hindi":"वोखा","parent_id":"25"},
{"answer_id":"622","answer_english":"Yadadri Bhuvanagiri","answer_hindi":"यादाद्री भुवनगिरी","parent_id":"32"},
{"answer_id":"300","answer_english":"Yadgir","answer_hindi":"यादगीर","parent_id":"16"},
{"answer_id":"213","answer_english":"Yamuna Nagar","answer_hindi":"यमुनानगर","parent_id":"12"},
{"answer_id":"492","answer_english":"Yanam","answer_hindi":"यानम","parent_id":"27"},
{"answer_id":"408","answer_english":"Yavatmal","answer_hindi":"यवतमाळ","parent_id":"21"},
{"answer_id":"457","answer_english":"Zunheboto","answer_hindi":"ज़ुन्हेबोटो","parent_id":"25"}
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
                answer_english : "हिंदी",  
                answer_hindi : "हिंदी",  
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
                    answer_english : "हिंदी",  
                    answer_hindi : "हिंदी",  
                }
            ],
            is_answered : false,
            answer : "",
        },
        {
            name : "mobile",
            question_id : 2,
            question_english : "Please type the primary phone number that you had registered with us",
            question_hindi : "कृपया वह प्राथमिक फ़ोन नंबर लिखें, जो आपने हमारे साथ पंजीकृत किया था",
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
            question_hindi : "आपका मोबाइल नंबर हमारे साथ पंजीकृत नहीं है। <br /><br />कृपया अपना आवेदन <a href='"+base_url+"' target='_blank'>"+base_url+"</a> पर पंजीकृत करें",
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
            question_hindi : "आपको एक OTP प्राप्त हुआ होगा। कृपया OTP टाइप करें",
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
            question_hindi : "वैरिफिकेशन कोड गलत है.",
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
            question_hindi : "कांग्रेस के सोशल मीडिया विभाग के लिए आपकी रुचि दिखाने के लिए बधाई। हम आपके और हमारे संगठन में आपकी रुचि के बारे में अधिक जानना चाहेंगे",
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
            question_hindi : "आपकी एजुकेशनल क्वालिफिकेशन क्या है?",
            question_type : "selection",
            is_answered : false,
            is_skip : false,
            answers : [
                {"answer_id":"1","answer_english":"School","answer_hindi":"स्कूल"},
                {"answer_id":"2","answer_english":"Graduate","answer_hindi":"ग्रेजुएट"},
                {"answer_id":"3","answer_english":"Post graduate","answer_hindi":"पोस्ट ग्रेजुएट"},
                {"answer_id":"4","answer_english":"PhD","answer_hindi":"पीएचडी"},
            ],
            answer : "",
        },
        {
            name : "profession",
            question_id : 8,
            question_english : "What is your professional/ employment status",
            question_hindi : "आपकी व्यावसायिक / रोजगार स्थिति क्या है?",
            question_type : "selection",
            is_answered : false,
            is_skip : false,
            answers : [
                {"answer_id":"1","answer_english":"Student","answer_hindi":"छात्र"},
                {"answer_id":"2","answer_english":"Self Employed/ Business","answer_hindi":"स्व - रोजगार / व्यापार"},
                {"answer_id":"3","answer_english":"Private Service","answer_hindi":"प्राइवेट सर्विस"},
                {"answer_id":"4","answer_english":"Govt/ Semi Government","answer_hindi":"सरकारी / अर्ध सरकारी सेवा"},
                {"answer_id":"5","answer_english":"NGO","answer_hindi":"एनजीओ"},
                {"answer_id":"6","answer_english":"Other","answer_hindi":"अन्य"}
            ],
            answer : "",
        },
        {
            name : "prefered_working",
            question_id : 9,
            question_english : "How many hours per day are you willing to dedicate to working with the Congress Social Media team?",
            question_hindi : "आप प्रति दिन कितने घंटे कांग्रेस सोशल मीडिया टीम के साथ काम करने के लिए समर्पित करने के लिए तैयार हैं?",
            question_type : "selection",
            is_answered : false,
            is_skip : false,
            answers : [
                {"answer_id":"1","answer_english":"1-2 Hours","answer_hindi":"1-2 घंटे"},
                {"answer_id":"2","answer_english":"2-4 Hours","answer_hindi":"2-4 घंटे"},
                {"answer_id":"3","answer_english":"4-6 Hours","answer_hindi":"4-6 घंटे"},
                {"answer_id":"4","answer_english":"More than 6 Hours","answer_hindi":"6 घंटे से ज्यादा"},
            ],
            answer : "",
        },
        {
            name : "prefered_working",
            question_id : 10,
            // question_english : "In which of the following areas are you willing to work with the Congress Social Media team? Please mention top TWO only. <br /><br />Training,<br /> Research,<br /> Content (writing),<br /> Content Creation,<br /> Outreach/ Team Development,<br /> Outreach/ Team Development,<br /> Content Distribution.",
            // question_hindi : "आप निम्नलिखित में से किस क्षेत्र में कांग्रेस सोशल मीडिया टीम के साथ काम करने के इच्छुक हैं? कृपया केवल दो का उल्लेख करें.<br /><br /> ट्रेनिंग,<br /> रिसर्च,<br /> कंटेंट लेखन,<br /> कंटेंट (वीडियो / ऑडियो / ग्राफिक्स,<br />आउटरीच / टीम तैयार करना,<br />कंटेंट वितरण",
            question_english : "Please select your areas of interest you are willing to work with the Congress Social Media team?",
            question_hindi : "आप निम्नलिखित में से किस क्षेत्र में कांग्रेस सोशल मीडिया टीम के साथ काम करने के इच्छुक हैं?",
            max_check : 2,
            question_type : "checkbox",
            is_answered : false,
            is_skip : false,
            answers : [
                {"answer_id":"1","answer_english":"Training","answer_hindi":"ट्रेनिंग"},
                {"answer_id":"2","answer_english":"Research","answer_hindi":"रिसर्च"},
                {"answer_id":"3","answer_english":"Content (writing)","answer_hindi":"कंटेंट लेखन"},
                {"answer_id":"4","answer_english":"Content Creation (Video, Audio, Graphics)","answer_hindi":"कंटेंट क्रिएशन (वीडियो / ऑडियो / ग्राफिक्स)"},
                {"answer_id":"5","answer_english":"Outreach/ Team Development","answer_hindi":"आउटरीच / टीम तैयार करना"},
                {"answer_id":"6","answer_english":"Content Distribution","answer_hindi":"कंटेंट वितरण"},
            ],
            answer : "",
        },
        {
            name : "activity_area",
            question_id : 11,
            question_english : "Let us know if there any other area or activity you would like to be involved in with the social media team (not mentioned in previous options), please note them here",
            question_hindi : "यदि कोई अन्य क्षेत्र या गतिविधि आप सोशल मीडिया टीम (पिछले विकल्पों में उल्लिखित नहीं) के साथ शामिल करना चाहते हैं, तो कृपया हमें बताएं.",
            question_type : "text",
            is_answered : false,
            is_skip : false,
            answers : [
                // {"answer_id":"1","answer_english":"Training","answer_hindi":"अंडमान निकोबार"},
                // {"answer_id":"2","answer_english":"Research","answer_hindi":"अंडमान निकोबार"},
                // {"answer_id":"3","answer_english":"Content (writing)","answer_hindi":"अंडमान निकोबार"},
                // {"answer_id":"4","answer_english":"Content Creation","answer_hindi":"अंडमान निकोबार"},
                // {"answer_id":"5","answer_english":"Outreach/ Team Development","answer_hindi":"अंडमान निकोबार"},
                // {"answer_id":"5","answer_english":"Content Distribution","answer_hindi":"अंडमान निकोबार"},
            ],
            answer : "",
        },
        {
            name : "social_media_platforms",
            question_id : 12,
            question_english : "Which of these social media platforms you are more active on?",
            question_hindi : "आप इनमें से किस सोशल मीडिया प्लेटफॉर्म पर सक्रिय हैं? केवल शीर्ष दो का उल्लेख करें.",
            question_type : "checkbox",
            max_check : 15,
            is_answered : false,
            is_skip : false,
            answers : [
                {"answer_id":"2","answer_english":"Facebook","answer_hindi":"फेसबुक"},
                {"answer_id":"1","answer_english":"WhatsApp","answer_hindi":"व्हाट्सएप"},
                {"answer_id":"3","answer_english":"Twitter","answer_hindi":"ट्विटर"},
                {"answer_id":"5","answer_english":"Instagram","answer_hindi":"इंस्टाग्राम"},
                {"answer_id":"4","answer_english":"YouTube","answer_hindi":"यूट्यूब"},
                {"answer_id":"6","answer_english":"linkedIn","answer_hindi":"लिंकडिन"},
                {"answer_id":"7","answer_english":"Quora","answer_hindi":"क्वोरा"},
                {"answer_id":"5","answer_english":"Other","answer_hindi":"अन्य"},
            ],
            answer : "",
        },
        {
            name : "social_media_platform_links",
            question_id : 13,
            question_english : "please provide the links of your social media IDs on your top 2 platforms (as mentioned by you previously)",
            question_hindi : "कृपया अपने शीर्ष 2 प्लेटफार्मों पर अपने सोशल मीडिया आईडी के लिंक प्रदान करें (जैसा कि आपने पहले उल्लेख किया है",
            question_type : "text",
            is_answered : false,
            is_skip : false,
            answers : [
                // {"answer_id":"1","answer_english":"Training","answer_hindi":"अंडमान निकोबार"},
                // {"answer_id":"2","answer_english":"Research","answer_hindi":"अंडमान निकोबार"},
                // {"answer_id":"3","answer_english":"Content (writing)","answer_hindi":"अंडमान निकोबार"},
                // {"answer_id":"4","answer_english":"Content Creation","answer_hindi":"अंडमान निकोबार"},
                // {"answer_id":"5","answer_english":"Outreach/ Team Development","answer_hindi":"अंडमान निकोबार"},
                // {"answer_id":"5","answer_english":"Content Distribution","answer_hindi":"अंडमान निकोबार"},
            ],
            answer : "",
        },
        {
            name : "email",
            question_id : 14,
            question_english : "please provide your email id if you have any, otherwise write 'NA'",
            question_hindi : "यदि आपके पास कोई ईमेल आईडी है, तो कृपया इसे लिखें, अन्यथा 'NA' लिखें.",
            question_type : "text",
            is_answered : false,
            is_skip : false,
            answers : [
                // {"answer_id":"1","answer_english":"Training","answer_hindi":"अंडमान निकोबार"},
                // {"answer_id":"2","answer_english":"Research","answer_hindi":"अंडमान निकोबार"},
                // {"answer_id":"3","answer_english":"Content (writing)","answer_hindi":"अंडमान निकोबार"},
                // {"answer_id":"4","answer_english":"Content Creation","answer_hindi":"अंडमान निकोबार"},
                // {"answer_id":"5","answer_english":"Outreach/ Team Development","answer_hindi":"अंडमान निकोबार"},
                // {"answer_id":"5","answer_english":"Content Distribution","answer_hindi":"अंडमान निकोबार"},
            ],
            answer : "",
        },
        {
            name : "thankyou",
            question_id : 15,
            question_english : "Thank you for your feedback. We look forward to your interview with us!",
            question_hindi : "आपकी प्रतिक्रिया के लिए आपका धन्यवाद। हम शीघ्र ही आपसे इंटरव्यू करेंगे!",
            question_type : "none",
            is_answered : false,
            is_skip : false,
            answers : [
                // {"answer_id":"1","answer_english":"Training","answer_hindi":"अंडमान निकोबार"},
                // {"answer_id":"2","answer_english":"Research","answer_hindi":"अंडमान निकोबार"},
                // {"answer_id":"3","answer_english":"Content (writing)","answer_hindi":"अंडमान निकोबार"},
                // {"answer_id":"4","answer_english":"Content Creation","answer_hindi":"अंडमान निकोबार"},
                // {"answer_id":"5","answer_english":"Outreach/ Team Development","answer_hindi":"अंडमान निकोबार"},
                // {"answer_id":"5","answer_english":"Content Distribution","answer_hindi":"अंडमान निकोबार"},
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
                        $scope.errorMessage = "कृपया 10 अंकों की मान्य संख्या दर्ज करें!"; 
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
                        $scope.errorMessage = "कृपया एक मान्य 6 अंक OTP दर्ज करें!"; 
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
                            $scope.errorMessage = "गलत OTP, कृपया पुनः प्रयास करें!!"; 
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
        {"answer_id":"2","answer_english":"Andaman and Nicobar","answer_hindi":"अण्डमान और निकोबार"},
        {"answer_id":"1","answer_english":"Andhra Pradesh","answer_hindi":"आंध्र प्रदेश"},
        {"answer_id":"3","answer_english":"Arunachal Pradesh","answer_hindi":"अरुणाचल प्रदेश"},
        {"answer_id":"4","answer_english":"Assam","answer_hindi":"असम"},
        {"answer_id":"5","answer_english":"Bihar","answer_hindi":"बिहार"},
        {"answer_id":"6","answer_english":"Chandigarh","answer_hindi":"चण्डीगढ़"},
        {"answer_id":"7","answer_english":"Chhattisgarh","answer_hindi":"छत्तीसगढ़"},
        {"answer_id":"8","answer_english":"Dadra and Nagar Haveli and Daman and Diu","answer_hindi":"दादरा नगर हवेली और दमन और दीव"},
        {"answer_id":"9","answer_english":"Delhi","answer_hindi":"दिल्ली"},
        {"answer_id":"10","answer_english":"Goa","answer_hindi":"गोवा"},
        {"answer_id":"11","answer_english":"Gujarat","answer_hindi":"गुजरात"},
        {"answer_id":"12","answer_english":"Haryana","answer_hindi":"हरियाणा"},
        {"answer_id":"13","answer_english":"Himachal Pradesh","answer_hindi":"हिमाचल प्रदेश"},
        {"answer_id":"14","answer_english":"Jammu and Kashmir","answer_hindi":"जम्मू कश्मीर"},
        {"answer_id":"15","answer_english":"Jharkhand","answer_hindi":"झारखण्ड"},
        {"answer_id":"16","answer_english":"Karnataka","answer_hindi":"कर्नाटक"},
        {"answer_id":"17","answer_english":"Kerala","answer_hindi":"केरल"},
        {"answer_id":"18","answer_english":"Ladakh","answer_hindi":"लद्दाख"},
        {"answer_id":"19","answer_english":"Lakshadweep","answer_hindi":"लक्षद्वीप"},
        {"answer_id":"20","answer_english":"Madhya Pradesh","answer_hindi":"मध्यप्रदेश"},
        {"answer_id":"21","answer_english":"Maharastra","answer_hindi":"महाराष्ट्र"},
        {"answer_id":"22","answer_english":"Manipur","answer_hindi":"मणिपुर"},
        {"answer_id":"23","answer_english":"Meghalaya","answer_hindi":"मेघालय"},
        {"answer_id":"24","answer_english":"Mizoram","answer_hindi":"मिज़ोरम"},
        {"answer_id":"25","answer_english":"Nagaland","answer_hindi":"नागालैण्ड"},
        {"answer_id":"26","answer_english":"Odisha","answer_hindi":"ओड़िशा"},
        {"answer_id":"27","answer_english":"Puducherry","answer_hindi":"पुदुचेरी"},
        {"answer_id":"28","answer_english":"Punjab","answer_hindi":"पंजाब"},
        {"answer_id":"29","answer_english":"Rajasthan","answer_hindi":"राजस्थान"},
        {"answer_id":"30","answer_english":"Sikkim","answer_hindi":"सिक्किम"},
        {"answer_id":"31","answer_english":"Tamil Nadu","answer_hindi":"तमिलनाडु"},
        {"answer_id":"32","answer_english":"Telangana","answer_hindi":"तेलंगाना"},
        {"answer_id":"33","answer_english":"Tripura","answer_hindi":"त्रिपुरा"},
        {"answer_id":"34","answer_english":"Uttar Pradesh","answer_hindi":"उत्तर प्रदेश"},
        {"answer_id":"35","answer_english":"Uttarakhand","answer_hindi":"उत्तराखण्ड"},
        {"answer_id":"36","answer_english":"West Bengal","answer_hindi":"पश्चिम बंगाल"}
    ];


    $scope.districts = [
        {"answer_id":"590","answer_english":"Adilabad","answer_hindi":"आदिलाबाद","parent_id":"32"},
{"answer_id":"363","answer_english":"Agar Malwa","answer_hindi":"आगर मालवा","parent_id":"20"},
{"answer_id":"631","answer_english":"Agra","answer_hindi":"आगरा","parent_id":"34"},
{"answer_id":"159","answer_english":"Ahmedabad","answer_hindi":"अहमदाबाद","parent_id":"11"},
{"answer_id":"373","answer_english":"Ahmednagar","answer_hindi":"अहमदनगर","parent_id":"21"},
{"answer_id":"436","answer_english":"Aizawl","answer_hindi":"अइज़ोल","parent_id":"24"},
{"answer_id":"515","answer_english":"Ajmer","answer_hindi":"अजमेर","parent_id":"29"},
{"answer_id":"374","answer_english":"Akola","answer_hindi":"अकोला","parent_id":"21"},
{"answer_id":"301","answer_english":"Alappuzha","answer_hindi":"आलाप्पुड़ा","parent_id":"17"},
{"answer_id":"632","answer_english":"Aligarh","answer_hindi":"अलीगढ","parent_id":"34"},
{"answer_id":"719","answer_english":"Alipurduar","answer_hindi":"अलीपुरद्रार","parent_id":"36"},
{"answer_id":"331","answer_english":"Alirajpur ","answer_hindi":"अलीराजपुर","parent_id":"20"},
{"answer_id":"633","answer_english":"Allahabad","answer_hindi":"इलाहाबाद\/प्रयागराज","parent_id":"34"},
{"answer_id":"706","answer_english":"Almora","answer_hindi":"अल्मोड़ा","parent_id":"35"},
{"answer_id":"516","answer_english":"Alwar","answer_hindi":"अलवर","parent_id":"29"},
{"answer_id":"192","answer_english":"Ambala","answer_hindi":"अम्बाला","parent_id":"12"},
{"answer_id":"634","answer_english":"Ambedkar Nagar","answer_hindi":"अम्बेडकरनगर","parent_id":"34"},
{"answer_id":"635","answer_english":"Amethi","answer_hindi":"अमेठी ","parent_id":"34"},
{"answer_id":"375","answer_english":"Amravati","answer_hindi":"अमरावती","parent_id":"21"},
{"answer_id":"160","answer_english":"Amreli","answer_hindi":"अमरेली","parent_id":"11"},
{"answer_id":"493","answer_english":"Amritsar","answer_hindi":"अमृतसर","parent_id":"28"},
{"answer_id":"636","answer_english":"Amroha","answer_hindi":"अमरोहा ","parent_id":"34"},
{"answer_id":"161","answer_english":"Anand","answer_hindi":"आणंद","parent_id":"11"},
{"answer_id":"1","answer_english":"Anantapur","answer_hindi":"अनंतपुर","parent_id":"1"},
{"answer_id":"226","answer_english":"Anantnag","answer_hindi":"अनन्तनाग","parent_id":"14"},
{"answer_id":"459","answer_english":"Angul","answer_hindi":"अनुगुल","parent_id":"26"},
{"answer_id":"17","answer_english":"Anjaw","answer_hindi":"अंजॉ","parent_id":"3"},
{"answer_id":"360","answer_english":"Anuppur ","answer_hindi":"अनूपपुर","parent_id":"20"},
{"answer_id":"76","answer_english":"Araria","answer_hindi":"अररिया","parent_id":"5"},
{"answer_id":"162","answer_english":"Aravalli","answer_hindi":"अरावली","parent_id":"11"},
{"answer_id":"552","answer_english":"Ariyalur","answer_hindi":"अरियालूर","parent_id":"31"},
{"answer_id":"77","answer_english":"Arwal","answer_hindi":"अरवल","parent_id":"5"},
{"answer_id":"327","answer_english":"Ashoknagar","answer_hindi":"अशोक नगर","parent_id":"20"},
{"answer_id":"637","answer_english":"Auraiya","answer_hindi":"औरैया","parent_id":"34"},
{"answer_id":"78","answer_english":"Aurangabad","answer_hindi":"औरंगाबाद","parent_id":"5"},
{"answer_id":"376","answer_english":"Aurangabad","answer_hindi":"औरंगाबाद","parent_id":"21"},
{"answer_id":"638","answer_english":"Azamgarh","answer_hindi":"आजमगढ","parent_id":"34"},
{"answer_id":"270","answer_english":"Bagalkot","answer_hindi":"बागलकोट","parent_id":"16"},
{"answer_id":"707","answer_english":"Bageshwar","answer_hindi":"बागेश्वर","parent_id":"35"},
{"answer_id":"639","answer_english":"Bagpat","answer_hindi":"बागपत ","parent_id":"34"},
{"answer_id":"640","answer_english":"Bahraich","answer_hindi":"बहराइच","parent_id":"34"},
{"answer_id":"43","answer_english":"Bajali","answer_hindi":"बजाली","parent_id":"4"},
{"answer_id":"42","answer_english":"Baksa","answer_hindi":"बक्सा","parent_id":"4"},
{"answer_id":"339","answer_english":"Balaghat ","answer_hindi":"बालाघाट","parent_id":"20"},
{"answer_id":"461","answer_english":"Balangir","answer_hindi":"बलांगिर","parent_id":"26"},
{"answer_id":"641","answer_english":"Balarampur","answer_hindi":"बलरामपुर","parent_id":"34"},
{"answer_id":"463","answer_english":"Balasore","answer_hindi":"बालेश्वर","parent_id":"26"},
{"answer_id":"642","answer_english":"Ballia","answer_hindi":"बलिया","parent_id":"34"},
{"answer_id":"115","answer_english":"Balod","answer_hindi":"बालोद","parent_id":"7"},
{"answer_id":"116","answer_english":"Baloda Bazar","answer_hindi":"बलौदा बाजार","parent_id":"7"},
{"answer_id":"117","answer_english":"Balrampur","answer_hindi":"बलरामपुर","parent_id":"7"},
{"answer_id":"163","answer_english":"Banaskantha","answer_hindi":"बनासकांठा","parent_id":"11"},
{"answer_id":"643","answer_english":"Banda","answer_hindi":"बाँदा","parent_id":"34"},
{"answer_id":"228","answer_english":"Bandipora","answer_hindi":"बांदीपुरा","parent_id":"14"},
{"answer_id":"272","answer_english":"Bangalore Rural","answer_hindi":"बंगलोर ग्रामीण","parent_id":"16"},
{"answer_id":"271","answer_english":"Bangalore Urban","answer_hindi":"बंगलोर शहरी","parent_id":"16"},
{"answer_id":"79","answer_english":"Banka","answer_hindi":"बाँका","parent_id":"5"},
{"answer_id":"720","answer_english":"Bankura","answer_hindi":"बाँकुड़ा","parent_id":"36"},
{"answer_id":"519","answer_english":"Banswara","answer_hindi":"बांसवाड़ा","parent_id":"29"},
{"answer_id":"644","answer_english":"Barabanki","answer_hindi":"बाराबंकी","parent_id":"34"},
{"answer_id":"229","answer_english":"Baramulla","answer_hindi":"बारामूला","parent_id":"14"},
{"answer_id":"521","answer_english":"Baran","answer_hindi":"बारां","parent_id":"29"},
{"answer_id":"645","answer_english":"Bareilly","answer_hindi":"बरेली","parent_id":"34"},
{"answer_id":"462","answer_english":"Bargarh","answer_hindi":"बरगढ़","parent_id":"26"},
{"answer_id":"518","answer_english":"Barmer","answer_hindi":"बाड़मेर","parent_id":"29"},
{"answer_id":"494","answer_english":"Barnala","answer_hindi":"बरनाला","parent_id":"28"},
{"answer_id":"44","answer_english":"Barpeta","answer_hindi":"बारपेटा","parent_id":"4"},
{"answer_id":"332","answer_english":"Barwani ","answer_hindi":"बड़वानी","parent_id":"20"},
{"answer_id":"118","answer_english":"Bastar","answer_hindi":"बस्तर","parent_id":"7"},
{"answer_id":"646","answer_english":"Basti","answer_hindi":"बस्ती","parent_id":"34"},
{"answer_id":"495","answer_english":"Bathinda","answer_hindi":"भटिण्डा","parent_id":"28"},
{"answer_id":"377","answer_english":"Beed","answer_hindi":"बीड","parent_id":"21"},
{"answer_id":"80","answer_english":"Begusarai","answer_hindi":"बेगूसराय","parent_id":"5"},
{"answer_id":"273","answer_english":"Belgaum","answer_hindi":"बेलगाम","parent_id":"16"},
{"answer_id":"274","answer_english":"Bellary","answer_hindi":"बेल्लारी","parent_id":"16"},
{"answer_id":"119","answer_english":"Bemetara","answer_hindi":"बेमेतरा","parent_id":"7"},
{"answer_id":"347","answer_english":"Betul ","answer_hindi":"बैतूल","parent_id":"20"},
{"answer_id":"647","answer_english":"Bhadohi","answer_hindi":"भदोही ","parent_id":"34"},
{"answer_id":"592","answer_english":"Bhadradri Kothagudem","answer_hindi":"भद्राद्री कोठागुडम","parent_id":"32"},
{"answer_id":"464","answer_english":"Bhadrak","answer_hindi":"भद्रक","parent_id":"26"},
{"answer_id":"81","answer_english":"Bhagalpur","answer_hindi":"भागलपुर","parent_id":"5"},
{"answer_id":"378","answer_english":"Bhandara","answer_hindi":"भंडारा","parent_id":"21"},
{"answer_id":"520","answer_english":"Bharatpur","answer_hindi":"भरतपुर","parent_id":"29"},
{"answer_id":"164","answer_english":"Bharuch","answer_hindi":"भरुच","parent_id":"11"},
{"answer_id":"165","answer_english":"Bhavnagar","answer_hindi":"भावनगर","parent_id":"11"},
{"answer_id":"523","answer_english":"Bhilwara","answer_hindi":"भीलवाड़ा","parent_id":"29"},
{"answer_id":"325","answer_english":"Bhind ","answer_hindi":"भिंड","parent_id":"20"},
{"answer_id":"193","answer_english":"Bhiwani","answer_hindi":"भिवानी","parent_id":"12"},
{"answer_id":"82","answer_english":"Bhojpur","answer_hindi":"भोजपुर","parent_id":"5"},
{"answer_id":"318","answer_english":"Bhopal ","answer_hindi":"भोपाल","parent_id":"20"},
{"answer_id":"275","answer_english":"Bidar","answer_hindi":"बीदर","parent_id":"16"},
{"answer_id":"276","answer_english":"Bijapur","answer_hindi":"बीजापुर","parent_id":"16"},
{"answer_id":"120","answer_english":"Bijapur","answer_hindi":"बीजापुर","parent_id":"7"},
{"answer_id":"648","answer_english":"Bijnor","answer_hindi":"बिजनौर","parent_id":"34"},
{"answer_id":"517","answer_english":"Bikaner","answer_hindi":"बीकानेर","parent_id":"29"},
{"answer_id":"121","answer_english":"Bilaspur","answer_hindi":"बिलासपुर","parent_id":"7"},
{"answer_id":"214","answer_english":"Bilaspur","answer_hindi":"बिलासपुर","parent_id":"13"},
{"answer_id":"723","answer_english":"Birbhum","answer_hindi":"बीरभूम","parent_id":"36"},
{"answer_id":"409","answer_english":"Bishnupur","answer_hindi":"बिष्णुपुर जिला","parent_id":"22"},
{"answer_id":"45","answer_english":"Biswanath","answer_hindi":"बिश्वनाथ","parent_id":"4"},
{"answer_id":"254","answer_english":"Bokaro","answer_hindi":"बोकारो","parent_id":"15"},
{"answer_id":"46","answer_english":"Bongaigaon","answer_hindi":"बंगाईगाँव","parent_id":"4"},
{"answer_id":"166","answer_english":"Botad","answer_hindi":"बोटाड","parent_id":"11"},
{"answer_id":"460","answer_english":"Boudh","answer_hindi":"बौध","parent_id":"26"},
{"answer_id":"649","answer_english":"Budaun","answer_hindi":"बदायूं ","parent_id":"34"},
{"answer_id":"227","answer_english":"Budgam","answer_hindi":"बड़गांव","parent_id":"14"},
{"answer_id":"650","answer_english":"Bulandshahr","answer_hindi":"बुलंदशहर","parent_id":"34"},
{"answer_id":"379","answer_english":"Buldhana","answer_hindi":"बुलढाणा","parent_id":"21"},
{"answer_id":"522","answer_english":"Bundi","answer_hindi":"बूंदी","parent_id":"29"},
{"answer_id":"333","answer_english":"Burhanpur ","answer_hindi":"बुरहानपुर","parent_id":"20"},
{"answer_id":"83","answer_english":"Buxar","answer_hindi":"बक्सर","parent_id":"5"},
{"answer_id":"47","answer_english":"Cachar","answer_hindi":"कछर","parent_id":"4"},
{"answer_id":"147","answer_english":"Central Delhi ","answer_hindi":"मध्य दिल्ली","parent_id":"9"},
{"answer_id":"370","answer_english":"Chachaura-Binaganj","answer_hindi":"चाचौड़ा","parent_id":"20"},
{"answer_id":"277","answer_english":"Chamarajanagar","answer_hindi":"चामराजनगर","parent_id":"16"},
{"answer_id":"215","answer_english":"Chamba","answer_hindi":"चंबा","parent_id":"13"},
{"answer_id":"708","answer_english":"Chamoli","answer_hindi":"चमोली","parent_id":"35"},
{"answer_id":"709","answer_english":"Champawat","answer_hindi":"चम्पावत","parent_id":"35"},
{"answer_id":"443","answer_english":"Champhai","answer_hindi":"चम्फाई","parent_id":"24"},
{"answer_id":"651","answer_english":"Chandauli","answer_hindi":"चंदौली","parent_id":"34"},
{"answer_id":"415","answer_english":"Chandel","answer_hindi":"चन्डेल जिला","parent_id":"22"},
{"answer_id":"114","answer_english":"Chandigarh ","answer_hindi":"चण्डीगढ़","parent_id":"6"},
{"answer_id":"380","answer_english":"Chandrapur","answer_hindi":"चंद्रपुर","parent_id":"21"},
{"answer_id":"18","answer_english":"Changlang","answer_hindi":"चांगलांग","parent_id":"3"},
{"answer_id":"48","answer_english":"Charaideo","answer_hindi":"चराइदेउ","parent_id":"4"},
{"answer_id":"194","answer_english":"Charkhi Dadri","answer_hindi":"चरखी दादरी","parent_id":"12"},
{"answer_id":"249","answer_english":"Chatra","answer_hindi":"चतरा","parent_id":"15"},
{"answer_id":"553","answer_english":"Chengalpattu","answer_hindi":"चेंगलपट्टु","parent_id":"31"},
{"answer_id":"554","answer_english":"Chennai","answer_hindi":"चेन्नई","parent_id":"31"},
{"answer_id":"354","answer_english":"Chhatarpur ","answer_hindi":"छतरपुर","parent_id":"20"},
{"answer_id":"340","answer_english":"Chhindwara ","answer_hindi":"छिंदवाड़ा","parent_id":"20"},
{"answer_id":"167","answer_english":"Chhota Udaipur","answer_hindi":"छोटा उदयपुर","parent_id":"11"},
{"answer_id":"278","answer_english":"Chikballapur","answer_hindi":"चिकबलापुरा","parent_id":"16"},
{"answer_id":"279","answer_english":"Chikmagalur","answer_hindi":"चिकमगलूर","parent_id":"16"},
{"answer_id":"49","answer_english":"Chirang","answer_hindi":"चिरांग","parent_id":"4"},
{"answer_id":"280","answer_english":"Chitradurga","answer_hindi":"चित्रदुर्ग","parent_id":"16"},
{"answer_id":"652","answer_english":"Chitrakoot","answer_hindi":"चित्रकूट","parent_id":"34"},
{"answer_id":"2","answer_english":"Chittoor","answer_hindi":"चित्तूर","parent_id":"1"},
{"answer_id":"525","answer_english":"Chittorgarh","answer_hindi":"चित्तौड़गढ़","parent_id":"29"},
{"answer_id":"416","answer_english":"Churachandpur","answer_hindi":"चुराचांदपुर जिला","parent_id":"22"},
{"answer_id":"524","answer_english":"Churu","answer_hindi":"चुरु","parent_id":"29"},
{"answer_id":"555","answer_english":"Coimbatore","answer_hindi":"कोयम्बतूर","parent_id":"31"},
{"answer_id":"724","answer_english":"Cooch Behar","answer_hindi":"कूचबिहार","parent_id":"36"},
{"answer_id":"556","answer_english":"Cuddalore","answer_hindi":"कुड्डलोर","parent_id":"31"},
{"answer_id":"465","answer_english":"Cuttack","answer_hindi":"कटक","parent_id":"26"},
{"answer_id":"145","answer_english":"Dadra and Nagar Haveli","answer_hindi":"दादरा नगर हवेली","parent_id":"8"},
{"answer_id":"168","answer_english":"Dahod","answer_hindi":"दाहोद","parent_id":"11"},
{"answer_id":"725","answer_english":"Dakshin Dinajpur","answer_hindi":"दक्षिण दिनाजपुर","parent_id":"36"},
{"answer_id":"281","answer_english":"Dakshina Kannada","answer_hindi":"दक्षिण कन्नड़","parent_id":"16"},
{"answer_id":"143","answer_english":"Daman","answer_hindi":"दमन ","parent_id":"8"},
{"answer_id":"355","answer_english":"Damoh ","answer_hindi":"दमोह","parent_id":"20"},
{"answer_id":"169","answer_english":"Dang","answer_hindi":"डांग","parent_id":"11"},
{"answer_id":"122","answer_english":"Dantewada","answer_hindi":"दन्तेवाड़ा  (दक्षिण बस्तर)","parent_id":"7"},
{"answer_id":"84","answer_english":"Darbhanga","answer_hindi":"दरभंगा","parent_id":"5"},
{"answer_id":"726","answer_english":"Darjeeling","answer_hindi":"दार्जिलिंग","parent_id":"36"},
{"answer_id":"50","answer_english":"Darrang","answer_hindi":"दारांग","parent_id":"4"},
{"answer_id":"329","answer_english":"Datia ","answer_hindi":"दतिया","parent_id":"20"},
{"answer_id":"526","answer_english":"Dausa","answer_hindi":"दौसा","parent_id":"29"},
{"answer_id":"282","answer_english":"Davanagere","answer_hindi":"दावणगेरे","parent_id":"16"},
{"answer_id":"466","answer_english":"Debagarh","answer_hindi":"देवगड़","parent_id":"26"},
{"answer_id":"710","answer_english":"Dehradun","answer_hindi":"देहरादून","parent_id":"35"},
{"answer_id":"265","answer_english":"Deoghar","answer_hindi":"देवघर","parent_id":"15"},
{"answer_id":"653","answer_english":"Deoria","answer_hindi":"देवरिया","parent_id":"34"},
{"answer_id":"170","answer_english":"Devbhoomi Dwarka","answer_hindi":"देवभूमि द्वारका","parent_id":"11"},
{"answer_id":"364","answer_english":"Dewas","answer_hindi":"देवास","parent_id":"20"},
{"answer_id":"623","answer_english":"Dhalai","answer_hindi":"धलाई","parent_id":"33"},
{"answer_id":"123","answer_english":"Dhamtari","answer_hindi":"धमतरी","parent_id":"7"},
{"answer_id":"255","answer_english":"Dhanbad","answer_hindi":"धनबाद","parent_id":"15"},
{"answer_id":"335","answer_english":"Dhar ","answer_hindi":"धार","parent_id":"20"},
{"answer_id":"557","answer_english":"Dharmapuri","answer_hindi":"धर्मपुरी","parent_id":"31"},
{"answer_id":"283","answer_english":"Dharwad","answer_hindi":"धारवाड़","parent_id":"16"},
{"answer_id":"51","answer_english":"Dhemaji","answer_hindi":"धेमाजी","parent_id":"4"},
{"answer_id":"467","answer_english":"Dhenkanal","answer_hindi":"ढेन्कानाल","parent_id":"26"},
{"answer_id":"527","answer_english":"Dholpur","answer_hindi":"धौलपुर","parent_id":"29"},
{"answer_id":"52","answer_english":"Dhubri","answer_hindi":"धुबरी","parent_id":"4"},
{"answer_id":"381","answer_english":"Dhule","answer_hindi":"धुले","parent_id":"21"},
{"answer_id":"53","answer_english":"Dibrugarh","answer_hindi":"डिब्रूगढ़","parent_id":"4"},
{"answer_id":"54","answer_english":"Dima Hasao","answer_hindi":"दिमा हसाओ","parent_id":"4"},
{"answer_id":"447","answer_english":"Dimapur","answer_hindi":"दीमापुर","parent_id":"25"},
{"answer_id":"558","answer_english":"Dindigul","answer_hindi":"डिंडिगुल","parent_id":"31"},
{"answer_id":"346","answer_english":"Dindori ","answer_hindi":"डिंडौरी","parent_id":"20"},
{"answer_id":"144","answer_english":"Diu","answer_hindi":"दीव ","parent_id":"8"},
{"answer_id":"230","answer_english":"Doda","answer_hindi":"डोडा","parent_id":"14"},
{"answer_id":"266","answer_english":"Dumka","answer_hindi":"दुमका","parent_id":"15"},
{"answer_id":"528","answer_english":"Dungarpur","answer_hindi":"डूंगरपुर","parent_id":"29"},
{"answer_id":"124","answer_english":"Durg","answer_hindi":"दुर्ग","parent_id":"7"},
{"answer_id":"85","answer_english":"East Champaran","answer_hindi":"पूर्वी चम्पारण जिला","parent_id":"5"},
{"answer_id":"148","answer_english":"East Delhi","answer_hindi":"पूर्वी दिल्ली","parent_id":"9"},
{"answer_id":"429","answer_english":"East Garo Hills","answer_hindi":"पूर्वी गारो हिल्स","parent_id":"23"},
{"answer_id":"3","answer_english":"East Godavari","answer_hindi":"पूर्व गोदावरी","parent_id":"1"},
{"answer_id":"434","answer_english":"East Jaintia Hills","answer_hindi":"पूर्व जयंतिया हिल्स","parent_id":"23"},
{"answer_id":"19","answer_english":"East Kameng","answer_hindi":"पूर्व कमेंग","parent_id":"3"},
{"answer_id":"425","answer_english":"East Khasi Hills","answer_hindi":"पूर्वी खासी हिल्स","parent_id":"23"},
{"answer_id":"20","answer_english":"East Siang","answer_hindi":"पूर्व सियांग","parent_id":"3"},
{"answer_id":"548","answer_english":"East Sikkim","answer_hindi":"पूर्व सिक्किम","parent_id":"30"},
{"answer_id":"263","answer_english":"East Singhbhum","answer_hindi":"पूर्वी सिंहभूम","parent_id":"15"},
{"answer_id":"302","answer_english":"Ernakulam","answer_hindi":"एर्नाकुलम","parent_id":"17"},
{"answer_id":"559","answer_english":"Erode","answer_hindi":"ईरोड","parent_id":"31"},
{"answer_id":"654","answer_english":"Etah","answer_hindi":"एटा","parent_id":"34"},
{"answer_id":"655","answer_english":"Etawah","answer_hindi":"इटावा","parent_id":"34"},
{"answer_id":"656","answer_english":"Faizabad","answer_hindi":"फैज़ाबाद शहर (अयोध्या)","parent_id":"34"},
{"answer_id":"195","answer_english":"Faridabad","answer_hindi":"फरीदाबाद","parent_id":"12"},
{"answer_id":"497","answer_english":"Faridkot","answer_hindi":"फरीदकोट","parent_id":"28"},
{"answer_id":"657","answer_english":"Farrukhabad","answer_hindi":"फ़र्रूख़ाबाद","parent_id":"34"},
{"answer_id":"196","answer_english":"Fatehabad","answer_hindi":"फतेहाबाद","parent_id":"12"},
{"answer_id":"498","answer_english":"Fatehgarh Sahib","answer_hindi":"फतेहगढ़ साहिब","parent_id":"28"},
{"answer_id":"658","answer_english":"Fatehpur","answer_hindi":"फतेहपुर","parent_id":"34"},
{"answer_id":"499","answer_english":"Fazilka","answer_hindi":"फाज़िल्का ","parent_id":"28"},
{"answer_id":"659","answer_english":"Firozabad","answer_hindi":"फ़िरोजाबाद","parent_id":"34"},
{"answer_id":"496","answer_english":"Firozpur","answer_hindi":"फिरोजपुर","parent_id":"28"},
{"answer_id":"284","answer_english":"Gadag","answer_hindi":"गदग","parent_id":"16"},
{"answer_id":"382","answer_english":"Gadchiroli","answer_hindi":"गडचिरोली","parent_id":"21"},
{"answer_id":"469","answer_english":"Gajapati","answer_hindi":"गजपति","parent_id":"26"},
{"answer_id":"231","answer_english":"Ganderbal","answer_hindi":"गांदरबल","parent_id":"14"},
{"answer_id":"171","answer_english":"Gandhinagar","answer_hindi":"गांधीनगर","parent_id":"11"},
{"answer_id":"529","answer_english":"Ganganagar","answer_hindi":"श्रीगंगानगर","parent_id":"29"},
{"answer_id":"468","answer_english":"Ganjam","answer_hindi":"गंजाम","parent_id":"26"},
{"answer_id":"246","answer_english":"Garhwa","answer_hindi":"गढवा","parent_id":"15"},
{"answer_id":"125","answer_english":"Gariaband","answer_hindi":"गरियाबंद","parent_id":"7"},
{"answer_id":"126","answer_english":"Gaurella-Pendra-Marwahi","answer_hindi":"गौरेला-पेण्ड्रा-मरवाही","parent_id":"7"},
{"answer_id":"660","answer_english":"Gautam Buddha Nagar","answer_hindi":"गौतमबुद्ध नगर","parent_id":"34"},
{"answer_id":"86","answer_english":"Gaya","answer_hindi":"गया","parent_id":"5"},
{"answer_id":"661","answer_english":"Ghaziabad","answer_hindi":"गाजियाबाद","parent_id":"34"},
{"answer_id":"662","answer_english":"Ghazipur","answer_hindi":"ग़ाज़ीपुर","parent_id":"34"},
{"answer_id":"172","answer_english":"Gir Somnath","answer_hindi":"गिर सोमनाथ","parent_id":"11"},
{"answer_id":"252","answer_english":"Giridih","answer_hindi":"गिरीडीह","parent_id":"15"},
{"answer_id":"55","answer_english":"Goalpara","answer_hindi":"गोवालपारा","parent_id":"4"},
{"answer_id":"268","answer_english":"Godda","answer_hindi":"गोड्डा","parent_id":"15"},
{"answer_id":"56","answer_english":"Golaghat","answer_hindi":"गोलाघाट","parent_id":"4"},
{"answer_id":"625","answer_english":"Gomati","answer_hindi":"गोमती","parent_id":"33"},
{"answer_id":"663","answer_english":"Gonda","answer_hindi":"गोंडा","parent_id":"34"},
{"answer_id":"383","answer_english":"Gondia","answer_hindi":"गोंदिया","parent_id":"21"},
{"answer_id":"87","answer_english":"Gopalganj","answer_hindi":"गोपालगंज","parent_id":"5"},
{"answer_id":"664","answer_english":"Gorakhpur","answer_hindi":"गोरखपुर","parent_id":"34"},
{"answer_id":"285","answer_english":"Gulbarga","answer_hindi":"गुलबर्ग","parent_id":"16"},
{"answer_id":"256","answer_english":"Gumla","answer_hindi":"गुमला","parent_id":"15"},
{"answer_id":"330","answer_english":"Guna ","answer_hindi":"गुना","parent_id":"20"},
{"answer_id":"4","answer_english":"Guntur","answer_hindi":"गुंटूर","parent_id":"1"},
{"answer_id":"500","answer_english":"Gurdaspur","answer_hindi":"गुरदासपुर","parent_id":"28"},
{"answer_id":"197","answer_english":"Gurgaon","answer_hindi":"गुरुग्राम","parent_id":"12"},
{"answer_id":"326","answer_english":"Gwalior ","answer_hindi":"ग्वालियर","parent_id":"20"},
{"answer_id":"57","answer_english":"Hailakandi","answer_hindi":"हैलाकांडी","parent_id":"4"},
{"answer_id":"665","answer_english":"Hamirpur","answer_hindi":"हमीरपुर","parent_id":"34"},
{"answer_id":"216","answer_english":"Hamirpur","answer_hindi":"हमीरपुर","parent_id":"13"},
{"answer_id":"530","answer_english":"Hanumangarh","answer_hindi":"हनुमानगढ़","parent_id":"29"},
{"answer_id":"666","answer_english":"Hapur","answer_hindi":"हापुड़","parent_id":"34"},
{"answer_id":"348","answer_english":"Harda ","answer_hindi":"हरदा","parent_id":"20"},
{"answer_id":"667","answer_english":"Hardoi","answer_hindi":"हरदोई","parent_id":"34"},
{"answer_id":"711","answer_english":"Haridwar","answer_hindi":"हरिद्वार","parent_id":"35"},
{"answer_id":"286","answer_english":"Hassan","answer_hindi":"हासन","parent_id":"16"},
{"answer_id":"668","answer_english":"Hathras","answer_hindi":"हाथरस","parent_id":"34"},
{"answer_id":"287","answer_english":"Haveri","answer_hindi":"हावेरी","parent_id":"16"},
{"answer_id":"250","answer_english":"Hazaribagh","answer_hindi":"हजारीबाग","parent_id":"15"},
{"answer_id":"384","answer_english":"Hingoli","answer_hindi":"हिंगोली","parent_id":"21"},
{"answer_id":"198","answer_english":"Hissar","answer_hindi":"हिसार","parent_id":"12"},
{"answer_id":"444","answer_english":"Hnahthial","answer_hindi":"ह्नाहथिआल","parent_id":"24"},
{"answer_id":"58","answer_english":"Hojai","answer_hindi":"होजाई","parent_id":"4"},
{"answer_id":"727","answer_english":"Hooghly","answer_hindi":"हुगली","parent_id":"36"},
{"answer_id":"349","answer_english":"Hoshangabad ","answer_hindi":"होशंगाबाद","parent_id":"20"},
{"answer_id":"501","answer_english":"Hoshiarpur","answer_hindi":"होशियारपुर","parent_id":"28"},
{"answer_id":"728","answer_english":"Howrah","answer_hindi":"हावङा","parent_id":"36"},
{"answer_id":"593","answer_english":"Hyderabad","answer_hindi":"हैदराबाद","parent_id":"32"},
{"answer_id":"303","answer_english":"Idukki","answer_hindi":"इडुक्की ","parent_id":"17"},
{"answer_id":"411","answer_english":"Imphal East","answer_hindi":"इम्फाल पूर्व","parent_id":"22"},
{"answer_id":"412","answer_english":"Imphal West","answer_hindi":"इम्फाल पश्चिम","parent_id":"22"},
{"answer_id":"334","answer_english":"Indore ","answer_hindi":"इन्दौर","parent_id":"20"},
{"answer_id":"341","answer_english":"Jabalpur ","answer_hindi":"जबलपुर","parent_id":"20"},
{"answer_id":"472","answer_english":"Jagatsinghapur","answer_hindi":"जगतसिंहपुर","parent_id":"26"},
{"answer_id":"594","answer_english":"Jagtial","answer_hindi":"जगित्याल","parent_id":"32"},
{"answer_id":"534","answer_english":"Jaipur","answer_hindi":"जयपुर","parent_id":"29"},
{"answer_id":"535","answer_english":"Jaisalmer","answer_hindi":"जैसलमेर","parent_id":"29"},
{"answer_id":"471","answer_english":"Jajpur","answer_hindi":"जाजपुर","parent_id":"26"},
{"answer_id":"502","answer_english":"Jalandhar","answer_hindi":"जालंधर","parent_id":"28"},
{"answer_id":"669","answer_english":"Jalaun","answer_hindi":"जलौन","parent_id":"34"},
{"answer_id":"385","answer_english":"Jalgaon","answer_hindi":"जळगाव","parent_id":"21"},
{"answer_id":"386","answer_english":"Jalna","answer_hindi":"जालना","parent_id":"21"},
{"answer_id":"532","answer_english":"Jalore","answer_hindi":"जालौर","parent_id":"29"},
{"answer_id":"729","answer_english":"Jalpaiguri","answer_hindi":"जलपाईगुङी","parent_id":"36"},
{"answer_id":"232","answer_english":"Jammu","answer_hindi":"जम्मू","parent_id":"14"},
{"answer_id":"173","answer_english":"Jamnagar","answer_hindi":"जामनगर","parent_id":"11"},
{"answer_id":"264","answer_english":"Jamtara","answer_hindi":"जामताड़ा","parent_id":"15"},
{"answer_id":"88","answer_english":"Jamui","answer_hindi":"जमुई","parent_id":"5"},
{"answer_id":"595","answer_english":"Jangaon","answer_hindi":"जनगाँव","parent_id":"32"},
{"answer_id":"127","answer_english":"Janjgir-Champa","answer_hindi":"जांजगीर-चाम्पा","parent_id":"7"},
{"answer_id":"128","answer_english":"Jashpur","answer_hindi":"जशपुर","parent_id":"7"},
{"answer_id":"670","answer_english":"Jaunpur","answer_hindi":"जौनपुर","parent_id":"34"},
{"answer_id":"596","answer_english":"Jayashankar Bhupalpally","answer_hindi":"जयशंकर भूपलपल्ली","parent_id":"32"},
{"answer_id":"89","answer_english":"Jehanabad","answer_hindi":"जहानाबाद","parent_id":"5"},
{"answer_id":"336","answer_english":"Jhabua ","answer_hindi":"झाबुआ","parent_id":"20"},
{"answer_id":"199","answer_english":"Jhajjar","answer_hindi":"झज्जर","parent_id":"12"},
{"answer_id":"536","answer_english":"Jhalawar","answer_hindi":"झालावाड़","parent_id":"29"},
{"answer_id":"671","answer_english":"Jhansi","answer_hindi":"झाँसी","parent_id":"34"},
{"answer_id":"730","answer_english":"Jhargram","answer_hindi":"झाड़ग्राम","parent_id":"36"},
{"answer_id":"470","answer_english":"Jharsuguda","answer_hindi":"झारसुगुड़ा","parent_id":"26"},
{"answer_id":"531","answer_english":"Jhunjhunu","answer_hindi":"झुंझुनू","parent_id":"29"},
{"answer_id":"200","answer_english":"Jind","answer_hindi":"जींद","parent_id":"12"},
{"answer_id":"418","answer_english":"Jiribam","answer_hindi":"जिरिबाम","parent_id":"22"},
{"answer_id":"533","answer_english":"Jodhpur","answer_hindi":"जोधपुर","parent_id":"29"},
{"answer_id":"597","answer_english":"Jogulamba Gadwal","answer_hindi":"जोगुलाम्बा गद्वाल","parent_id":"32"},
{"answer_id":"59","answer_english":"Jorhat","answer_hindi":"जोरहाट","parent_id":"4"},
{"answer_id":"174","answer_english":"Junagadh","answer_hindi":"जूनागढ़","parent_id":"11"},
{"answer_id":"129","answer_english":"Kabirdham \/ Kawardha","answer_hindi":"कबीरधाम \/ कवर्धा","parent_id":"7"},
{"answer_id":"5","answer_english":"Kadapa","answer_hindi":"कड़प्पा","parent_id":"1"},
{"answer_id":"90","answer_english":"Kaimur","answer_hindi":"कैमूर","parent_id":"5"},
{"answer_id":"201","answer_english":"Kaithal","answer_hindi":"कैथल","parent_id":"12"},
{"answer_id":"420","answer_english":"Kakching","answer_hindi":"ककचिंग ","parent_id":"22"},
{"answer_id":"475","answer_english":"Kalahandi","answer_hindi":"कलाहान्डी","parent_id":"26"},
{"answer_id":"731","answer_english":"Kalimpong","answer_hindi":"कलिम्पोग","parent_id":"36"},
{"answer_id":"560","answer_english":"Kallakurichi","answer_hindi":"कल्लाकुरिची","parent_id":"31"},
{"answer_id":"598","answer_english":"Kamareddy","answer_hindi":"कामारेड्डी","parent_id":"32"},
{"answer_id":"422","answer_english":"Kamjong","answer_hindi":"कमजोंग ","parent_id":"22"},
{"answer_id":"21","answer_english":"Kamle","answer_hindi":"कमले","parent_id":"3"},
{"answer_id":"61","answer_english":"Kamrup","answer_hindi":"कामरूप","parent_id":"4"},
{"answer_id":"60","answer_english":"Kamrup Metropolitan","answer_hindi":"कामरूप महानगर","parent_id":"4"},
{"answer_id":"561","answer_english":"Kanchipuram","answer_hindi":"कांचीपुरम","parent_id":"31"},
{"answer_id":"476","answer_english":"Kandhamal","answer_hindi":"कन्धमाल","parent_id":"26"},
{"answer_id":"419","answer_english":"Kangpokpi (Sadar Hills)","answer_hindi":"कंगपोकपी","parent_id":"22"},
{"answer_id":"217","answer_english":"Kangra","answer_hindi":"काँगड़ा","parent_id":"13"},
{"answer_id":"130","answer_english":"Kanker","answer_hindi":"कांकेर  (उत्तर बस्तर)","parent_id":"7"},
{"answer_id":"672","answer_english":"Kannauj","answer_hindi":"कन्नौज","parent_id":"34"},
{"answer_id":"304","answer_english":"Kannur","answer_hindi":"कन्नूर","parent_id":"17"},
{"answer_id":"673","answer_english":"Kanpur Dehat","answer_hindi":"कानपुर देहात","parent_id":"34"},
{"answer_id":"674","answer_english":"Kanpur Nagar","answer_hindi":"कानपुर नगर","parent_id":"34"},
{"answer_id":"562","answer_english":"Kanyakumari","answer_hindi":"कन्याकुमारी","parent_id":"31"},
{"answer_id":"503","answer_english":"Kapurthala","answer_hindi":"कपूरथला","parent_id":"28"},
{"answer_id":"489","answer_english":"Karaikal","answer_hindi":"कराईकल ","parent_id":"27"},
{"answer_id":"537","answer_english":"Karauli","answer_hindi":"करौली","parent_id":"29"},
{"answer_id":"62","answer_english":"Karbi Anglong","answer_hindi":"कार्बी आंगलोंग","parent_id":"4"},
{"answer_id":"315","answer_english":"Kargil ","answer_hindi":"कारगिल","parent_id":"18"},
{"answer_id":"63","answer_english":"Karimganj","answer_hindi":"करीमगंज","parent_id":"4"},
{"answer_id":"599","answer_english":"Karimnagar","answer_hindi":"करीमनगर","parent_id":"32"},
{"answer_id":"202","answer_english":"Karnal","answer_hindi":"करनाल","parent_id":"12"},
{"answer_id":"563","answer_english":"Karur","answer_hindi":"करूर","parent_id":"31"},
{"answer_id":"305","answer_english":"Kasaragod","answer_hindi":"कासरगोड ","parent_id":"17"},
{"answer_id":"675","answer_english":"Kasganj","answer_hindi":"कासगंज ","parent_id":"34"},
{"answer_id":"233","answer_english":"Kathua","answer_hindi":"कठुआ","parent_id":"14"},
{"answer_id":"91","answer_english":"Katihar","answer_hindi":"कटिहार","parent_id":"5"},
{"answer_id":"342","answer_english":"Katni ","answer_hindi":"कटनी","parent_id":"20"},
{"answer_id":"676","answer_english":"Kaushambi","answer_hindi":"कौशाम्बी","parent_id":"34"},
{"answer_id":"478","answer_english":"Kendrapara","answer_hindi":"केन्द्रापड़ा","parent_id":"26"},
{"answer_id":"474","answer_english":"Kendujhar","answer_hindi":"केन्दुझर","parent_id":"26"},
{"answer_id":"92","answer_english":"Khagaria","answer_hindi":"खगड़िया","parent_id":"5"},
{"answer_id":"600","answer_english":"Khammam","answer_hindi":"खम्मम","parent_id":"32"},
{"answer_id":"337","answer_english":"Khandwa (East Nimar)","answer_hindi":"खंडवा","parent_id":"20"},
{"answer_id":"338","answer_english":"Khargone (West Nimar)","answer_hindi":"खरगोन","parent_id":"20"},
{"answer_id":"445","answer_english":"Khawzawl","answer_hindi":"खावजौल","parent_id":"24"},
{"answer_id":"176","answer_english":"Kheda","answer_hindi":"खेड़ा","parent_id":"11"},
{"answer_id":"473","answer_english":"Khordha","answer_hindi":"खोर्धा","parent_id":"26"},
{"answer_id":"628","answer_english":"Khowai","answer_hindi":"खोवाई","parent_id":"33"},
{"answer_id":"260","answer_english":"Khunti","answer_hindi":"खुटी","parent_id":"15"},
{"answer_id":"218","answer_english":"Kinnaur","answer_hindi":"किन्नौर","parent_id":"13"},
{"answer_id":"448","answer_english":"Kiphire","answer_hindi":"कैफाइर","parent_id":"25"},
{"answer_id":"93","answer_english":"Kishanganj","answer_hindi":"किशनगंज","parent_id":"5"},
{"answer_id":"234","answer_english":"Kishtwar","answer_hindi":"किश्तवाड़","parent_id":"14"},
{"answer_id":"288","answer_english":"Kodagu","answer_hindi":"कोडगु","parent_id":"16"},
{"answer_id":"251","answer_english":"Koderma","answer_hindi":"कोडरमा","parent_id":"15"},
{"answer_id":"449","answer_english":"Kohima","answer_hindi":"कोहिमा","parent_id":"25"},
{"answer_id":"64","answer_english":"Kokrajhar","answer_hindi":"कोकराझार","parent_id":"4"},
{"answer_id":"289","answer_english":"Kolar","answer_hindi":"कोलार","parent_id":"16"},
{"answer_id":"437","answer_english":"Kolasib","answer_hindi":"कोलासिब","parent_id":"24"},
{"answer_id":"387","answer_english":"Kolhapur","answer_hindi":"कोल्हापुर","parent_id":"21"},
{"answer_id":"732","answer_english":"Kolkata","answer_hindi":"कोलकाता","parent_id":"36"},
{"answer_id":"306","answer_english":"Kollam","answer_hindi":"कोल्लम","parent_id":"17"},
{"answer_id":"591","answer_english":"Komaram Bheem","answer_hindi":"कोमरम भीम","parent_id":"32"},
{"answer_id":"131","answer_english":"Kondagaon","answer_hindi":"कोंडगाँव","parent_id":"7"},
{"answer_id":"290","answer_english":"Koppal","answer_hindi":"कोप्पल","parent_id":"16"},
{"answer_id":"477","answer_english":"Koraput","answer_hindi":"कोरापुट","parent_id":"26"},
{"answer_id":"132","answer_english":"Korba","answer_hindi":"कोरबा","parent_id":"7"},
{"answer_id":"133","answer_english":"Koriya","answer_hindi":"कोरिया","parent_id":"7"},
{"answer_id":"538","answer_english":"Kota","answer_hindi":"कोटा","parent_id":"29"},
{"answer_id":"307","answer_english":"Kottayam","answer_hindi":"कोट्टयम","parent_id":"17"},
{"answer_id":"308","answer_english":"Kozhikode","answer_hindi":"कोड़िकोड","parent_id":"17"},
{"answer_id":"22","answer_english":"Kra Daadi","answer_hindi":"क्रा दादी","parent_id":"3"},
{"answer_id":"6","answer_english":"Krishna","answer_hindi":"कृष्णा","parent_id":"1"},
{"answer_id":"564","answer_english":"Krishnagiri","answer_hindi":"कृष्णगिरि","parent_id":"31"},
{"answer_id":"235","answer_english":"Kulgam","answer_hindi":"कुलगाम","parent_id":"14"},
{"answer_id":"219","answer_english":"Kullu","answer_hindi":"कुल्लू","parent_id":"13"},
{"answer_id":"236","answer_english":"Kupwara","answer_hindi":"कुपवाड़ा","parent_id":"14"},
{"answer_id":"7","answer_english":"Kurnool","answer_hindi":"कुर्नूल","parent_id":"1"},
{"answer_id":"203","answer_english":"Kurukshetra","answer_hindi":"कुरुक्षेत्र","parent_id":"12"},
{"answer_id":"23","answer_english":"Kurung Kumey","answer_hindi":"कुरुंग कुमे","parent_id":"3"},
{"answer_id":"677","answer_english":"Kushinagar","answer_hindi":"कुशीनगर (पड़रौना)","parent_id":"34"},
{"answer_id":"175","answer_english":"Kutch","answer_hindi":"कच्छ","parent_id":"11"},
{"answer_id":"220","answer_english":"Lahaul and Spiti","answer_hindi":"लाहौल और स्पीती","parent_id":"13"},
{"answer_id":"65","answer_english":"Lakhimpur","answer_hindi":"लखीमपुर","parent_id":"4"},
{"answer_id":"678","answer_english":"Lakhimpur Kheri","answer_hindi":"लखीमपुर-खिरी","parent_id":"34"},
{"answer_id":"94","answer_english":"Lakhisarai","answer_hindi":"लखीसराय","parent_id":"5"},
{"answer_id":"317","answer_english":"Lakshadweep","answer_hindi":"लक्षद्वीप","parent_id":"19"},
{"answer_id":"679","answer_english":"Lalitpur","answer_hindi":"ललितपुर","parent_id":"34"},
{"answer_id":"248","answer_english":"Latehar","answer_hindi":"लातेहार","parent_id":"15"},
{"answer_id":"388","answer_english":"Latur","answer_hindi":"लातूर","parent_id":"21"},
{"answer_id":"438","answer_english":"Lawngtlai","answer_hindi":"लॉङ्गतलाई","parent_id":"24"},
{"answer_id":"316","answer_english":"Leh ","answer_hindi":"लेह","parent_id":"18"},
{"answer_id":"24","answer_english":"Lepa Rada","answer_hindi":"लेपा रादा","parent_id":"3"},
{"answer_id":"257","answer_english":"Lohardaga","answer_hindi":"लोहरदग्गा","parent_id":"15"},
{"answer_id":"25","answer_english":"Lohit","answer_hindi":"लोहित","parent_id":"3"},
{"answer_id":"26","answer_english":"Longding","answer_hindi":"लोंगडिंग","parent_id":"3"},
{"answer_id":"450","answer_english":"Longleng","answer_hindi":"लॉन्गलेन्ग","parent_id":"25"},
{"answer_id":"27","answer_english":"Lower Dibang Valley","answer_hindi":"निचली दिबांग घाटी","parent_id":"3"},
{"answer_id":"28","answer_english":"Lower Siang","answer_hindi":"निचला सियांग","parent_id":"3"},
{"answer_id":"29","answer_english":"Lower Subansiri","answer_hindi":"निचली सुबनसिरी","parent_id":"3"},
{"answer_id":"680","answer_english":"Lucknow","answer_hindi":"लखनऊ","parent_id":"34"},
{"answer_id":"504","answer_english":"Ludhiana","answer_hindi":"लुधियाना","parent_id":"28"},
{"answer_id":"439","answer_english":"Lunglei","answer_hindi":"लुंगलेई","parent_id":"24"},
{"answer_id":"95","answer_english":"Madhepura","answer_hindi":"मधेपुरा","parent_id":"5"},
{"answer_id":"96","answer_english":"Madhubani","answer_hindi":"मधुबनी","parent_id":"5"},
{"answer_id":"565","answer_english":"Madurai","answer_hindi":"मदुरई","parent_id":"31"},
{"answer_id":"601","answer_english":"Mahabubabad","answer_hindi":"महाबूबाबाद","parent_id":"32"},
{"answer_id":"681","answer_english":"Maharajganj","answer_hindi":"महाराजगंज","parent_id":"34"},
{"answer_id":"134","answer_english":"Mahasamund","answer_hindi":"महासमुन्द","parent_id":"7"},
{"answer_id":"602","answer_english":"Mahbubnagar","answer_hindi":"महबूबनगर","parent_id":"32"},
{"answer_id":"490","answer_english":"Mahé","answer_hindi":"माहे ","parent_id":"27"},
{"answer_id":"204","answer_english":"Mahendragarh","answer_hindi":"महेंद्रगढ़","parent_id":"12"},
{"answer_id":"177","answer_english":"Mahisagar","answer_hindi":"महीसागर","parent_id":"11"},
{"answer_id":"682","answer_english":"Mahoba","answer_hindi":"महोबा","parent_id":"34"},
{"answer_id":"371","answer_english":"Maihar","answer_hindi":"मैहर","parent_id":"20"},
{"answer_id":"683","answer_english":"Mainpuri","answer_hindi":"मैनपुरी","parent_id":"34"},
{"answer_id":"66","answer_english":"Majuli","answer_hindi":"माजुली","parent_id":"4"},
{"answer_id":"309","answer_english":"Malappuram","answer_hindi":"मलप्पुरम","parent_id":"17"},
{"answer_id":"733","answer_english":"Maldah","answer_hindi":"मालदह","parent_id":"36"},
{"answer_id":"479","answer_english":"Malkangiri","answer_hindi":"मालकानगिरि","parent_id":"26"},
{"answer_id":"440","answer_english":"Mamit","answer_hindi":"ममित","parent_id":"24"},
{"answer_id":"603","answer_english":"Mancherial","answer_hindi":"मंचेरियल","parent_id":"32"},
{"answer_id":"221","answer_english":"Mandi","answer_hindi":"मंडी","parent_id":"13"},
{"answer_id":"343","answer_english":"Mandla ","answer_hindi":"मंडला","parent_id":"20"},
{"answer_id":"365","answer_english":"Mandsaur","answer_hindi":"मंदसौर","parent_id":"20"},
{"answer_id":"291","answer_english":"Mandya","answer_hindi":"मांडया","parent_id":"16"},
{"answer_id":"505","answer_english":"Mansa","answer_hindi":"मानसा","parent_id":"28"},
{"answer_id":"684","answer_english":"Mathura","answer_hindi":"मथुरा","parent_id":"34"},
{"answer_id":"685","answer_english":"Mau","answer_hindi":"मऊ","parent_id":"34"},
{"answer_id":"566","answer_english":"Mayiladuthurai","answer_hindi":"मयीलाडूतुरै","parent_id":"31"},
{"answer_id":"480","answer_english":"Mayurbhanj","answer_hindi":"मयूरभंज","parent_id":"26"},
{"answer_id":"604","answer_english":"Medak","answer_hindi":"मेदक","parent_id":"32"},
{"answer_id":"605","answer_english":"Medchal-Malkajgiri","answer_hindi":"मेड्चल मल्काजगिरि","parent_id":"32"},
{"answer_id":"686","answer_english":"Meerut","answer_hindi":"मेरठ","parent_id":"34"},
{"answer_id":"178","answer_english":"Mehsana","answer_hindi":"मेहसाणा","parent_id":"11"},
{"answer_id":"687","answer_english":"Mirzapur","answer_hindi":"मिर्ज़ापुर","parent_id":"34"},
{"answer_id":"506","answer_english":"Moga","answer_hindi":"मोगा","parent_id":"28"},
{"answer_id":"451","answer_english":"Mokokchung","answer_hindi":"मोकोकचुआंग","parent_id":"25"},
{"answer_id":"452","answer_english":"Mon","answer_hindi":"मोन","parent_id":"25"},
{"answer_id":"688","answer_english":"Moradabad","answer_hindi":"मुरादाबाद","parent_id":"34"},
{"answer_id":"179","answer_english":"Morbi","answer_hindi":"मोरबी","parent_id":"11"},
{"answer_id":"323","answer_english":"Morena ","answer_hindi":"मुरैना","parent_id":"20"},
{"answer_id":"67","answer_english":"Morigaon","answer_hindi":"मारिगांव","parent_id":"4"},
{"answer_id":"606","answer_english":"Mulugu","answer_hindi":"मुलुगु","parent_id":"32"},
{"answer_id":"389","answer_english":"Mumbai","answer_hindi":"मुंबई","parent_id":"21"},
{"answer_id":"390","answer_english":"Mumbai Suburban","answer_hindi":"मुंबई (सबअर्बन)","parent_id":"21"},
{"answer_id":"135","answer_english":"Mungeli","answer_hindi":"मुंगेली","parent_id":"7"},
{"answer_id":"97","answer_english":"Munger","answer_hindi":"मुंगेर","parent_id":"5"},
{"answer_id":"734","answer_english":"Murshidabad","answer_hindi":"मुर्शिदाबाद","parent_id":"36"},
{"answer_id":"689","answer_english":"Muzaffarnagar","answer_hindi":"मुजफ्फरनगर","parent_id":"34"},
{"answer_id":"98","answer_english":"Muzaffarpur","answer_hindi":"मुजफ्फरपुर","parent_id":"5"},
{"answer_id":"292","answer_english":"Mysore","answer_hindi":"मैसूर","parent_id":"16"},
{"answer_id":"481","answer_english":"Nabarangpur","answer_hindi":"नबरंगपुर","parent_id":"26"},
{"answer_id":"735","answer_english":"Nadia","answer_hindi":"नादिया","parent_id":"36"},
{"answer_id":"68","answer_english":"Nagaon","answer_hindi":"नगांव","parent_id":"4"},
{"answer_id":"567","answer_english":"Nagapattinam","answer_hindi":"नागपट्टिनम","parent_id":"31"},
{"answer_id":"609","answer_english":"Nagarkurnool","answer_hindi":"नागरकर्नूल","parent_id":"32"},
{"answer_id":"539","answer_english":"Nagaur","answer_hindi":"नागौर","parent_id":"29"},
{"answer_id":"372","answer_english":"Nagda","answer_hindi":"नागदा","parent_id":"20"},
{"answer_id":"391","answer_english":"Nagpur","answer_hindi":"नागपुर","parent_id":"21"},
{"answer_id":"712","answer_english":"Nainital","answer_hindi":"नैनीताल","parent_id":"35"},
{"answer_id":"99","answer_english":"Nalanda","answer_hindi":"नालंदा","parent_id":"5"},
{"answer_id":"69","answer_english":"Nalbari","answer_hindi":"नलबाड़ी","parent_id":"4"},
{"answer_id":"607","answer_english":"Nalgonda","answer_hindi":"नलगोंडा","parent_id":"32"},
{"answer_id":"569","answer_english":"Namakkal","answer_hindi":"नामक्कल","parent_id":"31"},
{"answer_id":"30","answer_english":"Namsai","answer_hindi":"नामसाई","parent_id":"3"},
{"answer_id":"392","answer_english":"Nanded","answer_hindi":"नांदेड","parent_id":"21"},
{"answer_id":"393","answer_english":"Nandurbar","answer_hindi":"नंदुरबार","parent_id":"21"},
{"answer_id":"608","answer_english":"Narayanpet","answer_hindi":"नारायणपेट","parent_id":"32"},
{"answer_id":"136","answer_english":"Narayanpur","answer_hindi":"नारायणपुर","parent_id":"7"},
{"answer_id":"180","answer_english":"Narmada","answer_hindi":"नर्मदा","parent_id":"11"},
{"answer_id":"344","answer_english":"Narsinghpur ","answer_hindi":"नरसिंहपुर","parent_id":"20"},
{"answer_id":"394","answer_english":"Nashik","answer_hindi":"नाशिक","parent_id":"21"},
{"answer_id":"181","answer_english":"Navsari","answer_hindi":"नवसारी","parent_id":"11"},
{"answer_id":"100","answer_english":"Nawada","answer_hindi":"नवादा","parent_id":"5"},
{"answer_id":"483","answer_english":"Nayagarh","answer_hindi":"नयागड़","parent_id":"26"},
{"answer_id":"366","answer_english":"Neemuch","answer_hindi":"नीमच","parent_id":"20"},
{"answer_id":"8","answer_english":"Nellore","answer_hindi":"नेल्लौर","parent_id":"1"},
{"answer_id":"146","answer_english":"New Delhi","answer_hindi":"नई दिल्ली","parent_id":"9"},
{"answer_id":"14","answer_english":"Nicobar","answer_hindi":"निकोबार","parent_id":"2"},
{"answer_id":"568","answer_english":"Nilgiris","answer_hindi":"नीलगिरि","parent_id":"31"},
{"answer_id":"610","answer_english":"Nirmal","answer_hindi":"निर्मल","parent_id":"32"},
{"answer_id":"359","answer_english":"Niwari ","answer_hindi":"निवाड़ी","parent_id":"20"},
{"answer_id":"611","answer_english":"Nizamabad","answer_hindi":"निज़ामाबाद","parent_id":"32"},
{"answer_id":"458","answer_english":"Noklak","answer_hindi":"नोक्लक","parent_id":"25"},
{"answer_id":"423","answer_english":"Noney","answer_hindi":"नोने","parent_id":"22"},
{"answer_id":"736","answer_english":"North 24 Parganas","answer_hindi":"उत्तर 24 परगना","parent_id":"36"},
{"answer_id":"15","answer_english":"North and Middle Andaman","answer_hindi":"उत्तर और मध्य अण्डमान जिला","parent_id":"2"},
{"answer_id":"149","answer_english":"North Delhi ","answer_hindi":"उत्तर दिल्ली","parent_id":"9"},
{"answer_id":"150","answer_english":"North East Delhi","answer_hindi":"उत्तर पूर्वी दिल्ली","parent_id":"9"},
{"answer_id":"435","answer_english":"North Garo Hills","answer_hindi":"उत्तर गारो हिल्स","parent_id":"23"},
{"answer_id":"157","answer_english":"North Goa","answer_hindi":"उत्तर गोवा","parent_id":"10"},
{"answer_id":"549","answer_english":"North Sikkim","answer_hindi":"उत्तर सिक्किम","parent_id":"30"},
{"answer_id":"626","answer_english":"North Tripura","answer_hindi":"उत्तर त्रिपुरा","parent_id":"33"},
{"answer_id":"151","answer_english":"North West Delhi","answer_hindi":"उत्तर पश्चिम दिल्ली","parent_id":"9"},
{"answer_id":"482","answer_english":"Nuapada","answer_hindi":"नुआपड़ा","parent_id":"26"},
{"answer_id":"205","answer_english":"Nuh","answer_hindi":"नूह ","parent_id":"12"},
{"answer_id":"395","answer_english":"Osmanabad","answer_hindi":"उस्मानाबाद","parent_id":"21"},
{"answer_id":"31","answer_english":"Pakke-Kessang","answer_hindi":"पक्के केसांग","parent_id":"3"},
{"answer_id":"267","answer_english":"Pakur","answer_hindi":"पाकुड़","parent_id":"15"},
{"answer_id":"310","answer_english":"Palakkad","answer_hindi":"पालक्काड़ ","parent_id":"17"},
{"answer_id":"247","answer_english":"Palamu","answer_hindi":"पलामू","parent_id":"15"},
{"answer_id":"396","answer_english":"Palghar","answer_hindi":"पालघर","parent_id":"21"},
{"answer_id":"540","answer_english":"Pali","answer_hindi":"पाली","parent_id":"29"},
{"answer_id":"206","answer_english":"Palwal","answer_hindi":"पलवल","parent_id":"12"},
{"answer_id":"207","answer_english":"Panchkula","answer_hindi":"पंचकुला","parent_id":"12"},
{"answer_id":"182","answer_english":"Panchmahal","answer_hindi":"पंचमहल","parent_id":"11"},
{"answer_id":"208","answer_english":"Panipat","answer_hindi":"पानीपत","parent_id":"12"},
{"answer_id":"356","answer_english":"Panna ","answer_hindi":"पन्ना","parent_id":"20"},
{"answer_id":"32","answer_english":"Papum Pare","answer_hindi":"पपुमपारे","parent_id":"3"},
{"answer_id":"397","answer_english":"Parbhani","answer_hindi":"परभणी","parent_id":"21"},
{"answer_id":"721","answer_english":"Paschim Bardhaman","answer_hindi":"पश्चिमी वर्धमान","parent_id":"36"},
{"answer_id":"737","answer_english":"Paschim Medinipur","answer_hindi":"पश्चिम मेदिनीपुर","parent_id":"36"},
{"answer_id":"183","answer_english":"Patan","answer_hindi":"पाटन","parent_id":"11"},
{"answer_id":"311","answer_english":"Pathanamthitta","answer_hindi":"पतनमतिट्टा","parent_id":"17"},
{"answer_id":"508","answer_english":"Pathankot","answer_hindi":"पठानकोट","parent_id":"28"},
{"answer_id":"509","answer_english":"Patiala","answer_hindi":"पटियाला","parent_id":"28"},
{"answer_id":"101","answer_english":"Patna","answer_hindi":"पटना","parent_id":"5"},
{"answer_id":"713","answer_english":"Pauri Garhwal","answer_hindi":"पौड़ी गढ़वाल","parent_id":"35"},
{"answer_id":"612","answer_english":"Peddapalli","answer_hindi":"पेद्दपल्ले","parent_id":"32"},
{"answer_id":"570","answer_english":"Perambalur","answer_hindi":"पेरम्बलुर","parent_id":"31"},
{"answer_id":"453","answer_english":"Peren","answer_hindi":"पेरेन","parent_id":"25"},
{"answer_id":"454","answer_english":"Phek","answer_hindi":"फेक","parent_id":"25"},
{"answer_id":"424","answer_english":"Pherzawl","answer_hindi":"फेरज़ौल ","parent_id":"22"},
{"answer_id":"690","answer_english":"Pilibhit","answer_hindi":"पीलीभीत","parent_id":"34"},
{"answer_id":"714","answer_english":"Pithoragarh","answer_hindi":"पिथौरागढ़","parent_id":"35"},
{"answer_id":"237","answer_english":"Poonch","answer_hindi":"पुंछ","parent_id":"14"},
{"answer_id":"184","answer_english":"Porbandar","answer_hindi":"पोरबंदर","parent_id":"11"},
{"answer_id":"9","answer_english":"Prakasam","answer_hindi":"प्रकाशम","parent_id":"1"},
{"answer_id":"541","answer_english":"Pratapgarh","answer_hindi":"प्रतापगढ़","parent_id":"29"},
{"answer_id":"691","answer_english":"Pratapgarh","answer_hindi":"प्रतापगढ","parent_id":"34"},
{"answer_id":"491","answer_english":"Puducherry","answer_hindi":"पुदुचेरी","parent_id":"27"},
{"answer_id":"571","answer_english":"Pudukkottai","answer_hindi":"पुदुकोट्टई","parent_id":"31"},
{"answer_id":"238","answer_english":"Pulwama","answer_hindi":"पुलवामा","parent_id":"14"},
{"answer_id":"398","answer_english":"Pune","answer_hindi":"पुणे","parent_id":"21"},
{"answer_id":"722","answer_english":"Purba Bardhaman","answer_hindi":"पूर्व बर्धमान ","parent_id":"36"},
{"answer_id":"738","answer_english":"Purba Medinipur","answer_hindi":"पूर्व मेदिनीपुर","parent_id":"36"},
{"answer_id":"484","answer_english":"Puri","answer_hindi":"पुरी","parent_id":"26"},
{"answer_id":"102","answer_english":"Purnia","answer_hindi":"पूर्णिया","parent_id":"5"},
{"answer_id":"739","answer_english":"Purulia","answer_hindi":"पुरूलिया","parent_id":"36"},
{"answer_id":"692","answer_english":"Raebareli","answer_hindi":"रायबरेली","parent_id":"34"},
{"answer_id":"293","answer_english":"Raichur","answer_hindi":"रायचूर","parent_id":"16"},
{"answer_id":"399","answer_english":"Raigad","answer_hindi":"रायगड","parent_id":"21"},
{"answer_id":"137","answer_english":"Raigarh","answer_hindi":"रायगढ","parent_id":"7"},
{"answer_id":"138","answer_english":"Raipur","answer_hindi":"रायपुर","parent_id":"7"},
{"answer_id":"319","answer_english":"Raisen","answer_hindi":"रायसेन","parent_id":"20"},
{"answer_id":"613","answer_english":"Rajanna Sircilla","answer_hindi":"राजन्ना सिरसिल्ला","parent_id":"32"},
{"answer_id":"320","answer_english":"Rajgarh ","answer_hindi":"राजगढ़","parent_id":"20"},
{"answer_id":"185","answer_english":"Rajkot","answer_hindi":"राजकोट","parent_id":"11"},
{"answer_id":"139","answer_english":"Rajnandgaon","answer_hindi":"राजनांदगांव","parent_id":"7"},
{"answer_id":"239","answer_english":"Rajouri","answer_hindi":"राजौरी","parent_id":"14"},
{"answer_id":"542","answer_english":"Rajsamand","answer_hindi":"राजसमंद","parent_id":"29"},
{"answer_id":"294","answer_english":"Ramanagara","answer_hindi":"रामनगर","parent_id":"16"},
{"answer_id":"572","answer_english":"Ramanathapuram","answer_hindi":"रामनाथपुरम","parent_id":"31"},
{"answer_id":"240","answer_english":"Ramban","answer_hindi":"रामबन","parent_id":"14"},
{"answer_id":"253","answer_english":"Ramgarh","answer_hindi":"रामगढ़","parent_id":"15"},
{"answer_id":"693","answer_english":"Rampur","answer_hindi":"रामपुर","parent_id":"34"},
{"answer_id":"259","answer_english":"Ranchi","answer_hindi":"राँची","parent_id":"15"},
{"answer_id":"614","answer_english":"Ranga Reddy","answer_hindi":"रंगारेड्डी","parent_id":"32"},
{"answer_id":"573","answer_english":"Ranipet","answer_hindi":"रानीपेट","parent_id":"31"},
{"answer_id":"367","answer_english":"Ratlam","answer_hindi":"रतलाम","parent_id":"20"},
{"answer_id":"400","answer_english":"Ratnagiri","answer_hindi":"रत्नागिरी","parent_id":"21"},
{"answer_id":"485","answer_english":"Rayagada","answer_hindi":"रायगड़ा","parent_id":"26"},
{"answer_id":"241","answer_english":"Reasi","answer_hindi":"रियासी","parent_id":"14"},
{"answer_id":"350","answer_english":"Rewa ","answer_hindi":"रीवा","parent_id":"20"},
{"answer_id":"209","answer_english":"Rewari","answer_hindi":"रेवाड़ी","parent_id":"12"},
{"answer_id":"430","answer_english":"Ri Bhoi","answer_hindi":"री भोई","parent_id":"23"},
{"answer_id":"210","answer_english":"Rohtak","answer_hindi":"रोहतक","parent_id":"12"},
{"answer_id":"103","answer_english":"Rohtas","answer_hindi":"रोहतास","parent_id":"5"},
{"answer_id":"715","answer_english":"Rudraprayag","answer_hindi":"रुद्रप्रयाग","parent_id":"35"},
{"answer_id":"510","answer_english":"Rupnagar","answer_hindi":"रूपनगर","parent_id":"28"},
{"answer_id":"186","answer_english":"Sabarkantha","answer_hindi":"साबरकांठा","parent_id":"11"},
{"answer_id":"357","answer_english":"Sagar ","answer_hindi":"सागर","parent_id":"20"},
{"answer_id":"694","answer_english":"Saharanpur","answer_hindi":"सहारनपुर","parent_id":"34"},
{"answer_id":"104","answer_english":"Saharsa","answer_hindi":"सहरसा","parent_id":"5"},
{"answer_id":"269","answer_english":"Sahebganj","answer_hindi":"साहिबगंज","parent_id":"15"},
{"answer_id":"511","answer_english":"Sahibzada Ajit Singh Nagar","answer_hindi":"मोहाली\/ साहिबजादा अजीत सिंह नगर","parent_id":"28"},
{"answer_id":"441","answer_english":"Saiha","answer_hindi":"सइहा","parent_id":"24"},
{"answer_id":"446","answer_english":"Saitual","answer_hindi":"सइतुआल","parent_id":"24"},
{"answer_id":"574","answer_english":"Salem","answer_hindi":"सेलम","parent_id":"31"},
{"answer_id":"105","answer_english":"Samastipur","answer_hindi":"समस्तीपुर","parent_id":"5"},
{"answer_id":"242","answer_english":"Samba","answer_hindi":"सांबा","parent_id":"14"},
{"answer_id":"486","answer_english":"Sambalpur","answer_hindi":"सम्बलपुर","parent_id":"26"},
{"answer_id":"695","answer_english":"Sambhal","answer_hindi":"सम्भल","parent_id":"34"},
{"answer_id":"615","answer_english":"Sangareddy","answer_hindi":"संगारेड्डी","parent_id":"32"},
{"answer_id":"401","answer_english":"Sangli","answer_hindi":"सांगली","parent_id":"21"},
{"answer_id":"512","answer_english":"Sangrur","answer_hindi":"संगरूर","parent_id":"28"},
{"answer_id":"696","answer_english":"Sant Kabir Nagar","answer_hindi":"संत कबीरनगर","parent_id":"34"},
{"answer_id":"262","answer_english":"Saraikela Kharsawan","answer_hindi":"सराइकेला खरसावाँ","parent_id":"15"},
{"answer_id":"106","answer_english":"Saran","answer_hindi":"सारन","parent_id":"5"},
{"answer_id":"402","answer_english":"Satara","answer_hindi":"सातारा","parent_id":"21"},
{"answer_id":"351","answer_english":"Satna ","answer_hindi":"सतना","parent_id":"20"},
{"answer_id":"544","answer_english":"Sawai Madhopur","answer_hindi":"सवाई माधोपुर","parent_id":"29"},
{"answer_id":"321","answer_english":"Sehore ","answer_hindi":"सीहोर","parent_id":"20"},
{"answer_id":"413","answer_english":"Senapati","answer_hindi":"सेनापति जिला","parent_id":"22"},
{"answer_id":"345","answer_english":"Seoni ","answer_hindi":"सिवनी ","parent_id":"20"},
{"answer_id":"442","answer_english":"Serchhip","answer_hindi":"सेरछिप","parent_id":"24"},
{"answer_id":"152","answer_english":"Shahdara","answer_hindi":"शाहदरा","parent_id":"9"},
{"answer_id":"361","answer_english":"Shahdol ","answer_hindi":"शहडोल","parent_id":"20"},
{"answer_id":"513","answer_english":"Shahid Bhagat Singh Nagar","answer_hindi":"शहीद भगतसिंहनगर","parent_id":"28"},
{"answer_id":"697","answer_english":"Shahjahanpur","answer_hindi":"शाहजहाँपुर","parent_id":"34"},
{"answer_id":"368","answer_english":"Shajapur","answer_hindi":"शाजापुर","parent_id":"20"},
{"answer_id":"698","answer_english":"Shamli","answer_hindi":"शामली","parent_id":"34"},
{"answer_id":"107","answer_english":"Sheikhpura","answer_hindi":"शेखपुरा","parent_id":"5"},
{"answer_id":"108","answer_english":"Sheohar","answer_hindi":"शिवहर","parent_id":"5"},
{"answer_id":"324","answer_english":"Sheopur ","answer_hindi":"श्योपुर","parent_id":"20"},
{"answer_id":"33","answer_english":"Shi Yomi","answer_hindi":"शिओमी","parent_id":"3"},
{"answer_id":"222","answer_english":"Shimla","answer_hindi":"शिमला","parent_id":"13"},
{"answer_id":"295","answer_english":"Shimoga","answer_hindi":"शिमोगा","parent_id":"16"},
{"answer_id":"328","answer_english":"Shivpuri ","answer_hindi":"शिवपुरी","parent_id":"20"},
{"answer_id":"243","answer_english":"Shopian","answer_hindi":"शोपियां","parent_id":"14"},
{"answer_id":"699","answer_english":"Shravasti","answer_hindi":"श्रावस्ती","parent_id":"34"},
{"answer_id":"34","answer_english":"Siang","answer_hindi":"सियांग","parent_id":"3"},
{"answer_id":"700","answer_english":"Siddharthnagar","answer_hindi":"सिद्धार्थनगर","parent_id":"34"},
{"answer_id":"616","answer_english":"Siddipet","answer_hindi":"सिद्दिपेट","parent_id":"32"},
{"answer_id":"352","answer_english":"Sidhi ","answer_hindi":"सीधी","parent_id":"20"},
{"answer_id":"543","answer_english":"Sikar","answer_hindi":"सीकर","parent_id":"29"},
{"answer_id":"258","answer_english":"Simdega","answer_hindi":"सिमडेगा","parent_id":"15"},
{"answer_id":"403","answer_english":"Sindhudurg","answer_hindi":"सिंधुदुर्ग","parent_id":"21"},
{"answer_id":"353","answer_english":"Singrauli ","answer_hindi":"सिंगरौली","parent_id":"20"},
{"answer_id":"627","answer_english":"Sipahijala","answer_hindi":"सिपाहीजाला","parent_id":"33"},
{"answer_id":"223","answer_english":"Sirmaur","answer_hindi":"सिरमौर","parent_id":"13"},
{"answer_id":"545","answer_english":"Sirohi","answer_hindi":"सिरोही","parent_id":"29"},
{"answer_id":"211","answer_english":"Sirsa","answer_hindi":"सिरसा","parent_id":"12"},
{"answer_id":"109","answer_english":"Sitamarhi","answer_hindi":"सीतामढ़ी","parent_id":"5"},
{"answer_id":"701","answer_english":"Sitapur","answer_hindi":"सीतापुर","parent_id":"34"},
{"answer_id":"575","answer_english":"Sivaganga","answer_hindi":"शिवगंगा","parent_id":"31"},
{"answer_id":"70","answer_english":"Sivasagar","answer_hindi":"शिवसागर","parent_id":"4"},
{"answer_id":"110","answer_english":"Siwan","answer_hindi":"सीवान","parent_id":"5"},
{"answer_id":"224","answer_english":"Solan","answer_hindi":"सोलन","parent_id":"13"},
{"answer_id":"404","answer_english":"Solapur","answer_hindi":"सोलापुर","parent_id":"21"},
{"answer_id":"702","answer_english":"Sonbhadra","answer_hindi":"सोनभद्र","parent_id":"34"},
{"answer_id":"212","answer_english":"Sonipat","answer_hindi":"सोनीपत","parent_id":"12"},
{"answer_id":"71","answer_english":"Sonitpur","answer_hindi":"शोणितपुर","parent_id":"4"},
{"answer_id":"740","answer_english":"South 24 Parganas","answer_hindi":"दक्षिण 24 परगना","parent_id":"36"},
{"answer_id":"16","answer_english":"South Andaman","answer_hindi":"दक्षिण अण्डमान","parent_id":"2"},
{"answer_id":"153","answer_english":"South Delhi ","answer_hindi":"दक्षिण दिल्ली","parent_id":"9"},
{"answer_id":"154","answer_english":"South East Delhi","answer_hindi":"दक्षिण पूर्वी दिल्ली","parent_id":"9"},
{"answer_id":"431","answer_english":"South Garo Hills","answer_hindi":"दक्षिण गारो हिल्स","parent_id":"23"},
{"answer_id":"158","answer_english":"South Goa","answer_hindi":" दक्षिण गोवा","parent_id":"10"},
{"answer_id":"72","answer_english":"South Salmara-Mankachar","answer_hindi":"दक्षिण सालमारा-मनकाचर","parent_id":"4"},
{"answer_id":"550","answer_english":"South Sikkim","answer_hindi":"दक्षिण सिक्किम","parent_id":"30"},
{"answer_id":"624","answer_english":"South Tripura","answer_hindi":"दक्षिण त्रिपुरा","parent_id":"33"},
{"answer_id":"155","answer_english":"South West Delhi","answer_hindi":"दक्षिण पश्चिम दिल्ली","parent_id":"9"},
{"answer_id":"432","answer_english":"South West Garo Hills","answer_hindi":"दक्षिण पश्चिम गारो हिल्स","parent_id":"23"},
{"answer_id":"433","answer_english":"South West Khasi Hills","answer_hindi":"दक्षिण पश्चिम खासी हिल्स","parent_id":"23"},
{"answer_id":"507","answer_english":"Sri Muktsar Sahib","answer_hindi":"मुक्तसर","parent_id":"28"},
{"answer_id":"10","answer_english":"Srikakulam","answer_hindi":"श्रीकाकुलम","parent_id":"1"},
{"answer_id":"244","answer_english":"Srinagar","answer_hindi":"श्रीनगर","parent_id":"14"},
{"answer_id":"487","answer_english":"Subarnapur(Sonepur)","answer_hindi":"सुबर्णपुर (सोनपुर)","parent_id":"26"},
{"answer_id":"140","answer_english":"Sukma","answer_hindi":"सुकमा","parent_id":"7"},
{"answer_id":"703","answer_english":"Sultanpur","answer_hindi":"सुल्तानपुर","parent_id":"34"},
{"answer_id":"488","answer_english":"Sundargarh","answer_hindi":"सुन्दरगड़","parent_id":"26"},
{"answer_id":"111","answer_english":"Supaul","answer_hindi":"सुपौल","parent_id":"5"},
{"answer_id":"141","answer_english":"Surajpur","answer_hindi":"सूरजपुर","parent_id":"7"},
{"answer_id":"187","answer_english":"Surat","answer_hindi":"सूरत","parent_id":"11"},
{"answer_id":"188","answer_english":"Surendranagar","answer_hindi":"सुरेंद्रनगर","parent_id":"11"},
{"answer_id":"142","answer_english":"Surguja","answer_hindi":"सरगुजा","parent_id":"7"},
{"answer_id":"617","answer_english":"Suryapet","answer_hindi":"सूर्यापेट","parent_id":"32"},
{"answer_id":"417","answer_english":"Tamenglong","answer_hindi":"तमेंगलॉन्ग जिला","parent_id":"22"},
{"answer_id":"189","answer_english":"Tapi","answer_hindi":"तापी","parent_id":"11"},
{"answer_id":"514","answer_english":"Tarn Taran","answer_hindi":"तरन तारन साहिब","parent_id":"28"},
{"answer_id":"35","answer_english":"Tawang","answer_hindi":"तवांग","parent_id":"3"},
{"answer_id":"716","answer_english":"Tehri Garhwal","answer_hindi":"टिहरी गढ़वाल","parent_id":"35"},
{"answer_id":"421","answer_english":"Tengnoupal","answer_hindi":"तेंगनोउपल ","parent_id":"22"},
{"answer_id":"576","answer_english":"Tenkasi","answer_hindi":"तेनकाशी","parent_id":"31"},
{"answer_id":"405","answer_english":"Thane","answer_hindi":"ठाणे","parent_id":"21"},
{"answer_id":"581","answer_english":"Thanjavur","answer_hindi":"तंजावुर","parent_id":"31"},
{"answer_id":"579","answer_english":"Theni","answer_hindi":"तेनी","parent_id":"31"},
{"answer_id":"312","answer_english":"Thiruvananthapuram","answer_hindi":"तिरुवनन्तपुरम ","parent_id":"17"},
{"answer_id":"582","answer_english":"Thoothukudi","answer_hindi":"तूतुकुड़ी","parent_id":"31"},
{"answer_id":"410","answer_english":"Thoubal","answer_hindi":"थौबल जिला","parent_id":"22"},
{"answer_id":"313","answer_english":"Thrissur","answer_hindi":"त्रिस्सूर ","parent_id":"17"},
{"answer_id":"358","answer_english":"Tikamgarh ","answer_hindi":"टीकमगढ़","parent_id":"20"},
{"answer_id":"73","answer_english":"Tinsukia","answer_hindi":"तिनसुकिया","parent_id":"4"},
{"answer_id":"36","answer_english":"Tirap","answer_hindi":"तिराप","parent_id":"3"},
{"answer_id":"578","answer_english":"Tiruchirappalli","answer_hindi":"तिरुचिरापल्ली","parent_id":"31"},
{"answer_id":"580","answer_english":"Tirunelveli","answer_hindi":"तिरूनेलवेली","parent_id":"31"},
{"answer_id":"583","answer_english":"Tirupattur","answer_hindi":"तिरुपत्तुर","parent_id":"31"},
{"answer_id":"577","answer_english":"Tirupur","answer_hindi":"तिरुपुर","parent_id":"31"},
{"answer_id":"584","answer_english":"Tiruvallur","answer_hindi":"तिरुवल्लुर","parent_id":"31"},
{"answer_id":"586","answer_english":"Tiruvannamalai","answer_hindi":"तिरुवन्नामलई","parent_id":"31"},
{"answer_id":"585","answer_english":"Tiruvarur","answer_hindi":"तिरुवारुर","parent_id":"31"},
{"answer_id":"546","answer_english":"Tonk","answer_hindi":"टोंक","parent_id":"29"},
{"answer_id":"455","answer_english":"Tuensang","answer_hindi":"ट्वेनसांग","parent_id":"25"},
{"answer_id":"296","answer_english":"Tumkur","answer_hindi":"तुमकूर","parent_id":"16"},
{"answer_id":"547","answer_english":"Udaipur","answer_hindi":"उदयपुर","parent_id":"29"},
{"answer_id":"74","answer_english":"Udalguri","answer_hindi":"उदलगुड़ी","parent_id":"4"},
{"answer_id":"717","answer_english":"Udham Singh Nagar","answer_hindi":"उधमसिंह नगर","parent_id":"35"},
{"answer_id":"245","answer_english":"Udhampur","answer_hindi":"उधमपुर","parent_id":"14"},
{"answer_id":"297","answer_english":"Udupi","answer_hindi":"उडुपी","parent_id":"16"},
{"answer_id":"369","answer_english":"Ujjain","answer_hindi":"उज्जैन","parent_id":"20"},
{"answer_id":"414","answer_english":"Ukhrul","answer_hindi":"उखरुल जिला","parent_id":"22"},
{"answer_id":"362","answer_english":"Umaria ","answer_hindi":"उमरिया","parent_id":"20"},
{"answer_id":"225","answer_english":"Una","answer_hindi":"उना","parent_id":"13"},
{"answer_id":"630","answer_english":"Unakoti","answer_hindi":"उनाकोटी","parent_id":"33"},
{"answer_id":"704","answer_english":"Unnao","answer_hindi":"उन्नाव","parent_id":"34"},
{"answer_id":"37","answer_english":"Upper Dibang Valley","answer_hindi":"ऊपरी दिबांग घाटी","parent_id":"3"},
{"answer_id":"38","answer_english":"Upper Siang","answer_hindi":"ऊपरी सियांग","parent_id":"3"},
{"answer_id":"39","answer_english":"Upper Subansiri","answer_hindi":"ऊपरी सुबनसिरी","parent_id":"3"},
{"answer_id":"741","answer_english":"Uttar Dinajpur","answer_hindi":"उत्तर दिनाजपुर","parent_id":"36"},
{"answer_id":"298","answer_english":"Uttara Kannada","answer_hindi":"उत्तर कन्नड़","parent_id":"16"},
{"answer_id":"718","answer_english":"Uttarkashi","answer_hindi":"उत्तरकाशी","parent_id":"35"},
{"answer_id":"190","answer_english":"Vadodara","answer_hindi":"वड़ोदरा","parent_id":"11"},
{"answer_id":"112","answer_english":"Vaishali","answer_hindi":"वैशाली","parent_id":"5"},
{"answer_id":"191","answer_english":"Valsad","answer_hindi":"वलसाड","parent_id":"11"},
{"answer_id":"705","answer_english":"Varanasi","answer_hindi":"वाराणसी","parent_id":"34"},
{"answer_id":"587","answer_english":"Vellore","answer_hindi":"वेल्लूर","parent_id":"31"},
{"answer_id":"322","answer_english":"Vidisha ","answer_hindi":"विदिशा","parent_id":"20"},
{"answer_id":"299","answer_english":"Vijayanagara","answer_hindi":"विजयनगर","parent_id":"16"},
{"answer_id":"618","answer_english":"Vikarabad","answer_hindi":"विक़ाराबाद","parent_id":"32"},
{"answer_id":"588","answer_english":"Viluppuram","answer_hindi":"विलुप्पुरम","parent_id":"31"},
{"answer_id":"589","answer_english":"Virudhunagar","answer_hindi":"विरुधुनगर","parent_id":"31"},
{"answer_id":"11","answer_english":"Visakhapatnam","answer_hindi":"विशाखापट्टनम","parent_id":"1"},
{"answer_id":"12","answer_english":"Vizianagaram","answer_hindi":"विजयनगरम","parent_id":"1"},
{"answer_id":"619","answer_english":"Wanaparthy","answer_hindi":"वानपर्ति","parent_id":"32"},
{"answer_id":"621","answer_english":"Warangal Rural","answer_hindi":"वरंगल ग्रामीण","parent_id":"32"},
{"answer_id":"620","answer_english":"Warangal Urban","answer_hindi":"वारंगल अर्बन","parent_id":"32"},
{"answer_id":"406","answer_english":"Wardha","answer_hindi":"वर्धा","parent_id":"21"},
{"answer_id":"407","answer_english":"Washim","answer_hindi":"वाशीम","parent_id":"21"},
{"answer_id":"314","answer_english":"Wayanad","answer_hindi":"वायनाड ","parent_id":"17"},
{"answer_id":"113","answer_english":"West Champaran","answer_hindi":"पश्चिमी चम्पारण जिला","parent_id":"5"},
{"answer_id":"156","answer_english":"West Delhi","answer_hindi":"पश्चिम दिल्ली","parent_id":"9"},
{"answer_id":"426","answer_english":"West Garo Hills","answer_hindi":"पश्चिम गारो हिल्स","parent_id":"23"},
{"answer_id":"13","answer_english":"West Godavari","answer_hindi":"पश्चिम गोदावरी","parent_id":"1"},
{"answer_id":"427","answer_english":"West Jaintia Hills","answer_hindi":"पश्चिम जयंतिया हिल्स","parent_id":"23"},
{"answer_id":"40","answer_english":"West Kameng","answer_hindi":"पश्चिम कमेंग","parent_id":"3"},
{"answer_id":"75","answer_english":"West Karbi Anglong","answer_hindi":"पश्चिम कार्बी आंगलोंग","parent_id":"4"},
{"answer_id":"428","answer_english":"West Khasi Hills","answer_hindi":"पश्चिम खासी हिल्स","parent_id":"23"},
{"answer_id":"41","answer_english":"West Siang","answer_hindi":"पश्चिम सियांग","parent_id":"3"},
{"answer_id":"551","answer_english":"West Sikkim","answer_hindi":"पश्चिम सिक्किम","parent_id":"30"},
{"answer_id":"261","answer_english":"West Singhbhum","answer_hindi":"पश्चिमी सिंहभूम ","parent_id":"15"},
{"answer_id":"629","answer_english":"West Tripura","answer_hindi":"पश्चिम त्रिपुरा","parent_id":"33"},
{"answer_id":"456","answer_english":"Wokha","answer_hindi":"वोखा","parent_id":"25"},
{"answer_id":"622","answer_english":"Yadadri Bhuvanagiri","answer_hindi":"यादाद्री भुवनगिरी","parent_id":"32"},
{"answer_id":"300","answer_english":"Yadgir","answer_hindi":"यादगीर","parent_id":"16"},
{"answer_id":"213","answer_english":"Yamuna Nagar","answer_hindi":"यमुनानगर","parent_id":"12"},
{"answer_id":"492","answer_english":"Yanam","answer_hindi":"यानम","parent_id":"27"},
{"answer_id":"408","answer_english":"Yavatmal","answer_hindi":"यवतमाळ","parent_id":"21"},
{"answer_id":"457","answer_english":"Zunheboto","answer_hindi":"ज़ुन्हेबोटो","parent_id":"25"}
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
    //                 answer_english : "हिंदी",  
    //                 answer_hindi : "हिंदी",  
    //             }
    //         ],
    //         is_answered : false,
    //         answer : "",
    //     },
    //     {
    //         name : "intro",
    //         question_id : 2,
    //         question_english : $sce.trustAsHtml("Welcome to the Social Media Warrior campaign of the Indian National Congress! <br /><br /> Under this campaign, INC Social Media team will be expanded at every village, city, state and national level in the country! <br /><br /> If you too believe in the ideology of the Congress party and want to contribute to the nation building, then let us be a part of the Congress Social Media Team! <br /><br /> You will be given responsibility at national, state or district level according to your qualifications and compatibility. <br /><br /> Let us join hands and fulfill our obligation to protect our democracy and build a modern India by being part of the world'\s largest democratic movement. <br /><br /> Please provide the following information that will help in giving you the corresponding responsibility! <br /><br /> Thank you ! <br /><br /> <iframe width='100%' height='315' src='https://www.youtube.com/embed/E7gWc7d0tOE' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>"),
    //         question_hindi : $sce.trustAsHtml("भारतीय राष्ट्रीय कांग्रेस के Social Media Warrior अभियान में आपका स्वागत है। <br /><br /> इस अभियान के तहत देश के हर गांव, शहर, राज्य और राष्ट्रीय स्तर पर INC Social Media टीम का विस्तार किया जाएगा। <br /><br /> अगर आप भी कांग्रेस की विचारधारा में विश्वास रखते हैं और राष्ट्रनिर्माण में अपना योगदान देना चाहते हैं तो आइए कांग्रेस सोशल मीडिया टीम का हिस्सा बनिए। <br /><br /> आपकी योग्यता और क्षमता के अनुसार आपको राष्ट्रीय, राज्य या जिला स्तर पर जिम्मेदारी दी जाएगी। <br /><br /> आइए हाथ से हाथ मिलाएं और विश्व के सबसे बडे लोकतांत्रिक आंदोलन का हिस्सा बन कर हमारे लोकतंत्र की रक्षा और आधुनिक भारत के निर्माण का हमारा दायित्व पूरा करें। <br /><br /> कृपया निम्न जानकारी दें जिससे आपके अनुरूप जिम्मेदारी देने में सहायता मिले। <br /><br /> धन्यवाद  <iframe width='100%' height='315' src='https://www.youtube.com/embed/ju1yZKzapnw' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>"), 
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
    //         question_hindi : "कृपया आपका नाम और उपनाम टाइप करें",
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
    //         question_hindi : "आपका फोन नंबर?",
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
    //         question_hindi : "आपका मोबाइल नंबर पहले से पंजीकृत है। धन्यवाद।",
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
    //         question_hindi : "आपको एक OTP प्राप्त हुआ होगा। कृपया OTP टाइप करें",
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
    //         question_hindi : "वैरिफिकेशन कोड गलत है.",
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
    //         question_hindi : "क्या यह आपका व्हाट्सएप नंबर भी है?",
    //         question_type : "option",
    //         is_skip : false,
    //         is_answered : false,
    //         answers : [
    //             {
    //                 answer_id : "1",
    //                 answer_english : "Yes",
    //                 answer_hindi : "हाँ",
    //             },
    //             {
    //                 answer_id : "2",
    //                 answer_english : "No",  
    //                 answer_hindi : "नहीं",  
    //             }
    //         ],
    //         answer : "",
    //     },
    //     {
    //         name : "whatsapp_number",
    //         question_id : 11,
    //         question_english : "What is your WhatsApp number?",
    //         question_hindi : "आपका व्हाट्सएप नंबर क्या है?",
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
    //         question_hindi : "आप किस राज्य या केंद्र शासित प्रदेश से हैं?",
    //         question_type : "selection",
    //         is_answered : false,
    //         is_skip : false,
    //         answers : [
    //             {"answer_id":"1","answer_english":"Andaman Nicobar","answer_hindi":"अंडमान निकोबार"},
    //             {"answer_id":"2","answer_english":"Andhra Pradesh","answer_hindi":"आंध्र प्रदेश"},
    //             {"answer_id":"3","answer_english":"Arunachal Pradesh","answer_hindi":"अरुणाचल प्रदेश"},
    //             {"answer_id":"4","answer_english":"Assam","answer_hindi":"असम"},
    //             {"answer_id":"5","answer_english":"Bihar","answer_hindi":"बिहार"},
    //             {"answer_id":"6","answer_english":"Chandigarh","answer_hindi":"चंडीगढ़"},
    //             {"answer_id":"7","answer_english":"Chhattisgarh","answer_hindi":"छत्तीसगढ़"},
    //             {"answer_id":"8","answer_english":"Dadra and Nagar Haveli","answer_hindi":"दादरा और नगर हवेली"},
    //             {"answer_id":"9","answer_english":"Delhi","answer_hindi":"दिल्ली"},
    //             {"answer_id":"10","answer_english":"Diu Daman","answer_hindi":"दीव दमन"},
    //             {"answer_id":"11","answer_english":"Goa","answer_hindi":"गोवा"},
    //             {"answer_id":"12","answer_english":"Gujarat","answer_hindi":"गुजरात"},
    //             {"answer_id":"13","answer_english":"Haryana","answer_hindi":"हरियाणा"},
    //             {"answer_id":"14","answer_english":"Himachal Pradesh","answer_hindi":"हिमाचल प्रदेश"},
    //             {"answer_id":"15","answer_english":"Jammu Kashmir","answer_hindi":"जम्मू कश्मीर"},
    //             {"answer_id":"16","answer_english":"Jharkhand","answer_hindi":"झारखंड"},
    //             {"answer_id":"17","answer_english":"Karnataka","answer_hindi":"कर्नाटक"},
    //             {"answer_id":"18","answer_english":"Kerala","answer_hindi":"केरल"},
    //             {"answer_id":"19","answer_english":"Lakshadweep","answer_hindi":"लक्षद्वीप"},
    //             {"answer_id":"20","answer_english":"Madhya Pradesh","answer_hindi":"मध्य प्रदेश"},
    //             {"answer_id":"21","answer_english":"Maharashtra","answer_hindi":"महाराष्ट्र"},
    //             {"answer_id":"22","answer_english":"Manipur","answer_hindi":"मणिपुर"},
    //             {"answer_id":"23","answer_english":"Meghalaya","answer_hindi":"मेघालय"},
    //             {"answer_id":"24","answer_english":"Mizoram","answer_hindi":"मिजोरम"},
    //             {"answer_id":"25","answer_english":"Nagaland","answer_hindi":"नगालैंड"},
    //             {"answer_id":"26","answer_english":"Odisha","answer_hindi":"ओडिशा"},
    //             {"answer_id":"27","answer_english":"Puducherry","answer_hindi":"पुडुचेरी"},
    //             {"answer_id":"28","answer_english":"Punjab","answer_hindi":"पंजाब"},
    //             {"answer_id":"29","answer_english":"Rajasthan","answer_hindi":"राजस्थान"},
    //             {"answer_id":"30","answer_english":"Sikkim","answer_hindi":"सिक्किम"},
    //             {"answer_id":"31","answer_english":"Tamil Nadu","answer_hindi":"तमिलनाडु"},
    //             {"answer_id":"32","answer_english":"Telangana","answer_hindi":"तेलंगाना"},
    //             {"answer_id":"33","answer_english":"Tripura","answer_hindi":"त्रिपुरा"},
    //             {"answer_id":"34","answer_english":"Uttar Pradesh","answer_hindi":"उत्तर प्रदेश"},
    //             {"answer_id":"35","answer_english":"Uttarakhand","answer_hindi":"उत्तराखंड"},
    //             {"answer_id":"36","answer_english":"West Bengal","answer_hindi":"पश्चिम बंगाल"},
    //             // {"answer_id":"37","answer_english":"Mumbai","answer_hindi":"मुंबई"},
    //             {"answer_id":"38","answer_english":"Ladakh","answer_hindi":"लद्दाख"}
    //         ],
    //         answer : "",
    //     },
    //     {
    //         name : "pincode",
    //         question_id : 13,
    //         question_english : "Please enter your PIN code",
    //         question_hindi : "जी कृपया अपना पिन कोड दर्ज करें",
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
    //     //     question_hindi : "आपकी प्रतिक्रिया के लिए आपका धन्यवाद। हम आपसे शीघ्र ही संपर्क करेंगे! आपका संदर्भ संख्या आपका प्राथमिक फ़ोन नंबर है",
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
    //         question_hindi : "आपकी शैक्षणिक योग्यता क्या है?",
    //         question_type : "selection",
    //         is_answered : false,
    //         is_skip : false,
    //         answers : [
    //             {"answer_id":"1","answer_english":"School","answer_hindi":"स्कूल"},
    //             {"answer_id":"2","answer_english":"Graduate","answer_hindi":"ग्रेजुएट"},
    //             {"answer_id":"3","answer_english":"Post graduate","answer_hindi":"पोस्ट ग्रेजुएट"},
    //             {"answer_id":"4","answer_english":"PhD","answer_hindi":"पीएचडी"},
    //         ],
    //         answer : "",
    //     },
    //     {
    //         name : "profession",
    //         question_id : 15,
    //         question_english : "What is your occupational / employment status?",
    //         question_hindi : "आपकी  व्यवसायिक / रोजगार स्थिति क्या है?",
    //         question_type : "selection",
    //         is_answered : false,
    //         is_skip : false,
    //         answers : [
    //             {"answer_id":"1","answer_english":"Student","answer_hindi":"छात्र"},
    //             {"answer_id":"2","answer_english":"Self Employed/ Business","answer_hindi":"स्व - रोजगार / व्यापार"},
    //             {"answer_id":"3","answer_english":"Private Service","answer_hindi":"प्राइवेट सर्विस"},
    //             {"answer_id":"4","answer_english":"Govt/ Semi Government","answer_hindi":"सरकारी / अर्ध सरकारी सेवा"},
    //             {"answer_id":"5","answer_english":"NGO","answer_hindi":"एनजीओ"},
    //             {"answer_id":"6","answer_english":"Other","answer_hindi":"अन्य"}
    //         ],
    //         answer : "",
    //     },
    //     {
    //         name : "interested_position",
    //         question_id : 16,
    //         question_english : "On What position would you like to work on?",
    //         question_hindi : "किस स्ता पर काम करना चाहेंगे?",
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
    //         question_hindi : "आप प्रति दिन कितने घंटे कांग्रेस सोशल मीडिया टीम के साथ काम करने के लिए समर्पित करने के लिए तैयार हैं?",
    //         question_type : "selection",
    //         is_answered : false,
    //         is_skip : false,
    //         answers : [
    //             {"answer_id":"1","answer_english":"1-2 Hours","answer_hindi":"1-2 घंटे"},
    //             {"answer_id":"2","answer_english":"2-4 Hours","answer_hindi":"2-4 घंटे"},
    //             {"answer_id":"3","answer_english":"4-6 Hours","answer_hindi":"4-6 घंटे"},
    //             {"answer_id":"4","answer_english":"More than 6 Hours","answer_hindi":"6 घंटे से ज्यादा"},
    //         ],
    //         answer : "",
    //     },
    //     {
    //         name : "prefered_working",
    //         question_id : 19,
    //         // question_english : "In which of the following areas are you willing to work with the Congress Social Media team? Please mention top TWO only. <br /><br />Training,<br /> Research,<br /> Content (writing),<br /> Content Creation,<br /> Outreach/ Team Development,<br /> Outreach/ Team Development,<br /> Content Distribution.",
    //         // question_hindi : "आप निम्नलिखित में से किस क्षेत्र में कांग्रेस सोशल मीडिया टीम के साथ काम करने के इच्छुक हैं? कृपया केवल दो का उल्लेख करें.<br /><br /> ट्रेनिंग,<br /> रिसर्च,<br /> कंटेंट लेखन,<br /> कंटेंट (वीडियो / ऑडियो / ग्राफिक्स,<br />आउटरीच / टीम तैयार करना,<br />कंटेंट वितरण",
    //         question_english : " In which of the following areas are you willing to work with the Congress social media team?",
    //         question_hindi : "आप निम्नलिखित में से किस क्षेत्र में कांग्रेस सोशल मीडिया टीम के साथ काम करने के इच्छुक हैं?",
    //         max_check : 15,
    //         question_type : "checkbox",
    //         is_answered : false,
    //         is_skip : false,
    //         answers : [
    //             {"answer_id":"1","answer_english":"Training","answer_hindi":"ट्रेनिंग"},
    //             {"answer_id":"2","answer_english":"Research","answer_hindi":"रिसर्च"},
    //             {"answer_id":"3","answer_english":"Content (writing)","answer_hindi":"कंटेंट लेखन"},
    //             {"answer_id":"4","answer_english":"Content Creation","answer_hindi":"कंटेंट क्रिएशन"},
    //             {"answer_id":"5","answer_english":"Outreach/ Team Development","answer_hindi":"आउटरीच / टीम तैयार करना"},
    //             {"answer_id":"5","answer_english":"Content Distribution","answer_hindi":"कंटेंट वितरण"},
    //         ],
    //         answer : "",
    //     },
    //     {
    //         name : "activity_area",
    //         question_id : 20,
    //         question_english : "If there is any other area or activity you want to involve with the social media team (not mentioned in the previous options), please let us know.",
    //         question_hindi : "यदि कोई अन्य क्षेत्र या गतिविधि आप सोशल मीडिया टीम (पिछले विकल्पों में उल्लिखित नहीं) के साथ शामिल करना चाहते हैं, तो कृपया हमें बताएं.",
    //         question_type : "text",
    //         is_answered : false,
    //         is_skip : false,
    //         answers : [
    //             // {"answer_id":"1","answer_english":"Training","answer_hindi":"अंडमान निकोबार"},
    //             // {"answer_id":"2","answer_english":"Research","answer_hindi":"अंडमान निकोबार"},
    //             // {"answer_id":"3","answer_english":"Content (writing)","answer_hindi":"अंडमान निकोबार"},
    //             // {"answer_id":"4","answer_english":"Content Creation","answer_hindi":"अंडमान निकोबार"},
    //             // {"answer_id":"5","answer_english":"Outreach/ Team Development","answer_hindi":"अंडमान निकोबार"},
    //             // {"answer_id":"5","answer_english":"Content Distribution","answer_hindi":"अंडमान निकोबार"},
    //         ],
    //         answer : "",
    //     },
    //     {
    //         name : "social_media_platforms",
    //         question_id : 21,
    //         question_english : "Which of these social media platforms are you more active on? Mention the top three.",
    //         question_hindi : "आप इनमें से किस सोशल मीडिया प्लेटफॉर्म पर ज्यादा सक्रिय हैं? शीर्ष तीन का उल्लेख करें.",
    //         question_type : "checkbox",
    //         max_check : 3,
    //         is_answered : false,
    //         is_skip : false,
    //         answers : [
    //             {"answer_id":"1","answer_english":"WhatsApp","answer_hindi":"व्हाट्सएप"},
    //             {"answer_id":"2","answer_english":"Facebook","answer_hindi":"फेसबुक"},
    //             {"answer_id":"3","answer_english":"Twitter","answer_hindi":"ट्विटर"},
    //             {"answer_id":"4","answer_english":"YouTube","answer_hindi":"यूट्यूब"},
    //             {"answer_id":"5","answer_english":"Instagram","answer_hindi":"इंस्टाग्राम"},
    //             {"answer_id":"5","answer_english":"Other","answer_hindi":"अन्य"},
    //         ],
    //         answer : "",
    //     },
    //     {
    //         name : "social_media_platform_links",
    //         question_id : 22,
    //         question_english : "Please provide your most active social media handle link on your top three platforms (how to link)",
    //         question_hindi : "कृपया अपने शीर्ष तीन प्लेटफार्मों पर अपने सोशल मीडिया आईडी के लिंक प्रदान करें ( लिंक कैसे दें",
    //         question_type : "text",
    //         is_answered : false,
    //         is_skip : false,
    //         answers : [
    //             // {"answer_id":"1","answer_english":"Training","answer_hindi":"अंडमान निकोबार"},
    //             // {"answer_id":"2","answer_english":"Research","answer_hindi":"अंडमान निकोबार"},
    //             // {"answer_id":"3","answer_english":"Content (writing)","answer_hindi":"अंडमान निकोबार"},
    //             // {"answer_id":"4","answer_english":"Content Creation","answer_hindi":"अंडमान निकोबार"},
    //             // {"answer_id":"5","answer_english":"Outreach/ Team Development","answer_hindi":"अंडमान निकोबार"},
    //             // {"answer_id":"5","answer_english":"Content Distribution","answer_hindi":"अंडमान निकोबार"},
    //         ],
    //         answer : "",
    //     },
    //     {
    //         name : "email",
    //         question_id : 23,
    //         question_english : "Write your email address",
    //         question_hindi : "आपका ईमेल एड्रेस लिखें",
    //         question_type : "text",
    //         is_answered : false,
    //         is_skip : false,
    //         answers : [
    //             // {"answer_id":"1","answer_english":"Training","answer_hindi":"अंडमान निकोबार"},
    //             // {"answer_id":"2","answer_english":"Research","answer_hindi":"अंडमान निकोबार"},
    //             // {"answer_id":"3","answer_english":"Content (writing)","answer_hindi":"अंडमान निकोबार"},
    //             // {"answer_id":"4","answer_english":"Content Creation","answer_hindi":"अंडमान निकोबार"},
    //             // {"answer_id":"5","answer_english":"Outreach/ Team Development","answer_hindi":"अंडमान निकोबार"},
    //             // {"answer_id":"5","answer_english":"Content Distribution","answer_hindi":"अंडमान निकोबार"},
    //         ],
    //         answer : "",
    //     },
    //     {
    //         name : "thankyou",
    //         question_id : 24,
    //         question_english : "Thank you for your response. We will contact you soon! <br /><br /> Please send this link to your colleagues and give them an opportunity to join this campaign. Jai Hind !",
    //         question_hindi : "आपकी प्रतिक्रिया के लिए आपका धन्यवाद। हम शीघ्र ही आपसे संपर्क करेंगे! <br /><br /> कृपया अपने साथियों को यह लिंक भेज कर उनको भी इस अभियान से जुडने का अवसर दें। जय हिन्द !",
    //         question_type : "none",
    //         is_answered : false,
    //         is_skip : false,
    //         answers : [
    //             // {"answer_id":"1","answer_english":"Training","answer_hindi":"अंडमान निकोबार"},
    //             // {"answer_id":"2","answer_english":"Research","answer_hindi":"अंडमान निकोबार"},
    //             // {"answer_id":"3","answer_english":"Content (writing)","answer_hindi":"अंडमान निकोबार"},
    //             // {"answer_id":"4","answer_english":"Content Creation","answer_hindi":"अंडमान निकोबार"},
    //             // {"answer_id":"5","answer_english":"Outreach/ Team Development","answer_hindi":"अंडमान निकोबार"},
    //             // {"answer_id":"5","answer_english":"Content Distribution","answer_hindi":"अंडमान निकोबार"},
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
                        $scope.errorMessage = "कृपया 10 अंकों की मान्य संख्या दर्ज करें!"; 
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
                        $scope.errorMessage = "कृपया एक मान्य 6 अंक पिन कोड दर्ज करें!"; 
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
                        $scope.errorMessage = "कृपया एक मान्य 6 अंक OTP दर्ज करें!"; 
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
                        $scope.errorMessage = "कृपया एक मान्य ई - मेल एड्रेस डालें!"; 
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
                if(answer.indexOf("Other") > -1 || answer.indexOf("अन्य") > -1){
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
                if(answer == "Yes" || answer == "हाँ"){
                    addition = 2;
                    angular.forEach($rootScope.$storage.chat_messages, function (value, key){
                        if(value.name == "age_false"){
                            $rootScope.$storage.chat_messages[key].is_skip = true;
                        }
                    });     
                }
            }

            if(question.name == "inside_india"){
                if(answer == "Inside India" || answer == "भारत में"){
                    addition = 2;
                    angular.forEach($rootScope.$storage.chat_messages, function (value, key){
                        if(value.name == "not_in_india"){
                            $rootScope.$storage.chat_messages[key].is_skip = true;
                        }
                    });     
                }
            }

            if(question.name == "is_whatsapp"){
                if(answer == "Yes" || answer == "हाँ"){
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
                                $rootScope.$storage.registrationObj.user_id = response.user_id;
                                $rootScope.$storage.authorization = response.authorization;
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
                            $scope.errorMessage = "गलत OTP, कृपया पुनः प्रयास करें!!"; 
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
          headers: {
           'Authorization': 'Bearer '+$rootScope.$storage.authorization
          },
        }).then(function successCallback(response) {
            
        }, function errorCallback(response) {
        });
    }

})


