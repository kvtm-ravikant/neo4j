var Utils=require("../../common/Utils/Utils.js");
var schoolMS=require('../models/School.js');
var schoolClass = require('../models/schoolClass.js');
var neo4j = require("node-neo4j");
var db = new neo4j("http://localhost:7474");
console.log("db", db);

module.exports = function(app) {
	
	 /* schoolClass POJO Data Model */
//    app.get("/schoolManagement/getSchoolClass",Utils.ensureAuthenticated,function(req,res){
//        var school=new schoolClass();
//        var responseObj = new Utils.Response();
//        responseObj.responseData=school;
//        res.json(responseObj);
//    });
	
	 /* Get all School from school */
    app.get("/schoolManagement/getAllSchool",Utils.ensureAuthenticated,function(req,res){
    	console.log("/schoolManagement/getAllSchool");
    	 var loggedInUser=req.session.userDetails;
    	 schoolMS.getAllSchools(loggedInUser,res);
    });
    /*get selected School */
    app.post("/schoolManagement/getSchoolDetails",Utils.ensureAuthenticated,function(req,res){
        var requestobj=req.body.schoolId;
//        console.log("requestobj - manage-users/getSelectedUserDetails",requestobj, req.body.userName);
//        console.log("requestobj - registerNewUser");
//        userMS.addNewUser(requestobj,res);
        schoolMS.getSelectedSchool(requestobj,req,res);
    });

    
    
}
