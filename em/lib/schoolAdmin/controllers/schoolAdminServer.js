var address=require('../../models/schoolClass.js');
var neo4j=require("node-neo4j");
var db=new neo4j("http://localhost:7474");
console.log("db",db);

module.exports=function(app){
    app.get("/manage-org/create-org",function(req,res){
        console.log("Inside create-org");
        //res.render('index');

    });
    app.get("/manage-org/create-org/getOrgConfig",function(req,res){
        console.log("Inside /manage-org/create-org/getOrgConfig",organization.org);
        res.json(organization.org);

    });
    app.post("/manage-org/create-org/saveOrg",function(req,res){
        console.log("Inside /manage-org/create-org/saveOrg",req.body);
        var query='CREATE (n '+JSON.stringify(req.body)+' RETURN n)';
        console.log("query",query);
        db.cypherQuery(query, function(err, result){
            console.log("err",err);
            if(err) throw err;

            console.log(result); // delivers an array of query results
            //console.log(result.columns); // delivers an array of names of objects getting returned
        });
        /*db.insertNode(req.body,function(err,node){
            console.log("node",node);
            console.log("node id",node.id);
            res.json({"done":true});
        });*/


    });

}

