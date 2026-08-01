import React from "react";
import Logo from "../assets/my-logo_light.png"

const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="upper-content">
          <div className="footer-introduction">
            <div className="signature-container">
              <img src={Logo} alt="light-logo" />
              <h3>StyleRush</h3>
            </div>
            <p className="intro-para">
              StyleRush is an E-commerce clothing store showcasing men's and
              women's fashion, seasonal outfits, formal wear, and trendy
              accessories.
            </p>
          </div>

          <div className="footer-section-container">
            <div className="footer-section">
              <h1>Shop</h1>
              <div className="footer-links">
                <a href="#">Menswears</a>
                <a href="#">Womenswears</a>
                <a href="#">Kidswears</a>
              </div>
            </div>

            <div className="footer-section">
              <h1>Connect</h1>
              <div className="footer-links">
                <a
                  href="https://www.linkedin.com/in/abdullah-farooq-rehmani-257452249/"
                  target="_blank"
                >
                  LinkedIn
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61583532714796"
                  target="_blank"
                >
                  Facebook
                </a>
                <a
                  href="https://theabdullahrehmani.netlify.app/"
                  target="_blank"
                >
                  Portfolio
                </a>
              </div>
            </div>

            <div className="footer-section about-us">
              <h1>About Us</h1>
              <div className="footer-links">
                <a href="#">Our Story</a>
                <a href="#">Our Uniqueness</a>
              </div>
            </div>
          </div>
        </div>

        <div className="lower-content">
          <p className="copyright-notice">
            &copy; 2026 StyleRush Store. All Rights Reserved.
          </p>
          <div className="links">
            <a
              href="https://www.linkedin.com/in/abdullah-farooq-rehmani-257452249/"
              target="_blank"
            >
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61583532714796"
              target="_blank"
            >
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="https://theabdullahrehmani.netlify.app/" target="_blank">
              <i className="fa-solid fa-globe"></i>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
