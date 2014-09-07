'use strict';

educationMediaApp.controller('libraryManagement_addNewBook', function ($scope, $http,iconClassMapping,appUtils) {
    $scope.text="Add New Book";
    $scope.mainAddedBook="";

    $('.datepicker').datepicker(
        {format: 'dd/mm/yyyy',
            language: 'en',
            autoclose: true,
            weekStart: 0,
            todayHighlight:true
        });

    $scope.parentBook = {
        "bindingType": "",
        "bookTitle": "",
        "bookSubTitle": "",
        "categoryName": "",
        "bibLevel": "",
        "edition": "",
        "bookCopies": "",
        "language": "",
        "publisher": "",
        "isbn": "",
        "coverImagePath": "",
        "authorName": "",
        "docType": "",
        "material":""
    };


 /*
    Submit button  Method for "Add Main Book"
*/
    $scope.addNewBook=function()
    {
        console.log("Add New Book ",$scope.parentBook);
        $http({
            method : 'POST',
            url    : '/manageLibrary/addNewBook',
            data   : $scope.parentBook,
            headers: {'Content-Type': 'application/json'}
        }).success(function(dataResponse,status,headers,config){
            //success
            appUtils.defaultParseResponse(dataResponse,function(dataResponse){
                console.log("addNewBook - dataResponse",dataResponse)
                $scope.parentBook=dataResponse.responseData;
            });
        }).error(function(data,status,headers,config){
            //error
            console.log("Error",data,status,headers,config);

        });
    };

   /*
    * Dropdown JSON data of bibDocTypeMaterial
    */ 
    $http.get('/manageLibrary/getParentBookDD').success(function(dataResponse,status,headers,config){
        //success
//        console.log("getParentBookDD",dataResponse);
        appUtils.defaultParseResponse(dataResponse,function(dataResponse){
            $scope.parentBookDD=dataResponse;
         console.log("$scope.parentBookDD",$scope.parentBookDD);
        });

    }).error(function(data,status,headers,config){
        //error
        console.log("Error",data,status,headers,config);
    });


    $scope.openPublicationDate=function(){
        $('#publicationDate').focus();
    };
    $scope.openPurchaseDate=function(){
        $('#purchaseDate').focus();
    };


});