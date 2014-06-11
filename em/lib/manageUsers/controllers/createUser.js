/**
 * Created by Ravikant on 2/3/14.
 */
module.exports=function(app){
    app.get("/manage-users/create-user",function(req,res){
        console.log("Inside /manage-users/create-user");
        //res.render('index');

    });
}
var neo4j=require("node-neo4j");
var db=new neo4j("http://localhost:7474");
var User=require("../models/User.js");
/*var adityaConfig={
    userName:"ravikantaryan3",
    firstName:"Ravikant1",
    middleName:"",
    lastName:"Sinha1",
    email:"ravikantaryan@gmail.com",
    admin:false,
    userType:"student",
    hashedPassword:"password",
    salt:"salt",
    resetPasswordCode:"resetPasswordCode",
    resetPasswordCodeUntil:"resetPasswordCodeUntil",
    createdAt:(Number(new Date())).toString(),
    updatedAt:(Number(new Date())).toString()
}
var aditya=new User(adityaConfig);
aditya.createStudent(function(err, result){
    console.log("create student",err, result,result.id);

})*/
/*var sureshConfig={
    userName:"sureshAsthana",
    firstName:"Suresh",
    middleName:"",
    lastName:"Asthana",
    email:"sureshasthana@gmail.com",
    admin:false,
    userType:"Teacher",
    hashedPassword:"password",
    salt:"salt",
    resetPasswordCode:"resetPasswordCode",
    resetPasswordCodeUntil:"resetPasswordCodeUntil",
    createdAt:(Number(new Date())).toString(),
    updatedAt:(Number(new Date())).toString()
}
var suresh=new User(sureshConfig);
var relationObj={"relationShip":"TEACHER_FOR","data":{"subjects":[10,19]}};
suresh.createTeacher(relationObj,function(err, result){
    console.log("create Teacher",err, result);
});*/

