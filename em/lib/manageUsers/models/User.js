/**
 * Created by Pinki Boora on 5/24/14.
 */
var neo4j=require("node-neo4j");
var db=new neo4j("http://localhost:7474");
var Utils=require("../../common/Utils/Utils.js");
console.log("db",db);
module.exports=function(config){
   this.me=config;

   this.createUser=function(callback){
       var myData=this.me;
       var selectquery='MATCH (n:User{userName:"'+this.me.userName+'"})  RETURN n';
       db.cypherQuery(selectquery, function(err, result){
           console.log("err",err,result.data.length);
           if(err) throw err;
           else if(result.data.length<1){
              console.log("Inserting node");
              var myDataNode=db.insertNode(myData,["User"],function(err,user){
                  console.log("insertNode user",user);
                  if(user && user._id){

                      var schoolIdVal=myData.schoolID;
                      var selectquery='MATCH (n:School{schoolId:"'+schoolIdVal+'"})  RETURN n';
                      db.cypherQuery(selectquery, function(err, school){
                          console.log("err",err);
                          if(err) throw err;
                          else if(school.data.length==1){
                              var schoolNodeId=school.data[0]._id;
                              var relationShip="BELONGS_TO";
                              var relationShipData={"since":myData.createdAt};
                              console.log("Before insert relationship",schoolNodeId,user._id);
                              db.insertRelationship(schoolNodeId,user._id,relationShip,relationShipData,function(err,result){
                                  console.log("insertRelationship",err,result);
                                  callback(err, result);
                              });
                          }
                      });
                      /*db.insertRelationship(3,user._id,"STUDENT_OF",{"batch":"2014-15"},function(err,result){
                          console.log("insertRelationship",err,result);
                          callback(err, result);
                      });*/
                  }

              });

           }

       });
   }
   this.createStudent=function(callcack){
       this.me.userType="student";
       this.me.admin=false;
       this.createUser(callcack);
   }
   this.createEmployee=function(callcack){
       this.me.userType="employee";
       this.me.admin=false;
       this.createUser(callcack);
   }
   this.createTeacher=function(callcack){
       this.me.userType="teacher";
       this.me.admin=true;
       this.createUser(callcack);
   }

}
/* Get all Users from USER */
module.exports.getAllUsers=function (res){
    var queryAllUsers="MATCH (n:User) RETURN n LIMIT 25";
    var responseObj=new Utils.Response();
    db.cypherQuery(queryAllUsers,function(err,reply){
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