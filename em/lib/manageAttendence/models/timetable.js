/**
 * Created by vaibhav on 5/23/2014.
 */


var weeks=[{"dayID":1,"day":"Monday"},{"dayID":2,"day":"Tuesday"},{"dayID":3,"day":"Wednesday"},{"dayID":4,"day":"Thursday"},{"dayID":5,"day":"Friday"},{"dayID":6,"day":"Saturday"}];


var subjectMap=require("../../common/models/Subject.js");
var Utils=require("../../common/Utils/Utils.js");
var neo4j=require("node-neo4j");
var db=new neo4j("http://localhost:7474");
var timeTableData=[];
module.exports.getTimeTable=function(req,res,classId){
    var selectTimetableQuery='START n=node('+classId+') MATCH (n)-[r:`TIMETABLE_OF`]->(b:Timetable) RETURN b ORDER BY b.dayID, b.startTime';
    db.cypherQuery(selectTimetableQuery,function(err,timetable){
        var timing=[];

        if(timetable && timetable.data.length>0){
            timeTableData=timetable.data;
            for(var i= 0,loopLen=timeTableData.length;i<loopLen;i++){
                var d=timeTableData[i];
                d['subjectName']=subjectMap[(timeTableData[i].subjectId).toString()];
                d.startTime=Utils.timestampToTime(d.startTime);
                d.endTime=Utils.timestampToTime(d.endTime);
                //console.log("d",d,(timeTableData[i].subjectId).toString());
                if(d['dayID']=="2"){
                    timing.push({"startTime":d.startTime,"endTime":d.endTime});
                }
                timeTableData[i]=d;
                console.log("--->", d.dayID, d.startTime);
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
}




