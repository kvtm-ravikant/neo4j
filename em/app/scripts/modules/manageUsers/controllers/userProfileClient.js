/**
 * Created by ravikant on 20/6/14.
 */
educationMediaApp.controller('user_profile', function ($scope, $http,iconClassMapping,appUtils) {
    $http.get('/manage-users/getUserprofileForUserName').success(function(dataResponse,status,headers,config){
        //success
        appUtils.defaultParseResponse(dataResponse,function(dataResponse){
            $scope.userDetails=dataResponse.responseData;
        });

        console.log("success /manage-users/getUserprofileForUserName",dataResponse);
    }).error(function(data,status,headers,config){
        //error
        console.log("Error",data,status,headers,config);
    });
    $scope.fullName=function(user){
        if($scope.userDetails){
            var user=$scope.userDetails.basicDetails;
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


});
