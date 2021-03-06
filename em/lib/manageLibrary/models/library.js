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
function prepareBooksListResponse(err,reply,res){
    var responseObj=new Utils.Response();
    if(!err && reply && reply.data && reply.data.length>0){
        var booksList=[];
        var bookIndexMap={};
        for(var i= 0,len=reply.data.length;i<len;i++){
            var row=reply.data[i];// parent=row[0],child=row[1]
//            console.log("Prepare book rows : "+row);
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
}
function getAllBooks(res,schoolID,user){
//    var queryAllBooks='MATCH (c)-[:CHILDBOOK_OF]->pb-[:BELONGS_TO]->(lib)-[:LIBRARY_OF]->(school{schoolId:"'+schoolID+'"}) RETURN pb,c  LIMIT 20';
//	 var queryAllBooks='MATCH (c:ChildBook)-[:CHILDBOOK_OF]->(pb:ParentBook)-[:BELONGS_TO]->(lib:Library)-[:LIBRARY_OF]->(school:School) where school.schoolId="'+schoolID+'" RETURN pb,c  LIMIT 20';
	var queryAllBooks;
    if(user.userType=='1'){
        queryAllBooks='MATCH (c:ChildBook)-[:CHILDBOOK_OF]->(pb:ParentBook)-[:BELONGS_TO]->(lib:Library)-[:LIBRARY_OF]->(school:School) where school.schoolId="'+schoolID+'" and pb.softDelete=false and c.softDelete=false and pb.createdBy="'+user.userName+'" RETURN pb,c, lib  order by pb.category, , pb.bookTitle LIMIT 50';
    }else{
        queryAllBooks='MATCH (c:ChildBook)-[:CHILDBOOK_OF]->(pb:ParentBook)-[:BELONGS_TO]->(lib:Library)-[:LIBRARY_OF]->(school:School) where school.schoolId="'+schoolID+'" and pb.softDelete=false and c.softDelete=false  RETURN pb,c, lib  order by pb.category, pb.bookTitle LIMIT 50';
    }
    var responseObj=new Utils.Response();
    db.cypherQuery(queryAllBooks,function(err,reply){
        console.log(err,queryAllBooks);
        prepareBooksListResponse(err,reply,res);
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
module.exports.searchBooks=function(requestObj,schoolID,res){
    var parentBookObj=requestObj.parentBook;
    var childBookObj=requestObj.childBook;
    var query;
    console.log("requestObj.searchText : ",requestObj);
    if(requestObj.searchText!=""){
    	query=getGlobalBookSearchQuery(requestObj,schoolID);
    }else{
        query=getAdvBookSearchQuery(requestObj,schoolID);
    }
    console.log("searchBooks query",query);

    var responseObj=new Utils.Response();
    db.cypherQuery(query,function(err,reply){
        console.log("searchBooks",err, reply);
        prepareBooksListResponse(err,reply,res);
    });
}
function getGlobalBookSearchQuery(requestObj,schoolID){
    var searchText=requestObj.searchText;
    var query='MATCH (cb:ChildBook)-[:CHILDBOOK_OF]->(pb:ParentBook)-[:BELONGS_TO]->(lib:Library)-[:LIBRARY_OF]->(school:School) where school.schoolId="'+schoolID+'" and pb.softDelete=false and cb.softDelete=false ';
    var tempQuery=[];
    tempQuery.push('pb.bookTitle =~ ".*'+searchText+'.*" ');
    tempQuery.push('pb.authorName =~ ".*'+searchText+'.*" ');
    tempQuery.push('pb.isbn =~ ".*'+searchText+'.*" ');
    tempQuery.push('pb.categoryName =~ ".*'+searchText+'.*" ');
    !isNaN(parseInt(searchText,10))?tempQuery.push(' cb.bookId ='+parseInt(searchText,10)+' '):null;

    query+=" AND "+tempQuery.join(" OR ");
    query+=' RETURN pb,cb  order by pb.category LIMIT 50';
    return query;
}

function getAdvBookSearchQuery(requestObj,schoolID){
    var tempQuery=[];
    var query='MATCH (cb:ChildBook)-[:CHILDBOOK_OF]->(pb:ParentBook)-[:BELONGS_TO]->(lib:Library)-[:LIBRARY_OF]->(school:School) where school.schoolId="'+schoolID+'" and pb.softDelete=false and cb.softDelete=false ';
    //parent book condition
    requestObj.parentBook.bookTitle!=""?tempQuery.push(' pb.bookTitle =~ ".*'+requestObj.parentBook.bookTitle+'.*" '):null;
    requestObj.parentBook.authorName!=""?tempQuery.push(' pb.authorName =~ ".*'+requestObj.parentBook.authorName+'.*" '):null;
    requestObj.parentBook.isbn!=""?tempQuery.push(' pb.isbn =~ ".*'+requestObj.parentBook.isbn+'.*" '):null;
    //child book condition
    !isNaN(parseInt(requestObj.childBook.bookId,10))?tempQuery.push(' cb.bookId ='+parseInt(requestObj.childBook.bookId,10)+' '):null;
    tempQuery.length>0?query+=" AND "+tempQuery.join(" OR "):null;
    //query+=tempQuery.join(' AND ');
    tempQuery=[];
    if(requestObj.userDetails.regID || requestObj.userDetails.firstName || requestObj.userDetails.lastName || requestObj.userDetails.middleName || requestObj.userDetails.class || requestObj.userDetails.section){
        query+='WITH cb,pb MATCH ';
        var classCondition=[];
        if(requestObj.userDetails.class!=''){
            var classObj=JSON.parse(requestObj.userDetails.class);
            classCondition.push('c.class="'+classObj.name+'"');
            classCondition.push('c.section="'+classObj.section+'"')
            query+=' (c:Class) <-[r2:STUDENT_OF]-';
        }
        query+='(u:User)-[r:ISSUED_TO]-(cb)  ';
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
            query+='WHERE ('+tempQuery.join(" OR ")+' )';
            query+=' AND cb.bookStatus="Unavailable" ';
        }else{
            query+='  cb.bookStatus="Unavailable" ';
        }

        query+=' RETURN pb,cb,r  order by pb.category LIMIT 50';
    }else{
        query+='RETURN pb,cb  order by pb.category LIMIT 50';
    }
    return query;

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
    
function insertCompleteBook(requestObj,res,schoolID,libraryObj,loggedInUser){
    try{
        var responseObj = new Utils.Response();
        var AddedParentBook="";
        var childBookArray=[];
        var defaultErrorMsg="Failed to add Book. Please contact administrator.";
        var parentBookNodeID="";
        var childLen=requestObj.children.length;
        var findParentISBN = 'MATCH (pb{isbn:"'+requestObj.parentbook.isbn+'"})-[:BELONGS_TO]->(lib)-[:LIBRARY_OF]->(school{schoolId:"'+schoolID+'"}) RETURN pb,lib';
        console.log("insertCompleteBook");
        
//        Check whether parent book is having _id property or not 
        if(libraryObj && requestObj.parentbook.hasOwnProperty('_id') && requestObj.parentbook._id!=null){
        	console.log("requestObj.parentbook.hasOwnProperty : ",requestObj.parentbook._id);
        	
//        check if parentBook's ISBN exists or not
            db.cypherQuery(findParentISBN, function(err, result) {
                console.log("findParentISBN : ",findParentISBN ,err, result);
//                if parentBook's ISBN doesn't exists, proceed to insert the parent book
                if(!err  && (result && result.data && result.data.length==0)){
                
                    var parentBookDetails=fillParentBookValues(requestObj.parentbook);
                    parentBookDetails.createdBy=loggedInUser.basicDetails.userName;
//                insert the parentBook
                    db.insertNode(parentBookDetails,["ParentBook"],function(err,addParentBookReply){
                        console.log("addParentBookReply",err,addParentBookReply, addParentBookReply._id);
//                        if no error while adding parent Book
                        if(!err){
                           parentBookNodeID=addParentBookReply._id;
                           console.log("parentBookNodeID : ",parentBookNodeID);
                            db.insertRelationship(parentBookNodeID,libraryObj,"BELONGS_TO",{},function(errParentLib,resultParentLibRel){
//                            db.insertRelationship(parentBookNodeID,21285, "BELONGS_TO",{},function(errParentLib,resultParentLibRel){
                            	if(!errParentLib){
                            		console.log("associate parent book to library",errParentLib,resultParentLibRel, "childLen : ",childLen, " requestObj ",requestObj);	
                            		AddedParentBook=addParentBookReply;
                            			if(parentBookNodeID!="" && childLen>0){ 
                            			
                            			//for loop start
                            			for(var i=0;i<childLen;i++){
                                             var childBookObj=requestObj.children[i];
                                           console.log("childBook multiple ADD : childBookObj :",childBookObj);
                                             if((childBookObj.hasOwnProperty('_id') && childBookObj._id!=null)){
                                                 childBookObj=fillChildBookValues(childBookObj);
                                                 childBookObj.createdBy=loggedInUser.basicDetails.userName;
                                                 db.insertNode(childBookObj, ["ChildBook"], function(errChildAdd, addChildReply) {
                                                     console.log("create ChildBook node", err,addChildReply);
                                                     if (!errChildAdd && addChildReply && addChildReply.hasOwnProperty('_id')) {
                                                             var childBookNodID=addChildReply._id;
                                                             
                                                             db.insertRelationship(childBookNodID,parentBookNodeID,"CHILDBOOK_OF",{},function(errParentChild,resultRel){
                                                                 console.log("associate childBook to ParentBook",err,resultRel);
                                                                 if(!errParentChild){
                                                                	 childBookArray.push(addChildReply);
                                                                	 console.log("addChildReply :#########",addChildReply," responceArray $$$$",childBookArray);
                                                                 }else{
                                                                	 
                                                                     Utils.defaultErrorResponse(res,"Failed to Add Book Copy for given ISBN");
                                                                 }
                                                             });
                                                     }else{
                                                         Utils.defaultErrorResponse(res,"Failed to add Book Copy");
                                                     }
                                                 });
                                             }else{
                                                 Utils.defaultErrorResponse(res,childBookObj.bookId+" is already added.");
                                             }
                            			}
                                             //for loop end
                                    }
                            		var addedBook = new BookClass.CompleteBook(AddedParentBook,childBookArray);
                            		responseObj.responseData=addedBook;
                                    res.json(responseObj);
                            	}else{
                                    Utils.defaultErrorResponse(res,"Failed to add given book ISBN into the library.");
                                }
                            });
                        }else{
                            Utils.defaultErrorResponse(res,"Failed to add Book ISBN.");
                        } 
                    });
                
                }else {
                	Utils.defaultErrorResponse(res,"Given ISBN is already exists."); 
                	
                }
            });
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
    parentBookDetails.createdAt=currentTimestamp;
    return parentBookDetails;
};
function fillChildBookValues(childBookDetails){
    var currentTimestamp=(new Date()).getTime();
    childBookDetails.createdAt=currentTimestamp;
    
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
	console.log("requestObj : ",requestObj);
    var responseObj=new Utils.Response();
    db.updateRelationship(requestObj.issueBookObj._id,requestObj.issueBookObj,function(err,reply){
        if(!err){
            requestObj.book.childBook.bookStatus="Available";
            db.updateNode(requestObj.book.childBook._id, requestObj.book.childBook, function(err, node){
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
module.exports.getIssuedBookDetails=function(res,bookNodeId){
    var query='Start n=node('+bookNodeId+') WITH n MATCH (n)-[r:ISSUED_TO]->(b) RETURN b,r';
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
	var query='match (p:ParentBook) -[r:CHILDBOOK_OF]->(c:ChildBook) where p.isbn ="234567890X" and c.bookId="6" return c';
	
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
                    parentBook.updatedBy=loggedInUser.basicDetails.userName;
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
                    parentBook.updatedBy=loggedInUser.basicDetails.userName;
                    parentBook.softDelete=true;
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
                    childBook=parseChildBook(childBook);
                    childBook.updatedBy=loggedInUser.basicDetails.userName;
                    
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
function parseChildBook(childBookDetails){
    var currentTimestamp=(new Date()).getTime();
    childBookDetails.updatedAt=currentTimestamp;
//    var pubhDt=new Date(childBookDetails.publicationDate);
//    console.log("childBookDetails.publicationDate : ",new Date(childBookDetails.publicationDate), Date.UTC(pubhDt.getYear(),pubhDt.getMonth(),pubhDt.getDate()));
//    console.log("Publish Dt : ", childBookDetails.publicationDate, Date.UTC(publishDt.getYear(),publishDt.getMonth(),publishDt.getDate(),publishDt.getHours(),publishDt.getMinutes(), publishDt.getSeconds()));
    
    var publishDt=Date.parse(childBookDetails.publicationDate);
    (publishDt && !isNaN(publishDt))?childBookDetails.publicationDate=publishDt:"";

    var purDt=Date.parse(childBookDetails.purchaseDate);
    (purDt && !isNaN(purDt))?childBookDetails.purchaseDate=purDt:"";

//    console.log("Publish Dt : ", publishDt, childBookDetails.publicationDate);
    return childBookDetails;
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
                    childBook.softDelete=true;
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
//    var query='Match (s:School{schoolId:"'+schoolId+'"})(n:User) where ';
    var query='MATCH (s:School{schoolId:"'+schoolId+'"}) <-[r1:USER_OF]-(n:User) where ';
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