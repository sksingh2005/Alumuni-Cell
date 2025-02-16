const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    branch: { type: String, required: true }, // Branch they belong to
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
