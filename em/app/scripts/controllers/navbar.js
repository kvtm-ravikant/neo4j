'use strict';

angular.module('educationMediaApp')
  .controller('NavbarCtrl', function ($scope, $location,$http,appUtils) {
    $http.get('/getSchoolInfo').success(function(dataResponse,status,headers,config){
        //success
        console.log("dataResponse getSchoolInfo",dataResponse);
        appUtils.defaultParseResponse(dataResponse,function(dataResponse){
            $scope.schoolDetails=dataResponse.responseData;
        });

    }).error(function(data,status,headers,config){
        //error
        console.log("Error",data,status,headers,config);
    });
    $scope.getOrgLogoPath=function(){
        if($scope.schoolDetails){
            var path="images/schoolLogo/"+$scope.schoolDetails.schoolId.replace(/:/g,"_")+".png";
            console.log("path",path);
            return path;
        }
    }
  });
