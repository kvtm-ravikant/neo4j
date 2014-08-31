/**
 * Created by ravikant on 11/8/14.
 */
var fs=require("fs");
var libraryMS=require('../models/library.js');
var Utils=require("../../common/Utils/Utils.js");
var neo4j=require("node-neo4j");
var db=new neo4j("http://localhost:7474");
var parentBookDD=require("../../common/models/docType.js");

var acceptableDataTypes=["string","number","boolean","date"];
var acceptableLabels=["parentBook","childBook"]
var jsonData=[["parentBook:isbn:string:primaryKey","parentBook:bookTitle:string","parentBook:authorName:string","parentBook:edition:number","parentBook:bindingType:string","parentBook:publisher:string","parentBook:categoryName:string","parentBook:language:string","parentBook:coverImagePath:string","parentBook:bibLevel:string","parentBook:docType:string","parentBook:bookCopies:number","parentBook:softDelete:boolean","childBook:bookId:string:primaryKey","childBook:barCode:string","childBook:acqMode:string","childBook:publicationDate:date","childBook:purchaseDate:date","childBook:currencyType:string","childBook:pricePaid:number","childBook:outletName:string","childBook:createdDate:date","childBook:description:string","childBook:bookStatus:string","childBook:location:string","childBook:materialAccompanied:string","childBook:starRating:number","childBook:tag:string","childBook:updatedDate:date","childBook:frequency:string","childBook:freqReminder:boolean","childBook:softDelete:boolean","parentBook->childBook"],["123456789X","IIT Physics","H C Verma","10","Hard Bound","Pustak Mahal","Physics","English","","M","TB","5","FALSE","1","","P","1/1/2014","4/24/2014","Rupees","400","Jain Stores","7/12/2014","This book is a course book for IIT preparation for Physics subject.","Available","\"1-5-3\"","","5","IIT","8/12/2014","0","FALSE","FALSE","parentBookOf"],["123456790X","IIT Physics","H C Verma","10","Hard Bound","Pustak Mahal","Physics","English","","M","TB","5","FALSE","2","","P","1/1/2014","4/24/2014","Rupees","400","Jain Stores","7/12/2014","This book is a course book for IIT preparation for Physics subject.","Available","\"1-5-3\"","","5","IIT","8/19/2014","0","FALSE","FALSE","parentBookOf"],["123456791X","IIT Physics","H C Verma","10","Hard Bound","Pustak Mahal","Physics","English","","M","TB","5","FALSE","3","","P","1/1/2014","4/24/2014","Rupees","400","Jain Stores","7/12/2014","This book is a course book for IIT preparation for Physics subject.","Available","\"1-5-3\"","","5","IIT","8/19/2014","0","FALSE","FALSE","parentBookOf"],["123456792X","IIT Physics","H C Verma","10","Hard Bound","Pustak Mahal","Physics","English","","M","TB","5","FALSE","4","","P","1/1/2014","4/24/2014","Rupees","400","Jain Stores","7/12/2014","This book is a course book for IIT preparation for Physics subject.","Available","\"1-5-3\"","","5","IIT","8/19/2014","0","FALSE","FALSE","parentBookOf"],["123456793X","IIT Physics","H C Verma","10","Hard Bound","Pustak Mahal","Physics","English","","M","TB","5","FALSE","5","","P","1/1/2014","4/24/2014","Rupees","400","Jain Stores","7/12/2014","This book is a course book for IIT preparation for Physics subject.","Issued","\"1-5-3\"","","5","IIT","8/19/2014","0","FALSE","FALSE","parentBookOf"],["234567894X","Mathematics for Class XI","RD Sharma","2","Hard Bound","Dhanpat Rai","Mathematics","English","","M","TB","1","FALSE","6","","P","1/1/2014","7/22/2014","Rupees","345","Jain Stores","7/12/2014","This book is a course book for class 11th","Available","\"15-3-4\"","","5","Maths","8/19/2014","0","FALSE","FALSE","parentBookOf"],["345678901X","IIT Chemistry-II","PB Saxena","4","Hard Bound","Krishna Prakashan Media (P) Ltd.","Chemistry","English","","M","TB","2","FALSE","7","","P","1/1/2014","7/22/2014","Rupees","800","Jain Stores","7/12/2014","Chemistry reference book","Issued","\"12-3-9\"","","3","Objective book","8/19/2014","0","FALSE","FALSE","parentBookOf"],["345678901X","IIT Chemistry-II","PB Saxena","4","Hard Bound","Krishna Prakashan Media (P) Ltd.","Chemistry","English","","M","TB","2","FALSE","8","","P","1/1/2014","7/22/2014","Rupees","800","Jain Stores","7/12/2014","Chemistry reference book","Issued","\"12-3-9\"","","3","Objective book","8/19/2014","0","FALSE","FALSE","parentBookOf"],["456789012X","Five point some One","Chetan Bhagat","1","Hard Bound","R. R. Sheth & Co. Pvt. Ltd.","Novel","English","","M","TB","2","FALSE","9","","P","1/1/2014","7/22/2014","Rupees","135","Flipkart","7/12/2014","EnglishNovel","Available","\"16-4-9\"","","5","Chetan Bhagat","8/19/2014","0","FALSE","FALSE","parentBookOf"],["456789012X","Five point some One","Chetan Bhagat","1","Hard Bound","R. R. Sheth & Co. Pvt. Ltd.","Novel","English","","M","TB","2","FALSE","10","","P","1/1/2014","7/22/2014","Rupees","135","Flipkart","7/12/2014","EnglishNovel","Available","\"16-4-9\"","","5","Chetan Bhagat","8/19/2014","0","FALSE","FALSE","parentBookOf"],["567890123X","Five point some One","Chetan Bhagat","2","PaperBound","R. R. Sheth & Co. Pvt. Ltd.","Novel","English","","M","BK","1","FALSE","11","","P","1/1/2014","7/22/2014","Rupees","150","Flipkart","7/12/2014","EnglishNovel","Bindery","\"16-4-9\"","","5","Chetan Bhagat","8/19/2014","0","FALSE","FALSE","parentBookOf"]]

//'CREATE (n:ParentBook {isbn:"123456789X",bookTitle:"IIT Physics",authorName:"H C Verma",edition:10,bindingType:"Hard Bound",publisher:"Pustak Mahal",categoryName:"Physics",language:"English",coverImagePath:"",bibLevel:"M",docType:"TB",bookCopies:5,softDelete:"FALSE"}) return n';
//testMain(jsonData);
function testMain(jsonData){
    var columnMapReturnObj=getColumnObjMap(jsonData[0]);
    var nodeRelationshipDataObj=getDataObj(jsonData,columnMapReturnObj.returnData);
    console.log("nodeRelationshipData",nodeRelationshipDataObj);
    insertDataToDB(nodeRelationshipDataObj);
}
function insertDataToDB(nodeRelationshipData){
    for(var i= 0,len=nodeRelationshipData.length;i<len;i++){
        var dataObjTemp=nodeRelationshipData[i];
        //console.log(dataObjTemp);
        for(labelTemp in dataObjTemp){
            (function(label,dataObj){
                var node=dataObj[label];
                var key=node.__primaryColumn__;

                var query;
                if(label.indexOf('->')==-1){//nodes
                    var node=dataObj[label];
                    query=getNodeCreateQuery(label,node);
                    db.cypherQuery(query,function(err,reply){
                        if(reply.data.length==0){
                            db.insertNode(dataObj[label],[label],function(err,reply){
                            })
                        }
                    });
                }else{//relationship
                    var relationshipObj=dataObj[label];
                    var sourceObj=dataObj[relationshipObj.source];
                    var targetObj=dataObj[relationshipObj.target];
                    var sourceQuery=getNodeCreateQuery(relationshipObj.source,sourceObj);
                    var targetQuery=getNodeCreateQuery(relationshipObj.target,targetObj);
                    var sourceId,targetId;
                    db.cypherQuery(sourceQuery,function(err,sourceReply){
                        //console.log("sourceReply",err,sourceReply.data,sourceQuery);
                        if(sourceReply && sourceReply.data.length==1){
                            sourceId=sourceReply.data[0]._id;
                        }
                        db.cypherQuery(targetQuery,function(err,targetReply){
                            //console.log("targetReply",err,targetReply.data,targetQuery);
                            if(targetReply && targetReply.data.length==1){
                                targetId=targetReply.data[0]._id;
                            }
                            console.log("targetId && sourceId",targetId, sourceId);
                            if(targetId && sourceId){
                                var sourceKey=sourceObj.__primaryColumn__;
                                var targetKey=targetObj.__primaryColumn__;
                                var relationQuery='MATCH (s:'+relationshipObj.source+' { '+sourceKey+':"'+sourceObj[sourceKey]+'" })-[r:'+relationshipObj.relationShipType+']-(t:'+relationshipObj.target+' { '+targetKey+':"'+targetObj[targetKey]+'" }) return r';
                                console.log("relationQuery",relationQuery);
                                db.cypherQuery(relationQuery,function(err,relationReply){
                                    console.log("relationReply",relationReply);
                                    if(relationReply && relationReply.data.length==0){
                                        db.insertRelationship(sourceId,targetId,relationshipObj.relationShipType,{},function(err,resultRel){
                                            console.log("insertRelationship",err,resultRel);
                                        });
                                    }
                                })

                            }
                        })
                    })

                }

            })(labelTemp,dataObjTemp);

        }

    }
}

function getNodeCreateQuery(label,obj){
    //var objStr=JSON.stringify(obj);
    var key=obj["__primaryColumn__"];
    var query='Match (n:'+label+'{'+obj.__primaryColumn__+':"'+obj[key]+'"}) return n';
    console.log("query",query);
    return query;
}
//var columnObj={"labelName":"","columnName":"","dataType":"","isPrimary":false};
function getDataObj(jsonData,columnsAndRelationshipMap){
    var nodeRelationshipData=[];
    var columnsArr=jsonData[0];
    for(var i= 1,len=jsonData.length;i<len;i++){
        var row=jsonData[i];

        var dataObj=new Object();
        for(var j= 0,lenJ=row.length;j<lenJ;j++){
            var columnValue=row[j];
            var columnName=columnsArr[j];
            if(columnsAndRelationshipMap.columnsMap.hasOwnProperty(columnName)){
                var columnObj=columnsAndRelationshipMap.columnsMap[columnName];
                if(!dataObj.hasOwnProperty(columnObj.labelName)){
                    dataObj[columnObj.labelName]=columnsAndRelationshipMap.nodesPropertyMap[columnObj.labelName];
                }
                dataObj[columnObj.labelName][columnObj.columnName]=Utils.resolveDataType(columnValue,columnObj.dataType);
                //console.log("columnObj",columnObj);
            }else if(columnsAndRelationshipMap.relationShipMap.hasOwnProperty(columnName)){
                var relationObj=columnsAndRelationshipMap.relationShipMap[columnName];
                var newRelationobj={};
                newRelationobj.source=relationObj.source;
                newRelationobj.target=relationObj.target;
                newRelationobj.relationShipType=columnValue.toUpperCase();
                dataObj[columnName]=newRelationobj;
                //dataObj[columnObj.labelName][columnObj.columnName]=columnValue;
                //console.log("relationObj",relationObj);
            }
        }
        //console.log("dataObj",dataObj);
        nodeRelationshipData.push(Utils.clone(dataObj));
    }
    //console.log("nodeRelationshipData",nodeRelationshipData);
    return nodeRelationshipData;

}

function getColumnObjMap(columns){
    var columnsMap={};
    var relationShipMap={};
    var errorList=[];
    var nodesPropertyMap={};
    var returnObj={error:false,returnData:{},errorList:[]};
    for(var i= 0,len=columns.length;i<len;i++){
        var column=columns[i];
        if(column.indexOf('->')>-1){
            var splitArr=column.split("->");
            var splitArrLen=splitArr.length;
            var source,target;
            if(splitArrLen>0 && splitArr[0] && acceptableLabels.indexOf(splitArr[0])>-1){
                source=splitArr[0];
            }else{
                errorList.push(splitArr[0]+" is not valid source.");
            }
            if(splitArrLen>1 && splitArr[1] && acceptableLabels.indexOf(splitArr[1])>-1){
                target=splitArr[1];
            }else{
                errorList.push(splitArr[1]+" is not valid target.");
            }
            if(source && target){
                relationShipMap[column]={source:source,target:target}
            }
        }else{
            var splitArr=column.split(":");
            var splitArrLen=splitArr.length;
            var columnObj={"labelName":"","columnName":"","dataType":""};
            //labelName
            if(splitArrLen>0 && splitArr[0] && acceptableLabels.indexOf(splitArr[0])>-1) {
                columnObj.labelName=splitArr[0];
                if(!nodesPropertyMap.hasOwnProperty(columnObj.labelName)){
                    nodesPropertyMap[columnObj.labelName]={};
                }
            }else {
                errorList.push(splitArr[0]+" is not valid label.");
            }

            //columnName
            if(splitArrLen>1 && splitArr[1]){
                columnObj.columnName=splitArr[1];
                if(nodesPropertyMap.hasOwnProperty(columnObj.labelName) && columnObj.labelName!=""){
                    nodesPropertyMap[columnObj.labelName][columnObj.columnName]="";
                }
            }else{
                errorList.push(splitArr[1]+" is not valid column Name.");
            }
            //isPrimary
            if(splitArrLen>3 && splitArr[3]=='primaryKey') {
                nodesPropertyMap[columnObj.labelName]["__primaryColumn__"]=columnObj.columnName;
            };
            //dataType
            if(splitArrLen>2 && splitArr[2] && acceptableDataTypes.indexOf(splitArr[2])>-1){
                columnObj.dataType=splitArr[2];
            }else{
                errorList.push(splitArr[1]+" is not valid Data type.");
            }
            columnsMap[column]=columnObj;
        }


    }
    if(errorList.length>1){
        returnObj.error=true;
        returnObj.errorList=errorList;
    }
    returnObj.returnData={columnsMap:columnsMap,relationShipMap:relationShipMap,nodesPropertyMap:nodesPropertyMap};
    return returnObj;
}

module.exports=function(app,Utils){

    app.get("/manageLibrary/getAllBooks",Utils.ensureAuthenticated,function(req,res){
        libraryMS.getAllBooks(res);
    });
    /* Add NEW Book Title Drop Down*/
    app.get("/manageLibrary/getParentBookDD",Utils.ensureAuthenticated,function(req,res){
//        libraryMS.getAllBooks(res);
            res.json(parentBookDD);
    });
    app.get("/manageLibrary/getChildBooks/:primaryKey/:value",Utils.ensureAuthenticated,function(req,res){
        var primaryKey=req.params.primaryKey
        var value=req.params.value
        libraryMS.getChildBooks(primaryKey,value,res);
    });
    app.post("/manageLibrary/searchBooks",Utils.ensureAuthenticated,function(req,res){
        var requestobj=req.body;
        console.log("requestobj",requestobj);
        libraryMS.searchBooks(requestobj,res);
    })
/*  addNewBook - Query for Parent Book Information   */
    app.post("/manageLibrary/addNewBook",Utils.ensureAuthenticated,function(req,res){
        var requestobj=req.body;
        console.log("requestobj - addNewBook",requestobj);
        libraryMS.addNewBook(requestobj,res);
    })
/*  addCHildBook - Query for Parent Book Information   */
    app.post("/manageLibrary/addChildBook",Utils.ensureAuthenticated,function(req,res){
        var requestobj=req.body;
        console.log("requestobj - addChildBook",requestobj);
        libraryMS.addChildBook(requestobj,res);
    })
    app.get("/manageLibrary/getUserSearchText/:primaryKey/:value",Utils.ensureAuthenticated,function(req,res){
        var primaryKey=req.params.primaryKey
        var value=req.params.value
        libraryMS.getChildBooks(primaryKey,value,res);
    });
    app.get("/manageLibrary/searchUser/:searchText",Utils.ensureAuthenticated,function(req,res){
        var searchText=req.params.searchText;
        libraryMS.searchUser(res,searchText);
    });
    app.get("/manageLibrary/getBookIssuedDetails/:bookNodeId",Utils.ensureAuthenticated,function(req,res){
        var bookNodeId=req.params.bookNodeId;
        libraryMS.getIssuedBookDetails(res,bookNodeId);
    });


    app.post("/manageLibrary/issueLibBook",Utils.ensureAuthenticated,function(req,res){
        var requestObj=req.body;
        console.log("requestObj issueLibBook",requestObj);
        delete requestObj.issueBookObj.userSearchText;
        libraryMS.issueBook(res,requestObj.book,requestObj.user._id,requestObj.issueBookObj)
    });
    app.post("/manageLibrary/returnLibBook",Utils.ensureAuthenticated,function(req,res){
        var requestObj=req.body;
        console.log("requestObj issueLibBook",requestObj);
        libraryMS.returnBook(res,requestObj)
    });
    app.post("/manageLibrary/uploadCSV",Utils.ensureAuthenticated,function(req,res){
        console.log("/manageLibrary/uploadCSV");
        //try{
            var dataPath=req.files["batchBooksAddition"].path;
            console.log("dataPath",dataPath);
            var responseObj=new Utils.Response();
            var errorList=[];

            fs.readFile(dataPath,function(err,csvData){

                var strData=csvData.toString();
                //console.log("strData",strData);
                var jsonData=Utils.csvToArray(strData);
                console.log("jsonData",JSON.stringify(jsonData));
                var columnMapReturnObj=getColumnObjMap(jsonData[0]);
                if(columnMapReturnObj.error){
                    responseObj.error=true;
                    responseObj.errorMsg=columnMapReturnObj.errorList.join("<br>");
                    res.json(responseObj);
                }
                var nodeRelationshipData=getDataObj(jsonData,columnMapReturnObj.returnData);
                insertDataToDB(nodeRelationshipData);


                if(errorList.length==0){
                    responseObj.responseData=jsonData;
                    res.json(responseObj);
                }else{

                }

            });




        /*}catch(e){
            Utils.defaultErrorResponse(res,"Failed to upload csv file.");
        }*/

    });
}




function getCreateQuery(obj,labelName){
    var q="CREATE (n:ParentBook { name : 'CL', section : 'A'})";
}


