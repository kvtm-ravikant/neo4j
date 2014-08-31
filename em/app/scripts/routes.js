'use strict';
/*
educationMediaApp.config(['$routeProvider','$locationProvider',function($routeProvider, $locationProvider){
    $routeProvider
        .when("/", { redirectTo: "/manage-attendance/create-attendence" })
        .when("/manage-users/user-profile", {templateUrl: "partials/modules/manageUsers/userProfile", controller: "user_profile" })
        .when("/manage-users/users", {templateUrl: "partials/modules/manageUsers/manageUser", controller: "manage_user" })
        .when("/manage-org/create-org", {templateUrl: "partials/modules/manageOrg/createOrg", controller: "manageOrg_createOrg" })
        .when("/manage-attendance/create-attendence", {templateUrl: "partials/modules/manageAttendence/createAttendence", controller: "manageAttendence_createAttendence" })
        .otherwise({ redirectTo: "/" });
}]);*/
educationMediaApp.config(function($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/manage-users/user-profile");
    //
    // Now set up the states
    $stateProvider
        .state('dashboard', {
            url: "/dashboard",
            templateUrl: "partials/dashboard.html",
            controller:'dashboard'

        })
        .state('manageAttendance', {
            abstract: true,
            url: '/manage-attendance',

            // Note: abstract still needs a ui-view for its children to populate.
            // You can simply add it inline here.
            template: '<ui-view/>'
        })
            .state('manageAttendance.takeAttendance', {
                parent:'manageAttendance',
                url: "/manage-attendance/create-attendence",
                templateUrl: "partials/modules/manageAttendence/createAttendence.html",
                controller: 'manageAttendence_createAttendence'
            })
            .state('manageAttendance.studentReport', {
                parent:'manageAttendance',
                url: "/manage-attendance/studentReport",
                templateUrl: "partials/modules/manageAttendence/studentParentReport.html",
                controller: 'studentReportCtrl'
            })
            .state('manageAttendance.teacherReport', {
                parent:'manageAttendance',
                url: "/manage-attendance/teacherReport/",
                templateUrl: "partials/modules/manageAttendence/teacherReport.html",
                controller: 'teacherReportCtrl'
             })
        .state('userProfile', {
            url: "/manage-users/user-profile",
            templateUrl: "partials/modules/manageUsers/userProfile.html",
            controller:'user_profile'
        })
        /*  .state('manageUser', {
            url: "/manage-users/users",
            templateUrl: "partials/modules/manageUsers/manageUser.html",
            controller:'manage_user'
        })  */
        .state('manageUser', {
            abstract: true,
            url: '/manage-users/users',
            // Note: abstract still needs a ui-view for its children to populate.
            // You can simply add it inline here.
            template: '<ui-view/>'
        })
            .state('manageUser.registerUser', {
                parent:'manageUser',
                url: "/manage-users/users/registerNewUser",
                templateUrl: "partials/modules/manageUsers/manageUser_registerNewUser.html",
                controller: 'manageUser_registerNewUser'
            })
             .state('manageUser.updateUser', {
                parent:'manageUser',
                url: "/manage-users/users/updateUser",
                templateUrl: "partials/modules/manageUsers/manageUser_updateUser.html",
                controller: 'manageUser_updateUser'
            })
               .state('manageUser.deleteUser', {
                parent:'manageUser',
                url: "/manage-users/users/deleteUser",
                templateUrl: "partials/modules/manageUsers/manageUser_deleteUser.html",
                controller: 'manageUser_deleteUser'
            })

        .state('schoolManagement', {
            url: "/schoolManagement/admin",
            templateUrl: "partials/modules/schoolAdmin/schoolManagement.html",
            controller:'schoolManagement'
        })
        /* Libaray Management - Start */
        /*
        .state('libraryManagement', {
            url: "/libraryManagement/index",
            templateUrl: "partials/modules/mangeLibrary/mangeLibrary.html",
            controller:'libraryManagement'
        })
        */
		.state('libraryManagement', {
             abstract: true,
            url: '/libraryManagement',
            // Note: abstract still needs a ui-view for its children to populate.
            // You can simply add it inline here.
            template: '<ui-view/>'
        })
        	.state('libraryManagement.searchBook', {
                parent:'libraryManagement',
                url: "/libraryManagement/searchBooks",
                templateUrl: "partials/modules/mangeLibrary/searchBook.html",
                controller: 'libraryManagement_searchBook'
            })
            .state('libraryManagement.addNewBook', {
                parent:'libraryManagement',
                url: "/libraryManagement/addNewBook",
                templateUrl: "partials/modules/mangeLibrary/addNewBook.html",
                controller: 'libraryManagement_addNewBook'
            })
            .state('libraryManagement.addChildBook', {
                parent:'libraryManagement',
                url: "/libraryManagement/addChildBook",
                templateUrl: "partials/modules/mangeLibrary/addChildBook.html",
                controller: 'libraryManagement_addChildBook'
            })
            .state('libraryManagement.inventoryBooks', {
                parent:'libraryManagement',
                url: "/libraryManagement/inventoryBooks",
                templateUrl: "partials/modules/mangeLibrary/inventoryBooks.html",
                controller: 'libraryManagement_inventoryBooks'
            })
              /* Libaray Management - End */
});
