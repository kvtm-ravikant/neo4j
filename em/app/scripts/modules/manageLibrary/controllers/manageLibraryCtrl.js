'use strict';

educationMediaApp.controller('libraryManagement', function ($scope, $http,iconClassMapping,appUtils,libraryService) {

    //open Search box
    $scope.isSearchBoxOpened=false;
    //child Books array for adding dynamic tabs
    $scope.childBooks = [];
        
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

    /*
     * Dropdown JSON data of bibDocTypeMaterial
     */ 
    libraryService.getParentBookDD().then(
            function(dataResponse){
                appUtils.defaultParseResponse(dataResponse,function(dataResponse){
                	  $scope.parentBookDD=dataResponse;
//                   console.log("$scope.getLanguageDD : ",dataResponse);
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
    	  errorObj.error=true
          errorObj.errorMsg.push("ISBN is not valid.");
      }
   	  if(!($scope.parentBook.bookTitle) || $scope.parentBook.bookTitle==""||angular.isUndefined($scope.parentBook.bookTitle)){
    	  errorObj.error=true
          errorObj.errorMsg.push("Book Title is not valid.");
      }
   	  if(!($scope.parentBook.authorName) ||$scope.parentBook.authorName==""|| angular.isUndefined($scope.parentBook.authorName)){
   		  errorObj.error=true
   		  errorObj.errorMsg.push("Author Name is not valid.");
   	  }
      if(!($scope.parentBook.edition) ||$scope.parentBook.edition==""|| angular.isUndefined($scope.parentBook.edition)){
    	  errorObj.error=true
          errorObj.errorMsg.push("Edition is not valid.");  
      }
      if(parseInt($scope.parentBook.bookCopies,10)==0|| angular.isUndefined($scope.parentBook.bookCopies)){
    	  errorObj.error=true
          errorObj.errorMsg.push("Book Copies should be greater than 0.");
      }
      if(!($scope.parentBook.publisher) ||$scope.parentBook.publisher==""|| angular.isUndefined($scope.parentBook.publisher)){
    	  errorObj.error=true
          errorObj.errorMsg.push("Publisher is not valid.");
      }
      if(!($scope.parentBook.language)||$scope.parentBook.language==""|| angular.isUndefined($scope.parentBook.language)){
    	  errorObj.error=true
          errorObj.errorMsg.push("Language is not valid.");
      }
      if(!($scope.parentBook.categoryName) ||$scope.parentBook.categoryName==""|| angular.isUndefined($scope.parentBook.categoryName)){
    	  errorObj.error=true
          errorObj.errorMsg.push("Category Name is not valid.");
      }
      if(!($scope.parentBook.bibLevel)|| $scope.parentBook.bibLevel==""||angular.isUndefined($scope.parentBook.bibLevel)){
    	  errorObj.error=true
          errorObj.errorMsg.push("Bib Levelis not valid.");
      }
      if(!($scope.parentBook.docType) ||$scope.parentBook.docType==""|| angular.isUndefined($scope.parentBook.docType)){
    	  errorObj.error=true
          errorObj.errorMsg.push("Doc Type is not valid.");  
      }
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
    	else if($scope.childBooks.length<3 && $scope.childBooks.length>0){
    		
    		if(!validateChildBook($scope.childBooks[($scope.childBooks.length-1)])){
    			$scope.childBooks.push(childBookPoJO);
    		}

    		console.log("$scope.childBooks ",$scope.childBooks, "kgsad ",$scope.childBooks.length,"  $scope.bookClass : ", $scope.bookClass);	
    	}
       
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
 
   /*
    * Open View/Edit/Delete Parent Book Modal from Summary
    */
   $scope.openParentBookFromSmy=function(book,code){
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
	   
	   console.log("parentBookViewEditDelforSmy.html: book : ",book, "childbook length : ",book.children.length);	 
//	   $scope.parentBook.
	   angular.copy(book.parentbook,$scope.parentBook);
   }
   
   $scope.alertText="";
   $scope.updateDeleteParentBook=function()
   {
   	console.log("$scope.parentModalTitle : ParentBook", $scope.parentModalTitle, $scope.parentModalCode);
   	   	
    if($scope.parentModalCode && $scope.parentModalCode=='update'){
    	if(!validateParentBook()){
   		$('#retryModel').modal({"backdrop": "static","show":true});
   		 $scope.alertText="Book details has been changed. Do you want to proceed ?";
    	}
//    	console.log("Update Parent Book ",$scope.parentBook);
   	}
   	else if($scope.parentModalCode && $scope.parentModalCode=='delete'){
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
  		if($scope.parentModalCode && $scope.parentModalCode=='update'){
		  $scope.updateParentBook();
          $('#retryModel').modal('hide');
	   }else if($scope.parentModalCode && $scope.parentModalCode=='delete'){
		   $scope.deleteParentBook();
		   $('#retryModel').modal('hide');
	   }
	   else 
		   if($scope.childModalCode && $scope.childModalCode=='update'){
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
                 
                 selectedBookPOJO = dataResponse.responseData;
                
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
	   $scope.childModalTitle="";
       $scope.childModalCode=code;
       $scope.buttonStyle='btn-primary';

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
//    	   console.log("book.children[j] : ",book.children[j].bookId," childbook.bookId ",childbook.bookId);
    	   if(childbook.bookId==book.children[j].bookId)
    		   $scope.childBook=book.children[j];
    	   
    	   selectedBookPOJO.parentbook=book.parentbook;
           selectedBookPOJO.children[0]=$scope.childBook;
       }
     
//       console.log("selectedBookPOJO : ", selectedBookPOJO);
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
    
    /*
     * Search function 
     */
    $scope.searchBooks=function(){
        console.log("$scope.searchBookModel",$scope.searchBookModel);
        $('#getBackFromModal').modal('hide');
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
    	            "class":"",
    	            "section":""
    	        },
    	        "childBook":{
    	            "bookId":""
    	        },
    	        "searchText":""
    	    }
    };
    
    
   
});


