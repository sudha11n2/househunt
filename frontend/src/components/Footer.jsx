import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => (
  <footer className="footer">
    <div className="container footer-inner">
      <div className="footer-col">
        <div className="footer-brand">HouseHunt</div>
        <p className="footer-tag">A digital marketplace for renters, buyers, and the agents between them.</p>
      </div>
      <div className="footer-col">
        <div className="eyebrow">Navigate</div>
        <Link to="/listings">Listings</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <div className="footer-col">
        <div className="eyebrow">Account</div>
        <Link to="/login">Sign in</Link>
        <Link to="/register">Create account</Link>
      </div>
      <div className="footer-col">
        <div className="eyebrow">Registered office</div>
        <p className="mono footer-address">Plot 14, Sector 9<br />Hyderabad, Telangana<br />500081, India</p>
      </div>
    </div>
    <div className="container footer-bottom">
      <span className="mono">© {new Date().getFullYear()} HouseHunt</span>
      <span className="mono">Built for renters, buyers &amp; agents</span>
    </div>
  </footer>
);

export default Footer;
