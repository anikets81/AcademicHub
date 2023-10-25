const courseModel = require("./models/course");
const facultyModel = require("./models/faculty");
const attendanceModel = require("./models/attendance");
const assignmentModel = require("./models/assignment")
const examsheetModel = require('./models/examsheet')
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
        const courseId = objArray[0].courseId
        await attendanceModel.insertMany(objArray)
        await courseModel.findOneAndUpdate({courseId:courseId}, {$inc : {commencedClasses : 1}}).exec();
        res.status(200).json({"msg":"Attendance Updated"})
    }catch(error){
        console.log(error)
        res.status(500).json({"msg":"Unable to submit Attendance"})
    }
}

const uploadAssignment = async(req,res)=>{
    const courseId = req.body.courseId,title=req.body.title;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    const assignmentFile = req.files.assignmentFile;
    const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9)
    const uploadPath ='/assignments/' + uniqueSuffix + assignmentFile.name;

    // Use the mv() method to place the file somewhere on your server
    assignmentFile.mv(__dirname+uploadPath, async function(err) {
        if (err)
        return res.status(500).send(err);
        
        const result = await assignmentModel.find({courseId:req.body.courseId})
        const assignments={title:title,fileLink:__dirname+uploadPath}
        // File was uploaded successfully
        if(result.length===0){  //create the document for course
            try{
                await assignmentModel.create({
                    courseId:courseId,
                    assignments:assignments
                })
                return res.status(200).json({msg:"File uploaded successfully"})
            }catch(error){
                return res.status(400).json({msg:error})
            }
        }else{
            try{
                await assignmentModel.findOneAndUpdate(
                    {courseId:courseId},
                    {$push:{assignments:assignments}}
                )
                return res.status(200).json({msg:"File uploaded successfully"})
            }catch(errror){
                return res.status(400).json({msg:error})
            }
        }
        
    });
}

const uploadExamSheet = async(req,res)=>{
    const courseId = req.body.courseId,studentRoll=req.body.roll;
    console.log(courseId,studentRoll)
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    const assignmentFile = req.files.examsheetFile;
    const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9)
    const uploadPath ='/examsheets/' + uniqueSuffix + assignmentFile.name;
    const result = await examsheetModel.findOne({courseId:req.body.courseId,roll:studentRoll})
    if(result)
        return res.status(401).json({msg:`Examsheet for studentId ${studentRoll} is already uploaded`})
    // Use the mv() method to place the file somewhere on your server
    assignmentFile.mv(__dirname+uploadPath, async function(err) {
        if (err)
        return res.status(500).json({err:err,msg:"errorAtUpload"});
        
        
        // roll:studentRoll,courseId:courseId,fileLink:__dirname+uploadPath
        // File was uploaded successfully
        try{
            await examsheetModel.create({
                roll:studentRoll,
                courseId:courseId,
                fileLink:__dirname+uploadPath
            })
            return res.status(200).json({msg:`Examsheet for studentId ${studentRoll} uploaded successfully`})
        }catch(error){
            return res.status(400).json({msg:error})
        }
    });
}

module.exports = {addCourse,addFaculty,addCourses,markAttendance,uploadAssignment,uploadExamSheet};