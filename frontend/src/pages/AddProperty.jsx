import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import Loader from "../components/Loader";
import "./AddProperty.css";

const emptyForm = {
  title: "",
  description: "",
  listingType: "rent",
  propertyType: "apartment",
  price: "",
  priceUnit: "month",
  bedrooms: 1,
  bathrooms: 1,
  areaSqft: "",
  furnishing: "unfurnished",
  street: "",
  city: "",
  state: "",
  zip: "",
  images: "",
  amenities: "",
};

const AddProperty = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      try {
        const { data } = await api.get(`/properties/${id}`);
        const p = data.property;
        setForm({
          title: p.title,
          description: p.description,
          listingType: p.listingType,
          propertyType: p.propertyType,
          price: p.price,
          priceUnit: p.priceUnit,
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          areaSqft: p.areaSqft || "",
          furnishing: p.furnishing,
          street: p.address?.street || "",
          city: p.address?.city || "",
          state: p.address?.state || "",
          zip: p.address?.zip || "",
          images: (p.images || []).join(", "),
          amenities: (p.amenities || []).join(", "),
        });
      } catch (err) {
        setError("Could not load this listing for editing.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit]);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      title: form.title,
      description: form.description,
      listingType: form.listingType,
      propertyType: form.propertyType,
      price: Number(form.price),
      priceUnit: form.priceUnit,
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      areaSqft: form.areaSqft ? Number(form.areaSqft) : undefined,
      furnishing: form.furnishing,
      address: { street: form.street, city: form.city, state: form.state, zip: form.zip },
      images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
      amenities: form.amenities.split(",").map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (isEdit) {
        await api.put(`/properties/${id}`, payload);
      } else {
        await api.post("/properties", payload);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save this listing.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading listing" />;

  return (
    <div className="container property-form-page">
      <div className="eyebrow">{isEdit ? "Edit listing" : "New listing"}</div>
      <h1 className="form-title">{isEdit ? "Update property" : "List a property"}</h1>

      {error && <div className="error-banner">{error}</div>}

      <form onSubmit={handleSubmit} className="property-form blueprint-frame">
        <div className="field">
          <label>Title</label>
          <input required value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Sunlit 2BHK near Gachibowli tech park" />
        </div>
        <div className="field">
          <label>Description</label>
          <textarea required value={form.description} onChange={(e) => update("description", e.target.value)} />
        </div>

        <div className="field-row">
          <div className="field">
            <label>Listing type</label>
            <select value={form.listingType} onChange={(e) => update("listingType", e.target.value)}>
              <option value="rent">For rent</option>
              <option value="sale">For sale</option>
            </select>
          </div>
          <div className="field">
            <label>Property type</label>
            <select value={form.propertyType} onChange={(e) => update("propertyType", e.target.value)}>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
              <option value="studio">Studio</option>
              <option value="condo">Condo</option>
              <option value="plot">Plot</option>
            </select>
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label>Price (INR)</label>
            <input type="number" required value={form.price} onChange={(e) => update("price", e.target.value)} />
          </div>
          <div className="field">
            <label>Price unit</label>
            <select value={form.priceUnit} onChange={(e) => update("priceUnit", e.target.value)}>
              <option value="month">Per month</option>
              <option value="year">Per year</option>
              <option value="total">Total</option>
            </select>
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label>Bedrooms</label>
            <input type="number" min="0" required value={form.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} />
          </div>
          <div className="field">
            <label>Bathrooms</label>
            <input type="number" min="0" required value={form.bathrooms} onChange={(e) => update("bathrooms", e.target.value)} />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label>Area (sqft)</label>
            <input type="number" value={form.areaSqft} onChange={(e) => update("areaSqft", e.target.value)} />
          </div>
          <div className="field">
            <label>Furnishing</label>
            <select value={form.furnishing} onChange={(e) => update("furnishing", e.target.value)}>
              <option value="unfurnished">Unfurnished</option>
              <option value="semi">Semi-furnished</option>
              <option value="furnished">Furnished</option>
            </select>
          </div>
        </div>

        <hr className="hairline" style={{ margin: "10px 0 20px" }} />

        <div className="field">
          <label>Street address</label>
          <input required value={form.street} onChange={(e) => update("street", e.target.value)} />
        </div>
        <div className="field-row">
          <div className="field">
            <label>City</label>
            <input required value={form.city} onChange={(e) => update("city", e.target.value)} />
          </div>
          <div className="field">
            <label>State</label>
            <input required value={form.state} onChange={(e) => update("state", e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label>ZIP / PIN code</label>
          <input value={form.zip} onChange={(e) => update("zip", e.target.value)} />
        </div>

        <div className="field">
          <label>Image URLs (comma separated)</label>
          <textarea value={form.images} onChange={(e) => update("images", e.target.value)} placeholder="https://... , https://..." />
        </div>
        <div className="field">
          <label>Amenities (comma separated)</label>
          <input value={form.amenities} onChange={(e) => update("amenities", e.target.value)} placeholder="Parking, Lift, Gym, Power backup" />
        </div>

        <button className="btn btn-primary btn-block" disabled={saving}>
          {saving ? "Saving…" : isEdit ? "Save changes" : "Publish listing"}
        </button>
      </form>
    </div>
  );
};

export default AddProperty;
