const courseModel = require("./models/course");
const facultyModel = require("./models/faculty");
const attendanceModel = require("./models/attendance");
const assignemntModel = require("./models/assignment")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const multer  = require('multer')

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

const addCourses = async (req,res)=>{
    const courses = req.body;

    try{
        await courseModel.insertMany(courses);
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
        res.status(500).json({"msg":"something went wrong..."});
    }
}

const markAttendance = async(req,res)=>{
    // req.body contains [{obj1},{obj2}...] & {obj1}={roll,courseId}
    const objArray=req.body;
    try{
        const result = await attendanceModel.insertMany(objArray)
        console.log(result)
        res.status(500).json({"msg":"Attendance Updated"})
    }catch(error){
        console.log(error)
        res.status(500).json({"msg":"Unable to submit Attendance"})
    }
}

const uploadAssignment = async(req,res)=>{
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    
    // upload.single('MyAssignment'),(req,res)=>{
    //     console.log(req.file)
    //     res.status(200).json({"msg":"file uploaded"})
    // }
    const assignmentDirectory = '/assignments'
    
    try{
        var fileName;
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                // make sure the given directory exists already otherwise it will throw error
                cb(null, __dirname+assignmentDirectory)
            },
            filename: function (req, file, cb) {
                const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9)
                fileName=file.originalname + uniqueSuffix+'.pdf'
                cb(null, fileName)
            }
        })
        const upload = multer({ storage: storage })
        upload.single('assignmentFile')(req, res, function (error) {
            if (error) {
                // Handle the upload error
                return res.status(500).json({"msg":'File upload failed: ' + error.message});
            }
            console.log(req.file)
            console.log(req.body.courseId)
            // File was uploaded successfully
            assignemntModel.create({
                courseId:req.body.courseId,
                fileLink:assignmentDirectory+'/'+fileName
            })
            res.status(200).json({'msg':'File uploaded successfully',"fileDir":__dirname+assignmentDirectory+'/'+fileName});
            // res.status(200).sendFile(__dirname+'/assignments/'+fileName);    //sending file in res body
            });
    }catch(error){
        console.log(error);
        res.status(500).json({"msg":"Somthing went wrong..."})
    }
}

module.exports = {addCourse,addFaculty,addCourses,markAttendance,uploadAssignment};