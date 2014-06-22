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
            'title': 'Attendence System',
            'name':'Manage Attendence',
            'link': '/index#/manage-attendence/create-attendence',
            'collapse':false,
            'icon':"sitemap"/*,
            'childLinks':[
                {
                    'title': 'Manage Attendance',
                    'name':'Manage TimeTable',
                    'link': '/index#/manage-attendence/create-attendence',
                    'icon':'plusCircle',
                    'childLinks':[
                    ]

                }
            ]*/
        },
        {
            'title': 'Mange Users',
            'name':'Manage Users',
            'link': '/index#/manage-users/users',
            'collapse':false,
            'icon':"users"/*,
            'childLinks':[
                {
                    'title': 'Manage Attendance',
                    'name':'Manage TimeTable',
                    'link': '/index#/manage-attendence/create-attendence',
                    'icon':'plusCircle',
                    'childLinks':[
                    ]

                }
            ]*/
        }
       /* {
            'title': 'Manage Organization',
            'name':'Organization',
            'link': '/index#/manage-org/create-org',
            'collapse':false,
            'icon':"sitemap",
            'childLinks':[
                {
                    'title': 'Create Organization',
                    'name':'Create Organization',
                    'link': '/index#/manage-org/create-org',
                    'icon':'plusCircle',
                    'childLinks':[
                    ]

                },
                {
                    'title': 'Edit Organization',
                    'name':'Edit Organization',
                    'link': '/index#/user/editOrganization',
                    'icon':'pencilSquare',
                    'childLinks':[
                    ]

                }
            ]
        },
        {
        'title': 'Manage User',
        'name':'User',
        'link': 'index#/manage-users/create-user',
        'collapse':false,
        'icon':"users",
        'childLinks':[
            {
                'title': 'Create User',
                'name':'Create User',
                'link': '/index#/manage-users/create-user',
                'icon':'plusCircle',
                'childLinks':[
                ]

            },
            {
                'title': 'Edit User',
                'name':'Edit User',
                'link': '/index#/user/editUser',
                'icon':'pencilSquare',
                'childLinks':[
                ]

            }
          ]
        }*/
        ];

    $scope.isActive = function(route) {
        return route === $location.path();
    };
});