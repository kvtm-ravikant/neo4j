/**
 * Created by Pinki Boora on 6/1/14.
 */
var Utils=require("../../common/Utils/Utils.js");
var db=Utils.getDBInstance();

module.exports.getClassList=function(req,res){
    var schoolId=req.session.userDetails.schoolDetails.schoolId;

    var selectClass='Match (class:Class)-[r:CLASS_OF]->(school:School{schoolId:"'+schoolId+'"}) RETURN class';
    console.log("schoolId",schoolId,">",selectClass);
    db.cypherQuery(selectClass,function(err,classList){
        var responseObj=new Utils.Response();
        if(classList && classList.data.length>0){
            responseObj.responseData=classList.data;
        }else{
            responseObj.error=true;
        }
        res.json(responseObj);
    });

};

