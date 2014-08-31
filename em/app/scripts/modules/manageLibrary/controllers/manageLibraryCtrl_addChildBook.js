'use strict';

educationMediaApp.controller('libraryManagement_addChildBook', function ($scope, $http,iconClassMapping,appUtils) {
    $scope.text="Add New Book";
    $scope.mainAddedBook="";

    $('.datepicker').datepicker(
        {format: 'dd/mm/yyyy',
            language: 'en',
            autoclose: true,
            weekStart: 0,
            todayHighlight:true
        });

    $scope.childBook = {
        "bookId":"",
        "barCode":"",
        "acqMode":"",
        "publicationDate":"",
        "purchaseDate":"",
        "currencyType":"",
        "pricePaid":"",
        "outletName":"",
        "createdDate":"",
        "description":"",
        "bookStatus":"",
        "location":"",
        "materialAccompanied":"",
        "starRating":"",
        "tag":"",
        "updatedDate":"",
        "frequency":"",
        "freqReminder":"",
        "softDelete":""
    };

    /*
     Submit button  Method for "Add Child Book"
     */
    $scope.addchildBook=function()
    {
        console.log("Add Child Book ",$scope.childBook);
        $http({
            method : 'POST',
            url    : '/manageLibrary/addChildBook',
            data   : $scope.childBook,
            headers: {'Content-Type': 'application/json'}
        }).success(function(dataResponse,status,headers,config){
            //success
            appUtils.defaultParseResponse(dataResponse,function(dataResponse){
                console.log("addChildBook - dataResponse",dataResponse)
//                $scope.child=dataResponse.responseData;
            });
        }).error(function(data,status,headers,config){
            //error
            console.log("Error",data,status,headers,config);

        });
    };
    $scope.openPublicationDate=function(){
        $('#publicationDate').focus();
    };
    $scope.openPurchaseDate=function(){
        $('#purchaseDate').focus();
    };


});