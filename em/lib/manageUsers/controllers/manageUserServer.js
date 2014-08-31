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
        res.json(user);
    });
    /* Get all Users from USER */
    app.get("/manage-users/getAllUser",Utils.ensureAuthenticated,function(req,res){
    	console.log("/manage-users/getAllUser");
        userMS.getAllUsers(res);
    });

    /* */
    app.post("/manage-users/users/registerNewUser",Utils.ensureAuthenticated,function(req,res){
        var requestobj=req.body;
        console.log("requestobj - registerNewUser",requestobj);
//        libraryMS.addNewBook(requestobj,res);
    })
}
