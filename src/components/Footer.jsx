import React from "react";
import { Link } from "react-router-dom";
import '../css/footer.css';  // Import the CSS file

function Footer() {
  return (
    <div className="footer">
      {/* Links */}
      <div style={{ marginBottom: "20px" }}>

        <strong>InfinityPlay.com</strong>
        {" "}
        |{" "}
        <Link to="/submit-a-game" className="link">
          Submit a Game
        </Link>{" "}
        |{" "}
        <Link to="/about-us" className="link">
          About Us
        </Link>{" "}
        |{" "}
        <Link to="/terms" className="link">
          Terms of Use
        </Link>
      </div>
    </div>
  );
}

export default Footer;
