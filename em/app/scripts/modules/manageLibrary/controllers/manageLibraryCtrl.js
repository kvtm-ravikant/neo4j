'use strict';

educationMediaApp.controller('libraryManagement', function ($scope, $http,iconClassMapping,appUtils,libraryService) {

    //open Search box
    $scope.isSearchBoxOpened=false;
    $scope.openSearchBox=function(){
        $scope.isSearchBoxOpened=!$scope.isSearchBoxOpened;
    }
    //get default book
    libraryService.getAllBooks().then(
                function(dataResponse){
                    console.log("dataResponse",dataResponse);
                    appUtils.defaultParseResponse(dataResponse,function(dataResponse){
                        $scope.booksList=dataResponse.responseData;
                    })
                }

            );
    //get POJO book
    libraryService.getBookPOJO().then(
                function(dataResponse){
                    console.log("getBookPOJO",dataResponse);
                    appUtils.defaultParseResponse(dataResponse,function(dataResponse){
                       $scope.bookClass=dataResponse.responseData;
                    })
                }

            );

    /*
     * Dropdown JSON data of bibDocTypeMaterial
     */ 
     $http.get('/manageLibrary/getParentBookDD').success(function(dataResponse,status,headers,config){
         //success
//         console.log("getParentBookDD",dataResponse);
         appUtils.defaultParseResponse(dataResponse,function(dataResponse){
             $scope.parentBookDD=dataResponse;
          console.log("$scope.parentBookDD",$scope.parentBookDD);
         });

     }).error(function(data,status,headers,config){
         //error
         console.log("Error",data,status,headers,config);
     });

    
    //toggle key of a map
    $scope.toggleMapKeyValue=function(map,key){
        map[key]=!map[key];
    }
    //moretext
    $scope.moreText=function(text){
        return text.substring(0,20);
    }

    $scope.openAddBookForm=function(){
        $('#addBookToLib').modal('show');
    }
    
    $scope.addChildTab=function(){
    	console.log("addChildTab ");
    	  setAllInactive();
          addNewWorkspace();
    }
    
    var setAllInactive = function() {
    	console.log("setAllInactive ");
        angular.forEach($scope.workspaces, function(workspace) {
            workspace.active = false;
        });
    };
 
    var addNewWorkspace = function() {
    	
        var id = $scope.workspaces.length + 1;
        if($scope.workspaces.length<5){
        	$scope.workspaces.push({
                id: id,
                name: "Book Copy",// + id,
                active: true
            });	
        }
        else
        	appUtils.showError("You cannot add more than 5 Books !");
        
        console.log("addNewWorkspace ",id,"workspaces : ",$scope.workspaces );
    };
 
    $scope.workspaces =
    [
        { id: "1", name: "Book Copy", active:false }
    ];
 
});


