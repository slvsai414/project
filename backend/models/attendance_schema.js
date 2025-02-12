import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        required: true
    },
    rollNumber: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Present", "Absent"],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Export the model directly
const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
