import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import {toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



function Dash(){
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async() => {
            
            try{
                setLoading(true)
                const result = await axios.get("https://cms-frontend-0rrx.onrender.com/dashboard");
                //console.log(result)
                if(result.data !== "Success"){
                    navigate("/login")
                }
            }catch(err){
                if (err.response && err.response.data === "Invalid Token or Token Expired") {
                    toast.error("Session expired, please log in again.");
                    navigate("/login");
                }else{
                toast.error(err.message)
                //console.log(err)
                }
            }finally{
                setLoading(false)
            }
        };

        // const intervalId = setInterval(() => {
        //     checkAuth();
        // }, 86400000)
        // return () => clearInterval(intervalId);
        checkAuth();

    }, [navigate]);

    if(loading){
        return(
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 flex items-center justify-center text-white">
            <div>Loading...</div>
        </div>
        )
    }

    return (
        <div>
          <p>This is a Dash panel</p>
          <div>This is another div</div>
        </div>
      );
}

export default Dash
