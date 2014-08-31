'use strict';

educationMediaApp.controller('libraryManagement_searchBook', function ($scope, $http,iconClassMapping,appUtils) {
    $scope.text="My Library";
    $scope.libConstants={
        "fineAmtMultiplier":5,
        "smsGateway":"",
        "issueDuration":10,
        "maxBookIssuedStudent":2,
        "maxBookIssuedTeacher":5
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
    $scope.showIssueBookHtml=function(book){
        $scope.returnThisBook=null;
        $scope.issueThisBook=book;
        var dueDate=(new Date()).getTime()+($scope.libConstants.issueDuration*24*60*60*1000);
        $scope.issueBookObj={
            issueDate:(new Date()).getTime(),
            dueDate:dueDate,
            submittedDate:"",
            fineAmount:"",
            fineStatus:"",
            transactionId:"",
            issueComment:"",
            submitComment:"",
            userSearchText:""
        };
        console.log("book---issue",book,$scope.issueBookObj);
    }
    $scope.searchUser=function(){
        if($scope.issueBookObj.userSearchText){

            $http.get('/manageLibrary/searchUser/'+$scope.issueBookObj.userSearchText).success(function(dataResponse,status,headers,config){
                //success
                console.log("dataResponse /manageLibrary/searchUser",dataResponse);
                appUtils.defaultParseResponse(dataResponse,function(dataResponse){
                    $scope.searchedUserData=dataResponse.responseData.data;
                });
            }).error(function(data,status,headers,config){
                //error
                console.log("Error",data,status,headers,config);
            });
        }else{
            appUtils.showError("Please enter search text for searching user.");
        }

    }
    $scope.selectUserToIssueBook=function(user){
        $scope.selectedUser=user;
        $scope.searchedUserData=null;
    }
    //issue book form submission
    $scope.issueLibBook=function(){
        console.log("issueLibBook", $scope.selectedUser,$scope.issueThisBook);
        if($scope.selectedUser && $scope.issueThisBook){
            $http({
                method : 'POST',
                url    : '/manageLibrary/issueLibBook',
                data   : {book:$scope.issueThisBook,user:$scope.selectedUser,issueBookObj:$scope.issueBookObj},
                headers: {'Content-Type': 'application/json'}
            }).success(function(dataResponse,status,headers,config){
                //success
                appUtils.defaultParseResponse(dataResponse,function(dataResponse){
                    console.log("issueLibBook dataResponse",dataResponse)
                    $scope.issueThisBook.bookStatus="Unavailable";
                    $scope.issueThisBook=null;
                });
            }).error(function(data,status,headers,config){
                //error
                console.log("Error",data,status,headers,config);

            });
        }else{
            var msg="";
            !$scope.selectedUser?msg+="Please select user to whom this book needs to be issued by searching and selecting. <br>":"";
            !$scope.issueThisBook?msg+="Please select the book to be issued.":"";
            appUtils.showError(msg);
        }

    }
    //method to show form for return book
    $scope.showReturnBookHtml=function(book){
        $scope.issueThisBook=null;
        $http.get('/manageLibrary/getBookIssuedDetails/'+book._id).success(function(dataResponse,status,headers,config){
            //success
            console.log("dataResponse /manageLibrary/getBookIssuedDetails/",dataResponse);
            appUtils.defaultParseResponse(dataResponse,function(dataResponse){
                $scope.returnThisBook=book;
                $scope.userToReturn=dataResponse.responseData.data[0][0];
                $scope.returnIsuedDetails=dataResponse.responseData.data[0][1];
                $scope.returnIsuedDetails.submittedDate=(new Date()).getTime();
            });
        }).error(function(data,status,headers,config){
            //error
            console.log("Error",data,status,headers,config);
        });

    }
    //return book form submission
    $scope.returnLibBook=function(){
        console.log("returnLibBook", $scope.returnIsuedDetails);
        if($scope.returnThisBook && $scope.returnIsuedDetails.submittedDate){
            $http({
                method : 'POST',
                url    : '/manageLibrary/returnLibBook',
                data   : {book:$scope.returnThisBook,user:$scope.userToReturn,issueBookObj:$scope.returnIsuedDetails},
                headers: {'Content-Type': 'application/json'}
            }).success(function(dataResponse,status,headers,config){
                //success
                appUtils.defaultParseResponse(dataResponse,function(dataResponse){
                    console.log("returnLibBook dataResponse",dataResponse)
                    $scope.returnThisBook.bookStatus="Available";
                    $scope.returnThisBook=null;
                });
            }).error(function(data,status,headers,config){
                //error
                console.log("Error",data,status,headers,config);

            });
        }else{
            var msg="";
            !$scope.selectedUser?msg+="Please select user to whom this book needs to be issued by searching and selecting. <br>":"";
            !$scope.issueThisBook?msg+="Please select the book to be issued.":"";
            appUtils.showError(msg);
        }
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