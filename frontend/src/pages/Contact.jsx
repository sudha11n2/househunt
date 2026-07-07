import { useState } from "react";
import "./Static.css";

const Contact = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="static-page">
      <div className="container static-hero">
        <div className="eyebrow">Get in touch</div>
        <h1>Questions, feedback, partnerships.</h1>
        <p className="static-lead">Reach the HouseHunt team directly — we read every message.</p>
      </div>

      <div className="container contact-layout">
        <form className="contact-form blueprint-frame" onSubmit={handleSubmit}>
          {sent ? (
            <p style={{ color: "var(--moss)" }}>Thanks — your message has been noted. We'll follow up by email.</p>
          ) : (
            <>
              <div className="field">
                <label>Name</label>
                <input required />
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" required />
              </div>
              <div className="field">
                <label>Message</label>
                <textarea required />
              </div>
              <button className="btn btn-primary btn-block">Send message</button>
            </>
          )}
        </form>

        <div className="contact-details">
          <div className="eyebrow">Office</div>
          <p className="mono">Plot 14, Sector 9<br />Hyderabad, Telangana 500081<br />India</p>
          <div className="eyebrow" style={{ marginTop: 24 }}>Email</div>
          <p className="mono">hello@househunt.example</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
