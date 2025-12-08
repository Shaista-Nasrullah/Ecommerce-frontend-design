import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import "./NewComponent.css"; // New CSS file for this component
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const ProductDisplay = () => {
  const { featured, loading, error } = useContext(AppContext);

  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleViewAllClick = () => {
    navigate("/shop?section=featured-products"); // Navigate to a specific section for featured products
  };

  if (loading) {
    return (
      <div className="product-showcase-message">
        Loading featured products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-showcase-message product-showcase-error">
        Error loading featured products: {error.message}
        <p>Please check your network connection and API endpoint.</p>
      </div>
    );
  }

  if (featured.length === 0) {
    return (
      <div className="product-showcase-message">
        No featured products found.
      </div>
    );
  }

  return (
    <div className="product-showcase-wrapper my-4">
      <div className="product-showcase-header mt-5">
        <p className="product-showcase-title">Featured Products</p>
        <Button
          variant="link"
          className="product-showcase-view-all-button"
          onClick={handleViewAllClick}
        >
          View All
        </Button>
      </div>

      <div className="product-showcase-scroll-container">
        <div className="product-showcase-grid">
          {featured.map((product) => (
            <div
              key={product.id}
              className="product-showcase-card"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="product-showcase-image-wrapper">
                <img
                  src={product.feature_image}
                  alt={product.name}
                  className="product-showcase-image"
                />
              </div>
              <div className="product-showcase-info">
                <p className="product-showcase-name">{product.name}</p>
                <p className="product-showcase-price">
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
