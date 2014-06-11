/**
 * Created by Pinki Boora on 5/24/14.
 */

module.exports.ensureAuthenticated=function (req, res, next) {
    if (req.session.userData) { return next(); }
    res.redirect('/login');
}
module.exports.csvToArray=function (S,F,R)
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
module.exports.convertToTimeStamp=function (time){
    var str="10/10/2013 "+time;
    var date=new Date(str);
    return Number(date);
}
module.exports.timestampToTime=function (ts){
    var date=new Date(ts);
    var time=date.getHours()+":"+date.getMinutes()
    return time;
}
module.exports.ResponseObj=function(){
    this.error=false;
    this.msg="";
    this.returnData=null;
}