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
    $urlRouterProvider.otherwise("/dashboard");
    //
    // Now set up the states
    $stateProvider
        .state('dashboard', {
            url: "/dashboard",
            templateUrl: "partials/dashboard.html",
            controller:'dashboard'

        })
        .state('takeAttendance', {
            url: "/manage-attendance/create-attendence",
            templateUrl: "partials/modules/manageAttendence/createAttendence.html",
            controller: 'manageAttendence_createAttendence'
        })
        .state('studentReport', {
            url: "/manage-attendance/studentReport",
            templateUrl: "partials/modules/manageAttendence/studentParentReport.html",
            controller: 'studentReportCtrl'
        })
        .state('teacherReport', {
            url: "/manage-attendance/teacherReport/",
            templateUrl: "partials/modules/manageAttendence/teacherReport.html",
            controller: 'teacherReportCtrl'
         })

        .state('userProfile', {
            url: "/manage-users/user-profile",
            templateUrl: "partials/modules/manageUsers/userProfile.html",
            controller:'user_profile'
        }).state('manageUser', {
            url: "/manage-users/users",
            templateUrl: "partials/modules/manageUsers/manageUser.html",
            controller:'manage_user'
        })

});
