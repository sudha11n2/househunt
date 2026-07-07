const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    listingType: { type: String, enum: ["rent", "sale"], default: "rent" },
    propertyType: {
      type: String,
      enum: ["apartment", "house", "villa", "studio", "condo", "plot"],
      default: "apartment",
    },
    price: { type: Number, required: true },
    priceUnit: { type: String, enum: ["month", "year", "total"], default: "month" },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String },
      country: { type: String, default: "India" },
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    bedrooms: { type: Number, default: 1 },
    bathrooms: { type: Number, default: 1 },
    areaSqft: { type: Number },
    amenities: [{ type: String }],
    images: [{ type: String }],
    furnishing: { type: String, enum: ["unfurnished", "semi", "furnished"], default: "unfurnished" },
    availableFrom: { type: Date, default: Date.now },
    status: { type: String, enum: ["available", "rented", "sold", "pending"], default: "available" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

propertySchema.index({ title: "text", "address.city": "text", "address.state": "text" });

module.exports = mongoose.model("Property", propertySchema);
