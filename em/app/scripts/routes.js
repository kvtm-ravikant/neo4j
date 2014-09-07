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
            controller:'dashboard',
            data: {
                displayName: 'Dashboard'
            }

        })
        .state('manageAttendance', {
            url: '/manage-attendance',

            // Note: abstract still needs a ui-view for its children to populate.
            // You can simply add it inline here.
            template: '<ui-view/>',
            data: {
                displayName: 'Attendance Management'
            }

        })
            .state('manageAttendance.takeAttendance', {
                parent:'manageAttendance',
                url: "/manage-attendance/create-attendence",
                templateUrl: "partials/modules/manageAttendence/createAttendence.html",
                controller: 'manageAttendence_createAttendence',
                data: {
                    displayName: 'Take Attendance'
                }
            })
            .state('manageAttendance.studentReport', {
                parent:'manageAttendance',
                url: "/manage-attendance/studentReport",
                templateUrl: "partials/modules/manageAttendence/studentParentReport.html",
                controller: 'studentReportCtrl',
                data: {
                    displayName: 'Student Report'
                }
            })
            .state('manageAttendance.teacherReport', {
                parent:'manageAttendance',
                url: "/manage-attendance/teacherReport/",
                templateUrl: "partials/modules/manageAttendence/teacherReport.html",
                controller: 'teacherReportCtrl',
                data:{
                    displayName:'Teacher Report'
                }
             })
        .state('userProfile', {
            url: "/manage-users/user-profile",
            templateUrl: "partials/modules/manageUsers/userProfile.html",
            controller:'user_profile',
            data:{
                displayName:'User Profile'
            }
        })
        /*  .state('manageUser', {
            url: "/manage-users/users",
            templateUrl: "partials/modules/manageUsers/manageUser.html",
            controller:'manage_user'
        })  */
        .state('manageUser', {
            url: '/manage-users/users',
            // Note: abstract still needs a ui-view for its children to populate.
            // You can simply add it inline here.
            template: '<ui-view/>',
            data: {
                displayName: 'User Management'
            }
        })
            .state('manageUser.registerUser', {
                parent:'manageUser',
                url: "/manage-users/users/registerNewUser",
                templateUrl: "partials/modules/manageUsers/manageUser_registerNewUser.html",
                controller: 'manageUser_registerNewUser',
                data:{
                    displayName:'Register User'
                }
            })
             .state('manageUser.updateUser', {
                parent:'manageUser',
                url: "/updateUser",
                templateUrl: "partials/modules/manageUsers/manageUser_updateUser.html",
                controller: 'manageUser_updateUser',
                data:{
                    displayName:'Update User'
                }
            })
               .state('manageUser.deleteUser', {
                parent:'manageUser',
                url: "/deleteUser",
                templateUrl: "partials/modules/manageUsers/manageUser_deleteUser.html",
                controller: 'manageUser_deleteUser',
                data:{
                    displayName:'Delete User'
                }
            })

        .state('schoolManagement', {
            url: "/schoolManagement/admin",
            templateUrl: "partials/modules/schoolAdmin/schoolManagement.html",
            controller:'schoolManagement',
            data:{
                displayName:'School Management'
            }
        })

		.state('libraryManagement', {
            url: '/libraryManagement',
            // Note: abstract still needs a ui-view for its children to populate.
            // You can simply add it inline here.
            template: '<ui-view/>',
            data: {
                displayName: 'Library Management'
            }
        })
        	.state('libraryManagement.searchBook', {
                parent:'libraryManagement',
                url: "/libraryManagement/searchBooks",
                templateUrl: "partials/modules/mangeLibrary/searchBook.html",
                controller: 'libraryManagement_searchBook',
                data:{
                    displayName:'Search Books'
                }
            })
            .state('libraryManagement.addNewBook', {
                parent:'libraryManagement',
                url: "/libraryManagement/addNewBook",
                templateUrl: "partials/modules/mangeLibrary/addNewBook.html",
                controller: 'libraryManagement_addNewBook',
                data:{
                    displayName:'Add New Book'
                }
            })
            .state('libraryManagement.addChildBook', {
                parent:'libraryManagement',
                url: "/libraryManagement/addChildBook",
                templateUrl: "partials/modules/mangeLibrary/addChildBook.html",
                controller: 'libraryManagement_addChildBook',
                data:{
                    displayName:'Add Book copy'
                }
            })
            .state('libraryManagement.inventoryBooks', {
                parent:'libraryManagement',
                url: "/libraryManagement/inventoryBooks",
                templateUrl: "partials/modules/mangeLibrary/inventoryBooks.html",
                controller: 'libraryManagement_inventoryBooks',
                data:{
                    displayName:'Inventory Books'
                }
            })
              /* Libaray Management - End */
});
