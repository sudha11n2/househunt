const Property = require("../models/Property");

// @route GET /api/properties
// Supports query params: city, listingType, propertyType, minPrice, maxPrice, bedrooms, q, page, limit
exports.getProperties = async (req, res) => {
  try {
    const {
      city,
      listingType,
      propertyType,
      minPrice,
      maxPrice,
      bedrooms,
      q,
      page = 1,
      limit = 12,
      sort = "-createdAt",
    } = req.query;

    const filter = {};
    if (city) filter["address.city"] = new RegExp(city, "i");
    if (listingType) filter.listingType = listingType;
    if (propertyType) filter.propertyType = propertyType;
    if (bedrooms) filter.bedrooms = { $gte: Number(bedrooms) };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (q) {
      filter.$text = { $search: q };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [properties, total] = await Promise.all([
      Property.find(filter)
        .populate("owner", "name email phone role")
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Property.countDocuments(filter),
    ]);

    res.json({
      properties,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch properties", error: err.message });
  }
};

// @route GET /api/properties/:id
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("owner", "name email phone role");

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json({ property });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch property", error: err.message });
  }
};

// @route POST /api/properties
exports.createProperty = async (req, res) => {
  try {
    const property = await Property.create({ ...req.body, owner: req.user._id });
    res.status(201).json({ property });
  } catch (err) {
    res.status(400).json({ message: "Failed to create listing", error: err.message });
  }
};

// @route PUT /api/properties/:id
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only edit your own listings" });
    }

    Object.assign(property, req.body);
    await property.save();
    res.json({ property });
  } catch (err) {
    res.status(400).json({ message: "Failed to update listing", error: err.message });
  }
};

// @route DELETE /api/properties/:id
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only delete your own listings" });
    }

    await property.deleteOne();
    res.json({ message: "Listing removed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete listing", error: err.message });
  }
};

// @route GET /api/properties/mine/all
exports.getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort("-createdAt");
    res.json({ properties });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your listings", error: err.message });
  }
};

// @route PUT /api/properties/:id/save
exports.toggleSaveProperty = async (req, res) => {
  try {
    const user = req.user;
    const idx = user.savedProperties.findIndex((p) => p.toString() === req.params.id);
    if (idx > -1) {
      user.savedProperties.splice(idx, 1);
    } else {
      user.savedProperties.push(req.params.id);
    }
    await user.save();
    res.json({ savedProperties: user.savedProperties });
  } catch (err) {
    res.status(500).json({ message: "Failed to update saved listings", error: err.message });
  }
};
