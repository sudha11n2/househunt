import "./Static.css";

const About = () => (
  <div className="static-page">
    <div className="container static-hero">
      <div className="eyebrow">Our thesis</div>
      <h1>Property search shouldn't feel like paperwork.</h1>
      <p className="static-lead">
        HouseHunt was built to strip the real estate search down to what actually matters:
        accurate listings, direct contact with the person who owns or manages the property,
        and no walls of ad clutter in between.
      </p>
    </div>

    <div className="container static-grid">
      <div>
        <div className="eyebrow">What we verify</div>
        <p>Every listing carries a street address, a real price, and specs an agent stands behind — no placeholder photos passed off as the genuine unit.</p>
      </div>
      <div>
        <div className="eyebrow">Who we serve</div>
        <p>Renters comparing neighborhoods, buyers evaluating long-term value, and independent agents who need a dashboard, not a spreadsheet.</p>
      </div>
      <div>
        <div className="eyebrow">How it stays fast</div>
        <p>A single MongoDB-backed catalog, JWT-secured accounts, and search filters that return results in one round trip.</p>
      </div>
    </div>
  </div>
);

export default About;
