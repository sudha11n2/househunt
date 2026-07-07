import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import PropertyCard from "../components/PropertyCard";
import Loader from "../components/Loader";
import "./Listings.css";

const Listings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [meta, setMeta] = useState({ total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    city: searchParams.get("city") || "",
    listingType: searchParams.get("listingType") || "",
    propertyType: searchParams.get("propertyType") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedrooms: searchParams.get("bedrooms") || "",
  });
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const fetchListings = async () => {
    setLoading(true);
    setError("");
    try {
      const params = { ...filters, page, limit: 9 };
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);
      const { data } = await api.get("/properties", { params });
      setProperties(data.properties);
      setMeta({ total: data.total, pages: data.pages });
    } catch (err) {
      setError("Could not load listings. Make sure the backend API is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const applyFilters = (e) => {
    e.preventDefault();
    setPage(1);
    const params = { ...filters, page: 1 };
    Object.keys(params).forEach((k) => !params[k] && delete params[k]);
    setSearchParams(params);
    fetchListings();
  };

  const updateFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value }));

  return (
    <div className="container listings-page">
      <div className="eyebrow">{meta.total} results</div>
      <h1 className="listings-title">Listings</h1>

      <div className="listings-layout">
        <aside className="filters blueprint-frame">
          <div className="eyebrow" style={{ marginBottom: 16 }}>Refine</div>
          <form onSubmit={applyFilters}>
            <div className="field">
              <label>City</label>
              <input value={filters.city} onChange={(e) => updateFilter("city", e.target.value)} placeholder="Hyderabad" />
            </div>
            <div className="field">
              <label>Listing type</label>
              <select value={filters.listingType} onChange={(e) => updateFilter("listingType", e.target.value)}>
                <option value="">Any</option>
                <option value="rent">For rent</option>
                <option value="sale">For sale</option>
              </select>
            </div>
            <div className="field">
              <label>Property type</label>
              <select value={filters.propertyType} onChange={(e) => updateFilter("propertyType", e.target.value)}>
                <option value="">Any</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="studio">Studio</option>
                <option value="condo">Condo</option>
                <option value="plot">Plot</option>
              </select>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Min price</label>
                <input type="number" value={filters.minPrice} onChange={(e) => updateFilter("minPrice", e.target.value)} />
              </div>
              <div className="field">
                <label>Max price</label>
                <input type="number" value={filters.maxPrice} onChange={(e) => updateFilter("maxPrice", e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label>Min bedrooms</label>
              <select value={filters.bedrooms} onChange={(e) => updateFilter("bedrooms", e.target.value)}>
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary btn-block">Apply filters</button>
          </form>
        </aside>

        <div className="listings-results">
          {error && <div className="error-banner">{error}</div>}
          {loading ? (
            <Loader />
          ) : properties.length === 0 ? (
            <p className="text-muted">No listings match these filters yet.</p>
          ) : (
            <>
              <div className="grid-cards">
                {properties.map((p) => (
                  <PropertyCard key={p._id} property={p} />
                ))}
              </div>
              {meta.pages > 1 && (
                <div className="pagination mono">
                  {Array.from({ length: meta.pages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      className={`page-btn ${n === page ? "active" : ""}`}
                      onClick={() => setPage(n)}
                    >
                      {String(n).padStart(2, "0")}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listings;
