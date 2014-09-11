'use strict';
/**
 * Created by ravikant on 20/6/14.
 */
educationMediaApp.controller('manageUser_updateUser', function ($scope, $http,iconClassMapping,appUtils) {

    $scope.text="manageUser_updateUser";
    $('.datepicker').datepicker(
        {format: 'dd/mm/yyyy',
            language: 'en',
            autoclose: true,
            weekStart: 0,
            todayHighlight:true
        });

    $scope.openUserDOB=function(){
        console.log("date picker");
        $('#userDOB').focus();
    };
	/* UserClass POJO Data Model */
	$http.get('/manage-users/userClassData').success(
			function(dataResponse, status, headers, config) {
				// success
//				console.log("userClassData", dataResponse);
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
//        console.log("dataResponse /manage-users/getAllUser",dataResponse);
        appUtils.defaultParseResponse(dataResponse,function(dataResponse){
        	$scope.allUserClass=dataResponse.responseData;
        });

    }).error(function(data,status,headers,config){
            //error
            console.log("Error",data,status,headers,config);
    });
  
    $scope.currentUserDetails=null;
    
    $scope.parentConfig={
    		"userName":"User Name",
            "DOB":"Date of Birth",
            "firstName":"First Name",
            "lastName":" Last Name",
            "regID":"Reg ID"
            
        }
    $scope.searchUserModel={
          "userName":""
        }
    
    /*
     * Clear function for search clear text
     */
    $scope.clearSearch = function () {
        $scope.searchUserModel.userName = "";
    };
    
    /*
     * Search User function
     */
    $scope.searchUser=function(){
    	
        console.log("$scope.searchUser",$scope.searchUserModel.userName );
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
    }
    
    /*
     * Get user details for selected user
     */
    $scope.getUserDetails=function(user){
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
            	  console.log("dataResponse /manage-users/getSelectedUserDetails/ :",user.userName);
             
                console.log("searchUser dataResponse",dataResponse);
//                $scope.allUserClass=dataResponse.responseData;
            });
        }).error(function(data,status,headers,config){
            //error
            console.log("Error",data,status,headers,config);

        });
    }
  
    /*
    * Update User function call to update User
    */
    $scope.updateUserClass=function()
    {
    	//console.log("$scope.updateUserClass :",$scope.userSelectedClass, angular.equals($scope.userSelectedClass.userDetails,$scope.userSelectedClone.userDetails));
		console.log("registerUser ", $scope.userSelectedClass);
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
                appUtils.showError("User "+$scope.userSelectedClass.basicDetails.userName+" updated successfully");
            });
        }).error(function(data, status, headers, config) {
            // error
            console.log("Error", data, status,headers, config);

        });
    }
    /*
     * Back button functionality
     */
    $scope.getBackToMainUsersList=function(){
        
        $scope.currentUserDetails=null;
        
    }
    $scope.openFileBrowser=function(){
        $('#imageUploader').click();
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
});