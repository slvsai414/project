import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
  
  function Logout(){

    const navigate = useNavigate();
    const handleLogout = async() => {
      try{
  
        const response = await axios.post("https://cms-yikc.onrender.com/logout",{},{
        withCredentials:true});

        console.log("Logout response:", response);

        if (response.status === 200){
          navigate("/");
        }
      }catch(err){
        console.log("Logout error:",err)
      } 
  
    };
    return handleLogout;

  }

export default Logout;
  
