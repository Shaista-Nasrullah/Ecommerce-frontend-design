import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Nav,
  Carousel,
  Offcanvas,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import "./HeroSection3.css";
import { List } from "react-bootstrap-icons";
import { AppContext } from "../context/AppContext";

const HeroSection2 = () => {
  const {
    allCategories,
    fetchAllCategoriesData,
    fetchSubCategoriesData,
    firstBanner, // Destructure firstBanner from AppContext
    loading: appGlobalLoading, // Renamed to avoid conflict with local loading
    error: appGlobalError, // Renamed to avoid conflict with local error
  } = useContext(AppContext);

  // Local states for HeroSection2's categories fetching
  const [localCategoriesLoading, setLocalCategoriesLoading] = useState(true);
  const [localCategoriesError, setLocalCategoriesError] = useState(null);

  const [showSubCategories, setShowSubCategories] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const [subCategoriesError, setSubCategoriesError] = useState(null);
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  // Fetch all categories when the component mounts
  useEffect(() => {
    fetchAllCategoriesData(setLocalCategoriesLoading, setLocalCategoriesError);
  }, [fetchAllCategoriesData]);

  // Function to fetch subcategories
  const getSubCategories = useCallback(
    async (categoryId) => {
      setLoadingSubCategories(true);
      setSubCategoriesError(null);
      try {
        const data = await fetchSubCategoriesData(
          categoryId,
          setLoadingSubCategories,
          setSubCategoriesError
        );
        setSubCategories(data);
      } catch (err) {
        setSubCategoriesError(err.message);
        setSubCategories([]);
      } finally {
        setLoadingSubCategories(false);
      }
    },
    [fetchSubCategoriesData]
  );

  const handleMouseEnter = (category) => {
    if (category && category.id && category.id !== activeCategoryId) {
      setActiveCategory(category.name);
      setActiveCategoryId(category.id);
      getSubCategories(category.id);
      setShowSubCategories(true);
    } else if (category && category.id === activeCategoryId) {
      setShowSubCategories(true);
    }
  };

  const handleMouseLeave = () => {
    if (!showOffcanvas) {
      setShowSubCategories(false);
      // Optionally reset active category/id/subcategories here if desired on full mouse leave
      // setActiveCategory(null);
      // setActiveCategoryId(null);
      // setSubCategories([]);
    }
  };

  const handleOffcanvasClose = () => {
    setShowOffcanvas(false);
    setShowSubCategories(false);
    setActiveCategory(null);
    setActiveCategoryId(null);
    setSubCategories([]);
  };

  const handleOffcanvasShow = () => setShowOffcanvas(true);

  const handleOffcanvasCategoryClick = (category) => {
    if (activeCategoryId === category.id && showSubCategories) {
      setShowSubCategories(false);
      setActiveCategory(null);
      setActiveCategoryId(null);
      setSubCategories([]);
    } else {
      setActiveCategory(category.name);
      setActiveCategoryId(category.id);
      getSubCategories(category.id);
      setShowSubCategories(true);
    }
  };

  // Display loading state for main categories OR if firstBanner is still loading (part of appGlobalLoading)
  if (localCategoriesLoading || appGlobalLoading) {
    return (
      <Container
        fluid
        className="HeroSection-container d-flex justify-content-center align-items-center"
        style={{ height: "300px" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading Content...</span>
        </Spinner>
      </Container>
    );
  }

  // Display error state for main categories OR if there's a global app error
  if (localCategoriesError || appGlobalError) {
    return (
      <Container
        fluid
        className="HeroSection-container d-flex justify-content-center align-items-center"
        style={{ height: "300px" }}
      >
        <Alert variant="danger">
          Error loading content:{" "}
          {localCategoriesError?.message || appGlobalError?.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="HeroSection-container">
      <Row className="h-100">
        <Col lg={3} className="menus p-0 d-none d-lg-block">
          <Nav defaultActiveKey="/home" className="flex-column">
            {allCategories.length > 0 ? (
              allCategories.map((category) => (
                <Nav.Link
                  key={category.id}
                  eventKey={category.name}
                  onMouseEnter={() => handleMouseEnter(category)}
                  onMouseLeave={handleMouseLeave}
                  className="text-uppercase text-secondary category-link-with-icon text-black"
                >
                  <div>
                    {category.image && (
                      <img
                        src={`${category.image}`}
                        alt={category.name}
                        className="category-icon"
                      />
                    )}
                    {category.name}
                  </div>
                  <span className="right-icon">
                    <i className="fa fa-chevron-right"></i>
                  </span>
                </Nav.Link>
              ))
            ) : (
              <p className="p-3 text-center text-muted">No categories found.</p>
            )}
          </Nav>
        </Col>

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
              {allCategories.length > 0 ? (
                allCategories.map((category) => (
                  <div key={category.id}>
                    <Nav.Link
                      onClick={() => handleOffcanvasCategoryClick(category)}
                      className="text-uppercase text-secondary category-link-with-icon"
                    >
                      {category.image && (
                        <img
                          src={`${category.image}`}
                          alt={category.name}
                          className="category-icon"
                        />
                      )}
                      {category.name}
                    </Nav.Link>
                    {showSubCategories && activeCategoryId === category.id && (
                      <div className="offcanvas-sub-categories ps-3 pb-2">
                        {loadingSubCategories ? (
                          <div className="d-flex justify-content-center py-2">
                            <Spinner animation="border" size="sm" />
                          </div>
                        ) : subCategoriesError ? (
                          <Alert variant="danger" className="py-1 px-2 m-0">
                            Error: {subCategoriesError}
                          </Alert>
                        ) : subCategories.length > 0 ? (
                          subCategories.map((subCat) => (
                            <Nav.Link
                              key={subCat.id}
                              href="#"
                              className="text-muted"
                            >
                              {subCat.name}
                            </Nav.Link>
                          ))
                        ) : (
                          <p className="text-muted ps-3 mb-0">
                            No subcategories.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="p-3 text-center text-muted">
                  No categories found.
                </p>
              )}
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>

        <Col xs={12} lg={9} className="p-0">
          {showSubCategories && activeCategory && !showOffcanvas ? (
            <div
              className="sub-category-container d-none d-lg-block"
              onMouseLeave={handleMouseLeave}
              onMouseEnter={() => setShowSubCategories(true)}
            >
              <h4>Subcategories for {activeCategory}</h4>
              <Nav className="flex-column">
                {loadingSubCategories ? (
                  <div className="d-flex justify-content-center py-5">
                    <Spinner animation="border" />
                  </div>
                ) : subCategoriesError ? (
                  <Alert variant="danger" className="mx-3 mt-3">
                    Error loading subcategories: {subCategoriesError}
                  </Alert>
                ) : subCategories.length > 0 ? (
                  subCategories.map((subCat) => (
                    <Nav.Link key={subCat.id} href="#">
                      {subCat.name}
                    </Nav.Link>
                  ))
                ) : (
                  <p className="p-3 text-muted">
                    No subcategories found for {activeCategory}.
                  </p>
                )}
              </Nav>
            </div>
          ) : (
            <Carousel className="carousel">
              {/* Dynamically render carousel items from firstBanner */}
              {firstBanner && firstBanner.length > 0 ? (
                firstBanner.map((banner) => (
                  <Carousel.Item key={banner.id}>
                    {/* Make sure banner.image contains the full URL if not already processed */}
                    <a
                      href={
                        banner.type === "ad" && banner.url
                          ? banner.url
                          : banner.type === "product" && banner.product_id
                          ? `/product/${banner.product_id}` // Adjust your product URL structure
                          : "#"
                      }
                      target={banner.type === "ad" ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                    >
                      <img
                        className="d-block w-100"
                        src={banner.image} // firstBanner items should already have full image URLs
                        alt={`Banner ${banner.id}`}
                      />
                    </a>
                  </Carousel.Item>
                ))
              ) : (
                // Fallback or placeholder if no banners are available
                <Carousel.Item>
                  <img
                    className="d-block w-100 carousel-image"
                    src="https://via.placeholder.com/900x400?text=No+Banners+Available" // Placeholder image
                    alt="No banners"
                  />
                  <Carousel.Caption>
                    <h3>No Banners Available</h3>
                    <p>Please check back later.</p>
                  </Carousel.Caption>
                </Carousel.Item>
              )}
            </Carousel>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default HeroSection2;
