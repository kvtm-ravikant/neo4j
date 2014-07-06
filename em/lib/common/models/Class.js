/**
 * Created by Pinki Boora on 6/1/14.
 */
var neo4j=require("node-neo4j");
var db=new neo4j("http://localhost:7474");
var Utils=require("../../common/Utils/Utils.js");

module.exports.getClassList=function(req,res){
    var schoolId=req.session.userDetails.schoolDetails.schoolId;

    var selectClass='Match (class:Class)-[r:CLASS_OF]->(school:School{schoolId:"'+schoolId+'"}) RETURN class';
    console.log("schoolId",schoolId,">",selectClass);
    db.cypherQuery(selectClass,function(err,classList){
        var responseObj=new Utils.Response();
        console.log("classList",classList);
        if(classList && classList.data.length>0){
            responseObj.responseData=classList.data;
        }else{
            responseObj.error=true;
        }
        res.json(responseObj);
    });

};

