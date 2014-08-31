/**
 * Created by ravikant on 12/7/14.
 */
educationMediaApp.controller('schoolManagement', function ($scope, $http,iconClassMapping) {
   var nodeConfig=function(){
       return [
           {"label":"Name","propertyName":"name","propertyValue":"","inputType":"text", "required":"required","helpBlock":"Please enter name."},
           {"label":"Desc","propertyName":"desc","propertyValue":"","inputType":"textarea", "required":"", "helpBlock":""},
           {"label":"Email","propertyName":"email","propertyValue":"","inputType":"email", "required":"required","helpBlock":"Please enter email."}
       ]
   };
   $scope.node=null;
   $scope.addNode=function(){
        $scope.node=new nodeConfig();
    }
});