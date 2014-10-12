/**
 * Created by Pinki Boora on 5/23/14.
 */
var UserClass=require("../../manageUsers/models/UserClass.js");
var user=new UserClass();
var Utils=require("../../common/Utils/Utils.js");
var db=Utils.getDBInstance();
var appList=require("../../common/models/modules.js").getAppList();

module.exports=function(app){
    app.get("/login",function(req,res){
       res.render("login");
    });
    app.get("/getSidebarMenuList",function(req,res){
        var responseObj=new Utils.Response();
        responseObj.responseData=req.session.menuList
        res.json(responseObj);
    });
    app.post('/loginSubmit',function(req,res){
        var userName=req.body.username;
        var password=req.body.password;
        console.log("userName",userName);
        console.log("password",password);
        user.getUserDetailsByUserName(userName,req,res,function(req,res,result){
            console.log("result login",result);
            if(result && result.data.length>0){
                var userDet,pAddress,sAddress,sn,school,contact;
                result.columns.length>0?userDet=result.data[0][0]:null;
                result.columns.length>1?pAddress=result.data[0][1]:null;
                result.columns.length>2?sAddress=result.data[0][2]:null;
                result.columns.length>3?sn=result.data[0][3]:null;
                result.columns.length>4?school=result.data[0][4]:null;
                result.columns.length>4?contact=result.data[0][5]:null;
                //console.log(userDet,pAddress,sAddress,sn,school,contact);
                //set library details
                //school?getLibraryAndSetInSession(school.schoolId,req):null;

                if(userDet!=null){
                    if(userDet.hashPassword==password){
                        user.setUserDetails(userDet,pAddress,sAddress,sn,school,contact);
                        user.setUserDataInSession(req);
                        //console.log("req.session.userDetails",req.session.userDetails);

                        var menuList=filterMenuItems(new appList(),userDet.userType);
                        req.session.menuList=menuList;
                        res.redirect("/index");
                    }else{
                        res.redirect("/login");
                    }
                }else{
                    res.redirect("/login");
                }
            }else{
                res.redirect("/login");
            }
        });

    });
    app.get("/logout",function(req,res){
        req.session.userDetails=null;
        req.session.menuList=null;
        res.redirect("/login");
    });
    app.get("/getSchoolInfo",function(req,res){
        var responseObj=new Utils.Response();
        responseObj.responseData=req.session.userDetails.schoolDetails;
        res.json(responseObj);
    });
}
function filterMenuItems(menuList,userType){
    console.log("filterMenuItems",menuList,userType);
    var newMenuList=[];
    for(var i= 0,loopLen=menuList.length;i<loopLen;i++){
        var menu=menuList[i];
        if(menu.hasOwnProperty('accessList')){

            if(menu.hasOwnProperty('childLinks')){
                var childlinksArr=[];
                for(var j= 0,loopLenJ=menu.childLinks.length;j<loopLenJ;j++){
                    var childMenu=menu.childLinks[j];
                    if(childMenu.hasOwnProperty('accessList')){
                        if((childMenu.accessList.length>0 && childMenu.accessList[0]=="*")||(childMenu.accessList.indexOf(userType)>-1)){
                            delete childMenu.accessList;
                            childlinksArr.push(childMenu);
                        }
                    }
                }
                if(childlinksArr.length>0){
                    delete menu.accessList;
                    menu.childLinks=childlinksArr;
                    newMenuList.push(menu);
                }

            }else if(menu.accessList.length>0 && menu.accessList[0]=="*"){
                delete menu.accessList;
                newMenuList.push(menu);
            }else if(menu.accessList.indexOf(userType)>-1){
                delete menu.accessList;
                newMenuList.push(menu);
            }else{
                console.log("---",menu);
            }
        }
    }
    console.log("newMenuList",newMenuList);
    return newMenuList;
}
//

