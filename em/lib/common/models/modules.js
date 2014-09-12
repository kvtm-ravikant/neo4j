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
            'collapse':true,
            'icon':"dashboard",
            'abstract':false,
            'accessList':["*"]
        },
        {
            'state': 'manageAttendance',
            'name':'Manage Attendence',
            'collapse':true,
            'icon':"edit",
            'abstract':true,
            'accessList':["*"],
            "childLinks":[
                {
                    'state': 'manageAttendance.takeAttendance',
                    'name':'Take Attendence',
                    'collapse':true,
                    'icon':"sitemap",
                    'accessList':["0","2"]
                },
                {
                    'state': 'manageAttendance.studentReport',
                    'name':'Attendence Report',
                    'collapse':true,
                    'icon':"sitemap",
                    'accessList':["1","3"]
                },
                {
                    'state': 'manageAttendance.teacherReport',
                    'name':'Attendence Report',
                    'collapse':true,
                    'icon':"sitemap",
                    'accessList':["0","2"]
                }
            ]
        },
        {
            'state': 'manageUser',
            'name':'Manage Users',
            'collapse':true,
            'icon':"users",
            'abstract':true,
            'accessList':["*"],
            "childLinks":[
               /* {
                    'state': 'manageUser.registerUser',
                    'name':'New User',
                    'collapse':true,
                    'icon':"user",
                    'accessList':["*"]
                },*/
                {
                    'state': 'manageUser.updateUser',
                    'name':'Update User',
                    'collapse':true,
                    'icon':"updUser",
                    'accessList':["*"]
                }/*,
                {
                    'state': 'manageUser.deleteUser',
                    'name':'Delete User',
                    'collapse':true,
                    'icon':"erase",
                    'accessList':["*"]
                },
                {
                    'state': 'manageUser.testUser',
                    'name':'Test User',
                    'collapse':true,
                    'icon':"erase",
                    'accessList':["*"]
                }*/
            ]
        },

        /* User Management -  End */
        /* Library Management -  Start */
        {
            'state': 'libraryManagement',
            'name':'Library  Management',
            'collapse':true,
            'icon':"book",
            'accessList':["*"],
            'abstract':true,
            "childLinks":[
                {
                    'state': 'libraryManagement.searchBook',
                    'name':'Search',
                    'collapse':true,
                    'icon':"search",
                    'accessList':["*"]
                },
                 {
                    'state': 'libraryManagement.inventoryBooks',
                    'name':'Inventory',
                    'collapse':true,
                    'icon':"exitin",
                    'accessList':["*"]
                },
                {
                    'state': 'libraryManagement.addNewBook',
                    'name':'Add New Title',
                    'collapse':true,
                    'icon':"add",
                    'accessList':["*"]
                },
                {
                    'state': 'libraryManagement.addChildBook',
                    'name':'Add Books',
                    'collapse':true,
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
            'collapse':true,
            'icon':"users",
            'accessList':["*"]
        }
        */
    ];
    return appList;
}