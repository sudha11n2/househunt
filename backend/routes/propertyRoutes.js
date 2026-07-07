const express = require("express");
const router = express.Router();
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
  toggleSaveProperty,
} = require("../controllers/propertyController");
const { protect, authorize } = require("../middleware/auth");

router.get("/", getProperties);
router.get("/mine/all", protect, authorize("agent", "admin"), getMyProperties);
router.get("/:id", getPropertyById);
router.post("/", protect, authorize("agent", "admin"), createProperty);
router.put("/:id", protect, authorize("agent", "admin"), updateProperty);
router.delete("/:id", protect, authorize("agent", "admin"), deleteProperty);
router.put("/:id/save", protect, toggleSaveProperty);

module.exports = router;
