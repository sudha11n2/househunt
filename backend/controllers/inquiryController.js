const Inquiry = require("../models/Inquiry");
const Property = require("../models/Property");

// @route POST /api/inquiries
exports.createInquiry = async (req, res) => {
  try {
    const { propertyId, message, contactPhone } = req.body;
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: "Property not found" });

    const inquiry = await Inquiry.create({
      property: propertyId,
      sender: req.user._id,
      recipient: property.owner,
      message,
      contactPhone,
    });

    res.status(201).json({ inquiry });
  } catch (err) {
    res.status(400).json({ message: "Failed to send inquiry", error: err.message });
  }
};

// @route GET /api/inquiries/received
exports.getReceivedInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ recipient: req.user._id })
      .populate("property", "title address images")
      .populate("sender", "name email phone")
      .sort("-createdAt");
    res.json({ inquiries });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch inquiries", error: err.message });
  }
};

// @route PUT /api/inquiries/:id/status
exports.updateInquiryStatus = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });
    if (inquiry.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this inquiry" });
    }
    inquiry.status = req.body.status || inquiry.status;
    await inquiry.save();
    res.json({ inquiry });
  } catch (err) {
    res.status(400).json({ message: "Failed to update inquiry", error: err.message });
  }
};
