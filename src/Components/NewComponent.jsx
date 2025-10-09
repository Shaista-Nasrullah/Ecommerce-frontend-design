import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import "./NewComponent.css";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const ProductDisplay = () => {
  const { featured, loading, error } = useContext(AppContext); // Removed flushDeals

  const navigate = useNavigate();
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
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

  if (featured.length === 0) {
    // Modified condition
    return <div className="brands-section-container">No products found.</div>;
  }

  // Removed Handler for "View All" Flash Deals

  // NEW: Handler for "View All" Featured Products
  const handleViewAllFeaturedProducts = () => {
    navigate("/shop?section=featured-products");
  };

  return (
    <div className="my-4 product-display-container">
      <div className="product-display-section-title mt-5">
        <p>Featured products</p>
        <Button
          variant="link"
          className="product-display-view-all-button"
          onClick={handleViewAllFeaturedProducts}
        >
          View All
        </Button>
      </div>

      <div className="product-display-featured-products-scroll-container">
        <div className="product-display-featured-products-scroll-content">
          {featured.map((product) => (
            <div
              key={product.id}
              className="product-display-product-card-row2"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="product-display-product-image-wrapper">
                <img src={product.feature_image} alt={product.name} />
              </div>
              <div className="product-display-product-info">
                <p>{product.name}</p>
                <p>
                  {" "}
                  {product.variations && product.variations.length > 0
                    ? `PKR ${parseFloat(
                        product.variations[0].default_sell_price
                      ).toFixed(2)}`
                    : "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
