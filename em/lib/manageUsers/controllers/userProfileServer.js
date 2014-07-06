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
        if(clonedUserDetails.basicDetails.hasOwnProperty("birthPlace_country") && clonedUserDetails.basicDetails.birthPlace_country){
            clonedUserDetails.basicDetails.birthPlace_country=location.countries[clonedUserDetails.basicDetails.birthPlace_country.toString()].countryName;
        }

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
            displayObject:{
                fullName : fullName,
                basicDetails: [
                    {regID : clonedUserDetails.basicDetails.regID},
                    {userName: clonedUserDetails.basicDetails.userName},
                    {DOB: clonedUserDetails.basicDetails.DOB},
                    {gender : Utils.resolveSex(clonedUserDetails.basicDetails.sex)},
                    {languages_motherTongue : clonedUserDetails.basicDetails.languages_motherTongue},
                    {religion : religion[clonedUserDetails.basicDetails.religionId]},
                    {SMSEnabled:Utils.resolveBoolean(clonedUserDetails.basicDetails.isSMSEnabled)},
                    {EmailEnabled: Utils.resolveBoolean(clonedUserDetails.basicDetails.isEmailEnabled)}

                ],
                contact:[
                    {emailPrimary: clonedUserDetails.contact.emailPrimary},
                    {phonePrimary: clonedUserDetails.contact.phonePrimary},
                    {emailSecondary: clonedUserDetails.contact.emailSecondary},
                    {phoneSecondary: clonedUserDetails.contact.phoneSecondary},
                    {_id: clonedUserDetails.contact._id}
                ],
                primaryAddress:[
                    {street1: clonedUserDetails.primaryAddress.street1},
                    {street2: clonedUserDetails.primaryAddress.street2},
                    {pincode: clonedUserDetails.primaryAddress.pincode},
                    /*{state: location.states[clonedUserDetails.primaryAddress.state.toString].state},
                     {country: location.countries[clonedUserDetails.primaryAddress.country.toString()].country},*/
                    {_id:clonedUserDetails.primaryAddress._id}
                ]
            },
          hiddenObject:{
              profileImagePath:"images/userProfile/"+clonedUserDetails.schoolDetails.schoolId.replace(/:/g,"_")+"_"+clonedUserDetails.basicDetails.regID+".png",
              fullName:getFullName(clonedUserDetails.basicDetails)
          }

        };

        //sending response
        console.log("clonedUserDetails",clonedUserDetails);
        var responseObj=new Utils.Response();
        responseObj.responseData=latestobj;
        res.json(responseObj);


    });
}
function getFullName(user){
    console.log("user",user);
    var fullNameArr=[];
    user && user.salutation && user.salutation.length>0?fullNameArr.push(user.salutation):null;
    user && user.firstName && user.firstName.length>0?fullNameArr.push(user.firstName):null;
    user && user.middleName && user.middleName.length>0?fullNameArr.push(user.middleName):null;
    user && user.lastName && user.lastName.length>0?fullNameArr.push(user.lastName):null;
    return fullNameArr.join(" ");

}
