/**
 * Created by ravikant on 20/6/14.
 */
var location=require("../../common/models/countryStateCity.js");
var religion=require("../../common/models/religion.js")
var languages=require("../../common/models/language.js")
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
        var religionId=clonedUserDetails.basicDetails.religionId;
        var religionName="";
        console.log("religionId",religionId);
        religionId && religion[religionId]?religionName=religion[religionId].___name___:null;
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
                    {religion : religionName},
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
              profileImagePath:clonedUserDetails.basicDetails.profileImagePath,
              fullName:getFullName(clonedUserDetails.basicDetails),
              userFullData:clonedUserDetails
          }

        };
        var languageId=clonedUserDetails.basicDetails.languages_motherTongue;
        if(languageId && languages[languageId]){
            var languageName=languages[languageId].___name___;
            languageName?latestobj.displayObject.basicDetails.push({language :languageName}):latestobj.displayObject.basicDetails.push({language :""});
        }

        if(clonedUserDetails.primaryAddress.hasOwnProperty('country') && clonedUserDetails.primaryAddress.country.toString()){
            var countryId=clonedUserDetails.primaryAddress.country.toString();
            if(countryId && location[countryId]){
                var countryName=location[countryId].___name___;
                latestobj.displayObject.primaryAddress.push({country:countryName});
                if(countryName && clonedUserDetails.primaryAddress.hasOwnProperty('state') && clonedUserDetails.primaryAddress.state.toString()){

                    var stateId=clonedUserDetails.primaryAddress.state.toString();
                    if(stateId && location[countryId][stateId]){
                        var stateName=location[countryId][stateId].___name___;
                        latestobj.displayObject.primaryAddress.push({state:stateName});
                        if(stateName && clonedUserDetails.primaryAddress.hasOwnProperty('city') && clonedUserDetails.primaryAddress.city.toString()){
                            var cityId=clonedUserDetails.primaryAddress.city.toString();
                            if(cityId && location[countryId][stateId][cityId]){
                                var cityName=location[countryId][stateId][cityId].___name___;
                                latestobj.displayObject.primaryAddress.push({city:cityName});
                            }

                        }
                    }

                }
            }

        }


        //sending response
        //console.log("clonedUserDetails",clonedUserDetails);
        var responseObj=new Utils.Response();
        responseObj.responseData=latestobj;
        res.json(responseObj);


    });
}
function getFullName(user){
    //console.log("user",user);
    var fullNameArr=[];
    user && user.salutation && user.salutation.length>0?fullNameArr.push(user.salutation):null;
    user && user.firstName && user.firstName.length>0?fullNameArr.push(user.firstName):null;
    user && user.middleName && user.middleName.length>0?fullNameArr.push(user.middleName):null;
    user && user.lastName && user.lastName.length>0?fullNameArr.push(user.lastName):null;
    return fullNameArr.join(" ");

}
