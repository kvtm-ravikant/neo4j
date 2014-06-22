/**
 * Created by ravikant on 20/6/14.
 */
module.exports=function(app,Utils){
    app.get("/manage-users/users",function(req,res){
        console.log("Inside /manage-users/create-user");
        res.redirect("/index");

    });
}
