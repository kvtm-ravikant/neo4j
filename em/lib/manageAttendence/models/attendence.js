/**
 * Created by vaibhav on 5/23/2014.
 */

var attendenceValMap={
    "1":"Present",
    "0":"Absent",
    "2":"Leave",
    "3":"Holiday"
};

var neo4j=require("node-neo4j");
var Utils=require("../../common/Utils/Utils.js");
var db=new neo4j("http://localhost:7474");


module.exports.saveAttendance=function(req,res,saveObj){
    console.log("Inside saveAttendance");
    var responseObj=new Utils.ResponseObj();
    var timetableId=saveObj.selectedData._id;
    if(saveObj.selectedData.attFlag){
        var successList=[];
        var failedList=[];
        for(var i= 0,loopLen=saveObj.attendanceData.length;i<loopLen;i++){
            var student=saveObj.attendanceData[i];
            (function(count,stud){
                var relationType="ATTENDANCE_OF";
                var relationObj={
                    "timestamp":saveObj.timestamp,
                    "attendance":stud.attendance,
                    "comment":stud.comment
                };
                console.log("before Insert relation",i,"---",timetableId,stud.id,relationType,relationObj);
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
                })

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
        responseObj.data={"successList":successList,"failedList":failedList};
        res.json(responseObj);
    }else{
        responseObj.error=true;
        responseObj.msg="Attendance for this period is not applicable.";
        res.json(responseObj);
    }
}
module.exports.searchAttendance=function(req,res,searchObj){
    var classId=searchObj.class._id;
    var timestamp=searchObj.timestamp;
    var timetableId=searchObj.timetable._id;
    var searchQuery='START class=node('+classId+'),timetable=node('+timetableId+') ' +
                    'MATCH class-[r1:STUDENT_OF]->student ' +
                    'WITH class, r1, student ' +
                    'ORDER BY student.regID ' +
                    'MATCH timetable-[r2:ATTENDANCE_OF{timestamp:'+timestamp+'}]->student ' +
                    'RETURN  student, r2;';
    console.log("searchQuery",searchQuery);
    db.cypherQuery(searchQuery,function(err,searchResult){
        //console.log(err,searchResult);
        var responseObj=new Utils.ResponseObj();
        if(searchResult && searchResult.data.length>0){

            var studentList=[];
            var present= 0,absent= 0,leave=0;
            for(var i= 0,loopLen=searchResult.data.length;i<loopLen;i++){
                var student=searchResult.data[i][0];
                var relation=searchResult.data[i][1];
                console.log("data",student,relation);
                if(relation.attendance==1){present++};
                if(relation.attendance==0){absent++};
                if(relation.attendance==2){leave++};


                var obj= {
                    "id":student._id,
                    "name":student.firstName+" "+student.middleName+" "+student.lastName,
                    "rollNo":student.regID,
                    "attendance":relation.attendance, //0-absent,1-present,2-leave
                    "comment":relation.comment
                }
                studentList.push(obj);
            }
            var retObj={};
            retObj.attendanceAll={ present : present,absent :absent,leave : leave};
            retObj.studentList=studentList;
            responseObj.data=retObj;
            res.json(responseObj);
        }else{
            var studentQuery='START class=node('+classId+') MATCH class-[r:`STUDENT_OF`]->(b:User{userType:"student"}) RETURN b ORDER BY b.regID ';
            db.cypherQuery(studentQuery,function(err,result){
                if(result && result.data.length>0){
                    var studentList=[];
                    for(var i= 0,loopLen=result.data.length;i<loopLen;i++){
                        var data=result.data[i];
                        var obj= {
                            "id":data._id,
                            "name":data.firstName+" "+data.middleName+" "+data.lastName,
                            "rollNo":data.regID,
                            "attendance":1, //0-absent,1-present,2-leave
                            "comment":""
                        }
                        studentList.push(obj);
                    }
                    var retObj={};
                    retObj.attendanceAll={ present : loopLen,absent :0,leave : 0};
                    retObj.studentList=studentList;
                    responseObj.data=retObj;
                    res.json(responseObj);
                }else{
                    responseObj.error=true;
                    responseObj.msg="No Results found."
                    res.json(responseObj);
                }
            });
        }

    });
};


module.exports.getStudentsData=function (req,res){

}