/**
 * Created by ravikant on 11/8/14.
 */
var Utils = require("../../common/Utils/Utils.js");
var BookClass = require("./bookClass.js");
var db=Utils.getDBInstance();
//getAllBooks(null,'SPHSS:school:2014:452001');
function getLibrary(schoolID,req){
//    var query='MATCH (lib)-[:LIBRARY_OF]->(school{schoolId:"'+schoolID+'"}) RETURN lib';
	var query='MATCH (lib)-[:LIBRARY_OF]->(school{schoolId:"SPHSS:school:2014:452001"}) RETURN lib';
    db.cypherQuery(query,function(err,reply){
        console.log("getLibrary",err,reply,query);
        if(reply && reply.data && reply.data.length==1){
            req.session.currentLibrary=reply.data[0];
            console.log("req.session.currentLibrary",req.session.currentLibrary);
        }
    });
}
module.exports.getLibrary=getLibrary;
function getAllBooks(res,schoolID){
//    var queryAllBooks='MATCH (c)-[:CHILDBOOK_OF]->pb-[:BELONGS_TO]->(lib)-[:LIBRARY_OF]->(school{schoolId:"'+schoolID+'"}) RETURN pb,c  LIMIT 20';
//	 var queryAllBooks='MATCH (c:ChildBook)-[:CHILDBOOK_OF]->(pb:ParentBook)-[:BELONGS_TO]->(lib:Library)-[:LIBRARY_OF]->(school:School) where school.schoolId="'+schoolID+'" RETURN pb,c  LIMIT 20';
	var queryAllBooks='MATCH (c:ChildBook)-[:CHILDBOOK_OF]->(pb:ParentBook)-[:BELONGS_TO]->(lib:Library)-[:LIBRARY_OF]->(school:School) where school.schoolId="'+schoolID+'" and pb.softDelete=false and c.softDelete=false  RETURN pb,c  order by pb.category LIMIT 50';
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
//        query='Match (n:ParentBook) where ';
    	query='Match (c:ChildBook)-[:CHILDBOOK_OF]->(n:ParentBook) where ';
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
        query+='RETURN n,c';
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
//        query='Match (n:ParentBook) where n.bookTitle =~ ".*'+parentBookObj.bookTitle+'.*" AND n.authorName =~ ".*'+parentBookObj.authorName+'.*" RETURN n';
    	query='Match (c:ChildBook)-[:CHILDBOOK_OF]->(n:ParentBook) where n.bookTitle =~ ".*'+parentBookObj.bookTitle+'.*" AND n.authorName =~ ".*'+parentBookObj.authorName+'.*" RETURN n,c';
    }
    console.log("parentBookObj",parentBookObj);

    var responseObj=new Utils.Response();
    db.cypherQuery(query,function(err,reply){
        console.log("searchBooks",query,err, reply);
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
//        if(!err){
//            responseObj.responseData=reply;
//            res.json(responseObj);
//        }else{
//            responseObj.error=true;
//            responseObj.errorMsg="No Data found.";
//            res.json(responseObj);
//        }
    });
}
/* addParentBook - DB Insert */
function addParentBook(libraryObj,parentBookObj,res){
    try{
        var responseObj=new Utils.Response();
        db.insertNode(parentBookObj,["ParentBook"],function(err,addParentBookReply){
            console.log("addParentBookReply",err,addParentBookReply);
            if(!err){
                var parentBookNodeID=addParentBookReply._id;
//                db.insertRelationship(libraryObj._id,parentBookNodeID,"BELONGS_TO",{},function(err,resultRel){
                db.insertRelationship("1",parentBookNodeID,"BELONGS_TO",{},function(err,resultRel){
                    console.log("associate parent book to library",err,resultRel);
                    if(!err){
                        responseObj.responseData=parentBookNodeID;
                        res.json(responseObj);
                    }else{
                        Utils.defaultErrorResponse(res,defaultErrorMsg);
                    }
                });
            }else{
                responseObj.error=true;
                responseObj.errorMsg="Failed to add main book.";
                res.json(responseObj);
            }
        });
    }catch(e){
        console.log("addParentBook",e);
        responseObj.error=true;
        responseObj.errorMsg="Failed to add main book.";
        res.json(responseObj);
    }
}
module.exports.addParentBook=addParentBook;

/* addChildBook - DB Insert - Start*/
function addChildBook(res, childBookObj,parentBookNodeID){
    console.log("addChildBook Server : ", childBookObj);
    var defaultErrorMsg="Failed to this Book copy. Please contact administrator.";
    var responseObj=new Utils.Response();
    db.insertNode(childBookObj, ["ChildBook"], function(err, addChildReply) {
        console.log("create ChildBook node", err,addChildReply);
        if (!err && addChildReply && addChildReply.hasOwnProperty('_id')) {
            if(!err){
                var childBookNodID=addChildReply._id;
                db.insertRelationship(parentBookNodeID,childBookNodID,"CHILDBOOK_OF",{},function(err,resultRel){
                    console.log("associate childBook to ParentBook",err,resultRel);
                    if(!err){
                        responseObj.responseData=childBookNodID;
                        res.json(responseObj);
                    }else{
                        Utils.defaultErrorResponse(res,defaultErrorMsg);
                    }
                });
            }else{
                Utils.defaultErrorResponse(res,defaultErrorMsg);
            }
        }else{
            Utils.defaultErrorResponse(res,defaultErrorMsg);
        }
    });
}
module.exports.addChildBook=addChildBook;
/* addChildBook - DB Insert - End*/
    
function insertCompleteBook(requestObj,res,schoolID,libraryObj){
    try{
        var responseObj = new Utils.Response();
        var defaultErrorMsg="Failed to add Book. Please contact administrator.";

        var findParentISBN = 'MATCH (pb{isbn:"'+requestObj.parentbook.isbn+'"})-[:BELONGS_TO]->(lib)-[:LIBRARY_OF]->(school{schoolId:"'+schoolID+'"}) RETURN pb,lib';
        console.log("insertCompleteBook");
        //parent book addition
        if(libraryObj && requestObj.parentbook.hasOwnProperty('_id') && requestObj.parentbook._id!=null){
        	console.log("requestObj.parentbook.hasOwnProperty : ",requestObj.parentbook._id);
            db.cypherQuery(findParentISBN, function(err, result) {
                console.log("findParentISBN",err, result);
                if(!err || !result || (result && result.data && result.data.length==0)){
                    var parentBookDetails=fillParentBookValues(requestObj.parentbook);
                    addParentBook(libraryObj,parentBookDetails,res);
                }
            });
        }
        else{ //child Book Addition
            var childLen=requestObj.children.length;
            if(childLen>0 && requestObj.parentbook.hasOwnProperty('_id') && requestObj.parentbook._id ){
                var childBookObj=requestObj.children[childLen-1];
                if(!(childBookObj.hasOwnProperty('_id') && childBookObj._id!=null)){
                    childBookObj=fillChildBookValues(childBookObj);
                    addChildBook(res, childBookObj,parentBookNodeID);
                }else{
                    Utils.defaultErrorResponse(res,childBookObj.bookId+" is already added.");
                }
            }
        }
    }catch(e){
        console.log("insertCompleteBook",e);
        Utils.defaultErrorResponse(res,defaultErrorMsg);
    }
};
module.exports.insertCompleteBook=insertCompleteBook;
function fillParentBookValues(parentBookDetails){
    var currentTimestamp=(new Date()).getTime();
    parentBookDetails.edition=parseInt(parentBookDetails.edition,10);
    parentBookDetails.bookCopies=parseInt(parentBookDetails.bookCopies,10);
    if(isNaN(parentBookDetails.bookCopies))
        parentBookDetails.bookCopies=0;

    if(isNaN(parentBookDetails.edition))
        parentBookDetails.edition=0;
    parentBookDetails.softDelete=false;
    return parentBookDetails;
};
function fillChildBookValues(childBookDetails){
    var currentTimestamp=(new Date()).getTime();
    childBookDetails.updatedDate=currentTimestamp;
    childBookDetails.createdDate=currentTimestamp;
    childBookDetails.softDelete=false;
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

/*
 * Update ParentBook details
 */
module.exports.updateParentBook = function(parentBook,loggedInUser,schoolID,res) {
	  try{
	        var responseObj = new Utils.Response();
	        var defaultErrorMsg="Failed to update Book. Please contact administrator.";
	        var findParentISBN = 'MATCH (pb{isbn:"' + parentBook.isbn + '"})-[:BELONGS_TO]->(lib)-[:LIBRARY_OF]->(school{schoolId:"'+schoolID+'"}) RETURN pb';

	        db.cypherQuery(findParentISBN, function(err, result) {
	            console.log("findParentISBN",err, result)
	            if(err || !result || (result && result.data && result.data.length==1)){
                    var currentTimestamp=(new Date()).getTime();
                    parentBook.updatedAt=currentTimestamp;
                    db.updateNode(parentBook._id, parentBook, function(err, node){
                        if(err) throw err;
                        node === true?console.log("Book updated"):console.log("Failed to update Book details");
                        res.json(responseObj)
                    });

	            }else{
	                Utils.defaultErrorResponse(res,defaultErrorMsg);
	            }
	        });//findParentISBN end
	    }catch(e){
	        console.log("updateParentBook",e);
	        Utils.defaultErrorResponse(res,defaultErrorMsg);
	    }
}

/*
 * Delete ParentBook details  
 */
module.exports.deleteParentBook = function(parentBook,loggedInUser,schoolID,res) {
	  try{
	        var responseObj = new Utils.Response();
	        var defaultErrorMsg="Failed to Delete Book. Please contact administrator.";
	        var findParentISBN = 'MATCH (pb{isbn:"' + parentBook.isbn + '"})-[:BELONGS_TO]->(lib)-[:LIBRARY_OF]->(school{schoolId:"'+schoolID+'"}) RETURN pb';

	        db.cypherQuery(findParentISBN, function(err, result) {
	            console.log("findParentISBN",err, result)
	            if(err || !result || (result && result.data && result.data.length==1)){
                    var currentTimestamp=(new Date()).getTime();
                    parentBook.updatedAt=currentTimestamp;
                    parentBook.softDelete="true";
                    db.updateNode(parentBook._id, parentBook, function(err, node){
                        if(err) throw err;
                        node === true?console.log("Book deleted"):console.log("Failed to delete Book details");
                        res.json(responseObj)
                    });

	            }else{
	                Utils.defaultErrorResponse(res,defaultErrorMsg);
	            }
	        });//findParentISBN end
	    }catch(e){
	        console.log("deleteParentBook",e);
	        Utils.defaultErrorResponse(res,defaultErrorMsg);
	    }
}

/*
 * Update ChildBook details
 */
module.exports.updateChildBook = function(book,loggedInUser,schoolID,res) {
	  try{
	        var responseObj = new Utils.Response();
	        var childBook=book.children[0];
	        var defaultErrorMsg="Failed to update Book Copy. Please contact administrator.";
//	        match (n:ParentBook{isbn:"123456789X"}) -[r:CHILDBOOK_OF]- (j:ChildBook{bookId:"1"}) return n,j;
	        var findParentISBN = 'MATCH (s:School) <-[r1:LIBRARY_OF]- (l:Library) <-[r2:BELONGS_TO]- (p:ParentBook)<-[r3:CHILDBOOK_OF]-(c:ChildBook) where  s.schoolId="'+schoolID+'" and l.id="1" and p.isbn="'+ book.parentbook.isbn +'" and c.bookId="'+childBook.bookId+'" return c';
//	        var findParentISBN = 'MATCH (pb{isbn:"' + book.parentbook.isbn + '"})-[:BELONGS_TO]->(lib)-[:LIBRARY_OF]->(school{schoolId:"'+schoolID+'"}) RETURN pb';
//	        var findParentISBN  = 'MATCH (n:ParentBook{isbn:"' + book.parentbook.isbn + '"}) -[r:CHILDBOOK_OF]- (j:ChildBook{bookId:"'+childBook.bookId+'"}) return j';
	        
	        db.cypherQuery(findParentISBN, function(err, result) {
	            console.log("findParentISBN",err, result)
	            if(err || !result || (result && result.data && result.data.length==1)){
                    var currentTimestamp=(new Date()).getTime();
                    childBook.updatedAt=currentTimestamp;
                    db.updateNode(childBook._id, childBook, function(err, node){
                        if(err) throw err;
                        node === true?console.log("Book Copy updated"):console.log("Failed to update Book Copy");
                        res.json(responseObj)
                    });

	            }else{
	                Utils.defaultErrorResponse(res,defaultErrorMsg);
	            }
	        });//findParentISBN end
	    }catch(e){
	        console.log("updateChildBook",e);
	        Utils.defaultErrorResponse(res,defaultErrorMsg);
	    }
}

/*
 * Delete ChildBook details  
 */
module.exports.deleteChildBook = function(book,loggedInUser,schoolID,res) {
	  try{
	        var responseObj = new Utils.Response();
	        var childBook=book.children[0];
	        var defaultErrorMsg="Failed to Delete Book Copy. Please contact administrator.";
//	        var findParentISBN = 'MATCH (pb{isbn:"' + parentBook.isbn + '"})-[:BELONGS_TO]->(lib)-[:LIBRARY_OF]->(school{schoolId:"'+schoolID+'"}) RETURN pb';
//	        var findParentISBN  = 'MATCH (n:ParentBook{isbn:"' + book.parentbook.isbn + '"}) -[r:CHILDBOOK_OF]- (j:ChildBook{bookId:"'+childBook.bookId+'"}) return j';
	        var findParentISBN = 'MATCH (s:School) <-[r1:LIBRARY_OF]- (l:Library) <-[r2:BELONGS_TO]- (p:ParentBook)<-[r3:CHILDBOOK_OF]-(c:ChildBook) where  s.schoolId="'+schoolID+'" and l.id="1" and p.isbn="'+ book.parentbook.isbn +'" and c.bookId="'+childBook.bookId+'" return c';
	        
	        db.cypherQuery(findParentISBN, function(err, result) {
	            console.log("findParentISBN",err, result)
	            if(err || !result || (result && result.data && result.data.length==1)){
                    var currentTimestamp=(new Date()).getTime();
                    childBook.updatedAt=currentTimestamp;
                    childBook.softDelete="true";
                    db.updateNode(childBook._id, childBook, function(err, node){
                        if(err) throw err;
                        node === true?console.log("Book Copy deleted"):console.log("Failed to delete Book Copy");
                        res.json(responseObj)
                    });

	            }else{
	                Utils.defaultErrorResponse(res,defaultErrorMsg);
	            }
	        });//findParentISBN end
	    }catch(e){
	        console.log("deleteParentBook",e);
	        Utils.defaultErrorResponse(res,defaultErrorMsg);
	    }
}
/* Match ISBN is available or notr */
module.exports.searchISBN = function(isbn,loggedInUser,schoolID,res) {
//	console.log("is ISBN exist ?", requestObj);
	var responseObj = new Utils.Response();
//    var query='Match (s:School{schoolId:"'+schoolID+'"})<-[:USER_OF]-(n:User{regID:"' + requestObj.regIdText + '"}) RETURN n';
	var query ='MATCH (n:ParentBook{isbn:"' + isbn + '"}) return n';

	console.log("ISBN ID availability query :", query);
	db.cypherQuery(query, function(err, reply) {
		console.log("searchISBN :", query, err, reply);
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