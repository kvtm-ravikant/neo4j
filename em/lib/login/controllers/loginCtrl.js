/**
 * Created by Pinki Boora on 5/23/14.
 */
var neo4j=require("node-neo4j");
var db=new neo4j("http://localhost:7474");
console.log("db",db);
module.exports=function(app){
    app.get("/login",function(req,res){
       res.render("login");
    });
    app.post('/loginSubmit',function(req,res){
        var userName=req.body.username;
        var password=req.body.password;
        console.log("userName",userName);
        console.log("password",password);
        var selectQuery='MATCH (s:School {schoolId: "dav:cbse:1990:122001"})-[r:BELONGS_TO]-(u:User {userName:"'+userName+'"})RETURN u';
        db.cypherQuery(selectQuery, function(err, result){
            console.log("selectQuery login",err,result,result.data.length);
            if( result && result.data.length>0){
                var user=result.data[0];
                console.log("logged In User",user.userName,user.hashPassword);
                if(user.hashPassword==password){
                    req.session.userData=user;
                    res.redirect("/index");
                }else{
                    res.redirect("/login");
                }
            }else{
                res.redirect("/login");
            }
        });
    });
    app.get("/logout",function(req,res){
        req.session.userData=null;
        res.redirect("/login");
    });
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

