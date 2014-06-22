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
    }
    $scope.openEndCalender=function(){
        $('#endDateStudent').focus();
    }
    $scope.getReport=function(){
        var requestObj={"startDate":$scope.startDate,"endDate":$scope.endDate};
        if($scope.startDate && $scope.endDate){
            console.log("requestObj",requestObj);
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
            alert('error');
        }

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
