/**
 * Created by vaibhav on 5/23/2014.
 */

var attendence=require('../models/attendence.js');
var timetable =require('../models/timetable.js');
var classList =require('../../common/models/Class.js');


module.exports=function(app,Utils){
    app.get("/manage-attendence/create-attendence/getClassList",Utils.ensureAuthenticated,function(req,res){
        console.log("/manage-attendence/create-attendence/getClassList");
        classList.getClassList(req,res);
    });

    app.get("/manage-attendence/create-attendence/getTimetable/:classId",Utils.ensureAuthenticated,function(req,res){
        var classId=req.params.classId;
        console.log("Inside /manage-attendence/create-attendence/getTimetable",classId);
        timetable.getTimeTable(req,res,classId);

    });


    app.post("/attendance/saveAttendance",Utils.ensureAuthenticated,function(req,res){
       var saveObj=req.body;
        attendence.saveAttendance(req,res,saveObj);
    });

    app.post("/attendance/searchAttendance",Utils.ensureAuthenticated,function(req,res){
       var searchQueryObj=req.body;
        attendence.searchAttendance(req,res,searchQueryObj);
    });

};
