/**
 * Created by ravikant on 20/6/14.
 */

var userModel=require("../models/User.js")
module.exports=function(app,Utils){
    app.get("/manage-users/user-profile",function(req,res){
        console.log("Inside /manage-users/create-user");
        res.redirect("/index");

    });
    app.post("/manage-users/setUserInSession",function(req,res){
        var user=req.body;
        req.session.userDetails=user;
        res.json({});
    });
    app.get("/manage-users/getUserprofileForUserName",Utils.ensureAuthenticated,function(req,res){
        console.log("/manage-users/getUserprofileForUserName");

        var userDetails=req.session.userDetails;
        var clonedUserDetails=Utils.clone(userDetails);

        delete clonedUserDetails.basicDetails.accessList;
        //console.log("clonedUserDetails.basicDetails",clonedUserDetails.basicDetails);
        //religion
        userModel.getImageData(clonedUserDetails,res);

    });
}

