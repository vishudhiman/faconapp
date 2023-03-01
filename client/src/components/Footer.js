import React from "react";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div class="social_profile">
        <ul>
          <li>
            <a href="#">
              <i class="fab fa-facebook-f"></i>
            </a>
          </li>
          <li>
            <a href="#">
              <i class="fab fa-google-plus-g"></i>
            </a>
          </li>
          <li>
            <a href="#">
              <i class="fab fa-instagram"></i>
            </a>
          </li>
        </ul>
      </div>
      <div className="footer-copyright">
        &copy; {new Date().getFullYear()} Facon
      </div>
    </footer>
  );
};

export default Footer;
