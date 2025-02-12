import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
  
  function Logout(){

    const navigate = useNavigate();
    const handleLogout = async() => {
      try{
  
        await axios.post("http://localhost:3000/logout",{},{withCredentials:true});
  
  
        navigate("/");
  
      }catch(err){
        console.log("Logout error:",err)
      } 
  
    };
    return handleLogout;

  }

export default Logout;
  
