/**
 * Created by ravikant on 11/8/14.
 */
var Utils = require("../../common/Utils/Utils.js");
var db=Utils.getDBInstance();
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
        query='Match (n:ParentBook) where ';
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

module.exports.addNewBook=function(requestObj,res){
    var parentBookObj=requestObj;
    var query;
    parentBookObj.edition=parseInt(parentBookObj.edition,10);
    parentBookObj.bookCopies=parseInt(parentBookObj.bookCopies,10);
    if(isNaN(parentBookObj.bookCopies))
        parentBookObj.bookCopies=0;

    if(isNaN(parentBookObj.edition))
        parentBookObj.edition=0;

    console.log("addnewBokk - parsedDate : ", parentBookObj);

    var responseObj=new Utils.Response();

    db.insertNode(parentBookObj,["ParentBook"],function(err,reply){
        console.log("reply",reply);
        if(!err){
            responseObj.responseData=reply;
            res.json(responseObj);
        }else{
            responseObj.error=true;
            responseObj.errorMsg="No Data found.";
            res.json(responseObj);
        }
    })
}
    /* addChildBook - DB Insert */
    module.exports.addChildBook=function(requestObj,res){
        var childBookObj=requestObj;
        var query;
//    childBookObj.edition=parseInt(childBookObj.edition,10);
//    childBookObj.bookCopies=parseInt(parentBookObj.bookCopies,10);
//    if(isNaN(parentBookObj.bookCopies))
//        parentBookObj.bookCopies=0;
//
//    if(isNaN(parentBookObj.edition))
//        parentBookObj.edition=0;

        console.log("addChildBook - parsedDate : ", childBookObj);

        var responseObj=new Utils.Response();

        db.insertNode(childBookObj,["ChildBook"],function(err,reply){
            console.log("reply",reply);
            if(!err){
                responseObj.responseData=reply;
                res.json(responseObj);
            }else{
                responseObj.error=true;
                responseObj.errorMsg="No Data found.";
                res.json(responseObj);
            }
        })
    }

module.exports.issueBook=function(res,childBook,userID,issueDetails){
    console.log("issueBook",childBook,userID,issueDetails);
    var responseObj=new Utils.Response();
    db.insertRelationship(childBook._id,userID,"ISSUED_TO",issueDetails,function(err,resultRel){
        console.log("insertRelationship",err,resultRel);
        if(!err){
            responseObj.responseData=resultRel;
            childBook.bookStatus='Unavailable';
            db.updateNode(childBook._id, childBook, function(err, node){
                if(node === true){
                    // node updated
                    res.json(responseObj);
                } else {
                    // node not found, hence not updated
                    responseObj.error=true;
                    responseObj.errorMsg="Failed to issue Book.";
                    res.json(responseObj);
                }
            });

        }else{
            responseObj.error=true;
            responseObj.errorMsg="Failed to issue Book.";
            res.json(responseObj);
        }
    });
}
module.exports.returnBook=function(res,requestObj){
    var responseObj=new Utils.Response();
    db.updateRelationship(requestObj.issueBookObj._id,requestObj.issueBookObj,function(err,reply){
        if(!err){
            requestObj.book.bookStatus="Available";
            db.updateNode(requestObj.book._id, requestObj.book, function(err, node){
                if(node === true){
                    // node updated
                    res.json(responseObj);
                } else {
                    // node not found, hence not updated
                    responseObj.error=true;
                    responseObj.errorMsg="Failed to return Book.";
                    res.json(responseObj);
                }
            });
        }
    })

}
module.exports.getIssuedBookDetails=function(res,bookId){
    var query='Start n=node('+bookId+') WITH n MATCH (n)-[r:ISSUED_TO]->(b) RETURN b,r';
    db.cypherQuery(query,function(err,reply){
        var responseObj=new Utils.Response();
        console.log("getIssuedBookDetails",query,err);
        if(!err){
            responseObj.responseData=reply;
            res.json(responseObj);
        }else{
            responseObj.error=true;
            responseObj.errorMsg="Error in getting details.";
            res.json(responseObj);
        }
    });
}


module.exports.searchUser=function(res,searchText){
    console.log("searchUser",searchText);
    var responseObj=new Utils.Response();
    var searchTextArr=searchText.split(",");
    var query='Match (n:User) where ';
    for(var i= 0,len=searchTextArr.length;i<len;i++){
        var text=searchTextArr[i];
        var tempText=text.toLowerCase();
        query+="("
        if(tempText=="m" || tempText=="male"){query+='n.sex ="M" OR '};
        if(tempText=="f" || tempText=="female"){query+='n.sex ="F" OR '};
        if(tempText=="student"){query+='n.userType ="1" OR '};
        if(tempText=="teacher"){query+='n.userType ="2" OR '}
        query+='n.regID =~ ".*'+text+'.*" OR ';
        query+='n.lastName =~ ".*'+text+'.*" OR ';
        query+='n.firstName =~ ".*'+text+'.*" OR ';
        query+='n.middleName =~ ".*'+text+'.*" OR ';
        (i==len-1)?query+='n.userName =~ ".*'+text+'.*" )':query+='n.userName =~ ".*'+text+'.*" ) AND ';

    }
    query+='RETURN n';
    console.log("query",query);
    db.cypherQuery(query,function(err,reply){
        console.log("searchUser",query,err);
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
