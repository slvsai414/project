import mongoose from "mongoose";

const examResultsSchema = new mongoose.Schema({
  // rollNumber: {
  //   type: String,
  //   required: true,
  // },
  // subject: {
  //   type: String,
  //   required: true,
  // },
  fileUrl: {
    type: String, // URL or path to the stored PDF
    required: true,
  },
});

const ExamResults = mongoose.model("ExamResults", examResultsSchema);

export default ExamResults;