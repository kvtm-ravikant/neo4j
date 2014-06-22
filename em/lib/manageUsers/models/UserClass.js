var neo4j=require("node-neo4j");
var Utils=require("../../common/Utils/Utils.js");
var db=new neo4j("http://localhost:7474");

/**
 * Created by ravikant on 21/6/14.
 */
module.exports=function (){
    this.basicDetails={
        _id:null, //id generated by neo4j is number
        userName:"",
        regID:"",
        salutation:"",
        firstName:"",
        middleName:"",
        lastName:"",
        userType:null,//number
        DOB:null,//number timestamp
        updatedAt:null,//number timestamp
        contactUserId:"", //username
        resetPasswordCodeUntil:null,//number timestamp
        createdAt:null,//number timestamp
        resetPasswordCode:"",
        casteId:null, //number
        birthPlace_country:null,
        birthPlace_state:null,
        birthPlace_city:null,
        visaDetails:"",
        isSMSEnabled:false,
        isEmailEnabled:false,
        isFromReservedCategory:false,
        passportNumber:"",
        isFromReservedCategory:false,
        isPhysicallyHandicapped:false,
        sex:"",
        softeDelete:false,
        languages_others:[],
        profileImagePath:"",
        isEconomicallyBackward:false,
        languages_motherTongue:"",
        createdBy:"", //username
        updatedBy:"", //username
        uid:"",
        religionId:null, //number
        hashPassword:"",
        panNum:"",
        accessList:[], //array of accessList strings
    }
    this.primaryAddress={
        street2: '',
        pincode: '452001',
        street1: '',
        state: '',
        district: '',
        city: '',
        country: '',
        _id: null
    }
    this.secondaryAddress={
        street2: '',
        pincode: '452001',
        street1: '',
        state: '',
        district: '',
        city: '',
        country: '',
        _id: null
    }
    this.socialNetwork={
        skypeId: '',
        facebookId: '',
        twitterUrl: '',
        skypeUrl: '',
        twitterId: '',
        facebookScreenName: '',
        facebookUrl: '',
        _id: null
    }
    this.schoolDetails={
        desc: '',
        name: '',
        schoolId: '',
        schoolHeadId: '',
        _id: null
    }
    this.contact={

    }
    this.getFullName=function(){
        var fullNameArr=[];
        this.salutation.length>0?fullNameArr.push(this.salutation):null;
        this.firstName.length>0?fullNameArr.push(this.firstName):null;
        this.middleName.length>0?fullNameArr.push(this.middleName):null;
        this.lastName.length>0?fullNameArr.push(this.lastName):null;
        return fullNameArr.join(" ");
    }
    this.getUserDetailsBYUserNameQuery=function (userName){
        var query='MATCH (user:User{userName:"'+userName+'"})-[:PRIMARY_ADDRESS_OF]-(pAddress:PrimaryAddress) '+
                  'WITH user,pAddress '+
                  'MATCH (user)-[:SECONDARY_ADDRESS_OF]-(sAddress:SecondaryAddress) '+
                  'WITH user,pAddress,sAddress '+
                  'MATCH (user)-[:SOCIAL_NETWORK_OF]-(sn:SocialNetwork) '+
                  'WITH user,pAddress,sAddress,sn '+
                  'MATCH (user)-[:BELONGS_TO]-(school:School) '+
                  'WITH user,pAddress,sAddress,sn,school '+
                  'MATCH (user)-[:CONTACT_OF]-(contact:Contact) '+
                  'RETURN user,pAddress,sAddress,sn,school,contact ';
        return query;
    }
    this.getUserDetailsByUserName=function(userName,req,res,callback){
        var userDetailsQuery=this.getUserDetailsBYUserNameQuery(userName);
        console.log("cypherQuery",userDetailsQuery);
        db.cypherQuery(userDetailsQuery, function(err, result){
            if(result){
                console.log("cypherQuery",err,result,userDetailsQuery);
                callback(req,res,result);
            }else if(err && res){
                Utils.defaultErrorResponse(res,"Failed to find User Details for "+userName+".");
            }

        });

    }
    this.setUserDetails=function(basicDetails,primaryAddress,secondaryAddress,socialNetwork,schoolDetails,contact){
        this.basicDetails=basicDetails;
        this.primaryAddress=primaryAddress;
        this.secondaryAddress=secondaryAddress;
        this.socialNetwork=socialNetwork;
        this.schoolDetails=schoolDetails;
        this.contact=contact;

    }
    this.setUserDataInSession=function(req){
        delete this.basicDetails.hashPassword;
        req.session.userDetails=this;
    }
}
