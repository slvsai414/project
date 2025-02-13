import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import multer from "multer";

import { college_registration } from "./models/users.js";
import Attendance from "./models/attendance_schema.js";
import ExamResults from "./models/examResults.js";

dotenv.config();

const app = express();
const PORT = 3000;  // Use environment port or fallback to 3000

app.use(express.json());
app.use(cookieParser());

// CORS Configuration
app.use(cors({
  origin: "https://cms-frontend-0rrx.onrender.com",
  methods:["PUT","POST","GET","DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));
console.log(process.env.NODE_ENV);  // This should output "production" or "development"


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Middleware for Token Verification
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  console.log("token",token)
  if (!token) {
    return res.status(401).json("Unauthorized: No Token Provided");
  }
  try {
    const isVerify = jwt.verify(token, process.env.JWT_SECRET);
    console.log("verify: ",isVerify)
    req.user = isVerify;
    next();
  } catch (error) {
    return res.status(403).json("Invalid Token or Expired");
  }
};

// Home Route
app.get("/", (req, res) => {
  res.send("Server is up and running.");
});

// Registration Route
app.post("/registration", async (req, res) => {
  try {
    const { name, email, rollNumber, password, confirmPassword } = req.body;
    if (!email || !name || !rollNumber || !password || !confirmPassword) {
      return res.status(400).json("All fields are required!");
    }
    if (!email.includes("@")) {
      return res.status(400).json("Enter a valid email");
    }
    if (password.length < 6) {
      return res.status(400).json("Password must be at least 6 characters");
    }

    const existingUser = await college_registration.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const existingRollNumber = await college_registration.findOne({ rollNumber });
    if (existingRollNumber) {
      return res.status(400).json({ message: "Roll number already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new college_registration({
      name,
      email,
      rollNumber,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Registered Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const checkUser = await college_registration.findOne({ email });
  console.log(checkUser)

  if (!checkUser) {
    return res.status(400).json("Email is not registered");
  }

  const isMatch = await bcrypt.compare(password, checkUser.password);
  if (!isMatch) {
    return res.status(400).json("Wrong Password");
  }

  const token = jwt.sign({ email: checkUser.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
  console.log(token)

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.json({ status: "Success", message: `Welcome, ${checkUser.name}!` });
});





//protected routes


//to get the dashboard


app.get('/dashboard',verifyToken,async(req,res) =>{
  console.log("Dashboard route hit");
  return res.json("Success");

});


//to get the acadamic deta

app.get('/acadamic-info', verifyToken, async(req, res) =>{
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




//For the Admin

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save the file in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Use timestamp for unique filename
  },
});

const upload = multer({ storage: storage });

// Upload results route
app.post("/upload-results", upload.single("file"), async (req, res) => {
  const { rollNumber, subject } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "File is required." });
  }

  try {
    const newResult = new ExamResults({
      fileUrl: file.path, // Store file path or URL
    });

    await newResult.save();
    res.status(200).json({ message: "Exam results uploaded successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading results." });
  }
});



app.post("/logout", (req, res) => {
  res.clearCookie("token", { path: "/", httpOnly: true, sameSite: "strict" });
  return res.status(200).json({ message: "Logged out successfully" });
});



app.listen(3000, () =>{
    console.log("Server is running on port 3000.");
});
