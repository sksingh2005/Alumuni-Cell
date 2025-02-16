const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Signup Route
// Signup Route
router.post("/signup", async (req, res) => {
    try {
      const { name, email, password, branch, role } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "User already exists" });
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        branch,
        role: role || "user",
      });
  
      await newUser.save();
  
      // Generate JWT token for immediate authentication
      const token = jwt.sign({ id: newUser._id, role: newUser.role }, "secret", { expiresIn: "1d" });
  
      res.status(201).json({
        message: "User registered successfully",
        token,  // Send the token to the frontend
        user: { id: newUser._id, name: newUser.name, role: newUser.role, branch: newUser.branch }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error creating user" });
    }
  });
  

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, role: user.role }, "secret", { expiresIn: "1d" });

    res.json({ token, user: { id: user._id, name: user.name, role: user.role, branch: user.branch } });
  } catch (err) {
    res.status(500).json({ message: "Error logging in" });
  }
});

// Logout Route
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});
router.get("/me", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, "secret");
  
      const user = await User.findById(decoded.id).select("role name email branch");
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.json({ user });
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Invalid token" });
    }
  });
// Forgot Password (Simplified)
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });

  // In real-world, generate and email a reset link
  res.json({ message: "Password reset link sent (simulate here)" });
});

module.exports = router;
