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
});