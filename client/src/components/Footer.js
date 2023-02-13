import React from "react";
import "../styles/footer.css";

const Footer = () => {
  return (
      <footer className="footer-container">
        <div className="footer-copyright">&copy; {new Date().getFullYear()} Facon</div>
      </footer>
  );
};

export default Footer;
