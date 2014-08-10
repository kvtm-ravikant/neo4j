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
        .state('manageUser', {
            url: "/manage-users/users",
            templateUrl: "partials/modules/manageUsers/manageUser.html",
            controller:'manage_user'
        })
        .state('schoolManagement', {
            url: "/schoolManagement/admin",
            templateUrl: "partials/modules/schoolAdmin/schoolManagement.html",
            controller:'schoolManagement'
        })
        .state('libraryManagement', {
            url: "/libraryManagement/index",
            templateUrl: "partials/modules/mangeLibrary/mangeLibrary.html",
            controller:'libraryManagement'
        })

});
