import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Nav, Card } from "react-bootstrap";
import {
  PersonCircle,
  BoxSeam,
  ArrowRepeat,
  Heart,
  Wallet,
  Gift,
  Inbox,
  GeoAlt,
  LifePreserver,
  Share,
  Ticket,
  Truck,
  List,
} from "react-bootstrap-icons";
import "../Pages/ProfileStyles.css";

const ProfileSidebar = () => {
  const location = useLocation();
  const activeKey = location.pathname;

  // State to control menu visibility on mobile
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Optional: Close menu when a link is clicked (for better mobile UX)
  const handleLinkClick = () => {
    if (window.innerWidth < 992) {
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="customer-sidebar">
      <Card.Body>
        {/* --- Mobile Menu Toggle Header (Visible only < 991px) --- */}
        <div
          className="sidebar-toggle d-lg-none d-flex align-items-center justify-content-between mb-3"
          onClick={toggleMenu}
        >
          {/* <span className="fw-bold">Profile Menu</span> */}
          <List size={24} className="text-primary" />
        </div>

        {/* --- Navigation Menu --- */}
        {/* We use a dynamic class to show/hide on mobile based on state */}
        <div className={`sidebar-nav-container ${isMenuOpen ? "show" : ""}`}>
          <Nav activeKey={activeKey} className="flex-column">
            <Nav.Link
              href="/profile"
              onClick={handleLinkClick}
              className="d-flex align-items-center"
            >
              <PersonCircle className="me-2" /> Profile Info
            </Nav.Link>
            <Nav.Link
              href="/my-order"
              onClick={handleLinkClick}
              className="d-flex align-items-center"
            >
              <BoxSeam className="me-2" /> My Order
            </Nav.Link>
            <Nav.Link
              href="/wish-list"
              onClick={handleLinkClick}
              className="d-flex align-items-center"
            >
              <Heart className="me-2" /> Wish List
            </Nav.Link>
            <Nav.Link
              href="/payment-methods"
              onClick={handleLinkClick}
              className="d-flex align-items-center"
            >
              <Wallet className="me-2" /> Payment Methods
            </Nav.Link>
            <Nav.Link
              href="/my-wallet"
              onClick={handleLinkClick}
              className="d-flex align-items-center"
            >
              <Gift className="me-2" /> My Wallet
            </Nav.Link>
            <Nav.Link
              href="/inbox"
              onClick={handleLinkClick}
              className="d-flex align-items-center"
            >
              <Inbox className="me-2" /> Inbox
            </Nav.Link>
            <Nav.Link
              href="/my-address"
              onClick={handleLinkClick}
              className="d-flex align-items-center"
            >
              <GeoAlt className="me-2" /> My Address
            </Nav.Link>
            <Nav.Link
              href="/support-ticket"
              onClick={handleLinkClick}
              className="d-flex align-items-center"
            >
              <LifePreserver className="me-2" /> Support Ticket
            </Nav.Link>
            <Nav.Link
              href="/refer-earn"
              onClick={handleLinkClick}
              className="d-flex align-items-center"
            >
              <Share className="me-2" /> Refer & Earn
            </Nav.Link>
            <Nav.Link
              href="/coupons"
              onClick={handleLinkClick}
              className="d-flex align-items-center"
            >
              <Ticket className="me-2" /> Coupons
            </Nav.Link>
            <Nav.Link
              href="/track-order"
              onClick={handleLinkClick}
              className="d-flex align-items-center"
            >
              <Truck className="me-2" /> Track Order
            </Nav.Link>
            <Nav.Link
              href="/security"
              onClick={handleLinkClick}
              className="d-flex align-items-center"
            >
              <ArrowRepeat className="me-2" /> Security
            </Nav.Link>
          </Nav>
        </div>
      </Card.Body>
    </div>
  );
};

export default ProfileSidebar;
