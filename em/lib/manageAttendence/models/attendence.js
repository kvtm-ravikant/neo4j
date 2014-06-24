/**
 * Created by vaibhav on 5/23/2014.
 */

var attendenceValMap={
    "1":"Present",
    "0":"Absent",
    "2":"on Leave",
    "3":"Holiday"
};
var requestOBJ = require('request');
var neo4j=require("node-neo4j");
var Utils=require("../../common/Utils/Utils.js");
var db=new neo4j("http://localhost:7474");
var subjectMap=require("../../common/models/Subject.js");

module.exports.getStudentsOfGivenClass=function(req,res,classObj){
    var responseObj=new Utils.Response();
    var query='MATCH (class{name:"'+classObj.name+'",section:"'+classObj.section+'"})-[:`STUDENT_OF`]->(student) RETURN student ORDER BY student.firstName';
    console.log("getStudentsOfGivenClass",query);
    db.cypherQuery(query,function(err,result){

        if(result && result.data.length>0){
            var studentList=[];
            for(var i= 0,loopLen=result.data.length;i<loopLen;i++){
                var student=result.data[i];
                var obj= {
                    "id":student.regID,
                    "name":student.firstName+" "+student.middleName+" "+student.lastName

                }
                studentList.push(obj);
            }
            responseObj.responseData=studentList;
            res.json(responseObj);
        }else{
            responseObj.error=true;
            responseObj.errorMsg="No Results found."
            res.json(responseObj);
        }
    });

};
module.exports.saveAttendance=function(req,res,saveObj){
    console.log("Inside saveAttendance");
    var responseObj=new Utils.Response();
    var timetableId=saveObj.selectedData._id;
    var classObj=saveObj.class;
    if(saveObj.selectedData.attFlag){
        var successList=[];
        var failedList=[];
        for(var i= 0,loopLen=saveObj.attendanceData.length;i<loopLen;i++){
            var student=saveObj.attendanceData[i];
            (function(count,stud){
                if(stud.isSMSEnabled){
                    var smsMsg="";
                    smsMsg+=stud.name+" is "+attendenceValMap[stud.attendance] +" for "+saveObj.selectedData.date+"|"+classObj.name+"/"+classObj.section+"|"+saveObj.selectedData.subjectName+"|"+saveObj.selectedData.startTime+"-"+saveObj.selectedData.endTime+"\n";
                    if(stud.comment)
                        smsMsg+="Note:"+stud.comment;

                    var contactNum=stud.contactNum;
                    console.log("smsMsg",smsMsg,contactNum);
                    if(contactNum){
                        var url='http://msg.ducistech.com/sendhttp.php?user=49917&password=4729105&mobiles='+contactNum+'&message='+smsMsg+'&sender=seerid';
                        requestOBJ(url,function(error, response, html){
                            if(!error){
                                console.log("Success in sending msg :",smsMsg,error);
                                //console.log('response',response);
                                //console.log('html',html);
                            }else{
                                console.log("error in sending msg :",smsMsg,error);
                            }

                        });
                    }
                }

                var relationType="ATTENDANCE_OF";
                var relationObj={
                    "timestamp":saveObj.timestamp,
                    "attendance":stud.attendance,
                    "comment":stud.comment,
                    "smsMsg":smsMsg
                };
                //console.log("before Insert relation",i,"---",timetableId,stud.id,relationType,relationObj);
                var selectRelation='START n=node('+timetableId+') MATCH (a:Timetable)-[rels:ATTENDANCE_OF]-(b:User)WHERE rels.timestamp='+relationObj.timestamp+' AND b.regID="'+stud.rollNo+'" RETURN rels';
                db.cypherQuery(selectRelation,function(err,relations){
                    console.log("selectRelation",err,relations);
                    if(relations && relations.data.length==1){
                        db.updateRelationship(relations.data[0]._id,relationObj,function(err,resultRel){
                            console.log("updateRelationship",err,resultRel);
                            if(!err && resultRel){
                                successList.push(stud);
                            }else{
                                failedList.push(stud);
                            }
                        });
                    }else if(relations && relations.data.length==0){
                        db.insertRelationship(timetableId,stud.id,relationType,relationObj,function(err,resultRel){
                            console.log("insertRelationship",err,resultRel);
                            if(!err && resultRel){
                                successList.push(stud);
                            }else{
                                failedList.push(stud);
                            }
                        });
                    }
                });

            })(i,student);
        }
        var t1=Number(new Date());
        while(true){
            var t2=Number(new Date());
            if((failedList.length+successList.length==loopLen)|| (t2-t1)>5000){
                break;
            }
        }
        if(failedList.length>0){
            responseObj.error=true;
        }
        responseObj.responseData={"successList":successList,"failedList":failedList};
        res.json(responseObj);
    }else{
        responseObj.error=true;
        responseObj.errorMsg="Attendance for this period is not applicable.";
        res.json(responseObj);
    }
}
module.exports.searchAttendance=function(req,res,searchObj){
    var classId=searchObj.class._id;
    var timestamp=searchObj.timestamp;
    var timetableId=searchObj.timetable._id;
    var searchQuery='START class=node('+classId+'),timetable=node('+timetableId+') ' +
                    'MATCH class-[r1:STUDENT_OF]-student ' +
                    'WITH class, r1, student ' +
                    'ORDER BY student.regID ' +
                    'MATCH timetable-[r2:ATTENDANCE_OF{timestamp:'+timestamp+'}]->student ' +
                    'WITH  student, r2 '+
                    'MATCH (parent)-[:`PRIMARY_GUARDIAN_OF`]-(student) WITH student,parent,r2 MATCH (parent)-[:CONTACT_OF]-(c:Contact) RETURN student,r2,c;';
    console.log("searchQuery",searchQuery);
    db.cypherQuery(searchQuery,function(err,searchResult){
        //console.log(err,searchResult);
        var responseObj=new Utils.Response();
        if(searchResult && searchResult.data.length>0){

            var studentList=[];
            var present= 0,absent= 0,leave=0;
            for(var i= 0,loopLen=searchResult.data.length;i<loopLen;i++){
                var student=searchResult.data[i][0];
                var relation=searchResult.data[i][1];
                var contact=searchResult.data[i][2];

                console.log("data",student,relation,contact);
                if(relation.attendance==1){present++};
                if(relation.attendance==0){absent++};
                if(relation.attendance==2){leave++};


                var obj= {
                    "id":student._id,
                    "name":student.firstName+" "+student.middleName+" "+student.lastName,
                    "rollNo":student.regID,
                    "attendance":relation.attendance, //0-absent,1-present,2-leave
                    "comment":relation.comment,
                    "contactNum":contact.phonePrimary
                }
                studentList.push(obj);
            }
            var retObj={};
            retObj.attendanceAll={ present : present,absent :absent,leave : leave};
            retObj.studentList=studentList;
            responseObj.responseData=retObj;
            res.json(responseObj);
        }else{
            var studentQuery='START class=node('+classId+') MATCH class-[r:`STUDENT_OF`]->(b:User{userType:"1"}) WITH b ORDER BY b.regID '+
                'MATCH (parent)-[:`PRIMARY_GUARDIAN_OF`]-(b) WITH b,parent MATCH (parent)-[r1:CONTACT_OF]-(c:Contact) RETURN b,c;';
            console.log("studentQuery",studentQuery);
            db.cypherQuery(studentQuery,function(err,result){

                if(result && result.data.length>0){
                    var studentList=[];
                    for(var i= 0,loopLen=result.data.length;i<loopLen;i++){
                        var student=result.data[i][0];
                        var contact=result.data[i][1];
                        var obj= {
                            "id":student._id,
                            "name":student.firstName+" "+student.middleName+" "+student.lastName,
                            "rollNo":student.regID,
                            "attendance":1, //0-absent,1-present,2-leave
                            "comment":"",
                            "contactNum":contact.phonePrimary
                        }
                        studentList.push(obj);
                    }
                    var retObj={};
                    retObj.attendanceAll={ present : loopLen,absent :0,leave : 0};
                    retObj.studentList=studentList;
                    responseObj.responseData=retObj;
                    res.json(responseObj);
                }else{
                    responseObj.error=true;
                    responseObj.errorMsg="No Results found."
                    res.json(responseObj);
                }
            });
        }

    });
};


module.exports.getStudentParentReport=function (req,res,requestObj){
  var responseObj=new Utils.Response();

  var startTimeStamp=Utils.ddmmyyyyStrToTimeStamp(requestObj.startDate);
  var endTimeStamp=Utils.ddmmyyyyStrToTimeStamp(requestObj.endDate);
  var userDetails=req.session.userDetails;
  console.log("userDetails.userType",userDetails,userDetails.basicDetails.userType);
  var userName=userDetails.basicDetails.userName;
  var query="";
  if(userDetails.basicDetails.userType==3){
      query='MATCH (parent{userName:"'+userName+'"})-[:`PRIMARY_GUARDIAN_OF`]-(student) WITH parent,student MATCH (timetable)-[r:`ATTENDANCE_OF`]->(student) WHERE r.timestamp>='+startTimeStamp+' AND r.timestamp<='+endTimeStamp+' RETURN timetable,r';
  }else if(userDetails.basicDetails.userType==1){
      query='MATCH (a)-[r:`ATTENDANCE_OF`]->(b{userName:"'+userName+'"}) WHERE r.timestamp>='+startTimeStamp+' AND r.timestamp<='+endTimeStamp+'  RETURN a,r';
  }
  console.log("query",query);
  if(query!=""){
      db.cypherQuery(query,function(err,result){
          console.log(err,result);
          if(result && result.data.length>0){
              var attendanceMap={};
              for(var i= 0,loopLen=result.data.length;i<loopLen;i++){
                  var timetable=result.data[i][0];
                  var relationAttendance=result.data[i][1];
                  var key=relationAttendance.attendance;
                  var obj= {
                      "teacherName":timetable.teacherName,
                      "subject":subjectMap[(timetable.subjectId).toString()],
                      "startTime":Utils.timestampToTime(timetable.startTime),
                      "endTime":Utils.timestampToTime(timetable.endtTime),
                      "comment":relationAttendance.comment,
                      "timestamp":relationAttendance.timestamp,
                  }
                  if(attendanceMap.hasOwnProperty(key)){
                      attendanceMap[key].push(obj);
                  }else{
                      attendanceMap[key]=[obj];
                  }

              }
              responseObj.responseData=attendanceMap;
              res.json(responseObj);
          }else{
              responseObj.error=true;
              responseObj.errorMsg="No Results found."
              res.json(responseObj);
          }
      });
  }else{
      responseObj.error=true;
      responseObj.errorMsg="User is not authorized to view this report."
      res.json(responseObj);
  }

}

module.exports.getTeacherReport=function (req,res,requestObj){
  var responseObj=new Utils.Response();

  var startTimeStamp=Utils.ddmmyyyyStrToTimeStamp(requestObj.startDate);
  var endTimeStamp=Utils.ddmmyyyyStrToTimeStamp(requestObj.endDate);
  var classObj=requestObj.class;
  var selectedSubject=requestObj.selectedSubject;
  var selectedStudent=requestObj.selectedStudent;
  var userDetails=req.session.userDetails;
  console.log("userDetails.userType",userDetails,userDetails.basicDetails.userType);
  var userName=userDetails.basicDetails.userName;
  var query="";
  if(userDetails.basicDetails.userType==2){
      query='MATCH (a:Class{name:"'+classObj.name+'",section:"'+classObj.section+'"})-[:`STUDENT_OF`]->';
      if(selectedStudent){
          query=query+'(b:User{regID:"'+selectedStudent.id+'"}) ';
      }else{
          query=query+'(b) ';
      }
      if(selectedSubject){
          query=query+'WITH b MATCH (c:Timetable{subjectId:"'+selectedSubject.key+'"})-[r:`ATTENDANCE_OF`]->(b) ';
      }else{
          query=query+'WITH b MATCH (c:Timetable)-[r:`ATTENDANCE_OF`]->(b) ';
      }
      query=query+'WHERE r.timestamp>='+startTimeStamp+' AND r.timestamp<='+endTimeStamp+' RETURN  c,r,b';
  }
  console.log("query",query);
  if(query!=""){
      db.cypherQuery(query,function(err,result){
          console.log(err,result);
          if(result && result.data.length>0){
              var attendanceMap={};
              for(var i= 0,loopLen=result.data.length;i<loopLen;i++){
                  var timetable=result.data[i][0];
                  var relationAttendance=result.data[i][1];
                  var student=result.data[i][2];
                  var key=relationAttendance.attendance;
                  var obj= {
                      "teacherName":timetable.teacherName,
                      "subject":subjectMap[(timetable.subjectId).toString()],
                      "startTime":Utils.timestampToTime(timetable.startTime),
                      "endTime":Utils.timestampToTime(timetable.endtTime),
                      "comment":relationAttendance.comment,
                      "timestamp":relationAttendance.timestamp,
                      "studentName":student.firstName+" "+student.middleName+" "+student.lastName,
                      "studentRegId":student.regID
                  }
                  if(attendanceMap.hasOwnProperty(key)){
                      attendanceMap[key].push(obj);
                  }else{
                      attendanceMap[key]=[obj];
                  }

              }
              responseObj.responseData=attendanceMap;
              res.json(responseObj);
          }else{
              responseObj.error=true;
              responseObj.errorMsg="No Results found."
              res.json(responseObj);
          }
      });
  }else{
      responseObj.error=true;
      responseObj.errorMsg="User is not authorized to view this report."
      res.json(responseObj);
  }

}