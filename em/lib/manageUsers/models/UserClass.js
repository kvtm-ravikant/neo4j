
var Utils=require("../../common/Utils/Utils.js");
var db=Utils.getDBInstance();

/**
 * Created by ravikant on 21/6/14.
 */
module.exports=function (){
    this.basicDetails={
        _id:'', //id generated by neo4j is number
        userName:"",
        regID:"",
        salutation:"",
        firstName:"",
        middleName:"",
        lastName:"",
        userType:'',//number
        DOB:'',//number timestamp
        updatedAt:'',//number timestamp
        contactUserId:"", //username
        resetPasswordCodeUntil:'',//number timestamp
        createdAt:'',//number timestamp
        resetPasswordCode:"",
        casteId:'', //number
        birthPlace_country:'',
        birthPlace_state:'',
        birthPlace_city:'',
        birthPlace_otherCity:'',
        visaDetails:"",
        isSMSEnabled:false,
        isEmailEnabled:false,
        isFromReservedCategory:false,
        passportNumber:"",
        isFromReservedCategory:false,
        isPhysicallyHandicapped:false,
        sex:"",
        softDelete:false,
        languages_others:[],
        profileImagePath:"",
        isEconomicallyBackward:false,
        languages_motherTongue:"",
        createdBy:"", //username
        updatedBy:"", //username
        uid:"",
        religionId:'', //number
        hashPassword:"",
        panNum:"",
        accessList:[], //array of accessList strings
    }
    this.primaryAddress={
        street2: '',
        pincode: "",
        street1: '',
        state: '',
        district: '',
        city: '',
        country: '',
        _id: ''
    }
    this.secondaryAddress={
        street2: '',
        pincode: '452001',
        street1: '',
        state: '',
        district: '',
        city: '',
        country: '',
        _id: ''
    }
    this.socialNetwork={
        skypeId: '',
        facebookId: '',
        twitterUrl: '',
        skypeUrl: '',
        twitterId: '',
        facebookScreenName: '',
        facebookUrl: '',
        _id: ''
    }
    this.schoolDetails={
        desc: '',
        name: '',
        schoolId: '',
        schoolHeadId: '',
        _id: ''
    }
    this.contact={
		 emailPrimary:'',
    	 emailSecondary:'',
    	 phonePrimary:'',
    	 phoneSecondary:'',
    	_id:''
    }
    this.getFullName=function(){
        var fullNameArr=[];
        this.salutation.length>0?fullNameArr.push(this.salutation):'';
        this.firstName.length>0?fullNameArr.push(this.firstName):'';
        this.middleName.length>0?fullNameArr.push(this.middleName):'';
        this.lastName.length>0?fullNameArr.push(this.lastName):'';
        return fullNameArr.join(" ");
    }
    this.getUserDetailsBYUserNameQuery=function (userName){
        var query='MATCH (user:User{userName:"'+userName+'"})-[:PRIMARY_ADDRESS_OF]-(pAddress:PrimaryAddress) '+
                  'WITH user,pAddress '+
                  'MATCH (user)-[:SECONDARY_ADDRESS_OF]-(sAddress:SecondaryAddress) '+
                  'WITH user,pAddress,sAddress '+
                  'MATCH (user)-[:SOCIAL_NETWORK_OF]-(sn:SocialNetwork) '+
                  'WITH user,pAddress,sAddress,sn '+
                  'MATCH (user)-[:USER_OF]-(school:School) '+
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
                console.log("cypherQuery",err);
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
        //getLibraryAndSetInSession(this.schoolDetails.schoolId,req);
        var libQuery='MATCH (a:Library)-[:`LIBRARY_OF`]->(b:School{schoolId:"'+this.schoolDetails.schoolId+'"}) RETURN a;';
        db.cypherQuery(libQuery, function(err, result){
            if(result && result.data.length==1){
                console.log("cypherQuery getLibrary",err,result,libQuery);
                req.session.libraryDetails=result.data[0];
                console.log("getLibraryAndSetInSession req.session.libraryDetails",req.session.libraryDetails);
                console.log("getLibraryAndSetInSession req.session.libraryDetails",req);
            }else if(err ){
                console.log("getLibraryAndSetInSession err",err);
            }

        });
    }

}
function getLibraryAndSetInSession(schoolId,req){
    console.log("getLibraryAndSetInSession ");
    var libQuery='MATCH (a:Library)-[:`LIBRARY_OF`]->(b:School{schoolId:"'+schoolId+'"}) RETURN a;';
    db.cypherQuery(libQuery, function(err, result){
        if(result && result.data.length==1){
            console.log("cypherQuery getLibrary",err,result,libQuery);
            req.session.libraryDetails=result.data[0];
            console.log("getLibraryAndSetInSession req.session.libraryDetails",req.session.libraryDetails);
        }else if(err ){
            console.log("getLibraryAndSetInSession err",err);
        }

    });
}

