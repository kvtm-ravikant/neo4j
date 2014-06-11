/**
 * Created by Pinki Boora on 2/11/14.
 */
var SocialMediaSchema={
    phone:[],
    email:"",
    country:"",
    state:"",
    city:"",
    addressLine1:"",
    addressLine2:""
}

module.exports.socialMedia=SocialMediaSchema;
var periodTimings={
    name:"",
    break:false,
    startTime:"",
    endTime:""
}
var timeTableEntries={
    courseId:"",
    timeTableWeekDayId:"",
    periodTimingId:"",
    subjectId:"",
    employeeId:""
}
var timeTableWeekDays={
    "1":"Monday",
    "2":"Tuesday",
    "3":"Wednesday",
    "4":"Thursday",
    "5":"Friday",
    "6":"Saturday"
}

var timeTable={
    "Monday":{
        "09:00 AM - 10:00 AM":{
            "teacherName":"Anish",
            "subjectName":"Maths",
            "teacherId":"1",
            "subjectId":"2",
            "isBreak":false
        },
        "10:00 AM - 11:00 AM":{
            "teacherName":"Anish",
            "subjectName":"Maths",
            "teacherId":"1",
            "subjectId":"2",
            "isBreak":false
        },
        "11:00 AM - 12:00 PM":{
            "teacherName":"Anish",
            "subjectName":"Maths",
            "teacherId":"1",
            "subjectId":"2",
            "isBreak":true
        },
        "01:00 PM - 02:00 PM":{
            "teacherName":"Anish",
            "subjectName":"Maths",
            "teacherId":"1",
            "subjectId":"2",
            "isBreak":false
        }
    }
}