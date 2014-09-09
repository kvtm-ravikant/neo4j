'use strict';
/**
 * Created by ravikant on 20/6/14.
 */
educationMediaApp.controller('manageUser_registerNewUser',function($scope, $http, iconClassMapping, appUtils) {

	$scope.counter = 0;
	$scope.steps = [ 'one', 'two', 'three', 'four', 'five' ];
	$scope.step = 0;
	
	$scope.wizard = {
		tacos : 2
		};

	$('.datepicker').datepicker({
		format : 'dd/mm/yyyy',
		language : 'en',
		autoclose : true,
		weekStart : 0,
		todayHighlight : true
		});
	
   $scope.openPublicationDate=function(){
	   console.log("date picker");
        $('#publicationDate').focus();
    	};
	
	/* UserClass POJO Data Model */
	$http.get('/manage-users/userClassData').success(function(dataResponse, status, headers, config) {
			// success
			console.log("userClassData", dataResponse);
			appUtils.defaultParseResponse(dataResponse,
					function(dataResponse) {
						$scope.userClass = dataResponse;   //User Class userClass.basicDetails.userName //way to access property
						console.log("$scope.userClass",
								$scope.userClass);
					});

				}).error(function(data, status, headers, config) {
				//error
				console.log("Error", data, status, headers, config);
			});
					

	$scope.openDateofBirth = function() {
		$('#dob').focus();
		};
    $scope.readURL=function (input) {


        if (input.files	&& input.files[0]) {
            var file = input.files[0];
            if(!file){
                appUtils.showError("Please choose a .png  or .jpg or .jpeg file.");
                $(input).val("");
                return;
            }
            var fileName = file.name;
            if (file.name.indexOf("png") < 0  && file.name.indexOf("jpg") < 0 && file.name.indexOf("jepg") < 0) {
                $(input).val("");
                appUtils.showError("Please choose a .png  or .jpg or .jpeg file.");
                return;
            }
            if (file.size>10000) {
                $(input).val("");
                appUtils.showError("Please choose file of size less than 5KB.");
                return;
            }
            try{
                var reader = new FileReader();
                reader.onload = function(e) {
                    $scope.userClass.basicDetails.profileImagePath=e.target.result;
                    console.log("$scope.userClass.basicDetails.profileImagePath",$scope.userClass.basicDetails.profileImagePath);
                    $scope.$apply();
                }
                reader.readAsDataURL(file);
            }catch(e){
                var uploadCSV = new FormData();
                uploadCSV.append("imageFile", file);
                $http.post("/application/readImage", uploadCSV, {
                    withCredentials: true,
                    headers: {'Content-Type': undefined },
                    transformRequest: angular.identity
                }).success(function(dataResponse, status, headers,config) {
                    // success
                    appUtils.defaultParseResponse(dataResponse,function(dataResponse) {
                        console.log("registerUser - dataResponse",dataResponse)
                        $scope.userClass.basicDetails.profileImagePath = dataResponse.responseData;
                        $scope.$apply();
                    });
                }).error(function(data, status, headers, config) {
                    // error
                    console.log("Error", data, status,headers, config);

                });
            }

        }
    }
	$scope.userDataTest = [ {
		"accountInfo" : "put account info fields here"
	}, {
		"personalInfo" : "put personal info fields here"
	}, {
		"contactInfo" : "put contact info fields here"
	}, {
		"otherInfo" : "put acc info fields here"
	}, {
		"finalizeInfo" : "put finalize info fields here"
		} ];

					
	/*
	 * Priv -next logic - start
	 */

	$scope.next = function() {
		$scope.counter >= ($scope.userDataTest.length - 1) ? $scope.userDataTest.length : $scope.counter++;
		console.log("Puneet " + $scope.step
				+ " userDataLength "
				+ $scope.userDataTest.length);
		$scope.step = $scope.counter;
//						$scope.formValidationStep();

	}
	$scope.prev = function() {
		$scope.counter <= 0 ? 0 : $scope.counter--;
		$scope.step = $scope.counter;
	}

	$scope.isFirstStep = function() {
		console.log("isFirstStep ");
		return $scope.step === 0;
	};

	$scope.isLastStep = function() {
		console.log("isLastStep ");
		return $scope.step === ($scope.steps.length - 1);
	};

	$scope.isCurrentStep = function(step) {
		console.log("isCurrentStep");
		return $scope.step === step;
	};

	$scope.setCurrentStep = function(step) {
		console.log("setCurrentStep");
		$scope.step = step;
	};

	$scope.getCurrentStep = function() {
		console.log("getCurrentStep");
		return $scope.steps[$scope.step];
	};

	$scope.getNextLabel = function() {
		console.log("getNextLabel");
		return ($scope.isLastStep()) ? 'Submit' : 'Next';
	};

	$scope.handlePrevious = function() {
		console.log("handlePrevious");
		$scope.step -= ($scope.isFirstStep()) ? 0 : 1;
	};

	$scope.handleNext = function(dismiss) {
		console.log("handleNext");
		if ($scope.isLastStep()) {
			dismiss();
		} else {
			$scope.step += 1;
		}
	};

	/*
	 * Priv -next logic - End
	 */
	$scope.formValidationStep = function()
	{
		// var errorObj={error:true,errorMsg:[]};
		// errorObj.errorMsg.push("Start cannot be empty.");
		// var erroMsg=errorobj.errorMsg.join('<br>');
		// appUtils.showError(erroMsg);

		// console.log("$scope.userClass.contact.emailPrimary
		// "+angular.isUndefined($scope.userClass.contact.emailPrimary));
		// appUtils.showError("Puneet ",$scope.step.toString());

		if (angular
				.isUndefined($scope.userClass.contact.emailPrimary))
			appUtils.showError("Email is mandatory");
		else if (angular
				.isUndefined($scope.userClass.user.userName))
			appUtils.showError("User Name is mandatory");
		else if (angular
				.isUndefined($scope.userClass.user.firstName))
			appUtils.showError("First Name is mandatory");
		else if (angular
				.isUndefined($scope.userClass.user.lastName))
			appUtils.showError("Last Name is mandatory");
		else if (angular
				.isUndefined($scope.userClass.user.DOB))
			appUtils.showError("Date of birth is mandatory");
//						else if (angular
//								.isUndefined($scope.userClass.user.userName))
//							appUtils.showError("User Name is mandatory");
		
		}
	
	/*
	 * Check availability of username 
	 */
	$scope.getUserNameAvailabity = function(){
		var userText = {userText: $scope.userClass.basicDetails.userName};
		console.log("getUserNameAvailabity ",userText);
		if(!angular.isUndefined(userText))
			$http({
				method : 'POST',
				url : '/manage-users/users/userNameAvailablity',
				data : userText,
				headers : {
					'Content-Type' : 'application/json'
				}
			}).success(function(dataResponse, status, headers,config) {
								// success
								appUtils.defaultParseResponse(dataResponse,function(dataResponse) {
													console.log("getUserNameAvailabity - dataResponse",dataResponse)
													$scope.userAvailable = dataResponse.responseData.data;
//																	console.log("responce data : ",dataResponse.responseData.data.length);
												});
							}).error(function(data, status, headers, config) {
								// error
								console.log("Error", data, status,headers, config);

							});
		else
			appUtils.showError("Enter correct username");
		}
	
	/*
	 * Check availability of Registration ID 
	 */
	$scope.getregistrationIDAvailabity = function(){
		var regIdText = {regIdText: $scope.userClass.basicDetails.regID};
		console.log("getregistrationIDAvailabity ",regIdText);
		if(!angular.isUndefined(regIdText))
			$http({
				method : 'POST',
				url : '/manage-users/users/registrationIDAvailabity',
				data : regIdText,
				headers : {
					'Content-Type' : 'application/json'
				}
			}).success(function(dataResponse, status, headers,config) {
								// success
								appUtils.defaultParseResponse(dataResponse,function(dataResponse) {
													console.log("getregistrationIDAvailabity - dataResponse",dataResponse)
													$scope.regIdAvailable = dataResponse.responseData.data;
																	console.log("responce data : ",dataResponse.responseData.data.length);
												});
							}).error(function(data, status, headers, config) {
								// error
								console.log("Error", data, status,headers, config);

							});
		else
			appUtils.showError("Enter correct username");
		}
	/*
	 * Submit button Method for "Add new User"
	 */
	$scope.registerNewUser = function() {
//						console.log("registerUser ", $scope.userClass);
		$http({
			method : 'POST',
			url : '/manage-users/users/registerNewUser',
			data : $scope.userClass,
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function(dataResponse, status, headers,config) {
							// success
							appUtils.defaultParseResponse(dataResponse,function(dataResponse) {
												console.log("registerUser - dataResponse",dataResponse)
												$scope.userClass = dataResponse.responseData;
												appUtils.showError("User "+$scope.userClass.basicDetails.userName+" created successfully");
											});
						}).error(function(data, status, headers, config) {
							// error
							console.log("Error", data, status,headers, config);

						});
		};
	
		/*
	    * Dropdown JSON data of bibDocTypeMaterial
	    */ 
	    $http.get('/manageLibrary/getCountryStateCity').success(function(dataResponse,status,headers,config){
	        //success
	        console.log("getCountryStateCity",dataResponse);
	        appUtils.defaultParseResponse(dataResponse,function(dataResponse){
	            $scope.countryStateCity=dataResponse;
	         console.log("$scope.getCountryStateCity",$scope.getCountryStateCity);
	        });

	    }).error(function(data,status,headers,config){
	        //error
	        console.log("Error",data,status,headers,config);
	    });

    	/*
	    * Dropdown JSON data of ReligionCaste
	    */ 
	    $http.get('/manageLibrary/getReligionCaste').success(function(dataResponse,status,headers,config){
	        //success
	        console.log("ReligionCaste",dataResponse);
	        appUtils.defaultParseResponse(dataResponse,function(dataResponse){
	            $scope.religionCaste=dataResponse;
	         console.log("$scope.ReligionCaste",$scope.ReligionCaste);
	        });

	    }).error(function(data,status,headers,config){
	        //error
	        console.log("Error",data,status,headers,config);
	    });

	    /*
		    * Dropdown JSON data of Language
		    */ 
		    $http.get('/manageLibrary/getLanguages').success(function(dataResponse,status,headers,config){
		        //success
		        console.log("getLanguages",dataResponse);
		        appUtils.defaultParseResponse(dataResponse,function(dataResponse){
		            $scope.languages=dataResponse;
		         console.log("$scope.languages",$scope.languages);
		        });

		    }).error(function(data,status,headers,config){
		        //error
		        console.log("Error",data,status,headers,config);
		    });
	    /*
	     * Validate new Registration ID with the unique existance 
	     */
	    $scope.validateRegistrationId=function()
	    {
	    	console.log("validateRegistrationId ");
	    	$http({
				method : 'POST',
				url : '/manage-users/users/registerNewUser',
				data : $scope.userClass,
				headers : {
					'Content-Type' : 'application/json'
				}
			}).success(function(dataResponse, status, headers,config) {
								// success
								appUtils.defaultParseResponse(dataResponse,function(dataResponse) {
													console.log("registerUser - dataResponse",dataResponse)
													$scope.userClass = dataResponse.responseData;
												});
							}).error(function(data, status, headers, config) {
								// error
								console.log("Error", data, status,headers, config);

							});

	    }

});





