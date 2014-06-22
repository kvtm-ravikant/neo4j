/**
 * Created by Ravikant on 2/1/14.
 */
'use strict';

angular.module('educationMediaApp').controller('SideNavBarCtrl', function ($scope, $location,iconClassMapping) {
    $scope.iconClassMapping=iconClassMapping;
    $scope.toggleMenu=function(obj){
       console.log("toggleMenu",obj);
       obj=!obj;
    }
    $scope.menu = [
        {
            'state': 'dashboard',
            'name':'Dashboard',
            'collapse':false,
            'icon':"dashboard"
        },

        {
            'state': 'takeAttendance',
            'name':'Take Attendence',
            'collapse':false,
            'icon':"sitemap"
        },
        {
            'state': 'studentReport',
            'name':'Student Attendence Report',
            'collapse':false,
            'icon':"sitemap"
        },
        {
            'state': 'teacherReport',
            'name':'Teacher Attendence Report',
            'collapse':false,
            'icon':"sitemap"
        },
        {
            'state': 'manageUser',
            'name':'Manage Users',
            'collapse':false,
            'icon':"users"
        }
        ];

    $scope.isActive = function(route) {
        return route === $location.path();
    };
});