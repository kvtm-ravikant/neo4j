var Utils = require("../../common/Utils/Utils.js");
var db=Utils.getDBInstance();

/* Get all Schools from school */
module.exports.getAllSchools = function(loggedInUser,res) {
	
	var queryAllSchools = "MATCH (n:School) RETURN n LIMIT 25";
    
	var responseObj = new Utils.Response();
	db.cypherQuery(queryAllSchools, function(err, reply) {
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

/*
* Get selected School details
*/
module.exports.getSelectedSchool=function(value,req,res){
	var schoolId = value;
	var responseObj = new Utils.Response();
	var query = 'MATCH (n:School{schoolId:"'+schoolId+'"}) RETURN n';
    
	var responseObj = new Utils.Response();
	db.cypherQuery(query, function(err, reply) {
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

