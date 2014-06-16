'use strict';

educationMediaApp.controller('manageAttendence_createAttendence', function ($scope, $http,iconClassMapping) {
    $scope.showTimeTable=true;

    var d = new Date();
    $('.datepicker').datepicker(
        {format: 'dd/mm/yyyy',
        language: 'en',
        autoclose: true,
        weekStart: 0,
        todayHighlight:true
    });
    $scope.openCalender=function(){
        $('#attendanceDate').focus();
    }
    $http.get('/manage-attendence/create-attendence/getClassList').success(function(dataResponse,status,headers,config){
        //success
        console.log("dataResponse",dataResponse);
        if(dataResponse.error){
            $('#errorModal').find('.modal-body').html("OOPs ! Somethings went wrong.");
            $('#errorModal').modal('show');
        }else{
            $scope.classList=dataResponse.data;
        }
    }).error(function(data,status,headers,config){
        //error
        console.log("Error",data,status,headers,config);
    });


    $scope.searchQuery={"class":null,"timestamp":null};
    $scope.selectClass=function(classObj){
        $scope.searchQuery.class=classObj
        $http.get('/manage-attendence/create-attendence/getTimetable/'+classObj._id).success(function(data,status,headers,config){
            //success
            $scope.timeTableData=data;

            console.log("success /manage-attendence/create-attendence/getTimetable",$scope.timeTableData);
        }).error(function(data,status,headers,config){
            //error
            console.log("Error",data,status,headers,config);
        });
    }
    $scope.$watch('date',function(){
        $scope.selectDate($scope.date,"08:00");
    });
    $scope.selectDate=function(dateStr,startTime){
        console.log("dateStr",dateStr);
        var arr=dateStr.split("/");
        var year=parseInt(arr[2],10);
        var month=parseInt(arr[1],10)-1;
        var day=parseInt(arr[0],10);
        var mmddyyyy=ddmmyyyTommddyyyy(dateStr,"/")+" 00:00:00";
        var date=new Date(mmddyyyy);
        var startTimeArr=startTime.split(":");
        var hrs=parseInt(startTimeArr[0],10);
        var mins=parseInt((startTimeArr[1],10));
        console.log("arr date ",arr);
        var date=new Date(Date.UTC(year, month, day, hrs, mins, 0));
        $scope.todayId = date.getDay();
        $scope.searchQuery.timestamp=Number(date);
        console.log("mmddyyyy timestamp ",year,month,day,$scope.searchQuery.timestamp);

        //$scope.searchQuery.timestamp=1401032221749;
    }
    $scope.searchAttendance=function(current){
        if(!$scope.searchQuery.class){
            $('#errorModal').find('.modal-body').html("Please select Class.");
            $('#errorModal').modal('show');
        }else if(!$scope.date){
            $('#errorModal').find('.modal-body').html("Please select Date.");
            $('#errorModal').modal('show');
        }else{
            console.log("$scope.date",$scope.date);
            $scope.selectDate($scope.date,current.sta rtTime);

            $scope.searchQuery.timetable=current;
            console.log('$scope.searchQuery',$scope.searchQuery);
            $http({
                method : 'POST',
                url    : '/attendance/searchAttendance',
                data   : $scope.searchQuery,
                headers: {'Content-Type': 'application/json'}
            }).success(function(dataResponse,status,headers,config){
                //success
                console.log("success",dataResponse);

                if(dataResponse.error){
                    $('#errorModal').find('.modal-body').html("OOPs ! Somethings went wrong.");
                    $('#errorModal').modal('show');
                }else{
                    $scope.showTimeTable=false;
                    $scope.selectedData= current;
                    $scope.students = dataResponse.data.studentList;
                    $scope.attendanceAll=dataResponse.data.attendanceAll;
                }
            }).error(function(data,status,headers,config){
                //error
                console.log("Error",data,status,headers,config);

            });

        }
    }
    $scope.todayId = d.getDay();
    $scope.today= d.getDate()+"/"+(d.getMonth()+1)+"/"+ d.getFullYear();
    $scope.date=$scope.today;
    console.log("**",$scope.todayId);

    $scope.iconClassMapping=iconClassMapping;
    console.log("manageAttendence_createAttendence");

    $scope.attendanceAll={ present : 0,absent :0,leave : 0};
    $scope.markPresent = function(student){
        console.log("inpresent",student);
        if(student.attendance==0 && $scope.attendanceAll.absent>0 ){
            $scope.attendanceAll.absent--;
        }else if(student.attendance==2 &&  $scope.attendanceAll.leave>0){
            $scope.attendanceAll.leave--;
        }
        student.attendance=1;
        $scope.attendanceAll.present++;

    };

    $scope.markAbsent = function(student){
        console.log("absent",student);
        if(student.attendance==1 && $scope.attendanceAll.present>0 ){
            $scope.attendanceAll.present--;
        }else if(student.attendance==2 &&  $scope.attendanceAll.leave>0){
            $scope.attendanceAll.leave--;
        }
        student.attendance=0;
        $scope.attendanceAll.absent++;

    };

    $scope.markLeave = function(student){
        console.log("leave",student);
        if(student.attendance==1 && $scope.attendanceAll.present>0 ){
            $scope.attendanceAll.present--;
        }else if(student.attendance==0 &&  $scope.attendanceAll.absent>0){
            $scope.attendanceAll.absent--;
        }
        student.attendance=2;
        $scope.attendanceAll.leave++;

    };





    $scope.markAllPresent=function(){
        for(var i= 0,loopLen=$scope.students.length;i<loopLen;i++){
            $scope.students[i].attendance=1;

        }
        $scope.attendanceAll={ present : loopLen,absent :0,leave : 0};
    }
    $scope.markAllAbsent=function(){
        for(var i= 0,loopLen=$scope.students.length;i<loopLen;i++){
            $scope.students[i].attendance=0;

        }
        $scope.attendanceAll={ present : 0,absent :loopLen,leave : 0};
    }
    $scope.markAllLeave=function(){
        for(var i= 0,loopLen=$scope.students.length;i<loopLen;i++){
            $scope.students[i].attendance=2;

        }
        $scope.attendanceAll={ present : 0,absent :0,leave : loopLen};
    }
    $scope.enableSMSForAll=function(){
        for(var i= 0,loopLen=$scope.students.length;i<loopLen;i++){
            $scope.students[i].isSMSEnabled=$scope.isSMSEnabledForAll;

        }
    }
    $scope.clearComment=function(model){
        console.log("comment",model);
        model.comment="";
        $scope.markPresent(model);

    }
    $scope.clearAllComment=function(){
        for(var i= 0,loopLen=$scope.students.length;i<loopLen;i++){
            $scope.students[i].comment="";
            $scope.students[i].attendance=1;
        }
        $scope.attendanceAll={ present : loopLen,absent :0,leave : 0};

    }
    $scope.saveAttendance=function(){
        $scope.selectedData.date=$scope.date;
        var saveObj={"selectedData":$scope.selectedData,"attendanceData":$scope.students,"class":$scope.searchQuery.class,"timestamp":$scope.searchQuery.timestamp};
        console.log("saveObj",saveObj);
        $http({
            method : 'POST',
            url    : '/attendance/saveAttendance',
            data   : saveObj,
            headers: {'Content-Type': 'application/json'}
        }).success(function(dataResponse,status,headers,config){
            //success
            console.log("success",dataResponse);
            if(dataResponse.error){
                alert("ERROR :(");
            }else{
                alert("Success :)");
            }
        }).error(function(data,status,headers,config){
            //error
            console.log("Error",data,status,headers,config);

        });
    }

    $scope.toggletable = function(){
        if($scope.showTimeTable) $scope.showTimeTable=false;
        else $scope.showTimeTable=true;
        $scope.attendanceAll={ present : 0,absent :0,leave : 0};
    }
});