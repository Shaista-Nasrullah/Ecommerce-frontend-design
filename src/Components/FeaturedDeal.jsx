import React, { useContext } from "react";
import "./FeaturedDeal.css";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const FeaturedDeal = () => {
  const { flushDeals, loading, error } = useContext(AppContext); // Removed flushDeals

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

  if (flushDeals.length === 0) {
    // Modified condition
    return <div className="brands-section-container">No products found.</div>;
  }

  // Removed Handler for "View All" Flash Deals

  // NEW: Handler for "View All" Featured Products
  const handleViewAllFeaturedProducts = () => {
    navigate("/shop?section=featured-products");
  };
  return (
    <div className="fd-container">
      <div className="fd-header">
        <div className="fd-title">
          <h2>Flush Deals</h2>
        </div>
        <a href="#" className="fd-view-all">
          View All <span className="fd-arrow">&gt;</span>
        </a>
      </div>
      <div className="fd-product-grid">
        {flushDeals.map((product) => (
          <div
            key={product.id}
            className="fd-product-card"
            onClick={() => handleProductClick(product.id)}
          >
            {/* <div className="fd-discount-tag">{product.discount}</div> */}
            <div className="fd-product-card-content">
              <div className="fd-product-image-wrapper">
                <img
                  src={product.feature_image}
                  alt={product.name}
                  className="fd-product-image"
                />
              </div>
              <div className="fd-product-info">
                <h3 className="fd-product-name">{product.name}</h3>
                <div className="fd-price-details">
                  {/* <span className="fd-original-price">PKR. 1000</span> */}
                  {product.variations && product.variations.length > 0
                    ? `PKR ${parseFloat(
                        product.variations[0].default_sell_price
                      ).toFixed(2)}`
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedDeal;
