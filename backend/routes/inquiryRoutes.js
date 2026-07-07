const express = require("express");
const router = express.Router();
const {
  createInquiry,
  getReceivedInquiries,
  updateInquiryStatus,
} = require("../controllers/inquiryController");
const { protect } = require("../middleware/auth");

router.post("/", protect, createInquiry);
router.get("/received", protect, getReceivedInquiries);
router.put("/:id/status", protect, updateInquiryStatus);

module.exports = router;
