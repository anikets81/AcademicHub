const courseModel = require("./models/course");
const facultyModel = require("./models/faculty");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const addCourse = async (req,res)=>{
    const {courseId,name,totalClasses,facultyId} = req.body;

    try{
        const course = await courseModel.findOne({courseId: courseId});
        if(course){
            return res.status(400).json({msg: "CourseId already exists"});
        }
        const newCourse = await courseModel.create({
            courseId:courseId,
            name:name,
            totalClasses:totalClasses,
            facultyId:facultyId
        });

        res.status(200).json({"msg":"Success"});
    }catch(error){
        console.log(error);
        res.status(500).json({msg:"something went wrong..."});
    }
}

const addFaculty = async (req,res)=>{
    const {facultyId,name,password,email,phone} = req.body;

    try{
        const faculty = await facultyModel.findOne({facultyId: facultyId});
        if(faculty){
            return res.status(400).json({msg: "FacultyId already exists"});
        }
        const newFaculty = await facultyModel.create({
            facultyId:facultyId,
            name:name,
            password:password,
            email:email,
            phone:phone
        });

        res.status(200).json({"msg":"Success"});
    }catch(error){
        console.log(error);
        res.status(500).json({msg:"something went wrong..."});
    }
}

module.exports = {addCourse,addFaculty};