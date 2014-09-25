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
                    appUtils.defaultParseResponse(dataResponse,function(dataResponse){
                       $scope.bookClass=dataResponse;
                       $scope.parentBook=dataResponse.parentbook;
                       $scope.childBookArray=dataResponse.children;
                       $scope.childBookClassModal=dataResponse.children[0];
//                       console.log("getBookPOJO",dataResponse," bookClass : ",$scope.bookClass," $scope.childBookArray : ",$scope.childBookArray," $scope.parentBook : ", $scope.parentBook);
                       console.log("$scope.childBookClassModal : ",$scope.childBookClassModal);
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
          console.log("$scope.parentBookDD",$scope.parentBookDD);
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
      if($scope.parentBook.edition.length<2|| angular.isUndefined($scope.parentBook.edition)){
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
    
    $scope.addChildTab=function(){
    	console.log("addChildTab ");
    	if(!validateParentBook()){
    		setAllInactive();
            addNewchildBook();
    	}
    	  
//          validateParentBook();
          console.log("validateParentBook ",validateParentBook());
    }
    
    var setAllInactive = function() {
    	console.log("setAllInactive ");
        angular.forEach($scope.childBooks, function(childBook) {
            childBook.active = false;
        });
    };
 
   $scope.validateChildBook=function(){
    	console.log("Modal Check", $scope.childBookClassModal);
    }
    
    var addNewchildBook = function() {   
//    	 var id = $scope.childBooks.length + 1;
    	 var id = $scope.childBooks.length;
    	if($scope.childBooks.length<1){
    		$scope.childBooks.push({
                id: id+1,
                name: "Book Copy",// + id,
                active: true
            });	
    	}
    	
    	if($scope.childBooks.length<5 && $scope.childBooks.length>0){
    		console.log("bookCopyInfo{{childBook.id}} : ",$scope.childBooks[0]," $('#bookCopyInfo1') : ",$('#bookCopyInfo1'));
    	}
    	
//    	if($scope.childBooks.length<1)
//    		appUtils.showError("Child test");	
//    		
//        var id = $scope.childBooks.length + 1;
//        if($scope.childBooks.length<5){
//        	$scope.childBooks.push({
//                id: id,
//                name: "Book Copy",// + id,
//                active: true
//            });	
//        }
//        else
//        	appUtils.showError("You cannot add more than 5 Books !");
        
        console.log("addNewchildBook ",id,"childBooks : ",$scope.childBooks );
    };
 
    $scope.childBooks =
    [
//        { id: "1", name: "Book Copy", active:false }
    ];
 
});


