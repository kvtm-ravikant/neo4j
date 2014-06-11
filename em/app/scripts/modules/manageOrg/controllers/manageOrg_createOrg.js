/**
 * Created by Ravikant on 2/3/14.
 */
'use strict';

educationMediaApp.controller('manageOrg_createOrg', function ($scope, $http,iconClassMapping) {
    $scope.iconClassMapping=iconClassMapping;
    console.log("manageOrg_createOrg");
    $http.get('/manage-org/create-org/getOrgConfig').success(function(data,status,headers,config){
        //success
        $scope.orgConfig=data;
        console.log("success /manage-org/create-org/getOrgConfig",$scope.orgConfig);
    }).error(function(data,status,headers,config){
        //error
        console.log("Error",data,status,headers,config);
    });

    $scope.setValue=function(obj,key,value){
        obj[key]=value;
        console.log("setValue",obj,key,value);
    }

    $scope.saveOrg=function(event){
        console.log("$scope.orgConfig",$scope.orgConfig);
        $http({
            method : 'POST',
            url    : '/manage-org/create-org/saveOrg',
            data   : $scope.orgConfig,
            headers: {'Content-Type': 'application/json'}
        }).success(function(data,status,headers,config){
            //success
            console.log("success /manage-org/create-org/saveOrg",data);

        }).error(function(data,status,headers,config){
            //error
            console.log("Error",data,status,headers,config);

        });
    }

});