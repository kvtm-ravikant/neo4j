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

    $http.get('/manage-attendence/create-attendence/getSubjectList').success(function(dataResponse,status,headers,config){
        //success
        console.log("dataResponse subjectMap",dataResponse);
        appUtils.defaultParseResponse(dataResponse,function(dataResponse){
            $scope.subjectMap=dataResponse.responseData;
            if(Object.keys($scope.subjectMap).length>1){
                $scope.subjectMap["-1"]="All";
            }

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
        $http({
            method : 'POST',
            url    : '/manageAttendance/getStudentsOfGivenClass',
            data   : $scope.selectedClass,
            headers: {'Content-Type': 'application/json'}
        }).success(function(dataResponse,status,headers,config){
            //success
            appUtils.defaultParseResponse(dataResponse,function(dataResponse){
                console.log("dataResponse",dataResponse);
                $scope.studentList=dataResponse.responseData;
                $scope.studentList.insert(0,{"id":"-1","name":"All"});
            });
        }).error(function(data,status,headers,config){
            //error
            console.log("Error",data,status,headers,config);
        });

    }
    $scope.selectSubject=function(key,value){
        $scope.selectedsubject={"key":key,"value":value};
    }
    $scope.selectStudent=function(student){
        $scope.selectedStudent=student;
    }
    $scope.getReport=function(){
        var errorobj=validateReortSubmission();
        if(!errorobj.error){
            var requestObj={"startDate":$scope.startDate,"endDate":$scope.endDate,"class":$scope.selectedClass,
                            "selectedSubject":$scope.selectedsubject,"selectedStudent":$scope.selectedStudent};
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
        if(!$scope.selectedClass){
            errorObj.error=true
            errorObj.errorMsg.push("Please select class.");
        }
        /*if($scope.startDate && $scope.endDate){
            var startTimeStamp=appUtils.dateUtility.ddmmyyyyStrToDate($scope.startDate);
            var endTimeStamp=appUtils.dateUtility.ddmmyyyyStrToDate($scope.endDate);
            console.log(startTimeStamp,endTimeStamp,$scope.startDate,$scope.endDate);
            if(startTimeStamp && startTimeStamp && typeof(startTimeStamp)=='number' && typeof(endTimeStamp)=='number' && startTimeStamp<=endTimeStamp){

            }else{
                errorObj.error=true
                errorObj.errorMsg.push("Start date should be less than end date.");
            }

        }*/
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
