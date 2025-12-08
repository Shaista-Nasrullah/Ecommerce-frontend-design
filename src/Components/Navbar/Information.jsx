import React from "react";
import "./Information.css";
import about_us from "../../Components/Assets/about-company.png";
import contact_us from "../../Components/Assets/contact-us.png";
import faq from "../../Components/Assets/faq.png";
import blog from "../../Components/Assets/blog-logo.png";
import { Link } from "react-router-dom";

const Information = () => {
  return (
    <div className="information-container">
      <Link to="/about-us" className="each-section-link">
        <div className="each-section">
          <img src={about_us} alt="About Us" />
          <p>About us</p>
          <h4>Know about our company more.</h4>
        </div>
      </Link>
      <Link to="/contact" className="each-section-link">
        <div className="each-section">
          <img src={contact_us} alt="Contact Us" />
          <p>Contact Us</p>
          <h4>We are here to Help</h4>
        </div>
      </Link>
      <Link to="/faq" className="each-section-link">
        <div className="each-section">
          <img src={faq} alt="FAQ" />
          <p>FAQ</p>
          <h4>Get all Answers</h4>
        </div>
      </Link>
      <Link to="/blog" className="each-section-link">
        <div className="each-section">
          <img src={blog} alt="Blog" />
          <p>Blog</p>
          <h4>Check Latest Blogs</h4>
        </div>
      </Link>
    </div>
  );
};

export default Information;
