/**
 * Created by vaibhav on 5/23/2014.
 */


var weeks=[{"dayID":1,"day":"Monday"},{"dayID":2,"day":"Tuesday"},{"dayID":3,"day":"Wednesday"},{"dayID":4,"day":"Thursday"},{"dayID":5,"day":"Friday"},{"dayID":6,"day":"Saturday"}];


var subjectMap=require("../../common/models/Subject.js");
var Utils=require("../../common/Utils/Utils.js");
var db=Utils.getDBInstance();
var timeTableData=[];
module.exports.getTimeTable=function(req,res,classId){
    var schoolId=req.session.userDetails.schoolDetails.schoolId;
    var newSubjectMap=subjectMap[schoolId];
    var selectTimetableQuery='START n=node('+classId+') MATCH (n)-[r:`TIMETABLE_OF`]->(b:Timetable) RETURN b ORDER BY b.dayID, b.startTime';
    db.cypherQuery(selectTimetableQuery,function(err,timetable){
        var timing=[];

        if(timetable && timetable.data.length>0){
            timeTableData=timetable.data;
            for(var i= 0,loopLen=timeTableData.length;i<loopLen;i++){
                var d=timeTableData[i];
                d['subjectName']=newSubjectMap[(timeTableData[i].subjectId).toString()];
                d.startTime=Utils.timestampToTime(d.startTime);
                d.endTime=Utils.timestampToTime(d.endTime);
                //console.log("d",d,(timeTableData[i].subjectId).toString());
                if(d['dayID']=="2"){
                    timing.push({"startTime":d.startTime,"endTime":d.endTime});
                }
                timeTableData[i]=d;
            }

        }
        var returnObj={
            "weeks":weeks,
            "timing":timing,
            "timeTable":timeTableData
        };
        console.log("returnObj",timing);
        res.json((returnObj));
    });
   /* var dateUTC=new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
    var IST = new Date(date); // Clone UTC Timestamp
    IST.setHours(dateUTC.getHours() + 5); // set Hours to 5 hours later
    IST.setMinutes(dateUTC.getMinutes() + 30);
    var getCountOfPresent='START class=node('+classId+') '+
                          'MATCH (class)-[r:`TIMETABLE_OF`]->(timeTable:Timetable{dayID:6,attFlag:true}) '+
                          'WITH timeTable '+
                          'MATCH (timeTable)-[attendance:`ATTENDANCE_OF`]->(student) '+
                          'RETURN count(*)';*/

}




