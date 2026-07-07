import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="container" style={{ padding: "120px 24px", textAlign: "center" }}>
    <div className="eyebrow">404</div>
    <h1 style={{ fontSize: 42, margin: "12px 0 20px" }}>This address doesn't exist.</h1>
    <Link to="/" className="btn btn-primary">Back to homepage</Link>
  </div>
);

export default NotFound;
