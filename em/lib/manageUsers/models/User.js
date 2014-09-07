/**
 * Created by Pinki Boora on 5/24/14.
 */
var neo4j = require("node-neo4j");
var db = new neo4j("http://localhost:7474");
var Utils = require("../../common/Utils/Utils.js");
var UserClassModel=require("../../manageUsers/models/UserClass.js");
var userDetail=new UserClassModel();
var db=Utils.getDBInstance();
console.log("db", db);
module.exports = function(config) {
	this.me = config;

	this.createUser = function(callback) {
		var myData = this.me;
		var selectquery = 'MATCH (n:User{userName:"' + this.me.userName
				+ '"})  RETURN n';
		db.cypherQuery(selectquery, function(err, result) {
			console.log("err", err, result.data.length);
			if (err)
				throw err;
			else if (result.data.length < 1) {
				console.log("Inserting node");
				var myDataNode = db.insertNode(myData, [ "User" ], function(
						err, user) {
					console.log("insertNode user", user);
					if (user && user._id) {

						var schoolIdVal = myData.schoolID;
						var selectquery = 'MATCH (n:School{schoolId:"'
								+ schoolIdVal + '"})  RETURN n';
						db.cypherQuery(selectquery, function(err, school) {
							console.log("err", err);
							if (err)
								throw err;
							else if (school.data.length == 1) {
								var schoolNodeId = school.data[0]._id;
								var relationShip = "BELONGS_TO";
								var relationShipData = {
									"since" : myData.createdAt
								};
								console.log("Before insert relationship",
										schoolNodeId, user._id);
								db.insertRelationship(schoolNodeId, user._id,
										relationShip, relationShipData,
										function(err, result) {
											console.log("insertRelationship",
													err, result);
											callback(err, result);
										});
							}
						});
						/*db.insertRelationship(3,user._id,"STUDENT_OF",{"batch":"2014-15"},function(err,result){
						    console.log("insertRelationship",err,result);
						    callback(err, result);
						});*/
					}

				});

			}

		});
	}
	this.createStudent = function(callcack) {
		this.me.userType = "student";
		this.me.admin = false;
		this.createUser(callcack);
	}
	this.createEmployee = function(callcack) {
		this.me.userType = "employee";
		this.me.admin = false;
		this.createUser(callcack);
	}
	this.createTeacher = function(callcack) {
		this.me.userType = "teacher";
		this.me.admin = true;
		this.createUser(callcack);
	}

}

/*
 * Register New User functionality
 */

module.exports.addNewUser = function(userObj,loggedInUser,res) {

    try{
        var responseObj = new Utils.Response();
        var defaultErrorMsg="Failed to add user. Please contact adminitrator.";

        var findUserQuery = 'MATCH (n:User{userName:"' + userObj.basicDetails.userName + '"})  RETURN n';

        db.cypherQuery("findUserQuery",findUserQuery, function(err, result) {
            console.log("findUserQuery",err, result)
            if(err || !result || (result && result.data && result.data.length==0)){
                var userBasicDetails=fillUserDefaultValues(userObj.basicDetails);
                //create user node
                db.insertNode(userBasicDetails, ["User"], function(err, addUserReply) {
                    console.log("create user node", err,addUserReply);
                    if (!err && addUserReply && addUserReply.hasOwnProperty('_id')) {
                        var insertionStatus={
                            "School-[BELONGS_TO]-User":false,
                            "Contact":false,
                            "Contact-[CONTACT_OF]-User":false,
                            "PrimaryAddress":false,
                            "PrimaryAddress-[PRIMARY_ADDRESS_OF]-User":false,
                            "SecondaryAddress":false,
                            "SecondaryAddress-[SECONDARY_ADDRESS_OF]-User":false,
                            "SocialNetwork":false,
                            "SocialNetwork-[SOCIAL_NETWORK_OF]-User":false,
                        }
                        //associate user to School
                        var userNodeID=addUserReply._id;
                        var schoolNodeID=loggedInUser.schoolDetails._id;//logged In user's school
                        console.log("userNodeID",userNodeID,"schoolNodeID",schoolNodeID);

                        db.insertRelationship(schoolNodeID,userNodeID,"BELONGS_TO",{"from":userBasicDetails.createdAt},function(err,resultRel){
                            console.log("associate user to School",err,resultRel);
                            if(!err){
                                insertionStatus["School-[BELONGS_TO]-User"]=true;
                            }
                        });
                        //create contact node
                        db.insertNode(userObj.contact, ["Contact"], function(err, addContactReply) {
                            console.log("create contact node", err,addContactReply);
                            if (!err && addContactReply && addContactReply.hasOwnProperty('_id')) {
                                if(!err){
                                    insertionStatus["Contact"]=true;
                                }
                                var contactNodeID=addContactReply._id;
                                //associate contact to user
                                db.insertRelationship(contactNodeID,userNodeID,"CONTACT_OF",{},function(err,resultRel){
                                    console.log("associate contact to user",err,resultRel);
                                    if(!err){
                                        insertionStatus["Contact-[CONTACT_OF]-User"]=true;
                                    }
                                });
                            }

                        });
                        //create Primary Address node
                        db.insertNode(userObj.primaryAddress, ["PrimaryAddress"], function(err, addPrimaryAddressReply) {
                            console.log("addPrimaryAddressReply node", err,addPrimaryAddressReply);
                            if (!err && addPrimaryAddressReply && addPrimaryAddressReply.hasOwnProperty('_id')) {
                                if(!err){
                                    insertionStatus["PrimaryAddress"]=true;
                                }
                                var addressPrimaryNodeID=addPrimaryAddressReply._id;
                                //associate Primary Address to user
                                db.insertRelationship(addressPrimaryNodeID,userNodeID,"PRIMARY_ADDRESS_OF",{},function(err,resultRel){
                                    console.log("associate Primary Address to user",err,resultRel);
                                    if(!err){
                                        insertionStatus["PrimaryAddress-[PRIMARY_ADDRESS_OF]-User"]=true;
                                    }
                                });
                            }

                        });
                        //create Secondary Address node
                        db.insertNode(userObj.secondaryAddress, ["SecondaryAddress"], function(err, addSecondaryAddressReply) {
                            console.log("addSecondaryAddressReply node", err,addSecondaryAddressReply);
                            if (!err && addSecondaryAddressReply && addSecondaryAddressReply.hasOwnProperty('_id')) {
                                if(!err){
                                    insertionStatus["SecondaryAddress"]=true;
                                }
                                var addressSecondaryNodeID=addSecondaryAddressReply._id;
                                //associate Secondary Address to user
                                db.insertRelationship(addressSecondaryNodeID,userNodeID,"SECONDARY_ADDRESS_OF",{},function(err,resultRel){
                                    console.log("associate Secondary Address to user",err,resultRel);
                                    if(!err){
                                        insertionStatus["SecondaryAddress-[SECONDARY_ADDRESS_OF]-User"]=true;
                                    }
                                });
                            }

                        });
                        //create SocialNetwork node
                        db.insertNode(userObj.socialNetwork, ["SocialNetwork"], function(err, addsocialNetworkReply) {
                            console.log("addsocialNetworkReply node", err,addsocialNetworkReply);
                            if (!err && addsocialNetworkReply && addsocialNetworkReply.hasOwnProperty('_id')) {
                                if(!err){
                                    insertionStatus["SocialNetwork"]=true;
                                }
                                var socialNetworkNodeID=addsocialNetworkReply._id;
                                //associate social network to user
                                db.insertRelationship(socialNetworkNodeID,userNodeID,"SOCIAL_NETWORK_OF",{},function(err,resultRel){
                                    console.log("associate social network to user",err,resultRel);
                                    if(!err){
                                        insertionStatus["SocialNetwork-[SOCIAL_NETWORK_OF]-User"]=true;
                                    }

                                });
                            }

                        });
                        setTimeout(function(){
                            console.log("insertionStatus",insertionStatus);
                            responseObj.responseData=insertionStatus;
                            res.json(responseObj);
                        },200);
                    } else {
                        Utils.defaultErrorResponse(res,defaultErrorMsg);
                    }
                });//insertNode end

            }else{
                Utils.defaultErrorResponse(res,defaultErrorMsg);
            }
        });//findUserQuery end
    }catch(e){
        console.log("addNewUser",e);
        Utils.defaultErrorResponse(res,defaultErrorMsg);
    }
}
function fillUserDefaultValues(userBasicDetails){
    var currentTimestamp=(new Date()).getTime();
    userBasicDetails.updatedAt=currentTimestamp;
    userBasicDetails.createdAt=currentTimestamp;
    userBasicDetails.hashPassword="password";
    return userBasicDetails;
}
/* Get all Users from USER */
module.exports.getAllUsers = function(res) {
	var queryAllUsers = "MATCH (n:User) RETURN n LIMIT 25";
	var responseObj = new Utils.Response();
	db.cypherQuery(queryAllUsers, function(err, reply) {
		console.log(err, reply);
		if (!err) {
			responseObj.responseData = reply;
			res.json(responseObj);
		} else {
			responseObj.error = true;
			responseObj.errorMsg = "No Data found.";
			res.json(responseObj);
		}
	});
}

/* find the available username for the given username to create new user */
module.exports.searchUser = function(requestObj,res) {
//	console.log("is User Name exist ?", requestObj);
	var responseObj = new Utils.Response();
	var query = 'MATCH (n:User{userName:"' + requestObj.userText + '"})  RETURN n';

	console.log("username availability query :", query);
	db.cypherQuery(query, function(err, reply) {
		console.log("searchUser :", query, err, reply);
		if (!err) {
			responseObj.responseData = reply;
			res.json(responseObj);
		} else {
			responseObj.error = true;
			responseObj.errorMsg = "No Data found.";
			res.json(responseObj);
		}
	});
}
/*
* Get selected User details
*/

module.exports.getSelectedUser=function(value,req,res){
	var userName = value;
	var responseObj = new Utils.Response();
	userDetail.getUserDetailsByUserName(userName, req, res, function(req, res,result) {
		console.log("getSelectedUser", result.data);

		if (result && result.data.length > 0) {
			var userDet, pAddress, sAddress, sn, school, contact;
			result.columns.length > 0 ? userDet = result.data[0][0] : null;
			result.columns.length > 1 ? pAddress = result.data[0][1] : null;
			result.columns.length > 2 ? sAddress = result.data[0][2] : null;
			result.columns.length > 3 ? sn = result.data[0][3] : null;
			result.columns.length > 4 ? school = result.data[0][4] : null;
			result.columns.length > 4 ? contact = result.data[0][5] : null;

			//          console.log("result : ",result);
			console.log(userDet, pAddress, sAddress, sn, school, contact);
			if (userDet != null) {
				userDetail.setUserDetails(userDet, pAddress, sAddress, sn,
						school, contact);
				console.log("req.session.userDetails", userDetail);
				responseObj.responseData = userDetail;
				res.json(responseObj);
			} else {
				console.log("User Details not found.");
				responseObj.error = true;
				responseObj.responseData = null;
				responseObj.errorMsg = "No Data found.";
				res.json(responseObj);
				
			}
		}
	});
}
