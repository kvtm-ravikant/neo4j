/**
 * Created by ravikant on 10/9/14.
 */
var fs=require('fs');
module.exports=function(app,Utils){
    //read Image
    app.post("/application/readImage",Utils.ensureAuthenticated,function(req,res){

        var file=req.files["imageFile"];
        var dataPath=file.path;
        var type = file.type;
        var prefix = "data:" + type + ";base64,";
        var responseObj=new Utils.Response();
        var imgStr=prefix+Utils.base64_encode(dataPath);
        responseObj.responseData=imgStr || "";
        res.json(responseObj);
    });
}