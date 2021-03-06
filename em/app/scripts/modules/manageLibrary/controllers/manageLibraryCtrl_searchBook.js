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
            "authorName":"",
            "isbn":""

        },
        "userDetails":{
            "regID":"",
            "firstName":"",
            "middleName":"",
            "lastName":"",
            "class":"",
            "section":""
        },
        "childBook":{
            "bookId":""
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
                if(dataResponse.responseData.columns.length<2){
                    $scope.books=dataResponse.responseData;
                }else{

                }
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
    /*
     * Clear function for search clear text
     */
    $scope.clearSearch = function () {
        $scope.searchBookModel.searchText = "";
        $scope.searchBookModel.parentBook.bookTitle="";
        $scope.searchBookModel.parentBook.authorName="";
        
    };
    
    $scope.getBackToMainBookList=function(){
        $scope.currentSelectedBook=null;
        $scope.currentBookDetails=null;
        $scope.returnThisBook=null;
        $scope.issueThisBook=null;
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
    
    $scope.selectedChildBookCriteria={
    		"isbn" : "",
    		"bookId" : ""
    	}
    /*
     * Get Child Book details for selected Book id of Parent Book
     */
    $scope.getSelectedChildBookDetails=function(selectedBook,code){
      console.log("getSelectedChildBookDetails : ",selectedBook, code, selectedBook.bookId, $scope.currentSelectedBook.isbn)
      
       $scope.selectedChildBookCriteria.bookId=selectedBook.bookId;
       $scope.selectedChildBookCriteria.isbn=$scope.currentSelectedBook.isbn;
//        console.log("$scope.getSelectedChildBookDetails",selectedChildBookCriteria);
        $http({
            method : 'POST',
            url    : '/manage-users/getSelectedChildBookDetails/',
            data   : $scope.selectedChildBookCriteria,
            headers: {'Content-Type': 'application/json'}
        }).success(function(dataResponse,status,headers,config){
            //success
            appUtils.defaultParseResponse(dataResponse,function(dataResponse){
            $scope.selectedChildBookDetails=dataResponse.responseData.data[0];
            console.log("dataResponse /manage-users/getSelectedChildBookDetails/ :  ",dataResponse.responseData.data[0]);
            
            $scope.openChildBookModal(code);
             
            });
        }).error(function(data,status,headers,config){
            //error
            console.log("Error",data,status,headers,config);
        });
    }
    
    /*
     *  Child Book Modal Popup Function
     */
    $scope.openChildBookModal=function(code){
        $scope.modalTitle="Books";
        $scope.modalCode=code;
        $scope.buttonStyle='btn-primary';
        code && code=='add'?$scope.modalTitle="Add Book":"";
        code && code=='update'?$scope.modalTitle="Update Book":"";
        code && code=='delete'?$scope.modalTitle="Delete Book":"";
        code && code=='view'?$scope.modalTitle="Book Details":"";
        
        code && code=='delete'?$scope.buttonStyle="btn-danger":"btn-primary";

        $('#myTab li:first>a').click() //always open first tab
        $('#childBookModal').modal({"backdrop": "static","show":true});
        $('#childBookModal').modal({"show":false});
    }
    
    /*
     *  Parent Book Modal Popup Function
     */
    $scope.getSelectedParentBookDetails=function(code){
    	console.log("getSelectedParentBookDetails ", code);
        $scope.modalBookTitle="Book Title";
        $scope.modalTitleCode=code;
        $scope.buttonStyle='btn-primary';
        code && code=='addTitle'?$scope.modalTitleCode="Add Book Title":"";
        code && code=='updateTitle'?$scope.modalTitleCode="Update Book Title":"";
        code && code=='deleteTitle'?$scope.modalTitleCode="Delete Book Title":"";
        code && code=='viewTitle'?$scope.modalTitleCode="Book Title Details":"";
        
        code && code=='deleteTitle'?$scope.buttonStyle="btn-danger":"btn-primary";

        $('#myTab li:first>a').click() //always open first tab
        $('#parentBookModal').modal({"backdrop": "static","show":true});
        $('#parentBookModal').modal({"show":false});
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
    var gaugeOptions = {

        chart: {
            type: 'solidgauge'
        },

        title: null,

        pane: {
            center: ['50%', '85%'],
            size: '80%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',


                shape: 'arc'
            }
        },

        tooltip: {
            enabled: false
        },

        // the value axis
        yAxis: {
            stops: [
                [0.1, '#55BF3B'], // green
                [0.5, '#DDDF0D'], // yellow
                [0.9, '#DF5353'] // red
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickPixelInterval: 400,
            tickWidth: 0,
            title: {
                y: -70
            },
            labels: {
                y: 16
            }
        },

        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        }
    };

    // The speed gauge
    $('#booksdiv1').highcharts(Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 100,
            title: {
                text: 'Books Overdue'
            }
        },

        credits: {
            enabled: false
        },

        series: [{
            name: 'Books',
            data: [50],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:15px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{}</span><br/>' +
                    '</div>'
            },
            tooltip: {
                valueSuffix: 'Books'
            }
        }]

    }));
    $('#booksdiv2').highcharts(Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 30000,
            title: {
                text: ' Library Inventory'
            }
        },

        credits: {
            enabled: false
        },

        series: [{
            name: 'Books',
            data: [29000],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:15px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{}</span><br/>' +
                    '</div>'
            },
            tooltip: {
                valueSuffix: 'Books'
            }
        }]

    }));
    $('#booksdiv3').highcharts(Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 100,
            title: {
                text: 'Reserve request'
            }
        },

        credits: {
            enabled: false
        },

        series: [{
            name: 'Books',
            data: [50],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:15px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{}</span><br/>' +
                    '</div>'
            },
            tooltip: {
                valueSuffix: 'Books'
            }
        }]

    }));
});