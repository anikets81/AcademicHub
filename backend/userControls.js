const studentModel = require("./models/student");
const courseModel = require("./models/course");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const signup = async (req,res)=>{
    const {name,password,email,roll,phone} = req.body;

    try{
        const user = await studentModel.findOne({email: email});
        if(user){
            return res.status(400).json({msg: "User already exists"});
        }
        const user2 = await studentModel.findOne({roll: roll});
        if(user2){
            return res.status(400).json({msg: "User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = await studentModel.create({
            name: name,
            password: hashedPassword,
            email: email,
            roll: roll,
            phone: phone
        });

        const token = jwt.sign({roll:newUser.roll,name:newUser.name,id:newUser._id},process.env.SECRET_KEY,{expiresIn:process.env.TOKEN_EXPIRY_DURATION});
        // res.cookie("token",token,{httpOnly:true});
        res.status(200).json({token:token});
        // res.status(200).redirect("/");
    }catch(error){
        console.log(error);
        res.status(500).json({msg:"something went wrong..."});
    }
}

const login = async (req,res)=>{
    const {roll,password} = req.body;
    const user = await studentModel.findOne({roll: roll});
    if(!user){
        return res.status(404).json({msg: "User doesn't exist"});
    }
    const isPasswordCorrect = await bcrypt.compare(password,user.password);
    if(!isPasswordCorrect){
        return res.status(400).json({msg: "Invalid credentials"});
    }
    console.log("name: ",user.name,"roll: ",user.roll);
    const token = jwt.sign({roll:user.roll,name:user.name,id:user._id},process.env.SECRET_KEY,{expiresIn:process.env.TOKEN_EXPIRY_DURATION});
    console.log("token at login: ",token);
    // const verifyToken = jwt.verify(token,process.env.SECRET_KEY);
    // console.log(verifyToken);
    // res.cookie("token",token,{httpOnly:true});
    // res.status(200).json({token:token});
    res.status(200).json({token:token});
}

module.exports = {login,signup};