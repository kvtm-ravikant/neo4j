'use strict';
/**
 * Created by ravikant on 20/6/14.
 */
educationMediaApp.controller('manageUser_updateUser', function ($scope, $http,iconClassMapping,appUtils) {

    $scope.isSearchBoxOpened=false;
    $scope.openSearchBox=function(){
        $scope.isSearchBoxOpened=!$scope.isSearchBoxOpened;
    }
    $('.datepicker').datepicker(
        {format: 'dd/mm/yyyy',
            language: 'en',
            autoclose: true,
            weekStart: 0,
            todayHighlight:true
        });

    $scope.openUserDOB=function(){
//        console.log("date picker");
        $('#userDOB').focus();
    };
    $http.get('/manage-attendence/create-attendence/getClassList').success(function(dataResponse,status,headers,config){
        //success
        console.log("dataResponse getClassList",dataResponse);
        appUtils.defaultParseResponse(dataResponse,function(dataResponse){
            $scope.classList=dataResponse.responseData;
        });

    }).error(function(data,status,headers,config){
            //error
            console.log("Error",data,status,headers,config);
        });
    /* UserClass POJO Data Model */
	$http.get('/manage-users/userClassData').success(
			function(dataResponse, status, headers, config) {
				// success
				console.log("/manage-users/userClassData", dataResponse);
				appUtils.defaultParseResponse(dataResponse,
						function(dataResponse) {
							$scope.userClass = dataResponse;   //User Class userClass.basicDetails.userName //way to access property
							console.log("$scope.userClass",	$scope.userClass);
						});

			}).error(function(data, status, headers, config) {
		//error
		console.log("Error", data, status, headers, config);
	});
    
	/*
	 * Get All User Summary
	 */
    $http.get('/manage-users/getAllUser').success(function(dataResponse,status,headers,config){
        //success
        console.log("dataResponse /manage-users/getAllUser",dataResponse);
        appUtils.defaultParseResponse(dataResponse,function(dataResponse){
        	$scope.allUserClass=dataResponse.responseData;
        });

    }).error(function(data,status,headers,config){
            //error
            console.log("Error",data,status,headers,config);
    });
  
    $scope.currentUserDetails=null;
    
    $scope.parentConfig={
    		/*"userName":"User Name",*/
            "DOB":"Date of Birth",
            "firstName":"First Name",
            "lastName":" Last Name",
            "regID":"Reg ID"
            
        }
    $scope.searchUserModel={
          "searchText":""
        }
    
    /*
     * Clear function for search clear text
     */
    $scope.clearSearch = function () {
        $scope.searchUserModel.searchText = "";
    };
    
    /*
     * Search User function
     */
    $scope.searchUser=function(){
    	console.log("$scope.searchUser",$scope.searchUserModel );
        $http({
            method : 'POST',
            url    : '/manage-users/searchUser/',
            data   : $scope.searchUserModel,
            headers: {'Content-Type': 'application/json'}
        }).success(function(dataResponse,status,headers,config){
            //success
            appUtils.defaultParseResponse(dataResponse,function(dataResponse){
                console.log("searchUser dataResponse",dataResponse);
                $scope.allUserClass=dataResponse.responseData;
            });

        }).error(function(data,status,headers,config){
            //error
            console.log("Error",data,status,headers,config);
        });
        $scope.isSearchBoxOpened=false;
    }
    $scope.resetSearchUser=function(){
        $scope.searchUserModel={
            "searchText":""
        }
    }
    /*
     * Get user details for selected user
     */
    $scope.getUserDetails=function(user,code){
      console.log("getUserDetails : ",user.userName)
      $scope.currentUserDetails='1';
        var userText = {userText: user.userName};
        var primaryKey=userText.__primaryColumn__||"userName";
        var value=user.userName;
    	
        console.log("$scope.getUserDetails",user );
        $http({
            method : 'POST',
            url    : '/manage-users/SelectedUserDetails/',
            data   : user,
            headers: {'Content-Type': 'application/json'}
        }).success(function(dataResponse,status,headers,config){
            //success
            appUtils.defaultParseResponse(dataResponse,function(dataResponse){
//            	  $scope.userSelectedClass =  dataResponse.responseData.data[0];
            	  $scope.userSelectedClass=dataResponse.responseData;
            	  $scope.userSelectedClone=dataResponse.responseData;
            	  console.log("dataResponse /manage-users/getSelectedUserDetails/ :",user.userName," dataResponse : ",dataResponse);
                  $scope.openModal(code);
             
            });
        }).error(function(data,status,headers,config){
            //error
            console.log("Error",data,status,headers,config);
        });
    }
    
    /*
     * Create User Validation
     */
    $scope.signupForm = function() {
        if($scope.modalCode && $scope.modalCode=='delete'){
            $scope.addUpdateUser();
            return;
        };
    	var messageQue=[];
    	  var errorObj={error:false,errorMsg:[]};
    	  
    	console.log("basicDetailsForm " ,$scope.basicDetailsForm,"$scope.basicDetailsForm.$valid :",$scope.userSelectedClass," message : ",messageQue );

    	if($scope.userSelectedClass.basicDetails.regID && $scope.userSelectedClass.basicDetails.regID.length<3 ){
    		errorObj.error=true
            errorObj.errorMsg.push("Enter Registration Id provided to you.");
         }
    	if($scope.userSelectedClass.basicDetails.firstName && $scope.userSelectedClass.basicDetails.firstName.length<3 ){
    		errorObj.error=true
            errorObj.errorMsg.push("You don't have First Name ? Enter your first Name.");
		}
    	if($scope.userSelectedClass.basicDetails.lastName && ($scope.userSelectedClass.basicDetails.lastName && $scope.userSelectedClass.basicDetails.lastName.length<3)){
    		errorObj.error=true
            errorObj.errorMsg.push("What about Last name. It's needed.");
		}
    	if($scope.userSelectedClass.basicDetails.sex && $scope.userSelectedClass.basicDetails.sex.length<1){
    		errorObj.error=true
            errorObj.errorMsg.push("Choose your gender.");
		}
		if(angular.isUndefined($scope.userSelectedClass.basicDetails.DOB && $scope.userSelectedClass.basicDetails.DOB.length<6 )){
    		errorObj.error=true
            errorObj.errorMsg.push("What is your birthday ?");
		}
        if(!(($scope.userSelectedClass.contact.phonePrimary && $scope.userSelectedClass.contact.phonePrimary.length>=10) ||
            ($scope.userSelectedClass.contact.emailPrimary) ||
            (($scope.userSelectedClass.primaryAddress.street1.length<5 || angular.isUndefined($scope.userSelectedClass.primaryAddress.street1))
                && ($scope.userSelectedClass.primaryAddress.country.length<1 || angular.isUndefined($scope.userSelectedClass.primaryAddress.country))
                && ($scope.userSelectedClass.primaryAddress.state.length<2 || angular.isUndefined($scope.userSelectedClass.primaryAddress.state))
                && ($scope.userSelectedClass.primaryAddress.pincode.length!=6 || angular.isUndefined($scope.userSelectedClass.primaryAddress.pincode))
                && ($scope.userSelectedClass.primaryAddress.city.length<3 || angular.isUndefined($scope.userSelectedClass.primaryAddress.city))
                )
            )
          ){
            errorObj.error=true
            errorObj.errorMsg.push("Please enter Primary Phone Number or Primary Email Address OR Primary Complete residential address.");
        }

    	if(angular.isUndefined($scope.userSelectedClass.basicDetails.userType)){
    		errorObj.error=true
            errorObj.errorMsg.push("User Type is not valid.");
		}
    	if($scope.userSelectedClass.basicDetails.userName<3 || angular.isUndefined($scope.userSelectedClass.basicDetails.userName)){
    		errorObj.error=true
            errorObj.errorMsg.push("Create your user name.");
		}
    	
    	
    	var erroMsg=errorObj.errorMsg.join('<br>');
    	
    	if(erroMsg.length>0){
    		appUtils.showError(erroMsg);	
    	}
        
    	if(erroMsg.length==0 && ($scope.modalCode=='add'||$scope.modalCode=='update')){
    		$scope.addUpdateUser();
    	}
    	
        console.log(erroMsg.length);
//    	if ($scope.basicDetailsForm.$dirty) {
//    		    	console.log("basicDetailsForm",$scope.basicDetailsForm);
//	    } else {
//	      $scope.basicDetailsForm.submitted = true;
//	    }
	  }
    
    $scope.alertText="";
    $scope.addUpdateUser=function()
    {
    	$scope.submitted = false;
    	 
    	console.log("$scope.modalTitle : User", $scope.modalTitle, $scope.modalCode);
    	if($scope.modalCode && $scope.modalCode =='add'){
//    		$scope.registerNewUser();
    	}
    	else if($scope.modalCode && $scope.modalCode=='update'){
    		$('#retryModel').modal({"backdrop": "static","show":true});
    		 $scope.alertText="User details has been changed. Do you want to proceed ?";
    	}
    	else if($scope.modalCode && $scope.modalCode=='delete'){
    		$('#retryModel').modal({"backdrop": "static","show":true});
    		$scope.alertText="You are about to delete a User. Please confirm.";
    	}
    }
 
    $scope.ok=function(){
//   	console.log("retry model");
	   if($scope.modalCode && $scope.modalCode=='update'){
		   $scope.updateUserClass();   
	   }
	   else if($scope.modalCode && $scope.modalCode=='delete'){
   			$scope.deleteUserClass();
	   }
   		$('#retryModel').modal('hide');
    }

   $scope.cancel=function(){
//  	console.log("retry model");
  		$('#retryModel').modal('hide');
   }
   
    $scope.resetUserClass=function(){
    	$scope.userSelectedClass=angular.copy($scope.userSelectedClone);
//    	$scope.userForm.$setPristine();
    	$scope.basicDetailsForm.$setPristine();
    	console.log("reset changes", $scope.isUserChanged(), " $scope.basicDetailsForm.$setPristine() ", $scope.basicDetailsForm.$setPristine());
    };
    
    $scope.isUserChanged=function ()
    {
//    	console.log(angular.equals($scope.userSelectedClass, $scope.userSelectedClone));
    	return angular.equals($scope.userSelectedClass, $scope.userSelectedClone);
    };
 
    /*
     * Back button functionality
     */
    $scope.getBackToMainUsersList=function(){
        $scope.currentUserDetails=!$scope.currentUserDetails;
    }
 
   /*
    * Update User function call to update User
    */
    $scope.updateUserClass=function()
    {
    	//console.log("$scope.updateUserClass :",$scope.userSelectedClass, angular.equals($scope.userSelectedClass.userDetails,$scope.userSelectedClone.userDetails));
		var selectedUser = $scope.userSelectedClass.basicDetails.userName;
		$http({
			method : 'POST',
			url : '/manage-users/users/updateUser',
			data : $scope.userSelectedClass,
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function(dataResponse, status, headers,config) {
            // success
            appUtils.defaultParseResponse(dataResponse,function(dataResponse) {
                console.log("updateUserClass - dataResponse",dataResponse)
                
                $scope.userSelectedClass = dataResponse.responseData;
               
                appUtils.showSuccess("User "+selectedUser+" updated successfully");
                $('#modalUpdate').modal('hide');
            });
        }).error(function(data, status, headers, config) {
            // error
            console.log("Error", data, status,headers, config);
        });
    }
    
    /*
	 * Submit button Method for "Add new User"
	 */
	$scope.registerNewUser = function() {
		console.log("registerUser ", $scope.userSelectedClass);
		var addedUser = $scope.userSelectedClass.basicDetails.userName;

		$http({
			method : 'POST',
			url : '/manage-users/users/registerNewUser',
			data : $scope.userSelectedClass,
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function(dataResponse, status, headers,config) {
							// success
							appUtils.defaultParseResponse(dataResponse,function(dataResponse) {
							console.log("registerUser - dataResponse",dataResponse)
							$scope.userSelectedClass = dataResponse.responseData;
							appUtils.showSuccess("User "+addedUser+" created successfully");
							$('#modalUpdate').modal('hide');
											});
						}).error(function(data, status, headers, config) {
							// error
							console.log("Error", data, status,headers, config);
						});
		};
    
    /*
     * Delete User function call to update User
     */
     $scope.deleteUserClass=function()
     {
     	console.log("$scope.userSelectedClass :",$scope.userSelectedClass);
// 		console.log("deleteUser ", $scope.userClass);
 		$http({
 			method : 'POST',
 			url : '/manage-users/users/deleteUser',
 			data : $scope.userSelectedClass,
 			headers : {
 				'Content-Type' : 'application/json'
 			}
 		}).success(function(dataResponse, status, headers,config) {
 							// success
 							appUtils.defaultParseResponse(dataResponse,function(dataResponse) {
 												console.log("deleteUserClass - dataResponse",dataResponse)
 												$scope.userSelectedClass.basicDetails = dataResponse.responseData.data[0];
 												appUtils.showSuccess("User "+$scope.userSelectedClass.basicDetails.userName+" deleted successfully");
 												$('#modalUpdate').modal('hide');
                                                location.reload();
 											});

 						}).error(function(data, status, headers, config) {
 							// error
 							console.log("Error", data, status,headers, config);

 						});
     };
    
    $scope.openFileBrowser=function(){
        $('#imageUploader').click();
    }
    
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
     * Dropdown JSON data of userType
     */ 
     $http.get('/manageLibrary/getUserType').success(function(dataResponse,status,headers,config){
         //success
         console.log("getuserType",dataResponse);
         appUtils.defaultParseResponse(dataResponse,function(dataResponse){
             $scope.userType=dataResponse;
          console.log("$scope.getUserType",$scope.userType);
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
	 * Check availability of Registration ID 
	 */
	$scope.getregistrationIDAvailabity = function(){
		var regIdText = {regIdText: $scope.userSelectedClass.basicDetails.regID};
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
		 * Check availability of username 
		 */
		$scope.getUserNameAvailabity = function(){
			var userText = {userText: $scope.userSelectedClass.basicDetails.userName};
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
//					console.log("responce data : ",dataResponse.responseData.data.length);
													});
								}).error(function(data, status, headers, config) {
									// error
									console.log("Error", data, status,headers, config);
								});
			else
				appUtils.showError("Enter correct username");
			}

    //image upload functionality
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
            if (file.size>30000) {
                $(input).val("");
                appUtils.showError("Please choose file of size less than 30KB.");
                return;
            }
            try{
                var reader = new FileReader();
                reader.onload = function(e) {
                    $scope.userSelectedClass.basicDetails.profileImagePath=e.target.result;
                    console.log("$scope.userClass.basicDetails.profileImagePath",$scope.userSelectedClass.basicDetails.profileImagePath);
                    $scope.$apply();
                }
                reader.readAsDataURL(file);
            }catch(e){
                var uploadImg = new FormData();
                uploadImg.append("imageFile", file);
                $http.post("/application/readImage", uploadImg, {
                    withCredentials: true,
                    headers: {'Content-Type': undefined },
                    transformRequest: angular.identity
                }).success(function(dataResponse, status, headers,config) {
                    // success
                    appUtils.defaultParseResponse(dataResponse,function(dataResponse) {
                        console.log("registerUser - dataResponse",dataResponse)
                        $scope.userSelectedClass.basicDetails.profileImagePath = dataResponse.responseData;
                        $scope.$apply();
                    });
                }).error(function(data, status, headers, config) {
                    // error
                    console.log("Error", data, status,headers, config);
                });
            }
        }
    }
    
    
    $scope.openModal=function(code){
        $scope.modalTitle="";
        $scope.modalCode=code;
        $scope.buttonStyle='btn-primary';
        code && code=='add'?$scope.modalTitle="Add User":"";
        code && code=='update'?$scope.modalTitle="Update User":"";
        code && code=='delete'?$scope.modalTitle="Delete User":"";
        code && code=='view'?$scope.modalTitle="User Details":"";
        
        code && code=='delete'?$scope.buttonStyle="btn-danger":"btn-primary";

        $('#myTab li:first>a').click() //always open first tab
        $('#modalUpdate').modal({"backdrop": "static","show":true});
        $('#modalUpdate').modal({"show":false});
    }
    
    $scope.addUserOpenForm=function(){
        /* UserClass POJO Data Model */
//    	$scope.modalTitle="Add User";
        $http.get('/manage-users/userClassData').success(function(dataResponse, status, headers, config) {
            // success
            console.log("userClassData", dataResponse);
            appUtils.defaultParseResponse(dataResponse,function(dataResponse) {
                    $scope.userSelectedClass = dataResponse.responseData;   //User Class userClass.basicDetails.userName //way to access property
                    console.log("$scope.userClass",
                        $scope.userSelectedClass);
                    $scope.openModal("add");
            });
        }).error(function(data, status, headers, config) {
            //error
            console.log("Error", data, status, headers, config);
        });
    }
    
    $scope.batchAddUser=function(){
        $('#csvUploader').click();
    }
    $scope.uploadCsv = function(thisObj) {
        appUtils.uploadCSV(thisObj,"/manage-users/uploadUserCSV",function(response){
            console.log("/manage-users/uploadUserCSV response",response)
        });
    };
    $scope.lovMapToArr=appUtils.lovMapToArr;

});