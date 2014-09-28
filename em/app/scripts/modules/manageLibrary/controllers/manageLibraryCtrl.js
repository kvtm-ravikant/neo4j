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
    var bookClassPOJO;
    //get POJO book
    libraryService.getBookPOJO().then(
                function(dataResponse){
                    appUtils.defaultParseResponse(dataResponse,function(dataResponse){
                       bookClassPOJO=appUtils.cloneJSObj(dataResponse);
                       $scope.bookClass=dataResponse;
                       $scope.parentBook=dataResponse.parentbook;
                       $scope.childBookArray=dataResponse.children;
                       $scope.childBookClassModal=dataResponse.children[0];
//                       console.log("getBookPOJO",dataResponse," bookClass : ",$scope.bookClass," $scope.childBookArray : ",$scope.childBookArray," $scope.parentBook : ", $scope.parentBook);
//                       console.log("$scope.childBookClassModal : ",$scope.childBookClassModal, "$scope.bookClass : ", $scope.bookClass);
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
//          console.log("$scope.parentBookDD",$scope.parentBookDD);
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

    /* 
     * Post Method to call service for insert DB query of Parent & Child book
     */
    var addCompleteBook=function()
    {
        console.log("Add Complete Book ",$scope.parentBook);
        $http({
            method : 'POST',
            url    : '/manageLibrary/addCompleteBook',
            data   : $scope.bookClass,
            headers: {'Content-Type': 'application/json'}
        }).success(function(dataResponse,status,headers,config){
            //success
            appUtils.defaultParseResponse(dataResponse,function(dataResponse){
                console.log("addNewBook - dataResponse",dataResponse)
//                $scope.parentBook=dataResponse.responseData;
            });
        }).error(function(data,status,headers,config){
            //error
            console.log("Error",data,status,headers,config);

        });
    };
    
     var validateParentBook=function(){
    	 var messageQue=[];
   	  	 var errorObj={error:false,errorMsg:[]};
   	  	 
//      if($scope.parentBook.bindingType.length<1|| angular.isUndefined($scope.parentBook.bindingType)){
//    	  errorObj.error=true
//          errorObj.errorMsg.push("Binding Typeis not valid.");
//      };
      if($scope.parentBook.bookTitle.length<3|| angular.isUndefined($scope.parentBook.bookTitle)){
    	  errorObj.error=true
          errorObj.errorMsg.push("Book Title is not valid.");
      }
      if($scope.parentBook.categoryName.length<2|| angular.isUndefined($scope.parentBook.categoryName)){
    	  errorObj.error=true
          errorObj.errorMsg.push("Category Name is not valid.");
      }
      if($scope.parentBook.bibLevel.length<1|| angular.isUndefined($scope.parentBook.bibLevel)){
    	  errorObj.error=true
          errorObj.errorMsg.push("Bib Levelis not valid.");
      }
      if($scope.parentBook.edition.length<1|| angular.isUndefined($scope.parentBook.edition)){
    	  errorObj.error=true
          errorObj.errorMsg.push("Edition is not valid.");  
      }
      if(parseInt($scope.parentBook.bookCopies,10)==0|| angular.isUndefined($scope.parentBook.bookCopies)){
    	  errorObj.error=true
          errorObj.errorMsg.push("Book Copies should be greater than 0.");
      }
      if($scope.parentBook.language.length<2|| angular.isUndefined($scope.parentBook.language)){
    	  errorObj.error=true
          errorObj.errorMsg.push("Language is not valid.");
      }
      if($scope.parentBook.publisher.length<2|| angular.isUndefined($scope.parentBook.publisher)){
    	  errorObj.error=true
          errorObj.errorMsg.push("Publisher is not valid.");
      }
      if($scope.parentBook.isbn.length<5|| angular.isUndefined($scope.parentBook.isbn)){
    	  errorObj.error=true
          errorObj.errorMsg.push("ISBN is not valid.");
      }
      if($scope.parentBook.authorName.length<3|| angular.isUndefined($scope.parentBook.authorName)){
    	  errorObj.error=true
          errorObj.errorMsg.push("Author Name is not valid.");
      }
      if($scope.parentBook.docType.length<2|| angular.isUndefined($scope.parentBook.docType)){
    	  errorObj.error=true
          errorObj.errorMsg.push("Doc Type is not valid.");  
      }
      
      if(errorObj.error==true){
    	  errorObj.errorMsg.push("Please complete the Book Details Form.");
      }
    	console.log("$scope.parentBook : ",$scope.parentBook);

    	var erroMsg=errorObj.errorMsg.join('<br>');
    	
    	if(erroMsg.length>0){
    		appUtils.showError(erroMsg);	
    	}
    	
    	return errorObj.error;
    }
    
   var validateChildBook=function(childBook){
	   console.log("validateChildBook :  childBook ", childBook);	   
//    	for(var i=0; i<$scope.childBooks.length;i++){
//			console.log("$scope.childBooks[i] : ",$scope.childBooks[i], "$scope.childBooks ",$scope.childBooks);	
//			$scope.bookClass.children[0]=$scope.childBooks[i].modal;
//		}
   		var messageQue=[];
   		var errorObj={error:false,errorMsg:[]};
  	 
   		if(childBook.modal.bookId.length<1|| angular.isUndefined(childBook.modal.bookId)){
	    	 errorObj.error=true
	    	 errorObj.errorMsg.push("Book Id is not valid.");
	    }
   		if(childBook.modal.bookStatus.length<1|| angular.isUndefined(childBook.modal.bookStatus)){
	    	 errorObj.error=true
	    	 errorObj.errorMsg.push("Book Status is not valid.");
	    }
   		if(childBook.modal.outletName.length<1 || angular.isUndefined(childBook.modal.outletName)){
   			errorObj.error=true
   			errorObj.errorMsg.push("OutLet is not valid.");
   		}
   		if(childBook.modal.location.length<1 || angular.isUndefined(childBook.modal.location)){
   			errorObj.error=true
   			errorObj.errorMsg.push("Location is not valid.");
   		}
//   		if(childBook.modal.purchaseDate.length<1 || angular.isUndefined(childBook.modal.purchaseDate)){
//   			errorObj.error=true
//   			errorObj.errorMsg.push("Purchase Date is not valid.");
//   		}
//   		if(childBook.modal.publicationDate.length<1 || angular.isUndefined(childBook.modal.publicationDate)){
//   			errorObj.error=true
//   			errorObj.errorMsg.push("Publication Date is not valid.");
//   		}
   		if(childBook.modal.pricePaid.length<1 || angular.isUndefined(childBook.modal.pricePaid)){
   			errorObj.error=true
   			errorObj.errorMsg.push("Price is not valid.");
   		}
   		if(childBook.modal.barCode.length<1 || angular.isUndefined(childBook.modal.barCode)){
   			errorObj.error=true
   			errorObj.errorMsg.push("Bar Code is not valid.");
   		}
   		if(childBook.modal.description.length<1 || angular.isUndefined(childBook.modal.description)){
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
  	
//	   addCompleteBook();
    }
    
   $scope.addChildTab=function(){
   	console.log("addChildTab ");
   	if(!validateParentBook()){
   		setAllInactive();
        addNewchildBook();
   	}
   	  
//         validateParentBook();
//         console.log("validateParentBook ",validateParentBook());
   }
   
   $scope.childBooks = [];
   
   var setAllInactive = function() {
   	console.log("setAllInactive ");
       angular.forEach($scope.childBooks, function(childBook) {
           childBook.active = false;
       });
   };
    var addNewchildBook = function() {
         var childBookPoJO=appUtils.cloneJSObj(bookClassPOJO.children[0]);
        $scope.childBooks.push(childBookPoJO);
         console.log("childBookPoJO",childBookPoJO);
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
	   if(!validateChildBook($scope.childBooks[0]))
		   addCompleteBook();
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
       
       $('#parentBookViewEditDelforSmy').modal({"backdrop": "static","show":true});
       $('#parentBookViewEditDelforSmy').modal({"show":false});
	   
	   console.log("parentBookViewEditDelforSmy.html: book : ",book, "childbook length : ",book.children.length);	 
//	   $scope.parentBook.
	   angular.copy(book.parentbook,$scope.parentBook);
   }

   /*
    * Open View/Edit/Delete Child Book Modal from Summary
    */
   $scope.openChildBookFromSmy=function(childbook, code){
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


       $('#childBookforEditViewDelete').modal({"backdrop": "static","show":true});
       $('#childBookforEditViewDelete').modal({"show":false});

       console.log("openChildBookFromSmy.html : childbook ", childbook);	   
//       $scope.childBooks[0].childBook.modal=childbook;
   }

   
   /*
    * Open Add Child Book Modal from Summary (+)
    */
   
   $scope.openAddChildFromSmy=function(){
	   $('#childBookModalforSmy').modal('show');
	   console.log("childBooksList.html");	   
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
   
      
      
   
});


