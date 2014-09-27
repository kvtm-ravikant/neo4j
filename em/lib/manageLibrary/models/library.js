/**
 * Created by ravikant on 11/8/14.
 */
var Utils = require("../../common/Utils/Utils.js");
var BookClass = require("./bookClass.js");
var db=Utils.getDBInstance();
//getAllBooks(null,'SPHSS:school:2014:452001');
function getAllBooks(res,schoolID){
    var queryAllBooks='MATCH (c)-[:CHILDBOOK_OF]->pb-[:BELONGS_TO]->(lib)-[:LIBRARY_OF]->(school{schoolId:"'+schoolID+'"}) RETURN pb,c  LIMIT 20';
    var responseObj=new Utils.Response();
    db.cypherQuery(queryAllBooks,function(err,reply){
        console.log(err,queryAllBooks);
        if(!err && reply && reply.data && reply.data.length>0){
            var booksList=[];
            var bookIndexMap={};
            for(var i= 0,len=reply.data.length;i<len;i++){
                var row=reply.data[i];// parent=row[0],child=row[1]
                if(bookIndexMap.hasOwnProperty(row[0].isbn)){

                    var index=bookIndexMap[row[0].isbn];
                    var tempBook=booksList[index];
                    tempBook.addChildBook(row[1]);
                }else{
                    bookIndexMap[row[0].isbn]=booksList.length;
                    var book=new BookClass.CompleteBook(row[0],row[1]);
                    booksList.push(book);
                }
            }
            //console.log(JSON.stringify(booksList));
            console.log("bookIndexMap",bookIndexMap);
            responseObj.responseData=booksList;
            res.json(responseObj);
        }else{
            responseObj.error=true;
            responseObj.errorMsg="No Data found.";
            res.json(responseObj);
        }
    });
}
module.exports.getAllBooks=getAllBooks;
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
        if(parentBookObj.isbn){
            query+='n.isbn =~ ".*'+parentBookObj.isbn+'.*" AND ';
        }else{
            query+='n.isbn =~ ".*'+requestObj.searchText+'.*" OR ';
        }
        query+='n.publisher =~ ".*'+requestObj.searchText+'.*" OR ';
        query+='n.categoryName =~ ".*'+requestObj.searchText+'.*" ';
        query+='RETURN n';
    }else if(requestObj.userDetails.regID || requestObj.userDetails.firstName || requestObj.userDetails.lastName || requestObj.userDetails.middleName || requestObj.userDetails.class || requestObj.userDetails.section){
        var tempQuery=[];
        query='MATCH ';
        var classCondition=[];
        if(requestObj.userDetails.class && requestObj.userDetails.section){
            classCondition.push('c.class="'+requestObj.userDetails.class+'"');
            classCondition.push('c.section="'+requestObj.userDetails.section+'"')
            query+=' (c:Class) <-[r2:STUDENT_OF]-';
        }
        query+='(u:User)-[r:ISSUED_TO]-(cb:ChildBook) WHERE ';
        requestObj.userDetails.regID?tempQuery.push('u.regID="'+requestObj.userDetails.regID+'"'):null;
        requestObj.userDetails.userName?tempQuery.push('u.userName="'+requestObj.userDetails.userName+'"'):null;
        requestObj.userDetails.firstName?tempQuery.push('u.firstName="'+requestObj.userDetails.firstName+'"'):null;
        requestObj.userDetails.lastName?tempQuery.push('u.lastName="'+requestObj.userDetails.lastName+'"'):null;
        requestObj.userDetails.middleName?tempQuery.push('u.middleName="'+requestObj.userDetails.middleName+'"'):null;


        requestObj.userDetails.section?classCondition.push('c.section="'+requestObj.userDetails.section+'"'):null;
        if(classCondition.length>0){
            tempQuery.push(' ('+classCondition.join(' AND ')+') ');
        }
        if(tempQuery.length>0){
            query+=' ('+tempQuery.join(" OR ")+' )';
        }
        query+=' AND cb.bookStatus="Unavailable" RETURN u,r,cb';

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
/* addParentBook - DB Insert */
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
    module.exports.addChildBook=function(res, childBook,isbn){
        var childBookObj=childBook;
        var isbn=isbn;
        var query;

    console.log("addChildBook Server : ", childBookObj);
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
    
    function insertCompleteBook(requestObj,res){
//	Match (n:ParentBook) where n.isbn='123456789X';
    try{
        var responseObj = new Utils.Response();
        var defaultErrorMsg="Failed to add Book. Please contact administrator.";

        var findParentISBN = 'MATCH (n:ParentBook {isbn:"123"}) RETURN n';
        
        db.cypherQuery("findParentISBN",findParentISBN, function(err, result) {
            console.log("findParentISBN",err, result)
            if(err || !result || (result && result.data && result.data.length==0)){
            	var parentBookDetails=fillParentBookValues(requestObj.parentbook);
                //create Parent node
                db.insertNode(parentBookDetails, ["ParentBook"], function(err, addbookReply) {
                    console.log("create ParentBook node", err,addbookReply);
                    if (!err && addbookReply && addbookReply.hasOwnProperty('_id')) {
                        var insertionStatus={
                            "ParentBook-[CHILDBOOK_OF]-ChildBook":false,
                        }
                        var parentBookNodeID=addbookReply._id;
                        console.log("parentBookNodeID",parentBookNodeID);

                        //create childBook node
                        var childBookDetails=fillChildBookValues(requestObj.children[0]);
                        db.insertNode(requestObj.children[0], ["ChildBook"], function(err, addChildReply) {
                            console.log("create ChildBook node", err,addChildReply);
                            if (!err && addChildReply && addChildReply.hasOwnProperty('_id')) {
                                if(!err){
                                    insertionStatus["ChildBook"]=true;
                                }
                                var childBookNodID=addChildReply._id;
                                //associate childBook to ParentBook                                
//                                db.insertRelationship(parentBookNodeID,childBookNodID,"PARENTBOOK_OF",{},function(err,resultRel){
                                db.insertRelationship(childBookNodID,parentBookNodeID,"CHILDBOOK_OF",{},function(err,resultRel){
                                		console.log("associate childBook to ParentBook",err,resultRel);
                                    if(!err){
                                        insertionStatus["ParentBook-[CHILDBOOK_OF]-ChildBook"]=true;
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
        });//findParentISBN end
    }catch(e){
        console.log("insertCompleteBook",e);
        Utils.defaultErrorResponse(res,defaultErrorMsg);
    }
};
module.exports.insertCompleteBook=insertCompleteBook;
function fillParentBookValues(parentBookDetails){
    var currentTimestamp=(new Date()).getTime();
//    parentBookDetails.updatedAt=currentTimestamp;
//    parentBookDetails.createdAt=currentTimestamp;
    parentBookDetails.softDelete="FALSE";
    return parentBookDetails;
};
function fillChildBookValues(childBookDetails){
    var currentTimestamp=(new Date()).getTime();
    childBookDetails.updatedDate=currentTimestamp;
    childBookDetails.createdDate=currentTimestamp;
    childBookDetails.softDelete="FALSE";
    return childBookDetails;
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
/*
 * Get Child Book details for selected Book id of Parent Book
 */
module.exports.childBookDetailsbyIsbnBookId=function(res,bookId){
//    var query='Start n=node('+bookId+') WITH n MATCH (n)-[r:ISSUED_TO]->(b) RETURN b,r';
//	var query='match (p:ParentBook) -[r:PARENTBOOK_OF]->(c:ChildBook) where p.isbn ="234567890X" and c.bookId="6" return p,c';
	var query='match (p:ParentBook) -[r:PARENTBOOK_OF]->(c:ChildBook) where p.isbn ="234567890X" and c.bookId="6" return c';
    db.cypherQuery(query,function(err,reply){
        var responseObj=new Utils.Response();
        console.log("childBookDetailsbyIsbnBookId",query,err);
        if(!err){
            responseObj.responseData=reply;
            res.json(responseObj);
        }else{
            responseObj.error=true;
            responseObj.errorMsg="Error in getting Book details.";
            res.json(responseObj);
        }
    });
}


module.exports.searchUser=function(res,searchText,schoolId){
    console.log("searchUser",searchText);
    var responseObj=new Utils.Response();
    var searchTextArr=searchText.split(",");
    var query='Match (s:School{schoolId:"'+schoolId+'"})(n:User) where ';
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

module.exports.getBookPOJO=function(res){
    var parentBook=new BookClass.ParentBook();
    var childBook=new BookClass.ChildBook();
    var book=new BookClass.CompleteBook(parentBook,childBook);
    res.json(book);
}