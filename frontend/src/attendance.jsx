import React, { useState, useEffect } from "react";
import axios from "axios";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserAttendance = () => {
    const [user, setUser] = useState(null);
    const [attendance, setAttendance] = useState("Absent"); // Default is Absent
    const [loading, setLoading] = useState(true);

    // Fetch Logged-in User
    useEffect(() => {
        setLoading(true)
        axios.get("https://cms-yikc.onrender.com/attendance", { withCredentials: true })
            .then(response => {
                setUser(response.data);
                setAttendance("Absent"); // Set attendance to "Absent" by default
            })
            .catch(error => console.error("Error fetching user:", error))
            .finally(()=>setLoading(false))
    },[]);

    // Handle dropdown change
    const handleChange = (event) => {
        setAttendance(event.target.value);
    };

    // Submit Attendance
    const handleSubmit = async () => {
        if (!user) return alert("User not found!");

        console.log({
            user:user._id,
            name:user.name
        })

        try {
            await axios.post("http://localhost:3000/mark-attendance", {
                userId: user._id,
                rollNumber: user.rollNumber,
                status: attendance
            });

            toast.success("Attendance marked successfully!");
        } catch (error) {
            if(error.response && error.response.data.message === "Attendance already marked for today."){
                toast.error("Attendance already marked for today.")
            }else{
                console.error("Error marking attendance:", error);

            }
        }finally{
            setLoading(false)
        }
    };

    if(loading){
        return(
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 flex items-center justify-center text-white">
          <div>Loading...</div>
        </div>
        );
      }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Mark Attendance</h2>

            {user ? (
                <div className="border p-4 rounded-lg shadow-lg">
                    <p className="text-lg"><strong>Name:</strong> {user.name}</p>
                    <p className="text-lg"><strong>Roll Number:</strong> {user.rollNumber}</p>
                    
                    <label className="block mt-4 text-lg font-medium">
                        Select Attendance:
                        <select 
                            value={attendance} 
                            onChange={handleChange} 
                            className="border p-2 ml-2 cursor-pointer"
                        >
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                        </select>
                    </label>

                    <button 
                        onClick={handleSubmit} 
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
                    >
                        Submit Attendance
                    </button>
                </div>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
};

export default UserAttendance;
