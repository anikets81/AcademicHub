const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const {signup,login} = require("./userControls.js");
const {getStudentDetails,getFacultyDetails,getEnrolledStudents,docs,getCoursesList,fetchAssignment} = require("./getDetails.js")
const {addCourse,addFaculty,addCourses,markAttendance,uploadAssignment}=require("./databaseUpdate.js")
const auth = require('./auth');
const cookieParser = require("cookie-parser");
// const jwt = require("jsonwebtoken");

dotenv.config();
const app = express();
app.use(cors());

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static(__dirname+"/public"));
app.use(cookieParser());

app.get("/api/",docs);

app.post("api/signup",signup)

app.post("api/login",login)

app.get("api/addCourse",addCourse) //admin

app.post("api/addFaculty",addFaculty) //admin

app.get("api/getStudentDetails",auth,getStudentDetails) //student

app.get("api/getFacultyDetails",auth,getFacultyDetails) //admin

app.get("api/getEnrolledStudents",auth,getEnrolledStudents) //faculty

app.get("api/addCourses",addCourses); //admin

app.get("api/getCoursesList",auth,getCoursesList) //admin

app.get("api/markAttendance",auth,markAttendance) //faculty

app.post("api/uploadAssignment",auth,uploadAssignment) //faculty

app.post("api/fetchAssignment",auth,fetchAssignment) //students & faculty

app.use('api/logout', (req, res) => {
    res.cookie("token", null, {
      httpOnly: true,
      Expires: Date.now-1000
    }).send({
      authenticated: false,
      message: "Logout Successful."
    });
  });

  app.use('api/authStatus', auth,(req, res) => {
    if(!req.user)
        res.send({isAuthenticated: false})
    else res.send({isAuthenticated: true})
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