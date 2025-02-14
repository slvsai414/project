import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const UpdateStudent = () => {
    const [rollNumber, setRollNumber] = useState("");
    const [paidFee, setpaidFee] = useState("");
    const [totalFee, setTotalFees] = useState("");
    const [remainingFee, setRemainingBalance] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

            const adminData = await axios.get("https://cms-yikc.onrender.com/profile",{withCredentials:true})
            //console.log(adminData)


            
            if (adminData.data.email === 'slvsai414@gmail.com'){
                try{
                await axios.put(`https://cms-yikc.onrender.com/update-student/${rollNumber}`, {
                    totalFee:totalFee, 
                    remainingFee: remainingFee,
                    paidFee: paidFee
               });
                    toast.success("Student details updated successfully");
                } catch (error) {
                    if (error.message === 'Request failed with status code 404'){
                        toast.error("Please Check Roll Number")
                    }else{
                    toast.error(error.message);
                    }
                } finally {
                    setLoading(false);
                }

            }else{
                toast.warn("You are Not Admin!")
            }


    };


    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-md shadow-lg">
            <h2 className="text-2xl font-semibold text-center mb-6">Update Student Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Roll Number" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} className="w-full p-2 border rounded" required />
                <input type="text" placeholder="Paid Fee" value={paidFee} onChange={(e) => setpaidFee(e.target.value)} className="w-full p-2 border rounded" />
                <input type="number" placeholder="Total Fees" value={totalFee} onChange={(e) => setTotalFees(e.target.value)} className="w-full p-2 border rounded" />
                <input type="number" placeholder="Remaining Balance" value={remainingFee} onChange={(e) => setRemainingBalance(e.target.value)} className="w-full p-2 border rounded" />
                <button type="submit" disabled={loading} className={`w-full py-2 text-white font-semibold rounded-md ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}>{loading ? "Updating..." : "Update"}</button>
            </form>
        </div>
    );
};

export default UpdateStudent;
