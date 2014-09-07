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

    /* want to add book data */
    $scope.newBookAddMode=false;
    $scope.newBookData=function()
    {
    	$scope.newBookAddMode = !($scope.newBookAddMode);
    	console.log("$scope.newBookAddMode : ",$scope.newBookAddMode);
    }
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
    
    $http.get('/manageLibrary/getAllBooks').success(function(dataResponse,status,headers,config){
        //success
        console.log("dataResponse /manageLibrary/getAllBooks",dataResponse);
        appUtils.defaultParseResponse(dataResponse,function(dataResponse){
            $scope.books=dataResponse.responseData;
        });

    }).error(function(data,status,headers,config){
            //error
            console.log("Error",data,status,headers,config);
    });
  
    $scope.isSearchBoxOpened=false;
    $scope.openSearchBox=function(){
        $scope.isSearchBoxOpened=!$scope.isSearchBoxOpened;
    };
  
    $scope.parentConfig={
            "categoryName":"Category",
            "bookTitle":"Book Title",
            "publisher":"Publisher",
            "isbn":"ISBN",
            "authorName":"Author"
        };
    $scope.childConfig={
            "description":"Description",
            "bookStatus":"Status",
            "bookId":"Book ID",
            "location":"Location",
            "starRating":"Star Rating"
        };
    $scope.searchBookModel={
            "parentBook":{
                "bookTitle":"",
                "authorName":""
            },
            "searchText":""
        }
    $scope.searchBooks=function(){
        console.log("$scope.searchBookModel",$scope.searchBookModel);
        $http({
            method : 'POST',
            url    : '/manageLibrary/searchBooks',
            data   : $scope.searchBookModel,
            headers: {'Content-Type': 'application/json'}
        }).success(function(dataResponse,status,headers,config){
            //success
            appUtils.defaultParseResponse(dataResponse,function(dataResponse){
                console.log("searchBooks dataResponse",dataResponse)
                $scope.books=dataResponse.responseData;
                $scope.isSearchBoxOpened=false;
            });
        }).error(function(data,status,headers,config){
            //error
            console.log("Error",data,status,headers,config);

        });

    }
    $scope.currentBookDetails=null;
    $scope.getBookDetails=function(parentBook){
        var primaryKey=parentBook.__primaryColumn__||"isbn";
        var value=parentBook[primaryKey];
        $http.get('/manageLibrary/getChildBooks/'+primaryKey+"/"+value).success(function(dataResponse,status,headers,config){
            //success
            console.log("dataResponse /manageLibrary/getChildBooks",dataResponse);
            appUtils.defaultParseResponse(dataResponse,function(dataResponse){
                $scope.currentSelectedBook=parentBook;
                $scope.currentBookDetails=dataResponse.responseData.data;
            });

        }).error(function(data,status,headers,config){
            //error
            console.log("Error",data,status,headers,config);
        });

    };
    $scope.getBackToMainBookList=function(){
        $scope.currentSelectedBook=null;
        $scope.currentBookDetails=null;
        $scope.returnThisBook=null;
        $scope.issueThisBook=null;
    };
    $scope.searchParentBook=function(){
    	$scope.searchParentBook.searctText="";
    	console.log=("$scope.searchParentBook");
	
    };
    
    
});