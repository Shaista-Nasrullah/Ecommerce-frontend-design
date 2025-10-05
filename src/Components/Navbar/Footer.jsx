import React from "react";
import "./Footer.css";
import {
  FaPhone,
  FaEnvelope,
  FaTicketAlt,
  FaMapMarkerAlt,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaPinterestP,
} from "react-icons/fa";
import {
  Container,
  Row,
  Col,
  InputGroup,
  FormControl,
  Button,
} from "react-bootstrap";

import logo from "../Assets/logo.png"; // Make sure your logo path is correct
import app_store from "../Assets/app-store.png"; // Make sure your app store image path is correct
import app_btn from "../Assets/app-btn.png"; // Make sure your app button image path is correct

const Footer = () => {
  return (
    <footer className="footer-container">
      <Container className="footer-content py-5">
        <Row>
          {/* Brand and App Download Section */}
          <Col
            lg={4}
            md={6}
            sm={12}
            className="mb-4 mb-lg-0 text-center text-md-start"
          >
            <div className="brand-logo d-flex align-items-center justify-content-center justify-content-md-start mb-3">
              <img src={logo} alt="6Valley Logo" className="me-2" />
              <p className="m-0">6Valley</p>
            </div>
            <p className="download-app-text mb-3">DOWNLOAD OUR APP</p>
            <div className="app-download-links d-flex justify-content-center justify-content-md-start gap-2">
              <a
                href="https://www.apple.com/app-store/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={app_store} alt="App Store" className="app-badge" />
              </a>
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={app_btn}
                  alt="Google Play Store"
                  className="app-badge"
                />
              </a>
            </div>
          </Col>

          {/* Quick Links Section */}
          <Col lg={2} md={6} sm={6} xs={6} className="mb-4 mb-lg-0">
            <h3 className="footer-section-title">QUICK LINKS</h3>
            <ul className="list-unstyled">
              <li>
                <a href="/profile-info">Profile Info</a>
              </li>
              <li>
                <a href="/flash-deal">Flash Deal</a>
              </li>
              <li>
                <a href="/featured-products">Featured Products</a>
              </li>
              <li>
                <a href="/best-selling-product">Best Selling Product</a>
              </li>
              <li>
                <a href="/latest-products">Latest Products</a>
              </li>
              <li>
                <a href="/top-rated-product">Top Rated Product</a>
              </li>
              <li>
                <a href="/track-order">Track Order</a>
              </li>
            </ul>
          </Col>

          {/* Other Links Section */}
          <Col lg={2} md={6} sm={6} xs={6} className="mb-4 mb-lg-0">
            <h3 className="footer-section-title">OTHER</h3>
            <ul className="list-unstyled">
              <li>
                <a href="/about-us">About Us</a>
              </li>
              <li>
                <a href="/terms-and-conditions">Terms And Conditions</a>
              </li>
              <li>
                <a href="/privacy-policy">Privacy Policy</a>
              </li>
              <li>
                <a href="/refund-policy">Refund Policy</a>
              </li>
              <li>
                <a href="/cancellation-policy">Cancellation Policy</a>
              </li>
            </ul>
          </Col>

          {/* Newsletter Section */}
          <Col
            lg={4}
            md={6}
            sm={12}
            className="mb-4 mb-lg-0 text-center text-md-start"
          >
            <h3 className="footer-section-title">NEWSLETTER</h3>
            <p>Subscribe to our new channel to get latest updates</p>
            <InputGroup className="newsletter-form-group">
              <FormControl
                placeholder="Your Email Address"
                aria-label="Your Email Address"
                type="email"
                className="newsletter-input"
              />
              <Button variant="light" className="newsletter-button">
                Subscribe
              </Button>
            </InputGroup>
          </Col>
        </Row>
      </Container>

      {/* Footer Bottom Section */}
      <Container className="footer-bottom py-4">
        <Row className="align-items-center justify-content-between g-3">
          {/* Start a Conversation */}
          <Col lg={5} md={12} className="text-center text-lg-start">
            <h5 className="mb-3 footer-heading position-relative d-inline-block pb-1">
              Start A Conversation
            </h5>
            <div className="contact-info d-flex flex-wrap justify-content-center justify-content-lg-start gap-3">
              <span>
                <FaPhone className="me-2" /> +00xxxxxxxxxx
              </span>
              <span>
                <FaEnvelope className="me-2" /> copy@6amtech.com
              </span>
              <span>
                <FaTicketAlt className="me-2" /> Support ticket
              </span>
            </div>
          </Col>

          {/* Address Section */}
          <Col
            lg={4}
            md={12}
            className="text-center text-lg-start mt-3 mt-lg-0"
          >
            <h5 className="mb-3 footer-heading position-relative d-inline-block pb-1">
              Address
            </h5>
            <div className="address-info d-flex flex-wrap justify-content-center justify-content-lg-start gap-3">
              <span>
                <FaMapMarkerAlt className="me-2" /> Kingston, New York 12401
                United States
              </span>
            </div>
          </Col>

          {/* Social Media */}
          <Col lg={3} md={12} className="text-center text-lg-end mt-3 mt-lg-0">
            <div className="social-icons d-flex justify-content-center justify-content-lg-end gap-3">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://pinterest.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pinterest"
              >
                <FaPinterestP />
              </a>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Copyright Section */}
      <div className="footer-copyright py-3 text-center">
        <p className="m-0">Copyright 6amTech@2021</p>
      </div>
    </footer>
  );
};

export default Footer;
