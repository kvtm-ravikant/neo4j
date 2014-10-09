/**
 * Created by ravikant on 22/6/14.
 */
module.exports.getAppList=function(){
    return initAppList;
};

function initAppList(){
    var appList=[
       /*{
            'state': 'dashboard',
            'name':'Dashboard',
            'collapse':true,
            'icon':"dashboard",
            'abstract':false,
            'accessList':["*"]
        },*/
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
                    'accessList':["2"]
                },
                {
                    'state': 'manageAttendance.studentReport',
                    'name':'Attendence Report',
                    'collapse':true,
                    'icon':"sitemap",
                    'accessList':["2","3"]
                },
                {
                    'state': 'manageAttendance.teacherReport',
                    'name':'Attendence Report',
                    'collapse':true,
                    'icon':"sitemap",
                    'accessList':["3","2"]
                }
            ]
        },
       
        {
            'state': 'manageUser',
            'name':'Manage Users',
            'collapse':true,
            'icon':"users",
            'accessList':["2"]
        },

        /* User Management -  End */
        /* Library Management -  Start */
        {
            'state': 'libraryManagement',
            'name':'Library  Management',
            'collapse':true,
            'icon':"book",
            'accessList':["2"]
        },
        {
            'state': 'schoolManagement',
            'name':'Manage School',
            'collapse':true,
            'icon':"users",
            'accessList':["2"]
        }
        
    ];
    return appList;
}