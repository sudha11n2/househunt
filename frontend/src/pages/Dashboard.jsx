import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Loader from "../components/Loader";
import "./Dashboard.css";

const Dashboard = () => {
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("listings");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [propsRes, inqRes] = await Promise.all([
        api.get("/properties/mine/all"),
        api.get("/inquiries/received"),
      ]);
      setProperties(propsRes.data.properties);
      setInquiries(inqRes.data.inquiries);
    } catch (err) {
      setError("Could not load your dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this listing permanently?")) return;
    try {
      await api.delete(`/properties/${id}`);
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete this listing.");
    }
  };

  if (loading) return <Loader label="Loading your dashboard" />;

  return (
    <div className="container dashboard-page">
      <div className="dash-header">
        <div>
          <div className="eyebrow">Agent dashboard</div>
          <h1 className="dash-title">Your listings</h1>
        </div>
        <Link to="/dashboard/new" className="btn btn-primary">+ Add property</Link>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="dash-tabs mono">
        <button className={tab === "listings" ? "active" : ""} onClick={() => setTab("listings")}>
          Listings ({properties.length})
        </button>
        <button className={tab === "inquiries" ? "active" : ""} onClick={() => setTab("inquiries")}>
          Inquiries ({inquiries.length})
        </button>
      </div>

      {tab === "listings" ? (
        properties.length === 0 ? (
          <p className="text-muted">You haven't listed any properties yet.</p>
        ) : (
          <table className="dash-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>City</th>
                <th>Price</th>
                <th>Status</th>
                <th>Views</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p._id}>
                  <td><Link to={`/listings/${p._id}`}>{p.title}</Link></td>
                  <td>{p.address?.city}</td>
                  <td className="mono">₹{p.price.toLocaleString("en-IN")}</td>
                  <td><span className={`status-pill status-${p.status}`}>{p.status}</span></td>
                  <td className="mono">{p.views}</td>
                  <td className="dash-actions">
                    <Link to={`/dashboard/edit/${p._id}`} className="btn btn-ghost btn-sm">Edit</Link>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(p._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      ) : inquiries.length === 0 ? (
        <p className="text-muted">No inquiries yet.</p>
      ) : (
        <div className="inquiry-list">
          {inquiries.map((inq) => (
            <div key={inq._id} className="inquiry-card blueprint-frame">
              <div className="inquiry-head">
                <strong>{inq.property?.title}</strong>
                <span className="mono text-muted">{new Date(inq.createdAt).toLocaleDateString()}</span>
              </div>
              <p>{inq.message}</p>
              <div className="text-muted mono">
                From {inq.sender?.name} · {inq.sender?.email}
                {inq.contactPhone && ` · ${inq.contactPhone}`}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
