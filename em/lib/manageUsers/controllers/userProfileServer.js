/**
 * Created by ravikant on 20/6/14.
 */
var location=require("../../common/models/location.js");
var religion=require("../../common/models/religion.js")
module.exports=function(app,Utils){
    app.get("/manage-users/user-profile",function(req,res){
        console.log("Inside /manage-users/create-user");
        res.redirect("/index");

    });
    app.get("/manage-users/getUserprofileForUserName",Utils.ensureAuthenticated,function(req,res){
        console.log("/manage-users/getUserprofileForUserName");
        try{

        }catch(e){
            console.log("execption",e);
            Utils.defaultErrorResponse(res,"Unable to get user details."+e);
        }
        var userDetails=req.session.userDetails;
        var clonedUserDetails=Utils.clone(userDetails);
        //resolve birth country
        console.log(clonedUserDetails.basicDetails.birthPlace_country,location);
        clonedUserDetails.basicDetails.birthPlace_country=location.countries[clonedUserDetails.basicDetails.birthPlace_country.toString()].countryName;
        //resolve birth state
        //console.log("state",clonedUserDetails.basicDetails.birthPlace_state);
        //clonedUserDetails.basicDetails.birthPlace_state=location.states[clonedUserDetails.basicDetails.birthPlace_state.toString].stateName;
        //delete city as we don't have its resolver
        delete clonedUserDetails.basicDetails.birthPlace_city;
        delete clonedUserDetails.basicDetails.accessList;
        //religion
        clonedUserDetails.basicDetails.religionName=religion[clonedUserDetails.basicDetails.religionId];

        //sending response
        var responseObj=new Utils.Response();
        responseObj.responseData=clonedUserDetails;
        res.json(responseObj);


    });
}

