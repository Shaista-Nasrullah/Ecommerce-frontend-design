import React from "react";
import "./LatestProducts.css";

import LatestProduct1 from "../Components/Assets/latestProduct1.png";
import LatestProduct2 from "../Components/Assets/latestProduct2.png";
import LatestProduct3 from "../Components/Assets/latestProduct3.png";
import LatestProduct4 from "../Components/Assets/latestProduct4.png";
import LatestProduct5 from "../Components/Assets/latestProduct5.png";
import LatestProduct6 from "../Components/Assets/latestProduct6.png";
import LatestProduct7 from "../Components/Assets/latestProduct7.png";
import LatestProduct8 from "../Components/Assets/latestProduct8.png";
import sectionImage from "../Components/Assets/sectionWithOneImage.png";
import sectionImageOne from "../Components/Assets/sectionWithTwoImages1.png";
import sectionImageTwo from "../Components/Assets/sectionWithTwoImages2.png";

// Assuming you have an image for the deal of the month, let's import it:
import dealOfTheMonthImage from "../Components/Assets/DealOfTheDay.png"; // Make sure to replace this with your actual image path

const LatestProducts = () => {
  const products = [
    {
      name: "Edelbrock Cylinder Head",
      price: "$900.00",
      image: LatestProduct1,
    },
    {
      name: "Combo Trailer Light Set",
      price: "$35.00",
      image: LatestProduct2,
    },
    {
      name: "Waterproof Seat Protector",
      price: "$25.00",
      image: LatestProduct3,
    },
    {
      name: "HP BOSS CRATE ENGINE",
      price: "$2,600.00",
      image: LatestProduct4,
    },
    {
      name: "Car Interior LED Lights",
      price: "$30.00",
      image: LatestProduct5,
    },
    {
      name: "Lug White Spoke Wheel",
      price: "$80.00",
      image: LatestProduct6,
    },
    {
      name: "Storage Large Tool Box",
      price: "$60.00",
      image: LatestProduct7,
    },
    {
      name: "Daily Maintenance Hardware",
      price: "$50.00",
      image: LatestProduct8,
    },
  ];

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
      {/* Moved the section-image inside the containerOfDeal or removed if it's not part of the two-column layout */}
      {/* If sectionImage is supposed to be a full-width banner above everything, keep it here */}
      <div>
        <img src={sectionImage} alt="SectionOne" className="section-image" />
      </div>

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
            {products.map((product, index) => (
              <div className="LatestProducts-card" key={index}>
                <div className="LatestProducts-image-container">
                  <img
                    src={product.image}
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

      {/* Moved the single section-image here if it's meant to be below the main two-column layout */}
      {/* <div>
        <img src={sectionImage} alt="SectionOne" className="section-image" />
      </div> */}

      <div className="sectionWithTwoImages">
        <img
          src={sectionImageOne}
          alt="SectionOne"
          className="section-image-two" // Changed to section-image-two for consistency, ensure CSS is updated
        />
        <img
          src={sectionImageTwo}
          alt="SectionTwo"
          className="section-image-two" // Changed to section-image-two
        />
      </div>
    </section>
  );
};

export default LatestProducts;
