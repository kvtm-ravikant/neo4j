'use strict';

educationMediaApp.controller('libraryManagement', function ($scope, $http,iconClassMapping,appUtils) {
    $scope.text="My Library";
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
    $scope.parentConfig={
        "categoryName":"Category",
        "bookTitle":"Book Title",
        "publisher":"Publisher",
        "isbn":"ISBN",
        "authorName":"Author"
    }
    $scope.childConfig={
        "description":"Description",
        "bookStatus":"Status",
        "bookId":"Book ID",
        "location":"Location",
        "starRating":"Star Rating"
    }
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
    }
    $scope.getBackToMainBookList=function(){
        $scope.currentSelectedBook=null;
        $scope.currentBookDetails=null;
    }
    $scope.getShowImage=function(book){
        $scope.imageModalDetails={"path":"images/bookImages/"+book.isbn+".jpeg",desc:book.bookTitle};
        $('#bookCoverModal').find('.modal-body img').attr("src","images/bookImages/"+book.isbn+".jpeg");
        $('#bookCoverModal').find('.modal-header h4').html(book.bookTitle);
        $('#bookCoverModal').modal("show");
    }
    $scope.isSearchBoxOpened=false;
    $scope.openSearchBox=function(){
        $scope.isSearchBoxOpened=!$scope.isSearchBoxOpened;
    }
    $scope.uploadFileCSV = function(thisObj) {
        console.log("uploadFile",thisObj,thisObj.files,$(thisObj).attr("name"));
        var file = thisObj.files[0];
        if(!file){
            $(thisObj).val("");
            appUtils.showError("Please choose a .csv file.");
            return;
        }
        var fileName = file.name;
        var check = file.name.indexOf("csv");
        if (check < 0) {
            $(thisObj).val("");
            appUtils.showError("Please choose a .csv file.");
            return;
        }else{
            //Take the first selected file
            var uploadCSV = new FormData();
            uploadCSV.append($(thisObj).attr("name"), file);


            console.log("uploadFile addEditDataSetSubmit",uploadCSV);
            $http.post("/manageLibrary/uploadCSV", uploadCSV, {
                withCredentials: true,
                headers: {'Content-Type': undefined },
                transformRequest: angular.identity
            }).success(function(data,status,headers,config){
                //success

            }).error(function(data,status,headers,config){
                //error
                console.log("Error",data,status,headers,config);

            });

        }

    };
});