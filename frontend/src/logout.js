import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
  
  function Logout(){

    const navigate = useNavigate();
    const handleLogout = async() => {
      try{
  
        await axios.post("https://cms-yikc.onrender.com/logout",{},{withCredentials:true});
  
  
        navigate("/");
  
      }catch(err){
        console.log("Logout error:",err)
      } 
  
    };
    return handleLogout;

  }

export default Logout;
  
