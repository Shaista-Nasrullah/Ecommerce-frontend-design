// src/Components/HeroSection/HeroSection.jsx

import React, { useContext } from "react";
import { Container, Col, Carousel, Spinner, Alert } from "react-bootstrap";
import "./HeroSection.css";
import { AppContext } from "../context/AppContext";

const HeroSection = () => {
  // This component now ONLY cares about the banner.
  const {
    firstBanner,
    loading: appGlobalLoading,
    error: appGlobalError,
  } = useContext(AppContext);

  // Loading and Error states are still relevant for the banner itself.
  if (appGlobalLoading) {
    return (
      <Container
        fluid
        className="HeroSection-container d-flex justify-content-center align-items-center"
        style={{ height: "300px" }}
      >
        <Spinner animation="border" />
      </Container>
    );
  }

  if (appGlobalError) {
    return (
      <Container
        fluid
        className="HeroSection-container"
        style={{ height: "300px" }}
      >
        <Alert variant="danger">Error: {appGlobalError?.message}</Alert>
      </Container>
    );
  }

  return (
    // The Container and Row are removed because the layout is now handled by App.js
    // This component now returns just the Carousel column.
    <Col xs={12} className="p-0">
      <Carousel className="carousel">
        {firstBanner && firstBanner.length > 0 ? (
          firstBanner.map((banner) => (
            <Carousel.Item key={banner.id}>
              <a
                href={banner.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="d-block w-100"
                  src={banner.image}
                  alt={`Banner ${banner.id}`}
                />
              </a>
            </Carousel.Item>
          ))
        ) : (
          <Carousel.Item>
            <img
              className="d-block w-100 carousel-image"
              src="https://via.placeholder.com/900x400?text=Welcome"
              alt="Welcome"
            />
          </Carousel.Item>
        )}
      </Carousel>
    </Col>
  );
};

export default HeroSection;
