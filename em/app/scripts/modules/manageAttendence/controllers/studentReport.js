'use strict';
educationMediaApp.controller('studentReportCtrl', function ($scope, $http,iconClassMapping,appUtils) {
    $('.datepicker').datepicker(
        {format: 'dd/mm/yyyy',
            language: 'en',
            autoclose: true,
            weekStart: 0,
            todayHighlight:true
        });
    $scope.openStartCalender=function(){
        $('#startDateStudent').focus();
    };
    $scope.openEndCalender=function(){
        $('#endDateStudent').focus();
    };
    $scope.getReport=function(){
        var errorobj=validateReortSubmission();
        if(!errorobj.error){
            var requestObj={"startDate":$scope.startDate,"endDate":$scope.endDate};
            $http({
                method : 'POST',
                url    : '/manageAttendance/getStudentParentReport',
                data   : requestObj,
                headers: {'Content-Type': 'application/json'}
            }).success(function(dataResponse,status,headers,config){
                //success
                appUtils.defaultParseResponse(dataResponse,function(dataResponse){
                    console.log("dataResponse",dataResponse);
                    $scope.reportData=dataResponse.responseData;
                });
            }).error(function(data,status,headers,config){
                //error
                console.log("Error",data,status,headers,config);

            });
        }else{
            var erroMsg=errorobj.errorMsg.join('<br>');
            appUtils.showError(erroMsg);
        }

    }
    function validateReortSubmission(){
        var errorObj={error:false,errorMsg:[]};
        if(!$scope.startDate){
            errorObj.error=true
            errorObj.errorMsg.push("Start cannot be empty.");
        }
        if(!$scope.endDate){
            errorObj.error=true
            errorObj.errorMsg.push("End cannot be empty.");
        }
        if($scope.startDate && $scope.endDate && !appUtils.dateUtility.validateDateRange($scope.startDate , $scope.endDate)){
            errorObj.error=true
            errorObj.errorMsg.push("Start date should be less than end date.");
        }
        return errorObj;

    }
    $scope.resolveTimestamp=function(timestamp){
        var date=appUtils.dateUtility.convertDate("timestampToddmmyyyy","/",new Date(timestamp));
        return date;
    }
    var attendenceValMap={
        "1":"Present",
        "0":"Absent",
        "2":"on Leave",
        "3":"Holiday"
    };

    $scope.resolveAttendanceValue=function(code){
        return attendenceValMap[code];
    }
});
