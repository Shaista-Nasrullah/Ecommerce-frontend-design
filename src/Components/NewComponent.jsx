import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import "./NewComponent.css"; // Renamed CSS file for consistency
// ... (your existing image imports) ...
import featuredProducts1 from "../Components/Assets/featured-product1.png";
import featuredProducts2 from "../Components/Assets/featured-product2.png";
import featuredProducts3 from "../Components/Assets/featured-product3.png";
import featuredProducts4 from "../Components/Assets/featured-product4.png";

import featuredProducts5 from "../Components/Assets/featured-product5.png";
import featuredProducts6 from "../Components/Assets/featured-product6.png";
import featuredProducts7 from "../Components/Assets/featured-product7.png";
import featuredProducts8 from "../Components/Assets/featured-product8.png";

import featuredProducts9 from "../Components/Assets/featured-product9.png";
import featuredProducts10 from "../Components/Assets/featured-product10.png";
import featuredProducts11 from "../Components/Assets/featured-product11.png";
import featuredProducts12 from "../Components/Assets/featured-product12.png";
import { useNavigate } from "react-router-dom";

const ProductDisplay = () => {
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

  const flashDealProducts = [
    {
      id: 1,
      name: "iPhone 14 Pro Max",
      slug: "iphone-14-pro-max",
      price: "$1,149.00",
      image: featuredProducts1,
    },
    {
      id: 2,
      name: "Beauty Jelly Lipstick",
      slug: "beauty-jelly-lipstick",
      price: "$32.00",
      image: featuredProducts2,
    },
    {
      id: 3,
      name: "Leather Ladies Bag",
      slug: "leather-ladies-bag",
      originalPrice: "$15.00",
      price: "$15.00",
      rating: 2,
      image: featuredProducts3,
    },
    {
      id: 4,
      name: "Samsung S24 Ultra",
      slug: "samsung-s24-ultra",
      price: "$1,150.00",
      image: featuredProducts4,
    },
  ];

  const featuredProducts = [
    {
      id: 5,
      name: "Beauty Facial Cleanser",
      slug: "beauty-facial-cleanser",
      price: "$12.00",
      image: featuredProducts5,
    },
    {
      id: 6,
      name: "Moisturizing Cream",
      slug: "moisturizing-cream",
      price: "$14.00",
      image: featuredProducts6,
    },
    {
      id: 7,
      name: "Tote Bag High Quality",
      slug: "tote-bag-high-quality",
      price: "$20.00",
      image: featuredProducts7,
    },
    {
      id: 8,
      name: "Smart Watch Bluetooth",
      slug: "smart-watch-bluetooth",
      price: "$150.00",
      image: featuredProducts8,
    },
    {
      id: 9,
      name: "Women Smart Watch",
      slug: "women-smart-watch",
      originalPrice: "$550.00",
      price: "$495.00",
      discount: "-$55.00",
      image: featuredProducts9,
    },
    {
      id: 10,
      name: "Samsung S24 Ultra",
      slug: "samsung-s24-ultra",
      price: "$1,150.00",
      image: featuredProducts10,
    },
    {
      id: 11,
      name: "Gaming Headset",
      slug: "gaming-headset",
      price: "$79.99",
      image: featuredProducts11,
    },
    {
      id: 12,
      name: "Wireless Earbuds",
      slug: "wireless-earbuds",
      price: "$129.00",
      image: featuredProducts12,
    },
  ];

  // const renderStars = (rating) => {
  //   const stars = [];
  //   for (let i = 0; i < 5; i++) {
  //     stars.push(
  //       <span
  //         key={i}
  //         className={
  //           i < rating
  //             ? "product-display-star-filled"
  //             : "product-display-star-empty"
  //         }
  //       >
  //         ★
  //       </span>
  //     );
  //   }
  //   return stars;
  // };

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
            <Row>
              {flashDealProducts.map((product) => (
                <Col
                  key={product.id}
                  xs={6}
                  sm={6}
                  md={4}
                  lg={3}
                  className="mb-3"
                >
                  <div
                    className="product-display-product-card"
                    onClick={() => handleProductClick(product.slug)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="product-display-product-image-wrapper">
                      <img src={product.image} alt={product.name} />
                    </div>
                    <div className="product-display-product-info">
                      <p>{product.name}</p>
                      <p>{product.price}</p>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
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
          {featuredProducts.map((product) => (
            <div key={product.id} className="product-display-product-card-row2">
              <div className="product-display-product-image-wrapper">
                <img src={product.image} alt={product.name} />
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
