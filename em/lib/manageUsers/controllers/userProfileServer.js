/**
 * Created by ravikant on 20/6/14.
 */

module.exports=function(app,Utils){
    app.get("/manage-users/user-profile",function(req,res){
        console.log("Inside /manage-users/create-user");
        res.redirect("/index");

    });
    app.get("/manage-users/getUserprofileForUserName",Utils.ensureAuthenticated,function(req,res){
        console.log("/manage-users/getUserprofileForUserName");
        try{
            var userDetails=req.session.userDetails;
            var responseObj=new Utils.Response();
            responseObj.responseData=userDetails;
            res.json(responseObj);
        }catch(e){
            Utils.defaultErrorResponse(res,"Unable to get user details."+e)
        }


    });
}

