/**
 * Created by ravikant on 20/6/14.
 */
educationMediaApp.controller('user_profile', function ($scope, $http,iconClassMapping,appUtils) {
    getUserProfileData();
    function getUserProfileData(){
        $http.get('/manage-users/getUserprofileForUserName').success(function(dataResponse,status,headers,config){
            //success
            appUtils.defaultParseResponse(dataResponse,function(dataResponse){
                $scope.userDetails=dataResponse.responseData;
            });
            $scope.loggedInUser=$scope.userDetails.displayObject.basicDetails[1];
            $scope.user=$scope.userDetails.displayObject;
            $scope.getUserDetails($scope.loggedInUser);
            $scope.userSelectedClone=appUtils.cloneJSObj(dataResponse.responseData.hiddenObject.userFullData);
            $scope.userSelectedClass = dataResponse.responseData.hiddenObject.userFullData;   //User Class userClass.basicDetails.userName //way to access property
            console.log("$scope.userClass",$scope.userSelectedClass);
            console.log("success /manage-users/getUserprofileForUserName",dataResponse, "username : ", $scope.user);

        }).error(function(data,status,headers,config){
            //error
            console.log("Error",data,status,headers,config);
        });
    }
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

    $scope.openModal=function(code){
        $scope.modalTitle="";
        $scope.modalCode=code || $scope.modalCode;
        $scope.buttonStyle='btn-primary';
        code && code=='add'?$scope.modalTitle="Add User":"";
        code && code=='update'?$scope.modalTitle="Update User":"";
        code && code=='delete'?$scope.modalTitle="Delete User":"";
        code && code=='view'?$scope.modalTitle="User Details":"";
        code && code=='updProfile'?$scope.modalTitle="Update User":"";

        code && code=='delete'?$scope.buttonStyle="btn-danger":"btn-primary";

        $('#myTab li:first>a').click() //always open first tab
        $('#modalUpdate').modal({"backdrop": "static","show":true});
        $('#modalUpdate').modal({"show":false});
    }
    $scope.isUserPropfileMode=true;
    $scope.updateCurrentUserSession=function(){
        $http({
            method : 'POST',
            url    : '/manage-users/setUserInSession',
            data   : $scope.userSelectedClass,
            headers: {'Content-Type': 'application/json'}
        }).success(function(dataResponse,status,headers,config){
                getUserProfileData();
        }).error(function(data,status,headers,config){
            //error
            console.log("Error",data,status,headers,config);
        });

    }

    
});
