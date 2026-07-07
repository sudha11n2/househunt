import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import PropertyCard from "../components/PropertyCard";
import Loader from "../components/Loader";
import "./Home.css";

const Home = () => {
  const [city, setCity] = useState("");
  const [listingType, setListingType] = useState("rent");
  const [featured, setFeatured] = useState([]);
  const [stats, setStats] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/properties", { params: { limit: 6, sort: "-createdAt" } });
        setFeatured(data.properties);
        setStats({ total: data.total });
      } catch (err) {
        // Fails silently on the homepage; listings page surfaces errors properly
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (listingType) params.set("listingType", listingType);
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <div>
      {/* HERO — the search bar itself is the thesis, styled like a large address plate */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="eyebrow">Registered listings across India</div>
          <h1 className="hero-title">
            Find your
            <br />
            next address.
          </h1>
          <p className="hero-sub">
            HouseHunt connects renters, buyers, and agents directly — real listings,
            real contact details, no middleman inbox.
          </p>

          <form className="search-plate blueprint-frame" onSubmit={handleSearch}>
            <div className="search-field">
              <label>City or locality</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Hyderabad, Gachibowli"
              />
            </div>
            <div className="search-field search-field-narrow">
              <label>Looking to</label>
              <select value={listingType} onChange={(e) => setListingType(e.target.value)}>
                <option value="rent">Rent</option>
                <option value="sale">Buy</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
          </form>

          <div className="hero-stats mono">
            <span><strong>{stats.total}</strong> active listings</span>
            <span className="hero-stats-divider">/</span>
            <span>Updated in real time</span>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="container section">
        <div className="section-head">
          <div>
            <div className="eyebrow">Recently added</div>
            <h2 className="section-title">Fresh on the market</h2>
          </div>
          <a href="/listings" className="btn btn-ghost btn-sm">View all listings</a>
        </div>

        {loading ? (
          <Loader />
        ) : featured.length === 0 ? (
          <p className="text-muted">
            No listings yet — start the backend and add a property from an agent account to see it here.
          </p>
        ) : (
          <div className="grid-cards">
            {featured.map((p) => (
              <PropertyCard key={p._id} property={p} />
            ))}
          </div>
        )}
      </section>

      {/* HOW IT WORKS — three roles, not a generic numbered process */}
      <section className="how-it-works">
        <div className="container">
          <div className="eyebrow">For every stakeholder</div>
          <h2 className="section-title">One platform, three vantage points</h2>
          <div className="roles-grid">
            <div className="role-card">
              <div className="role-tag mono">Renter</div>
              <p>Filter by city, price, and bedrooms, then message owners directly — no account required to browse.</p>
            </div>
            <div className="role-card">
              <div className="role-tag mono">Buyer</div>
              <p>Compare sale listings side by side with transparent pricing and verified property specs.</p>
            </div>
            <div className="role-card">
              <div className="role-tag mono">Agent</div>
              <p>List properties, manage inquiries in one dashboard, and track views on every listing you publish.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
