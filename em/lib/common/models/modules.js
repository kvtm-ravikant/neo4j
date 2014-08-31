/**
 * Created by ravikant on 22/6/14.
 */
module.exports.getAppList=function(){
    return initAppList;
};

function initAppList(){
    var appList=[
       {
            'state': 'dashboard',
            'name':'Dashboard',
            'collapse':false,
            'icon':"dashboard",
            'abstract':false,
            'accessList':["*"]
        },
        {
            'state': 'manageAttendance',
            'name':'Manage Attendence',
            'collapse':true,
            'icon':"sitemap",
            'abstract':true,
            'accessList':["*"],
            "childLinks":[
                {
                    'state': 'manageAttendance.takeAttendance',
                    'name':'Take Attendence',
                    'collapse':false,
                    'icon':"sitemap",
                    'accessList':["0","2"]
                },
                {
                    'state': 'manageAttendance.studentReport',
                    'name':'Attendence Report',
                    'collapse':false,
                    'icon':"sitemap",
                    'accessList':["1","3"]
                },
                {
                    'state': 'manageAttendance.teacherReport',
                    'name':'Attendence Report',
                    'collapse':false,
                    'icon':"sitemap",
                    'accessList':["0","2"]
                }
            ]
        },
        {
            'state': 'manageUser',
            'name':'Manage Users',
            'collapse':true,
            'icon':"sitemap",
            'abstract':true,
            'accessList':["*"],
            "childLinks":[
                {
                    'state': 'manageUser.registerUser',
                    'name':'New User',
                    'collapse':false,
                    'icon':"sitemap",
                    'accessList':["*"]
                },
                {
                    'state': 'manageUser.updateUser',
                    'name':'Update User',
                    'collapse':false,
                    'icon':"sitemap",
                    'accessList':["*"]
                },
                {
                    'state': 'manageUser.deleteUser',
                    'name':'Delete User',
                    'collapse':false,
                    'icon':"sitemap",
                    'accessList':["*"]
                }
            ]
        },

        /* User Management -  End */
        /* Library Management -  Start */
        {
            'state': 'libraryManagement',
            'name':'Lirbrary  Management',
            'collapse':true,
            'icon':"users",
            'accessList':["*"],
            'abstract':true,
            "childLinks":[
                {
                    'state': 'libraryManagement.searchBook',
                    'name':'Search',
                    'collapse':false,
                    'icon':"search",
                    'accessList':["*"]
                },
                 {
                    'state': 'libraryManagement.inventoryBooks',
                    'name':'Inventory',
                    'collapse':false,
                    'icon':"inventory",
                    'accessList':["*"]
                },
                {
                    'state': 'libraryManagement.addNewBook',
                    'name':'Add New Title',
                    'collapse':false,
                    'icon':"add",
                    'accessList':["*"]
                },
                {
                    'state': 'libraryManagement.addChildBook',
                    'name':'Add Books',
                    'collapse':false,
                    'icon':"add",
                    'accessList':["*"]
                }
            ]
        }
        /* Library Management -  End */
       /* {
            'state': 'libraryManagement',
            'name':'Lirbrary  Management',
            'collapse':true,
            'icon':"users",
            'accessList':["*"]
        },
        {
            'state': 'schoolManagement',
            'name':'Manage School',
            'collapse':false,
            'icon':"users",
            'accessList':["*"]
        }
        */
    ];
    return appList;
}