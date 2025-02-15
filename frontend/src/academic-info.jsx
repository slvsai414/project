import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GetStudentData = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      const result = await axios.get("https://cms-yikc.onrender.com/academic-info",{ withCredentials: true });
      console.log(result);
      if (result.status !== 200) {
        // If logged in, redirect to login page
        navigate("/login");
       }
      //else {
      //   // If not logged in, navigate to academic page
      //   navigate("/academic-info");
      //}
    } catch (err) {
      if (err.response && err.response.data === "Invalid Token or Token Expired") {
        toast.error("Session expired, please log in again.");
        navigate("/login");
      } else {
        toast.error(err.message);
      }
    }
  };

  useEffect(() => {

    checkAuth();

  }, [navigate]);


  const fetchData = async () => {
    try {
      setError(null);
      setStudentData(null);
      setLoading(true);

      if (!rollNumber) {
        toast.error("Please enter a roll number");
        return;
      }

      const response = await axios.get(`https://cms-yikc.onrender.com/student/${rollNumber}`);
      if (response.status !== 200) {
        throw new Error('Student not found or server error');
      }
      setStudentData(response.data);
    } catch (err) {
      if (err.message === "Request failed with status code 400") {
        setError("User not found");
      }
      setStudentData(null);
    } finally {
      setLoading(false);
    }
  };

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
          onKeyDown={fetchData}
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
