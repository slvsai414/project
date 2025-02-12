// import dotenv from "dotenv";
// import jwt, { decode } from "jsonwebtoken";
// import { toast } from "react-toastify";
// import cookieParser from "cookie-parser";

// dotenv.config();


// //verify Token
// const verifyToken = (req,res,next) =>{
//     const token = req.cookies.token;
//     if(!token){
//         return res.json("The token is not available")
//     }else{
//         jwt.verify(token, "we-go-jim",(err,decode) => {
//             if (err) return res.json("Token is wrong")
//                 next();
            
//         })
//     };
// }

// export default verifyToken;