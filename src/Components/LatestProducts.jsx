import React, { useContext } from "react";
import "./LatestProducts.css";
import { AppContext } from "../context/AppContext";
// Removed sectionImage import as it will be replaced
// import sectionImage from "../Components/Assets/sectionWithOneImage.png";
import sectionImageOne from "../Components/Assets/sectionWithTwoImages1.png";
import sectionImageTwo from "../Components/Assets/sectionWithTwoImages2.png";

// Assuming you have an image for the deal of the month, let's import it:
import dealOfTheMonthImage from "../Components/Assets/DealOfTheDay.png"; // Make sure to replace this with your actual image path

const LatestProducts = () => {
  const { latests, loading, error, secondBanner } = useContext(AppContext); // Destructure secondBanner

  if (loading) {
    return (
      <div className="categories-section-container">Loading categories...</div>
    );
  }

  if (error) {
    return (
      <div className="categories-section-container">
        Error loading categories: {error.message}
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

  // Deal of the Month data
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
              src={banner.image} // Assuming feature_image holds the URL
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
            <a href="#" className="LatestProducts-viewAll">
              View All <span className="LatestProducts-arrow">&gt;</span>
            </a>
          </div>

          <div className="LatestProducts-grid">
            {latests.map((product, index) => (
              <div className="LatestProducts-card" key={index}>
                <div className="LatestProducts-image-container">
                  <img
                    src={product.feature_image}
                    alt={product.name}
                    className="LatestProducts-image"
                  />
                </div>
                <h3 className="LatestProducts-productName">{product.name}</h3>
                <p className="LatestProducts-productPrice">{product.price}</p>
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
