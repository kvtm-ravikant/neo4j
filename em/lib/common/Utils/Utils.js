/**
 * Created by Pinki Boora on 5/24/14.
 */
var fs=require('fs');
var path=require('path');
var neo4j = require("node-neo4j");
var db=getDBInstance();
module.exports.ensureAuthenticated=function (req, res, next) {
    console.log("ensureAuthenticated req.session.libraryDetails",req.session.libraryDetails);

    if (req.session.userDetails) { return next(); }
    res.redirect('login');
}

module.exports.convertToTimeStamp=function (time){
    var timeArr=time.split(":");
    var hrs= 0,mins= 0,secs=0;
    timeArr.length>0?hrs=timeArr[0]:0;
    timeArr.length>1?mins=timeArr[1]:0;
    timeArr.length>2?secs=timeArr[2]:0;
    return Date.UTC(2013, 10, 10, hrs, mins, secs);
}

module.exports.timestampToTime=function (ts){
    var date=new Date(ts);
    var time=zeroPad(date.getHours())+":"+zeroPad(date.getMinutes());
    return time;
}

function zeroPad(num){
    return num<10?"0"+num:num; //appends zero to numbers less than 10 in dates
}


function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

/* Copyright 2012 Daniel Tillin
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * csvToArray v1.1 Javascript (unminifiled for development)
 *
 * Basic usage (defaults to "," and "\n"):
 * csvArray = csvToArray(csvString);
 *
 * Override separator:
 * csvArray = csvToArray(csvString, "|");
 *
 * Override new line character:
 * csvArray = csvToArray(csvString, "", "#");
 *
 * Override both:
 * csvArray = csvToArray(csvString, "|", "#");
 *
 * S = String in
 * R = Record separator
 * F = Field separator
 * r = Record
 * f = Field
 * Q = Quotes (1 = open | 0 = closed)
 * A = Array out
 */
function csvToArray(S,F,R)
{
    F = F || ','; R = R || "\n";
    var A=new Array(new Array(''));
    var r=f=Q=0;
    S=S.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    for(var C=0;C<S.length;C++)
    {
        if(S[C]==R && Q==0){r++;f=0;A[r]=new Array('');}
        else if(S[C]==F && Q==0){f++;A[r][f]='';}
        else if(S[C]=='"')
        {
            if(Q==0){Q=1;}
            else
            {
                if(S[(C+1)]!='"'){Q=0;}
                else{A[r][f]+='"';C++;}
            }
        }
        else if(!(S[C]=="\r" && Q==0)){A[r][f]+=S[C];}
    }
    return A;
}

function convertDateToMMDDYY(date){
    if(date)
        return  (date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
    else
        return "--";
}
function isFloat(n) {
    return n === +n && n !== (n|0);
}

function isInteger(n) {
    return n === +n && n === (n|0);
}
function emTrim(str){
    str=str.replace(/\s+/g,'');
    return str;
}

function isValidScientificNum(str){
    if(!str && str!='0')return false;
    var scientificNum = new RegExp(/^(([-+]?\d+)|([-+]?\d+,\d+)|([-+]?\d+,\d+.\d+)|([-+]?\d*.\d+)|([-+]?\d*.\d+[eE][-+]?\d+)|([-+]?\d*,\d+.\d+[eE][-+]?\d+))$/);
    var match=scientificNum.exec(str);
    return match!=null;
}
function isValidDDMMYY(str){
    if(!str)return false;
    var DDMMYYRegex = new RegExp(/(^(((0[1-9]|[12][0-9])[\/](0[1-9]|1[012]))|((29|30|31)[\/](0[13578]|1[02]))|((29|30)[\/](0[4,6,9]|11)))[\/](19|[2-9][0-9])\d\d$)|(^29[\/]02[\/](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)/);
    var match=DDMMYYRegex.exec(str);
    return match!=null;

}
function isvalidTime(str){
    var timeRegex = new RegExp(/^([0|1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/);
    var match=timeRegex.exec(str);
    return match!=null;
}
function isValidDDMMYYWithOptionalTime(str){

    if(isValidDDMMYY(str))
    {
        return true
    }else{
        var splitArr=str.split(" ");
        if(splitArr.length==2){
            console.log("splitArr",splitArr)
            if(isValidDDMMYY(splitArr[0]) && isvalidTime(splitArr[1])){
                return true;
            }else{
                return false;
            }
        }
    }


}

function createResponse(){
    function Response(){
        this.error=false;
        this.errorMsg="";
        this.successMsg="";
        this.responseData=undefined;
    }
    var obj=new Response();
    return obj;
}
function defaultErrorResponse(res,msg){
    var responseObj=createResponse();
    responseObj.error=true;
    responseObj.errorMsg = "OOPs... Something went wrong."+" ";
    if(msg){
        responseObj.errorMsg+=msg;
    }
    res.json(responseObj);
}
function ddmmyyyyStrToTimeStamp(dateValue){
    var dateValueArr=dateValue.split(" ");
    var returnDate=null;
    if(dateValueArr && dateValueArr.length>0){
        var dateValue1=dateValueArr[0];
        var dateValue1Arr=dateValue1.split("/");
        var day=parseInt(dateValue1Arr[0],10);
        var month=parseInt(dateValue1Arr[1],10);
        month--;
        var year=parseInt(dateValue1Arr[2],10);
        var hrs=0;
        var mins=0;
        var secs=0;
        if(dateValueArr.length>1 && dateValueArr[1].length>1){
            var timeArr=dateValueArr[1].split(":");
            if(timeArr.length>0){
                hrs=timeArr[0];
            }
            if(timeArr.length>1){
                mins=timeArr[1];
            }
            if(timeArr.length>2){
                secs=timeArr[2];
            }
        }
        if(day!=NaN && month!=NaN && year!=NaN){
            var returnDate=Date.UTC(year, month, day, hrs, mins, secs);
        }
    }
    return returnDate;
}
function resolveBoolean(value){
    return value=='true'?"Yes":"No";
}
function resolveSex(value){
    return value=="M"?"Male":"Female";
}
function resolveDataType(value,dataType){
    switch(dataType){
        case 'string': value=value.toString(); break;
        case 'number':
               var temp=value=parseInt(value,10);
               if(!isNaN(temp) && temp!=null)
                   value=temp;
                break;
        case 'date':
                var temp=ddmmyyyyStrToTimeStamp(value);
                if(!isNaN(temp))
                    value=temp;
                break;
        case 'boolean':
                if(value.toLowerCase()=='true'){
                    value=true;
                }else if(value.toLowerCase()=='false'){
                    value=false;
                }
                break;
        default:value=value.toString();

    }
    return value;
}
function getDBInstance(){

    var configFileName="../../conf";
    //var configFileName="../../../../../conf";
    var filePath=path.resolve(configFileName,"serverConfig");
    console.log("filePath",filePath);
    var serverConfig=JSON.parse(fs.readFileSync(filePath,'utf8'));
    console.log("serverConfig",serverConfig);
    return new neo4j("http://"+serverConfig.host+":"+serverConfig.port);
}
// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

// function to create file from base64 encoded string
function base64_decode(base64str, file) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    var bitmap = new Buffer(base64str, 'base64');
    // write buffer to file
    fs.writeFileSync(file, bitmap);
    console.log('******** File created from base64 encoded string ********');
}
//read uploaded csv
function readUploadedCsv(req,res,callback){
    var dataPath=req.files.hasOwnProperty("upload")?req.files["upload"].path:undefined;
    var responseObj = new createResponse();
    try{
        if(!dataPath){
            responseObj.error=true;
            responseObj.errorMsg="Could not find the uploaded file.";
            callback(responseObj);
        }else{
            fs.readFile(dataPath,function(err,csvData){
                if(!err && csvData){
                    var strData=csvData.toString();
                    var jsonData=csvToArray(strData);
                    if(jsonData && jsonData.length>0){
                        console.log("jsonData",JSON.stringify(jsonData));
                        fs.writeFileSync("temp.js",JSON.stringify(jsonData));
                        responseObj.responseData=jsonData;
                        callback(responseObj);
                    }else{
                        responseObj.error=true;
                        responseObj.errorMsg="Uploaded file is blank.";
                        callback(responseObj);
                    }

                }else{
                    responseObj.error=true;
                    responseObj.errorMsg="Could not find the uploaded file.";
                    callback(responseObj);
                }
            })
        }
    }catch(e){
        console.log("e util",e);
        responseObj.error=true;
        responseObj.errorMsg="Error while processing file.";
        callback(responseObj);
    }


}

function searchUser(res,searchText,schoolId,classObj){
    console.log("searchUser",searchText);
    var responseObj=new createResponse();
    var searchTextArr=searchText.split(",");
    var query;
    if((classObj && (classObj.name || classObj.section)) || searchText.indexOf('/')>-1){
        query= 'match (n:User) -[r1:STUDENT_OF]->(c:Class)-[r2:CLASS_OF]->(s:School{schoolId:"'+schoolId+'"})  '
    }else{
        query='Match (s:School{schoolId:"'+schoolId+'"})<-[:USER_OF]-(n:User) ';
    }

    searchText?query+=' WHERE ':'';
    var tempFullQuery=[];
    for(var i= 0,len=searchTextArr.length;i<len;i++){
        var text=searchTextArr[i];
        var tempText=text.toLowerCase();
        var tempQueryArr=[];
        if(text){
            //query+="("
            if(tempText=="m" || tempText=="male"){tempQueryArr.push('n.sex ="M" ')};
            if(tempText=="f" || tempText=="female"){tempQueryArr.push('n.sex ="F" ')};
            if(tempText=="student"){tempQueryArr.push('n.userType ="1" ')}
            if(tempText=="teacher"){tempQueryArr.push('n.userType ="2" ')}

            tempQueryArr.push('n.regID =~ ".*'+text+'.*" ');
            tempQueryArr.push('n.lastName =~ ".*'+text+'.*" ');
            tempQueryArr.push('n.firstName =~ ".*'+text+'.*" ');
            tempQueryArr.push('n.middleName =~ ".*'+text+'.*"');
            tempQueryArr.push('n.userName =~ ".*'+text+'.*"');

            if(text.indexOf('/')>-1){
                var tempClass=text.split('/');
                var className=tempClass.length>0?tempClass[0]:'';
                var classSection=tempClass.length>1?tempClass[1]:'';
                className?tempQueryArr.push('c.name ="'+className+'"  '):'';
                classSection?tempQueryArr.push('c.section ="'+classSection+'" '):'';
            }
            classObj && classObj.name?tempQueryArr.push('c.name ="'+text+'" '):'';
            classObj && classObj.section?tempQueryArr.push('c.section ="'+text+'" '):'';
            if(tempQueryArr.length>0){
                tempFullQuery.push(" ( "+tempQueryArr.join(' OR ')+" ) ");
            }

            //(i==len-1) ?query+=' ) ':query+=' ) AND ';
        }


    }
    query+=tempFullQuery.join(" AND ");
    query+=' RETURN n order by n.userName asc LIMIT 50 ';
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
module.exports.resolveBoolean = resolveBoolean;
module.exports.resolveSex = resolveSex;
module.exports.resolveDataType = resolveDataType;
module.exports.isFloat=isFloat;
module.exports.isInteger=isInteger;
module.exports.clone = clone;
module.exports.csvToArray = csvToArray;
module.exports.convertDateToMMDDYY = convertDateToMMDDYY;
module.exports.emTrim = emTrim;
module.exports.isValidScientificNum = isValidScientificNum;
module.exports.isValidDDMMYY = isValidDDMMYY;
module.exports.isValidDDMMYYWithOptionalTime = isValidDDMMYYWithOptionalTime;
module.exports.Response = createResponse;
module.exports.defaultErrorMsg = "OOPs... Something went wrong.";
module.exports.defaultErrorResponse = defaultErrorResponse;
module.exports.ddmmyyyyStrToTimeStamp = ddmmyyyyStrToTimeStamp;
module.exports.getDBInstance = getDBInstance;
module.exports.base64_encode = base64_encode;
module.exports.base64_decode = base64_decode;
module.exports.readUploadedCsv = readUploadedCsv;
module.exports.searchUser = searchUser;

