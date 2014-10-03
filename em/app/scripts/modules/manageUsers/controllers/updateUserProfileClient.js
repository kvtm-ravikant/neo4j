/**
 * Created by ravikant on 20/6/14.
 */
educationMediaApp.controller('update_user_profile', function ($scope, $http,iconClassMapping,appUtils) {
    $http.get('/manage-users/getUserprofileForUserName').success(function(dataResponse,status,headers,config){
        //success
        appUtils.defaultParseResponse(dataResponse,function(dataResponse){
            $scope.userDetails=dataResponse.responseData;
        });
        $scope.loggedInUser=$scope.userDetails.displayObject.basicDetails[1];
        $scope.getUserDetails($scope.loggedInUser);
        
        console.log("success /manage-users/getUserprofileForUserName",dataResponse, "username : ", $scope.userDetails.displayObject.basicDetails[1].userName);
        
    }).error(function(data,status,headers,config){
        //error
        console.log("Error",data,status,headers,config);
    });
    $scope.fullName=function(user){
        if($scope.userDetails){
            var user=$scope.userDetails.basicDetails;
            console.log("user :", user);
            var fullNameArr=[];
            user.salutation.length>0?fullNameArr.push(user.salutation):null;
            user.firstName.length>0?fullNameArr.push(user.firstName):null;
            user.middleName.length>0?fullNameArr.push(user.middleName):null;
            user.lastName.length>0?fullNameArr.push(user.lastName):null;
            return fullNameArr.join(" ");
        }else{
            return "";
        }

    }

    /*
     * Get user details for selected user
     */
    $scope.getUserDetails=function(user){
      console.log("getSelectedUserDetails : ",user.userName)
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
            	  $scope.userSelectedClass=dataResponse.responseData;
            	  $scope.userSelectedClone=appUtils.cloneJSObj(dataResponse.responseData);
            	  console.log("dataResponse /manage-users/getSelectedUserDetails/ :",user.userName," dataResponse : ",dataResponse);
             
            });
        }).error(function(data,status,headers,config){
            //error
            console.log("Error",data,status,headers,config);
        });
    }
    
    
});
