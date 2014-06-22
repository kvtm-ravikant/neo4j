/**
 * Created by ravikant on 22/6/14.
 */
modules.exports.appliccations={
    "AM"{//Attendance management
        "screenName":"Attendance Management",
        "state":"manageAttendance"
        "modules":{
            "TA"{ //take attendance
                "screenName":"Take Attendance",
                "state":"manageAttendance.takeAttendance"
            },
            "VRSP"{ //view Attendace Report for student parent
                "screenName":"View Report",
                "state":"manageAttendance.reports.student"
            },
            "VRTP"{ //view Attendace Report for teacher/principle
                "screenName":"View Report",
                "state":"manageAttendance.reports.parent"
            }
        }
    }
}
modules.exports.accessList={
    "AM_TA":"1.1",
    "AM_VRSP":"1.2",
    "AM_VRTP":"1.3"
}
