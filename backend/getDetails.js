const studentModel = require("./models/student");
const courseModel = require("./models/course");
const facultyModel = require("./models/faculty")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

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

module.exports = {getStudentDetails,getFacultyDetails};