/**
 * Created by Pinki Boora on 5/24/14.
 */
var neo4j = require("node-neo4j");
var db = new neo4j("http://localhost:7474");
var Utils = require("../../common/Utils/Utils.js");
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

module.exports.addNewUser = function(requestObj, res) {
	var userClass = requestObj;
	var query;

	console.log("addNewUser - parsedDate : ", userClass.basicDetails);

	var responseObj = new Utils.Response();

	db.insertNode(userClass.basicDetails, ["user"], function(err, reply) {
		console.log("reply", reply, err);
		if (!err) {
			responseObj.responseData = reply;
			res.json(responseObj);
		} else {
			responseObj.error = true;
			responseObj.errorMsg = "User No Data found.";
			res.json(responseObj);
		}
	}

	//    db.insertNode(userClass.PrimaryAddress,["PrimaryAddress"],function(err,reply){
	//        console.log("reply",reply);
	//        if(!err){
	//            responseObj.responseData=reply;
	//            res.json(responseObj);
	//        }else{
	//            responseObj.error=true;
	//            responseObj.errorMsg="PrimaryAddress No Data found.";
	//            res.json(responseObj);
	//        }
	//    }
	//    
	//    db.insertNode(userClass.secondaryAddress,["secondaryAddress"],function(err,reply){
	//        console.log("reply",reply);
	//        if(!err){
	//            responseObj.responseData=reply;
	//            res.json(responseObj);
	//        }else{
	//            responseObj.error=true;
	//            responseObj.errorMsg="secondaryAddress No Data found.";
	//            res.json(responseObj);
	//        }
	//    }
	//
	//    db.insertNode(userClass.socialNetwork,["socialNetwork"],function(err,reply){
	//        console.log("reply",reply);
	//        if(!err){
	//            responseObj.responseData=reply;
	//            res.json(responseObj);
	//        }else{
	//            responseObj.error=true;
	//            responseObj.errorMsg="socialNetwork No Data found.";
	//            res.json(responseObj);
	//        }
	//    }
	//
	//    db.insertNode(userClass.contact,["contact"],function(err,reply){
	//        console.log("reply",reply);
	//        if(!err){
	//            responseObj.responseData=reply;
	//            res.json(responseObj);
	//        }else{
	//            responseObj.error=true;
	//            responseObj.errorMsg="contact No Data found.";
	//            res.json(responseObj);
	//        }
	//    }

	)

	/*
	 db.cypherQuery(query,function(err,reply){
	 console.log("addNewBook",query,err);

	 });
	 */
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
