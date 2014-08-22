/**
 * Created by ravikant on 11/8/14.
 */
var Utils=require("../../common/Utils/Utils.js");
var neo4j=require("node-neo4j");
var db=new neo4j("http://50.17.127.247:7474");
module.exports.getAllBooks=function (res){
    var queryAllBooks="MATCH (p:ParentBook) RETURN p";
    var responseObj=new Utils.Response();
    db.cypherQuery(queryAllBooks,function(err,reply){
        console.log(err,reply);
        if(!err){
            responseObj.responseData=reply;
            res.json(responseObj);
        }else{
            responseObj.error=true;
            responseObj.errorMsg="No Data found.";
            res.json(responseObj);
        }
    });
}
module.exports.getChildBooks=function(primaryKey,value,res){
    var query='Match (a:ParentBook{'+primaryKey+':"'+value+'"})-[:PARENTBOOK_OF]->(c) return c';
    var responseObj=new Utils.Response();
    db.cypherQuery(query,function(err,reply){
        console.log(query,err,reply);
        if(!err){
            responseObj.responseData=reply;
            res.json(responseObj);
        }else{
            responseObj.error=true;
            responseObj.errorMsg="No Data found.";
            res.json(responseObj);
        }
    });
}
module.exports.searchBooks=function(requestObj,res){
    var parentBookObj=requestObj.parentBook;
    var query;
    if(requestObj.searchText!=""){
        query='Match (n:parentBook) where ';
        if(parentBookObj.bookTitle){
            query+='n.bookTitle =~ ".*'+parentBookObj.bookTitle+'.*" AND ';
        }else{
            query+='n.bookTitle =~ ".*'+requestObj.searchText+'.*" OR ';
        }
        if(parentBookObj.authorName){
            query+='n.authorName =~ ".*'+parentBookObj.authorName+'.*" AND ';
        }else{
            query+='n.authorName =~ ".*'+requestObj.searchText+'.*" OR ';
        }
        query+='n.isbn =~ ".*'+requestObj.searchText+'.*" OR ';
        query+='n.publisher =~ ".*'+requestObj.searchText+'.*" OR ';
        query+='n.categoryName =~ ".*'+requestObj.searchText+'.*" ';
        query+='RETURN n';
    }else{
        query='Match (n:ParentBook) where n.bookTitle =~ ".*'+parentBookObj.bookTitle+'.*" AND n.authorName =~ ".*'+parentBookObj.authorName+'.*" RETURN n';
    }
    console.log("parentBookObj",parentBookObj);

    var responseObj=new Utils.Response();
    db.cypherQuery(query,function(err,reply){
        console.log("searchBooks",query,err);
        if(!err){
            responseObj.responseData=reply;
            res.json(responseObj);
        }else{
            responseObj.error=true;
            responseObj.errorMsg="No Data found.";
            res.json(responseObj);
        }
    });
}