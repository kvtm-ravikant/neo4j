/**
 * Created by Ravikant on 2/1/14.
 */
'use strict';

angular.module('educationMediaApp').controller('SideNavBarCtrl', function ($scope,$http, $location,iconClassMapping,appUtils) {
    $scope.iconClassMapping=iconClassMapping;
    $scope.toggleMenu=function(obj,value,$event){
       obj.collapse=!value;
    }
    $http.get('/getSidebarMenuList').success(function(dataResponse,status,headers,config){
        //success
        console.log("dataResponse",dataResponse);
        appUtils.defaultParseResponse(dataResponse,function(dataResponse){
            $scope.menu=dataResponse.responseData;
        });

    }).error(function(data,status,headers,config){
        //error
        console.log("Error",data,status,headers,config);
    });



});