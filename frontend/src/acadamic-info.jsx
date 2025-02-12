import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GetStudentData = () => {
    const [rollNumber, setRollNumber] = useState('');
    const [studentData, setStudentData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false)
  
    const handleFetchData = async () => {
      try {
        setLoading(true)
        setError(null);
        setStudentData(null);
        const response = await axios.get(`https://cms-yikc.onrender.com/${rollNumber}`);
  
        if (response.status !== 200) {
          throw new Error('Student not found or server error');
        }

        console.log(response.data)
        setStudentData(response.data);

      } catch (err) {
        if (err.message === "Request failed with status code 400"){

            setError("User not found");
        }
        setStudentData(null);

      }finally{
        setLoading(false);
      }
    };

    if (loading){
        return(
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 flex items-center justify-center text-white"  >
            <div>Loading...</div>
        </div>
        )
    }
  
    return (
        <div className="w-full max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Search Student Data</h2>

            <div className="flex space-x-2">
                <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="Enter the Roll Number"
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleFetchData}
                    disabled={loading}
                    className={`px-4 py-2 text-white rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
                >
                    {loading ? "Searching..." : "Search"}
                </button>
            </div>

            {error && <p className="text-red-500 mt-3">{error}</p>}

            {studentData && (
                <div className="mt-6 p-4 bg-gray-100 rounded-md">
                    <h3 className="text-lg font-semibold">Student Data:</h3>
                    <p><strong>Name:</strong> {studentData.name}</p>
                    <p><strong>Roll Number:</strong> {studentData.rollNumber}</p>
                </div>
            )}
        </div>
    );
};
  
  export default GetStudentData;
