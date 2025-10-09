// LatestProducts.js
import React, { useContext } from "react";
import "./LatestProducts.css";
import { AppContext } from "../context/AppContext";
import sectionImageOne from "../Components/Assets/sectionWithTwoImages1.png";
import sectionImageTwo from "../Components/Assets/sectionWithTwoImages2.png";
import dealOfTheMonthImage from "../Components/Assets/DealOfTheDay.png";
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

  // NEW: Handler for "View All" Latest Products
  const handleViewAllLatestProducts = () => {
    navigate("/shop?section=latest-products");
  };

  // Deal of the Month data (static for now)
  const dealProduct = {
    name: "Exquisite 18K White Gold Diamond Necklace Set",
    originalPrice: "$2,400.00",
    dealPrice: "$1,680.00",
    discount: "-30%",
    image: dealOfTheMonthImage, // Use the imported deal image
  };

  return (
    <section className="LatestProducts-section">
      {/* New section for horizontally scrollable secondBanner images */}
      {secondBanner.length > 0 && (
        <div className="second-banner-scroll-container">
          {secondBanner.map((banner, index) => (
            <img
              key={index}
              src={banner.image} // Assuming 'image' holds the URL for banners
              alt={`Banner ${index + 1}`}
              className="second-banner-image"
            />
          ))}
        </div>
      )}

      <div className="containerOfDeal">
        {/* Deal of the Month Section */}
        <div className="deal-of-the-month-card">
          <div className="deal-header">
            <h2 className="deal-title">DEAL OF THE DAY</h2>
          </div>
          <div className="deal-content">
            {/* <span className="deal-discount">{dealProduct.discount}</span> */}
            <div className="deal-image-wrapper">
              <img
                src={dealProduct.image}
                alt={dealProduct.name}
                className="deal-image"
              />
            </div>
            <h3 className="deal-product-name">{dealProduct.name}</h3>
            <div className="deal-prices">
              <p className="deal-original-price">{dealProduct.originalPrice}</p>
              <p className="deal-current-price">{dealProduct.dealPrice}</p>
            </div>
            <button className="deal-button">Grab This Deal</button>
          </div>
        </div>

        {/* Latest Products Section */}
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

      <div className="sectionWithTwoImages">
        <img
          src={sectionImageOne}
          alt="SectionOne"
          className="section-image-two"
        />
        <img
          src={sectionImageTwo}
          alt="SectionTwo"
          className="section-image-two"
        />
      </div>
    </section>
  );
};

export default LatestProducts;
