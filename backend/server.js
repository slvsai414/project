import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import cors from "cors";
import { college_registration } from "./models/users.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import Attendance from "./models/attendance_schema.js";
import ExamResults from "./models/examResults.js";


import { fileURLToPath } from 'url';
import { dirname } from 'path';




const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);




const app = express();
app.use(express.json());
dotenv.config();
app.use(cookieParser())

app.use(cors({
  origin: "https://cms-frontend-0rrx.onrender.com",

  methods: ["GET", "POST", "PUT", "DELETE"],

  credentials: true,

  optionsSuccessStatus: 200,

  allowedHeaders: ["Content-Type"]
}));






const verifyToken = (req,res,next) =>{
    const token = req.cookies.token;
    console.log("token: ",token)
    if(!token){
        return res.json("The token is not available")
    }
    try{
      const isVerify = jwt.verify(token,"we-go-jim");
      req.user = isVerify;
      next();

    }catch(error){
      return res.status(403).json("Invalid Token or Token Expired");
    }

    };



mongoose.connect(process.env.MONGO_URL)
.then(()=>{
  console.log("MongoDB is Connected.")
})
.catch(()=>{
  console.log("MongoDB Connection Failure.")
});




app.get("/",(req,res) =>{
    res.send("Server is up. ");
});


//Register Rotue
app.post('/registration', async(req,res) =>{
  try{
    //console.log(req.body)
  const {name, email, rollNumber, password, confirmPassword} = req.body

  if(!email || !name || !rollNumber || !password || !confirmPassword){
    return res.status(400).json("All fields are required!")
  }
  if(!email.includes("@")){
    return res.status(400).json("Enter the valid email")
  }
  if (password.length<5){
    return res.status(400).json("Password must be 6 letters")
  }

  const Existinguser = await college_registration.findOne({email});
  if (Existinguser){
    return res.status(400).json({ message: "Email already registered" });
  }

  const existingRollnumber = await college_registration.findOne({rollNumber});
  if (existingRollnumber){
    return res.status(400).json({message:"Roll number is alredy registered"});
  }

  const HashedPassword = await bcrypt.hash(password,10);

  const Newuser = new college_registration({
    name,
    email,
    rollNumber,
    password: HashedPassword,
  });
  await Newuser.save();
  res.status(201).json({ message: "Registered Successfully" });

  }catch(error){
    console.log(error);
  }
});

//Login Route
app.post('/login', async(req,res) =>{
  const {email,password} = req.body
  const checkUser = await college_registration.findOne({email:email})
  
    if(checkUser){
      const isMatch = await bcrypt.compare(password,checkUser.password);

      if (isMatch){
        const token = jwt.sign({email:checkUser.email},"we-go-jim",{expiresIn:"1h"});
        res.cookie("token",token,{httpOnly:true, secure:true, sameSite:"Strict", expires: new Date(Date.now() + 1 * 60 * 60 * 1000)})
        res.status(200).json({ status: "Success", message: `Welcome, ${checkUser.name}!` });
      }else{
        res.json("Wrong Password")
      }

    }else{
      res.json("Email is not registered")
    }
  
});


//protected routes


//to get the dashboard


app.get('/dashboard',verifyToken,async(req,res) =>{
  console.log("Dashboard route hit")
  return res.json("Success");

})


//to get the acadamic deta

app.get('/academic-info', verifyToken, async(req, res) =>{
  return res.json("Success")
});



// Attendance

app.get('/attendance',verifyToken, async(req,res) =>{
  try{

    const user = await college_registration.findOne({email:req.user.email}).select("name rollNumber");

    if(!user){
      return res.status(404).json("no user found")

    }else{

      res.json({
        _id:user._id,
        name:user.name,
        rollNumber :user.rollNumber
      })

    }

  }catch(error){
    console.log(error)
    res.status(500).json(error.message)
  }
});

app.post("/mark-attendance",verifyToken,async(req,res)=>{
  const {userId, rollNumber, status} = req.body
  // console.log({userId, rollNumber, status})

  if (!userId|| !rollNumber|| !status){
    return res.status(400).json({message:"invalid data"});
  }

  const today = new Date();
  const startOfDay = new Date(today.setHours(9,0,0,0));
  const endOfDay = new Date(today.setHours(24,0,0,0));


  try {
    const existingAttendance = await Attendance.findOne({
        userId: userId,
        date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (existingAttendance) {
        return res.status(400).json({ message: "Attendance already marked for today." });
    }

    const newAttendance = new Attendance({
        userId,
        rollNumber,
        status,
        date: new Date()  // Record the exact date and time of the attendance
    });

    await newAttendance.save();
    res.json({ message: "Attendance marked successfully!" });

} catch (err) {
    console.error("Error saving attendance:", err);
    res.status(500).json({ message: "Error saving attendance", error: err.message });
}
});



//academic-info

app.get("/student/:rollNumber",async(req,res)=>{

  try{

    const { rollNumber } = req.params
    const student = await college_registration.findOne({ rollNumber });
    if (!student){
      return res.status(400).json({message:"Student Not Found"});
    }

    res.status(200).json(student);
    
  }catch(error){

    console.log(error)
    res.status(500).json("Server Error")

  }
});



// to get fee route

app.get('/fee',verifyToken, async(req,res) =>{
  try{
  const user = await college_registration.findOne({email:req.user.email}).select("name fee");

  //console.log("Fetched user data from DB: ", user);
  
    if (!user){
      res.status(404).json({message:"user not found"})
    }else{
      res.json({
        username:user.name,
        Fee:user.fee
      })
    }

  }catch(err){
    console.log(err)
    res.status(500).json({message:err.message})
  }


});

//admin fee

app.put("/update-student/:rollNumber", async (req, res) => {
  const { rollNumber } = req.params;
  const { totalFee, remainingFee, paidFee } = req.body;

  //console.log(totalFee, remainingFee, paidFee)

  try {
      const student = await college_registration.findOneAndUpdate(
          { rollNumber },
          { 
              $set: { 
                  "fee.totalFee": totalFee, 
                  "fee.remainingFee": remainingFee ,
                  "fee.paidFee": paidFee
              }
          },
          { new: true, upsert: false }
      );
      //console.log(student)

      if (!student) {
          return res.status(404).json({ message: "Student not found" });
      }

      res.json({ message: "Fee updated successfully", student });
  } catch (error) {
      res.status(500).json({ message: "Error updating fee", error });
  }
});




//profile route
app.get("/profile",verifyToken, async (req, res) => {

  try{
    const user = await college_registration.findOne({email:req.user.email}).select("name email rollNumber");

    if (!user){
      return res.status(400).json("User not found")

    }else{
      res.json({
        username:user.name,
        email:user.email,
        rollNumber:user.rollNumber
      })
    }

  }catch(error){
    console.log(error)
    res.status(500).json("Internal server error");
  }

});






app.post("/logout", (req, res) => {
  res.clearCookie("token", { path: "/",httpOnly: true, secure:true});
  return res.status(200).json({ message: "Logged out successfully" });
});



app.listen(3000, () =>{
    console.log("Server is running on port 3000.");
});
