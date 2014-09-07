/**
 * Created by ravikant on 20/6/14.
 */
var fs=require("fs");
var userMS=require('../models/User.js');
var Utils=require("../../common/Utils/Utils.js");
var neo4j=require("node-neo4j");
var db=new neo4j("http://localhost:7474");

var UserClass=require("../models/UserClass.js");
var user=new UserClass();


module.exports=function(app,Utils){
    app.get("/manage-users/users",function(req,res){
        console.log("Inside /manage-users/create-user");
        res.redirect("/index");
    });

    app.get("/manage-users/userClassData",Utils.ensureAuthenticated,function(req,res){
        var user=new UserClass();
        res.json(user);
    });
    /* Get all Users from USER */
    app.get("/manage-users/getAllUser",Utils.ensureAuthenticated,function(req,res){
    	console.log("/manage-users/getAllUser");
        userMS.getAllUsers(res);
    });
    /* Check availability of username  */
    app.post("/manage-users/users/userNameAvailablity",Utils.ensureAuthenticated,function(req,res){
    	var requestobj=req.body;
    	console.log("Puneet /manage-users/users/userNameAvailablityr",req.body);
        userMS.searchUser(requestobj,res);
    });

    /* New User Registration */
    app.post("/manage-users/users/registerNewUser",Utils.ensureAuthenticated,function(req,res){
        var requestobj=req.body;
        var loggedInUser=req.session.userDetails;
        console.log("requestobj - registerNewUser",requestobj);
        userMS.addNewUser(requestobj,loggedInUser,res);
        
    });
    /* Search the User from textBox*/
    app.post("/manage-users/searchUser/",Utils.ensureAuthenticated,function(req,res){
        var requestobj=req.body.userName;
        console.log("requestobj - search user",requestobj, req.body);
//        console.log("requestobj - registerNewUser");
//        userMS.addNewUser(requestobj,res);
        userMS.getSelectedUser(requestobj,res);
        
    });
    /*get selected User */
    app.post("/manage-users/SelectedUserDetails/",Utils.ensureAuthenticated,function(req,res){
        var requestobj=req.body.userName;
//        console.log("requestobj - manage-users/getSelectedUserDetails",requestobj, req.body.userName);
//        console.log("requestobj - registerNewUser");
//        userMS.addNewUser(requestobj,res);
        userMS.getSelectedUser(requestobj,req,res);
    });
}
