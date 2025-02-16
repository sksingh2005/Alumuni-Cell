const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    branch: { type: String, enum: ["CSE", "ECE", "EEE", "ME", "CE"], required: true },
    rollNo: { type: String, required: true },
    mobileNo: { type: String, required: true },
    alternativeNo: { type: String },
    email: { type: String, required: true },
    alternativeEmail: { type: String },
    placed: { type: Boolean, required: true },
    
    placementDetails: {
      companyName: { type: String },
      package: { type: String },
      city: { type: String },
    },
    
    futurePlans: {
      type: String,
      enum: ["Higher Studies", "Off Campus Prep", "Startup"],
    },
    
    higherStudiesDetails: {
      exam: { type: String, enum: ["Foreign Universities", "GATE"] },
      country: { type: String },
      course: { type: String },
      university: { type: String },
    },
    
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    assignedAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Request = mongoose.model("Request", requestSchema);
module.exports = Request;
