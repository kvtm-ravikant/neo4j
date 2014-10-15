/**
 * Created by ravikant on 20/6/14.
 */
educationMediaApp.controller('userProfileChanges', function ($scope, $http,iconClassMapping,appUtils) {
	
	$scope.settingsData={
            "passwordData":{
                "oldPassword":"",
                "newPassword":"",
                "rePassword":""
              }}
	
	$scope.isPasswordMatched=-1;
	$scope.isNewPasswordEntered=-1;
	$scope.rePasswordEntered=-1;
	$scope.isSaveApproved=1;
	getUserProfileData();
	    function getUserProfileData(){
	        $http.get('/manage-users/getUserprofileForUserName').success(function(dataResponse,status,headers,config){
	            //success
	            appUtils.defaultParseResponse(dataResponse,function(dataResponse){
	                $scope.userDetails=dataResponse.responseData;
	            });
	            $scope.loggedInUser=$scope.userDetails.displayObject.basicDetails[1];
	            $scope.user=$scope.userDetails.displayObject;
//	            console.log("getUserProfileData : /manage-users/getUserprofileForUserName",dataResponse, "username : ", $scope.loggedInUser.userName);

	        }).error(function(data,status,headers,config){
	            //error
	            console.log("Error",data,status,headers,config);
	        });
	    }
	
    
    $scope.checkExistingPassowrd=function(){
    	console.log("checkExistingPassowrd ",$scope.settingsData.passwordData.oldPassword);
    	
        $http({
            method : 'POST',
            url    : '/manage-users/matchExistingPassword/',
            data   : {user:$scope.loggedInUser,data:$scope.settingsData},
            headers: {'Content-Type': 'application/json'}
        }).success(function(dataResponse,status,headers,config){
            //success
            appUtils.defaultParseResponse(dataResponse,function(dataResponse){
            	  $scope.isPasswordMatched=dataResponse.responseData;
            	  if(dataResponse.responseData>0){
            		  $scope.isNewPasswordEntered=1;  
            	  }
            	  console.log("checkExistingPassowrd: dataResponse : ",dataResponse);
            });
        }).error(function(data,status,headers,config){
            //error
            console.log("Error",data,status,headers,config);
        });
    }
    
    $scope.verifyNewPassword=function(){
    	console.log("verifyNewPassword");
    	if($scope.settingsData.passwordData.newPassword.length==0)
    		$scope.isNewPasswordEntered=0;
    	else if($scope.settingsData.passwordData.newPassword.length<5)
    		$scope.isNewPasswordEntered=5;
    	else if($scope.settingsData.passwordData.newPassword==$scope.settingsData.passwordData.oldPassword)
    		$scope.isNewPasswordEntered=4;
    	else if($scope.isPasswordMatched==0){
    		$scope.rePasswordEntered=-1;
    	}
    	else{
    		$scope.isNewPasswordEntered=-1;
        	$scope.rePasswordEntered=1;
    	}
//    	console.log("verifyNewPassword ",$scope.settingsData.passwordData.newPassword.length);
    }
    
    $scope.reVerifyNewPassword=function(){
    	console.log("reVerifyNewPassword : ",$scope.settingsData.passwordData.newPassword," " +
    			" ",$scope.settingsData.passwordData.rePassword," " +
    					"",($scope.settingsData.passwordData.newPassword==$scope.settingsData.passwordData.rePassword));
    }
   
    /*
     * save the changes done for settings
     */
    $scope.saveSettings=function(){
    	console.log("saveSettings ", $scope.settingsData);
    	if(($scope.settingsData.passwordData.newPassword==$scope.settingsData.passwordData.rePassword) && ($scope.settingsData.passwordData.newPassword.length>=5)){
    		$http({
                method : 'POST',
                url    : '/manage-users/saveUserSettings/',
                data   : {user:$scope.loggedInUser,data:$scope.settingsData},
                headers: {'Content-Type': 'application/json'}
            }).success(function(dataResponse,status,headers,config){
                //success
                appUtils.defaultParseResponse(dataResponse,function(dataResponse){
                	  console.log("checkExistingPassowrd: dataResponse : ",dataResponse);
                	  appUtils.showSuccess("Password for "+$scope.loggedInUser.userName+" updated successfully. Please re-login to continue.");
                	  $scope.isPasswordMatched=-1;
                	  $scope.isNewPasswordEntered=-1;
                	  $scope.rePasswordEntered=-1;
                	  $scope.isSaveApproved=1;
                	  $scope.settingsData={
                	            "passwordData":{
                	                "oldPassword":"",
                	                "newPassword":"",
                	                "rePassword":""
                	              }}
                });
            }).error(function(data,status,headers,config){
                //error
                console.log("Error",data,status,headers,config);
            });
    	}
    	else
    		appUtils.showSuccess("Entered password is incorrect. Please re-try again.")
    }
   
    
});
