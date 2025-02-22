const express = require("express");
const Request = require("../models/Request");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Submit a Request
router.post("/submit", authMiddleware, async (req, res) => {
  try {
    const { name, branch, rollNo, mobileNo, alternativeNo, email, alternativeEmail, placed, placementDetails, futurePlans, higherStudiesDetails } = req.body;
    const userId = req.user.id;
    console.log(userId)
    const findUser = await Request.findOne({ userId, status: "pending"});
    if (findUser) return res.status(404).json({ message: "You have already filled the form" });
    // Find the admin of the branch
    const admin = await User.findOne({ branch, role: "admin" });

    if (!admin) return res.status(404).json({ message: "Admin not found for this branch" });

    const newRequest = new Request({
      userId,
      name,
      branch,
      rollNo,
      mobileNo,
      alternativeNo,
      email,
      alternativeEmail,
      placed,
      placementDetails,
      futurePlans,
      higherStudiesDetails,
      assignedAdmin: admin._id,
    });

    await newRequest.save();
    res.status(201).json({ message: "Request submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error submitting request"+err });
  }
});

// Admin View - Get Requests for their Branch
router.get("/admin-requests", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    const requests = await Request.find({ assignedAdmin: req.user.id }).populate("userId", "name email");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Error fetching requests" });
  }
});

// Update Request Status
router.put("/:requestId/status", authMiddleware, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    // Verify user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Validate status
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Find and update the request
    const request = await Request.findOne({ 
      _id: requestId,
      assignedAdmin: req.user.id
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Only allow updates if current status is pending
    if (request.status !== "pending") {
      return res.status(400).json({ message: "Can only update pending requests" });
    }

    request.status = status;
    request.updatedAt = Date.now();
    await request.save();

    res.json({ message: "Request status updated successfully", request });
  } catch (err) {
    console.error("Error updating request status:", err);
    res.status(500).json({ message: "Error updating request status" });
  }
});
// Get Detailed Request Information
router.get("/:requestId", authMiddleware, async (req, res) => {
  try {
    const { requestId } = req.params;

    // Verify user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Find the request and populate user details
    const request = await Request.findOne({
      _id: requestId,
      assignedAdmin: req.user.id
    }).populate("userId", "name email");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Return detailed request information
    res.json({
      requestDetails: {
        _id: request._id,
        status: request.status,
        submittedBy: request.userId,
        personalInfo: {
          name: request.name,
          branch: request.branch,
          rollNo: request.rollNo,
          contact: {
            mobileNo: request.mobileNo,
            alternativeNo: request.alternativeNo,
            email: request.email,
            alternativeEmail: request.alternativeEmail
          }
        },
        placement: {
          placed: request.placed,
          details: request.placementDetails
        },
        future: {
          plans: request.futurePlans,
          higherStudiesDetails: request.higherStudiesDetails
        },
        timestamps: {
          createdAt: request.createdAt,
          updatedAt: request.updatedAt
        }
      }
    });
  } catch (err) {
    console.error("Error fetching request details:", err);
    res.status(500).json({ message: "Error fetching request details" });
  }
});

module.exports = router;
