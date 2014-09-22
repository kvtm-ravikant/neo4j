/**
 * Created by Pinki Boora on 5/25/14.
 */
var fs=require('fs');
var Utils=require("../../common/Utils/Utils.js");
var neo4j=require("node-neo4j");
var db=new neo4j("http://localhost:7474");
var dataPath="../../data-files/QuestTimeTableCSC.csv";

var schoolIdVal="quest:coaching:2013:452001";
var selectquery='MATCH (a{schoolId:"quest:coaching:2013:452001"})-[:`USER_OF`]->(b{userType:"2"})  RETURN b';
var teacherMap={}
//update
/*

//delete nodes
var selectTimeTable='MATCH (a:Class)-[r:`TIMETABLE_OF`]->(b:Timetable) DELETE r,b ';
db.cypherQuery(selectTimeTable,function(err,timetable){
    console.log("deleted",err,timetable);
});
*/



var selectTimeTable='MATCH (a:Class)-[r:`TIMETABLE_OF`]->(b:Timetable) RETURN b ';
db.cypherQuery(selectquery,function(err,teacher){
    if(teacher && teacher.data.length>0){
        for(var l= 0,loopLenL=teacher.data.length;l<loopLenL;l++){
            var id=teacher.data[l].regID;
            if(!teacherMap.hasOwnProperty(id)){
                teacherMap[id]=teacher.data[l].firstName+" "+teacher.data[l].middleName+" "+teacher.data[l].lastName;
            }
        }
        console.log("teacherMap",teacherMap);
        fs.readFile(dataPath,function(err,csvData){
            var strData=csvData.toString();

            if(strData){
                var jsonData=Utils.csvToArray(strData);
                var columns=jsonData[0];
                for(var i= 1,loopLen=jsonData.length;i<loopLen;i++){
                    (function(cntr) {
                        // here the value of i was passed into as the argument cntr
                        // and will be captured in this function closure so each
                        // iteration of the loop can have it's own value
                        var timetable={};
                        timetable.dayID=parseInt(jsonData[i][columns.indexOf("dayID")],0);
                        timetable.startTime=Utils.convertToTimeStamp(jsonData[i][columns.indexOf("startTime")]);
                        timetable.endTime=Utils.convertToTimeStamp(jsonData[i][columns.indexOf("endTime")]);
                        timetable.teacherRegID=jsonData[i][columns.indexOf("teacherRegID")];
                        timetable.subjectId=jsonData[i][columns.indexOf("subjectId")];
                        if(jsonData[i][columns.indexOf("isBreak")]=="TRUE"){
                            timetable.isBreak=true;
                        }else{
                            timetable.isBreak=false;
                        }
                        if(jsonData[i][columns.indexOf("attFlag")]=="TRUE"){
                            timetable.attFlag=true;
                        }else{
                            timetable.attFlag=false;
                        }
                        if(teacherMap.hasOwnProperty(timetable.teacherRegID)){
                            timetable.teacherName=teacherMap[timetable.teacherRegID];
                        }else{
                            timetable.teacherName="N/A";
                        }
                        console.log("timetable",i,timetable);
                        var selectClassquery='MATCH (n:Class{name:"CSC2014",section:"Freshers"})  RETURN n';
                        db.cypherQuery(selectClassquery,function(err,classData){
                            console.log("classData",classData);
                            var classId=classData.data[0]._id;
                            db.insertNode(timetable,["Timetable"],function(err,timeTableRet){
                                var timeTableRetId=timeTableRet._id;

                                console.log("tieTableRetId",timeTableRetId,"classId",classId);
                                db.insertRelationship(classId,timeTableRetId,"TIMETABLE_OF",{"batch":"2014-15"},function(err,resultRel){
                                    console.log("insertRelationship",err,resultRel);
                                });
                            })
                        })
                    })(i);
                }

            }



        });
    }
})



/*
 var classData={"name":"VI","section":"C"};
 var classDataNode=db.insertNode(classData,["Class"],function(err,classData){
 console.log("classData",classData);
 var selectquery='MATCH (n:School{schoolId:"'+schoolIdVal+'"})  RETURN n';
 db.cypherQuery(selectquery, function(err, school){
 console.log("err",err);
 if(err) throw err;
 else if(school.data.length==1){
 var schoolNodeId=school.data[0]._id;
 var relationShip="CLASS_OF";
 var relationShipData={"batch":"2014-15"};
 console.log("Before insert relationship",schoolNodeId,classData._id);
 db.insertRelationship(schoolNodeId,classData._id,relationShip,relationShipData,function(err,result){
 console.log("insertRelationship",err,result);

 });
 }
 });
 });*/
