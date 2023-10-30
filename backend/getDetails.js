const studentModel = require("./models/student")
const courseModel = require("./models/course")
const facultyModel = require("./models/faculty")
const assignmentModel = require('./models/assignment')
const attendanceModel = require('./models/attendance')
const examsheetModel = require('./models/examsheet')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const docs = async(req,res)=>{
    const obj={
        "/api/": "get documentation",
        "/api/signup":"post {name,password,email,roll,phone}",
        "/api/login":"post {roll,password}",
        '/api/authStatus':"get",
        '/api/logout':"get",
        "/api/addCourse":"post {courseId:courseId,name,totalClasses,facultyId}",
        "/api/getCoursesList":"get ",
        "/api/addCourses":"post {courseId,name,totalClasses,facultyId}",
        "/api/getStudentDetails":"get",
        "/api/getEnrolledStudents":"get {courseId}",
        "/api/addFaculty":"post {facultyId:facultyId,name,password,email,phone}",
        "/api/getFacultyDetails":"get {facultyId}",
        "/api/getFacultyDashboardDetails":"get {facultyId}",
        "/api/markAttendance":"post [{obj1},{obj2}...] & {obj1}={roll,courseId}",
        "/api/attendanceQuery":"get {roll,courseId}",
        "/api/attendanceQueryByFaculty":"get {courseId}",
        "/api/assignmentQuery":"get {courseId}",
        "/api/uploadAssignment":"post {courseId,title,assignmentFile}",
        "/api/getAssignment":"get {courseId,index}",
        "/api/uploadExamSheet":"post {courseId,roll,examsheetFile}",
        "/api/getExamsheet":"get {courseId}->for faculty(returns list of students whose examsheets are uploaded) or {courseId,roll}-> returns examsheet if uploaded"
    }
    res.status(200).json(obj)
}


const getStudentDetails = async(req,res)=>{
    var user,student;
    user=req.user;
    
    // get course object

    const result=await studentModel.aggregate([
        {
            $match: {
                roll:user.roll
            }
        },
        {    
            $lookup: {
                from:"courses",
                localField:"courseId",
                foreignField:"courseId",
                as:"courses"
            }
        // },
        // {
        //     $lookup:{
        //         from:"faculties",
        //         localField:"courses.facultyId",
        //         foreignField:"facultyId",
        //         as:"faculty"
        //     }
        },
        {
            $project:{
                "roll":1,"name":1,"email":1,"phone":1,"courses.courseId":1,"courses.name":1,"courses.totalClasses":1,"courses.commencedClasses":1,"courses.facultyId":1
            }
        }
    ]).exec();

    // console.log(result);
    // student = await result.findOne({roll: user.roll});
    res.status(200).json(result);
    
}

const getFacultyDetails=async (req,res)=>{
    const {facultyId}=req.query;
    const result = await facultyModel.findOne({facultyId:facultyId});
    if(!result){
        return res.status(404).json({msg: "No record found for this facultyId"});
    }else res.status(200).json({"facultyId":result.facultyId,"name":result.name,"email":result.email});
}

const getEnrolledStudents=async (req,res)=>{
    const {courseId}=req.query;
    const result = await studentModel.find({courseId:courseId});
    if(!result){
        return res.status(404).json({msg: "No record found for this courseId"});
    }else{
        const finalData = result.map(({roll, name,email,phone}) => ({roll, name,email,phone})); 
        res.status(200).json(finalData);
    }
}

const getCoursesList = async (req,res)=>{
    const result = await courseModel.find({});
    if(!result){
        return res.status(404).json({"msg": "No record found"});
    }else{
        return res.status(200).json(result);
    }
}

const getAssignment = async(req,res)=>{
    const courseId=req.query.courseId,assignmentNo=req.query.index;
    const result = await assignmentModel.findOne({courseId:courseId})
    if(result.length===0){
        return res.status(404).json({msg:`Database is not having assignment${assignmentNo} for courseId ${courseId}`})
    }else{
        // console.log(__dirname+result[0].fileLink)
        if(result.assignments.length>assignmentNo)
            return res.status(200).sendFile(result.assignments[assignmentNo].fileLink)
        else
            return res.status(404).json({msg:`Database is not having assignment${assignmentNo} for courseId ${courseId}`})
        // return res.status(200).sendFile(__dirname+result[0].fileLink);
    }
}

const fetchMarksheet = async(req,res)=>{
    return res.status(200).json({msg:"Not implemented..."})
}

const assignmentQuery = async (req,res)=>{
    const courseId = req.query.courseId;
    const result = await assignmentModel.findOne({courseId:courseId},{assignments:1})
    if(result.length===0){
        res.status(404).json({msg:`No assignment found for courseId ${courseId}`})
    }else{
        const newResult={assignments:[]}
        newResult.assignments = result.assignments.map(({title})=>({title}))
        console.log(newResult)
        res.status(200).json(newResult)
    }
}

const attendanceQuery = async (req,res)=>{
    const roll = req.query.roll,courseId = req.query.courseId;
    try{
        const result = await attendanceModel.find({courseId:courseId,roll:roll},{date:1,_id:0})
        newResult = result.map((item)=>(item.date))
        res.status(200).json(newResult);
    }catch(err){
        res.status(401).json(err);
    }
}

const attendanceQueryByFaculty = async (req,res)=>{
    const courseId = req.query.courseId;
    try{
        const result = await attendanceModel.find({courseId:courseId},{roll:1,date:1,_id:0});
        res.status(200).json(result);
    }catch(err){
        return res.status(401).json(err);
    }
}

const getFacultyDashboardDetails = async(req,res)=>{
    const facultyId=req.query.facultyId;
    try{
        const result = await courseModel.find(
            {facultyId:facultyId},
            {_id:0,courseId: 1,name: 1,totalClasses: 1,commencedClasses: 1}
        )
        if(result.length===0)
            res.status(200).json({msg:`${facultyId} is not enrolled in any courses`})
        else res.status(200).json(result)
    }catch(err){
        res.status(401).json(err)
    }
}

const getExamsheet = async(req,res)=>{
    if(req.user.role=='student' || req.query.roll!=undefined){
        const {courseId,roll}=req.query
        try{
            const result = await examsheetModel.findOne({courseId:courseId,roll:roll})
            if(!result)
                return res.status(200).json({msg:"Examsheet not uploaded till now, Check again later..."})
            return res.status(200).sendFile(result.fileLink)
        }catch(err){
            return res.status(401).json(err)
        }
    }else if(req.user.role=='faculty'){
        const {courseId}=req.query
        try{
            const result=await examsheetModel.find({courseId:courseId},{roll:1,_id:0})
            const newResult=result.map((item)=>(item.roll))
            return res.status(200).json(newResult)
        }catch(err){
            return res.status(401).json(err)
        }
    }else if(req.user.role=='admin'){
        res.status(400).json({msg:"Feature under development..."})
    }else{
        res.status(401).json({msg:"Hackor..."})
    }
}

module.exports = {
    getStudentDetails,getFacultyDetails,getEnrolledStudents,
    docs,getCoursesList,getAssignment,assignmentQuery,attendanceQuery,
    attendanceQueryByFaculty,getFacultyDashboardDetails,getExamsheet
};
