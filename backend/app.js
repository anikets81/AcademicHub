const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const {signup,login} = require("./userControls.js");
const {getStudentDetails,getFacultyDetails} = require("./getDetails.js")
const {addCourse,addFaculty}=require("./databaseUpdate.js")
const auth = require('./auth');
const cookieParser = require("cookie-parser");
// const jwt = require("jsonwebtoken");

dotenv.config();
const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static(__dirname+"/public"));
app.use(cookieParser());

app.post("/signup",signup)

app.post("/login",login)

app.post("/addCourse",addCourse)

app.post("/addFaculty",addFaculty)

app.get("/getStudentDetails",auth,getStudentDetails)

app.get("/getFacultyDetails",auth,getFacultyDetails)

app.get("/getEnrolledStudents",auth,)

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