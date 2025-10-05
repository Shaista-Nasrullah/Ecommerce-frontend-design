import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Nav,
  Carousel,
  Offcanvas,
  Button,
} from "react-bootstrap";
import "./HeroSection3.css";
import carousel1 from "../Components/Assets/first.webp";
import carousel2 from "../Components/Assets/second.webp";
import carousel3 from "../Components/Assets/third.webp";
import { List } from "react-bootstrap-icons";
import category1 from "../Components/Assets/category1.png"; // Assuming these paths are correct relative to HeroSection2.js
import category2 from "../Components/Assets/category2.png";
import category3 from "../Components/Assets/category3.png";
import category4 from "../Components/Assets/category4.png";
import category5 from "../Components/Assets/category5.png";
import category6 from "../Components/Assets/category6.png";
import category7 from "../Components/Assets/category7.png";
import category8 from "../Components/Assets/category8.png";

const HeroSection2 = () => {
  const [showSubCategories, setShowSubCategories] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [showOffcanvas, setShowOffcanvas] = useState(false); // State for Offcanvas visibility

  const handleMouseEnter = (category) => {
    setShowSubCategories(true);
    setActiveCategory(category);
  };

  const handleMouseLeave = () => {
    if (!showOffcanvas) {
      setShowSubCategories(false);
      setActiveCategory(null);
    }
  };

  const handleOffcanvasClose = () => {
    setShowOffcanvas(false);
    setShowSubCategories(false);
    setActiveCategory(null);
  };
  const handleOffcanvasShow = () => setShowOffcanvas(true);

  const subCategoriesData = {
    "Health & Beauty": ["Skincare", "Makeup", "Haircare", "Fragrances"],
    "Pet Supplies": ["Dog Food", "Cat Toys", "Pet Beds"],
    "Home & Kitchen": ["Cookware", "Bakeware", "Appliance", "Kitchen Tools"],
    "Baby & Toddler": ["Diapers", "Baby Food", "Strollers", "Toys"],
    "Sports & Outdoor": ["Fitness Gear", "Camping", "Cycling", "Running"],
    "Phone & Gadgets": ["Smartphones", "Accessories", "Wearables"],
    "Electronics & Gadgets": ["Laptops", "TVs", "Headphones", "Cameras"],
    "Groceries & Dailies": ["Fresh Produce", "Dairy", "Snacks", "Beverages"],
  };

  // Map category names to their respective image imports
  const categoryImages = {
    "Health & Beauty": category1,
    "Pet Supplies": category2,
    "Home & Kitchen": category3,
    "Baby & Toddler": category4,
    "Sports & Outdoor": category5,
    "Phone & Gadgets": category6,
    "Electronics & Gadgets": category7, // Assuming you have an image for this
    "Groceries & Dailies": category8, // Assuming you have an image for this
    // Add other categories and their corresponding images
  };

  return (
    <Container fluid className="HeroSection-container">
      <Row className="h-100">
        <Col
          xs={12}
          className="d-lg-none p-2 d-flex align-items-center justify-content-between"
        >
          <Button
            variant="outline-secondary"
            onClick={handleOffcanvasShow}
            className="menu-toggle-btn"
          >
            <List size={20} /> Categories
          </Button>
          <h5 className="m-0 hero-title-sm">Welcome!</h5>
        </Col>

        {/* Categories Menu - Visible on large screens, hidden on small */}
        <Col lg={3} className="menus p-0 d-none d-lg-block">
          <Nav defaultActiveKey="/home" className="flex-column">
            {Object.keys(subCategoriesData).map((category) => (
              <Nav.Link
                key={category}
                eventKey={category}
                onMouseEnter={() => handleMouseEnter(category)}
                onMouseLeave={handleMouseLeave}
                className="text-uppercase text-secondary category-link-with-icon text-black"
              >
                {/* Display category image */}
                <div>
                  {categoryImages[category] && (
                    <img
                      src={categoryImages[category]}
                      alt={category}
                      className="category-icon"
                    />
                  )}
                  {category}
                </div>
                <span className="right-icon">
                  <i className="fa fa-chevron-right"></i>
                </span>
              </Nav.Link>
            ))}
          </Nav>
        </Col>

        {/* Offcanvas for Categories on small screens */}
        <Offcanvas
          show={showOffcanvas}
          onHide={handleOffcanvasClose}
          placement="start"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Product Categories</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column">
              {Object.keys(subCategoriesData).map((category) => (
                <div key={category}>
                  <Nav.Link
                    onClick={() => {
                      if (activeCategory === category && showSubCategories) {
                        setShowSubCategories(false);
                        setActiveCategory(null);
                      } else {
                        setShowSubCategories(true);
                        setActiveCategory(category);
                      }
                    }}
                    className="text-uppercase text-secondary category-link-with-icon"
                  >
                    {/* Display category image in offcanvas */}
                    {categoryImages[category] && (
                      <img
                        src={categoryImages[category]}
                        alt={category}
                        className="category-icon"
                      />
                    )}
                    {category}
                  </Nav.Link>
                  {showSubCategories && activeCategory === category && (
                    <div className="offcanvas-sub-categories ps-3 pb-2">
                      {subCategoriesData[activeCategory]?.map((subCat) => (
                        <Nav.Link key={subCat} href="#" className="text-muted">
                          {subCat}
                        </Nav.Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>

        {/* Main Content Area (Subcategories or Carousel) */}
        <Col xs={12} lg={9} className="p-0">
          {showSubCategories && activeCategory && !showOffcanvas ? (
            <div className="sub-category-container d-none d-lg-block">
              <h4>Subcategories for {activeCategory}</h4>
              <Nav className="flex-column">
                {subCategoriesData[activeCategory]?.map((subCat) => (
                  <Nav.Link key={subCat} href="#">
                    {subCat}
                  </Nav.Link>
                ))}
              </Nav>
            </div>
          ) : (
            <Carousel className="carousel">
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src={carousel1}
                  alt="First slide"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src={carousel2}
                  alt="Second slide"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src={carousel3}
                  alt="Third slide"
                />
              </Carousel.Item>
            </Carousel>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default HeroSection2;
