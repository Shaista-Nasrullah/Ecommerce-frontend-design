// LatestProducts.js
import React, { useContext } from "react";
import "./LatestProducts.css";
import { AppContext } from "../context/AppContext";
import sectionImageOne from "../Components/Assets/sectionWithTwoImages1.png";
import sectionImageTwo from "../Components/Assets/sectionWithTwoImages2.png";
// import dealOfTheMonthImage from "../Components/Assets/DealOfTheDay.png";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const LatestProducts = () => {
  const { latests, loading, error, secondBanner } = useContext(AppContext);
  const navigate = useNavigate();

  // NEW: Click handler for individual products
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="categories-section-container">Loading products...</div> // Changed text
    );
  }

  if (error) {
    return (
      <div className="categories-section-container">
        Error loading products: {error.message} {/* Changed text */}
        <p>Please check your network connection and API endpoint.</p>
        <p>
          If you see a CORS error in the console, your API needs to be
          configured to allow requests from your frontend's origin.
        </p>
      </div>
    );
  }

  // Check homePageCategories length (adjusting for latests as it's the primary product list here)
  if (latests.length === 0 && secondBanner.length === 0) {
    // Also check secondBanner
    return (
      <div className="categories-section-container">No content found.</div>
    );
  }

  const handleViewAllLatestProducts = () => {
    navigate("/shop?section=latest-products");
  };

  return (
    <section className="LatestProducts-section">
      {/* New section for horizontally scrollable secondBanner images */}
      {secondBanner.length > 0 && secondBanner[0] && (
        <div className="second-banner-scroll-container">
          {secondBanner.map((banner, index) => (
            <img
              key={index}
              src={banner.image}
              alt={`Banner ${index + 1}`}
              className="second-banner-image"
            />
          ))}
        </div>
      )}

      <div className="containerOfDeal">
        <div className="latest-products-main-content">
          <div className="LatestProducts-header">
            <h2 className="LatestProducts-title">Latest products</h2>
            <Button
              variant="link"
              className="product-display-view-all-button"
              onClick={handleViewAllLatestProducts}
            >
              View All
            </Button>
          </div>

          <div className="LatestProducts-grid">
            {latests.map((product) => (
              <div
                className="LatestProducts-card"
                key={product.id}
                onClick={() => handleProductClick(product.id)}
              >
                <div className="LatestProducts-image-container">
                  <img
                    src={product.feature_image}
                    alt={product.name}
                    className="LatestProducts-image"
                  />
                </div>
                <h3 className="LatestProducts-productName">{product.name}</h3>
                <p className="LatestProducts-productPrice">
                  {/* Correctly extract and display price */}
                  {product.variations && product.variations.length > 0
                    ? `PKR ${parseFloat(
                        product.variations[0].default_sell_price
                      ).toFixed(2)}`
                    : "N/A"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two images after latest products */}
      {secondBanner.length > 2 && (
        <div className="sectionWithTwoImages">
          {/* Second Banner Image */}
          {secondBanner[1] &&
            (secondBanner[1].url ? (
              <a
                href={secondBanner[1].url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={secondBanner[1].image}
                  alt="Promotional Banner 2"
                  className="section-image-two" // Kept original class name
                />
              </a>
            ) : (
              <img
                src={secondBanner[1].image}
                alt="Promotional Banner 2"
                className="section-image-two" // Kept original class name
              />
            ))}
          {/* Third Banner Image */}
          {secondBanner[2] &&
            (secondBanner[2].url ? (
              <a
                href={secondBanner[2].url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={secondBanner[2].image}
                  alt="Promotional Banner 3"
                  className="section-image-two" // Kept original class name
                />
              </a>
            ) : (
              <img
                src={secondBanner[2].image}
                alt="Promotional Banner 3"
                className="section-image-two" // Kept original class name
              />
            ))}
        </div>
      )}
    </section>
  );
};

export default LatestProducts;
