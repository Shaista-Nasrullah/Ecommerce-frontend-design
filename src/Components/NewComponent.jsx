import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import "./NewComponent.css";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const ProductDisplay = () => {
  const { flushDeals, featured, loading, error } = useContext(AppContext);

  const navigate = useNavigate();
  const calculateTimeLeft = () => {
    const difference = +new Date("2024-12-31T23:59:59") - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    timerComponents.push(
      <div key={interval} className="product-display-time-segment">
        <span className="product-display-time-value">
          {timeLeft[interval] < 10
            ? "0" + timeLeft[interval]
            : timeLeft[interval]}
        </span>
        <span className="product-display-time-label">
          {interval.charAt(0).toUpperCase() + interval.slice(1)}
        </span>
      </div>
    );
  });

  const handleProductClick = (slug) => {
    navigate(`/product/${slug}`);
  };

  if (loading) {
    return <div className="brands-section-container">Loading brands...</div>;
  }

  if (error) {
    return (
      <div className="brands-section-container">
        Error loading brands: {error.message}
        <p>Please check your network connection and API endpoint.</p>
      </div>
    );
  }

  if (flushDeals.length === 0 || featured.length === 0) {
    return <div className="brands-section-container">No products found.</div>;
  }

  return (
    <Container className="my-4 product-display-container">
      <div className="product-display-flash-deal-section">
        <h2 className="product-display-section-title">
          FLASH DEAL{" "}
          <Button variant="link" className="product-display-view-all-button">
            View All
          </Button>
        </h2>
        <Row className="product-display-flash-deal-row mb-5 flex-column-reverse flex-md-row">
          <Col xs={12} md={4} className="product-display-flash-deal-timer-col">
            <Card className="product-display-flash-deal-timer-card">
              <Card.Body>
                <h5 className="product-display-card-title">
                  Hurry Up! The offer is limited. Grab while it lasts
                </h5>
                <div className="product-display-countdown-timer d-flex justify-content-around my-3">
                  {timerComponents.length ? (
                    timerComponents
                  ) : (
                    <span>Time's up!</span>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={8}>
            {/* Start of changes for scrollable flushDeals */}
            <div
              style={{
                overflowX: "scroll",
                whiteSpace: "nowrap",
                msOverflowStyle: "none", /* IE and Edge */
                scrollbarWidth: "none",  /* Firefox */
              }}
              className="d-flex" // Use d-flex to keep items in a row
            >
              {flushDeals.map((product) => (
                // Each product needs to be a flex item with fixed width
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product.slug)}
                  style={{
                    flex: "0 0 auto", // Prevent flex item from growing or shrinking
                    width: "25%",    // Roughly 4 items per row. Adjust as needed.
                    minWidth: "180px", // Minimum width for product cards
                    maxWidth: "25%", // Maximum width for product cards
                    padding: "0 7.5px", // Apply padding equivalent to Col's gutter
                    boxSizing: "border-box", // Include padding in width calculation
                  }}
                  className="mb-3"
                >
                  <div className="product-display-product-card" style={{ height: "100%" }}>
                    <div className="product-display-product-image-wrapper">
                      <img src={product.feature_image} alt={product.name} />
                    </div>
                    <div className="product-display-product-info">
                      <p>{product.name}</p>
                      <p>{product.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* End of changes for scrollable flushDeals */}
          </Col>
        </Row>
      </div>

      <h2 className="product-display-section-title mt-5">
        Featured products{" "}
        <Button variant="link" className="product-display-view-all-button">
          View All
        </Button>
      </h2>

      <div className="product-display-featured-products-scroll-container">
        <div className="product-display-featured-products-scroll-content">
          {featured.map((product) => (
            <div key={product.id} className="product-display-product-card-row2">
              <div className="product-display-product-image-wrapper">
                <img src={product.feature_image} alt={product.name} />
              </div>
              <div className="product-display-product-info">
                <p>{product.name}</p>
                <p>{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default ProductDisplay;