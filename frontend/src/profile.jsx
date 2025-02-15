import { useEffect, useState } from "react";
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logout from "./logout";
import { toast } from "react-toastify";
import UpdateStudent from "./a-d-m-i-n";




export default function Settings() {

  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const handleLogout = Logout();
  const token = Cookies.get('token')


  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    rollNumber: "",
  });


  useEffect(() => {
    

      //checkAuth route from here
      const checkAuth = async() => {

        try{
          setLoading(true);
          const result = await axios.get("https://cms-yikc.onrender.com/profile",{
            withCredentials: true
          });

          if(result.data && result.data.username && result.data.email && result.data.rollNumber){
            setUserData({
              username:result.data.username,
              email:result.data.email,
              rollNumber:result.data.rollNumber
            });
          }

        }catch(err){
  
          if (err.response && err.response.data === "Invalid Token or Token Expired"){
              toast.error("Session Expired Please login again.")
              navigate("/login")
          }else{
            toast.error(err.message);
          }
        }finally{
          setLoading(false);
        };
      };
      checkAuth();

  }, [navigate]);


  if(loading){
    return(
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 flex items-center justify-center text-white">
      <div>Loading...</div>
    </div>
    );
  }




  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Settings</h2>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300">Username</label>
          <input
            type="text"
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-700 dark:text-white"
            value={userData.username}
            readOnly
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-700 dark:text-white"
            value={userData.email}
            readOnly
          />
        </div>

        {/* Roll Number */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300">Roll Number</label>
          <input
            type="text"
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-700 dark:text-white"
            value={userData.rollNumber}
            readOnly
          />
        </div>



        <div className="mb-4">
          {userData.email === "slvsai414@gmail.com" &&(
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg cursor-pointer"
            onClick={ () => navigate("/a-d-m-i-n") }
            > 
            Admin 
            </button>
            )}
        </div>


          <button
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </button>
        
        </div>
      
        <footer className="fixed bottom-0 w-full flex justify-center items-center text-white">
          Made With ❤ By Venkata Sai
        </footer>
      
      </div>

  );
}
