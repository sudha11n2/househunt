import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import "./PropertyDetail.css";

const formatPrice = (price, unit) => {
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
  const suffix = unit === "month" ? "/mo" : unit === "year" ? "/yr" : "";
  return `${formatted}${suffix}`;
};

const PropertyDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/properties/${id}`);
        setProperty(data.property);
      } catch (err) {
        setError("This listing could not be found.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const submitInquiry = async (e) => {
    e.preventDefault();
    setSending(true);
    setSendError("");
    try {
      await api.post("/inquiries", { propertyId: id, message, contactPhone: phone });
      setSent(true);
      setMessage("");
      setPhone("");
    } catch (err) {
      setSendError(err.response?.data?.message || "Could not send your message. Try again.");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="container" style={{ padding: "60px 24px" }}><div className="error-banner">{error}</div></div>;
  if (!property) return null;

  const images = property.images?.length ? property.images : ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=70"];

  return (
    <div className="container property-detail">
      <div className="gallery">
        <div className="gallery-main blueprint-frame" style={{ backgroundImage: `url(${images[activeImage]})` }} />
        {images.length > 1 && (
          <div className="gallery-thumbs">
            {images.map((img, i) => (
              <button
                key={i}
                className={`thumb ${i === activeImage ? "active" : ""}`}
                style={{ backgroundImage: `url(${img})` }}
                onClick={() => setActiveImage(i)}
                aria-label={`View image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="detail-layout">
        <div className="detail-main">
          <div className="eyebrow">{property.listingType === "rent" ? "For rent" : "For sale"} · {property.propertyType}</div>
          <h1 className="detail-title">{property.title}</h1>
          <p className="detail-address">
            {property.address?.street}, {property.address?.city}, {property.address?.state} {property.address?.zip}
          </p>

          <div className="spec-strip mono">
            <div><strong>{property.bedrooms}</strong><span>Beds</span></div>
            <div><strong>{property.bathrooms}</strong><span>Baths</span></div>
            <div><strong>{property.areaSqft || "—"}</strong><span>Sqft</span></div>
            <div><strong>{property.furnishing}</strong><span>Furnishing</span></div>
          </div>

          <hr className="hairline" style={{ margin: "28px 0" }} />

          <h2 className="detail-subhead">About this property</h2>
          <p className="detail-description">{property.description}</p>

          {property.amenities?.length > 0 && (
            <>
              <h2 className="detail-subhead">Amenities</h2>
              <div className="amenities-list">
                {property.amenities.map((a) => (
                  <span key={a} className="amenity-pill mono">{a}</span>
                ))}
              </div>
            </>
          )}
        </div>

        <aside className="detail-sidebar blueprint-frame">
          <div className="sidebar-price mono">{formatPrice(property.price, property.priceUnit)}</div>
          <div className="sidebar-owner">
            <div className="eyebrow">Listed by</div>
            <div className="owner-name">{property.owner?.name}</div>
            {property.owner?.phone && <div className="text-muted mono">{property.owner.phone}</div>}
          </div>

          <hr className="hairline" style={{ margin: "18px 0" }} />

          {!user ? (
            <p className="text-muted" style={{ fontSize: 14 }}>
              <a href="/login" style={{ color: "var(--rust)" }}>Sign in</a> to contact the owner about this listing.
            </p>
          ) : sent ? (
            <p style={{ fontSize: 14, color: "var(--moss)" }}>Your message has been sent. The owner will reach out directly.</p>
          ) : (
            <form onSubmit={submitInquiry}>
              {sendError && <div className="error-banner">{sendError}</div>}
              <div className="field">
                <label>Message</label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Hi, I'm interested in ${property.title}. Is it still available?`}
                />
              </div>
              <div className="field">
                <label>Your phone (optional)</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="For a faster callback" />
              </div>
              <button className="btn btn-primary btn-block" disabled={sending}>
                {sending ? "Sending…" : "Contact owner"}
              </button>
            </form>
          )}
        </aside>
      </div>
    </div>
  );
};

export default PropertyDetail;
