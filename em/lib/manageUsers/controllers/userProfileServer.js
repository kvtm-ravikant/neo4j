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
      //  clonedUserDetails.basicDetails.birthPlace_state=location.states[clonedUserDetails.basicDetails.birthPlace_state.toString].stateName;
        //delete city as we don't have its resolver
        delete clonedUserDetails.basicDetails.birthPlace_city;
        delete clonedUserDetails.basicDetails.accessList;
        console.log("clonedUserDetails.basicDetails",clonedUserDetails.basicDetails);
        //religion
        clonedUserDetails.basicDetails.religionName=religion[clonedUserDetails.basicDetails.religionId];

        var fullName = " ";

        if(clonedUserDetails.basicDetails){
            var user= clonedUserDetails.basicDetails;
            var fullNameArr=[];
            user.firstName.length>0?fullNameArr.push(user.firstName):null;
            user.middleName.length>0?fullNameArr.push(user.middleName):null;
            user.lastName.length>0?fullNameArr.push(user.lastName):null;
            fullName = fullNameArr.join(" ");
        }

        var latestobj = {
            fullName : fullName,
            basicDetails: [
                {regID : clonedUserDetails.basicDetails.regID},
                {userName: clonedUserDetails.basicDetails.userName},
                {DOB: clonedUserDetails.basicDetails.DOB},
                {sex : clonedUserDetails.basicDetails.sex},
                {casteId : clonedUserDetails.basicDetails.casteId},
                {SMSEnabled:Utils.resolveBoolean(clonedUserDetails.basicDetails.isSMSEnabled)},
                {EmailEnabled: Utils.resolveBoolean(clonedUserDetails.basicDetails.isEmailEnabled)},
                {languages_motherTongue : clonedUserDetails.basicDetails.languages_motherTongue},
                {religion : religion[clonedUserDetails.basicDetails.religionId]}

            ],
            contact:[
                {emailSecondary: clonedUserDetails.contact.emailSecondary},
                {emailPrimary: clonedUserDetails.contact.emailPrimary},
                {phonePrimary: clonedUserDetails.contact.phonePrimary},
                {phoneSecondary: clonedUserDetails.contact.phoneSecondary},
                {_id: clonedUserDetails.contact._id}
            ],
            primaryAddress:[
                {street2: clonedUserDetails.primaryAddress.street2},
                {pincode: clonedUserDetails.primaryAddress.pincode},
                {street1: clonedUserDetails.primaryAddress.street1},
                /*{state: location.states[clonedUserDetails.primaryAddress.state.toString].state},
                {country: location.countries[clonedUserDetails.primaryAddress.country.toString()].country},*/
                {_id:clonedUserDetails.primaryAddress._id}
            ]
        };

        //sending response
        console.log("clonedUserDetails",clonedUserDetails);
        var responseObj=new Utils.Response();
        responseObj.responseData=latestobj;
        res.json(responseObj);


    });
}

