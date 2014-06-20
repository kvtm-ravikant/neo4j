/**
 * Created by ravikant on 20/6/14.
 */

module.exports=function(app){
    app.get("/manage-users/user-profile",function(req,res){
        console.log("Inside /manage-users/create-user");
        res.redirect("/index");

    });
}