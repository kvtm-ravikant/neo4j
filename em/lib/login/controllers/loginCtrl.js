/**
 * Created by Pinki Boora on 5/23/14.
 */
var neo4j=require("node-neo4j");
var UserClass=require("../../manageUsers/models/UserClass.js");
var user=new UserClass();
var db=new neo4j("http://localhost:7474");
var Utils=require("../../common/Utils/Utils.js");
var appList=require("../../common/models/modules.js").getAppList();
console.log("db",db);

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
                console.log(userDet,pAddress,sAddress,sn,school,contact);
                if(userDet!=null){
                    if(userDet.hashPassword==password){
                        user.setUserDetails(userDet,pAddress,sAddress,sn,school,contact);
                        user.setUserDataInSession(req);
                        console.log("req.session.userDetails",req.session.userDetails);
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
                        if(childMenu.accessList.length>0 && childMenu.accessList[0]=="*"){
                            delete childMenu.accessList;
                            childlinksArr.push(childMenu);
                        }else if(childMenu.accessList.indexOf(userType)>-1){
                            console.log("childMenu.accessList.indexOf(userType)>-1",childMenu)
                            delete childMenu.accessList;
                            childlinksArr.push(childMenu);
                        }else{
                            console.log("childMenu ELSE",childMenu);
                        }
                    }

                }
                delete menu.accessList;
                menu.childLinks=childlinksArr;
                newMenuList.push(menu);
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

function createSchool(){
    //school id [school name 3 char]:[board]:[year]:[pin code]
    var schoolIdVal="dav:cbse:1990:122001";
    var selectquery='MATCH (n:School{schoolId:"'+schoolIdVal+'"})  RETURN n';
    db.cypherQuery(selectquery, function(err, result){
        console.log("err",err);
        if(err) throw err;
        else if(result.data.length==0){
            var query='CREATE (ee:School { name: "D.A.V Public School", schoolId: "dav:cbse:1990:122001", desc: "Dayanand Anglo vedic public school",schoolHeadId:"" })';
            db.cypherQuery(query, function(err, result){
                console.log("err",err);
                if(err) throw err;

                console.log(result,"created"); // delivers an array of query results
                //console.log(result.columns); // delivers an array of names of objects getting returned
            });
        }

    })

}
//select and delete
/*var selectquery='MATCH (n:School{schoolId:"dav:cbse:1990:122001"})  RETURN n';
db.cypherQuery(selectquery, function(err, result){
    console.log("err",err);
    if(err) throw err;
    for(var i=0;i<result.data.length;i++){
        var id=result.data[i]._id;
        db.deleteNode(id, function(err, node){
            if(err) throw err;

            if(node === true){
                // node deleted
                console.log(node,"delete :(");
            } else {
                console.log(node,"NOT deleted :)");
                // node not deleted because not found or because of existing relationships
            }
        });
    }
    console.log(result); // delivers an array of query results
    //console.log(result.columns); // delivers an array of names of objects getting returned
});*/

