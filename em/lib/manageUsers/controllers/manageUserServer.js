/**
 * Created by ravikant on 20/6/14.
 */
var fs=require("fs");
var userMS=require('../models/User.js');
var UserClass=require("../models/UserClass.js");



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
        var requestobj=req.body.userTest;
        console.log("requestobj - registerNewUser",requestobj,req.body);
        console.log("requestobj - registerNewUser");
        userMS.addNewUser(requestobj,res);
        
    });
}
