/**
 * Created by Pinki Boora on 5/24/14.
 */

module.exports.ensureAuthenticated=function (req, res, next) {
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
module.exports.resolveBoolean = resolveBoolean;
module.exports.resolveSex = resolveSex;
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
resolveTimestamp=function(timestamp){
    var date=appUtils.dateUtility.convertDate("timestampToddmmyyyy","/",new Date(timestamp));
    return date;
}
