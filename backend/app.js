const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const {signup,login} = require("./userControls.js");
const {getStudentDetails,getFacultyDetails,getEnrolledStudents,
  docs,getCoursesList,getAssignment,assignmentQuery,attendanceQuery,
  attendanceQueryByFaculty,getFacultyDashboardDetails,getExamsheet
} = require("./getDetails.js")
const {addCourse,addFaculty,addCourses,markAttendance,
  uploadAssignment,uploadExamSheet
}=require("./databaseUpdate.js")
const auth = require('./auth');
const cookieParser = require("cookie-parser");
const fileUpload = require('express-fileupload')
// const jwt = require("jsonwebtoken");

dotenv.config();
const app = express();
app.use(cors());
app.use(fileUpload());

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(__dirname+"/public"));
app.use(cookieParser());

app.get("/api/",docs);

app.post("/api/signup",signup)

app.post("/api/login",login)

app.post("/api/addCourse",addCourse) //admin

app.post("/api/addFaculty",addFaculty) //admin

app.get("/api/getStudentDetails",auth,getStudentDetails) //student

app.get("/api/getFacultyDetails",auth,getFacultyDetails) //admin

app.get('/api/getFacultyDashboardDetails',auth,getFacultyDashboardDetails)

app.get("/api/getEnrolledStudents",auth,getEnrolledStudents) //faculty

app.post("/api/addCourses",addCourses); //admin

app.get("/api/getCoursesList",auth,getCoursesList) //admin

app.post("/api/markAttendance",auth,markAttendance) //faculty

app.get('/api/attendanceQuery',auth,attendanceQuery) //student

app.get('/api/attendanceQueryByFaculty',auth,attendanceQueryByFaculty) //faculty

app.get('/api/assignmentQuery',auth,assignmentQuery) //faculty & student

app.post("/api/uploadAssignment",auth,uploadAssignment) //faculty

app.get("/api/getAssignment",auth,getAssignment) //students & faculty

app.post('/api/uploadExamSheet',auth,uploadExamSheet) //faculty

app.get('/api/getExamsheet',auth,getExamsheet)

app.use('/api/logout', (req, res) => {
    res.cookie("token", null, {
      httpOnly: true,
      Expires: Date.now-1000
    }).send({
      authenticated: false,
      message: "Logout Successful."
    });
  });

  app.use('/api/authStatus', auth,(req, res) => {
    if(!req.user)
        res.status(200).json({isAuthenticated: false})
    else res.status(200).json({isAuthenticated: true,role:req.user.role})
  })

mongoose.connect(process.env.MONGO_DB,{useNewUrlParser: true,useUnifiedTopology: true})
.then(()=>{
    app.listen(3000,function(){
        console.log("Server started on port 3000");
    });
    console.log("Connected to MongoAtlas");
}).catch((err)=>{
    console.log("Error connecting to MongoAtlas... Are you connected to HP??");
    console.log(err);
});