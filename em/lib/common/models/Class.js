/**
 * Created by Pinki Boora on 6/1/14.
 */
var neo4j=require("node-neo4j");
var db=new neo4j("http://localhost:7474");
var Utils=require("../../common/Utils/Utils.js");
var selectClass='MATCH (n:Class) RETURN n';
module.exports.getClassList=function(req,res){
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

