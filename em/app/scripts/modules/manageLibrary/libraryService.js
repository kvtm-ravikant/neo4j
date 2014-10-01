/**
 * Created by ravikant on 20/9/14.
 */
educationMediaApp.service('libraryService',function($http, $q){
        return({
            getAllBooks: getAllBooks,
            getBookPOJO:getBookPOJO,
            getLanguageDD:getLanguageDD,
            getParentBookDD:getParentBookDD,
            updateParentBook:updateParentBook,
            deleteParentBook:deleteParentBook,
            searchISBN:searchISBN
        });
        function getAllBooks(){
            var request = $http({
                method: "get",
                url: "/manageLibrary/getAllBooks"
            });
            return( request.then( handleSuccess, handleError ) );
        }
        function getBookPOJO(){
            var request = $http({
                method: "get",
                url: "/manageLibrary/getBookPOJO"
            });
            return( request.then( handleSuccess, handleError ) );
        }
        function getLanguageDD(){
            var request = $http({
                method: "get",
                url: "/manageLibrary/getLanguages"
            });
            return( request.then( handleSuccess, handleError ) );
        }
        function getParentBookDD(){
            var request = $http({
                method: "get",
                url: "/manageLibrary/getParentBookDD"
            });
            return( request.then( handleSuccess, handleError ) );
        }
        function searchISBN(parentBook){
            var request = $http({
                method: "POST",
                url: "/manageLibrary/searchISBN",
                data : parentBook,
                headers : {
        			'Content-Type' : 'application/json'
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }
        function updateParentBook(parentBook){
            var request = $http({
                method: "POST",
                url: "/manageLibrary/updateParentBook",
                data : parentBook,
                headers : {
        			'Content-Type' : 'application/json'
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }
        function deleteParentBook(parentBook){
            var request = $http({
                method: "POST",
                url: "/manageLibrary/deleteParentBook",
                data : parentBook,
                headers : {
        			'Content-Type' : 'application/json'
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }
//        function updateChildBook(selectedBook){
//            var request = $http({
//                method: "POST",
//                url: "/manageLibrary/updateChildBook",
//                data : selectedBook,
//                headers : {
//        			'Content-Type' : 'application/json'
//                }
//            });
//            return( request.then( handleSuccess, handleError ) );
//        }
//        function deleteParentBook(selectedBook){
//            var request = $http({
//                method: "POST",
//                url: "/manageLibrary/deleteParentBook",
//                data : selectedBook,
//                headers : {
//        			'Content-Type' : 'application/json'
//                }
//            });
//            return( request.then( handleSuccess, handleError ) );
//        }
      
		
		

        // I transform the error response, unwrapping the application data from
        // the API response payload.
        function handleError( response ) {

            // The API response from the server should be returned in a
            // nomralized format. However, if the request was not handled by the
            // server (or what not handles properly - ex. server error), then we
            // may have to normalize it on our end, as best we can.
            if (
                ! angular.isObject( response.data ) ||
                    ! response.data.message
                ) {

                return( $q.reject( "An unknown error occurred." ) );

            }

            // Otherwise, use expected error message.
            return( $q.reject( response.data.message ) );

        }
        // I transform the successful response, unwrapping the application data
        // from the API response payload.
        function handleSuccess( response ) {

            return( response.data );

        }

});
