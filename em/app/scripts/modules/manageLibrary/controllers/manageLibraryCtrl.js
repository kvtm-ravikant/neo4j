'use strict';

educationMediaApp.controller('libraryManagement', function ($scope, $http,iconClassMapping,appUtils,libraryService) {
    //get Class List
    $http.get('/manage-attendence/create-attendence/getClassList').success(function(dataResponse,status,headers,config){
        //success
        console.log("dataResponse getClassList",dataResponse);
        appUtils.defaultParseResponse(dataResponse,function(dataResponse){
            $scope.classList=dataResponse.responseData;
        });

    }).error(function(data,status,headers,config){
        //error
        console.log("Error",data,status,headers,config);
    });
    //open Search box
    $scope.isSearchBoxOpened=false;
    //child Books array for adding dynamic tabs
    $scope.childBooks = [];
//    initiate an array to hold all active tabs
    $scope.activeTabs = [];
    
    $scope.openPublicationDate=function(){
//    	console.log("openPublicationDate");
        $('#publicationDate').focus();
    };
  
    $scope.openPurchaseDate=function(){
//    	console.log("openPurchaseDate");
    	$('#purchaseDate').focus();
    };
    
    $scope.openCreDate=function(){
//    	console.log("openPurchaseDate");
    	$('#creDate').focus();
    };
    $scope.openUpdDate=function(){
//    	console.log("openPublicationDate");
        $('#updDate').focus();
    };
    
    $('.datepicker').datepicker(
            {format: 'dd/mm/yyyy',
                language: 'en',
                autoclose: true,
                weekStart: 0,
                todayHighlight:true
     });
        
    $scope.openSearchBox=function(){
//        $scope.isSearchBoxOpened=!$scope.isSearchBoxOpened;
        
        $scope.modalTitle="Advanced Search";
        
        $('#modalSearchBooks').modal({"backdrop": "static","show":true});
        $('#modalSearchBooks').modal({"show":false});
    }
    
    $scope.getBackFromModal=function(){
        $('#modalSearchBooks').modal('hide');
    }

        //get default book
    libraryService.getAllBooks().then(
                function(dataResponse){
                    console.log(" getAllBooks dataResponse",dataResponse);
                    appUtils.defaultParseResponse(dataResponse,function(dataResponse){
                        $scope.booksList=dataResponse.responseData;
                    })
                }
            );
    var bookClassPOJO;
    var selectedBookPOJO;
    //get POJO book
    libraryService.getBookPOJO().then(
                function(dataResponse){
                    appUtils.defaultParseResponse(dataResponse,function(dataResponse){
                       bookClassPOJO=appUtils.cloneJSObj(dataResponse);
                       selectedBookPOJO=appUtils.cloneJSObj(dataResponse);
                       $scope.bookClass=dataResponse;
                       $scope.parentBook=dataResponse.parentbook;
                       $scope.childBookArray=dataResponse.children;
                       $scope.childBookClassModal=dataResponse.children[0];
//                       console.log("getBookPOJO",dataResponse," bookClass : ",$scope.bookClass," $scope.childBookArray : ",$scope.childBookArray," $scope.parentBook : ", $scope.parentBook);
//                       console.log("$scope.childBookClassModal : ",$scope.childBookClassModal, "$scope.bookClass : ", $scope.bookClass);
                    })
                }
            );
    
/***************************************************************
*    Dropdown JSON data of Language							   *
****************************************************************/ 
    libraryService.getLanguageDD().then(
            function(dataResponse){
                appUtils.defaultParseResponse(dataResponse,function(dataResponse){
                	$scope.languages=dataResponse;
//                   console.log("$scope.getLanguageDD : ",dataResponse);
                })
            }
        );

/*****************************************************************
* Dropdown JSON data of bibDocTypeMaterial                       *
/****************************************************************/ 
    libraryService.getParentBookDD().then(
            function(dataResponse){
                appUtils.defaultParseResponse(dataResponse,function(dataResponse){
                	  $scope.parentBookDD=dataResponse;
//                   console.log("$scope.getLanguageDD : ",dataResponse);
                })
            }
        );
/*****************************************************************
* Dropdown JSON data of CurrencyType                             *
/****************************************************************/ 
    libraryService.getCurrencyType().then(
            function(dataResponse){
                appUtils.defaultParseResponse(dataResponse,function(dataResponse){
                	  $scope.currencyType=dataResponse;
                       console.log("$scope.getCurrencyType : ",dataResponse);
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
        $scope.childBooks = [];
        $scope.parentModalCode='add';
    }

    /* 
     * Post Method to call service for insert DB query of Parent & Child book
     */
    var addCompleteBook=function()
    {
        console.log("Add Complete Book ",$scope.bookClass);
        $http({
            method : 'POST',
            url    : '/manageLibrary/addCompleteBook',
            data   : $scope.bookClass,
            headers: {'Content-Type': 'application/json'}
        }).success(function(dataResponse,status,headers,config){
            //success
            appUtils.defaultParseResponse(dataResponse,function(dataResponse){
//                console.log("addNewBook - dataResponse",dataResponse)
                $scope.parentBook._id=dataResponse.responseData;
                $('#childBookModalforSmy').modal('hide');
                console.log("addNewBook - dataResponse",dataResponse,"_id : ",$scope.parentBook._id);
            });
        }).error(function(data,status,headers,config){
            //error
            console.log("Error",data,status,headers,config);

        });
    };
    
     var validateParentBook=function(){
    	 var messageQue=[];
   	  	 var errorObj={error:false,errorMsg:[]};
 	  	 
   	  	 var messageParentQue=[];
   	  	 var errorParentObj={error:false,errorMsg:[]};	  	 
   	  	 
//      if($scope.parentBook._id.length<1|| angular.isUndefined($scope.parentBook._id)){
//    	  errorParentObj.error=true
//    	  errorParentObj.errorMsg.push("Book is not added. Please contact administrator");
//      };
   	  
   	  	 
   	  if(!($scope.parentBook.isbn) ||$scope.parentBook.isbn==""|| angular.isUndefined($scope.parentBook.isbn)){
//   		console.log("dummy : ",$scope.parentBook.isbn.indexOf('DUM'));
   		if($scope.parentBook.isbn.indexOf('DUM')==-1){
   		  errorObj.error=true
          errorObj.errorMsg.push("ISBN is not valid.");
   		}
      }
   	  if(!($scope.parentBook.bookTitle) || $scope.parentBook.bookTitle==""||angular.isUndefined($scope.parentBook.bookTitle)){
    	  errorObj.error=true
          errorObj.errorMsg.push("Book Title is not valid.");
      }
   	  if(!($scope.parentBook.authorName) ||$scope.parentBook.authorName==""|| angular.isUndefined($scope.parentBook.authorName)){
   		  errorObj.error=true
   		  errorObj.errorMsg.push("Author Name is not valid.");
   	  }
//      if(!($scope.parentBook.edition) ||$scope.parentBook.edition==""|| angular.isUndefined($scope.parentBook.edition)){
//    	  errorObj.error=true
//          errorObj.errorMsg.push("Edition is not valid.");  
//      }
//      if(parseInt($scope.parentBook.bookCopies,10)==0|| angular.isUndefined($scope.parentBook.bookCopies)){
//    	  errorObj.error=true
//          errorObj.errorMsg.push("Book Copies should be greater than 0.");
//      }
      if(!($scope.parentBook.publisher) ||$scope.parentBook.publisher==""|| angular.isUndefined($scope.parentBook.publisher)){
    	  errorObj.error=true
          errorObj.errorMsg.push("Publisher is not valid.");
      }
      if(!($scope.parentBook.language)||$scope.parentBook.language==""|| angular.isUndefined($scope.parentBook.language)){
    	  errorObj.error=true
          errorObj.errorMsg.push("Language is not valid.");
      }
//      if(!($scope.parentBook.categoryName) ||$scope.parentBook.categoryName==""|| angular.isUndefined($scope.parentBook.categoryName)){
//    	  errorObj.error=true
//          errorObj.errorMsg.push("Category Name is not valid.");
//      }
//      if(!($scope.parentBook.bibLevel)|| $scope.parentBook.bibLevel==""||angular.isUndefined($scope.parentBook.bibLevel)){
//    	  errorObj.error=true
//          errorObj.errorMsg.push("Bib Levelis not valid.");
//      }
//      if(!($scope.parentBook.docType) ||$scope.parentBook.docType==""|| angular.isUndefined($scope.parentBook.docType)){
//    	  errorObj.error=true
//          errorObj.errorMsg.push("Doc Type is not valid.");  
//      }
      if(errorObj.error==true){
    	  errorObj.errorMsg.push("Please complete the Book Details Form.");
      }
    	console.log("$scope.parentBook : ",$scope.parentBook);

    	var erroMsg=errorObj.errorMsg.join('<br>');
    	
//    	var errorMsg=errorParentObj.errorMsg.join('<br>');
    	
//    	if(errorParentObj.error=true){
//    		appUtils.showError(errorMsg);	
//    		return errorParentObj.error;
//    	}
//    	else 
    		if(erroMsg.length>0){
    		appUtils.showError(erroMsg);
    		return errorObj.error;
    	}
    }
    
   var validateChildBook=function(childBook){
	   console.log("validateChildBook :  childBook ", childBook);	   

	    var messageQue=[];
   		var errorObj={error:false,errorMsg:[]};
  	 
   		if(!(childBook.bookId) ||childBook.bookId=="" || angular.isUndefined(childBook.bookId)){
	    	 errorObj.error=true
	    	 errorObj.errorMsg.push("Book Id is not valid.");
	    }
   		if(!(childBook.bookStatus) ||childBook.bookStatus=="" || angular.isUndefined(childBook.bookStatus)){
	    	 errorObj.error=true
	    	 errorObj.errorMsg.push("Book Status is not valid.");
	    }
   		if(!(childBook.outletName) || childBook.outletName==""|| angular.isUndefined(childBook.outletName)){
   			errorObj.error=true
   			errorObj.errorMsg.push("OutLet is not valid.");
   		}
   		if(!(childBook.location) ||childBook.location=="" || angular.isUndefined(childBook.location)){
   			errorObj.error=true
   			errorObj.errorMsg.push("Location is not valid.");
   		}
   		if(!(childBook.pricePaid) || childBook.pricePaid == ""|| angular.isUndefined(childBook.pricePaid)){
   			errorObj.error=true
   			errorObj.errorMsg.push("Price is not valid.");
   		}
   		if(!(childBook.barCode) ||childBook.barCode=="" || angular.isUndefined(childBook.barCode)){
   			errorObj.error=true
   			errorObj.errorMsg.push("Bar Code is not valid.");
   		}
   		if(!(childBook.description) ||childBook.description=="" || angular.isUndefined(childBook.description)){
   			errorObj.error=true
   			errorObj.errorMsg.push("Description is not valid.");
   		}
          
    if(errorObj.error==true){
  	  errorObj.errorMsg.push("Please complete the Book Copy Form.");
    }
       	  
   	var erroMsg=errorObj.errorMsg.join('<br>');
  	
  	if(erroMsg.length>0){
  		appUtils.showError(erroMsg);	
  	}
  	return errorObj.error;
  	
   }
    
   $scope.isISBNExist=false;
   $scope.addChildTab=function(){
//   	console.log("addChildTab ",$scope.parentBook, " ",($scope.parentBook._id==null)," ",($scope.parentBook._id==""));
   	
  		if($scope.childBooks.length<1 && !validateParentBook()){
  			if($scope.isISBNExist==false){
  				setAllInactive();
   	   			addNewchildBook();
  			}
  			else if ($scope.isISBNExist==true){
  				appUtils.showError("ISBN : "+$scope.parentBook.isbn+" is already exists.");
  			}
  		}
  		else if ($scope.childBooks.length>0){
  			setAllInactive();
   			addNewchildBook();
  		}

   	}  
   var setAllInactive = function() {
   	console.log("setAllInactive ");
       angular.forEach($scope.childBooks, function(childBook) {
           childBook.active = false;
       });
   };
    var addNewchildBook = function() {
    	var childBookPoJO=appUtils.cloneJSObj(bookClassPOJO.children[0]);
    	
    	if($scope.childBooks.length<1){
    		 $scope.childBooks.push(childBookPoJO);
    	}
    	else if($scope.childBooks.length<5 && $scope.childBooks.length>0){
    		
    		if(!validateChildBook($scope.childBooks[($scope.childBooks.length-1)])){
    			$scope.childBooks.push(childBookPoJO);
    		}

    		console.log("$scope.childBooks ",$scope.childBooks, "kgsad ",$scope.childBooks.length,"  $scope.bookClass : ", $scope.bookClass);	
    	}
    	else
    		appUtils.showError("You cannot add more than 5 Books !");
       
//        console.log("childBookPoJO",childBookPoJO);
    	
        // var id = $scope.childBooks.length;
    	/*if($scope.childBooks.length<1){
    		$scope.childBooks.push({
                id: id+1,
                name: "Book Copy",// + id,
                modal: $scope.childBookClassModal,
                active: true
            });	
    	}*/
    	
//    	if($scope.childBooks.length<3 && $scope.childBooks.length>0){
//    		console.log("bookCopyInfo{{childBook.id}} : ",$scope.childBooks[0]," $('#bookCopyInfo1') : ",$('#bookCopyInfo1'));
//    		for(var i=0; i<$scope.childBooks.length;i++){
//    			console.log("$scope.childBooks[i] : ",$scope.childBooks[i], "$scope.childBooks ",$scope.childBooks);	
//    		}
//    		validateChildBook($scope.childBooks[$scope.childBooks.length-1]);
//       	}
    	/* else
         	appUtils.showError("You cannot add more than 1 Books !");*/
    	
//        console.log("addNewchildBook ",id,"childBooks : ",$scope.childBooks );
    };
 
   $scope.onSubmitBook=function(){
	   if($scope.childBooks.length<1){
			if(!validateParentBook()){
				console.log("$scope.childBooks.length<1");
				addCompleteBook();
			}
	   }
	   else if($scope.childBooks.length>0){
		   if(!validateChildBook($scope.childBooks[($scope.childBooks.length-1)]))
			   console.log("$scope.childBooks :",$scope.childBooks,"$scope.bookClass ",$scope.bookClass.children[($scope.bookClass.children.length-1)]);
		   angular.copy($scope.childBooks,$scope.bookClass.children);
//		   angular.copy($scope.childBooks[($scope.childBooks.length-1)],$scope.bookClass.children[($scope.bookClass.children.length-1)]);
		   console.log("$scope.bookClass : ",$scope.bookClass);
			   addCompleteBook();
	   }

   }
 
   $scope.onSubmitOnlyChildBook=function(){
	   console.log("$scope.childBooks :",$scope.childBooks,"$scope.bookClass ",$scope.bookClass.children[($scope.bookClass.children.length-1)]);
	   if($scope.childBooks.length<1){
			if(!validateParentBook()){
				console.log("$scope.childBooks.length<1");
//				addCompleteBook();
			}
	   }
	   else if($scope.childBooks.length>0){
		   if(!validateChildBook($scope.childBooks[($scope.childBooks.length-1)]))
			   console.log("$scope.childBooks :",$scope.childBooks,"$scope.bookClass ",$scope.bookClass.children[($scope.bookClass.children.length-1)]);
		   angular.copy($scope.childBooks,$scope.bookClass.children);
//		   angular.copy($scope.childBooks[($scope.childBooks.length-1)],$scope.bookClass.children[($scope.bookClass.children.length-1)]);
		   console.log("$scope.bookClass : ",$scope.bookClass);
//			   addCompleteBook();
	   }

   }
   
   /*
    * Open View/Edit/Delete Parent Book Modal from Summary
    */
   $scope.isParentModal=false;
   $scope.openParentBookFromSmy=function(book,code){
	   $scope.isParentModal=true;
	   $scope.parentModalTitle="";
       $scope.parentModalCode=code;
       
       $scope.buttonStyle='btn-primary';

       code && code=='update'?$scope.parentModalTitle="Update Book Details":"";
       code && code=='delete'?$scope.parentModalTitle="Delete Book Details":"";
       code && code=='view'?$scope.parentModalTitle="Book Details":"";
       
       code && code=='delete'?$scope.buttonStyle="btn-danger":"btn-primary";

       $scope.parentFormDisabled=true;
       code && code=='update'?$scope.parentFormDisabled=false:true;
       code && code=='delete'?$scope.parentFormDisabled=true:false;
       code && code=='view'?$scope.parentFormDisabled=true:false;
       
       $scope.parentModalTrxBtnDisabled=false;
       code && code=='update'?$scope.parentModalTrxBtnDisabled=true:false;
       code && code=='delete'?$scope.parentModalTrxBtnDisabled=true:false;
       code && code=='view'?$scope.parentModalTrxBtnDisabled=false:true;
       
       
       $('#parentBookViewEditDelforSmy').modal({"backdrop": "static","show":true});
       $('#parentBookViewEditDelforSmy').modal({"show":false});
	   
//	   console.log("parentBookViewEditDelforSmy.html: book : ",book, "childbook length : ",book.children.length);	 
	   angular.copy(book.parentbook,$scope.parentBook);
   }
   
   $scope.alertText="";
   $scope.updateDeleteParentBook=function()
   {
   	console.log("$scope.parentModalTitle : ParentBook", $scope.parentModalTitle, $scope.parentModalCode);
   	   	
    if($scope.parentModalCode && $scope.parentModalCode=='update' && ($scope.isParentModal)){
    	if(!validateParentBook()){
   		$('#retryModel').modal({"backdrop": "static","show":true});
   		 $scope.alertText="Book details has been changed. Do you want to proceed ?";
    	}
//    	console.log("Update Parent Book ",$scope.parentBook);
   	}
   	else if($scope.parentModalCode && $scope.parentModalCode=='delete' && ($scope.isParentModal)){
   		$('#retryModel').modal({"backdrop": "static","show":true});
   		$scope.alertText="You are about to delete a Book. Please confirm.";
//   		console.log("Update Parent Book ",$scope.parentBook);
   	}
   	else if($scope.childModalCode && $scope.childModalCode=='update'){
   		$('#retryModel').modal({"backdrop": "static","show":true});
   		 $scope.alertText="Book Copy has been changed. Do you want to proceed ?";
   	}
   	else if($scope.childModalCode && $scope.childModalCode=='delete'){
   		$('#retryModel').modal({"backdrop": "static","show":true});
   		$scope.alertText="You are about to delete a Book Copy. Please confirm.";
   	}
   }
   
   $scope.ok=function(){
  	console.log("retry model");
  		if($scope.parentModalCode && $scope.parentModalCode=='update' && ($scope.isParentModal)){
		  $scope.updateParentBook();
          $('#retryModel').modal('hide');
	   }else if($scope.parentModalCode && $scope.parentModalCode=='delete' && ($scope.isParentModal)){
		   $scope.deleteParentBook();
		   $('#retryModel').modal('hide');
	   }
	   else if($scope.childModalCode && $scope.childModalCode=='update'){
		  $scope.updateChildBook();
		  $('#retryModel').modal('hide');
	   }else if($scope.childModalCode && $scope.childModalCode=='delete'){
		   $scope.deleteChildBook();
		   $('#retryModel').modal('hide');
	   }else{
          $('#retryModel').modal('hide');
      }
   }

  $scope.cancel=function(){
	$('#retryModel').modal('hide');
  }

  /*
   * Update ParentBook function call to update Parent Book
   */
   $scope.updateParentBook=function()
   {
//   	console.log("$scope.updateParentBook :",$scope.parentBook);
		var selectedISBN = $scope.parentBook.isbn;
		
		libraryService.updateParentBook($scope.parentBook).then(
	           function(dataResponse){
	               appUtils.defaultParseResponse(dataResponse,function(dataResponse){
//	            	   console.log("updateParentBook - dataResponse",dataResponse)
	               	   $scope.parentBook = dataResponse.responseData;
//              
	               	   appUtils.showSuccess("Book ISBN "+selectedISBN+" updated successfully");
	               	   $('#parentBookViewEditDelforSmy').modal('hide');
	               	   $scope.searchBooks();
	               })
	           }
	       );
   }
   
   /*
    * Delete Parent Book function call to Delete Parent Book
    */
    $scope.deleteParentBook=function()
    {
    	console.log("$scope.deleteParentBook :",$scope.parentBook);
    	libraryService.deleteParentBook($scope.parentBook).then(
 	           function(dataResponse){
 	               appUtils.defaultParseResponse(dataResponse,function(dataResponse){
 	            	   console.log("updateParentBook - dataResponse",dataResponse)
// 	               	   $scope.parentBook = dataResponse.responseData;
//               
 	            	   appUtils.showSuccess("Book "+$scope.parentBook.isbn+" deleted successfully");
 	            	   $('#parentBookViewEditDelforSmy').modal('hide');
 	            	   $scope.searchBooks();
 	               })
 	           }
 	       );
    };
    
    /*
     * Update childBook function call to update Parent Book
     */
     $scope.updateChildBook=function()
     {
     	console.log("$scope.updateChildBook :",selectedBookPOJO);
  		var selectedISBN = selectedBookPOJO.parentbook.isbn;
  		var selectedBookId = selectedBookPOJO.children[0].bookId;
  		$http({
  			method : 'POST',
  			url : '/manageLibrary/updateChildBook',
  			data : selectedBookPOJO,
  			headers : {
  				'Content-Type' : 'application/json'
  			}
  		}).success(function(dataResponse, status, headers,config) {
             // success
             appUtils.defaultParseResponse(dataResponse,function(dataResponse) {
                 console.log("updateChildBook - dataResponse",dataResponse)
                 
//                 selectedBookPOJO = dataResponse.responseData;
                
                 appUtils.showSuccess("Book Copy "+selectedBookId+" of Book ISBN "+selectedISBN+" updated successfully");
                 $('#childBookforEditViewDelete').modal('hide');
                 $scope.searchBooks();
             });
         }).error(function(data, status, headers, config) {
             // error
             console.log("Error", data, status,headers, config);
         });
     }
    
     /*
      * Delete Child Book function call to Delete Child Book
      */
      $scope.deleteChildBook=function()
      {
      	console.log("$scope.deleteChildBook :",$scope.parentBook);
      	var selectedISBN = selectedBookPOJO.parentbook.isbn;
  		var selectedBookId = selectedBookPOJO.children[0].bookId;
  		$http({
  			method : 'POST',
  			url : '/manageLibrary/deleteChildBook',
  			data : selectedBookPOJO,
  			headers : {
  				'Content-Type' : 'application/json'
  			}
  		}).success(function(dataResponse, status, headers,config) {
             // success
             appUtils.defaultParseResponse(dataResponse,function(dataResponse) {
                 console.log("deleteChildBook - dataResponse",dataResponse)
                 appUtils.showSuccess("Book Copy "+selectedBookId+" of Book ISBN "+selectedISBN+" deleted successfully");
                 $('#childBookforEditViewDelete').modal('hide');
                 $scope.searchBooks();
             });
         }).error(function(data, status, headers, config) {
             // error
             console.log("Error", data, status,headers, config);
         });
      };

   /*
    * Open View/Edit/Delete Child Book Modal from Summary
    */
   $scope.openChildBookFromSmy=function(book, childbook, code){
	   $scope.isParentModal=false;
	   $scope.childModalTitle="";
       $scope.childModalCode=code;
       $scope.buttonStyle='btn-primary';
       $scope.activeTabs = [];
       $scope.activeTabs.push("one");

       code && code=='update'?$scope.childModalTitle="Update Book Copy":"";
       code && code=='delete'?$scope.childModalTitle="Delete Book Copy":"";
       code && code=='view'?$scope.childModalTitle="Book Copy":"";
       
       code && code=='delete'?$scope.buttonStyle="btn-danger":"btn-primary";
       
       $scope.childFormDisabled=true;
       code && code=='update'?$scope.childFormDisabled=false:true;
       code && code=='delete'?$scope.childFormDisabled=true:false;
       code && code=='view'?$scope.childFormDisabled=true:false;
       
       $scope.childModalTrxBtnDisabled=false;
       code && code=='update'?$scope.childModalTrxBtnDisabled=true:false;
       code && code=='delete'?$scope.childModalTrxBtnDisabled=true:false;
       code && code=='view'?$scope.childModalTrxBtnDisabled=false:true;


       $('#childBookforEditViewDelete').modal({"backdrop": "static","show":true});
       $('#childBookforEditViewDelete').modal({"show":false});

       console.log("openChildBookFromSmy.html : childbook ", childbook," Book: ",book);	
       
       for(var j=0; j<book.children.length;j++){
    	   console.log("book.children[j] : ",book.children[j].bookId," childbook.bookId ",childbook.bookId);
    	   if(childbook.bookId==book.children[j].bookId)
    		   $scope.childBook=book.children[j];
    	   
    	   selectedBookPOJO.parentbook=book.parentbook;
           selectedBookPOJO.children[0]=$scope.childBook;
       }
     
//      console.log("timstamp change ",appUtils.dateUtility.convertDate("ddmmyyyy","/",$scope.childBook.publicationDate));
//       console.log("selectedBookPOJO : ", selectedBookPOJO, $scope.childBook.publicationDate , new Date($scope.childBook.publicationDate), $scope.childBook.publicationDate);
       
   }
   
   /*
    * Open Add Child Book Modal from Summary (+)
    */
   $scope.openAddChildFromSmy=function(){
	   $('#childBookModalforSmy').modal('show');
	   console.log("childBooksList.html");	
	   $scope.childBooks = [];
	   
   }

   $scope.onISBNBlur=function(){
	   if($scope.parentModalCode=='add')
		   $scope.searchISBN()
//		   appUtils.showSuccess("Book ISBN updated successfully");
	   }   
   
   /*
    *  Insert Child Book Modal in Only Add Book Copy TAB 
    */
   $scope.addOnlyChildTab=function(){
	   
	   console.log("addOnlyChildTab ",$scope.childBooks );
	   var childBookPoJO=appUtils.cloneJSObj(bookClassPOJO.children[0]);
   	
   	if($scope.childBooks.length < 4){
   		 $scope.childBooks.push(childBookPoJO);
   	}
   	else {
   		appUtils.showError("Maximum 5 Book Copies can be added.")
   	}
   }
   
   /*
    * Search Modal for Search
    */
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
    
    $scope.searchISBN=function()
    {
    	console.log("$scope.searchISBN :",$scope.parentBook.isbn);
    	
    	libraryService.searchISBN($scope.parentBook).then(
 	           function(dataResponse){
 	               appUtils.defaultParseResponse(dataResponse,function(dataResponse){
 	            	   console.log("searchISBN - dataResponse",dataResponse.responseData.data);
 	            	   if(dataResponse.responseData.data.length>0){
 	            		  $scope.isISBNExist=true;
 	            		  appUtils.showError("Book ISBN : "+$scope.parentBook.isbn+" already exists."); 	            		
 	            	   }
 	            	   else
 	            		  $scope.isISBNExist=false;
 	               })
 	           }
 	       )
 	       return $scope.isISBNExist;
    };
    
/***************************************************************************************************
* Search Book function     - Start                                                                 *
****************************************************************************************************/
    $scope.searchBooks=function(){
        console.log("$scope.searchBookModel",$scope.searchBookModel);
        $('#modalSearchBooks').modal('hide');
        $http({
            method : 'POST',
            url    : '/manageLibrary/searchBooks',
            data   : $scope.searchBookModel,
            headers: {'Content-Type': 'application/json'}
        }).success(function(dataResponse,status,headers,config){
                //success
                appUtils.defaultParseResponse(dataResponse,function(dataResponse){
                    console.log("searchBooks dataResponse",dataResponse)
//                    if(dataResponse.responseData.columns.length<2){
//                        $scope.books=dataResponse.responseData;
                        $scope.booksList=dataResponse.responseData;
//                    }else{

//                    }
                    $scope.isSearchBoxOpened=false;
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
    	            "class":{}
    	        },
    	        "childBook":{
    	            "bookId":""
    	        },
    	        "searchText":""
    	    }
    }
/***************************************************************************************************
* Search Book function     - End                                                                   *
****************************************************************************************************/
    

/****************************************************************************************************
 * ISSUE/RETURN BOOK TO LIBRARY - START															    *                              
 ****************************************************************************************************/
    $scope.libConstants={
            "fineAmtMultiplier":5,
            "smsGateway":"",
            "issueDuration":10,
            "maxBookIssuedStudent":2,
            "maxBookIssuedTeacher":5
        };
    
    $scope.openIssueBook=function(book, childbook, code){
    	var dueDate=(new Date()).getTime()+($scope.libConstants.issueDuration*24*60*60*1000);
//    	console.log("book : ", book," childBook : ", childbook);
    	
    	$scope.issueBookObj={
        issueDate:(new Date()).getTime(),
//    			issueDate:(new Date()).getTime()-($scope.libConstants.issueDuration*24*60*60*1000*5),
        dueDate:dueDate,
        submittedDate:"",
        fineAmount:"",
        fineStatus:"",
        transactionId:"",
        issueComment:"",
        submitComment:"",
        userSearchText:"",
        issueThisBook:{
        	parentBook:book.parentbook,
            childBook: childbook	
        	}
        };
    
    	$scope.selectedUser="";
    	$scope.searchedUserData=null;
    	$scope.isIssueMode=true;
    
    	$scope.modalTitle="";
        $scope.modalCode=code || $scope.modalCode;
        code && code=='issue'?$scope.modalTitle="Issue Book":"";
        code && code=='return'?$scope.modalTitle="Return Book":"";
        
        code && code=='issue'?$scope.modalCode=code:"";
        code && code=='return'?$scope.modalCode=code:"";
        
        code && code=='issue'?$scope.modalIcon="fa fa-share":"";
        code && code=='return'?$scope.modalIcon="fa fa-reply":"";
        
        console.log("code : ",code);
        if(code && code=='return'){
        	console.log("code : ",code);
        	showReturnBook(childbook);
        	$scope.isIssueMode=false;
        }
    	
//    	console.log("openIssueBook : book : ",book," childbook: ", childbook,"selectedUser : ",$scope.selectedUser);
    	$('#modalIssueBook').modal({"backdrop": "static","show":true});
    	$('#modalIssueBook').modal({"show":false});
   }
    
    $scope.getBackFromIssue=function(){
        $('#modalIssueBook').modal('hide');
    }
    
    /* 
     * Clear search text from user search of ISSUE/RETURN Book.
     */
    $scope.clearIssueSearch=function(){
    	$scope.issueBookObj.userSearchText="";
    	$scope.searchedUserData=null;
    }
    
    $scope.submitBook=function(){
    	console.log("submitBook : ",$scope.modalCode);
    	if($scope.modalCode=='issue'){
    		console.log("issue : ",$scope.modalCode);
    		issueLibBook();
    	}
    	else if ($scope.modalCode=='return'){
    		console.log("return : ",$scope.modalCode);
    		returnLibBook();
    	}
    	
    }
    /*
     * Search user for ISSUE/RETURN Book
     */
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
//    	console.log("selectUserToIssueBook", $scope.issueBookObj.issueThisBook);
    	$scope.selectedUser=user;
        $scope.searchedUserData=null;
    }
    //issue book form submission
    var issueLibBook=function(){
//        console.log("issueLibBook", $scope.selectedUser,$scope.issueBookObj.issueThisBook.parentBook);
        var bookISBN=$scope.issueBookObj.issueThisBook.parentBook.isbn;
        var bookID=$scope.issueBookObj.issueThisBook.childBook.bookId;
        if($scope.selectedUser && $scope.issueBookObj.issueThisBook.childBook){
            $http({
                method : 'POST',
                url    : '/manageLibrary/issueLibBook',
                data   : {book:$scope.issueBookObj.issueThisBook.childBook,user:$scope.selectedUser,issueBookObj:$scope.issueBookObj},
                headers: {'Content-Type': 'application/json'}
            }).success(function(dataResponse,status,headers,config){
                //success
                appUtils.defaultParseResponse(dataResponse,function(dataResponse){
//                    console.log("issueLibBook dataResponse",dataResponse);
                    $scope.issueBookObj.issueThisBook.childBook.bookStatus="Unavailable";
                    $scope.issueBookObj.issueThisBook=null;
                    $('#modalIssueBook').modal("hide");
                    appUtils.showSuccess("Book Copy "+bookID+" of ISBN "+bookISBN+" issued successfully.");
                });
            }).error(function(data,status,headers,config){
                //error
                console.log("Error",data,status,headers,config);

            });
        }else{
            var msg="";
            !$scope.selectedUser?msg+="Please select user to whom this book needs to be issued by searching and selecting. <br>":"";
            !$scope.issueBookObj.issueThisBook.childBook?msg+="Please select the book to be issued.":"";
            appUtils.showError(msg);
        }

    }
    
    //method to show form for return book
    var showReturnBook=function(book){
        $scope.issueThisBook=null;
        $http.get('/manageLibrary/getBookIssuedDetails/'+book._id).success(function(dataResponse,status,headers,config){
            //success
            console.log("dataResponse /manageLibrary/getBookIssuedDetails/",dataResponse);
            appUtils.defaultParseResponse(dataResponse,function(dataResponse){
//            	console.log("dataResponse.responseData.data[0][1] :", dataResponse.responseData.data[0][1].issueThisBook);
            	var data = JSON.parse(dataResponse.responseData.data[0][1].issueThisBook);        	
            	
            	console.log("parentBook : ", data.parentBook);            	 
            	
            	$scope.issueBookObj.issueThisBook.childBook = data.childBook;
            	$scope.issueBookObj.issueThisBook.parentBook = data.parentBook;
//            	console.log("childBook ", $scope.issueBookObj.issueThisBook.childBook,"parentBook ",$scope.issueBookObj.issueThisBook.parentBook)
            	$scope.selectedUser=dataResponse.responseData.data[0][0];
                $scope.userToReturn=dataResponse.responseData.data[0][0];
                $scope.returnIsuedDetails=dataResponse.responseData.data[0][1];
                $scope.returnIsuedDetails.submittedDate=(new Date()).getTime();
            });
        }).error(function(data,status,headers,config){
            //error
            console.log("Error",data,status,headers,config);
        });

    }

    var returnLibBook=function(){
//        console.log("returnLibBook", $scope.returnIsuedDetails, "$scope.issueBookObj.issueThisBook.childBook ",$scope.issueBookObj.issueThisBook.childBook);
        var bookISBN=$scope.issueBookObj.issueThisBook.parentBook.isbn;
        var bookID=$scope.issueBookObj.issueThisBook.childBook.bookId;
        if($scope.issueBookObj.issueThisBook.childBook && $scope.returnIsuedDetails.submittedDate){
            $http({
                method : 'POST',
                url    : '/manageLibrary/returnLibBook',
                data   : {book:$scope.issueBookObj.issueThisBook,user:$scope.userToReturn,issueBookObj:$scope.returnIsuedDetails},
                headers: {'Content-Type': 'application/json'}
            }).success(function(dataResponse,status,headers,config){
                //success
                appUtils.defaultParseResponse(dataResponse,function(dataResponse){
//                    console.log("returnLibBook dataResponse",dataResponse);
                    $scope.issueBookObj.issueThisBook.childBook.bookStatus="Available";
                    $scope.issueBookObj.issueThisBook=null;
                    $('#modalIssueBook').modal("hide");
                    appUtils.showSuccess("Book Copy "+bookID+" of ISBN "+bookISBN+" returned successfully.");
                });
            }).error(function(data,status,headers,config){
                //error
                console.log("Error",data,status,headers,config);

            });
        }else{
            var msg="";
            !$scope.selectedUser?msg+="Please select user to whom this book needs to be issued by searching and selecting. <br>":"";
            !$scope.issueBookObj.issueThisBook.childBook?msg+="Please select the book to be returned.":"";
            appUtils.showError(msg);
        }
    }
    
/****************************************************************************************************
* ISSUE/RETURN BOOK TO LIBRARY - START                                                              *                               
*****************************************************************************************************/
    
    
/****************************************************************************************************
 * Accordion Tab Functions - Start										                            *
 ***************************************************************************************************/
     //initiate an array to hold all active tabs
//    $scope.activeTabs = [];
//    $scope.activeTabs.splice($scope.activeTabs.indexOf("one"), 1);
    //check if the tab is active
    $scope.isOpenTab = function (tab) {
        //check if this tab is already in the activeTabs array
        if ($scope.activeTabs.indexOf(tab) > -1) {
            //if so, return true
            return true;
        } else {
            //if not, return false
            return false;
        }
    }
    //function to 'open' a tab
    $scope.openTab = function (tab) {
        //check if tab is already open
        if ($scope.isOpenTab(tab)) {
            //if it is, remove it from the activeTabs array
            $scope.activeTabs.splice($scope.activeTabs.indexOf(tab), 1);
        } else {
            //if it's not, add it!
        	 $scope.activeTabs = [];
            $scope.activeTabs.push(tab);
        }
    }
/****************************************************************************************************
 * Accordion Tab Functions - End										                            *
 ****************************************************************************************************/
    
    
    $scope.getShowImage=function(book){
    	console.log("getShowImage ",book);
        $scope.imageModalDetails={"path":"images/bookImages/"+book.isbn+".jpeg",desc:book.bookTitle};
        $('#bookCoverModal').find('.modal-body img').attr("src","images/bookImages/"+book.isbn+".jpeg");
        $('#bookCoverModal').find('.modal-header h4').html(book.bookTitle);
        $('#bookCoverModal').modal("show");
    }
        
    
    
    
   
});


