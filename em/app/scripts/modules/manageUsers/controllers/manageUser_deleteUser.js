'use strict';
/**
 * Created by ravikant on 20/6/14.
 */
educationMediaApp.controller('manageUser_deleteUser', function ($scope, $http,iconClassMapping,appUtils) {

    $scope.text="Delete User";

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
 												appUtils.showError("User "+$scope.userSelectedClass.basicDetails.userName+" deleted successfully");
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
        
        $scope.currentUserDetails=!$scope.currentUserDetails;
        
    }
    
    
    
    
});