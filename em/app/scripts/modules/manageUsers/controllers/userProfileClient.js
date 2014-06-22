/**
 * Created by ravikant on 20/6/14.
 */
educationMediaApp.controller('user_profile', function ($scope, $http,iconClassMapping) {
    $http.get('/manage-users/getUserprofileForUserName').success(function(dataResponse,status,headers,config){
        //success


        console.log("success /manage-users/getUserprofileForUserName",dataResponse);
    }).error(function(data,status,headers,config){
        //error
        console.log("Error",data,status,headers,config);
    });
});
