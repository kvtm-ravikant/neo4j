'use strict';
educationMediaApp.config(['$routeProvider','$locationProvider',function($routeProvider, $locationProvider){
    $routeProvider
        .when("/", { redirectTo: "/manage-attendance/create-attendence" })
        .when("/manage-users/create-user", {templateUrl: "partials/modules/manageUsers/createUser", controller: "manageUsers_createUsers" })
        .when("/manage-org/create-org", {templateUrl: "partials/modules/manageOrg/createOrg", controller: "manageOrg_createOrg" })
        .when("/manage-attendance/create-attendence", {templateUrl: "partials/modules/manageAttendence/createAttendence", controller: "manageAttendence_createAttendence" })
        .otherwise({ redirectTo: "/" });
}]);