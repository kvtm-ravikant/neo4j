'use strict';
/**
 * Created by ravikant on 20/6/14.
 */
educationMediaApp
		.controller(
				'manageUser_registerNewUser',
				function($scope, $http, iconClassMapping, appUtils) {

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
					$http.get('/manage-users/userClassData').success(
							function(dataResponse, status, headers, config) {
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
															});
										}).error(function(data, status, headers, config) {
											// error
											console.log("Error", data, status,headers, config);

										});
					};
					
			
				});





