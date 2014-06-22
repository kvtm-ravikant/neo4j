/**
 * Created by ravikant on 22/6/14.
 */
'use strict';
educationMediaApp.controller('teacherReportCtrl', function ($scope, $http,iconClassMapping,appUtils) {
    $http.get('/manage-attendence/create-attendence/getClassList').success(function(dataResponse,status,headers,config){
        //success
        console.log("dataResponse",dataResponse);
        appUtils.defaultParseResponse(dataResponse,function(dataResponse){
            $scope.classList=dataResponse.responseData;
        });

    }).error(function(data,status,headers,config){
        //error
        console.log("Error",data,status,headers,config);
    });
    $('.datepicker').datepicker(
        {format: 'dd/mm/yyyy',
            language: 'en',
            autoclose: true,
            weekStart: 0,
            todayHighlight:true
        });
    $scope.openStartCalender=function(){
        $('#startDateTeacher').focus();
    }
    $scope.openEndCalender=function(){
        $('#endDateTeacher').focus();
    }
    $scope.selectClass=function(classObj){
        $scope.selectedClass=classObj;
    }
    $scope.getReport=function(){
        var requestObj={"startDate":$scope.startDate,"endDate":$scope.endDate,"class":$scope.selectedClass};
        if($scope.startDate && $scope.endDate && $scope.selectedClass){
            console.log("requestObj",requestObj);
            $http({
                method : 'POST',
                url    : '/manageAttendance/getTeacherReport',
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
