'use strict';
educationMediaApp.controller('manageUser_testUser', function ($scope, $http,iconClassMapping,appUtils) {
    $scope.text="Test User";

    $scope.counter = 0;
	$scope.steps = [ 'one', 'two', 'three', 'four', 'five'];
	$scope.step = 0;
	
    $scope.prev = function() {
		$scope.counter <= 0 ? 0 : $scope.counter--;
		$scope.step = $scope.counter;
		$('ul.setup-panel li:eq('+$scope.step+')').removeClass('disabled');
        $('ul.setup-panel li a[href="#step-'+($scope.counter+1)+'"]').trigger('click');
        $(this).remove();
	}
	
    $scope.next = function() {
		$scope.counter >= ($scope.steps.length - 1) ? $scope.steps.length : $scope.counter++;
		
		$scope.step = $scope.counter;
		console.log("Puneet $scope.step" + $scope.step	+ " userDataLength " + $scope.steps.length +"$scope.counter "+$scope.counter);
		       
		$('ul.setup-panel li:eq('+$scope.step+')').removeClass('disabled');
	    $('ul.setup-panel li a[href="#step-'+($scope.counter+1)+'"]').trigger('click');
	    $(this).remove();
	     
//	    var result = $('div#regDiv:input').valid();
	    
//	    console.log("result : ",result);
	}
    
    $scope.isInvalid = function(field){
        return $scope.userForm[field].$invalid && $scope.userForm[field].$dirty;
      };
      
      $scope.isValid = function(field){
        return $scope.userForm[field].$valid && $scope.userForm[field].$dirty;
      };
      
      
      $scope.$watch('userForm', function(){
        console.log('$scope.userForm', $scope.userForm);
      });
      
    
    $(document).ready(function() {
        
        var navListItems = $('ul.setup-panel li a'),
            allWells = $('.setup-content');

        allWells.hide();

        navListItems.click(function(e)
        {
            e.preventDefault();
            var $target = $($(this).attr('href')),
                $item = $(this).closest('li');
            
            if (!$item.hasClass('disabled')) {
                navListItems.closest('li').removeClass('active');
                $item.addClass('active');
                allWells.hide();
                $target.show();
            }
        });
        
        $('ul.setup-panel li.active a').trigger('click');
        
        // DEMO ONLY //
        /*
        $('#activate-step-2').on('click', function(e) {
            $('ul.setup-panel li:eq(1)').removeClass('disabled');
            $('ul.setup-panel li a[href="#step-2"]').trigger('click');
            $(this).remove();
        })  
        */
        
    });
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
	    
	    $scope.getImageData=function(thisObj) {
	        var file = thisObj.files[0];
	        if(!file){
	            $('#errorModal').find('.modal-body').html("Please choose an image file.");
	            $('#errorModal').modal('show');
	            $(thisObj).val("");
	            return;
	        }
	        console.log("file",file);
	        
	        var uploadCSV = new FormData();
	        uploadCSV.append("imageFile", file);
	        console.log("uploadCSV : ",uploadCSV);
	        
	      //server
//	        var dataPath=req.files["imageFile"].path;
	    }
	    
	    $scope.isInvalid = function(field){
//	        console.log("isInvalid ",$scope.myForm[field].$invalid," ", $scope.myForm[field]," ",$scope.myForm[field].$dirty," ",$scope.myForm[field].$viewValue);
	    	console.log("isInvalid : ", ($scope.myForm[field].$viewValue==''), 'dirty :', $scope.myForm[field].$dirty, 'form : ', $scope.myForm[field]);
//	        return $scope.myForm[field].$invalid && $scope.myForm[field].$dirty;
	      };
	      
	      $scope.isValid = function(field){
//	    	  console.log("isvalid ",$scope.myForm[field].$invalid," ", $scope.myForm[field]," ",$scope.myForm[field].$dirty);
	    	  return $scope.myForm[field].$valid && $scope.myForm[field].$dirty;
	      };

	      $scope.$watch('myForm', function(){
	        console.log('$scope.myForm', $scope.myForm);
	      });
    
});

