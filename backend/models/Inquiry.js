const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    contactPhone: { type: String },
    status: { type: String, enum: ["new", "responded", "closed"], default: "new" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inquiry", inquirySchema);
