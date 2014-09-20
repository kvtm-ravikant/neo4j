/**
 * Created by ravikant on 12/7/14.
 */
educationMediaApp.controller('schoolAdmin_schoolProfile', function ($scope, $http,iconClassMapping,appUtils) {
  
	$scope.text="Scholl Profile";
	$scope.parentConfig={
	        "name":"School Name",
	        "desc":"School Description",
	        "schoolId":"School Id",
	        "schoolHeadId":"School Head Id"
	    }
	
	/* UserClass POJO Data Model */
//	$http.get('/schoolManagement/getSchoolClass').success(
//			function(dataResponse, status, headers, config) {
//				// success
//				console.log("/schoolManagement/getSchoolClass", dataResponse);
//				appUtils.defaultParseResponse(dataResponse,
//						function(dataResponse) {
//							$scope.schoolClass = dataResponse;   
//							console.log("$scope.schoolClass",	$scope.schoolClass);
//						});
//
//			}).error(function(data, status, headers, config) {
//		//error
//		console.log("Error", data, status, headers, config);
//	});
	
	/*
	 * Get All School Summary
	 */
    $http.get('/schoolManagement/getAllSchool').success(function(dataResponse,status,headers,config){
        //success
        console.log("dataResponse /schoolManagement/getAllSchool",dataResponse);
        appUtils.defaultParseResponse(dataResponse,function(dataResponse){
        	$scope.allSchool=dataResponse.responseData;
        });

    }).error(function(data,status,headers,config){
            //error
            console.log("Error",data,status,headers,config);
    });
	
	 /*
     *  School Modal Popup Function
     */
	$scope.openModal=function(code){
		console.log("openModal ", code);
		  $scope.modalTitle="School Title";
		  $scope.disableInput=true;
		  
	        $scope.modalCode=code;
	        $scope.buttonStyle='btn-primary';
	        code && code=='add'?$scope.modalTitle="Add School":"";
	        code && code=='update'?$scope.modalTitle="Update School":"";
	        code && code=='delete'?$scope.modalTitle="Delete School":"";
	        code && code=='view'?$scope.modalTitle="School Details":"";
	        
	        code && code=='delete'?$scope.buttonStyle="btn-danger":"btn-primary";
	        
	        if(code=='add'||code=='update'){
	        	$scope.disableInput=false;
	        }

	        $('#myTab li:first>a').click() //always open first tab
	        $('#schoolModel').modal({"backdrop": "static","show":true});
	        $('#schoolModel').modal({"show":false});
	}
	
	/*
	 * get Selected School Details
	 */
    $scope.getSelectedSchoolDetails=function(school,code){
    	
    	console.log("getSelectedSchoolDetails : ",school.schoolId)
        
    	$scope.currentUserDetails='1';
           var userText = {userText: school.schoolId};
           var primaryKey=userText.__primaryColumn__||"schoolId";
           var value=school.schoolId;
       	
//           console.log("$scope.getSelectedSchoolDetails",school );
           $http({
               method : 'POST',
               url    : '/schoolManagement/getSchoolDetails',
               data   : school,
               headers: {'Content-Type': 'application/json'}
           }).success(function(dataResponse,status,headers,config){
               //success
               appUtils.defaultParseResponse(dataResponse,function(dataResponse){
//               	  $scope.userSelectedClass =  dataResponse.responseData.data[0];
               	  $scope.selectedSchoolDetails=dataResponse.responseData.data[0];
               	  $scope.selectedSchoolDetailsClone=dataResponse.responseData.data[0];
               	  console.log("dataResponse /schoolManagement/getSchoolDetails :",school.schoolId," dataResponse : ",dataResponse);
                  $scope.openModal(code);
                
               });
           }).error(function(data,status,headers,config){
               //error
               console.log("Error",data,status,headers,config);
           });
    	
    	
    	
      
    }
});