const studentModel = require("./models/student");
const courseModel = require("./models/course");
const facultyModel = require('./models/faculty')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const signup = async (req,res)=>{
    const role = req.body.role;
    var newUser
    if(role=='student'){
        const {name,password,email,roll,phone} = req.body;
        try{
            const hashedPassword = await bcrypt.hash(password,10);
            let user = await studentModel.findOne({email: email});
            if(user){
                return res.status(400).json({msg: "User already exists"});
            }
            user = await studentModel.findOne({roll: roll});
            if(user){
                return res.status(400).json({msg: "User already exists"});
            }
            newUser = await studentModel.create({
                name: name,
                password: hashedPassword,
                email: email,
                roll: roll,
                phone: phone
            });
            console.log(newUser)
        }catch(error){
            console.log(error);
            res.status(500).json({msg:"something went wrong..."});
        }
    }else if(role=='faculty'){
        const {name,password,email,facultyId,phone} = req.body;
        try{
            const hashedPassword = await bcrypt.hash(password,10);
            let user = await facultyModel.findOne({email:email})
            if(user)
                return res.status(400).json({msg:"user already exists"})
            user = await facultyModel.findOne({facultyId:facultyId})
            if(user)
                return res.status(400).json({msg:"user already exists"})
            newUser = await facultyModel.create({
                name: name,
                password: hashedPassword,
                email: email,
                facultyId: facultyId,
                phone: phone
            });
        }catch(error){
            console.log(error);
            res.status(500).json({msg:"something went wrong..."});
        }
    }

    let token;
    if(role=='student')
        token = jwt.sign({roll:newUser.roll,name:newUser.name,id:newUser._id,role:role},process.env.SECRET_KEY,{expiresIn:process.env.TOKEN_EXPIRY_DURATION});
    else if(role=='faculty')
        token = jwt.sign({facultyId:newUser.facultyId,name:newUser.name,id:newUser._id,role:role},process.env.SECRET_KEY,{expiresIn:process.env.TOKEN_EXPIRY_DURATION});
        // res.cookie("token",token,{httpOnly:true});
    res.status(200).cookie("token", token, {
        httpOnly: true,
        maxAge: process.env.TOKEN_EXPIRY_DURATION*1000
    }).json({
        authenticated: true,
        message: "Authentication Successful."
    });
}

const login = async (req,res)=>{
    const role=req.body.role;
    if(role=='student'){
        const {roll,password} = req.body
        const user = await studentModel.findOne({roll: roll});
        if(!user){
            return res.status(404).json({msg: "User doesn't exist"});
        }
        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({msg: "Invalid credentials"});
        }
        const token = jwt.sign({roll:user.roll,name:user.name,id:user._id,role:role},process.env.SECRET_KEY,{expiresIn:process.env.TOKEN_EXPIRY_DURATION});
        res.status(200).cookie("token", token, {
            httpOnly: true,
            maxAge: process.env.TOKEN_EXPIRY_DURATION*1000
          }).json({
            authenticated: true,
            message: "Authentication Successful"
        });
    }else if(role=="faculty"){
        const {facultyId,password}=req.body
        user = await facultyModel.findOne({facultyId: facultyId})
        if(!user){
            return res.status(404).json({msg: "User doesn't exist"});
        }
        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({msg: "Invalid credentials"});
        }
        const token = jwt.sign({facultyId:user.facultyId,name:user.name,id:user._id,role:role},process.env.SECRET_KEY,{expiresIn:process.env.TOKEN_EXPIRY_DURATION});
        res.status(200).cookie("token", token, {
            httpOnly: true,
            maxAge: process.env.TOKEN_EXPIRY_DURATION*1000
          }).json({
            authenticated: true,
            message: "Authentication Successful"
        });
    }else if(role=="admin"){
        //admin model here
        res.status(200).json({msg:"Functionality Under Development"})
    }else {
        return res.status(403).json({"msg":"Hackor..."})
    }    
}

module.exports = {login,signup};