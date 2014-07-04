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
                    'accessList':["2"]

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
                    'accessList':["2"]
                }
            ]
        },
        {
            'state': 'manageUser',
            'name':'Manage Users',
            'collapse':false,
            'icon':"users"
        }
    ];
    return appList;
}