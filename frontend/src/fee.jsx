import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

function Financial() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setuserData] = useState(null);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const result = await axios.get("https://cms-yikc.onrender.com/fee", {
          withCredentials: true
        });
        // console.log(result.data);

        if (result.data) {
          setuserData({
            username: result.data.username,
            Fee: result.data.Fee,
            // rollNumber: result.data.rollNumber,
            // fee: result.data.fee
          });
        } else {
          navigate("/login");
        }
      } catch (err) {
        if (err.response && err.response.data === "Invalid Token or Token is Expired") {
          toast.error("Session expired, please log in again.");
          Cookies.remove("token");
          navigate("/login");
        } else {
          toast.error(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 flex items-center justify-center text-white">
        <div>Loading user Data...</div>
      </div>
    );
  }

  return (
    <div className="min-screen flex justify-center items center mt-16">
    <div className="p-4 border rounded shadow-lg w-96">
      <h2 className="text-xl font-bold mb-2">Fee Payment</h2>
      {userData ? (
        <>
          <p><strong>Student:</strong> {userData.username}</p>
          <p><strong>Total Fees:</strong> ₹{userData.Fee.totalFee}</p>
          <p><strong>Paid Fees:</strong> ₹{userData.Fee.paidFee}</p>
          <p><strong>Remaining Balance:</strong> ₹{userData.Fee.remainingFee}</p>
        </>
      ) : (
        <p>No fee details available</p>
      )}
    </div>
    </div>
  );
}

export default Financial;
