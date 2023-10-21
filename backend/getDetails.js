const studentModel = require("./models/student")
const courseModel = require("./models/course")
const facultyModel = require("./models/faculty")
const assignmentModel = require('./model/assignemnt')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const docs = async(req,res)=>{
    const obj={
        "/signup":"post {name,password,email,roll,phone}",
        "/login":"post {roll,password}",
        "/addCourse":"post {courseId:courseId,name,totalClasses,facultyId}",
        "/addFaculty":"post {facultyId:facultyId,name,password,email,phone}",
        "/getStudentDetails":"get",
        "/getFacultyDetails":"get {facultyId}",
        "/getEnrolledStudents":"get {courseId}",
        '/logout':"get",
        '/authStatus':"get"
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
                "roll":1,"name":1,"email":1,"phone":1,"courses.courseId":1,"courses.name":1,"courses.totalClasses":1,"courses.facultyId":1
            }
        }
    ]).exec();

    // console.log(result);
    // student = await result.findOne({roll: user.roll});
    res.status(200).json(result);
    
}

const getFacultyDetails=async (req,res)=>{
    const {facultyId}=req.body;
    const result = await facultyModel.findOne({facultyId:facultyId});
    if(!result){
        return res.status(404).json({msg: "No record found for this facultyId"});
    }else res.status(200).json({"facultyId":result.facultyId,"name":result.name,"email":result.email});
}

const getEnrolledStudents=async (req,res)=>{
    const {courseId}=req.body;
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
        return res.status(404).json({msg: "No record found"});
    }else{
        return res.status(200).json(result);
    }
}

module.exports = {getStudentDetails,getFacultyDetails,getEnrolledStudents,docs,getCoursesList,fetchAssignment};