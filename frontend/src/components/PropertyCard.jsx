import { Link } from "react-router-dom";
import "./PropertyCard.css";

const formatPrice = (price, unit) => {
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
  const suffix = unit === "month" ? "/mo" : unit === "year" ? "/yr" : "";
  return `${formatted}${suffix}`;
};

const PropertyCard = ({ property }) => {
  const cover = property.images?.[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=60";

  return (
    <Link to={`/listings/${property._id}`} className="p-card blueprint-frame">
      <div className="p-card-image" style={{ backgroundImage: `url(${cover})` }}>
        <span className="p-card-tag mono">
          {property.listingType === "rent" ? "For Rent" : "For Sale"}
        </span>
      </div>
      <div className="p-card-body">
        <div className="p-card-price mono">{formatPrice(property.price, property.priceUnit)}</div>
        <h3 className="p-card-title">{property.title}</h3>
        <p className="p-card-address">
          {property.address?.street}, {property.address?.city}
        </p>
        <hr className="hairline" />
        <div className="p-card-specs mono">
          <span>{property.bedrooms} BD</span>
          <span>{property.bathrooms} BA</span>
          {property.areaSqft && <span>{property.areaSqft} SQFT</span>}
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
